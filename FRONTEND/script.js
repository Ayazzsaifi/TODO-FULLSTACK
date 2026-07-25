const loginBtn =document.getElementById('login-btn');
const signUpbtn=document.getElementById('signup-btn');
const emailInput=document.getElementById('email-input');
const passwordInput=document.getElementById('password-input');
const nameInput= document.getElementById("name-input");


loginBtn.addEventListener("click",async function(e){
    e.preventDefault()
    const email=emailInput.value;
    const password=passwordInput.value;
    const response= await axios.post("https://todo-fullstack-cjkf.onrender.com",{email,password})
    localStorage.setItem( "token",response.data.token)
    window.location.href="todo.html"
});

signUpbtn.addEventListener("click",async function(e){
    e.preventDefault()
    const email=emailInput.value;
    const password=passwordInput.value
    const name=nameInput.value
    const response=await axios.post("https://todo-fullstack-cjkf.onrender.com",{email,password,name})
    alert("Signup successful! Please login.")
    emailInput.value="";
    passwordInput.value="";
    nameInput.value=""
})