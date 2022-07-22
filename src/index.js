import './style.css';
import {FigureFabric} from './scripts/FigureFabric.js';
import {GameBoard} from './scripts/GameBoard.js';


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const fabric = new FigureFabric();
const board = new GameBoard(fabric, canvas, context);

board.GameProcess();

document.addEventListener('keydown', function(e) {
  
  if (board.gameOver) 
    return;
    
  // ^
  if (e.key === 'ArrowUp') {
    board.RotateFigure();
  }

  // <
  if (e.key === 'ArrowLeft') {
    board.CheckFigureMove(-1);
  }

  // >
  if (e.key === 'ArrowRight') {
    board.CheckFigureMove(1);
  }
});