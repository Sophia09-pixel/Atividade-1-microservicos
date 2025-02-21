// Botão para mudar a cor do conteúdo
document
  .getElementById("changeColorButton")
  .addEventListener("click", function () {
    const content = document.querySelector("#content");
    content.style.backgroundColor = "lightblue";
    content.style.color = "darkred";
  });

// Adicionar itens à lista
document.getElementById("addItemButton").addEventListener("click", function () {
  const input = document.getElementById("newItemInput");
  const itemText = input.value.trim();

  if (itemText) {
      const li = document.createElement("li");
      li.textContent = itemText;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.addEventListener("click", function () {
          li.remove();
      });

      li.appendChild(deleteButton);

      li.addEventListener("dblclick", function () {
          this.remove();
      });

      document.getElementById("itemList").appendChild(li);

      input.value = "";
  }
});

// Fetch para a API de exemplo
fetch("http://demo2937659.mockable.io/exercicios")
  .then((response) => response.json())
  .then((data) => {
    const content = document.querySelector("#chamadaApi");
    content.innerHTML = `<p>Exercicio 4</p>
    <p>${data[0].mensagem}</p>`;
  })
  .catch((error) => console.error("Erro ao buscar dados:", error));

// Envio do formulário
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("userForm");
  const inputs = form.querySelectorAll("input");

  function validateInput(input) {
    const errorSpan = input.nextElementSibling;

    if (input.value.trim() === "") {
      input.classList.add("invalid");
      errorSpan.textContent = "Este campo é obrigatório.";
      errorSpan.style.display = "block";
      return false;
    } else {
      input.classList.remove("invalid");
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
      return true;
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(input);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      const data = {
        name: document.getElementById("name").value.trim(),
        idade: document.getElementById("idade").value.trim(),
        email: document.getElementById("email").value.trim(),
        mensagem: document.getElementById("mensagem").value.trim(),
      };

      fetch("http://demo2937659.mockable.io/exerciciosPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta do servidor:", data);
          alert("Dados enviados com sucesso!");
          form.reset();
        })
        .catch((error) => {
          console.error("Erro ao enviar dados:", error);
          alert("Erro ao enviar dados. Tente novamente.");
        });
    }
  });
});

// Filtro de dados da tabela
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://demo2937659.mockable.io/exercicios";
  const tableBody = document.querySelector("#data-table tbody");
  const filterButton = document.getElementById("filterButton");
  const resetButton = document.getElementById("resetButton");

  let originalData = [];
  let filteredData = [];

  function loadData() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        originalData = data;
        renderTable(data);
      })
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }

  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${item.nome}</td>
              <td>${item.idade}</td>
              <td>${item.email}</td>
              <td>${item.mensagem}</td>
          `;
      tableBody.appendChild(row);
    });
  }

  function filterData() {
    filteredData = originalData.filter((item) => item.idade > 18);
    renderTable(filteredData);
    filterButton.style.display = "none";
    resetButton.style.display = "block";
  }

  function resetFilter() {
    renderTable(originalData);
    filterButton.style.display = "block";
    resetButton.style.display = "none";
  }

  filterButton.addEventListener("click", filterData);
  resetButton.addEventListener("click", resetFilter);
  loadData();
});

//CRUD
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://demo2937659.mockable.io/exercicios";
  const crudList = document.getElementById("crudList");
  const crudForm = document.getElementById("crudForm");
  const itemNameInput = document.getElementById("itemName");

  let items = [];

  function loadData() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        items = data;
        renderList();
      })
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }

  function renderList() {
    crudList.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <span>${item.nome}</span>
              <button onclick="editItem(${index})">Editar</button>
              <button onclick="deleteItem(${index})">Excluir</button>
          `;
      crudList.appendChild(li);
    });
  }

  crudForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newItem = {
      nome: itemNameInput.value.trim(),
      id: Date.now(),
    };

    if (newItem.nome) {
      items.push(newItem);
      renderList();
      itemNameInput.value = "";

      const urlPost = "http://demo2937659.mockable.io/exercicios";
      fetch(urlPost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data) => console.log("Item adicionado:", data))
        .catch((error) => console.error("Erro ao adicionar item:", error));
    }
  });

  window.editItem = function (index) {
    const newName = prompt("Digite o novo nome:");
    if (newName) {
      items[index].nome = newName;
      renderList();

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items[index]),
      })
        .then((response) => response.json())
        .then((data) => console.log("Item atualizado:", data))
        .catch((error) => console.error("Erro ao atualizar item:", error));
    }
  };

  window.deleteItem = function (index) {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      const deletedItem = items.splice(index, 1);
      renderList();

      fetch(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deletedItem[0]),
      })
        .then((response) => response.json())
        .then((data) => console.log("Item excluído:", data))
        .catch((error) => console.error("Erro ao excluir item:", error));
    }
  };
  loadData();
});
