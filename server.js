
const express = require('express');
const path = require('path');

// Importar el bot de Telegram
const { publisher, bot } = require('./telegram-bot.js');

const app = express();
const PORT = 5000;

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

// Endpoint de estado
app.get('/bot-status', (req, res) => {
    res.json({
        status: 'running',
        publishedApps: publisher.publishedApps.length,
        platform: 'Veraxa Bot de Telegram'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`🤖 Bot de Telegram activo y monitoreando apps`);
});
