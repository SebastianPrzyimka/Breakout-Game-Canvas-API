const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');
const brickRowCount = 9;
const brickColumnCount = 5;

let score = 0;

//create the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
}

//create paddle 
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height -40,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}

//create bricks
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

//create all bricks
const bricks = [];
for(let i = 0; i < brickRowCount; i++){
  bricks[i] = [];
    for(let j = 0; j < brickColumnCount; j++){
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = {x,y, ...brickInfo }
    }
}


//draw a ball
function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#1d77ff';
  ctx.fill();
  ctx.closePath();
}
//draw paddle
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#1d77ff';
  ctx.fill();
  ctx.closePath();
}

//draw score
function drawScore() {
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, canvas.width - 100,30)
}

//draw bricks
function drawBricks(){
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x,brick.y,brick.w,brick.h);
      ctx.fillStyle = brick.visible ? '#1d77ff' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  })
}

//move paddle on canvas
function movePaddle(){
  paddle.x += paddle.dx

  //wall detection
  if(paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }

  if(paddle.x < 0 ) {
    paddle.x = 0;
  }
}

function moveBall(){
 ball.x += ball.dx;
 ball.y += ball.dy;

 //wall collusion (right/left)
 if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
   ball.dx *= -1 //ball.dx = ball.dx * -1
 }
 //wall collusion (top/bottom)
 if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
  ball.dy *= -1 //ball.dx = ball.dx * -1
}

 //paddle collusion
 if(
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
 
   ball.dy = -ball.speed;
 }
 //brick collusion
 bricks.forEach(column => {
   column.forEach(brick => {
     if(brick.visible){
       if(ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
          ) {
            ball.dy *= -1
            brick.visible = false

            increaseScore();
      }
     }
   })
 });
//hit bottom wall lose
if(ball.y + ball.size > canvas.height){
  showAllBricks();
  score = 0
}
}

function increaseScore(){
  score++;
  if(score % (brickRowCount * brickRowCount) === 0){
    showAllBricks();
  }
}

function showAllBricks(){
  bricks.forEach(column => {
    column.forEach(brick => brick.visible = true)
  })
}


//draw everything
function draw(){
  //clear canvas
  ctx.clearRect(0,0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//update canvas drawing and animations
function update(){
  
  movePaddle();
  moveBall();

  //draw everything
  draw();

  requestAnimationFrame(update);
}

update();


//keyboard event listeners

function keyDown(e){
  if(e.key === 'right' || e.key === 'ArrowRight'){
    paddle.dx = paddle.speed;
  }else if (e.key === 'left' || e.key === 'ArrowLeft'){
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e){
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
    paddle.dx = 0;
  }
}

document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)

//Rules and close event handler

rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
})
closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
})