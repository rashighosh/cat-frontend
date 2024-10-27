var CAT_IDS = [
    "control_assistant_id",
    "accommodation_assistant_id",
]

var accommodative_endings = [
    "\n END INSTRUCTIONS: Check my understanding of what you just shared.",
    "\n END INSTRUCTIONS: Ask for my thoughts/opinions on what you just shared."
]

let currentEndingIndex = 0;

// Initialize the array
let topicsObject = {}
for (let i = 1; i <= 5; i++) {
    topicsObject[i] = false;
}

let counter = 0;
let messageCounter = 0;
let prevTopic = null;

function checkTopic(topic) {
    counter = counter + 1;
    if(topic == 1 || topic == "Safety") { topic = 1 }
    if(topic == 2 || topic == "Randomization") { topic = 2 }
    if(topic == 3 || topic == "Eligibility") { topic = 3 }
    if(topic == 4 || topic == "Logistics") { topic = 4 }
    if(topic == 5 || topic == "Benefits & Risks") { topic = 5 }
    if(topic ==0) {return}
    console.log("TOPIC IS: " + topic)
    logTopic(topic)
    let topicElem = "topic" + topic
    var topicHTML = document.getElementById(topicElem)
    topicHTML.style.color = "green"
    var textContent = topicHTML.textContent;
    var newTextContent = textContent.replace('☐', '☑'); // Replace 'oldChar' with the character you want to replace and 'newChar' with the character you want to replace it with
    topicHTML.textContent = newTextContent;
    topicsObject[topic] = true
    let allTrue = Object.values(topicsObject).every(value => value === true);
    // To disable the button
    if (allTrue === true || counter == 7) {
        finishButton.disabled = false;
        finishButton.classList.add('pulse-blue');
    }   
}

// const base_url = "http://98.84.121.124"
const base_url = "http://127.0.0.1:8000"

var cat_assistant_id = ""

let scripted_voice_base_url = "https://rashi-cat-study.s3.amazonaws.com/scripted/"
// let scripted_voice_base_url = "boop"

let surveyAnswersCommStyle = {}
let surveyAnswersBRIEF = {}
let backgroundInfo = {}

let returningUser = false;
let firstMessage = true

const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

const inputAreaText = document.getElementById('input-area');
const inputAreaButtons = document.getElementById('input-area-buttons');

var responsesArray = ["Continue", "Option 2", "Option 3"]

var currentDate;
var localDateTime;
var informationTranscript = new Map()

var id = ''
var condition = ''
var bhls = 0
var userBackground = "BACKGROUND: "

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const loadingSvg = document.getElementById('loading-svg');

const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

var buttonSelection = ''

var BRIEFscore = 0
var commStyle = ''
var userInfo = ''

function enableInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
}

function disableInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}


