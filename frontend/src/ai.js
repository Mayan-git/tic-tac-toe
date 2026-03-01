export function checkWinner(board){

  const patterns=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let [a,b,c] of patterns){

    if(board[a] &&
       board[a]===board[b] &&
       board[a]===board[c]){

       return board[a];

    }
  }

  return null;
}


export function checkDraw(board){

  return board.every(cell=>cell!=="");

}


// MINIMAX AI
export function getBestMove(board){

  function minimax(board,isMax){

    const winner = checkWinner(board);

    if(winner==="O") return 10;
    if(winner==="X") return -10;
    if(checkDraw(board)) return 0;

    if(isMax){

      let best=-Infinity;

      for(let i=0;i<9;i++){

        if(board[i]===""){

          board[i]="O";

          best=Math.max(
            best,
            minimax(board,false)
          );

          board[i]="";

        }
      }

      return best;

    }
    else{

      let best=Infinity;

      for(let i=0;i<9;i++){

        if(board[i]===""){

          board[i]="X";

          best=Math.min(
            best,
            minimax(board,true)
          );

          board[i]="";

        }
      }

      return best;

    }

  }

  let bestScore=-Infinity;
  let move=-1;

  for(let i=0;i<9;i++){

    if(board[i]===""){

      board[i]="O";

      let score=minimax(board,false);

      board[i]="";

      if(score>bestScore){

        bestScore=score;
        move=i;

      }

    }

  }

  return move;

}