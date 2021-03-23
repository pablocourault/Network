document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#follow-form').addEventListener('submit', following); });

function following()
  {
    usertofollow = document.querySelector('#usertofollow').value;
    accion = document.querySelector('#buttonfollow').value;

    route = '/follow/' + accion + '/' + usertofollow;

    fetch(route)
            .then(response => response.json()) // OJO si no pongo response.json() "data" queda sin definir
            .then(data  => {
                document.querySelector('#cantidadseguidores').innerHTML = data.seguidores;
                document.querySelector('#buttonfollow').value = data.action; // acá debo usar el value en lugar de innerHTML
            })

            event.preventDefault(); 
  }


 