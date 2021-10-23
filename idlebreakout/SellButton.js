class SellButton extends Button {
  constructor(x, y, w, h, type) {
    super(x, y, w, h, function() {
      if (this.type.length === 0) return;

      textAlign(CENTER, CENTER);
      const cx = x + w / 2;
      const cy = y + h / 2;
      strokeWeight(3);
      stroke(20, 110, 0);
      fill(80, 170, 40);
      text(`Sell: $${
            squishNumber(
              round(
                round(
                  this.type.startPrice * pow(this.type.growth, this.type.length - 1)
                ) * 0.1
              )
            )
					}`,
      	cx, cy
      );
    }, function() {
      if (this.type.length === 0) return;

      this.type.pop();
      ballHandler.balls -= 1;
      const newPrice = round(this.type.startPrice * pow(this.type.growth, this.type.length));
      money += round(newPrice * 0.1);
      this.type.price = newPrice;
    });

    this.type = type;
  }

  render() {
    if (this.type.length === 0) return;
    super.render();
  }
}
