/**/

var cardEmEdicao = null; // para uso em botao de editar/formulario

/**/

// abre/fecha dropdown clicado - funciona para cards dinâmicos também
document.addEventListener("click", (event) => {
  if (event.target.closest(".btn-dropdown")) {

    // fecha todos primeiro
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      m.classList.remove("visivel");
    });

    //agora abre
    var botao = event.target.closest(".btn-dropdown");
    var menu = botao.nextElementSibling;
    menu.classList.toggle("visivel");

    var opcoes = menu.querySelectorAll("li");
    opcoes.forEach((opcao) => {
      opcao.addEventListener("click", () => {
        if (opcao.textContent == "Nenhum") {
          botao.textContent = "Filtro ▾";
          menu.classList.remove("visivel");
        } else if (opcao.textContent == "Sem status") {
          botao.textContent = "Status ▾";
          menu.classList.remove("visivel");
        } else {
          botao.textContent = opcao.textContent + " ▾";
          menu.classList.remove("visivel");
        }
      });
    });
  }
  //Fecha todos os dropdown
  if (!event.target.closest(".selecao")) {
    var todosOsMenus = document.querySelectorAll(".dropdown-menu");
    todosOsMenus.forEach((menu) => {
      menu.classList.remove("visivel");
    });
  }
});

// #region

//cancelar
document.querySelectorAll(".btn-cancelar").forEach((btn) => {
  btn.addEventListener("click", () => {
    cardEmEdicao = null;
    // fecha o container mais próximo que seja modal ou formulário
    var container =
      btn.closest(".modal-overlay") || btn.closest(".formulario-modal");
    container.classList.remove("visivel");
  });
});

// #endregion

// #region 
//Botao para fechar formulario
var botaoTarefa = document.querySelector(".btn-tarefa");

botaoTarefa.addEventListener("click", () => {
  var formTarefa = document.querySelector(".formulario-modal");
  formTarefa.classList.toggle("visivel");
});

//Botao do formulário para adicionar tarefa
var formulario = document.querySelector(".formulario-modal");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  var titulo = document.querySelector("#nomeTarefa").value;
  var descricao = document.querySelector("#descricaoTarefa").value;
  var data = document.querySelector("#dataTarefa").value;
  var propriedade = document.querySelector("#prioridadeTarefa").value;

  var novoCard = document.createElement("div");
  novoCard.classList.add("card-tarefa"); // adiciona a classe para pegar o CSS

  novoCard.innerHTML = `
  <div class="card-header">
    <p class="titulo tl-card">${titulo}</p>
    <div class="caixa apagarEstatus">
      <button class="botao btn-editar">Editar</button>
      <button class="botao btn-apagar">Apagar</button>
      <div class="selecao card">
        <button class="botao btn-dropdown">Status ▾</button>
          <ul class="dropdown-menu">
            <li>Sem status</li>
            <li>Andamento</li>
            <li>Concluído</li>
          </ul>
      </div>
    </div>
  </div>
  <p class="data-tarefa" data-date="${data}">${data}</p>
  <p class="detalhes">${descricao}</p>
`;

  var conteinerCards = document.querySelector(".conteiner-cards");
  conteinerCards.append(novoCard);
  formulario.reset();
  formulario.classList.remove("visivel");
});
// #endregion

// #region
//Botoes dentro dos conteiner cards
var conteinerCards = document.querySelector(".conteiner-cards");

conteinerCards.addEventListener("click", (event) => {
  //botao de apagar
  if (event.target.closest(".btn-apagar")) {
    var card = event.target.closest(".card-tarefa");
    card.classList.add("removendo");
    card.addEventListener("transitionend", () => {
      card.remove();
    });
  }
  //botao de editar
  if (event.target.closest(".btn-editar")) {
    var card = event.target.closest(".card-tarefa");
    cardEmEdicao = card; // guarda o card

    // preenche os campos do modal
    document.querySelector("#nomeTarefaEdicao").value =
      card.querySelector(".tl-card").textContent;
    document.querySelector("#dataTarefaEdicao").value =
      card.querySelector(".data-tarefa").dataset.date;
    document.querySelector("#descricaoTarefaEdicao").value =
      card.querySelector(".detalhes").textContent;

    // abre o modal
    document.querySelector(".modal-overlay").classList.add("visivel");
  }
});

//Preenchendo o card depois de editado
var formularioEdicao = document.querySelector(".modal");

formularioEdicao.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cardEmEdicao) {
    cardEmEdicao.querySelector(".tl-card").textContent =
      document.querySelector("#nomeTarefaEdicao").value;
    cardEmEdicao.querySelector(".data-tarefa").textContent =
      document.querySelector("#dataTarefaEdicao").value;
    cardEmEdicao.querySelector(".detalhes").textContent =
      document.querySelector("#descricaoTarefaEdicao").value;

    cardEmEdicao = null;
    document.querySelector(".modal-overlay").classList.remove("visivel");
  }
});
//#endregion