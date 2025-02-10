document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const gameFields = document.querySelectorAll(".game-field");
  const resetButton = document.querySelector("#reset-button");
  const resultMessage = document.querySelector(".result-text");
  const playerDisplay = document.querySelector("#game-player");
  const win = [
    // rows
    ["one", "two", "three"],
    ["four", "five", "six"],
    ["seven", "eight", "nine"],
    //columns
    ["one", "four", "seven"],
    ["two", "five", "eight"],
    ["three", "six", "nine"],
    //diagonal
    ["one", "five", "nine"],
    ["three", "five", "seven"]
  ];
  const players = ["player-o", "player-x"];
  if (!loadGameState()) {
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    body?.classList.add(randomPlayer);
    updateCurrentPlayer();
  }
  gameFields.forEach((gameField) => {
    gameField.addEventListener("click", () => {
      if (gameField.getAttribute("data-player")) {
        return;
      }
      const currentPlayer = body?.classList.contains("player-o") ? "o" : "x";
      gameField.setAttribute("data-player", currentPlayer);
      gameField.disabled = true;
      if (currentPlayer === "o") {
        body?.classList.remove("player-o");
        body?.classList.add("player-x");
      } else {
        body?.classList.remove("player-x");
        body?.classList.add("player-o");
      }
      saveGameState();
      updateCurrentPlayer();
      if (checkWin(currentPlayer)) {
        resultMessage.style.display = "block";
        resultMessage.textContent = `Player ${currentPlayer.toUpperCase()} won!`;
        setTimeout(resetGame, 2e3);
        return;
      }
      if (checkDraw()) {
        resultMessage.style.display = "block";
        resultMessage.textContent = "Draw!";
        setTimeout(resetGame, 2e3);
      }
    });
  });
  function checkWin(player) {
    for (let combination of win) {
      let matches = 0;
      for (let id of combination) {
        const field = document.getElementById(id);
        if (field?.getAttribute("data-player") === player) {
          matches++;
        }
      }
      if (matches === 3) {
        return true;
      }
    }
    return false;
  }
  function checkDraw() {
    for (let gameField of gameFields) {
      if (!gameField.getAttribute("data-player")) {
        return false;
      }
    }
    return true;
  }
  function updateCurrentPlayer() {
    if (body?.classList.contains("player-o")) {
      playerDisplay.textContent = "O";
    } else {
      playerDisplay.textContent = "X";
    }
  }
  function saveGameState() {
    const state = {
      fields: Array.from(gameFields).map((field) => ({
        //get an array of objects that save the current field id, the player with its current attribute and if the field is disabled or not
        id: field.id,
        player: field.getAttribute("data-player"),
        disabled: field.disabled
      })),
      //check also the current body class
      currentPlayer: body?.classList.contains("player-o") ? "player-o" : "player-x",
      // also save the resultmessage, to have all the components of the current game state saved
      resultMessage: resultMessage.style.display === "block" ? resultMessage.textContent : null
    };
    localStorage.setItem("tic-tac-toe", JSON.stringify(state));
  }
  function loadGameState() {
    const savedState = localStorage.getItem("tic-tac-toe");
    if (!savedState) {
      return false;
    }
    ;
    const state = JSON.parse(savedState);
    state.fields.forEach((field) => {
      const gameField = document.getElementById(field.id);
      if (field.player) {
        gameField.setAttribute("data-player", field.player);
        gameField.disabled = field.disabled;
      }
    });
    body?.classList.remove("player-o", "player-x");
    body?.classList.add(state.currentPlayer);
    updateCurrentPlayer();
    if (state.resultMessage) {
      resultMessage.style.display = "block";
      resultMessage.textContent = state.resultMessage;
    }
    return true;
  }
  function resetGame() {
    gameFields.forEach((gameField) => {
      gameField.removeAttribute("data-player");
      gameField.disabled = false;
    });
    body?.classList.remove("player-o", "player-x");
    body?.classList.add(players[Math.floor(Math.random() * players.length)]);
    resultMessage.style.display = "none";
    localStorage.removeItem("tic-tac-toe");
  }
  resetButton?.addEventListener("click", () => {
    resetGame();
  });
});
//# sourceMappingURL=main.js.map
