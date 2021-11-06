const functions = require('firebase-functions');
// const { functions } = require('./util/admin');
const app = require('express')();
const auth = require('./util/auth');

const {
    loginUser,
    signUpUser,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users');

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos')

// Todos
app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);