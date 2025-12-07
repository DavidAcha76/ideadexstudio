using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using OfficeOpenXml;
using IdeaDex.Data;
using CookieSameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using CompressionLevel = System.IO.Compression.CompressionLevel;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

builder.Services.AddRazorPages();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login";
        options.LogoutPath = "/Logout";
        options.AccessDeniedPath = "/AccessDenied";

        options.Cookie.Name = "IdeaDexAuth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = CookieSameSiteMode.Lax;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;

        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
});

builder.Services.AddDistributedSqlServerCache(options =>
{
    options.ConnectionString = connectionString;
    options.SchemaName = "dbo";
    options.TableName = "SessionCache";
});

builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".IdeaDex.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = CookieSameSiteMode.Lax;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

var app = builder.Build();

app.UseResponseCompression();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        const int durationInSeconds = 60 * 60 * 24 * 365;
        var path = ctx.Context.Request.Path.Value ?? string.Empty;
        var fileName = ctx.File.Name;

        if (fileName.EndsWith(".css", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".svg", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".gif", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".woff", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".woff2", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".ttf", StringComparison.OrdinalIgnoreCase) ||
            fileName.EndsWith(".eot", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                $"public,max-age={durationInSeconds},immutable";
        }

        if (fileName.EndsWith(".webmanifest", StringComparison.OrdinalIgnoreCase) ||
            fileName.Equals("manifest.json", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.ContentType = "application/manifest+json";
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                "no-cache, no-store, must-revalidate";
            ctx.Context.Response.Headers["Pragma"] = "no-cache";
            ctx.Context.Response.Headers["Expires"] = "0";
        }

        if (fileName.Equals("service-worker.js", StringComparison.OrdinalIgnoreCase) ||
            path.Contains("service-worker", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.ContentType = "application/javascript; charset=utf-8";
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                "no-cache, no-store, must-revalidate";
            ctx.Context.Response.Headers["Pragma"] = "no-cache";
            ctx.Context.Response.Headers["Expires"] = "0";
            ctx.Context.Response.Headers["Service-Worker-Allowed"] = "/";
        }

        if (fileName.Equals("offline.html", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                "public, max-age=604800";
        }

        if (!ctx.Context.Response.Headers.ContainsKey("X-Content-Type-Options"))
            ctx.Context.Response.Headers["X-Content-Type-Options"] = "nosniff";

        if (!ctx.Context.Response.Headers.ContainsKey("X-Frame-Options"))
            ctx.Context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
    }
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapRazorPages();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    env = app.Environment.EnvironmentName,
    timestamp = DateTime.UtcNow,
    app = "IdeaDex"
}))
.WithName("HealthCheck")
.AllowAnonymous();

app.Run();
