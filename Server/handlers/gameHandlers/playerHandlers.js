module.exports = (io, socket, game) => {
  socket.on("moveUp", (gameID) => {
    MovePlayer(gameID, "up");
  });
  socket.on("moveDown", (gameID) => {
    MovePlayer(gameID, "down");
  });
  socket.on("moveLeft", (gameID) => {
    MovePlayer(gameID, "left");
  });
  socket.on("moveRight", (gameID) => {
    MovePlayer(gameID, "right");
  });

  const MovePlayer = (gameID, direction) => {
    if (!ValidateMoveData(gameID)) return;

    console.log(game.roomGameStateMap);
    console.log(game.roomGameStateMap[gameID].players[socket.id]);

    let newPos = {
      x: game.roomGameStateMap[gameID].players[socket.id].xPos,
      y: game.roomGameStateMap[gameID].players[socket.id].yPos,
    };
    switch (direction) {
      case "up":
        newPos.y--;
        break;
      case "down":
        newPos.y++;
        break;
      case "left":
        newPos.x--;
        break;
      case "right":
        newPos.x++;
        break;
      default:
        break;
    }

    game.roomGameStateMap[gameID].players[socket.id].xPos = newPos.x;
    game.roomGameStateMap[gameID].players[socket.id].yPos = newPos.y;

    //Send new game state
    socket.rooms.forEach((room) => {
      console.log(room);
      //don't emit to private room of sender
      if (room === socket.id) return;
      console.log("I'm emitting movement");
      io.sockets
        .in(room)
        .emit("updatePlayerStates", game.roomGameStateMap[gameID].players);
    });
  };

  const ValidateMoveData = (gameID) => {
    //Validate Room ID is string
    if ((typeof gameID === "string" || gameID instanceof String) === false) {
      //not string, send error and escape
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "Your movement command is invalid, Please use the most update version of the client. Disconnecting. Please refresh and try again",
      });
      socket.disconnect();
      return false;
    }

    //Make sure sent room exists
    if (
      game.roomGameStateMap[gameID] === null ||
      game.roomGameStateMap[gameID] === undefined ||
      game.roomGameStateMap[gameID].players[socket.id] === null ||
      game.roomGameStateMap[gameID].players[socket.id] === undefined
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
