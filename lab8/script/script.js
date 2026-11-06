// A. Estado e Variáveis

// Estado da aplicação
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", "[]");
}

let listaProdutos = [];

// Elementos do DOM
const produtosDiv = document.querySelector("#produtos div");
const filtroCategoria = document.querySelector("#filtro-categoria");
const ordenarPreco = document.querySelector("#ordenar-preco");
const procurarProduto = document.querySelector("#procurar-produto");
const produtosSelecionadosDiv = document.querySelector(
  "#produtos-selecionados",
);
const precoTotal = document.querySelector("#preco-total");
const estudanteDeisi = document.querySelector("#estudante-deisi");
const cupaoDesconto = document.querySelector("#cupao-desconto");
const botaoComprar = document.querySelector("#botao-comprar");
const valorFinal = document.querySelector("#valor-final");
const referenciaPagamento = document.querySelector("#referencia-pagamento");
const mensagemCompra = document.querySelector("#mensagem-compra");

// B. Funções utilitárias

function criarProduto(produto) {
  // 1. Criar os elementos
  const artigo = document.createElement("article");
  const imagem = document.createElement("img");
  const titulo = document.createElement("h2");
  const descricao = document.createElement("p");
  const categoria = document.createElement("p");
  const preco = document.createElement("p");
  const rating = document.createElement("p");
  const botaoAdicionar = document.createElement("button");

  // 2. Preencher os elementos
  imagem.src = produto.image.startsWith("http")
    ? produto.image
    : `https://deisishop.pw.deisi.ulusofona.pt${produto.image}`;
  imagem.alt = produto.title;
  titulo.textContent = produto.title;
  descricao.textContent = produto.description;
  categoria.textContent = produto.category;
  preco.textContent = `Preço: ${produto.price} €`;
  rating.textContent = `Rating: ${produto.rating.rate} (${produto.rating.count})`;

  botaoAdicionar.type = "button";
  botaoAdicionar.textContent = "+ Adicionar ao cesto";

  // 3. Evento do botão
  botaoAdicionar.addEventListener("click", function () {
    adicionarAoCesto(produto);
  });

  // 4. Juntar os elementos
  artigo.append(
    imagem,
    titulo,
    descricao,
    categoria,
    preco,
    rating,
    botaoAdicionar,
  );

  // 5. Devolver o artigo
  return artigo;
}

function criarProdutoCesto(produto) {
  // 1. Criar os elementos
  const artigo = document.createElement("article");
  const imagem = document.createElement("img");
  const titulo = document.createElement("h2");
  const preco = document.createElement("p");
  const botaoRemover = document.createElement("button");

  // 2. Preencher os elementos
  imagem.src = produto.image.startsWith("http")
    ? produto.image
    : `https://deisishop.pw.deisi.ulusofona.pt${produto.image}`;
  imagem.alt = produto.title;
  titulo.textContent = produto.title;
  preco.textContent = `Custo total: ${produto.price} €`;
  botaoRemover.type = "button";
  botaoRemover.textContent = "- Remover do Cesto";

  // 3. Evento do botão
  botaoRemover.addEventListener("click", function () {
    removerDoCesto(produto);
  });

  // 4. Juntar os elementos
  artigo.append(imagem, titulo, preco, botaoRemover);

  // 5. Devolver o artigo
  return artigo;
}

function renderizarProdutos(produtos) {
  // 1. Limpar a lista antes de renderizar
  produtosDiv.innerHTML = "";

  // 2. Percorrer todos os produtos
  produtos.forEach(function (produto) {
    // 3. Criar o artigo
    const artigo = criarProduto(produto);

    // 4. Adicionar à página
    produtosDiv.append(artigo);
  });
}

function preencherCategorias(categorias) {
  categorias.forEach(function (categoria) {
    const opcao = document.createElement("option");
    const nomeCategoria = categoria.name || categoria;

    opcao.value = nomeCategoria;
    opcao.textContent = nomeCategoria;
    filtroCategoria.append(opcao);
  });
}

function atualizaCesto() {
  // 1. Obter os produtos selecionados
  const produtosSelecionados = JSON.parse(
    localStorage.getItem("produtos-selecionados"),
  );

  // 2. Limpar o cesto apresentado
  produtosSelecionadosDiv.innerHTML = "";

  // 3. Mostrar os produtos selecionados
  produtosSelecionados.forEach(function (produto) {
    const artigo = criarProdutoCesto(produto);

    produtosSelecionadosDiv.append(artigo);
  });

  // 4. Calcular o preço total
  const total = produtosSelecionados.reduce(function (soma, produto) {
    return soma + Number(produto.price);
  }, 0);

  // 5. Mostrar o preço total
  precoTotal.textContent = `Custo total: ${total.toFixed(2)} €`;
}

