const Player = (name) => {
  const computer = name === "computer";
  const aiMoves = [];

  const makeMove = (posY, posX, board) => {
    if (!computer) {
      board.reciveAttack(posY, posX);
    } else {
      let illegal = true;
      while (illegal) {
        const y = Math.floor(Math.random() * board.sizeY);
        const x = Math.floor(Math.random() * board.sizeX);
        if (!aiMoves.some((el) => el.x === x && el.y === y)) {
          aiMoves.push({ y, x });
          illegal = false;
        }
      }
      const { x, y } = aiMoves[aiMoves.length - 1];
      board.reciveAttack(y, x);
    }
  };
  return { makeMove };
};

export default Player;
