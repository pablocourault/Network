document.addEventListener('DOMContentLoaded', function() {

   document.querySelector('#compose-form').addEventListener('submit', sendpost);

   var altura = window.innerHeight-194;
    
   document.querySelector('#posts').style.height = altura+'px';
   
});

function sendpost() {
    
  texto = document.querySelector('#compose-post').value;

  fetch('/post', {
      method: 'POST',
      body: JSON.stringify({
      contenido: texto })})
    .then(response => {console.log(response.status);
      // save status to variable "estado", to use in the next "then"
      estado = response.status;
      if (response.status == 201)
         {
          // start animation
          document.querySelector('#compose-post').value = "";
          document.querySelector('#compose-form').style.animationPlayState = 'running';
          setTimeout(function(){document.querySelector('#compose-form').style.display = 'none'},500);
          setTimeout(function(){document.querySelector('#compose-form').style.animationPlayState = 'paused'},500);
          setTimeout(function(){document.querySelector('#successfully').style.display = 'block'},1000);
          setTimeout(function(){document.querySelector('#successfully').style.display = 'none';
                                document.querySelector('#compose-form').style.display = 'block';},3000);
          setTimeout(function(){location.reload();},3200);

          // end animation  
                       
        }        
         
      return response.json()})
 
  .then(result => {console.log(result)});

  event.preventDefault(); 
  
  }





     
    
