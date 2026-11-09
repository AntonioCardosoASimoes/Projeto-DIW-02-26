const formulario = document.querySelector(".formulario-cadastro");
let obras = JSON.parse(localStorage.getItem("obras")) || [];
let obraEmEdicao = null;

function salvarObras() {
    localStorage.setItem("obras", JSON.stringify(obras));
}

const listaObras = document.querySelector(".lista-obras");
const formularioPesquisa = document.querySelector(".formulario-pesquisa");
let textoPesquisa = "";
let filtroTipo = "todos";
let filtroGenero = "todos";
let filtroStatus = "todos";
let ordenacao = "titulo";

function mostrarObras() {
    listaObras.querySelectorAll(".cartao-obra").forEach(function(cartao) {
        cartao.remove();
    });

    const obrasFiltradas = obras.filter(function(obra) {
        const correspondePesquisa = obra.titulo.toLowerCase().includes(textoPesquisa);

        const correspondeTipo = filtroTipo === "todos" || obra.tipo === filtroTipo;

        const correspondeGenero = filtroGenero === "todos" ||
            obra.genero.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(filtroGenero);

        const correspondeStatus = filtroStatus === "todos" || obra.status === filtroStatus;

        return correspondePesquisa && correspondeTipo &&
               correspondeGenero && correspondeStatus;
    });
    obrasFiltradas.sort(function(a, b) {
        if (ordenacao === "titulo") {
            return a.titulo.localeCompare(b.titulo);
        }

        if (ordenacao === "ano") {
            return a.ano - b.ano;
        }

        if (ordenacao === "nota") {
            return (b.nota ?? -1) - (a.nota ?? -1);
        }

        return 0;
    });

    for (let obra of obrasFiltradas) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-obra";

        const imagem = document.createElement("img");
        imagem.src = obra.imagem || "https://placehold.co/160x230?text=Sem+Imagem";
        imagem.alt = "Imagem de " + obra.titulo;
        cartao.appendChild(imagem);

        const titulo = document.createElement("h4");
        titulo.textContent = obra.titulo;
        cartao.appendChild(titulo);

        const tipo = document.createElement("p");
        tipo.textContent = "Tipo: " + (obra.tipo === "filme" ? "Filme" : "Série");
        cartao.appendChild(tipo);

        const genero = document.createElement("p");
        genero.textContent = "Gênero: " + obra.genero;
        cartao.appendChild(genero);

        const ano = document.createElement("p");
        ano.textContent = "Ano: " + obra.ano;
        cartao.appendChild(ano);

        const nota = document.createElement("p");
        nota.textContent = "Minha nota: " + (obra.nota === null ? "Não informada" : obra.nota);
        cartao.appendChild(nota);

        const status = document.createElement("p");
        status.textContent = "Status: " + obra.status;
        cartao.appendChild(status);

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.type = "button";
        botaoDetalhes.textContent = "Ver detalhes";

        const detalhes = document.createElement("section");
        detalhes.hidden = true;

        const responsavel = document.createElement("p");
        responsavel.textContent = (obra.tipo === "filme" ? "Diretor: " : "Criador: ") + (obra.responsavel || "Não informado");
        detalhes.appendChild(responsavel);

        const tempo = document.createElement("p");

        if (obra.tipo === "filme") {
            tempo.textContent = "Duração: " + (obra.duracao === null ? "Não informada" : obra.duracao + " minutos");
        } else {
            tempo.textContent = "Temporadas: " + (obra.temporadas === null ? "Não informado" : obra.temporadas);
        }

        detalhes.appendChild(tempo);

        const sinopse = document.createElement("p");
        sinopse.textContent = "Sinopse: " + (obra.sinopse || "Não informada");
        detalhes.appendChild(sinopse);

        botaoDetalhes.addEventListener("click", function() {
            detalhes.hidden = !detalhes.hidden;

            if (detalhes.hidden) {
                botaoDetalhes.textContent = "Ver detalhes";
            } else {
                botaoDetalhes.textContent = "Ocultar detalhes";
            }
        });

        cartao.appendChild(botaoDetalhes);
        cartao.appendChild(detalhes);

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", function() {
            obraEmEdicao = obra;

            document.getElementById("titulo").value = obra.titulo;
            document.getElementById("tipo").value = obra.tipo;
            document.getElementById("genero").value = obra.genero;
            document.getElementById("ano").value = obra.ano;
            document.getElementById("duracao").value = obra.duracao ?? "";
            document.getElementById("temporadas").value = obra.temporadas ?? "";
            document.getElementById("responsavel").value = obra.responsavel;
            document.getElementById("nota").value = obra.nota ?? "";
            document.getElementById("status").value = obra.status;
            document.getElementById("sinopse").value = obra.sinopse;
            document.getElementById("imagem").value = obra.imagem;

            formulario.querySelector("button").textContent = "Salvar alterações";

            document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
        });

        cartao.appendChild(botaoEditar);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function() {
            const confirmar = confirm("Deseja realmente excluir " + obra.titulo + "?");

            if (confirmar) {
                obras = obras.filter(function(item) {
                    return item !== obra;
                });

                salvarObras();
                mostrarObras();

                alert("Obra excluída com sucesso!");
            }
        });

        cartao.appendChild(botaoExcluir);

        listaObras.appendChild(cartao);
    }
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const tipo = document.getElementById("tipo").value;
    const genero = document.getElementById("genero").value;
    const ano = document.getElementById("ano").value;
    const duracao = document.getElementById("duracao").value;
    const temporadas = document.getElementById("temporadas").value;
    const responsavel = document.getElementById("responsavel").value;
    const nota = document.getElementById("nota").value;
    const status = document.getElementById("status").value;
    const sinopse = document.getElementById("sinopse").value;
    const imagem = document.getElementById("imagem").value;

    const obra = {
    titulo: titulo,
    tipo: tipo,
    genero: genero,
    ano: Number(ano),
    duracao: duracao === "" ? null : Number(duracao),
    temporadas: temporadas === "" ? null : Number(temporadas),
    responsavel: responsavel,
    nota: nota === "" ? null : Number(nota),
    status: status,
    sinopse: sinopse,
    imagem: imagem
    };

    if (obraEmEdicao === null) {
        obras.push(obra);
    } else {
        const indice = obras.indexOf(obraEmEdicao);
        obras[indice] = obra;
        obraEmEdicao = null;
    }

    salvarObras();
    mostrarObras();

    formulario.reset();
    formulario.querySelector("button").textContent = "Cadastrar obra";
});

