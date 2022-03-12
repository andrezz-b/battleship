import Ship from "./ship";

const Gameboard = (name, rowSize = 10, columnSize = 10) => {
  const grid = [];
  const ships = [];

  const populateBoard = () => {
    for (let i = 0; i < rowSize; i += 1) {
      grid.push([]);
      for (let j = 0; j < columnSize; j += 1) {
        grid[i].push({ type: "ocean", id: -1 });
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
    if (vert) {
      for (let i = 0; i < shipLength; i += 1) {
        grid[row + i][column] = { type: "ship", id: ships.length, shipLocation: i };
      }
    } else {
      for (let i = 0; i < shipLength; i += 1) {
        grid[row][column + i] = { type: "ship", id: ships.length, shipLocation: i };
      }
    }
    ships.push(Ship(shipLength));
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
    const currentPos = grid[row][column];
    if (currentPos.hit) ships[currentPos.id].hit(currentPos.shipLocation);
    return 0;
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
    rowSize,
    name,
    columnSize,
  };
};

export default Gameboard;
