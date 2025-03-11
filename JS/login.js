localStorage.setItem("Usuario", JSON.stringify({ username: "JuiceWRLD999", password: "jaredguineo02", role: "admin" }));
localStorage.setItem("UsuarioNormal", JSON.stringify({ username: "user1", password: "user01", role: "user" }));

function login() {
    const emailInput = document.getElementById("typeEmailX-2").value;
    const passwordInput = document.getElementById("typePasswordX-2").value;
    const storedAdmin = JSON.parse(localStorage.getItem("Usuario"));
    const storedUser = JSON.parse(localStorage.getItem("UsuarioNormal"));

    if (emailInput === storedAdmin.username && passwordInput === storedAdmin.password) {
        alert("Acceso como administrador.");
        window.location.href = "..//Pages/admi.html"; 
    } 
    else if (emailInput === storedUser.username && passwordInput === storedUser.password) {
        alert("Acceso como usuario.");
        window.location.href = "..//Pages/pago.html";
    } 
    else {
        alert("Usuario o contraseña incorrectos.");
    }
}
