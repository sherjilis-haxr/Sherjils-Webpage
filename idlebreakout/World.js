class World {
  constructor(level, w, h) {
    this.colors = [
      color(180, 32, 32),
      color(32, 180, 32),
      color(32, 32, 180),
      color(180, 120, 50),
      color(50, 180, 120),
    ];
    this.w = w;
    this.h = h;
    this.generate(level);
  }

  damage(b, d, type) {
    if (b.debuff) d *= 2;
    const dd = b.health > d ? d : b.health;
    if (type === this.mini) {
      ballHandler.scatter.damageDealt += dd;
    } else if (type) {
      type.damageDealt += dd;
    } else {
      clickDamageDealt += dd;
    }
    money += dd;
    b.health -= d;
    if (b.health <= 0) {
      this.blocks[b.id] = null;
      if (--this.blocksLeft === 0) {
        this.generate(++this.level);
      }
    }
    
    return dd;
  }

  generate(level) {
    this.blocks = [];
    this.level = level;
    let id = 0;
    for (let x = 0; x < this.w; x += 64) {
      for (let y = 0; y < this.h; y += 32) {
        if (this.level % 5 === 1) {
          if (x >= 64 * 5 && x <= 64 * 9) {
            this.blocks.push({
              id: id++,
              x,
              y,
              health: level,
              black: false,
            });
          }
        } else if (this.level % 5 === 2) {
          if (((x >= 64 && x <= 64 * 5) ||
              (x >= 64 * 9 && x <= 64 * 13)) &&
            (y >= 32 * 5 && y <= 32 * 14)
          ) {
            this.blocks.push({
              id: id++,
              x,
              y,
              health: level,
              black: false,
            });
          }
        } else if (this.level % 5 === 3) {
          if (x <= 64 || x >= 64 * 13 || x === 64 * 7) {
            this.blocks.push({
              id: id++,
              x,
              y,
              health: level,
              black: false,
            });
          }
        } else if (this.level % 5 === 4) {
          if (((x > 64 && x < 64 * 7) ||
              (x > 64 * 7 && x < 64 * 13)) &&
            (y !== 32 * 9 && y !== 32 * 10 && y >= 32 * 4 && y <= 32 * 15)) {

            this.blocks.push({
              id: id++,
              x,
              y,
              health: level,
              black: false,
            });
          }
        } else if ((x !== 64 * 7 && x >= 64 * 2 && x <= 64 * 12) &&
          (((floor(y / 32) + 1) % 4) > 1)) {

          this.blocks.push({
            id: id++,
            x,
            y,
            health: level,
            black: false,
          });
        }
      }
    }
    this.blocksLeft = id;
    //console.log("Blocks on level: " + this.blocksLeft);
  }

  render() {
    const c = this.colors[this.level % this.colors.length];
    for (let i = 0; i < this.blocks.length; i++) {
      const b = this.blocks[i];
      if (!b) continue;
      if (b.black) {
        fill(0);
        stroke(255);
      } else {
        fill(c);
        stroke(30);
      }

      rect(b.x, b.y, 64, 32, 5);

      stroke(0);
      if (b.debuff) {
        fill(255, 0, 0);
        rect(b.x + 4, b.y + 4, 5, 5, 2);
        rect(b.x + 12, b.y + 4, 5, 5, 2);
      }

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(squishNumber(b.health), b.x + 32, b.y + 16);
    }
  }
}
