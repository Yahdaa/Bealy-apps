// Sistema de FAQ y Discursos
const faqArticles = {
  about: {
    title: '¿Qué es Veraxa?',
    content: `
      <h3>Bienvenido a Veraxa</h3>
      <p>Veraxa es una plataforma innovadora que te permite descubrir, explorar y descargar las mejores aplicaciones de manera segura y confiable.</p>
      
      <h3>Nuestra Misión</h3>
      <p>Facilitar el acceso a aplicaciones de calidad mientras garantizamos la seguridad y privacidad de nuestros usuarios.</p>
      
      <h3>¿Por qué elegir Veraxa?</h3>
      <ul>
        <li>Verificación de seguridad en todas las aplicaciones</li>
        <li>Información detallada y transparente</li>
        <li>Actualizaciones en tiempo real</li>
        <li>Comunidad activa y soporte dedicado</li>
      </ul>
    `
  },
  features: {
    title: 'Características principales',
    content: `
      <h3>Descubre lo que ofrecemos</h3>
      <p>Veraxa cuenta con múltiples características diseñadas para mejorar tu experiencia:</p>
      
      <ul>
        <li><strong>Búsqueda avanzada:</strong> Encuentra apps rápidamente con nuestro sistema de búsqueda inteligente</li>
        <li><strong>Momentos:</strong> Comparte y descubre contenido de la comunidad</li>
        <li><strong>Modo oscuro:</strong> Protege tus ojos con nuestro tema oscuro</li>
        <li><strong>Notificaciones:</strong> Mantente al día con las últimas actualizaciones</li>
        <li><strong>Discursos:</strong> Participa en conversaciones sobre artículos y apps</li>
      </ul>
    `
  },
  security: {
    title: 'Seguridad y privacidad',
    content: `
      <h3>Tu seguridad es nuestra prioridad</h3>
      <p>En Veraxa tomamos muy en serio la seguridad y privacidad de nuestros usuarios.</p>
      
      <h3>Medidas de seguridad</h3>
      <ul>
        <li>Verificación de todas las aplicaciones antes de publicarlas</li>
        <li>Análisis de malware y virus</li>
        <li>Cifrado de datos sensibles</li>
        <li>No compartimos tu información con terceros</li>
      </ul>
      
      <h3>Privacidad</h3>
      <p>Solo recopilamos la información necesaria para brindarte el mejor servicio. Puedes revisar nuestra política de privacidad en cualquier momento.</p>
    `
  },
  install: {
    title: '¿Cómo instalar aplicaciones?',
    content: `
      <h3>Guía de instalación paso a paso</h3>
      
      <h3>Paso 1: Busca la aplicación</h3>
      <p>Usa la barra de búsqueda o navega por las categorías para encontrar la app que deseas.</p>
      
      <h3>Paso 2: Revisa los detalles</h3>
      <p>Haz clic en la aplicación para ver información detallada, capturas de pantalla y reseñas.</p>
      
      <h3>Paso 3: Descarga</h3>
      <p>Presiona el botón "Descargar" y serás redirigido a la tienda oficial (Google Play o App Store).</p>
      
      <h3>Paso 4: Instala</h3>
      <p>Sigue las instrucciones de la tienda oficial para completar la instalación.</p>
    `
  },
  update: {
    title: 'Actualizar aplicaciones',
    content: `
      <h3>Mantén tus apps actualizadas</h3>
      <p>Las actualizaciones son importantes para la seguridad y nuevas funciones.</p>
      
      <h3>Actualizaciones automáticas</h3>
      <p>Configura tu dispositivo para actualizar apps automáticamente desde la tienda oficial.</p>
      
      <h3>Actualizaciones manuales</h3>
      <ol>
        <li>Abre Google Play Store o App Store</li>
        <li>Ve a "Mis aplicaciones"</li>
        <li>Busca apps con actualizaciones disponibles</li>
        <li>Presiona "Actualizar"</li>
      </ol>
    `
  },
  uninstall: {
    title: 'Desinstalar aplicaciones',
    content: `
      <h3>Elimina apps que no uses</h3>
      <p>Libera espacio desinstalando aplicaciones que ya no necesitas.</p>
      
      <h3>En Android:</h3>
      <ol>
        <li>Ve a Configuración > Aplicaciones</li>
        <li>Selecciona la app que deseas eliminar</li>
        <li>Presiona "Desinstalar"</li>
      </ol>
      
      <h3>En iOS:</h3>
      <ol>
        <li>Mantén presionado el ícono de la app</li>
        <li>Selecciona "Eliminar app"</li>
        <li>Confirma la eliminación</li>
      </ol>
    `
  },
  errors: {
    title: 'Errores comunes',
    content: `
      <h3>Soluciones rápidas</h3>
      
      <h3>Error: "No se puede descargar"</h3>
      <ul>
        <li>Verifica tu conexión a internet</li>
        <li>Asegúrate de tener espacio suficiente</li>
        <li>Reinicia tu dispositivo</li>
      </ul>
      
      <h3>Error: "App no compatible"</h3>
      <ul>
        <li>Verifica la versión de tu sistema operativo</li>
        <li>Actualiza tu dispositivo si es posible</li>
        <li>Busca versiones alternativas de la app</li>
      </ul>
    `
  },
  compatibility: {
    title: 'Problemas de compatibilidad',
    content: `
      <h3>Apps que no funcionan</h3>
      <p>Algunos problemas de compatibilidad son comunes y tienen solución.</p>
      
      <h3>Verifica los requisitos</h3>
      <p>Cada app tiene requisitos mínimos de sistema. Revisa que tu dispositivo los cumpla.</p>
      
      <h3>Actualiza tu sistema</h3>
      <p>Mantén tu sistema operativo actualizado para mejor compatibilidad.</p>
    `
  },
  performance: {
    title: 'Mejorar rendimiento',
    content: `
      <h3>Optimiza tu experiencia</h3>
      
      <h3>Consejos para mejor rendimiento:</h3>
      <ul>
        <li>Cierra apps que no estés usando</li>
        <li>Limpia la caché regularmente</li>
        <li>Desinstala apps innecesarias</li>
        <li>Reinicia tu dispositivo periódicamente</li>
        <li>Mantén tus apps actualizadas</li>
      </ul>
    `
  },
  account: {
    title: 'Gestionar tu cuenta',
    content: `
      <h3>Perfil y configuración</h3>
      <p>Personaliza tu experiencia en Veraxa.</p>
      
      <h3>Configuración de perfil</h3>
      <p>Accede a Configuración para personalizar tu nombre, foto y preferencias.</p>
      
      <h3>Privacidad</h3>
      <p>Controla qué información compartes y quién puede verla.</p>
    `
  },
  notifications: {
    title: 'Notificaciones',
    content: `
      <h3>Controla tus alertas</h3>
      <p>Personaliza qué notificaciones deseas recibir.</p>
      
      <h3>Tipos de notificaciones:</h3>
      <ul>
        <li>Nuevas apps disponibles</li>
        <li>Actualizaciones de apps</li>
        <li>Respuestas a tus comentarios</li>
        <li>Momentos de la comunidad</li>
      </ul>
    `
  }
};

