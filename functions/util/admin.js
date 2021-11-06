// const admin = require('firebase-admin');

// admin.initializeApp();

// const db = admin.firestore();

// module.exports = { admin, db };

const { initializeApp } =  require('firebase/app');
const { getFirestore } = require("firebase/firestore");
const { getFunctions } = require('firebase/functions');

const config = require('../util/config');

const app = initializeApp(config);
const db = getFirestore(app);
const functions = getFunctions(app);

module.exports = { app, db, functions };

