// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

contract RPS {
    enum State {
        CREATED,
        JOINED,
        COMMITED,
        REVEALED
    }
    struct Game {
        uint id;
        uint bet;
        address creator;
        address payable [] players;
        State state;
    }
    struct Move {
        bytes32 hash;
        uint value;
    }
    uint gameId;
    mapping (uint => Game) public games;
    mapping (uint => mapping (address => Move)) public moves;
    mapping (uint => uint) public winningMoves;

    constructor () {
        //1 rock
        //2 paper
        //3 scissors
        winningMoves[1] = 2;
        winningMoves[2] = 3;
        winningMoves[3] = 1;
    }

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
                msg.sender,
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

    function commitMove (uint _gameId, uint moveId, uint salt)
        external
        {
            Game storage game = games[_gameId];
            require(game.state == State.JOINED, "players must joined the game");
            require(game.players[0] == msg.sender || game.players[1] == msg.sender, "players must be msg.sender");
            require(moveId == 1 || moveId == 2 || moveId == 3, "move id must be either 1,2 or 3");
            moves[_gameId][msg.sender] = Move(keccak256(abi.encodePacked(moveId, salt)), 0);
            if(
                moves[_gameId][game.players[0]].hash != 0
                && 
                moves[_gameId][game.players[1]].hash != 0
            )
            {
                game.state = State.COMMITED;
            }
    }

    function revealMove (uint _gameId, uint moveId, uint salt) 
        external
        payable
        {
            Game storage game = games[_gameId];
            Move storage move1 = moves[_gameId][game.players[0]];
            Move storage move2 = moves[_gameId][game.players[1]];
            Move storage moveSender = moves[_gameId][msg.sender];
            require(game.state == State.COMMITED, "players must commited the moves");
            require(game.players[0] == msg.sender || game.players[1] == msg.sender, "players must be msg.sender");
            require(moveSender.hash == keccak256(abi.encodePacked(moveId, salt)), "movedId does not match the commitment");
            moveSender.value = moveId;

            if(
                move1.value != 0 && move2.value != 0
            )
            {
                if(move1.value == move2.value){
                    game.players[0].transfer(game.bet);
                    game.players[1].transfer(game.bet);
                    game.state == State.REVEALED;
                    return;
                }
                address payable winner;
                winner = winningMoves[move1.value] == winningMoves[move2.value] ? game.players[0] : game.players[1];
                winner.transfer(2 * game.bet);
                game.state = State.REVEALED;
            }
    }


/**
 * @dev get functions for getting better to track the game status
 */

    function getBet(uint _gameId) public view returns (uint) {
        Game storage game = games[_gameId];
        return game.bet;
    }

    function getCreator(uint _gameId) public view returns(address) {
        Game storage game = games[_gameId];
        return game.creator;
    }

}