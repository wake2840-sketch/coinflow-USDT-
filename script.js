// إعدادات الاتصال بـ Firebase (تأكد من مطابقتها لمشروعك)
const firebaseConfig = {
  apiKey: "AIzaSyA6A3DZ-oj3RvV797ekjrM6RnNlxrsQreY",
  authDomain: "coinflow-ai.firebaseapp.com",
  databaseURL: "https://coinflow-ai-default-rtdb.firebaseio.com",
  projectId: "coinflow-ai",
  storageBucket: "coinflow-ai.firebasestorage.app",
  messagingSenderId: "395703133866",
  appId: "1:395703133866:web:57f628c6625db1470fd2d3"
};

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

// --- 1. وظائف تسجيل الدخول وإنشاء الحساب ---

function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((res) => {
                // إنشاء سجل للمستخدم الجديد في قاعدة البيانات برصيد صفر
                db.ref('users/' + res.user.uid).set({
                    email: email,
                    balance: 0,
                    joinedAt: Date.now()
                });
                alert("تم إنشاء الحساب بنجاح!");
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                alert("خطأ في إنشاء الحساب: " + error.message);
            });
    } else {
        alert("يرجى إدخال البريد الإلكتروني وكلمة السر");
    }
}

function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                alert("خطأ في تسجيل الدخول: " + error.message);
            });
    } else {
        alert("يرجى إدخال البريد الإلكتروني وكلمة السر");
    }
}

// --- 2. تحديث الرصيد اللحظي في لوحة التحكم ---

if (window.location.pathname.includes('dashboard.html')) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // مراقبة الرصيد في قاعدة البيانات وتحديثه فوراً على الشاشة
            db.ref('users/' + user.uid + '/balance').on('value', (snapshot) => {
                const balance = snapshot.val() || 0;
                const balanceElement = document.getElementById('userBalance');
                if (balanceElement) {
                    balanceElement.innerText = '$' + balance.toFixed(2);
                }
            });
        } else {
            // إذا لم يكن مسجلاً، العودة لصفحة الدخول
            window.location.href = 'index.html';
        }
    });
}

// --- 3. نظام الدردشة والدعم الفني ---

// يتم التعامل مع إرسال الرسائل داخل صفحات html (chat & dashboard) 
// لضمان استجابة الواجهة بشكل أسرع، بينما يقوم هذا الملف بإدارة الجلسة.

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("المستخدم متصل: " + user.email);
    }
});

// دالة تسجيل الخروج العامة
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}