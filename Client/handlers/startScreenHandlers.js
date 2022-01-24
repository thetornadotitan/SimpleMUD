class StartScreenHandlers {
  constructor() {
    SocketIO.socket.on("startScreen:roomExistsResponse", (res) => {
      if (StartMenu.creatingGame && res.doesExist === false)
        SocketIO.socket.emit("startScreen:checkCharName", {
          charName: res.charName,
          gameID: res.gameID,
        });
      else if (StartMenu.creatingGame == false && res.doesExist)
        SocketIO.socket.emit("startScreen:checkCharName", {
          charName: res.charName,
          gameID: res.gameID,
        });
      else if (StartMenu.creatingGame == false && res.doesExist == false)
        window.alert("Game doesn't exist");
      else window.alert("Game already exist");
    });

    SocketIO.socket.on("startScreen:charNameResponse", (res) => {
      if (StartMenu.creatingGame)
        StartMenu.CreateGame(res.charName, res.gameID);
      else StartMenu.JoinGame(res.charName, res.gameID);
    });

    SocketIO.socket.on("startScreen:errorResponse", (res) => {
      window.alert(res);
    });
  }
}

class StartMenu {
  constructor() {
    this.maxRoomLength = 50;
    this.maxCharNameLength = 20;

    document
      .querySelector("#content")
      .appendChild(
        document
          .querySelector("#startform-template")
          .content.firstElementChild.cloneNode(true)
      );

    document.querySelector("#startform-character-name").maxLength =
      this.maxCharNameLength;

    document.querySelector("#startform-new-room-ID").maxLength =
      this.maxRoomLength;

    document.querySelector("#startform-join-room-ID").maxLength =
      this.maxRoomLength;
  }

  static creatingGame = false;

  static NewGamePressed() {
    document.querySelector("#startform-new-container").style.display = "block";
    document.querySelector("#startform-join-container").style.display = "none";
  }

  static JoinGamePressed() {
    document.querySelector("#startform-join-container").style.display = "block";
    document.querySelector("#startform-new-container").style.display = "none";
  }

  static CreatePressed() {
    StartMenu.creatingGame = true;
    StartMenu.PostPressed();
  }

  static JoinPressed() {
    StartMenu.creatingGame = false;
    StartMenu.PostPressed();
  }

  static PostPressed() {
    const charName = document
      .querySelector("#startform-character-name")
      .value.trim();

    let gameID;
    if (StartMenu.creatingGame)
      gameID = document.querySelector("#startform-new-room-ID").value;
    else gameID = document.querySelector("#startform-join-room-ID").value;
    gameID = gameID.trim();

    if (!this.ValidString("Character Name", charName, this.maxCharNameLength))
      return;

    if (!this.ValidString("Game ID", gameID, this.maxRoomLength)) return;

    SocketIO.socket.emit("startScreen:checkRoomExists", { charName, gameID });
  }

  static ValidString(checking, input, maxLength) {
    if ((typeof input === "string" || input instanceof String) === false) {
      window.alert(`${checking} is invalid, must be a string`);
      return false;
    }

    input = input.trim();

    if (input === "") {
      window.alert(`${checking} is invalid, must not be blank`);
      return false;
    }

    if (input.length > maxLength) {
      window.alert(
        `${checking} is invalid, must not be longer than ${maxLength}`
      );
      return false;
    }

    return true;
  }

  static CreateGame(charName, gameID) {
    SocketIO.socket.emit("startScreen:newGame", { charName, gameID });
    document.querySelector("#content").innerHTML = "";
    new Game(document.querySelector("#content"));
  }

  static JoinGame(charName, gameID) {
    SocketIO.socket.emit("startScreen:joinGame", { charName, gameID });
    document.querySelector("#content").innerHTML = "";
    new Game(document.querySelector("#content"));
  }
}
