// server/socketHandler.js

// This will store player queues and ongoing games
const waitingPlayers = []; // Array to queue players waiting for an opponent
const activeGames = {}; // Object to store active games by gameId

module.exports = (io, socket, gameManager) => {
  socket.on("joinGame", () => {
    const availablePlayer = findAvailablePlayer(socket);
    //console.log("available player", availablePlayer, "skt id", socket.id);

    if (availablePlayer && availablePlayer.id != socket.id) {
      // If an available player is found, create a game room
      //console.log("available playerid", availablePlayer.id, socket.id);
      const gameId = gameManager.createGameRoom(socket.id, availablePlayer.id);
      //console.log("gameid is", gameId);
      socket.join(gameId);
      availablePlayer.join(gameId);

      // Store the game room and the players involved in it
      activeGames[gameId] = { players: [socket, availablePlayer] };

      // Notify both players that the game has started
      io.to(gameId).emit("gameStart", {
        gameId,
        players: [socket.id, availablePlayer.id],
      });
    } else {
      // No players available, add the current player to the queue
      addPlayerToQueue(socket);
    }
  });

  socket.on("makeMove", (data) => {
    const { gameId, board } = data;
    gameManager.updateGame(gameId, board);

    // Broadcast the move to both players in the room
    io.to(gameId).emit("moveMade", { board });
  });

  socket.on("disconnect", () => {
    handleDisconnection(io, socket, gameManager);
  });
};

/**
 * Function to find an available player in the waiting queue
 */
function findAvailablePlayer(socket) {
  if (waitingPlayers.length > 0) {
    // Remove and return the first player in the waiting queue
    return waitingPlayers.shift();
  }
  return null; // No players available for matching
}

/**
 * Function to add a player to the waiting queue
 */
function addPlayerToQueue(socket) {
  waitingPlayers.push(socket);
  //console.log(`Player ${socket.id} added to the waiting queue.`);
}

/**
 * Function to handle disconnection events
 */
function handleDisconnection(io, socket, gameManager) {
  // Remove the disconnected player from the waiting queue if present
  const index = waitingPlayers.indexOf(socket);
  if (index !== -1) {
    waitingPlayers.splice(index, 1); // Remove player from the queue
    //console.log(`Player ${socket.id} removed from waiting queue.`);
  }

  // Check if the player was part of an active game and handle cleanup
  for (const [gameId, game] of Object.entries(activeGames)) {
    if (game.players.includes(socket)) {
      // Notify the other player that the game has ended
      const otherPlayer = game.players.find(
        (player) => player.id !== socket.id
      );
      if (otherPlayer) {
        io.to(otherPlayer.id).emit("opponentDisconnected");
      }

      // Clean up the game resources
      //delete activeGames[gameId];
      gameManager.deleteGame(gameId);
      //console.log(`Game ${gameId} ended due to player disconnection.`);
      break;
    }
  }
}
