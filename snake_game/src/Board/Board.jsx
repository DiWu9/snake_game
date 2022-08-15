import React, { useState } from "react";
import { randomIntFromInterval, useInterval } from "../lib/utils.js";

import "./Board.css";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}

const BOARD_SIZE = 15;

const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};

const Board = () => {

  const [board, setBoard] = useState(createBoard(BOARD_SIZE));
  const [score, setScore] = useState(0);
  const [delay, setDelay] = useState(150);
  const [snake, setSnake] = useState(new LinkedList(getStartSnakeHead(board)));
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value.cell]));
  const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5);
  const [direction, setDirection] = useState(Direction.RIGHT);

  useInterval(() => {
    moveSnake();
  }, delay);

  const moveSnake = () => {
    const currHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };
    const nextHeadCoords = getNextCoordinate(currHeadCoords, direction);

    // snake is out of map
    if (isOutOfBound(nextHeadCoords, board)) {
      handleGameOver();
      return;
    }
    const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
    // snake eats itself
    if (snakeCells.has(nextHeadCell)) {
      handleGameOver();
      return;
    }

    // update snake cell set
    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.value.cell);
    newSnakeCells.add(nextHeadCell);
    setSnakeCells(newSnakeCells);

    // update snake linked list
    const nextHead = new LinkedListNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadCell,
    });
    snake.head.next = nextHead;
    snake.head = nextHead;

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;
  };

  const handleFoodConsumption = () => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue;
      break;
    }
  };

  const handleGameOver = () => {

  };

  return (
    <div>
      <div className="Board">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => (
              <div
                key={cellIdx}
                className={`cell ${
                  snakeCells.has(cellValue) ? "snake-cell" : ""
                }`}
              >
                {cellValue}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="BoardInfo">
        <div>Score: 0</div>
      </div>
    </div>
  );
};

const createBoard = (BOARD_SIZE) => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
};

const getStartSnakeHead = (board) => {
  const rowSize = board.length;
  const colSize = board[0].length;
  const startRow = Math.round(rowSize / 3);
  const startCol = Math.round(colSize / 3);
  const startCell = board[startRow][startCol];
  return {
    row: startRow,
    col: startCol,
    cell: startCell,
  };
};

const getNextCoordinate = (currCoord, direction) => {
  if (direction === Direction.UP) {
    return {
      row: currCoord.row - 1,
      col: currCoord.col,
    };
  }
  if (direction === Direction.DOWN) {
    return {
      row: currCoord.row + 1,
      col: currCoord.col,
    };
  };
  if (direction === Direction.LEFT) {
    return {
      row: currCoord.row,
      col: currCoord.col - 1,
    };
  };
  if (direction === Direction.RIGHT) {
    return {
      row: currCoord.row,
      col: currCoord.col + 1,
    };
  };
};

const isOutOfBound = (currCoord, board) => {
  const {row, col} = currCoord;
  if (row < 0 || row >= board.length) return true;
  if (col < 0 || col >= board[0].length) return true;
  return false;
}

const getDirectionFromKey = (key) => {
  if (key === "ArrowUp") return Direction.UP;
  if (key === "ArrowDown") return Direction.DOWN;
  if (key === "ArrowLeft") return Direction.LEFT;
  if (key === "ArrowRight") return Direction.RIGHT;
  return "";
};

export default Board;
