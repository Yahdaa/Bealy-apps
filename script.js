function showAppOfDayModal(app) {
  const modal = document.createElement('div');
  modal.className = 'fullscreen-modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${app.icon}" alt="${app.name}" style="width: 200px; height: 200px; border-radius: 30px; margin: 20px auto; display: block;">
      <h2 style="text-align: center; margin: 20px 0;">${app.name}</h2>
      <p style="text-align: center; margin: 20px 0;">${app.description}</p>
      <div style="text-align: center; margin-top: 30px;">
        <button class="action-btn primary-btn notify-btn">
          <i class="fas fa-bell"></i> Notificar cuando esté disponible
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  const notifyBtn = modal.querySelector('.notify-btn');
  notifyBtn.addEventListener('click', () => {
    showNotification();
    modal.remove();
  });
}

function showNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.innerHTML = `
    <i class="fas fa-bell bell-icon"></i>
    <span>¡Te notificaremos cuando la app esté disponible!</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
    const bellIcon = notification.querySelector('.bell-icon');
    bellIcon.classList.add('animate');
  }, 100);

  setTimeout(() => {
    const bellIcon = notification.querySelector('.bell-icon');
    bellIcon.classList.add('animate');

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 100);
}

function shareApp(app) {
  if (navigator.share) {
    navigator.share({
      title: app.name,
      text: `¡Descubre ${app.name}! ${app.description}`,
      url: window.location.href
    });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    const notification = document.createElement('div');
    notification.className = 'notification-popup show';
    notification.innerHTML = `
      <i class="fas fa-check"></i>
      <span>¡Enlace copiado al portapapeles!</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Recomendación de apps similares por categoría
function getSimilarApps(currentApp) {
  return apps
    .filter(app =>
      app.category === currentApp.category &&
      app.name !== currentApp.name
    )
    .slice(0, 5);
}

// Algoritmo de recomendación basado en categoría y rating
function getRecommendedApps(currentApp) {
  return apps
    .filter(app =>
      app.name !== currentApp.name &&
      (app.category === currentApp.category ||
       app.developer === currentApp.developer ||
       Math.abs(app.rating - currentApp.rating) < 0.5)
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
}

// Función para detectar el dispositivo
function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  }
  return 'desktop';
}

// Función para detectar país y actualizar la interfaz
async function detectCountry() {
  try {
    // Usar un método más simple y confiable
    const response = await fetch('https://httpbin.org/ip');
    if (!response.ok) throw new Error('Network error');

    // Países predeterminados basados en zona horaria como fallback
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let defaultCountry = 'US';

    if (timezone.includes('Mexico')) defaultCountry = 'MX';
    else if (timezone.includes('Spain')) defaultCountry = 'ES';
    else if (timezone.includes('Argentina')) defaultCountry = 'AR';

    const countryElement = document.getElementById('user-country');
    if (countryElement) {
      countryElement.innerHTML = `País detectado: ${defaultCountry}`;
    }
    return defaultCountry;
  } catch (error) {
    console.log('Using default country due to network limitations');
    const countryElement = document.getElementById('user-country');
    if (countryElement) {
      countryElement.innerHTML = 'País: Estados Unidos (US)';
    }
    return 'US';
  }
}

// Función mejorada para filtrar apps por país
async function filterAppsByCountry(appsToFilter) {
  try {
    const userCountry = await detectCountry();
    const filteredApps = appsToFilter.filter(app => {
      const isAvailable = app.allowedCountries.includes('Global') ||
                         app.allowedCountries.includes(userCountry);

      if (!isAvailable) {
        console.log(`App ${app.name} no disponible en ${userCountry}`);
      }

      return isAvailable;
    });

    return filteredApps;
  } catch (error) {
    console.error('Error filtrando apps por país:', error);
    return appsToFilter;
  }
}

// Función mejorada para verificar si una app está disponible basada en su fecha de lanzamiento
function isAppReleased(releaseDate) {
    if (!releaseDate) return true;
    const now = new Date();
    const release = new Date(releaseDate);
    return now >= release;
}

// Función mejorada para formatear el tiempo restante
function getTimeUntilRelease(releaseDate) {
    const now = new Date();
    const release = new Date(releaseDate);

    if (now >= release) return null;

    const diffTime = Math.abs(release - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    } else if (diffDays > 0) {
        return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    }
}

