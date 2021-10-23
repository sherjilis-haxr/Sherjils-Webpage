const suffixes = [
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "D",
  "Ud",
  "Dd",
  "Td",
];

function squishNumber(n) {
  let suffix;
  for (let i = suffixes.length; i >= 0; i--) {
    if (n / pow(10, 3 * (i + 1)) >= 1) {
      suffix = suffixes[i];
      n /= pow(10, 3 * (i + 1));
      break;
    }
  }
  if (suffix) return `${n.toFixed(2)}${suffix}`;
  else return `${n}`;
}


// Credit: https://stackoverflow.com/a/2901298
function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const speedData = {
  "Basic Ball": {
    start: 100,
    growth: 2,
    level: 0,
  },
  // range
  "Plasma Ball": {
    start: 1000,
    growth: 1.5,
    level: 0,
  },
  "Sniper Ball": {
    start: 7500,
    growth: 1.75,
    level: 0,
  },
  // balls
  "Scatter Ball": {
    start: 75000,
    growth: 2.5,
    level: 0,
  },
  "Cannon Ball": {
    start: 100000,
    growth: 1.5,
    level: 0,
  },
  "Poison Ball": {
    start: 120000,
    growth: 1.5,
    level: 0,
  },
};

function speedCost(type) {
  const { start, growth, level } = speedData[type.name];
  return round(start * pow(growth, level));
}

const powerData = {
  "Basic Ball": {
    start: 250,
    growth: 1.65,
    level: 0,
  },
  "Plasma Ball": {
    start: 1250,
    growth: 1.5,
    level: 0,
  },
  "Sniper Ball": {
    start: 8000,
    growth: 1.35,
    level: 0,
  },
  "Scatter Ball": {
    start: 100000,
    growth: 1.3,
    level: 0,
  },
  "Cannon Ball": {
    start: 150000,
    growth: 1.25,
    level: 0,
  },
  "Poison Ball": {
    start: 50000,
    growth: 1.2,
    level: 0,
  },
};

function powerCost(type) {
  const { start, growth, level } = powerData[type.name];
  return round(start * pow(growth, level));
}

function clickCost() {
  return round(50 * pow(1.2, clickDamage - 1));
}

let BASIC_GRAPHIC,
    PLASMA_GRAPHIC,
    SNIPER_GRAPHIC,
    SCATTER_GRAPHIC,
    CANNON_GRAPHIC,
    POISON_GRAPHIC;

function setupBallGraphics() {
  BASIC_GRAPHIC = createGraphics(24, 24);
  BASIC_GRAPHIC.stroke(color(255, 211, 0));
  BASIC_GRAPHIC.strokeWeight(24);
  BASIC_GRAPHIC.point(12, 12);
  
  PLASMA_GRAPHIC = createGraphics(24, 24);
  PLASMA_GRAPHIC.stroke(color(255, 0, 255));
  PLASMA_GRAPHIC.strokeWeight(24);
  PLASMA_GRAPHIC.point(12, 12);
  
  SNIPER_GRAPHIC = createGraphics(24, 24);
  SNIPER_GRAPHIC.stroke(color(255, 255, 255));
  SNIPER_GRAPHIC.strokeWeight(24);
  SNIPER_GRAPHIC.point(12, 12);
  
  SCATTER_GRAPHIC = createGraphics(24, 24);
  SCATTER_GRAPHIC.stroke(color(255, 140, 0));
  SCATTER_GRAPHIC.strokeWeight(24);
  SCATTER_GRAPHIC.point(12, 12);
  
  CANNON_GRAPHIC = createGraphics(32, 32);
  CANNON_GRAPHIC.stroke(color(130));
  CANNON_GRAPHIC.strokeWeight(32);
  CANNON_GRAPHIC.point(16, 16);
  
  POISON_GRAPHIC = createGraphics(24, 24);
  POISON_GRAPHIC.stroke(color(230, 10, 10));
  POISON_GRAPHIC.strokeWeight(24);
  POISON_GRAPHIC.point(12, 12);
  
  MINI_GRAPHIC = createGraphics(16, 16);
  MINI_GRAPHIC.stroke(color(200, 80, 0));
  MINI_GRAPHIC.strokeWeight(16);
  MINI_GRAPHIC.point(8, 8);
}

class Button {
  constructor(x, y, w, h, contentRender, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.contentRender = contentRender;
    this.onClick = onClick;
  }
  
  isHovered() {
    return mouseX >= this.x && mouseX <= this.x + this.w &&
      mouseY >= this.y && mouseY <= this.y + this.h;
  }
  
  renderBackground() {
    push();
    strokeWeight(1.5);
    stroke(0);
    fill(110);

    rect(this.x, this.y, this.w, this.h, 3);
    pop();
  }
  
  clicked() {
    if (!this.onClick) return;
    this.onClick();
  }
  
  render() {
    this.renderBackground();
    
    push();
    this.contentRender();
		pop();
    
    push();
    if (this.isHovered()) {
      cursor("pointer");
      
      if (clicked) {
        clicked = false;
        this.clicked();
      } else {
        // Hover highlight
        fill(110, 110, 110, 70);
        rect(this.x, this.y, this.w, this.h, 3);
      }
      if (this.onHover) this.onHover();
    }
    pop();
  }
}
