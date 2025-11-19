
# 🤖 Bot de Telegram para Veraxa

Sistema automático que detecta y publica nuevas apps en tu canal de Telegram.

## 📋 Configuración

### 1. Crear el Bot de Telegram

1. Abre Telegram y busca **@BotFather**
2. Envía el comando `/newbot`
3. Sigue las instrucciones para crear tu bot
4. Guarda el **token** que te proporciona

### 2. Crear un Canal de Telegram

1. Crea un canal público en Telegram
2. Añade tu bot como administrador del canal
3. El ID del canal es el nombre con @ (ejemplo: `@veraxa_apps`)

### 3. Configurar el Bot

Edita `telegram-bot.js` y reemplaza:

```javascript
const TELEGRAM_BOT_TOKEN = 'TU_TOKEN_AQUI'; // Token de @BotFather
const TELEGRAM_CHANNEL_ID = '@tu_canal'; // Tu canal
const PLATFORM_URL = 'https://tu-proyecto.replit.app'; // Tu URL de Replit
```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Iniciar el Bot

```bash
npm start
```

## 🎯 Características

✅ **Detección Automática**: Monitorea `script.js` cada 30 segundos
✅ **Publicación Automática**: Publica nuevas apps en inglés
✅ **Incluye Foto**: Envía el icono de la app
✅ **Información Completa**: Versión, tamaño, descargas, rating
✅ **Enlace a Plataforma**: Link directo a tu sitio
✅ **Sin Duplicados**: Solo publica apps nuevas

## 📱 Formato de Publicación

```
🎉 NEW APP AVAILABLE!

📱 WhatsApp
👨‍💻 Developer: Meta
📂 Category: Comunicación
⭐⭐⭐⭐ Rating: 4.3

📦 Version: 2.24.10.74
💾 Size: 50 MB
⬇️ Downloads: 5B+

📝 Description:
WhatsApp es una aplicación de mensajería instantánea.

🔒 Verified Security

🔗 Download now on Veraxa:
https://tu-proyecto.replit.app

#Comunicación #WhatsApp #NewApp #Veraxa
```

## 🔧 Comandos del Bot (Opcional)

Puedes enviar estos comandos a tu bot:

- `/start` - Información del bot
- `/publish NombreApp` - Publicar app específica
- `/republish` - Re-publicar todas las apps

## 📊 API Endpoints

El servidor incluye endpoints para control manual:

- `POST /publish/:appName` - Publicar app específica
- `POST /republish-all` - Re-publicar todas
- `GET /bot-status` - Ver estado del bot

## 🚀 Uso en Replit

El bot se ejecuta automáticamente con el servidor web.
Solo necesitas presionar "Run" en Replit.

## 📝 Notas

- El bot guarda las apps publicadas en `published_apps.json`
- Solo publica apps nuevas (que no estén en el archivo)
- Verifica nuevas apps cada 30 segundos
- Incluye hashtags automáticos para mejor alcance

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 
- No compartas tu token de bot públicamente
- Mantén el token en variables de entorno en producción
- El bot solo tiene acceso de lectura a tu código

## 💡 Agregar Nueva App

Simplemente agrega la app al array `apps` en `script.js`:

```javascript
{
  name: "Nueva App",
  developer: "Developer",
  category: "Categoría",
  rating: 4.5,
  size: "50 MB",
  icon: "https://...",
  description: "Descripción...",
  downloads: "1M+",
  version: "1.0.0",
  // ... resto de propiedades
}
```

El bot la detectará y publicará automáticamente en 30 segundos.

## 🎨 Personalización

Puedes personalizar el mensaje editando la función `createTelegramMessage()` en `telegram-bot.js`.

---

**¿Necesitas ayuda?** Revisa los logs del servidor para diagnosticar problemas.
