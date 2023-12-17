import React from "react";


interface Field {
  fieldType: string;
  position: number;
}

interface Player {
    name: string;
    field: number;
    previousField: number | null;
    joker: boolean;
    skipNextRound: boolean;
    lastGamingSituation: any;
  }
  

interface Props {
  id: string;
  noOfPlayers: number;
  fields: Field[];
  setNoOfPlayers: React.Dispatch<React.SetStateAction<number>>;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  response: any;

  setNextPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  nextPlayer: Player | undefined;
  players: Player[];
}

const Player: React.FC<Props> = ({
  id,
  noOfPlayers,
  setNoOfPlayers,
  setResponse,
  response,
  setFields,
  fields,
  setPlayers,
  players,
  nextPlayer,
  setNextPlayer
}) => {
  const options: number[] = [2, 3, 4];

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
  };

  const handleSelectChange = (value: string) => {
    setNoOfPlayers(parseInt(value));
    console.log(parseInt(value));
    callPlayers(id, parseInt(value));
    setPlayers([...players]);
    setNextPlayer(nextPlayer)
  };

  return (
    <div className="text">
      <label>Enter No. of Players: &nbsp;</label>

      <select
        id="selectBox"
        className="inp"
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Player;
