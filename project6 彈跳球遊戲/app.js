const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");

let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 550;
let ground_height = 5;
let brickArray = [];
let brickAmount = 10;
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

//製作所有的brick
for (let i = 0; i < brickAmount; i++) {
  //檢查有無重疊方塊
  let new_x = getRandomArbitrary(0, 950);
  let new_y = getRandomArbitrary(0, 500);
  let overlap = false;
  do {
    overlap = false;
    for (let brick of brickArray) {
      if (
        new_x >= brick.x - 50 &&
        new_x <= brick.x + 50 &&
        new_y >= brick.y - 50 &&
        new_y <= brick.y + 50
      ) {
        overlap = true;
        new_x = getRandomArbitrary(0, 950);
        new_y = getRandomArbitrary(0, 500);
        break;
      }
    }
  } while (overlap);

  new Brick(new_x, new_y);
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球是否有打到磚塊
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //改變x, y方向速度，並且將brick從brickArray之中移除
      if (circle_y >= brick.y + brick.height || circle_y < brick.y) {
        ySpeed *= -1;
      } else if (circle_x <= brick.x) {
        xSpeed *= -1;
      } else if (circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      brickArray.splice(index, 1);
      if (count == brickAmount) {
        alert("勝利");
        clearInterval(game);
      }
    }
  });
  //確認球是否打到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  //檢查圓有沒有碰到牆壁，碰到牆壁則更改位移方向
  if (circle_x <= 0 + radius || circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circle_y <= 0 + radius) {
    ySpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
    alert("失敗");
    clearInterval(game);
  }

  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //劃出圓圈
  //arc參數 x座標 y座標 圓半徑 起始角度 終止角度
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
