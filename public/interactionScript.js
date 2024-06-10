const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

var currentDate;
var localDateTime;
var interactionTranscript = new Map()

var id = ''
var condition = ''

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

// const base_url = "http://44.209.126.3"
const base_url = "http://127.0.0.1:8000"

var BRIEFscore = 0
var commStyle = ''
var userInfo = ''

function calculateBRIEFScore(surveyAnswersBRIEF) {
    for (const value of Object.values(surveyAnswersBRIEF)) {
        // Check if the value is a number
        if (typeof value === 'number') {
            BRIEFscore += value;
        }
    }
}

function formatJSONObjectAsString(JSONObject, item) {
    if (item === 'commStyle') {
        for (const [key, value] of Object.entries(JSONObject)) {
            commStyle += `${key}: ${value}; `;
        }
        commStyle = commStyle.trim().slice(0, -1);
    } else {
        for (const [key, value] of Object.entries(JSONObject)) {
            userInfo += `${value}; `;
        }
        userInfo = userInfo.trim().slice(0, -1);
    }
}

function getUserInfoFromDatabase(id) {
    fetch('/userInformation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
    })
    .then(response => response.json())
    .then(data => {
        console.log("USER INFO DATA FROM SERVER:", data)
        calculateBRIEFScore(data.surveyAnswersBRIEF)
        formatJSONObjectAsString(data.surveyAnswersCommStyle, 'commStyle')
        formatJSONObjectAsString(data.backgroundInfo, 'userInfo')
        console.log("BREIF SCORE IS: ", BRIEFscore)
        console.log("COMM STYLE IS IS: ", commStyle)
        console.log("USER INFO IS IS: ", userInfo)
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        console.log("success")
        let userMessage = ''
        var controlInitialMessage = 'Introduce yourself to the user and list 2-3 things you can talk about based on your PERSONA.'
        var accommodateMessage = 'Introduce yourself to the user and list 2-3 things you can talk about based on your PERSONA and the following Background Information:'

        if (condition === '0') { userMessage = controlInitialMessage }
        else { userMessage = accommodateMessage }
        console.log(userMessage)
            
        interactionTranscript.set("id", id);
        interactionTranscript.set("condition", condition);

        condition = parseInt(condition)

        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        console.log("LOCAL DATE TIME IS: " + localDateTime);
        interactionTranscript.set("USER " + localDateTime, userMessage);

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

        console.log("HERE ADDING ELIPPSE")
        // const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(ellipse);

        userInput.disabled = true;
        console.log("USER INFO IS", userInfo)

        fetch(base_url + `/api/cat/assistant`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: id, cat_bot_id: CAT_IDS[condition], user_message: userMessage, user_info: userInfo, comm_style: commStyle, health_literacy: BRIEFscore})
        })
        .then(response => response.json())
        .then(data => {
            checkModal(data.response, data.audio);
            currentDate = new Date();
            // Convert the date and time to the user's local time zone
            localDateTime = currentDate.toLocaleString();
            // Output the local date and time
            console.log("LOCAL DATE TIME IS: " + localDateTime);
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            // Remove loading indicator after response received
            console.log("HERE SHOULD REMOVE ELIPPSE")
            const ellipse = document.getElementById('lds-ellipsis');
            ellipse.remove();
        });
    });
}


function increaseProgress() {
    console.log("IN INCREASE PROGRESS")
    if (progress < 5) {
      progress++;
      updateProgressBar();
      updateProgressText();
    }
    if (progress >= 5) {
        // Assuming you have a reference to the button element
        const finishButton = document.getElementById('finish-button');

        // To disable the button
        finishButton.disabled = false;
    }
  }

  function updateProgressBar() {
    const progressBar = document.getElementById('progress');
    const progressWidth = (progress / 5) * 100;
    progressBar.style.width = `${progressWidth}%`;
  }

  function updateProgressText() {
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `Progress: ${progress * 20}%`;
  }

  function closeModal() {
    document.getElementById("interactionModal").style.display = "none";
}

