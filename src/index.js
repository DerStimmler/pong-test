"use strict";

import stylesheet from "./index.css";

window.addEventListener("load", () => {
  var canvas = document.getElementById("game_canvas");
  var ctx = canvas.getContext("2d");

  var x = canvas.width / 2;
  var y = canvas.height - canvas.height / 4;
  var ballRadius = 10;
  var dx = 2;
  var dy = -2;
  var br = 0;
  var bg = 255;
  var bb = 0;
  var colorX = 85; //wie viel sich der RGB Wert ändert

  var paddleHeight = 10;
  var paddleWidth = 80;
  var paddleX = canvas.width / 2 - paddleWidth / 2;
  var paddleY = canvas.height - paddleHeight;
  var paddleDx = 7;

  var rightPressed;
  var leftPressed;

  var count = 0;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(event) {
    if (event.keyCode == 39) {
      rightPressed = true;
    } else if (event.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    if (event.keyCode == 39) {
      rightPressed = false;
    } else if (event.keyCode == 37) {
      leftPressed = false;
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(" + br + "," + bg + "," + bb + ")";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  function drawCount() {
    ctx.beginPath();
    ctx.font = "150px Arial";
    ctx.textAlign = "center";
    ctx.strokeText(count.toString(), canvas.width / 2, canvas.height / 2);
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Ball Collision
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    } else if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height) {
      alert("Game Over!", location.reload());
    }

    //Paddle Movement
    if (rightPressed && paddleX + paddleWidth < canvas.width) {
      paddleX += paddleDx;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleDx;
    }

    //Paddle Ball Collision
    if (
      x + dx > paddleX &&
      x + dx < paddleX + paddleWidth &&
      y + dy > paddleY - ballRadius
    ) {
      count++;

      dy = -dy;
      dy -= 0.5; //schneller machen
      if (dx > 0) {
        dx += 0.5;
      } else {
        dx -= 0.5;
      }

      //Farben
      if (br === 0 && bg === 255 && bb < 255) {
        bb += colorX;
      } else if (br === 0 && bg <= 255 && bg > 0 && bb === 255) {
        bg -= colorX;
      } else if (br < 255 && bg === 0 && bb === 255) {
        br += colorX;
      } else if (br === 255 && bg === 0 && bb <= 255 && bb > 0) {
        bb -= colorX;
      } else if (br === 255 && bg === 0 && bb === 0) {
        br = 0;
        bg = 0;
        bb = 0;
        dy -= 1.5; //schneller machen
        if (dx > 0) {
          dx += 1.5;
        } else {
          dx += 1.5;
        }
      }
      console.log("rgb(" + br + "," + bg + "," + bb + ")");
      console.log("dx: " + dx + ", dy: " + dy);
    }

    drawBall();
    drawPaddle();
    drawCount();

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
});
