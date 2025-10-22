// js/spa.js
// Carrega o conteúdo de uma página (fetch) e injeta o <main> retornado.
// Atualiza history API para permitir back/forward.
// Observação: fetch em file:// pode falhar — use Live Server ou GitHub Pages.

export function initSPA() {
  // on first load, nothing special — links serão interceptados
  window.addEventListener('popstate', (e) => {
    const url = location.pathname.split('/').pop() || 'index.html';
    loadIntoMain(url, false);
  });
}

/**
 * Faz fetch do arquivo HTML e substitui o <main> atual pelo <main> do documento carregado.
 * @param {string} href - caminho relativo (ex: 'projetos.html')
 * @param {boolean} pushState - se deve adicionar ao history
 */
export async function loadIntoMain(href, pushState = true) {
  try {
    const res = await fetch(href, {cache: "no-store"});
    if (!res.ok) throw new Error('Falha ao carregar página: ' + href);

    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const novoMain = doc.querySelector('main');
    if (!novoMain) {
      console.warn('Documento não contém <main>. Carregando body completo como fallback.');
      document.querySelector('main').innerHTML = doc.body.innerHTML;
    } else {
      const main = document.querySelector('main');
      main.innerHTML = novoMain.innerHTML;

      // Reaplicar título e meta description (opcional)
      const novoTitle = doc.querySelector('title');
      if (novoTitle) document.title = novoTitle.textContent;
    }

    // Reaplicar scripts que podem precisar rodar (ex: menu hamburger)
    const inlineReadyEvent = new Event('spa:loaded');
    document.dispatchEvent(inlineReadyEvent);

    if (pushState) {
      history.pushState({}, '', href);
    }
  } catch (err) {
    console.error(err);
    // fallback: navegação normal
    location.href = href;
  }
}

export function hijackNavLinks() {
  // intercepta cliques em <a> que apontem para páginas do mesmo site
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // ignora âncoras internas e links externos
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

    // impede comportamento padrão e faz SPA load
    ev.preventDefault();
    loadIntoMain(href, true);
  });
}
