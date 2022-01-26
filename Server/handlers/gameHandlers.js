class Game {
  constructor() {
    this.roomGameStateMap = {};
    this.socketRoomMap = {};
    this.messageTpyes = {
      Chat: "Chat",
      Combat: "Combat",
      Info: "Info",
    };

    this.registerChatEvents = require("./gameHandlers/chatHandlers");
    this.registerPlayerEvents = require("./gameHandlers/playerHandlers");
  }

  RegisterSocketEvents(io, socket) {
    this.registerChatEvents(io, socket, this);
    this.registerPlayerEvents(io, socket, this);
  }
}

module.exports = new Game();
