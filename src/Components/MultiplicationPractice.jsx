import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";


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

    Swal.fire({
      title: isCorrect ? "✅ ¡Correcto!" : "❌ ¡Incorrecto!",
      text: isCorrect
        ? "¡Bien hecho! Sigue así. 🎉"
        : `La respuesta correcta era ${correctAnswer}. ¡Inténtalo de nuevo!`,
      icon: isCorrect ? "success" : "error",
      confirmButtonText: "Continuar",
    });
    

    setValidated((prev) => ({ ...prev, [index]: true }));

    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));
  };

  return (
    <div className="p-6 max-w-5xl w-full bg-gray-800 text-white rounded-lg shadow-lg">

      <div className="flex justify-center mb-4">
        <img src="/multiplicaor.png" alt="Logo" className="w-40 h-40" />
      </div>

      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
        ¡Bienvenido a la Práctica de Tablas de Multiplicar! 🎉
      </h2>
      <p className="text-lg font-semibold mb-4 text-center text-gray-300">
        Esta aplicación te ayudará a mejorar tus habilidades en multiplicación.
        Selecciona las tablas que deseas practicar, responde los ejercicios y
        recibe retroalimentación en tiempo real. ¡Diviértete aprendiendo! 📚✨
      </p>

      <h1 className="text-2xl font-semibold text-center mb-6 text-yellow-400">
        Práctica de Tablas de Multiplicar
      </h1>

      {step === 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-300">
            Selecciona las tablas:
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(10).keys()].map((n) => (
              <button
                key={n + 1}
                className={`p-3 rounded-lg border transition ${selectedTables.includes(n + 1)
                  ? "bg-blue-900 text-white"
                  : "bg-gray-600 text-white hover:bg-gray-500"
                  }`}
                onClick={() => handleTableSelection(n + 1)}
              >
                {n + 1}
              </button>
            ))}
          </div>
          {selectedTables.length > 0 && (
            <button
              className="mt-6 w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              onClick={() => {
                Swal.fire({
                  title: "¿Listo para continuar?",
                  text: "Presiona OK para seguir con la práctica.",
                  icon: "info",
                  confirmButtonText: "OK",
                }).then(() => setStep(1));
              }}
              
            >
              Siguiente
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 bg-gray-900 text-white shadow-lg">
            <thead>
              <tr className="bg-blue-950 text-white">
                <th className="border p-3">Operación</th>
                <th className="border p-3">Respuesta</th>
                <th className="border p-3">Validar</th>
                <th className="border p-3">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={index} className={`${validated[index] ? (feedback[index]?.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-700'}
                    {validated[index] ? (feedback[index]?.correct ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-gray-700'}
                  `}
                >
                  <td className="border p-3 text-center text-lg">
                    {q.num1} × {q.num2} =
                  </td>
                  <td className="border p-3 text-center">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      value={answers[index] || ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      disabled={validated[index]}
                    />
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition"
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
                        <span className="text-sm font-semibold">
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
              <div className="mt-4 p-6 bg-gray-700 rounded-lg flex flex-col items-center text-center">
                {/* Contenedor de la imagen y el texto alineados */}
                <div className="flex items-center justify-center">
                  {/* Imagen más grande y con margen derecho */}
                  <img
                    src={
                      (score.correct / questions.length) * 100 > 75
                        ? "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJ5cjZ0bGVlNnU1NXIwazVubjZqa3p2YnAxcjFtM3ZhNjEzNWV6ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FXF9QeYlCFlruoUwUx/giphy.gif"
                        : (score.correct / questions.length) * 100 >= 50
                          ? "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDhxa2xxb3k4emp5eXF1NmFuMHM3MXNsbjZoMHdjNjFua2pocWZocSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QvBgZiA6uDmCEaAFru/giphy.gif"
                          : "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDhxa2xxb3k4emp5eXF1NmFuMHM3MXNsbjZoMHdjNjFua2pocWZocSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QvBgZiA6uDmCEaAFru/giphy.gif"
                    }
                    alt="Estado de ánimo"
                    className="w-60 h-60 mr-6"
                  />

                  {/* Contenedor del texto alineado al centro con fuente más grande */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-400">
                      ✅ Correctas: {score.correct}
                    </h2>
                    <p className="text-2xl font-bold text-red-500">
                      ❌ Incorrectas: {score.incorrect}
                    </p>
                    <p className="text-xl text-gray-300">
                      📊 Porcentaje de Acierto: {((score.correct / questions.length) * 100).toFixed(2)}%
                    </p>

                    {score.correct / questions.length >= 0.75 ? (
                      <p className="text-2xl text-green-600 font-semibold">🎉 ¡Excelente trabajo!</p>
                    ) : (
                      <p className="text-2xl text-red-600 font-semibold">📖 Sigue practicando.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          <button
            className="mt-6 w-full p-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
            onClick={() => {
              Swal.fire({
                title: "¿Estás seguro de querer salir?",
                text: "Perderás todo tu progreso actual.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar",
              }).then((result) => {
                if (result.isConfirmed) {
                  setStep(0);
                }
              });
            }}
            
          >
            ⬅️ Volver
          </button>


        </div>
      )}
    </div>
  );
}