// Array de apps con información de banners y gradientes
const apps = [{
    name: "Facebook",
    developer: "Meta",
    packageName: "com.facebook.katana",
    category: "Redes sociales",
    rating: 4.2,
    size: "85.7 MB",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    description: "Facebook es una red social donde los usuarios pueden compartir contenido.",
    downloads: "987.8M+",
    bannerGradient: "45deg, #1877f2, #0a3d62",
    security: false,
    version: "497.0.0.79.36",
    isAvailable: false,
    releaseDate: "2024-01-01T00:00:00",
    allowedCountries: ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    platforms: {
      android: "https://play.google.com/store/apps/details?id=com.facebook.katana",
      ios: "https://apps.apple.com/us/app/facebook/id284882215"
    },
    previousVersions: ["496.0.0.45.65", "495.0.0.45.201", "494.1.0.56.73"],
    media: [{
        type: "image",
        url: "/api/placeholder/200/400"
      },
      {
        type: "video",
        url: "dQw4w9WgXcQ"
      },
      {
        type: "image",
        url: "/api/placeholder/200/400"
      }
    ]
  },
           {
    "name": "Crunchyroll",
    "developer": "Crunchyroll, LLC",
    "packageName": "com.crunchyroll.crunchyroid",
    "category": "Entretenimiento",
    "rating": 4.7,
    "size": "45 MB",
    "icon": "https://seeklogo.com/images/C/crunchyroll-logo-ED92B45335-seeklogo.com.png",
    "description": "Crunchyroll es una plataforma de streaming especializada en anime, con una amplia biblioteca de series y películas, incluyendo simulcasts de Japón.",
    "downloads": "100M",
    "bannerGradient": "45deg, #FF6200, #FF8C00",
    "security": true,
    "version": "3.62.0",
    "isAvailable": true,
    "releaseDate": "2024-08-20T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.crunchyroll.crunchyroid",
      "ios": "https://apps.apple.com/us/app/crunchyroll/id329913454"
    },
    "previousVersions": ["3.61.0", "3.60.1", "3.59.2"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "t7u8v9w0x1y2"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
          {
    "name": "Instagram",
    "developer": "Meta",
    "packageName": "com.instagram.android",
    "category": "Redes sociales",
    "rating": 4.5,
    "size": "90 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    "description": "Instagram es una red social para compartir fotos y videos.",
    "downloads": "999M+",
    "bannerGradient": "45deg, #833AB4, #FD1D1D, #F56040",
    "security": false,
    "version": "250.0.0.12.34",
    "isAvailable": true,
    "releaseDate": "2024-05-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.instagram.android",
      "ios": "https://apps.apple.com/us/app/instagram/id389801252"
    },
    "previousVersions": ["249.0.0.11.22", "248.0.0.10.11", "247.0.0.9.10"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
   {
    "name": "Quizlet",
    "developer": "Quizlet Inc.",
    "packageName": "com.quizlet.quizletandroid",
    "category": "Educación",
    "rating": 4.6,
    "size": "30 MB",
    "icon": "https://img.icons8.com/?size=512&id=OcH8C89hZ9SZ&format=png",
    "description": "Quizlet es una aplicación para estudiar y memorizar con tarjetas, juegos y pruebas.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #2F80ED, #56CCF2",
    "security": true,
    "version": "8.48.1",
    "isAvailable": true,
    "releaseDate": "2025-05-10T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid",
      "ios": "https://apps.apple.com/us/app/quizlet-flashcards-homework/id546473125"
    },
    "previousVersions": ["8.47.2", "8.46.0", "8.45.3"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
},
          {
    "name": "WhatsApp",
    "developer": "Meta",
    "packageName": "com.whatsapp",
    "category": "Comunicación",
    "rating": 4.3,
    "size": "50 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    "description": "WhatsApp es una aplicación de mensajería instantánea.",
    "downloads": "5B+",
    "bannerGradient": "45deg, #25D366, #128C7E",
    "security": true,
    "version": "2.24.10.74",
    "isAvailable": true,
    "releaseDate": "2024-05-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.whatsapp",
      "ios": "https://apps.apple.com/us/app/whatsapp-messenger/id310633997"
    },
    "previousVersions": ["2.24.9.78", "2.24.8.85", "2.24.7.79"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },

          {
    "name": "Snapchat",
    "developer": "Snap Inc.",
    "packageName": "com.snapchat.android",
    "category": "Comunicación",
    "rating": 4.2,
    "size": "80 MB",
    "icon": "https://s3.r29static.com/bin/entry/437/0,0,2000,2400/720x864,85/1710988/image.webp",
    "description": "Snapchat es una aplicación de mensajería que permite compartir fotos y videos que desaparecen después de ser vistos.",
    "downloads": "2B+",
    "bannerGradient": "45deg, #FFFC00, #FFDD00",
    "security": true,
    "version": "12.85.0.32",
    "isAvailable": true,
    "releaseDate": "2024-09-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES", "IT"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.snapchat.android",
      "ios": "https://apps.apple.com/us/app/snapchat/id447188370"
    },
    "previousVersions": ["12.84.0.30", "12.83.0.28", "12.82.0.25"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "k9m8n7p6q5r4"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Disney+",
    "developer": "Disney",
    "packageName": "com.disney.disneyplus",
    "category": "Entretenimiento",
    "rating": 4.4,
    "size": "120 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/7322/7322098.png",
    "description": "Disney+ es una plataforma de streaming con películas, series y contenido exclusivo de Disney, Pixar, Marvel, Star Wars y más, incluyendo acceso a contenido selecto de Hulu en ciertos mercados.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #1B2A44, #3C5A99",
    "security": true,
    "version": "3.5.2.10",
    "isAvailable": true,
    "releaseDate": "2024-10-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES", "IT"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
      "ios": "https://apps.apple.com/us/app/disney/id1446145911"
    },
    "previousVersions": ["3.5.1.8", "3.5.0.7", "3.4.9.6"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "z1x2y3w4v5u6"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },

         {
    "name": "Messenger",
    "developer": "Meta",
    "packageName": "com.facebook.orca",
    "category": "Comunicación",
    "rating": 4.1,
    "size": "60 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/3621/3621443.png",
    "description": "Messenger es una aplicación de mensajería para usuarios de Facebook.",
    "downloads": "868M+",
    "bannerGradient": "45deg, #006AFF, #0084FF",
    "security": false,
    "version": "450.0.0.43.109",
    "isAvailable": true,
    "releaseDate": "2025-05-31T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.facebook.orca",
      "ios": "https://apps.apple.com/us/app/messenger/id454638411"
    },
    "previousVersions": ["449.0.0.41.107", "448.0.0.39.105", "447.0.0.37.103"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
       {
    "name": "Telegram",
    "developer": "Telegram FZ-LLC",
    "packageName": "org.telegram.messenger",
    "category": "Comunicación",
    "rating": 4.5,
    "size": "70 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/2111/2111710.png",
    "description": "Telegram es una aplicación de mensajería enfocada en la privacidad y la seguridad.",
    "downloads": "1B+",
    "bannerGradient": "45deg, #0088CC, #33B5E5",
    "security": true,
    "version": "10.12.0",
    "isAvailable": true,
    "releaseDate": "2024-07-20T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "RU", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=org.telegram.messenger",
      "ios": "https://apps.apple.com/us/app/telegram-messenger/id686449807"
    },
    "previousVersions": ["10.11.0", "10.10.1", "10.9.2"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "x7y8z9a0b1c2"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Signal",
    "developer": "Signal Foundation",
    "packageName": "org.thoughtcrime.securesms",
    "category": "Comunicación",
    "rating": 4.6,
    "size": "50 MB",
    "icon": "https://play-lh.googleusercontent.com/FtGKSwVtpmMxKoJrJuI837DkYGRsqlMdiVPAd8bomLQZ3_Hc55XokY_dYdXKgGagiYs",
    "description": "Signal es una aplicación de mensajería cifrada que prioriza la privacidad del usuario.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #3A76F0, #5B9DF6",
    "security": true,
    "version": "7.8.1",
    "isAvailable": true,
    "releaseDate": "2025-08-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms",
      "ios": "https://apps.apple.com/us/app/signal-messenger/id874139669"
    },
    "previousVersions": ["7.7.2", "7.6.3", "7.5.4"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "p9q0r1s2t3u4"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
       {
    "name": "Kahoot!",
    "developer": "Kahoot AS",
    "packageName": "no.kahoot.app",
    "category": "Educación",
    "rating": 4.5,
    "size": "35 MB",
    "icon": "https://play-lh.googleusercontent.com/AyJnaQ0JfEu-F_4bop5hH4qpJwYJ1blePyer6VVUUm4Al80uWJBje4UZHirrf39wI7uI=w480-h960",
    "description": "Kahoot! es una aplicación para crear y jugar cuestionarios interactivos para el aprendizaje y la diversión.",
    "downloads": "50M+",
    "bannerGradient": "45deg, #46178F, #8E2DE2",
    "security": true,
    "version": "6.12.0",
    "isAvailable": true,
    "releaseDate": "2025-05-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=no.kahoot.app",
      "ios": "https://apps.apple.com/us/app/kahoot-play-create-quizzes/id1131203564"
    },
    "previousVersions": ["6.11.2", "6.10.1", "6.9.3"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
},
       {
    "name": "Duolingo",
    "developer": "Duolingo, Inc.",
    "packageName": "com.duolingo",
    "category": "Educación",
    "rating": 4.7,
    "size": "50 MB",
    "icon": "https://play-lh.googleusercontent.com/dMWXg0GmzURGK3dFWXOMvo31IXyVKwxWUXwHUqwJBK6jZzj7_n1c9Gfor30HVtad-2AS=w480-h960",
    "description": "Duolingo es una aplicación para aprender idiomas de forma divertida y gratuita.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #58CC02, #7EE302",
    "security": true,
    "version": "5.151.2",
    "isAvailable": true,
    "releaseDate": "2025-05-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.duolingo",
      "ios": "https://apps.apple.com/us/app/duolingo-language-lessons/id570060128"
    },
    "previousVersions": ["5.150.1", "5.149.3", "5.148.2"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/fqFEXqnUA9FfPBf3H03bEDMCC7x4AvdRXgcyCjQyTbNkVrPzk82HE-rLM9WzkHV2y5w=w5120-h2880"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/6rUUj3m7epGmC1YjHqT5HOlWv8HE3KvH4OmvJGqusQJPMdNlJwoyS7dxDM_NYuPwWxA=w5120-h2880"
      }
    ]
},
      {
    "name": "PowerSchool",
    "developer": "PowerSchool Group LLC",
    "packageName": "com.powerschool.mobile",
    "category": "Educación",
    "rating": 4.3,
    "size": "45 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/5996/5996953.png",
    "description": "PowerSchool es una aplicación para que padres y estudiantes accedan a calificaciones, asistencia y más.",
    "downloads": "10M+",
    "bannerGradient": "45deg, #003087, #0059C1",
    "security": true,
    "version": "24.10.0",
    "isAvailable": true,
    "releaseDate": "2025-04-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.powerschool.mobile",
      "ios": "https://apps.apple.com/us/app/powerschool-mobile/id973741088"
    },
    "previousVersions": ["24.9.1", "24.8.2", "24.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
       {
  "name": "Revolut",
  "developer": "Revolut Ltd",
  "packageName": "com.revolut.revolut",
  "category": "Finanzas",
  "rating": 4.6,
  "size": "96 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo4bDTL3GlEUF3XveYEges63qOtfgNfPzZXcKYDxsTwfrvE6Bk1-FT_7w&s=10",
  "description": "Revolut es una aplicación financiera que ofrece servicios bancarios modernos como cuentas digitales, tarjetas de débito, transferencias internacionales, inversión en acciones y criptomonedas, y control de gastos.",
  "downloads": "222.5K+",
  "bannerGradient": "45deg, #1000C9, #00BFFF",
  "security": true,
  "version": "10.12.1",
  "isAvailable": true,
  "releaseDate": "2015-07-01T00:00:00",
  "allowedCountries": ["US","MX", "GB", "IE", "FR", "DE", "ES", "IT", "AU", "SG", "LT"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.revolut.revolut",
    "ios": "https://apps.apple.com/app/revolut/id932493046"
  },
  "previousVersions": ["10.11.2", "10.10.0", "10.9.5"],
  "media": [
    {
      "type": "image",
      "url": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/52/2f/da/522fdac2-35f3-570d-af9b-f4a7327f0180/Screen_1_1242x2688_mx-ES.jpg/300x0w.jpg"
    },
    {
      "type": "image",
      "url": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/a2/94/b7/a294b71f-0703-38d5-346c-bbe03e0ffb9c/Screen_6_2048x2732_es-ES.jpg/643x0w.jpg"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=RevolutDemo"
    }
  ]
},
   {
    "name": "TikTok",
    "developer": "ByteDance",
    "packageName": "com.zhiliaoapp.musically",
    "category": "Redes sociales",
    "rating": 4.4,
    "size": "100 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    "description": "TikTok es una plataforma de videos cortos que permite a los usuarios crear y compartir contenido creativo.",
    "downloads": "5.8B+",
    "bannerGradient": "45deg, #FF0050, #00F2EA",
    "security": false,
    "version": "36.0.0",
    "isAvailable": true,
    "releaseDate": "2024-10-01T00:00:00",
    "allowedCountries": ["CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
      "ios": "https://apps.apple.com/us/app/tiktok/id835599320"
    },
    "previousVersions": ["35.9.0", "35.8.0", "35.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "RedNote",
    "developer": "Xingin Information Technology Co., Ltd.",
    "packageName": "com.xingin.xhs",
    "category": "Redes sociales",
    "rating": 4.3,
    "size": "90 MB",
    "icon": "https://play-lh.googleusercontent.com/cvxZysz34aPGO1l__roDVapiQTNFeWpQ1tKD2YNO3RodNqBF3bI8cNQkDm1EVxY9CiM=w240-h480-rw",
    "description": "RedNote es una plataforma de redes sociales y comercio electrónico que combina videos cortos, fotos y recomendaciones de estilo de vida.",
    "downloads": "300M+",
    "bannerGradient": "45deg, #FF0000, #FFD700",
    "security": true,
    "version": "8.82.0",
    "isAvailable": true,
    "releaseDate": "2025-05-12T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES", "CN"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.xingin.xhs",
      "ios": "https://apps.apple.com/us/app/rednote/id659680863"
    },
    "previousVersions": ["8.81.0", "8.80.0", "8.79.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
            {
    "name": "Douyin",
    "developer": "ByteDance",
    "packageName": "com.ss.android.ugc.aweme",
    "category": "Redes sociales",
    "rating": 4.5,
    "size": "95 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Douyin_logo.svg",
    "description": "Douyin es la versión china de TikTok, enfocada en videos cortos y comercio electrónico.",
    "downloads": "700M+",
    "bannerGradient": "45deg, #FF0000, #FFD700",
    "security": false,
    "version": "28.0.0",
    "isAvailable": true,
    "releaseDate": "2024-09-15T00:00:00",
    "allowedCountries": ["CN"],
    "platforms": {
      "android": "https://www.douyin.com/download",
      "ios": "https://www.douyin.com/download"
    },
    "previousVersions": ["27.9.0", "27.8.0", "27.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "CapCut",
    "developer": "ByteDance",
    "packageName": "com.lemon.lvoverseas",
    "category": "Edición de video",
    "rating": 4.6,
    "size": "80 MB",
    "icon": "https://static.vecteezy.com/system/resources/previews/013/948/546/non_2x/capcut-logo-on-transparent-white-background-free-vector.jpg",
    "description": "CapCut es una herramienta de edición de video y fotos con funciones avanzadas de IA.",
    "downloads": "1B+",
    "bannerGradient": "45deg, #00C4B4, #7B68EE",
    "security": false,
    "version": "12.0.0",
    "isAvailable": true,
    "releaseDate": "2025-07-09T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.lemon.lvoverseas",
      "ios": "https://apps.apple.com/us/app/capcut-video-editor/id1506865452"
    },
    "previousVersions": ["11.9.0", "11.8.0", "11.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Lemon8",
    "developer": "ByteDance",
    "packageName": "com.bd.lemon8",
    "category": "Redes sociales",
    "rating": 4.3,
    "size": "70 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/en/3/35/Lemon8_icon.png",
    "description": "Lemon8 es una plataforma de redes sociales centrada en estilo de vida y contenido visual.",
    "downloads": "50M+",
    "bannerGradient": "45deg, #FFD700, #FF6347",
    "security": false,
    "version": "5.0.0",
    "isAvailable": true,
    "releaseDate": "2024-08-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.bd.lemon8",
      "ios": "https://apps.apple.com/us/app/lemon8/id1541578250"
    },
    "previousVersions": ["4.9.0", "4.8.0", "4.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Hypic",
    "developer": "ByteDance",
    "packageName": "com.bytedance.hypic",
    "category": "Edición de fotos",
    "rating": 4.2,
    "size": "65 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hypic_logo.png",
    "description": "Hypic es una aplicación de edición de fotos con herramientas de IA para retoques y efectos.",
    "downloads": "10M+",
    "bannerGradient": "45deg, #FF69B4, #8A2BE2",
    "security": false,
    "version": "3.0.0",
    "isAvailable": true,
    "releaseDate": "2024-07-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.bytedance.hypic",
      "ios": "https://apps.apple.com/us/app/hypic-photo-editor-ai-art/id1623904357"
    },
    "previousVersions": ["2.9.0", "2.8.0", "2.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Toutiao",
    "developer": "ByteDance",
    "packageName": "com.ss.android.article.news",
    "category": "Noticias",
    "rating": 4.1,
    "size": "55 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Toutiao_logo.png",
    "description": "Toutiao es una plataforma de noticias personalizada para usuarios en China.",
    "downloads": "300M+",
    "bannerGradient": "45deg, #FF4500, #FFD700",
    "security": false,
    "version": "9.0.0",
    "isAvailable": true,
    "releaseDate": "2024-06-01T00:00:00",
    "allowedCountries": ["CN"],
    "platforms": {
      "android": "https://www.toutiao.com/download",
      "ios": "https://www.toutiao.com/download"
    },
    "previousVersions": ["8.9.0", "8.8.0", "8.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Xigua Video",
    "developer": "ByteDance",
    "packageName": "com.ss.android.ugc.xigua",
    "category": "Video",
    "rating": 4.0,
    "size": "60 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Xigua_Video_logo.png",
    "description": "Xigua Video es una plataforma de videos cortos y largos en China.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #FF6347, #FFA500",
    "security": false,
    "version": "8.0.0",
    "isAvailable": true,
    "releaseDate": "2024-05-20T00:00:00",
    "allowedCountries": ["CN"],
    "platforms": {
      "android": "https://www.ixigua.com/download",
      "ios": "https://www.ixigua.com/download"
    },
    "previousVersions": ["7.9.0", "7.8.0", "7.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Lark",
    "developer": "ByteDance",
    "packageName": "com.larksuite.lark",
    "category": "Productividad",
    "rating": 4.2,
    "size": "120 MB",
    "icon": "https://play-lh.googleusercontent.com/WBJp4E5ZLxMhnOBfj3iZ5HAzYjMc180O-qmVyVpQgI8Bwv70f_C_Kng-mzO2hFQ2zg",
    "description": "Lark es una suite de colaboración empresarial con herramientas de comunicación y gestión.",
    "downloads": "10M+",
    "bannerGradient": "45deg, #00B7D6, #0078D4",
    "security": true,
    "version": "7.0.0",
    "isAvailable": true,
    "releaseDate": "2024-04-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.larksuite.lark",
      "ios": "https://apps.apple.com/us/app/lark-meetings/id1497811009"
    },
    "previousVersions": ["6.9.0", "6.8.0", "6.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Helo",
    "developer": "ByteDance",
    "packageName": "com.helo.android",
    "category": "Redes sociales",
    "rating": 4.1,
    "size": "75 MB",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Helo_logo.png",
    "description": "Helo es una plataforma social para compartir contenido en idiomas regionales.",
    "downloads": "50M+",
    "bannerGradient": "45deg, #FF4500, #FFD700",
    "security": false,
    "version": "4.0.0",
    "isAvailable": true,
    "releaseDate": "2024-03-01T00:00:00",
    "allowedCountries": ["IN"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.helo.android",
      "ios": "https://apps.apple.com/in/app/helo/id1456079477"
    },
    "previousVersions": ["3.9.0", "3.8.0", "3.7.0"],
    "media": [
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Roblox",
    "developer": "Roblox Corporation",
    "packageName": "com.roblox.client",
    "category": "Juegos",
    "rating": 4.4,
    "size": "180 MB",
    "icon": "https://play-lh.googleusercontent.com/7cIIPlWm4m7AGqVpEsIfyL-HW4cQla4ucXnfalMft1TMIYQIlf2vqgmthlZgbNAQoaQ",
    "description": "Roblox es la plataforma de creación definitiva que permite a millones de usuarios crear e interactuar juntos en experiencias 3D inmersivas creadas por la comunidad global de desarrolladores.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #00A2FF, #0078D4",
    "security": true,
    "version": "2.628.526",
    "isAvailable": true,
    "releaseDate": "2012-05-26T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.roblox.client",
      "ios": "https://apps.apple.com/us/app/roblox/id431946152"
    },
    "previousVersions": ["2.627.525", "2.626.524", "2.625.523"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/RobloxScreenshot1.jpg"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/RobloxScreenshot2.jpg"
      },
      {
        "type": "video",
        "url": "https://www.youtube.com/watch?v=RobloxDemo"
      }
    ]
  },
           {
    "name": "TikTok Lite",
    "developer": "TikTok Pte. Ltd.",
    "packageName": "com.zhiliaoapp.musically.go",
    "category": "Entretenimiento",
    "rating": 4.2,
    "size": "45 MB",
    "icon": "https://img.utdstc.com/icon/f02/722/f02722184e010a9bfeebdeb4b5f57db1cac50688db6f959c297940ae3c4d7002:200",
    "description": "TikTok Lite es la versión ligera y optimizada de la aplicación de vídeos cortos TikTok. Su menor tamaño y menor consumo de recursos la hace ideal para ser utilizada en dispositivos que tengan menos potencia o capacidades más limitadas.",
    "downloads": "2M+",
    "bannerGradient": "45deg, #FF0050, #FF2C55",
    "security": true,
    "version": "29.1.2",
    "isAvailable": true,
    "releaseDate": "2025-05-28T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically.go",
      "ios": "https://apps.apple.com/app/tiktok-lite/id6447160980"
    },
    "previousVersions": ["29.1.1", "29.0.9", "28.9.3"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/tiktok-lite-screenshot1.jpg"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/tiktok-lite-screenshot2.jpg"
      },
      {
        "type": "video",
        "url": "https://www.youtube.com/watch?v=TikTokLiteDemo"
      }
    ]
  },
      {
  "name": "Gemini",
  "developer": "Google LLC",
  "packageName": "com.google.gemini",
  "category": "Productividad",
  "rating": 4.3,
  "size": "50 MB",
  "icon": "https://play-lh.googleusercontent.com/Pkwn0AbykyjSuCdSYCbq0dvOqHP-YXcbBLTZ8AOUZhvnRuhUnZ2aJrw_YCf6kVMcZ4PM=w480-h960",
  "description": "Gemini es una aplicación impulsada por IA que ofrece asistencia conversacional, generación de contenido y respuestas inteligentes para mejorar la productividad y creatividad de los usuarios.",
  "downloads": "9K+",
  "bannerGradient": "45deg, #1A73E8, #FFFFFF",
  "security": true,
  "version": "1.2.3",
  "isAvailable": true,
  "releaseDate": "2024-05-28T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "FR", "DE", "ES", "IT", "IN"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.google.gemini",
    "ios": "https://apps.apple.com/app/gemini/id1677739987"
  },
  "previousVersions": ["1.2.2", "1.2.1", "1.1.0"],
  "media": [
    {
      "type": "image",
      "url": "https://play-lh.googleusercontent.com/gemini_screenshot1.jpg"
    },
    {
      "type": "image",
      "url": "https://play-lh.googleusercontent.com/gemini_screenshot2.jpg"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=GeminiDemo"
    }
  ]
},
   {
  "name": "Grok",
  "developer": "X Corp.",
  "packageName": "com.xai.grok",
  "category": "Productividad",
  "rating": 4.8,
  "size": "60 MB",
  "icon": "https://play-lh.googleusercontent.com/dQRKhi30KpzG3gww3TdVLzyIAVuOAWylnAcgnEUxqfpm2A8dEt2sgApVvtKAy-DO8aI=w480-h960",
  "description": "Grok, creado por xAI, es una aplicación de IA conversacional que proporciona respuestas útiles y veraces, con funciones como modo de voz y acceso a funciones avanzadas para usuarios suscritos.",
  "downloads": "26M+",
  "bannerGradient": "45deg, #0A2540, #FFFFFF",
  "security": true,
  "version": "1.1.0",
  "isAvailable": true,
  "releaseDate": "2025-05-27T00:00:00",
  "allowedCountries": ["US", "MX", "CA", "GB", "AU", "NZ", "FR", "DE", "ES", "IT"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.xai.grok",
    "ios": "https://apps.apple.com/app/grok/id1666848348"
  },
  "previousVersions": ["1.0.9", "1.0.8", "1.0.7"],
  "media": [
    {
      "type": "image",
      "url": "https://play-lh.googleusercontent.com/grok_screenshot1.jpg"
    },
    {
      "type": "image",
      "url": "https://play-lh.googleusercontent.com/grok_screenshot2.jpg"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=GrokDemo"
    }
  ]
},
       {
  "name": "YouTube",
  "developer": "Google LLC",
  "packageName": "com.google.android.youtube",
  "category": "Entretenimiento",
  "rating": 4.2,
  "size": "135 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjX5LVxRxYR6uDz_MyBLBgi6ihUSOBsm4g_XUvyBwt4b6INTXV2THSdouK&s=10",
  "description": "YouTube es una plataforma de videos donde los usuarios pueden ver, subir, comentar y compartir contenido multimedia de todo tipo, desde entretenimiento hasta educación.",
  "downloads": "87M+",
  "bannerGradient": "45deg, #FF0000, #282828",
  "security": true,
  "version": "20.20.35",
  "isAvailable": true,
  "releaseDate": "2005-12-15T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    "ios": "https://apps.apple.com/app/youtube-watch-listen-stream/id544007664"
  },
  "previousVersions": ["19.19.34", "19.18.33", "19.17.32"],
  "media": [
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2K2R8wqExZOWpxBSm5dnJCMebfVn0hOSWeLKyu8IIvolBjW-GvqxPPeA&s=10"
    },
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0a0XPPgsd_h78NcHc8t3iELtjS6_Vc5IbQRBbBmhvkV_dgbaaZkeqs52X&s=10"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=YouTubeDemo"
    }
  ]
},
     {
  "name": "Among Us",
  "developer": "Innersloth LLC",
  "packageName": "com.innersloth.spacemafia",
  "category": "Juegos",
  "rating": 3.8,
  "size": "150 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH5kwAJ6UBsqDvkyCKyjGNXpAqtLtMB0ED9jh0sGpZeAUPnrrW8BJsLCtF&s=10",
  "description": "Among Us es un juego multijugador en línea donde los jugadores trabajan en equipo para completar tareas, mientras intentan descubrir quiénes son los impostores infiltrados en la nave.",
  "downloads": "24M+",
  "bannerGradient": "45deg, #8A00D4, #FF0266",
  "security": true,
  "version": "2024.3.5",
  "isAvailable": true,
  "releaseDate": "2018-06-15T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "MX", "BR", "DE", "FR", "JP", "KR"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.innersloth.spacemafia",
    "ios": "https://apps.apple.com/app/among-us/id1351168404"
  },
  "previousVersions": ["2024.2.1", "2023.12.12", "2023.10.24"],
  "media": [
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnCFwQIw8tkKGKRPQGskN7yZTwEUBSYF0Web2Jc6ekPOLGdjzYPIMcoJvySY&s=10"
    },
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxowrQieXVxcsKXISf8cqB97ZpDDMNgV_ISEcrmKkILVdjzYPIMcoJvySY&s=10"
    },
    {
      "type": "video",
      "url": "https://youtu.be/p0aHDT8wwrw?si=zjbUPvoNlgYvlCSZ"
    }
  ]
},
    {
  "name": "Netflix",
  "developer": "Netflix, Inc.",
  "packageName": "com.netflix.mediaclient",
  "category": "Entretenimiento",
  "rating": 4.1,
  "size": "26 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3_FUVPsUWnfx0QU6CEByIfTew5jRQDkqakK-hmaQ3-VQ4wCzYO06kWs&s=10",
  "description": "Netflix es una plataforma de streaming donde puedes ver series, películas, documentales y más desde cualquier dispositivo conectado a internet.",
  "downloads": "79M+",
  "bannerGradient": "45deg, #E50914, #221F1F",
  "security": true,
  "version": "8.104.0",
  "isAvailable": true,
  "releaseDate": "2025-05-11T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "FR", "DE", "ES", "IT", "KR"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    "ios": "https://apps.apple.com/app/netflix/id363590051"
  },
  "previousVersions": ["8.105.1", "8.104.0", "8.103.1"],
  "media": [
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI0LgqRAMAl19zN7GxROEvvUqysW2hwaFwk5Tj3Ckw5_hMYTLJkjN7V72w&s=10"
    },
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkdclk8qxprdD7pGKTp2-f5ccnPoI2PUrAYROhYnTCb0U2QzFL2yvi40&s=10"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=O4XHCg1AaGQ"
    }
  ]
},
        {
  "name": "VSCO",
  "developer": "VSCO",
  "packageName": "com.vsco.cam",
  "category": "Fotografía",
  "rating": 4.1,
  "size": "70 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRla6UOCH5XlcDVIJhkgONdg0NwUMt96eKUJA&s",
  "description": "VSCO es una aplicación de edición fotográfica y comunidad creativa donde los usuarios pueden aplicar filtros profesionales, ajustar parámetros avanzados y compartir su trabajo artístico.",
  "downloads": "20K+",
  "bannerGradient": "45deg, #000000, #FFFFFF",
  "security": true,
  "version": "360",
  "isAvailable": true,
  "releaseDate": "2013-06-04T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "FR", "DE", "ES", "IT", "BR"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.vsco.cam",
    "ios": "https://apps.apple.com/app/vsco-photo-video-editor/id588013838"
  },
  "previousVersions": ["359", "358", "357.1"],
  "media": [
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7mt6KSNE1IQgc6vNlAO7Hp36z_1V7fpOe6I3Lsz8t19VR7pKRzszEk0g&s=10"
    },
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLhg0rXaOOFJn1QwoYWgIzZ1fgZM1vj92sVfEV3R-QNnf7QUi9N14v3wMM&s=10"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=VscoDemo"
    }
  ]
},
    {
  "name": "Edits, una app de Instagram",
  "developer": "Meta",
  "packageName": "com.edits.app",
  "category": "Fotografía",
  "rating": 4.6,
  "size": "75 MB",
  "icon": "https://play-lh.googleusercontent.com/BZSkyLJNJnqp91FtE1iSskcsalt9oJiepU_GEgr_bB5hVg5x8CUzHLoMmc2lNzm16Q=w480-h960",
  "description": "Edits es una app de creación de videos de Instagram que permite convertir ideas en videos fácilmente desde el teléfono. Cuenta con todas las herramientas que necesitas para facilitar tu proceso creativo, todo en un solo lugar.",
  "downloads": "2M+",
  "bannerGradient": "45deg, #FF0000, #0000FF",
  "security": true,
  "version": "1.0",
  "isAvailable": true,
  "releaseDate": "2025-06-01T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "FR", "DE", "ES", "IT", "BR", "MX"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.instagram.basel&pcampaignid=web_share",
    "ios": "https://apps.apple.com/us/app/edits-una-app-de-instagram/id6738967378?l=es-MX"
  },
  "previousVersions": ["0.9", "0.8"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/edits-screenshot1.png"
    },
    {
      "type": "image",
      "url": "https://play-lh.googleusercontent.com/NIEse_gfxOAFPizPGcmkAji5kdGLGQse5tA2yy7JEDynX-1RVhjvxLWRg3JuPfQz5Q=w5120-h2880"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=EditsDemo"
    }
  ]
},
          {
    "name": "Flip",
    "developer": "Flip Fit, Inc.",
    "packageName": "co.flip",
    "category": "Compras",
    "rating": 4.6,
    "size": "85 MB",
    "icon": "https://img.utdstc.com/icon/b2c/5f3/b2c5f3e8b756d80e5efbc15c7c08aaae02a367fa4028d0e897bad6b4c635a460:200",
    "description": "Flip es una aplicación de compras sociales donde los usuarios pueden ver reseñas en video y comprar productos directamente desde la plataforma.",
    "downloads": "4.3K+",
    "bannerGradient": "45deg, #00C853, #008744",
    "security": true,
    "version": "5.3.0",
    "isAvailable": true,
    "releaseDate": "2021-03-12T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=co.flip",
      "ios": "https://apps.apple.com/app/flip-shop-with-your-friends/id1562633109"
    },
    "previousVersions": ["5.2.9", "5.2.5", "5.1.8"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/flip-screenshot1.jpg"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/flip-screenshot2.jpg"
      },
      {
        "type": "video",
        "url": "https://www.youtube.com/watch?v=FlipDemo"
      }
    ]
  },
   {
  "name": "Strava",
  "developer": "Strava Inc.",
  "packageName": "com.strava",
  "category": "Salud y bienestar",
  "rating": 4.6,
  "size": "53 MB",
  "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq6-pAhborcUk1Nz7Pq09HRX56U038t6CmnsfmDM3iWuzFWZ_rE4DzpQvX&s=10",
  "description": "Strava es una aplicación para deportistas que permite registrar actividades como correr, andar en bicicleta, nadar y más, con seguimiento GPS, análisis de rendimiento y funciones sociales.",
  "downloads": "752.8K",
  "bannerGradient": "45deg, #FC4C02, #FF8330",
  "security": true,
  "version": "340.10",
  "isAvailable": true,
  "releaseDate": "2011-05-01T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "FR", "DE", "IT", "ES", "BR"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.strava",
    "ios": "https://apps.apple.com/app/strava-run-ride-swim/id426826309"
  },
  "previousVersions": ["340.9", "339.0", "338.5"],
  "media": [
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5kktkm-uZhBYdx8RfLTrQX7MT1Se_d2n1y69SzlTK0IOuk3Gqo9LFD7xB&s=10"
    },
    {
      "type": "image",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1UJC8CvBmg76ds48nRCV6tKwb_rs5baEXESEax4iaVXzI-vaQo6dUrkC&s=10"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=StravaDemo"
    }
  ]
},
           {
  "name": "X",
  "developer": "X Corp.",
  "packageName": "com.twitter.android",
  "category": "Redes Sociales",
  "rating": 4.8,
  "size": "110 MB",
  "icon": "https://img.freepik.com/vector-gratis/nuevo-diseno-icono-x-logotipo-twitter-2023_1017-45418.jpg",
  "description": "X es una red social donde los usuarios pueden compartir pensamientos, noticias y multimedia en tiempo real a través de publicaciones llamadas 'posts'.",
  "downloads": "159M+",
  "bannerGradient": "45deg, #000000, #1DA1F2",
  "security": true,
  "version": "10.25.0",
  "isAvailable": true,
  "releaseDate": "2006-07-15T00:00:00",
  "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE"],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.twitter.android",
    "ios": "https://apps.apple.com/app/x/id333903271"
  },
  "previousVersions": ["10.24.0", "10.23.1", "10.22.5"],
  "media": [
    {
      "type": "image",
      "url": "https://pbs.twimg.com/media/F0x_example1.jpg"
    },
    {
      "type": "image",
      "url": "https://pbs.twimg.com/media/F0x_example2.jpg"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=twitterDemo"
    }
  ]
},
   {
    "name": "Discord",
    "developer": "Discord Inc.",
    "packageName": "com.discord",
    "category": "Comunicación",
    "rating": 4.5,
    "size": "80 MB",
    "icon": "https://www.svgrepo.com/show/353655/discord-icon.svg",
    "description": "Discord es una plataforma de comunicación diseñada para gamers, comunidades y amigos, que permite chats de texto, voz y video en servidores personalizados.",
    "downloads": "92M+",
    "bannerGradient": "45deg, #7289DA, #424549",
    "security": true,
    "version": "175.15",
    "isAvailable": true,
    "releaseDate": "2015-05-13T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "MX", "BR", "DE", "FR", "JP", "KR"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.discord",
      "ios": "https://apps.apple.com/app/discord-chat-for-gamers/id985746746"
    },
    "previousVersions": ["175.14", "175.13", "175.12"],
    "media": [
      {
        "type": "image",
        "url": "https://example.com/discord_image1.png"
      },
      {
        "type": "image",
        "url": "https://example.com/discord_image2.png"
      },
      {
        "type": "video",
        "url": "https://example.com/discord_video.mp4"
      }
    ]
  },
  {
    "name": "Zoom",
    "developer": "Zoom Video Communications, Inc.",
    "packageName": "us.zoom.videomeetings",
    "category": "Productividad",
    "rating": 4.2,
    "size": "70 MB",
    "icon": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fpng%2F12871376-zoom-logo-in-blue-colors-meetings-app-logotype-illustration&psig=AOvVaw0SMRqWO24OFt4LWB_mKgtF&ust=1747695405896000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCYt_GOro0DFQAAAAAdAAAAABAE",
    "description": "Zoom es una aplicación de videoconferencias que permite a los usuarios realizar reuniones virtuales, webinars y colaborar en tiempo real desde cualquier lugar.",
    "downloads": "9M+",
    "bannerGradient": "45deg, #0B5CFF, #2AB8F6",
    "security": true,
    "version": "5.17.0",
    "isAvailable": true,
    "releaseDate": "2012-09-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "MX", "BR", "DE", "FR", "JP", "KR"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=us.zoom.videomeetings",
      "ios": "https://apps.apple.com/app/zoom-cloud-meetings/id546505307"
    },
    "previousVersions": ["5.16.9", "5.16.8", "5.16.7"],
    "media": [
      {
        "type": "image",
        "url": "https://example.com/zoom_image1.png"
      },
      {
        "type": "image",
        "url": "https://example.com/zoom_image2.png"
      },
      {
        "type": "video",
        "url": "https://example.com/zoom_video.mp4"
      }
    ]
  },
  {
    "name": "Candy Crush Saga",
    "developer": "King",
    "packageName": "com.king.candycrushsaga",
    "category": "Juegos",
    "rating": 4.6,
    "size": "90 MB",
    "icon": "https://images.dwncdn.net/images/t_app-icon-l/p/4e04077a-9b2b-11e6-9532-00163ec9f5fa/669609965/2111_4-77643134-logo",
    "description": "Candy Crush Saga es un juego de rompecabezas adictivo donde los jugadores combinan dulces para superar niveles y ganar recompensas.",
    "downloads": "38.9M+",
    "bannerGradient": "45deg, #FF69B4, #FFD700",
    "security": true,
    "version": "1.275.0.3",
    "isAvailable": true,
    "releaseDate": "2012-11-14T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "MX", "BR", "DE", "FR", "JP", "KR"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.king.candycrushsaga",
      "ios": "https://apps.apple.com/app/candy-crush-saga/id553834731"
    },
    "previousVersions": ["1.274.0.2", "1.273.0.1", "1.272.0.0"],
    "media": [
      {
        "type": "image",
        "url": "https://example.com/candycrush_image1.png"
      },
      {
        "type": "image",
        "url": "https://example.com/candycrush_image2.png"
      },
      {
        "type": "video",
        "url": "https://example.com/candycrush_video.mp4"
      }
    ]
  },
    {
  "name": "Reddit",
  "developer": "reddit inc.",
  "packageName": "com.reddit.frontpage",
  "category": "Utilidades ",
  "rating": null,
  "size": "118.5MB",
  "icon": "https://cdn6.aptoide.com/imgs/0/5/c/05c2271c0e114965490bee7962608507_icon.png?w=128",
  "description": "Reddit es el lugar más diverso de la red, donde gente de todo el mundo se reúne para compartir pasiones, ideas y experiencias, y tener las conversaciones más auténticas e interesantes de Internet.\n\n¿Quieres hacer preguntas, compartir opiniones, pedir un consejo, participar en un debate de política actual, o simplemente pasar el rato viendo memes, bromas y vídeos divertidos? En Reddit encontrarás subreddits para todo lo que puedas imaginar, con la mayor variedad de temas, desde lo más popular a lo más específico: Aquí es donde comunidades de gaming, foros de Internet, deportes, creadores de memes y fandoms se mezclan con streamers, aficionados a las noticias y redes sociales, expertos, profesionales veteranos, artistas y creadores de todo tipo. ¡un foro para cualquier tema que te interese!\n\nCon más de 100.000 comunidades sobre todos los temas que te puedas imaginar, Reddit es la plataforma donde podrás descubrir cosas nuevas. Aquí puedes profundizar sobre aquello que más te interese y debatir sobre cualquier tema a través de distintas comunidades. Siempre hay nuevos temas por explorar y cada experiencia, interés o hobby tiene su espacio en esta comunidad global.\n\n¿Quieres compartir tus opiniones e ideas en un debate, incluso de forma anónima? ¿Necesitas consejo o inspiración? ¿Te apasiona la historia o el fútbol? ¿Eres experto en series de televisión? ¿O buscas un buen meme para enviarle a tus amigos? En Reddit, las posibilidades son infinitas. Cada día, millones de usuarios comparten sus ideas, opiniones e intereses en este increíble foro virtual.",
  "downloads": "12.3M+",
  "bannerGradient": "45deg, #00C853, #008744",
  "security": true,
  "version": "2025.19.0",
  "isAvailable": true,
  "releaseDate": "2004-05-11T00:00:00",
  "allowedCountries": [
    "US",
    "CA",
    "GB",
    "AU",
    "NZ",
    "MX",
    "ES",
    "AR",
    "CO",
    "DO",
    "CU",
    "HN",
    "NI",
    "FR",
    "IT",
    "CN",
    "JP",
    "ID",
    "VN"
  ],
  "platforms": {
    "android": "https://play.google.com/store/apps/details?id=com.reddit.frontpage&pcampaignid=web_share",
    "ios": "https://apps.apple.com/us/app/reddit/id1064216828?l=es-MX"
  },
  "previousVersions": [
    "2025.19.0"
  ],
  "media": [
    {
      "type": "image",
      "url": "https://cdn6.aptoide.com/imgs/e/5/8/e58e11595e3638b5f527ea2a702e9cef_screen.png"
    },
    {
      "type": "image",
      "url": "https://cdn6.aptoide.com/imgs/e/6/9/e6933c11ac7571eaa16866bec5883730_screen.png"
    },
    {
      "type": "image",
      "url": "https://cdn6.aptoide.com/imgs/4/2/7/42718296fc6aeec8f7265f3fd2329ef3_screen.png"
    }
  ]
},
          {
    "name": "Clapper",
    "developer": "Clapper Media Group Inc.",
    "packageName": "com.clapper.video",
    "category": "Redes Sociales",
    "rating": 4.4,
    "size": "347MB",
    "icon": "https://img.utdstc.com/icon/5f4/694/5f46941008be96f49123247309e5d2e280f04a3d108579ea6a39d75974b34ce6:200",
    "description": "Clapper es una plataforma de videos cortos que permite a los usuarios expresarse libremente y compartir contenido sin censura.",
    "downloads": "193K+",
    "bannerGradient": "45deg, #FF6600, #FF3300",
    "security": true,
    "version": "8.8.1",
    "isAvailable": true,
    "releaseDate": "2020-06-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "BR", "MX"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.clapper.video",
      "ios": "https://apps.apple.com/app/clapper/id1516466348"
    },
    "previousVersions": ["2.8.0", "2.7.5", "2.7.1"],
    "media": [
      {
        "type": "image",
        "url": "https://cdn6.aptoide.com/imgs/a/1/d/a1d4ac6417cef6357b5bd3ae88a2f27b_screen.png"
      },
      {
        "type": "image",
        "url": "https://cdn6.aptoide.com/imgs/8/8/b/88bdd486e5194faecad9291b243e071c_screen.png"
      },
      {
        "type": "image",
        "url": "https://cdn6.aptoide.com/imgs/6/d/e/6de1a5c58001c2140fba0d48f4034ce3_screen.png"
      }
    ]
  },
  {
    "name": "VK",
    "developer": "VK.com",
    "packageName": "com.vkontakte.android",
    "category": "Redes Sociales",
    "rating": 4.3,
    "size": "100 MB",
    "icon": "https://img.utdstc.com/icon/ed3/892/ed389254a73efcef2537d5234aa57495563852c43970586b58f836db4284f112:200",
    "description": "VK es una red social popular en Rusia, que permite a los usuarios comunicarse, compartir contenido multimedia y unirse a comunidades.",
    "downloads": "4M+",
    "bannerGradient": "45deg, #0077FF, #0055CC",
    "security": true,
    "version": "9.8.2",
    "isAvailable": true,
    "releaseDate": "2006-10-10T00:00:00",
    "allowedCountries": ["RU", "US", "BY", "KZ", "UA"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.vkontakte.android",
      "ios": "https://apps.apple.com/app/vk-social-network/id564177498"
    },
    "previousVersions": ["9.8.1", "9.7.5", "9.6.3"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/vk-screenshot1.jpg"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/vk-screenshot2.jpg"
      },
      {
        "type": "video",
        "url": "https://www.youtube.com/watch?v=VKDemo"
      }
    ]
  },



  {
    "name": "Call of Duty Mobile",
    "developer": "Activision Publishing, Inc.",
    "packageName": "com.activision.callofduty.shooter",
    "category": "Juegos",
    "rating": 4.3,
    "size": "1.8 GB",
    "icon": "https://img.utdstc.com/icon/398/3aa/3983aa6b3ad0e1723ab331d6ef41c6ceb9bdd0d6c93acb57b4ce352c06ddc01b:200",
    "description": "Call of Duty: Mobile es un juego de disparos en primera persona que ofrece modos multijugador y Battle Royale.",
    "downloads": "43.7M+",
    "bannerGradient": "45deg, #131313, #000000",
    "security": true,
    "version": "1.0.40",
    "isAvailable": true,
    "releaseDate": "2019-10-01T00:00:00",
    "allowedCountries": ["US", "BR", "IN", "MX", "JP", "UK", "DE", "FR", "RU", "KR"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter",
      "ios": "https://apps.apple.com/app/call-of-duty/id1287282214"
    },
    "previousVersions": ["1.0.39", "1.0.38", "1.0.37"],
    "media": [
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/cod-screenshot1.jpg"
      },
      {
        "type": "image",
        "url": "https://play-lh.googleusercontent.com/cod-screenshot2.jpg"
      },
      {
        "type": "video",
        "url": "https://www.youtube.com/watch?v=CODMobileDemo"
      }
    ]
  },

  {
    "name": "Threads",
    "developer": "Meta",
    "packageName": "com.instagram.threads",
    "category": "Redes sociales",
    "rating": 4.0,
    "size": "64.3 MB",
    "icon": "https://cdn.prod.website-files.com/63c5640295a3b83ae7861a3c/64da4f65aad5dfeae27e70c3_Threads%20logo.png",
    "description": "Threads es la nueva app de texto de Instagram. Comparte actualizaciones y únete a conversaciones.",
    "downloads": "79M+",
    "bannerGradient": "45deg, #000000, #333333",
    "security": true,
    "version": "1.0.0",
    "isAvailable": true,
    "releaseDate": "2024-09-15T00:00:00",
    "allowedCountries": ["US", "ES", "MX", "AR", "CO", "PE", "CL"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.instagram.threads",
      "ios": "https://apps.apple.com/us/app/threads-an-instagram-app/id6446901002"
    },
    "previousVersions": [],
    "media": [{
        type: "image",
        "url": "/api/placeholder/200/400"
      },
      {
        "type": "video",
        "url": "dQw4w9WgXcQ"
      },
      {
        "type": "image",
        "url": "/api/placeholder/200/400"
      }
    ]
  },
  {
    "name": "Spotify",
    "developer": "Spotify AB",
    "packageName": "com.spotify.music",
    "category": "Música",
    "rating": 4.4,
    "size": "85 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
    "description": "Spotify es un servicio de streaming de música que te da acceso a millones de canciones, podcasts y videos.",
    "downloads": "1B+",
    "bannerGradient": "45deg, #1DB954, #191414",
    "security": true,
    "version": "8.9.0",
    "isAvailable": true,
    "releaseDate": "2024-01-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.spotify.music",
      "ios": "https://apps.apple.com/us/app/spotify/id324684580"
    },
    "previousVersions": ["8.8.9", "8.8.8", "8.8.7"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "Amazon Prime Video",
    "developer": "Amazon Mobile LLC",
    "packageName": "com.amazon.avod.thirdpartyclient",
    "category": "Entretenimiento",
    "rating": 4.3,
    "size": "95 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/5977/5977575.png",
    "description": "Amazon Prime Video ofrece películas, series y contenido original exclusivo.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #00A8E1, #232F3E",
    "security": true,
    "version": "3.0.320",
    "isAvailable": true,
    "releaseDate": "2024-02-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient",
      "ios": "https://apps.apple.com/us/app/amazon-prime-video/id545519333"
    },
    "previousVersions": ["3.0.319", "3.0.318", "3.0.317"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "Uber",
    "developer": "Uber Technologies, Inc.",
    "packageName": "com.ubercab",
    "category": "Transporte",
    "rating": 4.2,
    "size": "120 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/732/732200.png",
    "description": "Uber es la aplicación de transporte que te conecta con conductores en tu ciudad.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #000000, #5FB709",
    "security": true,
    "version": "4.500.10002",
    "isAvailable": true,
    "releaseDate": "2024-03-10T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.ubercab",
      "ios": "https://apps.apple.com/us/app/uber/id368677368"
    },
    "previousVersions": ["4.499.10002", "4.498.10002", "4.497.10002"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "Airbnb",
    "developer": "Airbnb, Inc.",
    "packageName": "com.airbnb.android",
    "category": "Viajes",
    "rating": 4.5,
    "size": "110 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/2111/2111320.png",
    "description": "Airbnb te permite encontrar alojamientos únicos y experiencias en todo el mundo.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #FF5A5F, #FC642D",
    "security": true,
    "version": "24.02",
    "isAvailable": true,
    "releaseDate": "2024-02-20T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.airbnb.android",
      "ios": "https://apps.apple.com/us/app/airbnb/id401626263"
    },
    "previousVersions": ["24.01", "23.52", "23.51"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "PayPal",
    "developer": "PayPal Mobile",
    "packageName": "com.paypal.android.p2pmobile",
    "category": "Finanzas",
    "rating": 4.6,
    "size": "75 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/174/174861.png",
    "description": "PayPal es una plataforma de pagos digitales que te permite enviar y recibir dinero de forma segura.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #003087, #009CDE",
    "security": true,
    "version": "8.35.0",
    "isAvailable": true,
    "releaseDate": "2024-01-25T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "DE", "FR", "ES", "IT"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.paypal.android.p2pmobile",
      "ios": "https://apps.apple.com/us/app/paypal/id283646709"
    },
    "previousVersions": ["8.34.0", "8.33.0", "8.32.0"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "LinkedIn",
    "developer": "LinkedIn Corporation",
    "packageName": "com.linkedin.android",
    "category": "Redes sociales",
    "rating": 4.3,
    "size": "95 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/174/174857.png",
    "description": "LinkedIn es la red social profesional más grande del mundo para conectar con colegas y encontrar oportunidades.",
    "downloads": "100M+",
    "bannerGradient": "45deg, #0077B5, #00A0DC",
    "security": true,
    "version": "4.1.900",
    "isAvailable": true,
    "releaseDate": "2024-03-01T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.linkedin.android",
      "ios": "https://apps.apple.com/us/app/linkedin/id288429040"
    },
    "previousVersions": ["4.1.899", "4.1.898", "4.1.897"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  },
  {
    "name": "Twitter",
    "developer": "X Corp.",
    "packageName": "com.twitter.android",
    "category": "Redes sociales",
    "rating": 4.1,
    "size": "105 MB",
    "icon": "https://cdn-icons-png.flaticon.com/512/733/733579.png",
    "description": "Twitter es una plataforma de microblogging donde puedes compartir y descubrir lo que está pasando en el mundo.",
    "downloads": "500M+",
    "bannerGradient": "45deg, #1DA1F2, #14171A",
    "security": true,
    "version": "10.25.0",
    "isAvailable": true,
    "releaseDate": "2024-02-15T00:00:00",
    "allowedCountries": ["US", "CA", "GB", "AU", "NZ", "MX", "BR", "IN", "JP", "DE", "FR", "ES"],
    "platforms": {
      "android": "https://play.google.com/store/apps/details?id=com.twitter.android",
      "ios": "https://apps.apple.com/us/app/twitter/id333903271"
    },
    "previousVersions": ["10.24.0", "10.23.0", "10.22.0"],
    "media": [
      {
type: "image", "url": "/api/placeholder/200/400"},
      {
type: "video", "url": "dQw4w9WgXcQ"},
      {
type: "image", "url": "/api/placeholder/200/400"}
    ]
  }
];

