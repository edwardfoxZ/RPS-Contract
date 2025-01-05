import React from "react";

export const GameCreation = ({ createGame, onChange, value, participant}) => {
  const isAddressValid = participant && /^0x[a-fA-F0-9]{40}$/.test(participant);
  return (
    <div className="GameCreation">
      <div>
        <button onClick={createGame} className="pointer btn">
          Create Game
        </button>
      </div>
      <span className="d-flex" style={{ marginTop: "20px" }}>
        participant
      </span>
      <div className="Input-Container">
        <input
          type="text"
          onChange={onChange}
          value={value}
          className={`Participant-Input d-flex ${
            !isAddressValid ? "input-danger" : "input-valid"
          }`}
          placeholder="Enter Ethereum address"
        />

        {!isAddressValid && value && (
          <span className="error-message">Invalid Ethereum address</span>
        )}
      </div>
    </div>
  );
};
