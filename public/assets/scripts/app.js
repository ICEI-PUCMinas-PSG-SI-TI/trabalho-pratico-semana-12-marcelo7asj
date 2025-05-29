document.addEventListener("DOMContentLoaded", () => {
    carregarFilmes();
    montarDestaques();
    configurarBusca();
});

const API_URL = "http://localhost:3000/filmes";

async function carregarFilmes(lista = null) {
    const container = document.getElementById("filmes-container");
    if (!container) return;

    container.innerHTML = "<p class='text-white'>Carregando...</p>";

    try {
        const response = await fetch(API_URL);
        const filmes = await response.json();
        const dados = lista || filmes;

        if (dados.length === 0) {
            container.innerHTML = "<p class='text-center mt-4'>Nenhum filme encontrado.</p>";
            return;
        }

        container.innerHTML = "";

        dados.forEach(filme => {
            const card = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card bg-dark text-white h-100">
                        <img src="imgs/${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${filme.titulo}</h5>
                            <p class="card-text">${filme.descricao}</p>
                            <a href="detalhes.html?id=${filme.id}" class="btn btn-danger">Ver mais</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        container.innerHTML = "<p class='text-danger'>Erro ao carregar filmes.</p>";
        console.error("Erro ao buscar filmes:", error);
    }
}

async function montarDestaques() {
    const carouselInner = document.getElementById("carousel-inner");
    const carouselIndicators = document.getElementById("carousel-indicators");

    if (!carouselInner || !carouselIndicators) return;

    try {
        const response = await fetch(API_URL);
        const filmes = await response.json();
        const destaqueFilmes = filmes.filter(f => f.destaque);

        carouselInner.innerHTML = "";
        carouselIndicators.innerHTML = "";

        destaqueFilmes.forEach((filme, index) => {
            const active = index === 0 ? "active" : "";

            carouselInner.innerHTML += `
                <div class="carousel-item ${active}">
                    <img src="imgs/${filme.imagem}" class="d-block w-100" style="max-height: 500px; object-fit: cover;" alt="${filme.titulo}">
                    <a href="detalhes.html?id=${filme.id}" class="text-decoration-none text-white">
                        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
                            <h5 class="text-danger">${filme.titulo}</h5>
                            <p>${filme.descricao}</p>
                        </div>
                    </a>
                </div>
            `;

            carouselIndicators.innerHTML += `
                <button type="button" data-bs-target="#carouselDestaques" data-bs-slide-to="${index}" class="${active}" aria-label="Slide ${index + 1}"></button>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar destaques:", error);
    }
}

function configurarBusca() {
    const input = document.getElementById("search-input");
    const botao = document.getElementById("search-btn");

    botao.addEventListener("click", async () => {
        const termo = input.value.toLowerCase();
        try {
            const response = await fetch(API_URL);
            const filmes = await response.json();
            const resultado = filmes.filter(f => f.titulo.toLowerCase().includes(termo));
            carregarFilmes(resultado);
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            botao.click();
        }
    });
}
