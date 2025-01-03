// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

contract RPS {
    enum State {
        CREATED,
        JOINED
    }

    struct Game {
        uint id;
        uint bet;
        address payable [] players;
        State state;
    }
    uint gameId;
    mapping (uint => Game) public games;

    function createGame(address payable participant) 
        external
        payable 
        {
            require(msg.value > 0, "need some ether to send");
            address payable[] memory players = new address payable [] (2);
            players[0] = payable (msg.sender);
            players[1] = participant;
            
            games[gameId] = Game(
                gameId,
                msg.value,
                players,
                State.CREATED
            );
            gameId++;
    }

    function joinGame (uint _gameId)
        external
        payable
        {
            Game storage game = games[_gameId];
            require(game.players[1] == msg.sender, "sender must be msg.sender");
            require(msg.value >= game.bet, "need to be much more than bet");
            require(game.state == State.CREATED, "game must be created before");
            if(msg.value > game.bet){
                payable (msg.sender).transfer(msg.value - game.bet);
            }
            game.state = State.JOINED;

    }

}