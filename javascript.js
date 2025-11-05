const radius = 10;
const pocketRadius = 22;
let lijst = [];
let gamePaused = false;

// stick variabelen
let aiming = false;
let mouseX = 0, mouseY = 0;
let power = 0;

// Canvas responsive setup
let canvas, ctx;
let canvasWidth = 500;
let canvasHeight = 300;
let scaleX = 1;
let scaleY = 1;

const startBallen = [
    { kleur: "white" },
    { kleur: "yellow" },
    { kleur: "blue" },
    { kleur: "red" },
    { kleur: "purple" },
    { kleur: "orange" },
    { kleur: "green" },
    { kleur: "maroon" },
    { kleur: "black" }
];

// Setup responsive canvas
function setupCanvas() {
    canvas = document.getElementById("mijnCanvas");
    ctx = canvas.getContext('2d');

    // Stel aspect ratio in (5:3)
    const aspectRatio = 5 / 3;
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;

    // Bereken canvas grootte
    canvasWidth = Math.min(500, containerWidth - 50);
    canvasHeight = canvasWidth / aspectRatio;

    // Set canvas size
    canvas.width = 500;  // Internal resolution
    canvas.height = 300;

    // Update display size
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';

    // Bereken scale voor touch/mouse coördinaten
    scaleX = 500 / canvasWidth;
    scaleY = 300 / canvasHeight;
}

function initBalls() {
    if (!canvas) setupCanvas();
    lijst = [];
    let startX = 350;
    let startY = canvas.height / 2;
    let index = 1;

    for (let r = 1; r <= 4; r++) {
        for (let c = 0; c < r; c++) {
            if (index < startBallen.length) {
                lijst.push({
                    kleur: startBallen[index].kleur,
                    x: startX + r * 25,
                    y: startY - (r - 1) * radius + c * (radius * 2),
                    speedX: 0,
                    speedY: 0
                });
                index++;
            }
        }
    }

    // witte bal
    lijst.unshift({
        kleur: "white",
        x: 100,
        y: startY,
        speedX: 0,
        speedY: 0
    });
}

function drawCanvas() {
    if (gamePaused) return;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let gameMoving = false;

    const pockets = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height }
    ];

    ctx.fillStyle = "black";
    for (let p of pockets) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pocketRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // teken ballen
    for (let i = lijst.length - 1; i >= 0; i--) {
        let b = lijst[i];

        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = b.kleur;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - 3, b.y - 3, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();

        b.x += b.speedX;
        b.y += b.speedY;

        b.speedX *= 0.99;
        b.speedY *= 0.99;

        if (Math.abs(b.speedX) > 0.001 || Math.abs(b.speedY) > 0.001)
            gameMoving = true;

        if (b.y < radius) b.speedY *= -1;
        if (b.y > canvas.height - radius) b.speedY *= -1;
        if (b.x < radius) b.speedX *= -1;
        if (b.x > canvas.width - radius) b.speedX *= -1;

        // pockets check
        for (let p of pockets) {
            let dx = b.x - p.x;
            let dy = b.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < pocketRadius) {
                lijst.splice(i, 1);
                break;
            }
        }
    }

    // botsing ballen
    for (let i = 0; i < lijst.length; i++) {
        for (let j = i + 1; j < lijst.length; j++) {
            let b1 = lijst[i];
            let b2 = lijst[j];
            let dx = b2.x - b1.x;
            let dy = b2.y - b1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius * 2) {
                let overlap = (radius * 2 - dist) / 2;
                let nx = dx / dist;
                let ny = dy / dist;

                b1.x -= nx * overlap;
                b1.y -= ny * overlap;
                b2.x += nx * overlap;
                b2.y += ny * overlap;

                let kx = (b1.speedX - b2.speedX);
                let ky = (b1.speedY - b2.speedY);
                let p = 2 * (nx * kx + ny * ky) / 2;

                b1.speedX -= p * nx;
                b1.speedY -= p * ny;
                b2.speedX += p * nx;
                b2.speedY += p * ny;
            }
        }
    }

    // teken de stick als je aan het mikken bent
    if (aiming) {
        let cueBall = lijst[0]; // witte bal
        let dx = mouseX - cueBall.x;
        let dy = mouseY - cueBall.y;
        let angle = Math.atan2(dy, dx);

        // power lijn
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(cueBall.x - Math.cos(angle) * power, cueBall.y - Math.sin(angle) * power);
        ctx.stroke();

        // stick tekenen
        ctx.strokeStyle = "#d4a373";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cueBall.x - Math.cos(angle) * (30 + power),
            cueBall.y - Math.sin(angle) * (30 + power));
        ctx.lineTo(cueBall.x - Math.cos(angle) * (120 + power),
            cueBall.y - Math.sin(angle) * (120 + power));
        ctx.stroke();
    }
}

