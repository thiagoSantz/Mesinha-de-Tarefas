import Tarefa from "./Tarefas.js";
import Projeto from "./Projeto.js";
import { format } from "date-fns";

class Ui {
  /**/
  tarefaParaEditar = null;
  projetoAtivo = null;
  projetos = [];
  filtroAtivo = null;
  filtroInvertido = false;

  /**/
  uiCriarCardTarefa(tarefa) {
    var card = document.createElement("div");
    card.classList.add("card-tarefa"); // adiciona a classe para pegar o CSS
    card.dataset.id = tarefa.id;

    card.innerHTML = `
      <div class="card-header">
        <p class="titulo tl-card">${tarefa.titulo}</p>
        <div class="caixa apagarEstatus">
          <button class="botao btn-editar">Editar</button>
          <button class="botao btn-apagar">Apagar</button>
          <div class="selecao card">
            <button class="botao btn-dropdown">${tarefa.status} ▾</button>
              <ul class="dropdown-menu">
                <li>Inativo</li>
                <li>Andamento</li>
                <li>Concluído</li>
              </ul>
          </div>
        </div>
      </div>
      <p class="data-tarefa" data-date="${tarefa.data}">${format(new Date(tarefa.data), "dd/MM/yyyy")}</p>
      <p class="detalhes">${tarefa.descricao}</p>`;
    /**/
    this.uiCorStatus(card, tarefa.status);
    this.uiCorPrioridade(card, tarefa.prioridade);
    return card;
  }
  /**/
  uiCriarProjeto(projeto) {
    var btnProjeto = document.createElement("button");
    btnProjeto.classList.add("botao", "btn-sidebar");
    btnProjeto.dataset.id = projeto.id;
    if (projeto.id !== this.projetos[0].id) {
      btnProjeto.innerHTML = `
      <div class="nome-projeto">
      ${projeto.nome}</div> 
      <div class="div-projeto">
      <span class="botao editar-projeto"><i class="fa-solid fa-pen"></i></span>
      <span class="botao apagar-projeto"><i class="fa-solid fa-trash"></i></span>
      </div>`;
    } else {
      btnProjeto.textContent = projeto.nome;
    }
    /**/
    return btnProjeto;
  }
  /**/
  uiRenderizarTarefas() {
    //
    if (this.filtroAtivo) {
      var tarefasFiltradas = this.projetoAtivo.projetoFiltrar(this.filtroAtivo);
      if (this.filtroInvertido) {
        tarefasFiltradas.reverse();
      }
      this.uiRenderizarTarefasFiltradas(tarefasFiltradas);
      return;
    }
    //
    var conteinerCards = document.querySelector(".conteiner-cards");
    conteinerCards.innerHTML = "";

    this.projetoAtivo.tarefas.forEach((tarefa) => {
      tarefa.tarefaVerificarAtraso();
      conteinerCards.append(this.uiCriarCardTarefa(tarefa));
    });
  }
  /**/
  uiRenderizarTarefasFiltradas(tarefasFiltradas) {
    var conteinerCards = document.querySelector(".conteiner-cards");
    conteinerCards.innerHTML = "";

    tarefasFiltradas.forEach((tarefa) => {
      tarefa.tarefaVerificarAtraso();
      conteinerCards.append(this.uiCriarCardTarefa(tarefa));
    });
  }
  /**/
  uiRenderizarProjetos() {
    var conteinerProjetos = document.querySelector(".conteiner-projetos");
    //apagar todos os botoes de projeto para renderizar depois os atualizados
    conteinerProjetos.querySelectorAll(".btn-sidebar").forEach((btn) => {
      btn.remove();
    });

    this.projetos.forEach((projeto) => {
      conteinerProjetos.append(this.uiCriarProjeto(projeto));
    });
  }
  /**/
  uiAbrirFormulario() {
    var botaoTarefa = document.querySelector(".btn-tarefa");

    botaoTarefa.addEventListener("click", () => {
      var formTarefa = document.querySelector(".formulario-modal");
      formTarefa.classList.toggle("visivel");
    });
  }
  /**/
  uiPegarFormulario() {
    var formulario = document.querySelector(".formulario-modal");

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();

      var tarefa = new Tarefa(
        document.querySelector("#nomeTarefa").value,
        document.querySelector("#descricaoTarefa").value,
        document.querySelector("#dataTarefa").value,
        document.querySelector("#prioridadeTarefa").value,
      );
      this.projetoAtivo.projetoAdicionarTarefa(tarefa);
      this.uiRenderizarTarefas();
      this.uiSalvar();
      formulario.reset();
      formulario.classList.remove("visivel");
    });
  }
  /**/
  uiPegarFormularioProjeto() {
    var formulario = document.querySelector(".formulario-projeto");

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();

      var projeto = new Projeto(document.querySelector("#NomeProjeto").value);
      this.projetos.push(projeto);
      this.uiRenderizarProjetos();
      this.uiSalvar();
      formulario.reset();
    });
  }
  /**/
  uiBarraDeProjetos() {
    var conteinerProjetos = document.querySelector(".conteiner-projetos");
    conteinerProjetos.addEventListener("click", (event) => {
      //
      //botao apagar
      if (event.target.closest(".apagar-projeto")) {
        var btnProjetoAtual = event.target.closest(".btn-sidebar");
        var id = btnProjetoAtual.dataset.id;
        var projetoClicado = this.projetos.find((p) => p.id === id);
        if (projetoClicado.id !== this.projetos[0].id) {
          var indice = this.projetos.findIndex((p) => p.id === id);
          this.projetos.splice(indice, 1);
          this.projetoAtivo = this.projetos[0];
          document.querySelector(".tl-main").textContent =
            this.projetoAtivo.nome;
          this.uiRenderizarProjetos();
          this.uiRenderizarTarefas();
          this.uiSalvar();
        }
      } else if (event.target.closest(".editar-projeto")) {
        var btnProjeto = event.target.closest(".btn-sidebar");
        var id = btnProjeto.dataset.id;
        var projeto = this.projetos.find((p) => p.id === id);

        if (projeto.id !== this.projetos[0].id) {
          // substitui o conteúdo pelo input
          var input = document.createElement("input");
          input.value = projeto.nome;
          btnProjeto.innerHTML = "";
          btnProjeto.appendChild(input);
          input.focus();

          // clicar fora cancela
          setTimeout(() => {
            document.addEventListener(
              "click",
              (e) => {
                if (!btnProjeto.contains(e.target)) {
                  this.uiRenderizarProjetos();
                }
              },
              { once: true },
            );
          }, 0);

          // botao de enter
          var btnConfirmar = document.createElement("span");
          btnConfirmar.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
          btnConfirmar.classList.add("btn-confirmar-projeto");
          btnProjeto.appendChild(btnConfirmar);

          btnConfirmar.addEventListener("click", () => {
            projeto.projetoEditarTitulo(input.value);
            this.uiRenderizarProjetos();
            this.uiSalvar();
          });

          // escuta o Enter para salvar
          input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              projeto.projetoEditarTitulo(input.value);
              this.uiRenderizarProjetos();
              this.uiSalvar();
            }
          });
        }
      } else if (event.target.closest(".btn-sidebar")) {
        var btnProjetoAtual = event.target.closest(".btn-sidebar");
        document
          .querySelectorAll(".btn-sidebar")
          .forEach((btn) => btn.classList.remove("ativo"));
        btnProjetoAtual.classList.add("ativo");
        var id = btnProjetoAtual.dataset.id;
        this.projetoAtivo = this.projetos.find((p) => p.id === id);
        document.querySelector(".tl-main").textContent = this.projetoAtivo.nome;
        //
        this.filtroAtivo = null;
        this.filtroInvertido = false;
        document.querySelector(".btn-dropdown").textContent = "Filtro ▾";
        //
        if (window.innerWidth <= 768) {
          document.querySelector(".conteudo").style.transform =
            "translateX(-50%)";
          window.scrollTo(0, 0);
        }
        //
        this.uiRenderizarTarefas();
        this.uiSalvar();
        //
      }
    });
  }
  /**/
  uiBotoesTarefa() {
    //Botoes dentro dos conteiner cards
    var conteinerCards = document.querySelector(".conteiner-cards");
    /**/
    conteinerCards.addEventListener("click", (event) => {
      //botao de apagar, pega o botao proximo do evento do conteiner
      if (event.target.closest(".btn-apagar")) {
        var card = event.target.closest(".card-tarefa");
        //indice e tarefa para depois apagar dentro do array no projeto
        var indice = this.projetoAtivo.tarefas.findIndex(
          (t) => t.id === card.dataset.id,
        );
        var tarefa = this.projetoAtivo.tarefas[indice];
        //remove do DOm e no projeto
        card.classList.add("removendo");
        this.projetoAtivo.projetoApagarTarefa(tarefa);
        //guarda a referencia do ui
        var ui = this;
        card.addEventListener("transitionend", () => {
          //Depois de apagar refaz a pagina
          ui.uiRenderizarTarefas();
          this.uiSalvar();
        });
      }
      //botao de editar
      if (event.target.closest(".btn-editar")) {
        var card = event.target.closest(".card-tarefa");
        //indice e tarefa para depois apagar dentro do array no projeto
        var indice = this.projetoAtivo.tarefas.findIndex(
          (t) => t.id === card.dataset.id,
        );
        this.tarefaParaEditar = this.projetoAtivo.tarefas[indice];
        // preenche os campos do modal
        document.querySelector("#nomeTarefaEdicao").value =
          this.tarefaParaEditar.titulo;
        document.querySelector("#dataTarefaEdicao").value =
          this.tarefaParaEditar.data;
        document.querySelector("#descricaoTarefaEdicao").value =
          this.tarefaParaEditar.descricao;

        // abre o modal
        document.querySelector(".modal-overlay").classList.add("visivel");
      }
    });
  }
  /**/
  uiEditardoFormulario() {
    //Preenchendo o card depois de editado
    var formularioEdicao = document.querySelector(".modal");

    formularioEdicao.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this.tarefaParaEditar) {
        this.tarefaParaEditar.titulo =
          document.querySelector("#nomeTarefaEdicao").value;
        this.tarefaParaEditar.data =
          document.querySelector("#dataTarefaEdicao").value;
        this.tarefaParaEditar.descricao = document.querySelector(
          "#descricaoTarefaEdicao",
        ).value;
        this.tarefaParaEditar.prioridade = document.querySelector(
          "#prioridadeTarefaEdicao",
        ).value;

        this.uiRenderizarTarefas();
        this.uiSalvar();
        this.tarefaParaEditar = null;
        document.querySelector(".modal-overlay").classList.remove("visivel");
      }
    });
  }
  /**/
  uiBtnCancelarForm() {
    document.querySelectorAll(".btn-cancelar").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.tarefaParaEditar = null;
        // fecha o container mais próximo que seja modal ou formulário
        var container =
          btn.closest(".modal-overlay") || btn.closest(".formulario-modal");
        container.classList.remove("visivel");
      });
    });
  }
  /**/
  uiCorStatus(card, status) {
    var botao = card.querySelector(".btn-dropdown");
    botao.classList.remove("inativo", "atrasado", "concluído");
    botao.classList.add(status.toLowerCase());
  }
  /**/
  uiCorPrioridade(card, prioridade) {
    card.classList.remove("alta", "normal", "baixa");
    card.classList.add(prioridade.toLowerCase());
  }
  /**/
  uiDropdown() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".btn-dropdown")) {
        // fecha todos dropdown ao primeiro click
        document.querySelectorAll(".dropdown-menu").forEach((m) => {
          m.classList.remove("visivel");
        });

        //agora abre o mais proximo do click
        var botao = event.target.closest(".btn-dropdown");
        var menu = botao.nextElementSibling;
        menu.classList.toggle("visivel");

        //
        var opcoes = menu.querySelectorAll("li");
        var ui = this;
        //
        opcoes.forEach((opcao) => {
          //
          //opçoes para ajustar o botão se nao tiver criterios
          //
          var novaOpcao = opcao.cloneNode(true);
          opcao.parentNode.replaceChild(novaOpcao, opcao);
          //
          novaOpcao.addEventListener(
            "click",
            () => {
              if (novaOpcao.textContent == "Nenhum") {
                //
                this.filtroAtivo = null;
                this.filtroInvertido = false;
                //
                botao.textContent = "Filtro ▾";
                menu.classList.remove("visivel");
                this.uiRenderizarTarefas();
              } else if (novaOpcao.textContent == "Sem status") {
                botao.textContent = "Status ▾";
                menu.classList.remove("visivel");
                //
                //colocando status e mudando o visual
              } else {
                menu.classList.remove("visivel");
                //
                //dropdown de card tarefa
                //
                var card = event.target.closest(".card-tarefa");
                if (card) {
                  var id = card.dataset.id;
                  var tarefaRespectiva = ui.projetoAtivo.tarefas.find(
                    (t) => t.id === id,
                  );
                  tarefaRespectiva.tarefaMudarStatus(novaOpcao.textContent);
                  this.uiRenderizarTarefas();
                  //
                  //dropdown de filtro
                  //
                } else {
                  //aplicando tambem filtro de inversao
                  if (this.filtroAtivo === novaOpcao.textContent.trim()) {
                    this.filtroInvertido = !this.filtroInvertido;
                  } else {
                    this.filtroAtivo = novaOpcao.textContent.trim();
                    this.filtroInvertido = false;
                  }

                  botao.textContent =
                    novaOpcao.textContent +
                    (this.filtroInvertido ? " ▲" : " ▼");

                  var tarefasFiltradas = this.projetoAtivo.projetoFiltrar(
                    this.filtroAtivo,
                  );

                  if (this.filtroInvertido) {
                    tarefasFiltradas.reverse();
                  }

                  this.uiRenderizarTarefasFiltradas(tarefasFiltradas);
                }
              }
            },
            { once: true },
          );
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
  }
  /**/
  uiSalvar() {
    var projetosSalvo = JSON.stringify(this.projetos);
    localStorage.setItem("projetos", projetosSalvo);
  }
  /**/
  uiCarregar() {
    var dadosSalvos = localStorage.getItem("projetos");
    if (dadosSalvos) {
      var projetosJson = JSON.parse(dadosSalvos);
      //cria um objeto novo para cada posição do array salva
      this.projetos = projetosJson.map((p) => {
        var projeto = new Projeto(p.nome);
        projeto.id = p.id;
        //cria um objeto novo para cada posição do array salva
        projeto.tarefas = p.tarefas.map((t) => {
          var tarefa = new Tarefa(t.titulo, t.descricao, t.data, t.prioridade);
          tarefa.id = t.id;
          tarefa.status = t.status;
          return tarefa;
        });
        return projeto;
      });
    }
  }
  /**/
  uiSwipeMobile() {
    var conteudo = document.querySelector(".conteudo");
    var sidebar = document.querySelector(".sidebar");
    var main = document.querySelector(".main");
    var inicioX = 0;

    sidebar.addEventListener("touchstart", (e) => {
      inicioX = e.touches[0].clientX;
    });

    sidebar.addEventListener("touchend", (e) => {
      var fimX = e.changedTouches[0].clientX;
      var diferenca = inicioX - fimX;
      if (diferenca > 50) {
        conteudo.style.transform = "translateX(-50%)";
      }
    });

    main.addEventListener("touchstart", (e) => {
      inicioX = e.touches[0].clientX;
    });

    main.addEventListener("touchend", (e) => {
      var fimX = e.changedTouches[0].clientX;
      var diferenca = inicioX - fimX;
      if (diferenca < -50) {
        conteudo.style.transform = "translateX(0)";
        window.scrollTo(0, 0);
      }
    });
  }
  /**/
}
/**/
export default Ui;
