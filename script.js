// 1. CONFIGURAÇÕES BASE E DEUSES
window.firebaseConfig = { apiKey: "AIzaSyAccNn3N4N1Dt0YXp5DtvoXsRj40oTOrDw", authDomain: "gumble-rush.firebaseapp.com", databaseURL: "https://gumble-rush-default-rtdb.firebaseio.com", projectId: "gumble-rush", storageBucket: "gumble-rush.firebasestorage.app", messagingSenderId: "837162957323", appId: "1:837162957323:web:0cd24e2a65e78d7fd2e50e" };
window.db = null; window.usersGlobais = {}; window.presenceGlobal = {}; window.lojaGlobal = {}; window.submapasGlobais = {}; window.submapasBGs = {}; window.turnosVTTGlobal = null; window.embatesGlobais = {}; window.casaGlobais = {};
window.jogadorAtual = ""; window.serialAtual = ""; window.isMaster = false; window.currentSubMapKey = ""; window.movimentosRestantes = 0; window.connectionRef = null;
window.MASTER_SERIAL = "4053-DC1";

window.codigosPromocionais = { "PLEBE": 15000, "JOBBER": 25000, "NOBLESS": 50000 };
window.iconesMercado = { "Arma": "🔫", "Roupa": "🦺", "Comida": "🍫", "Móvel": "🪑", "Tecnologia": "📱", "Acessório": "📿", "Mochila": "🎒" };

window.deusesPanteao = [
    { nome: "Oizus (Miséria)", desc: "Dobra risco do adversário e reduz o seu." },
    { nome: "Afrodite (Desejo)", desc: "Força acordo não-letal irresistível." },
    { nome: "Athena (Estratégia)", desc: "Recebe pista dedutiva do mestre." },
    { nome: "Hades (Submundo)", desc: "Herda automaticamente Yenes de mortos." },
    { nome: "Hermes (Tráfico)", desc: "Garante fuga perfeita de embates." },
    { nome: "Gaia (Território)", desc: "Destaca as melhores rotas de fuga no mapa e usa Vias Verdes." },
    { nome: "Zeus (Autoridade)", desc: "Força aposta pública ou multa de 10%." },
    { nome: "Diogenes (Cinismo)", desc: "Imune a manipulações de apostas." },
    { nome: "Ares (Violência)", desc: "Ignora dor leve e descobre armas." },
    { nome: "Poseidon (Maré)", desc: "Pode anular completamente a última transação." },
    { nome: "Apolo (Verdade)", desc: "Força o alvo a responder Sim/Não com verdade." },
    { nome: "Ártemis (Caçada)", desc: "Rastreio infalível e bônus de furtividade." }
];

window.locaisMapa = {
    "p1": { nome: "Praça Central", x: 50, y: 50, salas: [{n:"Fonte", x:6, y:4, w:4, h:4}, {n:"Jardim", x:2, y:2, w:12, h:8}], obs:["7_5","8_6","4_3","11_9"] },
    "p2": { nome: "Ramen Fantasma", x: 35, y: 65, salas: [{n:"Salão (L)", x:2, y:2, w:4, h:8}, {n:"Salão 2", x:6, y:6, w:6, h:4}], obs:["3_3","4_3","7_7","10_8"] },
    "p3": { nome: "Viela da Fome", x: 15, y: 65, salas: [{n:"Rua Alta", x:2, y:2, w:12, h:3}, {n:"Beco Sul", x:6, y:5, w:4, h:6}], obs:["3_3","11_3","7_6","8_9"]},
    "p4": { nome: "Clube Neon", x: 50, y: 80, salas: [{n:"Pista Esq", x:2, y:2, w:3, h:8}, {n:"Bar", x:5, y:5, w:6, h:3}, {n:"Pista Dir", x:11, y:2, w:3, h:8}], obs:["2_3","13_3","5_6","6_6","10_6","2_8","13_8"]},
    "p5": { nome: "Avenida Ouro", x: 35, y: 35, salas: [{n:"Cruzamento", x:2, y:4, w:12, h:4}], obs:["4_4","4_7","11_4","11_7"] },
    "p6": { nome: "Bar Submundo", x: 15, y: 35, salas: [{n:"Mesas", x:2, y:2, w:5, h:8}, {n:"Balcão", x:7, y:2, w:7, h:4}], obs:["3_4","4_4","5_4","8_3","9_3","12_3","3_8"] },
    "p7": { nome: "Beco Sombrio", x: 15, y: 50, salas: [{n:"Beco", x:6, y:1, w:4, h:10}], obs:["6_2","9_4","6_7","9_8"] },
    "p8": { nome: "Esconderijo Alfa", x: 15, y: 80, salas: [{n:"Entrada", x:4, y:8, w:8, h:3}, {n:"Sala", x:6, y:2, w:4, h:6}], obs:["5_9","10_9","7_4","8_4"] },
    "p9": { nome: "Alameda das Sombras", x: 65, y: 35, salas: [{n:"Rua", x:2, y:4, w:12, h:4}], obs:["3_5","7_5","12_6"] },
    "p10":{ nome: "Apts Safehouse", x: 85, y: 35, salas: [{n:"Quarto 1", x:2, y:2, w:4, h:4}, {n:"Corredor", x:6, y:2, w:4, h:8}, {n:"Quarto 2", x:10, y:6, w:4, h:4}], obs:["3_3","12_7","7_4","8_7"] },
    "p11":{ nome: "Covil de Hackers", x: 85, y: 50, salas: [{n:"Servidores", x:2, y:2, w:12, h:8}], obs:["3_3","4_3","3_4","4_4","11_8","12_8","11_7","12_7","7_5","8_6"] },
    "p12":{ nome: "Mercado Negro", x: 85, y: 65, salas: [{n:"Cruz", x:6, y:1, w:4, h:10}, {n:"Centro", x:2, y:4, w:12, h:4}], obs:["7_2","8_2","3_6","12_6","7_10","8_10"] },
    "p13":{ nome: "QG da Yakuza", x: 65, y: 80, salas: [{n:"Dojo", x:2, y:2, w:12, h:8}], obs:["4_4","11_4","4_9","11_9","7_6","8_6"] },
    "p14":{ nome: "Parque Sombrio", x: 85, y: 80, salas: [{n:"Hexágono (Simulado)", x:4, y:2, w:8, h:8}, {n:"Borda", x:2, y:4, w:2, h:4}, {n:"Borda", x:12, y:4, w:2, h:4}], obs:["5_3","10_3","5_8","10_8","3_5","13_5","7_5","8_5"] },
    "p15":{ nome: "Cemitério", x: 35, y: 80, salas: [{n:"Túmulos", x:2, y:2, w:12, h:8}], obs:["4_3","4_4","7_5","7_6","10_8","10_9","12_3","12_4","3_8"]}
};
window.conexoesMapa = [ {de:"p1", para:"p2"}, {de:"p2", para:"p3"}, {de:"p1", para:"p4"}, {de:"p1", para:"p5"}, {de:"p5", para:"p6"}, {de:"p1", para:"p9"}, {de:"p9", para:"p10"}, {de:"p10", para:"p11"}, {de:"p11", para:"p12"}, {de:"p2", para:"p13"}, {de:"p13", para:"p14"}, {de:"p3", para:"p8"}, {de:"p7", para:"p6"}, {de:"p3", para:"p7"}, {de:"p2", para:"p15"}, {de:"p4", para:"p13"} ];
window.rotasSecretasGaia = [ {de:"p1", para:"p6"}, {de:"p15", para:"p10"}, {de:"p8", para:"p14"}, {de:"p11", para:"p4"} ];

window.filtroLojaAtual = "Promoções"; window.editandoItemId = null;
window.GRID_COLS = 5; window.GRID_ROWS = 3; window.CELL_SIZE = 45; window.GRID_GAP = 1; window.REAL_CELL_SIZE = window.CELL_SIZE + window.GRID_GAP;
window.tetrisMatrix = []; window.arrastandoKey = null; window.itemArrastado = null; window.offsetX = 0; window.offsetY = 0; window.origin = null; window.initPos = {c:-1, r:-1};

window.titulosExtensos = [
    "Novato|com|0", "Alvo Fácil|com|500", "Rato de Beco|com|800", "Corredor|com|1000", "Sobrevivente|com|1200", "Apostador|com|1500",
    "Lutador|inc|2000", "Atirador|inc|2500", "Sombra|inc|3000", "Estrategista|rar|6000", "Investigador|rar|7000",
    "O Hacker|epi|12000", "Ceifador|epi|30000", "Demônio de Neon|leg|40000", "Deus das Apostas|leg|45000", "A Lenda Viva|leg|60000", "Líder Supremo|leg|100000"
];

window.currentSpinInterval = null;
window.currentSpinTimeout = null;

// INICIALIZAÇÃO FIREBASE (Evita erro de load)
try { firebase.initializeApp(window.firebaseConfig); window.db = firebase.database(); } catch (e) { console.error("Firebase falhou:", e); }

window.setElText = function(id, t) { let e = document.getElementById(id); if(e) e.innerText = t; };
window.setElHTML = function(id, h) { let e = document.getElementById(id); if(e) e.innerHTML = h; };
window.setElDisplay = function(id, d) { let e = document.getElementById(id); if(e) e.style.display = d; };
window.setElVal = function(id, v) { let e = document.getElementById(id); if(e) e.value = v; };

// TOAST NEON AVISO
window.showNeonToast = function(msg) {
    let t = document.getElementById("neonToast");
    if(t) {
        t.innerText = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3000);
    }
};

window.fecharDadoOverlay = function() { 
    if(window.currentSpinInterval) clearInterval(window.currentSpinInterval);
    if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout);
    window.setElDisplay("globalDiceOverlay", "none"); 
};

window.getSafeRpg = function(u) { 
    let d = { for: 1, agi: 1, man: 1, vig: 1, int: 1, pontosLivres: 3, nivel: 1, integridade: 100, hp: 100 }; 
    if (!u || !u.rpg) return d;
    let r = u.rpg;
    let spent = Math.max(0, (r.for||1)-1) + Math.max(0, (r.agi||1)-1) + Math.max(0, (r.man||1)-1) + Math.max(0, (r.vig||1)-1) + Math.max(0, (r.int||1)-1);
    let realPts = Math.max(0, 3 + ((r.nivel||1)-1) - spent);
    return { for: r.for||1, agi: r.agi||1, man: r.man||1, vig: r.vig||1, int: r.int||1, pontosLivres: (r.pontosLivres!==undefined)?r.pontosLivres:realPts, nivel: r.nivel||1, integridade: (r.integridade!==undefined)?r.integridade:100, hp: (r.hp!==undefined)?r.hp:100 };
};

window.calcularMaxInteg = function(u) { let m = 100; if(u && u.casa) Object.values(u.casa).forEach(i => { if(i.tipo==="Móvel" && i.buffType==="integ" && i.poder) m += parseInt(i.poder); }); return m; };
window.calcularBuffsMoveis = function(u) { let buffs = { for:0, agi:0, int:0, vig:0, man:0 }; if(u && u.casa) Object.values(u.casa).forEach(i => { if(i.tipo==="Móvel" && i.buffType && i.poder && buffs[i.buffType] !== undefined) buffs[i.buffType] += parseInt(i.poder); }); return buffs; };
window.calcularDefesa = function(u) { let def = 0; if(u && u.mochila) { Object.values(u.mochila).forEach(i => { if(i.eq && i.tipo === 'Roupa') def += (parseInt(i.poder) || 0); }); } return def; };
window.getPesoStatus = function(u) { let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u); let max = 10 + ((r.for+buffs.for)*5); let peso = 0; if(u?.mochila) Object.values(u.mochila).forEach(i => peso += (parseInt(i.peso)||1)); return {atual:peso, max:max, sobrepeso: peso > max}; };

// === 4. INTERFACE GLOBAL E SISTEMA OS ===
window.abrirCelularMain = function() {
    window.setElDisplay("phoneOverlay", "flex");
    window.voltarPhoneMain(); // <- Adicione esta linha para forçar o reset da tela do celular
};

window.fecharCelular = function() {
    window.setElDisplay("phoneOverlay", "none");
};

// --- FUNÇÕES PARA A TELA bg2.png (iGAMBLE) ---
window.abrirIgambleMenu = function() {
    let frame = document.getElementById('phoneFrameUI');
    let mainScreen = document.getElementById('phoneMainScreen');
    let igambleScreen = document.getElementById('phoneIgambleScreen');
    let closeBtn = document.getElementById('btnClosePhone');
    
    if (frame) frame.style.backgroundImage = "url('bg2.png')";
    if (mainScreen) mainScreen.style.display = "none";
    if (igambleScreen) igambleScreen.style.display = "block";
    if (closeBtn) closeBtn.style.display = "none"; 
};

window.voltarPhoneMain = function() {
    let frame = document.getElementById('phoneFrameUI');
    let mainScreen = document.getElementById('phoneMainScreen');
    let igambleScreen = document.getElementById('phoneIgambleScreen');
    let closeBtn = document.getElementById('btnClosePhone');
    
    if (frame) frame.style.backgroundImage = "url('bg.png')";
    if (mainScreen) mainScreen.style.display = "grid";
    if (igambleScreen) igambleScreen.style.display = "none";
    if (closeBtn) closeBtn.style.display = "flex";
};

window.abrirIgambleApp = function(tabName) {
    window.abrirApp('tab-igamble'); // Abre o fundo e tela principal
    let btn = document.querySelector(`.igamble-nav button[onclick*="${tabName}"]`);
    if(btn) window.switchIGambleTab(tabName, btn);
};

// Quando clica no botão "Voltar (roxo)" durante o iGAMBLE:
window.voltarParaMenuIgamble = function() {
    window.fecharApp(); // Fecha as telas de jogo
    window.abrirCelularMain(); // Abre a tela preta com overlay
    window.abrirIgambleMenu(); // Força a tela bg2.png aparecer
};

window.abrirCelularMain = function() {
    window.setElDisplay("phoneOverlay", "flex");
    window.voltarPhoneMain(); // Garante que abre sempre na tela principal do bg.png
};
// ---------------------------------------------------

window.abrirApp = function(appId, isLocked, lockMsg) {
    if(isLocked) { window.showNeonToast(lockMsg); return; }
    
    window.fecharCelular(); 
    window.setElDisplay("gameContainer", "block");
    window.setElDisplay("btnHomeApp", "flex");
    
    // Mostra o botão roxo de voltar só se for iGamble
    if(appId === 'tab-igamble') {
        window.setElDisplay("btnBackIgamble", "flex");
    } else {
        window.setElDisplay("btnBackIgamble", "none");
    }
    
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    let a = document.getElementById(appId); if(a) a.classList.add('active');
    
    let titles = {"tab-loja": "Gamblezon", "tab-mapa": "Gamble Maps", "tab-igamble": "iGAMBLE", "tab-personagem": "My Gamble", "tab-panteao": "Patronos", "tab-casa": "Gamble House", "tab-celular": "Gamblenger", "tab-principal": "Notícias"};
    if(document.getElementById("appTitleHeader")) document.getElementById("appTitleHeader").innerText = titles[appId] || "Aplicativo";

    if(appId === 'tab-mapa') window.drawMapVisuals();
    if(appId === 'tab-personagem') window.renderizarMochila();
    if(appId === 'tab-casa') window.drawCasaBoard();
    if(appId === 'tab-panteao') window.renderizarPanteao();
    
    if(appId === 'tab-igamble') {
        setTimeout(() => {
            let chatBox = document.getElementById("chatMessages");
            if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 50); 
    }
};

window.fecharApp = function() {
    window.setElDisplay("gameContainer", "none");
    window.setElDisplay("btnHomeApp", "none");
    window.setElDisplay("btnBackIgamble", "none"); // Garante que o voltar suma quando fecha os apps
};

window.abrirModal = function() {
    window.setElDisplay("loginModal", "flex");
    if(window.jogadorAtual) { window.setElDisplay("loginScreen", "none"); window.setElDisplay("profileScreen", "block"); }
    else { window.setElDisplay("loginScreen", "block"); window.setElDisplay("profileScreen", "none"); }
};
window.fecharModal = function() { window.setElDisplay("loginModal", "none"); };

window.toggleDesktopSidebar = function() { let s = document.getElementById("sidebarAgents"); if(s) s.classList.toggle("minimized"); };

window.salvarPerfil = function(campo, valor) {
    if(window.jogadorAtual) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/perfil/${campo}`).set(valor);
};

window.renderizarFicha = function() {
    if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual]) return;
    let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let mInteg = window.calcularMaxInteg(u); let buffs = window.calcularBuffsMoveis(u); let def = window.calcularDefesa(u);
    
    if(document.getElementById("fichaNome")) window.setElText("fichaNome", u.nome || window.jogadorAtual);
    if(document.getElementById("fichaSerial")) window.setElText("fichaSerial", u.serial || "----");
    let avURL = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    if(document.getElementById("myAvatarImg")) document.getElementById("myAvatarImg").src = avURL;
    if(document.getElementById("perfilSobrenome")) window.setElVal("perfilSobrenome", u.perfil?.sobrenome || "");
    if(document.getElementById("perfilIdade")) window.setElVal("perfilIdade", u.perfil?.idade || "");
    if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", u.numero || "Sem Aparelho");

    window.setElText("lblDef", def); 
    if(document.getElementById("lblPtsOS")) document.getElementById("lblPtsOS").innerText = r.pontosLivres;
    window.setElText("lblPts", r.pontosLivres);
    window.setElText("valFor", r.for + buffs.for); window.setElText("valAgi", r.agi + buffs.agi); window.setElText("valMan", r.man + buffs.man); window.setElText("valVig", r.vig + buffs.vig); window.setElText("valInt", r.int + buffs.int);
    window.setElText("lblIntegMax", mInteg); window.setElText("lblIntegVal", r.integridade + "%");
    
    let hpInp = document.getElementById("hpInput"); if(hpInp && document.activeElement !== hpInp) hpInp.value = r.hp;
    let bar = document.getElementById("integrityBar"); if(bar) { let pct = (r.integridade / mInteg) * 100; bar.style.width = Math.min(pct,100) + "%"; bar.style.background = r.integridade < 30 ? "#ff0000" : "#00ff00"; }
    
    // Bloqueio dinamico dos apps do celular
    let temCel = u.numero || (u.mochila && Object.values(u.mochila).some(i => i.tipo === 'Tecnologia'));
    let temCasa = (u.casa && Object.keys(u.casa).length > 0) || (u.mochila && Object.values(u.mochila).some(i => i.tipo === 'Móvel'));
    
    let iCel = document.getElementById('icon-celular'); 
    if(iCel) { 
        if(temCel || window.isMaster) { iCel.classList.remove('locked'); iCel.onclick = () => window.abrirApp('tab-celular', false); } 
        else { iCel.classList.add('locked'); iCel.onclick = () => window.abrirApp('none', true, "Gamblenger Fora do Ar! Compre um Celular."); } 
    }
    
    let iCasa = document.getElementById('icon-casa'); 
    if(iCasa) { 
        if(temCasa || window.isMaster) { iCasa.classList.remove('locked'); iCasa.onclick = () => window.abrirApp('tab-casa', false); } 
        else { iCasa.classList.add('locked'); iCasa.onclick = () => window.abrirApp('none', true, "Gamble House Bloqueada! Compre um Imóvel."); } 
    }
};

window.desenharListaUsuarios = function() {
    let b = document.getElementById("userLog"); if(!b) return; b.innerHTML = ""; let hideOff = document.getElementById("checkOnline")?.checked;
    let sortedUsers = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE").sort((a, b) => { let aOn = window.presenceGlobal[a] === true && window.usersGlobais[a].status !== "morto"; let bOn = window.presenceGlobal[b] === true && window.usersGlobais[b].status !== "morto"; return (aOn === bOn) ? 0 : aOn ? -1 : 1; });
    sortedUsers.forEach(n => { 
        let u=window.usersGlobais[n]; let r = window.getSafeRpg(u); let isD=(u.status==="morto"); let isO=window.presenceGlobal[n]===true&&!isD; 
        if(hideOff && !isO && !isD) return; 
        b.innerHTML += `<div class="user-item" style="opacity:${isD?0.5:1};"><span class="status-dot ${isD?'dead':(isO?'online':'offline')}"></span><strong style="color:${isO?'var(--accent-blue)':'#aaa'};">${n}</strong><br><span style="font-size:11px;color:#ff2a5f">${u.carteira||0}¥</span><div class="hp-display">❤️ HP: ${r.hp}</div></div>`; 
    });
};

// === 5. SISTEMA RPG (DADOS E PANTEÃO) ===
window.resgatarCodigo = function() {
    let c = document.getElementById("sponsorCode").value.trim().toUpperCase(); if(!c) return;
    if(c === "CASH4053") {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set((window.usersGlobais[window.jogadorAtual].carteira||0) + 10000);
        alert("Injetado 10000 ¥ (Modo Teste)!"); window.setElVal("sponsorCode", ""); return;
    }
    if(window.codigosPromocionais[c]) {
        let v = window.codigosPromocionais[c]; let r = window.db.ref('tokyoRpg/users/' + window.jogadorAtual);
        r.once('value').then(s => { 
            let u = s.val(); if(u.codigosUsados && u.codigosUsados[c]) { alert("Já resgatado."); } 
            else { r.child('codigosUsados').update({ [c]: true }); r.update({ carteira: (u.carteira || 0) + v }); alert(`Sucesso! +${v}¥`); window.setElVal("sponsorCode", ""); } 
        });
    } else { alert("Código Inválido."); }
};

window.renderizarPanteao = function() {
    let u = window.usersGlobais[window.jogadorAtual] || {}; let currentGod = u.deus || "Nenhum";
    let gachaC = document.getElementById("gachaDisplay"); if(gachaC) gachaC.innerHTML = `<h2 style="color:#555; margin:0;">[ SEU DEUS ]</h2><h3 class="neon-purple" style="font-size:28px; margin-top:10px;">${currentGod}</h3>`;
    
    let list = document.getElementById("allGodsList"); if(!list) return;
    list.innerHTML = "";
    window.deusesPanteao.forEach(g => {
        let gNameClean = g.nome.split(" ")[0];
        let isMine = (currentGod === g.nome || currentGod.includes(gNameClean));
        list.innerHTML += `<div class="card ${isMine?'selected':''}" style="height:auto; min-height:80px; cursor:default; width:200px; padding:10px;">
            <h3 style="margin:0 0 5px 0; font-size:14px; color:${isMine?'#0f0':'var(--accent-purple)'};">${g.nome}</h3>
            <p style="font-size:11px; color:#aaa; margin:0; line-height:1.2;">${g.desc}</p>
        </div>`;
    });
};

window.girarRoletaPanteao = function() {
    if(!window.jogadorAtual) return;
    let u = window.usersGlobais[window.jogadorAtual];
    if((u.carteira || 0) < 500) { alert("Você precisa de 500 ¥ para girar a Roleta Divina."); return; }
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(u.carteira - 500);
    
    let btn = document.getElementById("btnRoletaDeus"); if(btn) btn.disabled = true;
    let display = document.getElementById("gachaDisplay"); if(!display) return; display.innerHTML = "";
    
    if(window.currentSpinInterval) clearInterval(window.currentSpinInterval);
    if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout);
    
    let counter = 0;
    window.currentSpinInterval = setInterval(() => {
        let g1 = window.deusesPanteao[Math.floor(Math.random() * window.deusesPanteao.length)];
        let g2 = window.deusesPanteao[Math.floor(Math.random() * window.deusesPanteao.length)];
        display.innerHTML = `<div class="card spinning" style="width:140px; height:160px; padding:10px;"><h3 style="font-size:14px;margin:0;">${g1.nome}</h3></div><div class="card spinning" style="width:140px; height:160px; padding:10px;"><h3 style="font-size:14px;margin:0;">${g2.nome}</h3></div>`;
        counter++;
        if(counter > 15) {
            clearInterval(window.currentSpinInterval);
            let shuffled = [...window.deusesPanteao].sort(() => 0.5 - Math.random());
            let op1 = shuffled[0]; let op2 = shuffled[1];
            display.innerHTML = `
                <div class="card" style="width:180px; height:auto; padding:15px; cursor:pointer;" onclick="window.escolherDeusFinal('${op1.nome}')">
                    <h3 style="font-size:14px;">${op1.nome}</h3><p style="font-size:11px;color:#aaa;">${op1.desc}</p>
                    <button class="action-btn" style="margin-top:10px;">Escolher</button>
                </div>
                <div class="card" style="width:180px; height:auto; padding:15px; cursor:pointer;" onclick="window.escolherDeusFinal('${op2.nome}')">
                    <h3 style="font-size:14px;">${op2.nome}</h3><p style="font-size:11px;color:#aaa;">${op2.desc}</p>
                    <button class="action-btn" style="margin-top:10px;">Escolher</button>
                </div>
            `;
        }
    }, 100);
};
window.escolherDeusFinal = function(n) { 
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/deus`).set(n); 
    window.showNeonToast(`Patrono ${n} Escolhido!`); 
    let b = document.getElementById("btnRoletaDeus"); if(b) b.disabled=false; 
    let g = document.getElementById("gachaDisplay"); if(g) g.innerHTML = `<h2 style="color:#555; margin:0;">[ ROLETA DIVINA ]</h2>`;
    window.renderizarPanteao(); window.drawMapVisuals(); 
};

window.mostrarDadoOverlay = function(n, f, res, maxFaces = 20) {
    let ov = document.getElementById("globalDiceOverlay");
    if(document.getElementById("diceRollerName")) document.getElementById("diceRollerName").innerText = "Agente: " + n; 
    if(document.getElementById("diceFormulaLabel")) document.getElementById("diceFormulaLabel").innerText = "Ação: " + f;
    
    let sp = document.getElementById("diceSpinners"); let dRes = document.getElementById("diceFinalResult");
    if(sp) { sp.style.display = "flex"; sp.innerHTML = ""; for(let i=0; i<res.length; i++) sp.innerHTML += `<div class="dice-number">?</div>`; }
    if(dRes) dRes.style.display = "none";
    if(ov) ov.style.display = "flex";
    
    if(window.currentSpinInterval) clearInterval(window.currentSpinInterval);
    if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout);

    let sc = 0; window.currentSpinInterval = setInterval(() => {
        let temp = ""; for(let i=0; i<res.length; i++) temp += `<div class="dice-number">${Math.floor(Math.random()*maxFaces)+1}</div>`;
        if(sp) sp.innerHTML = temp; sc++;
        if(sc > 15) {
            clearInterval(window.currentSpinInterval); 
            if(sp) sp.style.display = "none"; 
            if(dRes) { dRes.style.display = "flex"; dRes.innerHTML = ""; res.forEach(v => { dRes.innerHTML += `<div class="dice-result-box">${v}</div>`; }); }
            window.currentSpinTimeout = setTimeout(() => { if(ov) ov.style.display = "none"; }, 3000);
        }
    }, 80);
};

