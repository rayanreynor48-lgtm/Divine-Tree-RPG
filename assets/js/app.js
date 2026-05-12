// Character data
const characters = [
    {
        id: 1,
        name: '茓ノ影 I',
        title: 'Sombra de Espinas I',
        image: 'assets/ui/character-base.jpg',
        emoji: '🥷',
        stats: {
            ps: 4677,
            atq: 702,
            def: 117,
            agl: 450
        },
        description: 'Cultivador de las sombras'
    },
    {
        id: 2,
        name: '焱心剑 II',
        title: 'Espada de Fuego II',
        emoji: '🔥',
        stats: {
            ps: 5200,
            atq: 850,
            def: 300,
            agl: 600
        },
        description: 'Maestro del fuego'
    },
    {
        id: 3,
        name: '冰灵剑 III',
        title: 'Espada de Hielo III',
        emoji: '❄️',
        stats: {
            ps: 4800,
            atq: 920,
            def: 200,
            agl: 750
        },
        description: 'Guardián del frío'
    }
];

const quotes = [
    'La paciencia es la virtud del cultivo.',
    'El camino del cultivador es eterno.',
    'Cada paso nos acerca a la iluminación.',
    'La perseverancia vence todos los obstáculos.',
    'En el silencio reside la verdadera fuerza.'
];

let currentCharacter = 0;
let cultivationProgress = 6;

// Initialize
function init() {
    // Cargar juego si existe
    const savedGame = loadGame();
    
    if (savedGame) {
        // Calcular ganancias offline
        const gains = applyOfflineGains();
        if (gains.coins > 0) {
            showNotification(`Ganaste ${formatNumber(gains.coins)} monedas offline!`);
        }
    } else {
        // Primer inicio
        updateCharacterCard();
        updateStats();
        randomizeQuote();
    }
}

// Pantalla y navegación
function goToScreen(screenClass) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelector(screenClass).classList.add('active');
}

function switchScreen(screenName) {
    stopIdleSystem(); // Parar idle antes de cambiar
    
    switch(screenName) {
        case 'hub':
            goToScreen('.hub-screen');
            startIdleSystem(); // Reiniciar idle
            updateHubDisplay();
            break;
        case 'battle':
            showNotification('Pantalla de Batalla - Próximamente');
            switchScreen('hub');
            break;
        case 'dungeon':
            showNotification('Pantalla de Dungeon - Próximamente');
            switchScreen('hub');
            break;
        case 'inventory':
            showNotification('Pantalla de Inventario - Próximamente');
            switchScreen('hub');
            break;
        case 'settings':
            showNotification('Pantalla de Ajustes - Próximamente');
            switchScreen('hub');
            break;
    }
}

function goToCharacterSelect() {
    goToScreen('.character-screen');
    updateCharacterCard();
}

function goToDetails() {
    goToScreen('.details-screen');
    updateStats();
}

function startCultivation() {
    goToScreen('.cultivation-screen');
    simulateCultivation();
}

// Character carousel
function updateCharacterCard() {
    const char = characters[currentCharacter];
    const card = document.getElementById('characterCard');
    
    let imageContent = '';
    if (char.image) {
        imageContent = `<img src="${char.image}" alt="${char.name}">`;
    } else {
        imageContent = char.emoji;
    }
    
    card.innerHTML = `
        <div class="character-image">${imageContent}</div>
        <div class="character-name">${char.name}</div>
        <div class="character-desc">${char.title}</div>
    `;

    document.getElementById('counter').textContent = `${currentCharacter + 1} / ${characters.length}`;
    document.getElementById('prevBtn').disabled = currentCharacter === 0;
    document.getElementById('nextBtn').disabled = currentCharacter === characters.length - 1;

    updateDetailsScreen();
}

function prevCharacter() {
    if (currentCharacter > 0) {
        currentCharacter--;
        updateCharacterCard();
    }
}

