import React,{useState,useEffect} from "react";
import "./Board.css";

import { io } from "socket.io-client";

import {
  getBestMove,
  checkWinner,
  checkDraw
} from "./ai";

const socket = io("https://tic-tac-toe-backend-jaep.onrender.com");

function Board(){

  const [mode,setMode]=useState("");

  const [board,setBoard]=useState([
    "","","","","","","","",""
  ]);

  const [player,setPlayer]=useState("X");

  const [winner,setWinner]=useState("");

  const [draw,setDraw]=useState(false);

  const [score,setScore]=useState({
    X:0,
    O:0
  });


  // SOCKET EVENTS
  useEffect(()=>{

    socket.on("update",(data)=>{

      if(mode==="multi"){

        setBoard(data.board);
        setPlayer(data.currentPlayer);

      }

    });

    socket.on("winner",(data)=>{

      if(mode==="multi"){

        setWinner(data);

        setScore(prev=>({
          ...prev,
          [data]:prev[data]+1
        }));

      }

    });

    socket.on("draw",()=>{

      if(mode==="multi"){
        setDraw(true);
      }

    });

  },[mode]);


  // PLAYER CLICK
  function handleClick(index){

    if(board[index]!==""||winner) return;

    if(mode==="ai"){

      playerMove(index);

    }
    else if(mode==="multi"){

      socket.emit("move",index);

    }

  }


  // AI MODE PLAYER MOVE
  function playerMove(index){

    let newBoard=[...board];

    newBoard[index]="X";

    setBoard(newBoard);

    if(checkWinner(newBoard)){

      setWinner("X");

      setScore(prev=>({
        ...prev,
        X:prev.X+1
      }));

      return;

    }

    if(checkDraw(newBoard)){

      setDraw(true);
      return;

    }

    setTimeout(()=>aiMove(newBoard),300);

  }


  // AI MOVE
  function aiMove(currentBoard){

    let bestMove=getBestMove(currentBoard);

    if(bestMove===-1) return;

    let newBoard=[...currentBoard];

    newBoard[bestMove]="O";

    setBoard(newBoard);

    if(checkWinner(newBoard)){

      setWinner("O");

      setScore(prev=>({
        ...prev,
        O:prev.O+1
      }));

      return;

    }

    if(checkDraw(newBoard)){

      setDraw(true);

    }

  }


  // RESTART
  function restart(){

    setBoard([
      "","","","","","","","",""
    ]);

    setWinner("");
    setDraw(false);

    if(mode==="multi"){
      socket.emit("restart");
    }

  }


  // MODE SELECTION SCREEN
  if(mode===""){

    return(

      <div className="container">

        <h1>Tic Tac Toe Pro</h1>

        <button onClick={()=>setMode("ai")}>
          Play vs AI 🤖
        </button>

        <button onClick={()=>setMode("multi")}>
          Multiplayer 👥
        </button>

      </div>

    );

  }


  // GAME SCREEN
  return(

    <div className="container">

      <h1>Tic Tac Toe Pro</h1>

      <div className="scoreboard">

        <span>X: {score.X}</span>
        <span>O: {score.O}</span>

      </div>

      {winner==="X" && <h2 className="winner">X Wins 🎉</h2>}
      {winner==="O" && <h2 className="winner">O Wins 🎉</h2>}
      {draw && <h2 className="draw">Draw Game</h2>}

      <div className="board">

        {board.map((cell,index)=>(
          <div
            key={index}
            className="cell"
            onClick={()=>handleClick(index)}
          >
            {cell}
          </div>
        ))}

      </div>

      <button onClick={restart}>
        Restart
      </button>

      <button onClick={()=>window.location.reload()}>
        Change Mode
      </button>

    </div>

  );

}

export default Board;
