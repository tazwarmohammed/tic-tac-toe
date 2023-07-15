// Game board module
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const updateBoard = (index, mark) => {
    if (board[index] === '') {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return { getBoard, updateBoard, resetBoard };
})();

// Player factory
const createPlayer = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

// Display controller module
const displayController = (() => {
  const gameBoardContainer = document.getElementById('game-board');
  const startButton = document.getElementById('start-btn');
  const resetButton = document.getElementById('reset-btn');
  const gameInfo = document.getElementById('game-info');
  let gameOn = false;
  const cells = [];

  const startGame = () => {
    if(!gameOn) {
      gameOn = true;
      gameInfo.innerHTML = `<h2>Game has started!</h2>`
    }
  }

  const renderBoard = () => {
    const board = gameBoard.getBoard();
    gameBoardContainer.innerHTML = '';

    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement('div');
      cell.textContent = board[i];
      cells.push(cell);

      cell.addEventListener('click', () => {
        if(gameOn) {
          playTurn(i);
        }
      });

      gameBoardContainer.appendChild(cell);
    }
  };

  const playTurn = (index) => {
    const currentPlayer = game.getCurrentPlayer();
    const mark = currentPlayer.getMark();

    if (gameBoard.updateBoard(index, mark)) {
      renderBoard();
      if (game.checkGameStatus() === 'ongoing') {
        game.switchTurn();
      } else {
        endGame();
      }
    }
  };

  const endGame = () => {
    let message;
    if(game.checkGameStatus() === 'win') {
      const currentPlayer = game.getCurrentPlayer();
      message = `Congratulations, ${currentPlayer.getName()} wins!`;
    } else if(game.checkGameStatus() === 'tie') {
      message = "It's a tie!";
    }
    gameOn = false;
    // alert(message);
    gameInfo.innerHTML = `<h2>${message} Press the start button to start another game.</h2>`
    reset();
  };

  const reset = () => {
    gameBoard.resetBoard();
    cells.length = 0;
    renderBoard();
  };

  startButton.addEventListener('click', startGame);

  resetButton.addEventListener('click', reset);

  return { renderBoard };
})();

// Game module
const game = (() => {
  let currentPlayer;
  const player1 = createPlayer('Player 1', 'X');
  const player2 = createPlayer('Player 2', 'O');

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkGameStatus = () => {
    const board = gameBoard.getBoard();
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        return 'win'; // Game is won
      }
    }

    if (board.every(cell => cell !== '')) {
      return 'tie'; // Game is a tie
    }

    return 'ongoing'; // Game is not over
  };

  currentPlayer = player1; // Player 1 starts first

  return { getCurrentPlayer, switchTurn, checkGameStatus };
})();

displayController.renderBoard();