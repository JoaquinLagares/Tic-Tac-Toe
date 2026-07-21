const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', '']

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;

    }
    const reset = () => {
        board = ['', '', '', '', '', '', '', '', '']
    }
    return { getBoard, setMark, reset }
})();

const Player = (name, mark) => {
    return { name, mark }
}

const Game = (() => {
    let players = [Player('', 'X'), Player('', 'O')];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const start = (name1, name2) => {
        players = [Player(name1, 'X'), Player(name2, 'O')]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.reset();
    }

  const playRound = (index) => {
    if (gameOver) return;

    let currentPlayer = players[currentPlayerIndex];
    if (Gameboard.setMark(index, currentPlayer.mark)) {
        if (checkWinner()) {
            document.querySelector("#message").textContent = `${currentPlayer.name} wins!`;
            gameOver = true;
        } else if (isTie()) {
            document.querySelector("#message").textContent = "It's a Tie!";
            gameOver = true;
        } else {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            document.querySelector("#message").textContent = 
              `Turn: ${players[currentPlayerIndex].name}`;
        }
    }
};

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombos = [ [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

        return winningCombos.some(combo => {
            let [a,b,c] = combo;
            return board[a]!== "" && board[a] === board[b] && board[a] === board[c]
        })
    }

    const isTie = () => {
        return Gameboard.getBoard().every(cell => cell !== '')
    }

    return {start,playRound}
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.querySelector("#message");
  const restartBtn = document.querySelector("#restart");

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      Game.playRound(index);
      render();
    });
  });


  restartBtn.addEventListener("click", () => {
    Game.start("Player 1", "Player 2");
    render();
  });

  return { render };
})();


const startBtn = document.querySelector("#start");
const restartBtn = document.querySelector("#restart");
const message = document.querySelector("#message");
const cells = document.querySelectorAll(".cell");

startBtn.addEventListener("click", () => {
  const p1 = document.querySelector("#player1")?.value.trim() || "Player 1";
  const p2 = document.querySelector("#player2")?.value.trim()|| "Player 2";

  Game.start(p1, p2);   
  message.textContent = `${p1} vs ${p2} — Game started!`;
  DisplayController.render();
});

restartBtn.addEventListener("click", () => {
  const p1 = document.querySelector("#player1").value.trim() || "Player 1";
  const p2 = document.querySelector("#player2").value.trim() || "Player 2";

  Game.start(p1, p2);
  message.textContent = "Game restarted!";
  DisplayController.render();
});
