module.exports = (io, socket, game) => {
  const maxRoomLength = 50;
  const maxCharNameLength = 20;

  const NewGame = (data) => {
    if (ValidData(data) === false) return;
    //add player to list with socket id and username under the room
    //Game ID -> Socket ID -> Player Name
    socket.join(data.gameID);
  };

  const JoinGame = (data) => {
    if (ValidData(data) === false) return;
    //add player to list with socket id and username under the room
    //Game ID -> Socket ID -> Player Name
    socket.join(data.gameID);
  };

  const RoomExists = (data) => {
    if (ValidData(data) === false) return;
    const doesExist = io.sockets.adapter.rooms.has(data.gameID);
    socket.emit("startScreen:roomExistsResponse", {
      doesExist,
      charName: data.charName,
      gameID: data.gameID,
    });
  };

  const ValidateName = (data) => {
    if (ValidData(data) === false) return;

    if (
      game.roomGameStateMap[data.gameID] === null ||
      game.roomGameStateMap[data.gameID] === undefined
    )
      game.roomGameStateMap[data.gameID] = {};

    if (
      game.roomGameStateMap[data.gameID].players === null ||
      game.roomGameStateMap[data.gameID].players === undefined
    )
      game.roomGameStateMap[data.gameID].players = {};

    for (const [key, value] of Object.entries(
      game.roomGameStateMap[data.gameID].players
    )) {
      if (value.name.toLowerCase() === data.charName.toLowerCase()) {
        socket.emit(
          "startScreen:errorResponse",
          `Character Name Taken. Choose Another`
        );
        return;
      }
    }

    game.roomGameStateMap[data.gameID].players[socket.id] = {
      name: data.charName,
      xPos: 0,
      yPos: 0,
    };

    socket.emit("startScreen:charNameResponse", {
      gameState: game.roomGameStateMap[data.gameID],
      gameID: data.gameID,
    });
  };

  const ValidData = (data) => {
    if (data === null || data === undefined || typeof data !== "object") {
      socket.emit(
        "startScreen:errorResponse",
        `Bad data - null, undefined, or not an Object`
      );
      return false;
    }
    if (data.gameID === null || data.gameID === undefined) {
      socket.emit(
        "startScreen:errorResponse",
        `Bad gameID - null or undefined`
      );
      return false;
    }
    if (data.charName === null || data.charName === undefined) {
      socket.emit(
        "startScreen:errorResponse",
        `Bad Character Name - null, undefined`
      );
      return false;
    }

    if (ValidString("Game ID", data.gameID, maxRoomLength) === false)
      return false;
    if (
      ValidString("Character Name", data.charName, maxCharNameLength) === false
    )
      return false;

    return true;
  };

  const ValidString = (checking, input, maxLength) => {
    if ((typeof input === "string" || input instanceof String) === false) {
      socket.emit(
        "startScreen:errorResponse",
        `${checking} provided was not valid. Not a string`
      );
      return false;
    }

    input = input.trim();
    if (input.length > maxLength) {
      socket.emit(
        "startScreen:errorResponse",
        `${checking} provided was not valid. String longer than allowed (${maxLength})`
      );
      return false;
    }

    if (input === "") {
      socket.emit(
        "startScreen:errorResponse",
        `${checking} provided was not valid. String is blank.`
      );
      return false;
    }

    return true;
  };

  socket.on("startScreen:newGame", NewGame);
  socket.on("startScreen:joinGame", JoinGame);
  socket.on("startScreen:checkRoomExists", RoomExists);
  socket.on("startScreen:checkCharName", ValidateName);
};
