const surveyItems = [
    {
        "survey": "Communication Styles Inventory",
        "item": "Talkativeness",
        "message": "Hi, I'm Alex! Before we start talking about clinical trials, I'd like to learn more about you to help tailor our conversation. I'll start by reading seven statements/questions. Please rate each statement by selecting a number below. <br/><br/> The first statement is: <b>I like to talk a lot</b>.",
        "options": ['1', '2', '3', '4', '5', '6', '7'],
        "label": ['Completely Disagree', '', '', 'Neither Disagree nor Agree', '', '', 'Completely Agree']
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Casualness",
        "message": "Got it. Next, <b>I generally address others in a very casual way</b>.",
        "options": ['1', '2', '3', '4', '5', '6', '7'],
        "label": ['Completely Disagree', '', '', 'Neither Disagree nor Agree', '', '', 'Completely Agree']
    },
    {
        "survey": "Communication Styles Inventory",
        "item": "Conciseness",
        "message": "Alright, moving on: <b>Most of the time, I only need a few words to explain something</b>.",
        "options": ['1', '2', '3', '4', '5', '6', '7'],
        "label": ['Completely Disagree', '', '', 'Neither Disagree nor Agree', '', '', 'Completely Agree']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Help Reading Health Materials Frequency",
        "message": "Okay. Now, <b>How often do you have someone help you read health-related materials</b>?",
        "instructions": "Please select your response, where <em>1=Always</em>, <em>2=Often</em>, <em>3=Sometimes</em>, <em>4=Occasionally</em>, and <em>5=Never:</em>",
        "options": ['1', '2', '3', '4', '5'],
        "label": ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Filling Out Medical Forms Confidence",
        "message": "Got it. Next, <b>How confident are you filling out medical forms by yourself</b>?",
        "options": ['1', '2', '3', '4', '5'],
        "label": ['Not at All', 'A Little Bit', 'Somewhat', 'Quite a Bit', 'Extremely']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Difficulty Learning About Condition From Written Info",
        "message": "Noted. And, <b>How often do you have problems learning about your medical condition because of difficulty understanding written information</b>?",
        "options": ['1', '2', '3', '4', '5'],
        "label": ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        "survey": "BRIEF Health Literacy Screening Tool",
        "item": "Difficulty Understanding What is Told About Condition",
        "message": "Okay, finally, <b>How often do you have a problem understanding what is told to you about your medical condition</b>?",
        "options": ['1', '2', '3', '4', '5'],
        "label": ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        "survey": "Background Info",
        "item": "Receiving Information",
        "message": "Thanks! To wrap up, I'll ask you three last questions. For these, you can type your responses below. <br/><br/> First, <b>How do you usually receive information about health-related topics</b>?",
    },
    {
        "survey": "Background Info",
        "item": "Who Do You Consult With",
        "message": "Alright. Second, <b>Who do you typically consult with when making important health-related decisions</b>?",
    },
    {
        "survey": "Background Info",
        "item": "Opportunity to Participate",
        "message": "Noted. Finally, <b>If you could participate in a clinical trial today, what factors would affect your decision</b>?",
    }
]

var CAT_IDS = [
    "control_assistant_id",
    "approximation_assistant_id",
    "interpretability_assistant_id",
    "interpersonal_control_assistant_id",
    "discourse_management_assistant_id",
    "emotional_expression_assistant_id"
]


let scripted_voice_base_url = "https://rashi-cat-study.s3.amazonaws.com/scripted/"
// let scripted_voice_base_url = "boop"

let surveyAnswersCommStyle = {}
let surveyAnswersBRIEF = {}
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

const base_url = "http://44.209.126.3"
// const base_url = "http://127.0.0.1:8000"


const finishButton = document.getElementById('finish-button');

// To disable the button
finishButton.disabled = true;

var buttonSelection = ''

var BRIEFscore = 0
var commStyle = ''
var userInfo = ''

function reverseScore(item) {
    // Reverse the score for a given item.
    // 1 becomes 5, 2 becomes 4, 3 stays 3, 4 becomes 2, and 5 becomes 1.
    const reverseMapping = {1: 5, 2: 4, 3: 3, 4: 2, 5: 1};
    return reverseMapping[item] || item;
}

function calculateBRIEFScore(surveyAnswersBRIEF) {
    for (const key in surveyAnswersBRIEF) {
        if (surveyAnswersBRIEF.hasOwnProperty(key)) {
            let value = surveyAnswersBRIEF[key];
            // Reverse score item 2
            if (key !== 'FillingOutMedicalFormsConfidence') {
                value = reverseScore(value);
            }
            // Add the value to the total score
            BRIEFscore += parseInt(value);
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
            userInfo += `${key}: ${value}; `;
        }
        userInfo = userInfo.trim().slice(0, -1);
    }
}

function increaseProgress() {
    if (progress < 10) {
        progress++
        updateProgressBar(10);
        updateProgressText(10);
    }
}

function updateProgressBar(num) {
    const progressBar = document.getElementById('progress');
    const progressWidth = (progress / num) * 100;
    progressBar.style.width = `${progressWidth}%`;
}

function updateProgressText(num) {
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `Progress ${Math.floor(progress * (100/num))}%`;
}

