import React from "react";

interface Props {
  response: any;
  setResponse: React.Dispatch<React.SetStateAction<{}>>;
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  setNextPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  nextPlayer: Player | undefined;
  players: Player[];
  fields: Field[];
}

interface Player {
  name: string;
  field: number;
  previousField: number | null;
  joker: boolean;
  skipNextRound: boolean;
  lastGamingSituation: any;
}

interface Field {
  fieldType: string;
  position: number;
}

const Board: React.FC<Props> = ({
  response,
  setResponse,
  fields,
  setFields,
  nextPlayer,
  players,
  setNextPlayer,
  setPlayers,
}) => {
  const cells = Array.from({ length: 30 }, (_, index) => index + 1);

  const bonusFields =
    Object.keys(response).length > 1
      ? response.fields.filter((x: Field) => x.fieldType == "BONUS")
      : {};
  const trapFields =
    Object.keys(response).length > 1
      ? response?.fields.filter((x: Field) => x.fieldType == "TRAP")
      : {};
  const bonusPstn = Object.keys(bonusFields).length
    ? bonusFields.map((x: Field) => x["position"])
    : {};
  const trapPstn = Object.keys(trapFields).length
    ? trapFields.map((x: Field) => x["position"])
    : {};

  console.log(bonusPstn);
  const nextPlayerName: string = nextPlayer ? nextPlayer.name : "";
    console.log(nextPlayerName)
  

  return (
    <div className="board">
      
      <div className="cell">Start</div>

      {bonusFields.length
        ? cells.map((cellNumber) => (
            <div
              key={cellNumber}
              style={{
                color: bonusPstn.includes(cellNumber)
                  ? "green"
                  : trapPstn.includes(cellNumber)
                  ? "red"
                  : "white",
              }}
              className="cell"
            >
              {
                nextPlayer?.field==cellNumber ?
                nextPlayerName :  ''
              } 
            </div>
          ))
        : cells.map((cellNumber) => (
            <div key={cellNumber} className="cell">{`Cell ${cellNumber}`}</div>
          ))}
      <div className="cell">End</div>
    </div>
  );
};

export default Board;
