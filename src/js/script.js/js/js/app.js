// js/app.js
import { initSPA, hijackNavLinks } from './spa.js';
import { initMasks, attachFormHandler } from './validation.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();            // cria container de toasts/modals e acessibilidade
  initSPA();           // habilita carregamento SPA via fetch + history
  hijackNavLinks();    // transforma links <a> em navegação SPA
  initMasks();         // aplica máscaras em inputs (CPF, telefone, CEP)
  attachFormHandler(); // conecta validação e salvamento localStorage ao form
});
