// كود الـ Config الخاص بك مدمج بالكامل
const firebaseConfig = {
  apiKey: "AIzaSyA6A3DZ-oj3RvV797ekjrM6RnNlxrsQreY",
  authDomain: "coinflow-ai.firebaseapp.com",
  databaseURL: "https://coinflow-ai-default-rtdb.firebaseio.com",
  projectId: "coinflow-ai",
  storageBucket: "coinflow-ai.firebasestorage.app",
  messagingSenderId: "395703133866",
  appId: "1:395703133866:web:57f628c6625db1470fd2d3",
  measurementId: "G-RQ7T0692J7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// المحفظة الثابتة
const MY_WALLET = "TAEhVTpKt3TZtp3GGr2Sna9T7n6SsFzgHP";

function copyAddr() {
    navigator.clipboard.writeText(MY_WALLET);
    alert("✅ تم نسخ العنوان: " + MY_WALLET);
}

// تسجيل الدخول
function handleAuth(mode) {
    const e = document.getElementById('uEmail').value.trim();
    const p = document.getElementById('uPass').value;
    if(!e || !p) return alert("⚠️ أكمل البيانات");

    if(mode === 'reg') {
        auth.createUserWithEmailAndPassword(e, p).then(u => {
            db.ref('users/' + u.user.uid).set({ email: e, balance: 0, messages: {} });
            alert("✅ تم إنشاء الحساب بنجاح!");
        }).catch(err => alert(err.message));
    } else {
        auth.signInWithEmailAndPassword(e, p).then(() => window.location.href='dashboard.html')
        .catch(err => alert("❌ خطأ في الدخول"));
    }
}