const video = document.getElementById('myVideo');
const chatBox = document.getElementById('chat-box');
var id;
var condition;

var currentDate;
var localDateTime;
var transcript = new Map()

const userInput = document.getElementById('user-input');
const loadingSvg = document.getElementById('loading-svg');

let progress = 0;

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

    // Get an iterator over the entries
    const entriesIterator = transcript.entries();

    // Convert the iterator to an array
    const entriesArray = Array.from(entriesIterator);

    // Remove the first two entries from the array
    const remainingEntries = entriesArray.slice(2);

    // Extract the values from the remaining entries and format them based on the key
    const formattedValuesArray = [];
    remainingEntries.forEach(([key, value]) => {
        if (key.includes("USER")) {
            formattedValuesArray.push({
                role: "user",
                content: value
            });
        } else {
            formattedValuesArray.push({
                role: "assistant",
                content: value
            });
        }
    });

    console.log(formattedValuesArray);

    // Check if there are 3 or more items in the array
    if (formattedValuesArray.length >= 3) {
        // If yes, extract the last three items
        const lastThreeItems = formattedValuesArray.slice(-2);
        console.log("Last three items:", lastThreeItems);
    } else {
        // If not, use the entire array
        console.log("Formatted values array:", formattedValuesArray);
    }

    fetch('http://44.209.126.3/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMessage, condition: condition, id: id, memoryTurns: formattedValuesArray})
    })
    .then(response => response.json())
    .then(data => {
        appendAlexMessage2(data.message, data.audio);
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
        increaseProgress();
        userInput.disabled = true;
    });

    userInput.value = ''; // Clear input field after sending message
}

window.onload = function() {
    // Assuming you have a reference to the button element
    const finishButton = document.getElementById('finish-button');

    // To disable the button
    finishButton.disabled = true;

    console.log("IN ON LOAD")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    console.log(condition);
    // shirt

    id = urlParams.get('id')
    console.log(id);

    let userMessage = "Please introduce yourself. Give a broad overview of the kinds of clinical trials topics you can discuss/answer (3 max)."
    
    transcript.set("id", id);
    transcript.set("condition", condition);
    transcript.set("id", id);

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
    fetch(`http://44.209.126.3/api/chatbot`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: userMessage, condition: condition, id: id, memoryTurns: "none"})
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
    console.log(id)
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
        window.location.href = "https://ufl.qualtrics.com/jfe/form/SV_1TgxItlntE1uUzs?id=" + id;
    });
  }
  