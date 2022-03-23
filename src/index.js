import "./styles/main.scss";
import PubSub from "pubsub-js";
import Player from "./modules/player";
import Gameboard from "./modules/gameboard";
import displayController from "./modules/displayController";

const PLAYER_NAME = "player";
const COMPUTER_NAME = "computer";

const gameLoop = (() => {
  const playerBoard = Gameboard(PLAYER_NAME);
  const computerBoard = Gameboard(COMPUTER_NAME);
  const player = Player(PLAYER_NAME);
  const computer = Player(COMPUTER_NAME);

  const setup = () => {
    playerBoard.placeRandom();
    computerBoard.placeRandom();
    displayController.renderPlayer(playerBoard);
    displayController.renderPlayer(computerBoard);
  };

  const playRound = (tag, data) => {
    const { row, column } = data;
    if (player.makeMove(row, column, computerBoard) === -1) return -1;
    computer.makeMove(0, 0, playerBoard);
    displayController.updateBoard(playerBoard, computerBoard);
    return 0;
  };

  const init = () => {
    setup();
    PubSub.subscribe("play-round", playRound);
  };

  return {
    init,
  };
})();

gameLoop.init();
