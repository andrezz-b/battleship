import Ship from "./ship";

const Gameboard = (name, sizeX = 10, sizeY = 10) => {
  const grid = [];
  const ships = [];

  const populateBoard = () => {
    for (let i = 0; i < sizeX; i += 1) {
      grid.push([]);
      for (let j = 0; j < sizeY; j += 1) {
        grid[i].push({ type: "ocean", id: -1 });
      }
    }
  };

  const checkAvailableSpace = (posY, posX, shipLength, vert) => {
    let space;
    if (vert) {
      space = posY + shipLength - 1 < sizeX;
      if (space) {
        for (let i = 0; i < shipLength; i += 1) {
          if (grid[posY + i][posX].type === "ship") {
            space = false;
            break;
          }
        }
      }
    } else {
      space = posX + shipLength - 1 < sizeY;
      if (space) {
        for (let i = 0; i < shipLength; i += 1) {
          if (grid[posY][posX + i].type === "ship") {
            space = false;
            break;
          }
        }
      }
    }
    return space;
  };

  const placeShip = (posY, posX, shipLength, vert) => {
    if (!checkAvailableSpace(posY, posX, shipLength, vert)) return -1;
    if (vert) {
      for (let i = 0; i < shipLength; i += 1) {
        grid[posY + i][posX] = { type: "ship", id: ships.length, shipLocation: i };
      }
    } else {
      for (let i = 0; i < shipLength; i += 1) {
        grid[posY][posX + i] = { type: "ship", id: ships.length, shipLocation: i };
      }
    }
    ships.push(Ship(shipLength));
    return 0;
  };

  const receiveAttack = (posY, posX) => {
    if (
      posY < 0
      || posX < 0
      || posY >= sizeX
      || posX >= sizeY
      || grid[posY][posX].hit !== undefined
    ) {
      return -1;
    }
    grid[posY][posX].hit = grid[posY][posX].type === "ship";
    const currentPos = grid[posY][posX];
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
    sizeX,
    name,
    sizeY,
  };
};

export default Gameboard;
