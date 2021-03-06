const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const e = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const findUsers = users.find(user => user.username === username);
  
  console.log(findUsers);
 if (!findUsers){
   return response.status(400).json({error: "user does not exists."})
 }else{
  request.user = findUsers;

  return next();
 }

  
}
//id name username todos []
app.post('/users', (request, response) => {
  const {name, username } = request.body;

  const userAlreadyExists = users.find(user => user.username === username)

  if (userAlreadyExists){
    return response.status(400).json({error: "User already exists."})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(200).json(user);
  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;


  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const {title, deadline } = request.body;

  const findUsers = users.find(user => user.username === username);

  

  
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline:  new Date(deadline),
    created_at: new Date()
  }

  findUsers.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title, done, deadline} = request.body;
  const {id} = request.params;

  const { user } = request;
 
  const todo = user.todos.find(todo => todo.id === id)

  if(!todo){

    return response.status(404).json({error: "list does not exists."})
   }

  
   todo.title = title;
   todo.deadline = new Date(deadline);

  
  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {title, done, deadline} = request.body;
  const {id} = request.params;

  const { user } = request;
 
  const todo = user.todos.find(todo => todo.id === id)
   if(!todo){

    return response.status(404).json({error: "list does not exists."})
   }


  todo.done = true;
  
  return response.json(todo); 
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const {user} = request;

  const findTodo = user.todos.findIndex( todo => todo.id === id);
  if(findTodo <= -1){
    return response.status(404).json({error: "list does not exists."})
  }else{
  user.todos.splice(findTodo, 1);

  return response.status(204).send();
  }
});

module.exports = app;