/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

const restartBtn = document.createElement("button");
restartBtn.innerHTML = "Restart Game";

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

let totalScore = 0;
const bonus = 1;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (keysPressed["ArrowUp"]) {
    heroY -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    heroY += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    heroX -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    heroX += 5;
  }

  // Check if player touch the canvas wall. If he does, he'll appear at the opposite wall
  // Apply this rule to 4 sides of canvas, as if there are portals one the walls
  if (heroX >= canvas.width) {
    // player move the hero off the canvas to the right, the hero appears on the left.
    heroX = 0;
  }
  if (heroX < 0) {
    // player move the hero off the canvas to the left, the hero appears on the right.
    heroX = canvas.width;
  }
  if (heroY > canvas.height) {
    // player move the hero off the canvas to the bottom, the hero appears on the top.
    heroY = 0;
  }
  if (heroY < 0) {
    // player mvoe the hero off the canvas to the top, the hero appears on the bottom.
    heroY = canvas.height;
  }

  // Check if player and monster collided. Our images
  // are 32 pixels big.
  const heroCaughtMonster =
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32;
  if (heroCaughtMonster) {
    totalScore += bonus;

    document.getElementById("score").innerHTML = totalScore;
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    // MY FEATURE - The monster now is able to respawn at a random spot whenever it gets caught
    monsterX = 32 + Math.random() * (canvas.width - 32 - 32 + 1);
    monsterY = 32 + Math.random() * (canvas.height - 32 - 32 + 1);
  }
};

/**
 * This function, render, runs as often as possible.
 */
function render() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }

  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 10);
  ctx.fillText(`Score: ${totalScore}`, 400, 10);
  document.getElementById("timer").innerHTML = SECONDS_PER_ROUND - elapsedTime;
}

// MY FEATURE - Click restart button to restart the game by reloading the page
function restartGame() {
  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  if (elapsedTime > SECONDS_PER_ROUND) {
    alert("TIME UP");
    // MY FEATURE - Display the restart button
    document.body.appendChild(restartBtn);
    restartGame();
    return;
  }

  if (totalScore === 20) {
    alert("Congrats! You win the game.");
    document.body.appendChild(restartBtn);
    restartGame();
    return;
  }
  requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
