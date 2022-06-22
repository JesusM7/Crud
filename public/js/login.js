const boton = document.getElementById("btn-login");
const resultado = document.getElementById("resultado");

document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
    const data = JSON.stringify({ email, pass });
    const respuesta = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
    boton.innerHTML = "logueando";
    const dataRespuesta = await respuesta.json();
    let timer = 1000;
    if (dataRespuesta.error) {
        resultado.innerText = dataRespuesta.message;
        timer = 2000;
    } else {
        resultado.innerText = "Exitoso";
        localStorage.setItem("name", dataRespuesta.name);
    }
    setTimeout(() => {
        resultado.innerText = "";
        window.location.href = "/";
    }, timer);
})

