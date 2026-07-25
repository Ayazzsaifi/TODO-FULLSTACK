async function getTodos() {
    const token= localStorage.getItem("token");
    const response= await axios.get("https://todo-fullstack-cjkf.onrender.com/todos" , { headers: { token } })
    const todolist= document.getElementById("todo-list");
    const todo=response.data.todos
    todolist.innerHTML = ""

    todo.forEach(function(todoItems){
        const li=document.createElement("li")
        li.innerHTML=todoItems.title
        todolist.appendChild(li)

    })
}
getTodos()

const addTodo=document.getElementById("add");
const todoInput= document.getElementById("todo-input");


addTodo.addEventListener("click",async function(){
    if(todoInput.value===""){
    alert("todo is empty")
}
else{
    const token= localStorage.getItem("token")
    const newTodo= todoInput.value;
    const response= await axios.post("https://todo-fullstack-cjkf.onrender.com/todo",{title:newTodo} ,{headers:{token}})
    todoInput.value=""
    getTodos()
}
})