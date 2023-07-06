import React, { useEffect, useState } from "react";
import "./Game.css";

const Game: React.FC = () => {
  const [matches, setMatches] = useState<number>(25);
  const [playerMatches, setPlayerMatches] = useState<number>( 0);
  const [aiMatches, setAiMatches] = useState<number>(0);
  const [winner, setWinner] = useState<string>("");
  const [error, setError] = useState <boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [firstTurn, setFirstTurn] = useState<string>("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setFirstTurn("AI");
  };

  const reset = () => {
    setMatches(25);
    setPlayerMatches(0);
    setAiMatches(0);
    setWinner("");
    setIsChecked(false);
    setFirstTurn("");
  };

  const getRandomNumber = (firstNumber: number, secondNumber: number) => {
    const random = Math.random();
    if (random < 0.5) {
      return firstNumber;
    } else {
      return secondNumber;
    }
  };

  const makeMove = (numMatches: number) => {
		setError(false)
    const remainingMatches = matches - numMatches;
    if (remainingMatches < 0) {
      setError(true);
      return;
    }

    setMatches((matches) => matches - numMatches);
    setPlayerMatches((playerMatches) => playerMatches + numMatches);

    aiMove(remainingMatches);
  };

  const aiMove = (remainingMatches: number) => {
		setError(false)
		// якщо сірники закінчилися, то ШІ нічого не робить
    if (remainingMatches <= 0) return;

    let newAiMatches: number;

		// загалом по грі та ж логіка, але якщо число всіх сірників більше 3-ох, то ШІ може вибрати 3.
    if (aiMatches % 2 === 0) {
      newAiMatches = 2;
    } else {
      newAiMatches = getRandomNumber(1, 3);
    }

		// Якщо залишилося менше 3-ох сірників, то ШІ намагається отримати парне число собі у рахунок
    if (remainingMatches <= 3) {
      newAiMatches = aiMatches % 2 === 0 ? 2 : 1;
    }

		// Якщо залишився один сірник, то і вибрати можна лише один
    if (remainingMatches === 1) {
      newAiMatches = 1;
    }

		/* На перших ходах ШІ буде брати рандомні числа (щоб додати різноманіття), 
		надалі він буде намагатися щоб його результат був парним.*/
		if (remainingMatches > 20) {
			newAiMatches = Math.floor(Math.random() * (3 - 1 + 1)) +1
		}

    setMatches((oldMatches) => oldMatches - newAiMatches);
    setAiMatches((oldAiMatches) => oldAiMatches + newAiMatches);
  };

  useEffect(() => {
    if (matches <= 0) {
      playerMatches % 2 === 0 ? setWinner("Player") : setWinner("AI");
    }
    if (matches === 25 && firstTurn === "AI") {
      aiMove(matches);
    }
  }, [matches, firstTurn]);

  return (
    <main className="game">
      <h1>Game of Matches</h1>
      <div className="checkbox-container">
        <div className="round">
          <input
            type="checkbox"
            checked={isChecked}
            id="checkbox"
            onChange={handleCheckboxChange}
          />
          <label htmlFor="checkbox"></label>
        </div>
        <p>AI first turn</p>
      </div>

      <p>Matches Remaining: {matches}</p>
      <p>Player Matches: {playerMatches}</p>
      <p>AI Matches: {aiMatches}</p>
      {error && <p className="error">Choose correct number of matches</p>}
      {winner ? (
        <h2>{winner} Wins!</h2>
      ) : (
        <div className="buttons">
          <button onClick={() => makeMove(1)}>Take 1 Match</button>
          <button onClick={() => makeMove(2)}>Take 2 Matches</button>
          <button onClick={() => makeMove(3)}>Take 3 Matches</button>
        </div>
      )}
      <div className="matches">
        {[...Array(matches > 0 ? matches : 0)].map((_, index) => (
          <span key={index}>🔥</span>
        ))}
      </div>
      <div>
        <button onClick={reset}>reset</button>
      </div>
    </main>
  );
};

export default Game;
