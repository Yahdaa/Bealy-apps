// Mejoras para el Sistema de Momentos

// Sistema de Bloqueo de Usuarios
class UserBlockSystem {
  constructor() {
    this.blockedUsers = this.loadBlockedUsers();
  }

  loadBlockedUsers() {
    const blocked = localStorage.getItem('blockedUsers');
    return blocked ? JSON.parse(blocked) : [];
  }

  saveBlockedUsers() {
    localStorage.setItem('blockedUsers', JSON.stringify(this.blockedUsers));
  }

  blockUser(userId) {
    if (!this.blockedUsers.includes(userId)) {
      this.blockedUsers.push(userId);
      this.saveBlockedUsers();
      return true;
    }
    return false;
  }

  unblockUser(userId) {
    const index = this.blockedUsers.indexOf(userId);
    if (index > -1) {
      this.blockedUsers.splice(index, 1);
      this.saveBlockedUsers();
      return true;
    }
    return false;
  }

  isBlocked(userId) {
    return this.blockedUsers.includes(userId);
  }

  getBlockedUsers() {
    return [...this.blockedUsers];
  }
}

// Instanciar sistema de bloqueo
const userBlockSystem = new UserBlockSystem();

// Función mejorada para reportar en pantalla completa
function reportPostFullscreen(postId, postAuthor) {
  const modal = document.createElement('div');
  modal.className = 'report-modal-fullscreen';
  modal.id = 'reportModalFullscreen';
  
  modal.innerHTML = `
    <div class="report-fullscreen-header">
      <button class="close-report-fullscreen" onclick="closeReportFullscreen()">
        <i class="fas fa-times"></i>
      </button>
      <h2>Reportar Momento</h2>
    </div>
    
    <div class="report-fullscreen-body">
      <div class="report-section">
        <h3><i class="fas fa-flag"></i> ¿Por qué reportas este momento?</h3>
        <p>Tu reporte nos ayuda a mantener una comunidad segura y respetuosa. Por favor, describe brevemente el problema.</p>
        
        <textarea 
          id="reportReasonFullscreen" 
          class="report-textarea" 
          placeholder="Describe el problema (máximo 30 palabras)..."
          maxlength="200"></textarea>
        
        <div class="report-word-count" id="reportWordCountFullscreen">
          <span id="wordCountNumber">0</span>/30 palabras
        </div>
      </div>
      
      <div class="report-section">
        <h3><i class="fas fa-shield-alt"></i> Opciones adicionales</h3>
        <p>También puedes bloquear a este usuario para no ver más sus publicaciones.</p>
        
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" id="blockUserCheckbox" style="width: 20px; height: 20px;">
          <span>Bloquear a este usuario</span>
        </label>
      </div>
    </div>
    
    <div class="report-actions-fullscreen">
      <button class="report-btn-fullscreen report-btn-cancel" onclick="closeReportFullscreen()">
        Cancelar
      </button>
      <button class="report-btn-fullscreen report-btn-submit" id="submitReportFullscreen" disabled>
        Enviar Reporte
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Event listeners
  const textarea = document.getElementById('reportReasonFullscreen');
  const wordCountDiv = document.getElementById('reportWordCountFullscreen');
  const wordCountNumber = document.getElementById('wordCountNumber');
  const submitBtn = document.getElementById('submitReportFullscreen');
  const blockCheckbox = document.getElementById('blockUserCheckbox');
  
  textarea.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCountNumber.textContent = words.length;
    
    if (words.length > 30) {
      wordCountDiv.classList.add('warning');
      submitBtn.disabled = true;
    } else if (words.length > 0) {
      wordCountDiv.classList.remove('warning');
      submitBtn.disabled = false;
    } else {
      wordCountDiv.classList.remove('warning');
      submitBtn.disabled = true;
    }
  });
  
  submitBtn.addEventListener('click', async () => {
    const reason = textarea.value.trim();
    const shouldBlock = blockCheckbox.checked;
    
    if (!reason) return;
    
    try {
      // Guardar reporte
      await database.ref('reports').push({
        postId: postId,
        reason: reason,
        reportedBy: momentosSystem.currentUser.id,
        timestamp: Date.now()
      });
      
      // Bloquear usuario si se seleccionó
      if (shouldBlock && postAuthor) {
        userBlockSystem.blockUser(postAuthor);
      }
      
      closeReportFullscreen();
      momentosSystem.showNotification('Reporte enviado. Gracias por tu colaboración.');
      
      // Recargar posts para ocultar los del usuario bloqueado
      if (shouldBlock) {
        momentosSystem.loadPosts();
      }
    } catch (error) {
      console.error('Error enviando reporte:', error);
      momentosSystem.showNotification('Error al enviar reporte', true);
    }
  });
}

function closeReportFullscreen() {
  const modal = document.getElementById('reportModalFullscreen');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Función para bloquear usuario directamente
async function blockUserDirectly(userId) {
  if (confirm('¿Estás seguro de que quieres bloquear a este usuario? No verás más sus publicaciones.')) {
    userBlockSystem.blockUser(userId);
    momentosSystem.showNotification('Usuario bloqueado exitosamente');
    momentosSystem.loadPosts();
  }
}

// Sistema de URLs únicas para aplicaciones - DESACTIVADO TEMPORALMENTE
// Se activará cuando se solucionen los conflictos

/*
class AppURLSystem {
  constructor() {
    this.initURLHandling();
  }

  initURLHandling() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.appId) {
        this.openAppFromURL(e.state.appId);
      }
    });

    this.checkInitialURL();
  }

  checkInitialURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('app');
    
    if (appId) {
      this.openAppFromURL(appId);
    }
  }

  openAppFromURL(appId) {
    const packageName = appId.replace(/-/g, '.');
    const app = apps.find(a => a.packageName === packageName);
    
    if (app && typeof openAppModal !== 'undefined') {
      openAppModal(app);
    }
  }
}

const appURLSystem = new AppURLSystem();
*/}
