// PARCHE PARA SCRIPT.JS - Agregar al final del archivo o reemplazar funciones

// Sobrescribir renderPosts para filtrar usuarios bloqueados
if (typeof MomentosSystem !== 'undefined') {
  MomentosSystem.prototype.renderPostsOriginal = MomentosSystem.prototype.renderPosts;
  
  MomentosSystem.prototype.renderPosts = function(posts) {
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
    
    // Filtrar posts de usuarios bloqueados
    const filteredPosts = posts.filter(post => !userBlockSystem.isBlocked(post.author));
    
    if (filteredPosts.length === 0) {
      feed.innerHTML = `
        <div class="loading-posts">
          <i class="fas fa-user-slash"></i>
          <p>Todos los momentos están de usuarios bloqueados</p>
        </div>
      `;
      return;
    }
    
    feed.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
    this.attachPostEventListeners();
  };
  
  // Sobrescribir createPostCard para agregar opción de bloquear
  MomentosSystem.prototype.createPostCardOriginal = MomentosSystem.prototype.createPostCard;
  
  MomentosSystem.prototype.createPostCard = function(post) {
    const timeAgo = this.getTimeAgo(post.timestamp);
    const isLiked = post.likedBy && post.likedBy.includes(this.currentUser.id);
    const repliesCount = post.replies ? Object.keys(post.replies).length : 0;
    const isBlocked = userBlockSystem.isBlocked(post.author);
    
    return `
      <div class="post-card ${isBlocked ? 'blocked-post' : ''}" data-post-id="${post.id}" data-post-author="${post.author}">
        <div class="post-header">
          <div class="user-avatar" style="background: ${post.authorColor}">
            ${post.author.substring(5, 7).toUpperCase()}
          </div>
          <div class="post-user-info">
            <div class="username">${post.author}</div>
            <div class="post-time">${timeAgo}</div>
          </div>
          <div class="post-menu">
            <button class="post-menu-btn" data-post-id="${post.id}">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="post-menu-dropdown" id="menu-${post.id}" style="display: none;">
              ${post.author === this.currentUser.id ? `
                <button class="menu-option delete-option" data-post-id="${post.id}">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              ` : `
                <button class="menu-option block-option" data-post-author="${post.author}">
                  <i class="fas fa-ban"></i> Bloquear usuario
                </button>
              `}
              <button class="menu-option report-option" data-post-id="${post.id}" data-post-author="${post.author}">
                <i class="fas fa-flag"></i> Reportar
              </button>
            </div>
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
  };
  
  // Sobrescribir attachPostEventListeners para agregar listeners de bloqueo
  MomentosSystem.prototype.attachPostEventListenersOriginal = MomentosSystem.prototype.attachPostEventListeners;
  
  MomentosSystem.prototype.attachPostEventListeners = function() {
    // Llamar función original
    this.attachPostEventListenersOriginal();
    
    // Agregar listeners para bloquear
    document.querySelectorAll('.block-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postAuthor = btn.dataset.postAuthor;
        blockUserDirectly(postAuthor);
      });
    });
    
    // Sobrescribir listeners de reportar para usar modal de pantalla completa
    document.querySelectorAll('.report-option').forEach(btn => {
      // Remover listener anterior
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = newBtn.dataset.postId;
        const postAuthor = newBtn.dataset.postAuthor;
        reportPostFullscreen(postId, postAuthor);
      });
    });
  };
  
  // Sobrescribir reportPost para usar modal de pantalla completa
  MomentosSystem.prototype.reportPost = function(postId) {
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    const postAuthor = postCard ? postCard.dataset.postAuthor : null;
    reportPostFullscreen(postId, postAuthor);
  };
}
