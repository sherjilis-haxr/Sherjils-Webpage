/*

**TODO**
Black bricks
Prestige Upgrades (gold?)
	- Damage mul
  - Speed mul
  - Lasers
  - Max balls
Saving/loading
Plasma ball mechanics
Scatter ball mechanics (separate ball type? Probably)
Click damage
Limit max level of speed (& plasma/scatter balls) upgrade
Power ups

** Half-done/Testing **
Improve collision (Might work as I want it to now)

** Done **
Sell buttons
Description/stats
Level display
Upgrades

*/

function mousePressed() {
  //money += 1000;
  const x = mouseX;
  const y = mouseY;

  //console.log(x, y);

  for (let i = 0; i < world.blocks.length; i++) {
    const b = world.blocks[i];
    if (!b) continue;
    //console.log(b);
    if (x >= b.x && x <= b.x + 64 && y >= b.y && y <= b.y + 32) {
      world.damage(b, clickDamage);
    }
  }

  clicked = true;
}
// Hmmmmmmmmm.......
function changeCursorIfOnBlock() {
  const x = mouseX;
  const y = mouseY;

  if (x >= 0 && x <= width && y >= 0 && y <= world.h) {

    for (let i = 0; i < world.blocks.length; i++) {
      const b = world.blocks[i];
      if (!b) continue;
      //console.log(b);
      if (x >= b.x && x <= b.x + 64 && y >= b.y && y <= b.y + 32) {
        cursor("pointer");
      }
    }
  }
}

function mouseReleased() {
  clicked = false;
}

function setup() {
  imageMode(CENTER);
  setupBallGraphics();

  createCanvas(960, 800);
  ballHandler = new BallHandler();

  world = new World(1, width, 640);
  menu = new Menu(0, world.h, width, height - world.h);
}

function draw() {
  cursor(ARROW);
  
  background(65);
  
  ballHandler.update();
  
  ballHandler.render();
  world.render();
  menu.render();

  noStroke();
  fill(255);
  textAlign(RIGHT, BOTTOM);
  text(`FPS: ${frameRate().toFixed(0)}  `, width, height);
  text(`Max balls: ${ballHandler.balls}/${maxBalls}  `,
    width, height - 32);
  text(`Level: ${world.level}  `, width, height - 48);

  fill(255, 223, 0);
  text(`Money: $${squishNumber(money)}  `, width, height - 16);

  changeCursorIfOnBlock();
}