function nextCharacter() {
    if (currentCharacter < characters.length - 1) {
        currentCharacter++;
        updateCharacterCard();
    }
}

// Details screen
function updateDetailsScreen() {
    const char = characters[currentCharacter];
    const detailsImage = document.getElementById('detailsImage');
    
    if (char.image) {
        detailsImage.innerHTML = `<img src="${char.image}" alt="${char.name}">`;
    } else {
        detailsImage.textContent = char.emoji;
    }
    
    document.getElementById('detailsName').textContent = char.name;
    document.getElementById('detailsSubtitle').textContent = char.title;
}

function updateStats() {
    const char = characters[currentCharacter];
    const container = document.getElementById('statsContainer');
    const maxStats = {
        ps: 6000,
        atq: 1000,
        def: 500,
        agl: 900
    };

    container.innerHTML = `
        <div class="stat-row">
            <div class="stat-label">PS</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(char.stats.ps / maxStats.ps) * 100}%"></div>
            </div>
            <div class="stat-value">${char.stats.ps}</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Atq</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(char.stats.atq / maxStats.atq) * 100}%"></div>
            </div>
            <div class="stat-value">${char.stats.atq}</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Def</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(char.stats.def / maxStats.def) * 100}%"></div>
            </div>
            <div class="stat-value">${char.stats.def}</div>
        </div>
        <div class="stat-row">
            <div class="stat-label">Agl</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(char.stats.agl / maxStats.agl) * 100}%"></div>
            </div>
            <div class="stat-value">${char.stats.agl}</div>
        </div>
    `;
}

// Cultivation simulation
function simulateCultivation() {
    const fill = document.getElementById('cultivationFill');
    const text = document.getElementById('progressText');
    let progress = cultivationProgress;

    const interval = setInterval(() => {
        progress += Math.random() * 0.5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                // Inicializar juego con personaje elegido
                initializeWithCharacter(currentCharacter);
                startIdleSystem();
                startAutoSave();
                switchScreen('hub');
            }, 1000);
            return;
        }

        fill.style.width = progress + '%';
        text.textContent = Math.floor(progress) + '%';
    }, 100);
}

function randomizeQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = quote;
}

// HUB Display
function updateHubDisplay() {
    const char = characters[gameState.currentCharacter];
    
    // Actualizar nombre y realm
    const charName = document.getElementById('hubCharName');
    if (charName) {
        charName.textContent = gameState.playerName;
    }
    
    const realmEl = document.getElementById('hubRealm');
    if (realmEl) {
        realmEl.textContent = `Realm: ${gameState.realm} | Nivel: ${gameState.level}`;
    }
    
    // Actualizar stats mini
    const maxStats = 1000;
    document.getElementById('ps-mini').style.width = (gameState.hp / gameState.maxHp * 100) + '%';
    document.getElementById('atq-mini').style.width = (gameState.attack / maxStats * 100) + '%';
    document.getElementById('def-mini').style.width = (gameState.defense / maxStats * 100) + '%';
    
    // Power breakdown
    const power = calculatePowerScore();
    const breakdown = document.getElementById('powerBreakdown');
    if (breakdown) {
        breakdown.innerHTML = `
            <div style="font-size: 0.7rem; color: #00d4d4; margin-top: 5px;">
                ATQ: ${Math.floor(gameState.attack)} | DEF: ${Math.floor(gameState.defense)} | AGI: ${Math.floor(gameState.agility)}
            </div>
        `;
    }
    
    updateIdleUI();
}

// Notificaciones
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Manejador de tabs de navegación
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Guardar antes de cerrar
    window.addEventListener('beforeunload', () => {
        stopIdleSystem();
    });
    
    // Volver a cargar ganancias cuando vuelve el foco
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const gains = applyOfflineGains();
            if (gains.coins > 0) {
                showNotification(`Ganaste ${formatNumber(gains.coins)} monedas!`);
                updateIdleUI();
            }
        }
    });
});