// Nueva función para filtrar apps por país
async function filterAppsByCountry(appsToFilter) {
  try {
    const userCountry = await detectCountry();
    return appsToFilter.filter(app => app.allowedCountries.includes(userCountry));
  } catch (error) {
    console.error('Error filtering apps by country:', error);
    return appsToFilter;
  }
}

function parseDownloads(downloads) {
  if (downloads.includes('B+')) {
    return parseFloat(downloads.replace('B+', '')) * 1000000000;
  }
  return parseInt(downloads.replace('M+', '')) * 1000000;
}

function simulateDownload(btn) {
  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = `
    <div class="download-progress">
      <div class="download-bar"></div>
      <span class="download-text">0%</span>
    </div>
  `;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Completado';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 1000);
      }, 500);
    }
    const bar = btn.querySelector('.download-bar');
    const text = btn.querySelector('.download-text');
    if (bar && text) {
      bar.style.width = `${progress}%`;
      text.textContent = `${Math.round(progress)}%`;
    }
  }, 200);
}

function getStoreLink(app) {
  const device = detectDevice();
  if (!app.isAvailable || !isAppReleased(app.releaseDate)) {
    return null;
  }
  if (device === 'ios' && app.platforms.ios) {
    return app.platforms.ios;
  } else if (device === 'android' && app.platforms.android) {
    return app.platforms.android;
  }
  return app.platforms.android || app.platforms.ios;
}

async function displayFeaturedApps() {
  const featuredApps = document.getElementById('featuredApps');
  featuredApps.innerHTML = '';

  // Find upcoming app release
  const upcomingApp = apps.find(app => !isAppReleased(app.releaseDate));

  if (upcomingApp) {
    const appOfDaySection = document.createElement('div');
    appOfDaySection.className = 'app-of-day';
    appOfDaySection.innerHTML = `
      <div class="app-of-day-content">
        <img src="${upcomingApp.icon}" alt="${upcomingApp.name}" class="app-of-day-icon">
        <div class="app-of-day-info">
          <span class="app-of-day-tag">App del Día</span>
          <h2>${upcomingApp.name}</h2>
          <p>¡Próximo lanzamiento!</p>
          <div class="share-buttons">
            <button class="share-button notify-btn">
              <i class="fas fa-bell"></i> Notificar
            </button>
            <button class="share-button share-button share-btn">
              <i class="fas fa-share-alt"></i> Compartir
            </button>
          </div>
        </div>
      </div>
    `;

    appOfDaySection.addEventListener('click', (e) => {
      if (!e.target.classList.contains('share-button')) {
        openAppModalWithAnimation(upcomingApp, appOfDaySection);
      }
    });
    featuredApps.appendChild(appOfDaySection);

    // Add notification functionality
    const notifyBtn = appOfDaySection.querySelector('.notify-btn');
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNotification();
    });

    // Add share functionality
    const shareBtn = appOfDaySection.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareApp(upcomingApp);
    });
  }

  // Filtrar apps por país
  const availableApps = await filterAppsByCountry(apps);

  if (availableApps.length === 0) {
    featuredApps.innerHTML = `
      <div class="no-apps-message">
        <h2>Apps no disponibles</h2>
        <p>Lo sentimos, no hay aplicaciones disponibles en tu región en este momento.</p>
      </div>
    `;
    return;
  }

  const sortedApps = [...availableApps].sort((a, b) => {
    return parseDownloads(b.downloads) - parseDownloads(a.downloads);
  });
  const top10Apps = sortedApps.slice(0, 10);

  const posterSection = document.createElement('section');
  posterSection.innerHTML = `<h2 class="section-title">Top 10 Aplicaciones Destacadas</h2>`;
  const postersContainer = document.createElement('div');
  postersContainer.className = 'app-posters';

  top10Apps.forEach(app => {
    const isReleased = isAppReleased(app.releaseDate);
    const poster = document.createElement('div');
    poster.className = 'app-poster';
    poster.style.background = `linear-gradient(${app.bannerGradient})`;
    poster.setAttribute('data-app-name', app.name);
    poster.innerHTML = `
      <div class="poster-gradient">
        <div class="poster-content">
          <img src="${app.icon}" class="poster-icon" alt="${app.name}">
          <div class="poster-title">${app.name}</div>
          <div class="poster-subtitle">${app.category}</div>
          ${!isReleased ?
            `<div class="coming-soon-badge">Próximamente - ${getTimeUntilRelease(app.releaseDate)}</div>` :
            ''}
        </div>
      </div>
    `;
    poster.addEventListener('click', () => openAppModalWithAnimation(app, poster));
    postersContainer.appendChild(poster);
  });

  posterSection.appendChild(postersContainer);
  featuredApps.appendChild(posterSection);

  // Resto de las secciones con filtrado por país
  [
    {
      title: "Top 10 Últimas Actualizaciones",
      apps: [...availableApps].sort((a, b) => b.version.localeCompare(a.version)).slice(0, 10)
    },
    {
      title: "Top 5 Aplicaciones Más Descargadas",
      apps: [...availableApps].sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads)).slice(0, 5)
    },
    {
      title: "Nuevos Lanzamientos",
      apps: [...availableApps].filter(app => !isAppReleased(app.releaseDate)).slice(0, 5)
    },
    {
  title: "Recomendadas",
  apps: [...availableApps].filter(app => app.rating >= 4.5).slice(0, 5)
},
    {
      title: "Top 10 Redes Sociales",
      apps: availableApps.filter(app => app.category.toLowerCase() === 'redes sociales')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 10)
    },
    {
      title: "Apps de Entretenimiento",
      apps: availableApps.filter(app => app.category === 'Entretenimiento')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    },
    {
      title: "Juegos Populares",
      apps: availableApps.filter(app => app.category === 'Juegos')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 8)
    },
    {
      title: "Apps de Comunicación",
      apps: availableApps.filter(app => app.category === 'Comunicación')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    },
    {
      title: "Apps de Finanzas",
      apps: availableApps.filter(app => app.category === 'Finanzas')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    },
    {
      title: "Apps Educativas",
      apps: availableApps.filter(app => app.category === 'Educación')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    },
    {
      title: "Apps con Mejor Calificación",
      apps: [...availableApps].sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
    },
    {
      title: "Apps Ligeras (Menos de 50MB)",
      apps: availableApps.filter(app => {
        const size = parseInt(app.size);
        return size < 50;
      }).sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 8)
    },
    {
      title: "Apps con Más de 100M Descargas",
      apps: availableApps.filter(app => parseDownloads(app.downloads) >= 100000000)
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 10)
    },
    {
      title: "Apps de Meta",
      apps: availableApps.filter(app => app.developer === 'Meta')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
    },
    {
      title: "Apps de Google",
      apps: availableApps.filter(app => app.developer.includes('Google'))
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
    },
    {
      title: "Apps de ByteDance",
      apps: availableApps.filter(app => app.developer === 'ByteDance')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
    },
    {
      title: "Apps con Seguridad Verificada",
      apps: availableApps.filter(app => app.security === true)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
    },
    {
      title: "Apps Recientemente Actualizadas",
      apps: [...availableApps].sort((a, b) => {
        const dateA = new Date(app.releaseDate || 0);
        const dateB = new Date(app.releaseDate || 0);
        return dateB - dateA;
      }).slice(0, 8)
    },
    {
      title: "Apps de Productividad",
      apps: availableApps.filter(app => app.category === 'Productividad')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    },
    {
      title: "Apps de Música y Audio",
      apps: availableApps.filter(app => app.category === 'Música')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 6)
    },
    {
      title: "Apps de Fotografía",
      apps: availableApps.filter(app => app.category === 'Fotografía')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    },
    {
      title: "Apps de Viajes",
      apps: availableApps.filter(app => app.category === 'Viajes')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    },
    {
      title: "Apps de Transporte",
      apps: availableApps.filter(app => app.category === 'Transporte')
        .sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
        .slice(0, 6)
    },
    {
      title: "Apps Esenciales",
      apps: availableApps.filter(app => 
        ['WhatsApp', 'Instagram', 'YouTube', 'Gmail', 'Google Maps'].includes(app.name)
      ).sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
    },
    {
      title: "Apps para Gamers",
      apps: availableApps.filter(app => 
        app.category === 'Juegos' || ['Discord', 'Twitch', 'Steam'].includes(app.name)
      ).sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    }
  ].forEach(section => {
    if (section.apps.length > 0) {
      const sectionElement = document.createElement('section');
      sectionElement.className = 'category-section';
      sectionElement.innerHTML = `
        <h2 class="section-title">${section.title}</h2>
        <div class="horizontal-scroll">
          ${section.apps.map(app => createAppCard(app)).join('')}
        </div>
      `;
      featuredApps.appendChild(sectionElement);

      // Agregar detectores de click a las apps de esta sección
      setTimeout(() => {
        sectionElement.querySelectorAll('.app-card').forEach(card => {
          if (!card.hasAttribute('data-click-attached')) {
            card.setAttribute('data-click-attached', 'true');
            card.addEventListener('click', (e) => {
              if (!e.target.classList.contains('developer-link')) {
                const appName = card.getAttribute('data-app-name') || 
                               card.querySelector('.app-name')?.textContent.trim();

                if (appName) {
                  const app = apps.find(a => a.name === appName);
                  if (app) {
                    openAppModalWithAnimation(app, card);
                  }
                }
              }
            });
          }
        });
      }, 50);
    }
  });
}

