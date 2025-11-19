// Sistema de Gestión de Usuarios Bloqueados en Ajustes

// Agregar event listener cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const blockedUsersBtn = document.getElementById('blockedUsersSettingsBtn');
  if (blockedUsersBtn) {
    blockedUsersBtn.addEventListener('click', showBlockedUsersSettings);
  }
});

function showBlockedUsersSettings() {
  // Cerrar modal de ajustes
  document.getElementById('settingsModal').style.display = 'none';
  
  // Crear modal de usuarios bloqueados
  const modal = document.createElement('div');
  modal.className = 'blocked-users-modal';
  modal.id = 'blockedUsersModal';
  
  const blockedUsers = userBlockSystem.getBlockedUsers();
  const blockedUsersData = blockedUsers.map(userId => {
    return {
      id: userId,
      color: generateColorFromId(userId),
      blockedDate: localStorage.getItem(`blocked_date_${userId}`) || Date.now()
    };
  });
  
  modal.innerHTML = `
    <div class="blocked-users-header">
      <button class="back-to-settings-btn" onclick="closeBlockedUsersSettings()">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>Usuarios Bloqueados</h2>
    </div>
    
    <div class="blocked-users-body">
      <div class="blocked-users-info">
        <h3><i class="fas fa-info-circle"></i> Acerca del bloqueo</h3>
        <p>Los usuarios bloqueados no podrán ver tus publicaciones y tú no verás las suyas en Momentos ni en los comentarios de artículos.</p>
      </div>
      
      <div class="blocked-users-list" id="blockedUsersList">
        ${blockedUsersData.length === 0 ? `
          <div class="no-blocked-users">
            <i class="fas fa-user-check"></i>
            <h3>No has bloqueado a nadie</h3>
            <p>Los usuarios que bloquees aparecerán aquí</p>
          </div>
        ` : blockedUsersData.map(user => `
          <div class="blocked-user-item" data-user-id="${user.id}">
            <div class="blocked-user-info">
              <div class="blocked-user-avatar" style="background: ${user.color}">
                ${user.id.substring(5, 7).toUpperCase()}
              </div>
              <div class="blocked-user-details">
                <div class="blocked-user-name">${user.id}</div>
                <div class="blocked-date">Bloqueado ${getTimeAgoFromTimestamp(user.blockedDate)}</div>
              </div>
            </div>
            <button class="unblock-btn" onclick="unblockUserFromSettings('${user.id}')">
              Desbloquear
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

function closeBlockedUsersSettings() {
  const modal = document.getElementById('blockedUsersModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.getElementById('settingsModal').style.display = 'block';
    }, 300);
  }
}

function unblockUserFromSettings(userId) {
  if (confirm('¿Estás seguro de que quieres desbloquear a este usuario?')) {
    userBlockSystem.unblockUser(userId);
    localStorage.removeItem(`blocked_date_${userId}`);
    
    // Actualizar lista
    const userItem = document.querySelector(`[data-user-id="${userId}"]`);
    if (userItem) {
      userItem.style.opacity = '0';
      userItem.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        userItem.remove();
        
        // Si no quedan usuarios bloqueados, mostrar mensaje
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
    
    showNotificationMessage('Usuario desbloqueado exitosamente');
    
    // Recargar posts si está en Momentos
    if (typeof momentosSystem !== 'undefined') {
      momentosSystem.loadPosts();
    }
  }
}

function generateColorFromId(userId) {
  const colors = ['#007aff', '#ff3040', '#30d158', '#ff9500', '#bf5af2', '#ff2d92'];
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getTimeAgoFromTimestamp(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'hace un momento';
}

// Sobrescribir función de bloqueo para guardar fecha
const originalBlockUser = userBlockSystem.blockUser.bind(userBlockSystem);
userBlockSystem.blockUser = function(userId) {
  const result = originalBlockUser(userId);
  if (result) {
    localStorage.setItem(`blocked_date_${userId}`, Date.now());
  }
  return result;
};

// Agregar función de bloqueo a discursos (FAQ/Artículos)
function renderDiscursosWithBlock(discursos) {
  const feed = document.getElementById('discursosFeed');
  
  if (discursos.length === 0) {
    feed.innerHTML = '<div class="loading-discursos"><i class="fas fa-comment"></i><p>Sé el primero en comentar</p></div>';
    return;
  }
  
  const currentUserId = momentosSystem ? momentosSystem.currentUser.id : null;
  
  // Filtrar discursos de usuarios bloqueados
  const filteredDiscursos = discursos.filter(d => !userBlockSystem.isBlocked(d.author));
  
  if (filteredDiscursos.length === 0) {
    feed.innerHTML = '<div class="loading-discursos"><i class="fas fa-user-slash"></i><p>Todos los comentarios son de usuarios bloqueados</p></div>';
    return;
  }
  
  feed.innerHTML = filteredDiscursos.map(d => `
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
            ` : `
              <button class="menu-option block-option" onclick="blockUserFromDiscurso('${d.author}')">
                <i class="fas fa-ban"></i> Bloquear usuario
              </button>
            `}
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

function blockUserFromDiscurso(userId) {
  if (confirm('¿Estás seguro de que quieres bloquear a este usuario? No verás más sus comentarios.')) {
    userBlockSystem.blockUser(userId);
    showNotificationMessage('Usuario bloqueado exitosamente');
    
    // Recargar discursos
    if (currentArticleId) {
      loadDiscursos(currentArticleId);
    }
  }
}

// Sobrescribir renderDiscursos original
if (typeof renderDiscursos !== 'undefined') {
  window.renderDiscursosOriginal = renderDiscursos;
  window.renderDiscursos = renderDiscursosWithBlock;
}