window.lancarDadoCustom = function(t) {
    if(!window.jogadorAtual) return;
    let max = parseInt(t.replace('1d','')); let res = Math.floor(Math.random() * max) + 1;
    window.mostrarDadoOverlay(window.jogadorAtual, t, [res], max);
    window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Rolou ${t}: <span class="dice-result-box">${res}</span>` });
    window.db.ref('tokyoRpg/currentRoll').set({ nome: window.jogadorAtual, form: t, results: [res], ts: Date.now() });
};

window.rolarAtributo = function(nome, key) {
    if(!window.jogadorAtual) return; let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u);
    let qtd = r[key] + buffs[key]; if(qtd < 1) qtd = 1;
    let results = []; for(let i=0; i<qtd; i++) results.push(Math.floor(Math.random()*20)+1);
    let formStr = `${nome} (${qtd}d20)`;
    window.mostrarDadoOverlay(window.jogadorAtual, formStr, results, 20);
    window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Rolou ${formStr}: <span class="dice-result-box">${results.join('</span> <span class="dice-result-box">')}</span>` });
    window.db.ref('tokyoRpg/currentRoll').set({ nome: window.jogadorAtual, form: formStr, results: results, ts: Date.now() });
};

window.rolarPericiaSelect = function() { let s = document.getElementById("comboPericias"); if(s) { let v=s.value.split('|'); window.rolarAtributo(v[0], v[1]); } };
window.atualizarHP = function() { let hp = parseInt(document.getElementById("hpInput").value); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/hp`).set(hp); };
window.distribuirPonto = function(key) { let r = window.getSafeRpg(window.usersGlobais[window.jogadorAtual]); if(r.pontosLivres > 0) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/${key}`).set(r[key]+1); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/pontosLivres`).set(r.pontosLivres-1); } };

// === 6. MAPA GLOBAL E VTT ===
window.drawMapVisuals = function() {
    const canvas = document.getElementById("mapCanvas"); if(!canvas) return;
    let uData = window.usersGlobais[window.jogadorAtual] || {}; let isGaia = (uData.deus && uData.deus.includes("Gaia"));
    
    let nodes = ""; 
    window.conexoesMapa.forEach(c => { let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; nodes += `<line x1="${p1.x}%" y1="${p1.y}%" x2="${p2.x}%" y2="${p2.y}%" stroke="var(--accent-blue)" stroke-width="2" opacity="0.6"/>`; });
    if(isGaia || window.isMaster) window.rotasSecretasGaia.forEach(c => { let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; nodes += `<line x1="${p1.x}%" y1="${p1.y}%" x2="${p2.x}%" y2="${p2.y}%" stroke="#00ff00" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>`; });
    
    let htmlMap = `<svg class="svg-lines-container">${nodes}</svg><div class="map-overlay-grid"></div>`;
    Object.keys(window.locaisMapa).forEach(k => { let l = window.locaisMapa[k]; htmlMap += `<div class="map-node" style="left:${l.x}%; top:${l.y}%;" onclick="window.viajarPara('${k}')" title="${l.nome} (Clique para Interagir)"><span class="node-label">${l.nome}</span></div>`; });
    
    Object.keys(window.usersGlobais).forEach(n => {
        if(n === "MESTRE") return; let u = window.usersGlobais[n]; let loc = window.locaisMapa[u.local||"p1"]; let isO = window.presenceGlobal[n];
        if(loc) htmlMap += `<img src="${u.avatarUrl||'https://api.dicebear.com/9.x/adventurer/svg?seed='+n}" class="avatar-on-map ${isO?'':'avatar-offline'}" style="left:calc(${loc.x}% - 18px); top:calc(${loc.y}% - 18px);">`;
    });
    
    canvas.innerHTML = htmlMap;
};

window.viajarPara = function(k) {
    if(!window.jogadorAtual) return;
    if(window.isMaster) { window.abrirSubMapa(k); return; }

    let user = window.usersGlobais[window.jogadorAtual] || {}; let currentLoc = user.local || "p1"; 
    if(currentLoc === k) { window.abrirSubMapa(k); return; } // Se já ta la e clicou de novo, ENTRA.

    if(window.embatesGlobais && Object.values(window.embatesGlobais).some(e => e.p1 === window.jogadorAtual || e.p2 === window.jogadorAtual)) { window.showNeonToast("Você está TRANCADO num EMBATE!"); return; }
    let isGaia = (user.deus && user.deus.includes("Gaia"));
    
    let isConn = window.conexoesMapa.some(c => (c.de === currentLoc && c.para === k) || (c.para === currentLoc && c.de === k));
    if(!isConn && isGaia) { isConn = window.rotasSecretasGaia.some(c => (c.de === currentLoc && c.para === k) || (c.para === currentLoc && c.de === k)); }
    if(!isConn) { window.showNeonToast("Caminho bloqueado. (Gaia = Vias Verdes)"); return; }
    
    let r = window.getSafeRpg(user); let pesoStats = window.getPesoStatus(user);
    let custoInt = 5 + Math.floor(pesoStats.atual / 5);
    if(pesoStats.sobrepeso) custoInt *= 2; 
    if (r.integridade < custoInt) { window.showNeonToast(`Falta Saturação! Custo: ${custoInt}%`); return; }
    
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(r.integridade - custoInt);
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/local`).set(k);
    window.selectedNodeGlobal = k; window.drawMapVisuals();
};

window.abrirSubMapa = function(k) { 
    window.currentSubMapKey = k; window.setElDisplay("mapCanvas", "none"); window.setElDisplay("subMapCanvas", "flex"); window.initTacticalBoard(); window.updateTacticalBoard(); 
    let c = document.getElementById("subMapCanvas");
    if(c && window.submapasBGs[k]) { c.style.backgroundImage = `url("${window.submapasBGs[k]}")`; } else if(c) { c.style.backgroundImage = "none"; }
    if(window.isMaster) { window.setElDisplay("mestreVTT", "flex"); }
    window.renderVttFoodActions();
};
window.fecharSubMapa = function() { window.setElDisplay("subMapCanvas", "none"); window.setElDisplay("mapCanvas", "block"); window.currentSubMapKey = ""; window.drawMapVisuals(); };
window.mudarBgSubMapa = function() { let url = document.getElementById("vttBgInp").value; window.db.ref(`tokyoRpg/submapsBGs/${window.currentSubMapKey}`).set(url); window.showNeonToast("Fundo Salvo!"); };

window.rolarDadoMovimento = function() {
    if(!window.jogadorAtual) return;
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0 && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Não é seu turno!"); return; }
    let roll = Math.floor(Math.random()*4)+1; let p = window.getPesoStatus(window.usersGlobais[window.jogadorAtual]);
    window.movimentosRestantes = p.sobrepeso ? Math.max(1, Math.floor(roll/2)) : roll;
    window.setElText("movRestantes", `Passos Livres: ${window.movimentosRestantes}`);
    window.db.ref('tokyoRpg/mapDados').push({nome:window.jogadorAtual, texto:`Movimento: <span class="dice-result-box">${roll}</span> -> ${window.movimentosRestantes} passos`});
    window.mostrarDadoOverlay(window.jogadorAtual, "Movimento", [roll], 4);
    window.updateTacticalBoard();
};

window.iniciarIniciativaVTT = function() {
    if(!window.isMaster) return;
    let onGrid = Object.values(window.submapasGlobais[window.currentSubMapKey]||{}).filter(x=>x!=="MESTRE");
    if(onGrid.length===0) { alert("Ninguém no grid!"); return; }
    let ini = []; onGrid.forEach(n => { let r=Math.floor(Math.random()*20)+1; let agi = (window.usersGlobais[n]?.rpg?.agi || 1); let sum = r+agi; ini.push({n:n, v:sum}); window.db.ref('tokyoRpg/mapDados').push({nome:n, texto:`Iniciativa: ${r} (+${agi}) = <strong class="neon-green">${sum}</strong>`}); });
    ini.sort((a,b)=>b.v-a.v); window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}`).set({ordem: ini.map(x=>x.n), atual:0});
    window.showNeonToast("Turnos Definidos!");
};
window.passarTurnoVTT = function() {
    if(!window.turnosVTTGlobal) return;
    window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}/atual`).set((window.turnosVTTGlobal.atual+1)%window.turnosVTTGlobal.ordem.length);
    window.movimentosRestantes = 0; window.setElText("movRestantes", "Passos Livres: 0");
};

window.clicarGrid = function(x,y, isObs) {
    if(!window.jogadorAtual) return;
    let u = window.usersGlobais[window.jogadorAtual]; let isGaia = (u.deus && u.deus.includes("Gaia"));
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0 && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Espere seu turno."); return; }
    
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    if(grid[`${x}_${y}`]) return; // Ocupado
    
    let px = -1, py = -1; let isAlreadyOnBoard = false;
    Object.keys(grid).forEach(cid => { if(grid[cid] === window.jogadorAtual) { isAlreadyOnBoard = true; let parts = cid.split("_"); px = parseInt(parts[0]); py = parseInt(parts[1]); } });

    if(!window.isMaster && isAlreadyOnBoard) {
        // Checa distância Chebyshev
        let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
        if(dist > window.movimentosRestantes) { return; } // Ignora cliques muito longe silenciosamente
        if(isObs && !isGaia) { window.showNeonToast("Obstáculo! Apenas Gaia atravessa."); return; }
        window.movimentosRestantes -= dist; window.setElText("movRestantes", `Passos Livres: ${window.movimentosRestantes}`);
    } else if (isObs && !isGaia && !window.isMaster) {
        window.showNeonToast("Obstáculo! Apenas Gaia atravessa."); return;
    }

    let up = {}; Object.keys(grid).forEach(k => { if(grid[k]===window.jogadorAtual) up[k] = null; }); up[`${x}_${y}`] = window.jogadorAtual;
    window.db.ref(`tokyoRpg/submaps/${window.currentSubMapKey}`).update(up);
};

window.initTacticalBoard = function() {
    let b = document.getElementById("gridCells"); if(!b) return; b.innerHTML = "";
    let loc = window.locaisMapa[window.currentSubMapKey] || {}; let obsList = loc.obs || [];
    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia"));

    for(let i=0; i<192; i++) {
        let x = i % 16; let y = Math.floor(i / 16); let cid = `${x}_${y}`; let isObs = obsList.includes(cid);
        let obsClass = isObs ? (isGaia ? "cell-obstacle-gaia" : "cell-obstacle") : "";
        let cell = document.createElement("div"); cell.id = `cell_${x}_${y}`; cell.className = `tactical-cell ${obsClass}`;
        cell.onclick = () => window.clicarGrid(x, y, isObs); b.appendChild(cell);
    }
    
    let ro = document.getElementById("roomOverlays"); if(ro) ro.innerHTML = "";
    if(loc.salas && ro) loc.salas.forEach(s => { ro.innerHTML += `<div class="room-overlay" style="left:${(s.x/16)*100}%; top:${(s.y/12)*100}%; width:${(s.w/16)*100}%; height:${(s.h/12)*100}%;">${s.n}</div>`; });
};

window.updateTacticalBoard = function() {
    if(!window.currentSubMapKey) return;
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    let layer = document.getElementById("tokensLayer"); if(!layer) return;
    let loc = window.locaisMapa[window.currentSubMapKey] || {}; let obsList = loc.obs || [];
    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia"));

    let px = -1, py = -1;
    Object.keys(grid).forEach(cid => { if(grid[cid] === window.jogadorAtual) { let p = cid.split("_"); px = parseInt(p[0]); py = parseInt(p[1]); } });

    // Highlight in-range cells
    for(let i=0; i<192; i++) {
        let x = i % 16; let y = Math.floor(i / 16); let cid = `${x}_${y}`;
        let cell = document.getElementById(`cell_${x}_${y}`);
        if(cell) {
            cell.classList.remove("in-range", "in-range-blocked");
            let isObs = obsList.includes(cid);
            let canWalk = !isObs || isGaia || window.isMaster;
            if(px !== -1 && py !== -1 && window.movimentosRestantes > 0) {
                let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
                if(dist > 0 && dist <= window.movimentosRestantes && !grid[cid]) {
                    if(canWalk) cell.classList.add("in-range");
                    else cell.classList.add("in-range-blocked");
                }
            }
        }
    }

    let currentTokens = [];
    Object.keys(grid).forEach(cid => {
        let occupier = grid[cid]; if(!occupier) return;
        let parts = cid.split("_"); let x = parseInt(parts[0]); let y = parseInt(parts[1]);
        let tokenId = `token_${occupier}`; currentTokens.push(tokenId);
        let tokenEl = document.getElementById(tokenId);
        let avToken = window.usersGlobais[occupier]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${occupier}`;
        let hp = window.usersGlobais[occupier]?.rpg?.hp || 100;
        let isMe = (occupier === window.jogadorAtual);

        if(tokenEl) {
            tokenEl.style.left = `${(x / 16) * 100}%`; tokenEl.style.top = `${(y / 12) * 100}%`;
            if (tokenEl.querySelector('.token-hp')) tokenEl.querySelector('.token-hp').innerText = hp;
        } else {
            let tHtml = document.createElement("div"); tHtml.id = tokenId; tHtml.className = "tactical-token";
            if(isMe) { tHtml.style.borderColor = "#fff"; tHtml.style.boxShadow = "0 0 20px #fff"; tHtml.style.zIndex = "10"; }
            tHtml.style.backgroundImage = `url('${avToken}')`; tHtml.style.left = `${(x / 16) * 100}%`; tHtml.style.top = `${(y / 12) * 100}%`;
            tHtml.innerHTML = `<div class="token-hp">${hp}</div>`; layer.appendChild(tHtml);
        }
    });

    Array.from(layer.children).forEach(t => { if(!currentTokens.includes(t.id)) t.remove(); });
    
    let tBar = document.getElementById("turnOrderUI"); let btnP = document.getElementById("btnPassTurno");
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0) {
        if(tBar) { tBar.style.display="flex"; tBar.innerHTML=""; }
        if(btnP) btnP.style.display="inline-block";
        window.turnosVTTGlobal.ordem.forEach((n,i) => { if(tBar) tBar.innerHTML+=`<img src="${window.usersGlobais[n]?.avatarUrl||'https://api.dicebear.com/9.x/adventurer/svg?seed='+n}" class="turn-avatar ${i===window.turnosVTTGlobal.atual?'active':''}" title="${n}">`; });
    } else { 
        if(tBar) tBar.style.display="none"; 
        if(btnP) btnP.style.display="none"; 
    }
};

window.renderVttFoodActions = function() {
    let bar = document.getElementById("vttFoodActions"); if(!bar) return; bar.innerHTML = "";
    let inv = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    Object.keys(inv).forEach(k => { if(inv[k].tipo==='Comida' && inv[k].eq) bar.innerHTML += `<button class="btn-eat" onclick="window.consumirComidaVTT('${k}',${inv[k].poder||0},${inv[k].cd||2})">🍽️ Comer ${inv[k].nome}</button>`; });
};

window.consumirComidaVTT = function(k, p, cd) {
    let ov = document.getElementById("eatingOverlay"); let fill = document.getElementById("eatingFill");
    if(!ov || !fill) return;
    ov.style.display="flex"; fill.style.width="0%";
    void fill.offsetWidth; // Reflow force para a animação do CSS pegar!
    
    setTimeout(()=>{ fill.style.transition=`width ${cd}s linear`; fill.style.width="100%"; }, 50);
    setTimeout(()=>{
        ov.style.display="none"; let r=window.getSafeRpg(window.usersGlobais[window.jogadorAtual]);
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(Math.min(100, r.integridade+p));
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).remove();
        window.renderVttFoodActions(); window.showNeonToast(`Nutrição +${p}% restaurada.`);
    }, cd*1000);
};

// --- 7. TETRIS MOCHILA ---
window.renderizarMochila = function() {
    let g = document.getElementById("grid-personagem"); let l = document.getElementById("lista-itens-soltos"); if(!g || !l) return;
    if(window.arrastandoKey !== null) return; 

    let extraW = 0, extraH = 0; let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    Object.values(itens).forEach(i => { if(i.tipo === 'Mochila' && i.eq === true) { extraW += (parseInt(i.extraW) || 0); extraH += (parseInt(i.extraH) || 0); } });
    
    window.GRID_COLS = 5 + extraW; window.GRID_ROWS = 3 + extraH;
    g.style.gridTemplateColumns = `repeat(${window.GRID_COLS}, 45px)`; g.style.gridTemplateRows = `repeat(${window.GRID_ROWS}, 45px)`;
    g.innerHTML = ""; l.innerHTML = ""; window.tetrisMatrix = Array(window.GRID_ROWS).fill(null).map(()=>Array(window.GRID_COLS).fill(0));
    for(let i = 0; i < (window.GRID_COLS * window.GRID_ROWS); i++) g.innerHTML += `<div class="grid-cell"></div>`;

    let pesoStats = window.getPesoStatus(window.usersGlobais[window.jogadorAtual]);
    let sP = document.getElementById("statusPeso"); if(sP) { sP.innerText = `Peso Atual: ${pesoStats.atual} / ${pesoStats.max} kg`; sP.style.color = pesoStats.sobrepeso?"#f00":"var(--accent-gold)"; }

    let drop = {};
    Object.keys(itens).forEach(k => { 
        let i = itens[k]; 
        if(i.eq && (parseInt(i.c)+parseInt(i.w)>window.GRID_COLS || parseInt(i.r)+parseInt(i.h)>window.GRID_ROWS)) { 
            drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/eq`] = false; drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = null; drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = null; 
        } 
    });
    if(Object.keys(drop).length > 0) { window.db.ref().update(drop); return; } 

    Object.keys(itens).forEach(k => {
        let i = itens[k]; let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris ${i.tipo || 'Arma'}`; el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnText = i.eq ? '▼' : '✖'; 
        let btnTitle = i.eq ? 'Guardar na Mochila' : 'Descartar'; 
        let btnClass = i.eq ? 'btn-excluir-item' : 'btn-excluir-item discard';
        
        // MUDEI O NOME DA FUNÇÃO AQUI PARA QUEBRAR O CACHE DO NAVEGADOR
        let btnRotate = `<button class="btn-rotate-item" title="Rotacionar" onpointerdown="window.girarItemMochila('${k}', ${w}, ${h}, ${i.eq}, event)">↻</button>`;
        
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span>${i.tipo === 'Comida' ? `<button onclick="window.consumirComida('${k}', ${i.poder||0}, ${i.cd||2}, event)" style="font-size:8px; padding:2px; margin-top:2px; background:#000; color:#0f0; border:1px solid #0f0; border-radius:2px; cursor:pointer; position:relative; z-index:5;">Comer</button>` : ''}<button class="${btnClass}" title="${btnTitle}" onpointerdown="window.removerItemMochila('${k}', event)">${btnText}</button>`;

        if(i.eq === true && i.c !== undefined && i.r !== undefined && parseInt(i.c) < window.GRID_COLS && parseInt(i.r) < window.GRID_ROWS) {
            let ic = parseInt(i.c); let ir = parseInt(i.r);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`;
            el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) for(let col=ic; col<ic+w; col++) window.tetrisMatrix[row][col] = 1; 
            g.appendChild(el);
        } else {
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto';
            l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteTetris);
    });
    window.renderVttFoodActions();
};

window.iniciarArrasteTetris = function(e) {
    if(e.target.closest('.btn-excluir-item') || e.target.closest('.btn-rotate-item') || e.target.tagName.toLowerCase() === 'button') return;
    e.preventDefault(); window.itemArrastado = e.currentTarget; window.arrastandoKey = window.itemArrastado.getAttribute('data-key');
    let gridEl = document.getElementById("grid-personagem");
    let rectOrig = window.itemArrastado.getBoundingClientRect();

    if (window.itemArrastado.parentElement === gridEl) {
        window.origin = 'grid'; window.initPos = {c: parseInt(window.itemArrastado.getAttribute('data-c')), r: parseInt(window.itemArrastado.getAttribute('data-r'))};
        let w = parseInt(window.itemArrastado.getAttribute('data-w')); let h = parseInt(window.itemArrastado.getAttribute('data-h'));
        for(let row=window.initPos.r; row<window.initPos.r+h; row++) for(let col=window.initPos.c; col<window.initPos.c+w; col++) window.tetrisMatrix[row][col] = 0; 
    } else { 
        window.origin = 'inv'; 
        let gridRect = gridEl.getBoundingClientRect();
        window.itemArrastado.style.margin = "0";
        window.itemArrastado.style.left = (rectOrig.left - gridRect.left) + 'px';
        window.itemArrastado.style.top = (rectOrig.top - gridRect.top) + 'px';
        gridEl.appendChild(window.itemArrastado); 
    }
    
    window.itemArrastado.classList.add('dragging'); window.itemArrastado.style.position = 'absolute'; 
    let newRect = window.itemArrastado.getBoundingClientRect();
    window.offsetX = e.clientX - newRect.left; window.offsetY = e.clientY - newRect.top;

    document.addEventListener('pointermove', window.arrastarTetris); document.addEventListener('pointerup', window.soltarTetris);
};
window.arrastarTetris = function(e) { e.preventDefault(); window.moverTetris(e); };
window.moverTetris = function(e) {
    if(!window.itemArrastado) return; const gridRect = document.getElementById("grid-personagem").getBoundingClientRect();
    window.itemArrastado.style.left = `${e.clientX - gridRect.left - window.offsetX}px`; window.itemArrastado.style.top = `${e.clientY - gridRect.top - window.offsetY}px`;
};
window.soltarTetris = function(e) {
    document.removeEventListener('pointermove', window.arrastarTetris); document.removeEventListener('pointerup', window.soltarTetris);
    if(!window.itemArrastado) return; window.itemArrastado.classList.remove('dragging');
    const w = parseInt(window.itemArrastado.getAttribute('data-w')), h = parseInt(window.itemArrastado.getAttribute('data-h'));
    
    let rawLeft = parseFloat(window.itemArrastado.style.left || 0); let rawTop = parseFloat(window.itemArrastado.style.top || 0);
    let tC = Math.round(rawLeft / window.REAL_CELL_SIZE); let tR = Math.round(rawTop / window.REAL_CELL_SIZE);

    if (tC < 0 || tC + w > window.GRID_COLS || tR < 0 || tR + h > window.GRID_ROWS) {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null});
    } else {
        let livre = true;
        for(let r=tR; r<tR+h; r++) for(let c=tC; c<tC+w; c++) if(window.tetrisMatrix[r][c] === 1) livre = false;
        if(livre) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: tC, r: tR});
        else {
            if(window.origin === 'grid') window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: window.initPos.c, r: window.initPos.r});
            else window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null});
        }
    }
    window.arrastandoKey = null; window.itemArrastado = null; window.renderizarMochila();
};

window.consumirComida = function(k, poder, cd, ev) { 
    if(ev) ev.stopPropagation(); 
    let ov = document.getElementById("eatingOverlay"); let fill = document.getElementById("eatingFill");
    if(!ov || !fill) return;
    ov.style.display="flex"; fill.style.width="0%"; void fill.offsetWidth; // Reflow force
    setTimeout(()=>{ fill.style.transition=`width ${cd}s linear`; fill.style.width="100%"; }, 50);
    setTimeout(()=>{
        ov.style.display="none"; let r=window.getSafeRpg(window.usersGlobais[window.jogadorAtual]);
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(Math.min(100, r.integridade+parseInt(poder)));
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).remove();
        window.showNeonToast(`Nutrição +${poder}% restaurada.`);
    }, cd*1000); 
};
window.removerItemMochila = function(k, ev) { 
    if(ev) ev.stopPropagation(); let item = window.usersGlobais[window.jogadorAtual]?.mochila?.[k];
    if(item && item.eq) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({eq: false, c: null, r: null}); } 
    else { if(confirm("Descartar item permanentemente?")) window.db.ref('tokyoRpg/users/' + window.jogadorAtual + '/mochila/' + k).remove(); }
};

// =========================================================
// NOVA LÓGICA DE GIRAR
// =========================================================
window.girarItemMochila = function(k, w, h, eq, ev) {
    if(ev) ev.stopPropagation(); 
    
    let newW = parseInt(h); 
    let newH = parseInt(w); 
    let up = {};
    
    if(eq) {
        let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
        let tempMatrix = Array(window.GRID_ROWS).fill(null).map(()=>Array(window.GRID_COLS).fill(0));
        
        Object.keys(itens).forEach(ik => {
            if(ik !== k && itens[ik].eq) {
                let iW = parseInt(itens[ik].w)||1, iH = parseInt(itens[ik].h)||1;
                let iC = parseInt(itens[ik].c), iR = parseInt(itens[ik].r);
                if(!isNaN(iC) && !isNaN(iR)) {
                    for(let row=iR; row<iR+iH; row++) {
                        for(let col=iC; col<iC+iW; col++) {
                            if(row<window.GRID_ROWS && col<window.GRID_COLS) tempMatrix[row][col] = 1;
                        }
                    }
                }
            }
        });

        let startC = parseInt(itens[k].c);
        let startR = parseInt(itens[k].r);
        let targetC = startC;
        let targetR = startR;
        let found = false;

        let cabeNoLugar = true;
        if(startC + newW > window.GRID_COLS || startR + newH > window.GRID_ROWS) {
            cabeNoLugar = false; 
        } else {
            for(let row=startR; row<startR+newH; row++) {
                for(let col=startC; col<startC+newW; col++) {
                    if(tempMatrix[row][col] === 1) cabeNoLugar = false; 
                }
            }
        }

        if(cabeNoLugar) {
            found = true; 
        } else {
            let offsets = [];
            for(let dy = -window.GRID_ROWS; dy <= window.GRID_ROWS; dy++) {
                for(let dx = -window.GRID_COLS; dx <= window.GRID_COLS; dx++) {
                    offsets.push({dx: dx, dy: dy, dist: Math.abs(dx) + Math.abs(dy)});
                }
            }
            offsets.sort((a,b) => a.dist - b.dist);

            for(let off of offsets) {
                let nc = startC + off.dx;
                let nr = startR + off.dy;
                if(nc >= 0 && nc + newW <= window.GRID_COLS && nr >= 0 && nr + newH <= window.GRID_ROWS) {
                    let livre = true;
                    for(let row=nr; row<nr+newH; row++) {
                        for(let col=nc; col<nc+newW; col++) {
                            if(tempMatrix[row][col] === 1) livre = false; 
                        }
                    }
                    if(livre) {
                        found = true; targetC = nc; targetR = nr; break; 
                    }
                }
            }
        }

        if(found) {
            let el = document.querySelector(`.item-tetris[data-key='${k}']`);
            if(el) {
                el.style.transition = "transform 0.2s ease-in-out";
                el.style.transform = "rotate(90deg) scale(0.9)";
                el.style.zIndex = "999";
            }
            setTimeout(() => {
                up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW;
                up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH;
                up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = targetC;
                up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = targetR;
                window.db.ref().update(up);
            }, 200);
        } else {
            window.showNeonToast("Sem espaço no grid para rotacionar!");
        }

    } else {
        let el = document.querySelector(`.item-tetris[data-key='${k}']`);
        if(el) {
            el.style.transition = "transform 0.2s ease-in-out";
            el.style.transform = "rotate(90deg) scale(0.9)";
        }
        setTimeout(() => {
            up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW;
            up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH;
            window.db.ref().update(up);
        }, 200);
    }
};

window.rotacionarItem = function(k, w, h, eq, ev) {
    if(ev) ev.stopPropagation(); 
    
    let up = {};
    up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = h;
    up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = w;
    
    if(eq) {
        up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/eq`] = false;
        up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = null;
        up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = null;
        window.showNeonToast("Item movido para a mochila ao rotacionar.");
    }
    
    window.db.ref().update(up);
};

