let id
let condition
let bhls

window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id')
    condition = urlParams.get('c')
    bhls = urlParams.get('bhls')
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
            window.location.href = `/browseInstructions?id=${id}&bhls=${bhls}&c=${condition}`
        } else {
            window.location.href = `https://ufl.qualtrics.com/jfe/form/SV_bdT4OdUMSNUf5oq?id=${id}&bhls=${bhls}&c=${condition}&browsed=0`
        }
        
    })
    .catch(error => console.error('Error logging choice data:', error))
}