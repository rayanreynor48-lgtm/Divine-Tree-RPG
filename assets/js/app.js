/* ===================================
   DIVINE TREE RPG v2 - SISTEMA COMPLETO
   =================================== */

/**
 * ARQUITECTURA
 * - GameManager: Control central
 * - ScreenManager: Transiciones pantallas
 * - LoadingManager: Sistema de carga
 * - EquipmentManager: Sistema de equipo
 * - RaritySystem: Sistema de rareza
 * - BeastManager: Sistema de bestias
 * - EvolutionManager: Sistema de evolución
 * - PlayerManager: Datos del jugador
 */

// ===== BASE DE DATOS DE PERSONAJES =====

const CharacterDatabase = {
    characters: [
        {
            id: 'dark-wizard',
            name: 'Mago Oscuro',
            image: 'assets/ui/character-base.jpg',
            description: 'Maestro de las artes oscuras. Poder de magia extrema.',
            attributes: {
                strength: 8,
                intelligence: 18,
                vitality: 10,
                agility: 12,
                wisdom: 15
            }
        },
        {
            id: 'shadow-knight',
            name: 'Caballero Sombrío',
            image: 'assets/ui/character-base.jpg',
            description: 'Guerrero del vacío. Equilibrio entre poder y defensa.',
            attributes: {
                strength: 16,
                intelligence: 10,
                vitality: 15,
                agility: 14,
                wisdom: 10
            }
        },
        {
            id: 'void-monk',
            name: 'Monje del Vacío',
            image: 'assets/ui/character-base.jpg',
            description: 'Cultivador del camino perdido. Velocidad y precisión.',
            attributes: {
                strength: 12,
                intelligence: 12,
                vitality: 12,
                agility: 18,
                wisdom: 14
            }
        }
    ],
    
    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }
};

// ===== GESTOR DE SELECCIÓN DE PERSONAJES =====

