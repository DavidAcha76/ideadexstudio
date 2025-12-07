// ==================== IDEADEX STUDIO - SISTEMA HOLOGRÁFICO ==================== //
class IdeaDexSystem {
    constructor() {
        this.currentView = 'gamedex';
        this.selectedEntryIndex = 0;
        this.gamesSeen = 2;
        this.gamesOwned = 2;
        this.init();
    }

    init() {
        this.updateStats();
        this.playBootSequence();
        this.setupKeyboardShortcuts();
        this.logWelcome();
    }

    logWelcome() {
        console.log('%c🎮 IDEADEX STUDIO v1.0', 
            'color: #00d4ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
        console.log('%cHolographic Interface Loaded', 
            'color: #a855f7; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 
            'color: #00d4ff;');
    }

    playBootSequence() {
        const screen = document.getElementById('main-screen');
        if (screen) {
            screen.style.opacity = '0';
            setTimeout(() => {
                screen.style.transition = 'opacity 1s ease';
                screen.style.opacity = '1';
                this.playSound('boot');
            }, 300);
        }
    }

    updateStats() {
        const seenEl = document.getElementById('games-seen');
        const ownedEl = document.getElementById('games-owned');

        if (seenEl) seenEl.textContent = this.gamesSeen;
        if (ownedEl) ownedEl.textContent = this.gamesOwned;
    }

    playSound(type) {
        const sounds = {
            boot: '🔊 *SYSTEM ONLINE* - Interface Activated',
            select: '🔊 *BEEP* - Selection Confirmed',
            move: '🔊 *BIP* - Navigation',
            back: '🔊 *BOOP* - Return',
            error: '🔊 *ACCESS DENIED* - Locked Content'
        };
        console.log(sounds[type] || sounds.select);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.recruitment-page')) {
                this.handleKeyPress(e);
            }
        });
    }

    handleKeyPress(e) {
        const keyActions = {
            'ArrowUp': () => { e.preventDefault(); navigate('up'); },
            'ArrowDown': () => { e.preventDefault(); navigate('down'); },
            'Enter': () => { e.preventDefault(); actionButton('A'); },
            'a': () => { e.preventDefault(); actionButton('A'); },
            'A': () => { e.preventDefault(); actionButton('A'); },
            'Escape': () => { e.preventDefault(); actionButton('B'); },
            'b': () => { e.preventDefault(); actionButton('B'); },
            'B': () => { e.preventDefault(); actionButton('B'); },
            '1': () => showView('gamedex'),
            '2': () => showView('about'),
            '3': () => showView('team'),
            '4': () => showView('join'),
            '5': () => showView('request')
        };

        const action = keyActions[e.key];
        if (action) action();
    }
}

