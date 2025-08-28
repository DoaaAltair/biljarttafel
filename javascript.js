const radius = 10;
const pocketRadius = 22;
let lijst = [];
let gamePaused = false;

// stick variabelen
let aiming = false;
let mouseX = 0, mouseY = 0;
let power = 0;

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

function initBalls() {
    const canvas = document.getElementById("mijnCanvas");
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
    const canvas = document.getElementById('mijnCanvas');
    const ctx = canvas.getContext('2d');
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

// muis events
document.addEventListener("mousedown", e => {
    let cueBall = lijst[0];
    aiming = true;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    power = 0;
});

document.addEventListener("mousemove", e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (aiming) {
        // kracht vergroten afhankelijk van afstand
        let cueBall = lijst[0];
        let dx = cueBall.x - mouseX;
        let dy = cueBall.y - mouseY;
        power = Math.min(100, Math.sqrt(dx * dx + dy * dy));
    }
});

document.addEventListener("mouseup", e => {
    if (aiming) {
        aiming = false;
        let cueBall = lijst[0];
        let dx = e.offsetX - cueBall.x;
        let dy = e.offsetY - cueBall.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            cueBall.speedX = (dx / dist) * (power / 5);
            cueBall.speedY = (dy / dist) * (power / 5);
        }
        power = 0;
    }
});


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
        pauzeKnop.textContent = "Start";
        pauzeKnop.classList.remove("stopActief");   // rood weghalen
    } else {
        pauzeKnop.textContent = "Stop";
        pauzeKnop.classList.add("stopActief");      // rood toevoegen
    }
}



// start
initBalls();
setInterval(drawCanvas, 10);

function toggleInstructies() {
    const paneel = document.getElementById('instructiesPaneel');
    paneel.classList.toggle('open');
}

// Auto open bij onload, kort zichtbaar
window.addEventListener('load', () => {
    const paneel = document.getElementById('instructiesPaneel');
    paneel.classList.add('open');
});