module.exports = (io, socket, game) => {
  socket.on("move", (data) => {
    MovePlayer(data);
  });

  socket.on("disconnect", () => {
    if (
      game.socketRoomMap[socket.id] === null ||
      game.socketRoomMap[socket.id] === undefined
    )
      return;

    const gameRoom = game.roomGameStateMap[game.socketRoomMap[socket.id]];

    delete gameRoom.players[socket.id];
    if (Object.entries(gameRoom.players).length === 0)
      delete game.roomGameStateMap[game.socketRoomMap[socket.id]];
    else {
      io.sockets
        .in(game.socketRoomMap[socket.id])
        .emit(
          "updatePlayerStates",
          game.roomGameStateMap[game.socketRoomMap[socket.id]].players
        );
    }
    delete game.socketRoomMap[socket.id];
  });

  const MovePlayer = (data) => {
    const playerData =
      game.roomGameStateMap[game.socketRoomMap[socket.id]].players[socket.id];
    const currentTime = new Date().getTime();

    //TODO: Packets that get stacked can cause this to trigger on a legit player. Should keep a count of violations and kick after a certain number of violaions.
    if (currentTime - playerData.lastMove < 32) {
      //client is sending packets faster than it should ignore extraneous packets
      return;
    }

    if (!ValidateMoveData(data)) return;

    playerData.lastMove = currentTime;

    let newPos = {
      x: playerData.xPos,
      y: playerData.yPos,
    };

    if (data.up) newPos.y--;
    if (data.left) newPos.x--;
    if (data.down) newPos.y++;
    if (data.right) newPos.x++;

    playerData.xPos = newPos.x;
    playerData.yPos = newPos.y;

    playerData.fastPackets = 0;

    //Send new game state
    io.sockets
      .in(game.socketRoomMap[socket.id])
      .emit(
        "updatePlayerStates",
        game.roomGameStateMap[game.socketRoomMap[socket.id]].players
      );
  };

  const ValidateMoveData = (data) => {
    //Validate Data Object
    if ((typeof data === "object" || data instanceof Object) === false) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, bad data. Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }

    //Validate movement Object variables
    if (
      (typeof data.up === "boolean" || data.up instanceof Boolean) === false
    ) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, bad up. Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }
    if (
      (typeof data.left === "boolean" ||
        data.movement.left instanceof Boolean) === false
    ) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, bad up. Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }
    if (
      (typeof data.down === "boolean" ||
        data.movement.down instanceof Boolean) === false
    ) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, bad up. Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }
    if (
      (typeof data.right === "boolean" ||
        data.movement.right instanceof Boolean) === false
    ) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, bad up. Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }

    //Make sure sent room exists
    if (
      game.roomGameStateMap[game.socketRoomMap[socket.id]] === null ||
      game.roomGameStateMap[game.socketRoomMap[socket.id]] === undefined ||
      game.roomGameStateMap[game.socketRoomMap[socket.id]].players[
        socket.id
      ] === null ||
      game.roomGameStateMap[game.socketRoomMap[socket.id]].players[
        socket.id
      ] === undefined
    ) {
      //not string, send error and escape
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your client tried to send a movement command to a non-existing game or a game you are not in. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }
    return true;
  };

  const CheckCollision = (x, y) => {};
};
