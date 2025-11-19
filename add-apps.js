const fs = require('fs');
const path = require('path');

class AppManager {
    constructor() {
        this.appsFile = path.join(__dirname, 'published_apps.json');
        this.loadApps();
    }

    loadApps() {
        try {
            const data = fs.readFileSync(this.appsFile, 'utf8');
            this.apps = JSON.parse(data);
        } catch (error) {
            console.error('Error cargando apps:', error);
            this.apps = [];
        }
    }

    saveApps() {
        try {
            fs.writeFileSync(this.appsFile, JSON.stringify(this.apps, null, 2));
            console.log('✅ Apps guardadas correctamente');
        } catch (error) {
            console.error('❌ Error guardando apps:', error);
        }
    }

    addApp(appName) {
        const normalizedName = appName.trim();
        
        if (!normalizedName) {
            console.log('❌ Nombre de app vacío');
            return false;
        }

        // Verificar si ya existe (case-insensitive)
        const exists = this.apps.some(app => 
            app.toLowerCase() === normalizedName.toLowerCase()
        );

        if (exists) {
            console.log(`⚠️  "${normalizedName}" ya existe en la base de datos`);
            return false;
        }

        this.apps.push(normalizedName);
        console.log(`✅ "${normalizedName}" agregada exitosamente`);
        return true;
    }

    addMultipleApps(appNames) {
        let added = 0;
        let skipped = 0;

        appNames.forEach(appName => {
            if (this.addApp(appName)) {
                added++;
            } else {
                skipped++;
            }
        });

        this.saveApps();
        console.log(`\n📊 Resumen: ${added} agregadas, ${skipped} omitidas`);
        console.log(`📱 Total de apps: ${this.apps.length}`);
    }

    listApps() {
        console.log('\n📱 Apps actuales:');
        this.apps.forEach((app, index) => {
            console.log(`${index + 1}. ${app}`);
        });
    }
}

// Ejemplo de uso
if (require.main === module) {
    const manager = new AppManager();
    
    // Agregar nuevas apps aquí
    const newApps = [
        'Spotify',
        'Amazon Prime Video',
        'Uber',
        'Airbnb',
        'PayPal'
    ];

    console.log('🔍 Verificando y agregando nuevas aplicaciones...\n');
    manager.addMultipleApps(newApps);
    manager.listApps();
}

module.exports = AppManager;