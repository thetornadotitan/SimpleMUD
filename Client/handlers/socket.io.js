class SocketIO {
  static socket = io("127.0.0.1:3000");
  static chatHandler;
  static playerHandler;
  static gameState = {};

  static Init() {
    new StartScreenHandlers();
    SocketIO.chatHandler = new ChatHandlers();
    SocketIO.playerHandler = new PlayerHandlers();
    SocketIO.socket.on("disconnect", (reason) => {
      window.location.reload();
      return false;
    });
  }
}
