// Sistema de Notificaciones Estilo PayPal

class PayPalNotification {
  constructor() {
    this.activeNotifications = [];
  }

  show(options) {
    const {
      type = 'info', // 'loading', 'success', 'error', 'info'
      title = '',
      message = '',
      duration = 3000,
      showClose = true,
      showProgress = true
    } = options;

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `paypal-notification ${type}`;
    
    // Generar contenido según el tipo
    let iconHTML = '';
    if (type === 'loading') {
      iconHTML = '<div class="paypal-spinner"></div>';
    } else if (type === 'success') {
      iconHTML = '<div class="paypal-icon success"><i class="fas fa-check"></i></div>';
    } else if (type === 'error') {
      iconHTML = '<div class="paypal-icon error"><i class="fas fa-times"></i></div>';
    } else {
      iconHTML = '<div class="paypal-icon info"><i class="fas fa-info"></i></div>';
    }

    notification.innerHTML = `
      ${iconHTML}
      <div class="paypal-notification-content">
        ${title ? `<div class="paypal-notification-title">${title}</div>` : ''}
        ${message ? `<div class="paypal-notification-message">${message}</div>` : ''}
      </div>
      ${showClose ? '<button class="paypal-notification-close"><i class="fas fa-times"></i></button>' : ''}
      ${showProgress && type !== 'loading' ? '<div class="paypal-notification-progress"></div>' : ''}
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Ajustar posición si hay múltiples notificaciones
    const offset = this.activeNotifications.length * 80;
    notification.style.top = `${20 + offset}px`;

    // Agregar a la lista de notificaciones activas
    this.activeNotifications.push(notification);

    // Mostrar con animación
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Event listener para cerrar
    if (showClose) {
      const closeBtn = notification.querySelector('.paypal-notification-close');
      closeBtn.addEventListener('click', () => {
        this.hide(notification);
      });
    }

    // Auto-cerrar si no es loading
    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }

    return notification;
  }

  hide(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');

    setTimeout(() => {
      notification.remove();
      
      // Remover de la lista de notificaciones activas
      const index = this.activeNotifications.indexOf(notification);
      if (index > -1) {
        this.activeNotifications.splice(index, 1);
      }

      // Reajustar posiciones de las notificaciones restantes
      this.activeNotifications.forEach((notif, i) => {
        notif.style.top = `${20 + (i * 80)}px`;
      });
    }, 300);
  }

  loading(title, message) {
    return this.show({
      type: 'loading',
      title: title,
      message: message,
      duration: 0,
      showClose: false,
      showProgress: false
    });
  }

  success(title, message, duration = 3000) {
    return this.show({
      type: 'success',
      title: title,
      message: message,
      duration: duration
    });
  }

  error(title, message, duration = 4000) {
    return this.show({
      type: 'error',
      title: title,
      message: message,
      duration: duration
    });
  }

  info(title, message, duration = 3000) {
    return this.show({
      type: 'info',
      title: title,
      message: message,
      duration: duration
    });
  }

  updateLoading(notification, type, title, message) {
    // Actualizar notificación de loading a otro tipo
    const icon = notification.querySelector('.paypal-spinner, .paypal-icon');
    const titleEl = notification.querySelector('.paypal-notification-title');
    const messageEl = notification.querySelector('.paypal-notification-message');

    // Actualizar clase
    notification.className = `paypal-notification ${type} show`;

    // Actualizar icono
    if (type === 'success') {
      icon.outerHTML = '<div class="paypal-icon success"><i class="fas fa-check"></i></div>';
    } else if (type === 'error') {
      icon.outerHTML = '<div class="paypal-icon error"><i class="fas fa-times"></i></div>';
    }

    // Actualizar texto
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    // Agregar barra de progreso
    const progress = document.createElement('div');
    progress.className = 'paypal-notification-progress';
    notification.appendChild(progress);

    // Auto-cerrar
    setTimeout(() => {
      this.hide(notification);
    }, 3000);
  }
}

// Instancia global
const paypalNotify = new PayPalNotification();

// Sobrescribir funciones antiguas de notificación
function showNotificationMessage(message, isError = false) {
  if (isError) {
    paypalNotify.error('Error', message);
  } else {
    paypalNotify.success('Éxito', message);
  }
}

// Función mejorada para bloquear usuario
async function blockUserDirectly(userId) {
  if (confirm('¿Estás seguro de que quieres bloquear a este usuario? No verás más sus publicaciones.')) {
    // Mostrar notificación de carga
    const loadingNotif = paypalNotify.loading('Bloqueando usuario', 'Por favor espera...');
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Bloquear usuario
    userBlockSystem.blockUser(userId);
    
    // Actualizar notificación a éxito
    paypalNotify.updateLoading(loadingNotif, 'success', 'Usuario bloqueado', 'No verás más sus publicaciones');
    
    // Recargar posts
    if (typeof momentosSystem !== 'undefined') {
      momentosSystem.loadPosts();
    }
  }
}

// Función mejorada para bloquear desde discursos
async function blockUserFromDiscurso(userId) {
  if (confirm('¿Estás seguro de que quieres bloquear a este usuario? No verás más sus comentarios.')) {
    const loadingNotif = paypalNotify.loading('Bloqueando usuario', 'Por favor espera...');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    userBlockSystem.blockUser(userId);
    
    paypalNotify.updateLoading(loadingNotif, 'success', 'Usuario bloqueado', 'No verás más sus comentarios');
    
    if (currentArticleId) {
      loadDiscursos(currentArticleId);
    }
  }
}

// Función mejorada para desbloquear
async function unblockUserFromSettings(userId) {
  if (confirm('¿Estás seguro de que quieres desbloquear a este usuario?')) {
    const loadingNotif = paypalNotify.loading('Desbloqueando usuario', 'Por favor espera...');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    userBlockSystem.unblockUser(userId);
    localStorage.removeItem(`blocked_date_${userId}`);
    
    paypalNotify.updateLoading(loadingNotif, 'success', 'Usuario desbloqueado', 'Ahora verás sus publicaciones');
    
    // Actualizar lista
    const userItem = document.querySelector(`[data-user-id="${userId}"]`);
    if (userItem) {
      userItem.style.opacity = '0';
      userItem.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        userItem.remove();
        
        const list = document.getElementById('blockedUsersList');
        if (list && list.children.length === 0) {
          list.innerHTML = `
            <div class="no-blocked-users">
              <i class="fas fa-user-check"></i>
              <h3>No has bloqueado a nadie</h3>
              <p>Los usuarios que bloquees aparecerán aquí</p>
            </div>
          `;
        }
      }, 300);
    }
    
    if (typeof momentosSystem !== 'undefined') {
      momentosSystem.loadPosts();
    }
  }
}
