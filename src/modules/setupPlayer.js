/* eslint-disable no-param-reassign */
const setupPlayerBoard = (() => {
  const playerBoardDiv = document.querySelector("[data-player='player']");
  const createBoard = document.querySelector("#create-board");
  const playBtn = document.querySelector("#create-start");
  const resetBtn = document.querySelector("#create-reset");
  const randomBtn = document.querySelector("#create-random");

  function getChildElementIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
  }

  const markUsedAll = () => {
    const ships = createBoard.querySelectorAll(".ship-container");
    ships.forEach((ship) => {
      ship.classList.add("empty");
      ship.draggable = false;
    });
  };

  const markUsed = (length, index) => {
    const ships = createBoard.querySelectorAll(`[data-shipLength='${length}']`);
    ships[index].classList.add("empty");
    ships[index].draggable = false;
  };

  const removeShip = (shipID) => {
    const { rowTip: row, columnTip: column } = shipID;
    const tile = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    tile.firstElementChild.remove();
  };

  const rotateShip = (e, data, board) => {
    const {
      row, column, shipLength, vert,
    } = data;
    const shipID = {
      rowTip: row,
      columnTip: column,
    };
    if (board.rotateShip(shipID) === 0) {
      removeShip(shipID);
      const newVert = !vert;
      // eslint-disable-next-line no-use-before-define
      createShip(row, column, shipLength, newVert, board);
    }
  };

  const createShip = (row, column, shipLength, vert, board) => {
    const shipContainer = document.createElement("div");
    const tile = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    shipContainer.classList.add("ship-container");
    shipContainer.style.gridAutoFlow = vert ? "row" : "column";
    shipContainer.draggable = true;
    shipContainer.dataset.row = row;
    shipContainer.dataset.column = column;
    shipContainer.dataset.shipLength = shipLength;
    shipContainer.dataset.vert = vert;
    const data = {
      row,
      column,
      shipLength,
      vert,
    };
    for (let i = 0; i < shipLength; i += 1) {
      const ship = document.createElement("div");
      ship.classList.add("ship");
      shipContainer.appendChild(ship);
    }
    shipContainer.addEventListener("click", (e) => {
      rotateShip(e, data, board);
    });
    shipContainer.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(data));
    });
    tile.appendChild(shipContainer);
  };

  const placeShip = (e, board) => {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { vert, shipLength } = data;

    if (data.row === undefined) {
      const row = parseInt(e.target.dataset.row, 10);
      const column = parseInt(e.target.dataset.column, 10);
      if (board.placeShip(row, column, shipLength, vert) === 0) {
        createShip(row, column, shipLength, vert, board);
        markUsed(shipLength, data.index);
      }
    } else {
      const moveRow = parseInt(e.target.dataset.row, 10);
      const moveColumn = parseInt(e.target.dataset.column, 10);
      const shipID = {
        rowTip: data.row,
        columnTip: data.column,
      };
      if (board.moveShip(shipID, moveRow, moveColumn) === 0) {
        removeShip(shipID);
        createShip(moveRow, moveColumn, shipLength, vert, board);
      }
    }
  };

  const addDragListeners = () => {
    const ships = createBoard.querySelectorAll(".ship-container");
    ships.forEach((ship) => ship.addEventListener("dragstart", (e) => {
      const container = e.target.closest(".ship-container");
      const data = {
        shipLength: parseInt(container.dataset.shiplength, 10),
        vert: container.dataset.vert === "true",
        index: getChildElementIndex(container),
      };
      e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }));
  };

  const createEmptyBoard = (board) => {
    playerBoardDiv.textContent = "";
    for (let row = 0; row < board.rowSize; row += 1) {
      for (let column = 0; column < board.columnSize; column += 1) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.row = row;
        tile.dataset.column = column;
        tile.addEventListener("dragenter", (e) => {
          e.preventDefault();
        });
        tile.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.target.classList.add("dragover");
        });
        tile.addEventListener("dragleave", (e) => {
          e.target.classList.remove("dragover");
        });
        tile.addEventListener("drop", (e) => {
          e.target.classList.remove("dragover");
          placeShip(e, board);
        });
        playerBoardDiv.append(tile);
      }
    }
  };

  const loadShips = (board) => {
    const ships = board.getShips();
    const grid = board.getGrid();
    ships.forEach((ship) => {
      const { rowTip: row, columnTip: column } = ship.id;
      const vert = row + 1 < board.rowSize ? grid[row + 1][column].type === "ship" : false;
      createShip(ship.id.rowTip, ship.id.columnTip, ship.getLength(), vert);
    });
  };

  const resetAvail = () => {
    const ships = createBoard.querySelectorAll(".ship-container");
    ships.forEach((ship) => {
      ship.classList.remove("empty");
      // eslint-disable-next-line no-param-reassign
      ship.draggable = true;
    });
  };

  const reset = (board) => {
    board.resetBoard();
    resetAvail();
    createEmptyBoard(board);
  };

  const init = (board) => {
    resetAvail();
    createBoard.classList.add("active");
    resetBtn.addEventListener("click", () => {
      reset(board);
    });
    randomBtn.addEventListener("click", () => {
      reset(board);
      board.placeRandom();
      markUsedAll();
      loadShips(board);
    });
    createEmptyBoard(board);
    addDragListeners();
    return new Promise((resolve) => {
      playBtn.addEventListener("click", () => {
        if (board.checkReady()) {
          createBoard.classList.remove("active");
          resolve();
        }
      });
    });
  };

  return {
    init,
  };
})();

export default setupPlayerBoard;
