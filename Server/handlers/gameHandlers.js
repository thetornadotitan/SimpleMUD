class Game {
  constructor() {
    this.roomGameStateMap = {};
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

  HandleRoomCreation(room) {
    /*
    if (
      this.roomGameStateMap[room] === null ||
      this.roomGameStateMap[room] === undefined
    )
      this.roomGameStateMap[room] = { messages: [] };

    this.roomGameStateMap[room].messages = [];
    */
  }

  HandleRoomDeletion(room) {
    delete this.roomGameStateMap[room];
  }
}

module.exports = new Game();
