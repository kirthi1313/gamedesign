import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Player from "./Player";
import Board from "./Board";

interface Field {
  fieldType: string;
  position: number;
}
interface IPlayer {
  name: string;
  field: number;
  previousField: number | null;
  joker: boolean;
  skipNextRound: boolean;
  lastGamingSituation: any;
}

function App() {
  const [id, setid] = useState("");
  const [noOfPlayers, setNoOfPlayers] = useState(0);
  const [response, setResponse] = useState({});
  const [fields, setFields] = useState<Field[]>([]);
  const [nextPlayer, setNextPlayer] = useState<IPlayer | undefined>();
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [gameOver,setGameOver] = useState<IPlayer | undefined>();
  

  const getGame = async () => {
    try {
      const response = await fetch("http://assessment.tabit-gmbh.de/start");
      const id = await response.text();
      setid(id);
      callPlayers(id,2)
     
      console.log(id);
    } catch (err) {
      console.log(err);
    }
  };

  const callPlayers = async (id: string, noOfPlayers: number) => {
    const obj = {
      id: id,
      numberOfPlayers: noOfPlayers,
    };
    const response = await fetch("http://assessment.tabit-gmbh.de/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    setResponse({ ...json });
    setFields([...json.fields]);
    setPlayers([...json.players]);
    setNextPlayer({...json.nextPlayer})
    console.log('in', nextPlayer)

  };

  const getNext = async(id: string, currentPlayer: string, numberOfDice: number) => {
    console.log('###',currentPlayer)
    const obj = {
      "id": id,
      "player": currentPlayer,
      "numberOfDice": numberOfDice
    }

    const response = await fetch("http://assessment.tabit-gmbh.de/next", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    if(json.winner){
      setGameOver(json.winner)
    }
    console.log(json);
  }

  const rollDice =() => {
    console.log('----',nextPlayer)
    setNextPlayer(nextPlayer)
    if(nextPlayer){
      setCurrentPlayer(nextPlayer.name)
    }
    const randomNum: number = Math.floor(Math.random()*6)+1
    getNext(id, currentPlayer,randomNum)
  }

  useEffect(() => {
    getGame();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Alexandria {id}</p>
      </header>
      <Player
        id={id}
        noOfPlayers={noOfPlayers}
        setNoOfPlayers={setNoOfPlayers}
        response={response}
        setResponse={setResponse}
        fields={fields}
        setFields={setFields}
        players={players}
        setPlayers={setPlayers}
        nextPlayer={nextPlayer}
        setNextPlayer={setNextPlayer}
      ></Player>

      <p style={{color:"green"}}>
        <span>Winner: {gameOver?.name}</span>
      </p>

      <p style={{color:"white"}}>
        <span>Current Player: {currentPlayer}</span>
      </p>
      {gameOver ? 
      <p style={{color:"red"}}>
        <span>Game Over </span>
      </p> : <p style={{color:"green"}}>
        <span>Game In progress </span>
      </p>}

      <p>
        <button className="btn" onClick={rollDice}> Play </button>
      </p>

      <Board
        response={response}
        fields={fields}
        setFields={setFields}
        setResponse={setResponse}
        nextPlayer={nextPlayer}
        setNextPlayer={setNextPlayer}
        players={players}
        setPlayers={setPlayers}
      ></Board>
    </div>
  );
}

export default App;
