// js/ui.js
// Toaster / modal simples e acessível

export function initUI() {
  // área para toasts
  if (!document.getElementById('toaster')) {
    const toastWrap = document.createElement('div');
    toastWrap.id = 'toaster';
    toastWrap.setAttribute('aria-live', 'polite');
    toastWrap.style.position = 'fixed';
    toastWrap.style.right = '16px';
    toastWrap.style.bottom = '16px';
    toastWrap.style.zIndex = '9999';
    document.body.appendChild(toastWrap);
  }

  // modal container
  if (!document.getElementById('modal-root')) {
    const modal = document.createElement('div');
    modal.id = 'modal-root';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
      <div id="modal-content" role="dialog" aria-modal="true" style="background:#fff;padding:24px;border-radius:8px;max-width:480px;margin:16px;">
        <h3 id="modal-title"></h3>
        <div id="modal-body" style="margin-top:12px;"></div>
        <button id="modal-close" style="margin-top:16px;padding:8px 12px;border:none;background:#b22222;color:white;border-radius:6px;cursor:pointer;">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
}

export function showToast(message = '', opts = {}) {
  const wrap = document.getElementById('toaster');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  el.style.background = opts.type === 'error' ? '#ffdddd' : '#ddffdd';
  el.style.border = '1px solid rgba(0,0,0,0.1)';
  el.style.padding = '12px 16px';
  el.style.marginTop = '8px';
  el.style.borderRadius = '8px';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
  wrap.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 300ms';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

export function showModal(title = '', body = '') {
  const modal = document.getElementById('modal-root');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.querySelector('#modal-title').textContent = title;
  const b = modal.querySelector('#modal-body');
  if (typeof body === 'string') b.textContent = body;
  else b.innerHTML = body;
}
