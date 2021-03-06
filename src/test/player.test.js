import Player from "../modules/player";

describe("Player tests", () => {
  test("Fire attack on the enemy board", () => {
    const player = Player("Test");
    const mockBoard = {
      grid: [[{}, {}]],
      receiveAttack: (y, x) => {
        mockBoard.grid[y][x].hit = true;
      },
      checkHit: () => 0,
    };
    player.makeMove(0, 1, mockBoard);
    expect(mockBoard.grid).toEqual([[{}, { hit: true }]]);
  });

  test("AI making random moves", () => {
    const player = Player("computer");
    const mockBoard = {
      grid: [[{}, {}, {}, {}]],
      columnSize: 4,
      rowSize: 1,
      receiveAttack: (y, x) => {
        mockBoard.grid[y][x].hit = true;
      },
      checkHit: () => 0,
    };
    player.makeMove(undefined, undefined, mockBoard);
    expect(mockBoard.grid[0]).toContainEqual({ hit: true });
  });

  test("AI making multiple random moves on different spots", () => {
    const player = Player("computer");
    const mockBoard = {
      grid: [
        [{}, {}],
        [{}, {}],
      ],
      columnSize: 2,
      rowSize: 2,
      receiveAttack: (y, x) => {
        mockBoard.grid[y][x].hit = true;
      },
      checkHit: () => 0,
    };
    player.makeMove(undefined, undefined, mockBoard);
    player.makeMove(undefined, undefined, mockBoard);
    player.makeMove(undefined, undefined, mockBoard);
    player.makeMove(undefined, undefined, mockBoard);
    expect(mockBoard.grid).toEqual([
      [{ hit: true }, { hit: true }],
      [{ hit: true }, { hit: true }],
    ]);
  });
});
