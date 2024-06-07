const surveyItems = [
    {
        "message": "Hi, I'm Alex! Before we start talking about clinical trials, I'd like to learn more about you to help tailor our conversation. I'll start by reading you a series of statements. For each statement, please enter a number between 1 and 7, where 1 means you completely disagree, and 7 means you completely agree. Please type <b>Continue</b> to proceed.",
        "placeholder": "Type 'Continue' to proceed.",
    },
    {
        "message": "Alright! First statement: <b>I like to talk a lot</b>.",
        "placeholder": "Enter a number between 1 and 7, where 1 is completely disagree and 7 is completely agree",
        "survey": "Communication Styles Inventory",
        "item": "Informality",
        "question": "I address others in a very casual way.",
        "scale": "Enter a number between 1 (completely disagree) and 7 (completely agree)."
    },
    {
        "message": "Thank you! Next, do you generally address others in a very casual way?",
        "placeholder": "Enter a number between 1 and 7, where 1 is completely disagree and 7 is completely agree",
        "survey": "Communication Styles Inventory",
        "item": "Informality",
        "question": "I address others in a very casual way.",
        "scale": "Enter a number between 1 (completely disagree) and 7 (completely agree)."
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Conciseness",
        "question": "Most of the time, I only need a few words to explain something.",
        "scale": "Enter a number between 1 (completely disagree) and 7 (completely agree)."
    }
]

let counter = 0;

console.log(surveyItems)

const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

var currentDate;
var localDateTime;
var informationTranscript = new Map()

var id = ''
var condition = ''

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

// const base_url = "http://44.209.126.3"
const base_url = "http://127.0.0.1:8000"


const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;


function appendAlexMessage2(message, audioDataUrl) {
    console.log("MESSAGE IS:", message)

    userInput.placeholder = surveyItems[counter].placeholder;
    counter++
    
    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    labelText.innerText = `Alex: `;
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

    labelText.innerText = `You: `;
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
    informationTranscript.set("USER " + localDateTime, userMessage);

    console.log(informationTranscript)
    userInput.disabled = true;

    let alexMessage = surveyItems[counter].message

    fetch(base_url + '/api/cat/voice', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({agent_message: alexMessage})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(alexMessage, data.audio);
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        console.log("LOCAL DATE TIME IS: " + localDateTime);
        informationTranscript.set("ALEX " + localDateTime, alexMessage);
        console.log(informationTranscript)
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

    var alexMessage = surveyItems[counter].message

    currentDate = new Date();
    localDateTime = currentDate.toLocaleString();
    informationTranscript.set("ALEX " + localDateTime, alexMessage);

    console.log(informationTranscript)

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

    fetch(base_url + `/api/cat/voice`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({agent_message: alexMessage })
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(alexMessage, data.audio);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        console.log("HERE SHOULD REMOVE ELIPPSE")
        const ellipse = document.getElementById('lds-ellipsis');
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
