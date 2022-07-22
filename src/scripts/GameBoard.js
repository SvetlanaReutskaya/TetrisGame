export class GameBoard{
    
    constructor(figureFabric, canvas, context) {
        this.delay = ms => new Promise(res => setTimeout(res, ms));

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
        this.score = 0;
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
        let figureNextX = this.currentFigurePositionX + 1; 
        let figureNextY = this.currentFigurePositionY; 

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
        if(figureEndRow == this.field.length - 1)
            return true;

        for(let i = figureNextX; i < figureNextX + this.currentFigure.length; i++){
            for(let j = figureNextY; j< figureNextY + this.currentFigure[0].length; j++){
                if(i < this.field.length){
                    if(this.field[i][j] == 1 && this.currentFigure[i-figureNextX][j-figureNextY] == 1){
                        return true;
                    }
                }
            }
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

    async CountScores() {
        let dubbles = 0;
        for (let row = 0; row < this.field.length; row++) {
            let isFull = true;
            for (let col = 0; col < this.field[0].length; col++) {
                if (this.field[row][col] == 0) {
                    isFull = false;
                    break;
                }
            }
            if(isFull){
                dubbles+=1;
                this.score += 10 * dubbles;
                this.CollapseRow(row);
                this.DrawField();

                await this.delay(500);
            }
        }
    }

    CollapseRow(row){
        for (let i = row; i > 0; i--) {
            for (let j = 0; j < this.field[0].length; j++) {
                this.field[i][j] = this.field[i-1][j]
            }
        }

        for (let j = 0; j < this.field[0].length; j++) {
            this.field[0][j] = 0;
        }
    }

    async GameProcess(){
        
        this.CheckGameOver();
        while(!this.gameOver){ 
            this.currentFigure = this.figureQueue.pop();
            this.currentFigurePositionX = 0;
            this.currentFigurePositionY = 4;

            do{
                await this.delay(500);

                this.currentFigurePositionX += 1;
                this.DrawField();
            }
            while(!this.CheckIsFall());

            this.MakeFigureAsField();
            this.DrawField();

            await this.CountScores();

            this.figureQueue.push(this.figureFabric.GetNextFigure());
        }
    }

    CheckGameOver() {
        for (let j = 0; j < this.field[0].length; j++) {
            if(this.field[0][j] == 1)
                this.gameOver = true;
        }
        if(this.field[0][4] == 1){
            this.gameOver = true;

            context.fillStyle = 'black';
            context.globalAlpha = 0.5;
            context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
            context.globalAlpha = 1;
            context.fillStyle = 'white';
            context.font = '50px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('GAME OVER! YOURE SCORE: ' + this.score, canvas.width / 2, canvas.height / 2);
        }
    }
}