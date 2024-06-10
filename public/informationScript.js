const surveyItems = [
    {
        "message": "Hi, I'm Alex! Before we start talking about clinical trials, I'd like to learn more about you to help tailor our conversation. I'll start by reading you 3 statements. For each statement, please choose a number between 1 and 7 to rate your agreement with the statement. Please select <b>'Continue'</b> to proceed.",
        "instructions": "Please select your response:",
        "options": ['Continue']
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Talkativeness",
        "message": "Alright! First statement: <b>I like to talk a lot</b>.",
        "instructions": "Please select your response, where <em>1=Completely Disagree</em> and <em>7=Completely Agree:</em>",
        "options": ['1', '2', '3', '4', '5', '6', '7']
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Casualness",
        "message": "Thank you! Next statement: <b>I generally address others in a very casual way</b>.",
        "instructions": "Please select your response, where <em>1=Completely Disagree</em> and <em>7=Completely Agree:</em>",
        "options": ['1', '2', '3', '4', '5', '6', '7']
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Conciseness",
        "message": "Got it. Final statement: <b>Most of the time, I only need a few words to explain something</b>.",
        "instructions": "Please select your response, where <em>1=Completely Disagree</em> and <em>7=Completely Agree:</em>",
        "options": ['1', '2', '3', '4', '5', '6', '7']
    },
    {
        "message": "Thanks for your responses! Now, I'm going to ask you 4 questions. This time, please choose a number between 1 and 5 to answer the question. Please select <b>Continue</b> to proceed.",
        "instructions": "Please select your response:",
        "options": ['Continue']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Help Reading Health Materials Frequency",
        "message": "Alright! First question: <b>How often do you have someone help you read health-related materials</b>?",
        "instructions": "Please select your response, where <em>1=Always</em>, <em>2=Often</em>, <em>3=Sometimes</em>, <em>4=Occasionally</em>, and <em>5=Never:</em>",
        "options": ['1', '2', '3', '4', '5']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Filling Out Medical Forms Confidence",
        "message": "Next, <b>How confident are you filling out medical forms by yourself</b>?",
        "instructions": "Please select your response, where <em>1=Not At All</em>, <em>2=A Little Bit</em>, <em>3=Somewhat</em>, <em>4=Quite A Bit</em>, and <em>5=Extremely:</em>",
        "options": ['1', '2', '3', '4', '5']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Difficulty Learning About Condition From Written Info",
        "message": "Third, <b>How often do you have problems learning about your medical condition because of difficulty understanding written information</b>?",
        "instructions": "Please select your response, where <em>1=Always</em>, <em>2=Often</em>, <em>3=Sometimes</em>, <em>4=Occasionally</em>, and <em>5=Never:</em>",
        "options": ['1', '2', '3', '4', '5']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Difficulty Understanding What is Told About Condition",
        "message": "Finally, <b>How often do you have a problem understanding what is told to you about your medical condition</b>?",
        "instructions": "Please select your response, where <em>1=Always</em>, <em>2=Often</em>, <em>3=Sometimes</em>, <em>4=Occasionally</em>, and <em>5=Never:</em>",
        "options": ['1', '2', '3', '4', '5']
    },
    {
        "message": "Thanks for your responses! Finally, I will ask you three questions. This time, you can freely type your responses. Please select <b>Continue</b> to proceed.",
        "instructions": "Please select your response:",
        "options": ['Continue']
    },
    {
        "survey": "Background Info",
        "item": "Receiving Information",
        "message": "First, <b>How do you usually go about receiving information about health-related topics</b>?",
    },
    {
        "survey": "Background Info",
        "item": "Who Do You Consult With",
        "message": "Second, <b>Who do you typically consult with when making important health-related decisions, and how do they influence your choices</b>?",
    },
    {
        "survey": "Background Info",
        "item": "Opportunity to Participate",
        "message": "Finally, <b>If you had the opportunity to participate in a clinical trial today, what factors would affect your decision</b>?",
    },
    {
        "message": "Alright, thanks for sharing a little about yourself with me! Please click the button in the bottom right to proceed to talking about clinical trials.",
    },
]

let surveyAnswers = {}
let backgroundInfo = {}

let counter = 0;

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

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

// const base_url = "http://44.209.126.3"
const base_url = "http://127.0.0.1:8000"


const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

var buttonSelection = ''