function appendAlexMessage(message, audioDataUrl) {
    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    const avatarImg = document.createElement('img');
    avatarImg.src = 'https://rashi-cat-study.s3.amazonaws.com/generic.gif'; // Replace with your image path
    avatarImg.alt = 'Alex';
    avatarImg.className = 'alex-icon pulse-orange';

    labelText.innerText = `Alex`;
    messageText.innerHTML = `${message}`;

    messageElement.className = "chatbot-message"
    messageElement.appendChild(labelText);
    messageElement.appendChild(messageText);

    const alexMessage = document.createElement('div');
    alexMessage.className = "alex-message-item"

    alexMessage.appendChild(avatarImg)
    alexMessage.appendChild(messageElement);

    chatBox.appendChild(alexMessage)

    // COMMENT OUT AUDIO FOR TESTING
    // Create and append the audio element
    const audioElement = new Audio(audioDataUrl);
    audioElement.controls = true;
    chatBox.appendChild(audioElement);
    audioElement.style.display = 'none'

    audioElement.play();

    // Pause the video when the audio stops playing
    audioElement.addEventListener('ended', function() {
        const alexIcons = document.querySelectorAll('.alex-icon');
        // Select the last element
        const lastAlexIcon = alexIcons[alexIcons.length - 1];
        lastAlexIcon.classList.remove('pulse-orange');
        lastAlexIcon.setAttribute('src', 'https://rashi-cat-study.s3.amazonaws.com/generic.jpeg');
        enableInput();
    });

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendUserMessage(message) {
    console.log("IN APPEND USER MESSAGE")
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

    appendLoadingDots();

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendLoadingDots() {
    const ellipse = document.createElement('div');
    ellipse.className = "lds-ellipsis";
    ellipse.setAttribute('id', "lds-ellipsis")


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

async function getAgentResponse(userMessage) {
    console.log("IN GET AGENT RESPONSE")
    console.log("USER MESSAGE:", userMessage)
    disableInput()
    fetch(base_url + `/api/cat/assistant`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, cat_bot_id: cat_assistant_id, user_message: userMessage, health_literacy: bhls})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage(data.response, data.audio);
        console.log("TOPIC IS:", data.topic)
        prevTopic = data.topic
        // if (firstMessage === false) { checkTopic(data.topic) }
        
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        informationTranscript.set("ALEX " + localDateTime, data.response);
        updateTranscript()
        firstMessage = false
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();
    });
    userInput.value = ''; // Clear input field after sending message
}

