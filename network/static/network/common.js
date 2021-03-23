document.addEventListener('DOMContentLoaded', function() {

    var altura = window.innerHeight-168;
    
    document.querySelector('#posts').style.height = altura+'px';

    // selecciono todos los elementos de etiqueta <i> correspondiente a la clase identity y escucho el evento onclick
    // se hace de esta manera y no poniendo el "onclick" en el html

    document.querySelectorAll('i.identity').forEach(function(i) {
      i.onclick = function() {
          likescounter(i.dataset.identity); } });

    // selecciona todos los enlaces para editar posts
    document.querySelectorAll('a.enlaceedit').forEach(function(a) {

            a.onclick = function()
            { 
            if (a.innerHTML == "Edit")
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
            else
                {
                 document.querySelector('#'+idcontenido).contentEditable = "false";
                 document.querySelector('#'+idcontenido).style.background = "#fafafa";
                 document.querySelector('#'+idcontenido).style.border = "none";
                 document.querySelector('#'+idcontenido).style.fontSize = "small";
                 a.innerHTML = "Edit";

                 if ((document.querySelector('#'+idcontenido).innerHTML.length) < 5)
                
                    {
                     alert("Error: empty post");
                    }

                 else { 
                        fetch('/edit', {
                                        method: 'POST',
                                        body: JSON.stringify({postupdated: a.dataset.postid,
                                                              contentupdated: document.querySelector('#'+idcontenido).innerHTML})
                                        })
                        // en las siguientes lineas veo el status y paso el json al mismo tiempo
                        // ver también función enviar correo del proyecto 3 Mail
                        // save status to variable "estado", to use in the next "then"
                                           // ver si hay otra forma

                        .then(response => {console.log(response.status);
                                           estado = response.status;
                                           return response.json()})
                        .then(data => { console.log(data);
                                        if (estado == 201)
                                           {
                                            document.querySelector('#'+idcontenido).innerHTML = data.contenidoaactualizar;
                                           }
                                        else
                                           {
                                            document.querySelector('#'+idcontenido).innerHTML = "Edit Failed";  
                                           }
                                      })
                     }
                }
            }
                
            });
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







     
    
