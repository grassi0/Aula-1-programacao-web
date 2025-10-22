// js/validation.js
// Máscaras, validações (CPF com algoritmo), verificação de consistência e salvamento em localStorage.

import { showToast, showModal } from './ui.js';

function onlyDigits(value = '') {
  return value.replace(/\D/g, '');
}

/* -------------------------
   MÁSCARAS SIMPLES
------------------------- */
function maskCPF(value) {
  const v = onlyDigits(value).slice(0, 11);
  return v
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d{0,2})/, '$1-$2');
}

function maskPhone(value) {
  const v = onlyDigits(value).slice(0,11); // suporte 10 ou 11 dígitos
  if (v.length <= 10) {
    return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  }
  return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
}

function maskCEP(value) {
  const v = onlyDigits(value).slice(0,8);
  return v.replace(/^(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
}

/* -------------------------
   VALIDAÇÕES
------------------------- */
export function validateCPF(cpfRaw) {
  const cpf = onlyDigits(cpfRaw || '');
  if (cpf.length !== 11) return false;
  // rejeita sequências repetidas
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calc = (t) => {
    let sum = 0;
    for (let i = 0; i < t - 1; i++) {
      sum += parseInt(cpf.charAt(i), 10) * (t - i);
    }
    const d = 11 - (sum % 11);
    return d >= 10 ? 0 : d;
  };
  const d1 = calc(10);
  const d2 = calc(11);
  return d1 === parseInt(cpf.charAt(9), 10) && d2 === parseInt(cpf.charAt(10), 10);
}

function validateAge(dateString, minAge = 16) {
  if (!dateString) return false;
  const hoje = new Date();
  const nascimento = new Date(dateString);
  if (Number.isNaN(nascimento.getTime())) return false;
  let age = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) age--;
  return age >= minAge;
}

/* -------------------------
   MANIPULADORES E LÓGICA
------------------------- */
export function initMasks() {
  // aplica máscaras nos inputs existentes (se houver)
  const cpf = document.querySelector('#cpf');
  const tel = document.querySelector('#telefone');
  const cep = document.querySelector('#cep');

  if (cpf) {
    cpf.addEventListener('input', (e) => {
      const pos = e.target.selectionStart;
      e.target.value = maskCPF(e.target.value);
      // simples preservação de cursor omitida por brevidade
    });
  }

  if (tel) {
    tel.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
    });
  }

  if (cep) {
    cep.addEventListener('input', (e) => {
      e.target.value = maskCEP(e.target.value);
    });
  }

  // reaplica máscaras quando SPA carrega conteúdo novo
  document.addEventListener('spa:loaded', () => initMasks());
}

function collectFormData(form) {
  const fd = new FormData(form);
  const obj = {};
  for (const [k, v] of fd.entries()) obj[k] = v.trim();
  return obj;
}

export function attachFormHandler() {
  // suporta vários formulários (ex.: em SPA)
  function handle(form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = collectFormData(form);

      // checagens de consistência:
      const erros = [];

      // campos obrigatórios básicos
      const obrigatorios = ['nome', 'email', 'cpf', 'telefone', 'nascimento', 'endereco', 'cep', 'cidade', 'estado', 'tipo'];
      obrigatorios.forEach(k => {
        if (!data[k]) erros.push(`O campo "${k}" é obrigatório.`);
      });

      // CPF
      if (data.cpf && !validateCPF(data.cpf)) erros.push('CPF inválido.');

      // telefone: pelo menos 10 dígitos
      if (data.telefone && onlyDigits(data.telefone).length < 10) erros.push('Telefone inválido.');

      // CEP 8 dígitos
      if (data.cep && onlyDigits(data.cep).length !== 8) erros.push('CEP inválido.');

      // idade mínima 16 anos (exemplo de consistência)
      if (data.nascimento && !validateAge(data.nascimento, 16)) erros.push('É necessário ter pelo menos 16 anos para se cadastrar.');

      if (erros.length) {
        showToast(erros.join(' '), { type: 'error' });
        return;
      }

      // salvo em localStorage como simulação de backend
      const key = 'cadastros_ong';
      const listaJson = localStorage.getItem(key);
      const lista = listaJson ? JSON.parse(listaJson) : [];
      const registro = {
        id: Date.now(),
        ...data,
        criadoEm: new Date().toISOString()
      };
      lista.push(registro);
      localStorage.setItem(key, JSON.stringify(lista));

      showToast('Cadastro enviado com sucesso!', { type: 'success' });
      showModal('Cadastro recebido', 'Obrigado por se cadastrar! Sua participação é muito importante.');

      // opcional: limpar form
      form.reset();
    });
  }

  // aplica nos formulários existentes agora
  document.querySelectorAll('form').forEach(handle);

  // reaplica quando SPA injeta novo form
  document.addEventListener('spa:loaded', () => {
    document.querySelectorAll('form').forEach(handle);
  });
}
