class BuyBallButton extends Button {
  constructor(x, y, w, h, contentRender, onClick) {
    super(x, y, w, h, contentRender, onClick);
    this.y2 = this.y + this.h * 0.8;
  }

  static create(x, y, w, h, type) {
    const b = new BuyBallButton(
      x, y, w, h,
      function() {
        image(this.type.graphic, this.x + this.w / 2, this.y + this.h * 0.4);
        /*stroke(type.color);
        strokeWeight(type.size);
        point(this.x + this.w / 2, this.y + this.h * 0.4);*/
      },
      function() {
        if (this.type.price <= money) {
          money -= round(this.type.price);
          const rad = random(-PI, PI);
          ballHandler.addBall(this.type, [
            world.w / 2, world.h / 2,
            cos(rad), sin(rad)
          ]);
          this.type.price = round(
            this.type.startPrice * pow(this.type.growth, this.type.length)
					);
          return true;
        }
      }
    );
    b.type = type;
    return b;
  }

  clicked() {
    if (ballHandler.canAddBall()) {
      if (this.onClick()) {
        fill(70, 70, 70, 70);
        rect(this.x, this.y, this.w, this.h, 3);
      }
    }
  }

  onHover() {
    const x = this.x;
    const y = this.y - STAT_HEIGHT;

    push();

    strokeWeight(1.5);
    stroke(0);
    fill(110);
    rect(x, y, this.w, STAT_HEIGHT, 3);

    textAlign(LEFT, TOP);
    fill(255);
    strokeWeight(1);

    text(`${this.type.name}
${this.type.description}`, x + 4, y + 4);
    
    let txt = `Speed: ${this.type.speed + (speedData[this.type.name].level * (this.type.speedIncrease || 0))}
Power: ${this.type.power + (powerData[this.type.name].level * this.type.powerIncrease)}

You have: ${this.type.length}
Dealt: ${squishNumber(this.type.damageDealt)}`;
    
    text(txt, x + 4, y + 73);
    pop();
  }

  renderBackground() {
    //console.log(this.type);
    push();

    strokeWeight(1.5);
    stroke(0);
    fill(110);
    rect(this.x, this.y, this.w, this.h, 3);

    if (money >= this.type.price) {
      stroke(30, 200, 12);
      fill(30, 170, 12);
    } else {
	    stroke(210, 120, 120);
	    fill(210, 120, 120);
    }
    line(this.x + 1.5, this.y2, this.x + this.w - 1.5, this.y2);

    textAlign(CENTER, CENTER);
    textSize(16);
    strokeWeight(0.8);
    
    text(squishNumber(this.type.price), this.x + this.w / 2, this.y2 + this.h * 0.11);
    pop();
  }
}
