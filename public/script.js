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

var selectedOption = null;

let progress = 0;
let accommodateMessage = ''
let controlMessage = ''
let highlights = ''
let audio_from_api = null

let hasLoaded = false;

const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

// Initialize the array
let lastThreeTurns = [];
let topicsObject = {}
for (let i = 1; i <= 5; i++) {
    topicsObject[i] = false;
}

const approximationMessage = "You're about to chat with our virtual agent, Alex. <b>We've programmed Alex to match your language and communication style during your conversation.</b> When Alex responds, you'll notice that certain words are <b>bolded</b> to emphasize this behavior.";
const interpretabilityMessage = "You're about to chat with our virtual agent, Alex. <b>We've programmed Alex to be clear and understandable during your conversation.</b> When Alex responds, you'll notice that certain words are <b>bolded</b> to emphasize this behavior.";
const discourseManagementMessage = "You're about to chat with our virtual agent, Alex. <b>We've programmed Alex to manage the flow and organization of your conversation.</b> When Alex responds, you'll notice that certain words are <b>bolded</b> to emphasize this behavior.";
const interpersonalControlMessage = "You're about to chat with our virtual agent, Alex. <b>We've programmed Alex to maintain a balanced power dynamic during your conversation.</b> When Alex responds, you'll notice that certain words are <b>bolded</b> to emphasize this behavior.";
const emotionalExpressionMessage = "You're about to chat with our virtual agent, Alex. <b>Our goal is to program Alex to be emotionally expressive during your conversation.</b> When Alex responds, you'll notice that certain words are <b>bolded</b> to emphasize this behavior.";

