//Declaração das variáveis
const formProduto = document.getElementById("formProduto");

const campoId = document.getElementById("produtoId");
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");
const campoQuantidade = document.getElementById("quantidade");
const campoQuantidadeMinima = document.getElementById("quantidadeMinima");
const campoPreco = document.getElementById("preco");

const tituloFormulario = document.getElementById("tituloFormulario");
const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelarEdicao = document.getElementById("cancelarEdicao");

const campoPesquisa = document.getElementById("pesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroSituacao = document.getElementById("filtroSituacao");
const campoOrdenacao = document.getElementById("ordenacao");

const mensagem = document.getElementById("mensagem");
const listaProdutos = document.getElementById("listaProdutos");
const listaPrioritarios = document.getElementById("produtosPrioritarios");

let produtos = [];

let temporizadorMensagem = null;

//Funções Utilitárias
//Função para obter a situação do produto
function obterSituacao(produto){

    if (produto.quantidade === 0){
        return  "Sem estoque";
    } else if (produto.quantidade > 0 && produto.quantidade <= produto.quantidadeMinima){
        return  "Estoque crítico";
    } else {
        return  "Estoque normal";
    }
}

//Relaciona cada situação ao valor usado no filtro e na classe CSS
const codigosSituacao = {
    "Sem estoque": "sem",
    "Estoque crítico": "critico",
    "Estoque normal": "normal"
};

//Função para formatar valores de moedas
const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

//Função para gerar um identificador único para cada produto
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

//Função para exibir mensagens de sucesso ou erro
function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso";

    //Apaga a mensagem depois de alguns segundos
    clearTimeout(temporizadorMensagem);
    temporizadorMensagem = setTimeout(function() {
        mensagem.textContent = "";
        mensagem.className = "";
    }, 4000);
}

//Função para salvar os produtos no navegador
function salvarProdutos() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Função para carregar os produtos salvos
function carregarProdutos() {
    const dadosSalvos = localStorage.getItem("produtos");

    produtos = JSON.parse(dadosSalvos) || [];

    //Garante que produtos salvos antes da criação do id também tenham um
    let houveAlteracao = false;
    produtos.forEach(function(produto) {
        if (!produto.id) {
            produto.id = gerarId();
            houveAlteracao = true;
        }
    });

    if (houveAlteracao) {
        salvarProdutos();
    }

    atualizarTela();
}

//Função que atualiza todas as partes da tela
function atualizarTela() {
    renderizarProdutos();
    atualizarIndicadores();
    renderizarPrioritarios();
}

//Função para voltar o formulário ao modo de cadastro
function encerrarEdicao() {
    formProduto.reset();
    campoId.value = "";

    tituloFormulario.textContent = "Cadastrar produto";
    botaoSalvar.textContent = "Cadastrar produto";
    botaoCancelarEdicao.hidden = true;
}

//Função de cadastro de Produtos
formProduto.addEventListener("submit", function(evento){
    //Impede o evento padrão do navegador
    evento.preventDefault();

    //Atribuição dos valores dos elementos HTML às variáveis
    const id = campoId.value;
    const nome = campoNome.value.trim();
    const categoria = campoCategoria.value;
    const quantidade = Number(campoQuantidade.value);
    const quantidadeMinima = Number(campoQuantidadeMinima.value);
    const preco = Number(campoPreco.value);

    //Validação de dados recebidos
    if (nome === ""){
        exibirMensagem("O nome do produto é obrigatório", "erro");
        return;
    }

    const produtoExistente = produtos.find(function(produto) {
        return produto.nome.toLowerCase() === nome.toLowerCase()
            && produto.id !== id;
    });

    if (produtoExistente) {
        exibirMensagem("O nome do produto já está cadastrado", "erro");
        return;
    }

    if (categoria.trim() === ""){
        exibirMensagem("A categoria do produto é obrigatória", "erro");
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 0){
        exibirMensagem("A quantidade deve ser um número inteiro maior ou igual a zero", "erro");
        return;
    }

    if (!Number.isInteger(quantidadeMinima) || quantidadeMinima < 0){
        exibirMensagem("A quantidade mínima deve ser um número inteiro maior ou igual a zero", "erro");
        return;
    }

    if (preco <= 0){
        exibirMensagem("O preço deve ser maior que zero", "erro");
        return;
    }

    if (id === "") {
        //Criação do objeto produto e adição à lista
        produtos.push({
            id: gerarId(),
            nome,
            categoria,
            quantidade,
            quantidadeMinima,
            preco
        });

        exibirMensagem("Produto cadastrado com sucesso", "sucesso");
    } else {
        //Atualização do produto que está em edição
        const produtoEmEdicao = produtos.find(function(produto) {
            return produto.id === id;
        });

        if (!produtoEmEdicao) {
            exibirMensagem("O produto em edição não foi encontrado", "erro");
            encerrarEdicao();
            return;
        }

        produtoEmEdicao.nome = nome;
        produtoEmEdicao.categoria = categoria;
        produtoEmEdicao.quantidade = quantidade;
        produtoEmEdicao.quantidadeMinima = quantidadeMinima;
        produtoEmEdicao.preco = preco;

        exibirMensagem("Produto atualizado com sucesso", "sucesso");
    }

    salvarProdutos();
    encerrarEdicao();

    //Chamada das funções de renderização da tabela e atualização de indicadores
    atualizarTela();
});

