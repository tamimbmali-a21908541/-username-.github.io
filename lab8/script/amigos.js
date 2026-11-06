// A. Estado e Variáveis

const urlBase = "https://amigos.pw.deisi.ulusofona.pt/amigos/";

// Elementos do DOM
const listaAmigosDiv = document.querySelector("#lista-amigos");
const mensagemEstado = document.querySelector("#mensagem-estado");
const resultadoGet = document.querySelector("#resultado-get");

const formGet = document.querySelector("#form-get");
const inputGetId = document.querySelector("#get-id");

const formPost = document.querySelector("#form-post");
const inputPostNome = document.querySelector("#post-nome");
const inputPostIdade = document.querySelector("#post-idade");

const formPut = document.querySelector("#form-put");
const inputPutId = document.querySelector("#put-id");
const inputPutNome = document.querySelector("#put-nome");
const inputPutIdade = document.querySelector("#put-idade");

const formPatch = document.querySelector("#form-patch");
const inputPatchId = document.querySelector("#patch-id");
const inputPatchNome = document.querySelector("#patch-nome");
const inputPatchIdade = document.querySelector("#patch-idade");

const formDelete = document.querySelector("#form-delete");
const inputDeleteId = document.querySelector("#delete-id");

// B. Funções utilitárias

function criarArtigoAmigo(amigo) {
  // 1. Criar os elementos
  const artigo = document.createElement("article");
  const titulo = document.createElement("h2");
  const idParagrafo = document.createElement("p");
  const idadeParagrafo = document.createElement("p");
  const botaoApagar = document.createElement("button");

  // 2. Preencher os elementos
  titulo.textContent = amigo.nome || "(Sem nome)";
  idParagrafo.textContent = `ID: ${amigo.id}`;
  idadeParagrafo.textContent = `Idade: ${amigo.idade} anos`;
  botaoApagar.type = "button";
  botaoApagar.textContent = "Apagar (DELETE)";

  // 3. Evento do botão
  botaoApagar.addEventListener("click", function () {
    apagarAmigo(amigo.id);
  });

  // 4. Juntar os elementos
  artigo.append(titulo, idParagrafo, idadeParagrafo, botaoApagar);

  // 5. Devolver o artigo
  return artigo;
}

function renderizarAmigos(amigos) {
  listaAmigosDiv.innerHTML = "";

  amigos.forEach(function (amigo) {
    const artigo = criarArtigoAmigo(amigo);
    listaAmigosDiv.append(artigo);
  });
}

// C. Event handlers (Métodos HTTP com fetch)

function carregarAmigos() {
  fetch(urlBase)
    .then((response) => response.json())
    .then((data) => {
      renderizarAmigos(data);
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemEstado.textContent = "Erro ao carregar a lista de amigos.";
    });
}

function obterAmigoPorId(id) {
  fetch(`${urlBase}${id}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Amigo ${id} não encontrado.`);
      }
      return response.json();
    })
    .then((data) => {
      resultadoGet.textContent = `ID ${data.id}: ${data.nome} (${data.idade} anos)`;
    })
    .catch((error) => {
      console.error("Erro:", error);
      resultadoGet.textContent = error.message;
    });
}

function criarAmigo(nome, idade) {
  fetch(urlBase, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      idade: Number(idade),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      mensagemEstado.textContent = `POST concluído: ${data.nome} (ID ${data.id}) criado.`;
      carregarAmigos();
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemEstado.textContent = "Erro ao criar amigo (POST).";
    });
}

function substituirAmigo(id, nome, idade) {
  fetch(`${urlBase}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      idade: Number(idade),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar amigo (PUT).");
      }
      return response.json();
    })
    .then((data) => {
      mensagemEstado.textContent = `PUT concluído: ID ${data.id} atualizado para ${data.nome} (${data.idade} anos).`;
      carregarAmigos();
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemEstado.textContent = error.message;
    });
}

function atualizarParcialAmigo(id, dados) {
  fetch(`${urlBase}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar amigo (PATCH).");
      }
      return response.json();
    })
    .then((data) => {
      mensagemEstado.textContent = `PATCH concluído: ID ${data.id} atualizado para ${data.nome} (${data.idade} anos).`;
      carregarAmigos();
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemEstado.textContent = error.message;
    });
}

function apagarAmigo(id) {
  fetch(`${urlBase}${id}/`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao apagar amigo (DELETE).");
      }
      mensagemEstado.textContent = `DELETE concluído: Amigo ID ${id} apagado.`;
      carregarAmigos();
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemEstado.textContent = error.message;
    });
}

// D. Event listeners

formGet.addEventListener("submit", function (event) {
  event.preventDefault();
  obterAmigoPorId(inputGetId.value);
});

formPost.addEventListener("submit", function (event) {
  event.preventDefault();
  criarAmigo(inputPostNome.value, inputPostIdade.value);
  formPost.reset();
});

formPut.addEventListener("submit", function (event) {
  event.preventDefault();
  substituirAmigo(inputPutId.value, inputPutNome.value, inputPutIdade.value);
  formPut.reset();
});

formPatch.addEventListener("submit", function (event) {
  event.preventDefault();
  const dados = {};

  if (inputPatchNome.value.trim() !== "") {
    dados.nome = inputPatchNome.value.trim();
  }

  if (inputPatchIdade.value !== "") {
    dados.idade = Number(inputPatchIdade.value);
  }

  atualizarParcialAmigo(inputPatchId.value, dados);
  formPatch.reset();
});

formDelete.addEventListener("submit", function (event) {
  event.preventDefault();
  apagarAmigo(inputDeleteId.value);
  formDelete.reset();
});

// E. Inicialização da aplicação

carregarAmigos();
