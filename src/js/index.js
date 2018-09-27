const game = {
  width: 800,
  height: 600,
  ctx: undefined,
  blocks: [],
  rows: 4,
  cols: 10,
  sprites: {
    background: undefined,
    platform: undefined,
    ball: undefined,
    blocks: undefined
  },
  init: function() {
    const canvas = document.getElementById("arkanoid");
    this.ctx = canvas.getContext("2d");

    window.addEventListener("keydown", e => {
      if (e.keyCode == 37) {
        game.platform.dx = -game.platform.velocity;
      }
      if (e.keyCode == 39) {
        game.platform.dx = game.platform.velocity;
      }
    });
    window.addEventListener("keyup", e => {
      if (e.keyCode == 37 || e.keyCode == 39) {
        game.platform.stop();
      }
    });
  },
  load: function() {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `./src/sprites/${key}.png`;
    }
  },
  create: function() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 68 * col + 63,
          y: 38 * row + 50,
          width: 64,
          height: 32
        });
      }
    }
  },
  start: function() {
    this.init();
    this.load();
    this.create();
    this.run();

    console.log("game start");
  },
  render: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);

    this.blocks.forEach(function(item) {
      this.ctx.drawImage(this.sprites.blocks, item.x, item.y);
    }, this);
  },
  update: function() {
    if (this.platform.dx) {
      this.platform.move();
    }
  },
  run: function() {
    this.update();
    this.render();

    window.requestAnimationFrame(() => {
      game.run();
    });
  }
};

game.ball = {
  width: 22,
  height: 22,
  frame: 0,
  x: 390,
  y: 480
};

game.platform = {
  x: 350,
  y: 500,
  velocity: 7,
  dx: 0,
  ball: game.ball,
  move: function() {
    this.x += this.dx;

    if (this.ball) {
      this.ball.x += this.dx;
    }
  },
  stop: function() {
    this.dx = 0;

    if (this.ball) {
      this.ball.dx = 0;
    }
  }
};

window.addEventListener("load", () => {
  game.start();
});
