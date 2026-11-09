const formulario = document.querySelector(".formulario-cadastro");
let obras = JSON.parse(localStorage.getItem("obras")) || [];

function salvarObras() {
    localStorage.setItem("obras", JSON.stringify(obras));
}

const listaObras = document.querySelector(".lista-obras");

function mostrarObras() {
    listaObras.querySelectorAll(".cartao-obra").forEach(function(cartao) {
        cartao.remove();
    });

    for (let obra of obras) {
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
        cartao.appendChild(botaoDetalhes);

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        cartao.appendChild(botaoEditar);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
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

    obras.push(obra);

    salvarObras();
    mostrarObras();

    formulario.reset();
});
mostrarObras();