const Ship = (length) => {
  const shipLength = length;
  const hitLocations = Array(shipLength).fill(0);

  const hit = (location) => {
    if (location < shipLength) {
      hitLocations[location] = 1;
    }
  };

  const getLength = () => shipLength;
  const getHits = () => hitLocations;
  const isSunk = () => hitLocations.reduce((prev, curr) => prev + curr, 0) === length;

  return {
    hit, getHits, isSunk, getLength,
  };
};

export default Ship;
