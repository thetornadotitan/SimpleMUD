class PlayerHandlers {
  constructor() {
    SocketIO.socket.on("updatePlayerStates", this.#UpdatePlayerStates);
  }

  #UpdatePlayerStates(state) {
    SocketIO.gameState.players = state;
  }

  SendMove(movement) {
    const data = {
      up: movement.up,
      left: movement.left,
      down: movement.down,
      right: movement.right,
    };
    SocketIO.socket.emit("move", data);
  }
}
