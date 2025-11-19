
const TelegramBot = require('node-telegram-bot-api');

// ==========================================
// CONFIGURACIÓN DEL BOT DE TELEGRAM
// ==========================================

// IMPORTANTE: Reemplaza estos valores con los tuyos
const TELEGRAM_BOT_TOKEN = '7635694098:AAH4nhsv0szEFsIF0-Ali-NgVWD7bHKZF6U'; // Obtén tu token de @BotFather
const TELEGRAM_CHANNEL_ID = '@glamapps'; // Tu canal de Telegram (ejemplo: @veraxa_apps)

// URL de tu plataforma Replit
const PLATFORM_URL = 'https://videonl.netlify.app/'; // Reemplaza con tu URL de Replit

// Crear instancia del bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// ==========================================
// SISTEMA DE DETECCIÓN DE NUEVAS APPS
// ==========================================

class TelegramPublisher {
    constructor() {
        this.lastHash = this.loadLastHash();
        this.initializeWatcher();
    }

    // Cargar último hash guardado
    loadLastHash() {
        try {
            const fs = require('fs');
            if (fs.existsSync('./last_publish_hash.txt')) {
                return fs.readFileSync('./last_publish_hash.txt', 'utf8').trim();
            }
        } catch (error) {
            console.log('📝 Iniciando sistema de publicación...');
        }
        return null;
    }

    // Guardar hash actual
    saveLastHash() {
        const fs = require('fs');
        fs.writeFileSync('./last_publish_hash.txt', this.lastHash);
    }

    // Inicializar sistema de monitoreo
    initializeWatcher() {
        console.log('🔍 Sistema de monitoreo de apps iniciado');
        console.log(`📱 Canal de Telegram: ${TELEGRAM_CHANNEL_ID}`);
        console.log(`🌐 Plataforma: ${PLATFORM_URL}`);
        
        // Verificar nuevas apps cada 30 segundos
        setInterval(() => this.checkForNewApps(), 30000);
        
        // Primera verificación inmediata
        setTimeout(() => this.checkForNewApps(), 3000);
    }

    // Verificar y publicar TODAS las apps cada vez que se detecta un cambio
    async checkForNewApps() {
        try {
            // Leer el archivo script.js para obtener las apps
            const fs = require('fs');
            const scriptContent = fs.readFileSync('./script.js', 'utf8');
            
            // Extraer el array de apps del script
            const appsMatch = scriptContent.match(/const apps = \[([\s\S]*?)\];/);
            if (!appsMatch) {
                console.log('⚠️  No se pudo encontrar el array de apps');
                return;
            }

            // Evaluar el array de apps de forma segura
            const appsArrayText = '[' + appsMatch[1] + ']';
            const currentApps = eval('(' + appsArrayText + ')');

            // Calcular el hash del contenido actual para detectar cambios
            const crypto = require('crypto');
            const currentHash = crypto.createHash('md5').update(JSON.stringify(currentApps)).digest('hex');
            
            // Verificar si hubo cambios
            if (this.lastHash && this.lastHash === currentHash) {
                console.log('✅ No hay cambios en las aplicaciones');
                return;
            }

            console.log('🔄 Cambios detectados - Publicando TODAS las aplicaciones...');
            console.log(`📱 Total de aplicaciones a publicar: ${currentApps.length}`);
            
            // Publicar TODAS las aplicaciones con delay entre cada una
            for (let i = 0; i < currentApps.length; i++) {
                const app = currentApps[i];
                console.log(`📤 Publicando ${i + 1}/${currentApps.length}: ${app.name}`);
                await this.publishAppToTelegram(app);
                
                // Esperar 3 segundos entre cada publicación para evitar spam
                if (i < currentApps.length - 1) {
                    await this.delay(3000);
                }
            }
            
            // Guardar el hash actual
            this.lastHash = currentHash;
            this.saveLastHash();
            
            console.log('✅ Todas las aplicaciones han sido publicadas');
        } catch (error) {
            console.error('❌ Error verificando apps:', error.message);
        }
    }

