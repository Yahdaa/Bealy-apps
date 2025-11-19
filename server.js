
const express = require('express');
const path = require('path');
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
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        totalApps: appManager.apps.length,
        platform: 'Bealy Apps'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`📱 Bealy Apps - Gestor de aplicaciones activo`);
});