let currentArticleId = null;

function showFaqArticle(articleId) {
  currentArticleId = articleId;
  const article = faqArticles[articleId];
  
  if (!article) return;
  
  document.getElementById('faqModal').style.display = 'none';
  const articleModal = document.getElementById('articleModal');
  articleModal.classList.add('active');
  
  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleBody').innerHTML = article.content;
  
  loadDiscursos(articleId);
}

function backToFaq() {
  const articleModal = document.getElementById('articleModal');
  const faqModal = document.getElementById('faqModal');
  
  if (articleModal) {
    articleModal.classList.remove('active');
    articleModal.style.display = 'none';
  }
  
  if (faqModal) {
    faqModal.style.display = 'block';
  }
  
  currentArticleId = null;
}

// Sistema de Discursos
function loadDiscursos(articleId) {
  const feed = document.getElementById('discursosFeed');
  feed.innerHTML = '<div class="loading-discursos"><i class="fas fa-spinner fa-spin"></i><p>Cargando discursos...</p></div>';
  
  database.ref(`discursos/${articleId}`).on('value', (snapshot) => {
    const discursos = [];
    snapshot.forEach((child) => {
      discursos.push(child.val());
    });
    
    discursos.sort((a, b) => b.timestamp - a.timestamp);
    renderDiscursos(discursos);
    document.getElementById('discursosCount').textContent = `${discursos.length} comentario${discursos.length !== 1 ? 's' : ''}`;
  });
}

function renderDiscursos(discursos) {
  const feed = document.getElementById('discursosFeed');
  
  if (discursos.length === 0) {
    feed.innerHTML = '<div class="loading-discursos"><i class="fas fa-comment"></i><p>Sé el primero en comentar</p></div>';
    return;
  }
  
  const currentUserId = momentosSystem ? momentosSystem.currentUser.id : null;
  
  feed.innerHTML = discursos.map(d => `
    <div class="discurso-card post-card" data-discurso-id="${d.id}">
      <div class="post-header">
        <div class="user-avatar" style="background: ${d.authorColor}">
          ${d.author.substring(5, 7).toUpperCase()}
        </div>
        <div class="post-user-info">
          <div class="username">${d.author}</div>
          <div class="post-time">${getTimeAgo(d.timestamp)}</div>
        </div>
        <div class="post-menu">
          <button class="post-menu-btn" onclick="toggleDiscursoMenu('${d.id}')">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="post-menu-dropdown" id="discurso-menu-${d.id}" style="display: none;">
            ${d.author === currentUserId ? `
              <button class="menu-option delete-option" onclick="deleteDiscurso('${d.id}')">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            ` : ''}
            <button class="menu-option report-option" onclick="reportDiscurso('${d.id}')">
              <i class="fas fa-flag"></i> Reportar
            </button>
          </div>
        </div>
      </div>
      <div class="post-content">${d.content}</div>
    </div>
  `).join('');
}

