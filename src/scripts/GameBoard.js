export class GameBoard{
    
    constructor(figureFabric, canvas, context) {
        this.canvas = canvas;
        this.context2d = context;

        this.figureFabric = figureFabric;
        this.figureQueue = Array(5);
        for(let i=0; i<5; i++)
            this.figureQueue.push(this.figureFabric.GetNextFigure());

        this.currentFigure = null;
        this.currentFigurePositionX = null;
        this.currentFigurePositionY = null;
        this.field = Array(20).fill().map(()=>Array(10).fill(0))
        this.gameOver = false;
    }

    RotateFigure() {
        let N = this.currentFigure.length - 1;
        let newFigure = this.currentFigure.map((row, i) =>
          row.map((val, j) => this.currentFigure[N - j][i])
        );
        this.currentFigure = newFigure;
    }

    CheckFigureMove(move){
        let newY = this.currentFigurePositionY + move;

        if(newY >= 0 && newY < this.field[0].length){
            let check = true;
            for(let rowId = this.currentFigurePositionX; rowId < this.currentFigurePositionX + this.currentFigure.length; rowId++)
            {
                for(let colId = newY; colId < newY + this.currentFigure[0].length; colId++)
                {
                    if(this.field[rowId][colId] == 1 && this.currentFigure[rowId-this.currentFigurePositionX][colId-newY] == 1){
                        check = false;
                    }
                }
            }
            if(check){
                this.currentFigurePositionY = newY;
            }
        }
    }

    CheckIsFall(){
        let figureEndRow = this.currentFigurePositionX;
        
        for(let i = this.currentFigure.length - 1; i >= 0; i--){
            let isempty = true;
            for(let j = 0; j<this.currentFigure[0].length; j++){
                if(this.currentFigure[i][j] == 1)
                    isempty = false;
            }
            if(!isempty){
                figureEndRow = this.currentFigurePositionX + i;
                break;
            }
        }

        let rowId = figureEndRow + 1;

        if(figureEndRow == this.field.length - 1)
            return true;

        for(let colId = this.currentFigurePositionY; colId < this.currentFigurePositionY + this.currentFigure[0].length; colId++)
        {
            if(this.field[rowId][colId] == 1)
            return true;
        }

        return false;
    }

    MakeFigureAsField(){
            for(let rowId = this.currentFigurePositionX; rowId < this.currentFigurePositionX + this.currentFigure.length; rowId++)
            {
                for(let colId = this.currentFigurePositionY; colId < this.currentFigurePositionY + this.currentFigure[0].length; colId++)
                {
                    if(this.currentFigure[rowId-this.currentFigurePositionX][colId-this.currentFigurePositionY] == 1)
                        this.field[rowId][colId] = this.currentFigure[rowId-this.currentFigurePositionX][colId-this.currentFigurePositionY];
                }
            }
            this.currentFigure = null;
            this.currentFigurePositionX = null;
            this.currentFigurePositionY = null;
    }

    DrawField(){
        this.context2d.clearRect(0,0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.field.length; row++) {
            for (let col = 0; col < this.field[0].length; col++) {
                if (this.field[row][col] == 1) {
                    this.context2d.fillStyle = 'blue';
                    this.context2d.fillRect(col * 32, row * 32, 32-1, 32-1);
                }
            }
        }

        if(this.currentFigure){
            for(let rowId = this.currentFigurePositionX; rowId < this.currentFigurePositionX + this.currentFigure.length; rowId++)
            {
                for(let colId = this.currentFigurePositionY; colId < this.currentFigurePositionY + this.currentFigure[0].length; colId++)
                {
                    if (this.currentFigure[rowId-this.currentFigurePositionX][colId-this.currentFigurePositionY] == 1) {
                        this.context2d.fillStyle = 'yellow';
                        this.context2d.fillRect(colId * 32, rowId * 32, 32-1, 32-1);
                    }
                }
            }
        }
    }

    CheckUserMove(cellRow, cellCol) {
        return true;
    }

    async GameProcess(){

        const delay = ms => new Promise(res => setTimeout(res, ms));

        this.CheckGameOver();
        while(!this.gameOver){ 
            this.currentFigure = this.figureQueue.pop();
            this.currentFigurePositionX = 0;
            this.currentFigurePositionY = 4;

            do{
                await delay(1000);

                this.currentFigurePositionX += 1;
                this.DrawField();
            }
            while(!this.CheckIsFall());

            this.MakeFigureAsField();
            this.DrawField();
            this.figureQueue.push(this.figureFabric.GetNextFigure());
        }
    }

    CheckGameOver() {
        if(this.field[0][4] == 1){

            this.gameOver = true;
        }
    }
}