    // Publicar app en Telegram
    async publishAppToTelegram(app) {
        try {
            console.log(`📤 Publicando: ${app.name}`);

            // Crear mensaje en inglés
            const message = this.createTelegramMessage(app);

            // Si la app tiene icono, enviar foto con caption
            if (app.icon && (app.icon.startsWith('http://') || app.icon.startsWith('https://'))) {
                await bot.sendPhoto(TELEGRAM_CHANNEL_ID, app.icon, {
                    caption: message,
                    parse_mode: 'HTML'
                });
            } else {
                // Si no hay foto válida, enviar solo texto
                await bot.sendMessage(TELEGRAM_CHANNEL_ID, message, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: false
                });
            }

            console.log(`✅ ${app.name} publicado exitosamente`);
            
            // Pequeña pausa entre publicaciones
            await this.delay(2000);

        } catch (error) {
            console.error(`❌ Error publicando ${app.name}:`, error.message);
        }
    }

    // Crear mensaje formateado para Telegram
    createTelegramMessage(app) {
        const stars = '⭐'.repeat(Math.floor(app.rating || 4));
        
        return `
🎉 <b>NEW APP AVAILABLE!</b>

📱 <b>${app.name}</b>
👨‍💻 Developer: ${app.developer}
📂 Category: ${app.category}
${stars} Rating: ${app.rating || 'N/A'}

📦 Version: ${app.version}
💾 Size: ${app.size}
⬇️ Downloads: ${app.downloads}

📝 <b>Description:</b>
${app.description}

${app.security ? '🔒 <b>Verified Security</b>' : ''}

🔗 <b>Download now on Veraxa:</b>
${PLATFORM_URL}

#${app.category.replace(/\s+/g, '')} #${app.name.replace(/\s+/g, '')} #NewApp #Veraxa
        `.trim();
    }

    // Función de pausa
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Publicar app manualmente
    async publishManually(appName) {
        try {
            const fs = require('fs');
            const scriptContent = fs.readFileSync('./script.js', 'utf8');
            const appsMatch = scriptContent.match(/const apps = \[([\s\S]*?)\];/);
            
            if (!appsMatch) {
                console.log('❌ No se pudo encontrar el array de apps');
                return;
            }

            const appsArrayText = '[' + appsMatch[1] + ']';
            const apps = eval('(' + appsArrayText + ')');
            
            const app = apps.find(a => a.name === appName);
            
            if (app) {
                await this.publishAppToTelegram(app);
                if (!this.publishedApps.includes(app.name)) {
                    this.publishedApps.push(app.name);
                    this.savePublishedApps();
                }
                console.log(`✅ ${appName} publicado manualmente`);
            } else {
                console.log(`❌ App "${appName}" no encontrada`);
            }
        } catch (error) {
            console.error('❌ Error publicando manualmente:', error.message);
        }
    }

    // Re-publicar todas las apps (forzar nueva publicación)
    async republishAll() {
        console.log('🔄 Forzando re-publicación de todas las apps...');
        this.lastHash = null;
        this.saveLastHash();
        await this.checkForNewApps();
    }
}

// ==========================================
// INICIALIZACIÓN DEL BOT
// ==========================================

const publisher = new TelegramPublisher();

// Comandos del bot (opcional, para control manual)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🤖 Bot de publicación de Veraxa iniciado!\n\nComandos:\n/publish <nombre> - Publicar app específica\n/republish - Re-publicar todas las apps');
});

bot.onText(/\/publish (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const appName = match[1];
    await publisher.publishManually(appName);
    bot.sendMessage(chatId, `✅ Intentando publicar: ${appName}`);
});

bot.onText(/\/republish/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🔄 Re-publicando todas las apps...');
    await publisher.republishAll();
});

// Exportar para uso externo
module.exports = {
    publisher,
    bot
};

// Si se ejecuta directamente
if (require.main === module) {
    console.log('🚀 Bot de Telegram iniciado');
    console.log('📱 Monitoreando nuevas apps...');
    console.log('⏰ Verificación automática cada 30 segundos');
    console.log('\n💡 Para usar el bot:');
    console.log('1. Obtén tu token de @BotFather');
    console.log('2. Configura TELEGRAM_BOT_TOKEN');
    console.log('3. Configura TELEGRAM_CHANNEL_ID');
    console.log('4. Ejecuta: node telegram-bot.js\n');
}
