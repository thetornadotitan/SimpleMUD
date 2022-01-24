class SocketIO {
  static socket = io("127.0.0.1:3000");
  static chatHandler;

  static Init() {
    new StartScreenHandlers();
    SocketIO.chatHandler = new ChatHandlers();
  }
}
