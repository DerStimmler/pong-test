"use strict";

import stylesheet from "./index.css";

window.addEventListener("load", () => {
  var canvas = document.getElementById("game_canvas");
  var ctx = canvas.getContext("2d");

  var x = canvas.width / 2;
  var y = canvas.height - canvas.height / 4;
  var ballRadius = 10;
  var dx = 10;
  var dy = -10;
  var br = 0;
  var bg = 255;
  var bb = 0;
  var colorX = 85; //wie viel sich der RGB Wert ändert

  var paddleHeight = 10;
  var paddleWidth = 80;
  var paddleX = canvas.width / 2 - paddleWidth / 2;
  var paddleY = canvas.height - paddleHeight - 30;
  var paddleDx = 7;
  var paddleColor = "red";

  var rightPressed;
  var leftPressed;

  var mouseX;
  var mouseMode = false;

  var count = 0;
  var bgameOver = false;

  var scores = [];
  var highscore = -1;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvas.addEventListener(
    "mousemove",
    event => {
      mouseX = getMousePos(canvas, event);
      console.log(mouseX);
    },
    false
  );
  canvas.addEventListener("click", () => {
    if (mouseMode === false) {
      mouseMode = true;
      canvas.classList.add("mouseMode");
    } else {
      mouseMode = false;
      canvas.classList.remove("mouseMode");
    }
  });
  /*
  let inputPaddleWith = document.getElementById("paddle_width");
  inputPaddleWith.addEventListener('change', () => {
    paddleWidth = inputPaddleWith.value;
  });
  let inputPaddleSpeed = document.getElementById("paddle_speed");
  inputPaddleSpeed.addEventListener('change', () => {
    paddleDx = inputPaddleSpeed.value;
  });
  */

  function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return event.clientX - rect.left;
  }
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

  function gameOver() {
    bgameOver = true;
    scores.push(count);
    if(count > highscore){
      highscore = count;
    }
    drawScore();
    count = "Game Over";
    drawCount();
    x = canvas.width / 2;
    y = canvas.height - canvas.height / 4;
    dx = 0;
    dy = 0;
    br = 0;
    bg = 255;
    bb = 0;

    paddleX = canvas.width / 2 - paddleWidth / 2;
    paddleY = canvas.height - paddleHeight - 30;
    setTimeout(() => {
      count = 0;
      dx = 10;
      dy = -10;
      bgameOver = false;
    }, 30);
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
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
  }

  function drawCount() {
    ctx.beginPath();
    if (bgameOver === true) {
      ctx.font = "100px Arial";
    } else {
      ctx.font = "150px Arial";
    }
    ctx.textAlign = "center";
    ctx.strokeText(count.toString(), canvas.width / 2, canvas.height / 2);
    ctx.closePath();
  }

  function drawScore() {
    console.log("-----------------");
    let tries = scores.length;
    let score_board_table = document.getElementById("score_board_table");
    score_board_table.innerHTML = "";
    for(let i = 0; i < Math.ceil(scores.length/10); i++){
    let score_board_col = document.createElement("td");
    score_board_col.setAttribute("id",i)
    if(i>0){
      score_board_col.classList.add("border_left");
    }
    score_board_table.appendChild(score_board_col);
    }
    scores.reverse();
    for(let i = 0; i < scores.length; i++){
      let score_item = document.createElement("tr");
      let score_item_try = document.createElement("td")
      score_item_try.classList.add("tries");
      score_item_try.innerHTML = tries + ": ";
      score_item.appendChild(score_item_try);
      let score_item_score = document.createElement("td");
      score_item_score.classList.add("score");
      score_item_score.innerHTML = scores[i];
      if(scores[i] == highscore){
        score_item.classList.add("highscore");
      }
      score_item.appendChild(score_item_score);
      console.log("Spalten ID: " + parseInt(i / 10, 10) * 10 /10);
      document.getElementById(parseInt(i / 10, 10) * 10/10).appendChild(score_item);
      tries --;
    }
    scores.reverse();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Ball Collision
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    } else if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height) {
      y = -20; //Ball verschwinden lassen
      x = -20; //Ball verschwinden lassen
      gameOver();
    }

    //Paddle Movement

    //Tasten
    if (rightPressed && paddleX + paddleWidth < canvas.width) {
      paddleX += paddleDx;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleDx;
    }
    //Maus
    if (mouseMode === true) {
      if (mouseX < paddleWidth / 2 || mouseX > canvas.width - paddleWidth / 2) {
        //Paddle stoppen
      } else {
        paddleX = mouseX - paddleWidth / 2;
      }
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
    drawCount(150);

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
});
