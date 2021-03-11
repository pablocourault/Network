document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#compose-form').addEventListener('submit', sendpost);

});

function sendpost() {
    
    texto = document.querySelector('#compose-post').value;

    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
        contenido: texto })})
    /*    
   .then(response => {
      console.log('Response:', response)
      return response.json();})*/
 
      .then(response => {console.log(response.status);
        // save status to variable "estado", to use in the next "then"
        estado = response.status;
        if (response.status == 201)
           {
            document.querySelector('#compose-post').value = "";
           }
        return response.json()})

      
    .then(result => {console.log(result)});

    event.preventDefault();
    
    }
     
    
