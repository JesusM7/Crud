const boton = document.getElementById("btn-registrar");
boton.addEventListener("click", async function (e) {
    const user = document.getElementById("user").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const data = JSON.stringify({ user, lastname, email });
    const respuesta = await fetch('/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
    boton.innerHTML = "registrarse";
    const dataRespuesta = await respuesta.json();
    window.location.href  = "/"

});