function toggleDiscursoMenu(discursoId) {
  const menu = document.getElementById(`discurso-menu-${discursoId}`);
  const allMenus = document.querySelectorAll('.post-menu-dropdown');
  
  allMenus.forEach(m => {
    if (m.id !== `discurso-menu-${discursoId}`) {
      m.style.display = 'none';
    }
  });
  
  if (menu) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
}

async function deleteDiscurso(discursoId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;
  
  if (!currentArticleId) return;
  
  try {
    await database.ref(`discursos/${currentArticleId}/${discursoId}`).remove();
    showNotificationMessage('Comentario eliminado');
  } catch (error) {
    console.error('Error eliminando discurso:', error);
    showNotificationMessage('Error al eliminar', true);
  }
}

function reportDiscurso(discursoId) {
  const modal = document.createElement('div');
  modal.className = 'report-modal active';
  modal.innerHTML = `
    <div class="report-content">
      <div class="report-header">
        <h3>Reportar Comentario</h3>
        <button class="close-report" onclick="this.closest('.report-modal').remove()">×</button>
      </div>
      <div class="report-body">
        <p>Explica brevemente el problema (máximo 30 palabras):</p>
        <textarea id="reportDiscursoReason" maxlength="200" placeholder="Describe el problema..."></textarea>
        <div class="word-count"><span id="discursoWordCount">0</span>/30 palabras</div>
      </div>
      <div class="report-actions">
        <button class="cancel-btn" onclick="this.closest('.report-modal').remove()">Cancelar</button>
        <button class="submit-btn" id="submitDiscursoReport" onclick="submitDiscursoReport('${discursoId}')">Enviar Reporte</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  const textarea = modal.querySelector('#reportDiscursoReason');
  const wordCountSpan = modal.querySelector('#discursoWordCount');
  const submitBtn = modal.querySelector('#submitDiscursoReport');
  
  textarea.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCountSpan.textContent = words.length;
    submitBtn.disabled = words.length === 0 || words.length > 30;
  });
}

async function submitDiscursoReport(discursoId) {
  const modal = document.querySelector('.report-modal');
  const reason = modal.querySelector('#reportDiscursoReason').value.trim();
  
  if (!reason || !currentArticleId) return;
  
  try {
    await database.ref('discurso-reports').push({
      articleId: currentArticleId,
      discursoId: discursoId,
      reason: reason,
      reportedBy: momentosSystem.currentUser.id,
      timestamp: Date.now()
    });
    
    modal.remove();
    showNotificationMessage('Reporte enviado. Gracias por tu colaboración.');
  } catch (error) {
    console.error('Error enviando reporte:', error);
    showNotificationMessage('Error al enviar reporte', true);
  }
}

function showNotificationMessage(message, isError = false) {
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

function getTimeAgo(timestamp) {
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const discursoInput = document.getElementById('discursoInput');
  const charCount = document.getElementById('discursoCharCount');
  const publishBtn = document.getElementById('publishDiscursoBtn');
  
  if (discursoInput) {
    discursoInput.addEventListener('input', () => {
      const remaining = 280 - discursoInput.value.length;
      charCount.textContent = remaining;
      charCount.className = remaining < 20 ? 'char-count warning' : 'char-count';
      publishBtn.disabled = discursoInput.value.trim().length === 0;
    });
  }
  
  if (publishBtn) {
    publishBtn.addEventListener('click', publishDiscurso);
  }
});

async function publishDiscurso() {
  const input = document.getElementById('discursoInput');
  const content = input.value.trim();
  
  if (!content || !currentArticleId) return;
  
  const discurso = {
    id: Date.now().toString(),
    content: content,
    author: momentosSystem.currentUser.id,
    authorColor: momentosSystem.currentUser.color,
    timestamp: Date.now()
  };
  
  try {
    await database.ref(`discursos/${currentArticleId}/${discurso.id}`).set(discurso);
    input.value = '';
    document.getElementById('discursoCharCount').textContent = '280';
    document.getElementById('publishDiscursoBtn').disabled = true;
  } catch (error) {
    console.error('Error publicando discurso:', error);
    alert('Error al publicar. Intenta de nuevo.');
  }
}
