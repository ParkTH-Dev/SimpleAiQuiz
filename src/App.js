import styled from "styled-components";
import {
  generateQuiz,
  checkAnswer,
  QUIZ_CATEGORIES,
  DIFFICULTY_LEVELS,
} from "./config/openai";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  span {
    color: #3498db;
  }
`;

const QuizCard = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Question = styled.h2`
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.4;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }

  &:disabled {
    background-color: #f5f6fa;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  margin-bottom: 10px;
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
  animation: slideDown 0.5s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HintButton = styled(Button)`
  background-color: #f39c12;
  margin-top: 15px;
  width: auto;

  &:hover {
    background-color: #d68910;
  }
`;

const Hint = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: #fff3cd;
  border-radius: 10px;
  color: #856404;
  font-size: 15px;
  animation: fadeIn 0.3s ease;
  border-left: 4px solid #f39c12;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const GiveUpButton = styled(Button)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: ${(props) => (props.isCorrect ? "#e8f5e9" : "#ffebee")};
  border-radius: 10px;
  color: ${(props) => (props.isCorrect ? "#2e7d32" : "#c62828")};
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Category = styled.span`
  background-color: #f1c40f;
  color: #34495e;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 10px;
  font-weight: 500;
`;

const Difficulty = styled.span`
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

function App() {
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(QUIZ_CATEGORIES.COMMON);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [showHint, setShowHint] = useState(false);

  const handleGetQuiz = async () => {
    setLoading(true);
    try {
      const newQuiz = await generateQuiz(category, difficulty);
      setQuiz(newQuiz);
      setUserAnswer("");
      setResult(null);
    } catch (error) {
      console.error("Error:", error);
      alert("퀴즈를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, quiz.answer);
    setResult({
      isCorrect,
      explanation: quiz.explanation,
    });
  };

  const handleNewQuiz = async () => {
    setShowHint(false);
    await handleGetQuiz();
  };

  const handleGiveUp = () => {
    setResult({
      isCorrect: false,
      explanation: quiz.explanation,
      gaveUp: true,
    });
  };

  return (
    <Container>
      <Title>
        AI 퀴즈 챗봇 <span>🤖</span>
      </Title>

      <ControlPanel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.entries(QUIZ_CATEGORIES).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </Select>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </ControlPanel>

      <Button onClick={handleNewQuiz} disabled={loading}>
        {loading ? "퀴즈 생성 중..." : "새로운 퀴즈 받기"}
      </Button>

      {quiz && (
        <QuizCard>
          <div style={{ marginBottom: "15px" }}>
            <Category>{quiz.category}</Category>
            <Difficulty>{quiz.difficulty}</Difficulty>
          </div>
          <Question>{quiz.question}</Question>
          <form onSubmit={handleSubmitAnswer}>
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="답을 입력하세요..."
              disabled={result !== null}
            />
            <ButtonGroup>
              <Button
                type="submit"
                disabled={!userAnswer.trim() || result !== null}
              >
                정답 제출
              </Button>
              {!result && (
                <GiveUpButton type="button" onClick={handleGiveUp}>
                  포기하기 😢
                </GiveUpButton>
              )}
            </ButtonGroup>
          </form>

          {!result && !showHint && (
            <HintButton type="button" onClick={() => setShowHint(true)}>
              힌트 보기 💡
            </HintButton>
          )}

          {showHint && !result && <Hint>💡 힌트: {quiz.hint}</Hint>}

          {result && (
            <Result isCorrect={result.isCorrect}>
              <p>
                {result.gaveUp
                  ? "아쉽네요! 다음에는 꼭 맞춰보세요! 🤗"
                  : result.isCorrect
                  ? "정답입니다! 🎉"
                  : "틀렸습니다! 😅"}
              </p>
              <p>정답: {quiz.answer}</p>
              <p style={{ marginTop: "10px" }}>{result.explanation}</p>
            </Result>
          )}
        </QuizCard>
      )}
    </Container>
  );
}

export default App;