function increaseProgress() {
    if (progress < 13) {
        progress++;
        updateProgressBar();
        updateProgressText();
    }
    if (progress >= 13) {
        // Assuming you have a reference to the button element
        const finishButton = document.getElementById('finish-button');

        // To disable the button
        finishButton.disabled = false;
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress');
    const progressWidth = (progress / 13) * 100;
    progressBar.style.width = `${progressWidth}%`;
}

function updateProgressText() {
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `Progress: ${Math.floor(progress * (100/13))}%`;
}

// Function to dynamically generate buttons
function generateButtons(responsesArray) {

    // Array of response options
    // Get the container for buttons
    let buttonsContainer = document.getElementById("user-message-buttons");

    // Clear any existing buttons
    buttonsContainer.innerHTML = '';

    // Generate buttons for each response option
    responsesArray.forEach(function(response) {
        let button = document.createElement("button");
        button.textContent = response;
        button.classList.add("user-input-button");
        button.id = response
        buttonsContainer.appendChild(button);
        button.onclick = function() {
            selectButton(response);
        };
    });
}

function selectButton(response) {
    let buttonsContainer = document.getElementById("user-message-buttons");
    let selectedButton = document.getElementById(response);

    // Check if the clicked button is already selected
    if (selectedButton.classList.contains("selected")) {
        // Deselect the button
        selectedButton.innerText = selectedButton.innerText.replace('✔ ', ''); // Remove the check mark
        selectedButton.classList.remove("selected");
        // Update the buttonSelection variable or perform any other actions as needed
        buttonSelection = ''; // or any other appropriate value
    } else {
        // Deselect all other buttons
        let buttons = buttonsContainer.querySelectorAll(".user-input-button");
        buttons.forEach(function(button) {
            if (button.id !== response) {
                button.innerText = button.innerText.replace('✔ ', ''); // Remove the check mark
                button.classList.remove("selected");
            }
        });

        // Select the clicked button
        selectedButton.innerText = '✔ ' + selectedButton.innerText;
        selectedButton.classList.add("selected");

        // Update the buttonSelection variable or perform any other actions as needed
        buttonSelection = response;
    }
}


function appendAlexMessage(message, audioDataUrl) {
    if (counter <= 9) {
        inputAreaText.style.display = "none"
        inputAreaButtons.style.display = "flex"
        generateButtons(surveyItems[counter].options)
        document.getElementById("button-instructions").innerHTML = surveyItems[counter].instructions
    } else if (counter === 13) {
        inputAreaText.style.display = "none"
        inputAreaButtons.style.display = "none"
        finishButton.disabled = false
    }
    else {
        inputAreaText.style.display = "flex"
        inputAreaButtons.style.display = "none"
    }
    
    counter++;
    
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
    // // Create and append the audio element
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
    //     console.log("IT HAS ENDED")
    //     video.currentTime = video.duration;
    //     video.pause();
    //     userInput.disabled = false;
    //     loadingSvg.style.visibility = 'hidden';
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

function sendMessage(type) {
    var userMessage
    if (type === 'button') {
        if (buttonSelection === '') { 
            alert('Please select a button to continue.') 
            return
        } else {
            userMessage = buttonSelection;
            if (surveyItems[counter-1].item) {
                surveyAnswers[surveyItems[counter-1].item.replace(/\s/g, "")] = buttonSelection;
            }
        }
    } else {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
        backgroundInfo[surveyItems[counter-1].item.replace(/\s/g, "")] = userMessage;
    }

    appendUserMessage(userMessage);

    currentDate = new Date();
    // Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    informationTranscript.set("USER " + localDateTime, userMessage);

    // userInput.disabled = true;

    let alexMessage = surveyItems[counter].message

    fetch(base_url + '/api/cat/voice', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({agent_message: alexMessage})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage(alexMessage, data.audio);
        buttonSelection = ''
        increaseProgress();
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        informationTranscript.set("ALEX " + localDateTime, alexMessage);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
        const ellipse = document.getElementById('lds-ellipsis');
        ellipse.remove();        
        // userInput.disabled = true;
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

    var alexMessage = surveyItems[counter].message

    currentDate = new Date();
    localDateTime = currentDate.toLocaleString();
    informationTranscript.set("ALEX " + localDateTime, alexMessage);

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

    // userInput.disabled = true;

    fetch(base_url + `/api/cat/voice`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({agent_message: alexMessage })
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage(alexMessage, data.audio);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Remove loading indicator after response received
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

function logInformationTranscript() {
    console.log("IN LOG TRANSCRIPT!")
    let transcriptString = JSON.stringify(Object.fromEntries(informationTranscript));

    console.log(surveyAnswers)
    console.log(backgroundInfo)

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
        console.log("check for transcript file")
        window.location.href = "/interaction?id=" + id + "&c=" + condition;
    });
  }