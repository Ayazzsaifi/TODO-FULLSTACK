const loginBtn =document.getElementById('login-btn');
const signUpbtn=document.getElementById('signup-btn');
const emailInput=document.getElementById('email-input');
const passwordInput=document.getElementById('password-input');


loginBtn.addEventListener("click",async function(e){
    e.preventDefault()
    const email=emailInput.value;
    const password=passwordInput.value;
    const response= await axios.post("http://localhost:3000/signin",{email,password})
    localStorage.setItem( "token",response.data.token)
    window.location.href="todo.html"
});