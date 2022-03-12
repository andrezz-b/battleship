import Gameboard from "../modules/gameboard";

describe("Gameboard factory", () => {
  test("Gameboard with just ocean tiles", () => {
    const gameboard = Gameboard(undefined, 2, 2);
    expect(gameboard.getGrid()).toEqual([
      [
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
      ],
      [
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
      ],
    ]);
  });

  test("Non-square board shape", () => {
    const gameboard = Gameboard(undefined, 2, 3);
    expect(gameboard.getGrid()).toEqual([
      [
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
      ],
      [
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
        { type: "ocean", id: -1 },
      ],
    ]);
  });

  describe("Placing ships", () => {
    test("Placing 2 tile ship - horizontal", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      gameboard.placeShip(1, 0, 2, false);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ship", id: 0, shipLocation: 0 },
          { type: "ship", id: 0, shipLocation: 1 },
          { type: "ocean", id: -1 },
        ],
      ]);
    });

    test("Placing 2 tile ship - vertical", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      expect(gameboard.placeShip(0, 1, 2, true)).toBe(0);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ocean", id: -1 },
          { type: "ship", id: 0, shipLocation: 0 },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ocean", id: -1 },
          { type: "ship", id: 0, shipLocation: 1 },
          { type: "ocean", id: -1 },
        ],
      ]);
    });

    test("Placing ships without enough space", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      expect(gameboard.placeShip(1, 1, 2, true)).toBe(-1);
      expect(gameboard.placeShip(0, 2, 2, false)).toBe(-1);
    });

    test("Cannot place ships on top of each other", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      expect(gameboard.placeShip(0, 1, 2, true)).toBe(0);
      expect(gameboard.placeShip(0, 0, 3, false)).toBe(-1);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ocean", id: -1 },
          { type: "ship", id: 0, shipLocation: 0 },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ocean", id: -1 },
          { type: "ship", id: 0, shipLocation: 1 },
          { type: "ocean", id: -1 },
        ],
      ]);
    });

    test("Cannot place ships to adjecent ship tiles", () => {
      const gameboard = Gameboard(undefined, 8, 8);
      expect(gameboard.placeShip(1, 0, 3, false)).toBe(0);
      expect(gameboard.placeShip(2, 3, 1, false)).toBe(-1);
      expect(gameboard.placeShip(3, 3, 2, true)).toBe(0);
      expect(gameboard.placeShip(3, 1, 2, true)).toBe(0);
      expect(gameboard.placeShip(1, 7, 3, true)).toBe(0);
      expect(gameboard.placeShip(4, 6, 2, false)).toBe(-1);
      expect(gameboard.placeShip(4, 6, 3, false)).toBe(-1);
      expect(gameboard.placeShip(5, 2, 3, true)).toBe(-1);
      expect(gameboard.placeShip(7, 3, 3, false)).toBe(0);
      expect(gameboard.placeShip(6, 7, 2, true)).toBe(0);
      expect(gameboard.placeShip(0, 4, 2, true)).toBe(0);
    });

    test("Multiple ships with different ID", () => {
      const gameboard = Gameboard(undefined, 3, 3);
      gameboard.placeShip(0, 0, 2, false);
      gameboard.placeShip(2, 0, 3, false);
      expect(gameboard.getShips()[1].getLength()).toBe(3);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ship", id: 0, shipLocation: 0 },
          { type: "ship", id: 0, shipLocation: 1 },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ship", id: 1, shipLocation: 0 },
          { type: "ship", id: 1, shipLocation: 1 },
          { type: "ship", id: 1, shipLocation: 2 },
        ],
      ]);
    });
  });

  describe("Receiving attacks", () => {
    test("Attack that misses", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 0);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1, hit: false },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ocean", id: -1, hit: false },
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
        ],
      ]);
    });

    test("Attack that hits", () => {
      const gameboard = Gameboard(undefined, 2, 3);
      gameboard.placeShip(0, 0, 2);
      gameboard.receiveAttack(0, 1);
      expect(gameboard.getShips()[0].getHits()).toEqual([0, 1]);
      expect(gameboard.getGrid()).toEqual([
        [
          { type: "ship", id: 0, shipLocation: 0 },
          {
            type: "ship",
            id: 0,
            shipLocation: 1,
            hit: true,
          },
          { type: "ocean", id: -1 },
        ],
        [
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
          { type: "ocean", id: -1 },
        ],
      ]);
    });

    test("Invalid attack coordinates", () => {
      const gameboard = Gameboard(undefined, 2, 2);
      expect(gameboard.receiveAttack(-1, 1)).toBe(-1);
      expect(gameboard.receiveAttack(2, 1)).toBe(-1);
      expect(gameboard.receiveAttack(0, -1)).toBe(-1);
      expect(gameboard.receiveAttack(0, 2)).toBe(-1);
    });

    test("Hitting the same spot multiple times", () => {
      const gameboard = Gameboard(undefined, 2, 2);
      expect(gameboard.receiveAttack(0, 1)).toBe(0);
      expect(gameboard.receiveAttack(0, 1)).toBe(-1);
      expect(gameboard.receiveAttack(0, 0)).toBe(0);
    });

    test("Sinking a ship", () => {
      const gameboard = Gameboard(undefined, 3, 3);
      gameboard.placeShip(0, 0, 2);
      gameboard.placeShip(2, 0, 2);
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(2, 0);
      expect(gameboard.getShips()[0].isSunk()).toBeTruthy();
      expect(gameboard.getShips()[1].isSunk()).toBeFalsy();
    });

    test("Sinking all of the ships", () => {
      const gameboard = Gameboard(undefined, 2, 2);
      gameboard.placeShip(0, 0, 2);
      gameboard.placeShip(1, 0, 2);
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 0);
      gameboard.receiveAttack(1, 1);
      expect(gameboard.gameOver()).toBeTruthy();
    });
  });
});
