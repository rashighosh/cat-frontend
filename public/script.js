const video = document.getElementById('myVideo');
const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

var currentDate;
var localDateTime;
var transcript = new Map()

var id = ''
var condition = ''

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

// Initialize the array
let lastThreeTurns = [];
let topicsObject = {}
for (let i = 1; i <= 5; i++) {
    topicsObject[i] = false;
}


function checkTopic(topic) {
    if(topic == 1 || topic == "Safety in Clinical Trials") { topic = 1 }
    if(topic == 2 || topic == "Understanding and Comfort with the Clinical Trial Process") { topic = 2 }
    if(topic == 3 || topic == "Logistical, Time, and Financial Barriers to Participation") { topic = 3 }
    if(topic == 4 || topic == "Risks and Benefits of Clinical Trials") { topic = 4 }
    if(topic == 5 || topic == "Awareness and Information Accessibility") { topic = 5 }
    console.log("TOPIC IS: " + topic)
    let topicElem = "topic" + topic
    topicHTML = document.getElementById(topicElem)
    topicHTML.style.color = "green"
    var textContent = topicHTML.textContent;
    var newTextContent = textContent.replace('☐', '☑'); // Replace 'oldChar' with the character you want to replace and 'newChar' with the character you want to replace it with
    topicHTML.textContent = newTextContent;
    topicsObject[topic] = true
    let allTrue = Object.values(topicsObject).every(value => value === true);
    // To disable the button
    console.log(allTrue)
    if (allTrue === true) {
        finishButton.disabled = false;
    }   
}

// Function to add a new item to the array and keep only the most recent three items
function addToLastThreeTurns(item) {
  // Add the new item to the beginning of the array
  lastThreeTurns.unshift(item);
  
  // Keep only the most recent three items
  if (lastThreeTurns.length > 3) {
    lastThreeTurns.pop(); // Remove the oldest item
  }
}

function createTurnObject(role, content) {
    return {
      "role": role,
      "content": content
    };
  }

const base_url = "http://44.209.126.3"
// const base_url = "http://127.0.0.1:8000"

// function increaseProgress() {
//     console.log("IN INCREASE PROGRESS")
//     if (progress < 5) {
//       progress++;
//       updateProgressBar();
//       updateProgressText();
//     }
//     if (progress >= 5 && beginConclude == false) {
//         // Assuming you have a reference to the button element
//         concludeButton.style.display = "block"
//         // Stop pulse animation after 5 seconds
//         setTimeout(() => {
//             concludeButton.classList.add('remove-pulse-animation');
//             }, 3000);
//         }
//   }
  
//   function updateProgressBar() {
//     const progressBar = document.getElementById('progress');
//     const progressWidth = (progress / 5) * 100;
//     progressBar.style.width = `${progressWidth}%`;
//   }
  
//   function updateProgressText() {
//     const progressText = document.getElementById('progress-text');
//     progressText.textContent = `Progress: ${progress * 20}%`;
//   }

function closeModal() {
    document.getElementById("myModal").style.display = "none";
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

function appendAlexMessage2(message, audioDataUrl) {
    // Append the text message
    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    labelText.innerText = `Alex: `;
    messageText.innerText = `${message}`;

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
        video.loop = true; // Ensure video loops
        video.play();
        loadingSvg.style.visibility = 'visible';
    });

    // Pause the video when the audio stops playing
    audioElement.addEventListener('ended', function() {
        video.currentTime = video.duration;
        video.pause();
        userInput.disabled = false;
        loadingSvg.style.visibility = 'hidden';
    });

    audioElement.play();

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendAlexMessage(message, audioDataUrl) {
    // Append the text message
    const messageElement = document.createElement('div');
    const labelText = document.createElement('span');
    labelText.className = "label-text";
    const messageText = document.createElement('span');

    labelText.innerText = `Alex: `;
    messageText.innerText = `${message}`;

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
        video.loop = true; // Ensure video loops
        video.play();
        loadingSvg.style.visibility = 'visible';
    });

    // Pause the video when the audio stops playing
    audioElement.addEventListener('ended', function() {
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
      // Call your function here
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
    transcript.set("USER " + localDateTime, userMessage);

    console.log(transcript)
    userInput.disabled = true;


    fetch(base_url + '/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMessage, condition: condition, id: id, lastThreeTurns: lastThreeTurns, first: 'false'})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(data.message, data.audio);
        addToLastThreeTurns(createTurnObject("user", userMessage));
        addToLastThreeTurns(createTurnObject("assistant", data.message));
        console.log("TOPIC IS", data.topic)
        checkTopic(data.topic)
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        console.log("LOCAL DATE TIME IS: " + localDateTime);
        transcript.set("ALEX " + localDateTime, data.message);

        console.log(transcript)
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();        
        userInput.disabled = true;
    });

    userInput.value = ''; // Clear input field after sending message
    console.log(lastThreeTurns)
}

window.onload = function() {
    // Assuming you have a reference to the button element
    const finishButton = document.getElementById('finish-button');

    console.log("IN ON LOAD")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    id = urlParams.get('id')
    console.log(id);

    let userMessage = "Please introduce yourself as Alex, a virtual healthcare assistant. Give a broad overview of the kinds of clinical trials topics you can discuss/answer (3 max)."
    
    transcript.set("id", id);
    transcript.set("condition", condition);

    currentDate = new Date();
// Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    console.log("LOCAL DATE TIME IS: " + localDateTime);
    transcript.set("USER " + localDateTime, userMessage);

    console.log(transcript)

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

    // const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(ellipse);

    userInput.disabled = true;

    console.log("AB TO SEND: " + JSON.stringify({message: userMessage, condition: condition, id: id}))
    fetch(base_url + `/api/chatbot`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: userMessage, condition: condition, id: id, lastThreeTurns: lastThreeTurns, first: 'true'})
    })
    .then(response => response.json())
    .then(data => {
        checkModal(data.message, data.audio);
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        console.log("LOCAL DATE TIME IS: " + localDateTime);
        transcript.set("ALEX " + localDateTime, data.message);
        addToLastThreeTurns(createTurnObject("assistant", data.message));
        console.log(transcript)
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();
    });
  };

  function logTranscript() {
    console.log("IN LOG TRANSCRIPT!")
    let transcriptString = JSON.stringify(Object.fromEntries(transcript));
    fetch('/transcript', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, transcript: transcriptString})
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