//Botão para cancelar a edição
botaoCancelarEdicao.addEventListener("click", function() {
    encerrarEdicao();
    exibirMensagem("Edição cancelada", "sucesso");
});

//Pesquisa, filtros e ordenação atualizam a tabela automaticamente
campoPesquisa.addEventListener("input", renderizarProdutos);
filtroCategoria.addEventListener("change", renderizarProdutos);
filtroSituacao.addEventListener("change", renderizarProdutos);
campoOrdenacao.addEventListener("change", renderizarProdutos);

//Função que aplica pesquisa, filtros e ordenação
function obterProdutosFiltrados() {
    const termoPesquisa = campoPesquisa.value.trim().toLowerCase();
    const categoriaSelecionada = filtroCategoria.value;
    const situacaoSelecionada = filtroSituacao.value;
    const criterioOrdenacao = campoOrdenacao.value;

    const produtosFiltrados = produtos.filter(function(produto) {
        const atendePesquisa = produto.nome.toLowerCase().includes(termoPesquisa);

        const atendeCategoria = categoriaSelecionada === ""
            || produto.categoria === categoriaSelecionada;

        const atendeSituacao = situacaoSelecionada === ""
            || codigosSituacao[obterSituacao(produto)] === situacaoSelecionada;

        return atendePesquisa && atendeCategoria && atendeSituacao;
    });

    //filter() já retorna um novo array, então a lista original não é alterada
    produtosFiltrados.sort(function(a, b) {
        if (criterioOrdenacao === "quantidade") {
            return a.quantidade - b.quantidade;
        }

        if (criterioOrdenacao === "preco") {
            return a.preco - b.preco;
        }

        return a.nome.localeCompare(b.nome, "pt-BR");
    });

    return produtosFiltrados;
}

//Função para excluir um produto pelo id
function excluirProduto(id) {
    const confirmou = confirm("Tem certeza de que deseja excluir este produto?");

    if (!confirmou) {
        return;
    }

    produtos = produtos.filter(function(item) {
        return item.id !== id;
    });

    //Se o produto excluído estava em edição, limpa o formulário
    if (campoId.value === id) {
        encerrarEdicao();
    }

    salvarProdutos();
    atualizarTela();

    exibirMensagem("Produto excluído com sucesso", "sucesso");
}

//Função para preencher o formulário com os dados do produto
function editarProduto(produto) {
    campoId.value = produto.id;
    campoNome.value = produto.nome;
    campoCategoria.value = produto.categoria;
    campoQuantidade.value = produto.quantidade;
    campoQuantidadeMinima.value = produto.quantidadeMinima;
    campoPreco.value = produto.preco;

    tituloFormulario.textContent = "Editar produto";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;

    campoNome.focus();
}

