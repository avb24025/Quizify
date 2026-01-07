import { llm } from "../llm.js";

async function ChatController(req, res) {
  console.log("req.body:", req.body);
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const prompt = `
You are a STRICT JSON API.

You must generate quiz questions based on the user request below.

User request:
"${message}"

INSTRUCTIONS (MANDATORY):
1. Extract the topic and the number of questions from the user request.
2. Generate exactly that number of multiple-choice questions.
3. Each question MUST have exactly 4 options.
4. ONLY ONE option is correct.
5. Questions must be beginner to intermediate level.
6. Do NOT ask follow-up questions.

OUTPUT RULES (VERY IMPORTANT):
- Respond with ONLY valid JSON.
- Do NOT include markdown, explanations, comments, or extra text.
- Do NOT wrap the JSON in backticks.
- Do NOT include trailing commas.
- If you cannot follow the rules, return EXACTLY:
  { "error": "invalid request" }

JSON SCHEMA (FOLLOW EXACTLY):
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": 0
    }
  ]
}

REMEMBER:
- correctAnswerIndex MUST be 0, 1, 2, or 3.
- The response must be directly parsable using JSON.parse().
`;


  let response;
  try {
    response = await llm.invoke(prompt);
  } catch (err) {
    return res.status(500).json({ error: "LLM invocation failed" });
  }

  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch (err) {
    console.error("Invalid JSON:", response.content);
    return res.status(500).json({ error: "Invalid JSON from LLM" });
  }

  return res.status(200).json(parsed);
}

export default ChatController;
