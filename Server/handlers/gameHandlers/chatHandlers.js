module.exports = (io, socket, game) => {
  const maxMessageLength = 200;

  socket.on("newChatMessage", (message) => {
    if ((typeof message === "string" || message instanceof String) === false) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message:
          "The sent message did not pass server checks. (Not a String). Your message was not sent. Please make sure you are using the latest version of the client.",
      });
      return;
    }

    message = message.trim();
    if (message.length > maxMessageLength) {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message: `The sent message did not pass server checks. (Langer Than Allowed (${maxMessageLength})). Your message was not sent. Please make sure you are using the latest version of the client.`,
      });
      return;
    }

    if (message === "") {
      socket.emit("newInfoMessage", {
        sender: "Server Error Catcher",
        message: `The sent message did not pass server checks. (String is Blank). Your message was not sent. Please make sure you are using the latest version of the client.`,
      });
      return;
    }

    const sender = `${
      game.roomGameStateMap[game.socketRoomMap[socket.id]].players[socket.id]
        .name
    } Said:`;

    io.sockets.in(game.socketRoomMap[socket.id]).emit("newChatMessage", {
      sender,
      message: message,
    });
  });
};