function modalInstructions(condition) {
    const catStrategyElement = document.getElementById("cat-strategy");
    let messageInstructions = ''

    switch (condition) {
        case '1':
            messageInstructions = approximationMessage
        break;
        case '2':
            messageInstructions = interpretabilityMessage
        break;
        case '3':
            messageInstructions = interpersonalControlMessage
        break;
        case '4':
            messageInstructions = discourseManagementMessage
        break;
        case '5':
            messageInstructions = emotionalExpressionMessage
        break;
        default:
            // Handle the case where 'condition' is not '1', '2', '3', '4', or '5'
            console.log("Condition is not '1', '2', '3', '4', or '5'.");
        break;
    }
  
    
    catStrategyElement.innerHTML = messageInstructions;
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

// const base_url = "http://44.209.126.3"
const base_url = "http://127.0.0.1:8000"


function closeModal() {
    if (selectedOption != null) {
        console.log("Selected option:", selectedOption);
        if (selectedOption === "select-control") {
            condition = 0;
            transcript.set("selected_condition", 0);
            document.getElementById("myModal").style.display = "none";
            checkModal(controlMessage, highlights, audio_from_api)
        } else {
            transcript.set("selected_condition", condition);
            document.getElementById("myModal").style.display = "none";
            checkModal(accommodateMessage, highlights, audio_from_api)
        }
        
        // Here you can perform any other action you need with the selected option
    } else {
        // No option selected, you can handle this case accordingly
        alert("Please select an option before starting.");
    }
}

function checkModal(message, highlights, audioDataUrl) {
    // Check the variable every 1 second (1000 milliseconds)
    var intervalId = setInterval(function() {
    // Check if the variable is true
    if (document.getElementById("myModal").style.display == "none") {
        // Execute your function
        appendAlexMessage2(message, highlights, audioDataUrl);
        clearInterval(intervalId);
    }
}, 1000); // Interval set to 1000 milliseconds (1 second)
}


function appendAlexMessage2(message, highlights, audioDataUrl) {
    console.log("MESSAGE IS:", message)
    console.log(highlights)
    // Iterate over the highlights array
    // Iterate over the highlights array
    highlights.forEach(function(highlight) {
        // Escape special characters in highlight
        const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Check if the highlight exists in the message
        if (message.includes(highlight)) {
            // If found, replace the highlight in the message with the same text wrapped in a span with bold
            message = message.replace(new RegExp(escapedHighlight, 'g'), '<span style="font-weight: bold;">' + highlight + '</span>');
        }
    });
    
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
    transcript.set("USER " + localDateTime, userMessage);

    console.log(transcript)
    userInput.disabled = true;


    fetch(base_url + '/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMessage, condition: condition, id: id, lastThreeTurns: lastThreeTurns, first: 'false', returnControl: 'true'})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(data.message, data.highlights, data.audio);
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

    console.log("IN ON LOAD")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    id = urlParams.get('id')
    console.log(id);
    
    modalInstructions(condition)

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

    console.log("HERE ADDING ELIPPSE")
    // const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(ellipse);

    userInput.disabled = true;

    console.log("AB TO SEND: " + JSON.stringify({message: userMessage, condition: condition, id: id}))
    fetch(base_url + `/api/chatbot`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: userMessage, condition: condition, id: id, lastThreeTurns: lastThreeTurns, first: 'true', returnControl: 'true'})
    })
    .then(response => response.json())
    .then(data => {
        // checkModal(data.message, data.highlights, data.audio);
        audio_from_api = data.audio
        controlMessage = data.controlMessage
        accommodateMessage = data.message
        highlights = data.highlights
        hasLoaded = true;
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
        console.log("HERE SHOULD REMOVE ELIPPSE")
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

// document.getElementById('nextBtn1').addEventListener('click', function() {
//     document.getElementById('message-1').style.display = 'none'
//     document.getElementById('message-2').style.display = 'block'
// });

// document.getElementById('nextBtn2').addEventListener('click', function() {
//     document.getElementById('message-2').style.display = 'none'
//     document.getElementById('message-3').style.display = 'block'
// });

// document.getElementById('nextBtn3').addEventListener('click', function() {
//     document.getElementById('message-3').style.display = 'none'
//     document.getElementById('message-4').style.display = 'block'
// });

function navigateModalInstructions(current, show) {
    if (current === 'message-4' && show === 'message-5') {
        document.getElementById(current).style.display = 'none'
        const ellipse = document.createElement('div');
        ellipse.className = "lds-ellipsis";
        ellipse.setAttribute('id', "lds-ellipsis")

        const l1 = document.createElement('div');
        const l2 = document.createElement('div');
        const l3 = document.createElement('div');

        ellipse.appendChild(l1)
        ellipse.appendChild(l2)
        ellipse.appendChild(l3)

        // Select the modal element
        const modal = document.getElementById("myModal");

        // Append the ellipse to the modal content
        modal.querySelector('.modal-content').appendChild(ellipse);

        function checkHasLoaded() {
            if (hasLoaded === true) {
                console.log("IS TRUE")
                const ellipseRemoval = document.getElementById('lds-ellipsis');
                ellipseRemoval.remove();
                document.getElementById('message-5').style.display = 'block';
                
                console.log(highlights);
                // Iterate over the highlights array
                highlights.forEach(function(highlight) {
                    // Escape special characters in highlight
                    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    
                    // Check if the highlight exists in the accommodateMessage
                    if (accommodateMessage.includes(highlight)) {
                        // If found, replace the highlight in the accommodateMessage with the same text wrapped in a span with bold
                        accommodateMessage = accommodateMessage.replace(new RegExp(escapedHighlight, 'g'), '<span style="font-weight: bold;">' + highlight + '</span>');
                    }
                });
                
                document.getElementById('control').innerText = controlMessage;
                document.getElementById('accommodate').innerHTML = accommodateMessage;
            } else {
                // If hasLoaded is not true, keep checking on the next animation frame
                requestAnimationFrame(checkHasLoaded);
            }
        }
        // Start checking for hasLoaded
        checkHasLoaded();
    } else {
        document.getElementById(current).style.display = 'none'
        document.getElementById(show).style.display = 'block'
    }
}

// document.getElementById('nextBtn4').addEventListener('click', function() {
    
// });

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

function selectAlexVersion(select, unselect) {
    selectedOption = select;
    var selectedBox = document.getElementById(select);
    selectedBox.classList.add('selected');

    var unselectedBox = document.getElementById(unselect);
    unselectedBox.classList.remove('selected');
}