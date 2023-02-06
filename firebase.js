const {initializeApp} = require('firebase/app');
const {getDatabase, ref, set} = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyCpB8Z3U05NNpyK37fDN4_LSU0wuaIGGyU",
    authDomain: "ai-lab-280706.firebaseapp.com",
    databaseURL: "https://ai-lab-280706.firebaseio.com",
    projectId: "ai-lab-280706",
    storageBucket: "ai-lab-280706.appspot.com",
    messagingSenderId: "823695237243",
    appId: "1:823695237243:web:f2255fa1095cfdcaf442de"
}


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const writeToFirebaseDb = (res) => {
    return   set(ref(db, 'table/' + 'bg-data'), {
        res
      });
}

module.exports = {
    writeToFirebaseDb,
}
