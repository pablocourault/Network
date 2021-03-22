document.addEventListener('DOMContentLoaded', function() {

    var altura = window.innerHeight-168;
    
    document.querySelector('#posts').style.height = altura+'px';

    document.querySelector('#compose-form').addEventListener('submit', sendpost);

    // selecciono todos los elementos de etiqueta <i> correspondiente a la clase identity y escucho el evento onclick
    // se hace de esta manera y no poniendo el "onclick" en el html

    document.querySelectorAll('i.identity').forEach(function(i) {
      i.onclick = function() {
          likescounter(i.dataset.identity); } });

    document.querySelectorAll('a.enlaceedit').forEach(function(a) {

            if (a.innerHTML == "Edit")
              {
              a.onclick = function() 
                {

                  idcontenido = 'contents' + a.dataset.postid;
                  document.querySelector('#'+idcontenido).contentEditable = "true";
                  document.querySelector('#'+idcontenido).style.background = "#ededed";
                  document.querySelector('#'+idcontenido).style.border = "1px solid";
                  document.querySelector('#'+idcontenido).style.padding = "8px";
                  document.querySelector('#'+idcontenido).style.borderRadius = "4px";
                  document.querySelector('#'+idcontenido).style.fontSize = "large";
                  document.querySelector('#'+idcontenido).focus();
                  a.innerHTML = "Save";
                }
              }

            if (a.innerHTML == "Save")
                {
                a.onclick = function() {
                                      alert(document.querySelector('#'+idcontenido).innerHTML);
                  }
                }

                
            } );


});

function likescounter(postid) 

    { route = '/' + postid;
      fetch(route)
            .then(response => response.json()) // OJO si no pongo response.json() "data" queda sin definir
            .then(data  => {
              
              cantidad= data.likes;
              megusta = data.megusta;

              iconid = '#icon' + postid;

              if (megusta === 'True') 
                 {document.querySelector(iconid).innerHTML = 'favorite'}
              else
                 {document.querySelector(iconid).innerHTML = 'favorite_border'}

              textid = '#text' + postid;
              document.querySelector(textid).innerHTML = cantidad;
              
          });          
    }


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




     
    