function sendMessage() {
    disableInput();
    var userMessage

    currentDate = new Date();
    // Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    
    if (messageCounter === 0) {
        appendLoadingDots()
        userMessage = "Greet the user and introduce yourself. Tell them you will first guide them in understanding 5 clinical trials topics, and at the end they can freely ask more questions. Start by asking if they are familiar with randomization."
        informationTranscript.set("SYSTEM " + localDateTime, userMessage);
        getAgentResponse(userMessage)
        messageCounter++
        return;
    } else if (messageCounter ===1) {
        console.log("IN MESSAGE COUNTER = 1")
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        if (condition == 6) {
            userMessage = userMessage + "\n END INSTRUCTIONS: If the user said something like yes, no, kind of, with no explanation, ask them to expand (do not give more information). Otherwise, use your knowledge base to expand on/add to the user's understanding."
            getAgentResponse(userMessage)
            messageCounter++;
            return;
        } else {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to expand on the user's understanding. Move on to the next topic: Ask the user if they'd feel safe joining a clinical trial."
            getAgentResponse(userMessage)
            messageCounter = 3;
            return;
        }
    } else if (messageCounter ===2) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        userMessage = userMessage + "\n END INSTRUCTIONS: Give more information using your knowledge base, if applicable. Move on to the next topic: Ask the user if they'd feel safe joining a clinical trial."
        getAgentResponse(userMessage)
        messageCounter++;
        return;
    } else if (messageCounter ===3) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        if (condition == 6) {
            userMessage = userMessage + "\n END INSTRUCTIONS: If the user did not explain their answer, ask them to expand (do not give more information). Otherwise, use your knowledge base to give more info on how the user's safety concerns are addressed in clinical trials."
            getAgentResponse(userMessage)
            messageCounter++;
            return;
        } else {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to give info on how the user's safety concerns are addressed in clinical trials. Move on to the next topic: Ask the user if they have any time or travel concerns for being in a clinical trial."
            getAgentResponse(userMessage)
            messageCounter = 5;
            return;
        }
    } else if (messageCounter ===4) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        userMessage = userMessage + "\n END INSTRUCTIONS: Give more information using your knowledge base, if applicable. Move on to the next topic: Ask the user if they have any time or travel concerns for being in a clinical trial."
        getAgentResponse(userMessage)
        messageCounter++;
        return;
    } else if (messageCounter ===5) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        if (condition == 6) {
            userMessage = userMessage + "\n END INSTRUCTIONS: If the user did not explain their answer, ask them to expand (do not give more information). Otherwise, use your knowledge base to give more info/solutions regarding the user's response."
            getAgentResponse(userMessage)
            messageCounter++;
            return;
        } else {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to give more info/solutions regarding the user's response. Move on to the next topic: Ask the user how comfortable they feel understanding eligibility criteria."
            getAgentResponse(userMessage)
            messageCounter = 7;
            return;
        }
    } else if (messageCounter ===6) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        userMessage = userMessage + "\n END INSTRUCTIONS: Respond using your knowledge base, if applicable. Move on to the next topic: Ask the user how comfortable they feel understanding eligibility criteria."
        getAgentResponse(userMessage)
        messageCounter++;
        return;
    } else if (messageCounter ===7) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        if (condition == 6) {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to expand on the user's understanding."
            getAgentResponse(userMessage)
            messageCounter++;
            return;
        } else {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to expand on the user's understanding. Move on to the final topic: Ask the user what would make them say yes to being in a trial, and what would make them say no."
            getAgentResponse(userMessage)
            messageCounter = 9;
            return;
        }
    } else if (messageCounter ===8) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        userMessage = userMessage + "\n END INSTRUCTIONS: Respond using your knowledge base, if applicable. Move on to the final topic: Ask the user what would make them say yes to being in a trial, and what would make them say no."
        getAgentResponse(userMessage)
        messageCounter++;
        return;
    } else if (messageCounter ===9) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        if (condition == 6) {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to address the user's response and give more insights."
            getAgentResponse(userMessage)
            messageCounter++;
            return;
        } else {
            userMessage = userMessage + "\n END INSTRUCTIONS: Use your knowledge base to address the user's response and give more insights. Tell the user you've covered all the topics, and they can now ask you more questions or click continue at the bottom right."
            getAgentResponse(userMessage)
            finishButton.disabled = false;
            finishButton.classList.add('pulse-blue');
            messageCounter = 11;
            return;
        }
    } else if (messageCounter ===10) {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        userMessage = userMessage + "\n END INSTRUCTIONS: Respond using your knowledge base, if applicable. Tell the user you've covered all the topics, and they can now ask you more questions or click continue at the bottom right."
        getAgentResponse(userMessage)
        finishButton.disabled = false;
        finishButton.classList.add('pulse-blue');
        messageCounter++;
        return;
    } else {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        appendUserMessage(userMessage);
        informationTranscript.set("USER " + localDateTime, userMessage);
        updateTranscript()
        getAgentResponse(userMessage)
        return;
        // userMessage = userMessage + accommodative_endings[currentEndingIndex]
        // currentEndingIndex = (currentEndingIndex + 1) % accommodative_endings.length;
    }
}

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    id = urlParams.get('id')
    bhls = urlParams.get('bhls')

    if (condition === '6') {
        cat_assistant_id = "accommodative_assistantv2_id"
    } else if (condition === '0') {
        cat_assistant_id = "control_assistantv2_id"
    }

    firstMessage = true

    fetch('/getUserInfo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        returningUser = true;
        sendMessage('text')
    })
    .catch(error => {
        if (error.message === 'HTTP status 404') {
        } else {
            console.error('Error:', error);
        }
    })
    .finally(() => {
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
    helpModal.style.display = "flex";
    currentURLelement = document.getElementById("current-link-help")
    const currentURL = window.location.href;
    currentURLelement.innerHTML = currentURL
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

function updateTranscript() {
    let transcriptString = JSON.stringify(Object.fromEntries(informationTranscript));

    fetch('/updateTranscript', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id, 
            transcriptType: 'informationTranscript', 
            transcript: transcriptString
        })
    })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => console.error('Error logging transcript:', error));
}

function logTopic(topicNum) {
    fetch('/logTopic', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id, 
            topic: topicNum
        })
    })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => console.error('Error logging topic:', error));
}

function nextPage() {
    window.location.href = `/continue?id=${id}&bhls=${bhls}&c=${condition}`
}