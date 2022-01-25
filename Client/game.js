class Game {
  s;
  static container;

  constructor(container) {
    Game.container = container;
    this.myp5 = new p5(this.s, container);
  }

  s = (p) => {
    let zoom = 32;

    p.setup = () => {
      p.createCanvas(
        Game.container.clientWidth,
        Game.container.clientHeight,
        p.WEBGL
      );

      SocketIO.chatHandler.CreateUI();
    };

    p.draw = () => {
      p.translate(-p.width / 2, -p.height / 2);
      p.background(0);
      const rows = p.width / zoom;
      const cols = p.height / zoom;

      p.noFill();
      p.stroke(255);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          p.rect(row * zoom, col * zoom, zoom, zoom);
        }
      }

      p.fill(255);
      p.noStroke();
      for (const [key, value] of Object.entries(SocketIO.gameState.players)) {
        console.log(value);
        p.ellipse(
          value.xPos * zoom + zoom / 2,
          value.yPos * zoom + zoom / 2,
          zoom
        );
      }
    };

    p.keyPressed = (event) => {
      switch (event.code) {
        case "KeyW":
          console.log(event);
          SocketIO.playerHandler.MoveUp(SocketIO.gameState.gameID);
          break;
        case "KeyA":
          console.log(event);
          SocketIO.playerHandler.MoveLeft(SocketIO.gameState.gameID);
          break;
        case "KeyS":
          console.log(event);
          SocketIO.playerHandler.MoveDown(SocketIO.gameState.gameID);
          break;
        case "KeyD":
          console.log(event);
          SocketIO.playerHandler.MoveRight(SocketIO.gameState.gameID);
          break;
        default:
          break;
      }
    };

    p.windowResized = () => {
      //Make it so the window can shrink properly, without it the window only grows
      //Likely due to using the client width on resize and vh and vw to size it.
      p.resizeCanvas(1, 1);
      p.resizeCanvas(Game.container.clientWidth, Game.container.clientHeight);
    };
  };
}
