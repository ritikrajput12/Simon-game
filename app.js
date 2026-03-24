let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let isPlaying = false;
let allowRestart = true;

let h2 = document.querySelector("h2");

let sounds = {
    red: new Audio("sounds/red.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    green: new Audio("sounds/green.mp3"),
    purple: new Audio("sounds/purple.mp3")
};

function startGame() {
    if (!started && allowRestart) {
        started = true;
        allowRestart = false;

        Object.values(sounds).forEach(s => {
            s.play().then(() => s.pause()).catch(() => {});
        });

        levelUp();
    }
}

document.addEventListener("keydown", startGame);
document.addEventListener("click", startGame);

function gameFlash(btn, color) {
    btn.classList.add("flash");
    sounds[color].currentTime = 0;
    sounds[color].play();

    setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn, color) {
    btn.classList.add("userflash");
    sounds[color].currentTime = 0;
    sounds[color].play();

    setTimeout(() => {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    isPlaying = true;

    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    gameSeq.push(randColor);

    gameSeq.forEach((color, i) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);
            gameFlash(btn, color);

            if (i === gameSeq.length - 1) {
                isPlaying = false;
            }
        }, (i + 1) * 600);
    });
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        h2.innerHTML = `Game Over! Score: ${level} <br>Tap or press to restart`;

        document.body.style.backgroundColor = "red";

        setTimeout(() => {
            document.body.style.backgroundColor = "white";
            allowRestart = true;
        }, 300);

        reset();
    }
}

function btnPress() {
    if (isPlaying || !started) return;

    let btn = this;
    let userColor = btn.getAttribute("id");

    userFlash(btn, userColor);
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}