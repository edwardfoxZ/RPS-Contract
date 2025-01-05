import React from "react";
import { PiCoinBold } from "react-icons/pi";
import { IoMdContact } from "react-icons/io";

export const Nav = ({ creator, betSize, account, balance }) => {
  return (
    <>
      <nav className="Nav">
        <div className="Nav-Container">
          <span
            className={`d-flex ${betSize == 0 ? "text-red" : "text-green"}`}
          >
            <PiCoinBold /> Bet : {betSize}ETH
          </span>
          <span className="d-flex">
            <IoMdContact /> Creator: {creator}
          </span>
          <span className="d-flex" style={{ gap: "12px" }}>
            <p>
              <IoMdContact /> account: {account}...{" "}
            </p>
            <small className="text-green">balance: {balance}ETH</small>
          </span>
        </div>
      </nav>
    </>
  );
};
