const { admin, db } = require('../util/admin');
// const config = require('../util/config');

// const { initializeApp } = require('firebase/app');
// const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
// const app = initializeApp(config);
// const firebase = require('firebase');

// firebase.initializeApp(config);
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } = require("firebase/auth");
const { doc, updateDoc, getDoc, addDoc, collection, setDoc } = require("firebase/firestore");
const { validateLoginData, validateSignUpData } = require('../util/validators');

// Login
exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = validateLoginData(user);
	if (!valid) return response.status(400).json(errors);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((error) => {
            console.error(error);
            return response.status(403).json({ general: 'wrong credentials, please try again'});
        })
};

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        country: request.body.country,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword
    };

    const { valid, errors } = validateSignUpData(newUser);

	if (!valid) return response.status(400).json(errors);

    let token, userId;
 
    const auth = getAuth();
        createUserWithEmailAndPassword(
            auth,
            newUser.email, 
            newUser.password
        )
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idtoken) => {
            token = idtoken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
                country: newUser.country,
                email: newUser.email,
                createdAt: new Date().toISOString()
            };
            return setDoc(doc(db, 'users', `${userId}`), userCredentials);
        })
        .then(()=>{
            return response.status(201).json({ token });
        })
        .catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return response.status(400).json({ email: 'Email already in use' });
			} else {
				return response.status(500).json({ general: 'Something went wrong, please try again' });
			}
		});
}

exports.getUserDetail = (request, response) => {
    let userData = {};
    const docRef = doc(db, `/users/${request.uid}`);
    getDoc(docRef)
		.then((doc) => {
			if (doc.exists()) {
                userData.userCredentials = doc.data();
                return response.json(userData);
			}	
		})
		.catch((error) => {
			console.error(error);
			return response.status(500).json({ error: error.code });
		});
}

exports.updateUserDetails = (request, response) => {
    let docRef = doc(db, `/users/${request.uid}`);
    updateDoc(docRef, request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ 
            message: "Cannot Update the value"
        });
    });
}