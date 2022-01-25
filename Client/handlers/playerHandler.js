class PlayerHandlers {
  constructor() {
    SocketIO.socket.on("updatePlayerStates", this.#UpdatePlayerStates);
  }

  #UpdatePlayerStates(state) {
    console.log(SocketIO.gameState);
    console.log(state);
    SocketIO.gameState.players = state;
    console.log(SocketIO.gameState);
  }

  MoveUp() {
    SocketIO.socket.emit("moveUp", SocketIO.gameState.gameID);
  }
  MoveLeft() {
    SocketIO.socket.emit("moveLeft", SocketIO.gameState.gameID);
  }
  MoveDown() {
    SocketIO.socket.emit("moveDown", SocketIO.gameState.gameID);
  }
  MoveRight() {
    SocketIO.socket.emit("moveRight", SocketIO.gameState.gameID);
  }
}
