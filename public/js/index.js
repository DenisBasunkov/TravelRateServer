
var f = document.getElementById('alert');
const formAuth = document.getElementById("form_auth")
const login = document.getElementById('login').value
const password = document.getElementById('password').value

formAuth.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(formAuth)
    const login = formData.get('login')
    const password = formData.get('password')
    if (login == "admin") {
        if (password == '12345') {
            alert("fss")
        } else {
            const d = process.env.TEST
            alert(d)
        }

    } else {
        alert("false login")
    }
})