// --- CASA VTT ---
window.drawCasaBoard = function() {
    let b = document.getElementById("casaBoard"); if(!b) return;
    b.innerHTML = ""; let gridCasa = window.casaGlobais[window.jogadorAtual] || {}; 
    for(let y=0; y<12; y++) {
        for(let x=0; x<16; x++) {
            let cellId = `${x}_${y}`; let fItem = gridCasa[cellId];
            let cellHtml = `<div class="tactical-cell" onclick="window.clicarGridCasa(${x}, ${y})">`;
            if(fItem) {
                let fSizeW = fItem.w || 1; let fSizeH = fItem.h || 1;
                cellHtml += `<div class="furniture-token" style="width:calc(${fSizeW} * 100%); height:calc(${fSizeH} * 100%);"><button class="btn-remover-movel" onclick="window.removerMoveCasa('${cellId}', event)">X</button>${fItem.n}</div>`;
            }
            cellHtml += `</div>`; b.innerHTML += cellHtml;
        }
    }
    let cData = window.usersGlobais[window.jogadorAtual]?.casaConfig;
    if(cData && cData.bg) { b.style.backgroundImage = `url('${cData.bg}')`; b.style.backgroundSize = "cover"; b.style.backgroundColor = "transparent"; } else { b.style.backgroundImage = "none"; b.style.backgroundColor = "#000"; }
    
    let fTray = document.getElementById("furnitureTray"); let moveisNoGrid = Object.values(gridCasa).map(x=>x.n);
    if(fTray) {
        fTray.innerHTML = ""; let prop = window.usersGlobais[window.jogadorAtual]?.casa; 
        if(prop) { Object.keys(prop).forEach(k => { let i = prop[k]; if(i.tipo==="Móvel" && !moveisNoGrid.includes(i.nome)) fTray.innerHTML += `<div class="furniture-item" onclick="window.selecionarMovel('${i.nome}', ${i.w||1}, ${i.h||1}, this)">${i.nome} [${i.w||1}x${i.h||1}]</div>`; }); }
    }
};
window.selectedFurniture = null; window.selectedSizeW = 1; window.selectedSizeH = 1;
window.selecionarMovel = function(nome, w, h, el) { window.selectedFurniture = nome; window.selectedSizeW = w; window.selectedSizeH = h; document.querySelectorAll('.furniture-item').forEach(e=>e.classList.remove('selected')); el.classList.add('selected'); };
window.clicarGridCasa = function(x,y) { if(!window.selectedFurniture) return; let cellId = `${x}_${y}`; window.db.ref(`tokyoRpg/casasGrid/${window.jogadorAtual}/${cellId}`).set({n: window.selectedFurniture, w: window.selectedSizeW, h: window.selectedSizeH}); window.selectedFurniture = null; document.querySelectorAll('.furniture-item').forEach(e=>e.classList.remove('selected')); window.drawCasaBoard(); };
window.removerMoveCasa = function(cellId, ev) { ev.stopPropagation(); window.db.ref(`tokyoRpg/casasGrid/${window.jogadorAtual}/${cellId}`).remove().then(()=>window.drawCasaBoard()); };
window.salvarConfigCasa = function() { if(!window.jogadorAtual) return; let nome = document.getElementById("casaNomeInp").value; let bg = document.getElementById("casaBgInp").value; window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/casaConfig`).update({ nome: nome, bg: bg }); window.showNeonToast("Casa Salva!"); };

// --- 8. LOJA E MASTER ---
window.filtrarLoja = function(t, btn) { 
    window.filtroLojaAtual = t; 
    document.querySelectorAll(".shop-tab-btn").forEach(b=>b.classList.remove("active")); 
    btn.classList.add("active"); 
    window.renderizarLojaUI(); 
};

// FIX: Lógica do Carousel e Cards
window.renderizarLojaUI = function() {
    let b = document.getElementById("shopGrid"); if(!b) return; 
    b.innerHTML="";
    
    let mPanel = document.getElementById("masterShopPanel");
    if(mPanel) mPanel.style.display = window.isMaster ? "block" : "none";

    if(!window.lojaGlobal) return;

    Object.keys(window.lojaGlobal).forEach(k => {
        let i = window.lojaGlobal[k];
        
        let show = false;
        if(window.filtroLojaAtual === "Promoções" && i.isPromo === true) show = true;
        else if(window.filtroLojaAtual === i.tipo) show = true;
        else if(window.filtroLojaAtual === "Tudo") show = true;

        if(show) {
            let promoTag = i.isPromo ? `<div class="shop-promo-tag">PROMO</div>` : '';
            let mC = window.isMaster ? `onclick="window.prepararEdicaoLoja('${k}')" class="shop-item master-edit" style="cursor:pointer;" title="Clique para Editar"` : `class="shop-item"`;
            
            b.innerHTML += `<div ${mC}>
                ${promoTag}
                <div class="shop-item-content">
                    <span style="font-size:10px;color:#aaa;">${window.iconesMercado[i.tipo]||''} [${i.w}x${i.h} | ${i.peso}kg | ${i.cd||0}s]</span>
                    <h3 class="neon-blue">${i.nome}</h3>
                    <p style="font-size:12px;color:#ccc;">${i.desc}</p>
                </div>
                <div class="shop-item-footer">
                    <h2 class="neon-green">${i.preco}¥</h2>
                    <button class="action-btn" onclick="window.comprarItem('${k}','${i.nome}',${i.preco},'${i.tipo}','${i.desc}', ${i.poder||0}, '${i.buffType||''}', ${i.w||1}, ${i.h||1}, ${i.extraW||0}, ${i.extraH||0}, ${i.peso||1}, ${i.cd||2}, event)">Comprar</button>
                </div>
            </div>`;
        }
    });
};

// FIX: Função de Navegação para o Carousel
window.navegarLoja = function(dir) {
    let grid = document.getElementById("shopGrid");
    if(!grid) return;
    // Move 80% do que estiver visível no momento na tela, criando um slide perfeito.
    let moveAmount = grid.clientWidth * 0.8; 
    grid.scrollBy({ left: dir * moveAmount, behavior: 'smooth' });
};

window.prepararEdicaoLoja = function(id) {
    if(!window.isMaster) return; let i = window.lojaGlobal[id]; if(!i) return; window.editandoItemId = id;
    window.setElVal("niType", i.tipo); window.setElVal("niName", i.nome); window.setElVal("niDesc", i.desc); window.setElVal("niBuffType", i.buffType || ""); window.setElVal("niPoder", i.poder || ""); window.setElVal("niW", i.w || 1); window.setElVal("niH", i.h || 1); window.setElVal("niPrice", i.preco); window.setElVal("niExW", i.extraW || 0); window.setElVal("niExH", i.extraH || 0); window.setElVal("niPeso", i.peso || 1); window.setElVal("niCD", i.cd || 2);
    
    let chk = document.getElementById("niPromo"); if(chk) chk.checked = (i.isPromo === true);

    if(document.getElementById("btnSalvarLoja")) document.getElementById("btnSalvarLoja").innerText = "Salvar Alterações";
    window.setElDisplay("btnCancelarEdicao", "inline-block"); 
    let p = document.getElementById("masterShopPanel"); if(p) p.scrollIntoView({behavior: "smooth"});
};

window.cancelarEdicaoLoja = function() { 
    window.editandoItemId = null; window.setElVal("niName", ""); window.setElVal("niDesc", ""); window.setElVal("niPrice", ""); window.setElVal("niPoder", ""); window.setElVal("niExW", "0"); window.setElVal("niExH", "0"); window.setElVal("niPeso", "1"); window.setElVal("niCD", "2"); 
    let chk = document.getElementById("niPromo"); if(chk) chk.checked = false;

    if(document.getElementById("btnSalvarLoja")) document.getElementById("btnSalvarLoja").innerText = "Publicar no Mercado"; 
    window.setElDisplay("btnCancelarEdicao", "none"); 
};

window.criarItemLoja = function() {
    if(!window.isMaster) return;
    let chkPromo = document.getElementById("niPromo");
    let isP = chkPromo ? chkPromo.checked : false;

    let payload = { tipo: document.getElementById("niType").value, nome: document.getElementById("niName").value.trim(), desc: document.getElementById("niDesc").value.trim(), buffType: document.getElementById("niBuffType").value, poder: parseInt(document.getElementById("niPoder").value||"0"), w: parseInt(document.getElementById("niW").value||"1"), h: parseInt(document.getElementById("niH").value||"1"), preco: parseInt(document.getElementById("niPrice").value), extraW: parseInt(document.getElementById("niExW").value||"0"), extraH: parseInt(document.getElementById("niExH").value||"0"), peso: parseInt(document.getElementById("niPeso").value||"1"), cd: parseInt(document.getElementById("niCD").value||"2"), isPromo: isP };

    if(payload.nome && payload.preco) {
        if(window.editandoItemId) {
            window.db.ref('tokyoRpg/loja/' + window.editandoItemId).update(payload).then(() => {
                window.db.ref('tokyoRpg/users').once('value').then(snap => {
                    let usrs = snap.val(); let updates = {};
                    if(usrs) { Object.keys(usrs).forEach(uKey => { let inv = usrs[uKey].mochila; if(inv) { Object.keys(inv).forEach(mKey => { if(inv[mKey].id === window.editandoItemId || inv[mKey].nome === payload.nome) { updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/nome`] = payload.nome; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/desc`] = payload.desc; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/poder`] = payload.poder; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/buffType`] = payload.buffType; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/w`] = payload.w; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/h`] = payload.h; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/extraW`] = payload.extraW; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/extraH`] = payload.extraH; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/peso`] = payload.peso; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/cd`] = payload.cd; } }); } }); }
                    if(Object.keys(updates).length > 0) { window.db.ref().update(updates); }
                });
            });
            window.showNeonToast("Item Atualizado!"); window.cancelarEdicaoLoja();
        } else { window.db.ref('tokyoRpg/loja').push(payload); window.showNeonToast("Publicado!"); window.setElVal("niName", ""); window.setElVal("niDesc", ""); }
    }
};

window.comprarItem = function(id, n, p, t, d, poder, buff, w, h, exW, exH, peso, cd, ev) {
    if(ev) ev.stopPropagation(); if(!window.jogadorAtual || window.isMaster) return; let c = window.usersGlobais[window.jogadorAtual].carteira||0; if(c<p) {window.showNeonToast("Sem Yenes.");return;}
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(c-p);
    let itemPayload = { id: id, nome: n, tipo: t, desc: d, poder: poder, buffType: buff, w:w, h:h, extraW:exW, extraH:exH, peso:peso, cd:cd, eq:false };
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila`).push(itemPayload); window.showNeonToast("Comprado!");
};

// --- 9. CHAT, AVATARES E LOGIN ---
window.carregarAvatares = function() {
    let g = document.getElementById("avatarGridDisplay"); if(!g) return; g.innerHTML = "";
    
    let hs = ["Jack", "Leo", "Felix", "Sam", "Arthur", "Ryan", "Oliver", "Caleb", "Zane", "Eli", "Noah", "Luke", "Gabe", "Max", "Ivan", "Finn", "Hugo", "Ezra", "Milo", "Levi", "Owen", "Asher", "Silas", "Theo"];
    let ms = ["Ane", "Lucy", "Jude", "Mia", "Zoe", "Lily", "Eva", "Ruby", "Cleo", "Nora", "Iris", "Lia", "Fay", "Gia", "Ivy", "Luna", "Mila", "Aria", "Ella", "Chloe", "Maya", "Kira", "Sia", "Nina"];
    let bs = ["Bot1", "Bot2", "Bot3", "Bot4", "Bot5", "Bot6", "Bot7", "Bot8", "Bot9", "Bot10", "Bot11", "Bot12", "Bot13", "Bot14", "Bot15"];
    
    hs.forEach(s => { g.innerHTML += `<img src="https://api.dicebear.com/9.x/adventurer/svg?seed=${s}" class="av-thumb" onclick="window.selecionarAvatarLoja(this, 'https://api.dicebear.com/9.x/adventurer/svg?seed=${s}')">`; });
    ms.forEach(s => { g.innerHTML += `<img src="https://api.dicebear.com/9.x/adventurer/svg?seed=${s}Female" class="av-thumb" onclick="window.selecionarAvatarLoja(this, 'https://api.dicebear.com/9.x/adventurer/svg?seed=${s}Female')">`; });
    bs.forEach(s => { g.innerHTML += `<img src="https://api.dicebear.com/9.x/bottts/svg?seed=${s}" class="av-thumb" onclick="window.selecionarAvatarLoja(this, 'https://api.dicebear.com/9.x/bottts/svg?seed=${s}')">`; });
};
window.selecionarAvatarLoja = function(el, url) { window.urlSelecionadaStudio = url; document.querySelectorAll('.av-thumb').forEach(e=>e.classList.remove('selected')); el.classList.add('selected'); };
window.salvarAvatarCustom = function() {
    if(!window.jogadorAtual || !window.urlSelecionadaStudio) return;
    if(!window.isMaster && window.usersGlobais[window.jogadorAtual].carteira < 500) { window.showNeonToast("Precisa de 500 ¥."); return; }
    if(!window.isMaster) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(window.usersGlobais[window.jogadorAtual].carteira - 500);
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/avatarUrl`).set(window.urlSelecionadaStudio); window.showNeonToast("Avatar Equipado!");
};
window.carregarTitulos = function() { let sel = document.getElementById("lojaTitulos"); if(!sel) return; sel.innerHTML = ""; window.titulosExtensos.forEach(t => { let arr = t.split("|"); sel.innerHTML += `<option value="${arr[0]}|${arr[1]}|${arr[2]}">${arr[0]} [${arr[1]}] - ${arr[2]}¥</option>`; }); };
window.comprarTituloChat = function() {
    if(!window.jogadorAtual) return; let sel = document.getElementById("lojaTitulos").value; let arr = sel.split("|"); let txt = arr[0]; let rar = arr[1]; let preco = parseInt(arr[2]);
    let u = window.usersGlobais[window.jogadorAtual]; let unl = u.titulosUnl || {};
    if(!unl[txt] && preco > 0) { if((u.carteira||0) < preco) { window.showNeonToast("Sem fundos."); return; } window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set((u.carteira||0) - preco); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/titulosUnl/${txt}`).set(true); }
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/tituloChat`).set({txt:txt, raridade:rar}); window.showNeonToast("Título Equipado!");
};
window.msgAtualParaReagir = "";
window.abrirEmojiReacao = function(msgKey, event) { window.msgAtualParaReagir = msgKey; let p = document.getElementById("emojiPopupDynamic"); p.style.display="flex"; p.style.left = event.clientX + "px"; p.style.top = (event.clientY - 10) + "px"; };
window.executarReacao = function(emoji) { if(!window.msgAtualParaReagir) return; window.db.ref(`tokyoRpg/chat/${window.msgAtualParaReagir}/reacoes/${emoji}`).once('value').then(s => { window.db.ref(`tokyoRpg/chat/${window.msgAtualParaReagir}/reacoes/${emoji}`).set((s.val()||0)+1); window.setElDisplay("emojiPopupDynamic", "none"); }); };

window.enviarSMS = function() { if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual].numero) return; let dest = document.getElementById("smsDestino").value.trim(); let msg = document.getElementById("smsTexto").value.trim(); let meuNum = window.usersGlobais[window.jogadorAtual].numero; if(!dest || !msg) return; let achou = false; Object.keys(window.usersGlobais).forEach(userKey => { if(window.usersGlobais[userKey].numero === dest) achou = true; }); if(!achou) { window.showNeonToast("O número não existe."); return; } let timestamp = Date.now(); let pacote = { de: meuNum, para: dest, msg: msg, data: new Date().toLocaleTimeString() }; window.db.ref('tokyoRpg/sms/' + dest + '/' + timestamp).set(pacote); window.db.ref('tokyoRpg/sms/' + meuNum + '/' + timestamp).set(pacote); document.getElementById("smsTexto").value = ""; };

window.iniciarEmbateMap = function() { if(!window.isMaster) return; let locStr = document.getElementById("embLocal").value; let p1 = document.getElementById("embP1").value.trim().toUpperCase(); let p2 = document.getElementById("embP2").value.trim().toUpperCase(); let ap = parseInt(document.getElementById("embAposta").value||0); if(!locStr || !p1 || !p2) return; window.db.ref('tokyoRpg/mapEmbates').push({ localKey: locStr, p1: p1, p2: p2, aposta: ap }); window.showNeonToast("Embate Trancado."); window.setElVal("embP1",""); window.setElVal("embP2",""); window.setElVal("embAposta",""); };
window.processarEmbate = function() { if(!window.isMaster) return; let v = document.getElementById("embVencedor").value.trim().toUpperCase(); let p = document.getElementById("embPerdedor").value.trim().toUpperCase(); let mDesc = document.getElementById("embMorteDesc").value; let mImg = document.getElementById("embMorteImg").value; if(!v || !p) return; let ap = 0; let embKey = null; Object.keys(window.embatesGlobais).forEach(k => { let e = window.embatesGlobais[k]; if((e.p1===v||e.p2===v)&&(e.p1===p||e.p2===p)) { ap = e.aposta||0; embKey = k; } }); let cVenc = window.usersGlobais[v]?.carteira || 0; let cPerd = window.usersGlobais[p]?.carteira || 0; cVenc += ap; cPerd -= ap; let isMorte = (cPerd <= 0); if(window.usersGlobais[v]) window.db.ref(`tokyoRpg/users/${v}`).update({ carteira: cVenc, "rpg/nivel": (window.usersGlobais[v].rpg?.nivel||1)+1, "rpg/pontosLivres": (window.usersGlobais[v].rpg?.pontosLivres||0)+1 }); if(window.usersGlobais[p]) { if(isMorte) window.db.ref(`tokyoRpg/users/${p}`).update({ carteira: 0, status: "morto" }); else window.db.ref(`tokyoRpg/users/${p}`).update({ carteira: cPerd }); } if(embKey) window.db.ref(`tokyoRpg/mapEmbates/${embKey}`).remove(); window.db.ref('tokyoRpg/news').push({ tipo: isMorte?"MORTE":"EMBATE", vencedor: v, perdedor: p, aposta: ap, saldoVencedor: cVenc, saldoPerdedor: cPerd, data: new Date().toLocaleTimeString(), descMorte: mDesc, imgMorte: mImg }); window.showNeonToast("Resolvido!"); window.setElVal("embVencedor",""); window.setElVal("embPerdedor",""); window.setElVal("embMorteDesc",""); window.setElVal("embMorteImg",""); };

window.dispararLoadingLogin = async function(isS) {
    let n = document.getElementById("loginName").value.trim().toUpperCase(); let p = document.getElementById("loginPass").value; let s = document.getElementById("loginSerial").value.trim().toUpperCase();
    if(isS) { if(!s) return; s = s + "-DC1"; } if(!isS && (!n || !p)) return;
    window.setElDisplay('loginScreen', 'none'); window.setElDisplay('loadingTerminal', 'flex');
    let lines = [ "ESTABELECENDO CONEXÃO SEGURA...", "IMPORT_SERVER_DATA(192.168.0.45)...", "VERIFICANDO CREDENCIAIS...", "ACESSO CONCEDIDO." ]; let txt = "";
    for(let line of lines) { txt += line + "<br><br>"; window.setElHTML('loadingText', txt); await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); }
    window.setElDisplay('loadingTerminal', 'none');
    if(isS) window.logarComSerialFinal(s); else window.logarComSenhaFinal(n, p);
};
window.logarComSenhaFinal = function(n, s) { window.db.ref('tokyoRpg/users/' + n).once('value').then((snap) => { let ud = snap.val(); if(ud) { if (ud.senha !== s) { alert("Senha incorreta."); window.setElDisplay('loginScreen', 'block'); return; } window.logarSucesso(n, ud.serial); } else { let ns = Math.floor(1000 + Math.random()*9000)+"-DC1"; window.db.ref('tokyoRpg/users/' + n).set({ senha: s, serial: ns, carteira: 0, rpg: window.getSafeRpg(null), local: "p1" }); window.logarSucesso(n, ns); alert(`Criado.`); } }); };
window.logarComSerialFinal = function(s) { if(s === window.MASTER_SERIAL) { window.db.ref('tokyoRpg/users/MESTRE').update({ serial: window.MASTER_SERIAL, carteira: 9999999 }); window.logarSucesso("MESTRE", window.MASTER_SERIAL); return; } let achou = false; Object.keys(window.usersGlobais).forEach(n => { if(window.usersGlobais[n].serial === s) { achou = true; window.logarSucesso(n, s); }}); if(!achou) { alert("Serial não encontrado."); window.setElDisplay('loginScreen', 'block'); } };

window.logarSucesso = function(n, s) {
    window.jogadorAtual = n; window.serialAtual = s; window.isMaster = (s === window.MASTER_SERIAL); 
    
    
    if(window.isMaster) { let sel = document.getElementById("embLocal"); if(sel) {sel.innerHTML = "<option value=''>Selecione...</option>"; Object.keys(window.locaisMapa).forEach(k => { sel.innerHTML += `<option value="${k}">${window.locaisMapa[k].nome}</option>`; });} }
    
    window.setElDisplay("loginModal", "none");
    window.setElDisplay("base-desktop", "flex"); 
    window.setElDisplay("gameContainer", "none");

    window.renderizarFicha(); window.renderizarMochila(); window.renderizarLojaUI(); window.drawMapVisuals(); window.renderizarPanteao();
      // --> ADICIONE ESTA LINHA AQUI NO FINAL DA FUNÇÃO:
    window.escutarNotificacoes(); 
    
    if(window.db && window.jogadorAtual) { window.db.ref('.info/connected').on('value', function(s) { if (s.val() === true) { window.connectionRef = window.db.ref('tokyoRpg/presence/' + window.jogadorAtual); window.connectionRef.onDisconnect().set(false).then(() => { window.connectionRef.set(true); }); }}); }
};

window.deslogar = function() { if(window.connectionRef) window.connectionRef.set(false); window.jogadorAtual = ""; window.serialAtual = ""; window.isMaster = false; window.setElVal("loginName", ""); window.setElVal("loginPass", ""); window.setElVal("loginSerial", ""); window.fecharCelular(); window.setElDisplay('gameContainer', 'none'); window.setElDisplay('base-desktop', 'none'); window.abrirModal(); window.drawMapVisuals(); };

// === 10. INICIALIZAÇÃO ONLOAD ===
window.onload = function() {
    if (window.db) {
        window.carregarTitulos(); window.carregarAvatares(); 
        window.db.ref('tokyoRpg/users').on('value', s => { 
            window.usersGlobais = s.val()||{}; 
            window.renderizarFicha(); window.renderizarMochila(); window.drawMapVisuals(); window.drawCasaBoard(); window.desenharListaUsuarios(); window.renderizarPanteao(); window.updateTacticalBoard();
        });
        window.db.ref('tokyoRpg/presence').on('value', s => { window.presenceGlobal = s.val()||{}; window.drawMapVisuals(); window.desenharListaUsuarios(); });
        window.db.ref('tokyoRpg/mapEmbates').on('value', s => { window.embatesGlobais = s.val() || {}; window.drawMapVisuals(); });
        window.db.ref('tokyoRpg/loja').on('value', s => { window.lojaGlobal = s.val() || {}; window.renderizarLojaUI(); window.renderizarFicha(); window.renderizarMochila(); window.drawCasaBoard(); }); 
        window.db.ref('tokyoRpg/casasGrid').on('value', s => { window.casaGlobais = s.val() || {}; window.drawCasaBoard(); });
        window.db.ref('tokyoRpg/submaps').on('value', s => { window.submapasGlobais = s.val() || {}; window.updateTacticalBoard(); });
        
        window.db.ref('tokyoRpg/submapsBGs').on('value', s => { 
            window.submapasBGs = s.val() || {}; 
            if(window.currentSubMapKey) { 
                let subCanvas = document.getElementById("subMapCanvas"); 
                if(subCanvas && window.submapasBGs[window.currentSubMapKey]) { subCanvas.style.backgroundImage = `url("${window.submapasBGs[window.currentSubMapKey]}")`; subCanvas.style.backgroundColor = "transparent"; } 
                else if (subCanvas) { subCanvas.style.backgroundImage = "none"; subCanvas.style.backgroundColor = "#050505"; }
            }
        });

        window.db.ref('tokyoRpg/turnosVTT').on('value', s => { let d = s.val()||{}; window.turnosVTTGlobal = d[window.currentSubMapKey]||null; window.updateTacticalBoard(); });
        
        window.db.ref('tokyoRpg/news').limitToLast(10).on('value', s => { let d = s.val(); let b = document.getElementById("newsFeed"); if(!b) return; b.innerHTML=""; if(d){ Object.values(d).reverse().forEach(n => { b.innerHTML += `<div class="news-item ${n.tipo==='MORTE'?'news-death':''}"><p class="${n.tipo==='MORTE'?'neon-red':'neon-blue'}" style="margin:0;font-size:12px;">${n.data}</p><h3 style="color:#fff;margin:5px 0;">${n.tipo==='MORTE'?'🚨 ÓBITO NO DISTRITO 🚨':'Confronto Concluído'}</h3><p style="color:#ccc;">${n.vencedor} vs ${n.perdedor}. ${n.tipo==='MORTE'?'Perdedor Eliminado.':'Aposta: '+n.aposta+'¥'}</p>${n.descMorte?`<p style="color:#ffaa00;font-size:12px;">Causa: ${n.descMorte}</p>`:''}${n.imgMorte?`<img src="${n.imgMorte}" style="max-width:100%; border-radius:4px; margin-top:10px;">`:''}</div>`; }); }});
        
        window.db.ref('tokyoRpg/currentRoll').on('value', s => { let d = s.val(); if(d && d.ts > Date.now() - 5000) { window.mostrarDadoOverlay(d.nome, d.form, d.results); } });
        window.db.ref('tokyoRpg/mapDados').limitToLast(10).on('value', s => { let d = s.val(); let b = document.getElementById("diceLog"); if(!b) return; b.innerHTML=""; if(d){ Object.values(d).forEach(x => b.innerHTML += `<div style="margin-bottom:5px;"><strong class="neon-blue">${x.nome}:</strong> ${x.texto}</div>`); b.scrollTop = b.scrollHeight; }});
        
        window.db.ref('tokyoRpg/chat').limitToLast(40).on('value', s => { 
            try {
                let d = s.val(); let b = document.getElementById("chatMessages"); if(!b) return; b.innerHTML=""; 
                if(d){ Object.keys(d).forEach(k => { 
                    let m = d[k]; let rCount = m.reacoes || {}; let uData = window.usersGlobais[m.nome] || {}; 
                    let curAv = uData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${m.nome}`; let curTit = uData.tituloChat || m.titulo; 
                    let reactHtml = `<button class="react-add" onclick="window.abrirEmojiReacao('${k}', event)">+</button>${rCount['🔥']?`<button class="react-btn">🔥 ${rCount['🔥']}</button>`:''}${rCount['💀']?`<button class="react-btn">💀 ${rCount['💀']}</button>`:''}${rCount['😂']?`<button class="react-btn">😂 ${rCount['😂']}</button>`:''}${rCount['👀']?`<button class="react-btn">👀 ${rCount['👀']}</button>`:''}${rCount['💯']?`<button class="react-btn">💯 ${rCount['💯']}</button>`:''}${rCount['🤡']?`<button class="react-btn">🤡 ${rCount['🤡']}</button>`:''}${rCount['💔']?`<button class="react-btn">💔 ${rCount['💔']}</button>`:''}${rCount['💰']?`<button class="react-btn">💰 ${rCount['💰']}</button>`:''}`;
                    b.innerHTML += `<div class="msg-box"><div class="msg-avatar-container"><span style="font-size:10px; color:#ff2a5f;">${uData.carteira||0}¥</span><img src="${curAv}" class="msg-avatar"></div><div class="msg-content"><div style="display:flex; flex-direction:column; margin-bottom:5px;">${curTit?`<div class="title-tag ${curTit.raridade}" style="display:inline-block; width:fit-content; margin-bottom:2px;">${curTit.txt||curTit}</div>`:''}<strong style="color:var(--accent-blue); font-size:14px;">${m.nome} <span style="color:#555;font-size:10px; margin-left:5px;">${m.data}</span></strong></div><p style="font-size:13px; line-height:1.4; margin-top:2px;">${m.texto||''}</p>${m.imagemUrl?`<img src="${m.imagemUrl}" class="msg-image">`:''}<div style="margin-top:5px; display:flex; flex-wrap:wrap; gap:5px;">${reactHtml}</div></div></div>`; 
                }); b.scrollTop = b.scrollHeight; }
            } catch (err) { console.error("Erro ao renderizar chat:", err); }
        });
    }
    
    window.abrirModal();
};