// ==================== BASE DE DATOS DE JUEGOS ==================== //
const gamesDatabase = {
    '001': {
        id: '001',
        name: 'CYBER NEXUS',
        type: ['RPG', 'ACTION'],
        sprite: '🌃',
        spriteClass: 'cyber',
        description: 'A futuristic cyberpunk RPG where you hack your way through a dystopian megacity. Tactical turn-based combat fused with real-time hacking mechanics.',
        features: [
            'Advanced hacking system with mini-games',
            'Strategic turn-based tactical combat',
            '50+ hours of branching main story',
            'Multiple endings based on your choices',
            'Explorable open world city',
            'Deep character customization'
        ],
        status: 'RELEASED',
        year: '2024',
        platform: 'PC / CONSOLE',
        players: '1 PLAYER',
        links: {
            steam: 'https://store.steampowered.com/app/000001/CYBER_NEXUS/',
            itch: 'https://ideadex.itch.io/cyber-nexus',
            youtube: 'https://www.youtube.com/watch?v=cybernexus'
        }
    },
    '002': {
        id: '002',
        name: 'SHADOW REALM',
        type: ['HORROR', 'ADVENTURE'],
        sprite: '👻',
        spriteClass: 'shadow',
        description: 'Psychological horror in first-person. Explore an abandoned mansion where reality constantly distorts. No direct combat, only survival and complex puzzle-solving.',
        features: [
            'Immersive psychological horror atmosphere',
            'Complex and unique environmental puzzles',
            'Dynamic sanity system affecting gameplay',
            'Multiple intertwined realities',
            'Immersive 3D binaural audio',
            'Non-linear story with secret endings'
        ],
        status: 'RELEASED',
        year: '2023',
        platform: 'PC / VR',
        players: '1 PLAYER',
        links: {
            steam: 'https://store.steampowered.com/app/000002/SHADOW_REALM/',
            itch: 'https://ideadex.itch.io/shadow-realm',
            youtube: 'https://www.youtube.com/watch?v=shadowrealm'
        }
    },
    '003': {
        id: '003',
        name: 'CLASSIFIED',
        type: ['UNKNOWN'],
        sprite: '❓',
        spriteClass: 'locked',
        description: '██████ ENCRYPTED DATA ██████\n\nThis game is in active development. Information classified until official launch. Stay tuned for our announcements.',
        features: [
            '███ CLASSIFIED INFORMATION ███',
            'GENRE: [REDACTED]',
            'RELEASE: Q2 2025',
            'PLATFORM: [PENDING]',
            'STATUS: ACTIVE DEVELOPMENT',
            '⚠️ DETAILS AVAILABLE SOON'
        ],
        status: 'IN DEVELOPMENT',
        year: '2025',
        platform: 'TBA',
        players: 'TBA'
    },
    '004': {
        id: '004',
        name: 'TOP SECRET',
        type: ['UNKNOWN'],
        sprite: '❓',
        spriteClass: 'locked',
        description: '██████ SECRET PROJECT ██████\n\nHighly confidential information. This project is in concept phase.',
        features: [
            '███ CONFIDENTIAL PROJECT ███',
            'CONCEPT: [CLASSIFIED]',
            'DATE: [INDEFINITE]',
            'GENRE: [SECRET]',
            'STATUS: INITIAL PHASE',
            '🔒 RESTRICTED ACCESS'
        ],
        status: 'CONCEPT',
        year: '???',
        platform: '???',
        players: '???'
    }
};

// ==================== NAVEGACIÓN ==================== //
function showView(viewName) {
    document.querySelectorAll('.screen-view').forEach(view => {
        view.classList.remove('active');
    });

    const viewMap = {
        'gamedex': 'gamedex-view',
        'about': 'about-view',
        'team': 'team-view',
        'join': 'join-view',
        'request': 'request-view'
    };

    const targetId = viewMap[viewName];
    const targetView = document.getElementById(targetId);

    if (targetView) {
        targetView.classList.add('active');
        window.ideaDex.playSound('select');

        if (viewName === 'gamedex') {
            resetEntrySelection();
        }
    }
}

function resetEntrySelection() {
    const entries = document.querySelectorAll('.game-card');
    entries.forEach(e => e.classList.remove('selected'));
    if (entries.length > 0) {
        entries[0].classList.add('selected');
        window.ideaDex.selectedEntryIndex = 0;
    }
}

// ==================== DETALLE DE JUEGOS ==================== //
function showGameDetail(gameId) {
    const game = gamesDatabase[gameId];
    if (!game) return;

    if (game.status === 'IN DEVELOPMENT' || game.status === 'CONCEPT') {
        window.ideaDex.playSound('error');
        console.log('⚠️ This game is not yet available');
    } else {
        window.ideaDex.playSound('select');
    }

    const detailView = document.getElementById('detail-view');
    const detailContainer = document.getElementById('detail-container');

    let html = `
        <button class="detail-back-btn" onclick="showView('gamedex')">
            ◄ BACK
        </button>
        <div class="detail-sprite-large">
            <div class="sprite-glow"></div>
            <div class="sprite-icon">${game.sprite}</div>
        </div>
        <div class="detail-name">${game.name}</div>
    `;

    html += `
        <div class="detail-section">
            <div class="detail-label">DESCRIPTION</div>
            <p class="detail-text">${game.description}</p>
        </div>
    `;

    if (game.features && game.features.length > 0) {
        html += `
            <div class="detail-section">
                <div class="detail-label">FEATURES</div>
                <div class="detail-features">
                    ${game.features.map(f => `<div class="feature-item">${f}</div>`).join('')}
                </div>
            </div>
        `;
    }


    const links = game.links || {};
    const hasAnyLink = ['steam', 'itch', 'youtube'].some(key => links[key]);

    if (hasAnyLink) {
        html += `
        <div class="detail-section">
            <div class="detail-label">LINKS</div>
            <div class="detail-links">
                ${links.steam ? `<a class="detail-link link-steam" href="${links.steam}" target="_blank" rel="noopener noreferrer">
                    <span class="link-icon">🎮</span>
                    <span class="link-text">Steam</span>
                </a>` : ''}
                ${links.itch ? `<a class="detail-link link-itch" href="${links.itch}" target="_blank" rel="noopener noreferrer">
                    <span class="link-icon">⬡</span>
                    <span class="link-text">itch.io</span>
                </a>` : ''}
                ${links.youtube ? `<a class="detail-link link-youtube" href="${links.youtube}" target="_blank" rel="noopener noreferrer">
                    <span class="link-icon">▶</span>
                    <span class="link-text">YouTube</span>
                </a>` : ''}
            </div>
        </div>
        `;
    }

    html += `
        <div class="detail-stats">
            <div class="stat-box">
                <span class="stat-value">${game.status}</span>
                <span class="stat-label">STATUS</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${game.year}</span>
                <span class="stat-label">YEAR</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${game.platform}</span>
                <span class="stat-label">PLATFORM</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${game.players}</span>
                <span class="stat-label">PLAYERS</span>
            </div>
        </div>
    `;

    detailContainer.innerHTML = html;

    document.querySelectorAll('.screen-view').forEach(v => v.classList.remove('active'));
    detailView.classList.add('active');
}

