// AgroForte - Visualizador Interativo de Fluxo de Insumos & Biossistemas via p5.js
let particles = [];
let numParticles = 80;
let scaleGrid = 30;

function setup() {
    // Captura dinamicamente a largura da div pai para garantir a responsividade
    let canvasWidth = document.getElementById('canvas-holder').offsetWidth || 800;
    let canvas = createCanvas(canvasWidth, 400);
    canvas.parent('canvas-holder');
    
    // Inicializa os vetores de partículas (nutrientes e sementes em VRA)
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    
    background(245, 247, 248);
}

function draw() {
    // Taxa de Alpha misturada ao background gera o rastro fluido das partículas (efeito motion blur)
    background(245, 247, 248, 40);
    
    // Grid Técnico simula as passadas de precisão guiadas por GNSS/RTK
    stroke(210, 220, 210);
    strokeWeight(1);
    for (let x = 0; x <= width; x += scaleGrid) {
        line(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += scaleGrid) {
        line(0, y, width, y);
    }
    
    // Renderização e atualização dos vetores biossistêmicos
    for (let p of particles) {
        p.update();
        p.edges();
        p.display();
    }
    
    // Retículo Interativo do Mouse (Simulador de Leitura Espectral e Aplicação Localizada)
    noFill();
    stroke(191, 144, 0); // Amarelo Ouro (Toque Agrinho)
    strokeWeight(1.5);
    ellipse(mouseX, mouseY, 60, 60);
    line(mouseX - 40, mouseY, mouseX + 40, mouseY);
    line(mouseX, mouseY - 40, mouseX, mouseY + 40);
    
    fill(46, 117, 89); // Verde Folha
    noStroke();
    textSize(11);
    textAlign(CENTER);
    text("SENSOR DE TAXA VARIÁVEL (RTK)", mouseX, mouseY - 38);
}

function windowResized() {
    // Redimensiona o canvas dinamicamente caso o usuário gire o celular ou mude a janela
    let canvasWidth = document.getElementById('canvas-holder').offsetWidth || 800;
    resizeCanvas(canvasWidth, 400);
}

// Classe Construtora das Partículas de Vetor Fisiológico
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1.5, 1.5), random(-0.5, 0.5));
        this.acc = createVector(0, 0);
        this.maxSpeed = 2.5;
        
        // Separa as cores por peso visual associado aos elementos do solo
        let randElement = random();
        if (randElement < 0.4) {
            this.color = color(46, 117, 89); // Verde - Frações de Nitrogênio/Clorofila
            this.size = random(4, 7);
        } else if (randElement < 0.7) {
            this.color = color(191, 144, 0); // Amarelo - Grãos e Energia Fotossintética
            this.size = random(3, 5);
        } else {
            this.color = color(112, 72, 44); // Marrom - Matéria Orgânica e Coloides da CTC
            this.size = random(5, 8);
        }
    }
    
    update() {
        // Algoritmo de Atração por Proximidade do Sensor do Maquinário
        let mouseVec = createVector(mouseX, mouseY);
        let distance = p5.Vector.dist(this.pos, mouseVec);
        
        if (distance < 130) {
            let steeringForce = p5.Vector.sub(mouseVec, this.pos);
            steeringForce.setMag(0.18);
            this.acc.add(steeringForce);
        }
        
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0); // Limpa as forças de aceleração para o próximo ciclo
    }
    
    edges() {
        // Efeito de loop infinito nas bordas do talhão virtual
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }
    
    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}