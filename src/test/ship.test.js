import Ship from "../modules/ship";

describe("Ship factory", () => {
  test("Initialize empty hit locations", () => {
    const ship = Ship(5);
    expect(ship.getHits()).toEqual([0, 0, 0, 0, 0]);
  });

  test("Get ship length", () => {
    const ship = Ship(3);
    expect(ship.getLength()).toBe(3);
  });

  test("Hitting a location", () => {
    const ship = Ship(5);
    ship.hit(2);
    expect(ship.getHits()).toEqual([0, 0, 1, 0, 0]);
  });

  test("Ship is sunk", () => {
    const ship = Ship(3);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBeTruthy();
  });

  test("Ship isn't sunk", () => {
    const ship = Ship(3);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBeFalsy();
  });

  test("Only 1 hit per location", () => {
    const ship = Ship(5);
    ship.hit(0);
    ship.hit(0);
    ship.hit(3);
    expect(ship.getHits()).toEqual([1, 0, 0, 1, 0]);
  });

  test("Hits cannot land on non existing locations", () => {
    const ship = Ship(3);
    ship.hit(0);
    ship.hit(4);
    expect(ship.getHits()).toEqual([1, 0, 0]);
  });
});