window.postAudioMuted = true;
window.currentPostIdComment = null;
window._igamblePostsSwitchHooked = window._igamblePostsSwitchHooked || false;

window.toggleGambleMute = function() {
    window.postAudioMuted = !window.postAudioMuted;
    let btn = document.getElementById("btnToggleMute");
    if(btn) {
        btn.innerText = window.postAudioMuted ? "🔇 Áudio Bloqueado" : "🔊 Áudio Liberado";
        btn.style.borderColor = window.postAudioMuted ? "#aaa" : "#0f0";
        btn.style.color = window.postAudioMuted ? "#aaa" : "#0f0";
    }

    if(window.postAudioMuted) {
        document.querySelectorAll('audio.post-audio').forEach(a => a.pause());
        return;
    }

    document.querySelectorAll('audio.post-audio').forEach(a => {
        let rect = a.getBoundingClientRect();
        if(rect.top >= 0 && rect.bottom <= window.innerHeight) a.play().catch(()=>{});
    });
};

window.togglePostCreator = function() {
    let bx = document.getElementById("postCreatorBox");
    if(!bx) return;
    let cur = (bx.style.display || "");
    bx.style.display = (cur === "none" || cur === "") ? "block" : "none";
};

window.enviarPost = function() {
    if(!window.jogadorAtual && !window.isMaster) { window.showNeonToast("Faça login!"); return; }
    if(!window.db) return;

    let txt = (document.getElementById("postText")?.value || "").trim();
    let imgUrl = (document.getElementById("postImgUrl")?.value || "").trim();
    let imgFile = document.getElementById("postImgFile")?.files?.[0] || null;
    let audio = (document.getElementById("postAudioUrl")?.value || "").trim();

    let cAv = document.getElementById("postCustomAvatar") ? document.getElementById("postCustomAvatar").value.trim() : "";
    let cName = document.getElementById("postCustomName") ? document.getElementById("postCustomName").value.trim() : "";
    let isAd = document.getElementById("postIsAd") ? document.getElementById("postIsAd").checked : false;

    if(!txt && !imgUrl && !imgFile && !audio) { window.showNeonToast("O post está vazio!"); return; }

       let postarNoBanco = function(n, a, idAutor, finalImg) {
        let payload = {
            autor: n, autorId: idAutor, avatar: a, texto: txt, imagem: finalImg || "", audio: audio, timestamp: Date.now(), isAd: (window.isMaster && isAd), likes: 0, reposts: 0, likers: {}, reposters: {}, comentarios: {}
        };

        let newPostRef = window.db.ref('tokyoRpg/posts').push(); // Cria a ref primeiro
        newPostRef.set(payload).then(() => {
            // DISPARAR MENÇÃO DO NOVO POST AQUI
            window.dispatchMentions({
                from: idAutor !== "MESTRE" ? window.jogadorAtual : "SISTEMA",
                contextType: "gpost",
                contextId: newPostRef.key,
                text: txt
            });

            if(document.getElementById("postText")) document.getElementById("postText").value = "";
            if(document.getElementById("postImgUrl")) document.getElementById("postImgUrl").value = "";
            if(document.getElementById("postAudioUrl")) document.getElementById("postAudioUrl").value = "";
            if(document.getElementById("postImgFile")) document.getElementById("postImgFile").value = "";
            if(document.getElementById("postCustomAvatar")) document.getElementById("postCustomAvatar").value = "";
            if(document.getElementById("postCustomName")) document.getElementById("postCustomName").value = "";
            if(document.getElementById("postIsAd")) document.getElementById("postIsAd").checked = false;

            let bx = document.getElementById("postCreatorBox");
            if(bx) bx.style.display = "none";
            window.showNeonToast("Publicado!");
        });
    };

    if(window.isMaster) {
        let nome = cName || "SISTEMA"; let avatar = cAv || "https://api.dicebear.com/9.x/bottts/svg?seed=Master";
        if(imgFile) { let r = new FileReader(); r.onload = (e) => postarNoBanco(nome, avatar, "MESTRE", e.target.result); r.readAsDataURL(imgFile); } else { postarNoBanco(nome, avatar, "MESTRE", imgUrl); }
        return;
    }

    let u = window.usersGlobais?.[window.jogadorAtual];
    let nome = u?.nome || window.jogadorAtual; let avatar = u?.avatarUrl || u?.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${nome}`;

    if(imgFile) { let r = new FileReader(); r.onload = (e) => postarNoBanco(nome, avatar, window.jogadorAtual, e.target.result); r.readAsDataURL(imgFile); } else { postarNoBanco(nome, avatar, window.jogadorAtual, imgUrl); }
};

window.curtirPost = function(id) {
    if(!window.jogadorAtual) return;
    let ref = window.db.ref(`tokyoRpg/posts/${id}`);
    ref.once('value').then(snap => {
        let p = snap.val(); if(!p) return;
        let likers = p.likers || {};
        if(likers[window.jogadorAtual]) { delete likers[window.jogadorAtual]; ref.update({ likes: Math.max(0, (p.likes||1) - 1), likers }); } 
        else { likers[window.jogadorAtual] = true; ref.update({ likes: (p.likes||0) + 1, likers }); }
    });
};

window.repostarPost = function(id) {
    if(!window.jogadorAtual) return;
    let ref = window.db.ref(`tokyoRpg/posts/${id}`);
    ref.once('value').then(snap => {
        let p = snap.val(); if(!p) return;
        let rps = p.reposters || {};
        if(!rps[window.jogadorAtual]) { rps[window.jogadorAtual] = true; ref.update({ reposts: (p.reposts||0) + 1, reposters: rps }); window.showNeonToast("Compartilhado!"); }
    });
};

window.postObserver = window.postObserver || new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        let audioEl = entry.target.querySelector('audio.post-audio');
        if(!audioEl) return;
        if(entry.isIntersecting) { if(!window.postAudioMuted) { audioEl.currentTime = 0; audioEl.play().catch(()=>{}); } } else { audioEl.pause(); }
    });
}, { threshold: 0.6 });

window.switchIGambleTab = function(tabId, btnEl) {
  document.querySelectorAll(".igamble-tab-btn").forEach(b => b.classList.remove("active"));
  if(btnEl) btnEl.classList.add("active");

      window.marcarNotificacoesComoLidas(tabId);

  document.querySelectorAll(".igamble-view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById("igamble-view-" + tabId);
  if(target) target.classList.add("active");

  if(tabId === "chat") { setTimeout(() => { const cb = document.getElementById("chatMessages"); if(cb) cb.scrollTop = cb.scrollHeight; }, 50); }

  if(tabId === "embates") {
    const mPanel = document.getElementById("masterEmbatePanel");
    if(mPanel) mPanel.style.display = window.isMaster ? "block" : "none";

    if(window.isMaster && window.db) {
      window.db.ref("tokyoRpg/users").once("value").then(snap => {
        const dl = document.getElementById("listaJogadoresDatalist");
        if(!dl) return; dl.innerHTML = "";
        const data = snap.val(); if(!data) return;
        Object.keys(data).forEach(k => { const u = data[k] || {}; const nome = u.nome || k; const av = u.avatarUrl || u.avatar || ""; dl.innerHTML += `<option value="${nome}" data-av="${av}"></option>`; });
      });
    }
  }

  if(tabId === "posts") {
    const isAdmin = !!window.isMaster;
    const cn = document.getElementById("postCustomName"); const ca = document.getElementById("postCustomAvatar"); const la = document.getElementById("lblAd");
    if(cn) cn.style.display = isAdmin ? "block" : "none"; if(ca) ca.style.display = isAdmin ? "block" : "none"; if(la) la.style.display = isAdmin ? "inline-block" : "none";

    if(!window._postsListenerStarted && typeof window.iniciarListenersIgamble === "function") { window._postsListenerStarted = true; window.iniciarListenersIgamble(); }
  }
};

window._igambleListenersStarted = window._igambleListenersStarted || false;

window.canDeletePost = function(post) {
  if (!post) return false; if (window.isMaster) return true; if (!window.jogadorAtual) return false;
  const myUser = window.usersGlobais?.[window.jogadorAtual] || {}; const myName = (myUser.nome || window.jogadorAtual || "").toString();
  if (post.autorId && post.autorId === window.jogadorAtual) return true;
  const autor = (post.autor || "").toString();
  if (autor && (autor === myName || autor === window.jogadorAtual)) return true;
  return false;
};

window.excluirPost = function(postId) {
  if (!window.db || !postId) return;
  window.db.ref(`tokyoRpg/posts/${postId}`).remove().then(() => { window.showNeonToast("Post excluído!"); }).catch((e) => { window.showNeonToast("Falha ao excluir."); });
};

window.criarEmbate = function() {
  if (!window.isMaster) return; if (!window.db) return;
  const payload = { f1: (document.getElementById("emF1")?.value || "Lutador 1").trim(), f2: (document.getElementById("emF2")?.value || "Lutador 2").trim(), img1: (document.getElementById("emImg1")?.value || "https://api.dicebear.com/9.x/adventurer/svg?seed=Lutador1").trim(), img2: (document.getElementById("emImg2")?.value || "https://api.dicebear.com/9.x/adventurer/svg?seed=Lutador2").trim(), local: (document.getElementById("emLocal")?.value || "Arena Desconhecida").trim(), desc: (document.getElementById("emDesc")?.value || "Embate Oficial").trim(), premio: parseInt(document.getElementById("emPremio")?.value || "0", 10) || 0, status: "ativo", timestamp: Date.now() };
  window.db.ref("tokyoRpg/embates").push(payload).then(() => { window.showNeonToast("Embate criado!"); ["emF1","emF2","emImg1","emImg2","emDesc","emPremio"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; }); });
};

window.finalizarEmbate = function(id, f1, f2) {
  if(!window.isMaster || !window.db) return;
  const winOp = prompt(`Vencedor?\n1: ${f1}\n2: ${f2}\n3: Empate`); if(!winOp) return;
  let vencedorNome = "Empate / Sem Resultado"; if(winOp === "1") vencedorNome = f1; if(winOp === "2") vencedorNome = f2;
  const urlFalencia = prompt("URL da imagem/gif da morte do perdedor (ou deixe vazio):") || "";
  window.db.ref(`tokyoRpg/embates/${id}`).update({ status: "finalizado", vencedor: vencedorNome, urlMorte: urlFalencia }).then(() => window.showNeonToast("Embate finalizado!"));
};

window.iniciarListenersIgamble = function() {
  if (!window.db) return; if (window._igambleListenersStarted) return; window._igambleListenersStarted = true;

  window.db.ref("tokyoRpg/posts").on("value", snap => {
    const feed = document.getElementById("igamblePostsFeed"); if(!feed) return; feed.innerHTML = "";
    const data = snap.val(); if(!data) return;
    const postsArray = Object.keys(data).map(id => ({ id, ...data[id] })).sort((a,b) => (b.timestamp||0) - (a.timestamp||0));

    postsArray.forEach(p => {
      const d = new Date(p.timestamp || Date.now()); const timeStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} - ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      const hasBg = p.imagem ? `<img src="${p.imagem}" class="post-media-bg">` : ""; const hasImg = p.imagem ? `<img src="${p.imagem}" class="post-media">` : ""; const hasAudio = p.audio ? `<audio class="post-audio" loop src="${p.audio}"></audio>` : "";
      const iLiked = (p.likers && window.jogadorAtual && p.likers[window.jogadorAtual]) ? "liked" : ""; const iReposted = (p.reposters && window.jogadorAtual && p.reposters[window.jogadorAtual]) ? "reposted" : ""; const numComents = p.comentarios ? Object.keys(p.comentarios).length : 0;
      const delBtn = window.canDeletePost(p) ? `<button class="post-del-btn" onclick="window.excluirPost('${p.id}')">EXCLUIR</button>` : ""; const adTag = p.isAd ? `<span class="post-ad-tag">⭐ PATROCINADO</span>` : "";

      // NOVIDADE: Avatar Wrapper com o Botão Follow acoplado
      let followBtnHtml = typeof window.getFollowButtonHtml === "function" ? window.getFollowButtonHtml(p.autor) : "";

      feed.innerHTML += `<div class="post-card" id="post-${p.id}">${hasBg}${hasImg}${hasAudio}<div class="post-overlay"><div class="post-header"><div class="post-header-left"><div class="avatar-wrapper"><img src="${p.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Anon"}" class="post-avatar">${followBtnHtml}</div><div><div class="post-name">${p.autor || "---"} ${adTag}</div><div style="font-size:10px; color:#aaa;">${timeStr}</div></div></div>${delBtn}</div><div class="post-body"><div class="post-caption">${p.texto || ""}</div><div class="post-sidebar"><button class="post-btn-vert ${iLiked}" onclick="window.curtirPost('${p.id}')">❤ <span>${p.likes||0}</span></button><button class="post-btn-vert" onclick="window.abrirComentarios('${p.id}')">💬 <span>${numComents}</span></button><button class="post-btn-vert ${iReposted}" onclick="window.repostarPost('${p.id}')">🔄 <span>${p.reposts||0}</span></button></div></div></div></div>`;
    });
    try { if (window.postObserver) { document.querySelectorAll(".post-card").forEach(card => { window.postObserver.unobserve(card); window.postObserver.observe(card); }); } } catch(e) {}
  });

  window.db.ref("tokyoRpg/embates").on("value", snap => {
    const lista = document.getElementById("listaEmbates"); if(!lista) return; lista.innerHTML = "";
    const data = snap.val(); if(!data) return;
    const embatesArray = Object.keys(data).map(id => ({ id, ...data[id] })).sort((a,b) => (b.timestamp||0) - (a.timestamp||0));

    embatesArray.forEach(e => {
      let statusHtml = "", masterBtn = "", winnerHtml = "";
      if(e.status === "ativo" || !e.status) {
        statusHtml = `<div style="position:absolute; top:10px; left:10px; font-size:10px; color:#0f0; display:flex; align-items:center; gap:5px;"><div class="status-dot blink" style="background:#0f0;"></div> ATIVO</div>`;
        if(window.isMaster) { masterBtn = `<div style="margin-top:15px; border-top:1px dashed #333; padding-top:10px; display:flex; gap:10px;"><button class="action-btn" style="flex:1; border-color:#0f0; color:#0f0; font-size:10px;" onclick="window.finalizarEmbate('${e.id}', '${(e.f1||"").replace(/'/g,"\\'")}', '${(e.f2||"").replace(/'/g,"\\'")}')">Coroar Vencedor</button><button class="action-btn" style="border-color:#f00; color:#f00; font-size:10px;" onclick="window.db.ref('tokyoRpg/embates/${e.id}').remove()">Excluir</button></div>`; }
      } else {
        statusHtml = `<div style="position:absolute; top:10px; left:10px; font-size:10px; color:#f00; display:flex; align-items:center; gap:5px;"><div class="status-dot" style="background:#f00;"></div> FINALIZADO</div>`;
        const deadImgHtml = e.urlMorte ? `<img src="${e.urlMorte}" style="width:100%; max-height:200px; object-fit:cover; border:1px solid #f00; border-radius:8px; margin-top:10px;">` : '';
        winnerHtml = `<div style="margin-top:15px; background:#110000; padding:15px; border:1px solid var(--accent-gold); border-radius:8px;"><h2 style="color:var(--accent-gold); margin-bottom:5px;">🏆 VENCEDOR: ${e.vencedor || "---"}</h2>${(e.premio||0) > 0 ? `<p style="color:#0f0; font-weight:bold; font-size:12px;">Prêmio Declarado: ${e.premio} ¥</p>` : ''}${deadImgHtml}</div>`;
        if(window.isMaster) masterBtn = `<button class="action-btn" style="width:100%; border-color:#f00; color:#f00; font-size:10px; margin-top:10px;" onclick="window.db.ref('tokyoRpg/embates/${e.id}').remove()">Apagar Histórico</button>`;
      }
      lista.innerHTML += `<div class="embate-card">${statusHtml}<h3 class="neon-red" style="margin-top:15px;">📍 ${e.local || "Arena Desconhecida"}</h3><div class="embate-desc">"${e.desc || ""}"</div><div class="embate-vs-container"><div class="embate-fighter"><img src="${e.img1 || "https://api.dicebear.com/9.x/adventurer/svg?seed=Lutador1"}" class="embate-fighter-avatar"><span class="embate-fighter-name">${e.f1 || "Lutador 1"}</span></div><div class="embate-vs-text">VS</div><div class="embate-fighter"><img src="${e.img2 || "https://api.dicebear.com/9.x/adventurer/svg?seed=Lutador2"}" class="embate-fighter-avatar" style="border-color:#00e5ff; box-shadow: 0 0 15px rgba(0,229,255,0.2);"><span class="embate-fighter-name" style="color:#00e5ff;">${e.f2 || "Lutador 2"}</span></div></div>${winnerHtml}${masterBtn}</div>`;
    });
  });
};

// =========================================================
// MOTOR DE FOLLOW E SEGUIDORES
// =========================================================
window.getFollowButtonHtml = function(autorName) {
    if (!window.jogadorAtual || autorName === window.jogadorAtual || autorName === "MESTRE" || autorName === "SISTEMA") return "";
    
    let me = window.usersGlobais[window.jogadorAtual] || {};
    let target = window.usersGlobais[autorName] || {};
    
    let iFollow = me.seguindo && me.seguindo[autorName];
    let theyFollow = target.seguindo && target.seguindo[window.jogadorAtual];
    
    let safeClass = autorName.replace(/[^a-zA-Z0-9]/g, ''); // Limpa nome pra classe

    if (iFollow && theyFollow) {
        return `<div class="follow-badge-btn friends follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">✓✓ Amigos</div>`;
    } else if (iFollow) {
        return `<div class="follow-badge-btn following follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">✓</div>`;
    } else {
        return `<div class="follow-badge-btn follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">+</div>`;
    }
};

window.toggleFollow = function(alvo, event) {
    if (event) event.stopPropagation();
    if (!window.jogadorAtual || alvo === window.jogadorAtual) return;
    
    let me = window.usersGlobais[window.jogadorAtual] || {};
    let target = window.usersGlobais[alvo] || {};
    
    let isFollowing = me.seguindo && me.seguindo[alvo];
    let theyFollow = target.seguindo && target.seguindo[window.jogadorAtual];
    
    let updates = {};
    if (isFollowing) {
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = null;
        updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = null;
        window.showNeonToast(`Você deixou de seguir ${alvo}`);
    } else {
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = true;
        updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = true;
        if(typeof window.enviarNotificacao === "function") {
            window.enviarNotificacao(alvo, 'mention_post', window.jogadorAtual, "começou a seguir você!");
        }
        window.showNeonToast(`Você agora segue ${alvo}`);
    }
    
    window.db.ref().update(updates);
    
    // Troca o botão na mesma hora sem lagar a tela
    let safeClass = alvo.replace(/[^a-zA-Z0-9]/g, '');
    document.querySelectorAll(`.follow-btn-${safeClass}`).forEach(btn => {
        if (isFollowing) { 
            btn.className = `follow-badge-btn follow-btn-${safeClass}`;
            btn.innerHTML = "+";
        } else { 
            if(theyFollow) {
                btn.className = `follow-badge-btn friends follow-btn-${safeClass}`;
                btn.innerHTML = "✓✓ Amigos";
            } else {
                btn.className = `follow-badge-btn following follow-btn-${safeClass}`;
                btn.innerHTML = "✓";
            }
        }
    });
};

window.enviarMsgGamble = function() {
  try {
    if (!window.db) { window.showNeonToast("Sem conexão com o servidor."); return; }
    if (!window.jogadorAtual) { window.showNeonToast("Faça login!"); return; }
    const inp = document.getElementById("chatInputMsg");
    if (!inp) { window.showNeonToast("Input do chat não encontrado."); return; }

    const txt = (inp.value || "").trim(); 
    if (!txt) return;

    // payload com reply (WhatsApp)
    const payload = { 
      nome: window.jogadorAtual, 
      texto: txt, 
      imagemUrl: null, 
      data: new Date().toLocaleTimeString(), 
      ts: Date.now(),
      reply: window._replyDraft || null
    };

    window.db.ref("tokyoRpg/chat").push(payload);

    // dispara inbox de menções (contexto gchat)
    window.dispatchMentions({ 
      from: window.jogadorAtual, 
      contextType: "gchat", 
      contextId: "", 
      text: txt 
    });

    inp.value = "";
    window.cancelReply();
  } catch (e) { window.showNeonToast("Erro ao enviar."); }
};
window.prepararEnvioMensagem = function() { return window.enviarMsgGamble(); };

// =========================================================
// PATCH DEFINITIVO: ÁUDIO TIKTOK SEM AUTO-MUTE
// =========================================================

// 1. Inicia liberado
window.postAudioMuted = false;

// Garante que o botão na tela também inicie verde e liberado
setTimeout(() => {
    let btnMute = document.getElementById("btnToggleMute");
    if(btnMute) {
        btnMute.innerText = "🔊 Áudio Liberado";
        btnMute.style.borderColor = "#0f0";
        btnMute.style.color = "#0f0";
    }
}, 500);

// 2. Recriando o Olheiro (Observer)
if(window.postObserver) window.postObserver.disconnect();

window.postObserver = new IntersectionObserver((entries) => {
    // Confere se a aba de Posts está ativada na tela
    let postsView = document.getElementById("igamble-view-posts");
    let isActiveTab = postsView && postsView.classList.contains("active");

    entries.forEach(entry => {
        let audioEl = entry.target.querySelector('audio.post-audio');
        if(!audioEl) return;

        // Só tenta tocar se o post estiver na tela, o áudio liberado, E a aba de posts estiver aberta!
        if(entry.isIntersecting && isActiveTab) {
            if(!window.postAudioMuted) {
                audioEl.volume = 1.0;
                audioEl.play().catch(e => {
                    console.log("Aguardando interação do usuário...");
                    // REMOVIDO O AUTO-MUTE AQUI! Agora ele insiste em tocar.
                });
            }
        } else {
            // Se saiu da tela, pausa e reseta
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    });
}, { threshold: 0.3 });

// 3. Forçar o Play no clique da aba
var fixTabSwitchIgamble = window.switchIGambleTab;
window.switchIGambleTab = function(tabId, btnEl) {
    if(fixTabSwitchIgamble) fixTabSwitchIgamble(tabId, btnEl);
    
    if(tabId === 'posts') {
        setTimeout(() => {
            let feed = document.getElementById("igamblePostsFeed");
            if(!feed || window.postAudioMuted) return;
            
            // Acha o post que está visível no momento e força o play
            let cards = feed.querySelectorAll('.post-card');
            cards.forEach(card => {
                let rect = card.getBoundingClientRect();
                // Se o card está na área visível da tela
                if(rect.top >= -200 && rect.top <= (window.innerHeight / 2)) {
                    let a = card.querySelector('audio.post-audio');
                    if(a) {
                        a.volume = 1.0;
                        a.play().catch(()=>{});
                    }
                }
            });
            
            // Re-observa para garantir a rolagem
            cards.forEach(c => {
                window.postObserver.unobserve(c);
                window.postObserver.observe(c);
            });
        }, 100);
    } else {
            // Se saiu da aba, cala todos os áudios
            document.querySelectorAll('audio.post-audio').forEach(a => {
                a.pause();
                a.currentTime = 0;
            });
        }
    }; 
// =========================================================
// IGAMBLE POSTS: LÓGICA UNIFICADA (LIKES, ÁUDIO E DOUBLE TAP)
// =========================================================

// --- 1. CONTROLE DE ÁUDIO E SCROLL ---
window.postAudioMuted = false;
if(window.postObserver) window.postObserver.disconnect();

window.postObserver = new IntersectionObserver((entries) => {
    let postsView = document.getElementById("igamble-view-posts");
    let isActiveTab = postsView && postsView.classList.contains("active");

    entries.forEach(entry => {
        let audioEl = entry.target.querySelector('audio.post-audio');
        if(!audioEl) return;

        // Se o post estiver no meio da tela (60% visível)
        if(entry.isIntersecting && isActiveTab) {
            if(!window.postAudioMuted) {
                // Silencia todos os outros antes de tocar esse
                document.querySelectorAll('audio.post-audio').forEach(a => {
                    if(a !== audioEl) { a.pause(); a.currentTime = 0; }
                });
                audioEl.volume = 1.0;
                audioEl.play().catch(()=>{});
            }
        } else {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    });
}, { threshold: 0.6 });

// --- 2. SISTEMA DE CURTIR (MESTRE VS PLAYER) ---
window.curtirPost = function(id) {
    if (!window.jogadorAtual) return;

    // Se for Mestre (Pelo Serial ou pelo Nome)
    if (window.isMaster || window.jogadorAtual === "MESTRE") {
        let op = prompt("👑 MESTRE: Boost de Popularidade\nQuantas curtidas injetar aos poucos? (Ex: 1000)\n0 para remover.\n[Deixe vazio para like normal]");
        if (op !== null && op.trim() !== "") {
            let target = parseInt(op);
            if (!isNaN(target)) {
                if (target <= 0) {
                    window.db.ref(`tokyoRpg/posts/${id}/boost`).remove();
                    window.showNeonToast("Boost Removido.");
                } else {
                    window.db.ref(`tokyoRpg/posts/${id}/boost`).set({
                        target: target,
                        startTs: Date.now(),
                        duration: 10 * 60 * 60 * 1000 
                    });
                    window.showNeonToast(`🚀 Boost Ativado: ${target} Likes!`);
                }
                return; 
            }
        }
    }

    // Like Normal do Player
    let ref = window.db.ref(`tokyoRpg/posts/${id}`);
    ref.once('value').then(snap => {
        let p = snap.val(); if(!p) return;
        let likers = p.likers || {};
        if(likers[window.jogadorAtual]) {
            delete likers[window.jogadorAtual];
            ref.update({ likes: Math.max(0, (p.likes||1) - 1), likers });
        } else {
            likers[window.jogadorAtual] = true;
            ref.update({ likes: (p.likes||0) + 1, likers });
        }
    });
};

// --- 3. ANIMAÇÕES DE CORAÇÃO E DUPLO CLIQUE ---

// Coração Roxo (O SEU LIKE)
window.spawnPurpleHeart = function(x, y) {
    let heart = document.createElement("div");
    heart.className = "floating-heart-purple";
    heart.innerText = "💜"; // Coração roxo
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);
    setTimeout(() => { if(heart.parentElement) heart.remove(); }, 1000);
};

// Coração Vermelho (Live/Boost do Mestre)
window.spawnFloatingHeart = function(card) {
    let heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerText = "❤";
    let randomX = Math.random() * 100 - 50; 
    heart.style.marginLeft = randomX + "px";
    let scale = 0.7 + Math.random() * 0.5;
    heart.style.fontSize = (45 * scale) + "px";
    card.appendChild(heart);
    setTimeout(() => { if(heart.parentElement) heart.remove(); }, 2500);
};

// DUPLO CLIQUE NA IMAGEM (DOUBLE TAP)
document.addEventListener('dblclick', function(e) {
    // Se o duplo clique for exatamente em um botão, ignora (evita duplo processamento)
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;

    // Detecta se clicou no post
    let card = e.target.closest('.post-card');
    if(card && window.jogadorAtual) {
        // Bloqueio de spam para evitar lag
        if(card.getAttribute('data-liking') === 'true') return;
        card.setAttribute('data-liking', 'true');
        setTimeout(() => card.removeAttribute('data-liking'), 1000); // Libera depois de 1s

        let btn = card.querySelector("button[onclick^='window.curtirPost']");
        if(btn) {
            let match = btn.getAttribute("onclick").match(/'([^']+)'/);
            if(match && match[1]) {
                let postId = match[1];
                let ref = window.db.ref(`tokyoRpg/posts/${postId}`);
                
                ref.once('value').then(snap => {
                    let p = snap.val(); if(!p) return;
                    let likers = p.likers || {};
                    
                    // Só dá like, não tira o like
                    if(!likers[window.jogadorAtual]) { 
                        likers[window.jogadorAtual] = true;
                        ref.update({ likes: (p.likes||0) + 1, likers }).then(() => {
                            window.spawnPurpleHeart(e.clientX, e.clientY);
                            
                            // Atualiza os contadores na tela instantaneamente (sem recarregar do firebase)
                            let heartBtn = card.querySelector('.post-btn-vert');
                            if(heartBtn) {
                                heartBtn.classList.add('liked');
                                let sp = heartBtn.querySelector('span');
                                if(sp) sp.innerText = (p.likes||0) + 1;
                            }
                        });
                    } else {
                        // Se já tinha curtido, só solta os corações roxos pra fazer graça
                        window.spawnPurpleHeart(e.clientX, e.clientY);
                    }
                });
            }
        }
    }
});