function isVerifiedDeveloper(developer) {
  const devApps = apps.filter(app => app.developer === developer);
  const totalDownloads = devApps.reduce((sum, app) => sum + parseDownloads(app.downloads), 0);
  return devApps.length > 1 && totalDownloads > 3000000;
}

// Nueva función para detectar desarrolladores con múltiples apps pero con menos de 1M por app
function hasMultipleAppsUnderMillion(developer) {
  const devApps = apps.filter(app => app.developer === developer);
  if (devApps.length < 2) return false;

  // Verificar que todas las apps tengan menos de 1 millón de descargas
  const allUnderMillion = devApps.every(app => parseDownloads(app.downloads) < 1000000);
  return allUnderMillion;
}

// Función para obtener el tipo de verificación del desarrollador
function getDeveloperVerificationStatus(developer) {
  if (isVerifiedDeveloper(developer)) {
    return 'verified'; // Insignia azul
  } else if (hasMultipleAppsUnderMillion(developer)) {
    return 'semi-verified'; // Insignia amarilla
  }
  return 'none'; // Sin verificación
}

// Función para obtener mensaje de verificación
function getVerificationMessage(developer) {
  const status = getDeveloperVerificationStatus(developer);
  switch(status) {
    case 'verified':
      return 'Este desarrollador tiene múltiples aplicaciones exitosas con millones de descargas.';
    case 'semi-verified':
      return 'Este desarrollador tiene varias aplicaciones con bajo éxito, pero son descargables y verificadas.';
    default:
      return '';
  }
}

function createAppCard(app) {
  const isReleased = isAppReleased(app.releaseDate);
  const verificationStatus = getDeveloperVerificationStatus(app.developer);
  const cardId = `app-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <div class="app-card" id="${cardId}" data-app-name="${app.name}">
      <div class="app-header">
        <img class="app-icon" src="${app.icon}" alt="${app.name}">
        <div class="app-info">
          <div class="app-name">${app.name}</div>
          <div class="app-developer">
            <span class="developer-link" onclick="event.stopPropagation(); showDeveloperApps('${app.developer}', event)">${app.developer}</span>
            ${verificationStatus === 'verified' ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
            ${verificationStatus === 'semi-verified' ? '<i class="fas fa-check-circle semi-verified-badge"></i>' : ''}
          </div>
          <div class="package-name">${app.packageName || 'No disponible'}</div>
          <div class="rating">
            <span class="stars">★★★★★</span>
            <span>${app.rating}</span>
          </div>
          ${!isReleased ?
            `<div class="coming-soon-tag">Próximamente - ${getTimeUntilRelease(app.releaseDate)}</div>` :
            ''}
        </div>
      </div>
    </div>
  `;
}

async function openAppModal(app) {
  const storeLink = getStoreLink(app);
  const countryCode = await detectCountry();
  const isAvailableInCountry = app.allowedCountries.includes(countryCode);
  const isReleased = isAppReleased(app.releaseDate);

  let availabilityWarning = '';

  if (!isReleased) {
    const timeRemaining = getTimeUntilRelease(app.releaseDate);
    availabilityWarning = `
      <div class="availability-warning coming-soon">
        <i class="fas fa-clock"></i>
        Próximamente - Disponible en ${timeRemaining}
      </div>
    `;
  } else if (!isAvailableInCountry) {
    availabilityWarning = `
      <div class="availability-warning">
        <i class="fas fa-exclamation-triangle"></i>
        Esta aplicación no está disponible en su país (${countryCode}).
      </div>
    `;
  }

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <div class="modal-header-new">
      <div class="app-icon-container">
        <img class="app-icon-new" src="${app.icon}" alt="${app.name}">
      </div>
      <div class="app-info-new">
        <div class="app-name-new">${app.name}</div>
        <div class="app-version">Versión ${app.version}</div>
        <div class="app-developer-new">
          ${app.developer}
          ${getDeveloperVerificationStatus(app.developer) === 'verified' ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
          ${getDeveloperVerificationStatus(app.developer) === 'semi-verified' ? '<i class="fas fa-check-circle semi-verified-badge"></i>' : ''}
        </div>
        <div class="app-category">${app.category}</div>
        <div class="package-name">${app.packageName}</div>
        </div>
    </div>

    <div class="app-details-scroll">
      <div class="detail-item">
        <div class="detail-label">Calificación</div>
        <div class="detail-value">★ ${app.rating}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Tamaño</div>
        <div class="detail-value">${app.size}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Descargas</div>
        <div class="detail-value">${app.downloads}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Versión</div>
        <div class="detail-value">${app.version}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Categoría</div>
        <div class="detail-value">${app.category}</div>
      </div>
    </div>



    <div class="action-container">
      ${isAvailableInCountry && isReleased && storeLink
        ? `<button onclick="simulateDownload(this); setTimeout(() => window.open('${storeLink}', '_blank'), 2500)" class="action-btn primary-btn">
             Descargar ${detectDevice() === 'ios' ? 'en App Store' : 'en Play Store'}
           </button>`
        : `<button class="action-btn primary-btn" disabled>
             ${!isReleased ? 'Próximamente' : 'No disponible'}
           </button>`
      }
      <button class="action-btn secondary-btn" onclick="togglePreviousVersions('${app.name}')">
        Ver versiones anteriores
      </button>
      <button class="action-btn secondary-btn" onclick="shareApp(${JSON.stringify(app).replace(/\"/g, '&quot;')})">
        <i class="fas fa-share-alt"></i> Compartir
      </button>
      <button class="action-btn rating-btn" onclick="toggleRatingSection('${app.name}')">
        <i class="fas fa-star"></i> Calificar
      </button>
    </div>

    <!-- Sección de Calificaciones -->
    <div class="rating-section" id="ratingSection" style="display: none;">
      <div class="rating-header">
        <h3>Califica y comenta</h3>
        <div class="rating-stats">
          <div class="average-rating">
            <span class="rating-number">4.2</span>
            <div class="rating-stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="far fa-star"></i>
            </div>
            <span class="rating-count">(124 calificaciones)</span>
          </div>
        </div>
      </div>

      <!-- Formulario para nueva calificación -->
      <div class="new-rating-form" id="newRatingForm">
        <div class="user-rating-input">
          <h4>Tu calificación:</h4>
          <div class="star-rating-input">
            <i class="fas fa-star rating-star" data-rating="1"></i>
            <i class="fas fa-star rating-star" data-rating="2"></i>
            <i class="fas fa-star rating-star" data-rating="3"></i>
            <i class="fas fa-star rating-star" data-rating="4"></i>
            <i class="fas fa-star rating-star" data-rating="5"></i>
          </div>
          <div class="rating-text">Selecciona una calificación</div>
        </div>

        <div class="comment-input-container">
          <textarea id="ratingComment" placeholder="Escribe tu comentario sobre esta aplicación (opcional)..." maxlength="500"></textarea>
          <div class="comment-actions">
            <span class="char-count" id="ratingCharCount">500</span>
            <button class="submit-rating-btn" id="submitRatingBtn" disabled>
              <i class="fas fa-paper-plane"></i> Publicar Calificación
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de calificaciones existentes -->
      <div class="ratings-list" id="ratingsList">
        <div class="loading-ratings">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando calificaciones...</p>
        </div>
      </div>
    </div>

    ${availabilityWarning}



    ${app.media && app.media.length > 0 ? `
    <div class="media-container">
      <div class="media-wrapper">
        ${app.media.map(item => {
          if (item.type === 'image') {
            return `<img src="${item.url}" alt="Screenshot" class="media-item">`;
          } else {
            return `
              <div class="media-item video" data-video-id="${item.url}">
                <div class="video-overlay">
                  <i class="fas fa-play"></i>
                </div>
                <img src="https://img.youtube.com/vi/${item.url}/0.jpg" alt="Video thumbnail">
              </div>
            `;
          }
        }).join('')}
      </div>
      <div class="carousel-dots">
        ${app.media.map((_, index) => `
          <div class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
        `).join('')}
      </div>
    </div>
  ` : ''}

    <p>${app.description}</p>

    <!-- Similar Apps Section -->
    <div class="similar-apps-section">
      <h3>Apps en la misma categoría</h3>
      <div class="horizontal-scroll">
        ${getSimilarApps(app).map(similarApp => createAppCard(similarApp)).join('')}
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="recommendations-section">
      <h3>Quizás te pueden gustar</h3>
      <div class="horizontal-scroll">
        ${getRecommendedApps(app).map(recApp => createAppCard(recApp)).join('')}
      </div>
    </div>

    ${getVerificationMessage(app.developer) ? `
    <div class="developer-verification">
      <div class="verification-badge">
        <i class="fas fa-check-circle"></i> ${getDeveloperVerificationStatus(app.developer) === 'verified' ? 'Desarrollador Verificado' : 'Desarrollador Verificado'}
      </div>
      <p>${getVerificationMessage(app.developer)}</p>
    </div>
    ` : ''}

    <div class="privacy-policy-section">
      <button class="privacy-btn" onclick="showPrivacyPolicy('${app.name}')">
        <i class="fas fa-shield-alt"></i> Políticas de Privacidad
      </button>
    </div>

    <div class="report-app-section">
      <button class="report-btn" onclick="showReportModal(${JSON.stringify(app).replace(/\"/g, '&quot;')})">
        <i class="fas fa-flag"></i> Reportar Aplicación
      </button>
    </div>

    <div id="privacyModal" class="privacy-modal">
      <div class="privacy-content">
        <div class="privacy-header">
          <h2>Política de Privacidad</h2>
          <button class="close-privacy" onclick="closePrivacyPolicy()">×</button>
        </div>
        <div class="privacy-body">
          <div class="policy-document">
            <div class="document-header">
              <h3>Política de Privacidad de ${app.name}</h3>
              <p class="last-updated">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
              <p class="developer-info">Desarrollado por: ${app.developer}</p>
            </div>

            <div class="policy-section">
              <h4>1. Introducción</h4>
              <p>Esta Política de Privacidad describe cómo ${app.name} ("nosotros", "nuestro" o "la aplicación") recopila, usa, almacena y protege su información personal cuando utiliza nuestra aplicación. Al usar ${app.name}, usted acepta las prácticas descritas en esta política.</p>
            </div>

            <div class="policy-section">
              <h4>2. Información que Recopilamos</h4>
              <h5>2.1 Información Personal</h5>
              <ul>
                <li>Nombre de usuario y información de perfil</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono (cuando se proporciona)</li>
                <li>Foto de perfil (cuando se carga)</li>
              </ul>

              <h5>2.2 Información del Dispositivo</h5>
              <ul>
                <li>Tipo de dispositivo, modelo y sistema operativo</li>
                <li>Identificadores únicos del dispositivo</li>
                <li>Dirección IP y información de red</li>
                <li>Configuraciones de idioma y región</li>
              </ul>

              <h5>2.3 Información de Uso</h5>
              <ul>
                <li>Interacciones con la aplicación</li>
                <li>Funciones utilizadas y frecuencia de uso</li>
                <li>Tiempo de sesión y patrones de navegación</li>
                <li>Preferencias de configuración</li>
              </ul>

              <h5>2.4 Información de Ubicación</h5>
              <ul>
                <li>Ubicación aproximada basada en IP</li>
                <li>Ubicación precisa (solo con su consentimiento explícito)</li>
              </ul>
            </div>

            <div class="policy-section">
              <h4>3. Cómo Utilizamos su Información</h4>
              <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
              <ul>
                <li><strong>Funcionamiento de la Aplicación:</strong> Proporcionar, mantener y mejorar las funcionalidades de ${app.name}</li>
                <li><strong>Personalización:</strong> Adaptar la experiencia del usuario según sus preferencias</li>
                <li><strong>Comunicación:</strong> Enviar notificaciones importantes y actualizaciones</li>
                <li><strong>Análisis:</strong> Comprender cómo se utiliza la aplicación para mejorar los servicios</li>
                <li><strong>Seguridad:</strong> Detectar y prevenir fraudes, abusos y actividades maliciosas</li>
                <li><strong>Cumplimiento Legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </div>

            <div class="policy-section">
              <h4>4. Compartir Información</h4>
              <p>No vendemos ni alquilamos su información personal. Podemos compartir información limitada en las siguientes circunstancias:</p>

              <h5>4.1 Proveedores de Servicios</h5>
              <ul>
                <li>Servicios de análisis y métricas</li>
                <li>Servicios de almacenamiento en la nube</li>
                <li>Proveedores de notificaciones push</li>
                <li>Procesadores de pagos (si aplica)</li>
              </ul>

              <h5>4.2 Requisitos Legales</h5>
              <ul>
                <li>Cuando sea requerido por ley o proceso legal</li>
                <li>Para proteger los derechos y seguridad de los usuarios</li>
                <li>En caso de investigaciones de seguridad</li>
              </ul>

              <h5>4.3 Transferencias Comerciales</h5>
              <p>En caso de fusión, adquisición o venta de activos, su información puede ser transferida como parte de la transacción.</p>
            </div>

            <div class="policy-section">
              <h4>5. Seguridad de Datos</h4>
              <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal:</p>
              <ul>
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Controles de acceso estrictos</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Auditorías de seguridad periódicas</li>
                <li>Capacitación del personal en protección de datos</li>
              </ul>
            </div>

            <div class="policy-section">
              <h4>6. Retención de Datos</h4>
              <p>Conservamos su información personal solo durante el tiempo necesario para los fines descritos en esta política:</p>
              <ul>
                <li>Datos de cuenta: Mientras mantenga una cuenta activa</li>
                <li>Datos de uso: Hasta 24 meses después de la recopilación</li>
                <li>Datos de soporte: Hasta 3 años después de la resolución</li>
                <li>Datos legales: Según lo requiera la legislación aplicable</li>
              </ul>
            </div>

            <div class="policy-section">
              <h4>7. Sus Derechos</h4>
              <p>Usted tiene los siguientes derechos sobre su información personal:</p>
              <ul>
                <li><strong>Acceso:</strong> Solicitar una copia de la información que tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de su información personal</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento en ciertas circunstancias</li>
              </ul>
              <p>Para ejercer estos derechos, contáctenos a través de los medios proporcionados en la sección de contacto.</p>
            </div>

            <div class="policy-section">
              <h4>8. Cookies y Tecnologías Similares</h4>
              <p>Utilizamos cookies y tecnologías similares para:</p>
              <ul>
                <li>Recordar sus preferencias</li>
                <li>Proporcionar funcionalidades personalizadas</li>
                <li>Analizar el uso de la aplicación</li>
                <li>Mejorar la seguridad</li>
              </ul>
              <p>Puede gestionar las preferencias de cookies en la configuración de su dispositivo.</p>
            </div>

            <div class="policy-section">
              <h4>9. Transferencias Internacionales</h4>
              <p>Sus datos pueden ser procesados en países fuera de su jurisdicción. Garantizamos que tales transferencias se realizan con protecciones adecuadas según las leyes aplicables de protección de datos.</p>
            </div>

            <div class="policy-section">
              <h4>10. Menores de Edad</h4>
              <p>${app.name} no está dirigida intencionalmente a menores de 13 años. No recopilamos conscientemente información personal de menores de 13 años. Si descubrimos que hemos recopilado información de un menor, tomaremos medidas para eliminarla.</p>
            </div>

            <div class="policy-section">
              <h4>11. Cambios en la Política</h4>
              <p>Nos reservamos el derecho de actualizar esta Política de Privacidad. Los cambios importantes serán notificados a través de la aplicación o por otros medios apropiados. Le recomendamos revisar esta política periódicamente.</p>
            </div>

            <div class="policy-section">
              <h4>12. Contacto</h4>
              <p>Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos:</p>
              <div class="contact-info">
                <p><strong>Desarrollador:</strong> ${app.developer}</p>
                <p><strong>Aplicación:</strong> ${app.name}</p>
                <p><strong>Versión:</strong> ${app.version}</p>
                <p><strong>Email de soporte:</strong> privacy@${app.developer.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p><strong>Última actualización:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  `;

  document.getElementById('appModal').classList.add('active');
  initializeCarousel();
  initializeVideoPlayers();
}

function initializeCarousel() {
  const container = document.querySelector('.media-container');
  if (!container) return; // Exit if container doesn't exist

  const wrapper = container.querySelector('.media-wrapper');
  const dots = container.querySelectorAll('.carousel-dot');
  const items = container.querySelectorAll('.media-item');
  let currentIndex = 0;
  let startX, currentX;
  let isDragging = false;

  function updateCarousel(index) {
    currentIndex = index;
    const slideWidth = container.querySelector('.media-item').offsetWidth + 15;
    wrapper.style.transform = `translateX(-${slideWidth * index}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function handleTouchStart(e) {
    startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    isDragging = true;
    wrapper.style.transition = 'none';
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
    const diff = currentX - startX;
    const slideWidth = container.querySelector('.media-item').offsetWidth+ 15;
    wrapper.style.transform = `translateX(${-currentIndex * slideWidth + diff}px)`;
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.transition = 'transform 0.3s ease';
    const slideWidth = container.querySelector('.media-item').offsetWidth + 15;
    const diff = currentX - startX;
    if (Math.abs(diff) > slideWidth / 3) {
      if (diff > 0 && currentIndex > 0) {
        updateCarousel(currentIndex - 1);
      } else if (diff < 0 && currentIndex < items.length - 1) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex);
      }
    } else {
      updateCarousel(currentIndex);
    }
  }

  // Eventos táctiles y de mouse
  wrapper.addEventListener('mousedown', handleTouchStart);
  wrapper.addEventListener('touchstart', handleTouchStart);
  wrapper.addEventListener('mousemove', handleTouchMove);
  wrapper.addEventListener('touchmove', handleTouchMove);
  wrapper.addEventListener('mouseup', handleTouchEnd);
  wrapper.addEventListener('touchend', handleTouchEnd);
  wrapper.addEventListener('mouseleave', handleTouchEnd);

  // Click en puntos
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateCarousel(index));
  });

  // Vista completa al hacer clic en imagen
  items.forEach((item, index) => {
    if (!item.classList.contains('video')) {
      item.addEventListener('click', () => {
        const fullscreenView = document.createElement('div');
        fullscreenView.className = 'fullscreen-view';
        fullscreenView.innerHTML = `
          <div class="fullscreen-content">
            <img src="${item.src}" alt="Fullscreen">
            <div class="fullscreen-nav">
              ${index > 0 ? '<button class="nav-prev">❮</button>' : ''}
              ${index < items.length - 1 ? '<button class="nav-next">❯</button>' : ''}
            </div>
            <button class="close-fullscreen">✕</button>
          </div>
        `;
        document.body.appendChild(fullscreenView);

        const closeBtn = fullscreenView.querySelector('.close-fullscreen');
        const prevBtn = fullscreenView.querySelector('.nav-prev');
        const nextBtn = fullscreenView.querySelector('.nav-next');

        closeBtn.addEventListener('click', () => fullscreenView.remove());
        if (prevBtn) prevBtn.addEventListener('click', () => {
          const prevItem = items[index - 1];
          if (!prevItem.classList.contains('video')) {
            fullscreenView.querySelector('img').src = prevItem.src;
          }
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
          const nextItem = items[index + 1];
          if (!nextItem.classList.contains('video')) {
            fullscreenView.querySelector('img').src = nextItem.src;
          }
        });
      });
    }
  });
}

