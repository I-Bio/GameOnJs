const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//canvas.width = innerWidth;
//canvas.height = innerHeight;
//context.scale(innerWidth / canvas.width, innerHeight / canvas.height);

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;

const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 30;
const bricks = [];

let x = canvas.width / 2;

let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleYm2 = canvas.height - paddleHeight;
let paddleXm2 = canvas.width - paddleWidth;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;


for (let i = 0; i < brickColumnCount; i++)
{
    bricks[i] = [];
    for (let j = 0; j < brickRowCount; j++)
    {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}


function Draw()
{
    context.clearRect(0,0,canvas.width, canvas.height);
    DrawBricks();
    DrawBall();
    DrawPaddle();
    DrawScore();
    DrawLives();
    CollisionDetection();

    if (rightPressed)
    {
        paddleX = Math.min(paddleX + 7, paddleXm2);
    } else if (leftPressed)
    {
        paddleX = Math.max(paddleX - 7, 0);
    }

    if (y + dy < ballRadius)
    {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius)
    {
        if (paddleX < x && paddleX + paddleWidth > x)
        {
            dy = -dy;
        } else
        {
            lives--;
            if (!lives)
            {
                alert('Game Over');
                document.location.reload();
            } else
            {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(Draw);
}

function DrawBall()
{
    context.beginPath();
    context.arc(x,y,ballRadius,0,Math.PI*2);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
}

function DrawPaddle()
{
    context.beginPath();
    context.rect(paddleX, paddleYm2, paddleWidth, paddleHeight);
    context.fillStyle = 'blue';
    context.fill();
    context.closePath();
}

function DrawBricks()
{
    for (let i = 0; i < brickColumnCount; i++)
    {
        for (let j = 0; j < brickRowCount; j++)
        {
            if (bricks[i][j].status === 1)
            {
                const brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
                const brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
                /*
                if (i < brickColumnCount / 2)
                {
                    brickX = canvas.width / 2 - ((i + 1) * (brickWidth + brickPadding) + brickOffsetLeft);
                } else
                {
                    brickX = canvas.width / 2 + (Math.abs(brickColumnCount - i - 1) * (brickWidth + brickPadding) + brickOffsetLeft);
                } */
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "blue";
                context.fill();
                context.closePath();
            }
        }
    }
}

function DrawScore()
{
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(`Score ${score}`, 8, 20);
}

function DrawLives()
{
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText(`Lives ${lives}`, canvas.width - 65, 20);
}

function CollisionDetection()
{
    for (let i = 0; i < brickColumnCount; i++)
    {
        for (let j = 0; j < brickRowCount; j++)
        {
            const b = bricks[i][j];
            if (b.status === 1)
            {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight)
                {
                    dy = - dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount)
                    {
                        alert("Вы Победили!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function KeyDownHandler(e)
{
    if (e.key === "Right" || e.key === "ArrowRight")
    {
        rightPressed = true;
    } else if(e.key === "Left" || e.key === "ArrowLeft")
    {
        leftPressed = true;
    }
}

function KeyUpHandler(e)
{
    if (e.key === "Right" || e.key === "ArrowRight")
    {
        rightPressed = false;
    } else if(e.key === "Left" || e.key === "ArrowLeft")
    {
        leftPressed = false;
    }
}

function MouseMoveHandler(e)
{
    const relativeX = e.clientX - canvas.offsetLeft;

    if (relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth / 2;
    }
}


document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);
document.addEventListener("mousemove", MouseMoveHandler, false);

Draw();

