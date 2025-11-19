#!/usr/bin/env node

const AppManager = require('./add-apps.js');

// Lista de nuevas aplicaciones que quieres agregar
const NUEVAS_APPS = [
    // Redes sociales y comunicación
    'BeReal',
    'Clubhouse',
    'Mastodon',
    'Bluesky',
    
    // Streaming y entretenimiento
    'HBO Max',
    'Paramount+',
    'Apple TV+',
    'Hulu',
    'Twitch',
    
    // Productividad
    'Notion',
    'Slack',
    'Microsoft Teams',
    'Trello',
    'Asana',
    
    // Finanzas
    'Binance',
    'Coinbase',
    'Cash App',
    'Venmo',
    
    // Transporte y delivery
    'Lyft',
    'DoorDash',
    'Uber Eats',
    'Rappi',
    
    // Juegos
    'Fortnite',
    'PUBG Mobile',
    'Clash Royale',
    'Clash of Clans',
    'Minecraft',
    
    // Otros
    'Canva',
    'Adobe Photoshop',
    'Figma',
    'GitHub',
    'Stack Overflow'
];

function main() {
    console.log('🚀 Iniciando proceso de agregar nuevas aplicaciones...\n');
    
    const manager = new AppManager();
    
    console.log(`📋 Intentando agregar ${NUEVAS_APPS.length} aplicaciones nuevas:`);
    NUEVAS_APPS.forEach((app, index) => {
        console.log(`   ${index + 1}. ${app}`);
    });
    
    console.log('\n🔍 Verificando duplicados y agregando...\n');
    
    manager.addMultipleApps(NUEVAS_APPS);
    
    console.log('\n✨ Proceso completado!');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { NUEVAS_APPS };