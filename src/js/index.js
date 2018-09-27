const game = {
  width: 800,
  height: 600,
  ctx: undefined,
  blocks: [],
  rows: 4,
  cols: 10,
  score: 0,
  running: true,
  sprites: {
    background: undefined,
    platform: undefined,
    ball: undefined,
    blocks: undefined
  },
  sound: {
    blocksound: document.getElementById("block-sound"),
    menuMusic: document.getElementById("menu-music"),
    loseMusic: document.getElementById("lose")
  },
  init: function() {
    const canvas = document.getElementById("arkanoid");
    this.ctx = canvas.getContext("2d");
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#aff";

    window.addEventListener("keydown", e => {
      if (e.keyCode == 37) {
        game.platform.dx = -game.platform.velocity;
      }
      if (e.keyCode == 39) {
        game.platform.dx = game.platform.velocity;
      }
      if (e.keyCode == 32) {
        game.platform.releaseBall();
        this.sound.menuMusic.volume = 0.2;
        this.sound.menuMusic.play();
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
          height: 32,
          isAlive: true
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
      if (item.isAlive) {
        this.ctx.drawImage(this.sprites.blocks, item.x, item.y);
      }
    }, this);

    this.ctx.fillText("SCORE: " + this.score, 15, this.height - 15);
  },
  update: function() {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
    }

    if (this.platform.dx) {
      this.platform.move();
    }

    if (this.ball.dx || this.ball.dy) {
      this.ball.move();
    }

    this.blocks.forEach(function(item) {
      if (item.isAlive) {
        if (this.ball.collide(item)) {
          this.ball.bumpBlock(item);
        }
      }
    }, this);

    this.ball.checkingBounds();
  },
  run: function() {
    this.update();
    this.render();
    if (this.running) {
      window.requestAnimationFrame(() => {
        game.run();
      });
    }
  },
  over: function(message) {
    this.running = false;
    this.sound.menuMusic.pause();
    this.sound.loseMusic.play();

    console.log(message);
  }
};

game.ball = {
  width: 22,
  height: 22,
  x: 390,
  y: 478,
  dx: 0,
  dy: 0,
  velocity: 4,
  jump: function() {
    this.dy = -this.velocity;
    this.dx = -this.velocity;
  },
  move: function() {
    this.x += this.dx;
    this.y += this.dy;
  },
  collide: function(item) {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    if (
      x + this.width > item.x &&
      x < item.x + item.width &&
      y + this.height > item.y &&
      y < item.y + item.height
    ) {
      return true;
    }
    return false;
  },
  bumpBlock: function(block) {
    this.dy *= -1;
    block.isAlive = false;
    ++game.score;
    game.sound.blocksound.play();

    if (game.score >= game.blocks.length) {
      game.over("You win!");
    }
  },
  onTheLeftSide: function(platform) {
    return this.x + this.width / 2 < platform.x + platform.width / 2;
  },
  bumpPlatform: function(platform) {
    this.dy = -this.velocity;
    this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity;
  },
  checkingBounds: function() {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    if (x < 0) {
      this.x = 0;
      this.dx = this.velocity;
    } else if (x + this.width > game.width) {
      this.x = game.width - this.width;
      this.dx = -this.velocity;
    } else if (y < 0) {
      this.y = 0;
      this.dy = this.velocity;
    } else if (y + this.height > game.height) {
      game.over("You lose!");
    }
  }
};

game.platform = {
  x: 350,
  y: 500,
  width: 104,
  height: 24,
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
  },
  releaseBall: function() {
    if (this.ball) {
      this.ball.jump();
      this.ball = false;
    }
  }
};

window.addEventListener("load", () => {
  game.start();
});
