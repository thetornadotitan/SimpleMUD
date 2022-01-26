class ChatHandlers {
  constructor() {
    SocketIO.socket.on("newChatMessage", this.#ReceiveChatMessage);
    SocketIO.socket.on("newCombatMessage", this.#ReceiveCombatMessage);
    SocketIO.socket.on("newInfoMessage", this.#ReceiveInfoMessage);
    this.chatViews = {
      All: "All",
      Chat: "Chat",
      Combat: "Combat",
      Info: "Info",
    };
    this.currentChatView = this.chatViews.All;
    this.chatHistory = [];
    this.messageClasses = {
      Chat: "game-chat-ui-body-chat-message-container",
      Combat: "game-chat-ui-body-combat-message-container",
      Info: "game-chat-ui-body-info-message-container",
    };
    this.maxMessageLength = 200;
  }

  #ReceiveChatMessage(data) {
    if (
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.All ||
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.Chat
    ) {
      SocketIO.chatHandler.#DisplayMessage(
        SocketIO.chatHandler.messageClasses.Chat,
        data.sender,
        data.message
      );
    }

    SocketIO.chatHandler.chatHistory.push({
      sender: data.sender,
      type: SocketIO.chatHandler.chatViews.Chat,
      message: data.message,
    });
  }

  #ReceiveCombatMessage(data) {
    if (
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.All ||
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.Combat
    ) {
      SocketIO.chatHandler.#DisplayMessage(
        SocketIO.chatHandler.messageClasses.Combat,
        data.sender,
        data.message
      );
    }

    SocketIO.chatHandler.chatHistory.push({
      sender: data.sender,
      type: SocketIO.chatHandler.chatViews.Combat,
      message: data.message,
    });
  }

  #ReceiveInfoMessage(data) {
    if (
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.All ||
      SocketIO.chatHandler.currentChatView ===
        SocketIO.chatHandler.chatViews.Info
    ) {
      SocketIO.chatHandler.#DisplayMessage(
        SocketIO.chatHandler.messageClasses.Info,
        data.sender,
        data.message
      );
    }

    SocketIO.chatHandler.chatHistory.push({
      sender: data.sender,
      type: SocketIO.chatHandler.chatViews.Info,
      message: data.message,
    });
  }

  #DisplayMessage(messageClass, headerMessage, message) {
    const messageTemplate = document.querySelector(
      "#game-chat-ui-message-template"
    );
    const messageElement = messageTemplate.content.cloneNode(true);

    messageElement.querySelector(
      ".game-chat-ui-body-message-container"
    ).className += ` ${messageClass}`;

    messageElement.querySelector(
      ".game-chat-ui-body-message-header"
    ).textContent = headerMessage;

    messageElement.querySelector(
      ".game-chat-ui-body-message-body"
    ).textContent = message;

    const messageContainer = document.querySelector("#game-chat-ui-body");
    const atBottom =
      messageContainer.scrollTop >=
      messageContainer.scrollHeight - messageContainer.offsetHeight - 3;
    messageContainer.appendChild(messageElement);
    if (atBottom) {
      messageContainer.scrollTop =
        messageContainer.scrollHeight - messageContainer.offsetHeight;
    }
  }

  CreateUI() {
    document
      .querySelector("#content")
      .appendChild(
        document
          .querySelector("#game-chat-ui-template")
          .content.firstElementChild.cloneNode(true)
      );

    document
      .querySelector("#game-chat-ui-inputs-textbox")
      .addEventListener("keyup", (event) => {
        if (event.key === "Enter") this.SendMessage();
      });

    document.querySelector("#game-chat-ui-inputs-textbox").maxLength =
      this.maxMessageLength;

    this.#ReceiveChatMessage({ sender: "Chat Tester", message: "test" });
    this.#ReceiveCombatMessage({ sender: "Chat Tester", message: "test" });
    this.#ReceiveInfoMessage({ sender: "Chat Tester", message: "test" });
  }

  SendMessage() {
    const textbox = document.querySelector("#game-chat-ui-inputs-textbox");
    const message = textbox.value;

    if (this.ValidString("Message", message, this.maxMessageLength) === false)
      return;

    SocketIO.socket.emit("newChatMessage", message);
    textbox.value = "";
  }

  SwitchView(view) {
    //Just in case the history is changed while this is running.
    const chatHistoryCopy = [...this.chatHistory];

    //Clear Messagebody
    document.querySelector("#game-chat-ui-body").innerHTML = "";

    switch (view) {
      case this.chatViews.All:
        this.currentChatView = this.chatViews.All;
        chatHistoryCopy.map((entry) => {
          if (entry.type === this.chatViews.Chat)
            this.#DisplayMessage(
              this.messageClasses.Chat,
              entry.sender,
              entry.message
            );
          if (entry.type === this.chatViews.Combat)
            this.#DisplayMessage(
              this.messageClasses.Combat,
              entry.sender,
              entry.message
            );
          if (entry.type === this.chatViews.Info)
            this.#DisplayMessage(
              this.messageClasses.Info,
              entry.sender,
              entry.message
            );
        });
        break;
      case this.chatViews.Chat:
        this.currentChatView = this.chatViews.Chat;
        chatHistoryCopy.map((entry) => {
          if (entry.type === this.chatViews.Chat)
            this.#DisplayMessage(
              this.messageClasses.Chat,
              entry.sender,
              entry.message
            );
        });
        break;
      case this.chatViews.Combat:
        this.currentChatView = this.chatViews.Combat;
        chatHistoryCopy.map((entry) => {
          if (entry.type === this.chatViews.Combat)
            this.#DisplayMessage(
              this.messageClasses.Combat,
              entry.sender,
              entry.message
            );
        });
        break;
      case this.chatViews.Info:
        this.currentChatView = this.chatViews.Info;
        chatHistoryCopy.map((entry) => {
          if (entry.type === this.chatViews.Info)
            this.#DisplayMessage(
              this.messageClasses.Info,
              entry.sender,
              entry.message
            );
        });
        break;
      default:
        break;
    }
  }

  ToggleMinimization() {
    const body = document.querySelector("#game-chat-ui-body");
    const input = document.querySelector("#game-chat-ui-inputs");
    body.style.display === "none"
      ? (body.style.display = "block")
      : (body.style.display = "none");
    input.style.display === "none"
      ? (input.style.display = "flex")
      : (input.style.display = "none");
  }

  ValidString(checking, input, maxLength) {
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
}
