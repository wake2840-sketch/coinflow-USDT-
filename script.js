const firebaseConfig = {
  apiKey: "AIzaSyA6A3DZ-oj3RvV797ekjrM6RnNlxrsQreY",
  authDomain: "coinflow-ai.firebaseapp.com",
  databaseURL: "https://coinflow-ai-default-rtdb.firebaseio.com",
  projectId: "coinflow-ai",
  storageBucket: "coinflow-ai.firebasestorage.app",
  messagingSenderId: "395703133866",
  appId: "1:395703133866:web:57f628c6625db1470fd2d3"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const auth = firebase.auth();
const db = firebase.database();

function signUp() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(e, p).then(res => {
        db.ref('users/' + res.user.uid).set({ email: e, balance: 0 });
        location.href = 'dashboard.html';
    }).catch(err => alert(err.message));
}

function signIn() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(e, p).then(() => {
        location.href = 'dashboard.html';
    }).catch(err => alert(err.message));
}

if(location.pathname.includes('dashboard.html')) {
    auth.onAuthStateChanged(user => {
        if(user) {
            db.ref('users/' + user.uid + '/balance').on('value', s => {
                document.getElementById('userBalance').innerText = '$' + (s.val() || 0).toFixed(2);
            });
        }
    });
}