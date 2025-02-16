import React, { useState, useEffect } from "react";

const messages = {
  correct: ["¡Muy bien!", "¡Excelente!", "¡Buen trabajo!", "¡Sigue así!"],
  incorrect: [
    "No, inténtalo de nuevo.",
    "Error, intenta otra vez.",
    "¡No te rindas!",
    "Sigue practicando.",
  ],
};

const getRandomMessage = (type) =>
  messages[type][Math.floor(Math.random() * messages[type].length)];

export default function MultiplicationPractice() {
  const [selectedTables, setSelectedTables] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [validated, setValidated] = useState({});
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (selectedTables.length > 0) {
      generateQuestions();
    }
  }, [selectedTables]);

  const generateQuestions = () => {
    let newQuestions = [];
    selectedTables.forEach((table) => {
      let numbers = [...Array(10).keys()]
        .map((n) => n + 1)
        .sort(() => Math.random() - 0.5);
      numbers.forEach((num) => newQuestions.push({ num1: table, num2: num }));
    });
    setQuestions(newQuestions.sort(() => Math.random() - 0.5));
    setAnswers({});
    setFeedback({});
    setValidated({});
    setScore({ correct: 0, incorrect: 0 });
  };

  const handleTableSelection = (table) => {
    setSelectedTables((prev) =>
      prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
    );
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const validateAnswer = (index) => {
    const userAnswer = parseInt(answers[index], 10);
    if (isNaN(userAnswer)) return;

    const correctAnswer = questions[index].num1 * questions[index].num2;
    const isCorrect = userAnswer === correctAnswer;

    setFeedback((prev) => ({
      ...prev,
      [index]: {
        message: isCorrect
          ? getRandomMessage("correct")
          : getRandomMessage("incorrect"),
        correct: isCorrect,
      },
    }));

    setValidated((prev) => ({ ...prev, [index]: true }));

    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-amber-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        🧮 Práctica de Tablas de Multiplicar
      </h1>

      {step === 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Selecciona las tablas:
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(10).keys()].map((n) => (
              <button
                key={n + 1}
                className={`p-3 rounded-lg border transition ${
                  selectedTables.includes(n + 1)
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleTableSelection(n + 1)}
              >
                {n + 1}
              </button>
            ))}
          </div>
          {selectedTables.length > 0 && (
            <button
              className="mt-6 w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              onClick={() => setStep(1)}
            >
              Siguiente
            </button>
          )}
        </div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Operación</th>
                <th className="border p-3">Respuesta</th>
                <th className="border p-3">Validar</th>
                <th className="border p-3">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr
                  key={index}
                  className={`${
                    validated[index]
                      ? feedback[index]?.correct
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }`}
                >
                  <td className="border p-3 text-center text-lg">
                    {q.num1} × {q.num2} =
                  </td>
                  <td className="border p-3 text-center">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={answers[index] || ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      disabled={validated[index]}
                    />
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => validateAnswer(index)}
                      disabled={validated[index]}
                    >
                      ✔️
                    </button>
                  </td>
                  <td className="border p-3 text-center">
                    {validated[index] && (
                      <div className="flex flex-col items-center">
                        <img
                          src={
                            feedback[index].correct
                              ? "/imagenes/feliz.png"
                              : "/imagenes/triste.png"
                          }
                          alt={
                            feedback[index].correct ? "Correcto" : "Incorrecto"
                          }
                          className="w-12 h-12 mb-2"
                        />
                        <span
                          className={`text-sm font-semibold ${
                            feedback[index].correct
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {feedback[index].message}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {questions.length > 0 &&
            Object.keys(validated).length === questions.length && (
              <div className="mt-4 p-4 bg-gray-200 rounded-lg flex flex-col items-center text-center">
                <img
                  src={
                    (score.correct / questions.length) * 100 > 75
                      ? "/imagenes/feliz.png"
                      : (score.correct / questions.length) * 100 >= 50
                      ? "/imagenes/neutral.png"
                      : "/imagenes/triste.png"
                  }
                  alt="Estado de ánimo"
                  className="w-20 h-20 mb-3"
                />
                <h2 className="text-lg font-semibold">Resumen de Resultados</h2>
                <p>✅ Correctas: {score.correct}</p>
                <p>❌ Incorrectas: {score.incorrect}</p>
                <p>
                  📊 Porcentaje de Acierto:{" "}
                  {((score.correct / questions.length) * 100).toFixed(2)}%
                </p>

                {score.correct / questions.length >= 0.75 ? (
                  <p className="text-green-600">🎉 ¡Excelente trabajo!</p>
                ) : (
                  <p className="text-red-600">📖 Sigue practicando.</p>
                )}
              </div>
            )}

          <button
            className="mt-6 w-full p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            onClick={() => setStep(0)}
          >
            🔄 Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}
