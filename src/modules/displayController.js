import PubSub from "pubsub-js";

const displayController = (() => {
  const renderPlayer = (board) => {
    const playerBoardDiv = document.querySelector(`[data-player='${board.name}']`);
    for (let row = 0; row < board.rowSize; row += 1) {
      for (let column = 0; column < board.columnSize; column += 1) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.row = row;
        tile.dataset.column = column;
        if (board.getGrid()[row][column].type === "ship") {
          const ship = document.createElement("div");
          ship.classList.add("ship");
          tile.append(ship);
        } else {
          const empty = document.createElement("div");
          tile.append(empty);
        }
        if (board.name === "computer") {
          tile.addEventListener("click", (e) => {
            const target = e.target.closest(".tile");
            PubSub.publish("play-round", {
              row: target.dataset.row,
              column: target.dataset.column,
            });
          }, { once: true });
        }
        playerBoardDiv.append(tile);
      }
    }
  };

  const updateBoard = (...boards) => {
    boards.forEach((board) => {
      const playerBoardDiv = document.querySelector(`[data-player='${board.name}']`);
      for (let row = 0; row < board.rowSize; row += 1) {
        for (let column = 0; column < board.columnSize; column += 1) {
          const current = board.getGrid()[row][column];
          if (current.hit !== undefined) {
            const child = playerBoardDiv.querySelector(`[data-row='${row}'][data-column='${column}']`).firstElementChild;
            if (current.hit === true) {
              child.classList.add("hit");
            } else {
              child.classList.add("miss");
            }
          }
        }
      }
    });
  };

  return {
    renderPlayer,
    updateBoard,
  };
})();

export default displayController;
