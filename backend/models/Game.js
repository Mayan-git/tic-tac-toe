const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({

  board: {
    type: [String],
    required: true
  },

  winner: {
    type: String,
    required: true
  },

  isDraw: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Game", GameSchema);