// --- 4. MOTOR MATEMÁTICO DOS LIKES FALSOS DO MESTRE ---
window.globalPostsData = {};
window.localDisplayedFakeLikes = window.localDisplayedFakeLikes || {};
window.burstThresholds = window.burstThresholds || {};

window.db.ref("tokyoRpg/posts").on("value", snap => { window.globalPostsData = snap.val() || {}; });

setInterval(() => {
    let feed = document.getElementById("igamblePostsFeed");
    if (!feed) return;
    
    let likeBtns = feed.querySelectorAll("button[onclick^='window.curtirPost']");
    likeBtns.forEach(btn => {
        let match = btn.getAttribute("onclick").match(/'([^']+)'/);
        if (match && match[1]) {
            let postId = match[1];
            let post = window.globalPostsData[postId];
            
            if (post) {
                let realLikes = post.likes || 0;
                let fakeMathLikes = 0;
                
                if (post.boost && post.boost.target > 0) {
                    let elapsed = Date.now() - post.boost.startTs;
                    let progress = elapsed / post.boost.duration;
                    if (progress > 1) progress = 1;
                    if (progress < 0) progress = 0;
                    fakeMathLikes = Math.floor(progress * post.boost.target);
                } else {
                    window.localDisplayedFakeLikes[postId] = 0;
                }
                
                let currentDisplayedFake = window.localDisplayedFakeLikes[postId] || 0;
                
                if (!window.burstThresholds[postId]) {
                    window.burstThresholds[postId] = Math.floor(Math.random() * 5) + 1;
                }
                
                let diff = fakeMathLikes - currentDisplayedFake;
                if (diff >= window.burstThresholds[postId] || (post.boost && Date.now() - post.boost.startTs >= post.boost.duration && diff > 0)) {
                    currentDisplayedFake += diff;
                    window.localDisplayedFakeLikes[postId] = currentDisplayedFake;
                    window.burstThresholds[postId] = Math.floor(Math.random() * 5) + 1;
                }
                
                let totalLikes = realLikes + currentDisplayedFake;
                let span = btn.querySelector("span");
                
                if (span) {
                    let screenVal = parseInt(span.innerText) || 0;
                    if (screenVal !== totalLikes) {
                        if (totalLikes > screenVal) {
                            let card = btn.closest('.post-card');
                            if (card) {
                                let jump = totalLikes - screenVal;
                                let heartsToSpawn = Math.min(jump, 6);
                                for(let i = 0; i < heartsToSpawn; i++) {
                                    setTimeout(() => window.spawnFloatingHeart(card), i * 150);
                                }
                            }
                        }
                        span.innerText = totalLikes;
                        span.style.color = currentDisplayedFake > 0 ? "#ff1a55" : "";
                    }
                }
            }
        }
    });
}, 1000);
    // =========================================================
// SISTEMA DE MENÇÕES (@) EM IMPUTS
// =========================================================
window.mentionState = { active: false, inputEl: null, startPos: 0 };

// =========================================================
// NOVO SISTEMA DE MENÇÕES (TIPO INSTAGRAM)
// =========================================================
// =========================================================

// =========================================================
// SISTEMA DE COMENTÁRIOS DO IGAMBLE POST (INSTA HUD)
// =========================================================
window.currentPostIdForComment = null;

window.abrirComentarios = function(postId) {
    window.currentPostIdForComment = postId;
    let overlay = document.getElementById("commentsOverlay");
    if(overlay) overlay.style.display = "flex";
    window.carregarComentarios(postId);
};

window.fecharComentarios = function() {
    window.currentPostIdForComment = null;
    let overlay = document.getElementById("commentsOverlay");
    if(overlay) overlay.style.display = "none";
    let list = document.getElementById("commentsList");
    if(list) list.innerHTML = ""; // limpa a lista
};

// Fechar se clicar fora do painel no fundo escuro
let overlayEl = document.getElementById('commentsOverlay');
if(overlayEl) {
    overlayEl.addEventListener('click', function(e) {
        if (e.target === this) { window.fecharComentarios(); }
    });
}

window.carregarComentarios = function(postId) {
    let list = document.getElementById("commentsList");
    if(!list) return;
    list.innerHTML = "<div style='text-align:center; color:#aaa; margin-top:20px;'>Carregando...</div>";
    
    window.db.ref(`tokyoRpg/posts/${postId}/comentarios`).on('value', snap => {
        // Se mudou de aba ou fechou, ignora a att
        if(window.currentPostIdForComment !== postId) return; 
        
        let data = snap.val();
        if(!data) { list.innerHTML = "<div style='text-align:center; color:#555; margin-top:20px;'>Seja o primeiro a comentar!</div>"; return; }
        
        let html = "";
        let sortedKeys = Object.keys(data).sort((a,b) => data[a].timestamp - data[b].timestamp); // Mais antigos primeiro

        sortedKeys.forEach(k => {
            let c = data[k];
            let u = window.usersGlobais[c.autor] || {};
            let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${c.autor}`;
            let nome = u.nome || c.autor;
            
            // Transformar @menções em azulzinho e bold pra ficar mais bonito
            let textoBonito = (c.texto||"").replace(/@(\w+)/g, '<span style="color:var(--accent-blue); font-weight:bold;">@$1</span>');

            html += `
                <div class="comment-item">
                    <img src="${avatar}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-name">${nome}</div>
                        <div>${textoBonito}</div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
        // Rola pro final pra ver o último comentário
        setTimeout(() => { list.scrollTop = list.scrollHeight; }, 50);
    });
};

window.enviarComentario = function() {
    if(!window.currentPostIdForComment || !window.jogadorAtual) return;
    let inp = document.getElementById("commentInput");
    let txt = inp.value.trim();
    if(!txt) return;
    
    window.db.ref(`tokyoRpg/posts/${window.currentPostIdForComment}/comentarios`).push({
        autor: window.jogadorAtual,
        texto: txt,
        timestamp: Date.now()
    }).then(() => {
        inp.value = ""; 
        window.closeMentionDropdown();

        // ADICIONE ESTA PARTE PARA DISPARAR A MENÇÃO NO COMENTÁRIO
        window.dispatchMentions({ 
            from: window.jogadorAtual, 
            contextType: "gpost", 
            contextId: window.currentPostIdForComment, 
            text: txt 
        });
    });
};
// =========================================================
// MENU DE MENÇÃO FLUTUANTE 
// =========================================================
window.handleMention = function(e, inputEl) {
    let val = inputEl.value;
    let pos = inputEl.selectionStart;
    let textoAntes = val.substring(0, pos);
    
    // Pega a última palavra digitada
    let match = textoAntes.match(/(?:^|\s)@([^ \n]*)$/);

    if (match) {
        let query = match[1].toLowerCase();
        window.mostrarMenuMencao(inputEl, query);
    } else {
        window.esconderMenuMencao();
    }
};

window.mostrarMenuMencao = function(inputEl, query) {
    let box = document.getElementById("hudMencaoRapida");
    if (!box) {
        box = document.createElement("div");
        box.id = "hudMencaoRapida";
        // Estilo HUD flutuante fixa na tela
        box.style.cssText = "position:fixed; bottom:120px; left:50%; transform:translateX(-50%); width:300px; max-height:200px; background:rgba(0,0,0,0.9); border:1px solid #00f0ff; border-radius:10px; z-index:999999; overflow-y:auto; backdrop-filter:blur(5px); display:none;";
        document.body.appendChild(box);
    }

    let users = Object.values(window.usersGlobais || {});
    let filtrados = users.filter(u => u && u.nome && u.nome.toLowerCase().includes(query)).slice(0, 10);

    if (filtrados.length === 0) {
        box.style.display = "none";
        return;
    }

    box.innerHTML = filtrados.map(u => {
        let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${u.nome}`;
        return `
        <div style="display:flex; align-items:center; padding:10px; cursor:pointer; border-bottom:1px solid #333;"
             onclick="window.escolherMencao('${inputEl.id}', '${u.nome}')"
             onmouseover="this.style.background='#222'" onmouseout="this.style.background='transparent'">
            <img src="${avatar}" style="width:30px; height:30px; border-radius:50%; margin-right:10px;">
            <span style="color:#00f0ff; font-weight:bold;">${u.nome}</span>
        </div>`;
    }).join("");

    box.style.display = "block";
};

window.escolherMencao = function(inputId, nomeAlvo) {
    let inputEl = document.getElementById(inputId);
    if (!inputEl) return;

    let val = inputEl.value;
    let pos = inputEl.selectionStart;
    let textoAntes = val.substring(0, pos);
    let textoDepois = val.substring(pos);

    // Substitui os espaços por underline no nome pra menção não quebrar
    let nomeFormatado = nomeAlvo.replace(/\s+/g, '_');

    // Troca o @... pelo nome com underline
    let novoTexto = textoAntes.replace(/(^|\s)@([^ \n]*)$/, `$1@${nomeFormatado} `);
    inputEl.value = novoTexto + textoDepois;
    inputEl.focus();

    window.esconderMenuMencao();
};

document.addEventListener("click", function(e) {
    if (!e.target.closest("#hudMencaoRapida") && !e.target.closest("input") && !e.target.closest("textarea")) {
        window.esconderMenuMencao();
    }
});

// Clicar em qualquer lugar fora, fecha o menuzinho
document.addEventListener('click', function(e) {
    if (!e.target.closest('#mentionMasterBox') && !e.target.closest('input') && !e.target.closest('textarea')) {
        window.fecharNovaMencao();
    }
});
// =========================================================

    // =========================================================
// SISTEMA DE NOTIFICAÇÕES (ONLINE E OFFLINE)
// =========================================================

// Envia uma notificação para um usuário específico
window.enviarNotificacao = function(alvo, tipo, remetente, texto, linkId = null) {
    if (!window.db || !alvo || alvo === remetente) return;
    
    window.db.ref(`tokyoRpg/notifications/${alvo}`).push({
        tipo: tipo, // 'mention_post', 'mention_comment', 'chat_reply'
        remetente: remetente,
        texto: texto,
        linkId: linkId,
        lida: false,
        timestamp: Date.now()
    });
};

window.iniciarEscutaNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    
    window.db.ref(`tokyoRpg/notifications/${window.jogadorAtual}`).on("value", snap => {
        let notificacoes = snap.val() || {};
        
        let countChat = 0;
        let countPosts = 0;
        let countEmbate = 0;
        
        Object.keys(notificacoes).forEach(key => {
            let notif = notificacoes[key];
            if (!notif.lida) {
                // Classifica a bolinha pro aplicativo certo
                if(notif.tipo.includes('chat')) countChat++;
                else if(notif.tipo.includes('post') || notif.tipo.includes('comment')) countPosts++;
                else if(notif.tipo.includes('embate')) countEmbate++;

                if (Date.now() - notif.timestamp < 10000 || !window.notificacoesAntigasExibidas) {
                    window.showNeonToast(`🔔 ${notif.remetente} ${notif.texto}`);
                }
            }
        });
        window.notificacoesAntigasExibidas = true;
        
        let total = countChat + countPosts + countEmbate;
        window.atualizarBadgeHTML('badge-igamble-main', total);
        window.atualizarBadgeHTML('badge-chat', countChat);
        window.atualizarBadgeHTML('badge-posts', countPosts);
        window.atualizarBadgeHTML('badge-embates', countEmbate);
    });
};

window.atualizarBadgeHTML = function(id, count) {
    let badge = document.getElementById(id);
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
};

window.marcarNotificacoesComoLidas = function(tipoFiltro) {
    if (!window.jogadorAtual || !window.db) return;
    window.db.ref(`tokyoRpg/notifications/${window.jogadorAtual}`).once("value", snap => {
        let notificacoes = snap.val() || {};
        let updates = {};
        Object.keys(notificacoes).forEach(key => {
            let notif = notificacoes[key];
            if (!notif.lida && notif.tipo.includes(tipoFiltro)) {
                updates[`${key}/lida`] = true; // Marca como visualizado
            }
        });
        if(Object.keys(updates).length > 0) {
            window.db.ref(`tokyoRpg/notifications/${window.jogadorAtual}`).update(updates);
        }
    });
};

// INTERCEPTAMOS O CLIQUE NA ABA PARA SUMIR COM A BOLINHA
var funcTrocAbaOriginal = window.switchIGambleTab;
window.switchIGambleTab = function(tabId, btnEl) {
    if(funcTrocAbaOriginal) funcTrocAbaOriginal(tabId, btnEl);
    
    if(tabId === 'chat') window.marcarNotificacoesComoLidas('chat');
    if(tabId === 'posts') window.marcarNotificacoesComoLidas('post');
    if(tabId === 'embates') window.marcarNotificacoesComoLidas('embate');
};


window.atualizarBadgeNotificacoes = function(qtd) {
    let badge = document.getElementById("notificacoesBadge");
    if (!badge) {
        // Criar o badge dinamicamente se não existir no HTML
        let btnChat = document.querySelector(".igamble-tab-btn"); // Exemplo de onde colocar
        if(btnChat) {
            badge = document.createElement("span");
            badge.id = "notificacoesBadge";
            badge.style.cssText = "background:red; color:white; border-radius:50%; padding:2px 6px; font-size:10px; margin-left:5px;";
            btnChat.appendChild(badge);
        }
    }
    
    if (badge) {
        badge.innerText = qtd;
        badge.style.display = qtd > 0 ? "inline-block" : "none";
    }
};
    window.processarMencoes = function(texto, autor, tipoContexto, contextoId) {
    // Regex para pegar tudo que começa com @
    let regex = /@(\w+)/g;
    let matches = [...texto.matchAll(regex)];
    
    matches.forEach(match => {
        let mencionado = match[1];
        // Aqui você pode adicionar a lógica para validar se a pessoa está nos comentários, é o dono, etc.
        // Por enquanto, notifica qualquer usuário real do banco
        if (window.usersGlobais && window.usersGlobais[mencionado]) {
            let msg = tipoContexto === 'post' ? "mencionou você em um post" : "mencionou você em um comentário";
            window.enviarNotificacao(mencionado, 'mention_' + tipoContexto, autor, msg, contextoId);
        }
    });
};
    window.mensagemEmResposta = null; // Armazena a mensagem que está sendo respondida

window.responderMensagem = function(nome, texto) {
    window.mensagemEmResposta = { nome, texto };
    document.getElementById("replyToName").innerText = nome;
    document.getElementById("replyToText").innerText = texto;
    document.getElementById("chatReplyPreview").style.display = "block";
    document.getElementById("chatInputMsg").focus();
};

window.cancelarResposta = function() {
    window.mensagemEmResposta = null;
    document.getElementById("chatReplyPreview").style.display = "none";
};

// Modifique a função enviarMsgGamble para incluir os dados da resposta
window.enviarMsgGamble = function() {
    try {
        if (!window.db) return;
        if (!window.jogadorAtual) return;
        const inp = document.getElementById("chatInputMsg");
        const txt = (inp.value || "").trim(); 
        if (!txt) return;

        let msgData = { 
            nome: window.jogadorAtual, 
            texto: txt, 
            data: new Date().toLocaleTimeString(), 
            ts: Date.now() 
        };

        // Adiciona dados do reply se existir
        if (window.mensagemEmResposta) {
            msgData.replyTo = window.mensagemEmResposta.nome;
            msgData.replyText = window.mensagemEmResposta.texto;
            
            // Notifica o usuário que foi respondido
            window.enviarNotificacao(window.mensagemEmResposta.nome, 'chat_reply', window.jogadorAtual, "respondeu sua mensagem no chat");
        }

        window.db.ref("tokyoRpg/chat").push(msgData);
        
        inp.value = "";
        window.cancelarResposta(); // Limpa o estado
    } catch (e) { console.error("Erro ao enviar.", e); }
};
    // ==========================================
// SISTEMA DE NOTIFICAÇÕES (ONLINE E LOGIN)
// ==========================================
window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;

    let notifRef = window.db.ref(`tokyoRpg/notificacoes/${window.jogadorAtual}`);
    
    // Escuta novas notificações caindo no banco de dados
    notifRef.on("child_added", snap => {
        let n = snap.val();
        let key = snap.key;

        // Se a notificação for nova (ainda não foi lida)
        if (!n.lida) {
            // Exibe o popup na tela na hora (estilo Instagram)
            window.showNeonToast(`🔔 @${n.remetente}: ${n.mensagem}`);
            
            // Toca um sonzinho rápido se você quiser (opcional)
            let audio = new Audio("https://actions.google.com/sounds/v1/ui/beep_short.ogg");
            audio.volume = 0.5;
            audio.play().catch(()=>{});

            // Marca como lida para não aparecer de novo quando ele relogar
            window.db.ref(`tokyoRpg/notificacoes/${window.jogadorAtual}/${key}`).update({ lida: true });
        }
    });
};

// Dispara uma notificação para um jogador
window.enviarNotificacaoHUD = function(alvo, remetente, mensagem) {
    if (!window.db || !alvo || alvo === remetente) return;
    
    window.db.ref(`tokyoRpg/notificacoes/${alvo}`).push({
        remetente: remetente,
        mensagem: mensagem,
        lida: false,
        timestamp: Date.now()
    });
};

// Engatilhar o escutador de notificações assim que o cara fizer login
// (Procure no seu código onde fica o window.fazerLogin e adicione window.escutarNotificacoes() lá dentro, ou deixe solto para testar agora)
setInterval(() => {
    if (window.jogadorAtual && !window.notifIniciada) {
        window.notifIniciada = true;
        window.escutarNotificacoes();
    }
}, 2000);
   // =========================================================
// SISTEMA DE MENÇÕES (@) EM IMPUTS
// =========================================================
window.mentionState = { active: false, inputEl: null, startPos: 0 };

window.handleMention = function(e, inputEl) {
    let val = inputEl.value;
    let cursorPos = inputEl.selectionStart;

    // Acha se a última palavra digitada começa com @
    let textBeforeCursor = val.substring(0, cursorPos);
    let atIndex = textBeforeCursor.lastIndexOf('@');

    // Se achou um '@' e ele for o início da string ou tiver um espaço antes
    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
        let query = textBeforeCursor.substring(atIndex + 1);
        
        // Se ainda não deu espaço depois do @, ativa a busca
        if (!query.includes(' ') && !query.includes('\n')) {
            window.mentionState = { active: true, inputEl: inputEl, startPos: atIndex, query: query };
            window.showMentionDropdown(inputEl, query);
            return;
        }
    }
    window.closeMentionDropdown();
};

window.showMentionDropdown = function(inputEl, query) {
    let drop = document.getElementById("mentionDropdown");
    if (!drop) return;
    
    // Posiciona em cima do input atual
    let rect = inputEl.getBoundingClientRect();
    drop.style.left = rect.left + "px";
    drop.style.top = (rect.top - 160) + "px"; // 160px pra cima
    drop.style.display = "block";

    let users = Object.values(window.usersGlobais || {});
    // Filtra quem bate com o que foi digitado
    let filtered = users.filter(u => u.nome && u.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    if (filtered.length === 0) { drop.style.display = "none"; return; }

    drop.innerHTML = filtered.map(u => {
        let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${u.nome}`;
        return `
        <div class="mention-item" onclick="window.selectMention('${u.nome}')">
            <img src="${av}" class="mention-avatar">
            <span>${u.nome}</span>
        </div>`;
    }).join('');
};

window.selectMention = function(nome) {
  const s = window._mentionRuntime;
  if(!s.active || !s.inputEl) return;

  const inputEl = s.inputEl;
  const val = inputEl.value || "";
  const cursorPos = inputEl.selectionStart || val.length;

  const before = val.substring(0, s.startPos);
  const after = val.substring(cursorPos);

  // MÁGICA AQUI: Troca espaços por _ para o NOME COMPOSTO não quebrar
  const nomeLimpo = nome.replace(/ /g, "_");

  inputEl.value = before + "@" + nomeLimpo + " " + after;
  inputEl.focus();
  window.closeMentionDropdown();
};


// =========================================================
// SISTEMA DE COMENTÁRIOS DO IGAMBLE POST (INSTA HUD)
// =========================================================
window.currentPostIdForComment = null;

window.abrirComentarios = function(postId) {
    window.currentPostIdForComment = postId;
    document.getElementById("commentsOverlay").style.display = "flex";
    window.carregarComentarios(postId);
};

window.fecharComentarios = function() {
    window.currentPostIdForComment = null;
    document.getElementById("commentsOverlay").style.display = "none";
    document.getElementById("commentsList").innerHTML = ""; // limpa a lista
};

// Fechar se clicar fora do painel no fundo escuro
document.getElementById('commentsOverlay').addEventListener('click', function(e) {
    if (e.target === this) { window.fecharComentarios(); }
});

window.carregarComentarios = function(postId) {
    let list = document.getElementById("commentsList");
    list.innerHTML = "<div style='text-align:center; color:#aaa; margin-top:20px;'>Carregando...</div>";
    
    window.db.ref(`tokyoRpg/posts/${postId}/comentarios`).on('value', snap => {
        // Se mudou de aba ou fechou, ignora a att
        if(window.currentPostIdForComment !== postId) return; 
        
        let data = snap.val();
        if(!data) { list.innerHTML = "<div style='text-align:center; color:#555; margin-top:20px;'>Seja o primeiro a comentar!</div>"; return; }
        
        let html = "";
        let sortedKeys = Object.keys(data).sort((a,b) => data[a].timestamp - data[b].timestamp); // Mais antigos primeiro

        sortedKeys.forEach(k => {
            let c = data[k];
            let u = window.usersGlobais[c.autor] || {};
            let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${c.autor}`;
            let nome = u.nome || c.autor;
            
            // Transformar @menções em azulzinho e bold pra ficar mais bonito (Opcional)
            let textoBonito = (c.texto||"").replace(/@(\w+)/g, '<span style="color:var(--accent-blue); font-weight:bold;">@$1</span>');

            html += `
                <div class="comment-item">
                    <img src="${avatar}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-name">${nome}</div>
                        <div>${textoBonito}</div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
        // Rola pro final pra ver o último comentário
        setTimeout(() => { list.scrollTop = list.scrollHeight; }, 50);
    });
};

window.enviarComentario = function() {
    if(!window.currentPostIdForComment || !window.jogadorAtual) return;
    let inp = document.getElementById("commentInput");
    let txt = inp.value.trim();
    if(!txt) return;
    
    window.db.ref(`tokyoRpg/posts/${window.currentPostIdForComment}/comentarios`).push({
        autor: window.jogadorAtual,
        texto: txt,
        timestamp: Date.now()
    }).then(() => {
        inp.value = ""; // Limpa a caixa de texto
        window.closeMentionDropdown();
    });
}; 

    // =========================================================
// MENÇÕES (@) CONTEXTUAIS + INBOX OFFLINE
// =========================================================
window._mentionRuntime = window._mentionRuntime || {
  active: false,
  inputEl: null,
  startPos: 0,
  query: "",
  context: "gchat",   // "gchat" | "post:<id>"
  lastCandidates: []
};

window.setMentionContext = function(ctx){
  window._mentionRuntime.context = ctx || "gchat";
};

// Descobre candidatos conforme contexto
window.getMentionCandidates = function() {
  const ctx = window._mentionRuntime.context || "gchat";

  // G-CHAT: todos jogadores
  if(ctx === "gchat"){
    return Object.keys(window.usersGlobais || {})
      .filter(n => n && n !== "MESTRE");
  }

  // Post: "post:<id>"
  if(ctx.startsWith("post:")){
    const postId = ctx.split(":")[1];
    const p = (window.globalPostsData && window.globalPostsData[postId]) || null;
    const set = new Set();

    // Você sempre pode se marcar também
    if(window.jogadorAtual) set.add(window.jogadorAtual);

    if(p && p.autor) set.add(p.autor);

    // comentaristas
    if(p && p.comentarios){
      Object.values(p.comentarios).forEach(c => {
        if(c && c.autor) set.add(c.autor);
      });
    }

    // fallback: se não achou nada, deixa pelo menos você
    return Array.from(set).filter(Boolean);
  }

  return [];
};

// Render do dropdown
window.showMentionDropdown = function(inputEl, query) {
  const drop = document.getElementById("mentionDropdown");
  if(!drop) return;

  const rect = inputEl.getBoundingClientRect();
  drop.style.left = rect.left + "px";
  drop.style.top = (rect.top - 170) + "px";
  drop.style.display = "block";

  const candidates = window.getMentionCandidates();
  const filtered = candidates
    .filter(n => n.toLowerCase().includes((query||"").toLowerCase()))
    .slice(0, 8);

  window._mentionRuntime.lastCandidates = filtered;

  if(filtered.length === 0){ drop.style.display = "none"; return; }

  drop.innerHTML = filtered.map(n => {
    const u = (window.usersGlobais && window.usersGlobais[n]) || {};
    const av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
    return `
      <div class="mention-item" onclick="window.selectMention('${n}')">
        <img src="${av}" class="mention-avatar">
        <span>${n}</span>
      </div>`;
  }).join("");
};

window.handleMention = function(e, inputEl) {
  const val = inputEl.value || "";
  const cursorPos = inputEl.selectionStart || 0;
  const beforeCursor = val.substring(0, cursorPos);
  const atIndex = beforeCursor.lastIndexOf("@");

  if(atIndex !== -1 && (atIndex === 0 || beforeCursor[atIndex-1] === " " || beforeCursor[atIndex-1] === "\n")){
    const query = beforeCursor.substring(atIndex + 1);
    if(!query.includes(" ") && !query.includes("\n")){
      window._mentionRuntime.active = true;
      window._mentionRuntime.inputEl = inputEl;
      window._mentionRuntime.startPos = atIndex;
      window._mentionRuntime.query = query;
      window.showMentionDropdown(inputEl, query);
      return;
    }
  }

  window.closeMentionDropdown();
};

window.selectMention = function(nome) {
  const s = window._mentionRuntime;
  if(!s.active || !s.inputEl) return;

  const inputEl = s.inputEl;
  const val = inputEl.value || "";
  const cursorPos = inputEl.selectionStart || val.length;

  const before = val.substring(0, s.startPos);
  const after = val.substring(cursorPos);

  inputEl.value = before + "@" + nome + " " + after;
  inputEl.focus();
  window.closeMentionDropdown();
};

window.closeMentionDropdown = function(){
  window._mentionRuntime.active = false;
  const drop = document.getElementById("mentionDropdown");
  if(drop) drop.style.display = "none";
};

// Extrai @NOMES do texto (somente quem existe na lista candidata do contexto)
window.extractMentionsFromText = function(text, context){
  if(!text) return [];
  // Agora pega letras, números e UNDERLINE "_"
  const raw = (text.match(/@([A-Za-z0-9_À-ÿ]+)/g) || []).map(x => x.slice(1));
  const candidates = (context === "gchat")
    ? Object.keys(window.usersGlobais || {}).filter(n => n && n !== "MESTRE")
    : window.getMentionCandidates();

  const set = new Set();
  raw.forEach(n => {
    // Transforma o _ de volta pra espaço pra achar o usuário no banco
    let nomeBusca = n.replace(/_/g, " ").toLowerCase();
    const match = candidates.find(c => c.toLowerCase() === nomeBusca);
    if(match) set.add(match);
  });
  return Array.from(set);
};
// Envia eventos de menção para inbox do alvo (funciona offline)
window.dispatchMentions = function({ from, contextType, contextId, text }) {
    try {
        if (!window.db || !text) return;
        
        // Procura todas as menções que começam com @
        let matches = text.match(/@([\w_]+)/g);
        if (!matches) return;

        let users = Object.keys(window.usersGlobais || {});
        let mencionados = new Set();

        matches.forEach(m => {
            let nomeMencionadoComUnderline = m.substring(1); // Tira o @
            let nomeMencionadoOriginal = nomeMencionadoComUnderline.replace(/_/g, ' '); // Volta o _ para espaço

            // Encontra o usuário na base
            let usuarioReal = users.find(u => u.toLowerCase() === nomeMencionadoOriginal.toLowerCase());

            if (usuarioReal && usuarioReal !== from) {
                mencionados.add(usuarioReal);
            }
        });

        // Envia a notificação para cada usuário marcado
        mencionados.forEach(alvo => {
            window.db.ref(`tokyoRpg/users/${alvo}/notificacoes`).push({
                from: from,
                contextType: contextType,
                contextId: contextId,
                texto: text,
                lida: false,
                ts: Date.now()
            });

            // NOVIDADE: Manda notificação oficial para gerar a bolinha
            let tipoNotif = contextType === "gchat" ? "mention_chat" : "mention_post";
            window.enviarNotificacao(alvo, tipoNotif, from, "mencionou você", contextId);
        });

    } catch(e) {
        console.log("dispatchMentions error", e);
    }
};
    window._replyDraft = null;

window.startReply = function(toName, text, msgKey){
  window._replyDraft = { toName, text: (text||"").slice(0,160), key: msgKey, ts: Date.now() };

  const box = document.getElementById("replyPreview");
  if(box) box.style.display = "flex";
  const n = document.getElementById("replyToName");
  const t = document.getElementById("replyToText");
  if(n) n.innerText = "Respondendo: " + (toName || "");
  if(t) t.innerText = (text || "");

  const inp = document.getElementById("chatInputMsg");
  if(inp) inp.focus();
};

window.cancelReply = function(){
  window._replyDraft = null;
  const box = document.getElementById("replyPreview");
  if(box) box.style.display = "none";
};
    window._mentionNotifyQueue = [];
window._mentionNotifyShowing = 0;

window.renderMentionNotify = function(item){
  const stack = document.getElementById("mentionNotifyStack");
  if(!stack) return;

  // mantém no máximo 3 na tela
  while(stack.children.length >= 3){
    stack.removeChild(stack.firstChild);
  }

  const from = item.from || "???";
  const u = (window.usersGlobais && window.usersGlobais[from]) || {};
  const av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${from}`;

  const div = document.createElement("div");
  div.className = "mention-notify";
  div.innerHTML = `
    <img src="${av}">
    <div class="mn-texts">
      <div class="mn-title">@${from} te marcou</div>
      <div class="mn-sub">${(item.text||"").replace(/\s+/g,' ').trim()}</div>
    </div>
  `;

  stack.appendChild(div);

  // some sozinho
  setTimeout(() => {
    div.classList.add("out");
    setTimeout(() => { if(div.parentElement) div.remove(); }, 380);
  }, 3200);
};

window.startMentionInboxListener = function(){
  if(!window.db || !window.jogadorAtual) return;

  const ref = window.db.ref(`tokyoRpg/mentions/${window.jogadorAtual}/inbox`).limitToLast(20);

  // 1) pega backlog uma vez
  ref.once("value").then(snap => {
    const data = snap.val() || {};
    const arr = Object.keys(data).map(k => ({ key:k, ...data[k] }))
      .sort((a,b) => (a.ts||0)-(b.ts||0));

    // mostra só as 3 últimas do backlog ao entrar
    arr.slice(-3).forEach(item => window.renderMentionNotify(item));
  });

  // 2) novos em tempo real
  // 2) novos em tempo real
  ref.on("child_added", snap => {
    const item = snap.val();
    if(!item) return;

    // ignora itens muito antigos (pra não duplicar backlog)
    const age = Date.now() - (item.ts||0);
    if(age > 15000) return; // 15s pra trás -> considera backlog

    window.renderMentionNotify(item);
  });
}; // <- Este fecha a function startMentionInboxListener

window.mostrarNotificacaoHUD = function(from, type, text) {
    let stack = document.getElementById("mentionNotifyStack");
    if (!stack) return;

    let u = window.usersGlobais[from] || {};
    let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${from}`;
    let appTitle = type === "gchat" ? "G-Chat" : (type === "gpost" ? "G-Post" : "Arena");

    let div = document.createElement("div");
    div.className = "mention-notify";
    div.innerHTML = `
        <img src="${avatar}">
        <div class="mn-texts">
            <div class="mn-title">${from} marcou você em ${appTitle}</div>
            <div class="mn-sub">${text}</div>
        </div>
    `;
    stack.appendChild(div);

    setTimeout(() => { div.classList.add("out"); setTimeout(() => div.remove(), 400); }, 5000);
};

window.atualizarBadgesHUD = function(chat, post, challenger) {
    let total = chat + post + challenger;

    // Atualiza badge geral do ícone "iGAMBLE" na home (bg.png)
    let btnIgamble = document.querySelector('.app-hitbox[title="iGAMBLE"]');
    if (btnIgamble) {
        let badge = btnIgamble.querySelector('.igamble-main-badge');
        if (!badge && total > 0) {
            badge = document.createElement('div');
            badge.className = 'igamble-main-badge notification-badge';
            btnIgamble.appendChild(badge);
        }
        if (total > 0) { badge.innerText = total; badge.style.display = 'flex'; }
        else if (badge) { badge.style.display = 'none'; }
    }

    // Atualiza sub badges da tela do iGAMBLE (bg2.png)
    let updateSubBadge = (onclickStr, count) => {
        let btn = document.querySelector(`.app-hitbox[onclick*="${onclickStr}"]`);
        if (btn) {
            let badge = btn.querySelector('.sub-badge');
            if (!badge && count > 0) {
                badge = document.createElement('div');
                badge.className = 'sub-badge notification-badge';
                btn.appendChild(badge);
            }
            if (count > 0) { badge.innerText = count; badge.style.display = 'flex'; }
            else if (badge) { badge.style.display = 'none'; }
        }
    };

    updateSubBadge("abrirIgambleApp('chat')", chat);
    updateSubBadge("abrirIgambleApp('posts')", post);
    updateSubBadge("abrirIgambleApp('embates')", challenger);
};

window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    // Conta tudo para as Badges
    notifRef.on('value', snap => {
        let data = snap.val() || {};
        let nGchat = 0, nGpost = 0, nGchallenger = 0;

        Object.values(data).forEach(n => {
            if (!n.lida) {
                if (n.contextType === "gchat") nGchat++;
                if (n.contextType === "gpost") nGpost++;
                if (n.contextType === "embates") nGchallenger++;
            }
        });
        window.atualizarBadgesHUD(nGchat, nGpost, nGchallenger);
    });

    // Puxa apenas as Novas para soltar o Popup Animado (Toast)
    notifRef.limitToLast(1).on('child_added', snap => {
        let n = snap.val();
        if (!n || n.lida) return;
        if (Date.now() - n.ts > 15000) return; // Ignora antigas (15s limite)
        window.mostrarNotificacaoHUD(n.from, n.contextType, n.texto);
    });
};

window.marcarNotificacoesComoLidas = function(tabId) {
    if (!window.jogadorAtual || !window.db) return;
    let cType = tabId === "chat" ? "gchat" : (tabId === "posts" ? "gpost" : "embates");
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    notifRef.once('value', snap => {
        let data = snap.val();
        if(!data) return;
        let updates = {};
        Object.keys(data).forEach(k => {
            if (data[k].contextType === cType && !data[k].lida) updates[`${k}/lida`] = true;
        });
        if (Object.keys(updates).length > 0) notifRef.update(updates);
    });
};
// =========================================================
// CORREÇÃO DEFINITIVA: MENÇÕES, COMENTÁRIOS E NOTIFICAÇÕES
// =========================================================

// 1. Enviar Comentário com gatilho de menção
window.enviarComentario = function() {
    if(!window.currentPostIdForComment || !window.jogadorAtual) return;
    let inp = document.getElementById("commentInput");
    let txt = inp.value.trim();
    if(!txt) return;
    
    window.db.ref(`tokyoRpg/posts/${window.currentPostIdForComment}/comentarios`).push({
        autor: window.jogadorAtual,
        texto: txt,
        timestamp: Date.now()
    }).then(() => {
        inp.value = ""; 
        window.closeMentionDropdown();

        // Dispara notificação da menção!
        if(typeof window.dispatchMentions === "function") {
            window.dispatchMentions({ 
                from: window.jogadorAtual, 
                contextType: "gpost", 
                contextId: window.currentPostIdForComment, 
                text: txt 
            });
        }
    });
};

// 2. Enviar Chat com gatilho de menção
window.enviarMsgGamble = function() {
    try {
        if (!window.db || !window.jogadorAtual) return;
        const inp = document.getElementById("chatInputMsg");
        const txt = (inp.value || "").trim(); 
        if (!txt) return;

        let msgData = { 
            nome: window.jogadorAtual, 
            texto: txt, 
            data: new Date().toLocaleTimeString(), 
            ts: Date.now() 
        };

        if (window.mensagemEmResposta) {
            msgData.replyTo = window.mensagemEmResposta.nome;
            msgData.replyText = window.mensagemEmResposta.texto;
        }

        window.db.ref("tokyoRpg/chat").push(msgData).then(() => {
            // Dispara menções
            if(typeof window.dispatchMentions === "function") {
                window.dispatchMentions({ 
                    from: window.jogadorAtual, 
                    contextType: "gchat", 
                    contextId: "", 
                    text: txt 
                });
            }
        });
        
        inp.value = "";
        if(typeof window.cancelarResposta === "function") window.cancelarResposta();
    } catch (e) { console.error("Erro ao enviar.", e); }
};

// 3. Atualizar Badges (Bolinhas) ligando com as IDs do seu HTML
window.atualizarBadgesHUD = function(chat, post, challenger) {
    let total = chat + post + challenger;

    let badgeMain = document.getElementById('badge-igamble-main');
    if (badgeMain) { badgeMain.innerText = total; badgeMain.style.display = total > 0 ? 'flex' : 'none'; }

    let badgeChat = document.getElementById('badge-chat');
    if (badgeChat) { badgeChat.innerText = chat; badgeChat.style.display = chat > 0 ? 'flex' : 'none'; }

    let badgePosts = document.getElementById('badge-posts');
    if (badgePosts) { badgePosts.innerText = post; badgePosts.style.display = post > 0 ? 'flex' : 'none'; }

    let badgeEmbates = document.getElementById('badge-embates');
    if (badgeEmbates) { badgeEmbates.innerText = challenger; badgeEmbates.style.display = challenger > 0 ? 'flex' : 'none'; }
};

// 4. Escutador de Notificações à prova de falhas
window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    // Conta tudo para as Bolinhas (Badges)
    notifRef.on('value', snap => {
        let data = snap.val() || {};
        let nGchat = 0, nGpost = 0, nGchallenger = 0;

        Object.values(data).forEach(n => {
            if (!n.lida) {
                if (n.contextType === "gchat") nGchat++;
                if (n.contextType === "gpost") nGpost++;
                if (n.contextType === "embates") nGchallenger++;
            }
        });
        window.atualizarBadgesHUD(nGchat, nGpost, nGchallenger);
    });

    // Mostra o Popup Animado (Toast) apenas para NOVAS mensagens
    let readyToNotify = false;
    notifRef.limitToLast(1).on('child_added', snap => {
        if (!readyToNotify) return; // Ignora o histórico na hora que o usuário loga
        let n = snap.val();
        if (!n || n.lida) return;
        
        if(typeof window.mostrarNotificacaoHUD === "function") {
            window.mostrarNotificacaoHUD(n.from, n.contextType, n.texto);
        }
    });
    
    // Libera os popups 2 segundos após fazer login
    setTimeout(() => { readyToNotify = true; }, 2000);
};

// =========================================================
// CORREÇÃO: MENÇÕES COM NOMES COMPOSTOS (ESPAÇO)
// =========================================================

// 1. Quando clicar no nome no dropdown, coloca o "_" no lugar do espaço
window.selectMention = function(nome) {
    let s = window._mentionRuntime;
    if (!s || !s.active) s = window.mentionState;
    if (!s || !s.active || !s.inputEl) return;

    const inputEl = s.inputEl;
    const val = inputEl.value || "";
    const cursorPos = inputEl.selectionStart || val.length;

    const before = val.substring(0, s.startPos);
    const after = val.substring(cursorPos);

    // Substitui espaços por underline para o sistema entender nomes compostos
    const nomeLimpo = nome.replace(/\s+/g, "_");

    inputEl.value = before + "@" + nomeLimpo + " " + after;
    inputEl.focus();
    window.closeMentionDropdown();
};

// 2. Transforma o "_" de volta em espaço e deixa azulzinho no Chat Principal
if (window.db) {
    window.db.ref('tokyoRpg/chat').limitToLast(40).on('value', s => { 
        try {
            let d = s.val(); let b = document.getElementById("chatMessages"); if(!b) return; b.innerHTML=""; 
            if(d){ Object.keys(d).forEach(k => { 
                let m = d[k]; let rCount = m.reacoes || {}; let uData = window.usersGlobais[m.nome] || {}; 
                let curAv = uData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${m.nome}`; let curTit = uData.tituloChat || m.titulo; 
                
                // NOVIDADE: Regex pega o nome com underline e exibe com espaço no chat
                let textoBonito = (m.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) {
                    return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`;
                });

                let reactHtml = `<button class="react-add" onclick="window.abrirEmojiReacao('${k}', event)">+</button>${rCount['🔥']?`<button class="react-btn">🔥 ${rCount['🔥']}</button>`:''}${rCount['💀']?`<button class="react-btn">💀 ${rCount['💀']}</button>`:''}${rCount['😂']?`<button class="react-btn">😂 ${rCount['😂']}</button>`:''}${rCount['👀']?`<button class="react-btn">👀 ${rCount['👀']}</button>`:''}${rCount['💯']?`<button class="react-btn">💯 ${rCount['💯']}</button>`:''}${rCount['🤡']?`<button class="react-btn">🤡 ${rCount['🤡']}</button>`:''}${rCount['💔']?`<button class="react-btn">💔 ${rCount['💔']}</button>`:''}${rCount['💰']?`<button class="react-btn">💰 ${rCount['💰']}</button>`:''}`;
                b.innerHTML += `<div class="msg-box"><div class="msg-avatar-container"><span style="font-size:10px; color:#ff2a5f;">${uData.carteira||0}¥</span><img src="${curAv}" class="msg-avatar"></div><div class="msg-content"><div style="display:flex; flex-direction:column; margin-bottom:5px;">${curTit?`<div class="title-tag ${curTit.raridade}" style="display:inline-block; width:fit-content; margin-bottom:2px;">${curTit.txt||curTit}</div>`:''}<strong style="color:var(--accent-blue); font-size:14px;">${m.nome} <span style="color:#555;font-size:10px; margin-left:5px;">${m.data}</span></strong></div><p style="font-size:13px; line-height:1.4; margin-top:2px;">${textoBonito}</p>${m.imagemUrl?`<img src="${m.imagemUrl}" class="msg-image">`:''}<div style="margin-top:5px; display:flex; flex-wrap:wrap; gap:5px;">${reactHtml}</div></div></div>`; 
            }); b.scrollTop = b.scrollHeight; }
        } catch (err) { console.error("Erro ao renderizar chat:", err); }
    });
}