formularioPesquisa.querySelector("button").addEventListener("click", function() {
    textoPesquisa = document.getElementById("pesquisa").value.trim().toLowerCase();

    filtroTipo = document.getElementById("filtro-tipo").value;
    filtroGenero = document.getElementById("filtro-genero").value;
    filtroStatus = document.getElementById("filtro-status").value;

    ordenacao = document.getElementById("ordenacao").value;

    mostrarObras();
});

mostrarObras();

const botaoBuscaApi = document.getElementById("botao-busca-api");
const campoBuscaApi = document.getElementById("pesquisa-api");
const resultadosApi = document.getElementById("resultados-api");

botaoBuscaApi.addEventListener("click", async function() {
    const pesquisa = campoBuscaApi.value.trim();

    if (pesquisa === "") {
        resultadosApi.textContent = "Digite o nome de um filme ou série.";
        return;
    }

    resultadosApi.textContent = "Buscando filmes e séries...";

    const endereco = "https://cinelist-api.antoniocardososimoes.workers.dev/?pesquisa=" +
        encodeURIComponent(pesquisa);

    try {
        const resposta = await fetch(endereco);

        if (!resposta.ok) {
            throw new Error("Erro na consulta à API");
        }

        const dados = await resposta.json();

        mostrarResultadosApi(dados);

    } catch (erro) {
        resultadosApi.textContent = "Não foi possível realizar a pesquisa.";
        console.log(erro);
    }
});

function mostrarResultadosApi(dados) {
    resultadosApi.innerHTML = "";

    if (dados.length === 0) {
        resultadosApi.textContent = "Nenhuma obra encontrada.";
        return;
    }

    for (let obra of dados) {
        const cartao = document.createElement("div");
        cartao.className = "resultado-api";

        const imagem = document.createElement("img");

        if (obra.poster_path) {
            imagem.src = "https://image.tmdb.org/t/p/w300" + obra.poster_path;
        } else {
            imagem.src = "https://placehold.co/160x230?text=Sem+Imagem";
        }

        imagem.alt = "Pôster de " + (obra.title || obra.name);

        cartao.appendChild(imagem);

        const titulo = document.createElement("h3");
        titulo.textContent = obra.title || obra.name;

        const ano = document.createElement("p");
        const data = obra.release_date || obra.first_air_date || "";
        ano.textContent = "Ano: " + (data ? data.substring(0, 4) : "Não informado");

        const tipo = document.createElement("p");
        tipo.textContent = "Tipo: " +
            (obra.media_type === "movie" ? "Filme" : "Série");

        cartao.appendChild(titulo);
        cartao.appendChild(ano);
        cartao.appendChild(tipo);

        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.type = "button";
        botaoAdicionar.textContent = "Adicionar ao CineList";
        botaoAdicionar.addEventListener("click", function() {
            const tituloObra = obra.title || obra.name;
            const dataObra = obra.release_date || obra.first_air_date || "";

            obraEmEdicao = null;

            document.getElementById("titulo").value = tituloObra;
            document.getElementById("tipo").value =
                obra.media_type === "movie" ? "filme" : "serie";

            document.getElementById("genero").value = "";
            document.getElementById("ano").value =
                dataObra ? dataObra.substring(0, 4) : "";

            document.getElementById("duracao").value = "";
            document.getElementById("temporadas").value = "";
            document.getElementById("responsavel").value = "";
            document.getElementById("nota").value = "";
            document.getElementById("status").value = "quero-assistir";
            document.getElementById("sinopse").value = obra.overview || "";

            document.getElementById("imagem").value = obra.poster_path
                ? "https://image.tmdb.org/t/p/w500" + obra.poster_path
                : "";

            formulario.querySelector("button").textContent = "Cadastrar obra";

            document.getElementById("cadastro").scrollIntoView({
                behavior: "smooth"
            });
        });

        cartao.appendChild(botaoAdicionar);

        resultadosApi.appendChild(cartao);
    }
}