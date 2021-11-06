const { getAuth, onAuthStateChanged } = require('firebase/auth');
const { getDoc, doc, } = require('firebase/firestore');
const { db } = require('../util/admin');

module.exports = (req, res, next) => {

    const auth = getAuth();
    let uid;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            uid = user.uid;
            // const q = query(collection(db, "users"), where("userId", "==", uid));
            const docRef = doc(db, "users", `${uid}`);
            getDoc(docRef)
            .then(docSnap => {
                if(docSnap.exists()) {
                    req.uid = uid;
                    return next();
                }
                else {
                    console.error('Error while verifying token');
			        return res.status(403).json('Unauthorized');
                }
            })
            .catch(err => {
                console.error('Error while finding user', err);
			    return res.status(403).json(err);
            });
           
        } else {
            console.error('Error while verifying token');
			return res.status(403).json('Unauthorized');
        }
    });
};