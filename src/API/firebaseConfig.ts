import 'firebase/compat/firestore';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqlum2oqN-CuJOXee4kuZs_J74lkW_wbA",
    authDomain: "dasfasf-9a525.firebaseapp.com",
    databaseURL: "https://dasfasf-9a525-default-rtdb.firebaseio.com",
    projectId: "dasfasf-9a525",
    storageBucket: "dasfasf-9a525.appspot.com",
    messagingSenderId: "107145633908",
    appId: "1:107145633908:web:69c96c862ca415fc2ff121",
    measurementId: "G-N2PFKS6B1Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}