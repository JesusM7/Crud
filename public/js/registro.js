const boton = document.getElementById("btn-registrar");
document.getElementById("form-registro").addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
        const user = document.getElementById("user").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("email").value;
        const pass = document.getElementById("pass").value;
        const data = JSON.stringify({ user, lastname, email, pass });
        debugger;
        const respuesta = await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        if (respuesta.status === 200) {
            boton.innerHTML = "registrarse";
            const dataRespuesta = await respuesta.json();
            window.location.href = "/login";
        } else {
            alert("Todos los campos son requeridos.")
        }
    } catch (error) {
        console.log(error);
    }

});
