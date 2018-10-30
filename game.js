window.addEventListener('keydown', this.onKeyPress, false);

init();

var highScore;
var interval;

function init() {
    if (interval) {
        clearInterval(interval);
    }

    loadHighScore();

    this.canvas = document.getElementById('board');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.canvas.margins = 25;

    this.canvas.addEventListener('click', function () {
        onClick();
    }, false);

    this.ctx = this.canvas.getContext('2d');
    initNewGame();
}

function initNewGame() {
    if (interval) {
        clearInterval(interval);
    }

    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);

    interval = setInterval(this.update, 1000 / 30);
}

function update() {
    if (!this.player.gameOver) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.player.update();
    } else {
        console.log('game over ');
    }
}

function gameOver() {
    this.player.gameOver = true;
    ctx.fillStyle = 'black';
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);

    if (player.score > highScore) {
        highScore = player.score;
        localStorage.setItem('highScore', JSON.stringify(highScore));
    }
    clearInterval(interval);
    setTimeout(initNewGame, 2000);
}

function loadHighScore() {
    let savedScore = JSON.parse(localStorage.getItem('score'));
    let savedHighScore = JSON.parse(localStorage.getItem('highScore'));
    if (savedHighScore) {
        highScore = savedHighScore;
    }
    if (savedScore && savedScore > highScore) {
        highScore = savedScore;
    }
}

function onKeyPress(e, c) {
    let key = e.keyCode;

    if (key === 32) {
        player.commit();
    }
}

function onClick() {
    if (this.player && !this.player.gameOver) {
        this.player.commit();
    }
}

function getRandomColor() {
    var letters = '23456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 12)];
    }
    return color;
}


function Player() {
    this.blocks = [];

    this.block = new Block(canvas.width / 2 - 100, canvas.height / 2, 200, 50);
    this.block.vx = 0;
    this.block.vy = 0;
    this.block.color = '#ff00ff';

    this.speed = 8;
    this.score = 0;

    this.update = function () {
        this.block.update();
        this.blocks.forEach(b => {
            b.update();
        });
        this.draw();
    }

    this.draw = function () {
        this.block.draw();

        ctx.font = "bold 100px Arial";
        ctx.textAlign = "center"
        ctx.fillText(this.score, canvas.width / 2, 120);

        if (highScore > 0) {
            ctx.fillStyle = 'gray';
            ctx.font = "36px Arial";
            ctx.textAlign = "end"
            ctx.fillText('H: ' + highScore, canvas.width, 30);
        }
    }

    this.commit = function () {
        if (this.block.parent) {
            this.block.moveX = false;
            let parent = this.block.parent;

            if (this.block.x < parent.x) {
                this.block.width = this.block.width - (parent.x - this.block.x);
                this.block.x = parent.x;
            } else if (
                this.block.x + this.block.width > parent.x + parent.width) {

                this.block.width = this.block.width - (
                    this.block.x + this.block.width - (parent.x + parent.width));
            }

            if (this.block.width < 1 || this.block.x + this.block.width < parent.x || this.block.x > parent.x + parent.width) {
                gameOver();
                return;
            }
        }

        let newBlock = new Block(0, canvas.height / 2, this.block.width, this.block.height, this.speed, this.block);

        let startX = Math.random() > 0.5 ? 0 : canvas.width - newBlock.width;

        newBlock.x = startX;
        newBlock.moveX = true;

        this.blocks.push(this.block);
        this.moveBlocks();
        this.block = newBlock;
        this.blocks = this.blocks.filter(b => !b.remove);

        this.score++;
        localStorage.setItem('score', JSON.stringify(this.score));
    }

    this.moveBlocks = function () {
        this.blocks.forEach(b => {
            b.moveDown();
        });
    }
}

function Block(x, y, w, h, speed, parent) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.vx = 1;
    this.parent = parent;
    this.color = getRandomColor();

}

Block.prototype.moveDown = function () {
    this.moveY = true;
    this.startY = this.y;
}

Block.prototype.update = function () {
    if (this.moveY) {
        this.y += 8;
        if (this.y - this.startY >= this.height) {
            this.moveY = false;
            this.y = this.startY + this.height;
        }
    }
    if (this.moveX) {
        this.x += this.vx * this.speed;

        if (this.x + this.width > canvas.width - canvas.margins) {
            this.vx = -1;
        } else if (this.x < canvas.margins) {
            this.vx = 1;
        }
    }

    if (this.y > canvas.height) {
        this.remove = true;
    }

    this.draw();
}

Block.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
