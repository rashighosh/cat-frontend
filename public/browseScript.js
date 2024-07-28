var CAT_IDS = [
    "ct_control_assistant_id",
    "ct_accommodation_assistant_id",
]

var BRIEFscore = 0
var commStyle = ''
var userInfo = ''

const base_url = "http://44.209.126.3"
// const base_url = "http://127.0.0.1:8000"

var cat_assistant_id = ""

const chatBox = document.getElementById('chat-box');
const concludeButton = document.getElementById('conclude-button');

var currentDate;
var localDateTime;
var browseTranscript = new Map()

var id = ''
var condition = ''
var bhls = ''

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;


function enableInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
}

function disableInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}

function convertTextToHTML(text) {
    // Split the text into lines
    const lines = text.split('\n');
  
    // Start the HTML with an unordered list
    let html = '<ul>';
  
    // Track the depth of sub-lists
    let depth = 0;
  
    lines.forEach(line => {
      // Determine the current depth by counting leading spaces or tabs
      const currentDepth = line.search(/\S|$/); // Index of first non-space character
  
      if (currentDepth > depth) {
        // If deeper, start a new sub-list
        html += '<ul>';
      } else if (currentDepth < depth) {
        // If shallower, close the current sub-list
        html += '</ul>';
      }
  
      // Set the new depth
      depth = currentDepth;
  
      // Remove leading hyphens, asterisks, and spaces, and wrap the line in <li> tags
      const content = line.trim().replace(/^[-*] /, '');
      if (content) {
        html += `<li>${content}</li>`;
      }
    });
  
    // Close any open lists
    while (depth-- > 0) {
      html += '</ul>';
    }
  
    // Close the main list
    html += '</ul>';
  
    return html;
  }

  function getTrial(NCTID, selectButton, deselectButton1, deselectButton2) {
    console.log(selectButton)
    document.getElementById(selectButton).classList.add('selected-study')
    document.getElementById(deselectButton1).classList.remove('selected-study')
    document.getElementById(deselectButton2).classList.remove('selected-study')
    fetch(NCTID+'.json')
        .then(response => response.json())
        .then(data => {
            const briefTitle = data.protocolSection.identificationModule.briefTitle;
            const eligibilityCriteria = data.protocolSection.eligibilityModule.eligibilityCriteria;
            const briefSummary = data.protocolSection.descriptionModule.briefSummary;
            const studyType = data.protocolSection.designModule.studyType;
            const primaryOutcome = data.protocolSection.outcomesModule.primaryOutcomes[0].measure;
            
            const eligibility = data.protocolSection.eligibilityModule;
            const sex = eligibility.sex || 'Not specified';  // Defaulting to 'Not specified' if sex is not defined
            const minimumAge = eligibility.minimumAge || 'Not specified';  // Defaulting to 'Not specified' if minimumAge is not defined
            const maximumAge = eligibility.maximumAge || 'Not specified';
            
            let htmlCriteria = convertTextToHTML(eligibilityCriteria);

            document.getElementById("criteriaList").innerHTML = htmlCriteria

            const ctTitle = document.getElementById('ct-title');
            const ctSummary = document.getElementById('ct-summary');
            const ctType = document.getElementById('ct-type');
            const ctOutcome = document.getElementById('ct-outcome');
            const ctSex = document.getElementById('ct-sex');
            const ctMinAge = document.getElementById('ct-minAge');
            const ctMaxAge = document.getElementById('ct-maxAge');

            ctTitle.innerHTML="Study " + selectButton + ": " + briefTitle
            ctSummary.innerHTML=briefSummary
            ctType.innerHTML=studyType
            ctOutcome.innerHTML=primaryOutcome
            ctSex.innerHTML=sex
            ctMinAge.innerHTML=minimumAge
            ctMaxAge.innerHTML=maximumAge

        })
        .catch(error => console.error('Error loading the data: ', error));
  }


document.addEventListener("DOMContentLoaded", function() {
    getTrial("NCT04990895", "1", "2", "3")
});

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
    browseTranscript.set("USER " + localDateTime, userMessage);
    updateTranscript();

    fetch(base_url + `/api/cat/browse`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, cat_bot_id: cat_assistant_id, user_message: userMessage, health_literacy: bhls})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.response)
        appendAlexMessage(data.response, data.audio);
        currentDate = new Date();
        // Convert the date and time to the user's local time zone
        localDateTime = currentDate.toLocaleString();
        // Output the local date and time
        browseTranscript.set("ALEX " + localDateTime, data.response);
        updateTranscript();
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
    console.log("IN ONLOAD")
    disableInput();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    id = urlParams.get('id')
    bhls = urlParams.get('bhls')
    console.log(id);

    if (condition === '6') {
        cat_assistant_id = "ct_accommodative_assistant_id"
    } else if (condition === '0') {
        cat_assistant_id = "ct_control_assistant_id"
    }

    console.log("CAT ASSISTANT ID IS:", cat_assistant_id)

    var alexMessage = "Introduce yourself, and let the user know to refer to the clinical trials as Study 1, Study 2, or Study 3. Suggest 1-2 questions you can answer."

    appendLoadingDots();
    

    currentDate = new Date();
    localDateTime = currentDate.toLocaleString();
    browseTranscript.set("SYSTEM " + localDateTime, alexMessage);
    updateTranscript();

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
        console.log("CHECKED FO RUSER GOT SOME DATA COOL")

        console.log("AB TO CALL PYTHON API TO BROWSE")
        fetch(base_url + `/api/cat/browse`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: id, cat_bot_id: cat_assistant_id, user_message: alexMessage, health_literacy: bhls})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.response)
            appendAlexMessage(data.response, data.audio);
            currentDate = new Date();
            // Convert the date and time to the user's local time zone
            localDateTime = currentDate.toLocaleString();
            // Output the local date and time
            browseTranscript.set("ALEX " + localDateTime, data.response);
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            const ellipse = document.getElementById('lds-ellipsis')
            ellipse.remove();
        });
    })
    .catch(error => {
        if (error.message === 'HTTP status 404') {
            console.log("User does not exist.");
        } else {
            console.error('Error:', error);
        }
    })
    .finally(() => {
        console.log("Done checking if user exists.");
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
    console.log(currentURL);
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
    let transcriptString = JSON.stringify(Object.fromEntries(browseTranscript));

    fetch('/updateTranscript', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id, 
            transcriptType: 'browseTranscript', 
            transcript: transcriptString
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transcript updated successfully");
    })
    .catch(error => console.error('Error logging transcript:', error));
}

function nextPage() {
    window.location.href = `https://ufl.qualtrics.com/jfe/form/SV_bdT4OdUMSNUf5oq?id=${id}&bhls=${bhls}&c=${condition}&browsed=1`
}