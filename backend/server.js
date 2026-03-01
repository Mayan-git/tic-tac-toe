const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("Server running 🚀");
});

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

// GLOBAL GAME STATE
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;

// SOCKET
io.on("connection",(socket)=>{

  console.log("User connected:",socket.id);

  // send state
  socket.emit("update",{
    board,
    currentPlayer,
    gameActive
  });

  // move
  socket.on("move",(index)=>{

    if(!gameActive) return;

    if(board[index] !== "") return;

    board[index] = currentPlayer;

    const winner = checkWinner(board);

    if(winner){

      gameActive=false;

      io.emit("winner",winner);

    }
    else if(checkDraw(board)){

      gameActive=false;

      io.emit("draw");

    }
    else{

      currentPlayer =
        currentPlayer==="X"?"O":"X";

    }

    io.emit("update",{
      board,
      currentPlayer,
      gameActive
    });

  });

  // restart
  socket.on("restart",()=>{

    board=["","","","","","","","",""];

    currentPlayer="X";

    gameActive=true;

    io.emit("update",{
      board,
      currentPlayer,
      gameActive
    });

  });

});

// winner check
function checkWinner(board){

  const patterns=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let [a,b,c] of patterns){

    if(
      board[a] &&
      board[a]===board[b] &&
      board[a]===board[c]
    ){
      return board[a];
    }

  }

  return null;
}

// draw check
function checkDraw(board){

  return board.every(cell=>cell!=="")

}

// DB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// start
server.listen(5000,()=>{
  console.log("Server running on port 5000");
});