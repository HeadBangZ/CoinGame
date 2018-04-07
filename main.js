window.addEventListener('load', startGame);

let game = {};
let coins = [];
let points = 0;
let time = 60;
let speed = 0.75;
let coin;
let canvas = document.getElementById('gameCanvas');
let menu = document.getElementById('menu');
let pointText = new createjs.Text();
let timeText = new createjs.Text();
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let highscore = localStorage.getItem("highscore");
const highscoreText = document.getElementById("highscoreResult");
let gameEngine = true;
// let pointText = document.getElementById('points');

// Press button before start
function startGame() {
    highscoreText.innerHTML = highscore;
    let startBtn = document.getElementById('start');
    startBtn.addEventListener('click', ready);
}

function ready() {
    menu.style.display = 'none';
    game.stage = new createjs.Stage(canvas);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', tock);
    maybeAddCoin();
    timeCount();
}

function maybeAddCoin() {
    let randomNum = Math.random() * 1000;
    if (randomNum < 50) {
        coinGenerator(6);
    }
}

function coinGenerator(diameter) {
    let x = Math.round(Math.random() * canvas.width);
    coin = new createjs.Shape();
    coin.graphics.beginFill('gold')
    coin.graphics.drawCircle(x, 0, diameter);
    coin.addEventListener('click', coinClicked);
    coins.push(coin);
    game.stage.addChild(coin);
    game.stage.addChild(pointText);
    game.stage.addChild(timeText);
    timeText.font = "15px Dorsa";
    timeText.color = "#fff";
    timeText.text = time;
    timeText.x = canvasWidth - 20;
    timeText.y = 5;
}

function coinClicked(event) {
    game.stage.removeChild(event.target)
        // Point count
    points++;
    // console.log(points)
    pointCount(points);
}

function moveCoin() {
    for (var i = 0; i < coins.length; i++) {
        coins[i].y += speed;
    }
    for (var n = 0; n < coins.length; n++) {
        if (coins[n].y > canvas.offsetHeight) {
            game.stage.removeChild(coins[n]);
            coins.splice(n, 1);
        }
    }
}

// Time counter
function timeCount() {
    setInterval(() => {
        time--;
        if (time === 45 || time === 30 || time === 15) {
            speed = speed + 0.25;
        }
        if (time === 0) {
            console.log("game over");
            checkPointsToHighscore(points);
        }
    }, 1000);
}

function pointCount(start) {
    pointText.font = "15px Dorsa";
    pointText.color = "#fff";
    pointText.text = start;
    pointText.x = 10;
    pointText.y = 5;
}
// Highscore
function checkPointsToHighscore(points) {
    let gameOverText = document.getElementById("gameOverText");
    if (highscore !== null) {
        if (points > highscore) {
            localStorage.setItem("highscore", points);
            gameEngine = false;
            gameOverText.innerHTML = "Congratulation you made history!";
            gameOver();
        } else {
            gameEngine = false;
            gameOverText.innerHTML = "Better luck next time!";
            gameOver();
        }
    } else {
        localStorage.setItem("highscore", points);
    }
    // document.location.reload();
}

function gameOver() {
    let gameOverMenu = document.getElementById("gameOver");
    let restartBtn = document.getElementById("restart");
    gameOverMenu.style.display = "block";
    gameOverMenu.style.top = (window.innerHeight / 2) - (gameOverMenu.offsetHeight / 2) + "px";
    gameOverMenu.style.left = (window.innerWidth / 2) - (gameOverMenu.offsetWidth / 2) + "px";
    restartBtn.addEventListener("click", function() {
        document.location.reload();
    });
}

function tock(e) {
    // pointText.innerHTML = points;
    if (gameEngine) {
        maybeAddCoin();
        moveCoin();
        game.stage.update(e);
    }
}