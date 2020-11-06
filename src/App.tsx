import React, { ChangeEvent, useState } from 'react';
import { fetchQuizQuestions } from './Api';
// Components
import QuestionCard from './components/QuestionCard';

// Types
import { Difficulty, QuestionState } from './Api';

// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App: React.FC = () => {
  const TOTAL_QUESTIONS = 10;

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty);
    setQuestions(newQuestions);

    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) {
        setScore((prev) => prev + 1);
      }
      const answerObject = {
        question: questions[number].question,
        answer: answer,
        correct: correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const changeDifficulty = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'easy') {
      setDifficulty(Difficulty.EASY);
    }
    if (value === 'medium') {
      setDifficulty(Difficulty.MEDIUM);
    }
    setDifficulty(Difficulty.HARD);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1> React Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <div>
            <label className="label">Choose difficulty: </label>
            <select className="difficulty" onChange={changeDifficulty}>
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
            <br />
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          </div>
        ) : null}
        {!gameOver ? <p className="score">Score: {score} </p> : null}
        {loading ? <p className="loading">Loading Questions ...</p> : null}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