// ==================== NAVEGACIÓN CON TECLADO ==================== //
function navigate(direction) {
    const currentView = document.querySelector('.screen-view.active');

    if (currentView.id !== 'gamedex-view') return;

    const entries = Array.from(document.querySelectorAll('.game-card'));
    if (entries.length === 0) return;

    let currentIndex = window.ideaDex.selectedEntryIndex;

    entries.forEach(e => e.classList.remove('selected'));

    if (direction === 'up' && currentIndex > 0) {
        currentIndex--;
        window.ideaDex.playSound('move');
    } else if (direction === 'down' && currentIndex < entries.length - 1) {
        currentIndex++;
        window.ideaDex.playSound('move');
    }

    window.ideaDex.selectedEntryIndex = currentIndex;
    entries[currentIndex].classList.add('selected');
    entries[currentIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// ==================== BOTONES DE ACCIÓN ==================== //
function actionButton(button) {
    const currentView = document.querySelector('.screen-view.active');

    if (button === 'A') {
        if (currentView.id === 'gamedex-view') {
            const entries = document.querySelectorAll('.game-card');
            const selectedEntry = entries[window.ideaDex.selectedEntryIndex];

            if (selectedEntry) {
                const gameId = selectedEntry.dataset.id;
                showGameDetail(gameId);
            }
        }
    } else if (button === 'B') {
        if (currentView.id !== 'gamedex-view') {
            showView('gamedex');
            window.ideaDex.playSound('back');
        }
    }
}

// ==================== RECRUITMENT PAGE ==================== //
let selectedPosition = null;

function selectPosition(positionId) {
    selectedPosition = positionId;

    document.getElementById('positions-list').style.display = 'none';
    const form = document.getElementById('application-form');
    form.style.display = 'block';

    const positionNames = {
        'programmer': 'GAMEPLAY PROGRAMMER',
        'artist': '3D ARTIST',
        'designer': 'GAME DESIGNER',
        'sound': 'SOUND DESIGNER',
        'qa': 'QA TESTER',
        'marketing': 'DIGITAL MARKETING'
    };

    document.getElementById('selected-position').textContent = 
        positionNames[positionId] || 'SELECTED POSITION';

    form.scrollIntoView({ behavior: 'smooth' });
    console.log('🔊 *BEEP* - Position selected:', positionNames[positionId]);
}

function cancelApplication() {
    document.getElementById('application-form').style.display = 'none';
    document.getElementById('positions-list').style.display = 'flex';
    document.getElementById('recruit-form').reset();
    selectedPosition = null;
    console.log('🔊 *BOOP* - Form cancelled');
}

function submitApplication(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (data.motivation.length < 100) {
        alert('❌ Motivation must be at least 100 characters.');
        return;
    }

    console.log('📤 Submitting application:', {
        position: selectedPosition,
        applicant: data.name,
        email: data.email
    });

    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';

    setTimeout(() => {
        console.log('✅ Application processed successfully');
    }, 2000);
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    cancelApplication();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ==================== PROJECT REQUEST FORM ==================== //
function submitProjectRequest(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = (formData.get('name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const description = (formData.get('description') || '').trim();

    if (!name || !email || description.length < 80) {
        alert('Please fill in your name, email and a description of at least 80 characters.');
        return;
    }

    console.log('📡 New project request from', name, '(', email, ')');

    const success = document.getElementById('request-success');
    if (success) {
        success.classList.add('visible');
        setTimeout(() => {
            success.classList.remove('visible');
        }, 5000);
    }

    form.reset();
}

// ==================== KONAMI CODE EASTER EGG ==================== //
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateKonamiCode();
        konamiCode = [];
    }
});

function activateKonamiCode() {
    console.log('%c🎮 KONAMI CODE ACTIVATED!', 
        'color: #00d4ff; font-size: 32px; font-weight: bold; text-shadow: 0 0 20px #00d4ff;');

    const body = document.body;
    body.style.animation = 'holoRainbow 3s ease-in-out';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes holoRainbow {
            0%, 100% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
        }
    `;
    document.head.appendChild(style);

    alert('🎮 SECRET CODE ACTIVATED!\n\n' +
          '✨ Developer Mode Enabled\n' +
          '🔓 All games temporarily visible\n\n' +
          'Thanks for exploring IdeaDex Studio!');

    unlockAllGames();

    setTimeout(() => {
        body.style.animation = '';
        style.remove();
    }, 3000);
}

function unlockAllGames() {
    gamesDatabase['003'].name = 'ASTRAL WARS [BETA]';
    gamesDatabase['003'].sprite = '🚀';
    gamesDatabase['003'].description = 'Epic multiplayer space shooter. Frenetic combat in deep space with fully customizable ships and realistic physics.';
    gamesDatabase['003'].features = [
        'Real-time space combat',
        'Customizable ships with unique parts',
        '8vs8 competitive multiplayer',
        'Infinite procedural maps',
        'Clan system and rankings',
        '⚠️ IN BETA - Early access'
    ];

    gamesDatabase['004'].name = 'PROJECT NEXUS [ALPHA]';
    gamesDatabase['004'].sprite = '🌌';
    gamesDatabase['004'].description = 'Next-gen open world RPG. Explore galaxies, conquer planets and write your own intergalactic legend.';

    const entry003 = document.querySelector('[data-id="003"]');
    const entry004 = document.querySelector('[data-id="004"]');

    if (entry003) {
        entry003.classList.remove('locked');
        entry003.querySelector('.game-name').textContent = 'ASTRAL WARS [BETA]';
        entry003.querySelector('.sprite-icon').textContent = '🚀';
        entry003.querySelector('.status-badge').textContent = '⚠️ BETA';
        entry003.querySelector('.status-badge').className = 'status-badge released';
        const lockOverlay = entry003.querySelector('.lock-overlay');
        if (lockOverlay) lockOverlay.remove();
    }

    if (entry004) {
        entry004.classList.remove('locked');
        entry004.querySelector('.game-name').textContent = 'PROJECT NEXUS';
        entry004.querySelector('.sprite-icon').textContent = '🌌';
        const lockOverlay = entry004.querySelector('.lock-overlay');
        if (lockOverlay) lockOverlay.remove();
    }

    window.ideaDex.gamesSeen = 4;
    window.ideaDex.gamesOwned = 2;
    window.ideaDex.updateStats();

    console.log('🔓 All games temporarily unlocked');
}

// ==================== INICIALIZACIÓN ==================== //
document.addEventListener('DOMContentLoaded', () => {
    window.ideaDex = new IdeaDexSystem();

    resetEntrySelection();

    console.log(`
    ╔════════════════════════════════════╗
    ║   IDEADEX STUDIO v1.0             ║
    ║   Holographic Interface           ║
    ╚════════════════════════════════════╝

    🎮 CONTROLS:
    - Arrow Keys: Navigate entries
    - Enter/A: Select game
    - ESC/B: Go back
    - 1-4: Quick view change

    🎯 EASTER EGG:
    Do you know the Konami Code? 😉
    ↑ ↑ ↓ ↓ ← → ← → B A

    💎 Welcome to IdeaDex Studio!
    `);
});

// ==================== UTILIDADES ==================== //
document.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight + 2) + 'px';
    }
});

// Prevenir zoom en móviles
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

console.log('%c💎 IdeaDex Studio', 
    'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cThanks for visiting our holographic gamedex! 🎮', 
    'color: #a855f7; font-size: 14px;');
