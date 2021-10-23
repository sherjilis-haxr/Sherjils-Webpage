let LT_ANG;
let RT_ANG;
let RB_ANG;
let LB_ANG;

class BallHandler {
  constructor() {
    LT_ANG = atan2(-16, -32);
    RT_ANG = atan2(-16, 32);
    RB_ANG = atan2(16, 32);
    LB_ANG = atan2(16, -32);
    console.log(LT_ANG, RT_ANG, RB_ANG, LB_ANG);
    this.balls = 0;
    //this.displaying = 1;

    // 24x24
    this.basic = [];
    this.basic.name = "Basic Ball";
    this.basic.description = "Standard ball.\nBounces and stuff.";
    this.basic.startPrice = BASIC_START_PRICE;
    this.basic.price = BASIC_START_PRICE;
    this.basic.growth = BASIC_GROWTH;
    this.basic.damageDealt = 0;
    this.basic.speedIncrease = 1;
    this.basic.speedLimit = 10;
    this.basic.powerIncrease = 1;
    this.basic.size = 24;
    this.basic.speed = 1;
    this.basic.power = 1;
    this.basic.graphic = BASIC_GRAPHIC;

    this.plasma = [];
    this.plasma.name = "Plasma Ball";
    this.plasma.description = "25% splash dama\nge";
    this.plasma.startPrice = PLASMA_START_PRICE;
    this.plasma.price = PLASMA_START_PRICE;
    this.plasma.growth = PLASMA_GROWTH;
    this.plasma.damageDealt = 0;
    //this.plasma.speedIncrease = 1;
    //this.plasma.speedLimit = 10;
    this.plasma.powerIncrease = 3;
    this.plasma.range = 1;
    this.plasma.size = 24;
    this.plasma.speed = 2;
    this.plasma.power = 3;
    this.plasma.graphic = PLASMA_GRAPHIC;

    this.sniper = [];
    this.sniper.name = "Sniper Ball";
    this.sniper.description = "Seeker boy";
    this.sniper.startPrice = SNIPER_START_PRICE;
    this.sniper.price = SNIPER_START_PRICE;
    this.sniper.growth = SNIPER_GROWTH;
    this.sniper.damageDealt = 0;
    this.sniper.speedIncrease = 1;
    this.sniper.speedLimit = 10;
    this.sniper.powerIncrease = 5;
    this.sniper.size = 24;
    this.sniper.speed = 4; //30 (too fast);//4;
    this.sniper.power = 5;
    this.sniper.graphic = SNIPER_GRAPHIC;

    this.scatter = [];
    this.scatter.name = "Scatter Ball";
    this.scatter.description = "Creates single hit\nballs with half dam-\nage";
    this.scatter.startPrice = SCATTER_START_PRICE;
    this.scatter.price = SCATTER_START_PRICE;
    this.scatter.growth = SCATTER_GROWTH;
    this.scatter.damageDealt = 0;
    //this.scatter.speedIncrease = 1;
    //this.scatter.speedLimit = 10;
    this.scatter.powerIncrease = 10;
    this.scatter.balls = 2;
    this.scatter.size = 24;
    this.scatter.speed = 3;
    this.scatter.power = 10;
    this.scatter.graphic = SCATTER_GRAPHIC;

    this.mini = [];
    this.mini.name = "Mini Ball";
    this.mini.size = 16;
    this.mini.graphic = MINI_GRAPHIC;

    // 32x32
    this.cannon = [];
    this.cannon.name = "Cannon Ball";
    this.cannon.description = "Doesn't stop for\nweaklings.";
    this.cannon.startPrice = CANNON_START_PRICE;
    this.cannon.price = CANNON_START_PRICE;
    this.cannon.growth = CANNON_GROWTH;
    this.cannon.damageDealt = 0;
    this.cannon.speedIncrease = 2;
    this.cannon.speedLimit = 16;
    this.cannon.powerIncrease = 25;
    this.cannon.size = 32;
    this.cannon.speed = 4;
    this.cannon.power = 50;
    this.cannon.graphic = CANNON_GRAPHIC;

    // 24x24
    this.poison = [];
    this.poison.name = "Poison Ball";
    this.poison.description = "Hit bricks take\ndouble damage";
    this.poison.startPrice = POISON_START_PRICE;
    this.poison.price = POISON_START_PRICE;
    this.poison.growth = POISON_GROWTH;
    this.poison.damageDealt = 0;
    this.poison.speedIncrease = 2;
    this.poison.speedLimit = 15;
    this.poison.powerIncrease = 5;
    this.poison.size = 24;
    this.poison.speed = 5;
    this.poison.power = 5;
    this.poison.graphic = POISON_GRAPHIC;

    this.all = [
      this.basic,
      this.plasma,
      this.sniper,
      this.scatter,
      this.cannon,
      this.poison,
      this.mini,
    ];

    /*this.lastFrame = {
      i: 0,
      j: 0,
    };*/

    //this.br = 32 * 32;
  }

