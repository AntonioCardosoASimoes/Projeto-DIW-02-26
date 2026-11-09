const formulario = document.querySelector(".formulario-cadastro");
let obras = JSON.parse(localStorage.getItem("obras")) || [];
let obraEmEdicao = null;

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
mostrarObras();