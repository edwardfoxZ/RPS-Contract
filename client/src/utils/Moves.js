import React from "react";
import {
  FaRegHandRock,
  FaRegHandPaper,
  FaRegHandScissors,
} from "react-icons/fa";

export const Moves = ({ rock, paper, scissors }) => {
  return (
    <div className="Moves">
      <div className="Card-Container">
        <span className="pointer" onClick={rock}>
          <FaRegHandRock fontSize="120px" />
        </span>
        <span className="pointer" onClick={paper}>
          <FaRegHandPaper fontSize="120px" />
        </span>
        <span className="pointer" onClick={scissors}>
          <FaRegHandScissors fontSize="120px" />
        </span>
      </div>
    </div>
  );
};
