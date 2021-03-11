document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#compose-form').addEventListener('submit', sendpost);

});

function sendpost() {

    texto = document.querySelector('#compose-post').value

    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
        contenido : texto })})
        .then(response => response.json())
        .then(result => {console.log(result);})

    event.preventDefault();
    
    }