const CharacterSelectionManager = {
    selectedCharacterId: null,
    
    init() {
        this.renderCharacterCarousel();
        this.setupEventListeners();
    },
    
    renderCharacterCarousel() {
        const carousel = document.getElementById('charactersCarousel');
        if (!carousel) return;
        
        carousel.innerHTML = '';
        
        CharacterDatabase.characters.forEach((char, index) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${char.image}" alt="${char.name}" class="card-image">
                </div>
                <h3 class="card-name">${char.name}</h3>
                <p class="card-description">${char.description}</p>
                <button class="btn btn-outline" data-id="${char.id}">VER DETALLES</button>
            `;
            
            card.querySelector('button').addEventListener('click', () => {
                this.showCharacterPreview(char.id);
            });
            
            carousel.appendChild(card);
        });
    },
    
    showCharacterPreview(characterId) {
        const char = CharacterDatabase.getCharacter(characterId);
        if (!char) return;
        
        this.selectedCharacterId = characterId;
        
        // Actualizar preview
        document.getElementById('previewImg').src = char.image;
        document.getElementById('previewCharName').textContent = char.name;
        document.getElementById('previewDescription').textContent = char.description;
        
        // Actualizar atributos
        const attrs = char.attributes;
        document.getElementById('previewStrengthVal').textContent = attrs.strength;
        document.getElementById('previewIntelligenceVal').textContent = attrs.intelligence;
        document.getElementById('previewVitalityVal').textContent = attrs.vitality;
        document.getElementById('previewAgilityVal').textContent = attrs.agility;
        document.getElementById('previewWisdomVal').textContent = attrs.wisdom;
        
        // Actualizar barras (porcentaje del máximo 20)
        document.getElementById('previewStrength').style.width = (attrs.strength / 20 * 100) + '%';
        document.getElementById('previewIntelligence').style.width = (attrs.intelligence / 20 * 100) + '%';
        document.getElementById('previewVitality').style.width = (attrs.vitality / 20 * 100) + '%';
        document.getElementById('previewAgility').style.width = (attrs.agility / 20 * 100) + '%';
        document.getElementById('previewWisdom').style.width = (attrs.wisdom / 20 * 100) + '%';
        
        ScreenManager.transition('characterPreviewScreen');
    },
    
    selectCharacter() {
        const char = CharacterDatabase.getCharacter(this.selectedCharacterId);
        if (!char) return;
        
        // Asignar personaje al jugador
        GameState.player.name = char.name;
        GameState.player.characterId = char.id;
        GameState.player.characterImage = char.image;
        GameState.player.attributes = { ...char.attributes };
        
        console.log(`[CharacterSelection] Personaje seleccionado: ${char.name}`);
        
        // Ir a pantalla de carga
        ScreenManager.transition('loadingScreen', () => {
            LoadingManager.init();
        });
    },
    
    setupEventListeners() {
        const backBtn = document.getElementById('backBtn');
        const selectBtn = document.getElementById('selectBtn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                ScreenManager.transition('characterSelectScreen');
            });
        }
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                this.selectCharacter();
            });
        }
    }
};

// ===== GESTIÓN DE ESTADO GLOBAL =====

const GameState = {
    currentScreen: 'splash',
    
    player: {
        name: 'Cultivador Oscuro',
        characterId: null,
        characterImage: null,
        level: 1,
        exp: 0,
        maxExp: 100,
        evolution: 'base',
        gold: 0,
        spirit: 0,
        cultivation: 0,
        
        equipment: {
            weapon: null,
            helmet: null,
            armor: null,
            boots: null,
            belt: null,
            bracers: null,
            orb: null,
            amulet: null,
            token: null,
            follower: null,
            artifact: null,
            relic: null
        },
        
        beasts: [],
        beastUnlockedAt: 10,
        
        attributes: {
            strength: 10,
            intelligence: 10,
            vitality: 10,
            agility: 10,
            wisdom: 10
        }
    },
    
    settings: {
        soundEnabled: false,
        musicEnabled: false
    },
    
    debug: false
};

// ===== GESTOR DE PANTALLAS =====

const ScreenManager = {
    screens: {},
    currentScreen: 'splashScreen',
    
    init() {
        this.screens = {
            'splashScreen': document.getElementById('splashScreen'),
            'characterSelectScreen': document.getElementById('characterSelectScreen'),
            'characterPreviewScreen': document.getElementById('characterPreviewScreen'),
            'loadingScreen': document.getElementById('loadingScreen'),
            'mainGameScreen': document.getElementById('mainGameScreen')
        };
    },
    
    transition(screenId, callback) {
        if (!this.screens[screenId]) {
            console.warn(`Pantalla ${screenId} no encontrada`);
            return;
        }
        
        const currentScreen = this.screens[this.currentScreen];
        const nextScreen = this.screens[screenId];
        
        currentScreen.classList.remove('active');
        
        setTimeout(() => {
            nextScreen.classList.add('active');
            this.currentScreen = screenId;
            GameState.currentScreen = screenId;
            
            if (callback) callback();
            
            if (GameState.debug) {
                console.log(`[ScreenManager] Transición a: ${screenId}`);
            }
        }, 400);
    }
};

// ===== GESTOR DE CARGA =====

const LoadingManager = {
    currentProgress: 0,
    maxProgress: 100,
    simulationSpeed: 0.5,
    isComplete: false,
    autoAdvanceDelay: 1500,
    
    tips: [
        "Las bestias espirituales despiertan en niveles altos.",
        "Los objetos épicos poseen voluntad propia.",
        "El Árbol Divino cambia el destino.",
        "Cada cultivador elige su propio camino.",
        "El espíritu es más fuerte que la materia.",
        "Los secretos ancestrales aguardan en las ruinas.",
        "La paciencia es la virtud del cultivo.",
        "Las pruebas celestiales definen a los inmortales.",
        "El dao existe en todas las cosas.",
        "La comprensión es la raíz del poder."
    ],
    
    init() {
        this.setupProgressBar();
        this.startLoadingSimulation();
        this.setupTipsRotation();
    },
    
    setupProgressBar() {
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
    },
    
    startLoadingSimulation() {
        const loadingInterval = setInterval(() => {
            if (this.isComplete) {
                clearInterval(loadingInterval);
                return;
            }
            
            const progress = this.currentProgress;
            let increment = 0;
            
            if (progress < 30) {
                increment = Math.random() * 2 * this.simulationSpeed;
            } else if (progress < 70) {
                increment = Math.random() * 1.5 * this.simulationSpeed;
            } else {
                increment = Math.random() * 0.8 * this.simulationSpeed;
            }
            
            this.setProgress(progress + increment);
        }, 100);
    },
    
    setProgress(value) {
        this.currentProgress = Math.min(value, this.maxProgress);
        
        if (this.progressFill) {
            this.progressFill.style.width = this.currentProgress + '%';
        }
        
        if (this.progressText) {
            this.progressText.textContent = Math.floor(this.currentProgress) + '%';
        }
        
        GameState.loadingProgress = this.currentProgress;
        
        if (this.currentProgress >= this.maxProgress && !this.isComplete) {
            this.complete();
        }
    },
    
    complete() {
        this.isComplete = true;
        
        setTimeout(() => {
            ScreenManager.transition('mainGameScreen', () => {
                PlayerManager.updateUI();
                EquipmentManager.renderEquipment();
                BeastManager.checkBeastUnlock();
            });
        }, this.autoAdvanceDelay);
    },
    
    setupTipsRotation() {
        const tipsElement = document.querySelector('.tips-text');
        if (!tipsElement) return;
        
        this.displayRandomTip(tipsElement);
        
        setInterval(() => {
            this.displayRandomTip(tipsElement);
        }, 6000);
    },
    
    displayRandomTip(element) {
        const randomIndex = Math.floor(Math.random() * this.tips.length);
        element.textContent = this.tips[randomIndex];
    }
};

// ===== GESTOR DE EQUIPO =====

const EquipmentManager = {
    itemDatabase: {
        'weapon-level1': {
            id: 'weapon-level1',
            name: 'Espada Oscura',
            slot: 'weapon',
            rarity: 'epic',
            image: 'assets/ui/weapon-level1.jpg',
            stats: { strength: 5, intelligence: 3 },
            level: 1
        }
    },
    
    init() {
        this.setupSlotListeners();
    },
    
    setupSlotListeners() {
        const slots = document.querySelectorAll('.equipment-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                const slotType = slot.dataset.slot;
                if (GameState.debug) {
                    console.log(`[Equipment] Click en slot: ${slotType}`);
                }
            });
        });
    },
    
    renderEquipment() {
        const equipment = GameState.player.equipment;
        
        for (const [slotName, itemId] of Object.entries(equipment)) {
            if (itemId) {
                this.equipItem(slotName, itemId);
            }
        }
    },
    
    equipItem(slotName, itemId) {
        const item = this.itemDatabase[itemId];
        if (!item) {
            console.warn(`Item ${itemId} no encontrado`);
            return;
        }
        
        const slot = document.querySelector(`[data-slot="${slotName}"]`);
        if (!slot) return;
        
        slot.classList.add('equipped', `rarity-${item.rarity}`);
        
        const slotItem = slot.querySelector('.slot-item');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        slotItem.innerHTML = '';
        slotItem.appendChild(img);
        
        GameState.player.equipment[slotName] = itemId;
        
        if (GameState.debug) {
            console.log(`[Equipment] Equipado: ${item.name} en ${slotName}`);
        }
    },
    
    unequipItem(slotName) {
        const slot = document.querySelector(`[data-slot="${slotName}"]`);
        if (!slot) return;
        
        slot.classList.remove('equipped', `rarity-${GameState.player.equipment[slotName]?.rarity || 'basic'}`);
        slot.querySelector('.slot-item').innerHTML = '';
        GameState.player.equipment[slotName] = null;
    }
};

// ===== SISTEMA DE RAREZA =====

const RaritySystem = {
    rarities: {
        basic: { color: '#999999', name: 'Básico' },
        simple: { color: '#2d8a3a', name: 'Simple' },
        acceptable: { color: '#3b8e9e', name: 'Aceptable' },
        good: { color: '#8b5fbf', name: 'Bueno' },
        rare: { color: '#ff8c00', name: 'Raro' },
        epic: { color: '#ff3333', name: 'Épico' },
        unique: { color: '#d4af37', name: 'Único' },
        superior: { color: '#ff1493', name: 'Superior' },
        perfect: { color: '#ffffff', name: 'Perfecto' }
    },
    
    getRarityColor(rarity) {
        return this.rarities[rarity]?.color || '#999999';
    },
    
    getRarityName(rarity) {
        return this.rarities[rarity]?.name || 'Desconocido';
    }
};

// ===== GESTOR DE BESTIAS =====

const BeastManager = {
    beastsDatabase: {
        'spirit-wolf': {
            id: 'spirit-wolf',
            name: 'Lobo Espiritual',
            icon: '🐺',
            bonus: '+5 ATQ',
            minLevel: 10
        },
        'shadow-raven': {
            id: 'shadow-raven',
            name: 'Cuervo Sombrío',
            icon: '🦅',
            bonus: '+5 INT',
            minLevel: 15
        },
        'void-serpent': {
            id: 'void-serpent',
            name: 'Serpiente del Vacío',
            icon: '🐍',
            bonus: '+5 SAB',
            minLevel: 20
        }
    },
    
    checkBeastUnlock() {
        const beastsEmpty = document.getElementById('beastsEmpty');
        const beastsGrid = document.getElementById('beastsGrid');
        
        if (GameState.player.level >= GameState.player.beastUnlockedAt) {
            if (beastsEmpty) beastsEmpty.style.display = 'none';
            if (beastsGrid) beastsGrid.style.display = 'grid';
            this.renderBeasts();
        } else {
            if (beastsEmpty) {
                beastsEmpty.textContent = `Se desbloquea en nivel ${GameState.player.beastUnlockedAt}`;
                beastsEmpty.style.display = 'block';
            }
            if (beastsGrid) beastsGrid.style.display = 'none';
        }
    },
    
    renderBeasts() {
        const grid = document.getElementById('beastsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (const [beastId, beast] of Object.entries(this.beastsDatabase)) {
            if (beast.minLevel <= GameState.player.level) {
                const card = document.createElement('div');
                card.className = 'beast-card';
                card.innerHTML = `
                    <div class="beast-icon">${beast.icon}</div>
                    <div class="beast-name">${beast.name}</div>
                    <div class="beast-bonus">${beast.bonus}</div>
                `;
                
                card.addEventListener('click', () => {
                    this.summonBeast(beastId);
                });
                
                grid.appendChild(card);
            }
        }
    },
    
    summonBeast(beastId) {
        const beast = this.beastsDatabase[beastId];
        if (!beast) return;
        
        console.log(`[Beast] Invocada: ${beast.name}`);
    }
};

// ===== GESTOR DE EVOLUCIÓN =====

const EvolutionManager = {
    evolutions: {
        base: {
            name: 'Forma Base',
            requirements: {},
            description: 'Tu estado inicial.'
        },
        stage1: {
            name: 'Primera Ascensión',
            requirements: { level: 10, gold: 500 },
            description: 'Primer paso hacia el poder.'
        },
        stage2: {
            name: 'Segunda Ascensión',
            requirements: { level: 20, gold: 2000 },
            description: 'El poder crece dentro de ti.'
        }
    },
    
    canEvolve(targetStage) {
        const evolution = this.evolutions[targetStage];
        if (!evolution) return false;
        
        const requirements = evolution.requirements;
        
        if (requirements.level && GameState.player.level < requirements.level) return false;
        if (requirements.gold && GameState.player.gold < requirements.gold) return false;
        
        return true;
    },
    
    evolve(targetStage) {
        if (!this.canEvolve(targetStage)) {
            console.log('[Evolution] Requisitos no cumplidos');
            return false;
        }
        
        const evolution = this.evolutions[targetStage];
        GameState.player.evolution = targetStage;
        
        const requirements = evolution.requirements;
        if (requirements.gold) {
            GameState.player.gold -= requirements.gold;
        }
        
        console.log(`[Evolution] Evolucionado a: ${evolution.name}`);
        PlayerManager.updateUI();
        
        return true;
    }
};

// ===== GESTOR DE JUGADOR =====

const PlayerManager = {
    init() {
        this.updateUI();
    },
    
    updateUI() {
        document.getElementById('playerLevel').textContent = GameState.player.level;
        document.getElementById('playerExp').textContent = `${GameState.player.exp}/${GameState.player.maxExp}`;
        document.getElementById('playerEvolution').textContent = EvolutionManager.evolutions[GameState.player.evolution]?.name || 'Base';
        
        const expPercent = (GameState.player.exp / GameState.player.maxExp) * 100;
        const expFill = document.getElementById('expFill');
        if (expFill) {
            expFill.style.width = expPercent + '%';
        }
        
        document.getElementById('goldAmount').textContent = GameState.player.gold;
        document.getElementById('spiritAmount').textContent = GameState.player.spirit;
        document.getElementById('cultivationAmount').textContent = GameState.player.cultivation;
    },
    
    gainExp(amount) {
        GameState.player.exp += amount;
        
        if (GameState.player.exp >= GameState.player.maxExp) {
            this.levelUp();
        }
        
        this.updateUI();
    },
    
    levelUp() {
        GameState.player.level++;
        GameState.player.exp = 0;
        GameState.player.maxExp = Math.floor(GameState.player.maxExp * 1.1);
        
        console.log(`[Player] ¡Level Up! Nivel ${GameState.player.level}`);
        
        BeastManager.checkBeastUnlock();
        this.updateUI();
    },
    
    addGold(amount) {
        GameState.player.gold += amount;
        this.updateUI();
    },
    
    addSpirit(amount) {
        GameState.player.spirit += amount;
        this.updateUI();
    },
    
    addCultivation(amount) {
        GameState.player.cultivation += amount;
        this.updateUI();
    }
};

// ===== GESTOR PRINCIPAL =====

const GameManager = {
    isInitialized: false,
    
    init() {
        if (this.isInitialized) return;
        
        console.log('%c Divine Tree RPG v2.0 - Inicializando...', 'color: #d4af37; font-size: 16px; font-weight: bold;');
        
        ScreenManager.init();
        EquipmentManager.init();
        PlayerManager.init();
        CharacterSelectionManager.init();
        
        this.setupEventListeners();
        this.setupDebug();
        
        this.isInitialized = true;
        console.log('%c ✓ Sistema de juego listo', 'color: #2d8a3a; font-weight: bold;');
    },
    
    setupEventListeners() {
        const enterBtn = document.getElementById('enterBtn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                ScreenManager.transition('characterSelectScreen');
            });
        }
        
        const toggles = document.querySelectorAll('.panel-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const targetId = toggle.dataset.target;
                const panel = document.getElementById(targetId);
                
                if (panel) {
                    const isVisible = panel.style.display !== 'none';
                    panel.style.display = isVisible ? 'none' : 'block';
                    toggle.textContent = isVisible ? '+' : '−';
                }
            });
        });
    },
    
    setupDebug() {
        window.DEBUG = false;
        
        Object.defineProperty(window, 'DEBUG', {
            set: function(value) {
                GameState.debug = value;
                if (value) {
                    console.log('%c DEBUG MODE ACTIVADO', 'color: #d4af37; background: #0a1428; padding: 5px; font-weight: bold;');
                    console.log('Estado del Juego:', GameState);
                } else {
                    console.log('%c Debug mode desactivado', 'color: #999;');
                }
            },
            get: function() {
                return GameState.debug;
            }
        });
        
        window.gameCommands = {
            levelUp: () => PlayerManager.levelUp(),
            gainGold: (amount) => PlayerManager.addGold(amount),
            gainSpirit: (amount) => PlayerManager.addSpirit(amount),
            equipWeapon: () => EquipmentManager.equipItem('weapon', 'weapon-level1'),
            evolveTo: (stage) => EvolutionManager.evolve(stage),
            getState: () => GameState
        };
    }
};

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
    
    console.log('%c Divine Tree RPG v2.0', 'color: #d4af37; font-size: 14px;');
    console.log('Escribe: window.DEBUG = true para modo debug');
    console.log('Escribe: window.gameCommands para ver comandos disponibles');
});

window.GameState = GameState;
window.GameManager = GameManager;
window.ScreenManager = ScreenManager;
window.PlayerManager = PlayerManager;
window.EquipmentManager = EquipmentManager;
window.BeastManager = BeastManager;
window.EvolutionManager = EvolutionManager;
