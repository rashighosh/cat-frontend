var CAT_IDS = [
    "ct_control_assistant_id",
    "ct_accommodation_assistant_id",
]

var cat_assistant_id = ""

const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

const inputAreaText = document.getElementById('input-area');

var currentDate;
var localDateTime;
var informationTranscript = new Map()

var id = ''
var condition = ''

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

const base_url = "http://44.209.126.3"
// const base_url = "http://127.0.0.1:8000"

const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

function enableInput() {
    userInput.disabled = false;
}

function disableInput() {
    userInput.disabled = true;
}


function appendAlexMessage(message, audioDataUrl) {
    inputAreaText.style.display = "flex"

    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    labelText.innerText = `Alex`;
    messageText.innerHTML = `${message}`;

    messageElement.className = "chatbot-message"
    messageElement.appendChild(labelText);
    messageElement.appendChild(messageText);
    chatBox.appendChild(messageElement);

    // COMMENT OUT AUDIO FOR TESTING
    // Create and append the audio element
    // const audioElement = new Audio(audioDataUrl);
    // audioElement.controls = true;
    // chatBox.appendChild(audioElement);
    // audioElement.style.display = 'none'

    // // Play the video and loop when the audio starts playing
    // audioElement.addEventListener('play', function() {
    //     const video = document.getElementById('myVideo');
    //     video.loop = true; // Ensure video loops
    //     video.play();
    //     loadingSvg.style.visibility = 'visible';
    // });

    // // Pause the video when the audio stops playing
    // audioElement.addEventListener('ended', function() {
    //     const video = document.getElementById('myVideo');
    //     video.currentTime = video.duration;
    //     video.pause();
    //     loadingSvg.style.visibility = 'hidden';
    //     enableInput()
    // });

    // audioElement.play();

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendUserMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    labelText.innerText = `You`;
    messageText.innerText = `${message}`;

    messageElement.className = "user-message"
    messageElement.appendChild(labelText);
    messageElement.appendChild(messageText);

    
    chatBox.appendChild(messageElement);

    const ellipse = document.createElement('div');
    ellipse.className = "lds-ellipsis";
    ellipse.setAttribute('id', "lds-ellipsis")

    const l1 = document.createElement('div');
    const l2 = document.createElement('div');
    const l3 = document.createElement('div');

    ellipse.appendChild(l1)
    ellipse.appendChild(l2)
    ellipse.appendChild(l3)

    // const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(messageElement);
    chatBox.appendChild(ellipse);
    // appendLoadingDots();

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendLoadingDots() {
    const ellipse = document.createElement('div');
    ellipse.className = "lds-ellipsis";

    const l1 = document.createElement('div');
    const l2 = document.createElement('div');
    const l3 = document.createElement('div');

    ellipse.appendChild(l1)
    ellipse.appendChild(l2)
    ellipse.appendChild(l3)

    const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(ellipse);
}

// JavaScript function to trigger when the user hits Enter after typing in the input field
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
  });

function sendMessage() {
    var userMessage

    userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    appendUserMessage(userMessage);
    disableInput()

    currentDate = new Date();
    // Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    informationTranscript.set("USER " + localDateTime, userMessage);

    fetch(base_url + `/api/cat/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, cat_bot_id: cat_assistant_id, user_message: userMessage, user_info: userInfo, comm_style: commStyle, health_literacy: BRIEFscore})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage(data.response, data.audio);
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        informationTranscript.set("ALEX " + localDateTime, data.response);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();
    });
    
    userInput.value = ''; // Clear input field after sending message
}

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    id = urlParams.get('id')
    console.log(id);

    if (condition === '6') {
        cat_assistant_id = "ct_accommodative_assistant_id"
    } else if (condition === '0') {
        cat_assistant_id = "ct_control_assistant_id"
    }

    console.log("CAT ASSISTANT ID IS:", cat_assistant_id)

    var alexMessage = "Introduce yourself and very briefly summarize the 3 clinical trial studies, separated by 3 dollar signs ($$$)."

    // Actions to be performed when the page is fully loaded
    const ellipse = document.createElement('div');
    ellipse.className = "lds-ellipsis";
    ellipse.setAttribute('id', "lds-ellipsis")

    const l1 = document.createElement('div');
    const l2 = document.createElement('div');
    const l3 = document.createElement('div');

    ellipse.appendChild(l1)
    ellipse.appendChild(l2)
    ellipse.appendChild(l3)

    chatBox.appendChild(ellipse);

    currentDate = new Date();
    localDateTime = currentDate.toLocaleString();
    informationTranscript.set("ALEX " + localDateTime, alexMessage);

    fetch(base_url + `/api/cat/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, cat_bot_id: cat_assistant_id, user_message: alexMessage, user_info: userInfo, comm_style: commStyle, health_literacy: BRIEFscore})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.response)
        appendAlexMessage(data.response, data.audio);
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        informationTranscript.set("ALEX " + localDateTime, data.response);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        ellipse.remove();
    });

    
  };

// Get the modal
var helpModal = document.getElementById("help-modal");

// Get the button that opens the modal
var helpBtn = document.getElementById("help-icon");

// Get the <span> element that closes the modal
var helpSpan = document.getElementsByClassName("help-close")[0];

// When the user clicks on the button, open the modal
helpBtn.onclick = function() {
    helpModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
helpSpan.onclick = function() {
    helpModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == helpModal) {
    helpModal.style.display = "none";
  }
}

function logInformationTranscript() {
    let transcriptString = JSON.stringify(Object.fromEntries(informationTranscript));

    let surveyAnswers = { ...surveyAnswersCommStyle, ...surveyAnswersBRIEF };

    fetch('/log', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, transcriptType: 'informationTranscript', transcript: transcriptString, surveyAnswers: surveyAnswers, backgroundInfo: backgroundInfo})
    })
    .then(response => response.json())
    .then(data => {
        console.log("logged to file")
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        window.location.href = "https://ufl.qualtrics.com/jfe/form/SV_1TgxItlntE1uUzs/?id=" + id + "&c=" + condition;
    });
  }