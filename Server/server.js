const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:8080",
  },
});

//handlers
const registerStartScreenHandlers = require("./handlers/startScreenHandlers");
const game = require("./handlers/gameHandlers");

io.on("connection", (socket) => {
  game.RegisterSocketEvents(io, socket);
  registerStartScreenHandlers(io, socket, game);
});

server.listen(3000);
