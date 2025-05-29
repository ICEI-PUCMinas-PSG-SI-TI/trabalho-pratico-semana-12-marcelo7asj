const API_URL = "http://localhost:3000/filmes";

document.addEventListener("DOMContentLoaded", () => {
    carregarFilmes();

    document.getElementById("form-filme").addEventListener("submit", async function (e) {
        e.preventDefault();
        const id = document.getElementById("id").value;
        const filme = {
            titulo: document.getElementById("titulo").value,
            diretor: document.getElementById("diretor").value,
            ano: parseInt(document.getElementById("ano").value),
            genero: document.getElementById("genero").value,
            duracao: document.getElementById("duracao").value,
            descricao: document.getElementById("descricao").value,
            imagem: document.getElementById("imagem").value,
            destaque: false,
            imagens_complementares: []
        };

        if (id) {
            // Atualizar (PUT)
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...filme })
            });
        } else {
            // Criar (POST)
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filme)
            });
        }
        this.reset();
        document.getElementById("btnSalvar").innerText = "Cadastrar Filme";
        carregarFilmes();
    });
});

async function carregarFilmes() {
    const tbody = document.querySelector("#tabela-filmes tbody");
    tbody.innerHTML = "";
    const res = await fetch(API_URL);
    const filmes = await res.json();
    filmes.forEach(filme => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.diretor}</td>
            <td>${filme.ano}</td>
            <td>${filme.genero}</td>
            <td>${filme.duracao}</td>
            <td>${filme.imagem}</td>
            <td>${filme.descricao}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarFilme('${filme.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deletarFilme('${filme.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.editarFilme = async function(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const filme = await res.json();
    document.getElementById("id").value = filme.id;
    document.getElementById("titulo").value = filme.titulo;
    document.getElementById("diretor").value = filme.diretor;
    document.getElementById("ano").value = filme.ano;
    document.getElementById("genero").value = filme.genero;
    document.getElementById("duracao").value = filme.duracao;
    document.getElementById("descricao").value = filme.descricao;
    document.getElementById("imagem").value = filme.imagem;
    document.getElementById("btnSalvar").innerText = "Salvar Alteração";
};

window.deletarFilme = async function(id) {
    if (confirm("Deseja realmente excluir este filme?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregarFilmes();
    }
};