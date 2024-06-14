document.getElementById("loginform").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username")
    const password = document.getElementById("password")

    const loginButton = document.querySelector("#login-button")

    const storedUsername = localStorage.getItem("username")
    const storedPassword = localStorage.getItem("password")

    loginButton.onclick = () => {
        console.log("logged in")
        if (username.value === storedUsername && password.value === storedPassword) {
            alert('Login Succesful, welcome ${username.value}!')
        window.location.href = "indexx.html"
    } 
    else {
        alert("Credentials doenst match the database, please try again")
    }
}
})

