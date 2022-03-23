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
    computer.makeMove(0, 0, playerBoard);
    player.makeMove(row, column, computerBoard);
    displayController.updateBoard(playerBoard, computerBoard);
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