function initializeVideoPlayers() {
  const videoItems = document.querySelectorAll('.media-item.video');
  videoItems.forEach(item => {
    const overlay = item.querySelector('.video-overlay');
    const videoId = item.dataset.videoId;
    overlay.addEventListener('click', () => {
      item.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    });
  });
}

function showVersionsSection(app) {
  // Cerrar modal actual
  document.getElementById('appModal').classList.remove('active');

  // Crear modal de versiones
  const versionsModal = document.createElement('div');
  versionsModal.className = 'versions-modal';
  versionsModal.id = 'versionsModal';
  versionsModal.innerHTML = `
    <div class="versions-content">
      <div class="versions-header">
        <h2>Versiones de ${app.name}</h2>
        <button class="close-versions" onclick="closeVersionsModal()">×</button>
      </div>
      <div class="versions-body">
        <div class="current-version-info">
          <h3>Versión Actual</h3>
          <div class="version-card current">
            <div class="version-header">
              <span class="version-number">${app.version}</span>
              <span class="version-badge current-badge">Actual</span>
            </div>
            <div class="version-details">
              <span><i class="fas fa-calendar"></i> Hace 2 días</span>
              <span><i class="fas fa-download"></i> ${app.size}</span>
            </div>
          </div>
        </div>

        <div class="previous-versions-list">
          <h3>Versiones Anteriores</h3>
          ${app.previousVersions.map(version => `
            <div class="version-card">
              <div class="version-header">
                <input type="checkbox" class="version-checkbox" data-version="${version}">
                <span class="version-number">${version}</span>
                <div class="version-actions">
                  <button class="version-action-btn download-btn" onclick="downloadVersion('${app.name}', '${version}')">
                    <i class="fas fa-download"></i>
                  </button>
                  <button class="version-action-btn delete-btn" onclick="deleteVersion('${app.name}', '${version}', this)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <div class="version-details">
                <span><i class="fas fa-calendar"></i> ${getRandomDate()}</span>
                <span><i class="fas fa-file-archive"></i> ${getRandomSize()}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="versions-actions">
          <button class="bulk-action-btn" onclick="selectAllVersions()">
            <i class="fas fa-check-square"></i> Seleccionar Todo
          </button>
          <button class="bulk-action-btn" onclick="deselectAllVersions()">
            <i class="fas fa-square"></i> Deseleccionar Todo
          </button>
          <button class="bulk-action-btn delete-selected" onclick="deleteSelectedVersions('${app.name}')" disabled>
            <i class="fas fa-trash-alt"></i> Eliminar Seleccionadas (0)
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(versionsModal);
  document.body.style.overflow = 'hidden';
}

function togglePreviousVersions(appName) {
  const app = apps.find(a => a.name === appName);
  if (!app) return;

  // Cerrar el modal actual de la app
  document.getElementById('appModal').classList.remove('active');

  // Mostrar la nueva sección de versiones
  showVersionsSection(app);
}

function backToAppFromVersions(appName) {
  const app = apps.find(a => a.name === appName);
  if (!app) return;

  // Ocultar sección de versiones
  const versionsSection = document.getElementById('versionsSection');
  if (versionsSection) {
    versionsSection.style.display = 'none';
  }

  // Mostrar la sección principal
  document.getElementById('featuredApps').style.display = 'block';

  // Reabrir el modal de la app
  openAppModal(app);
}

function closeVersionsModal() {
  const modal = document.getElementById('versionsModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
}

function downloadVersion(appName, version) {
  const btn = event.target.closest('.download-btn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1000);
  }, 2000);
}

function deleteVersion(appName, version, button) {
  if (confirm(`¿Estás seguro de que quieres eliminar la versión ${version}?`)) {
    const versionCard = button.closest('.version-card, .version-card-new');
    versionCard.classList.add('deleting');

    setTimeout(() => {
      // Remover de la array de versiones
      const app = apps.find(a => a.name === appName);
      if (app) {
        app.previousVersions = app.previousVersions.filter(v => v !== version);
      }
      versionCard.remove();

      // Mostrar notificación
      showDeleteNotification(`Versión ${version} eliminada`);
    }, 500);
  }
}

function selectAllVersions() {
  const checkboxes = document.querySelectorAll('.version-checkbox, .version-checkbox-new');
  checkboxes.forEach(checkbox => checkbox.checked = true);
  updateSelectedCount();
}

function deselectAllVersions() {
  const checkboxes = document.querySelectorAll('.version-checkbox, .version-checkbox-new');
  checkboxes.forEach(checkbox => checkbox.checked = false);
  updateSelectedCount();
}

function deleteSelectedVersions(appName) {
  const selectedCheckboxes = document.querySelectorAll('.version-checkbox:checked, .version-checkbox-new:checked');

  if (selectedCheckboxes.length === 0) {
    alert('No hay versiones seleccionadas para eliminar.');
    return;
  }

  if (confirm(`¿Estás seguro de que quieres eliminar ${selectedCheckboxes.length} versión(es)?`)) {
    const app = apps.find(a => a.name === appName);

    selectedCheckboxes.forEach(checkbox => {
      const version = checkbox.dataset.version;
      const versionCard = checkbox.closest('.version-card, .version-card-new');
      versionCard.classList.add('deleting');

      setTimeout(() => {
        if (app) {
          app.previousVersions = app.previousVersions.filter(v => v !== version);
        }
        versionCard.remove();
      }, 500);
    });

    showDeleteNotification(`${selectedCheckboxes.length} versiones eliminadas`);
  }
}

function updateSelectedCount() {
  const selectedCount = document.querySelectorAll('.version-checkbox:checked, .version-checkbox-new:checked').length;
  const deleteBtn = document.querySelector('.delete-selected, .delete-selected-new');
  if (deleteBtn) {
    deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Eliminar Seleccionadas (${selectedCount})`;
    deleteBtn.disabled = selectedCount === 0;
  }
}

function showDeleteNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'delete-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function getRandomDate() {
  const dates = ['Hace 2 días', 'Hace 1 semana', 'Hace 2 semanas', 'Hace 1 mes', 'Hace 2 meses'];
  return dates[Math.floor(Math.random() * dates.length)];
}

function getRandomSize() {
  const sizes = ['45.2 MB', '48.1 MB', '42.8 MB', '50.3 MB', '44.7 MB'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

// Event listeners para los checkboxes
document.addEventListener('change', (e) => {
  if (e.target.classList.contains('version-checkbox') || e.target.classList.contains('version-checkbox-new')) {
    updateSelectedCount();
  }
});

function showDeveloperApps(developer, event) {
  event.stopPropagation();
  const developerModal = document.getElementById('developerModal');
  const developerApps = document.getElementById('developerApps');
  const developerAppList = apps.filter(app => app.developer === developer);
  developerApps.innerHTML = developerAppList.map(app => createAppCard(app)).join('');
  developerModal.style.display = 'block';
}

// Función mejorada para mostrar apps filtradas
async function displayApps(appsToDisplay) {
  const appsContainer = document.getElementById('appsContainer');
  const featuredApps = document.getElementById('featuredApps');

  // Filtrar por país
  const availableApps = await filterAppsByCountry(appsToDisplay);

  if (availableApps.length > 0) {
    featuredApps.style.display = 'none';
    appsContainer.style.display = 'block';
    appsContainer.innerHTML = '';
    availableApps.forEach(app => {
      const appCardDiv = document.createElement('div');
      appCardDiv.innerHTML = createAppCard(app);
      const appCard = appCardDiv.firstElementChild;

      appCard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('developer-link')) {
          openAppModalWithAnimation(app, appCard);
        }
      });
      appsContainer.appendChild(appCard);
    });
  } else {
    appsContainer.innerHTML = `
      <div class="no-apps-message">
        <h2>No se encontraron aplicaciones</h2>
        <p>No hay aplicaciones disponibles en tu región que coincidan con tu búsqueda.</p>
      </div>
    `;
    appsContainer.style.display = 'block';
    featuredApps.style.display = 'none';
  }
}

// Event Listeners
// Add loading animation during search
// Nueva funcionalidad de búsqueda
const searchSection = document.getElementById('searchSection');
const searchInputNew = document.getElementById('searchInputNew');
const backSearchBtn = document.getElementById('backSearchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const searchResults = document.getElementById('searchResults');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const noResults = document.getElementById('noResults');
const resultsCount = document.getElementById('resultsCount');

// Abrir sección de búsqueda
document.querySelector('.search-toggle').addEventListener('click', () => {
    searchSection.classList.add('active');
    setTimeout(() => searchInputNew.focus(), 400);
});

// Cerrar sección de búsqueda
backSearchBtn.addEventListener('click', () => {
    searchSection.classList.remove('active');
    searchInputNew.value = '';
    clearSearchBtn.classList.remove('show');
    searchSuggestions.style.display = 'block';
    searchResults.style.display = 'none';
    noResults.style.display = 'none';
});

// Limpiar búsqueda
clearSearchBtn.addEventListener('click', () => {
    searchInputNew.value = '';
    clearSearchBtn.classList.remove('show');
    searchSuggestions.style.display = 'block';
    searchResults.style.display = 'none';
    noResults.style.display = 'none';
    searchInputNew.focus();
});

// Búsqueda en tiempo real
searchInputNew.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();
    
    // Mostrar/ocultar botón de limpiar
    if (searchTerm) {
        clearSearchBtn.classList.add('show');
    } else {
        clearSearchBtn.classList.remove('show');
        searchSuggestions.style.display = 'block';
        searchResults.style.display = 'none';
        noResults.style.display = 'none';
        return;
    }
    
    // Filtrar aplicaciones
    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Mostrar resultados
    searchSuggestions.style.display = 'none';
    
    if (filteredApps.length > 0) {
        searchResults.style.display = 'block';
        noResults.style.display = 'none';
        resultsCount.textContent = filteredApps.length;
        
        searchResultsGrid.innerHTML = filteredApps.map(app => `
            <div class="search-result-card" data-app-name="${app.name}">
                <img src="${app.icon}" alt="${app.name}" class="search-result-icon" onerror="this.src='https://via.placeholder.com/56x56?text=${app.name.charAt(0)}'">
                <div class="search-result-info">
                    <div class="search-result-name">${app.name}</div>
                    <div class="search-result-developer">${app.developer}</div>
                    <span class="search-result-category">${app.category}</span>
                </div>
            </div>
        `).join('');
        
        // Agregar event listeners a los resultados
        document.querySelectorAll('.search-result-card').forEach(card => {
            card.addEventListener('click', () => {
                const appName = card.getAttribute('data-app-name');
                const app = apps.find(a => a.name === appName);
                if (app) {
                    searchSection.classList.remove('active');
                    openAppModalWithAnimation(app, card);
                }
            });
        });
    } else {
        searchResults.style.display = 'none';
        noResults.style.display = 'block';
    }
});

// Chips de sugerencias
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const category = chip.getAttribute('data-category');
        searchInputNew.value = category;
        searchInputNew.dispatchEvent(new Event('input'));
    });
});

document.getElementById('backButton').addEventListener('click', () => {
  document.getElementById('appModal').classList.remove('active');
});

document.getElementById('closeDeveloperModal').addEventListener('click', () => {
  document.getElementById('developerModal').style.display = 'none';
});

function showPrivacyPolicy(appName) {
  const modal = document.getElementById('privacyModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closePrivacyPolicy() {
  const modal = document.getElementById('privacyModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Funciones para el sistema de calificaciones
let currentAppForRating = null;
let selectedRating = 0;

function toggleRatingSection(appName) {
  const ratingSection = document.getElementById('ratingSection');
  currentAppForRating = appName;

  if (ratingSection.style.display === 'none') {
    ratingSection.style.display = 'block';
    loadRatingsForApp(appName);
    ratingSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    ratingSection.style.display = 'none';
  }
}

function initializeRatingSystem() {
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingText = document.querySelector('.rating-text');
  const submitBtn = document.getElementById('submitRatingBtn');
  const commentTextarea = document.getElementById('ratingComment');
  const charCount = document.getElementById('ratingCharCount');

  // Manejo de estrellas
  ratingStars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
      highlightStars(index + 1);
    });

    star.addEventListener('click', () => {
      selectedRating = index + 1;
      setRatingText(selectedRating);
      updateSubmitButton();
    });
  });

  // Resetear estrellas al salir
  document.querySelector('.star-rating-input').addEventListener('mouseleave', () => {
    highlightStars(selectedRating);
  });

  // Contador de caracteres
  commentTextarea.addEventListener('input', () => {
    const remaining = 500 - commentTextarea.value.length;
    charCount.textContent = remaining;
    updateSubmitButton();
  });

  // Enviar calificación
  submitBtn.addEventListener('click', () => {
    if (selectedRating > 0) {
      submitRating();
    }
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.className = 'fas fa-star rating-star active';
    } else {
      star.className = 'far fa-star rating-star';
    }
  });
}

function setRatingText(rating) {
  const texts = {
    1: 'Muy malo',
    2: 'Malo', 
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente'
  };
  document.querySelector('.rating-text').textContent = texts[rating];
}

function updateSubmitButton() {
  const submitBtn = document.getElementById('submitRatingBtn');
  submitBtn.disabled = selectedRating === 0;
}

function submitRating() {
  const comment = document.getElementById('ratingComment').value;
  const rating = {
    appName: currentAppForRating,
    rating: selectedRating,
    comment: comment,
    timestamp: new Date().toISOString(),
    user: 'Usuario Actual', // Esto debería venir del sistema de usuarios
    replies: []
  };

  // Guardar en Firebase (implementar después)
  saveRatingToFirebase(rating);

  // Resetear formulario
  selectedRating = 0;
  document.getElementById('ratingComment').value = '';
  document.getElementById('ratingCharCount').textContent = '500';
  document.querySelector('.rating-text').textContent = 'Selecciona una calificación';
  highlightStars(0);
  updateSubmitButton();

  // Recargar calificaciones
  loadRatingsForApp(currentAppForRating);
}

function loadRatingsForApp(appName) {
  const ratingsList = document.getElementById('ratingsList');

  // Mostrar cargando
  ratingsList.innerHTML = `
    <div class="loading-ratings">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Cargando calificaciones...</p>
    </div>
  `;

  // Cargar desde Firebase (implementar después)
  setTimeout(() => {
    displaySampleRatings();
  }, 1000);
}

function displaySampleRatings() {
  const ratingsList = document.getElementById('ratingsList');

  ratingsList.innerHTML = `
    <div class="no-ratings">
      <i class="fas fa-star-half-alt"></i>
      <p>No hay calificaciones aún</p>
      <p class="no-ratings-subtitle">Sé el primero en calificar esta aplicación</p>
    </div>
  `;
}

function generateStarDisplay(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

function likeRating(button) {
  const icon = button.querySelector('i');
  const count = button.querySelector('span');
  const currentCount = parseInt(count.textContent);

  if (icon.classList.contains('far')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    count.textContent = currentCount + 1;
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    count.textContent = currentCount - 1;
  }
}

function toggleReply(button) {
  const ratingItem = button.closest('.rating-item');
  const replyForm = ratingItem.querySelector('.reply-form');

  if (replyForm.style.display === 'none') {
    replyForm.style.display = 'block';
    replyForm.querySelector('textarea').focus();
  } else {
    replyForm.style.display = 'none';
  }
}

function cancelReply(button) {
  const replyForm = button.closest('.reply-form');
  replyForm.style.display = 'none';
  replyForm.querySelector('textarea').value = '';
}

function submitReply(button) {
  const replyForm = button.closest('.reply-form');
  const textarea = replyForm.querySelector('textarea');
  const replyText = textarea.value.trim();

  if (replyText) {
    // Aquí se guardaría en Firebase
    console.log('Respuesta:', replyText);

    // Resetear formulario
    textarea.value = '';
    replyForm.style.display = 'none';

    // Recargar calificaciones para mostrar la nueva respuesta
    loadRatingsForApp(currentAppForRating);
  }
}

// Placeholder para Firebase
function saveRatingToFirebase(rating) {
  console.log('Guardando calificación:', rating);
  // Implementar conexión Firebase después
}

// Close privacy policy modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('privacyModal');
  if (e.target === modal) {
    closePrivacyPolicy();
  }
});

document.getElementById('developerModal').addEventListener('click', (e) => {
  if (e.target.id === 'developerModal') {
    document.getElementById('developerModal').style.display = 'none';
  }
});

// Estilos CSS
const styles = `
.coming-soon {
    background-color: #4a90e2;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.coming-soon i {
    font-size: 1.2em;
}

.coming-soon-badge {
    background-color: #4a90e2;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    margin-top: 5px;
}

.coming-soon-tag {
    background-color: #4a90e2;
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.75em;
    margin-top: 5px;
    display: inline-block;
}

.app-card:hover .coming-soon-tag {
    background-color: #357abd;
}

.media-container {
    position: relative;
    overflow: hidden;
    margin: 20px 0;
}

.media-wrapper {
    display: flex;
    transition: transform 0.3s ease;
    gap: 15px;
}

.media-item {
    flex: 0 0 auto;
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ddd;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.carousel-dot.active {
    background-color: #4a90e2;
}

.availability-warning {
    background-color: #ff4444;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.availability-warning.coming-soon {
    background-color: #4a90e2;
}

.action-btn[disabled] {
    background-color: #cccccc;
    cursor: not-allowed;
}

.no-apps-message {
    text-align: center;
    padding: 40px 20px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 20px 0;
}

.no-apps-message h2 {
    color: #333;
    margin-bottom: 10px;
}

.no-apps-message p {
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}

/* Rating System Styles */
.rating-system {
  margin-bottom: 20px;
}

.star-rating {
  display: flex;
}

.star {
  font-size: 2em;
  cursor: pointer;
  color: #ccc; /* Default color */
}

.star:hover,
.star.active {
  color: gold; /* Hover and active color */
}

#ratingStats {
  margin-top: 10px;
  font-style: italic;
}
`;

// Agregar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Dark Mode Functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// FAQ Functions
function showFaqSupport() {
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('faqModal').style.display = 'block';
}

function showFaqArticle(articleId) {
    if (articleId === 'about') {
        document.getElementById('beappInfoModal').style.display = 'block';
        document.getElementById('faqModal').style.display = 'none';
    }
}

// FAQ Search
document.getElementById('faqSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const text = item.querySelector('h3').textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
});



// === SISTEMA DE REPORTE DE APLICACIONES ===

let currentReportApp = null;
let selectedReportReason = null;
let uploadedReportImages = [];

// Lista de razones predefinidas para reportar
const reportReasons = [
    {
        id: 'inappropriate',
        icon: 'fas fa-exclamation-triangle',
        title: 'Contenido Inapropiado',
        description: 'La aplicación contiene contenido ofensivo, violento o inapropiado'
    },
    {
        id: 'fake',
        icon: 'fas fa-mask',
        title: 'Aplicación Falsa',
        description: 'Esta aplicación parece ser una copia o imitación de otra aplicación'
    },
    {
        id: 'malware',
        icon: 'fas fa-virus',
        title: 'Posible Malware',
        description: 'Sospecho que esta aplicación puede contener software malicioso'
    },
    {
        id: 'privacy',
        icon: 'fas fa-user-secret',
        title: 'Violación de Privacidad',
        description: 'La aplicación recopila datos personales sin consentimiento'
    },
    {
        id: 'copyright',
        icon: 'fas fa-copyright',
        title: 'Infracción de Derechos de Autor',
        description: 'La aplicación viola derechos de autor o propiedad intelectual'
    },
    {
        id: 'spam',
        icon: 'fas fa-ban',
        title: 'Spam o Publicidad Excesiva',
        description: 'La aplicación muestra demasiados anuncios o comportamiento de spam'
    },
    {
        id: 'broken',
        icon: 'fas fa-bug',
        title: 'No Funciona Correctamente',
        description: 'La aplicación tiene errores graves o no funciona como se describe'
    },
    {
        id: 'other',
        icon: 'fas fa-ellipsis-h',
        title: 'Otros',
        description: 'Otro motivo no listado anteriormente'
    }
];

function showReportModal(app) {
    currentReportApp = app;
    selectedReportReason = null;
    uploadedReportImages = [];

    // Crear el modal si no existe
    if (!document.getElementById('reportModal')) {
        createReportModal();
    }

    // Actualizar información de la app
    updateReportAppInfo(app);

    // Mostrar modal
    const modal = document.getElementById('reportModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset form
    resetReportForm();
}

function createReportModal() {
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.id = 'reportModal';

    modal.innerHTML = `
        <div class="report-content">
            <div class="report-header">
                <div class="report-title-section">
                    <div class="report-icon">
                        <i class="fas fa-flag"></i>
                    </div>
                    <div>
                        <h2>Reportar Aplicación</h2>
                        <div class="report-subtitle">Ayúdanos a mantener la seguridad de la plataforma</div>
                    </div>
                </div>
                <button class="close-report" onclick="closeReportModal()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>

            <div class="report-body">
                <!-- Información de la App -->
                <div class="app-info-report" id="reportAppInfo">
                    <!-- Se llena dinámicamente -->
                </div>

                <!-- Lista de Razones -->
                <div class="report-reasons">
                    <h3><i class="fas fa-list-alt"></i> ¿Por qué quieres reportar esta aplicación?</h3>
                    <div id="reasonsList">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>

                <!-- Formulario Personalizado -->
                <div class="custom-report-form" id="customReportForm">
                    <h4><i class="fas fa-edit"></i> Describe el problema</h4>

                    <div class="description-group">
                        <label>
                            Descripción del problema
                            <span class="word-counter" id="wordCounter">12 palabras restantes</span>
                        </label>
                        <textarea 
                            class="description-textarea" 
                            id="reportDescription" 
                            placeholder="Describe brevemente el problema con esta aplicación..."
                            maxlength="200"></textarea>
                    </div>

                    <div class="images-upload-section">
                        <h5><i class="fas fa-images"></i> Subir evidencia (máximo 2 imágenes)</h5>
                        <div class="upload-area" onclick="document.getElementById('reportImages').click()">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div class="upload-text">Haz clic aquí para subir imágenes</div>
                            <div class="upload-subtext">PNG, JPG hasta 5MB cada una</div>
                        </div>
                        <input type="file" id="reportImages" class="file-input" multiple accept="image/*" onchange="handleImageUpload(event)">
                        <div class="uploaded-images" id="uploadedImages"></div>
                    </div>
                </div>
            </div>

            <div class="report-actions">
                <button class="cancel-report-btn" onclick="closeReportModal()">
                    Cancelar
                </button>
                <button class="submit-report-btn" id="submitReportBtn" onclick="submitReport()" disabled>
                    Enviar Reporte
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Generar lista de razones
    generateReasonsList();

    // Agregar event listeners
    setupReportEventListeners();
}

function generateReasonsList() {
    const reasonsList = document.getElementById('reasonsList');
    reasonsList.innerHTML = reportReasons.map(reason => `
        <div class="reason-item" data-reason-id="${reason.id}" onclick="selectReportReason('${reason.id}')">
            <div class="reason-icon">
                <i class="${reason.icon}"></i>
            </div>
            <div class="reason-text">
                <div class="reason-title">${reason.title}</div>
                <div class="reason-description">${reason.description}</div>
            </div>
            <div class="selection-indicator"></div>
        </div>
    `).join('');}

function setupReportEventListeners() {
    const textarea = document.getElementById('reportDescription');
    const wordCounter = document.getElementById('wordCounter');

    textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
        const remainingWords = Math.max(0, 12 - words.length);

        wordCounter.textContent = `${remainingWords} palabras restantes`;
        wordCounter.className = remainingWords === 0 ? 'word-counter warning' : 'word-counter';

        textarea.className = words.length > 12 ? 'description-textarea error' : 'description-textarea';

        updateSubmitButtonState();
    });

    // Drag and drop para imágenes
    const uploadArea = document.querySelector('.upload-area');

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleImageFiles(files);
    });
}