  canAddBall() {
    return this.balls < maxBalls;
  }

  addBall(arr, ball) {
    this.balls++;
    arr.push(ball);
  }

  pushOut(ball, bl, distSq) {
    let cx, cy;
    do {
      //console.log("Pushing out");
      ball[0] -= ball[2] * 0.2;
      ball[1] -= ball[3] * 0.2;
      cx = max(min(ball[0], bl.x + 64), bl.x);
      cy = max(min(ball[1], bl.y + 32), bl.y);
      distSq = (ball[0] - cx) * (ball[0] - cx) +
        (ball[1] - cy) * (ball[1] - cy);
    } while (distSq === 0);
  }

  distSq(ball, block, y) {
    let dx = ball[0] - (block.x !== undefined ? block.x : block);
    dx *= dx;
    let dy = ball[1] - (block.y !== undefined ? block.y : y);
    dy *= dy;

    return dx + dy;
  }

  containsPoint(block, p) {
    return p.x >= block.x && p.x <= block.x + 64 && p.y >= block.y && p.y <= block.y + 32;
  }

  intersects(b, r, x, y) {
    const dx = abs(x - b.x - 32);
    const dy = abs(y - b.y - 16);

    if (dx > 32 + r) return false;
    if (dy > 16 + r) return false;

    if (dx <= 32) return true;
    if (dy <= 16) return true;

    const cdsq = (dx - 32) * (dx - 32) +
      (dy - 16) * (dy - 16);

    return cdsq <= r * r;
  }