// Function to dynamically generate buttons
function generateButtons(responsesArray) {
    // Array of response options
    // Get the container for buttons
    let buttonsContainer = document.getElementById("user-message-buttons");

    // Clear any existing buttons
    buttonsContainer.innerHTML = '';

    // Generate buttons for each response option
    responsesArray.forEach(function(response, index) {
        let button = document.createElement("button");
        button.textContent = response;
        button.classList.add("user-input-button");
        button.id = response
        button.onclick = function() {
            selectButton(response);
        };

        let likertButtonItem  = document.createElement("div");
        likertButtonItem.classList.add("likert-button-item");

        
        let likertButtonLabel  = document.createElement("p");
        likertButtonLabel.classList.add("likert-label");
        likertButtonLabel.textContent = surveyItems[counter].label[index];
        likertButtonItem.appendChild(likertButtonLabel);


        likertButtonItem.appendChild(button);
        buttonsContainer.appendChild(likertButtonItem)
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

function enableInput() {
    if (counter <= 7) {
        var userButtonsArea = document.getElementById("user-message-buttons");
        var userButtonsSend = document.getElementById("send-btn-likert");
        userButtonsArea.classList.remove("unclickable");
        userButtonsSend.classList.remove("unclickable");
    } else {
        userInput.disabled = false;
    }
}

function disableInput() {
    if (counter <= 6) {
        var userButtonsArea = document.getElementById("user-message-buttons");
        var userButtonsSend = document.getElementById("send-btn-likert");
        userButtonsArea.classList.add("unclickable");
        userButtonsSend.classList.add("unclickable");
    } else {
        userInput.disabled = true;
    }
}


function appendAlexMessage(message, audioDataUrl) {
    if (counter <= 6) {
        inputAreaText.style.display = "none"
        inputAreaButtons.style.display = "flex"
        generateButtons(surveyItems[counter].options)
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
        video.currentTime = video.duration;
        video.pause();
        loadingSvg.style.visibility = 'hidden';
        if (progress >= 10) {
            // Assuming you have a reference to the button element
            const finishButton = document.getElementById('finish-button');
    
            // To disable the button
            finishButton.disabled = false;
        }
        enableInput()
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
    if (counter <= 10) {
        if (type === 'button') {
            if (buttonSelection === '') { 
                alert('Please select a button to continue.') 
                return
            } else {
                userMessage = buttonSelection;
                if (surveyItems[counter-1].item) {
                    if (counter <= 3) {
                        surveyAnswersCommStyle[surveyItems[counter-1].item.replace(/\s/g, "")] = buttonSelection;
                    } else {
                        surveyAnswersBRIEF[surveyItems[counter-1].item.replace(/\s/g, "")] = buttonSelection;
                    }
                }
            }
        } else {
            userMessage = userInput.value;
            if (userMessage.trim() === '') return;
            backgroundInfo[surveyItems[counter-1].item.replace(/\s/g, "")] = userMessage;
        }
    } else {
        userMessage = userInput.value;
        if (userMessage.trim() === '') return;
    }

    appendUserMessage(userMessage);
    disableInput()

    currentDate = new Date();
    // Convert the date and time to the user's local time zone
    localDateTime = currentDate.toLocaleString();
    // Output the local date and time
    informationTranscript.set("USER " + localDateTime, userMessage);

    if (counter < 10) {
        let alexMessage = surveyItems[counter].message

        setTimeout(function() {
            appendAlexMessage(alexMessage, scripted_voice_base_url + (counter+1).toString() + '.mp3');
            buttonSelection = ''
            currentDate = new Date();
            // Convert the date and time to the user's local time zone
            localDateTime = currentDate.toLocaleString();
            // Output the local date and time
            informationTranscript.set("ALEX " + localDateTime, alexMessage);

            const ellipse = document.getElementById('lds-ellipsis');
            ellipse.remove();        
        }, 1500); // 1500 milliseconds = 1.5 seconds

    } else {
        if (counter === 10) {
            calculateBRIEFScore(surveyAnswersBRIEF)
            formatJSONObjectAsString(surveyAnswersCommStyle, 'commStyle')
            formatJSONObjectAsString(backgroundInfo, 'userInfo')
            var controlInitialMessage = 'Thank the user for sharing their information, let them know you are ready to start talking about clinical trials, and list 2-3 things you can talk about based on your PERSONA.'
            var accommodateMessage = 'Thank the user for sharing their information, let them know you are ready to start talking about clinical trials, and list 2-3 things you can talk about based on your PERSONA and the following Background Information:'
            if (condition === '0') { userMessage = controlInitialMessage }
            else { userMessage = accommodateMessage }
        } 
        fetch(base_url + `/api/cat/assistant`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: id, cat_bot_id: CAT_IDS[condition], user_message: userMessage, user_info: userInfo, comm_style: commStyle, health_literacy: BRIEFscore})
        })
        .then(response => response.json())
        .then(data => {
            appendAlexMessage(data.response, data.audio);
            if (data.topic === 1) {
                if (counter === 11) { 
                    document.getElementById("progress-area").style.opacity = '100%';   
                } else {
                    increaseProgress()
                }
            }
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
    }
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

    setTimeout(function() {
        disableInput();
        appendAlexMessage(alexMessage, scripted_voice_base_url + '1.mp3');
        ellipse.remove();       
    }, 1500); // 1500 milliseconds = 1.5 seconds


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