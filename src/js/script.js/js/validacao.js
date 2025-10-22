document.querySelector("form").addEventListener("submit", (e) => {
  const cpf = document.querySelector("#cpf").value;
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
    alert("CPF inválido!");
    e.preventDefault();
  }
});
