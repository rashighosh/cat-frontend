var currentDate;
var localDateTime;
var transcript = new Map()

var id = ''
var condition = ''

var CAT_IDS = [
    "control_assistant_id",
    "approximation_assistant_id",
    "interpretability_assistant_id",
    "interpersonal_control_assistant_id",
    "discourse_management_assistant_id",
    "emotional_expression_assistant_id"
]

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    condition = urlParams.get('c')
    id = urlParams.get('id')

    condition = parseInt(condition)
    currentDate = new Date();

    console.log("User entered application at:", currentDate)
    console.log("User ID is:", id)
    console.log("CAT condition is: " + condition + ": " + CAT_IDS[condition])

    logToDatabase(id, condition, currentDate);
};


function navigateModalInstructions(current, show) {
    document.getElementById(current).style.display = 'none'
    document.getElementById(show).style.display = 'block'
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
    window.location.href = `/information?id=${id}&c=${condition}`
}