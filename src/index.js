import './style.css';
import {FigureFabric} from './scripts/FigureFabric.js';
import {GameBoard} from './scripts/GameBoard.js';


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const fabric = new FigureFabric();
const board = new GameBoard(fabric);

board.GameProcess();

document.addEventListener('keydown', function(e) {
  
  if (board.gameOver) 
    return;
    
  // ^
  if (e === 38) {
    board.RotateFigure();
  }

  // <
  if (e === 37) {
    board.CheckFigureMove(-1);
  }

  // >
  if (e === 39) {
    board.CheckFigureMove(1);
  }

  // down
  if (e === 40) {
    board.MakeFigureAsField();
  }
});

/*
function myComponent(){
  const divElement = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.innerText = 'My first webpack setup';
  divElement.appendChild(h2);
  return divElement;
}
document.body.appendChild(myComponent());
*/