// 3. Transforma o "_" de volta em espaço e deixa azulzinho nos Comentários
window.carregarComentarios = function(postId) {
    let list = document.getElementById("commentsList");
    if(!list) return;
    list.innerHTML = "<div style='text-align:center; color:#aaa; margin-top:20px;'>Carregando...</div>";
    
    window.db.ref(`tokyoRpg/posts/${postId}/comentarios`).on('value', snap => {
        if(window.currentPostIdForComment !== postId) return; 
        
        let data = snap.val();
        if(!data) { list.innerHTML = "<div style='text-align:center; color:#555; margin-top:20px;'>Seja o primeiro a comentar!</div>"; return; }
        
        let html = "";
        let sortedKeys = Object.keys(data).sort((a,b) => data[a].timestamp - data[b].timestamp);

        sortedKeys.forEach(k => {
            let c = data[k];
            let u = window.usersGlobais[c.autor] || {};
            let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${c.autor}`;
            let nome = u.nome || c.autor;
            
            // NOVIDADE: Regex pega o nome com underline e exibe com espaço no comentário
            let textoBonito = (c.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) {
                return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`;
            });

            html += `
                <div class="comment-item">
                    <img src="${avatar}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-name">${nome}</div>
                        <div>${textoBonito}</div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
        setTimeout(() => { list.scrollTop = list.scrollHeight; }, 50);
    });
};

// =========================================================
// CORREÇÃO: NOTIFICAÇÕES PADRONIZADAS E AVISO DE SEGUIDOR
// =========================================================

// 1. Padronizamos a função para salvar no caminho exato que as Bolinhas (Badges) leem
window.enviarNotificacao = function(alvo, contextType, from, text, contextId = "") {
    if (!window.db || !alvo || alvo === from) return;

    window.db.ref(`tokyoRpg/users/${alvo}/notificacoes`).push({
        from: from,
        contextType: contextType, // "gchat", "gpost" ou "embates"
        contextId: contextId,
        texto: text,
        lida: false,
        ts: Date.now()
    });
};

// 2. Atualizamos o Toggle Follow para disparar a notificação certa
window.toggleFollow = function(alvo, event) {
    if (event) event.stopPropagation();
    if (!window.jogadorAtual || alvo === window.jogadorAtual) return;
    
    let me = window.usersGlobais[window.jogadorAtual] || {};
    let target = window.usersGlobais[alvo] || {};
    
    let isFollowing = me.seguindo && me.seguindo[alvo];
    let theyFollow = target.seguindo && target.seguindo[window.jogadorAtual];
    
    let updates = {};
    if (isFollowing) {
        // Deixar de seguir
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = null;
        updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = null;
        window.showNeonToast(`Você deixou de seguir ${alvo}`);
    } else {
        // Seguir
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = true;
        updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = true;
        
        // AQUI ESTÁ A MÁGICA: Envia a notificação informando o Follow! 
        // Vai cair na aba "G-Post" para fazer a bolinha acender.
        window.enviarNotificacao(alvo, 'gpost', window.jogadorAtual, "começou a seguir você!", "follow");
        
        window.showNeonToast(`Você agora segue ${alvo}`);
    }
    
    window.db.ref().update(updates);
    
    // Troca o botão na mesma hora sem lagar a tela
    let safeClass = alvo.replace(/[^a-zA-Z0-9]/g, '');
    document.querySelectorAll(`.follow-btn-${safeClass}`).forEach(btn => {
        if (isFollowing) { 
            btn.className = `follow-badge-btn follow-btn-${safeClass}`;
            btn.innerHTML = "+";
        } else { 
            if(theyFollow) {
                btn.className = `follow-badge-btn friends follow-btn-${safeClass}`;
                btn.innerHTML = "✓✓ Amigos";
            } else {
                btn.className = `follow-badge-btn following follow-btn-${safeClass}`;
                btn.innerHTML = "✓";
            }
        }
    });
};
// =========================================================
// PATCH: DESBLOQUEIO DE APPS (HB-CELULAR) E SISTEMA DE DM
// =========================================================

// 1. Correção da Função que lê os itens e libera as abas
window.renderizarFicha = function() {
    if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual]) return;
    let u = window.usersGlobais[window.jogadorAtual]; 
    let r = window.getSafeRpg(u); 
    let mInteg = window.calcularMaxInteg(u); 
    let buffs = window.calcularBuffsMoveis(u); 
    let def = window.calcularDefesa(u);
    
    if(document.getElementById("fichaNome")) window.setElText("fichaNome", u.nome || window.jogadorAtual);
    if(document.getElementById("fichaSerial")) window.setElText("fichaSerial", u.serial || "----");
    let avURL = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    if(document.getElementById("myAvatarImg")) document.getElementById("myAvatarImg").src = avURL;
    if(document.getElementById("perfilSobrenome")) window.setElVal("perfilSobrenome", u.perfil?.sobrenome || "");
    if(document.getElementById("perfilIdade")) window.setElVal("perfilIdade", u.perfil?.idade || "");
    if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", u.numero || "Registrado");

    window.setElText("lblDef", def); 
    if(document.getElementById("lblPtsOS")) document.getElementById("lblPtsOS").innerText = r.pontosLivres;
    window.setElText("lblPts", r.pontosLivres);
    window.setElText("valFor", r.for + buffs.for); window.setElText("valAgi", r.agi + buffs.agi); window.setElText("valMan", r.man + buffs.man); window.setElText("valVig", r.vig + buffs.vig); window.setElText("valInt", r.int + buffs.int);
    window.setElText("lblIntegMax", mInteg); window.setElText("lblIntegVal", r.integridade + "%");
    
    let hpInp = document.getElementById("hpInput"); if(hpInp && document.activeElement !== hpInp) hpInp.value = r.hp;
    let bar = document.getElementById("integrityBar"); if(bar) { let pct = (r.integridade / mInteg) * 100; bar.style.width = Math.min(pct,100) + "%"; bar.style.background = r.integridade < 30 ? "#ff0000" : "#00ff00"; }
    
    // VERIFICA SE O JOGADOR TEM CELULAR E CASA NA MOCHILA
    let temCel = u.numero || (u.mochila && Object.values(u.mochila).some(i => i.tipo === 'Tecnologia'));
    let temCasa = (u.casa && Object.keys(u.casa).length > 0) || (u.mochila && Object.values(u.mochila).some(i => i.tipo === 'Móvel'));
    
    // LIBERA O APP GAMBLENGER (HB-CELULAR)
    let iCel = document.getElementById('hb-celular'); 
    if(iCel) { 
        if(temCel || window.isMaster) { 
            iCel.classList.remove('locked'); 
            iCel.onclick = () => { window.abrirApp('tab-celular', false); window.carregarContatosSMS(); }; 
        } else { 
            iCel.classList.add('locked'); 
            iCel.onclick = () => window.abrirApp('none', true, "Gamblenger Fora do Ar! Compre Tecnologia na Gamblezon."); 
        } 
    }
    
    // LIBERA O APP GAMBLE HOUSE (HB-CASA)
    let iCasa = document.getElementById('hb-casa'); 
    if(iCasa) { 
        if(temCasa || window.isMaster) { 
            iCasa.classList.remove('locked'); 
            iCasa.onclick = () => window.abrirApp('tab-casa', false); 
        } else { 
            iCasa.classList.add('locked'); 
            iCasa.onclick = () => window.abrirApp('none', true, "Gamble House Bloqueada! Compre um Imóvel."); 
        } 
    }
};


// =========================================================
// SISTEMA: GAMBLE HOUSE TETRIS E AJUSTES DE INVENTÁRIO
// =========================================================

// 1. Ocultamos os Móveis da Mochila Normal (Eles vão só para a Casa)
window.renderizarMochila = function() {
    let g = document.getElementById("grid-personagem"); let l = document.getElementById("lista-itens-soltos"); if(!g || !l) return;
    if(window.arrastandoKey !== null) return; 

    let extraW = 0, extraH = 0; let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    Object.values(itens).forEach(i => { if(i.tipo === 'Mochila' && i.eq === true) { extraW += (parseInt(i.extraW) || 0); extraH += (parseInt(i.extraH) || 0); } });
    
    window.GRID_COLS = 5 + extraW; window.GRID_ROWS = 3 + extraH;
    g.style.gridTemplateColumns = `repeat(${window.GRID_COLS}, 45px)`; g.style.gridTemplateRows = `repeat(${window.GRID_ROWS}, 45px)`;
    g.innerHTML = ""; l.innerHTML = ""; window.tetrisMatrix = Array(window.GRID_ROWS).fill(null).map(()=>Array(window.GRID_COLS).fill(0));
    for(let i = 0; i < (window.GRID_COLS * window.GRID_ROWS); i++) g.innerHTML += `<div class="grid-cell"></div>`;

    let pesoStats = window.getPesoStatus(window.usersGlobais[window.jogadorAtual]);
    let sP = document.getElementById("statusPeso"); if(sP) { sP.innerText = `Peso Atual: ${pesoStats.atual} / ${pesoStats.max} kg`; sP.style.color = pesoStats.sobrepeso?"#f00":"var(--accent-gold)"; }

    let drop = {};
    Object.keys(itens).forEach(k => { 
        let i = itens[k]; 
        if(i.tipo !== 'Móvel' && i.eq && (parseInt(i.c)+parseInt(i.w)>window.GRID_COLS || parseInt(i.r)+parseInt(i.h)>window.GRID_ROWS)) { 
            drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/eq`] = false; drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = null; drop[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = null; 
        } 
    });
    if(Object.keys(drop).length > 0) { window.db.ref().update(drop); return; } 

    Object.keys(itens).forEach(k => {
        let i = itens[k]; 
        if (i.tipo === 'Móvel') return; // MÁGICA: Pula os móveis! Eles não aparecem na mochila de combate.

        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris ${i.tipo || 'Arma'}`; el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnText = i.eq ? '▼' : '✖'; 
        let btnTitle = i.eq ? 'Guardar na Mochila' : 'Descartar'; 
        let btnClass = i.eq ? 'btn-excluir-item' : 'btn-excluir-item discard';
        let btnRotate = `<button class="btn-rotate-item" title="Rotacionar" onpointerdown="window.girarItemMochila('${k}', ${w}, ${h}, ${i.eq}, event)">↻</button>`;
        
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span>${i.tipo === 'Comida' ? `<button onclick="window.consumirComida('${k}', ${i.poder||0}, ${i.cd||2}, event)" style="font-size:8px; padding:2px; margin-top:2px; background:#000; color:#0f0; border:1px solid #0f0; border-radius:2px; cursor:pointer; position:relative; z-index:5;">Comer</button>` : ''}<button class="${btnClass}" title="${btnTitle}" onpointerdown="window.removerItemMochila('${k}', event)">${btnText}</button>`;

        if(i.eq === true && i.c !== undefined && i.r !== undefined && parseInt(i.c) < window.GRID_COLS && parseInt(i.r) < window.GRID_ROWS) {
            let ic = parseInt(i.c); let ir = parseInt(i.r);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`;
            el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) for(let col=ic; col<ic+w; col++) window.tetrisMatrix[row][col] = 1; 
            g.appendChild(el);
        } else {
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto';
            l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteTetris);
    });
    window.renderVttFoodActions();
};

// 2. Cálculo de Buffs passa a ler os Móveis instalados na Casa
window.calcularMaxInteg = function(u) { 
    let m = 100; 
    if(u && u.mochila) {
        Object.values(u.mochila).forEach(i => { 
            if(i.tipo==="Móvel" && i.inHouse === true && i.buffType==="integ" && i.poder) { m += parseInt(i.poder); }
        }); 
    }
    return m; 
};

window.calcularBuffsMoveis = function(u) { 
    let buffs = { for:0, agi:0, int:0, vig:0, man:0 }; 
    if(u && u.mochila) {
        Object.values(u.mochila).forEach(i => { 
            if(i.tipo==="Móvel" && i.inHouse === true && i.buffType && i.poder && buffs[i.buffType] !== undefined) { buffs[i.buffType] += parseInt(i.poder); }
        }); 
    }
    return buffs; 
};

// 3. Sistema Tetris da Casa
window.drawCasaBoard = function() { window.renderizarCasaTetris(); };

window.renderizarCasaTetris = function() {
    let g = document.getElementById("grid-casa");
    let l = document.getElementById("lista-moveis-soltos");
    if(!g || !l) return;
    
    window.CASA_COLS = 16;
    window.CASA_ROWS = 10;
    
    g.style.gridTemplateColumns = `repeat(${window.CASA_COLS}, 45px)`; 
    g.style.gridTemplateRows = `repeat(${window.CASA_ROWS}, 45px)`;
    g.innerHTML = ""; l.innerHTML = ""; 
    window.casaMatrix = Array(window.CASA_ROWS).fill(null).map(()=>Array(window.CASA_COLS).fill(0));
    
    for(let i = 0; i < (window.CASA_COLS * window.CASA_ROWS); i++) {
        g.innerHTML += `<div class="grid-cell" style="background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.1);"></div>`;
    }

    let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    
    let cData = window.usersGlobais[window.jogadorAtual]?.casaConfig;
    if(cData && cData.bg) { 
        g.style.backgroundImage = `url('${cData.bg}')`; 
        g.style.backgroundSize = "100% 100%"; 
    } else { g.style.backgroundImage = "none"; }

    Object.keys(itens).forEach(k => {
        let i = itens[k];
        if (i.tipo !== 'Móvel') return; // Renderiza apenas Móveis
        
        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris Móvel`; 
        el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; 
        el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnRotate = `<button class="btn-rotate-item" title="Rotacionar" onpointerdown="window.girarItemCasa('${k}', ${w}, ${h}, ${i.inHouse}, event)">↻</button>`;
        let btnText = i.inHouse ? '▼' : '✖'; 
        let btnTitle = i.inHouse ? 'Guardar no Depósito' : 'Vender/Descartar'; 
        let btnClass = i.inHouse ? 'btn-excluir-item' : 'btn-excluir-item discard';
        
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span><button class="${btnClass}" title="${btnTitle}" onpointerdown="window.removerMovel('${k}', event)">${btnText}</button>`;

        if(i.inHouse === true && i.hc !== undefined && i.hr !== undefined && parseInt(i.hc) < window.CASA_COLS && parseInt(i.hr) < window.CASA_ROWS) {
            let ic = parseInt(i.hc); let ir = parseInt(i.hr);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`;
            el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) {
                for(let col=ic; col<ic+w; col++) {
                    if (row < window.CASA_ROWS && col < window.CASA_COLS) window.casaMatrix[row][col] = 1; 
                }
            }
            g.appendChild(el);
        } else {
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto';
            l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteCasa);
    });
};

