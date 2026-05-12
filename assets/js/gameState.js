// Estado global del juego
const gameState = {
    // Jugador actual
    currentCharacter: 0,
    playerName: '',
    realm: 'Mortal',
    level: 1,
    experience: 0,
    
    // Recursos principales
    coins: 0,
    gems: 0,
    spiritualEnergy: 100,
    maxSpiritualEnergy: 100,
    cultivation: 0,
    
    // Stats del jugador
    hp: 100,
    maxHp: 100,
    attack: 50,
    defense: 30,
    agility: 40,
    
    // Equipo
    equipment: {
        weapon: null,
        ring: null,
        armor: null,
        relic: null,
        pet: null,
        spirit: null
    },
    
    // Inventario
    inventory: [],
    
    // Sistema income/AFK
    incomePerSecond: {
        coins: 1,
        spiritualEnergy: 0.1,
        cultivation: 0.05
    },
    
    // Offline tracking
    lastOnlineTime: Date.now(),
    offlineGains: {
        coins: 0,
        spiritualEnergy: 0,
        cultivation: 0
    }
};

// Guardar estado
function saveGame() {
    localStorage.setItem('divineTreeGameState', JSON.stringify(gameState));
    console.log('Juego guardado');
}

// Cargar estado
function loadGame() {
    const saved = localStorage.getItem('divineTreeGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
        console.log('Juego cargado');
        return true;
    }
    return false;
}

// Calcular ganancias offline
function calculateOfflineGains() {
    const now = Date.now();
    const secondsOffline = (now - gameState.lastOnlineTime) / 1000;
    
    // Máximo 8 horas offline
    const maxSeconds = 8 * 3600;
    const actualSeconds = Math.min(secondsOffline, maxSeconds);
    
    gameState.offlineGains.coins = Math.floor(actualSeconds * gameState.incomePerSecond.coins);
    gameState.offlineGains.spiritualEnergy = Math.floor(actualSeconds * gameState.incomePerSecond.spiritualEnergy);
    gameState.offlineGains.cultivation = Math.floor(actualSeconds * gameState.incomePerSecond.cultivation);
    
    return gameState.offlineGains;
}

// Aplicar ganancias offline
function applyOfflineGains() {
    const gains = calculateOfflineGains();
    gameState.coins += gains.coins;
    gameState.spiritualEnergy = Math.min(gameState.spiritualEnergy + gains.spiritualEnergy, gameState.maxSpiritualEnergy);
    gameState.cultivation += gains.cultivation;
    gameState.lastOnlineTime = Date.now();
    
    if (gains.coins > 0) {
        showNotification(`+${gains.coins} monedas offline`);
    }
    
    return gains;
}

// Calcular power score
function calculatePowerScore() {
    return Math.floor(gameState.attack + gameState.defense * 1.5 + gameState.agility * 1.2 + gameState.cultivation * 0.5);
}

// Inicializar con personaje seleccionado
function initializeWithCharacter(characterIndex) {
    const characters = [
        {
            id: 1,
            name: '茓ノ影 I',
            title: 'Sombra de Espinas',
            emoji: '🥷',
            stats: { ps: 4677, atq: 702, def: 117, agl: 450 }
        },
        {
            id: 2,
            name: '焱心剑 II',
            title: 'Espada de Fuego',
            emoji: '🔥',
            stats: { ps: 5200, atq: 850, def: 300, agl: 600 }
        },
        {
            id: 3,
            name: '冰灵剑 III',
            title: 'Espada de Hielo',
            emoji: '❄️',
            stats: { ps: 4800, atq: 920, def: 200, agl: 750 }
        }
    ];
    
    const char = characters[characterIndex];
    gameState.currentCharacter = characterIndex;
    gameState.playerName = char.name;
    gameState.attack = char.stats.atq;
    gameState.defense = char.stats.def;
    gameState.agility = char.stats.agl;
    gameState.maxHp = char.stats.ps;
    gameState.hp = char.stats.ps;
    
    // Income inicial
    gameState.incomePerSecond.coins = 10 + (char.stats.atq * 0.05);
    gameState.incomePerSecond.cultivation = 0.5 + (char.stats.def * 0.01);
    
    saveGame();
}
