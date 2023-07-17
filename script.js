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
  const setName = (newName) => {
    name = newName;
  };
  const getMark = () => mark;
  return { getName, setName, getMark };
};

// Display controller module
const displayController = (() => {

  const changeNameBtn = document.getElementById('change-name');

  const formContainer = document.querySelector('#form-container');

  const form = document.querySelector("form");

  const formCloseBtn = document.querySelector('.form-cancel');

  const gameBoardContainer = document.getElementById('game-board');

  const startButton = document.getElementById('start-btn');

  const gameInfo = document.getElementById('game-info');

  let gameOn = false;

  const cells = [];

  const startGame = () => {
    const currentPlayer = game.getCurrentPlayer();
    if(!gameOn) {
      reset();
      startButton.disabled = true;
      changeNameBtn.disabled = true;
      gameOn = true;
      gameInfo.innerHTML = `<h3>Game has started!</h3>
                            <h3>Player turn: ${currentPlayer.getName()}</h3>`
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
    startButton.disabled = false;
    changeNameBtn.disabled = false;
    gameInfo.innerHTML = `<h3>${message} Press start to play again.</h3>`
  };

  const reset = () => {
      gameBoard.resetBoard();
      cells.length = 0;
      renderBoard();
  };

  const changeNames = () => {
    const playerOneName = document.getElementById('player1');
    const playerTwoName = document.getElementById('player2');
    game.player1.setName(playerOneName.value);
    game.player2.setName(playerTwoName.value);
    playerOneName.value = '';
    playerTwoName.value = '';
  }

  startButton.addEventListener('click', startGame);

  changeNameBtn.addEventListener('click', () => {
    formContainer.showModal();
  });

  formCloseBtn.addEventListener('click', () => {
    formContainer.close();
  });

  form.addEventListener('submit', changeNames);

  return { gameInfo, renderBoard };
})();

// Game module
const game = (() => {

  const player1 = createPlayer('Player 1', 'X');
  const player2 = createPlayer('Player 2', 'O');

  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayController.gameInfo.innerHTML = `<h3>Game has started!</h3>
                                            <h3>Player turn: ${currentPlayer.getName()}</h3>`
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

  return { player1, player2, getCurrentPlayer, switchTurn, checkGameStatus };
})();

displayController.renderBoard();