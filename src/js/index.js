const game = {
  width: 800,
  height: 600,
  ctx: undefined,
  sprites: {
    background: undefined,
    platform: undefined
  },
  start: function() {
    const canvas = document.getElementById("arkanoid");
    this.ctx = canvas.getContext("2d");

    this.sprites.background = new Image();
    this.sprites.background.src = "src/sprites/background.png";

    this.sprites.platform = new Image();
    this.sprites.platform.src = "src/sprites/paddleBlu.png";
    this.run();

    console.log("game start");
  },
  render: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
  },
  run: function() {
    this.render();
    window.requestAnimationFrame(() => {
      game.run();
    });
  }
};

game.platform = {
  x: 350,
  y: 500
};

window.addEventListener("load", () => {
  game.start();
});
