const { db } = require('../util/admin');
const { where, collection, query, getDocs, orderBy, addDoc, doc, deleteDoc, getDoc, updateDoc } = require("firebase/firestore");

exports.getAllTodos = (request, response) => {
    const todoRef = collection(db, 'todos');
    const q = query(todoRef, where('uid', '==', request.uid), orderBy('createdAt', 'desc'));
        getDocs(q)
		.then((data) => {
			let todos = [];
			data.forEach((doc) => {
				todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postOneTodo = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newTodoItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString(),
        uid: request.uid,
    }

    const todoRef = collection(db, 'todos');

    addDoc(todoRef, newTodoItem)
        .then((doc)=>{
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deleteTodo = (request, response) => {
    // const todoRef = collection(db, 'todos');
    // const document = db.doc(`/todos/${request.params.todoId}`);
    const docRef = doc(db, `/todos/${request.params.todoId}`);
    getDoc(docRef)
        .then((doc) => {
            if (!doc.exists()) {
                return response.status(404).json({ error: 'Todo not found' })
            }
            if(doc.data().uid !== request.uid){
                return response.status(403).json({error:"UnAuthorized"})
            }
            return deleteDoc(docRef);
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editTodo = ( request, response ) => { 
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    // const todoRef = collection(db, 'todos');
    let docRef = doc(db, `/todos/${request.params.todoId}`);
    updateDoc(docRef, request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};