function selectReportReason(reasonId) {
    // Remover selección anterior
    document.querySelectorAll('.reason-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Seleccionar nueva razón
    const reasonElement = document.querySelector(`[data-reason-id="${reasonId}"]`);
    reasonElement.classList.add('selected');
    selectedReportReason = reasonId;

    // Mostrar/ocultar formulario personalizado
    const customForm = document.getElementById('customReportForm');
    if (reasonId === 'other') {
        customForm.classList.add('active');
    } else {
        customForm.classList.remove('active');
        // Reset custom form
        document.getElementById('reportDescription').value = '';
        document.getElementById('wordCounter').textContent = '12 palabras restantes';
        uploadedReportImages = [];
        updateUploadedImagesDisplay();
    }

    updateSubmitButtonState();
}

function handleImageUpload(event) {
    const files = event.target.files;
    handleImageFiles(files);
}

function handleImageFiles(files) {
    const maxImages = 2;
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length && uploadedReportImages.length < maxImages; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
            showReportNotification('Solo se permiten archivos de imagen', true);
            continue;
        }

        if (file.size > maxSize) {
            showReportNotification('La imagen es demasiado grande (máximo 5MB)', true);
            continue;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedReportImages.push({
                file: file,
                dataUrl: e.target.result,
                name: file.name
            });
            updateUploadedImagesDisplay();
            updateSubmitButtonState();
        };
        reader.readAsDataURL(file);
    }

    // Reset input
    event.target.value = '';
}

function updateUploadedImagesDisplay() {
    const container = document.getElementById('uploadedImages');
    container.innerHTML = uploadedReportImages.map((image, index) => `
        <div class="uploaded-image">
            <img src="${image.dataUrl}" alt="${image.name}">
            <button class="remove-image" onclick="removeReportImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeReportImage(index) {
    uploadedReportImages.splice(index, 1);
    updateUploadedImagesDisplay();
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submitReportBtn');
    const isValid = selectedReportReason && (
        selectedReportReason !== 'other' || 
        (isValidDescription() && uploadedReportImages.length > 0)
    );

    submitBtn.disabled = !isValid;
}

function isValidDescription() {
    const textarea = document.getElementById('reportDescription');
    const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > 0 && words.length <= 12;
}

function updateReportAppInfo(app) {
    const container = document.getElementById('reportAppInfo');
    container.innerHTML = `
        <img src="${app.icon}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${app.name.charAt(0)}'">
        <div>
            <h3>${app.name}</h3>
            <p>Desarrollado por ${app.developer} • ${app.category}</p>
        </div>
    `;
}

function resetReportForm() {
    selectedReportReason = null;
    uploadedReportImages = [];

    document.querySelectorAll('.reason-item').forEach(item => {
        item.classList.remove('selected');
    });

    const customForm = document.getElementById('customReportForm');
    customForm.classList.remove('active');

    document.getElementById('reportDescription').value = '';
    document.getElementById('wordCounter').textContent = '12 palabras restantes';
    document.getElementById('wordCounter').className = 'word-counter';

    updateUploadedImagesDisplay();
    updateSubmitButtonState();
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetReportForm();
}

function submitReport() {
    if (!selectedReportReason) return;

    // Mostrar overlay de carga
    showLoadingOverlay();

    // Simular envío del reporte
    setTimeout(() => {
        hideLoadingOverlay();
        showSuccessOverlay();
        closeReportModal();
    }, 3000);
}

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay active';
    overlay.id = 'loadingOverlay';

    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">Enviando reporte...</div>
            <div class="loading-subtext">Por favor espera mientras procesamos tu reporte</div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function showSuccessOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay active';
    overlay.id = 'successOverlay';

    overlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <div class="success-title">¡Reporte Enviado!</div>
            <div class="success-message">
                Gracias por ayudarnos a mantener la seguridad de la plataforma. 
                Revisaremos tu reporte y haremos lo posible por resolver el problema.
            </div>
            <button class="close-success-btn" onclick="closeSuccessOverlay()">
                Entendido
            </button>
        </div>
    `;

    document.body.appendChild(overlay);
}

function closeSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function showReportNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification-popup show';
    notification.style.background = isError ? '#ff4444' : '#4CAF50';
    notification.innerHTML = `
        <i class="fas fa-${isError ? 'exclamation-triangle' : 'check'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función global para mostrar el modal de reporte
window.showReportModal = showReportModal;
window.closeReportModal = closeReportModal;

// Función para el menú lateral usando el nuevo botón
document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);

// Settings Modal Functions
document.getElementById('settingsIcon').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'block';
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'none';
});

function showBeappInfo() {
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('beappInfoModal').style.display = 'block';
}

function backToSettings() {
    document.getElementById('beappInfoModal').style.display = 'none';
    document.getElementById('settingsModal').style.display = 'block';
}

// Websites data
const websites = [
  {
    name: "Google",
    url: "https://www.google.com",
    icon: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
    category: "Search Engine",
    developer: "Google LLC",
    description: "The world's most popular search engine.",
    rating: 4.8
  },
  {
    name: "Wikipedia",
    url: "https://www.wikipedia.org",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111728.png",
    category: "Encyclopedia",
    developer: "Wikimedia Foundation",
    description: "The free online encyclopedia.",
    rating: 4.6
  },
  {
    name: "GitHub",
    url: "https://github.com",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733609.png",
    category: "Development",
    developer: "GitHub Inc.",
    description: "Development platform for hosting and collaborating on code.",
    rating: 4.7
  }
];

// Web Apps data - Apps que se pueden abrir en tiempo real
const webApps = [
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    category: "Redes Sociales",
    developer: "Meta",
    description: "Red social para compartir fotos y videos.",
    rating: 4.5
  },
  {
    name: "Twitter/X",
    url: "https://twitter.com",
    icon: "https://img.freepik.com/vector-gratis/nuevo-diseno-icono-x-logotipo-twitter-2023_1017-45418.jpg",
    category: "Redes Sociales",
    developer: "X Corp.",
    description: "Plataforma de microblogging y redes sociales.",
    rating: 4.2
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjX5LVxRxYR6uDz_MyBLBgi6ihUSOBsm4g_XUvyBwt4b6INTXV2THSdouK&s=10",
    category: "Entretenimiento",
    developer: "Google LLC",
    description: "Plataforma de videos y streaming.",
    rating: 4.6
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    category: "Redes Sociales",
    developer: "Meta",
    description: "La red social más grande del mundo.",
    rating: 4.1
  },
  {
    name: "Discord",
    url: "https://discord.com/app",
    icon: "https://www.svgrepo.com/show/353655/discord-icon.svg",
    category: "Comunicación",
    developer: "Discord Inc.",
    description: "Plataforma de comunicación para comunidades.",
    rating: 4.7
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com",
    icon: "https://cdn6.aptoide.com/imgs/0/5/c/05c2271c0e114965490bee7962608507_icon.png?w=128",
    category: "Comunidad",
    developer: "Reddit Inc.",
    description: "La primera página de internet.",
    rating: 4.4
  },
  {
    name: "Spotify Web",
    url: "https://open.spotify.com",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
    category: "Música",
    developer: "Spotify AB",
    description: "Reproduce música y podcasts online.",
    rating: 4.8
  },
  {
    name: "Netflix",
    url: "https://www.netflix.com",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3_FUVPsUWnfx0QU6CEByIfTew5jRQDkqakK-hmaQ3-VQ4wCzYO06kWs&s=10",
    category: "Entretenimiento",
    developer: "Netflix Inc.",
    description: "Plataforma de streaming de películas y series.",
    rating: 4.5
  }
];

function createWebsiteCard(website) {
  return `
    <div class="app-card" onclick="openWebsiteModal(${JSON.stringify(website).replace(/\"/g, '&quot;')})">
      <div class="app-header">
        <img class="app-icon" src="${website.icon}" alt="${website.name}">
        <div class="app-info">
          <div class="app-name">${website.name}</div>
          <div class="app-developer">${website.developer}</div>
          <div class="app-category">${website.category}</div>
          <div class="rating">
            <span class="stars">★★★★★</span>
            <span>${website.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getWebsiteClicks() {
  return Math.floor(Math.random() * (1000000 - 10000) + 10000);
}

function openWebsiteModal(website) {
  const clicks = getWebsiteClicks();
  const isVerifiedDev = website.rating >= 4.5;
  const modalContent = document.getElementById('modalContent');

  modalContent.innerHTML = `
    <div class="modal-header-new">
      <div class="app-icon-container">
        <img class="app-icon-new" src="${website.icon}" alt="${website.name}">
      </div>
      <div class="app-info-new">
        <div class="app-name-new">${website.name}</div>
        <div class="app-developer-new">
          ${website.developer}
          ${isVerifiedDev ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
        </div>
        <div class="app-category">${website.category}</div>
        <div class="website-stats">
          <i class="fas fa-mouse-pointer"></i> ${clicks.toLocaleString()} clicks aproximados
        </div>
      </div>
    </div>

    <div class="app-details-scroll">
      <div class="detail-item">
        <div class="detail-label">Rating</div>
        <div class="detail-value">★ ${website.rating}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Categoría</div>
        <div class="detail-value">${website.category}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Clicks</div>
        <div class="detail-value">${clicks.toLocaleString()}</div>
      </div>
    </div>

    <div class="media-container">
      <div class="media-wrapper">
        <img src="${website.icon}" class="media-item" alt="${website.name}">
      </div>
      <div class="carousel-dots">
        <div class="carousel-dot active" data-index="0"></div>
      </div>
    </div>

    <div class="action-container">
      <a href="${website.url}" class="action-btn primary-btn" target="_blank">Visitar Sitio Web</a>
    </div>
    <p>${website.description}</p>
  `;

  document.getElementById('appModal').classList.add('active');
  initializeCarousel();
}

function showWebsitesSection() {
  document.getElementById('featuredApps').style.display = 'none';
  document.getElementById('gamesSection').style.display = 'none';
  document.getElementById('editorialSection').style.display = 'none';
  document.getElementById('websitesSection').style.display = 'block';

  const websitesContainer = document.getElementById('websitesContainer');
  websitesContainer.innerHTML = websites.map(website => createWebsiteCard(website)).join('');

  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector('.nav-item[href="#websites"]').classList.add('active');
}

// Navigation Functions
function showGamesSection() {
    document.getElementById('featuredApps').style.display = 'none';
    document.getElementById('gamesSection').style.display = 'block';
    document.getElementById('editorialSection').style.display = 'none';
    document.getElementById('websitesSection').style.display = 'none';

    // Filter and display only games
    const gameApps = apps.filter(app => app.category === 'Juegos');
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = gameApps.map(app => createAppCard(app)).join('');

    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[href="#games"]').classList.add('active');
}

function showEditorialSection() {
    document.getElementById('featuredApps').style.display = 'none';
    document.getElementById('gamesSection').style.display = 'none';
    document.getElementById('editorialSection').style.display = 'block';
    document.getElementById('websitesSection').style.display = 'none';

    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[href="#editorial"]').classList.add('active');
}

// Home navigation
document.querySelector('.menu-item[href="#"]').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('featuredApps').style.display = 'block';
    document.getElementById('gamesSection').style.display = 'none';
    document.getElementById('editorialSection').style.display = 'none';
    document.getElementById('websitesSection').style.display = 'none';
    displayFeaturedApps(); // Aseguramos que se muestren las apps destacadas

    // Update active navigation
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');
});

// Función para controlar el menú lateral
function toggleMenu() {
    const menu = document.querySelector('.side-menu');
    menu.classList.toggle('active');
}

// Actualizar elementos activos del menú
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        toggleMenu(); // Cerrar el menú después de seleccionar
    });
});



// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFQ_geG0HIv2EZ-bfKc97TJNtf2sdqPzc",
  authDomain: "clack-koder.firebaseapp.com",
  databaseURL: "https://clack-koder-default-rtdb.firebaseio.com",
  projectId: "clack-koder",
  storageBucket: "clack-koder.firebasestorage.app",
  messagingSenderId: "478151254938",
  appId: "1:478151254938:web:e2c00e3a5426bd192b9023",
  measurementId: "G-P29ME5Z3S1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Sistema de Administración de Animaciones
class AnimationAdminSystem {
  constructor() {
    this.animations = {};
    this.loadAnimationsFromFirebase();
  }

  // Cargar animaciones desde Firebase
  async loadAnimationsFromFirebase() {
    try {
      const snapshot = await database.ref('app-animations').once('value');
      const animations = snapshot.val();
      if (animations) {
        this.animations = animations;
        console.log('Animaciones cargadas desde Firebase:', animations);
      }
    } catch (error) {
      console.error('Error cargando animaciones:', error);
    }
  }

  // Guardar nueva animación en Firebase
  async saveAnimation(appName, animationConfig) {
    try {
      await database.ref(`app-animations/${appName}`).set({
        type: animationConfig.type,
        css: animationConfig.css,
        javascript: animationConfig.javascript,
        duration: animationConfig.duration || 5000,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      this.animations[appName] = animationConfig;
      console.log(`Animación guardada para ${appName}`);
      return true;
    } catch (error) {
      console.error('Error guardando animación:', error);
      return false;
    }
  }

  // Obtener animación específica
  getAnimation(appName) {
    return this.animations[appName] || null;
  }

  // Ejecutar animación personalizada
  executeCustomAnimation(appName) {
    const animation = this.getAnimation(appName);
    if (!animation) {
      console.log(`No hay animación personalizada para ${appName}`);
      return false;
    }

    try {
      // Crear contenedor de animación
      const container = document.createElement('div');
      container.className = 'custom-animation-container';
      container.style.position = 'fixed';
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.transform = 'translate(-50%, -50%)';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';

      // Aplicar CSS personalizado
      if (animation.css) {
        const style = document.createElement('style');
        style.textContent = animation.css;
        document.head.appendChild(style);
      }

      // Aplicar estructura HTML de la animación
      if (animation.html) {
        container.innerHTML = animation.html;
      }

      document.body.appendChild(container);

      // Ejecutar JavaScript personalizado si existe
      if (animation.javascript) {
        try {
          const customFunction = new Function('container', animation.javascript);
          customFunction(container);
        } catch (jsError) {
          console.error('Error ejecutando JavaScript personalizado:', jsError);
        }
      }

      // Limpiar después de la duración especificada
      setTimeout(() => {
        container.remove();
      }, animation.duration || 5000);

      return true;
    } catch (error) {
      console.error('Error ejecutando animación personalizada:', error);
      return false;
    }
  }

  // Sincronizar con GitHub (para futuro desarrollo)
  async syncWithGitHub(repoConfig) {
    try {
      // Aquí implementarías la sincronización con GitHub
      console.log('Sincronizando con GitHub:', repoConfig);
      // Esta función se puede expandir para integrar con GitHub API
    } catch (error) {
      console.error('Error sincronizando con GitHub:', error);
    }
  }
}

// Instanciar el sistema de administración
const animationAdmin = new AnimationAdminSystem();

// Momentos System
class MomentosSystem {
  constructor() {
    this.currentUser = this.generateRandomUser();
    this.init();
  }

  generateRandomUser() {
    const userId = 'user_' + Math.floor(Math.random() * 1000000000);
    const colors = ['#007aff', '#ff3040', '#30d158', '#ff9500', '#bf5af2', '#ff2d92'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { id: userId, color: color };
  }

  init() {
    // Event listeners
    document.getElementById('momentosBtn').addEventListener('click', () => this.openMomentos());
    document.getElementById('backMomentos').addEventListener('click', () => this.closeMomentos());
    document.getElementById('newPostBtn').addEventListener('click', () => this.toggleNewPostForm());
    document.getElementById('publishBtn').addEventListener('click', () => this.publishPost());

    // Character counter with PayPal styling
    document.getElementById('postContent').addEventListener('input', (e) => {
      const remaining = 280 - e.target.value.length;
      const charCountElement = document.querySelector('.char-count');
      charCountElement.textContent = remaining;

      // Add warning styling when approaching limit
      if (remaining < 20) {
        charCountElement.classList.add('warning');
      } else {
        charCountElement.classList.remove('warning');
      }

      document.getElementById('publishBtn').disabled = e.target.value.trim().length === 0 || remaining < 0;
    });
  }

  openMomentos() {
    document.getElementById('momentosModal').style.display = 'block';
    this.loadPosts();
  }

  closeMomentos() {
    document.getElementById('momentosModal').style.display = 'none';
    document.getElementById('newPostForm').style.display = 'none';
  }

  toggleNewPostForm() {
    const form = document.getElementById('newPostForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      document.getElementById('postContent').focus();
    }
  }

  async publishPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) return;

    // Show publishing animation
    this.showPublishingAnimation();

    const post = {
      id: Date.now().toString(),
      content: content,
      author: this.currentUser.id,
      authorColor: this.currentUser.color,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      replies: {}
    };

    try {
      // Simulate publishing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      await database.ref('momentos/' + post.id).set(post);

      // Hide publishing animation
      this.hidePublishingAnimation();

      // Reset form
      document.getElementById('postContent').value = '';
      document.querySelector('.char-count').textContent = '280';
      document.querySelector('.char-count').classList.remove('warning');
      document.getElementById('publishBtn').disabled = true;
      this.toggleNewPostForm();
      this.loadPosts();

      // Show success notification with PayPal styling
      this.showSuccessNotification('¡Momento publicado exitosamente!');
    } catch (error) {
      console.error('Error publishing post:', error);
      this.hidePublishingAnimation();
      this.showNotification('Error al publicar', true);
    }
  }

  showPublishingAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'publishing-overlay';
    overlay.id = 'publishingOverlay';
    overlay.innerHTML = `
      <div class="publishing-content">
        <div class="publishing-spinner"></div>
        <div class="publishing-text">Publicando momento...</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  hidePublishingAnimation() {
    const overlay = document.getElementById('publishingOverlay');
    if (overlay) {
      overlay.remove();
    }
  }

  showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 400);
    }, 3500);
  }



  async loadPosts() {
    const feed = document.getElementById('momentosFeed');
    feed.innerHTML = `
      <div class="loading-posts">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando momentos...</p>
      </div>
    `;

    try {
      const snapshot = await database.ref('momentos').orderByChild('timestamp').once('value');
      const posts = [];

      snapshot.forEach((childSnapshot) => {
        posts.push(childSnapshot.val());
      });

      posts.reverse(); // Mostrar más recientes primero
      this.renderPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      feed.innerHTML = `
        <div class="loading-posts">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error al cargar momentos</p>
        </div>
      `;
    }
  }

  renderPosts(posts) {
    const feed = document.getElementById('momentosFeed');

    if (posts.length === 0) {
      feed.innerHTML = `
        <div class="loading-posts">
          <i class="fas fa-comment-dots"></i>
          <p>¡Sé el primero en compartir un momento!</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = posts.map(post => this.createPostCard(post)).join('');
    this.attachPostEventListeners();
  }