function checkModal(message, audioDataUrl) {
    // Check the variable every 1 second (1000 milliseconds)
var intervalId = setInterval(function() {
    // Check if the variable is true
    if (document.getElementById("myModal").style.display == "none") {
        // Execute your function
        appendAlexMessage2(message, audioDataUrl);
        clearInterval(intervalId);
    }
}, 1000); // Interval set to 1000 milliseconds (1 second)
}

const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

// Initialize the array
let topicsObject = {}
for (let i = 1; i <= 5; i++) {
    topicsObject[i] = false;
}

var CAT_IDS = [
    "control_assistant_id",
    "approximation_assistant_id",
    "interpretability_assistant_id",
    "interpersonal_control_assistant_id",
    "discourse_management_assistant_id",
    "emotional_expression_assistant_id"
]

function closeModal() {
    document.getElementById("interactionModal").style.display = "none";
}

function checkModal(message, audioDataUrl) {
    // Check the variable every 1 second (1000 milliseconds)
    var intervalId = setInterval(function() {
    // Check if the variable is true
    if (document.getElementById("interactionModal").style.display == "none") {
        // Execute your function
        appendAlexMessage2(message, audioDataUrl);
        clearInterval(intervalId);
    }
}, 1000); // Interval set to 1000 milliseconds (1 second)
}


function appendAlexMessage2(message, audioDataUrl) {
    console.log("MESSAGE IS:", message)
    
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
    const audioElement = new Audio(audioDataUrl);
    audioElement.controls = true;
    chatBox.appendChild(audioElement);
    audioElement.style.display = 'none'

    // Play the video and loop when the audio starts playing
    audioElement.addEventListener('play', function() {
        const video = document.getElementById('myVideo');
        video.loop = true; // Ensure video loops
        video.play();
        loadingSvg.style.visibility = 'visible';
    });

    // Pause the video when the audio stops playing
    audioElement.addEventListener('ended', function() {
        const video = document.getElementById('myVideo');
        console.log("IT HAS ENDED")
        video.currentTime = video.duration;
        video.pause();
        userInput.disabled = false;
        loadingSvg.style.visibility = 'hidden';
    });

    audioElement.play();

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
    // <div id="lds-ellipsis" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
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

// Example of how you might call your API and use the response
function sendMessage() {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    appendUserMessage(userMessage);

    currentDate = new Date();
    // Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    console.log("LOCAL DATE TIME IS: " + localDateTime);
    interactionTranscript.set("USER " + localDateTime, userMessage);

    userInput.disabled = true;

    fetch(base_url + '/api/cat/assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, cat_bot_id: CAT_IDS[condition], user_message: userMessage, user_info: user_info})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(data.response, data.audio);
        console.log("TOPIC IS", data.topic)
        if (data.topic !== 0) {
            increaseProgress();
        }
        // checkTopic(data.topic)
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        console.log("LOCAL DATE TIME IS: " + localDateTime);
        interactionTranscript.set("ALEX " + localDateTime, data.response);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();        
        userInput.disabled = true;
    });

    userInput.value = ''; // Clear input field after sending message
}

window.onload = function() {
    console.log("IN ON LOAD")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    id = urlParams.get('id')
    console.log(id);
    getUserInfoFromDatabase(id);
  };

  function logTranscript() {
    console.log("IN LOG TRANSCRIPT!")
    let transcriptString = JSON.stringify(Object.fromEntries(interactionTranscript));

    fetch('/log', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, transcriptType: 'interactionTranscript', transcript: transcriptString})
    })
    .then(response => response.json())
    .then(data => {
        console.log("logged to file")
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        console.log("check for transcript file")
        window.location.href = "https://ufl.qualtrics.com/jfe/form/SV_1TgxItlntE1uUzs?id=" + id + "&c=" + condition;
    });

  }


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