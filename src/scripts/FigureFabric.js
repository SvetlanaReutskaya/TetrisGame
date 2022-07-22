export class FigureFabric{
    figureTypes = {
      'A': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
      ],
      'B': [
        [0,1,0],
        [0,1,0],
        [1,1,0],
      ],
      'C': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
      ],
      'D': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
      ],
      'E': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
      ],
      'F': [
        [1,1],
        [1,1],
      ],
      'G': [
        [1]
      ]
  
    };
    constructor() {
        
    }
  
    GetNextFigure(){
      const sequence = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
      let figureName = sequence[this.getRandomInt(0, sequence.length)];
  
      return this.figureTypes[figureName];
    }
  
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  } 