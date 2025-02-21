document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://demo2937659.mockable.io/exercicios";
  const postUrl = "http://demo2937659.mockable.io/exerciciosPost";
  const tableBody = document.querySelector("#data-table tbody");
  const userForm = document.getElementById("userForm");

  let localData = [];

  function loadData() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const allData = [...data, ...localData];
        renderTable(allData); 
      })
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }

  function renderTable(data) {
    tableBody.innerHTML = ""; 

    data.forEach((item) => {
      const row = document.createElement("tr");

      const nomeCell = document.createElement("td");
      nomeCell.textContent = item.nome;
      row.appendChild(nomeCell);

      const idadeCell = document.createElement("td");
      idadeCell.textContent = item.idade;
      row.appendChild(idadeCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = item.email;
      row.appendChild(emailCell);

      const mensagemCell = document.createElement("td");
      mensagemCell.textContent = item.mensagem;
      row.appendChild(mensagemCell);

      tableBody.appendChild(row);
    });
  }

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const idade = document.getElementById("idade").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    const newData = { nome: name, idade, email, mensagem };

    fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Dados cadastrados com sucesso!");
        userForm.reset(); 
        localData.push(newData);

        loadData();
      })
      .catch((error) => {
        console.error("Erro ao cadastrar dados:", error);
        alert("Erro ao cadastrar dados. Tente novamente.");
      });
  });

  const inputs = document.querySelectorAll("#userForm input");
  inputs.forEach((input) => {
    const errorMessage = input.nextElementSibling;

    input.addEventListener("blur", function () {
      if (input.value.trim() === "") {
        errorMessage.style.display = "block";
      } else {
        errorMessage.style.display = "none";
      }
    });
  });

  loadData();
});
