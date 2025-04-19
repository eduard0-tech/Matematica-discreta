// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');
document.body.classList.toggle('dark-mode', localStorage.getItem('darkMode') === 'true');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Drag and Drop
document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.innerText);
    });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', e => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        zone.innerHTML += `<div class="draggable">${data}</div>`;
        zone.classList.remove('dragover');
        verificarRespostas();
    });
});

// Sistema de Progresso
let progresso = JSON.parse(localStorage.getItem('progresso')) || {
    conjuntos: 0,
    relacoes: 0,
    funcoes: 0,
    sequencias: 0
};

// Quiz
document.querySelectorAll('.resposta-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const correto = this.textContent === "{3,4}";
        const feedback = this.closest('.card-body').querySelector('.feedback');
        feedback.textContent = correto ? "✓ Correto!" : "✗ Tente novamente";
        feedback.style.color = correto ? "green" : "red";
        if (correto) progresso.conjuntos = 1;
        localStorage.setItem('progresso', JSON.stringify(progresso));
    });
});

// Simulador de Sequências
function gerarSequencia(tipo = 'pa') {
    const razao = parseFloat(document.getElementById('razao').value);
    const termoInicial = parseFloat(document.getElementById('termoInicial').value);
    let sequencia = [termoInicial];

    for (let i = 0; i < 4; i++) {
        sequencia.push(tipo === 'pa' ?
            sequencia[i] + razao :
            sequencia[i] * razao);
    }

    document.getElementById('resultadoSequencia').innerHTML =
        `Sequência ${tipo.toUpperCase()}: ${sequencia.join(', ')}`;
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    window.scrollTo({
        top: section.offsetTop - 70,
        behavior: 'smooth'
    });
}
function gerarSequencias() {
    // Obter valores dos inputs
    const a1 = parseFloat(document.getElementById('termoInicial').value) || 1;
    const r = parseFloat(document.getElementById('razao').value) || 1;
    const n = parseInt(document.getElementById('numTermos').value) || 5;
    
    // Gerar PA
    let pa = [a1];
    for(let i = 1; i < n; i++) {
        pa.push(a1 + i * r);
    }
    
    // Gerar PG
    let pg = [a1];
    for(let i = 1; i < n; i++) {
        pg.push(a1 * Math.pow(r, i));
    }
    
    // Exibir resultados
    document.getElementById('resultadoPA').innerHTML = `
        ${pa.join(', ')}<br>
        <small class="text-muted">Razão: ${r} | Termos: ${n}</small>
    `;
    
    document.getElementById('resultadoPG').innerHTML = `
        ${pg.join(', ')}<br>
        <small class="text-muted">Razão: ${r} | Termos: ${n}</small>
    `;

    // Atualizar fórmulas com valores reais
    document.querySelectorAll('.formula').forEach((formula, index) => {
        if(index === 0) { // PA
            formula.innerHTML = `aₙ = ${a1} + (n-1)・${r}`;
        } else { // PG
            formula.innerHTML = `aₙ = ${a1}・${r}<sup>n-1</sup>`;
        }
    });

    // Salvar no progresso
    progresso.sequencias = 1;
    localStorage.setItem('progresso', JSON.stringify(progresso));
}