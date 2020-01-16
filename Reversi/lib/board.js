let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = [];
  for (let i = 0; i < 8; i++) {
    let subArr = new Array(8);
    grid.push(subArr);
  }
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  //
  // grid[3][2] = new Piece("white");
  // grid[3][1] = new Piece("white");

  return grid;
};

grid = new Board();
console.log(grid);


/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
};

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  row = pos[0];
  col = pos[1];
  if (!this.isValidPos(pos)) {
    throw new Error('Not valid pos!');
  }
  return this.grid[row][col];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (!this.isOccupied(pos)) {
    return false;
  } else {
    return this.getPiece(pos).color === color;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.getPiece(pos)) {
    return true;
  } else {
    return false;
  }

};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (!this.hasMove('white') && !this.hasMove('black')) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return (pos[0] < 8 && pos[0] >= 0) && (pos[1] < 8 && pos[1] >= 0);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  piecesToFlip = [];  

  let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];

  if (!board.isValidPos(nextPos)) {
    return null;
  } else if (!board.isOccupied(nextPos)) {
    return null;
  } else if (board.isMine(nextPos, color)) {
    return piecesToFlip;
  } else {
    piecesToFlip.push(nextPos);
    return piecesToFlip.concat(_positionsToFlip(board, nextPos, color, dir, piecesToFlip));
  }
  // return piecesToFlip;
};

// [], [[3,3]] [[3,2], [[3,3], []]]
// [[3,1], [[3,2], [[3,3], []]]]

console.log(_positionsToFlip(grid, [3,0], 'black', [0,1]));

  //piecesToFlip.push(subarray)
  // [x,y] y++ , y-- moving up/down
  // [x,y] x++, x-- moving right//left
  // [x,y] x++ y++, x-- y-- diag right
  // [x,y] x++ y--, x-- y++ diag left

  //place a piece on the board
  //check in all directions and 
    //reject if space is empty or has piece of same color.
    //case where ajacent piece is not same color...
      // check another space down, and keep checking until...
        //hit piece of own color
            //add flippable positions to array
        //do not hit piece of own color
            //reject everything
  //push our subarray into piecesToFlip array



// pos = [3, 3]
// dir = [0,1] = Board.DIRS[0]
// board = self.grid
// color = self.color

//1st is it a valid position (ie is it on the board)
//2nd is it not occupied? 
  //return empty array
//3rd is it my color?  
  //if my color, we do some thing
    //return piecesToFlip
  //if not my color
    //add position to piecesToFlip
    //keep moving and start checks from 1st again 

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let row = pos[0];
  let col = pos[1];
  let positions = [];
  if (!this.validMove(pos)) {
    throw new Error('Invalid move');
  };

  for (let i = 0; i < Board.DIRS.length; i++) {
    if (_positionsToFlip(this, pos, color, Board.DIRS[i])) {
      positions.concat(_positionsToFlip(this, pos, color, Board.DIRS[i]));
    }
  }

  positions.forEach(position => this.grid[position[0], position[1]] = new Piece(color));

  this.grid[row][col] = new Piece(color);
  
};

// Board.DIRS = [
  
  /**
   * Prints a string representation of the Board to the console.
   */
  Board.prototype.print = function () {
    
  };
  
  /**
   * Checks that a position is not already occupied and that the color
   * taking the position will result in some pieces of the opposite
   * color being flipped.
   */
  Board.prototype.validMove = function (pos, color) {
    debugger;
    if (this.isOccupied(pos)) {
      return false;
    };
    //   [ 0,  1], [ 1,  1], [ 1,  0], [ 1, -1], [ 0, -1], [-1, -1], [-1,  0], [-1,  1] ];
    for (let i = 0; i < Board.DIRS.length; i++) {
      let flipMe = _positionsToFlip(this, pos, color, Board.DIRS[i]);

      if (flipMe) {
        return true;
      }
    }
    return false;
  };

// console.log(grid.validMove([2,3], 'black'));
console.log(grid.validMove([2,3], 'white'));

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const moves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color)) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
};

module.exports = Board;
