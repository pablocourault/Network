document.addEventListener('DOMContentLoaded', function() {

    var altura = window.innerHeight-184;
    
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
                  ideditcontents = 'editcontents' + a.dataset.postid;
                  document.querySelector('#'+idcontenido).style.visibility = "hidden";
                  document.querySelector('#'+idcontenido).style.display = "none";
                  document.querySelector('#'+ideditcontents).style.visibility = "visible";
                  document.querySelector('#'+ideditcontents).style.display = "block";
                  document.querySelector('#'+ideditcontents).focus();
                  a.innerHTML = "Save";
                }
            else
                {
                 textoactualizado = document.querySelector('#'+ideditcontents).value;
                 document.querySelector('#'+ideditcontents).style.visibility = "hidden";
                 document.querySelector('#'+ideditcontents).style.display = "none";
                 document.querySelector('#'+idcontenido).style.visibility = "visible";
                 document.querySelector('#'+idcontenido).style.display = "block";
                 a.innerHTML = "Edit";

                 if (textoactualizado.length < 5)
                
                    {
                     alert("Error: empty post");
                    }

                 else { 
                        fetch('/edit', {
                                        method: 'POST',
                                        body: JSON.stringify({postupdated: a.dataset.postid,
                                                              contentupdated: textoactualizado})
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







     
    