window.iniciarArrasteCasa = function(e) {
    if(e.target.closest('.btn-rotate-item') || e.target.tagName.toLowerCase() === 'button') return;
    e.preventDefault(); 
    window.itemArrastadoCasa = e.currentTarget; 
    window.arrastandoKeyCasa = window.itemArrastadoCasa.getAttribute('data-key');
    let gridEl = document.getElementById("grid-casa"); let rectOrig = window.itemArrastadoCasa.getBoundingClientRect();

    if (window.itemArrastadoCasa.parentElement === gridEl) {
        window.originCasa = 'grid'; window.initPosCasa = {c: parseInt(window.itemArrastadoCasa.getAttribute('data-c')), r: parseInt(window.itemArrastadoCasa.getAttribute('data-r'))};
        let w = parseInt(window.itemArrastadoCasa.getAttribute('data-w')); let h = parseInt(window.itemArrastadoCasa.getAttribute('data-h'));
        for(let row=window.initPosCasa.r; row<window.initPosCasa.r+h; row++) {
            for(let col=window.initPosCasa.c; col<window.initPosCasa.c+w; col++) {
                if(row < window.CASA_ROWS && col < window.CASA_COLS) window.casaMatrix[row][col] = 0; 
            }
        }
    } else { 
        window.originCasa = 'inv'; let gridRect = gridEl.getBoundingClientRect();
        window.itemArrastadoCasa.style.margin = "0"; window.itemArrastadoCasa.style.left = (rectOrig.left - gridRect.left) + 'px'; window.itemArrastadoCasa.style.top = (rectOrig.top - gridRect.top) + 'px';
        gridEl.appendChild(window.itemArrastadoCasa); 
    }
    
    window.itemArrastadoCasa.classList.add('dragging'); window.itemArrastadoCasa.style.position = 'absolute'; 
    let newRect = window.itemArrastadoCasa.getBoundingClientRect();
    window.offsetXCasa = e.clientX - newRect.left; window.offsetYCasa = e.clientY - newRect.top;
    document.addEventListener('pointermove', window.arrastarCasa); document.addEventListener('pointerup', window.soltarCasa);
};

window.arrastarCasa = function(e) { 
    e.preventDefault(); if(!window.itemArrastadoCasa) return; 
    const gridRect = document.getElementById("grid-casa").getBoundingClientRect();
    window.itemArrastadoCasa.style.left = `${e.clientX - gridRect.left - window.offsetXCasa}px`; window.itemArrastadoCasa.style.top = `${e.clientY - gridRect.top - window.offsetYCasa}px`;
};

window.soltarCasa = function(e) {
    document.removeEventListener('pointermove', window.arrastarCasa); document.removeEventListener('pointerup', window.soltarCasa);
    if(!window.itemArrastadoCasa) return; window.itemArrastadoCasa.classList.remove('dragging');
    const w = parseInt(window.itemArrastadoCasa.getAttribute('data-w')); const h = parseInt(window.itemArrastadoCasa.getAttribute('data-h'));
    let rawLeft = parseFloat(window.itemArrastadoCasa.style.left || 0); let rawTop = parseFloat(window.itemArrastadoCasa.style.top || 0);
    let tC = Math.round(rawLeft / window.REAL_CELL_SIZE); let tR = Math.round(rawTop / window.REAL_CELL_SIZE);

    if (tC < 0 || tC + w > window.CASA_COLS || tR < 0 || tR + h > window.CASA_ROWS) {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: false, hc: null, hr: null});
    } else {
        let livre = true;
        for(let r=tR; r<tR+h; r++) { for(let c=tC; c<tC+w; c++) { if(window.casaMatrix[r][c] === 1) livre = false; } }
        if(livre) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: true, hc: tC, hr: tR}); } 
        else {
            if(window.originCasa === 'grid') { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: true, hc: window.initPosCasa.c, hr: window.initPosCasa.r}); } 
            else { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: false, hc: null, hr: null}); }
        }
    }
    window.arrastandoKeyCasa = null; window.itemArrastadoCasa = null; 
};

window.girarItemCasa = function(k, w, h, inHouse, ev) {
    if(ev) ev.stopPropagation(); 
    let newW = parseInt(h); let newH = parseInt(w); let up = {};
    if(inHouse) {
        let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
        let tempMatrix = Array(window.CASA_ROWS).fill(null).map(()=>Array(window.CASA_COLS).fill(0));
        
        Object.keys(itens).forEach(ik => {
            if(ik !== k && itens[ik].inHouse) {
                let iW = parseInt(itens[ik].w)||1, iH = parseInt(itens[ik].h)||1;
                let iC = parseInt(itens[ik].hc), iR = parseInt(itens[ik].hr);
                if(!isNaN(iC) && !isNaN(iR)) {
                    for(let row=iR; row<iR+iH; row++) {
                        for(let col=iC; col<iC+iW; col++) { if(row<window.CASA_ROWS && col<window.CASA_COLS) tempMatrix[row][col] = 1; }
                    }
                }
            }
        });

        let startC = parseInt(itens[k].hc); let startR = parseInt(itens[k].hr);
        let targetC = startC; let targetR = startR; let found = false; let cabeNoLugar = true;
        
        if(startC + newW > window.CASA_COLS || startR + newH > window.CASA_ROWS) { cabeNoLugar = false; } 
        else {
            for(let row=startR; row<startR+newH; row++) {
                for(let col=startC; col<startC+newW; col++) { if(tempMatrix[row][col] === 1) cabeNoLugar = false; }
            }
        }

        if(cabeNoLugar) { found = true; } 
        else {
            let offsets = [];
            for(let dy = -window.CASA_ROWS; dy <= window.CASA_ROWS; dy++) {
                for(let dx = -window.CASA_COLS; dx <= window.CASA_COLS; dx++) { offsets.push({dx: dx, dy: dy, dist: Math.abs(dx) + Math.abs(dy)}); }
            }
            offsets.sort((a,b) => a.dist - b.dist);

            for(let off of offsets) {
                let nc = startC + off.dx; let nr = startR + off.dy;
                if(nc >= 0 && nc + newW <= window.CASA_COLS && nr >= 0 && nr + newH <= window.CASA_ROWS) {
                    let livre = true;
                    for(let row=nr; row<nr+newH; row++) {
                        for(let col=nc; col<nc+newW; col++) { if(tempMatrix[row][col] === 1) livre = false; }
                    }
                    if(livre) { found = true; targetC = nc; targetR = nr; break; }
                }
            }
        }

        if(found) {
            let el = document.querySelector(`#grid-casa .item-tetris[data-key='${k}']`);
            if(el) { el.style.transition = "transform 0.2s ease-in-out"; el.style.transform = "rotate(90deg) scale(0.9)"; el.style.zIndex = "999"; }
            setTimeout(() => { up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/hc`] = targetC; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/hr`] = targetR; window.db.ref().update(up); }, 200);
        } else { window.showNeonToast("Sem espaço para rotacionar!"); }
    } else {
        let el = document.querySelector(`#lista-moveis-soltos .item-tetris[data-key='${k}']`);
        if(el) { el.style.transition = "transform 0.2s ease-in-out"; el.style.transform = "rotate(90deg) scale(0.9)"; }
        setTimeout(() => { up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH; window.db.ref().update(up); }, 200);
    }
};

window.removerMovel = function(k, ev) { 
    if(ev) ev.stopPropagation(); let item = window.usersGlobais[window.jogadorAtual]?.mochila?.[k];
    if(item && item.inHouse) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({inHouse: false, hc: null, hr: null}); } 
    else { if(confirm("Vender/Descartar este móvel permanentemente?")) window.db.ref('tokyoRpg/users/' + window.jogadorAtual + '/mochila/' + k).remove(); }
};

window.salvarConfigCasa = function() { 
    if(!window.jogadorAtual) return; 
    let nome = document.getElementById("casaNomeInp").value; 
    let bg = document.getElementById("casaBgInp").value; 
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/casaConfig`).update({ nome: nome, bg: bg }); 
    window.showNeonToast("Fundo da Casa Salvo!"); 
    setTimeout(window.renderizarCasaTetris, 500);
};

// =========================================================
// CORREÇÃO: GAMBLE HOUSE DINÂMICA (TAMANHOS E TRANSPARÊNCIA)
// =========================================================

window.drawCasaBoard = function() { window.renderizarCasaTetris(); };

window.renderizarCasaTetris = function() {
    let g = document.getElementById("grid-casa");
    let l = document.getElementById("lista-moveis-soltos");
    if(!g || !l) return;
    
    // 1. Pega as configurações ou usa padrão 10x10
    let cData = window.usersGlobais[window.jogadorAtual]?.casaConfig || {};
    window.CASA_COLS = parseInt(cData.w) || 10;
    window.CASA_ROWS = parseInt(cData.h) || 10;
    
    // Atualiza os inputs na tela para o jogador ver
    if(document.getElementById("casaNomeInp")) document.getElementById("casaNomeInp").value = cData.nome || "";
    if(document.getElementById("casaBgInp")) document.getElementById("casaBgInp").value = cData.bg || "";
    if(document.getElementById("casaW")) document.getElementById("casaW").value = window.CASA_COLS;
    if(document.getElementById("casaH")) document.getElementById("casaH").value = window.CASA_ROWS;
    
    g.style.gridTemplateColumns = `repeat(${window.CASA_COLS}, 45px)`; 
    g.style.gridTemplateRows = `repeat(${window.CASA_ROWS}, 45px)`;
    g.innerHTML = ""; l.innerHTML = ""; 
    window.casaMatrix = Array(window.CASA_ROWS).fill(null).map(()=>Array(window.CASA_COLS).fill(0));
    
    for(let i = 0; i < (window.CASA_COLS * window.CASA_ROWS); i++) {
        g.innerHTML += `<div class="grid-cell"></div>`;
    }

    if(cData && cData.bg) { 
        g.style.backgroundImage = `url('${cData.bg}')`; 
    } else { 
        g.style.backgroundImage = "none"; 
    }

    let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    
    Object.keys(itens).forEach(k => {
        let i = itens[k];
        if (i.tipo !== 'Móvel') return; 
        
        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris Móvel`; 
        el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; 
        el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnRotate = `<button class="btn-rotate-item" title="Rotacionar" onpointerdown="window.girarItemCasa('${k}', ${w}, ${h}, ${i.inHouse}, event)">↻</button>`;
        let btnText = i.inHouse ? '▼' : '✖'; 
        let btnTitle = i.inHouse ? 'Guardar no Depósito' : 'Vender/Descartar'; 
        let btnClass = i.inHouse ? 'btn-excluir-item' : 'btn-excluir-item discard';
        
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span><button class="${btnClass}" title="${btnTitle}" onpointerdown="window.removerMovel('${k}', event)">${btnText}</button>`;

        // Se estiver na casa e couber nas dimensões atuais do grid
        if(i.inHouse === true && i.hc !== undefined && i.hr !== undefined && parseInt(i.hc) < window.CASA_COLS && parseInt(i.hr) < window.CASA_ROWS) {
            let ic = parseInt(i.hc); let ir = parseInt(i.hr);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`;
            el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) {
                for(let col=ic; col<ic+w; col++) {
                    if (row < window.CASA_ROWS && col < window.CASA_COLS) window.casaMatrix[row][col] = 1; 
                }
            }
            g.appendChild(el);
        } else {
            // Se o item tava na casa mas o jogador diminuiu o tamanho do Grid, manda de volta pro depósito para não bugar
            if(i.inHouse === true) {
                 window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({inHouse: false, hc: null, hr: null});
            }
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto';
            l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteCasa);
    });
};

window.salvarConfigCasa = function() { 
    if(!window.jogadorAtual) return; 
    let nome = document.getElementById("casaNomeInp").value; 
    let bg = document.getElementById("casaBgInp").value; 
    let w = parseInt(document.getElementById("casaW").value) || 10;
    let h = parseInt(document.getElementById("casaH").value) || 10;

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/casaConfig`).update({ 
        nome: nome, bg: bg, w: w, h: h 
    }); 
    window.showNeonToast("Planta da Casa Atualizada!"); 
    setTimeout(window.renderizarCasaTetris, 500);
};
// =========================================================
// GAMBLENGER: SISTEMA COMPLETO (AGENDA, CHAT E LIGAÇÕES)
// =========================================================

window.contatoSmsAtual = null;
window._smsListener = null;
window._lastChatId = null;

// 1. Adicionar Contato pelo Número
window.adicionarContato = function() {
    if(!window.jogadorAtual) return;
    let num = document.getElementById("novoContatoNum").value.trim();
    if(!num) return;

    let me = window.usersGlobais[window.jogadorAtual];
    
    if(!me.numero && !window.isMaster) { 
        window.showNeonToast("Registre seu próprio Número no perfil primeiro!"); 
        return; 
    }
    if(num === me.numero) { window.showNeonToast("Este é o seu próprio número!"); return; }

    let alvo = null;
    Object.keys(window.usersGlobais).forEach(k => {
        if(window.usersGlobais[k].numero === num) alvo = k;
    });

    if(!alvo) { window.showNeonToast("Número inexistente ou fora de área."); return; }

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/contatos/${alvo}`).set(true).then(() => {
        window.showNeonToast(`Contato [${alvo}] salvo!`);
        document.getElementById("novoContatoNum").value = "";
        window.carregarContatosSMS();
    });
};

// 2. Carregar a Lista de Contatos na Esquerda
window.carregarContatosSMS = function() {
    let lista = document.getElementById("listaContatosSMS");
    if(!lista || !window.usersGlobais || !window.jogadorAtual) return;
    lista.innerHTML = "";
    
    let meusContatos = window.usersGlobais[window.jogadorAtual]?.contatos || {};
    let contatosArray = Object.keys(meusContatos);

    if(window.isMaster) {
        contatosArray = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE" && n !== window.jogadorAtual);
    }

    if(contatosArray.length === 0) {
        lista.innerHTML = `<div style="text-align:center; color:#555; font-size:10px; margin-top:20px;">Sua agenda está vazia.<br><br>Adicione o nº de alguém.</div>`;
        return;
    }

    contatosArray.forEach(n => {
        let u = window.usersGlobais[n];
        if(!u) return;
        let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
        let isSel = (window.contatoSmsAtual === n) ? "background:rgba(0, 229, 255, 0.2); border-left:3px solid var(--accent-blue);" : "background:#111; border-left:3px solid #333;";
        lista.innerHTML += `
        <div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-radius:4px; margin-bottom:5px; ${isSel}" onclick="window.abrirChatSMS('${n}')">
            <img src="${av}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid #555;">
            <div style="color:#fff; font-weight:bold; font-size:12px; overflow:hidden; text-overflow:ellipsis;">${n}</div>
        </div>`;
    });
};

// 3. Abrir o Chat ao Clicar na Pessoa
window.abrirChatSMS = function(contato) {
    window.contatoSmsAtual = contato;
    let headerName = document.getElementById("smsChatName");
    let callBtn = document.getElementById("btnCallUI");
    
    if(headerName) headerName.innerText = "Criptografado: " + contato;
    if(callBtn) callBtn.style.display = "block"; 
    
    window.carregarContatosSMS(); 
    window.renderizarSMSLog(); 
};

// 4. Puxar o Histórico de Mensagens sem Duplicar
window.renderizarSMSLog = function() {
    if(!window.jogadorAtual || !window.contatoSmsAtual) return;
    
    let chatId = [window.jogadorAtual, window.contatoSmsAtual].sort().join("_");
    
    if(window._smsListener && window._lastChatId) {
        window.db.ref('tokyoRpg/smsChats/' + window._lastChatId).off('value', window._smsListener);
    }
    
    window._lastChatId = chatId;
    
    window._smsListener = window.db.ref('tokyoRpg/smsChats/' + chatId).on('value', snap => {
        let log = document.getElementById("smsLog");
        if(!log) return;
        
        log.innerHTML = ""; 
        
        let data = snap.val();
        if(!data) {
            log.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px; font-style:italic;">A conexão é segura. Envie a primeira mensagem.</div>`;
            return;
        }
        
        Object.keys(data).forEach(k => {
            let m = data[k];
            let isMe = (m.de === window.jogadorAtual);
            let align = isMe ? "flex-end" : "flex-start";
            let bg = isMe ? "var(--accent-blue)" : "#222";
            let color = isMe ? "#000" : "#fff";
            let radius = isMe ? "12px 12px 0 12px" : "12px 12px 12px 0";
            
            log.innerHTML += `
            <div style="display:flex; flex-direction:column; align-items:${align}; margin-bottom:10px; width:100%;">
                <div style="background:${bg}; color:${color}; padding:10px; border-radius:${radius}; max-width:80%; font-size:13px; font-family:monospace; font-weight:bold; word-wrap:break-word;">
                    ${m.msg}
                </div>
                <div style="font-size:10px; color:#666; margin-top:3px;">${m.data || ""}</div>
            </div>`;
        });
        
        setTimeout(() => { log.scrollTop = log.scrollHeight; }, 50);
    });
};

// 5. Enviar Mensagem (Enter ou Botão)
window.enviarSMS = function() {
    if(!window.jogadorAtual || !window.contatoSmsAtual) {
        window.showNeonToast("Selecione um contato na agenda primeiro!");
        return;
    }
    
    let inputEl = document.getElementById("smsTexto");
    let txt = inputEl.value.trim();
    if(!txt) return;
    
    let chatId = [window.jogadorAtual, window.contatoSmsAtual].sort().join("_");
    let payload = {
        de: window.jogadorAtual,
        para: window.contatoSmsAtual,
        msg: txt,
        data: new Date().toLocaleTimeString().substring(0, 5),
        ts: Date.now()
    };
    
    window.db.ref(`tokyoRpg/smsChats/${chatId}`).push(payload).then(() => {
        if(typeof window.enviarNotificacaoHUD === "function") {
            window.enviarNotificacaoHUD(window.contatoSmsAtual, window.jogadorAtual, "enviou uma mensagem criptografada.");
        }
    });
    
    inputEl.value = ""; 
    inputEl.focus();    
};

// 6. Botão de Ligar
window.iniciarLigacao = function() {
    if(!window.contatoSmsAtual) return;
    window.showNeonToast(`📞 Conectando com ${window.contatoSmsAtual}...`);
};
// =========================================================
// CORREÇÃO DEFINITIVA: GERAÇÃO DE CHIP E ÁUDIO MUDO
// =========================================================

