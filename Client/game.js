class Game {
  s;
  static container;

  constructor(container) {
    Game.container = container;
    this.myp5 = new p5(this.s, container);
  }

  s = (p) => {
    let zoom = 32;
    const timeBetweenMoves = 80;
    const previousPositions = {};
    const move = {
      up: false,
      left: false,
      down: false,
      right: false,
    };

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

      p.fill(100, 255, 100);
      p.noStroke();
      let playerInfo;
      for (const [key, value] of Object.entries(SocketIO.gameState.players)) {
        if (
          previousPositions[key] === null ||
          previousPositions[key] === undefined
        ) {
          previousPositions[key] = {};
        }

        if (key === SocketIO.socket.id) {
          playerInfo = value;
          continue;
        }

        animateEntity(
          key,
          previousPositions[key].x,
          previousPositions[key].y,
          value.xPos,
          value.yPos,
          p.deltaTime
        );
      }

      p.fill(255);
      animateEntity(
        SocketIO.socket.id,
        previousPositions[SocketIO.socket.id].x,
        previousPositions[SocketIO.socket.id].y,
        playerInfo.xPos,
        playerInfo.yPos,
        p.deltaTime
      );

      if (previousPositions[SocketIO.socket.id].lastMoved >= timeBetweenMoves) {
        let sendMove = false;

        for (const [key, value] of Object.entries(move)) {
          if (value) sendMove = true;
        }

        if (sendMove) {
          SocketIO.playerHandler.SendMove(move);
          previousPositions[SocketIO.socket.id] = {
            x: playerInfo.xPos,
            y: playerInfo.yPos,
            lastMoved: 0,
          };
        }
      }
    };

    const animateEntity = (key, px, py, x, y, dt) => {
      if (px === undefined || py === undefined || py === null || px === null) {
        drawEntity(key, x, y);
        return;
      }
      previousPositions[key].lastMoved += dt;
      const newPos = p.createVector(x, y);
      const oldPos = p.createVector(px, py);
      let amt = previousPositions[key].lastMoved / timeBetweenMoves;

      if (amt >= 1) {
        amt = 1;
        if (key !== SocketIO.socket.id) {
          previousPositions[key] = { x: x, y: y, lastMoved: 0 };
        }
      }
      const animPos = p5.Vector.lerp(oldPos, newPos, amt);
      p.ellipse(animPos.x * zoom + zoom / 2, animPos.y * zoom + zoom / 2, zoom);
    };

    const drawEntity = (key, x, y) => {
      p.ellipse(x * zoom + zoom / 2, y * zoom + zoom / 2, zoom);
      previousPositions[key] = { x: x, y: y, lastMoved: 0 };
    };

    p.keyPressed = (event) => {
      //Dont register movement while typing in chat and other windows
      if (event.path[0].localName !== "body") return;

      switch (event.code) {
        case "KeyW":
          move.up = true;
          break;
        case "KeyA":
          move.left = true;
          break;
        case "KeyS":
          move.down = true;
          break;
        case "KeyD":
          move.right = true;
          break;
        default:
          break;
      }
    };

    p.keyReleased = (event) => {
      switch (event.code) {
        case "KeyW":
          move.up = false;
          break;
        case "KeyA":
          move.left = false;
          break;
        case "KeyS":
          move.down = false;
          break;
        case "KeyD":
          move.right = false;
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
