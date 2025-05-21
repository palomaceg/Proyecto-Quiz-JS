//LLAMADAS -> contenedores / elementos
const welcomePortal = document.getElementById("welcome-portal")
const questionSection = document.getElementById("question-section")
const resultsBanner = document.getElementById("results-banner")
const chartPage = document.getElementById('chart-page')
const questionHeader = document.getElementById('question-header')
const questionOption = document.getElementById('options-container')
const globalResults = document.getElementById('global-results')
const scoreChart = document.getElementById('myChart')
const questionNumber = document.getElementById('question-number')
const audioMP3 = document.getElementById('audio-mp3')

//LLAMADAS -> botones
const startButton = document.getElementById('play-button')
const nextButton = document.getElementById('next-button')
const restartButton = document.getElementById('restart-button')
const chartButton = document.getElementById('chart-button')
const homeButton = document.getElementById('home-button')
const audioButton = document.getElementById('audio-button')


//Variables 
const apiUrl = 'https://opentdb.com/api.php?amount=10&category=12&type=multiple'
let currentQuestion = 0
let allQuestionsAnswers = []
let totalCorrectAnswers = []
let totalIncorrectAnswers = []
let myChart = null

//FUNCIONES

//para esconder/mostrar vistas  y para "ir" a las vistas

function hideView() {
    welcomePortal.classList.remove('active')
    questionSection.classList.remove('active')
    resultsBanner.classList.remove('active')
    chartPage.classList.remove('active')
}

function goToQuestions() {
    hideView()
    questionSection.classList.add('active')
}

function goToResults() {
    hideView()
    resultsBanner.classList.add('active')
    const score = localStorage.getItem('totalScore')
    globalResults.innerHTML = `Tus respuestas correctas han sido <b><big>${score}</big></b> sobre <big>10</big>`
}

function goToWelcomePortal() {
    hideView()
    welcomePortal.classList.add('active')
}

function goToCharts() {
    hideView()
    chartPage.classList.add('active')

    //Gráfica de estadísticas de último juego
    const scoreChart = document.getElementById('myChart')
    let correct = localStorage.getItem('totalScore') || 0
    correct = parseInt(correct)
    const incorrect = 10 - correct

    if (myChart !== null) {
        myChart.destroy();
    }

    myChart = new Chart(scoreChart, {
        type: 'doughnut',
        data: {
            labels: ['Incorrectas', 'Correctas'],
            datasets: [{
                data: [incorrect, correct],
                backgroundColor: ['#6D2121', '#859D56'],
                borderWidth: 0,
                hoverOffset: 10,
                spacing: 5,
                borderRadius: 8
            }]
        },
    });
}

//para 'traducir' los caracteres extraños de la API
function decodeHTMLEntities(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.documentElement.textContent;
}

//para llamar y mostrar las preguntas de un array de 10 preguntas -> al mismo tiempo se llama a las respuestas y se almacena todo en un objeto de 3 claves (pregunta, respuesta incorrecta y respuesta correcta)

const getApiInfo = async (e) => {
    try {
        const allAPI = await axios.get(apiUrl)
        const arrayAPI = allAPI.data.results

        allQuestionsAnswers = arrayAPI.map((element) => {
            return {
                question: element.question,
                correctAnswer: element.correct_answer,
                incorrectAnswers: element.incorrect_answers
            }
        })
        showQuestion()

    } catch (error) {
        console.error(error);
    }
};

function showQuestion() {
    if (currentQuestion < allQuestionsAnswers.length) {
        const quest = allQuestionsAnswers[currentQuestion]
        questionHeader.innerText = decodeHTMLEntities(quest.question)
        questionNumber.innerText = ` ${currentQuestion + 1} / 10`

        showAnswers(quest)

        if (currentQuestion === allQuestionsAnswers.length - 1) {
            nextButton.innerText = '⏹︎ REVISAR RESULTADOS'
        } else {
            nextButton.innerText = '⏭︎ SIGUIENTE'
        }
    } else {
        goToResults()
    }
}

function showAnswers(element) {
    const options = [...element.incorrectAnswers, element.correctAnswer]
    const mixOptions = options.sort(() => Math.random() - 0.5)

    questionOption.innerText = ' '

    //para reordenar de forma aleatoria el array formado de respuestas correctas e incorrectas
    mixOptions.forEach(item => {
        const btn = document.createElement('button')
        btn.classList.add('option-button')
        btn.innerText = decodeHTMLEntities(item)


        //evento de escuchar el click de los botones para evaluar la respuesta
        btn.addEventListener('click', () => {
            const allButtons = document.querySelectorAll('.option-button')

            //para deshabilitar los botones una vez se ha clickado en una opción
            allButtons.forEach(button => button.disabled = true)

            //para evaluar si la respuesta es correcta o incorrecta y almacenarlo en un array vacío para luego hacer el recuento final
            if (item === element.correctAnswer) {
                totalCorrectAnswers.push(currentQuestion)
                btn.classList.add('correct')
            } else {
                totalIncorrectAnswers.push(currentQuestion)
                btn.classList.add('incorrect')
            }
        })
        questionOption.appendChild(btn)
    })
}

//Almacenamiento de respuestas en Local Storage 

function resultsCalculation() {
    let totalScore = totalCorrectAnswers.length
    localStorage.totalScore = totalScore
    let totalIncorrect = totalIncorrectAnswers.length
    localStorage.totalIncorrect = totalIncorrect
}

//EVENTOS

startButton.addEventListener('click', () => {
    currentQuestion = 0
    goToQuestions()
    getApiInfo()
    music()
})

nextButton.addEventListener('click', () => {
    currentQuestion++
    showQuestion()
    resultsCalculation()
})

restartButton.addEventListener('click', () => {
    goToWelcomePortal()
})

chartButton.addEventListener('click', goToCharts)

homeButton.addEventListener('click', goToWelcomePortal)

//EXTRA: para manejar música

audioButton.addEventListener('click', music)


function music() {
    if (audioMP3.paused) {
        audioMP3.play();
        audioButton.textContent = '🔊';
    } else {
        audioMP3.pause();
        audioButton.textContent = '🔇'
    }
}