// C. Event handlers

function atualizarListaProdutos() {
  const categoriaSelecionada = filtroCategoria ? filtroCategoria.value : "";
  const ordemSelecionada = ordenarPreco ? ordenarPreco.value : "";
  const textoPesquisa = procurarProduto
    ? procurarProduto.value.trim().toLowerCase()
    : "";

  // 1. Filtrar por categoria e por texto de pesquisa
  const produtosFiltrados = listaProdutos.filter(function (produto) {
    const correspondeCategoria =
      categoriaSelecionada === "" || produto.category === categoriaSelecionada;
    const correspondePesquisa =
      textoPesquisa === "" ||
      produto.title.toLowerCase().includes(textoPesquisa);

    return correspondeCategoria && correspondePesquisa;
  });

  // 2. Ordenar por preço
  if (ordemSelecionada === "crescente") {
    produtosFiltrados.sort(function (a, b) {
      return Number(a.price) - Number(b.price);
    });
  } else if (ordemSelecionada === "decrescente") {
    produtosFiltrados.sort(function (a, b) {
      return Number(b.price) - Number(a.price);
    });
  }

  // 3. Renderizar
  renderizarProdutos(produtosFiltrados);
}

function adicionarAoCesto(produto) {
  // 1. Obter os produtos selecionados
  const produtosSelecionados = JSON.parse(
    localStorage.getItem("produtos-selecionados"),
  );

  // 2. Adicionar o produto
  produtosSelecionados.push(produto);

  // 3. Guardar no localStorage
  localStorage.setItem(
    "produtos-selecionados",
    JSON.stringify(produtosSelecionados),
  );

  // 4. Atualizar o cesto
  atualizaCesto();
}

function removerDoCesto(produto) {
  // 1. Obter os produtos selecionados
  const produtosSelecionados = JSON.parse(
    localStorage.getItem("produtos-selecionados"),
  );

  // 2. Encontrar o índice do produto
  const indice = produtosSelecionados.findIndex(function (produtoSelecionado) {
    return produtoSelecionado.id === produto.id;
  });

  // 3. Remover o produto, se existir
  if (indice !== -1) {
    produtosSelecionados.splice(indice, 1);
  }

  // 4. Guardar no localStorage
  localStorage.setItem(
    "produtos-selecionados",
    JSON.stringify(produtosSelecionados),
  );

  // 5. Atualizar o cesto
  atualizaCesto();
}

function comprar() {
  // 1. Obter os IDs dos produtos no cesto
  const produtosSelecionados = JSON.parse(
    localStorage.getItem("produtos-selecionados"),
  );
  const idsProdutos = produtosSelecionados.map(function (produto) {
    return produto.id;
  });

  // 2. Preparar o corpo do pedido POST
  const dados = {
    products: idsProdutos,
    student: estudanteDeisi.checked,
    coupon: cupaoDesconto.value.trim(),
  };

  // 3. Enviar pedido POST para o endpoint /buy
  fetch("https://deisishop.pw.deisi.ulusofona.pt/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        valorFinal.textContent = "";
        referenciaPagamento.textContent = "";
        mensagemCompra.textContent = data.error;
        return;
      }

      valorFinal.textContent = `Valor final a pagar (com eventuais descontos): ${data.totalCost} €`;
      referenciaPagamento.textContent = `Referência de pagamento: ${data.reference}`;
      mensagemCompra.textContent = data.message || "";
    })
    .catch((error) => {
      console.error("Erro:", error);
      mensagemCompra.textContent = "Ocorreu um erro ao processar a compra.";
    });
}

// D. Event listeners

if (filtroCategoria) {
  filtroCategoria.addEventListener("change", atualizarListaProdutos);
}

if (ordenarPreco) {
  ordenarPreco.addEventListener("change", atualizarListaProdutos);
}

if (procurarProduto) {
  procurarProduto.addEventListener("input", atualizarListaProdutos);
}

if (botaoComprar) {
  botaoComprar.addEventListener("click", comprar);
}

// E. Inicialização da aplicação

// 1. Obter e mostrar os produtos e categorias via AJAX (fetch)
if (produtosDiv) {
  fetch("https://deisishop.pw.deisi.ulusofona.pt/products")
    .then((response) => response.json())
    .then((produtos) => {
      listaProdutos = produtos;
      renderizarProdutos(listaProdutos);
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

if (filtroCategoria) {
  fetch("https://deisishop.pw.deisi.ulusofona.pt/categories")
    .then((response) => response.json())
    .then((categorias) => {
      preencherCategorias(categorias);
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

// 2. Atualizar o cesto ao abrir a página
atualizaCesto();
