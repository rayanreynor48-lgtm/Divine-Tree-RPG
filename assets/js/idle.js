// Sistema IDLE - Generación automática de recursos
let idleInterval = null;

function startIdleSystem() {
    // Genera recursos cada 100ms (optimizado)
    idleInterval = setInterval(() => {
        const deltaSeconds = 0.1; // 100ms
        
        // Generar coins
        gameState.coins += gameState.incomePerSecond.coins * deltaSeconds;
        
        // Generar spiritual energy (hasta max)
        if (gameState.spiritualEnergy < gameState.maxSpiritualEnergy) {
            gameState.spiritualEnergy += gameState.incomePerSecond.spiritualEnergy * deltaSeconds;
            gameState.spiritualEnergy = Math.min(gameState.spiritualEnergy, gameState.maxSpiritualEnergy);
        }
        
        // Generar cultivation
        gameState.cultivation += gameState.incomePerSecond.cultivation * deltaSeconds;
        
        // Actualizar UI cada 10 intervalos (1 segundo)
        if (Math.floor(Date.now() / 1000) % 1 === 0) {
            updateIdleUI();
        }
    }, 100);
    
    console.log('Sistema IDLE iniciado');
}

function stopIdleSystem() {
    if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
    }
    saveGame();
    console.log('Sistema IDLE pausado');
}

function updateIdleUI() {
    // Mostrar valores actualizados
    const coinsEl = document.getElementById('coinsDisplay');
    const gemsEl = document.getElementById('gemsDisplay');
    const energyEl = document.getElementById('energyDisplay');
    const cultivationEl = document.getElementById('cultivationDisplay');
    const powerScoreEl = document.getElementById('powerScore');
    
    if (coinsEl) {
        coinsEl.textContent = formatNumber(gameState.coins);
    }
    if (gemsEl) {
        gemsEl.textContent = formatNumber(gameState.gems);
    }
    if (energyEl) {
        energyEl.textContent = `${Math.floor(gameState.spiritualEnergy)}/${gameState.maxSpiritualEnergy}`;
    }
    if (cultivationEl) {
        cultivationEl.textContent = formatNumber(gameState.cultivation);
    }
    if (powerScoreEl) {
        const power = calculatePowerScore();
        powerScoreEl.textContent = formatNumber(power);
    }
}

// Formatear números grandes
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// Auto-mejora: Auto cultivo
function enableAutoCultivation() {
    // Mejora de cultivo automático
    setInterval(() => {
        if (gameState.spiritualEnergy >= 10) {
            gameState.spiritualEnergy -= 10;
            gameState.cultivation += 50;
            gameState.level += 0.01;
        }
    }, 5000); // Cada 5 segundos
}

// Auto-mejora: Auto equip (simulado)
function enableAutoEquip() {
    // Simular mejoras automáticas de equipo
    setInterval(() => {
        // Aumentar stats base lentamente
        gameState.attack *= 1.001;
        gameState.defense *= 1.001;
        gameState.agility *= 1.001;
    }, 10000); // Cada 10 segundos
}

// Guardar juego automáticamente
function startAutoSave() {
    setInterval(() => {
        saveGame();
    }, 30000); // Cada 30 segundos
}
