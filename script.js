const CONFIG = {
    my_usdt_wallet: "TAEhVTpKt3TZtp3GGr2Sna9T7n6SsFzgHP", // عنوانك للإيداع
    admin_key: "30003100",
    db_name: "coinflow_pro_db"
};

let db = JSON.parse(localStorage.getItem(CONFIG.db_name)) || { users: [] };
const save = () => localStorage.setItem(CONFIG.db_name, JSON.stringify(db));

function showMsg(m) {
    const t = document.getElementById("toast");
    t.innerText = m; t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
}

function copyAddress() {
    const el = document.getElementById("sysAddr");
    el.select();
    navigator.clipboard.writeText(el.value);
    showMsg("✅ تم نسخ عنوان USDT TRC20");
}

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
        if(user) { localStorage.setItem("active_user", u); window.location.href="dashboard.html"; }
        else showMsg("❌ بيانات خاطئة");
    }
}

function loadDashboard() {
    const cur = localStorage.getItem("active_user");
    if(!cur) return window.location.href="index.html";
    const user = db.users.find(x => x.username === cur);
    document.getElementById("displayUser").innerText = user.username;
    document.getElementById("userBalance").innerText = user.balance.toFixed(2);
    renderLogs(user.logs);
}

function deposit() {
    const amt = parseFloat(document.getElementById("depAmt").value);
    if(isNaN(amt) || amt <= 0) return showMsg("⚠️ أدخل مبلغاً صحيحاً");
    const user = db.users.find(x => x.username === localStorage.getItem("active_user"));
    user.balance += amt;
    user.logs.push({ type: "إيداع", amount: amt, date: new Date().toLocaleString() });
    save(); loadDashboard(); showMsg("✅ تم الإيداع بنجاح");
}

function withdraw() {
    const amt = parseFloat(document.getElementById("witAmt").value);
    const wal = document.getElementById("witWal").value.trim();
    if(!wal || isNaN(amt) || amt <= 0) return showMsg("⚠️ أكمل بيانات السحب");
    const user = db.users.find(x => x.username === localStorage.getItem("active_user"));
    if(amt > user.balance) return showMsg("❌ رصيد غير كافٍ");
    user.balance -= amt;
    user.logs.push({ type: "سحب", amount: amt, wallet: wal, date: new Date().toLocaleString() });
    save(); loadDashboard(); showMsg("✅ تم طلب السحب");
}

function renderLogs(logs) {
    document.getElementById("logs").innerHTML = logs.slice().reverse().map(l => `
        <div style="border-bottom:1px solid #1e293b; padding:10px; font-size:12px;">
            <b style="color:${l.type==='إيداع'?'#10b981':'#ef4444'}">${l.type}</b>: ${l.amount} USDT <br>
            <small>${l.date} ${l.wallet ? '| محفظة: '+l.wallet : ''}</small>
        </div>
    `).join('');
}

// وظائف الإدارة
function adminAdjust(i) {
    const amt = parseFloat(prompt("أدخل المبلغ (مثلاً 100 للإضافة أو -50 للخصم):"));
    if(isNaN(amt)) return;
    db.users[i].balance += amt;
    save(); renderAdm(); showMsg("✅ تم تحديث الرصيد");
}

function loginAsUser(username) {
    localStorage.setItem("active_user", username);
    window.location.href = "dashboard.html";
}