  createPostCard(post) {
    const timeAgo = this.getTimeAgo(post.timestamp);
    const isLiked = post.likedBy && post.likedBy.includes(this.currentUser.id);
    const repliesCount = post.replies ? Object.keys(post.replies).length : 0;

    return `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-header">
          <div class="user-avatar" style="background: ${post.authorColor}">
            ${post.author.substring(5, 7).toUpperCase()}
          </div>
          <div class="post-user-info">
            <div class="username">${post.author}</div>
            <div class="post-time">${timeAgo}</div>
          </div>
        </div>

        <div class="post-content">${post.content}</div>

        <div class="post-actions">
          <button class="action-btn-post like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
            <i class="fas fa-heart"></i>
            <span>${post.likes || 0}</span>
          </button>
          <button class="action-btn-post reply-btn" data-post-id="${post.id}">
            <i class="fas fa-comment"></i>
            <span>${repliesCount}</span>
          </button>
          <button class="action-btn-post share-btn" data-post-id="${post.id}">
            <i class="fas fa-share"></i>
          </button>
        </div>

        <div class="replies-section" id="replies-${post.id}" style="display: none;">
          ${this.renderReplies(post.replies || {})}
          <div class="reply-form">
            <div class="reply-composer">
              <input type="text" class="reply-input" placeholder="Escribe una respuesta..." maxlength="140">
              <div class="reply-actions">
                <button class="reply-submit" data-post-id="${post.id}">
                  <i class="fas fa-reply"></i>
                  Responder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderReplies(replies) {
    if (!replies || Object.keys(replies).length === 0) {
      return '<p style="color: #666; font-style: italic; padding: 10px 0;">No hay respuestas aún...</p>';
    }

    return Object.values(replies).map(reply => `
      <div class="reply-card">
        <div class="post-header">
          <div class="user-avatar" style="background: ${reply.authorColor}; width: 30px; height: 30px; font-size: 12px;">
            ${reply.author.substring(5, 7).toUpperCase()}
          </div>
          <div class="post-user-info">
            <div class="username" style="font-size: 13px;">${reply.author}</div>
            <div class="post-time">${this.getTimeAgo(reply.timestamp)}</div>
          </div>
        </div>
        <div class="post-content" style="font-size: 14px; margin-left: 40px;">${reply.content}</div>
        <div class="post-actions" style="margin-left: 40px;">
          <button class="action-btn-post like-btn ${reply.likedBy && reply.likedBy.includes(this.currentUser.id) ? 'liked' : ''}" data-reply-id="${reply.id}" data-post-id="${reply.postId}">
            <i class="fas fa-heart"></i>
            <span>${reply.likes || 0}</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  attachPostEventListeners() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        const replyId = btn.dataset.replyId;
        if (replyId) {
          this.toggleReplyLike(postId, replyId);
        } else {
          this.toggleLike(postId);
        }
      });
    });

    // Reply buttons
    document.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        this.toggleReplies(postId);
      });
    });

    // Reply submit buttons
    document.querySelectorAll('.reply-submit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        const replyForm = btn.closest('.reply-form');
        const input = replyForm.querySelector('.reply-input');
        this.submitReply(postId, input.value.trim());
        input.value = '';
      });
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sharePost();
      });
    });
  }

  async toggleLike(postId) {
    try {
      const postRef = database.ref('momentos/' + postId);
      const snapshot = await postRef.once('value');
      const post = snapshot.val();

      if (!post) return;

      const likedBy = post.likedBy || [];
      const likes = post.likes || 0;
      const userIndex = likedBy.indexOf(this.currentUser.id);

      if (userIndex > -1) {
        // Unlike
        likedBy.splice(userIndex, 1);
        await postRef.update({
          likes: Math.max(0, likes - 1),
          likedBy: likedBy
        });
      } else {
        // Like
        likedBy.push(this.currentUser.id);
        await postRef.update({
          likes: likes + 1,
          likedBy: likedBy
        });
      }

      this.loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async toggleReplyLike(postId, replyId) {
    try {
      const replyRef = database.ref(`momentos/${postId}/replies/${replyId}`);
      const snapshot = await replyRef.once('value');
      const reply = snapshot.val();

      if (!reply) return;

      const likedBy = reply.likedBy || [];
      const likes = reply.likes || 0;
      const userIndex = likedBy.indexOf(this.currentUser.id);

      if (userIndex > -1) {
        likedBy.splice(userIndex, 1);
        await replyRef.update({
          likes: Math.max(0, likes - 1),
          likedBy: likedBy
        });
      } else {
        likedBy.push(this.currentUser.id);
        await replyRef.update({
          likes: likes + 1,
          likedBy: likedBy
        });
      }

      this.loadPosts();
    } catch (error) {
      console.error('Error toggling reply like:', error);
    }
  }

  toggleReplies(postId) {
    const repliesSection = document.getElementById(`replies-${postId}`);
    const replyForm = repliesSection.querySelector('.reply-form');

    if (repliesSection.style.display === 'none') {
      repliesSection.style.display = 'block';
      replyForm.style.display = 'block';
      replyForm.querySelector('.reply-input').focus();
    } else {
      repliesSection.style.display = 'none';
    }
  }

  async submitReply(postId, content) {
    if (!content) return;

    const replyForm = document.querySelector(`#replies-${postId} .reply-form`);

    const reply = {
      id: Date.now().toString(),
      content: content,
      author: this.currentUser.id,
      authorColor: this.currentUser.color,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      postId: postId
    };

    try {
      // Show mini publishing animation for reply
      const submitBtn = replyForm.querySelector('.reply-submit');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<div class="publish-spinner"></div>Publicando...';
      submitBtn.disabled = true;

      await database.ref(`momentos/${postId}/replies/${reply.id}`).set(reply);

      // Reset reply form
      replyForm.querySelector('.reply-input').value = '';
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      this.loadPosts();
      this.showSuccessNotification('¡Respuesta publicada!');
    } catch (error) {
      console.error('Error submitting reply:', error);
      this.showNotification('Error al responder', true);
      const submitBtn = replyForm.querySelector('.reply-submit');
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  }

  sharePost() {
    if (navigator.share) {
      navigator.share({
        title: 'Veraxa Momentos',
        text: '¡Echa un vistazo a este momento en Veraxa!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.showNotification('¡Enlace copiado!');
    }
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  }

  showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification-popup show';
    notification.style.background = isError ? '#ff3040' : '#30d158';
    notification.innerHTML = `
      <i class="fas fa-${isError ? 'exclamation-triangle' : 'check'}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize Momentos System
const momentosSystem = new MomentosSystem();

// Sistema de animación para aplicaciones específicas
class AppAnimationSystem {
  constructor() {
    this.isAnimating = false;
    this.plantApps = ['Roblox', 'Among Us', 'Candy Crush Saga']; // Apps que tendrán animación de planta
    this.specialApps = ['TikTok', 'Netflix', 'Crunchyroll']; // Apps con animaciones especiales
  }

  shouldShowAnimation(appName) {
    return this.plantApps.includes(appName) || this.specialApps.includes(appName);
  }

  getAnimationType(appName) {
    if (this.plantApps.includes(appName)) return 'plant';
    if (appName === 'TikTok') return 'tiktok';
    if (appName === 'Netflix') return 'wednesday';
    if (appName === 'Crunchyroll') return 'crunchyroll';
    return 'none';
  }

  async showAnimation(appName, clickedElement) {
    // No bloquear si ya hay una animación en curso
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Primero intentar animación personalizada desde Firebase
    const hasCustomAnimation = animationAdmin.getAnimation(appName);

    if (hasCustomAnimation) {
      // Ejecutar animación personalizada desde Firebase
      const animationSuccess = animationAdmin.executeCustomAnimation(appName);
      if (animationSuccess) {
        console.log(`Ejecutando animación personalizada para ${appName}`);
        // Limpiar después de 5 segundos exactos
        setTimeout(() => {
          this.isAnimating = false;
        }, 5000);
        return;
      }
    }

    // Si no hay animación personalizada, usar las predefinidas
    const animationType = this.getAnimationType(appName);

    if (animationType === 'plant') {
      this.showPlantAnimation();
    } else if (animationType === 'tiktok') {
      this.showTikTokAnimation();
    } else if (animationType === 'wednesday') {
      this.showWednesdayAnimation();
    } else if (animationType === 'crunchyroll') {
      this.showCrunchyrollAnimation();
    }

    // Limpiar después de 5 segundos exactos
    setTimeout(() => {
      this.isAnimating = false;
    }, 5000);
  }

  async showPlantAnimation() {
    // Crear el contenedor de la animación centrado
    const animationContainer = document.createElement('div');
    animationContainer.className = 'plant-animation-container';

    // Centrar en la pantalla
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '9999';

    animationContainer.innerHTML = `
      <div class="plant-growth-scene">
        <div class="ground-layer"></div>
        <div class="soil-3d">
          <div class="soil-surface"></div>
          <div class="soil-depth"></div>
        </div>
        <div class="plant-stages">
          <div class="stage stage-1">
            <div class="seed-sprout"></div>
            <div class="roots"></div>
          </div>
          <div class="stage stage-2">
            <div class="small-plant"></div>
            <div class="growing-stem"></div>
          </div>
          <div class="stage stage-3">
            <div class="medium-plant"></div>
            <div class="leaves-swaying"></div>
          </div>
          <div class="stage stage-4">
            <div class="flower-bloom">
              <div class="petal"></div>
              <div class="petal"></div>
              <div class="petal"></div>
              <div class="petal"></div>
              <div class="petal"></div>
              <div class="petal"></div>
            </div>
            <div class="pollen-particles"></div>
          </div>
        </div>
        <div class="particle-effects-3d">
          <div class="magic-sparkle sparkle-1">✨</div>
          <div class="magic-sparkle sparkle-2">⭐</div>
          <div class="magic-sparkle sparkle-3">🌟</div>
          <div class="magic-sparkle sparkle-4">💫</div>
          <div class="growth-energy"></div>
          <div class="nature-aura"></div>
        </div>
        <div class="environmental-effects">
          <div class="sunlight-rays"></div>
          <div class="water-droplets"></div>
          <div class="wind-effect"></div>
        </div>
      </div>
    `;

    document.body.appendChild(animationContainer);

    // Ejecutar la secuencia de crecimiento rápida
    await this.executeGrowthSequence(animationContainer);

    // Limpiar después de 5 segundos exactos
    setTimeout(() => {
      animationContainer.remove();
    }, 5000);
  }

  async showTikTokAnimation() {
    // Crear el contenedor de animación TikTok
    const animationContainer = document.createElement('div');
    animationContainer.className = 'tiktok-animation-container';

    // Centrar en la pantalla
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '50%';
    animationContainer.style.left = '50%';
    animationContainer.style.transform = 'translate(-50%, -50%)';
    animationContainer.style.zIndex = '9999';
    animationContainer.style.width = '300px';
    animationContainer.style.height = '300px';

    animationContainer.innerHTML = `
      <div class="tiktok-scene">
        <div class="red-dot-container">
          <div class="red-dot"></div>
          <div class="live-text">LIVE</div>
        </div>
        <div class="musical-notes">
          <div class="note note-1">♪</div>
          <div class="note note-2">♫</div>
          <div class="note note-3">♪</div>
          <div class="note note-4">♫</div>
          <div class="note note-5">♪</div>
          <div class="note note-6">♫</div>
          <div class="note note-7">♪</div>
          <div class="note note-8">♫</div>
        </div>
      </div>
    `;

    document.body.appendChild(animationContainer);

    // Ejecutar animación TikTok
    await this.executeTikTokSequence(animationContainer);

    // Limpiar después de 5 segundos exactos
    setTimeout(() => {
      animationContainer.remove();
    }, 5000);
  }

  async showWednesdayAnimation() {
    // Animación deshabilitada - no mostrar promoción
    console.log('Animación de Wednesday deshabilitada');
  }

  async showCrunchyrollAnimation() {
    // Crear el contenedor de animación Crunchyroll
    const animationContainer = document.createElement('div');
    animationContainer.className = 'crunchyroll-animation-container';

    animationContainer.innerHTML = `
      <img src="https://64.media.tumblr.com/1238b61a8ed096f113079ef6e1909f98/8d52336120e92f25-12/s400x600/554db7170f3d81fede6908d087cee59c22077e52.gif" 
           alt="Crunchyroll Animation" 
           class="crunchyroll-gif" 
           onerror="this.src='https://via.placeholder.com/400x600/FF6200/FFFFFF?text=CRUNCHYROLL'">
    `;

    document.body.appendChild(animationContainer);

    // Mostrar animación desde abajo
    setTimeout(() => {
      animationContainer.classList.add('show');
    }, 100);

    // Limpiar después de 5 segundos exactos
    setTimeout(() => {
      animationContainer.classList.add('hide');

      setTimeout(() => {
        animationContainer.remove();
      }, 500);
    }, 5000);
  }

  async executeTikTokSequence(container) {
    const redDot = container.querySelector('.red-dot');
    const liveText = container.querySelector('.live-text');
    const notes = container.querySelectorAll('.note');

    // Iniciar parpadeo del punto rojo inmediatamente
    redDot.classList.add('pulsing');

    // Después de 1 segundo, mostrar "LIVE"
    setTimeout(() => {
      liveText.classList.add('show-live');
    }, 1000);

    // Después de 1.5 segundos, empezar las notas musicales
    setTimeout(() => {
      notes.forEach((note, index) => {
        setTimeout(() => {
          note.classList.add('floating');
        }, index * 200);
      });
    }, 1500);
  }

  async executeGrowthSequence(container) {
    const stages = container.querySelectorAll('.stage');
    const sparkles = container.querySelectorAll('.sparkle');

    // Mostrar suelo primero (más rápido)
    await this.animateElement(container.querySelector('.soil-3d'), 'soil-appear');
    await this.delay(200);

    // Crecimiento por etapas (más rápido)
    for (let i = 0; i < stages.length; i++) {
      // Ocultar etapa anterior
      if (i > 0) {
        stages[i - 1].style.opacity = '0';
        stages[i - 1].style.transform = 'scale(0)';
      }

      // Mostrar etapa actual
      await this.animateElement(stages[i], 'plant-grow');

      // Efectos de partículas
      if (sparkles[i]) {
        this.animateElement(sparkles[i], 'sparkle-burst');
      }

      await this.delay(400); // Reducido de 600 a 400
    }

    // Animación final de florecimiento
    await this.animateElement(stages[stages.length - 1], 'flower-bloom');

    // Efecto de partículas final
    sparkles.forEach(sparkle => {
      this.animateElement(sparkle, 'final-sparkle');
    });
  }

  animateElement(element, animationClass) {
    return new Promise(resolve => {
      element.classList.add(animationClass);
      element.addEventListener('animationend', () => {
        resolve();
      }, { once: true });
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Función faltante para versiones
function showVersionsSection(app) {
  // Cerrar modal actual
  document.getElementById('appModal').classList.remove('active');

  // Crear modal de versiones
  const versionsModal = document.createElement('div');
  versionsModal.className = 'versions-modal';
  versionsModal.id = 'versionsModal';
  versionsModal.innerHTML = `
    <div class="versions-content">
      <div class="versions-header">
        <h2>Versiones de ${app.name}</h2>
        <button class="close-versions" onclick="closeVersionsModal()">×</button>
      </div>
      <div class="versions-body">
        <div class="current-version-info">
          <h3>Versión Actual</h3>
          <div class="version-card current">
            <div class="version-header">
              <span class="version-number">${app.version}</span>
              <span class="version-badge current-badge">Actual</span>
            </div>
            <div class="version-details">
              <span><i class="fas fa-calendar"></i> Hace 2 días</span>
              <span><i class="fas fa-download"></i> ${app.size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(versionsModal);
  document.body.style.overflow = 'hidden';
}

// Instanciar el sistema de animación
const appAnimationSystem = new AppAnimationSystem();

// Función para mostrar animación y abrir modal
function openAppModalWithAnimation(app, clickedElement) {
  // Solo mostrar animación si se hace clic en una app card directamente
  if (appAnimationSystem.shouldShowAnimation(app.name) && clickedElement) {
    // Mostrar animación sin bloquear el modal
    appAnimationSystem.showAnimation(app.name, clickedElement);

    // Abrir modal inmediatamente, no esperar la animación
    setTimeout(() => {
      openAppModal(app);
    }, 100); // Delay mínimo para que inicie la animación
  } else {
    // Si no hay animación, abrir modal directamente
    openAppModal(app);
  }
}

// Función para re-aplicar detectores de click a todas las apps en la página
function attachUniversalAppClickHandlers() {
  // Detectar clicks en app-posters (carrusel principal)
  document.querySelectorAll('.app-poster').forEach(poster => {
    poster.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Buscar la app por el título del poster
      const titleElement = poster.querySelector('.poster-title');
      if (titleElement) {
        const appName = titleElement.textContent.trim();
        const app = apps.find(a => a.name === appName);
        if (app) {
          openAppModalWithAnimation(app, poster);
        }
      }
    });
  });

  // Detectar clicks en app-cards generales
  document.querySelectorAll('.app-card').forEach(card => {
    if (!card.hasAttribute('data-click-attached')) {
      card.setAttribute('data-click-attached', 'true');
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('developer-link')) {
          const appName = card.getAttribute('data-app-name') || 
                         card.querySelector('.app-name')?.textContent.trim();

          if (appName) {
            const app = apps.find(a => a.name === appName);
            if (app) {
              openAppModalWithAnimation(app, card);
            }
          }
        }
      });
    }
  });

  // Detectar clicks en horizontal-scroll apps
  document.querySelectorAll('.horizontal-scroll .app-card').forEach(card => {
    if (!card.hasAttribute('data-click-attached')) {
      card.setAttribute('data-click-attached', 'true');
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('developer-link')) {
          const appName = card.getAttribute('data-app-name') || 
                         card.querySelector('.app-name')?.textContent.trim();

          if (appName) {
            const app = apps.find(a => a.name === appName);
            if (app) {
              openAppModalWithAnimation(app, card);
            }
          }
        }
      });
    }
  });
}

// Función para re-aplicar detectores de click después de actualizar contenido
function reattachClickHandlers() {
  setTimeout(() => {
    attachUniversalAppClickHandlers();
  }, 100);
}

// Inicializar la visualización de aplicaciones
displayFeaturedApps().then(() => {
  reattachClickHandlers();
});

// Function to save rating using local storage
function saveRating(appName, rating) {
  const ratings = JSON.parse(localStorage.getItem('appRatings')) || {};
  ratings[appName] = rating;
  localStorage.setItem('appRatings', JSON.stringify(ratings));
  updateRatingStats(appName);
  // Update star visual
  const stars = document.querySelectorAll(`.star-rating span.star`);
  stars.forEach(star => star.classList.remove('active'));
  const ratedStars = document.querySelectorAll(`.star-rating span.star[data-rating="${rating}"]`);
  ratedStars.forEach(star => star.classList.add('active'));
}

// Function to update rating statistics
function updateRatingStats(appName) {
  const ratings = JSON.parse(localStorage.getItem('appRatings')) || {};
  const appRatings = Object.values(ratings).filter(rating => rating); // Filter out undefined ratings
  const avgRating = appRatings.reduce((sum, rating) => sum + rating, 0) / appRatings.length || 0;
  const ratingStatsDiv = document.getElementById('ratingStats');
  ratingStatsDiv.innerHTML = `
    Promedio: ${avgRating.toFixed(1)} estrellas (${appRatings.length} votos)
  `;
}

