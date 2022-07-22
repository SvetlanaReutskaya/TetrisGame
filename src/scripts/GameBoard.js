export class GameBoard{
    
    constructor(figureFabric) {
        this.figureFabric = figureFabric;
        this.figureQueue = Array(5).fill(this.figureFabric.GetNextFigure());
        this.currentFigure = null;
        this.currentFigurePositionX = null;
        this.currentFigurePositionY = null;
        this.field = Array(20).fill().map(()=>Array(10).fill(0))
        this.gameOver = false;
    }

    RotateFigure() {
        let N = this.currentFigure.length - 1;
        let newFigure = matrix.map((row, i) =>
          row.map((val, j) => matrix[N - j][i])
        );
        this.currentFigure = newFigure;
    }

    CheckFigureMove(move){
        let newY = this.currentFigurePositionY + move;

        if(newY >= 0 && newY < this.field[0].length){
            let check = true;
            for(let rowId = this.currentFigurePositionX; rowId < this.currentFigurePositionX + currentFigure.length; rowId++)
            {
                for(let colId = newY; colId < newY + currentFigure[0].length; colId++)
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
        let rowId = currentFigurePositionX + currentFigure.length + 1;

        for(let colId = this.currentFigurePositionY; colId < this.currentFigurePositionY + currentFigure[0].length; colId++)
        {
            if(this.field[rowId][colId] == 1)
            return true;
        }

        return false;
    }

    MakeFigureAsField(){
            for(let rowId = this.currentFigurePositionX; rowId < this.currentFigurePositionX + currentFigure.length; rowId++)
            {
                for(let colId = this.currentFigurePositionY; colId < this.currentFigurePositionY + currentFigure[0].length; colId++)
                {
                    this.field[rowId][colId] = this.currentFigure[rowId-this.currentFigurePositionX][colId-this.currentFigurePositionY];
                }
            }
            this.currentFigure = null;
            this.currentFigurePositionX = null;
            this.currentFigurePositionY = null;
    }

    DrowField(){

    }

    CheckUserMove(cellRow, cellCol) {
        return true;
    }

    GameProcess(){
        while(!this.gameOver){ 
            this.currentFigure = this.figureQueue.pop();
            this.currentFigurePositionX = 0;
            this.currentFigurePositionY = 4;
            this.DrawField();

            do{
                setTimeout(function () {
                    this.currentFigurePositionX += 1;
                    this.DrawField();
                }, 3000);
            }
            while(!this.CheckIsFall());

            this.MakeFigureAsField();
            this.DrawField();
            this.figureQueue.push(this.figureFabric.GetNextFigure());
        }
    }

    GameOver() {
        this.gameOver = true;
    }
}