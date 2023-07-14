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
  const restartButton = document.getElementById('restart-btn');
  const cells = [];

  const renderBoard = () => {
    const board = gameBoard.getBoard();
    gameBoardContainer.innerHTML = '';

    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement('div');
      cell.textContent = board[i];
      cells.push(cell);

      cell.addEventListener('click', () => {
        playTurn(i);
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
    alert(message);
    restart();
  };

  const restart = () => {
    gameBoard.resetBoard();
    cells.length = 0;
    renderBoard();
  };

  restartButton.addEventListener('click', restart);

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