// ===========================================
// SISTEMA DE PANTALLA DE MANTENIMIENTO
// ===========================================

// Variable para activar/desactivar la pantalla de mantenimiento
// Cambiar a true para activar, false para desactivar
let MAINTENANCE_MODE = false;

/**
 * Función para activar o desactivar el modo mantenimiento
 * @param {boolean} enable - true para activar, false para desactivar
 */
function setMaintenanceMode(enable) {
  MAINTENANCE_MODE = enable;
  const overlay = document.getElementById('maintenanceOverlay');

  // Verificar que el elemento exista antes de manipularlo
  if (!overlay) {
    console.warn('⚠️  Elemento de mantenimiento no encontrado');
    return;
  }

  if (enable) {
    overlay.classList.add('active');
    // Deshabilitar el scroll del body y bloquear interacciones
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    overlay.style.pointerEvents = 'auto';
    // Configurar aria para accesibilidad
    overlay.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('aria-hidden', 'true');
    console.log('🔧 Modo mantenimiento ACTIVADO');
  } else {
    overlay.classList.remove('active');
    // Rehabilitar el scroll del body y las interacciones
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
    // Restaurar aria para accesibilidad
    overlay.setAttribute('aria-hidden', 'true');
    document.body.setAttribute('aria-hidden', 'false');
    console.log('✅ Modo mantenimiento DESACTIVADO');
  }
}

/**
 * Función para alternar el modo mantenimiento
 */
function toggleMaintenanceMode() {
  setMaintenanceMode(!MAINTENANCE_MODE);
}

/**
 * Función para obtener el estado actual del modo mantenimiento
 * @returns {boolean} - true si está activado, false si está desactivado
 */
function getMaintenanceMode() {
  return MAINTENANCE_MODE;
}

// Inicializar el modo mantenimiento al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si el modo mantenimiento debe estar activo
  if (MAINTENANCE_MODE) {
    setMaintenanceMode(true);
  }

  // NOTA: Para mayor seguridad en producción, se recomienda:
  // 1. Remover las funciones globales de window
  // 2. Configurar el estado desde el servidor (503 Service Unavailable)
  // 3. Usar variables de entorno o archivos de configuración
});

// ADVERTENCIA: Estas funciones están expuestas para desarrollo
// En producción, se recomienda removerlas por seguridad
window.setMaintenanceMode = setMaintenanceMode;
window.toggleMaintenanceMode = toggleMaintenanceMode;
window.getMaintenanceMode = getMaintenanceMode;

// === SISTEMA DE CHAT DE SOPORTE ===

class SupportChatSystem {
    constructor() {
        this.isOpen = false;
        this.currentStep = 'welcome'; // welcome, contact_form, conversation, app_selection, app_problem, final
        this.userEmail = '';
        this.userProblem = '';
        this.selectedApp = null;
        this.conversationState = {
            emailConfirmed: false,
            appSelected: false,
            problemDescribed: false
        };

        this.init();
    }

    init() {
        // Inicializar eventos
        this.bindEvents();
        // Mostrar mensaje inicial del agente cuando se abra por primera vez
        this.setupInitialState();
    }

    bindEvents() {
        // Eventos para abrir/cerrar chat
        const chatBubble = document.getElementById('chatBubble');
        const closeBtn = document.getElementById('closeSupportChat');
        const modal = document.getElementById('supportChatModal');

        if (chatBubble) {
            chatBubble.addEventListener('click', () => this.openChat());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChat());
        }

        // Cerrar al hacer clic fuera del modal
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeChat();
                }
            });
        }

        // Eventos para formulario de contacto
        const submitContactBtn = document.getElementById('submitContactBtn');
        if (submitContactBtn) {
            submitContactBtn.addEventListener('click', () => this.submitContactForm());
        }

        // Eventos para enviar mensajes
        const sendBtn = document.getElementById('sendMessageBtn');
        const messageInput = document.getElementById('chatMessageInput');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendUserMessage());
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendUserMessage();
                }
            });
        }

        // Eventos para selección de aplicaciones
        const confirmAppBtn = document.getElementById('confirmAppBtn');
        if (confirmAppBtn) {
            confirmAppBtn.addEventListener('click', () => this.confirmSelectedApp());
        }
    }

    setupInitialState() {
        // Configuración inicial del chat sin burbuja flotante
        console.log('Sistema de chat inicializado - disponible solo desde configuración');
    }

    openChat() {
        const modal = document.getElementById('supportChatModal');

        if (modal) {
            modal.classList.add('active');
            this.isOpen = true;

            // Si es la primera vez que abre el chat, mostrar mensaje de bienvenida
            if (this.currentStep === 'welcome') {
                this.showWelcomeMessage();
            }
        }
    }

    closeChat() {
        const modal = document.getElementById('supportChatModal');
        if (modal) {
            modal.classList.remove('active');
            this.isOpen = false;
        }
    }

    showWelcomeMessage() {
        // Limpiar chat y mostrar formulario de contacto
        this.clearChat();
        this.showContactForm();

        // Agregar mensaje de bienvenida del agente
        setTimeout(() => {
            this.addAgentMessage('Hola! Soy tu agente virtual de soporte. Estoy aquí para ayudarte con cualquier problema que tengas con nuestras aplicaciones.');
        }, 500);

        setTimeout(() => {
            this.addAgentMessage('Para poder asistirte mejor, por favor proporciona tu correo electrónico y describe brevemente el problema que tienes.');
        }, 1500);

        this.currentStep = 'contact_form';
    }

    clearChat() {
        const chatBody = document.getElementById('supportChatBody');
        if (chatBody) {
            chatBody.innerHTML = '';
        }
    }

    showContactForm() {
        const contactForm = document.getElementById('chatContactForm');
        const chatInput = document.getElementById('supportChatInput');
        const appSelector = document.getElementById('appSelectorContainer');

        if (contactForm) contactForm.classList.add('active');
        if (chatInput) chatInput.style.display = 'none';
        if (appSelector) appSelector.style.display = 'none';
    }

    hideContactForm() {
        const contactForm = document.getElementById('chatContactForm');
        const chatInput = document.getElementById('supportChatInput');

        if (contactForm) contactForm.classList.remove('active');
        if (chatInput) chatInput.style.display = 'block';
    }

    submitContactForm() {
        const emailInput = document.getElementById('chatEmailInput');
        const problemInput = document.getElementById('chatProblemInput');

        if (!emailInput || !problemInput) return;

        const email = emailInput.value.trim();
        const problem = problemInput.value.trim();

        if (!email || !problem) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (!this.isValidEmail(email)) {
            alert('Por favor ingresa un correo electrónico válido');
            return;
        }

        this.userEmail = email;
        this.userProblem = problem;

        // Ocultar formulario y mostrar input de chat
        this.hideContactForm();

        // Agregar mensaje del usuario
        this.addUserMessage(`Correo: ${email}\nProblema: ${problem}`);

        // Respuesta del agente
        setTimeout(() => {
            this.addAgentMessage('Perfecto! He verificado tu correo electrónico: ' + email);
        }, 1000);

        setTimeout(() => {
            this.addAgentMessage('Por favor, indícame con más detalle cuál es el problema que tienes. ¿Es con alguna aplicación específica?');
        }, 2500);

        this.currentStep = 'conversation';
    }

    sendUserMessage() {
        const messageInput = document.getElementById('chatMessageInput');
        if (!messageInput) return;

        const message = messageInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        this.addUserMessage(message);
        messageInput.value = '';

        // Procesar respuesta del agente
        this.processUserMessage(message);
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Detectar palabras relacionadas con aplicaciones
        const appKeywords = ['aplicación', 'aplicaciones', 'app', 'apps', 'aplicacion', 'aplicaciones'];
        const hasAppKeyword = appKeywords.some(keyword => lowerMessage.includes(keyword));

        if (hasAppKeyword && this.currentStep === 'conversation') {
            // Mostrar selector de aplicaciones
            this.showAppSelector();
        } else if (this.currentStep === 'app_problem') {
            // El usuario está describiendo el problema con la aplicación seleccionada
            this.handleAppProblemDescription(message);
        } else {
            // Respuesta genérica del agente
            this.addGenericAgentResponse(message);
        }
    }

    showAppSelector() {
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            this.addAgentMessage('Entiendo! Tienes un problema con alguna aplicación. Te voy a mostrar todas las aplicaciones disponibles en nuestra plataforma en pantalla completa para que selecciones con cuál tienes el problema.');
        }, 1500);

        setTimeout(() => {
            this.displayFullscreenAppSelector();
        }, 3000);

        this.currentStep = 'app_selection';
    }

    displayFullscreenAppSelector() {
        // Crear modal de pantalla completa para selección de apps
        const fullscreenSelector = document.createElement('div');
        fullscreenSelector.className = 'fullscreen-app-selector';
        fullscreenSelector.id = 'fullscreenAppSelector';

        fullscreenSelector.innerHTML = `
            <div class="fullscreen-selector-header">
                <button class="back-from-selector" onclick="supportChatSystem.closeAppSelector()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>Selecciona la aplicación</h2>
                <div style="width: 40px;"></div>
            </div>
            <div class="fullscreen-selector-body">
                <div class="search-apps">
                    <input type="text" placeholder="Buscar aplicación..." id="searchAppsInput">
                </div>
                <div class="apps-grid-fullscreen" id="appsGridFullscreen">
                    <!-- Apps se cargarán aquí -->
                </div>
                <div class="selector-footer">
                    <button class="confirm-selected-app-btn" id="confirmSelectedAppBtn" disabled>
                        Confirmar Selección
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(fullscreenSelector);

        // Cargar aplicaciones
        this.loadAppsInFullscreen();

        // Agregar evento de búsqueda
        const searchInput = document.getElementById('searchAppsInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterAppsInFullscreen(e.target.value);
            });
        }

        // Mostrar el modal
        setTimeout(() => {
            fullscreenSelector.classList.add('active');
        }, 100);
    }

    loadAppsInFullscreen() {
        const appsGrid = document.getElementById('appsGridFullscreen');
        if (!appsGrid) return;

        appsGrid.innerHTML = '';

        if (typeof apps !== 'undefined' && apps.length > 0) {
            // Filtrar solo las primeras 12 aplicaciones para mostrar en orden 3x4
            const limitedApps = apps.slice(0, 12);
            
            limitedApps.forEach((app, index) => {
                const appItem = document.createElement('div');
                appItem.className = 'app-grid-item';
                appItem.dataset.appIndex = index;
                appItem.dataset.appName = app.name.toLowerCase();

                appItem.innerHTML = `
                    <div class="app-item-content">
                        <img src="${app.icon}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${app.name.charAt(0)}'">
                        <div class="app-item-info">
                            <h4>${app.name}</h4>
                            <p>${app.developer}</p>
                            <span class="app-category">${app.category}</span>
                        </div>
                        <div class="selection-indicator">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                `;

                appItem.addEventListener('click', () => this.selectAppFullscreen(appItem, app));
                appsGrid.appendChild(appItem);
            });
        }
    }

    filterAppsInFullscreen(searchTerm) {
        const appItems = document.querySelectorAll('.app-grid-item');
        const term = searchTerm.toLowerCase();

        appItems.forEach(item => {
            const appName = item.dataset.appName;
            const isVisible = appName.includes(term);
            item.style.display = isVisible ? 'block' : 'none';
        });
    }

    selectAppFullscreen(element, app) {
        // Remover selección previa
        const allItems = document.querySelectorAll('.app-grid-item');
        allItems.forEach(item => item.classList.remove('selected'));

        // Seleccionar nueva app
        element.classList.add('selected');
        this.selectedApp = app;

        // Habilitar botón de confirmación
        const confirmBtn = document.getElementById('confirmSelectedAppBtn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.onclick = () => this.confirmAppSelectionFullscreen();
        }
    }

    confirmAppSelectionFullscreen() {
        if (!this.selectedApp) return;

        // Cerrar selector de pantalla completa
        this.closeAppSelector();

        // Agregar mensaje del usuario
        this.addUserMessage(`He seleccionado: ${this.selectedApp.name}`);

        // Respuesta del agente
        setTimeout(() => {
            this.addAgentMessage(`Excelente! Veo que tienes un problema con ${this.selectedApp.name}.`);
        }, 1000);

        setTimeout(() => {
            this.addAgentMessage(`Ahora, por favor describe detalladamente qué problema estás experimentando con ${this.selectedApp.name}. Mientras más información me proporciones, mejor podremos ayudarte.`);
        }, 2500);

        this.currentStep = 'app_problem';
    }

    closeAppSelector() {
        const fullscreenSelector = document.getElementById('fullscreenAppSelector');
        if (fullscreenSelector) {
            fullscreenSelector.classList.remove('active');
            setTimeout(() => {
                fullscreenSelector.remove();
            }, 300);
        }
    }

    selectApp(element, app) {
        // Remover selección previa
        const allItems = document.querySelectorAll('.app-carousel-item');
        allItems.forEach(item => item.classList.remove('selected'));

        // Seleccionar nueva app
        element.classList.add('selected');
        this.selectedApp = app;

        // Habilitar botón de confirmación
        const confirmBtn = document.getElementById('confirmAppBtn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
    }

    confirmSelectedApp() {
        if (!this.selectedApp) return;

        // Ocultar selector de aplicaciones
        const appSelector = document.getElementById('appSelectorContainer');
        if (appSelector) {
            appSelector.style.display = 'none';
        }

        // Agregar mensaje del usuario
        this.addUserMessage(`He seleccionado: ${this.selectedApp.name}`);

        // Respuesta del agente
        setTimeout(() => {
            this.addAgentMessage(`¡Excelente! Veo que tienes un problema con ${this.selectedApp.name}. 🎯`);
        }, 1000);

        setTimeout(() => {
            this.addAgentMessage(`Ahora, por favor describe detalladamente qué problema estás experimentando con ${this.selectedApp.name}. Mientras más información me proporciones, mejor podremos ayudarte. 📝`);
        }, 2500);

        this.currentStep = 'app_problem';
    }

    handleAppProblemDescription(message) {
        // Analizar el mensaje del usuario para detectar el tipo de problema
        this.analyzeUserReport(message);
        
        // Agregar respuesta inicial del agente
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            this.addAgentMessage('Perfecto! He recibido tu reporte sobre ' + this.selectedApp.name + '. Estoy analizando tu problema...');
        }, 1500);

        // Simular análisis en la base de datos
        setTimeout(() => {
            this.showTypingIndicator();
        }, 3000);

        setTimeout(() => {
            this.removeTypingIndicator();
            this.addAgentMessage('🔍 Analizando en la base de datos... Un momento por favor.');
        }, 4000);

        // Realizar análisis completo y dar respuesta
        setTimeout(() => {
            this.showTypingIndicator();
        }, 6000);

        setTimeout(() => {
            this.removeTypingIndicator();
            const analysisResult = this.performDatabaseAnalysis(message);
            this.addAgentMessage(analysisResult);
        }, 7000);

        // Mensaje final de agradecimiento
        setTimeout(() => {
            this.addAgentMessage('Gracias por reportar este problema. Tu retroalimentación nos ayuda a mejorar continuamente nuestros servicios. ¡Que tengas un excelente día! 😊');
        }, 9000);

        this.currentStep = 'final';

        // Deshabilitar input después del mensaje final
        setTimeout(() => {
            const messageInput = document.getElementById('chatMessageInput');
            const sendBtn = document.getElementById('sendMessageBtn');

            if (messageInput) {
                messageInput.disabled = true;
                messageInput.placeholder = 'Conversación finalizada. ¡Gracias por contactarnos!';
            }

            if (sendBtn) {
                sendBtn.disabled = true;
            }
        }, 10000);
    }

    analyzeUserReport(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detectar palabras clave de problemas
        const problemKeywords = {
            crash: ['crash', 'cierra', 'error', 'falla', 'no funciona', 'no abre'],
            connection: ['conexión', 'internet', 'red', 'wifi', 'no conecta'],
            slow: ['lento', 'lenta', 'despacio', 'carga mucho', 'demora'],
            bugs: ['bug', 'error', 'problema', 'fallo', 'mal funcionamiento'],
            ui: ['pantalla', 'interfaz', 'botón', 'diseño', 'visual'],
            account: ['cuenta', 'login', 'usuario', 'contraseña', 'acceso']
        };

        // Clasificar el tipo de problema
        for (const [category, keywords] of Object.entries(problemKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                console.log(`Problema detectado: ${category} para ${this.selectedApp.name}`);
                return category;
            }
        }

        return 'general';
    }

    performDatabaseAnalysis(message) {
        const appName = this.selectedApp.name;
        const problemType = this.analyzeUserReport(message);
        
        // Simular consulta a base de datos basada en la aplicación y problema
        const analysisResults = {
            'TikTok': {
                crash: '✅ **Análisis completado**: TikTok está funcionando correctamente en nuestros servidores. El problema puede ser específico de tu dispositivo. Recomiendo reiniciar la app y verificar que tengas la última versión.',
                connection: '✅ **Estado verificado**: Los servidores de TikTok están operativos. Si tienes problemas de conexión, verifica tu conexión a internet.',
                slow: '⚠️ **Revisión detectada**: Hemos identificado algunos reportes similares. Nuestro equipo técnico está investigando posibles optimizaciones.',
                general: '✅ **Análisis general**: TikTok está funcionando dentro de parámetros normales. Tu reporte será enviado al equipo de desarrollo.'
            },
            'Instagram': {
                crash: '✅ **Verificación completa**: Instagram funciona correctamente. Intenta cerrar y reabrir la aplicación.',
                connection: '✅ **Servidores OK**: Instagram está operativo. Problema puede ser de conectividad local.',
                slow: '✅ **Rendimiento normal**: Instagram está funcionando a velocidad normal según nuestros monitores.',
                general: '✅ **Estado normal**: Instagram funciona correctamente según nuestros sistemas de monitoreo.'
            },
            'Netflix': {
                crash: '✅ **Sistemas operativos**: Netflix está funcionando correctamente en nuestros sistemas.',
                connection: '✅ **Streaming OK**: Los servidores de Netflix están funcionando normalmente.',
                slow: '⚠️ **Análisis detectado**: Algunos usuarios reportan problemas de velocidad. Verifica tu conexión a internet.',
                general: '✅ **Todo operativo**: Netflix está funcionando dentro de los parámetros normales.'
            },
            'WhatsApp': {
                crash: '✅ **Funcionamiento normal**: WhatsApp está operativo en todos nuestros sistemas de monitoreo.',
                connection: '✅ **Conexión estable**: Los servidores de WhatsApp están funcionando correctamente.',
                slow: '✅ **Velocidad normal**: WhatsApp está respondiendo a velocidad normal.',
                general: '✅ **Estado óptimo**: WhatsApp funciona correctamente según nuestros análisis.'
            }
        };

        // Obtener resultado específico o genérico
        const appResults = analysisResults[appName];
        if (appResults && appResults[problemType]) {
            return appResults[problemType];
        } else if (appResults && appResults.general) {
            return appResults.general;
        }

        // Respuesta genérica para apps no específicamente configuradas
        return `✅ **Análisis completado**: He revisado ${appName} en nuestra base de datos y los sistemas están funcionando normalmente. Tu reporte ha sido registrado y será revisado por nuestro equipo técnico. Si el problema persiste, intenta reinstalar la aplicación.`;
    }

    addGenericAgentResponse(userMessage) {
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();

            const responses = [
                'Entiendo tu preocupación. ¿Podrías proporcionarme más detalles?',
                'Gracias por la información. ¿Hay algo más específico que pueda ayudarte?',
                'Perfecto. ¿El problema está relacionado con alguna aplicación en particular?',
                'Te entiendo. Para poder ayudarte mejor, ¿podrías ser más específico sobre el problema?'
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addAgentMessage(randomResponse);
        }, 1500);
    }

    addUserMessage(message) {
        const chatBody = document.getElementById('supportChatBody');
        if (!chatBody) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';

        messageDiv.innerHTML = `
            <div class="message-avatar user">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div>${message.replace(/\n/g, '<br>')}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;

        chatBody.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAgentMessage(message) {
        const chatBody = document.getElementById('supportChatBody');
        if (!chatBody) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message agent';

        messageDiv.innerHTML = `
            <div class="message-avatar agent">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div>${message}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;

        chatBody.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const chatBody = document.getElementById('supportChatBody');
        if (!chatBody) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';

        typingDiv.innerHTML = `
            <div class="message-avatar agent">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        chatBody.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const chatBody = document.getElementById('supportChatBody');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Variable global para el sistema de chat
window.supportChatSystem = null;

// Función global para abrir el chat desde configuración
function openSupportChat() {
    if (window.supportChatSystem) {
        window.supportChatSystem.openChat();
    } else {
        // Si aún no está inicializado, intentar inicializarlo
        setTimeout(() => {
            if (window.supportChatSystem) {
                window.supportChatSystem.openChat();
            }
        }, 100);
    }
}

// Hacer la función disponible globalmente
window.openSupportChat = openSupportChat;

// Inicializar sistema de chat cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia global del sistema de chat
    window.supportChatSystem = new SupportChatSystem();
});
