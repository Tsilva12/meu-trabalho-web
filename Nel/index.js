const imagensFundo = [
    'url("https://images.unsplash.com/photo-1578589318274-02854f68813e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589385251-045f05a6faa5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589302500-3fe6d8ab5395?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589315522-9e5521b9c158?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
];

// Função para trocar o fundo a cada 7 segundos
let indiceAtual = Math.floor(Math.random() * imagensFundo.length);  // Escolhe um índice aleatório

function trocarFundo() {
    // Atualiza o fundo da página com a imagem da lista
    document.body.style.backgroundImage = imagensFundo[indiceAtual];
    
    // Incrementa o índice para a próxima imagem, e reinicia se chegar ao fim
    indiceAtual = (indiceAtual + 1) % imagensFundo.length; // Vai voltar ao 0 quando chegar ao final da lista
}

// Chama a função pela primeira vez assim que a página carrega
trocarFundo();


setInterval(trocarFundo, 7000);

const key="9b78fb032eb6ef2fc85c99bdc4be8260"

function mudarDados(grdados) {
console.log(grdados)
    document.querySelector(".cidade").innerHTML = grdados.name
    document.querySelector(".tempr").innerHTML = Math.floor(grdados.main.temp) + " °C"
    document.querySelector(".umidade").innerHTML = "Umidade:" + grdados.main.humidity + "%"
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${grdados.weather[0].icon}.png`
    document.querySelector(".texto-previsao").innerHTML = grdados.weather[0].description
}

async function encontarCidade(cidade) {

   const grdados = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`).then(response => response.json())

   mudarDados(grdados)
}

function clicarNoBotao() {
    const input= document.querySelector(".input-cidade").value

    encontarCidade(input)
}