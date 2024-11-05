var currentDate;
var localDateTime;
var transcript = new Map()

var id = ''
var condition = ''
var bhls = 0

var cat_assistant_id = ""

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    id = urlParams.get('id')
    bhls = urlParams.get('bhls')

    if (condition === '6') {
        cat_assistant_id = "accommodation_assistant_id"
    } else if (condition === '0') {
        cat_assistant_id = "control_assistant_id"
    }

    console.log(cat_assistant_id)

    condition = parseInt(condition)
    currentDate = new Date();

    console.log("User entered application at:", currentDate)
    console.log("User ID is:", id)
    console.log("CAT condition is: " + condition + " - " + cat_assistant_id)
    console.log("BHLS:", bhls)

    logToDatabase(id, condition, currentDate);
};


function navigateModalInstructions(current, show) {
    document.getElementById(current).style.display = 'none'
    document.getElementById(show).style.display = 'flex'
}
  
function checkCheckboxes(checkboxIds, current, show) {
    var allChecked = true;

    checkboxIds.forEach(function(id) {
        var checkbox = document.getElementById(id);
        if (!checkbox.checked) {
            allChecked = false;
        }
    });

    if (allChecked) {
        navigateModalInstructions(current, show);
    } else {
        alert("Please select all checkboxes to continue.");
    }
}

function logToDatabase(id, condition, currentDate) {
    fetch('/logUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, condition: condition, startTime: currentDate})
    })
    .then(async response => {
        if (response.status === 409) {
            const data = await response.json();
            throw new Error(data.message); // Throw error with the message from server
        }
        if (!response.ok) {
            throw new Error('Server responded with error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
    
}

function nextPage() {
    window.location.href = `/information?id=${id}&bhls=${bhls}&c=${condition}`
}

function nextPageBrowse() {
    window.location.href = `/browse?id=${id}&bhls=${bhls}&c=${condition}`
}

// Get the modal
var introModal = document.getElementById("intro-modal");
console.log(introModal)

// Get the button that opens the modal
var introBtn = document.getElementById("intro-help");

// Get the <span> element that closes the modal
var helpSpan = document.getElementsByClassName("help-close")[0];

// When the user clicks on the button, open the modal
introBtn.onclick = function() {
    introModal.style.display = "flex";
    currentURLelement = document.getElementById("current-link-help")
    const currentURL = window.location.href;
    currentURLelement.innerHTML = currentURL
}

// When the user clicks on <span> (x), close the modal
helpSpan.onclick = function() {
    introModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == introModal) {
    introModal.style.display = "none";
  }
}

function validateInput() {
    // Get the input value
    const input = document.getElementById('confirm').value;
    
    // Check if it matches "Yes"
    if (input === "I have thought of 5 concerns I have about clinical trials." || input === "I have thought of 5 concerns I have about clinical trials") {
        document.getElementById("message-fc1").style.display = 'none'
        document.getElementById("message-4").style.display = 'flex'
        var characterName = document.getElementById("character-name")
        var characterDescription = document.getElementById("character-description")
        var video = document.getElementById('myVideo');
        var source = document.getElementById('videoSource');
        if (bhls === '0') {
            characterName.innerHTML = "Meet Dr. Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Dr. Alex, a virtual version of an oncologist</b>. Please watch Dr. Alex introduce themselves below."
            source.setAttribute('src', 'DrAlex.mp4'); // Change to your new video file
        }
        if (bhls === '1') {
            characterName.innerHTML = "Meet Nurse Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Nurse Alex, a virtual version of an registered nurse</b>. Please watch Nurse Alex introduce themselves below."
            source.setAttribute('src', 'NurseAlex.mp4');
        }
        if (bhls === '2') {
            characterName.innerHTML = "Meet Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Alex, a virtual version of someone who knows a cancer survivor</b>. Please watch Alex introduce themselves below."
            source.setAttribute('src', 'Alex.mp4');
        }
        video.load(); // Reload the video element
        video.play(); // Optionally, start playing the new video
    } else {
        // Show an error message if it doesn't match
        document.getElementById('errorMessage').style.display = 'block';
    }
}

function skip() {
    document.getElementById("message-fc1").style.display = 'none'
        document.getElementById("message-4").style.display = 'flex'
        var characterName = document.getElementById("character-name")
        var characterDescription = document.getElementById("character-description")
        var video = document.getElementById('myVideo');
        var source = document.getElementById('videoSource');
        if (bhls === '0') {
            characterName.innerHTML = "Meet Dr. Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Dr. Alex, a virtual version of an oncologist</b>. Please watch Dr. Alex introduce themself below."
            source.setAttribute('src', 'DrAlex.mp4'); // Change to your new video file
        }
        if (bhls === '1') {
            characterName.innerHTML = "Meet Nurse Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Nurse Alex, a virtual version of an registered nurse</b>. Please watch Nurse Alex introduce themself below."
            source.setAttribute('src', 'NurseAlex.mp4');
        }
        if (bhls === '2') {
            characterName.innerHTML = "Meet Alex!"
            characterDescription.innerHTML = "You will be sharing your concerns with <b>Alex, a virtual version of someone whose close friend survived cancer</b>. Please watch Alex introduce themself below."
            source.setAttribute('src', 'Alex.mp4');
        }
        video.load(); // Reload the video element
        video.play(); // Optionally, start playing the new video
}

// Get the video and button elements
const video = document.getElementById('myVideo');
const button = document.getElementById('start');

// Listen for the 'ended' event on the video
video.addEventListener('ended', function() {
  // Enable the button when the video ends
  button.disabled = false;
});