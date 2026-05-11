/* ===================================
   DIVINE TREE RPG v4 - SISTEMA COMPLETO
   =================================== */

// ===== BASE DE DATOS DE PERSONAJES =====

const CharacterDatabase = {
    characters: [
        {
            id: 'sombra-espinas-1',
            name: '茨ノ影 I',
            subtitle: 'Sombra de Espinas I',
            image: 'assets/ui/character-base.jpg',
            description: 'Inicio (forma base)',
            fullDescription: 'Sombra de Espinas I',
            attributes: {
                ps: 4677,
                atq: 702,
                def: 117,
                agl: 450
            }
        },
        {
            id: 'guerrero-obsidiana',
            name: 'Guerrero Obsidiana',
            subtitle: 'Fase de Poder',
            image: 'assets/ui/character-base.jpg',
            description: 'Forma Ascendida I',
            fullDescription: 'Guerrero formado en el poder del obsidiana. Fuerza sin igual.',
            attributes: {
                ps: 6200,
                atq: 850,
                def: 250,
                agl: 380
            }
        },
        {
            id: 'erudito-vacio',
            name: 'Erudito del Vacío',
            subtitle: 'Dominio del Dao',
            image: 'assets/ui/character-base.jpg',
            description: 'Forma Ascendida II',
            fullDescription: 'Dominador del vacío eterno. Velocidad y sabiduría supremas.',
            attributes: {
                ps: 5100,
                atq: 620,
                def: 180,
                agl: 720
            }
        }
    ],
    
    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }
};

// ===== GESTIÓN DE ESTADO GLOBAL =====

const GameState = {
    currentScreen: 'splash',
    player: {
        name: '',
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
            ps: 0,
            atq: 0,
            def: 0,
            agl: 0
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

// ===== GESTOR DE SELECCIÓN DE PERSONAJES =====

const CharacterSelectionManager = {
    selectedCharacterId: null,
    currentCharacterIndex: 0,
    
    init() {
        this.renderCharacterCarousel();
        this.setupEventListeners();
    },
    
    renderCharacterCarousel() {
        const carousel = document.getElementById('charactersCarousel');
        if (!carousel) return;
        
        carousel.innerHTML = '';
        const char = CharacterDatabase.characters[this.currentCharacterIndex];
        
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${char.image}" alt="${char.name}" class="card-image">
            </div>
            <h3 class="card-name">${char.name}</h3>
            <p class="card-description">${char.fullDescription}</p>
            <button class="btn btn-outline" data-id="${char.id}">VER DETALLES</button>
        `;
        
        card.querySelector('button').addEventListener('click', () => {
            this.showCharacterPreview(char.id);
        });
        
        carousel.appendChild(card);
        
        // Actualizar contador
        document.getElementById('carouselCounter').textContent = `${this.currentCharacterIndex + 1} / ${CharacterDatabase.characters.length}`;
    },
    
    nextCharacter() {
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % CharacterDatabase.characters.length;
        this.renderCharacterCarousel();
    },
    
    previousCharacter() {
        this.currentCharacterIndex = (this.currentCharacterIndex - 1 + CharacterDatabase.characters.length) % CharacterDatabase.characters.length;
        this.renderCharacterCarousel();
    },
    
    showCharacterPreview(characterId) {
        const char = CharacterDatabase.getCharacter(characterId);
        if (!char) return;
        
        this.selectedCharacterId = characterId;
        
        // Actualizar preview
        document.getElementById('previewImg').src = char.image;
        document.getElementById('previewCharName').textContent = char.name;
        document.querySelector('.preview-form').textContent = char.description;
        document.getElementById('previewDescription').textContent = char.fullDescription;
        
        // Actualizar atributos
        const attrs = char.attributes;
        document.getElementById('previewPsVal').textContent = attrs.ps;
        document.getElementById('previewAtqVal').textContent = attrs.atq;
        document.getElementById('previewDefVal').textContent = attrs.def;
        document.getElementById('previewAglVal').textContent = attrs.agl;
        
        // Actualizar barras (porcentaje del máximo 1000)
        document.getElementById('previewPs').style.width = (attrs.ps / 10000 * 100) + '%';
        document.getElementById('previewAtq').style.width = (attrs.atq / 1000 * 100) + '%';
        document.getElementById('previewDef').style.width = (attrs.def / 500 * 100) + '%';
        document.getElementById('previewAgl').style.width = (attrs.agl / 1000 * 100) + '%';
        
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
        
        ScreenManager.transition('loadingScreen', () => {
            LoadingManager.init();
        });
    },
    
    setupEventListeners() {
        const backBtn = document.getElementById('backBtn');
        const selectBtn = document.getElementById('selectBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
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
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousCharacter();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextCharacter();
            });
        }
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
        
        if (this.currentProgress >= this.maxProgress && !this.isComplete) {
            this.complete();
        }
    },
    
    complete() {
        this.isComplete = true;
        
        setTimeout(() => {
            ScreenManager.transition('mainGameScreen', () => {
                PlayerManager.updateUI();
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

// ===== GESTOR DE JUGADOR =====

const PlayerManager = {
    init() {
        this.updateUI();
    },
    
    updateUI() {
        const playerName = GameState.player.name || 'Cultivador';
        document.getElementById('playerLevel').textContent = GameState.player.level;
        document.getElementById('playerExp').textContent = `${GameState.player.exp}/${GameState.player.maxExp}`;
        
        // Actualizar imagen del personaje
        const characterImage = document.querySelector('.character-portrait img');
        if (characterImage && GameState.player.characterImage) {
            characterImage.src = GameState.player.characterImage;
        }
        
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
        this.updateUI();
    },
    
    addGold(amount) {
        GameState.player.gold += amount;
        this.updateUI();
    }
};

// ===== GESTOR PRINCIPAL =====

const GameManager = {
    isInitialized: false,
    
    init() {
        if (this.isInitialized) return;
        
        console.log('%c Divine Tree RPG v4.0 - Inicializando...', 'color: #d4af37; font-size: 16px; font-weight: bold;');
        
        ScreenManager.init();
        PlayerManager.init();
        CharacterSelectionManager.init();
        
        this.setupEventListeners();
        
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
    }
};

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
    console.log('%c Divine Tree RPG v4.0', 'color: #d4af37; font-size: 14px;');
});

window.GameState = GameState;
window.GameManager = GameManager;
window.ScreenManager = ScreenManager;
window.PlayerManager = PlayerManager;
window.CharacterSelectionManager = CharacterSelectionManager;
