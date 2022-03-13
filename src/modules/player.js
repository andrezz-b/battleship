const Player = (name) => {
  const computer = name === "computer";
  const aiMoves = [];

  const makeMove = (row, column, board) => {
    if (!computer) {
      board.receiveAttack(row, column);
    } else {
      let illegal = true;
      while (illegal) {
        const rowRand = Math.floor(Math.random() * board.rowSize);
        const columnRand = Math.floor(Math.random() * board.columnSize);
        if (!aiMoves.some((move) => move.columnRand === columnRand && move.rowRand === rowRand)) {
          aiMoves.push({ rowRand, columnRand });
          illegal = false;
        }
      }
      const { rowRand, columnRand } = aiMoves[aiMoves.length - 1];
      board.receiveAttack(rowRand, columnRand);
    }
  };
  return { makeMove };
};

export default Player;
