// server/gameManager.js
const games = {};

function createGameRoom(player1, player2) {
  const gameId = `game_${Date.now()}`;
  games[gameId] = {
    players: [player1, player2],
    state: initializeTicTacToeBoard(),
  };
  return gameId;
}

function initializeTicTacToeBoard() {
  return Array(9).fill(null); // Empty 3x3 board represented as a 1D array
}

function getGame(gameId) {
  return games[gameId];
}

function updateGame(gameId, board) {
  if (games[gameId]) {
    games[gameId].state = board;
  }
}

function deleteGame(gameId) {
  delete games[gameId];
}

module.exports = { createGameRoom, getGame, updateGame, deleteGame };
