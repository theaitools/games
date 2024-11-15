// client/src/components/TicTacToe.js
import React, { useState, useEffect } from "react";
import socket from "./socket"; // Import the socket instance for real-time interaction
import "./TicTacToe.css"; // Import the CSS file for styling

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [status, setStatus] = useState("Waiting for an opponent...");

  useEffect(() => {
    socket.emit("joinGame");

    socket.on("gameStart", ({ players }) => {
      setStatus("Game started!");
      setIsMyTurn(players[0] === socket.id); // Determine if it's this player's turn
    });

    socket.on("moveMade", ({ board: newBoard }) => {
      setBoard(newBoard);
      setIsMyTurn(
        newBoard.filter((cell) => cell === "X").length <=
          newBoard.filter((cell) => cell === "O").length
      );
    });

    return () => {
      socket.off("gameStart");
      socket.off("moveMade");
    };
  }, []);

  const handleMove = (index) => {
    if (!isMyTurn || board[index]) return; // Prevent moves if not your turn or cell is occupied

    const updatedBoard = [...board];
    updatedBoard[index] = "X"; // Always place "X" for the player's turn
    setBoard(updatedBoard);

    socket.emit("makeMove", { gameId: "your-game-id", board: updatedBoard });
  };

  return (
    <div className="tictactoe">
      <h3>{status}</h3>
      <div className="board">
        {board.map((cell, idx) => (
          <button key={idx} className="cell" onClick={() => handleMove(idx)}>
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