window.renderizarFicha = function() {
    if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual]) return;
    let u = window.usersGlobais[window.jogadorAtual]; 
    let r = window.getSafeRpg(u); 
    let mInteg = window.calcularMaxInteg(u); 
    let buffs = window.calcularBuffsMoveis(u); 
    let def = window.calcularDefesa(u);
    
    if(document.getElementById("fichaNome")) window.setElText("fichaNome", u.nome || window.jogadorAtual);
    if(document.getElementById("fichaSerial")) window.setElText("fichaSerial", u.serial || "----");
    let avURL = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    if(document.getElementById("myAvatarImg")) document.getElementById("myAvatarImg").src = avURL;
    if(document.getElementById("perfilSobrenome")) window.setElVal("perfilSobrenome", u.perfil?.sobrenome || "");
    if(document.getElementById("perfilIdade")) window.setElVal("perfilIdade", u.perfil?.idade || "");
    
    window.setElText("lblDef", def); 
    if(document.getElementById("lblPtsOS")) document.getElementById("lblPtsOS").innerText = r.pontosLivres;
    window.setElText("lblPts", r.pontosLivres);
    window.setElText("valFor", r.for + buffs.for); window.setElText("valAgi", r.agi + buffs.agi); window.setElText("valMan", r.man + buffs.man); window.setElText("valVig", r.vig + buffs.vig); window.setElText("valInt", r.int + buffs.int);
    window.setElText("lblIntegMax", mInteg); window.setElText("lblIntegVal", r.integridade + "%");
    
    let hpInp = document.getElementById("hpInput"); if(hpInp && document.activeElement !== hpInp) hpInp.value = r.hp;
    let bar = document.getElementById("integrityBar"); if(bar) { let pct = (r.integridade / mInteg) * 100; bar.style.width = Math.min(pct,100) + "%"; bar.style.background = r.integridade < 30 ? "#ff0000" : "#00ff00"; }
    
    // VERIFICADOR BLINDADO: Acha o Celular pelo Nome ou Tipo
    let temCel = u.numero ? true : false;
    let temCasa = (u.casa && Object.keys(u.casa).length > 0) ? true : false;
    
    if (u.mochila) {
        Object.values(u.mochila).forEach(i => {
            let nomeItem = (i.nome || "").toLowerCase();
            let tipoItem = (i.tipo || "").toLowerCase();
            
            // Se tiver 'tecnologia' no tipo OU 'celular'/'telefone' no nome, o jogador ganha o chip!
            if (tipoItem === 'tecnologia' || nomeItem.includes('celular') || nomeItem.includes('telefone') || nomeItem.includes('gamblenger')) {
                temCel = true;
            }
            if (tipoItem === 'móvel' || tipoItem === 'movel') {
                temCasa = true;
            }
        });
    }
    
    // MÁGICA DO CHIP (GERA NÚMERO NA HORA)
    if (temCel && !u.numero && window.jogadorAtual !== "MESTRE") {
        let novoNumero = "9" + Math.floor(1000 + Math.random() * 9000).toString();
        u.numero = novoNumero; 
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/numero`).set(novoNumero).then(() => {
            window.showNeonToast(`📱 Celular Ativado! Seu novo número é: ${novoNumero}`);
            if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", novoNumero);
        });
    }
    
    // Atualiza a interface
    if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", u.numero || "Sem Sinal");

    // LIBERA O CELULAR
    let iCel = document.getElementById('hb-celular'); 
    if(iCel) { 
        if(temCel || window.isMaster) { 
            iCel.classList.remove('locked'); 
            iCel.onclick = () => { window.abrirApp('tab-celular', false); window.carregarContatosSMS(); }; 
        } else { 
            iCel.classList.add('locked'); 
            iCel.onclick = () => window.abrirApp('none', true, "Gamblenger Fora do Ar! Compre um Celular na Gamblezon."); 
        } 
    }
    
    // LIBERA A CASA
    let iCasa = document.getElementById('hb-casa'); 
    if(iCasa) { 
        if(temCasa || window.isMaster) { 
            iCasa.classList.remove('locked'); 
            iCasa.onclick = () => window.abrirApp('tab-casa', false); 
        } else { 
            iCasa.classList.add('locked'); 
            iCasa.onclick = () => window.abrirApp('none', true, "Gamble House Bloqueada! Compre um Imóvel."); 
        } 
    }
};

// FORÇAR ÁUDIO A DESMUTAR QUANDO A LIGAÇÃO CONECTA
// Esse código extra garante que o navegador dos jogadores não mutem a chamada!
setInterval(() => {
    let remoteAudio = document.getElementById("remoteAudio");
    if(remoteAudio && window.callIdAtual) {
        if(remoteAudio.muted) remoteAudio.muted = false; // Tira do mudo à força
        if(remoteAudio.volume < 1.0) remoteAudio.volume = 1.0; // Põe volume no 100% à força
    }
}, 3000);

// =========================================================
// SISTEMA DE VOICE CHAT: MOTOR SERVIDOR GLOBAL (NÃO-P2P / JITSI API)
// =========================================================

// 1. INJETA O SERVIDOR GLOBAL AUTOMATICAMENTE
if (typeof window.JitsiMeetExternalAPI === 'undefined') {
    let script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.onload = () => console.log("Servidor Global Conectado.");
    document.head.appendChild(script);
}

// 2. CRIA O ESPAÇO OCULTO PARA O MOTOR RODAR
if (!document.getElementById('jitsiContainer')) {
    let div = document.createElement('div');
    div.id = 'jitsiContainer';
    div.style.position = 'absolute';
    div.style.left = '-9999px'; // Esconde para fora da tela
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.overflow = 'hidden';
    document.body.appendChild(div);
}

window.jitsiApi = null;
window.callIdAtual = null;
window._escutaLigacaoAtiva = false;
window.callStartTime = 0; 
window.quemTaLigando = null; 
window.callTimerInterval = null;

// --- FUNÇÃO PARA GERAR LOG DE DURAÇÃO NO CHAT ---
window.enviarLogChamada = function(tipo) {
    if(!window.jogadorAtual) return;
    let alvo = window.contatoSmsAtual || window.quemTaLigando;
    if(!alvo) return;

    let msg = "";
    if(tipo === "cancelada") msg = "📞 Chamada perdida/cancelada.";
    if(tipo === "recusada") msg = "📞 Chamada recusada.";
    if(tipo === "finalizada") {
        if(window.callStartTime === 0) return; 
        let segs = Math.floor((Date.now() - window.callStartTime) / 1000);
        let m = Math.floor(segs / 60);
        let s = segs % 60;
        msg = `📞 Chamada finalizada. Duração: ${m > 0 ? m + 'm ' : ''}${s}s`;
    }

    let chatId = [window.jogadorAtual, alvo].sort().join("_");
    window.db.ref(`tokyoRpg/smsChats/${chatId}`).push({ de: window.jogadorAtual, para: alvo, msg: msg, data: new Date().toLocaleTimeString().substring(0, 5), ts: Date.now() });
};

// --- ABRE A INTERFACE NEON DA CHAMADA ATIVA ---
window.abrirTelaChamadaAtiva = function(alvoId) {
    let modal = document.getElementById("activeCallModal");
    if(!modal) return;

    let me = window.jogadorAtual;
    let meuAv = window.usersGlobais[me]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${me}`;
    let alvoAv = window.usersGlobais[alvoId]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${alvoId}`;

    document.getElementById("activeCallMyAvatar").src = meuAv;
    document.getElementById("activeCallMyName").innerText = me;
    document.getElementById("activeCallTargetAvatar").src = alvoAv;
    document.getElementById("activeCallTargetName").innerText = alvoId;
    document.getElementById("activeCallTimer").innerText = "00:00";

    modal.style.display = "flex";
    
    if(window.callTimerInterval) clearInterval(window.callTimerInterval);
    window.callTimerInterval = setInterval(() => {
        let segs = Math.floor((Date.now() - window.callStartTime) / 1000);
        let m = Math.floor(segs / 60).toString().padStart(2, '0');
        let s = (segs % 60).toString().padStart(2, '0');
        document.getElementById("activeCallTimer").innerText = `${m}:${s}`;
    }, 1000);
};

// --- MOTOR DE CONEXÃO E DETECTOR DE VOZ ---
window.startJitsiCall = function(roomName) {
    if (!window.JitsiMeetExternalAPI) {
        window.showNeonToast("❌ Servidor carregando, tente novamente..."); return;
    }

    if(window.jitsiApi) { window.jitsiApi.dispose(); window.jitsiApi = null; }

    const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: document.getElementById('jitsiContainer'),
        configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true,
            prejoinPageEnabled: false, // Pula a tela de preparação
            disableDeepLinking: true,
        },
        userInfo: { displayName: window.jogadorAtual }
    };

    window.jitsiApi = new window.JitsiMeetExternalAPI('meet.jit.si', options);

    // MÁGICA: O Servidor avisa quem está falando para piscar o Neon!
    window.jitsiApi.on('audioLevelChanged', (data) => {
        let myAvatar = document.getElementById("activeCallMyAvatar");
        let targetAvatar = document.getElementById("activeCallTargetAvatar");
        let vol = data.audioLevel * 100;
        
        // 'local' é você, o resto é a outra pessoa
        if (data.participantId === 'local' || data.participantId === window.jitsiApi._myUserID) {
            if(myAvatar) {
                if(vol > 5) myAvatar.style.boxShadow = `0 0 ${20 + vol}px ${5 + (vol/2)}px rgba(0, 229, 255, 0.9)`;
                else myAvatar.style.boxShadow = `0 0 10px var(--accent-blue)`;
            }
        } else {
            if(targetAvatar) {
                if(vol > 5) targetAvatar.style.boxShadow = `0 0 ${20 + vol}px ${5 + (vol/2)}px rgba(255, 26, 85, 0.9)`;
                else targetAvatar.style.boxShadow = `0 0 10px var(--accent-red)`;
            }
        }
    });

    window.abrirTelaChamadaAtiva(window.quemTaLigando);
};

// 1. FAZER A LIGAÇÃO
window.iniciarLigacao = async function() {
    if(!window.contatoSmsAtual) return;
    let alvo = window.contatoSmsAtual;
    let me = window.jogadorAtual;

    // TRAVA DE OCUPADO
    let inCallSnap = await window.db.ref(`tokyoRpg/users/${alvo}/inCall`).once('value');
    if (inCallSnap.val() === true) {
        window.showNeonToast(`❌ O Celular de ${alvo} está ocupado!`);
        return;
    }

    window.db.ref(`tokyoRpg/users/${me}/inCall`).set(true);

    // Cria uma sala ÚNICA e criptografada no Servidor Global
    window.callIdAtual = "TokyoRpg_" + [me, alvo].sort().join("_").replace(/[^a-zA-Z0-9]/g, '');
    window.callStartTime = 0; 
    window.quemTaLigando = alvo;

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);
    await callDoc.remove(); 
    await callDoc.set({ from: me, to: alvo, status: "calling" });

    window.db.ref(`tokyoRpg/users/${alvo}/incomingCall`).set({ from: me, callId: window.callIdAtual, ts: Date.now() });
    window.showNeonToast(`📞 Ligando para ${alvo}...`);

    let callBtn = document.getElementById("btnCallUI");
    if(callBtn) {
        callBtn.innerText = "🔴 Desligar";
        callBtn.style.borderColor = "#f00"; callBtn.style.color = "#f00";
        callBtn.onclick = window.encerrarLigacao;
    }

    // Fica aguardando o Alvo atender
    callDoc.child('status').on('value', snap => { 
        let st = snap.val();
        if(st === "answered" && window.callStartTime === 0) {
            window.showNeonToast("✅ Ligação Atendida!");
            window.callStartTime = Date.now();
            window.startJitsiCall(window.callIdAtual);
        }
        if(st === "ended") window.encerrarLigacaoLimpo(); 
    });
};

// 2. RADAR DE TOQUE
setInterval(() => {
    if(window.jogadorAtual && window.db && !window._escutaLigacaoAtiva) {
        window._escutaLigacaoAtiva = true;
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).on('value', snap => {
            let data = snap.val();
            let modal = document.getElementById("callModal");
            
            if(!data) { if(modal) modal.style.display = "none"; return; }
            if(Date.now() - data.ts > 30000) return; 

            window.callIdAtual = data.callId;
            window.quemTaLigando = data.from;
            
            let u = window.usersGlobais[data.from] || {};
            let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${data.from}`;
            
            let imgEl = document.getElementById("callModalAvatar");
            if(imgEl) imgEl.src = av;
            
            let nameEl = document.getElementById("callModalName");
            if(nameEl) nameEl.innerText = data.from;
            
            // Toca o Ringtone (já temos a função tocarSomNotificacao feita anteriormente)
            if(typeof window.tocarSomNotificacao === "function") window.tocarSomNotificacao();

            if(modal) modal.style.display = "block";
        });
    }
}, 2000);

// 3. ATENDER LIGAÇÃO
window.aceitarLigacao = async function() {
    let modal = document.getElementById("callModal");
    if(modal) modal.style.display = "none";

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(true);
    window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("answered");
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();

    window.callStartTime = Date.now();
    window.startJitsiCall(window.callIdAtual);

    window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).on('value', snap => { 
        if(snap.val() === "ended") window.encerrarLigacaoLimpo(); 
    });
};

// 4. RECUSAR LIGAÇÃO
window.recusarLigacao = function() {
    let modal = document.getElementById("callModal");
    if(modal) modal.style.display = "none";

    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    window.enviarLogChamada("recusada");
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 5. DESLIGAR
window.encerrarLigacao = function() {
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    if(window.callStartTime > 0) window.enviarLogChamada("finalizada"); else window.enviarLogChamada("cancelada");
    if(window.contatoSmsAtual) window.db.ref(`tokyoRpg/users/${window.contatoSmsAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 6. LIMPEZA TOTAL
window.encerrarLigacaoLimpo = function() {
    document.getElementById("callModal") && (document.getElementById("callModal").style.display = "none");
    document.getElementById("activeCallModal") && (document.getElementById("activeCallModal").style.display = "none");
    
    // Libera a linha para receber novas chamadas
    if(window.jogadorAtual) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(false);
    if(window.callTimerInterval) clearInterval(window.callTimerInterval);
    
    // Desliga e Destrói a conexão com o Servidor Global
    if(window.jitsiApi) {
        window.jitsiApi.dispose();
        window.jitsiApi = null;
    }

    let callBtn = document.getElementById("btnCallUI");
    if(callBtn) {
        callBtn.innerText = "📞 Ligar";
        callBtn.style.borderColor = "#0f0"; callBtn.style.color = "#0f0";
        callBtn.onclick = window.iniciarLigacao;
    }
    
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`).off();
    
    window.callIdAtual = null;
    window.callStartTime = 0;
    window.quemTaLigando = null;
};

// --- INTERFACE DE CHAMADA ATIVA ---
window.abrirTelaChamadaAtiva = function(alvoId) {
    let modal = document.getElementById("activeCallModal");
    if(!modal) return;

    let me = window.jogadorAtual;
    let meuAv = window.usersGlobais[me]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${me}`;
    let alvoAv = window.usersGlobais[alvoId]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${alvoId}`;

    document.getElementById("activeCallMyAvatar").src = meuAv;
    document.getElementById("activeCallMyName").innerText = me;
    document.getElementById("activeCallTargetAvatar").src = alvoAv;
    document.getElementById("activeCallTargetName").innerText = alvoId;
    document.getElementById("activeCallTimer").innerText = "00:00";

    modal.style.display = "flex";
    
    // Inicia Cronômetro
    if(window.callTimerInterval) clearInterval(window.callTimerInterval);
    window.callTimerInterval = setInterval(() => {
        let segs = Math.floor((Date.now() - window.callStartTime) / 1000);
        let m = Math.floor(segs / 60).toString().padStart(2, '0');
        let s = (segs % 60).toString().padStart(2, '0');
        document.getElementById("activeCallTimer").innerText = `${m}:${s}`;
    }, 1000);
};

// --- MEDIDOR DE VOZ (PISCA O NEON QUANDO FALA) ---
window.setupAudioMeters = function(localStream, remoteStream) {
    try {
        if(!window.audioContext) window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if(window.audioContext.state === 'suspended') window.audioContext.resume();
        
        let myAvatar = document.getElementById("activeCallMyAvatar");
        let targetAvatar = document.getElementById("activeCallTargetAvatar");

        let localAnalyser = window.audioContext.createAnalyser();
        let remoteAnalyser = window.audioContext.createAnalyser();
        localAnalyser.fftSize = 256; remoteAnalyser.fftSize = 256;

        if(localStream) {
            let localSource = window.audioContext.createMediaStreamSource(localStream);
            localSource.connect(localAnalyser);
        }

        if(remoteStream) {
            let remoteSource = window.audioContext.createMediaStreamSource(remoteStream);
            remoteSource.connect(remoteAnalyser);
        }

        let localData = new Uint8Array(localAnalyser.frequencyBinCount);
        let remoteData = new Uint8Array(remoteAnalyser.frequencyBinCount);

        if(window.audioMeterInterval) clearInterval(window.audioMeterInterval);
        
        window.audioMeterInterval = setInterval(() => {
            localAnalyser.getByteFrequencyData(localData);
            remoteAnalyser.getByteFrequencyData(remoteData);

            let localVol = localData.reduce((a, b) => a + b, 0) / localData.length;
            let remoteVol = remoteData.reduce((a, b) => a + b, 0) / remoteData.length;

            if(myAvatar) {
                if(localVol > 10) myAvatar.style.boxShadow = `0 0 ${20 + (localVol*1.5)}px ${5 + (localVol/2)}px rgba(0, 229, 255, 0.9)`;
                else myAvatar.style.boxShadow = `0 0 10px var(--accent-blue)`;
            }

            if(targetAvatar) {
                if(remoteVol > 10) targetAvatar.style.boxShadow = `0 0 ${20 + (remoteVol*1.5)}px ${5 + (remoteVol/2)}px rgba(255, 26, 85, 0.9)`;
                else targetAvatar.style.boxShadow = `0 0 10px var(--accent-red)`;
            }
        }, 50); // Pisca em tempo real a cada 50ms!
    } catch(e) { console.log("AudioMeter erro:", e); }
};

// 1. FAZER A LIGAÇÃO
window.iniciarLigacao = async function() {
    if(!window.contatoSmsAtual) return;
    let alvo = window.contatoSmsAtual;
    let me = window.jogadorAtual;

    // TRAVA DE OCUPADO: Verifica se a outra pessoa já está em ligação
    let inCallSnap = await window.db.ref(`tokyoRpg/users/${alvo}/inCall`).once('value');
    if (inCallSnap.val() === true) {
        window.showNeonToast(`❌ Telefone de ${alvo} está ocupado!`);
        return;
    }

    // Marca a si mesmo como "Em Chamada"
    window.db.ref(`tokyoRpg/users/${me}/inCall`).set(true);

    window.callIdAtual = [me, alvo].sort().join("_");
    window.callStartTime = 0; 
    window.quemTaLigando = alvo;

    if (!navigator.mediaDevices) { window.showNeonToast("❌ ERRO: Use HTTPS!"); window.encerrarLigacaoLimpo(); return; }

    try {
        window.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch(e) { window.showNeonToast("❌ Permita o microfone no navegador!"); window.encerrarLigacaoLimpo(); return; }

    window.rtcPeer = new RTCPeerConnection(window.rtcServers);
    window.localStream.getTracks().forEach(track => window.rtcPeer.addTrack(track, window.localStream));

    let remoteAudio = document.getElementById("remoteAudio");
    window.rtcPeer.ontrack = event => {
        let remoteStream = event.streams[0];
        if(remoteAudio) { remoteAudio.srcObject = remoteStream; remoteAudio.play().catch(e => {}); }
        
        // Ativa os medidores Neon!
        window.setupAudioMeters(window.localStream, remoteStream);
    };

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);
    await callDoc.remove(); 
    await callDoc.set({ from: me, to: alvo, status: "calling" });

    window.rtcPeer.onicecandidate = event => { if(event.candidate) callDoc.child('callerCandidates').push(event.candidate.toJSON()); };

    try {
        const offer = await window.rtcPeer.createOffer();
        await window.rtcPeer.setLocalDescription(offer);
        await callDoc.update({ offer: { type: offer.type, sdp: offer.sdp } });
    } catch (err) {}

    window.db.ref(`tokyoRpg/users/${alvo}/incomingCall`).set({ from: me, callId: window.callIdAtual, ts: Date.now() });

    callDoc.child('answer').on('value', async snap => {
        let ans = snap.val();
        if(ans && window.rtcPeer && window.rtcPeer.signalingState !== "closed" && !window.rtcPeer.currentRemoteDescription) {
            try {
                await window.rtcPeer.setRemoteDescription(new RTCSessionDescription(ans));
                window.callStartTime = Date.now();
                
                // ABRE A TELA BONITA!
                window.abrirTelaChamadaAtiva(alvo);

                callDoc.child('calleeCandidates').on('child_added', snapIce => {
                    let candidate = snapIce.val();
                    if(candidate && window.rtcPeer && window.rtcPeer.remoteDescription) { window.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e=>{}); }
                });
            } catch(e) {}
        }
    });

    callDoc.child('status').on('value', snap => { if(snap.val() === "ended") window.encerrarLigacaoLimpo(); });
};

// 2. RADAR DE TOQUE
setInterval(() => {
    if(window.jogadorAtual && window.db && !window._escutaLigacaoAtiva) {
        window._escutaLigacaoAtiva = true;
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).on('value', snap => {
            let data = snap.val();
            let modal = document.getElementById("callModal");
            
            if(!data) { if(modal) modal.style.display = "none"; return; }
            if(Date.now() - data.ts > 30000) return; 

            window.callIdAtual = data.callId;
            window.quemTaLigando = data.from;
            
            let u = window.usersGlobais[data.from] || {};
            let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${data.from}`;
            
            let imgEl = document.getElementById("callModalAvatar");
            if(imgEl) imgEl.src = av;
            
            let nameEl = document.getElementById("callModalName");
            if(nameEl) nameEl.innerText = data.from;
            
            if(modal) modal.style.display = "block";
        });
    }
}, 2000);

// 3. ATENDER LIGAÇÃO
window.aceitarLigacao = async function() {
    let modal = document.getElementById("callModal");
    if(modal) modal.style.display = "none";

    // Marca a si mesmo como "Em Chamada" para ninguem atrapalhar
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(true);

    if (!navigator.mediaDevices) { window.showNeonToast("❌ ERRO: Navegador bloqueou áudio."); window.recusarLigacao(); return; }

    try { window.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); } 
    catch(e) { window.showNeonToast("❌ Microfone bloqueado!"); window.recusarLigacao(); return; }

    window.rtcPeer = new RTCPeerConnection(window.rtcServers);
    window.localStream.getTracks().forEach(track => window.rtcPeer.addTrack(track, window.localStream));

    let remoteAudio = document.getElementById("remoteAudio");
    window.rtcPeer.ontrack = event => {
        let remoteStream = event.streams[0];
        if(remoteAudio) { remoteAudio.srcObject = remoteStream; remoteAudio.play().catch(e => {}); }
        window.setupAudioMeters(window.localStream, remoteStream);
    };

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);

    window.rtcPeer.onicecandidate = event => { if(event.candidate) callDoc.child('calleeCandidates').push(event.candidate.toJSON()); };

    callDoc.child('offer').once('value', async snap => {
        let offer = snap.val();
        if(!offer) return;

        try {
            await window.rtcPeer.setRemoteDescription(new RTCSessionDescription(offer));

            callDoc.child('callerCandidates').on('child_added', snapIce => {
                let candidate = snapIce.val();
                if(candidate && window.rtcPeer && window.rtcPeer.remoteDescription) { window.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e=>{}); }
            });

            const answer = await window.rtcPeer.createAnswer();
            await window.rtcPeer.setLocalDescription(answer);

            await callDoc.update({ answer: { type: answer.type, sdp: answer.sdp }, status: "answered" });

            window.callStartTime = Date.now(); 
            window.abrirTelaChamadaAtiva(window.quemTaLigando);

        } catch(e) {}
    });

    callDoc.child('status').on('value', snap => { if(snap.val() === "ended") window.encerrarLigacaoLimpo(); });
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
};

// 4. RECUSAR LIGAÇÃO
window.recusarLigacao = function() {
    let modal = document.getElementById("callModal");
    if(modal) modal.style.display = "none";

    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    window.enviarLogChamada("recusada");
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 5. DESLIGAR
window.encerrarLigacao = function() {
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    if(window.callStartTime > 0) window.enviarLogChamada("finalizada"); else window.enviarLogChamada("cancelada");
    if(window.contatoSmsAtual) window.db.ref(`tokyoRpg/users/${window.contatoSmsAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 6. LIMPEZA TOTAL
window.encerrarLigacaoLimpo = function() {
    document.getElementById("callModal") && (document.getElementById("callModal").style.display = "none");
    document.getElementById("activeCallModal") && (document.getElementById("activeCallModal").style.display = "none");
    
    // Libera a linha para receber novas chamadas
    if(window.jogadorAtual) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(false);
    
    if(window.audioMeterInterval) clearInterval(window.audioMeterInterval);
    if(window.callTimerInterval) clearInterval(window.callTimerInterval);
    
    if(window.rtcPeer) { window.rtcPeer.close(); window.rtcPeer = null; }
    if(window.localStream) { window.localStream.getTracks().forEach(t => t.stop()); window.localStream = null; }

    let remoteAudio = document.getElementById("remoteAudio");
    if(remoteAudio) remoteAudio.srcObject = null;

    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`).off();
    
    window.callIdAtual = null;
    window.callStartTime = 0;
    window.quemTaLigando = null;
};

// =========================================================
// SISTEMA DE NOTIFICAÇÕES GLOBAIS: SOM, POPUPS E RINGTONES
// =========================================================

// 1. Toca o som (Áudio Customizado ou Beep Sintético do Sistema)
window.tocarSomNotificacao = function() {
    let u = window.usersGlobais?.[window.jogadorAtual] || {};
    let url = u.ringtone;

    if (url) {
        let audio = new Audio(url);
        audio.volume = 0.8;
        audio.play().catch(e => console.log("Áudio bloqueado", e));
    } else {
        // Gera um Beep Cyberpunk puro pelo navegador (Não depende de links externos)
        try {
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }
};

// 2. Salva a URL do Toque Customizado no Banco
window.salvarRingtone = function() {
    if(!window.jogadorAtual) return;
    let url = document.getElementById("ringtoneUrl").value.trim();
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/ringtone`).set(url).then(() => {
        window.showNeonToast("🎵 Toque de celular atualizado!");
        window.tocarSomNotificacao(); // Toca para a pessoa testar se funcionou!
    });
};

// 3. Atualizamos a aba de Contatos para puxar o ringtone salvo
window.carregarContatosSMS = function() {
    let lista = document.getElementById("listaContatosSMS");
    if(!lista || !window.usersGlobais || !window.jogadorAtual) return;
    lista.innerHTML = "";
    
    let meusContatos = window.usersGlobais[window.jogadorAtual]?.contatos || {};
    let contatosArray = Object.keys(meusContatos);

    if(window.isMaster) contatosArray = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE" && n !== window.jogadorAtual);

    if(contatosArray.length === 0) {
        lista.innerHTML = `<div style="text-align:center; color:#555; font-size:10px; margin-top:20px;">Sua agenda está vazia.<br><br>Adicione o nº de alguém.</div>`;
    } else {
        contatosArray.forEach(n => {
            let u = window.usersGlobais[n];
            if(!u) return;
            let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
            let isSel = (window.contatoSmsAtual === n) ? "background:rgba(0, 229, 255, 0.2); border-left:3px solid var(--accent-blue);" : "background:#111; border-left:3px solid #333;";
            lista.innerHTML += `
            <div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-radius:4px; margin-bottom:5px; ${isSel}" onclick="window.abrirChatSMS('${n}')">
                <img src="${av}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid #555;">
                <div style="color:#fff; font-weight:bold; font-size:12px; overflow:hidden; text-overflow:ellipsis;">${n}</div>
            </div>`;
        });
    }

    // Puxa o ringtone e joga na caixinha de texto pra pessoa ver o que configurou
    let me = window.usersGlobais?.[window.jogadorAtual] || {};
    let inp = document.getElementById("ringtoneUrl");
    if(inp && me.ringtone !== undefined) inp.value = me.ringtone;
};

// 4. Atualizamos o envio de SMS para mandar a Notificação Real + Popup pro Alvo
window.enviarSMS = function() {
    if(!window.jogadorAtual || !window.contatoSmsAtual) {
        window.showNeonToast("Selecione um contato na agenda primeiro!");
        return;
    }
    
    let inputEl = document.getElementById("smsTexto");
    let txt = inputEl.value.trim();
    if(!txt) return;
    
    let chatId = [window.jogadorAtual, window.contatoSmsAtual].sort().join("_");
    let payload = {
        de: window.jogadorAtual,
        para: window.contatoSmsAtual,
        msg: txt,
        data: new Date().toLocaleTimeString().substring(0, 5),
        ts: Date.now()
    };
    
    window.db.ref(`tokyoRpg/smsChats/${chatId}`).push(payload).then(() => {
        // Dispara a Notificação Oficial! (Faz o balão descer na tela do Alvo com som)
        if(typeof window.enviarNotificacao === "function") {
            window.enviarNotificacao(window.contatoSmsAtual, "sms", window.jogadorAtual, "te enviou um novo SMS cifrado!", chatId);
        }
    });
    
    inputEl.value = ""; 
    inputEl.focus();    
};

// 5. Atualizamos o Escutador de Notificações para TOCAR O SOM em tudo
window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    notifRef.on('value', snap => {
        let data = snap.val() || {};
        let nGchat = 0, nGpost = 0, nGchallenger = 0;

        Object.values(data).forEach(n => {
            if (!n.lida) {
                if (n.contextType === "gchat") nGchat++;
                if (n.contextType === "gpost") nGpost++;
                if (n.contextType === "embates") nGchallenger++;
            }
        });
        window.atualizarBadgesHUD(nGchat, nGpost, nGchallenger);
    });

    let readyToNotify = false;
    notifRef.limitToLast(1).on('child_added', snap => {
        if (!readyToNotify) return; 
        let n = snap.val();
        if (!n || n.lida) return;
        
        // MÁGICA: Toca o som antes do balão descer!
        window.tocarSomNotificacao();
        
        // Desce o balão na tela!
        if(typeof window.mostrarNotificacaoHUD === "function") {
            window.mostrarNotificacaoHUD(n.from, n.contextType, n.texto);
        }
    });
    
    setTimeout(() => { readyToNotify = true; }, 2000);
};
