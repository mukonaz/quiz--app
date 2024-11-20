const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { question: 'What is 2+2?', answer: '4' },
  { question: 'What is the capital of France?', answer: 'Paris' }
];

let currentQuestionIndex = 0;
let score = 0;

function askQuestionWithTimeout(questionObj, timeLimit) {
  let remainingTime = timeLimit / 1000;
  console.log(`\n${questionObj.question} (Time: ${remainingTime}s)`);

  const timer = setInterval(() => {
    remainingTime--;
    if (remainingTime > 0) {
      console.log(`Time left: ${remainingTime}s`);
    }
  }, 1000);

  return new Promise((resolve) => {
    const timerExpiration = setTimeout(() => {
      clearInterval(timer);
      console.log('\nTime is up!');
      resolve(null);
    }, timeLimit);

    rl.question('> ', (userInput) => {
      clearTimeout(timerExpiration);
      clearInterval(timer);
      resolve(userInput);
    });
  });
}

async function runQuiz() {
  const quizDuration = 60000; // 60 seconds for the entire quiz
  const quizTimer = setTimeout(() => {
    console.log('\nQuiz time is over!');
    rl.close();
  }, quizDuration);

  while (currentQuestionIndex < questions.length) {
    const questionObj = questions[currentQuestionIndex];
    const userAnswer = await askQuestionWithTimeout(questionObj, 10000); // 10s per question

    if (userAnswer !== null && userAnswer.trim().toLowerCase() === questionObj.answer.toLowerCase()) {
      console.log('Correct!');
      score++;
    } else {
      console.log('Wrong or no answer.');
    }

    currentQuestionIndex++;
  }

  clearTimeout(quizTimer);
  console.log(`Quiz finished! Your score: ${score}/${questions.length}`);
  rl.close();
}

runQuiz();
