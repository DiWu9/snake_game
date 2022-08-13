import React, { useState } from "react";

import "./Board.css";

class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor(value) {
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
    }
}

const BOARD_SIZE = 10;

const Board = () => {
  const [board, setBoard] = useState(
    new Array(BOARD_SIZE).fill(0).map((row) => new Array(BOARD_SIZE).fill(0))
  );

  return (
    <div className="Board">
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="row">
          {row.map((cell, cellIdx) => (
            <div
              key={cellIdx}
              className={`cell ${true ? "snake-cell" : ""}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
