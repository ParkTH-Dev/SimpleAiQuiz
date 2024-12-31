import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const QUIZ_CATEGORIES = {
  COMMON: "일반상식",
  HISTORY: "역사",
  SCIENCE: "과학",
  GEOGRAPHY: "지리/수도",
  NONSENSE: "넌센스",
  CULTURE: "문화/예술",
  SPORTS: "스포츠",
  NATURE: "자연/동물",
};

export const DIFFICULTY_LEVELS = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

const normalizeString = (str) => {
  return str.toLowerCase().replace(/\s+/g, "").normalize("NFC");
};

const checkAnswer = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeString(userAnswer);
  const normalizedCorrect = normalizeString(correctAnswer);

  if (normalizedUser === normalizedCorrect) return true;

  const keywords = correctAnswer
    .split(",")
    .map((keyword) => normalizeString(keyword.trim()));

  return keywords.some((keyword) => normalizedUser.includes(keyword));
};

export const generateQuiz = async (
  category = QUIZ_CATEGORIES.COMMON,
  difficulty = DIFFICULTY_LEVELS.MEDIUM
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `당신은 교육적이고 재미있는 퀴즈를 만드는 선생님입니다. 
          카테고리(${category})와 난이도(${difficulty})에 맞는 재미있는 퀴즈를 생성해주세요.
          JSON 형식으로 응답해주세요. 정답이 여러 개인 경우 쉼표로 구분해주세요:
          {
            "question": "퀴즈 질문",
            "answer": "정답1, 정답2",
            "hint": "문제 해결에 도움이 되는 힌트",
            "explanation": "상세 설명",
            "category": "${category}",
            "difficulty": "${difficulty}"
          }`,
        },
        {
          role: "user",
          content: `${category} 관련 JSON 형식의 퀴즈를 하나 만들어주세요.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("퀴즈 생성 중 오류 발생:", error);
    throw error;
  }
};

export { checkAnswer };
export default openai;