//Função que cria a linha da tabela de um produto
function criarLinhaProduto(produto) {
    //Criação das linhas da tabela
    const linha = document.createElement("tr");

    //Criação das células da tabela
    const celulaNome = document.createElement("td");
    const celulaCategoria = document.createElement("td");
    const celulaQuantidade = document.createElement("td");
    const celulaPreco = document.createElement("td");
    const celulaValorTotal = document.createElement("td");
    const celulaSituacao = document.createElement("td");
    const celulaAcoes = document.createElement("td");
    const etiquetaSituacao = document.createElement("span");
    const botaoExcluir = document.createElement("button");
    const botaoEditar = document.createElement("button");

    //Configuração do botão de edição
    botaoEditar.textContent = "Editar";
    botaoEditar.className = "botao-editar";
    botaoEditar.addEventListener("click", function() {
        editarProduto(produto);
    });

    //Configuração do botão de exclusão
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.className = "botao-excluir";
    botaoExcluir.addEventListener("click", function() {
        excluirProduto(produto.id);
    });

    celulaAcoes.appendChild(botaoEditar);
    celulaAcoes.appendChild(botaoExcluir);

    //Etiqueta colorida com a situação do estoque
    const situacao = obterSituacao(produto);
    etiquetaSituacao.textContent = situacao;
    etiquetaSituacao.className = "status status-" + codigosSituacao[situacao];
    celulaSituacao.appendChild(etiquetaSituacao);

    //Preenche as células com os valores dos atributos dos produtos
    celulaNome.textContent = produto.nome;
    celulaCategoria.textContent = produto.categoria;
    celulaQuantidade.textContent = produto.quantidade;
    celulaPreco.textContent = formatadorMoeda.format(produto.preco);
    celulaValorTotal.textContent = formatadorMoeda.format(
        produto.preco * produto.quantidade
    );

    //Adiciona as células a linha criada
    linha.appendChild(celulaNome);
    linha.appendChild(celulaCategoria);
    linha.appendChild(celulaQuantidade);
    linha.appendChild(celulaPreco);
    linha.appendChild(celulaValorTotal);
    linha.appendChild(celulaSituacao);
    linha.appendChild(celulaAcoes);

    return linha;
}

//Função de renderização da tabela
function renderizarProdutos() {
    const produtosFiltrados = obterProdutosFiltrados();

    //Exibe um aviso quando nenhum produto atende aos filtros
    if (produtosFiltrados.length === 0) {
        const linhaVazia = document.createElement("tr");
        const celulaVazia = document.createElement("td");

        celulaVazia.colSpan = 7;
        celulaVazia.textContent = produtos.length === 0
            ? "Nenhum produto cadastrado."
            : "Nenhum produto encontrado com os filtros aplicados.";

        linhaVazia.appendChild(celulaVazia);
        listaProdutos.replaceChildren(linhaVazia);
        return;
    }

    //Transforma cada produto em uma linha da tabela com map()
    const linhas = produtosFiltrados.map(criarLinhaProduto);

    //Substitui o conteúdo anterior da tabela pelas novas linhas
    listaProdutos.replaceChildren(...linhas);
}

//Função para listar os 5 produtos com menor quantidade
function renderizarPrioritarios() {
    if (produtos.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.textContent = "Nenhum produto cadastrado.";
        listaPrioritarios.replaceChildren(itemVazio);
        return;
    }

    //Cria uma cópia para não alterar a ordem da lista original
    const menoresQuantidades = [...produtos]
        .sort(function(a, b) {
            return a.quantidade - b.quantidade
                || a.nome.localeCompare(b.nome, "pt-BR");
        })
        .slice(0, 5);

    //Transforma cada produto em um item da lista com map()
    const itens = menoresQuantidades.map(function(produto) {
        const item = document.createElement("li");
        const etiquetaSituacao = document.createElement("span");
        const situacao = obterSituacao(produto);

        item.textContent = produto.nome + " — " + produto.quantidade
            + (produto.quantidade === 1 ? " unidade " : " unidades ");

        etiquetaSituacao.textContent = situacao;
        etiquetaSituacao.className = "status status-" + codigosSituacao[situacao];
        item.appendChild(etiquetaSituacao);

        return item;
    });

    listaPrioritarios.replaceChildren(...itens);
}

//Função para atualização de Indicadores
function atualizarIndicadores(){
    const indicadorTotal = document.getElementById("totalProdutos");
    const indicadorSemEstoque = document.getElementById("semEstoque");
    const indicadorEstoqueCritico = document.getElementById("estoqueCritico");
    const indicadorValorEstoque = document.getElementById("valorEstoque");

    indicadorTotal.textContent = produtos.length;

    indicadorEstoqueCritico.textContent = produtos.filter(function(produto) {
        return obterSituacao(produto) === "Estoque crítico";
    }).length;

    indicadorSemEstoque.textContent = produtos.filter(function(produto) {
        return obterSituacao(produto) === "Sem estoque";
    }).length;

    indicadorValorEstoque.textContent = formatadorMoeda.format(
        produtos.reduce(function(acumulador, produto) {
            acumulador += produto.preco * produto.quantidade;
            return acumulador;
        }, 0)
    );
}

carregarProdutos();
