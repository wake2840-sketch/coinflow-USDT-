const CONFIG = {
    my_usdt_wallet: "TAEhVTpKt3TZtp3GGr2Sna9T7n6SsFzgHP",
    admin_key: "30003100",
    db_name: "coinflow_final_v1"
};

// تهيئة قاعدة البيانات
let db = JSON.parse(localStorage.getItem(CONFIG.db_name)) || { users: [] };
const save = () => localStorage.setItem(CONFIG.db_name, JSON.stringify(db));

// نظام التنبيهات
function showMsg(m) {
    const t = document.getElementById("toast");
    if(!t) return alert(m);
    t.innerText = m; t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
}

// دالة النسخ
function copyAddress() {
    const el = document.getElementById("sysAddr");
    el.select();
    navigator.clipboard.writeText(el.value);
    showMsg("✅ تم نسخ عنوان USDT");
}

// تسجيل الدخول والإنشاء
function handleAuth(mode) {
    const u = document.getElementById("uName").value.trim();
    const p = document.getElementById("uPass").value.trim();
    if(!u || !p) return showMsg("⚠️ أكمل البيانات");

    if(mode === 'reg') {
        if(db.users.find(x => x.username === u)) return showMsg("❌ الاسم مستخدم");
        db.users.push({ username: u, password: p, balance: 0, logs: [] });
        save(); showMsg("✅ تم التسجيل بنجاح");
    } else {
        const user = db.users.find(x => x.username === u && x.password === p);
        if(user) { 
            localStorage.setItem("active_user", u); 
            window.location.href = "dashboard.html"; 
        } else {
            showMsg("❌ خطأ في الاسم أو كلمة المرور");
        }
    }
}

// تحميل لوحة التحكم
function loadDashboard() {
    const cur = localStorage.getItem("active_user");
    if(!cur) { window.location.href = "index.html"; return; }
    const user = db.users.find(x => x.username === cur);
    if(!user) { window.location.href = "index.html"; return; }

    document.getElementById("displayUser").innerText = user.username;
    document.getElementById("userBalance").innerText = user.balance.toFixed(2);
    renderLogs(user.logs);
}

// طلب إيداع (إبلاغ المسؤول فقط)
function notifyAdmin() {
    const cur = localStorage.getItem("active_user");
    const user = db.users.find(x => x.username === cur);
    user.logs.push({ type: "طلب إيداع", amount: "قيد المراجعة", date: new Date().toLocaleString() });
    save();
    renderLogs(user.logs);
    showMsg("✅ تم إبلاغ المسؤول لمراجعة التحويل");
}

// طلب سحب
function withdraw() {
    const amt = parseFloat(document.getElementById("witAmt").value);
    const wal = document.getElementById("witWal").value.trim();
    const cur = localStorage.getItem("active_user");
    const user = db.users.find(x => x.username === cur);

    if(!wal || isNaN(amt) || amt <= 0) return showMsg("⚠️ أكمل بيانات السحب");
    if(amt > user.balance) return showMsg("❌ رصيد غير كافٍ");

    user.balance -= amt;
    user.logs.push({ type: "سحب", amount: amt, wallet: wal, date: new Date().toLocaleString() });
    save();
    loadDashboard();
    showMsg("✅ تم طلب السحب");
}

function renderLogs(logs) {
    const container = document.getElementById("logs");
    if(!container) return;
    container.innerHTML = logs.slice().reverse().map(l => `
        <div style="border-bottom:1px solid #1e293b; padding:10px; font-size:12px;">
            <b style="color:${l.type.includes('إيداع') ? '#10b981' : '#ef4444'}">${l.type}</b>: 
            ${l.amount} ${typeof l.amount === 'number' ? 'USDT' : ''} <br>
            <small>${l.date} ${l.wallet ? '| محفظة: '+l.wallet : ''}</small>
        </div>
    `).join('');
}

// دوال الإدارة
function adminAdjust(i) {
    const amt = parseFloat(prompt("أدخل المبلغ المودع لإضافته لحساب المستخدم:"));
    if(isNaN(amt)) return;
    db.users[i].balance += amt;
    db.users[i].logs.push({ type: "إيداع", amount: amt, date: new Date().toLocaleString() });
    save();
    renderAdm();
    showMsg("✅ تم تحديث الرصيد");
}

function loginAsUser(username) {
    localStorage.setItem("active_user", username);
    window.location.href = "dashboard.html";
}