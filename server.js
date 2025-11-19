
const express = require('express');
const path = require('path');

// Importar el bot de Telegram
const { publisher, bot } = require('./telegram-bot.js');
const AppManager = require('./add-apps.js');

const app = express();
const PORT = 5000;
const appManager = new AppManager();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para publicar app manualmente
app.post('/publish/:appName', async (req, res) => {
    const appName = req.params.appName;
    try {
        await publisher.publishManually(appName);
        res.json({ success: true, message: `${appName} publicado en Telegram` });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Endpoint para re-publicar todas las apps
app.post('/republish-all', async (req, res) => {
    try {
        await publisher.republishAll();
        res.json({ success: true, message: 'Todas las apps re-publicadas' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Endpoint para agregar nuevas apps
app.post('/add-apps', (req, res) => {
    const { apps } = req.body;
    
    if (!apps || !Array.isArray(apps)) {
        return res.json({ success: false, error: 'Se requiere un array de apps' });
    }
    
    let added = 0;
    let skipped = 0;
    const results = [];
    
    apps.forEach(appName => {
        const normalizedName = appName.trim();
        const exists = appManager.apps.some(app => 
            app.toLowerCase() === normalizedName.toLowerCase()
        );
        
        if (exists) {
            results.push({ app: normalizedName, status: 'skipped', reason: 'ya existe' });
            skipped++;
        } else if (normalizedName) {
            appManager.apps.push(normalizedName);
            results.push({ app: normalizedName, status: 'added' });
            added++;
        }
    });
    
    appManager.saveApps();
    
    res.json({
        success: true,
        summary: { added, skipped, total: appManager.apps.length },
        results
    });
});

// Endpoint para listar apps
app.get('/list-apps', (req, res) => {
    appManager.loadApps();
    res.json({
        success: true,
        apps: appManager.apps,
        total: appManager.apps.length
    });
});

// Endpoint de estado
app.get('/bot-status', (req, res) => {
    res.json({
        status: 'running',
        publishedApps: publisher.publishedApps.length,
        totalApps: appManager.apps.length,
        platform: 'Veraxa Bot de Telegram'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`🤖 Bot de Telegram activo y monitoreando apps`);
});