  update() {
    for (const ballType of this.all) {
      const r = ballType.size / 2;
      const rSq = r * r;

      let speed, dmg;
      if (ballType === this.mini) {
        speed = this.scatter.speed;
        speed /= round(2);

        dmg = this.scatter.power +
          powerData[this.scatter.name].level * this.scatter.powerIncrease;
        dmg *= round(0.5);
      } else {
        speed = ballType.speed +
          (ballType.speedIncrease || 0) * speedData[ballType.name].level * 0.9;
        dmg = ballType.power +
          powerData[ballType.name].level * ballType.powerIncrease;
      }

      for (const ball of ballType) {
        if (!ball) continue;
        let [x, y, vx, vy] = ball;
        ball[0] += ball[2] * speed;
        ball[1] += ball[3] * speed;

        const leftWall = x < r && vx < 0;
        const rightWall = x > world.w - r && vx > 0;
        const topWall = y < r && vy < 0;
        const botWall = y > world.h - r && vy > 0;

        if (leftWall || rightWall || topWall || botWall) {
          ball[0] = leftWall ? r : rightWall ? world.w - r : ball[0];
          ball[1] = topWall ? r : botWall ? world.h - r : ball[1];

          if (ballType === this.sniper) {
            let closest = 100000000;
            let cx, cy;
            for (const b of world.blocks) {
              if (!b) continue;
              const dsq = this.distSq(ball, b.x + 32, b.y + 16);
              if (dsq < closest) {
                closest = dsq;
                cx = b.x + 32;
                cy = b.y + 16;
              }
            }

            const angRad = atan2(cy - ball[1], cx - ball[0]);
            ball[2] = cos(angRad);
            ball[3] = sin(angRad);
          } else {
            ball[2] = leftWall || rightWall ? -ball[2] : ball[2];
            ball[3] = topWall || botWall ? -ball[3] : ball[3];

            if (ballType === this.scatter) {
              // TODO: Scatter logic
              for (let i = 0; i < this.scatter.balls + speedData[this.scatter.name].level; i++) {
                const idx = this.mini.length;
                this.mini[idx] = [ball[0], ball[1], ball[2], ball[3], idx];
								const r = random(HALF_PI);
                let rad;
                let mx = 1, my = 1;
                if (leftWall) rad = -QUARTER_PI + r;
                else if (topWall) rad = QUARTER_PI + r;
                else if (botWall) rad = -QUARTER_PI * 3 + r;
                else if (rightWall) rad = QUARTER_PI * 3 + r;
                
                // TODO: Fix
                this.mini[idx][2] = cos(rad);
                this.mini[idx][3] = sin(rad);
              }
            }
          }
        } else {
          for (const b of world.blocks) {
            if (!b) continue;

            const sqd = this.distSq(ball, b.x + 32, b.y + 16);
            if (sqd > (r + 64) * (r + 64)) continue;

            [x, y, vx, vy] = ball;

            // Check
            if (this.intersects(b, r, x, y)) {
              const cx = b.x + 32;
              const cy = b.y + 16;

              const a = atan2(y - cy, x - cx);

              if (a > LT_ANG && a < RT_ANG && vy > 0) {
                vy = -vy;
              } else if (a >= RT_ANG && a <= RB_ANG && vx < 0) {
                vx = -vx;
              } else if (a > RB_ANG && a < LB_ANG && vy < 0) {
                vy = -vy;
              } else if (a >= LB_ANG || a <= LT_ANG && vx > 0) {
                vx = -vx;
              }

              if (ballType === this.poison) {
                b.debuff = true;
              }
            }


            if (ball[2] !== vx || ball[3] !== vy) {
              if (ballType === this.mini) {
                this.mini[ball[4]] = null;
              }
              // Collision
              //const dmg = ballType.power + powerData[ballType.name].level * ballType.powerIncrease;
              const dd = world.damage(b, dmg, ballType);

              if (ballType === this.plasma) {
                const range = 48 + 20 * (ballType.range + speedData[ballType.name].level);
                const rangeSq = range * range;
                for (let i = 0; i < world.blocks.length; i++) {
                  const bb = world.blocks[i];
                  if (!bb) continue;
                  // If commented out, applies splash damage to hit block too
                  // if (bb === b) continue;

                  const bx = max(min(ball[0], bb.x + 64), bb.x);
                  const by = max(min(ball[1], bb.y + 32), bb.y);
                  if (this.distSq(ball, bx, by) <= rangeSq) {
                    const splashDmg = ceil(dmg * 0.25);
                    const spdd = bb.health > splashDmg ? splashDmg : bb.health;
                    ballType.damageDealt += spdd;
                    world.damage(bb, splashDmg);
                  }
                }
              }

              if (ballType !== this.cannon || b.health > 0) {
                ball[2] = vx;
                ball[3] = vy;

                break;
              }
            }
          }
        }
      }
    }

  }

  render(time) {
    for (let i = 0; i < this.all.length; i++) {
      const type = this.all[i];
      for (let j = 0; j < type.length; j++) {
        //if (type === this.mini) console.log(type);
        if (!type[j]) continue;
        image(type.graphic, type[j][0], type[j][1]);
      }
    }
  }
}
