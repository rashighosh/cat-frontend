let id
let condition

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id')
    condition = urlParams.get('c')
}

function logBrowseTrialsChoice(choice) {
    fetch('/logBrowseTrialsChoice', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id, 
            BrowseTrialsChoice: choice
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Choice logged successfully");
        if (choice === 'Yes') {
            window.location.href = `/browse?id=${id}&c=${condition}`
        } else {
            window.location.href = `/gross`
        }
        
    })
    .catch(error => console.error('Error logging choice data:', error))
}