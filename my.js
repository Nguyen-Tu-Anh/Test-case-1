const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

//create the unit
const box = 32;

//load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio

let dead = new Audio();
let eat = new Audio();
let sound = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
sound.src = "audio/love1.wav";

// create the snake head
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

// create the random food
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

let score = 0;
// Control snake

document.addEventListener("keydown", direction);
let d = "";

function direction(event) {
    if (event.keyCode === 37 && d !== "RIGHT") {
        d = "LEFT"
    } else if (event.keyCode === 38 && d !== "DOWN") {
        d = "UP"
    } else if (event.keyCode === 39 && d !== "LEFT") {
        d = "RIGHT"
    } else if (event.keyCode === 40 && d !== "UP") {
        d = "DOWN"
    }
}

// draw
function draw() {
    sound.play()
    ctx.drawImage(ground, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.drawImage(foodImg, food.x, food.y);

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // if the snake eat food
    if (snakeX === food.x && snakeY === food.y) {
        eat.play()

        score += 1;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
    } else {
        //remove the tail
        snake.pop();
    }

    // check collision
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    // which direction
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // add new head

    let newHead = {
        x: snakeX,
        y: snakeY
    }
    // Game over

    if (snakeX < box || snakeX > 17 * box
        || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
        dead.play();
        sound.pause();

        clearInterval(game);


        ctx.font = "50px Verdana";
        let gradient = ctx.createLinearGradient(0, 0, 608, 0);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        ctx.fillStyle = gradient;
        ctx.fillText("Game Over!", 608 / 2, 608 / 2)
        // ctx.fillText("Replay", 608 / 2, 608 / 1.6)
    }

    snake.unshift(newHead);
    // draw score
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center"
    ctx.fillText(score, 17 * box, 2.7 * box);
}

//call draw function every 100ms
let game = setInterval(draw, 100);