class UpgradeMenu {
  constructor() {
    this.active = false;

    this.w = UPGRADE_BTN_WIDTH + UPGRADE_BTN_RIGHT_PAD + 60;
    this.h = world.h;
    this.x = width - this.w;
    this.y = 0;
    this.buttons = [];

    const onHover = function(costFunc, type) {
      textSize(22);
      const cost = costFunc(type);
      const txt = `$${squishNumber(cost)}`;
      const w = textWidth(txt);
      const x = mouseX;
      const y = mouseY - this.h;
      textAlign(LEFT, CENTER);
      fill(170);
      stroke(0);
      strokeWeight(2);
      rect(x, y - 3, w + 7, this.h + 4);

      //stroke();
      if (money >= cost)
        fill(30, 170, 12);
      else
        fill(210, 120, 120);

      text(txt, x + 4, y + this.h / 2);
    };

    this.buttons.push(new Button(
      this.x + 10, world.h - 32, this.w - 84, 22,
			function () {
          // render
          textAlign(CENTER, CENTER);
          fill(210);
          stroke(80);
          strokeWeight(3);
          text(
            `Click Damage`,
            this.x + this.w / 2,
            this.y + this.h / 2
          );
          textAlign(LEFT, CENTER);

          const from = clickDamage;
        	const to = clickDamage + 1;

          text(`${from} -> ${to}`,
            this.x + this.w + 6,
            this.y + this.h / 2
          );
      }, function () {
        // on click
        if (money >= clickCost()) {
          money -= clickCost();
          clickDamage += 1;
        }
      }
    ));
    
    this.buttons[0].onHover = onHover.bind(this.buttons[0], clickCost);

    for (let i = 0; i < ballHandler.all.length - 1; i++) {
      const type = ballHandler.all[i];

      const x = this.x + 40;
      const y = this.y + 10 + (i * 62);

      const w = 85;
      const h = 22;

      let t1, t2;
      if (type === ballHandler.plasma) {
        t1 = "Range";
        t2 = "Power";
      } else if (type === ballHandler.scatter) {
        t1 = "Balls";
        t2 = "Power";
      } else {
        t1 = "Speed";
        t2 = "Power";
      }

      const speedBtn = new Button(x, y, w, h,
        function() {
          // render
          textAlign(CENTER, CENTER);
          fill(210);
          stroke(80);
          strokeWeight(3);
          text(
            `${t1}`,
            this.x + this.w / 2,
            this.y + this.h / 2
          );
          textAlign(LEFT, CENTER);

          let from, to;

          if (type === ballHandler.plasma) {
            from = type.range + speedData[type.name].level;
            to = from + 1;
          } else if (type === ballHandler.scatter) {
            from = type.balls + speedData[type.name].level;
            to = from + 1;
          } else {
            from = type.speed + speedData[type.name].level * type.speedIncrease;
            to = from + type.speedIncrease;
          }

          text(`${from} -> ${to}`,
            this.x + this.w + 6,
            this.y + this.h / 2
          );

          image(type.graphic, this.x - 20, this.y + 24);
        },
        function() {
          //onclick

          if (money >= speedCost(type)) {
            money -= speedCost(type);
            // upgrade
            speedData[type.name].level += 1;
          }
        }
      );

      speedBtn.onHover = onHover.bind(speedBtn, speedCost, type);

      this.buttons.push(
        speedBtn
      );

      const powerBtn = new Button(x, y + h + 8, w, h,
        function() {
          textAlign(CENTER, CENTER);
          fill(210);
          stroke(80);
          strokeWeight(3);
          text(
            `${t2}`,
            this.x + this.w / 2,
            this.y + this.h / 2
          );
          textAlign(LEFT, CENTER);

          let from = type.power + powerData[type.name].level * type.powerIncrease;
          let to = from + type.powerIncrease;

          text(`${from} -> ${to}`,
            this.x + this.w + 6,
            this.y + this.h / 2
          );
        },
        function() {
          //onclick

          if (money >= powerCost(type)) {
            money -= powerCost(type);
            // upgrade
            powerData[type.name].level += 1;
          }
        }
      );

      powerBtn.onHover = onHover.bind(powerBtn, powerCost, type);
      this.buttons.push(powerBtn);
    }
  }

  render() {
    push();

    strokeWeight(1.5);
    stroke(0, 140);
    fill(80, 140);

    rect(this.x, this.y, this.w, this.h, 3);

    for (const btn of this.buttons) {
      btn.render();
    }
    // TODO

    pop();
  }
}

class Menu {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.upgradeMenu = new UpgradeMenu();

    this.upgradeButtons = [];
    this.upgradeButtons.push(
      new Button(
        width - UPGRADE_BTN_WIDTH - UPGRADE_BTN_RIGHT_PAD,
        world.h + UPGRADE_BTN_TOP_PAD,
        UPGRADE_BTN_WIDTH,
        UPGRADE_BTN_HEIGHT,
        function() {
          // render
          textAlign(CENTER, CENTER);
          fill(210);
          stroke(80);
          strokeWeight(3);
          text(
            "Upgrades",
            this.x + this.w / 2,
            this.y + this.h / 2
          );
        },
        () => {
          // onClick
          // TODO: Toggle upgrades menu
          this.upgradeMenu.active = !this.upgradeMenu.active;
        }
      )
    );

    this.shopButtons = [];
    this.sellButtons = [];
    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.basic
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.basic));

    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 1,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.plasma
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 1,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.plasma));

    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 2,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.sniper
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 2,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.sniper));

    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 3,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.scatter
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 3,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.scatter));

    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 4,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.cannon
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 4,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.cannon));

    this.shopButtons.push(BuyBallButton.create(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 5,
      this.y + SHOP_BTN_OFF_Y,
      SHOP_BTN_WIDTH,
      SHOP_BTN_HEIGHT,
      ballHandler.poison
    ));
    this.sellButtons.push(new SellButton(
      this.x + SHOP_BTN_OFF_X + (SHOP_BTN_WIDTH + 10) * 5,
      this.y + SHOP_BTN_OFF_Y + SHOP_BTN_HEIGHT + 8,
      SHOP_BTN_WIDTH,
      28, ballHandler.poison));
  }

  render() {
    push();
    fill(99);
    rect(this.x, this.y, this.w, this.h);

    for (const btn of this.upgradeButtons) {
      btn.render();
    }

    for (const btn of this.shopButtons) {
      btn.render();
    }
    for (const btn of this.sellButtons) {
      btn.render();
    }

    if (this.upgradeMenu.active) {
      this.upgradeMenu.render();
    }

    pop();
  }
}
