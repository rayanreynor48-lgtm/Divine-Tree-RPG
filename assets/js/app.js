// Character data
const characters = [
    {
        id: 1,
        name: '茓ノ影 I',
        title: 'Sombra de Espinas I',
        image: 'assets/ui/character-base.jpg',
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
    updateCharacterCard();
    updateStats();
    randomizeQuote();
}

// Navigation
function goToScreen(screenClass) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelector(screenClass).classList.add('active');
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
        }

        fill.style.width = progress + '%';
        text.textContent = Math.floor(progress) + '%';
    }, 100);
}

function randomizeQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = quote;
}

// Start
init();
