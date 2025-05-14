const welcomePortal = document.getElementById("welcome-portal")
const questionSection = document.getElementById("question-section")
const resultsBanner = document.getElementById("results-banner")
const startButton = document.getElementById('play-button')
const nextButton = document.getElementById('next-button')
const restartButton = document.getElementById('restart-button')

function hideView() {
    welcomePortal.classList.remove('active')
    questionSection.classList.remove('active')
    resultsBanner.classList.remove('active')
}

function goToQuestions() {
    hideView()
    questionSection.classList.add('active')
}

function goToResults() {
    hideView()
    resultsBanner.classList.add('active')
}

function goToWelcomePortal() {
    hideView()
    welcomePortal.classList.add('active')
}


startButton.addEventListener('click', goToQuestions)
nextButton.addEventListener('click', goToResults)
restartButton.addEventListener('click', goToWelcomePortal)

const preguntas = []

axios.get('https://opentdb.com/api.php?amount=10&category=12&type=multiple')
    .then(response => console.log(response.data))
    .catch(error => console.error(error));



