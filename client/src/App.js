import { useEffect, useState } from "react";
import "./App.css";
import { Moves } from "./utils/Moves";
import { Nav } from "./utils/Nav";
import { Web3 } from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import RPS from "./contracts/RPS.json";
import { GameCreation } from "./utils/GameCreation";

function App() {
  const [web3Api, setWeb3Api] = useState({
    contract: null,
    balance: null,
    web3: null,
    provider: null,
    isConnected: false,
  });
  const [accounts, setAccounts] = useState(null);
  const [creator, setCreator] = useState(null);
  const [betSize, setBetSize] = useState(null);
  const [games, setGames] = useState(null);
  const [participant, setParticipant] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(
          RPS.abi,
          "0x5CFC606FB889661dE11CB252C961c122Cd744064"
        );

        setWeb3Api((prev) => ({
          ...prev, // Preserve existing state
          web3,
          provider,
          contract,
        }));
      } else {
        console.error("Please, Install Metamask wallet.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const accounts = await web3Api.web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccounts(accounts[0]);

          const balance = await web3Api.web3.eth.getBalance(accounts[0]);
          setWeb3Api((prev) => ({
            ...prev, // Preserve existing state
            balance: web3Api.web3.utils.fromWei(balance, "ether"),
          }));
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    if (web3Api.web3) {
      getAccount();
    }
  }, [web3Api.web3]);

  useEffect(() => {
    const checkBeforeGame = async () => {
      if (web3Api.contract) {
        try {
          const game = await web3Api.contract.methods.games(0).call();
          const betSize = await web3Api.contract.methods.getBet(0).call();
          setGames(game);
          if (game) {
            const bet = betSize;
            setBetSize(web3Api.web3.utils.fromWei(bet, "ether"));
            setCreator(game.creator);
          } else {
            console.log("No active games found!");
          }
        } catch (error) {
          console.error("Error fetching game data:", error);
        }
      }
    };
    checkBeforeGame();
    setUpdate(true);
  }, [web3Api.contract]);

  const createGame = async () => {
    try {
      if (!web3Api.web3 || !web3Api.contract) {
        console.error("Web3 or contract is not initialized");
        alert("Please wait for Web3 and contract to initialize.");
        return;
      }

      if (!participant) {
        console.error("Participant address is required");
        alert("Please enter a participant address.");
        return;
      }

      if (!web3Api.web3.utils.isAddress(participant)) {
        console.error("Invalid address!");
        alert("Please enter a valid address.");
        return;
      }

      const betSize = "0.1";
      const betToWei = web3Api.web3.utils.toWei(betSize, "ether");

      await web3Api.contract.methods
        .createGame(participant)
        .send({ from: accounts, value: betToWei });

      console.log("Game created successfully!");
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const setRock = async () => {
    
  }

  return (
    <div className="App">
      <Nav
        betSize={betSize ? betSize.slice(0, 5) : "N/A"}
        creator={creator ? creator.slice(0, 5) : "N/A"}
        account={accounts ? accounts.slice(0, 9) : "N/A"}
        balance={web3Api.balance ? web3Api.balance.slice(0, 4) : "N/A"}
      />
      {games ? (
        <div className="Moves-Container">
          <h1>Your moves</h1>
          <Moves rock={setRock} paper={setPaper} scissors={setScissors}/>
        </div>
      ) : (
        <div className="GameC-Container">
          <GameCreation
            onChange={(e) => setParticipant(e.target.value)}
            value={participant}
            createGame={createGame}
            participant={participant}
          />
        </div>
      )}
    </div>
  );
}

export default App;
