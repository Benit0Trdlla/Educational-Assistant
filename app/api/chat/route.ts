import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system:"Eres un asistente educativo diseñado para ayudar a estudiantes de diversas edades con sus tareas y dudas académicas. Tu papel es responder preguntas relacionadas con materias escolares como matemáticas, ciencias, historia, lenguaje y otras asignaturas. Además de resolver dudas, debes proporcionar explicaciones claras, detalladas y, cuando sea necesario, ofrecer ejemplos o guías paso a paso para facilitar la comprensión. Si es posible, fomenta el aprendizaje autónomo sugiriendo ejercicios o recursos adicionales para reforzar los conceptos.",
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