// Helper functie om canvas coördinaten te krijgen
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
        // Touch event (touchstart, touchmove)
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        // Touch event (touchend, touchcancel)
        x = (e.changedTouches[0].clientX - rect.left) * scaleX;
        y = (e.changedTouches[0].clientY - rect.top) * scaleY;
    } else {
        // Mouse event
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
    }

    return { x, y };
}

// Setup event listeners
function setupEventListeners() {
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener("mousedown", e => {
        if (gamePaused) return;
        e.preventDefault();
        if (!lijst[0]) return;
        let coords = getCanvasCoordinates(e);
        aiming = true;
        mouseX = coords.x;
        mouseY = coords.y;
        power = 0;
    });

    canvas.addEventListener("mousemove", e => {
        if (gamePaused) return;
        e.preventDefault();
        let coords = getCanvasCoordinates(e);
        mouseX = coords.x;
        mouseY = coords.y;
        if (aiming && lijst[0]) {
            // kracht vergroten afhankelijk van afstand
            let cueBall = lijst[0];
            let dx = cueBall.x - mouseX;
            let dy = cueBall.y - mouseY;
            power = Math.min(100, Math.sqrt(dx * dx + dy * dy));
        }
    });

    canvas.addEventListener("mouseup", e => {
        if (gamePaused) return;
        e.preventDefault();
        if (aiming && lijst[0]) {
            aiming = false;
            let cueBall = lijst[0];
            let coords = getCanvasCoordinates(e);
            let dx = coords.x - cueBall.x;
            let dy = coords.y - cueBall.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                cueBall.speedX = (dx / dist) * (power / 5);
                cueBall.speedY = (dy / dist) * (power / 5);
            }
            power = 0;
        }
    });

    // Touch events voor mobile
    canvas.addEventListener("touchstart", e => {
        if (gamePaused) return;
        e.preventDefault();
        if (!lijst[0]) return;
        let coords = getCanvasCoordinates(e);
        aiming = true;
        mouseX = coords.x;
        mouseY = coords.y;
        power = 0;
    }, { passive: false });

    canvas.addEventListener("touchmove", e => {
        if (gamePaused) return;
        e.preventDefault();
        let coords = getCanvasCoordinates(e);
        mouseX = coords.x;
        mouseY = coords.y;
        if (aiming && lijst[0]) {
            // kracht vergroten afhankelijk van afstand
            let cueBall = lijst[0];
            let dx = cueBall.x - mouseX;
            let dy = cueBall.y - mouseY;
            power = Math.min(100, Math.sqrt(dx * dx + dy * dy));
        }
    }, { passive: false });

    canvas.addEventListener("touchend", e => {
        if (gamePaused) return;
        e.preventDefault();
        if (aiming && lijst[0]) {
            aiming = false;
            let cueBall = lijst[0];
            let coords = getCanvasCoordinates(e);
            let dx = coords.x - cueBall.x;
            let dy = coords.y - cueBall.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                cueBall.speedX = (dx / dist) * (power / 5);
                cueBall.speedY = (dy / dist) * (power / 5);
            }
            power = 0;
        }
    }, { passive: false });

    canvas.addEventListener("touchcancel", e => {
        e.preventDefault();
        aiming = false;
        power = 0;
    }, { passive: false });
}


function saveData() { localStorage.gameData = JSON.stringify(lijst); }
function loadData() { if (localStorage.gameData) lijst = JSON.parse(localStorage.gameData); }
function startStop() {
    gamePaused = !gamePaused;

    var knoppen = document.getElementsByTagName('button');
    for (var knop of knoppen) {
        if (knop.id != 'pauzeKnop') knop.disabled = gamePaused;
    }

    const pauzeKnop = document.getElementById('pauzeKnop');

    if (gamePaused) {
        // Reset input state tijdens pauze om onbedoelde stoot te voorkomen
        aiming = false;
        power = 0;
        pauzeKnop.textContent = "Start";
        pauzeKnop.classList.remove("stopActief");   // rood weghalen
    } else {
        pauzeKnop.textContent = "Stop";
        pauzeKnop.classList.add("stopActief");      // rood toevoegen
    }
}



// start
window.addEventListener('load', () => {
    setupCanvas();
    setupEventListeners();
    initBalls();
    setInterval(drawCanvas, 10);

    // Responsive canvas resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupCanvas();
            // Herbereken ballen posities als nodig
            if (lijst.length > 0) {
                let startY = canvas.height / 2;
                lijst[0].y = startY; // Reset witte bal positie
            }
        }, 100);
    });

    const paneel = document.getElementById('instructiesPaneel');
    if (paneel) {
        paneel.classList.add('open');
    }
});

function toggleInstructies() {
    const paneel = document.getElementById('instructiesPaneel');
    paneel.classList.toggle('open');
}