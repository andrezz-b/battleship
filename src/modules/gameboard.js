import Ship from "./ship";

const Gameboard = (name, rowSize = 10, columnSize = 10) => {
  const grid = [];
  const ships = [];

  const getShip = ({ rowTip, columnTip }) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    ships.find((ship) => ship.id.rowTip === rowTip && ship.id.columnTip === columnTip);

  const populateBoard = () => {
    for (let i = 0; i < rowSize; i += 1) {
      grid.push([]);
      for (let j = 0; j < columnSize; j += 1) {
        grid[i].push({ type: "ocean", id: -1 });
      }
    }
  };

  const markEmpty = (row, column, shipLength) => {
    const vert = row + 1 < rowSize ? grid[row + 1][column].type === "ship" : false;
    if (vert) {
      for (let i = row - 1; i < row - 1 + shipLength + 2; i += 1) {
        if (i >= 0 && i < rowSize) {
          for (let j = column - 1; j < column - 1 + 3; j += 1) {
            if (j >= 0 && j < columnSize) {
              if (j === column) {
                j += 1;
                if (j >= columnSize) break;
              }
              grid[i][j].hit = false;
            }
          }
        }
      }
    } else {
      for (let i = row - 1; i < row - 1 + 3; i += 1) {
        if (i >= 0 && i < rowSize) {
          for (let j = column - 1; j < column - 1 + shipLength + 2; j += 1) {
            if (j >= 0 && j < columnSize) {
              if (j === column && i === row) {
                j += shipLength;
                if (j >= columnSize) break;
              }
              grid[i][j].hit = false;
            }
          }
        }
      }
    }
  };

  const checkAvailableSpace = (row, column, shipLength, vert) => {
    let space;
    if (vert) {
      space = row + shipLength - 1 < rowSize;
      if (space) {
        for (let i = 0; i < shipLength; i += 1) {
          if (grid[row + i][column].type === "ship") {
            space = false;
            break;
          }
        }
        for (let i = row - 1; i < row - 1 + shipLength + 2; i += 1) {
          if (i >= 0 && i < rowSize) {
            for (let j = column - 1; j < column - 1 + 3; j += 1) {
              if (j >= 0 && j < columnSize) {
                if (j === column) {
                  j += 1;
                  if (j >= columnSize) break;
                }
                if (grid[i][j].type === "ship") {
                  space = false;
                }
              }
            }
          }
        }
      }
    } else {
      space = column + shipLength - 1 < columnSize;
      if (space) {
        for (let i = 0; i < shipLength; i += 1) {
          if (grid[row][column + i].type === "ship") {
            space = false;
            break;
          }
        }
        for (let i = row - 1; i < row - 1 + 3; i += 1) {
          if (i >= 0 && i < rowSize) {
            for (let j = column - 1; j < column - 1 + shipLength + 2; j += 1) {
              if (j >= 0 && j < columnSize) {
                if (j === column && i === row) {
                  j += shipLength;
                  if (j >= columnSize) break;
                }
                if (grid[i][j].type === "ship") {
                  space = false;
                }
              }
            }
          }
        }
      }
    }
    return space;
  };

  const placeShip = (row, column, shipLength, vert) => {
    if (!checkAvailableSpace(row, column, shipLength, vert)) return -1;
    const ship = Ship(shipLength);
    ship.id = { rowTip: row, columnTip: column };
    if (
      !ships.some((el) => el.id.rowTip === ship.id.rowTip && el.id.columnTip === ship.id.columnTip)
    ) {
      ships.push(ship);
    }
    if (vert) {
      for (let i = 0; i < shipLength; i += 1) {
        grid[row + i][column] = {
          type: "ship",
          id: { rowTip: row, columnTip: column },
          shipLocation: i,
        };
      }
    } else {
      for (let i = 0; i < shipLength; i += 1) {
        grid[row][column + i] = {
          type: "ship",
          id: { rowTip: row, columnTip: column },
          shipLocation: i,
        };
      }
    }

    return 0;
  };

  const receiveAttack = (row, column) => {
    if (
      row < 0
      || column < 0
      || row >= rowSize
      || column >= columnSize
      || grid[row][column].hit !== undefined
    ) {
      return -1;
    }
    grid[row][column].hit = grid[row][column].type === "ship";
    const { id, shipLocation, hit } = grid[row][column];
    const ship = getShip(id);
    if (hit) {
      ship.hit(shipLocation);
      if (ship.isSunk()) {
        const { rowTip, columnTip } = id;
        const shipLength = ship.getLength();
        markEmpty(rowTip, columnTip, shipLength);
      }
    }
    return 0;
  };

  const rotateShip = (shipID) => {
    const { rowTip: row, columnTip: column } = shipID;
    const vert = row + 1 < rowSize ? grid[row + 1][column].type === "ship" : false;
    // Remove ship, if it is needed again move to a function
    if (!vert) {
      grid[row].forEach((el, col) => {
        if (el.id.rowTip === row && el.id.columnTip === column) {
          grid[row].splice(col, 1, { type: "ocean", id: -1 });
        }
      });
      placeShip(row, column, 2, true);
    }
  };

  populateBoard();

  const gameOver = () => !ships.find((ship) => !ship.isSunk());
  const getGrid = () => grid;
  const getShips = () => ships;

  return {
    getGrid,
    placeShip,
    getShips,
    receiveAttack,
    gameOver,
    rotateShip,
    rowSize,
    name,
    columnSize,
  };
};

export default Gameboard;
