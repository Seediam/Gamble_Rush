// =========================================================
// 1. CONFIGURAÇÕES BASE E DEUSES
// =========================================================
window.submapasConfig = {};
window.firebaseConfig = { apiKey: "AIzaSyAccNn3N4N1Dt0YXp5DtvoXsRj40oTOrDw", authDomain: "gumble-rush.firebaseapp.com", databaseURL: "https://gumble-rush-default-rtdb.firebaseio.com", projectId: "gumble-rush", storageBucket: "gumble-rush.firebasestorage.app", messagingSenderId: "837162957323", appId: "1:837162957323:web:0cd24e2a65e78d7fd2e50e" };
window.db = null; window.usersGlobais = {}; window.presenceGlobal = {}; window.lojaGlobal = {}; window.submapasGlobais = {}; window.submapasBGs = {}; window.turnosVTTGlobal = null; window.embatesGlobais = {}; window.casaGlobais = {};
window.jogadorAtual = ""; window.serialAtual = ""; window.isMaster = false; window.currentSubMapKey = ""; window.pontosAcao = 0; window.connectionRef = null;
window.MASTER_SERIAL = "4053-DC1";
window.allTurnosVTT = {}; // Cache global de iniciativas

// === INICIALIZANDO O SOCKET.IO ===
window.socket = io("http://26.100.100.199:3000"); 

window.socket.on("tokenMovido", (data) => {
    if(!window.submapasGlobais[data.mapKey]) window.submapasGlobais[data.mapKey] = {};
    
    Object.keys(data.updates).forEach(k => {
        if(data.updates[k] === null) delete window.submapasGlobais[data.mapKey][k];
        else window.submapasGlobais[data.mapKey][k] = data.updates[k];
    });
    
    if(data.mapKey === window.currentSubMapKey) { 
        if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard(); 
    }
});

window.socket.on("turnoPassado", (data) => {
    if(window.allTurnosVTT) window.allTurnosVTT[data.mapKey] = data.novoTurno;
    if(data.mapKey === window.currentSubMapKey) { 
        window.turnosVTTGlobal = data.novoTurno; 
        if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard(); 
    }
});

window.socket.on("receberAtaque", (data) => {
    if(data.mapKey !== window.currentSubMapKey) return;
    if(data.events) { 
        data.events.forEach(atk => { 
            if(atk.targets && atk.targets.includes(window.jogadorAtual)) {
                window.mostrarUIReacao(atk.id, atk); 
            }
        }); 
    }
});

window.socket.on("receberClash", (data) => {
    if(data.mapKey !== window.currentSubMapKey) return;
    if(!window.clashQueue) window.clashQueue = []; 
    window.clashQueue.push(data.clashData);
    if(typeof window.processClashQueue === "function") window.processClashQueue();
});
// === VARIÁVEIS DE COMBATE VTT E FILA DE ANIMAÇÕES ===
window.combatState = { active: false, weapon: null };
window.currentCombatListener = null; window.currentCombatChange = null; window._lastCombatMap = null; window.pendingAttack = null; window.clashQueue = []; window.isClashing = false; window.lastClashTs = 0;
window.submapasTraps = {};

window.codigosPromocionais = { "PLEBE": 15000, "JOBBER": 25000, "NOBLESS": 50000 };
window.iconesMercado = { "Arma": "🔫", "Munição": "🪫", "Roupa": "🦺", "Comida": "🍫", "Móvel": "🪑", "Tecnologia": "📱", "Acessório": "📿", "Mochila": "🎒" };

window.deusesPanteao = [
    { nome: "Oizus (Miséria)", desc: "Dobra risco do adversário e reduz o seu." }, { nome: "Afrodite (Desejo)", desc: "Força acordo não-letal irresistível." },
    { nome: "Athena (Estratégia)", desc: "Recebe pista dedutiva do mestre." }, { nome: "Hades (Submundo)", desc: "Herda automaticamente Yenes de mortos." },
    { nome: "Hermes (Tráfico)", desc: "Garante fuga perfeita de embates." }, { nome: "Gaia (Território)", desc: "Destaca as melhores rotas de fuga no mapa e usa Vias Verdes." },
    { nome: "Zeus (Autoridade)", desc: "Força aposta pública ou multa de 10%." }, { nome: "Diogenes (Cinismo)", desc: "Imune a manipulações de apostas." },
    { nome: "Ares (Violência)", desc: "Ignora dor leve e descobre armas." }, { nome: "Poseidon (Maré)", desc: "Pode anular completamente a última transação." },
    { nome: "Apolo (Verdade)", desc: "Força o alvo a responder Sim/Não com verdade." }, { nome: "Ártemis (Caçada)", desc: "Rastreio infalível e bônus de furtividade." }
];

window.locaisMapa = {
    "p1": { nome: "Praça Central", x: 50, y: 50 }, "p2": { nome: "Ramen Fantasma", x: 35, y: 65 }, "p3": { nome: "Viela da Fome", x: 15, y: 65 }, "p4": { nome: "Clube Neon", x: 50, y: 80 },
    "p5": { nome: "Avenida Ouro", x: 35, y: 35 }, "p6": { nome: "Bar Submundo", x: 15, y: 35 }, "p7": { nome: "Beco Sombrio", x: 15, y: 50 }, "p8": { nome: "Esconderijo Alfa", x: 15, y: 80 },
    "p9": { nome: "Alameda das Sombras", x: 65, y: 35 }, "p10":{ nome: "Apts Safehouse", x: 85, y: 35 }, "p11":{ nome: "Covil de Hackers", x: 85, y: 50 }, "p12":{ nome: "Mercado Negro", x: 85, y: 65 },
    "p13":{ nome: "QG da Yakuza", x: 65, y: 80 }, "p14":{ nome: "Parque Sombrio", x: 85, y: 80 }, "p15":{ nome: "Cemitério", x: 35, y: 80 }
};
window.conexoesMapa = [ {de:"p1", para:"p2"}, {de:"p2", para:"p3"}, {de:"p1", para:"p4"}, {de:"p1", para:"p5"}, {de:"p5", para:"p6"}, {de:"p1", para:"p9"}, {de:"p9", para:"p10"}, {de:"p10", para:"p11"}, {de:"p11", para:"p12"}, {de:"p2", para:"p13"}, {de:"p13", para:"p14"}, {de:"p3", para:"p8"}, {de:"p7", para:"p6"}, {de:"p3", para:"p7"}, {de:"p2", para:"p15"}, {de:"p4", para:"p13"} ];
window.rotasSecretasGaia = [ {de:"p1", para:"p6"}, {de:"p15", para:"p10"}, {de:"p8", para:"p14"}, {de:"p11", para:"p4"} ];

window.filtroLojaAtual = "Promoções"; window.editandoItemId = null; window.termoBuscaLoja = "";
window.GRID_COLS = 5; window.GRID_ROWS = 3; window.CELL_SIZE = 45; window.GRID_GAP = 1; window.REAL_CELL_SIZE = window.CELL_SIZE + window.GRID_GAP;
window.tetrisMatrix = []; window.arrastandoKey = null; window.itemArrastado = null; window.offsetX = 0; window.offsetY = 0; window.origin = null; window.initPos = {c:-1, r:-1};

window.titulosExtensos = [ "Novato|com|0", "Alvo Fácil|com|500", "Rato de Beco|com|800", "Corredor|com|1000", "Sobrevivente|com|1200", "Apostador|com|1500", "Lutador|inc|2000", "Atirador|inc|2500", "Sombra|inc|3000", "Estrategista|rar|6000", "Investigador|rar|7000", "O Hacker|epi|12000", "Ceifador|epi|30000", "Demônio de Neon|leg|40000", "Deus das Apostas|leg|45000", "A Lenda Viva|leg|60000", "Líder Supremo|leg|100000" ];

try { firebase.initializeApp(window.firebaseConfig); window.db = firebase.database(); } catch (e) { console.error("Firebase falhou:", e); }

window.setElText = function(id, t) { let e = document.getElementById(id); if(e) e.innerText = t; };
window.setElHTML = function(id, h) { let e = document.getElementById(id); if(e) e.innerHTML = h; };
window.setElDisplay = function(id, d) { let e = document.getElementById(id); if(e) e.style.display = d; };
window.setElVal = function(id, v) { let e = document.getElementById(id); if(e) e.value = v; };

window.showNeonToast = function(msg) { let t = document.getElementById("neonToast"); if(t) { t.innerText = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3000); } };
window.fecharDadoOverlay = function() { if(window.currentSpinInterval) clearInterval(window.currentSpinInterval); if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout); window.setElDisplay("globalDiceOverlay", "none"); };

window.getSafeRpg = function(u) { 
    let d = { for: 1, agi: 1, man: 1, vig: 1, int: 1, pontosLivres: 3, nivel: 1, integridade: 100, hp: 100 }; 
    if (!u || !u.rpg) return d; let r = u.rpg; let spent = Math.max(0, (r.for||1)-1) + Math.max(0, (r.agi||1)-1) + Math.max(0, (r.man||1)-1) + Math.max(0, (r.vig||1)-1) + Math.max(0, (r.int||1)-1); let realPts = Math.max(0, 3 + ((r.nivel||1)-1) - spent);
    return { for: r.for||1, agi: r.agi||1, man: r.man||1, vig: r.vig||1, int: r.int||1, pontosLivres: (r.pontosLivres!==undefined)?r.pontosLivres:realPts, nivel: r.nivel||1, integridade: (r.integridade!==undefined)?r.integridade:100, hp: (r.hp!==undefined)?r.hp:100 };
};
window.calcularMaxInteg = function(u) { let m = 100; if(u && u.mochila) Object.values(u.mochila).forEach(i => { if(i.tipo==="Móvel" && i.inHouse === true && i.buffType==="integ" && i.poder) m += parseInt(i.poder); }); return m; };
window.calcularBuffsMoveis = function(u) { let buffs = { for:0, agi:0, int:0, vig:0, man:0 }; if(u && u.mochila) Object.values(u.mochila).forEach(i => { if(i.tipo==="Móvel" && i.inHouse === true && i.buffType && i.poder && buffs[i.buffType] !== undefined) buffs[i.buffType] += parseInt(i.poder); }); return buffs; };
window.calcularDefesa = function(u) { let def = 0; if(u && u.mochila) { Object.values(u.mochila).forEach(i => { if(i.eq && i.tipo === 'Roupa') def += (parseInt(i.poder) || 0); }); } return def; };
window.getPesoStatus = function(u) { let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u); let max = 10 + ((r.for+buffs.for)*5); let peso = 0; if(u?.mochila) Object.values(u.mochila).forEach(i => peso += (parseInt(i.peso)||1)); return {atual:peso, max:max, sobrepeso: peso > max}; };

// =========================================================
// 4. INTERFACE GLOBAL E SISTEMA OS
// =========================================================
window.abrirCelularMain = function() { window.setElDisplay("phoneOverlay", "flex"); window.voltarPhoneMain(); };
window.fecharCelular = function() { window.setElDisplay("phoneOverlay", "none"); };
window.abrirIgambleMenu = function() { let frame = document.getElementById('phoneFrameUI'); let mainScreen = document.getElementById('phoneMainScreen'); let igambleScreen = document.getElementById('phoneIgambleScreen'); let closeBtn = document.getElementById('btnClosePhone'); if (frame) frame.style.backgroundImage = "url('bg2.png')"; if (mainScreen) mainScreen.style.display = "none"; if (igambleScreen) igambleScreen.style.display = "block"; if (closeBtn) closeBtn.style.display = "none"; };
window.voltarPhoneMain = function() { let frame = document.getElementById('phoneFrameUI'); let mainScreen = document.getElementById('phoneMainScreen'); let igambleScreen = document.getElementById('phoneIgambleScreen'); let closeBtn = document.getElementById('btnClosePhone'); if (frame) frame.style.backgroundImage = "url('bg.png')"; if (mainScreen) mainScreen.style.display = "grid"; if (igambleScreen) igambleScreen.style.display = "none"; if (closeBtn) closeBtn.style.display = "flex"; };
window.abrirIgambleApp = function(tabName) { window.abrirApp('tab-igamble'); let btn = document.querySelector(`.igamble-nav button[onclick*="${tabName}"]`); if(btn) window.switchIGambleTab(tabName, btn); };
window.voltarParaMenuIgamble = function() { window.fecharApp(); window.abrirCelularMain(); window.abrirIgambleMenu(); };

window.abrirApp = function(appId, isLocked, lockMsg) {
    if(isLocked) { window.showNeonToast(lockMsg); return; }
    window.fecharCelular(); window.setElDisplay("gameContainer", "block"); window.setElDisplay("btnHomeApp", "flex");
    if(appId === 'tab-igamble') window.setElDisplay("btnBackIgamble", "flex"); else window.setElDisplay("btnBackIgamble", "none");
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); let a = document.getElementById(appId); if(a) a.classList.add('active');
    if(appId === 'tab-mapa') window.desenharMapa(true); if(appId === 'tab-personagem') window.renderizarMochila(); if(appId === 'tab-casa') window.drawCasaBoard(); if(appId === 'tab-panteao') window.renderizarPanteao();
    if(appId === 'tab-igamble') { setTimeout(() => { let chatBox = document.getElementById("chatMessages"); if(chatBox) chatBox.scrollTop = chatBox.scrollHeight; }, 50); }
};

window.fecharApp = function() { 
    window.removerDoVttLocal();
    window.setElDisplay("gameContainer", "none"); window.setElDisplay("btnHomeApp", "none"); window.setElDisplay("btnBackIgamble", "none"); 
};
window.abrirModal = function() { window.setElDisplay("loginModal", "flex"); if(window.jogadorAtual) { window.setElDisplay("loginScreen", "none"); window.setElDisplay("profileScreen", "block"); } else { window.setElDisplay("loginScreen", "block"); window.setElDisplay("profileScreen", "none"); } };
window.fecharModal = function() { window.setElDisplay("loginModal", "none"); };
window.toggleDesktopSidebar = function() { let s = document.getElementById("sidebarAgents"); if(s) s.classList.toggle("minimized"); };
window.salvarPerfil = function(campo, valor) { if(window.jogadorAtual) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/perfil/${campo}`).set(valor); };

window.renderizarFicha = function() {
    if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual]) return;
    let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let mInteg = window.calcularMaxInteg(u); let buffs = window.calcularBuffsMoveis(u); let def = window.calcularDefesa(u);
    
    // --- LÓGICA DA ESTRELA NO PERFIL (GLOBAL) ---
    let popTierKey = u.popTier || "branca";
    let tData = window.popularityTiers ? (window.popularityTiers[popTierKey] || window.popularityTiers["branca"]) : {cor:"#fff", icone:"⭐"};
    let nomeDisplay = u.nome || window.jogadorAtual;
    
    if(window.isMaster) {
        let selectTier = `<select onchange="window.mudarPopTier('${window.jogadorAtual}', this.value)" style="margin-left:10px; background:#000; color:${tData.cor}; border:1px solid ${tData.cor}; border-radius:4px; font-size:12px; outline:none; cursor:pointer; width: 130px; display: inline-block;">
            <option value="branca" ${popTierKey==="branca"?"selected":""}>⭐ Branca</option>
            <option value="verde" ${popTierKey==="verde"?"selected":""}>🌟 Verde</option>
            <option value="azul" ${popTierKey==="azul"?"selected":""}>💫 Azul</option>
            <option value="dourado" ${popTierKey==="dourado"?"selected":""}>✨ Dourado</option>
            <option value="roxo" ${popTierKey==="roxo"?"selected":""}>🌠 Roxo</option>
        </select>`;
        window.setElHTML("fichaNome", nomeDisplay + selectTier);
    } else {
        window.setElHTML("fichaNome", nomeDisplay + ` <span style="color:${tData.cor}; text-shadow:0 0 10px ${tData.cor};" title="Classe de Fama atual">${tData.icone}</span>`);
    }
    // --------------------------------------------

    if(document.getElementById("fichaSerial")) window.setElText("fichaSerial", u.serial || "----");
    
    let avURL = u.charImgUrl || u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    if(document.getElementById("myAvatarImg")) document.getElementById("myAvatarImg").src = avURL;
    
    if(document.getElementById("perfilSobrenome")) window.setElVal("perfilSobrenome", u.perfil?.sobrenome || ""); if(document.getElementById("perfilIdade")) window.setElVal("perfilIdade", u.perfil?.idade || "");
    window.setElText("lblDef", def); if(document.getElementById("lblPtsOS")) document.getElementById("lblPtsOS").innerText = r.pontosLivres; window.setElText("lblPts", r.pontosLivres);
    window.setElText("valFor", r.for + buffs.for); window.setElText("valAgi", r.agi + buffs.agi); window.setElText("valMan", r.man + buffs.man); window.setElText("valVig", r.vig + buffs.vig); window.setElText("valInt", r.int + buffs.int);
    window.setElText("lblIntegMax", mInteg); window.setElText("lblIntegVal", r.integridade + "%");
    let hpInp = document.getElementById("hpInput"); if(hpInp && document.activeElement !== hpInp) hpInp.value = r.hp;
    let bar = document.getElementById("integrityBar"); if(bar) { let pct = (r.integridade / mInteg) * 100; bar.style.width = Math.min(pct,100) + "%"; bar.style.background = r.integridade < 30 ? "#ff0000" : "#00ff00"; }
    let temCel = u.numero ? true : false; let temCasa = (u.casa && Object.keys(u.casa).length > 0) ? true : false;
    if (u.mochila) { Object.values(u.mochila).forEach(i => { let nomeItem = (i.nome || "").toLowerCase(); let tipoItem = (i.tipo || "").toLowerCase(); if (tipoItem === 'tecnologia' || nomeItem.includes('celular') || nomeItem.includes('telefone') || nomeItem.includes('gamblenger')) temCel = true; if (tipoItem === 'móvel' || tipoItem === 'movel') temCasa = true; }); }
    if (temCel && !u.numero && window.jogadorAtual !== "MESTRE") { let novoNumero = "9" + Math.floor(1000 + Math.random() * 9000).toString(); u.numero = novoNumero; window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/numero`).set(novoNumero).then(() => { window.showNeonToast(`📱 Celular Ativado! Seu novo número é: ${novoNumero}`); if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", novoNumero); }); }
    if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", u.numero || "Sem Sinal");
    let iCel = document.getElementById('hb-celular'); if(iCel) { if(temCel || window.isMaster) { iCel.classList.remove('locked'); iCel.onclick = () => { window.abrirApp('tab-celular', false); window.carregarContatosSMS(); }; } else { iCel.classList.add('locked'); iCel.onclick = () => window.abrirApp('none', true, "Gamblenger Fora do Ar! Compre um Celular."); } }
    let iCasa = document.getElementById('hb-casa'); if(iCasa) { if(temCasa || window.isMaster) { iCasa.classList.remove('locked'); iCasa.onclick = () => window.abrirApp('tab-casa', false); } else { iCasa.classList.add('locked'); iCasa.onclick = () => window.abrirApp('none', true, "Gamble House Bloqueada! Compre um Imóvel."); } }
};

window.desenharListaUsuarios = function() {
    let b = document.getElementById("userLog"); if(!b) return; b.innerHTML = ""; let hideOff = document.getElementById("checkOnline")?.checked;
    let sortedUsers = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE").sort((a, b) => { let aOn = window.presenceGlobal[a] === true && window.usersGlobais[a].status !== "morto"; let bOn = window.presenceGlobal[b] === true && window.usersGlobais[b].status !== "morto"; return (aOn === bOn) ? 0 : aOn ? -1 : 1; });
    
    sortedUsers.forEach(n => { 
        let u = window.usersGlobais[n]; let r = window.getSafeRpg(u); let isD = (u.status==="morto"); let isO = window.presenceGlobal[n]===true&&!isD; 
        if(hideOff && !isO && !isD) return; 

        let masterTools = "";
        if(window.isMaster) {
            let pTier = u.popTier || "branca";
            masterTools = `
            <div style="margin-top:8px; border-top: 1px dashed #333; padding-top: 8px;">
                <span style="font-size:10px; color:#aaa; font-weight:bold;">Mudar Fama:</span>
                <select onchange="window.mudarPopTier('${n}', this.value)" style="background:#000; color:#fff; font-size:11px; padding:4px; border:1px solid var(--accent-blue); border-radius:4px; width: 100%; margin-top:3px;">
                    <option value="branca" ${pTier==="branca"?"selected":""}>⭐ Branca (Comum)</option>
                    <option value="verde" ${pTier==="verde"?"selected":""}>🌟 Verde (Épico)</option>
                    <option value="azul" ${pTier==="azul"?"selected":""}>💫 Azul (Raro)</option>
                    <option value="dourado" ${pTier==="dourado"?"selected":""}>✨ Dourado (Astro)</option>
                    <option value="roxo" ${pTier==="roxo"?"selected":""}>🌠 Roxo (SuperStar)</option>
                </select>
            </div>`;
        }

        b.innerHTML += `<div class="user-item" style="opacity:${isD?0.5:1};"><span class="status-dot ${isD?'dead':(isO?'online':'offline')}"></span><strong style="color:${isO?'var(--accent-blue)':'#aaa'};">${n}</strong><br><span style="font-size:11px;color:#ff2a5f">${u.carteira||0}¥</span><div class="hp-display">❤️ HP: ${r.hp}</div>${masterTools}</div>`; 
    });
};

// =========================================================
// 5. SISTEMA RPG E DADOS
// =========================================================
window.renderizarPanteao = function() {
    let u = window.usersGlobais[window.jogadorAtual] || {}; let currentGod = u.deus || "Nenhum";
    let gachaC = document.getElementById("gachaDisplay"); if(gachaC) gachaC.innerHTML = `<h2 style="color:#555; margin:0;">[ SEU DEUS ]</h2><h3 class="neon-purple" style="font-size:28px; margin-top:10px;">${currentGod}</h3>`;
    let list = document.getElementById("allGodsList"); if(!list) return; list.innerHTML = "";
    window.deusesPanteao.forEach(g => { let gNameClean = g.nome.split(" ")[0]; let isMine = (currentGod === g.nome || currentGod.includes(gNameClean)); list.innerHTML += `<div class="card ${isMine?'selected':''}" style="height:auto; min-height:80px; cursor:default; width:200px; padding:10px;"><h3 style="margin:0 0 5px 0; font-size:14px; color:${isMine?'#0f0':'var(--accent-purple)'};">${g.nome}</h3><p style="font-size:11px; color:#aaa; margin:0; line-height:1.2;">${g.desc}</p></div>`; });
};

window.girarRoletaPanteao = function() {
    if(!window.jogadorAtual) return; let u = window.usersGlobais[window.jogadorAtual]; if((u.carteira || 0) < 500) { alert("Você precisa de 500 ¥ para girar a Roleta Divina."); return; } window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(u.carteira - 500);
    let btn = document.getElementById("btnRoletaDeus"); if(btn) btn.disabled = true; let display = document.getElementById("gachaDisplay"); if(!display) return; display.innerHTML = "";
    if(window.currentSpinInterval) clearInterval(window.currentSpinInterval); if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout);
    let counter = 0;
    window.currentSpinInterval = setInterval(() => { let g1 = window.deusesPanteao[Math.floor(Math.random() * window.deusesPanteao.length)]; let g2 = window.deusesPanteao[Math.floor(Math.random() * window.deusesPanteao.length)]; display.innerHTML = `<div class="card spinning" style="width:140px; height:160px; padding:10px;"><h3 style="font-size:14px;margin:0;">${g1.nome}</h3></div><div class="card spinning" style="width:140px; height:160px; padding:10px;"><h3 style="font-size:14px;margin:0;">${g2.nome}</h3></div>`; counter++;
        if(counter > 15) { clearInterval(window.currentSpinInterval); let shuffled = [...window.deusesPanteao].sort(() => 0.5 - Math.random()); let op1 = shuffled[0]; let op2 = shuffled[1]; display.innerHTML = `<div class="card" style="width:180px; height:auto; padding:15px; cursor:pointer;" onclick="window.escolherDeusFinal('${op1.nome}')"><h3 style="font-size:14px;">${op1.nome}</h3><p style="font-size:11px;color:#aaa;">${op1.desc}</p><button class="action-btn" style="margin-top:10px;">Escolher</button></div><div class="card" style="width:180px; height:auto; padding:15px; cursor:pointer;" onclick="window.escolherDeusFinal('${op2.nome}')"><h3 style="font-size:14px;">${op2.nome}</h3><p style="font-size:11px;color:#aaa;">${op2.desc}</p><button class="action-btn" style="margin-top:10px;">Escolher</button></div>`; }
    }, 100);
};

window.escolherDeusFinal = function(n) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/deus`).set(n); window.showNeonToast(`Patrono ${n} Escolhido!`); let b = document.getElementById("btnRoletaDeus"); if(b) b.disabled=false; let g = document.getElementById("gachaDisplay"); if(g) g.innerHTML = `<h2 style="color:#555; margin:0;">[ ROLETA DIVINA ]</h2>`; window.renderizarPanteao(); window.desenharMapa(); };

window.mostrarDadoOverlay = function(n, f, res, maxFaces = 20) {
    let ov = document.getElementById("globalDiceOverlay");
    if(document.getElementById("diceRollerName")) document.getElementById("diceRollerName").innerText = "Agente: " + n; 
    if(document.getElementById("diceFormulaLabel")) document.getElementById("diceFormulaLabel").innerText = "Ação: " + f;
    let sp = document.getElementById("diceSpinners"); let dRes = document.getElementById("diceFinalResult");
    if(sp) { sp.style.display = "flex"; sp.innerHTML = ""; for(let i=0; i<res.length; i++) sp.innerHTML += `<div class="dice-number">?</div>`; }
    if(dRes) dRes.style.display = "none";
    if(ov) ov.style.display = "flex";
    if(window.currentSpinInterval) clearInterval(window.currentSpinInterval); if(window.currentSpinTimeout) clearTimeout(window.currentSpinTimeout);
    let sc = 0; window.currentSpinInterval = setInterval(() => {
        let temp = ""; for(let i=0; i<res.length; i++) temp += `<div class="dice-number">${Math.floor(Math.random()*maxFaces)+1}</div>`;
        if(sp) sp.innerHTML = temp; sc++;
        if(sc > 15) { clearInterval(window.currentSpinInterval); if(sp) sp.style.display = "none"; if(dRes) { dRes.style.display = "flex"; dRes.innerHTML = ""; res.forEach(v => { dRes.innerHTML += `<div class="dice-result-box">${v}</div>`; }); } window.currentSpinTimeout = setTimeout(() => { if(ov) ov.style.display = "none"; }, 3000); }
    }, 80);
};

window.lancarDadoCustom = function(t) { if(!window.jogadorAtual) return; let max = parseInt(t.replace('1d','')); let res = Math.floor(Math.random() * max) + 1; window.mostrarDadoOverlay(window.jogadorAtual, t, [res], max); window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Rolou ${t}: <span class="dice-result-box">${res}</span>` }); window.db.ref('tokyoRpg/currentRoll').set({ nome: window.jogadorAtual, form: t, results: [res], ts: Date.now() }); };
window.rolarAtributo = function(nome, key) { if(!window.jogadorAtual) return; let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u); let qtd = r[key] + buffs[key]; if(qtd < 1) qtd = 1; let results = []; for(let i=0; i<qtd; i++) results.push(Math.floor(Math.random()*20)+1); let formStr = `${nome} (${qtd}d20)`; window.mostrarDadoOverlay(window.jogadorAtual, formStr, results, 20); window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Rolou ${formStr}: <span class="dice-result-box">${results.join('</span> <span class="dice-result-box">')}</span>` }); window.db.ref('tokyoRpg/currentRoll').set({ nome: window.jogadorAtual, form: formStr, results: results, ts: Date.now() }); };
window.rolarPericiaSelect = function() { let s = document.getElementById("comboPericias"); if(s) { let v=s.value.split('|'); window.rolarAtributo(v[0], v[1]); } };
window.atualizarHP = function() { let hp = parseInt(document.getElementById("hpInput").value); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/hp`).set(hp); };
window.distribuirPonto = function(key) { let r = window.getSafeRpg(window.usersGlobais[window.jogadorAtual]); if(r.pontosLivres > 0) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/${key}`).set(r[key]+1); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/pontosLivres`).set(r.pontosLivres-1); } };

// =========================================================
// MAPA GLOBAL E VTT
// =========================================================
window.VTT_CELL_SIZE = 50; 
window.dmPropsCache = window.dmPropsCache || [];

let vttBootInterval = setInterval(() => {
    if (window.db && window.jogadorAtual) {
        clearInterval(vttBootInterval);
        
        let isMapOpen = () => {
            let t = document.getElementById('tab-mapa');
            return t && (t.style.display === 'block' || t.style.display === 'flex' || t.classList.contains('active'));
        };

        window.db.ref('tokyoRpg/submapConfig').on('value', s => { 
            window.submapasConfig = s.val() || {}; 
            if(window.currentSubMapKey && isMapOpen()) { window.initTacticalBoard(); window.updateTacticalBoard(); }
        });
        
        window.db.ref('tokyoRpg/submapsBGs').on('value', s => { 
            window.submapasBGs = s.val() || {}; 
            if(window.currentSubMapKey) { 
                let wrapper = document.getElementById("vttWorldWrapper"); 
                let bgUrl = window.submapasBGs[window.currentSubMapKey];
                if(wrapper && bgUrl) {
                    wrapper.style.backgroundImage = `url("${bgUrl}")`; 
                    wrapper.style.backgroundSize = "cover";
                    wrapper.style.backgroundPosition = "center";
                }
            }
        });
        // ATENÇÃO: As escutas do Firebase para 'submaps', 'turnosVTT' e 'currentClash' foram removidas de propósito para o Socket.io assumir e tirar o lag!
    }
}, 1000);

window.desenharMapa = function(forcarVisibilidade = false) {
    let tabMapa = document.getElementById("tab-mapa"); if(tabMapa && forcarVisibilidade) tabMapa.style.display = "flex";
    let mc = document.getElementById("mapCanvas"); let sc = document.getElementById("subMapCanvas"); 
    if(window.currentSubMapKey) { if(mc) mc.style.display = "none"; if(sc) sc.style.display = "flex"; } else { if(mc) mc.style.display = "block"; if(sc) sc.style.display = "none"; }
    if(!mc) return; mc.innerHTML = "";
    
    let svg = `<svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2;">`;
    window.conexoesMapa.forEach(c => { 
        let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; 
        if(p1&&p2) { let p1x = p1.gx !== undefined ? p1.gx : p1.x; let p1y = p1.gy !== undefined ? p1.gy : p1.y; let p2x = p2.gx !== undefined ? p2.gx : p2.x; let p2y = p2.gy !== undefined ? p2.gy : p2.y; svg += `<line x1="${p1x}%" y1="${p1y}%" x2="${p2x}%" y2="${p2y}%" stroke="var(--accent-blue)" stroke-width="2" opacity="0.6"/>`; }
    });
    
    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus?.includes("Gaia"));
    if(isGaia || window.isMaster) {
        window.rotasSecretasGaia.forEach(c => { 
            let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; 
            if(p1&&p2) { let p1x = p1.gx !== undefined ? p1.gx : p1.x; let p1y = p1.gy !== undefined ? p1.gy : p1.y; let p2x = p2.gx !== undefined ? p2.gx : p2.x; let p2y = p2.gy !== undefined ? p2.gy : p2.y; svg += `<line x1="${p1x}%" y1="${p1y}%" x2="${p2x}%" y2="${p2y}%" stroke="#00ff00" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>`; }
        });
    }
    svg += `</svg>`; mc.innerHTML = svg;
    
    Object.keys(window.locaisMapa).forEach(key => { let loc = window.locaisMapa[key]; let node = document.createElement("div"); node.className = "map-node"; let nX = loc.gx !== undefined ? loc.gx : loc.x; let nY = loc.gy !== undefined ? loc.gy : loc.y; node.style.left = nX + "%"; node.style.top = nY + "%"; node.innerHTML = `<span class="node-label">${loc.nome}</span>`; node.onclick = () => window.tentarViajar(key); mc.appendChild(node); });

    Object.keys(window.usersGlobais).forEach(n => {
        if(n === "MESTRE") return;
        let u = window.usersGlobais[n];
        if(u.status === "morto" || !window.presenceGlobal[n]) return;
        let locKey = u.localAtual || "p1";
        let pData = window.locaisMapa[locKey];
        if(pData) {
            let av = document.createElement("img");
            // AQUI: Puxa a Imagem Customizada primeiro para o mapa do mundo
            av.src = u.charImgUrl || u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
            av.className = "avatar-on-map";
            let rX = (Math.random() * 20) - 10; let rY = (Math.random() * 20) - 10;
            av.style.left = `calc(${pData.gx || pData.x}% + ${rX}px)`; av.style.top = `calc(${pData.gy || pData.y}% + ${rY}px)`;
            mc.appendChild(av);
        }
    });
};

window.tentarViajar = function(destinoKey) {
    if(window.isMaster) {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/localAtual`).set(destinoKey);
        window.abrirSubMapa(destinoKey); return;
    }

    let u = window.usersGlobais[window.jogadorAtual];
    let localAtual = u.localAtual || "p1";
    
    if(localAtual === destinoKey) { window.abrirSubMapa(destinoKey); return; }

    let isConnected = window.conexoesMapa.some(c => (c.de === localAtual && c.para === destinoKey) || (c.para === localAtual && c.de === destinoKey));
    let isGaia = u.deus && u.deus.includes("Gaia");
    if(!isConnected && isGaia) { isConnected = window.rotasSecretasGaia.some(c => (c.de === localAtual && c.para === destinoKey) || (c.para === localAtual && c.de === destinoKey)); }

    if(!isConnected) { window.showNeonToast("Muito longe! Viaje pelas rotas conectadas."); return; }

    let r = window.getSafeRpg(u); let custoViagem = 10;
    if(r.integridade < custoViagem) { window.showNeonToast(`Cansado! Requer ${custoViagem}% de Saturação para viajar.`); return; }

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(Math.max(0, r.integridade - custoViagem));
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/localAtual`).set(destinoKey);
    window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Viajou para <span class="neon-blue">${window.locaisMapa[destinoKey].nome}</span> (-${custoViagem}% Saturação)` });
    window.abrirSubMapa(destinoKey);
};

window.atualizarBgFace = function(localKey) {
    let faceImg = document.getElementById("charFaceDisplay");
    if(!faceImg) return;
    
    // Se saiu do VTT e voltou pro Mapa Global, fica com fundo preto
    if(!localKey) {
        faceImg.style.backgroundImage = "none";
        faceImg.style.boxShadow = "none";
        return;
    }

    let loc = window.locaisMapa[localKey];
    if(loc) {
        // Pega o nome do mapa e troca os espaços por underline (Ex: "Ramen Fantasma" vira "Ramen_Fantasma")
        let nomeArquivo = loc.nome.replace(/\s+/g, "_");
        
        // Injeta a foto atrás do seu personagem
        faceImg.style.backgroundImage = `url('img/bg/${nomeArquivo}.png')`;
        faceImg.style.backgroundSize = "cover";
        faceImg.style.backgroundPosition = "center";
        
        // Adiciona uma sombra escura nas bordas para o rosto do personagem destacar mais
        faceImg.style.boxShadow = "inset 0 0 40px rgba(0,0,0,0.8)";
    }
};

window.abrirSubMapa = function(localKey) {
    window.currentSubMapKey = localKey; 
    
    // 1. Avisa o Socket que você entrou na sala
    window.socket.emit("joinMap", localKey);
    
    let tabMapa = document.getElementById("tab-mapa"); if(tabMapa) tabMapa.style.display = "flex"; 
    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "none"; 
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "flex";
    
    let loc = window.locaisMapa[localKey] || { nome: localKey.replace(/_/g, " ") }; 
    let titleEl = document.getElementById("subMapTitle"); if(titleEl) titleEl.innerText = loc.nome;
    
    let bgUrl = window.submapasBGs[localKey] || ""; let wrapper = document.getElementById("vttWorldWrapper"); 
    if(wrapper) { 
        wrapper.style.backgroundImage = bgUrl ? `url('${bgUrl}')` : "none"; 
        wrapper.style.backgroundSize = "cover";
        wrapper.style.backgroundPosition = "center";
    }
    
    window.atualizarBgFace(localKey);
    window.initTacticalBoard(); 
    
    // 2. Puxa os dados do tabuleiro APENAS UMA VEZ (.once) e entrega pro Socket
    if(window.jogadorAtual && window.db) { 
        window.db.ref(`tokyoRpg/submaps/${localKey}`).once('value', s => { 
            let currentGrid = s.val() || {}; 
            window.submapasGlobais[localKey] = currentGrid;
            
            if(!Object.values(currentGrid).includes(window.jogadorAtual)) {
                let up = {}; up[`0_0`] = window.jogadorAtual;
                window.socket.emit("moverToken", { mapKey: localKey, updates: up });
                window.db.ref(`tokyoRpg/submaps/${localKey}/0_0`).set(window.jogadorAtual); 
                window.submapasGlobais[localKey]["0_0"] = window.jogadorAtual;
            }
            window.updateTacticalBoard();
        });

        window.db.ref(`tokyoRpg/turnosVTT/${localKey}`).once('value', s => {
            let turnData = s.val() || {};
            window.allTurnosVTT[localKey] = turnData;
            window.turnosVTTGlobal = turnData;
            window.updateTacticalBoard();
        });

        window.db.ref(`tokyoRpg/submapsTraps/${localKey}`).once('value', s => {
            window.submapasTraps[localKey] = s.val() || {};
            window.updateTacticalBoard();
        });
    }
};
window.removerDoVttLocal = function() {
    // CORREÇÃO: Salva o nome do mapa atual numa variável segura ANTES do sistema apagar
    let mapaParaSair = window.currentSubMapKey; 
    
    if(mapaParaSair && window.jogadorAtual && window.db) {
        window.db.ref(`tokyoRpg/submaps/${mapaParaSair}`).once('value').then(s => {
            let g = s.val() || {}; 
            let k = Object.keys(g).find(key => g[key] === window.jogadorAtual);
            if(k) window.db.ref(`tokyoRpg/submaps/${mapaParaSair}/${k}`).remove();
        }).catch(e => console.error("Ignorando erro de sincronia:", e));
    }
};
window.fecharSubMapa = function() { 
    try {
        window.removerDoVttLocal(); 
        
        // Limpa a chave da sala da memória
        window.currentSubMapKey = ""; 
        
        // Força a troca de telas IMEDIATAMENTE antes de qualquer outra coisa
        let sc = document.getElementById("subMapCanvas"); 
        if(sc) sc.style.display = "none"; 
        
        let mc = document.getElementById("mapCanvas"); 
        if(mc) mc.style.display = "block"; 
        
        // Limpa a foto de fundo e recarrega o mapa mundi
        window.atualizarBgFace(null);
        window.desenharMapa(true);
        
    } catch(err) {
        console.error("Erro crítico ao fechar o mapa:", err);
        window.showNeonToast("Erro forçado ao sair! Pressione F5.");
    }
};

window.mudarBgSubMapa = function() { let url = document.getElementById("vttBgInp").value; if(window.db && window.currentSubMapKey) { window.db.ref(`tokyoRpg/submapsBGs/${window.currentSubMapKey}`).set(url); window.showNeonToast("Fundo Salvo!"); } };
window.salvarFormatoMapa = function() { if(!window.isMaster || !window.currentSubMapKey) return; let cols = parseInt(document.getElementById("vttColsInp").value) || 16; let rows = parseInt(document.getElementById("vttRowsInp").value) || 12; let shape = document.getElementById("vttShapeInp").value || "quadrado"; window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}`).update({ cols: cols, rows: rows, shape: shape }); window.showNeonToast(`Terreno alterado para ${cols}x${rows}!`); };

window.initTacticalBoard = function() {
    try {
        let b = document.getElementById("gridCells"); if(!b) return; b.innerHTML = "";
        let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia"));
        let conf = window.submapasConfig[window.currentSubMapKey] || {};
        let cols = conf.cols || 16; let rows = conf.rows || 12; let shape = conf.shape || 'quadrado'; let cellsData = conf.cells || {}; let cellSize = window.VTT_CELL_SIZE || 50; 

        let wrapper = document.getElementById("vttWorldWrapper");
        if(wrapper) { wrapper.style.width = (cols * cellSize) + "px"; wrapper.style.height = (rows * cellSize) + "px"; }
        b.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`; b.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                let cid = `${x}_${y}`; let cData = cellsData[cid] || {}; let isObs = cData.obs || false; let obsClass = isObs ? (isGaia ? "cell-obstacle-gaia" : "cell-obstacle") : "";
                
                let isHidden = false;
                if (shape === 'l_shape') { if (x >= Math.floor(cols/2) && y < Math.floor(rows/2)) isHidden = true; } 
                else if (shape === 'u_shape') { if (x >= Math.floor(cols/4) && x < Math.floor(cols*0.75) && y < Math.floor(rows/2)) isHidden = true; } 
                else if (shape === 'cross') { if ((x < Math.floor(cols/3) || x >= Math.floor(cols*0.66)) && (y < Math.floor(rows/3) || y >= Math.floor(rows*0.66))) isHidden = true; } 
                else if (shape === 'corredor') { if (y < Math.floor(rows/3) || y >= Math.floor(rows*0.66)) isHidden = true; } 
                else if (shape === 'hexagono') { let hW = cols/2; let hH = rows/2; if ((Math.abs(x - hW + 0.5) / hW) + (Math.abs(y - hH + 0.5) / hH) > 1.3) isHidden = true; }

                let cell = document.createElement("div"); cell.id = `cell_${x}_${y}`; cell.className = `tactical-cell ${obsClass} ${isHidden ? "hidden-vtt-cell" : ""}`;
                if (!isHidden) { 
                    if(window.isMaster) { cell.oncontextmenu = (e) => { if(e.target === cell) { e.preventDefault(); window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/obs`).set(!isObs); window.showNeonToast(!isObs ? "Bloqueado!" : "Livre!"); } }; }
                    cell.onclick = () => window.clicarGrid(x, y, isObs);
                }
                b.appendChild(cell);
            }
        }
    } catch(e) { console.error("Erro critico no grid:", e); }
};

// =========================================================
// MATEMÁTICA DO VTT: ÁREA, PULO E MIRA EXATOS
// =========================================================
window.getAffectedCellsMap = function(cx, cy, px, py, customPattern) {
    let affectedMap = {}; 
    if (!customPattern || !customPattern.startsWith("{")) return affectedMap;

    let pat = {}; try { pat = JSON.parse(customPattern); } catch(e) { return affectedMap; }
    
    // Calcula a direção que o player tá olhando baseado onde o mouse tá
    let diffX = cx - px; let diffY = cy - py; let dir = "UP";
    if (Math.abs(diffX) > Math.abs(diffY)) { dir = diffX > 0 ? "RIGHT" : "LEFT"; } 
    else if (diffX !== 0 || diffY !== 0) { dir = diffY > 0 ? "DOWN" : "UP"; }

    Object.keys(pat.effectMask || {}).forEach(relCoord => {
        let [dxStr, dyStr] = relCoord.split("_");
        let dx = parseInt(dxStr); let dy = parseInt(dyStr);
        let sqData = pat.effectMask[relCoord];

        if (pat.castType === "alvo") { 
            // Explosão sai do lugar exato que você clicou no mapa (cx, cy)
            affectedMap[`${cx + dx}_${cy + dy}`] = sqData;
        } else if (pat.castType === "aura") { 
            // Explosão em volta do próprio corpo (px, py)
            affectedMap[`${px + dx}_${py + dy}`] = sqData;
        } else { 
            // DIRECIONAL: Rotação geométrica exata pro lado que o mouse aponta
            let finalDx = dx; let finalDy = dy;
            if (dir === "RIGHT") { finalDx = -dy; finalDy = dx; } 
            else if (dir === "DOWN") { finalDx = -dx; finalDy = -dy; } 
            else if (dir === "LEFT") { finalDx = dy; finalDy = -dx; }
            affectedMap[`${px + finalDx}_${py + finalDy}`] = sqData;
        }
    });
    return affectedMap;
};

window.clearHighlightTargetCells = function() { 
    document.querySelectorAll(".target-hover").forEach(c => {
        c.classList.remove("target-hover"); c.style.backgroundColor = ""; 
        let emoji = c.querySelector('.vtt-aim-emoji'); if(emoji) emoji.remove(); 
    }); 
};

window.highlightTargetCells = function(tx, ty, px, py, customPattern) { 
    window.clearHighlightTargetCells(); 
    let affectedMap = window.getAffectedCellsMap(tx, ty, px, py, customPattern); 
    
    Object.keys(affectedMap).forEach(cid => { 
        let cell = document.getElementById(`cell_${cid}`); 
        if(cell && !cell.classList.contains("hidden-vtt-cell")) {
            cell.classList.add("target-hover"); 
            let sq = affectedMap[cid];
            if(sq.t === 'c') cell.style.backgroundColor = "rgba(0, 255, 102, 0.5)"; else if(sq.t === 't') cell.style.backgroundColor = "rgba(0, 102, 0, 0.5)"; else if(sq.t === 'tp') cell.style.backgroundColor = "rgba(176, 0, 255, 0.5)"; else if(sq.t === 'i') cell.style.backgroundColor = "rgba(0, 102, 255, 0.5)"; else cell.style.backgroundColor = "rgba(255, 26, 85, 0.5)";

            if(sq.e && sq.e !== "Nenhum" && window.effectEmojis[sq.e]) {
                if(!cell.querySelector('.vtt-aim-emoji')) {
                    let el = document.createElement("span"); el.className = "vtt-aim-emoji";
                    el.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:18px; pointer-events:none; z-index:5; text-shadow: 0 0 5px #000;";
                    el.innerText = window.effectEmojis[sq.e]; cell.appendChild(el);
                }
            }
        }
    }); 
};
window.lastFocusTurnIndex = -1; window.lastFocusCid = "";

// =========================================================
// 2. TABULEIRO: SÓ PINTA DE AMARELO AS CASAS VÁLIDAS
// =========================================================
// =========================================================
// TABULEIRO DO VTT (PERMITE DESENHAR SEM BLOQUEIOS)
// =========================================================
window.updateTacticalBoard = function() {
    try {
        if(!window.currentSubMapKey) return;
        window.turnosVTTGlobal = window.allTurnosVTT ? window.allTurnosVTT[window.currentSubMapKey] : null;

        let grid = window.submapasGlobais[window.currentSubMapKey] || {}; 
        let layer = document.getElementById("tokensLayer"); if(!layer) return;
        let conf = window.submapasConfig[window.currentSubMapKey] || {}; 
        let cols = conf.cols || 16; let rows = conf.rows || 12; let cellSize = window.VTT_CELL_SIZE || 50; 
        
        let px = -1, py = -1; 
        Object.keys(grid).forEach(cid => { 
            if(grid[cid] === window.jogadorAtual) { 
                let parts = cid.split("_"); px = parseInt(parts[0]); py = parseInt(parts[1]); 
            } 
        });

        let isCombat = (window.combatState && window.combatState.active); 
        let arma = window.combatState.weapon;
        let armaRange = isCombat && arma ? parseInt(arma.wpnRange || 1) : 0; 
        let armaMin = isCombat && arma ? parseInt(arma.minRange || 0) : 0; 
        let armaAoe = isCombat && arma ? parseInt(arma.aoe || 0) : 0; 
        let armaStyle = isCombat && arma ? arma.wpnStyle : 'melee'; 
        let armaCustom = isCombat && arma ? arma.customPattern : "";

        // O LAÇO DE REPETIÇÃO COMEÇA AQUI
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                let cell = document.getElementById(`cell_${x}_${y}`);
                if(cell && !cell.classList.contains("hidden-vtt-cell")) {
                    cell.classList.remove("in-range", "in-range-blocked", "in-range-combat", "target-hover"); 
                    cell.onmouseover = null; cell.onmouseout = null;
                    
                    let isObs = conf.cells && conf.cells[`${x}_${y}`] ? conf.cells[`${x}_${y}`].obs : false; 
                    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia")); 
                    let canWalk = !isObs || isGaia || window.isMaster;
                    
                    if(px !== -1 && py !== -1) {
                        let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
                        
                        if(isCombat) {  
                            let isValidTarget = false;
                            
                            if (armaCustom && armaCustom.startsWith("{")) {
                                try {
                                    let pat = JSON.parse(armaCustom);
                                    let realMaxRange = pat.maxRange || armaRange || 12;
                                    
                                    if (pat.castType === "aura") { 
                                        if (dist === 0) isValidTarget = true; // Só deixa clicar em si mesmo
                                    } else if (pat.castType === "direcional") {
                                        if (dist > 0 && dist <= realMaxRange) isValidTarget = true; 
                                    } else if (pat.castType === "alvo") {
                                        // SÓ PINTA DE AMARELO SE VOCÊ DESENHOU NA MÁSCARA AZUL DO PINTOR
                                        let relativeCid = `${x - px}_${y - py}`;
                                        if (pat.rangeMask && pat.rangeMask.includes(relativeCid)) isValidTarget = true;
                                    }
                                } catch(e) {}
                            } else {
                                // Fallback pra skill antiga
                                if (dist >= armaMin && dist <= Math.max(armaRange, armaMin)) isValidTarget = true;
                            }

                            if(isValidTarget) { 
                                cell.classList.add("in-range-combat"); 
                                cell.onmouseover = () => window.highlightTargetCells(x, y, px, py, armaCustom); 
                                cell.onmouseout = () => window.clearHighlightTargetCells(); 
                            } 
                        } else if(window.pontosAcao > 0 && dist > 0 && !grid[`${x}_${y}`]) { 
    let costPerStep = (window.getPesoStatus(window.usersGlobais[window.jogadorAtual]).atual >= 20) ? 3 : 1;
    if ((dist * costPerStep) <= window.pontosAcao) {
        if(canWalk) cell.classList.add("in-range"); 
        else cell.classList.add("in-range-blocked"); 
    }
}
                    }
                }
            }
        } 
        // AQUI ESTAVAM FALTANDO AS CHAVES PARA FECHAR O LAÇO! ^^^^

        let traps = window.submapasTraps ? window.submapasTraps[window.currentSubMapKey] || {} : {};
        document.querySelectorAll(".trap-icon-visual").forEach(e => e.remove());
        Object.keys(traps).forEach(tId => {
            let trap = traps[tId]; 
            let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia")); 
            let isMyTrap = (trap.owner === window.jogadorAtual);
            
            if(isMyTrap || isGaia || window.isMaster) {
                let cell = document.getElementById(`cell_${trap.x}_${trap.y}`);
                if(cell && !cell.classList.contains("hidden-vtt-cell")) {
                    let trapEl = document.createElement("div"); 
                    trapEl.className = "trap-icon-visual"; 
                    trapEl.innerHTML = "🕸️";
                    trapEl.style.position = "absolute"; 
                    trapEl.style.top = "50%"; 
                    trapEl.style.left = "50%"; 
                    trapEl.style.transform = "translate(-50%, -50%)"; 
                    trapEl.style.fontSize = "25px"; 
                    trapEl.style.opacity = isMyTrap ? "0.8" : "0.4"; 
                    trapEl.style.pointerEvents = "none"; 
                    trapEl.style.zIndex = "4";
                    if(isGaia && !isMyTrap) trapEl.style.filter = "drop-shadow(0 0 5px #00ff00)";
                    cell.appendChild(trapEl);
                }
            }
        });

        let focusTarget = window.jogadorAtual; 
        let isTurnoAtivo = (window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length > 0);
        if (isTurnoAtivo) { focusTarget = window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual]; }

        let currentTokens = []; let focarX = -1, focarY = -1;

        Object.keys(grid).forEach(cid => {
            let occupier = grid[cid]; if(!occupier) return; 
            let parts = cid.split("_"); 
            let x = parseInt(parts[0]); let y = parseInt(parts[1]); 
            if(x >= cols || y >= rows) return; 
            
            let tokenId = `token_${occupier}`; 
            currentTokens.push(tokenId); 
            let tokenEl = document.getElementById(tokenId); 
            
            let occData = window.usersGlobais[occupier] || {}; 
            let avToken = occData.charImgUrl || occData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${occupier}`; 
            let isMe = (occupier === window.jogadorAtual); 
            let leftPx = (x * cellSize); let topPx = (y * cellSize);
            
            if(!tokenEl) { 
                let tHtml = document.createElement("div"); tHtml.id = tokenId; tHtml.className = "tactical-token"; 
                if(window.isMaster) { 
                    tHtml.oncontextmenu = function(e) { 
                        e.preventDefault(); 
                        if(confirm(`Desintegrar [${occupier}] do tabuleiro?`)) { 
                            let updates = {}; 
                            updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${cid}`] = null; 
                            if(occData.isSummon) updates[`tokyoRpg/users/${occupier}/status`] = "morto"; 
                            window.db.ref().update(updates).then(() => { 
                                window.showNeonToast("💥 Alvo removido!"); 
                                window.updateTacticalBoard(); 
                            }); 
                        } 
                    }; 
                    tHtml.style.cursor = "crosshair"; 
                }
                if(isMe) { 
                    tHtml.style.borderColor = "#fff"; tHtml.style.boxShadow = "0 0 20px #fff"; tHtml.style.zIndex = "10"; 
                } else if (occData.isSummon) { 
                    tHtml.style.borderColor = "#ffaa00"; tHtml.style.boxShadow = "0 0 10px #ffaa00"; tHtml.style.borderRadius = "20%"; 
                } else if (occupier === "MESTRE") { 
                    tHtml.style.borderColor = "#f00"; tHtml.style.boxShadow = "0 0 20px #f00"; 
                }
                tHtml.innerHTML = `<div id="status_layer_${occupier}" class="token-status-layer"></div><div class="token-hp-bar-container"><div class="token-hp-bar-trail" id="hp_trail_${occupier}"></div><div class="token-hp-bar-fill" id="hp_fill_${occupier}"></div></div>`; 
                layer.appendChild(tHtml); 
                tokenEl = tHtml; 
            }
            tokenEl.style.backgroundImage = `url('${avToken}')`; 
            tokenEl.style.left = leftPx + "px"; 
            tokenEl.style.top = topPx + "px"; 
            tokenEl.style.width = cellSize + "px"; 
            tokenEl.style.height = cellSize + "px"; 
            
            let occRpg = window.getSafeRpg(occData); 
            let hpPct = Math.max(0, Math.min(100, ((occRpg.hp || 0) / (occRpg.hpMax || 100)) * 100)); 
            let fillBar = document.getElementById(`hp_fill_${occupier}`); 
            let trailBar = document.getElementById(`hp_trail_${occupier}`); 
            
            if(fillBar && trailBar) { 
                fillBar.style.width = hpPct + "%"; 
                trailBar.style.width = hpPct + "%"; 
                fillBar.style.background = hpPct < 30 ? "#f00" : (hpPct < 60 ? "#ffaa00" : "#0f0"); 
            }
            
            let stLayer = document.getElementById(`status_layer_${occupier}`);
            if(stLayer) {
                stLayer.innerHTML = ""; 
                let st = window.turnosVTTGlobal?.status?.[occupier];
                if(st) { 
                    Object.keys(st).forEach(k => { 
                        if(st[k].turnos > 0) { 
                            let icon = window.effectEmojis ? (window.effectEmojis[k] || "🔥") : "🔥";
                            stLayer.innerHTML += `<span class="vtt-status-icon" title="${k}">${icon}<small>${st[k].turnos}</small></span>`; 
                        } 
                    }); 
                } 
            }
            if(occupier === focusTarget) { focarX = x; focarY = y; }
        });

        Array.from(layer.children).forEach(t => { if(!currentTokens.includes(t.id)) t.remove(); });
        
        let currentFocusCid = `${focarX}_${focarY}`; let turnIndex = isTurnoAtivo ? window.turnosVTTGlobal.atual : -1;
        if (focarX !== -1 && focarY !== -1) { 
            if (window.lastFocusTurnIndex !== turnIndex || window.lastFocusCid !== currentFocusCid) { 
                setTimeout(() => window.focarCameraVTT(focarX, focarY), 100); 
                window.lastFocusTurnIndex = turnIndex; 
                window.lastFocusCid = currentFocusCid; 
            } 
        }
        
        let tBar = document.getElementById("turnOrderUI"); 
        let btnP = document.getElementById("btnPassTurno"); 
        let btnAtk = document.getElementById("btnAtacar"); 
        let btnMover = document.getElementById("btnMoverVTT"); 
        let btnLevantar = document.getElementById("btnLevantarVTT");
        
        if(isTurnoAtivo) {
            if(tBar) { tBar.style.display="flex"; tBar.innerHTML=""; }
            let isMyTurn = (window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] === window.jogadorAtual);
            let amIDown = window.turnosVTTGlobal.status && window.turnosVTTGlobal.status[window.jogadorAtual] && window.turnosVTTGlobal.status[window.jogadorAtual]["Derrubado"] && window.turnosVTTGlobal.status[window.jogadorAtual]["Derrubado"].turnos > 0;
            
            if(isMyTurn) { 
                if(amIDown) { 
                    if(btnP) btnP.style.display = "none"; 
                    if(btnAtk) btnAtk.style.display = "none"; 
                    if(btnMover) btnMover.style.display = "none"; 
                    if(btnLevantar) btnLevantar.style.display = "inline-block"; 
                } else { 
                    if(btnP) btnP.style.display = "inline-block"; 
                    if(btnAtk && !window.combatState.active) btnAtk.style.display = "inline-block"; 
                    if(btnMover) btnMover.style.display = "inline-block"; 
                    if(btnLevantar) btnLevantar.style.display = "none"; 
                } 
            } else { 
                if(btnP) btnP.style.display = window.isMaster ? "inline-block" : "none"; 
                if(btnAtk) btnAtk.style.display = "none"; 
                if(btnMover) btnMover.style.display = "none"; 
                if(btnLevantar) btnLevantar.style.display = "none"; 
            }
            window.turnosVTTGlobal.ordem.forEach((n,i) => { 
                if(tBar) tBar.innerHTML+=`<img src="${window.usersGlobais[n]?.avatarUrl||'https://api.dicebear.com/9.x/adventurer/svg?seed='+n}" class="turn-avatar ${i===window.turnosVTTGlobal.atual?'active':''}" title="${n}">`; 
            });
        } else { 
            if(tBar) tBar.style.display="none"; 
            if(btnP) btnP.style.display="none"; 
            if(btnAtk && !window.combatState.active) btnAtk.style.display="inline-block"; 
            if(btnMover) btnMover.style.display="inline-block"; 
            if(btnLevantar) btnLevantar.style.display="none"; 
        }
        
    } catch(e) { console.error(e); }
};

window.clicarGrid = function(x,y, isObs) {
    if(!window.jogadorAtual) return;
    if(window.combatState && window.combatState.active) { window.executarAtaque(x, y); return; }

    let u = window.usersGlobais[window.jogadorAtual]; let isGaia = (u.deus && u.deus.includes("Gaia"));
    let isTurnoAtivo = (window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0);
    
    if(isTurnoAtivo && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Espere seu turno."); return; }
    
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    if(grid[`${x}_${y}`]) return; 
    
    let px = -1, py = -1; let isAlreadyOnBoard = false;
    Object.keys(grid).forEach(cid => { if(grid[cid] === window.jogadorAtual) { isAlreadyOnBoard = true; let parts = cid.split("_"); px = parseInt(parts[0]); py = parseInt(parts[1]); } });

    if(!window.isMaster && isAlreadyOnBoard && isTurnoAtivo) {
        let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
        let pesoStats = window.getPesoStatus(u);
        let costPerStep = pesoStats.atual >= 20 ? 3 : 1; 
        let totalCost = dist * costPerStep;

        if(totalCost > window.pontosAcao) { window.showNeonToast(`Distância requer ${totalCost} PA!`); return; } 
        if(isObs && !isGaia) { window.showNeonToast("Obstáculo!"); return; }
        window.pontosAcao -= totalCost; window.setElText("movRestantes", `PA: ${window.pontosAcao}`);
    } else if (isObs && !isGaia && !window.isMaster) { window.showNeonToast("Obstáculo!"); return; }

    let up = {}; Object.keys(grid).forEach(k => { if(grid[k]===window.jogadorAtual) up[k] = null; }); up[`${x}_${y}`] = window.jogadorAtual;
    
    // ATUALIZAÇÃO IMEDIATA VIA SOCKET (O LAG MORRE AQUI)
    if(!window.submapasGlobais[window.currentSubMapKey]) window.submapasGlobais[window.currentSubMapKey] = {};
    Object.keys(grid).forEach(k => { if(grid[k]===window.jogadorAtual) delete window.submapasGlobais[window.currentSubMapKey][k]; });
    window.submapasGlobais[window.currentSubMapKey][`${x}_${y}`] = window.jogadorAtual;
    
    window.socket.emit("moverToken", { mapKey: window.currentSubMapKey, updates: up });
    window.updateTacticalBoard();

    // BACKUP SILENCIOSO
    window.db.ref(`tokyoRpg/submaps/${window.currentSubMapKey}`).update(up).then(() => {
        let traps = window.submapasTraps ? window.submapasTraps[window.currentSubMapKey] || {} : {};
        Object.keys(traps).forEach(tId => {
            let trap = traps[tId];
            if (trap.x === x && trap.y === y && trap.owner !== window.jogadorAtual) {
                window.showNeonToast("💥 PISOU EM UMA ARMADILHA!");
                let combatEvent = { attacker: trap.owner, weaponName: trap.name + " [Armadilha]", atkRoll: 25, isCrit: false, dmgRoll: trap.dmgRoll, wpnEffect: trap.effect || "", wpnEffectVal: trap.effectVal || 1, atkX: trap.x, atkY: trap.y, targets: [window.jogadorAtual], isHeal: false, timestamp: Date.now(), mapKey: window.currentSubMapKey, id: Date.now() };
                
                window.socket.emit("attackEvent", { mapKey: window.currentSubMapKey, events: [combatEvent] });
                window.db.ref(`tokyoRpg/submapsTraps/${window.currentSubMapKey}/${tId}`).remove(); 
            }
        });

        if(isTurnoAtivo && !window.isMaster && window.pontosAcao <= 0) setTimeout(() => window.passarTurnoVTT(), 800);
    });
};

window.rolarPA = function() {
    if(!window.jogadorAtual) return;
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0 && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Não é seu turno!"); return; }
    
    let roll = Math.floor(Math.random() * 6) + 1; // Rola 1d6 para PA
    window.pontosAcao = roll; 
    window.setElText("movRestantes", `PA: ${window.pontosAcao}`);
    
    if(window.mostrarDadoOverlay) window.mostrarDadoOverlay(window.jogadorAtual, "Pontos de Ação (PA)", [roll], 6); 
    window.updateTacticalBoard();
};

window.iniciarIniciativaVTT = function() {
    if(!window.isMaster) return;
    
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    let onGrid = Object.values(grid);
    let participantes = onGrid.filter(n => window.usersGlobais[n] && window.usersGlobais[n].vttReady === true);
    
    if(participantes.length === 0) { window.showNeonToast("Nenhum agente confirmou participação!"); return; }
    
    let ini = []; 
    participantes.forEach(n => { 
        let r = Math.floor(Math.random() * 20) + 1; 
        let agi = (window.usersGlobais[n]?.rpg?.agi || 1); 
        let buffs = window.calcularBuffsMoveis(window.usersGlobais[n]);
        let totalAgi = agi + (buffs.agi || 0);
        let sum = r + totalAgi; 
        ini.push({ n: n, v: sum }); 
        
        window.db.ref('tokyoRpg/mapDados').push({ 
            nome: "SISTEMA", 
            texto: `Iniciativa de ${n}: <span class="dice-result-box">${r}</span> + ${totalAgi} = <strong>${sum}</strong>` 
        });
    });
    
    ini.sort((a,b) => b.v - a.v); 
    let tObj = { ordem: ini.map(x => x.n), atual: 0 };

    window.socket.emit("passarTurno", { mapKey: window.currentSubMapKey, novoTurno: tObj });
    window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}`).set(tObj); 
    window.showNeonToast("Turnos Definidos!");
};

window.passarTurnoVTT = function() {
    if(!window.turnosVTTGlobal || !window.turnosVTTGlobal.ordem || window.turnosVTTGlobal.ordem.length === 0) return;
    
    let eu = window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual];
    let updates = {}; let danoTurno = 0; let logsStatus = [];

    if(window.turnosVTTGlobal.status && window.turnosVTTGlobal.status[eu]) {
        let meusStatus = window.turnosVTTGlobal.status[eu]; 
        Object.keys(meusStatus).forEach(efeito => {
            if(meusStatus[efeito].turnos > 0) {
                let isDoT = ["Queimadura", "Veneno", "Sangramento", "Corrupcao", "Maldicao", "Infeccao", "Acido", "Decadencia", "ChoqueEletrico", "CongelamentoInterno", "Hemorragia", "Necrose"].includes(efeito);
                
                if(isDoT) { 
                    danoTurno += meusStatus[efeito].dano; 
                    logsStatus.push(`${efeito}: -${meusStatus[efeito].dano} HP`); 
                }
                
                if(efeito.includes("Regeneracao")) { 
                    let r = window.getSafeRpg(window.usersGlobais[eu]); 
                    updates[`tokyoRpg/users/${eu}/rpg/hp`] = Math.min(100, r.hp + meusStatus[efeito].dano); 
                    window.db.ref('tokyoRpg/mapDados').push({ nome: "SISTEMA", texto: `<span class="neon-green">${eu} Regenerou +${meusStatus[efeito].dano} HP (${efeito})</span>` }); 
                }
                
                if(efeito === "Derrubado") { updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${eu}/${efeito}/turnos`] = 1; } 
                else if(meusStatus[efeito].turnos - 1 <= 0) { updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${eu}/${efeito}`] = null; } 
                else { updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${eu}/${efeito}/turnos`] = meusStatus[efeito].turnos - 1; }
            }
        });
        if(danoTurno > 0) { 
            let r = window.getSafeRpg(window.usersGlobais[eu]); 
            updates[`tokyoRpg/users/${eu}/rpg/hp`] = Math.max(0, r.hp - danoTurno); 
            window.db.ref('tokyoRpg/mapDados').push({ nome: "SISTEMA", texto: `<span class="neon-red">${eu} sofreu dano: (${logsStatus.join(", ")})</span>` }); 
        }
    }

    let traps = window.submapasTraps ? window.submapasTraps[window.currentSubMapKey] || {} : {};
    Object.keys(traps).forEach(tId => {
        if (traps[tId].owner === eu) {
            if (traps[tId].turnos <= 1) { updates[`tokyoRpg/submapsTraps/${window.currentSubMapKey}/${tId}`] = null; } 
            else { updates[`tokyoRpg/submapsTraps/${window.currentSubMapKey}/${tId}/turnos`] = traps[tId].turnos - 1; }
        }
    });

    if(Object.keys(updates).length > 0) window.db.ref().update(updates);

    let proxIndex = window.turnosVTTGlobal.atual + 1; 
    if(proxIndex >= window.turnosVTTGlobal.ordem.length) proxIndex = 0;
    
    let novoTurnoObj = JSON.parse(JSON.stringify(window.turnosVTTGlobal)); 
    novoTurnoObj.atual = proxIndex;
    
    // AVISA TODOS VIA SOCKET
    window.turnosVTTGlobal = novoTurnoObj; 
    window.updateTacticalBoard(); 
    window.socket.emit("passarTurno", { mapKey: window.currentSubMapKey, novoTurno: novoTurnoObj }); 
    
    // BACKUP
    window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}/atual`).set(proxIndex); 
    
    if(eu === window.jogadorAtual) { window.pontosAcao = 0; window.setElText("movRestantes", "PA: 0"); }
};

// =========================================================
// SISTEMA DE COMBATE VTT & CLASH 
// =========================================================

// =========================================================
// SISTEMA DE COMBATE VTT & CLASH (COM BOTÃO DE EXCLUIR SKILL PRO MESTRE)
// =========================================================
window.iniciarAtaqueVTT = function() {
    if(!window.currentSubMapKey) return;
    
    // Descobre de quem é a vez. Se for de uma invocação, verifica se você é o dono!
    let isTurnoAtivo = window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length > 0;
    let agenteAtual = isTurnoAtivo ? window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] : window.jogadorAtual;
    let isMySummon = window.usersGlobais[agenteAtual]?.owner === window.jogadorAtual;
    
    if(isTurnoAtivo && !window.isMaster && agenteAtual !== window.jogadorAtual && !isMySummon) { 
        window.showNeonToast("Espere seu turno!"); return; 
    }

    // Puxa a mochila de quem está atacando (Pode ser o jogador ou o monstro!)
    let u = window.usersGlobais[agenteAtual];
    if(!u || !u.mochila) { window.showNeonToast("Nenhuma ação disponível."); return; }
    
    let wDiv = document.getElementById("wpnSelectDiv"); let btnAtk = document.getElementById("btnAtacar"); let btnCnc = document.getElementById("btnCancelAtk");
    wDiv.innerHTML = ""; let temAcao = false;

    Object.keys(u.mochila).forEach(k => {
        let item = u.mochila[k];
        if(item.wpnStyle || item.isVTT) {
            temAcao = true; 
            let wrapper = document.createElement("div"); wrapper.style.display = "flex"; wrapper.style.alignItems = "center"; wrapper.style.gap = "2px";
            let btn = document.createElement("button"); btn.className = "action-btn";
            btn.style.borderColor = "#ff1a55"; btn.style.color = "#ff1a55";
            btn.style.padding = "3px 8px"; btn.style.fontSize = "11px"; btn.style.margin = "0"; btn.innerText = item.nome;
            
            btn.onclick = () => { 
                window.combatState.active = true; item.invKey = k; window.combatState.weapon = item; 
                window.showNeonToast(`Ação: ${item.nome}. Clique no alvo!`); wDiv.style.display = "none"; 
                if(window.updateTacticalBoard) window.updateTacticalBoard(); 
            }; 
            wrapper.appendChild(btn);
            wDiv.appendChild(wrapper);
        }
    });

    if(!temAcao) { window.showNeonToast("Nenhuma habilidade equipada!"); return; }
    btnAtk.style.display = "none"; btnCnc.style.display = "inline-block"; wDiv.style.display = "flex";
};

window.cancelarAtaqueVTT = function() {
    window.combatState.active = false; window.combatState.weapon = null;
    let btnAtk = document.getElementById("btnAtacar"); if(btnAtk) btnAtk.style.display = "inline-block";
    let btnCnc = document.getElementById("btnCancelAtk"); if(btnCnc) btnCnc.style.display = "none";
    let wDiv = document.getElementById("wpnSelectDiv"); if(wDiv) wDiv.style.display = "none";
    window.clearHighlightTargetCells(); window.updateTacticalBoard();
};

// =========================================================
// 3. EXECUÇÃO DE ATAQUE BLINDADA
// =========================================================
window.executarAtaque = function(tx, ty) {
    try {
        let isTurnoAtivo = window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length > 0;
        let agenteAtual = isTurnoAtivo ? window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] : window.jogadorAtual;
        
        let arma = window.combatState.weapon; if(!arma) return;
        let grid = window.submapasGlobais[window.currentSubMapKey] || {};
        let px = -1, py = -1; Object.keys(grid).forEach(cid => { if(grid[cid] === agenteAtual) { let p = cid.split("_"); px = parseInt(p[0]); py = parseInt(p[1]); } });
        
        let armaCustom = arma.customPattern || "";
        if(!armaCustom || !armaCustom.startsWith("{")) { window.showNeonToast("Habilidade Antiga. Reforje no Novo VTT Forge!"); window.cancelarAtaqueVTT(); return; }

        let u = window.usersGlobais[agenteAtual]; let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u);
        let erCost = parseInt(arma.erCost) || 0;
        let paCost = parseInt(arma.paCost) || 1; 
        
        if(!window.isMaster) {
            if(paCost > window.pontosAcao) { window.showNeonToast(`Falta PA! (Requer ${paCost})`); window.cancelarAtaqueVTT(); return; }
            if(erCost > 0 && r.integridade < erCost) { window.showNeonToast(`Falta ER! (Requer ${erCost}%)`); window.cancelarAtaqueVTT(); return; }
            
            window.pontosAcao -= paCost;
            window.setElText("movRestantes", `PA: ${window.pontosAcao}`);
            if(erCost > 0) window.db.ref(`tokyoRpg/users/${agenteAtual}/rpg/integridade`).set(Math.max(0, r.integridade - erCost));
        }

        let updatesDB = {};
        let affectedMap = window.getAffectedCellsMap(tx, ty, px, py, armaCustom);
        
        let isSwapMarked = Object.values(affectedMap).some(sq => sq.e === 'TrocaMarcada');
        if (isSwapMarked) {
            let markedTarget = null; let markedCell = null;
            Object.keys(grid).forEach(cell => {
                let p = grid[cell]; let st = window.turnosVTTGlobal?.status?.[p];
                if (st && st["Marcado"] && st["Marcado"].turnos > 0 && st["Marcado"].caster === agenteAtual) { markedTarget = p; markedCell = cell; }
            });

            if (markedTarget) {
                updatesDB[`tokyoRpg/submaps/${window.currentSubMapKey}/${px}_${py}`] = markedTarget;
                updatesDB[`tokyoRpg/submaps/${window.currentSubMapKey}/${markedCell}`] = agenteAtual;
                updatesDB[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${markedTarget}/Marcado`] = null; 
                window.db.ref('tokyoRpg/mapDados').push({ nome: agenteAtual, texto: `🔀 Trocou de lugar com <span class="neon-blue">${markedTarget}</span>!` }); 
                window.db.ref().update(updatesDB); window.cancelarAtaqueVTT(); 
                
                let upS = {}; upS[`${px}_${py}`] = markedTarget; upS[`${markedCell}`] = agenteAtual; 
                window.socket.emit("moverToken", { mapKey: window.currentSubMapKey, updates: upS });

                if (isTurnoAtivo && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] === agenteAtual) window.passarTurnoVTT(); 
                return; 
            } else { window.showNeonToast("Nenhum alvo marcado no mapa!"); window.cancelarAtaqueVTT(); return; }
        }

        let targets = []; let hasActionInMap = false;

        Object.keys(affectedMap).forEach(cid => {
            hasActionInMap = true;
            let occ = grid[cid]; let squareData = affectedMap[cid];
            
            if(squareData.t === 'tp') {
                if (!grid[cid]) {
                    updatesDB[`tokyoRpg/submaps/${window.currentSubMapKey}/${px}_${py}`] = null; 
                    updatesDB[`tokyoRpg/submaps/${window.currentSubMapKey}/${cid}`] = agenteAtual;
                    window.db.ref('tokyoRpg/mapDados').push({ nome: agenteAtual, texto: `✨ Se teleportou!` }); 
                    let upS = {}; upS[`${px}_${py}`] = null; upS[`${cid}`] = agenteAtual; 
                    window.socket.emit("moverToken", { mapKey: window.currentSubMapKey, updates: upS });
                }
            }
            if(squareData.t === 't') {
                if (!grid[cid]) {
                    let tId = `TRAP_${agenteAtual}_${Date.now()}_${cid}`;
                    updatesDB[`tokyoRpg/submapsTraps/${window.currentSubMapKey}/${tId}`] = { 
                        x: parseInt(cid.split("_")[0]), y: parseInt(cid.split("_")[1]), owner: agenteAtual, name: arma.nome, effect: squareData.e, effectVal: squareData.v, turnos: squareData.tr, dmgRoll: 0 
                    };
                }
            }

            if(occ) { 
                let isHeal = (squareData.t === 'c');
                if (isHeal || occ !== agenteAtual) { targets.push({ name: occ, data: squareData, cid: cid }); }
            } 
        });

        if(targets.length === 0 && !isSwapMarked && !hasActionInMap) { window.showNeonToast("Ação inválida."); window.cancelarAtaqueVTT(); return; }

        let attrKey = arma.attr || 'int'; let attrMod = r[attrKey] + (buffs[attrKey]||0); let d20Atk = Math.floor(Math.random() * 20) + 1; let totalAtk = d20Atk + attrMod; let isCrit = (d20Atk === 20);
        let dmgDiceStr = arma.wpnDice || '1d4'; let [numDice, sides] = dmgDiceStr.split('d').map(Number); if(isNaN(numDice)) numDice=1; if(isNaN(sides)) sides=4;
        let dmgRoll = 0; for(let i=0; i<numDice; i++) dmgRoll += Math.floor(Math.random() * sides) + 1; let totalPoder = dmgRoll + (parseInt(arma.wpnBonus) || 0); if(isCrit) totalPoder *= 2; 

        let atkTime = Date.now();
        let combatEvents = [];

        targets.forEach((tgtObj, idx) => {
            let isHeal = (tgtObj.data.t === 'c');
            let evObj = { 
                id: atkTime + idx,
                attacker: agenteAtual, weaponName: arma.nome, atkRoll: totalAtk, isCrit: isCrit, dmgRoll: totalPoder, 
                wpnEffect: tgtObj.data.e === "Nenhum" ? "" : tgtObj.data.e, 
                wpnEffectVal: tgtObj.data.v, 
                wpnEffectTurnos: tgtObj.data.tr, 
                atkX: px, atkY: py, targets: [tgtObj.name], isHeal: isHeal, timestamp: atkTime + idx, mapKey: window.currentSubMapKey 
            };
            combatEvents.push(evObj);
            // Backup Silencioso
            updatesDB[`tokyoRpg/submapsCombat/${window.currentSubMapKey}/${atkTime + idx}`] = evObj;
        });

        if(targets.length > 0) {
            window.db.ref('tokyoRpg/mapDados').push({ nome: agenteAtual, texto: `Usou <span class="neon-blue">${arma.nome}</span> (Dado: <span class="dice-result-box">${totalAtk}</span>${isCrit?' [CRÍTICO!]':''}) contra ${targets.length} alvo(s)!` });
            window.socket.emit("attackEvent", { mapKey: window.currentSubMapKey, events: combatEvents });
        }
        
        window.db.ref().update(updatesDB); window.cancelarAtaqueVTT(); 
        
        if (isTurnoAtivo && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] === agenteAtual) {
            if (window.pontosAcao <= 0 && !window.isMaster) setTimeout(() => window.passarTurnoVTT(), 1500);
        }
        
    } catch (err) { console.error(err); window.showNeonToast("Erro Interno"); window.cancelarAtaqueVTT(); }
};
// === AS TRÊS FUNÇÕES QUE TINHAM SUMIDO E QUEBRARAM O RECEPTOR ===
window.focarCameraVTT = function(x, y) {
    let board = document.getElementById("tacticalBoard"); if(!board) return;
    let cellSize = window.VTT_CELL_SIZE || 50; let leftPx = (x * cellSize); let topPx = (y * cellSize); let vW = board.clientWidth; let vH = board.clientHeight;
    let targetL = leftPx - (vW / 2) + (cellSize / 2); let targetT = topPx - (vH / 2) + (cellSize / 2);
    targetL = Math.max(0, Math.min(targetL, board.scrollWidth - vW)); targetT = Math.max(0, Math.min(targetT, board.scrollHeight - vH));
    board.scrollTo({ left: targetL, top: targetT, behavior: 'smooth' });
};

window.listenCombatEvents = function() {
    if(!window.db) return;
    if(window.currentCombatListener && window._lastCombatMap === window.currentSubMapKey) return;
    if(window.currentCombatListener && window._lastCombatMap) { window.db.ref(`tokyoRpg/submapsCombat/${window._lastCombatMap}`).off('child_added', window.currentCombatListener); }
    window._lastCombatMap = window.currentSubMapKey;
    
    window.currentCombatListener = window.db.ref(`tokyoRpg/submapsCombat/${window.currentSubMapKey}`).on('child_added', snap => {
        let atk = snap.val(); let atkId = snap.key; if(!atk) return;
        if(Date.now() - atk.timestamp > 60000) return; 
        // Se EU sou o alvo, eu mostro a janela de reagir
        if(atk.targets && atk.targets.includes(window.jogadorAtual)) { window.mostrarUIReacao(atkId, atk); }
    });
};

window.mostrarUIReacao = function(atkId, atkData) {
    window.pendingAttack = { id: atkId, data: atkData };
    if (atkData.isHeal) { window.reagirAtaque('aceitar'); return; }
    let info = document.getElementById("reactionInfo");
    if(info) { info.innerHTML = `<strong style="color:var(--accent-blue);">${atkData.attacker}</strong> atacou você com <strong>${atkData.weaponName}</strong>!<br>Poder de Ataque: <span class="neon-red" style="font-size:18px;">${atkData.atkRoll}</span>`; }
    document.getElementById("reactionModal").style.display = "flex";
};
// ===================================================================

window.reagirAtaque = function(tipo) {
    if(!window.pendingAttack) return;
    let atk = window.pendingAttack.data; let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u);
    let finalDmg = atk.dmgRoll || 0; let reactionText = ""; let defRollVal = 0; let resultText = ""; let winnerId = "atk";
    let isImune = false; let isReflect = false; let shieldVal = 0;

    if(window.turnosVTTGlobal?.status?.[window.jogadorAtual]) {
        let st = window.turnosVTTGlobal.status[window.jogadorAtual];
        if(st["Imunidade"] && st["Imunidade"].turnos > 0) isImune = true;
        if(st["Reflexão"] && st["Reflexão"].turnos > 0) isReflect = true;
        if(st["Escudo"] && st["Escudo"].turnos > 0) shieldVal = st["Escudo"].dano;
    }

    if (atk.isHeal || atk.wpnStyle === 'self_buff') { reactionText = `Recebeu o buff/cura.`; resultText = `EFEITO APLICADO!`; winnerId = 'heal'; } 
    else if (isImune) { finalDmg = 0; winnerId = 'def'; reactionText = `Ativou a Imunidade e bloqueou 100% do dano!`; resultText = "IMUNE!"; } 
    else if (isReflect) {
        finalDmg = 0; winnerId = 'def'; reactionText = `Ativou a Reflexão! O dano volta para o atacante!`; resultText = "REFLETIU!";
        let atkUsr = window.usersGlobais[atk.attacker]; if(atkUsr) { let atkRpg = window.getSafeRpg(atkUsr); window.db.ref(`tokyoRpg/users/${atk.attacker}/rpg/hp`).set(Math.max(0, atkRpg.hp - (atk.dmgRoll||0))); window.db.ref('tokyoRpg/mapDados').push({ nome: "SISTEMA", texto: `<span class="neon-purple">${atk.attacker} tomou ${atk.dmgRoll} do Reflexo!</span>` }); }
    }
    else if(tipo === 'esquiva') {
        let d20 = Math.floor(Math.random() * 20) + 1; let agiTotal = r.agi + buffs.agi; defRollVal = d20 + agiTotal;
        if (d20 === 1) { finalDmg = atk.dmgRoll || 0; winnerId = 'atk'; reactionText = `Tentou Esquivar (<span class="neon-blue">1</span>). Tomou <span class="neon-red">${finalDmg}</span> de dano crítico.`; resultText = `FALHA CRÍTICA! SOFREU ${finalDmg} DE DANO!`; } 
        else if(defRollVal > atk.atkRoll) { finalDmg = 0; winnerId = 'def'; reactionText = `Rolou Esquiva (<span class="neon-green">${defRollVal}</span>) e evitou!`; resultText = "ESQUIVOU COM SUCESSO!"; } 
        else { finalDmg = Math.max(0, finalDmg - shieldVal); reactionText = `Tentou Esquivar (<span class="neon-red">${defRollVal}</span>) mas falhou! Tomou <span class="neon-red">${finalDmg}</span> de dano. ${shieldVal>0?'(Escudo ajudou) ':''}`; resultText = `SOFREU ${finalDmg} DE DANO!`; }
    } else if(tipo === 'defender') {
        let d20 = Math.floor(Math.random() * 20) + 1; let vigTotal = r.vig + buffs.vig; let defArmor = window.calcularDefesa(u); defRollVal = d20 + vigTotal;
        if (d20 === 1) { finalDmg = Math.max(0, (atk.dmgRoll || 0) - shieldVal); winnerId = 'atk'; reactionText = `Rolou Defesa (<span class="neon-blue">1</span>). Armadura ignorada. Tomou <span class="neon-red">${finalDmg}</span> de dano.`; resultText = `FALHA CRÍTICA! SOFREU ${finalDmg} DE DANO!`; } 
        else if (defRollVal > atk.atkRoll) { finalDmg = 0; winnerId = 'def'; reactionText = `Rolou Defesa (<span class="neon-blue">${defRollVal}</span>) e superou o ataque. Tomou 0.`; resultText = `DEFESA PERFEITA!`; } 
        else { finalDmg = Math.max(0, (atk.dmgRoll || 0) - defArmor - shieldVal); reactionText = `Rolou Defesa (<span class="neon-blue">${defRollVal}</span>). Reduziu com Armadura (${defArmor}) e Escudo (${shieldVal}). Tomou <span class="neon-red">${finalDmg}</span> de dano.`; if (finalDmg === 0) { winnerId = 'def'; resultText = `DEFESA IMPENETRÁVEL!`; } else { resultText = `DEFESA QUEBRADA! SOFREU ${finalDmg} DE DANO!`; } }
    } else { finalDmg = Math.max(0, finalDmg - shieldVal); reactionText = `Aceitou o golpe. Tomou <span class="neon-red">${finalDmg}</span> de dano.`; resultText = `SOFREU ${finalDmg} DE DANO CRÍTICO!`; }

    if(atk.isCrit && finalDmg > 0 && !atk.isHeal && !isImune && !isReflect) resultText = "ATAQUE CRÍTICO! " + resultText;
    if(atk.wpnEffect && atk.wpnEffect !== "" && finalDmg > 0 && !atk.isHeal && !isImune && !isReflect) resultText += ` + ${atk.wpnEffect.toUpperCase()}`;

    window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Reação contra ${atk.attacker}: ${reactionText}` });
    let atkUser = window.usersGlobais[atk.attacker];
    let defImgDisplay = u?.charImgUrl || u?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    let atkImgDisplay = atkUser?.charImgUrl || atkUser?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${atk.attacker}`;

    let clashPayload = { 
        ts: Date.now(), atkName: atk.attacker || "Desconhecido", atkAv: atkImgDisplay, atkAction: `${atk.isHeal ? 'Usou' : 'Ataque'} c/ ${atk.weaponName || 'Arma'}`, 
        atkRoll: atk.atkRoll || 0, defName: window.jogadorAtual, defAv: defImgDisplay, defAction: atk.isHeal ? 'RECEBEU' : tipo.toUpperCase(), 
        defRoll: defRollVal || 0, dmg: finalDmg || 0, winner: winnerId, resultText: resultText, 
        effect: atk.wpnEffect || "", effectVal: atk.wpnEffectVal || 1, effectTurnos: atk.wpnEffectTurnos || 1, 
        atkX: atk.atkX !== undefined ? atk.atkX : -1, atkY: atk.atkY !== undefined ? atk.atkY : -1, isHeal: atk.isHeal || false, mapKey: window.currentSubMapKey 
    };

    document.getElementById("reactionModal").style.display = "none";
    
    // MANDA A ANIMAÇÃO PRA TODO MUNDO VIA SOCKET
    window.socket.emit("clashEvent", { mapKey: window.currentSubMapKey, clashData: clashPayload }); 
    
    window.db.ref('tokyoRpg/currentClash').set(clashPayload);
    if(window.currentSubMapKey && window.pendingAttack.id) window.db.ref(`tokyoRpg/submapsCombat/${window.currentSubMapKey}/${window.pendingAttack.id}`).remove().catch(()=>{});
    
    window.pendingAttack = null;
};

// **BÔNUS DA TELA DE FACES:**
window.renderizarFace = function() {
    let targetName = window.remoteSpeakerName ? window.remoteSpeakerName : window.jogadorAtual;
    let u = window.usersGlobais[targetName]; 
    if(!u) return;

    let faceImg = document.getElementById("charFaceDisplay");
    if(faceImg) {
        let isFalando = false; let estadoFace = "Normal";

        if (targetName === window.remoteSpeakerName) { isFalando = true; estadoFace = "Falando"; } 
        else { estadoFace = window.faceAtual; if (estadoFace === "Falando") isFalando = true; }
        if (targetName !== window.jogadorAtual && u.faceAtual && !isFalando) { estadoFace = u.faceAtual; }

        let faceNameFormatada = estadoFace.charAt(0).toUpperCase() + estadoFace.slice(1);
        let path = `img/faces/${targetName}_Face_${faceNameFormatada}.png`;
        faceImg.src = path;
        
        if(isFalando) { faceImg.style.transform = "scale(1.05)"; faceImg.style.borderColor = "#00ff66"; faceImg.style.boxShadow = "0 0 20px rgba(0, 255, 102, 0.4)"; } 
        else if(estadoFace === "Dano") { faceImg.style.transform = "rotate(-10deg) scale(0.9)"; faceImg.style.borderColor = "#ff1a55"; faceImg.style.boxShadow = "none"; } 
        else { faceImg.style.transform = "none"; faceImg.style.borderColor = "var(--accent-blue)"; faceImg.style.boxShadow = "none"; }

        // AQUI: Fallback inteligente que pega a Imagem Customizada e, por fim, o Avatar do G-Chat
        faceImg.onerror = function() { this.src = u.charImgUrl || u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${targetName}`; };

        let nameTag = document.getElementById("faceNameTag");
        if(!nameTag) {
            nameTag = document.createElement("div"); nameTag.id = "faceNameTag";
            nameTag.style.position = "absolute"; nameTag.style.top = "5px"; nameTag.style.left = "50%"; nameTag.style.transform = "translateX(-50%)";
            nameTag.style.background = "rgba(0,0,0,0.8)"; nameTag.style.padding = "2px 10px"; nameTag.style.borderRadius = "4px";
            nameTag.style.fontSize = "12px"; nameTag.style.fontWeight = "bold"; nameTag.style.border = "1px solid var(--accent-blue)";
            nameTag.style.pointerEvents = "none"; nameTag.style.zIndex = "10";
            faceImg.parentElement.style.position = "relative"; faceImg.parentElement.appendChild(nameTag);
        }
        
        nameTag.innerText = targetName.toUpperCase();
        nameTag.style.borderColor = isFalando ? "#00ff66" : "var(--accent-blue)";
        nameTag.style.color = isFalando ? "#00ff66" : "var(--accent-blue)";
    }
};

window.processClashQueue = function() {
    if(window.isClashing || window.clashQueue.length === 0) return;
    window.isClashing = true; let c = window.clashQueue.shift();
    let ov = document.getElementById("clashOverlay"); let atkC = document.getElementById("clashAtkContainer"); let defC = document.getElementById("clashDefContainer"); let resT = document.getElementById("clashResultText");

    document.getElementById("clashAtkAv").src = c.atkAv; document.getElementById("clashAtkName").innerText = c.atkName; document.getElementById("clashAtkAction").innerText = c.atkAction; document.getElementById("clashDefAv").src = c.defAv; document.getElementById("clashDefName").innerText = c.defName; document.getElementById("clashDefAction").innerText = c.defAction;
    atkC.className = ""; defC.className = ""; resT.style.opacity = "0"; ov.style.display = "flex";

    let rollInterval = setInterval(() => { document.getElementById("clashAtkRoll").innerText = Math.floor(Math.random() * 30) + 1; document.getElementById("clashDefRoll").innerText = Math.floor(Math.random() * 30) + 1; }, 50);

    setTimeout(() => {
        clearInterval(rollInterval); document.getElementById("clashAtkRoll").innerText = c.atkRoll; document.getElementById("clashDefRoll").innerText = c.defRoll;
        if(c.winner === 'atk') { atkC.classList.add("clash-winner"); defC.classList.add("clash-loser"); } else { defC.classList.add("clash-winner"); atkC.classList.add("clash-loser"); }

        setTimeout(() => {
            resT.innerText = c.resultText;
            if(c.dmg > 0 || c.winner === 'atk') { resT.style.color = "#ff1a55"; resT.style.textShadow = "0 0 20px #ff1a55"; resT.style.borderColor = "#ff1a55"; } 
            else if (c.isHeal) { resT.style.color = "#00ff66"; resT.style.textShadow = "0 0 20px #00ff66"; resT.style.borderColor = "#00ff66"; }
            else { resT.style.color = "#00e5ff"; resT.style.textShadow = "0 0 20px #00e5ff"; resT.style.borderColor = "#00e5ff"; }
            resT.style.opacity = "1";

            setTimeout(() => {
                ov.style.display = "none"; window.isClashing = false;
                let grid = window.submapasGlobais[window.currentSubMapKey] || {}; let defCid = Object.keys(grid).find(key => grid[key] === c.defName);
                let conf = window.submapasConfig[window.currentSubMapKey] || {};
                
                if(defCid) {
                    let cellEl = document.getElementById(`cell_${defCid}`);
                    if(cellEl) {
                        let overlay = document.createElement("div"); overlay.style.position = "absolute"; overlay.style.top = "0"; overlay.style.left = "0"; overlay.style.width = "100%"; overlay.style.height = "100%";
                        if (c.isHeal) { overlay.style.background = "rgba(0, 255, 100, 0.7)"; overlay.style.boxShadow = "inset 0 0 20px #00ff66"; }
                        else if(c.dmg > 0 || c.winner === 'atk') { overlay.style.background = "rgba(255, 26, 85, 0.7)"; overlay.style.boxShadow = "inset 0 0 20px #ff1a55"; } 
                        else { overlay.style.background = "rgba(0, 229, 255, 0.7)"; overlay.style.boxShadow = "inset 0 0 20px #00e5ff"; }
                        overlay.style.zIndex = "20"; overlay.style.animation = "fadeOut 1s forwards"; cellEl.appendChild(overlay); setTimeout(()=>overlay.remove(), 1000);
                    }
                    let tId = `token_${c.defName}`; let tEl = document.getElementById(tId);
                    if(tEl) {
                        let popTxt = c.isHeal ? `+${c.dmg}` : (c.dmg > 0 ? `-${c.dmg}` : "MISS"); let popColor = c.isHeal ? "#00ff66" : (c.dmg > 0 ? "#ff1a55" : "#aaa");
                        let dmgPop = document.createElement("div"); dmgPop.className = "damage-popup"; dmgPop.innerText = popTxt;
                        dmgPop.style.color = popColor; dmgPop.style.textShadow = `0 0 10px #000, 0 0 5px ${popColor}`;
                        tEl.appendChild(dmgPop); setTimeout(() => dmgPop.remove(), 1500);
                    }
                }
                
                if(c.defName === window.jogadorAtual) {
                    if(c.dmg > 0 && !c.isHeal) { let board = document.getElementById("tacticalBoard"); if(board) { board.classList.add("shake-camera"); setTimeout(() => board.classList.remove("shake-camera"), 500); } }

                    let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let updates = {}; let safeDmg = parseInt(c.dmg) || 0;

                    if (c.isHeal) { updates[`tokyoRpg/users/${window.jogadorAtual}/rpg/hp`] = Math.min(r.hpMax || 100, r.hp + safeDmg); } 
                    else if (safeDmg > 0) {
                        updates[`tokyoRpg/users/${window.jogadorAtual}/rpg/hp`] = Math.max(0, r.hp - safeDmg);

                        if(c.effect === "Empurrão" || c.effect === "Empurrao" || c.effect === "Puxão" || c.effect === "Puxao") {
                            if(c.atkX !== -1 && c.atkY !== -1 && defCid) {
                                let [defX, defY] = defCid.split("_").map(Number); let dx = defX - c.atkX; let dy = defY - c.atkY;
                                let modX = dx === 0 ? 0 : (dx > 0 ? 1 : -1); let modY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
                                if(c.effect.includes("Pux")) { modX *= -1; modY *= -1; }
                                let power = c.effectVal || 1; let finalX = defX, finalY = defY; 
                                for(let step=1; step<=power; step++) { let testX = defX + (modX * step); let testY = defY + (modY * step); let isObs = conf.cells && conf.cells[`${testX}_${testY}`] ? conf.cells[`${testX}_${testY}`].obs : false; if(!grid[`${testX}_${testY}`] && !isObs && testX >= 0 && testY >= 0 && testX < (conf.cols||16) && testY < (conf.rows||12)) { finalX = testX; finalY = testY; } else { break; } }
                                if(finalX !== defX || finalY !== defY) { updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${defCid}`] = null; updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${finalX}_${finalY}`] = c.defName; }
                            }
                        }
                        else if(c.effect === "Troca" && c.atkX !== -1 && c.atkY !== -1 && defCid) { updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${defCid}`] = c.atkName; updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${c.atkX}_${c.atkY}`] = c.defName; }
                        
                        let isDoT = ["Queimadura", "Veneno", "Sangramento", "Corrupcao", "Maldicao", "Infeccao", "Acido", "Decadencia", "ChoqueEletrico", "CongelamentoInterno", "Hemorragia", "Necrose"].includes(c.effect);
                        let isCC = ["Atordoamento", "Congelado", "Paralisia", "Silencio", "Desarmado", "Cego", "Confusao", "Medo", "Provocacao", "Enraizado", "Petrificacao", "Sono", "Hipnose", "Aprisionamento", "LentidaoExtrema"].includes(c.effect);
                        let isBuff = ["Regeneracao", "RegeneracaoMana", "Escudo", "Reflexao", "Imunidade", "Invisibilidade"].includes(c.effect);

                        // AQUI USAMOS O NOVO CAMPO `c.effectTurnos`
                        let duracaoReal = c.effectTurnos || 3;
                        let forcaReal = c.effectVal || Math.max(1, Math.floor(safeDmg / 2));

                        if (isDoT) updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${c.defName}/${c.effect}`] = { dano: forcaReal, turnos: duracaoReal };
                        if (isCC) updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${c.defName}/${c.effect}`] = { turnos: c.effectTurnos || 1 };
                        if (isBuff) updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${c.defName}/${c.effect}`] = { dano: c.effectVal || 0, turnos: duracaoReal };
                        if (c.effect === "Derrubar" || c.effect === "Derrubado") updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${c.defName}/Derrubado`] = { turnos: 1 };
                    }
                    if(Object.keys(updates).length > 0) window.db.ref().update(updates);
                }
                window.processClashQueue();
            }, 3000); 
        }, 600); 
    }, 1500); 
};
// =========================================================
// SISTEMA DE TETRIS INVENTÁRIO E CONSUMÍVEIS
// =========================================================
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
        let i = itens[k]; if (i.tipo === 'Móvel') return;
        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris ${i.tipo || 'Arma'}`; el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnText = i.eq ? '▼' : '✖'; let btnTitle = i.eq ? 'Guardar na Mochila' : 'Descartar'; let btnClass = i.eq ? 'btn-excluir-item' : 'btn-excluir-item discard';
        let btnRotate = `<button class="btn-rotate-item" title="Rotacionar" onpointerdown="window.girarItemMochila('${k}', ${w}, ${h}, ${i.eq}, event)">↻</button>`;
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span>${i.tipo === 'Comida' ? `<button onclick="window.consumirComida('${k}', ${i.poder||0}, ${i.cd||2}, event)" style="font-size:8px; padding:2px; margin-top:2px; background:#000; color:#0f0; border:1px solid #0f0; border-radius:2px; cursor:pointer; position:relative; z-index:5;">Comer</button>` : ''}<button class="${btnClass}" title="${btnTitle}" onpointerdown="window.removerItemMochila('${k}', event)">${btnText}</button>`;

        if(i.eq === true && i.c !== undefined && i.r !== undefined && parseInt(i.c) < window.GRID_COLS && parseInt(i.r) < window.GRID_ROWS) {
            let ic = parseInt(i.c); let ir = parseInt(i.r);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`; el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) for(let col=ic; col<ic+w; col++) window.tetrisMatrix[row][col] = 1; 
            g.appendChild(el);
        } else {
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto'; l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteTetris);
    });
    window.renderVttFoodActions();
};

window.iniciarArrasteTetris = function(e) {
    if(e.target.closest('.btn-excluir-item') || e.target.closest('.btn-rotate-item') || e.target.tagName.toLowerCase() === 'button') return;
    e.preventDefault(); window.itemArrastado = e.currentTarget; window.arrastandoKey = window.itemArrastado.getAttribute('data-key');
    let gridEl = document.getElementById("grid-personagem"); let rectOrig = window.itemArrastado.getBoundingClientRect();
    if (window.itemArrastado.parentElement === gridEl) {
        window.origin = 'grid'; window.initPos = {c: parseInt(window.itemArrastado.getAttribute('data-c')), r: parseInt(window.itemArrastado.getAttribute('data-r'))};
        let w = parseInt(window.itemArrastado.getAttribute('data-w')); let h = parseInt(window.itemArrastado.getAttribute('data-h'));
        for(let row=window.initPos.r; row<window.initPos.r+h; row++) for(let col=window.initPos.c; col<window.initPos.c+w; col++) window.tetrisMatrix[row][col] = 0; 
    } else { 
        window.origin = 'inv'; let gridRect = gridEl.getBoundingClientRect();
        window.itemArrastado.style.margin = "0"; window.itemArrastado.style.left = (rectOrig.left - gridRect.left) + 'px'; window.itemArrastado.style.top = (rectOrig.top - gridRect.top) + 'px';
        gridEl.appendChild(window.itemArrastado); 
    }
    window.itemArrastado.classList.add('dragging'); window.itemArrastado.style.position = 'absolute'; 
    let newRect = window.itemArrastado.getBoundingClientRect(); window.offsetX = e.clientX - newRect.left; window.offsetY = e.clientY - newRect.top;
    document.addEventListener('pointermove', window.arrastarTetris); document.addEventListener('pointerup', window.soltarTetris);
};

window.arrastarTetris = function(e) { e.preventDefault(); window.moverTetris(e); };
window.moverTetris = function(e) { if(!window.itemArrastado) return; const gridRect = document.getElementById("grid-personagem").getBoundingClientRect(); window.itemArrastado.style.left = `${e.clientX - gridRect.left - window.offsetX}px`; window.itemArrastado.style.top = `${e.clientY - gridRect.top - window.offsetY}px`; };
window.soltarTetris = function(e) {
    document.removeEventListener('pointermove', window.arrastarTetris); document.removeEventListener('pointerup', window.soltarTetris);
    if(!window.itemArrastado) return; window.itemArrastado.classList.remove('dragging');
    const w = parseInt(window.itemArrastado.getAttribute('data-w')), h = parseInt(window.itemArrastado.getAttribute('data-h'));
    let rawLeft = parseFloat(window.itemArrastado.style.left || 0); let rawTop = parseFloat(window.itemArrastado.style.top || 0);
    let tC = Math.round(rawLeft / window.REAL_CELL_SIZE); let tR = Math.round(rawTop / window.REAL_CELL_SIZE);

    if (tC < 0 || tC + w > window.GRID_COLS || tR < 0 || tR + h > window.GRID_ROWS) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null}); } else {
        let livre = true; for(let r=tR; r<tR+h; r++) for(let c=tC; c<tC+w; c++) if(window.tetrisMatrix[r][c] === 1) livre = false;
        if(livre) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: tC, r: tR});
        else { if(window.origin === 'grid') window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: window.initPos.c, r: window.initPos.r}); else window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null}); }
    }
    window.arrastandoKey = null; window.itemArrastado = null; window.renderizarMochila();
};

window.consumirComida = function(k, poder, cd, ev) { 
    if(ev) ev.stopPropagation(); let ov = document.getElementById("eatingOverlay"); let fill = document.getElementById("eatingFill"); if(!ov || !fill) return;
    ov.style.display="flex"; fill.style.width="0%"; void fill.offsetWidth;
    setTimeout(()=>{ fill.style.transition=`width ${cd}s linear`; fill.style.width="100%"; }, 50);
    setTimeout(()=>{
        ov.style.display="none"; let r=window.getSafeRpg(window.usersGlobais[window.jogadorAtual]); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(Math.min(100, r.integridade+parseInt(poder))); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).remove(); window.showNeonToast(`Nutrição +${poder}% restaurada.`);
    }, cd*1000); 
};

window.removerItemMochila = function(k, ev) { 
    if(ev) ev.stopPropagation(); let item = window.usersGlobais[window.jogadorAtual]?.mochila?.[k];
    if(item && item.eq) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({eq: false, c: null, r: null}); } else { if(confirm("Descartar item permanentemente?")) window.db.ref('tokyoRpg/users/' + window.jogadorAtual + '/mochila/' + k).remove(); }
};

window.girarItemMochila = function(k, w, h, eq, ev) {
    if(ev) ev.stopPropagation(); let newW = parseInt(h); let newH = parseInt(w); let up = {};
    if(eq) {
        let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {}; let tempMatrix = Array(window.GRID_ROWS).fill(null).map(()=>Array(window.GRID_COLS).fill(0));
        Object.keys(itens).forEach(ik => { if(ik !== k && itens[ik].eq) { let iW = parseInt(itens[ik].w)||1, iH = parseInt(itens[ik].h)||1; let iC = parseInt(itens[ik].c), iR = parseInt(itens[ik].r); if(!isNaN(iC) && !isNaN(iR)) { for(let row=iR; row<iR+iH; row++) { for(let col=iC; col<iC+iW; col++) { if(row<window.GRID_ROWS && col<window.GRID_COLS) tempMatrix[row][col] = 1; } } } } });
        let startC = parseInt(itens[k].c); let startR = parseInt(itens[k].r); let targetC = startC; let targetR = startR; let found = false; let cabeNoLugar = true;
        if(startC + newW > window.GRID_COLS || startR + newH > window.GRID_ROWS) { cabeNoLugar = false; } else { for(let row=startR; row<startR+newH; row++) { for(let col=startC; col<startC+newW; col++) { if(tempMatrix[row][col] === 1) cabeNoLugar = false; } } }
        if(cabeNoLugar) { found = true; } else {
            let offsets = []; for(let dy = -window.GRID_ROWS; dy <= window.GRID_ROWS; dy++) { for(let dx = -window.GRID_COLS; dx <= window.GRID_COLS; dx++) { offsets.push({dx: dx, dy: dy, dist: Math.abs(dx) + Math.abs(dy)}); } }
            offsets.sort((a,b) => a.dist - b.dist);
            for(let off of offsets) { let nc = startC + off.dx; let nr = startR + off.dy; if(nc >= 0 && nc + newW <= window.GRID_COLS && nr >= 0 && nr + newH <= window.GRID_ROWS) { let livre = true; for(let row=nr; row<nr+newH; row++) { for(let col=nc; col<nc+newW; col++) { if(tempMatrix[row][col] === 1) livre = false; } } if(livre) { found = true; targetC = nc; targetR = nr; break; } } }
        }
        if(found) { let el = document.querySelector(`.item-tetris[data-key='${k}']`); if(el) { el.style.transition = "transform 0.2s ease-in-out"; el.style.transform = "rotate(90deg) scale(0.9)"; el.style.zIndex = "999"; } setTimeout(() => { up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = targetC; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = targetR; window.db.ref().update(up); }, 200); } else { window.showNeonToast("Sem espaço no grid!"); }
    } else {
        let el = document.querySelector(`.item-tetris[data-key='${k}']`); if(el) { el.style.transition = "transform 0.2s ease-in-out"; el.style.transform = "rotate(90deg) scale(0.9)"; } setTimeout(() => { up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = newW; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = newH; window.db.ref().update(up); }, 200);
    }
};

window.renderVttFoodActions = function() {
    let bar = document.getElementById("vttFoodActions"); if(!bar) return; bar.innerHTML = "";
    let inv = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    Object.keys(inv).forEach(k => { if(inv[k].tipo==='Comida' && inv[k].eq) bar.innerHTML += `<button class="btn-eat" onclick="window.consumirComidaVTT('${k}',${inv[k].poder||0},${inv[k].cd||2})">🍽️ Comer ${inv[k].nome}</button>`; });
};

window.consumirComidaVTT = function(k, p, cd) {
    let ov = document.getElementById("eatingOverlay"); let fill = document.getElementById("eatingFill"); if(!ov || !fill) return;
    ov.style.display="flex"; fill.style.width="0%"; void fill.offsetWidth; 
    setTimeout(()=>{ fill.style.transition=`width ${cd}s linear`; fill.style.width="100%"; }, 50);
    setTimeout(()=>{
        ov.style.display="none"; let r=window.getSafeRpg(window.usersGlobais[window.jogadorAtual]); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/rpg/integridade`).set(Math.min(100, r.integridade+p)); window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).remove(); window.renderVttFoodActions(); window.showNeonToast(`Nutrição +${p}% restaurada.`);
    }, cd*1000);
};

// =========================================================
// MERCADO NEGRO E CARRINHO DE COMPRAS
// =========================================================
window.toggleMasterShopPanel = function() {
    let content = document.getElementById("masterShopContent"); let icon = document.getElementById("masterShopToggleIcon"); if(!content || !icon) return;
    if (content.style.display === "none") { content.style.display = "block"; icon.innerText = "▼ Ocultar"; } else { content.style.display = "none"; icon.innerText = "▶ Expandir"; }
};

window.atualizarPlaceholdersLoja = function(tipo) {
    let exW = document.getElementById("niExW"); let exH = document.getElementById("niExH"); 
    if(exW && exH) { if(tipo === 'Mochila') { exW.style.display="inline-block"; exH.style.display="inline-block"; } else { exW.style.display="none"; exH.style.display="none"; } }
};

window.toggleVttFields = function() {
    let isVtt = document.getElementById("niIsVTT") ? document.getElementById("niIsVTT").checked : false; let wpnF = document.getElementById("weaponExtraFields"); if(wpnF) { wpnF.style.display = isVtt ? "grid" : "none"; }
};

window.buscarNaLoja = function(val) { window.termoBuscaLoja = val.toLowerCase(); window.renderizarLojaUI(); };

window.filtrarLoja = function(cat, btnEl) {
    window.filtroLojaAtual = cat; window.termoBuscaLoja = "";
    let searchInp = document.getElementById("shopSearchInp"); if(searchInp) searchInp.value = "";
    let botoes = document.querySelectorAll(".shop-tab-btn"); botoes.forEach(b => b.classList.remove("active")); if(btnEl) btnEl.classList.add("active");
    window.renderizarLojaUI();
};

window.navegarLoja = function(dir) {
    let grid = document.getElementById("shopGrid");
    if(grid) { let scrollAmount = grid.clientWidth * 0.8 * dir; grid.scrollBy({ left: scrollAmount, behavior: 'smooth' }); }
};

window.renderizarLojaUI = function() {
    let grid = document.getElementById("shopGrid"); if(!grid) return; grid.innerHTML = "";
    let itens = window.lojaGlobal || {}; let painelMestre = document.getElementById("masterShopPanel"); if(painelMestre) { painelMestre.style.display = window.isMaster ? "block" : "none"; }
    let chaves = Object.keys(itens); let count = 0;
    chaves.forEach(k => {
        let i = itens[k];
        if(window.termoBuscaLoja !== "") { let sNome = (i.nome||"").toLowerCase(); let sDesc = (i.desc||"").toLowerCase(); if(!sNome.includes(window.termoBuscaLoja) && !sDesc.includes(window.termoBuscaLoja)) return; } 
        else { if(window.filtroLojaAtual !== "Tudo") { if(window.filtroLojaAtual === "Promoções" && !i.isPromo) return; if(window.filtroLojaAtual !== "Promoções" && i.tipo !== window.filtroLojaAtual) return; } }
        
        if(i.wpnCode && i.wpnCode.trim() !== "" && !window.isMaster) return;

        count++; let isM = window.isMaster; let div = document.createElement("div"); div.className = "shop-item" + (isM ? " master-edit" : "");
        let btnComprarText = i.preco + " ¥"; let promoTag = i.isPromo ? `<div class="shop-promo-tag">OFERTA</div>` : "";
        let masterBtns = isM ? `<div style="display:flex;gap:5px;margin-top:10px;"><button class="action-btn" style="flex:1; border-color:#00e5ff; color:#00e5ff;" onclick="window.prepararEdicaoLoja('${k}')">Editar</button><button class="action-btn" style="flex:1; border-color:#f00; color:#f00;" onclick="window.db.ref('tokyoRpg/loja/${k}').remove()">X</button></div>` : "";
        let icone = window.iconesMercado[i.tipo] || "📦";
        
        let atributosHtml = `<div style="font-size:10px; color:#00e5ff; margin-top:5px;">`;
        if(i.poder) atributosHtml += `Poder: ${i.poder} | `;
        if(i.tipo === 'Mochila') atributosHtml += `Espaço: +${i.extraW}x${i.extraH} | `; else atributosHtml += `Tamanho: ${i.w||1}x${i.h||1} | Peso: ${i.peso||1}kg | `;
        if(i.cd) atributosHtml += `CD: ${i.cd}s`;
        if(i.isVTT && i.wpnStyle) { atributosHtml += `<br><span style="color:#ff1a55;">Estilo: ${i.wpnStyle} | Dados: ${i.wpnDice||'N/A'} | Alcance: ${i.wpnRange||1} | Crítico: ${i.wpnCrit||'2x'}</span>`; if(i.wpnEffect && i.wpnEffect !== "") atributosHtml += `<br><span style="color:#ffaa00;">Efeito: ${i.wpnEffect} (${i.wpnEffectVal||1})</span>`; }
        if(i.isConsumable) atributosHtml += `<br><span style="color:#00ff66; font-weight:bold;">⚠️ ITEM CONSUMÍVEL (Uso Único)</span>`;
        if(i.wpnCode && isM) { atributosHtml += `<br><span style="color:var(--accent-purple);">Código Secreto: ${i.wpnCode}</span>`; }
        atributosHtml += `</div>`;

        div.innerHTML = `${promoTag}<div class="shop-item-content"><h3 style="color:${i.isPromo ? '#ffaa00' : 'var(--accent-blue)'};">${icone} ${i.nome}</h3><p>${i.desc}</p>${atributosHtml}</div><div class="shop-item-footer"><button class="action-btn" onclick="window.comprarItem('${k}', '${(i.nome||"").replace(/'/g, "\\'")}', ${i.preco}, '${i.tipo}', '${(i.desc||"").replace(/'/g, "\\'")}', ${i.poder||0}, '${i.buffType||""}', ${i.w||1}, ${i.h||1}, ${i.extraW||0}, ${i.extraH||0}, ${i.peso||1}, ${i.cd||2}, event)">COMPRAR - ${btnComprarText}</button>${masterBtns}</div>`;
        grid.appendChild(div);
    });
    if(count === 0) { grid.innerHTML = `<div style="width:100%; text-align:center; color:#555; padding:50px 0;">Nenhum item encontrado.</div>`; }
};

window.itemCompraAtual = null;

window.comprarItem = function(id, n, p, t, d, poder, buff, w, h, exW, exH, peso, cd, ev) {
    if(ev) ev.stopPropagation(); if(!window.jogadorAtual || window.isMaster) return; 
    let c = window.usersGlobais[window.jogadorAtual].carteira || 0; 
    window.itemCompraAtual = { id: id, n: n, p: p, t: t, d: d, poder: poder, buff: buff, w: w, h: h, exW: exW, exH: exH, peso: peso, cd: cd };
    let buyModal = document.getElementById("buyModal");
    if(!buyModal) {
        let qtdStr = prompt(`Quantas unidades de [${n}] você deseja comprar?`, "1"); if(!qtdStr) return;
        let qtd = parseInt(qtdStr); if(isNaN(qtd) || qtd < 1) { window.showNeonToast("Quantidade inválida."); return; }
        document.getElementById("buyQtdInput").value = qtd; window.confirmarCompraModal();
    } else {
        document.getElementById("buyItemName").innerText = n; document.getElementById("buyQtdInput").value = 1; document.getElementById("buyCurrentBalance").innerText = c + " ¥";
        window.atualizarTotalCompra(); buyModal.style.display = "flex";
    }
};

window.fecharBuyModal = function() { let m = document.getElementById("buyModal"); if(m) m.style.display = "none"; window.itemCompraAtual = null; };
window.alterarQtdCompra = function(delta) { let inp = document.getElementById("buyQtdInput"); let val = parseInt(inp.value) + delta; if(isNaN(val) || val < 1) val = 1; inp.value = val; window.atualizarTotalCompra(); };

window.atualizarTotalCompra = function() {
    if(!window.itemCompraAtual) return;
    let inp = document.getElementById("buyQtdInput"); let qtd = parseInt(inp.value); if(isNaN(qtd) || qtd < 1) { qtd = 1; inp.value = 1; }
    let saldoAtual = window.usersGlobais[window.jogadorAtual].carteira || 0; let custoTotal = window.itemCompraAtual.p * qtd; let saldoFinal = saldoAtual - custoTotal;
    let costEl = document.getElementById("buyTotalCost"); if(costEl) costEl.innerText = custoTotal + " ¥";
    let btn = document.getElementById("btnConfirmBuy"); let spanFinal = document.getElementById("buyFinalBalance");
    if(spanFinal) spanFinal.innerText = saldoFinal + " ¥";
    if(btn && spanFinal) {
        if(saldoFinal < 0) { spanFinal.style.color = "#ff1a55"; btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; btn.innerText = "SEM FUNDOS"; } 
        else { spanFinal.style.color = "var(--accent-blue)"; btn.disabled = false; btn.style.opacity = "1"; btn.style.cursor = "pointer"; btn.innerText = "FINALIZAR"; }
    }
};

window.confirmarCompraModal = function() {
    if(!window.itemCompraAtual) return; let qtdInput = document.getElementById("buyQtdInput");
    let qtd = qtdInput ? parseInt(qtdInput.value) : 1; if(isNaN(qtd) || qtd < 1) qtd = 1;
    let saldoAtual = window.usersGlobais[window.jogadorAtual].carteira || 0; let totalCusto = window.itemCompraAtual.p * qtd;
    if(saldoAtual < totalCusto) { window.showNeonToast(`Sem Yenes suficientes!`); return; }
    let i = window.itemCompraAtual; let lojaItem = window.lojaGlobal[i.id]; 
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(saldoAtual - totalCusto);
    let isCons = lojaItem ? (lojaItem.isConsumable || false) : false; let isVttItem = lojaItem ? (lojaItem.isVTT === true || lojaItem.tipo === 'Arma' || lojaItem.tipo === 'Munição') : false;
    let itemPayload = { id: i.id, nome: i.n, tipo: i.t, desc: i.d, poder: i.poder, buffType: i.buff, w: i.w, h: i.h, extraW: i.exW, extraH: i.exH, peso: i.peso, cd: i.cd, eq: false, isConsumable: isCons, isVTT: isVttItem };
    if(isVttItem && lojaItem && lojaItem.wpnStyle) { itemPayload.wpnStyle = lojaItem.wpnStyle; itemPayload.wpnRange = lojaItem.wpnRange || 1; itemPayload.wpnDice = lojaItem.wpnDice || '1d4'; itemPayload.wpnBonus = lojaItem.wpnBonus || 0; itemPayload.wpnCrit = lojaItem.wpnCrit || '2x'; itemPayload.wpnEffect = lojaItem.wpnEffect || ''; itemPayload.wpnEffectVal = lojaItem.wpnEffectVal || 1; }
    let updates = {}; for(let idx = 0; idx < qtd; idx++) { let newRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila`).push(); updates[`tokyoRpg/users/${window.jogadorAtual}/mochila/${newRef.key}`] = itemPayload; }
    window.db.ref().update(updates).then(() => { window.showNeonToast(`${qtd}x [${i.n}] Adquirido!`); window.fecharBuyModal(); });
};

window.resgatarCodigoLoja = function() {
    let codeInp = document.getElementById("playerPromoCode"); if(!codeInp) return; let code = codeInp.value.trim().toUpperCase(); if(code === "") return;
    let achou = false;
    Object.keys(window.lojaGlobal).forEach(k => { let i = window.lojaGlobal[k]; if(i.wpnCode && i.wpnCode.toUpperCase() === code) { achou = true; window.comprarItem(k, i.nome, i.preco, i.tipo, i.desc, i.poder||0, i.buffType||'', i.w||1, i.h||1, i.extraW||0, i.extraH||0, i.peso||1, i.cd||2, null); codeInp.value = ""; } });
    if(!achou) { window.showNeonToast("Código Inválido ou Inexistente."); }
};

window.prepararEdicaoLoja = function(id) {
    try {
        if(!window.isMaster) return; let i = window.lojaGlobal[id]; if(!i) return; window.editandoItemId = id;
        window.setElVal("niType", i.tipo || "Arma"); if(typeof window.atualizarPlaceholdersLoja === "function") window.atualizarPlaceholdersLoja(i.tipo || "Arma");
        window.setElVal("niName", i.nome || ""); window.setElVal("niDesc", i.desc || ""); window.setElVal("niBuffType", i.buffType || ""); window.setElVal("niPoder", i.poder || ""); window.setElVal("niW", i.w || ""); window.setElVal("niH", i.h || ""); window.setElVal("niPrice", i.preco || ""); window.setElVal("niExW", i.extraW || ""); window.setElVal("niExH", i.extraH || ""); window.setElVal("niPeso", i.peso || ""); window.setElVal("niCD", i.cd || "");
        let chkPromo = document.getElementById("niPromo"); if(chkPromo) chkPromo.checked = (i.isPromo === true);
        let chkCons = document.getElementById("niConsumable"); if(chkCons) chkCons.checked = (i.isConsumable === true);
        let isVttItem = (i.isVTT === true || i.tipo === 'Arma' || i.tipo === 'Munição'); 
        let chkVTT = document.getElementById("niIsVTT"); if(chkVTT) { chkVTT.checked = isVttItem; window.toggleVttFields(); }
        if(isVttItem) {
            window.setElVal("niWpnStyle", i.wpnStyle || 'melee'); window.setElVal("niWpnRange", i.wpnRange || ""); window.setElVal("niWpnDice", i.wpnDice || ""); window.setElVal("niWpnBonus", i.wpnBonus || ""); window.setElVal("niWpnCrit", i.wpnCrit || "2x"); window.setElVal("niWpnEffect", i.wpnEffect || ""); window.setElVal("niWpnEffectVal", i.wpnEffectVal || ""); window.setElVal("niWpnCode", i.wpnCode || "");
        }
        if(document.getElementById("btnSalvarLoja")) document.getElementById("btnSalvarLoja").innerText = "Salvar Alterações"; window.setElDisplay("btnCancelarEdicao", "inline-block"); 
        let content = document.getElementById("masterShopContent"); let icon = document.getElementById("masterShopToggleIcon");
        if(content && content.style.display === "none") { content.style.display = "block"; icon.innerText = "▼ Ocultar"; }
        let p = document.getElementById("masterShopPanel"); if(p) p.scrollIntoView({behavior: "smooth"});
    } catch(err) { console.error("Erro ao editar:", err); window.showNeonToast("Erro na edição! Sistema auto-corrigido."); }
};

window.cancelarEdicaoLoja = function() { 
    window.editandoItemId = null; window.setElVal("niName", ""); window.setElVal("niDesc", ""); window.setElVal("niPrice", ""); window.setElVal("niPoder", ""); window.setElVal("niExW", ""); window.setElVal("niExH", ""); window.setElVal("niPeso", ""); window.setElVal("niCD", ""); 
    let chkPromo = document.getElementById("niPromo"); if(chkPromo) chkPromo.checked = false;
    let chkCons = document.getElementById("niConsumable"); if(chkCons) chkCons.checked = false;
    let chkVTT = document.getElementById("niIsVTT"); if(chkVTT) { chkVTT.checked = false; window.toggleVttFields(); }
    window.setElVal("niType", "Arma"); if(typeof window.atualizarPlaceholdersLoja === "function") window.atualizarPlaceholdersLoja("Arma");
    window.setElVal("niWpnStyle", "melee"); window.setElVal("niWpnRange", ""); window.setElVal("niWpnDice", ""); window.setElVal("niWpnBonus", ""); window.setElVal("niWpnCrit", "2x"); window.setElVal("niWpnEffect", ""); window.setElVal("niWpnEffectVal", ""); window.setElVal("niWpnCode", "");
    if(document.getElementById("btnSalvarLoja")) document.getElementById("btnSalvarLoja").innerText = "Publicar no Mercado"; window.setElDisplay("btnCancelarEdicao", "none"); 
};

window.criarItemLoja = function() {
    if(!window.isMaster) return; 
    let nomeVal = document.getElementById("niName").value.trim(); let precoVal = document.getElementById("niPrice").value;
    if(!nomeVal || precoVal === "") { window.showNeonToast("ERRO: Preencha o Nome e o Preço."); return; }
    let isP = document.getElementById("niPromo") ? document.getElementById("niPromo").checked : false;
    let isCons = document.getElementById("niConsumable") ? document.getElementById("niConsumable").checked : false;
    let isVttCheck = document.getElementById("niIsVTT") ? document.getElementById("niIsVTT").checked : false;
    let payload = { tipo: document.getElementById("niType").value, nome: nomeVal, desc: document.getElementById("niDesc").value.trim(), buffType: document.getElementById("niBuffType").value, poder: parseInt(document.getElementById("niPoder").value||"0"), w: parseInt(document.getElementById("niW").value||"1"), h: parseInt(document.getElementById("niH").value||"1"), preco: parseInt(precoVal||"0"), extraW: parseInt(document.getElementById("niExW").value||"0"), extraH: parseInt(document.getElementById("niExH").value||"0"), peso: parseInt(document.getElementById("niPeso").value||"1"), cd: parseInt(document.getElementById("niCD").value||"2"), isPromo: isP, isConsumable: isCons, isVTT: isVttCheck };
    
    if(isVttCheck) {
        payload.wpnStyle = document.getElementById("niWpnStyle") ? document.getElementById("niWpnStyle").value : "melee"; payload.wpnRange = document.getElementById("niWpnRange") ? parseInt(document.getElementById("niWpnRange").value || "1") : 1; payload.wpnDice = document.getElementById("niWpnDice") ? (document.getElementById("niWpnDice").value || "1d4") : "1d4"; payload.wpnBonus = document.getElementById("niWpnBonus") ? parseInt(document.getElementById("niWpnBonus").value || "0") : 0; payload.wpnCrit = document.getElementById("niWpnCrit") ? (document.getElementById("niWpnCrit").value || "2x") : "2x"; payload.wpnEffect = document.getElementById("niWpnEffect") ? (document.getElementById("niWpnEffect").value || "") : ""; payload.wpnEffectVal = document.getElementById("niWpnEffectVal") ? parseInt(document.getElementById("niWpnEffectVal").value || "1") : 1; payload.wpnCode = document.getElementById("niWpnCode") ? document.getElementById("niWpnCode").value.trim().toUpperCase() : "";
    } else { payload.wpnStyle = null; }

    if(window.editandoItemId) {
        window.db.ref('tokyoRpg/loja/' + window.editandoItemId).update(payload).then(() => {
            window.db.ref('tokyoRpg/users').once('value').then(snap => {
                let usrs = snap.val(); let updates = {};
                if(usrs) { Object.keys(usrs).forEach(uKey => { let inv = usrs[uKey].mochila; if(inv) { Object.keys(inv).forEach(mKey => { if(inv[mKey].id === window.editandoItemId || inv[mKey].nome === payload.nome) { updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/nome`] = payload.nome; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/desc`] = payload.desc; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/poder`] = payload.poder; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/buffType`] = payload.buffType; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/w`] = payload.w; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/h`] = payload.h; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/extraW`] = payload.extraW; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/extraH`] = payload.extraH; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/peso`] = payload.peso; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/cd`] = payload.cd; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/isConsumable`] = payload.isConsumable; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/isVTT`] = payload.isVTT; if(isVttCheck) { updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnStyle`] = payload.wpnStyle; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnRange`] = payload.wpnRange; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnDice`] = payload.wpnDice; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnBonus`] = payload.wpnBonus; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnCrit`] = payload.wpnCrit; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnEffect`] = payload.wpnEffect; updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnEffectVal`] = payload.wpnEffectVal; } else { updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnStyle`] = null; } } }); } }); }
                if(Object.keys(updates).length > 0) window.db.ref().update(updates);
            });
        });
        window.showNeonToast("Item Atualizado!"); window.cancelarEdicaoLoja();
    } else { window.db.ref('tokyoRpg/loja').push(payload); window.showNeonToast("Publicado!"); window.cancelarEdicaoLoja(); }
};

// =========================================================
// SISTEMA DERRUBADO (CARA OU COROA)
// =========================================================
window.abrirModalCaraCoroa = function() {
    document.getElementById("coinFlipModal").style.display = "flex";
    document.getElementById("coinAnimationArea").innerHTML = "🪙";
    document.getElementById("coinChoiceButtons").style.display = "flex";
};

window.jogarCaraOuCoroa = function(escolha) {
    document.getElementById("coinChoiceButtons").style.display = "none";
    let coinArea = document.getElementById("coinAnimationArea");
    let flips = 0; let flipInterval = setInterval(() => { coinArea.innerHTML = flips % 2 === 0 ? "🙂" : "👑"; flips++; }, 100);

    setTimeout(() => {
        clearInterval(flipInterval);
        let resultado = Math.random() < 0.5 ? "Cara" : "Coroa";
        let emoji = resultado === "Cara" ? "🙂" : "👑";
        let isWinner = (escolha === resultado);
        
        coinArea.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; gap:10px;"><span style="font-size:60px;">${emoji}</span><span style="font-size:22px; font-weight:900; color:${isWinner ? '#00ff66' : '#ff1a55'}; text-shadow: 0 0 10px ${isWinner ? '#00ff66' : '#ff1a55'};">${resultado.toUpperCase()}!</span></div>`;

        setTimeout(() => {
            document.getElementById("coinFlipModal").style.display = "none";
            if(isWinner) {
                window.showNeonToast("SUCESSO! Você conseguiu levantar.");
                window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Tirou ${resultado} no Cara ou Coroa e <span class="neon-green">se levantou!</span>` });
                window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}/status/${window.jogadorAtual}/Derrubado`).remove();
            } else {
                window.showNeonToast("FALHOU! Continua no chão.");
                window.db.ref('tokyoRpg/mapDados').push({ nome: window.jogadorAtual, texto: `Tirou ${resultado} no Cara ou Coroa e <span class="neon-red">continua caído.</span> Perdeu a vez!` });
                window.passarTurnoVTT();
            }
        }, 2500);
    }, 1500);
};

// =========================================================
// AVATARES E IGAMBLE
// =========================================================
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

// LOGIN E CONEXÃO
window.dispararLoadingLogin = async function(isS) {
    let n = document.getElementById("loginName").value.trim().toUpperCase(); let p = document.getElementById("loginPass").value; let s = document.getElementById("loginSerial").value.trim().toUpperCase();
    if(isS) { if(!s) return; s = s + "-DC1"; } if(!isS && (!n || !p)) return;
    window.setElDisplay('loginScreen', 'none'); window.setElDisplay('loadingTerminal', 'flex');
    let lines = [ "ESTABELECENDO CONEXÃO SEGURA...", "IMPORT_SERVER_DATA(192.168.0.45)...", "VERIFICANDO CREDENCIAIS...", "ACESSO CONCEDIDO." ]; let txt = "";
    for(let line of lines) { txt += line + "<br><br>"; window.setElHTML('loadingText', txt); await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); }
    window.setElDisplay('loadingTerminal', 'none');
    if(isS) window.logarComSerialFinal(s); else window.logarComSenhaFinal(n, p);
};
window.logarComSenhaFinal = function(n, s) { window.db.ref('tokyoRpg/users/' + n).once('value').then((snap) => { let ud = snap.val(); if(ud) { if (ud.senha !== s) { alert("Senha incorreta."); window.setElDisplay('loginScreen', 'block'); return; } window.logarSucesso(n, ud.serial); } else { let ns = Math.floor(1000 + Math.random()*9000)+"-DC1"; window.db.ref('tokyoRpg/users/' + n).set({ senha: s, serial: ns, carteira: 0, rpg: window.getSafeRpg(null) }); window.logarSucesso(n, ns); alert(`Criado.`); } }); };
window.logarComSerialFinal = function(s) { if(s === window.MASTER_SERIAL) { window.db.ref('tokyoRpg/users/MESTRE').update({ serial: window.MASTER_SERIAL, carteira: 9999999 }); window.logarSucesso("MESTRE", window.MASTER_SERIAL); return; } let achou = false; Object.keys(window.usersGlobais).forEach(n => { if(window.usersGlobais[n].serial === s) { achou = true; window.logarSucesso(n, s); }}); if(!achou) { alert("Serial não encontrado."); window.setElDisplay('loginScreen', 'block'); } };

window.logarSucesso = function(n, s) {
    window.jogadorAtual = n; window.serialAtual = s; window.isMaster = (s === window.MASTER_SERIAL); 
    if(window.isMaster) { let sel = document.getElementById("embLocal"); if(sel) {sel.innerHTML = "<option value=''>Selecione...</option>"; Object.keys(window.locaisMapa).forEach(k => { sel.innerHTML += `<option value="${k}">${window.locaisMapa[k].nome}</option>`; });} }
    window.setElDisplay("loginModal", "none"); window.setElDisplay("base-desktop", "flex"); window.setElDisplay("gameContainer", "none");
    window.renderizarFicha(); window.renderizarMochila(); window.renderizarLojaUI(); window.desenharMapa(true); window.renderizarPanteao();
    if(typeof window.escutarNotificacoes === 'function') window.escutarNotificacoes(); 
    if(window.db && window.jogadorAtual) { window.db.ref('.info/connected').on('value', function(s) { if (s.val() === true) { window.connectionRef = window.db.ref('tokyoRpg/presence/' + window.jogadorAtual); window.connectionRef.onDisconnect().set(false).then(() => { window.connectionRef.set(true); }); }}); }
};

window.deslogar = function() { if(window.connectionRef) window.connectionRef.set(false); window.jogadorAtual = ""; window.serialAtual = ""; window.isMaster = false; window.setElVal("loginName", ""); window.setElVal("loginPass", ""); window.setElVal("loginSerial", ""); window.fecharCelular(); window.setElDisplay('gameContainer', 'none'); window.setElDisplay('base-desktop', 'none'); window.abrirModal(); window.desenharMapa(true); };

window.postAudioMuted = true;
window.toggleGambleMute = function() {
    window.postAudioMuted = !window.postAudioMuted; let btn = document.getElementById("btnToggleMute");
    if(btn) { btn.innerText = window.postAudioMuted ? "🔇 Áudio Bloqueado" : "🔊 Áudio Liberado"; btn.style.borderColor = window.postAudioMuted ? "#aaa" : "#0f0"; btn.style.color = window.postAudioMuted ? "#aaa" : "#0f0"; }
    if(window.postAudioMuted) { document.querySelectorAll('audio.post-audio').forEach(a => a.pause()); return; }
    document.querySelectorAll('audio.post-audio').forEach(a => { let rect = a.getBoundingClientRect(); if(rect.top >= 0 && rect.bottom <= window.innerHeight) a.play().catch(()=>{}); });
};

window.togglePostCreator = function() { let bx = document.getElementById("postCreatorBox"); if(bx) bx.style.display = (bx.style.display === "none" || bx.style.display === "") ? "block" : "none"; };

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
    
    // BLOQUEIO DE SEGURANÇA PARA VÍDEOS GIGANTES DO PC (5MB)
    if(imgFile && imgFile.size > 5000000) { window.showNeonToast("Arquivo muito grande! Máximo de 5MB."); return; }

    let postarNoBanco = function(n, a, idAutor, finalImg) {
        let uPop = (window.usersGlobais[idAutor] && window.usersGlobais[idAutor].popTier) ? window.usersGlobais[idAutor].popTier : "branca";
        if(window.isMaster && isAd) uPop = "dourado";
        let pData = window.popularityTiers[uPop] || window.popularityTiers["branca"];
        let tLikes = Math.floor(Math.random() * (pData.maxL - pData.minL + 1)) + pData.minL;

        let payload = { autor: n, autorId: idAutor, avatar: a, texto: txt, imagem: finalImg || "", audio: audio, timestamp: Date.now(), isAd: (window.isMaster && isAd), likes: 0, targetLikes: tLikes, reposts: 0, likers: {}, reposters: {}, comentarios: {} };

        let newPostRef = window.db.ref('tokyoRpg/posts').push();
        newPostRef.set(payload).then(() => {
            if(typeof window.dispatchMentions === "function") { window.dispatchMentions({ from: idAutor !== "MESTRE" ? window.jogadorAtual : "SISTEMA", contextType: "gpost", contextId: newPostRef.key, text: txt }); }

            if(document.getElementById("postText")) document.getElementById("postText").value = "";
            if(document.getElementById("postImgUrl")) document.getElementById("postImgUrl").value = "";
            if(document.getElementById("postAudioUrl")) document.getElementById("postAudioUrl").value = "";
            if(document.getElementById("postImgFile")) document.getElementById("postImgFile").value = "";
            let bx = document.getElementById("postCreatorBox"); if(bx) bx.style.display = "none";
            window.showNeonToast("Publicado!");
        });
    };

    if(window.isMaster) {
        let nome = cName || "SISTEMA"; let avatar = cAv || "https://api.dicebear.com/9.x/bottts/svg?seed=Master";
        if(imgFile) { let r = new FileReader(); r.onload = (e) => postarNoBanco(nome, avatar, "MESTRE", e.target.result); r.readAsDataURL(imgFile); } else { postarNoBanco(nome, avatar, "MESTRE", imgUrl); }
        return;
    }

    let u = window.usersGlobais?.[window.jogadorAtual];
    let nome = u?.nome || window.jogadorAtual; let avatar = u?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${nome}`;
    if(imgFile) { let r = new FileReader(); r.onload = (e) => postarNoBanco(nome, avatar, window.jogadorAtual, e.target.result); r.readAsDataURL(imgFile); } else { postarNoBanco(nome, avatar, window.jogadorAtual, imgUrl); }
};

window.curtirPost = function(id, event) {
    if(!window.jogadorAtual) return; 
    
    // Dispara o Coração subindo EXATAMENTE onde a pessoa clicou!
    if(event) {
        window.animarCoracaoTela(event.clientX, event.clientY);
        event.currentTarget.style.transform = "scale(1.3)";
        setTimeout(() => event.currentTarget.style.transform = "scale(1)", 150);
    }

    let ref = window.db.ref(`tokyoRpg/posts/${id}`);
    if (window.isMaster) {
        ref.once('value').then(snap => { let p = snap.val(); if(!p) return; ref.update({ likes: (p.likes||0) + 10000 }); window.showNeonToast("Boost de Curtidas Aplicado!"); });
        return;
    }
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
    if (window.isMaster) {
        ref.once('value').then(snap => { let p = snap.val(); if(!p) return; ref.update({ reposts: (p.reposts||0) + 10 }); window.showNeonToast("Boost de Reposts Aplicado!"); });
        return;
    }
    ref.once('value').then(snap => { 
        let p = snap.val(); if(!p) return; 
        let rps = p.reposters || {}; 
        if(!rps[window.jogadorAtual]) { 
            rps[window.jogadorAtual] = true; 
            ref.update({ reposts: (p.reposts || 0) + 1, reposters: rps }); 
            window.showNeonToast("Compartilhado!"); 
        } 
    });
};

window.postObserver = window.postObserver || new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        let audioEl = entry.target.querySelector('audio.post-audio');
        if(!audioEl) return;
        if(entry.isIntersecting) { 
            if(!window.postAudioMuted) { 
                audioEl.currentTime = 0; 
                let p = audioEl.play();
                if(p !== undefined) p.catch(()=>{});
            } 
        } else { 
            audioEl.pause(); 
        }
    });
}, { threshold: 0.6 });

window.switchIGambleTab = function(tabId, btnEl) {
  document.querySelectorAll(".igamble-tab-btn").forEach(b => b.classList.remove("active"));
  if(btnEl) btnEl.classList.add("active");

  if(typeof window.marcarNotificacoesComoLidas === "function") window.marcarNotificacoesComoLidas(tabId);

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

window.excluirPost = function(postId) {
  if (!window.db || !postId) return;
  window.db.ref(`tokyoRpg/posts/${postId}`).remove().then(() => { window.showNeonToast("Post excluído!"); });
};

window.criarEmbate = function() {
  if (!window.isMaster || !window.db) return;
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

window.canDeletePost = function(post) {
  if (!post) return false; if (window.isMaster) return true; if (!window.jogadorAtual) return false;
  const myUser = window.usersGlobais?.[window.jogadorAtual] || {}; const myName = (myUser.nome || window.jogadorAtual || "").toString();
  if (post.autorId && post.autorId === window.jogadorAtual) return true;
  const autor = (post.autor || "").toString(); if (autor && (autor === myName || autor === window.jogadorAtual)) return true;
  return false;
};

// =========================================================
// G-POST TURBINADO: LAZY LOAD E RAM INTELIGENTE (LIMITE DE 3)
// =========================================================

window.limitGPosts = 3; // Limite ultra restrito de 3 posts para não estourar a memória
window.postsListenerRef = null;

window.toggleMasterPostMenu = function(postId) {
    let menu = document.getElementById("masterMenu_" + postId);
    if(menu) { menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none"; }
};

window.iniciarListenersIgamble = function() {
  if (!window.db) return; if (window._igambleListenersStarted) return; window._igambleListenersStarted = true;

  const feed = document.getElementById("igamblePostsFeed"); 
  if(feed) feed.innerHTML = "<div style='text-align:center; padding:50px; color:#00e5ff; font-weight:bold; animation: pulse 1.5s infinite;'>Conectando à rede do Distrito...</div>";

  window.postsListenerRef = window.db.ref("tokyoRpg/posts");
  
  window.postsListenerRef.limitToLast(window.limitGPosts).on("value", snap => {
    if(!feed) return; 
    const data = snap.val(); if(!data) { feed.innerHTML = "<div style='text-align:center; color:#555; padding:30px;'>O feed está vazio.</div>"; return; }

    let htmlStr = "";
    const postsArray = Object.keys(data).map(id => ({ id, ...data[id] })).sort((a,b) => (b.timestamp||0) - (a.timestamp||0));

    postsArray.forEach(p => {
      try {
          const d = new Date(p.timestamp || Date.now()); const timeStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} - ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
          
          let isVideo = false;
          if(p.imagem) {
              let cStr = p.imagem.toLowerCase();
              if(cStr.includes('.mp4') || cStr.includes('.webm') || cStr.startsWith('data:video')) isVideo = true;
          }

          const hasBg = p.imagem ? (isVideo ? `<video data-src="${p.imagem}" class="post-media-bg" muted loop playsinline preload="none" style="min-height: 300px;"></video>` : `<img loading="lazy" src="${p.imagem}" class="post-media-bg" style="min-height: 300px;">`) : ""; 
          const hasImg = p.imagem ? (isVideo ? `<video data-src="${p.imagem}" class="post-media" controls loop muted playsinline preload="none" style="min-height: 300px;"></video>` : `<img loading="lazy" src="${p.imagem}" class="post-media" style="min-height: 300px;">`) : ""; 
          const hasAudio = p.audio ? `<audio class="post-audio" preload="none" loop src="${p.audio}"></audio>` : "";
          
          const iLiked = (p.likers && window.jogadorAtual && p.likers[window.jogadorAtual]) ? "liked" : ""; const iReposted = (p.reposters && window.jogadorAtual && p.reposters[window.jogadorAtual]) ? "reposted" : ""; const numComents = p.comentarios ? Object.keys(p.comentarios).length : 0;
          const delBtn = window.canDeletePost(p) ? `<button class="post-del-btn" onclick="window.excluirPost('${p.id}')">EXCLUIR</button>` : ""; 
          const adTag = p.isAd ? `<span class="post-ad-tag">⭐ PATROCINADO</span>` : "";

          let followBtnHtml = typeof window.getFollowButtonHtml === "function" ? window.getFollowButtonHtml(p.autor) : "";
          
          let uData = window.usersGlobais[p.autorId] || window.usersGlobais[p.autor] || {};
          let popTier = window.popularityTiers[uData.popTier] || window.popularityTiers["branca"];
          if (p.isAd) popTier = window.popularityTiers["dourado"]; 
          let starHtml = `<span class="pop-star" style="color:${popTier.cor}; text-shadow: 0 0 10px ${popTier.cor};" title="${popTier.nome}">${popTier.icone}</span>`;

          let likesFormated = window.formatNumberInfo(p.likes || 0);
          let repostsFormated = window.formatNumberInfo(parseInt(p.reposts) || 0);

          let masterBtnToggle = ""; let masterToolsHtml = "";
          
          if(window.isMaster) {
              masterBtnToggle = `<button class="post-del-btn" style="border-color:#ffaa00; color:#ffaa00; margin-right: 5px;" onclick="window.toggleMasterPostMenu('${p.id}')">⚙️ MESTRE</button>`;
              masterToolsHtml = `
              <div id="masterMenu_${p.id}" style="display: none; position: relative; z-index: 50; margin-top: 10px; background: rgba(10,10,15,0.95); border: 1px solid #ff1a55; padding: 12px; border-radius: 8px; box-shadow: 0 0 20px rgba(255,26,85,0.4);">
                  <h4 style="color:#ff1a55; margin:0 0 10px 0; font-size:12px; text-align:center; border-bottom: 1px dashed #ff1a55; padding-bottom: 5px;">PAINEL DE ENGAJAMENTO</h4>
                  <div style="display:flex; flex-direction:column; gap: 10px;">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                          <span style="font-size:10px; color:#fff; font-weight:bold;">Criar Comentários Fakes:</span>
                          <select id="botCtx_${p.id}" style="background:#000; color:#fff; font-size:11px; padding:4px; border:1px solid #555; border-radius:4px; width: 120px;">
                              <option value="selfie">Selfie / Look</option><option value="selfie_grupo">Selfie em Grupo</option><option value="paisagem">Paisagem</option><option value="batalha">Batalha / Sangue</option><option value="tristeza">Derrota</option><option value="ostentacao">Grana Alta</option><option value="romantica">Romântica</option><option value="radical">Radical</option><option value="trabalho">Do Trabalho</option>
                          </select>
                      </div>
                      <button class="action-btn" style="margin: 5px 0 0 0; width: 100%; font-size:11px; border-color:#ff1a55; color:#ff1a55;" onclick="window.gerarComentariosBot('${p.id}', document.getElementById('botCtx_${p.id}').value)">🤖 Injetar Bots no Post</button>
                  </div>
              </div>`;
          }

          htmlStr += `<div class="post-card" id="post-${p.id}">${hasBg}${hasImg}${hasAudio}<div class="post-overlay"><div class="post-header"><div class="post-header-left"><div class="avatar-wrapper"><img src="${p.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Anon"}" class="post-avatar">${followBtnHtml}</div><div><div class="post-name">${p.autor || "---"} ${starHtml} ${adTag}</div><div style="font-size:10px; color:#aaa;">${timeStr}</div></div></div><div>${masterBtnToggle}${delBtn}</div></div><div class="post-body"><div class="post-caption">${p.texto || ""}</div>${masterToolsHtml}<div class="post-sidebar"><button class="post-btn-vert ${iLiked}" onclick="window.curtirPost('${p.id}', event)">❤ <span style="color:#ffffff !important; text-shadow: 0 0 5px #000000 !important;">${likesFormated}</span></button><button class="post-btn-vert" onclick="window.abrirComentarios('${p.id}')">💬 <span style="color:#ffffff !important; text-shadow: 0 0 5px #000000 !important;">${numComents}</span></button><button class="post-btn-vert ${iReposted}" onclick="window.repostarPost('${p.id}')">🔄 <span style="color:#ffffff !important; text-shadow: 0 0 5px #000000 !important;">${repostsFormated}</span></button></div></div></div></div>`;
      } catch(err) { console.error("Post isolado por erro:", p.id, err); }
    });

    // BOTÃO FORA DO LOOP (Aparece só 1 vez no final)
    htmlStr += `
    <div style="text-align:center; padding: 20px 0 40px 0; display:flex; flex-direction:column; align-items:center;">
        <button onclick="window.loadMorePosts()" style="background: rgba(0, 229, 255, 0.1); border: 2px solid var(--accent-blue); color: var(--accent-blue); border-radius: 50%; width: 50px; height: 50px; font-size: 20px; cursor: pointer; box-shadow: 0 0 15px rgba(0,229,255,0.4); display:flex; justify-content:center; align-items:center; transition: 0.3s;">
            ⬇
        </button>
        <span style="color:var(--accent-blue); font-size:11px; margin-top:8px; font-weight:bold; text-shadow: 0 0 5px var(--accent-blue);">CARREGAR +3</span>
    </div>`;

    feed.innerHTML = htmlStr;

    try { 
        if (window.postObserver) { 
            window.postObserver.disconnect();
            document.querySelectorAll(".post-card").forEach(card => { window.postObserver.observe(card); }); 
        } 
    } catch(e) {}
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
// O OBSERVADOR INTELIGENTE (PAUSA VÍDEOS DE FORA DA TELA)
// =========================================================
window.postObserver = window.postObserver || new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        let card = entry.target;
        let videos = card.querySelectorAll('video');
        let audioEl = card.querySelector('audio.post-audio');
        
        if(entry.isIntersecting) { 
            // O post apareceu na tela! Dá Play!
            videos.forEach(v => {
                if(!v.src) v.src = v.getAttribute('data-src'); // Carrega a fonte
                let p = v.play(); if(p) p.catch(()=>{});
            });
            if(audioEl && !window.postAudioMuted) { 
                audioEl.currentTime = 0; 
                let p = audioEl.play(); if(p) p.catch(()=>{});
            } 
        } else { 
            // Post saiu da tela! Pausa os vídeos e áudios pra não bugar a máquina
            videos.forEach(v => { v.pause(); });
            if(audioEl) audioEl.pause(); 
        }
    });
}, { rootMargin: "300px 0px", threshold: 0.1 }); 

window.loadMorePosts = function() {
    window.limitGPosts += 3; // Puxa MAIS 3 ao clicar
    window.showNeonToast("Carregando +3 posts antigos...");
    if(window.postsListenerRef) window.postsListenerRef.off();
    window._igambleListenersStarted = false; 
    window.iniciarListenersIgamble();
};

// =========================================================
// ROLAGEM INFINITA DO G-POST
// =========================================================
window.loadMorePosts = function() {
    window.limitGPosts += 10;
    window.showNeonToast("Carregando mais dados da rede...");
    if(window.postsListenerRef) window.postsListenerRef.off();
    window._igambleListenersStarted = false; // Força reiniciar o observador com +10 posts
    window.iniciarListenersIgamble();
};
window.getFollowButtonHtml = function(autorName) {
    if (!window.jogadorAtual || autorName === window.jogadorAtual || autorName === "MESTRE" || autorName === "SISTEMA") return "";
    let me = window.usersGlobais[window.jogadorAtual] || {}; let target = window.usersGlobais[autorName] || {};
    let iFollow = me.seguindo && me.seguindo[autorName]; let theyFollow = target.seguindo && target.seguindo[window.jogadorAtual];
    let safeClass = autorName.replace(/[^a-zA-Z0-9]/g, ''); 
    if (iFollow && theyFollow) return `<div class="follow-badge-btn friends follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">✓✓ Amigos</div>`;
    else if (iFollow) return `<div class="follow-badge-btn following follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">✓</div>`;
    else return `<div class="follow-badge-btn follow-btn-${safeClass}" onclick="window.toggleFollow('${autorName}', event)">+</div>`;
};

window.toggleFollow = function(alvo, event) {
    if (event) event.stopPropagation(); if (!window.jogadorAtual || alvo === window.jogadorAtual) return;
    let me = window.usersGlobais[window.jogadorAtual] || {}; let target = window.usersGlobais[alvo] || {};
    let isFollowing = me.seguindo && me.seguindo[alvo]; let theyFollow = target.seguindo && target.seguindo[window.jogadorAtual];
    let updates = {};
    if (isFollowing) {
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = null; updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = null;
        window.showNeonToast(`Você deixou de seguir ${alvo}`);
    } else {
        updates[`tokyoRpg/users/${window.jogadorAtual}/seguindo/${alvo}`] = true; updates[`tokyoRpg/users/${alvo}/seguidores/${window.jogadorAtual}`] = true;
        if(typeof window.enviarNotificacao === "function") window.enviarNotificacao(alvo, 'gpost', window.jogadorAtual, "começou a seguir você!", "follow");
        window.showNeonToast(`Você agora segue ${alvo}`);
    }
    window.db.ref().update(updates);
    
    let safeClass = alvo.replace(/[^a-zA-Z0-9]/g, '');
    document.querySelectorAll(`.follow-btn-${safeClass}`).forEach(btn => {
        if (isFollowing) { btn.className = `follow-badge-btn follow-btn-${safeClass}`; btn.innerHTML = "+"; } 
        else { 
            if(theyFollow) { btn.className = `follow-badge-btn friends follow-btn-${safeClass}`; btn.innerHTML = "✓✓ Amigos"; } 
            else { btn.className = `follow-badge-btn following follow-btn-${safeClass}`; btn.innerHTML = "✓"; }
        }
    });
};

window.enviarMsgGamble = function() {
    try {
        if (!window.db || !window.jogadorAtual) return;
        const inp = document.getElementById("chatInputMsg");
        const txt = (inp.value || "").trim(); 
        if (!txt) return;

        let msgData = { nome: window.jogadorAtual, texto: txt, data: new Date().toLocaleTimeString(), ts: Date.now() };

        if (window.mensagemEmResposta) { msgData.replyTo = window.mensagemEmResposta.nome; msgData.replyText = window.mensagemEmResposta.texto; }

        window.db.ref("tokyoRpg/chat").push(msgData).then(() => {
            if(typeof window.dispatchMentions === "function") window.dispatchMentions({ from: window.jogadorAtual, contextType: "gchat", contextId: "", text: txt });
        });
        
        inp.value = "";
        if(typeof window.cancelarResposta === "function") window.cancelarResposta();
    } catch (e) { console.error("Erro ao enviar.", e); }
};

window.mensagemEmResposta = null; 
window.responderMensagem = function(nome, texto) {
    window.mensagemEmResposta = { nome, texto };
    document.getElementById("replyToName").innerText = nome;
    document.getElementById("replyToText").innerText = texto;
    document.getElementById("replyPreview").style.display = "flex";
    document.getElementById("chatInputMsg").focus();
};

window.cancelReply = function() {
    window.mensagemEmResposta = null;
    document.getElementById("replyPreview").style.display = "none";
};

// =========================================================
// MENÇÕES, COMENTÁRIOS E NOTIFICAÇÕES (INSTA HUD)
// =========================================================

window._mentionRuntime = { active: false, inputEl: null, startPos: 0 };

window.handleMention = function(e, inputEl) {
    let val = inputEl.value; let cursorPos = inputEl.selectionStart;
    let textBeforeCursor = val.substring(0, cursorPos);
    let atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
        let query = textBeforeCursor.substring(atIndex + 1);
        if (!query.includes(' ') && !query.includes('\n')) {
            window._mentionRuntime = { active: true, inputEl: inputEl, startPos: atIndex, query: query };
            window.showMentionDropdown(inputEl, query);
            return;
        }
    }
    window.closeMentionDropdown();
};

window.showMentionDropdown = function(inputEl, query) {
    let drop = document.getElementById("mentionDropdown"); if (!drop) return;
    let rect = inputEl.getBoundingClientRect();
    drop.style.left = rect.left + "px"; drop.style.top = (rect.top - 160) + "px"; 
    drop.style.display = "block";

    let users = Object.values(window.usersGlobais || {});
    let filtered = users.filter(u => u.nome && u.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    if (filtered.length === 0) { drop.style.display = "none"; return; }

    drop.innerHTML = filtered.map(u => {
        let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${u.nome}`;
        return `<div class="mention-item" onclick="window.selectMention('${u.nome}')"><img src="${av}" class="mention-avatar"><span>${u.nome}</span></div>`;
    }).join('');
};

window.selectMention = function(nome) {
    let s = window._mentionRuntime; if (!s || !s.active || !s.inputEl) return;

    const inputEl = s.inputEl; const val = inputEl.value || "";
    const cursorPos = inputEl.selectionStart || val.length;

    const before = val.substring(0, s.startPos);
    const after = val.substring(cursorPos);
    const nomeLimpo = nome.replace(/\s+/g, "_");

    inputEl.value = before + "@" + nomeLimpo + " " + after;
    inputEl.focus();
    window.closeMentionDropdown();
};

window.closeMentionDropdown = function(){
  window._mentionRuntime.active = false;
  const drop = document.getElementById("mentionDropdown");
  if(drop) drop.style.display = "none";
};

window.dispatchMentions = function({ from, contextType, contextId, text }) {
    try {
        if (!window.db || !text) return;
        let matches = text.match(/@([\w_]+)/g); if (!matches) return;
        let users = Object.keys(window.usersGlobais || {}); let mencionados = new Set();

        matches.forEach(m => {
            let nomeMencionadoComUnderline = m.substring(1); 
            let nomeMencionadoOriginal = nomeMencionadoComUnderline.replace(/_/g, ' '); 
            let usuarioReal = users.find(u => u.toLowerCase() === nomeMencionadoOriginal.toLowerCase());
            if (usuarioReal && usuarioReal !== from) { mencionados.add(usuarioReal); }
        });

        mencionados.forEach(alvo => {
            window.db.ref(`tokyoRpg/users/${alvo}/notificacoes`).push({ from: from, contextType: contextType, contextId: contextId, texto: text, lida: false, ts: Date.now() });
        });
    } catch(e) {}
};

window.mostrarNotificacaoHUD = function(from, type, text) {
    let stack = document.getElementById("mentionNotifyStack"); if (!stack) return;
    let u = window.usersGlobais[from] || {};
    let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${from}`;
    let appTitle = type === "gchat" ? "G-Chat" : (type === "gpost" ? "G-Post" : "Arena");

    let div = document.createElement("div"); div.className = "mention-notify";
    div.innerHTML = `<img src="${avatar}"><div class="mn-texts"><div class="mn-title">${from} marcou você em ${appTitle}</div><div class="mn-sub">${text}</div></div>`;
    stack.appendChild(div);
    setTimeout(() => { div.classList.add("out"); setTimeout(() => div.remove(), 400); }, 5000);
};

window.atualizarBadgesHUD = function(chat, post, challenger) {
    let total = chat + post + challenger;
    let badgeMain = document.getElementById('badge-igamble-main'); if (badgeMain) { badgeMain.innerText = total; badgeMain.style.display = total > 0 ? 'flex' : 'none'; }
    let badgeChat = document.getElementById('badge-chat'); if (badgeChat) { badgeChat.innerText = chat; badgeChat.style.display = chat > 0 ? 'flex' : 'none'; }
    let badgePosts = document.getElementById('badge-posts'); if (badgePosts) { badgePosts.innerText = post; badgePosts.style.display = post > 0 ? 'flex' : 'none'; }
    let badgeEmbates = document.getElementById('badge-embates'); if (badgeEmbates) { badgeEmbates.innerText = challenger; badgeEmbates.style.display = challenger > 0 ? 'flex' : 'none'; }
};

window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    notifRef.on('value', snap => {
        let data = snap.val() || {}; let nGchat = 0, nGpost = 0, nGchallenger = 0;
        Object.values(data).forEach(n => { if (!n.lida) { if (n.contextType === "gchat") nGchat++; if (n.contextType === "gpost") nGpost++; if (n.contextType === "embates") nGchallenger++; } });
        window.atualizarBadgesHUD(nGchat, nGpost, nGchallenger);
    });

    let readyToNotify = false;
    notifRef.limitToLast(1).on('child_added', snap => {
        if (!readyToNotify) return; 
        let n = snap.val(); if (!n || n.lida) return;
        if(typeof window.mostrarNotificacaoHUD === "function") { window.mostrarNotificacaoHUD(n.from, n.contextType, n.texto); }
    });
    setTimeout(() => { readyToNotify = true; }, 2000);
};

window.marcarNotificacoesComoLidas = function(tabId) {
    if (!window.jogadorAtual || !window.db) return;
    let cType = tabId === "chat" ? "gchat" : (tabId === "posts" ? "gpost" : "embates");
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    notifRef.once('value', snap => {
        let data = snap.val(); if(!data) return;
        let updates = {};
        Object.keys(data).forEach(k => { if (data[k].contextType === cType && !data[k].lida) updates[`${k}/lida`] = true; });
        if (Object.keys(updates).length > 0) notifRef.update(updates);
    });
};

window.abrirComentarios = function(postId) {
    window.currentPostIdForComment = postId;
    document.getElementById("commentsOverlay").style.display = "flex";
    window.carregarComentarios(postId);
};

window.fecharComentarios = function() {
    window.currentPostIdForComment = null;
    document.getElementById("commentsOverlay").style.display = "none";
    document.getElementById("commentsList").innerHTML = ""; 
};

window.carregarComentarios = function(postId) {
    let list = document.getElementById("commentsList"); if(!list) return;
    list.innerHTML = "<div style='text-align:center; color:#aaa; margin-top:20px;'>Carregando...</div>";
    
    window.db.ref(`tokyoRpg/posts/${postId}/comentarios`).on('value', snap => {
        if(window.currentPostIdForComment !== postId) return; 
        
        let data = snap.val();
        if(!data) { list.innerHTML = "<div style='text-align:center; color:#555; margin-top:20px;'>Seja o primeiro a comentar!</div>"; return; }
        
        let html = ""; let sortedKeys = Object.keys(data).sort((a,b) => data[a].timestamp - data[b].timestamp);

        sortedKeys.forEach(k => {
            let c = data[k]; let u = window.usersGlobais[c.autor] || {};
            let avatar = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${c.autor}`; let nome = u.nome || c.autor;
            let textoBonito = (c.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) { return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`; });

            html += `<div class="comment-item"><img src="${avatar}" class="comment-avatar"><div class="comment-content"><div class="comment-name">${nome}</div><div>${textoBonito}</div></div></div>`;
        });
        list.innerHTML = html; setTimeout(() => { list.scrollTop = list.scrollHeight; }, 50);
    });
};

window.enviarComentario = function() {
    if(!window.currentPostIdForComment || !window.jogadorAtual) return;
    let inp = document.getElementById("commentInput"); let txt = inp.value.trim(); if(!txt) return;
    
    window.db.ref(`tokyoRpg/posts/${window.currentPostIdForComment}/comentarios`).push({ autor: window.jogadorAtual, texto: txt, timestamp: Date.now() }).then(() => {
        inp.value = ""; window.closeMentionDropdown();
        if(typeof window.dispatchMentions === "function") { window.dispatchMentions({ from: window.jogadorAtual, contextType: "gpost", contextId: window.currentPostIdForComment, text: txt }); }
    });
};

// =========================================================
// GAMBLENGER (CELULAR SMS) 
// =========================================================
window.contatoSmsAtual = null; window._smsListener = null; window._lastChatId = null;

window.adicionarContato = function() {
    if(!window.jogadorAtual) return; let num = document.getElementById("novoContatoNum").value.trim(); if(!num) return;
    let me = window.usersGlobais[window.jogadorAtual];
    if(!me.numero && !window.isMaster) { window.showNeonToast("Registre seu próprio Número no perfil primeiro!"); return; }
    if(num === me.numero) { window.showNeonToast("Este é o seu próprio número!"); return; }

    let alvo = null; Object.keys(window.usersGlobais).forEach(k => { if(window.usersGlobais[k].numero === num) alvo = k; });
    if(!alvo) { window.showNeonToast("Número inexistente ou fora de área."); return; }

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/contatos/${alvo}`).set(true).then(() => {
        window.showNeonToast(`Contato [${alvo}] salvo!`); document.getElementById("novoContatoNum").value = ""; window.carregarContatosSMS();
    });
};

window.carregarContatosSMS = function() {
    let lista = document.getElementById("listaContatosSMS"); if(!lista || !window.usersGlobais || !window.jogadorAtual) return;
    lista.innerHTML = ""; let meusContatos = window.usersGlobais[window.jogadorAtual]?.contatos || {};
    let contatosArray = Object.keys(meusContatos);

    if(window.isMaster) contatosArray = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE" && n !== window.jogadorAtual);
    if(contatosArray.length === 0) { lista.innerHTML = `<div style="text-align:center; color:#555; font-size:10px; margin-top:20px;">Sua agenda está vazia.</div>`; return; }

    contatosArray.forEach(n => {
        let u = window.usersGlobais[n]; if(!u) return;
        let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
        let isSel = (window.contatoSmsAtual === n) ? "background:rgba(0, 229, 255, 0.2); border-left:3px solid var(--accent-blue);" : "background:#111; border-left:3px solid #333;";
        lista.innerHTML += `<div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-radius:4px; margin-bottom:5px; ${isSel}" onclick="window.abrirChatSMS('${n}')"><img src="${av}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid #555;"><div style="color:#fff; font-weight:bold; font-size:12px; overflow:hidden; text-overflow:ellipsis;">${n}</div></div>`;
    });
};

window.abrirChatSMS = function(contato) {
    window.contatoSmsAtual = contato;
    let headerName = document.getElementById("smsChatName"); let callBtn = document.getElementById("btnCallUI");
    if(headerName) headerName.innerText = "Criptografado: " + contato; if(callBtn) callBtn.style.display = "block"; 
    window.carregarContatosSMS(); window.renderizarSMSLog(); 
};

window.renderizarSMSLog = function() {
    if(!window.jogadorAtual || !window.contatoSmsAtual) return;
    let chatId = [window.jogadorAtual, window.contatoSmsAtual].sort().join("_");
    
    if(window._smsListener && window._lastChatId) window.db.ref('tokyoRpg/smsChats/' + window._lastChatId).off('value', window._smsListener);
    window._lastChatId = chatId;
    
    window._smsListener = window.db.ref('tokyoRpg/smsChats/' + chatId).on('value', snap => {
        let log = document.getElementById("smsLog"); if(!log) return; log.innerHTML = ""; 
        let data = snap.val();
        if(!data) { log.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px; font-style:italic;">A conexão é segura. Envie a primeira mensagem.</div>`; return; }
        
        Object.keys(data).forEach(k => {
            let m = data[k]; let isMe = (m.de === window.jogadorAtual);
            let align = isMe ? "flex-end" : "flex-start"; let bg = isMe ? "var(--accent-blue)" : "#222";
            let color = isMe ? "#000" : "#fff"; let radius = isMe ? "12px 12px 0 12px" : "12px 12px 12px 0";
            log.innerHTML += `<div style="display:flex; flex-direction:column; align-items:${align}; margin-bottom:10px; width:100%;"><div style="background:${bg}; color:${color}; padding:10px; border-radius:${radius}; max-width:80%; font-size:13px; font-family:monospace; font-weight:bold; word-wrap:break-word;">${m.msg}</div><div style="font-size:10px; color:#666; margin-top:3px;">${m.data || ""}</div></div>`;
        });
        setTimeout(() => { log.scrollTop = log.scrollHeight; }, 50);
    });
};

window.enviarSMS = function() {
    if(!window.jogadorAtual || !window.contatoSmsAtual) { window.showNeonToast("Selecione um contato na agenda primeiro!"); return; }
    let inputEl = document.getElementById("smsTexto"); let txt = inputEl.value.trim(); if(!txt) return;
    
    let chatId = [window.jogadorAtual, window.contatoSmsAtual].sort().join("_");
    let payload = { de: window.jogadorAtual, para: window.contatoSmsAtual, msg: txt, data: new Date().toLocaleTimeString().substring(0, 5), ts: Date.now() };
    
    window.db.ref(`tokyoRpg/smsChats/${chatId}`).push(payload);
    inputEl.value = ""; inputEl.focus();    
};

window.iniciarLigacao = function() {
    if(!window.contatoSmsAtual) return;
    window.showNeonToast(`📞 Conectando com ${window.contatoSmsAtual}...`);
};

// =========================================================
// INICIALIZAÇÃO FIREBASE (O MOTOR PRINCIPAL)
// =========================================================
// =========================================================
// INICIALIZAÇÃO FIREBASE (O MOTOR PRINCIPAL)
// =========================================================
window.onload = function() {
    if (window.db) {
        window.carregarTitulos(); window.carregarAvatares(); 
        
        window.db.ref('tokyoRpg/users').on('value', s => { 
            window.usersGlobais = s.val()||{}; 
            if(typeof window.renderizarFicha === "function") window.renderizarFicha(); 
            if(typeof window.renderizarMochila === "function") window.renderizarMochila(); 
            if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); 
            if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); 
            if(typeof window.desenharListaUsuarios === "function") window.desenharListaUsuarios(); 
            if(typeof window.renderizarPanteao === "function") window.renderizarPanteao(); 
            if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard();
        });
        
        window.db.ref('tokyoRpg/presence').on('value', s => { window.presenceGlobal = s.val()||{}; if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); if(typeof window.desenharListaUsuarios === "function") window.desenharListaUsuarios(); });
        window.db.ref('tokyoRpg/mapEmbates').on('value', s => { window.embatesGlobais = s.val() || {}; if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); });
        window.db.ref('tokyoRpg/loja').on('value', s => { window.lojaGlobal = s.val() || {}; if(typeof window.renderizarLojaUI === "function") window.renderizarLojaUI(); if(typeof window.renderizarFicha === "function") window.renderizarFicha(); if(typeof window.renderizarMochila === "function") window.renderizarMochila(); if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); }); 
        window.db.ref('tokyoRpg/casasGrid').on('value', s => { window.casaGlobais = s.val() || {}; if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); });
        
        // 🔥 AQUI ESTAVA O SEU ERRO!
        // Eu REMOVI os window.db.ref('tokyoRpg/submaps').on(...)
        // Removi os window.db.ref('tokyoRpg/turnosVTT').on(...)
        // E removi os window.db.ref('tokyoRpg/currentClash').on(...)
        // Agora o Socket.io tem o controle total da velocidade!

        window.db.ref('tokyoRpg/jobConfig').on('value', s => { window.jobConfigGlobais = s.val() || {}; if(window.currentViewingJob) window.abrirArvoreJob(window.currentViewingJob.subjob, window.currentViewingJob.cat, !window.usersGlobais[window.jogadorAtual]?.job?.locked); });
        window.db.ref('tokyoRpg/currentRoll').on('value', s => { let d = s.val(); if(d && d.ts > Date.now() - 5000) { if(typeof window.mostrarDadoOverlay === "function") window.mostrarDadoOverlay(d.nome, d.form, d.results); } });
        window.db.ref('tokyoRpg/mapDados').limitToLast(10).on('value', s => { let d = s.val(); let b = document.getElementById("diceLog"); if(!b) return; b.innerHTML=""; if(d){ Object.values(d).forEach(x => b.innerHTML += `<div style="margin-bottom:5px;"><strong class="neon-blue">${x.nome}:</strong> ${x.texto}</div>`); b.scrollTop = b.scrollHeight; }});
        
        window.db.ref('tokyoRpg/chat').limitToLast(40).on('value', s => { 
            try {
                let d = s.val(); let b = document.getElementById("chatMessages"); if(!b) return; b.innerHTML=""; 
                if(d){ Object.keys(d).forEach(k => { 
                    let m = d[k]; let rCount = m.reacoes || {}; let uData = window.usersGlobais[m.nome] || {}; 
                    let curAv = uData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${m.nome}`; let curTit = uData.tituloChat || m.titulo; 
                    let reactHtml = `<button class="react-add" onclick="window.abrirEmojiReacao('${k}', event)">+</button>${rCount['🔥']?`<button class="react-btn">🔥 ${rCount['🔥']}</button>`:''}${rCount['💀']?`<button class="react-btn">💀 ${rCount['💀']}</button>`:''}${rCount['😂']?`<button class="react-btn">😂 ${rCount['😂']}</button>`:''}${rCount['👀']?`<button class="react-btn">👀 ${rCount['👀']}</button>`:''}${rCount['💯']?`<button class="react-btn">💯 ${rCount['💯']}</button>`:''}${rCount['🤡']?`<button class="react-btn">🤡 ${rCount['🤡']}</button>`:''}${rCount['💔']?`<button class="react-btn">💔 ${rCount['💔']}</button>`:''}${rCount['💰']?`<button class="react-btn">💰 ${rCount['💰']}</button>`:''}`;
                    b.innerHTML += `<div class="msg-box"><div class="msg-avatar-container"><span style="font-size:10px; color:#ff2a5f;">${uData.carteira||0}¥</span><img src="${curAv}" class="msg-avatar"></div><div class="msg-content"><div style="display:flex; flex-direction:column; margin-bottom:5px;">${curTit?`<div class="title-tag ${curTit.raridade}" style="display:inline-block; width:fit-content; margin-bottom:2px;">${curTit.txt||curTit}</div>`:''}<strong style="color:var(--accent-blue); font-size:14px;">${m.nome} <span style="color:#555;font-size:10px; margin-left:5px;">${m.data}</span></strong></div><p style="font-size:13px; line-height:1.4; margin-top:2px;">${(m.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) { return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`; })}</p>${m.imagemUrl?`<img src="${m.imagemUrl}" class="msg-image">`:''}<div style="margin-top:5px; display:flex; flex-wrap:wrap; gap:5px;">${reactHtml}</div></div></div>`; 
                }); b.scrollTop = b.scrollHeight; }
            } catch (err) { console.error("Erro ao renderizar chat:", err); }
        });
    }
    if(typeof window.abrirModal === "function") window.abrirModal();
};

// =========================================================
// SISTEMA DE FACES, MICROFONE E SALA DE VOZ (WEBRTC INTERATIVO)
// =========================================================
window.audioContext = null; window.analyser = null; window.micStream = null; window.micInterval = null; 
window.faceAtual = "Normal"; window.remoteSpeakerName = null;
window.whisperTarget = null; // Armazena quem é o alvo do sussurro!

window.rtcPeers = {}; 
window.rtcConfig = { iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] }] };

window.renderizarFace = function() {
    let targetName = window.remoteSpeakerName ? window.remoteSpeakerName : window.jogadorAtual;
    let u = window.usersGlobais[targetName]; 
    if(!u) return;

    let faceImg = document.getElementById("charFaceDisplay");
    if(faceImg) {
        let isFalando = false; let estadoFace = "Normal";

        if (targetName === window.remoteSpeakerName) { isFalando = true; estadoFace = "Falando"; } 
        else { estadoFace = window.faceAtual; if (estadoFace === "Falando") isFalando = true; }
        if (targetName !== window.jogadorAtual && u.faceAtual && !isFalando) { estadoFace = u.faceAtual; }

        let faceNameFormatada = estadoFace.charAt(0).toUpperCase() + estadoFace.slice(1);
        let path = `img/faces/${targetName}_Face_${faceNameFormatada}.png`;
        faceImg.src = path;
        
        if(isFalando) { faceImg.style.transform = "scale(1.05)"; faceImg.style.borderColor = "#00ff66"; faceImg.style.boxShadow = "0 0 20px rgba(0, 255, 102, 0.4)"; } 
        else if(estadoFace === "Dano") { faceImg.style.transform = "rotate(-10deg) scale(0.9)"; faceImg.style.borderColor = "#ff1a55"; faceImg.style.boxShadow = "none"; } 
        else { faceImg.style.transform = "none"; faceImg.style.borderColor = "var(--accent-blue)"; faceImg.style.boxShadow = "none"; }

        faceImg.onerror = function() { this.src = u.charImgUrl || u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${targetName}`; };

        let nameTag = document.getElementById("faceNameTag");
        if(!nameTag) {
            nameTag = document.createElement("div"); nameTag.id = "faceNameTag";
            nameTag.style.position = "absolute"; nameTag.style.top = "5px"; nameTag.style.left = "50%"; nameTag.style.transform = "translateX(-50%)";
            nameTag.style.background = "rgba(0,0,0,0.8)"; nameTag.style.padding = "2px 10px"; nameTag.style.borderRadius = "4px";
            nameTag.style.fontSize = "12px"; nameTag.style.fontWeight = "bold"; nameTag.style.border = "1px solid var(--accent-blue)";
            nameTag.style.pointerEvents = "none"; nameTag.style.zIndex = "10";
            faceImg.parentElement.style.position = "relative"; faceImg.parentElement.appendChild(nameTag);
        }
        
        nameTag.innerText = targetName.toUpperCase();
        nameTag.style.borderColor = isFalando ? "#00ff66" : "var(--accent-blue)";
        nameTag.style.color = isFalando ? "#00ff66" : "var(--accent-blue)";
    }
};

window.mudarFaceManual = function() { 
    let select = document.getElementById("faceSelect"); window.faceAtual = select.value; window.renderizarFace(); 
    if(window.db) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/faceAtual`).set(window.faceAtual);
};

window.ativarMicrofoneFace = async function() {
    let btn = document.getElementById("btnToggleMic");
    
    if (window.micStream) {
        clearInterval(window.micInterval); 
        window.micStream.getTracks().forEach(track => track.stop()); 
        window.micStream = null;
        window.faceAtual = document.getElementById("faceSelect").value; 
        window.renderizarFace(); 
        window.pararVoiceChat();
        if(window.db) { 
            window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/faceAtual`).set(window.faceAtual); 
            window.db.ref(`tokyoRpg/voicePresence/${window.jogadorAtual}/isSpeaking`).set(false); 
        }
        btn.innerText = "🎙️ Ativar Mic (Falar)"; btn.style.borderColor = "#00ff66"; btn.style.color = "#00ff66"; 
        return;
    }

    try {
        // MOTOR DE ÁUDIO APRIMORADO: Liga anti-ruído, anti-eco e estabilizador de ganho nativos do navegador!
        window.micStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        }); 

        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        window.analyser = window.audioContext.createAnalyser(); 
        let source = window.audioContext.createMediaStreamSource(window.micStream); 
        source.connect(window.analyser);
        window.analyser.fftSize = 512; // Resolução maior para captar melhor
        let bufferLength = window.analyser.frequencyBinCount; 
        let dataArray = new Uint8Array(bufferLength);

        btn.innerText = "🛑 Desligar Mic"; btn.style.borderColor = "#ff1a55"; btn.style.color = "#ff1a55";
        window.iniciarVoiceChat(window.micStream);

        let wasSpeaking = false;
        window.micInterval = setInterval(() => {
            window.analyser.getByteFrequencyData(dataArray); 
            
            // Foca apenas nas frequências da voz humana (a primeira metade do gráfico), ignorando ruídos agudos
            let sum = 0; 
            let voiceDataLength = Math.floor(bufferLength / 2);
            for(let i = 0; i < voiceDataLength; i++) { sum += dataArray[i]; }
            let average = sum / voiceDataLength; 
            
            let faceSelectValue = document.getElementById("faceSelect").value;
            
            // Puxa a sensibilidade do slider da tela (Quanto MENOR o número, mais fácil de ativar a boca)
            let sensInput = document.getElementById("micSensitivity");
            let sensibilidade = sensInput ? parseInt(sensInput.value) : 15;

            let isSpeakingNow = (average > sensibilidade);
            
            if (isSpeakingNow && !window.remoteSpeakerName) { 
                if(window.faceAtual !== "Falando") { window.faceAtual = "Falando"; window.renderizarFace(); } 
            } else if (!isSpeakingNow && !window.remoteSpeakerName) { 
                if(window.faceAtual !== faceSelectValue) { window.faceAtual = faceSelectValue; window.renderizarFace(); } 
            }

            if(isSpeakingNow !== wasSpeaking) {
                wasSpeaking = isSpeakingNow;
                if(window.db) window.db.ref(`tokyoRpg/voicePresence/${window.jogadorAtual}/isSpeaking`).set(isSpeakingNow);
            }

        }, 150);
    } catch (err) { 
        console.error("Erro mic:", err); 
        window.showNeonToast("Permissão de Microfone Negada!"); 
    }
};

// =========================================================
// O MOTOR WEBRTC (SOM 100% LIMPO E SUSSURROS DIRETOS)
// =========================================================
window.iniciarVoiceChat = function(stream) {
    window.localStream = stream;
    window.whisperTarget = null;
    window.db.ref(`tokyoRpg/voiceSignals/${window.jogadorAtual}`).remove();
    window.db.ref(`tokyoRpg/voicePresence/${window.jogadorAtual}`).set({ active: true, isSpeaking: false });
    window.db.ref(`tokyoRpg/voicePresence/${window.jogadorAtual}`).onDisconnect().remove();

    window.db.ref('tokyoRpg/voicePresence').on('child_added', snap => {
        let peerName = snap.key; 
        if (peerName !== window.jogadorAtual && !window.rtcPeers[peerName]) { window.chamarPeer(peerName); }
        window.renderizarWhisperBar();
    });

    window.db.ref('tokyoRpg/voicePresence').on('child_removed', snap => {
        let peerName = snap.key;
        if(window.rtcPeers[peerName]) {
            window.rtcPeers[peerName].close(); delete window.rtcPeers[peerName];
            let audioEl = document.getElementById(`rtc_audio_${peerName}`); if(audioEl) audioEl.remove();
            if(window.remoteSpeakerName === peerName) { window.remoteSpeakerName = null; window.renderizarFace(); }
        }
        if(window.whisperTarget === peerName) window.whisperTarget = null;
        window.renderizarWhisperBar();
    });

    window.db.ref(`tokyoRpg/voiceSignals/${window.jogadorAtual}`).on('child_added', async snap => {
        let signal = snap.val(); let peerName = signal.from;
        try {
            if (signal.type === "offer") {
                let pc = window.criarPeerConnection(peerName);
                await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
                let answer = await pc.createAnswer(); await pc.setLocalDescription(answer);
                window.db.ref(`tokyoRpg/voiceSignals/${peerName}`).push({ type: "answer", from: window.jogadorAtual, data: JSON.parse(JSON.stringify(answer)) });
            } 
            else if (signal.type === "answer" && window.rtcPeers[peerName]) { await window.rtcPeers[peerName].setRemoteDescription(new RTCSessionDescription(signal.data)); } 
            else if (signal.type === "ice" && window.rtcPeers[peerName]) { await window.rtcPeers[peerName].addIceCandidate(new RTCIceCandidate(signal.data)); }
        } catch(e) {}
        window.db.ref(`tokyoRpg/voiceSignals/${window.jogadorAtual}/${snap.key}`).remove();
    });

    window.db.ref('tokyoRpg/voicePresence').on('value', snap => {
        let presences = snap.val() || {}; let activeSpeaker = null;
        Object.keys(presences).forEach(pName => {
            let tEl = document.getElementById(`token_${pName}`);
            if(presences[pName].isSpeaking && pName !== window.jogadorAtual) { activeSpeaker = pName; }
            if(tEl) {
                if(presences[pName].isSpeaking) { tEl.style.boxShadow = "0 0 20px #00ff66, 0 0 40px #00ff66"; tEl.style.transform = "scale(1.15)"; tEl.style.zIndex = "100"; } 
                else { tEl.style.boxShadow = "0 0 20px #fff"; tEl.style.transform = "none"; tEl.style.zIndex = "10"; }
            }
        });
        window.remoteSpeakerName = activeSpeaker; window.renderizarFace();
    });
};

window.criarPeerConnection = function(peerName) {
    let pc = new RTCPeerConnection(window.rtcConfig); window.rtcPeers[peerName] = pc;
    if (window.localStream) { window.localStream.getTracks().forEach(track => pc.addTrack(track, window.localStream)); }

    pc.onicecandidate = event => { if (event.candidate) window.db.ref(`tokyoRpg/voiceSignals/${peerName}`).push({ type: "ice", from: window.jogadorAtual, data: JSON.parse(JSON.stringify(event.candidate)) }); };

    pc.ontrack = event => {
        let audioEl = document.getElementById(`rtc_audio_${peerName}`);
        if(!audioEl) {
            audioEl = document.createElement("audio"); audioEl.id = `rtc_audio_${peerName}`;
            audioEl.autoplay = true; audioEl.setAttribute('playsinline', ''); audioEl.style.display = "none";
            document.body.appendChild(audioEl);
        }
        audioEl.srcObject = event.streams[0];
        
        // Puxa o volume da barra e aplica na hora!
        let vol = document.getElementById("globalVoiceVolume") ? document.getElementById("globalVoiceVolume").value / 100 : 1;
        audioEl.volume = vol;
        audioEl.play().catch(e => console.warn("Aguardando clique para tocar o som", e));
    };
    return pc;
};

window.chamarPeer = async function(peerName) {
    let pc = window.criarPeerConnection(peerName); let offer = await pc.createOffer(); await pc.setLocalDescription(offer);
    window.db.ref(`tokyoRpg/voiceSignals/${peerName}`).push({ type: "offer", from: window.jogadorAtual, data: JSON.parse(JSON.stringify(offer)) });
};

window.pararVoiceChat = function() {
    window.db.ref(`tokyoRpg/voicePresence/${window.jogadorAtual}`).remove();
    window.db.ref(`tokyoRpg/voiceSignals/${window.jogadorAtual}`).remove();
    Object.keys(window.rtcPeers).forEach(peerName => {
        window.rtcPeers[peerName].close(); let audioEl = document.getElementById(`rtc_audio_${peerName}`); if(audioEl) audioEl.remove();
    });
    window.rtcPeers = {}; window.remoteSpeakerName = null; window.whisperTarget = null;
    window.renderizarWhisperBar(); window.renderizarFace();
};

window.atualizarVolumeVozes = function() {
    let vol = document.getElementById("globalVoiceVolume").value / 100;
    document.querySelectorAll('audio[id^="rtc_audio_"]').forEach(a => { a.volume = vol; });
};

// =========================================================
// FUNÇÕES DA BARRA DE SUSSURRO
// =========================================================
window.renderizarWhisperBar = function() {
    let bar = document.getElementById("whisperBar");
    let wList = document.getElementById("whisperList");
    if(!bar || !wList) return;
    
    let vozesConectadas = Object.keys(window.rtcPeers);
    
    if(vozesConectadas.length === 0 || !window.micStream) {
        bar.style.display = "none";
        return;
    }

    bar.style.display = "flex";
    wList.innerHTML = "";

    vozesConectadas.forEach(peerName => {
        let isAlvo = (window.whisperTarget === peerName);
        let btnColor = isAlvo ? "var(--accent-purple)" : "#aaa";
        let shadow = isAlvo ? "box-shadow: 0 0 10px var(--accent-purple);" : "";
        let bg = isAlvo ? "rgba(176, 0, 255, 0.2)" : "transparent";
        
        wList.innerHTML += `<button class="action-btn" style="padding: 4px 10px; font-size: 10px; border-color: ${btnColor}; color: ${btnColor}; background: ${bg}; ${shadow} margin:0;" onclick="window.alternarWhisper('${peerName}')">🗣️ ${peerName}</button>`;
    });
};

window.alternarWhisper = function(peerName) {
    if(window.whisperTarget === peerName) {
        window.whisperTarget = null;
        window.showNeonToast("Voz ABERTA para todos.");
    } else {
        window.whisperTarget = peerName;
        window.showNeonToast(`Sussurrando APENAS para ${peerName}.`);
    }

    window.aplicarMuteDeSussurro();
    window.renderizarWhisperBar();
};

window.aplicarMuteDeSussurro = function() {
    // Para cada conexão (Pessoa), a gente decide se o nosso microfone envia áudio ou envia silêncio
    Object.keys(window.rtcPeers).forEach(peer => {
        let pc = window.rtcPeers[peer];
        let senders = pc.getSenders();
        senders.forEach(sender => {
            if(sender.track && sender.track.kind === 'audio') {
                if(window.whisperTarget === null) {
                    sender.track.enabled = true; // Voz liberada pra geral
                } else {
                    sender.track.enabled = (peer === window.whisperTarget); // Voz só chega no alvo
                }
            }
        });
    });
};

// =========================================================
// INICIALIZAÇÃO FIREBASE (O MOTOR PRINCIPAL)
// =========================================================
window.onload = function() {
    if (window.db) {
        window.carregarTitulos(); window.carregarAvatares(); 
        
        window.db.ref('tokyoRpg/users').on('value', s => { 
            window.usersGlobais = s.val()||{}; 
            if(typeof window.renderizarFicha === "function") window.renderizarFicha(); 
            if(typeof window.renderizarMochila === "function") window.renderizarMochila(); 
            if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); 
            if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); 
            if(typeof window.desenharListaUsuarios === "function") window.desenharListaUsuarios(); 
            if(typeof window.renderizarPanteao === "function") window.renderizarPanteao(); 
            if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard();
        });
        
        window.db.ref('tokyoRpg/presence').on('value', s => { window.presenceGlobal = s.val()||{}; if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); if(typeof window.desenharListaUsuarios === "function") window.desenharListaUsuarios(); });
        window.db.ref('tokyoRpg/mapEmbates').on('value', s => { window.embatesGlobais = s.val() || {}; if(!window.currentSubMapKey && typeof window.desenharMapa === "function") window.desenharMapa(); });
        window.db.ref('tokyoRpg/loja').on('value', s => { window.lojaGlobal = s.val() || {}; if(typeof window.renderizarLojaUI === "function") window.renderizarLojaUI(); if(typeof window.renderizarFicha === "function") window.renderizarFicha(); if(typeof window.renderizarMochila === "function") window.renderizarMochila(); if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); }); 
        window.db.ref('tokyoRpg/casasGrid').on('value', s => { window.casaGlobais = s.val() || {}; if(typeof window.drawCasaBoard === "function") window.drawCasaBoard(); });
        window.db.ref('tokyoRpg/submaps').on('value', s => { window.submapasGlobais = s.val() || {}; if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard(); });
        window.db.ref('tokyoRpg/submapsTraps').on('value', s => { window.submapasTraps = s.val() || {}; if(typeof window.updateTacticalBoard === "function") window.updateTacticalBoard(); });
        
        window.db.ref('tokyoRpg/currentRoll').on('value', s => { let d = s.val(); if(d && d.ts > Date.now() - 5000) { if(typeof window.mostrarDadoOverlay === "function") window.mostrarDadoOverlay(d.nome, d.form, d.results); } });
        window.db.ref('tokyoRpg/mapDados').limitToLast(10).on('value', s => { let d = s.val(); let b = document.getElementById("diceLog"); if(!b) return; b.innerHTML=""; if(d){ Object.values(d).forEach(x => b.innerHTML += `<div style="margin-bottom:5px;"><strong class="neon-blue">${x.nome}:</strong> ${x.texto}</div>`); b.scrollTop = b.scrollHeight; }});
        
        window.db.ref('tokyoRpg/turnosVTT').on('value', s => { 
            window.allTurnosVTT = s.val() || {};
            if(window.currentSubMapKey) {
                window.turnosVTTGlobal = window.allTurnosVTT[window.currentSubMapKey] || null;
                if (typeof window.updateTacticalBoard === "function") window.updateTacticalBoard(); 
            }
        });

        // MOTOR DE FILA DO CLASH (CORRIGIDO PARA CHAMAR A ANIMAÇÃO CORRETAMENTE)
        

        window.db.ref('tokyoRpg/chat').limitToLast(40).on('value', s => { 
            try {
                let d = s.val(); let b = document.getElementById("chatMessages"); if(!b) return; b.innerHTML=""; 
                if(d){ Object.keys(d).forEach(k => { 
                    let m = d[k]; let rCount = m.reacoes || {}; let uData = window.usersGlobais[m.nome] || {}; 
                    let curAv = uData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${m.nome}`; let curTit = uData.tituloChat || m.titulo; 
                    let reactHtml = `<button class="react-add" onclick="window.abrirEmojiReacao('${k}', event)">+</button>${rCount['🔥']?`<button class="react-btn">🔥 ${rCount['🔥']}</button>`:''}${rCount['💀']?`<button class="react-btn">💀 ${rCount['💀']}</button>`:''}${rCount['😂']?`<button class="react-btn">😂 ${rCount['😂']}</button>`:''}${rCount['👀']?`<button class="react-btn">👀 ${rCount['👀']}</button>`:''}${rCount['💯']?`<button class="react-btn">💯 ${rCount['💯']}</button>`:''}${rCount['🤡']?`<button class="react-btn">🤡 ${rCount['🤡']}</button>`:''}${rCount['💔']?`<button class="react-btn">💔 ${rCount['💔']}</button>`:''}${rCount['💰']?`<button class="react-btn">💰 ${rCount['💰']}</button>`:''}`;
                    b.innerHTML += `<div class="msg-box"><div class="msg-avatar-container"><span style="font-size:10px; color:#ff2a5f;">${uData.carteira||0}¥</span><img src="${curAv}" class="msg-avatar"></div><div class="msg-content"><div style="display:flex; flex-direction:column; margin-bottom:5px;">${curTit?`<div class="title-tag ${curTit.raridade}" style="display:inline-block; width:fit-content; margin-bottom:2px;">${curTit.txt||curTit}</div>`:''}<strong style="color:var(--accent-blue); font-size:14px;">${m.nome} <span style="color:#555;font-size:10px; margin-left:5px;">${m.data}</span></strong></div><p style="font-size:13px; line-height:1.4; margin-top:2px;">${(m.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) { return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`; })}</p>${m.imagemUrl?`<img src="${m.imagemUrl}" class="msg-image">`:''}<div style="margin-top:5px; display:flex; flex-wrap:wrap; gap:5px;">${reactHtml}</div></div></div>`; 
                }); b.scrollTop = b.scrollHeight; }
            } catch (err) { console.error("Erro ao renderizar chat:", err); }
        });
    }
    if(typeof window.abrirModal === "function") window.abrirModal();
};
// SALVAR CHAR IMG URL
window.salvarCharImgUrl = function() {
    let url = document.getElementById("customCharUrl").value.trim();
    if(!url) return;
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/charImgUrl`).set(url);
    window.showNeonToast("Foto do Personagem Atualizada!");
    document.getElementById("customCharUrl").value = "";
};

window.uploadCharImage = function(event) {
    let file = event.target.files[0];
    if(!file) return;
    if(file.size > 2000000) { window.showNeonToast("Erro: Imagem deve ter menos de 2MB!"); return; } 
    let reader = new FileReader();
    reader.onload = function(e) {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/charImgUrl`).set(e.target.result);
        window.showNeonToast("Foto do Personagem Atualizada!");
    };
    reader.readAsDataURL(file);
};

// =========================================================
// SISTEMA DE CORTE DE IMAGEM (CROPPER)
// =========================================================
window.cropperInstance = null;

// 1. Quando clica em SALVAR a URL
window.salvarCharImgUrl = function() {
    let url = document.getElementById("customCharUrl").value.trim();
    if(!url) return;

    let cropModal = document.getElementById("cropModal");
    let imgTarget = document.getElementById("cropImageTarget");

    // Tenta contornar bloqueios de segurança (CORS) da web
    imgTarget.crossOrigin = "anonymous";
    imgTarget.src = url;
    cropModal.style.display = "flex";

    if (window.cropperInstance) window.cropperInstance.destroy();

    // Espera a imagem da web carregar antes de aplicar a grade de corte
    imgTarget.onload = function() {
        window.cropperInstance = new Cropper(imgTarget, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            background: false,
            guides: true,
            dragMode: 'move' // Permite arrastar com o mouse/dedo
        });
        imgTarget.onload = null; // Limpa o evento
    };

    document.getElementById("customCharUrl").value = ""; // Limpa a barrinha
};

// 2. Quando envia arquivo do PC (Mantido igual, mas aprimorado)
window.uploadCharImage = function(event) {
    let file = event.target.files[0];
    if(!file) return;
    if(file.size > 2000000) { window.showNeonToast("Erro: Imagem deve ter menos de 2MB!"); return; } 

    let reader = new FileReader();
    reader.onload = function(e) {
        let cropModal = document.getElementById("cropModal");
        let imgTarget = document.getElementById("cropImageTarget");
        
        imgTarget.removeAttribute("crossOrigin"); 
        cropModal.style.display = "flex";

        if (window.cropperInstance) window.cropperInstance.destroy();

        // Aguarda a imagem aparecer na tela antes de jogar a grade de corte em cima
        imgTarget.onload = function() {
            window.cropperInstance = new Cropper(imgTarget, {
                aspectRatio: 1, 
                viewMode: 1,
                autoCropArea: 1,
                background: false,
                guides: true,
                dragMode: 'move'
            });
            imgTarget.onload = null; // limpa o evento pra não travar depois
        };
        
        imgTarget.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = ""; 
};

window.fecharCropModal = function() {
    document.getElementById("cropModal").style.display = "none";
    if (window.cropperInstance) { window.cropperInstance.destroy(); window.cropperInstance = null; }
};

// 3. O Salvador Blindado
window.confirmarCrop = function() {
    if (!window.cropperInstance) return;
    
    try {
        // Tenta gerar a imagem em 256x256
        let canvas = window.cropperInstance.getCroppedCanvas({ width: 256, height: 256 });
        let croppedBase64 = canvas.toDataURL("image/png");
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/charImgUrl`).set(croppedBase64).then(() => {
            window.showNeonToast("Foto Enquadrada e Salva!");
            window.fecharCropModal();
        });
    } catch (err) {
        // Se a imagem for da web e o site bloquear o recorte (Tainted Canvas), o sistema pega a URL inteira
        console.warn("Bloqueio de site detectado. Salvando URL original.", err);
        let originalUrl = document.getElementById("cropImageTarget").src;
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/charImgUrl`).set(originalUrl).then(() => {
            window.showNeonToast("Foto Salva (S/ recorte por proteção do site)");
            window.fecharCropModal();
        });
    }
};

// =========================================================
// SISTEMA DE POPULARIDADE E BOTS DO G-POST
// =========================================================

// =========================================================
// O NOVO MOTOR DE POPULARIDADE GLOBAL (TIERS, BOTS E ANIMAÇÃO TIKTOK)
// =========================================================

// Limites Atualizados
window.popularityTiers = {
    "branca": { nome: "Estrela Nascente", cor: "#ffffff", minL: 600, maxL: 3000, icone: "⭐" },
    "verde": { nome: "Hype Regional", cor: "#00ff66", minL: 3000, maxL: 7000, icone: "🌟" },
    "azul": { nome: "Lenda da Mídia", cor: "#00e5ff", minL: 10000, maxL: 50000, icone: "💫" },
    "dourado": { nome: "Astro Supremo", cor: "#ffaa00", minL: 100000, maxL: 1000000, icone: "✨" },
    "roxo": { nome: "Superstar", cor: "#b000ff", minL: 500000, maxL: 5000000, icone: "🌠" }
};

// Formatador de Números (Ex: 1500 vira 1.5K, 2000000 vira 2M)
window.formatNumberInfo = function(num) {
    if(num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + "M";
    if(num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + "K";
    return num;
};
window.mudarPopTier = function(userId, tier) {
    if(!window.isMaster) return;
    window.db.ref(`tokyoRpg/users/${userId}/popTier`).set(tier).then(() => {
        window.showNeonToast(`Tier de ${userId} mudado para ${tier.toUpperCase()}! Os likes dos posts vão se auto-ajustar.`);
        window.renderizarFicha(); // Atualiza a tela de personagem na hora
    });
};

// Dispara a animação visual por cima dos posts
window.spawnTiktokHeart = function() {
    let container = document.getElementById("igamble-view-posts");
    if(!container || !container.classList.contains("active")) return; 

    let h = document.createElement("div");
    h.className = "tiktok-heart";
    // Múltiplos emojis flutuantes (Coração, Fogo, Dinheiro, Estrela)
    let emojis = ["❤️", "🔥", "⭐", "💸", "✨", "💖", "💎", "🎰"];
    h.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    
    let rightPos = 15 + Math.random() * 40; // Aparece na direita aleatoriamente
    h.style.right = rightPos + "px";
    h.style.fontSize = (20 + Math.random() * 20) + "px";
    
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2500);
};

// O Motor Inteligente (Roda a cada 2.5s)
setInterval(() => {
    if(!window.db || !window.jogadorAtual) return;
    
    window.db.ref('tokyoRpg/posts').once('value').then(snap => {
        let posts = snap.val(); if(!posts) return;
        let updates = {};
        let someoneGotLiked = false;

        Object.keys(posts).forEach(k => {
            let p = posts[k];
            let autorId = p.autorId || p.autor;
            
            // Somente o dono do post ou o mestre processam os cálculos para não sobrecarregar
            if(autorId === window.jogadorAtual || window.isMaster) {
                let uData = window.usersGlobais[autorId] || {};
                let currentTier = uData.popTier || "branca";
                if(p.isAd) currentTier = "dourado";
                
                let limits = window.popularityTiers[currentTier] || window.popularityTiers["branca"];
                let currentTarget = p.targetLikes || 0;
                
                // MÁGICA: Se a estrela do perfil mudou, ele reseta o alvo desse post (antigo ou novo) para subir de novo!
                if(currentTarget < limits.minL || currentTarget > limits.maxL) {
                    currentTarget = Math.floor(Math.random() * (limits.maxL - limits.minL + 1)) + limits.minL;
                    updates[`${k}/targetLikes`] = currentTarget;
                }

                let currentLikes = parseInt(p.likes) || 0;
                if(currentLikes < currentTarget) {
                    let missing = currentTarget - currentLikes;
                    let chunk = Math.max(1, Math.floor(missing * 0.08)); // Sobe rápido e desacelera
                    if(missing < 5) chunk = missing;
                    
                    // 50% de chance de subir para parecer orgânico
                    if(Math.random() > 0.5) {
                        updates[`${k}/likes`] = currentLikes + chunk;
                        someoneGotLiked = true;
                    }
                }
            }
        });

        if(Object.keys(updates).length > 0) {
            window.db.ref('tokyoRpg/posts').update(updates);
            
            // TIKTOK ANIMATION: Atira os emojis se alguém ganhou like
            if(someoneGotLiked) {
                let heartCount = Math.floor(Math.random() * 4) + 2; 
                for(let i = 0; i < heartCount; i++) {
                    setTimeout(window.spawnTiktokHeart, i * 350);
                }
            }
        }
    });
}, 2500); 

// Banco de Dados Estendido (30 bots e frases)
window.botCommentsDb = {
    "selfie": ["Que estilo! 🔥", "Tokyo ficou pequena pra vc!", "Aposta quanto que esse look custou mais que minha casa?", "Beleza nível Cassino Central 💎", "Passa a visão de onde comprou isso!", "Astro nato!", "O drip tá insano", "Slk, amassou no look", "Aí tem presença", "Trajado pra vencer", "Ficou muito bem em você", "Tá na pista pra negócio?", "Dono(a) do Distrito", "Que perfeição", "Nasceu pra brilhar", "Brabo(a) demais!", "Aí sabe se vestir", "O terror dos apostadores", "Arrasou corações", "Passou a visão", "Tá estourado(a)", "Roubou a cena", "Simplesmente sem defeitos", "Esse estilo é pra poucos", "Absurdo de lindo(a)", "O neon até ofusca com seu brilho", "Padrão ouro", "Nível VIP do Cassino", "Esquece, tá no topo!", "Muito ímpar!"],
    "selfie_grupo": ["Bonde pesado! 💣", "Só os de verdade!", "A tropa tá na pista", "Ninguém peita esse esquadrão", "Família Distrito", "Só lenda na mesma foto", "Quem fecha junto, ganha junto", "Esquadrão VIP", "A elite reunida", "Muito peso numa foto só", "Amo vocês!", "Turma do barulho", "Se tem essa galera, tem aposta alta", "Fechamento 100%", "O terror de Tokyo", "Só apostador de elite", "Respeita a gangue", "A máfia tá online", "Aí tem história", "Só quem é sabe", "Faltou eu nessa foto!", "Melhor grupo", "O time que nunca perde", "Só os loucos", "Ninguém separa", "Conexão direta", "Timaço!", "Fechamento certo", "Cuidado com esses aí", "Os donos da cidade!"],
    "paisagem": ["Esse distrito nunca dorme 🌃", "Qual a coord dessa vista?", "Bela foto, mas sinto cheiro de encrenca aí.", "Lugar perfeito para um embate clandestino ⚔️", "Amo essa área do Distrito!", "Foto pesada!", "Que vista absurda", "Cyberpunk vibes totais", "O neon dessa cidade é lindo", "Cuidado por aí", "Lugar perigoso, mas bonito", "Queria estar aí agora", "Onde é isso?", "Lugar top pra gastar uns Yenes", "Amo esse clima escuro", "Vibe de filme", "Paz antes do caos", "Melhor lugar de Tokyo", "Essa iluminação ficou perfeita", "Arte pura", "Dá até vontade de explorar", "Muito foda o cenário", "Esconderijo perfeito", "Tirou muita onda na foto", "A arquitetura do Distrito é única", "Ficou parecendo um quadro", "Lugar brabo", "Manda a localização no PV", "Visual limpo demais", "Que click genial!"],
    "batalha": ["Apostei tudo em vc! Não me decepcione!", "Que porrada! 💥", "A casa sempre ganha... ou não?", "Alguém chama os paramédicos 🚑", "Essa luta vai entrar pra história!", "Apostas abertas galera!", "Amasou o adversário!", "Sangue no chão, Yenes no bolso", "Esse golpe foi fatal", "Briga de cachorro grande", "Sem piedade!", "Sobreviveu por milagre", "O Distrito é cruel", "Que combate insano", "Lutou muito", "Foi pra cima com tudo", "Queria ter visto ao vivo", "Bateu pra matar", "A adrenalina ferveu", "Luta épica", "Ninguém segura", "Quebrou a banca", "Apostei no cara errado...", "Isso que é um embate digno", "O chão ficou vermelho", "Violência pura", "Mostrou quem manda", "Achei que ia de arrasta", "Cena de guerra", "Vitória suada!"],
    "tristeza": ["F no chat 💀", "Faz parte do jogo, levanta a cabeça.", "Perdeu tudo? kkkk", "Vem pro Bar Submundo afogar as mágoas 🍻", "O Distrito é cruel, man.", "Acontece com os melhores.", "Tristeza define", "Melhoras logo", "Nem sempre a banca quebra", "Hoje não foi seu dia", "Deu ruim né?", "Fica assim não", "Aposta de novo que recupera", "Que azar absurdo", "Forças aí guerreiro(a)", "Não era pra ser", "Chorei daqui", "Que bad", "F", "Dias de luta, dias de glória", "Infelizmente a maré tava baixa", "Vai passar", "Levanta e anda", "O jogo cobra caro", "Doeu na alma", "Faz uma vaquinha que eu ajudo", "Respira fundo e volta pro jogo", "Perdas acontecem", "Amanhã é outro dia", "Que dor."],
    "ostentacao": ["Tá nadando em Yenes 💰", "Me empresta 1000¥?", "Patrão demais!", "A Receita do Distrito tá de olho 👀", "Vida de quem sabe apostar!", "Choveu dinheiro 🤑", "Luxo puro", "Esse é o cheiro do sucesso", "Conta bancária explodindo", "Só nota alta", "Pagando a bebida de geral hoje?", "Aí tem capital", "Faz o PIX", "Nível milionário", "Sabe fazer dinheiro", "O rei/rainha dos Yenes", "Venceu na vida", "Só ostentando o lucro", "A banca chorou pra te pagar", "Rico(a) demais", "Patrocinando o rolê", "Isso que é carteira cheia", "Tirou a sorte grande", "Aprendeu a dominar o jogo", "Aí tem dote", "Chefe é chefe", "O ouro brilha", "Vida de magnata", "Chovendo grana", "Invejinha bateu aqui!"],
    "romantica": ["Casal do ano ❤️", "Até no submundo tem amor", "Fofos", "Meu coração até errou a batida", "Lindos demais juntos", "Feitos um pro outro", "Meta de relacionamento", "Vocês dois são perfeitos", "O amor vence o caos", "Aí tem química", "A melhor dupla de Tokyo", "Que casalzão", "Vocês transbordam amor", "Se não for assim eu nem quero", "O romance tá no ar", "Meu ship favorito", "Aposta certa: esse amor dura", "Lindos!", "Perfeição em forma de casal", "E o casamento sai quando?", "Até me deu gatilho aqui", "Que fotão de vocês", "Transmitem muita paz", "Sintonia pura", "O verdadeiro prêmio do jogo", "O casal mais hypado", "Eu amo vocês dois", "Almas gêmeas", "Muito amor numa foto só", "Felicidades sempre!"],
    "radical": ["Quase morreu mas a foto ficou top ⚡", "Adrenalina pura", "Você é louco(a)", "Isso que é viver no limite", "Eu teria infartado", "Ação nível hard", "Coragem é o seu nome", "Sem medo do perigo", "Loucura total", "Passou raspando!", "Que manobra épica", "Sabe viver a vida", "Eu pisquei e perdi", "Radical demais", "Coração deve ter ido a mil", "Só pra quem tem coragem", "Aí é pro player", "Vive como se não houvesse amanhã", "Insano!", "Maluquice boa", "Quebrou as leis da física", "Se der ruim, pelo menos a foto tá feita", "Aventura pura", "Você não tem instinto de sobrevivência kkk", "No limite da navalha", "Pura emoção", "Lendário!", "Absurdo o que você fez", "Deu frio na barriga só de ver", "Zerou o game!"],
    "trabalho": ["Focando nos Yenes 💼", "O corre não para", "Trabalhar pra apostar depois", "Isso que é dedicação", "Ganhando o pão de cada dia", "Luta diária", "Foco e progresso", "Mão na massa", "Não tem dia de folga", "Fazendo o capital girar", "Trabalhador(a) exemplar", "Produtividade a mil", "O esforço vai recompensar", "Bora fazer grana", "Aquele turno pesado", "Sucesso vem do trabalho", "Cansado(a) mas no corre", "Foco na missão", "O suor de hoje é a aposta de amanhã", "Respeito pelo corre", "Sempre na ativa", "Ninguém constrói império dormindo", "Sextou trabalhando", "A base da sociedade", "Isso aí, foco no objetivo", "Mais um dia, mais um Yen", "Honrando o serviço", "Fazendo a diferença", "Exemplo a ser seguido", "Guerreiro(a) do Distrito!"]
};

window.gerarComentariosBot = function(postId, contexto) {
    if(!window.isMaster) return;
    let frases = window.botCommentsDb[contexto]; if(!frases) return;
    
    let qtd = Math.floor(Math.random() * 2) + 5; 
    let shuffled = frases.sort(() => 0.5 - Math.random());
    
    let names = ["Akira_xx", "ShinNeon", "Yumi99", "Kaito_Apostas", "KenjiX", "SoraGamer", "Ren_Cassino", "HanaDark", "Ryu_Lutador", "Natsuki11", "JinTóxico", "Taro_Yen", "Luna_Cyber", "Mika_Drift", "Zero_Cool", "Neon_Samurai", "Rei_das_Cartas", "Aiko_Blade", "Gamer_Z", "Rider_X", "Yakuza_Boy", "Cyber_Girl", "Kira_Tech", "Jinx_99", "Viper_Neon", "Ghost_Coder", "Shadow_Ninja", "Kaze_Rider", "Momo_Pop", "Riku_Flash", "Sato_Hacker", "Yuki_Sniper", "Zack_Jackpot"];
    
    let comsToPush = {};
    for(let i = 0; i < qtd; i++) {
        let fakeName = names[Math.floor(Math.random() * names.length)];
        comsToPush[Date.now() + i] = { autor: fakeName, texto: shuffled[i % shuffled.length], timestamp: Date.now() + (i * 1000) };
    }
    window.db.ref(`tokyoRpg/posts/${postId}/comentarios`).update(comsToPush).then(() => { window.showNeonToast(`🤖 ${qtd} Bots engajaram no post!`); });
};

// MOTOR SILENCIOSO DE CURTIDAS EM TEMPO REAL (Roda só no PC do Mestre)
// MOTOR DE CURTIDAS EM TEMPO REAL (Roda para o Mestre e para o Dono do Post)
setInterval(() => {
    if(!window.db || !window.jogadorAtual) return;
    window.db.ref('tokyoRpg/posts').once('value').then(snap => {
        let posts = snap.val(); if(!posts) return;
        let updates = {};
        Object.keys(posts).forEach(k => {
            let p = posts[k];
            // O próprio autor do post processa as curtidas automáticas (ou o Mestre)
            if((p.autorId === window.jogadorAtual || window.isMaster) && p.targetLikes && (p.likes || 0) < p.targetLikes) {
                let missing = p.targetLikes - (p.likes || 0);
                
                // Puxa 10% dos likes que faltam de uma vez (sobe rápido no início e lento no final)
                let chunk = Math.max(1, Math.floor(missing * 0.10)); 
                if(missing < 5) chunk = missing;
                
                // 70% de chance de subir curtidas neste exato segundo (dá um ritmo realista)
                if(Math.random() > 0.3) { 
                    updates[`${k}/likes`] = (p.likes || 0) + chunk; 
                }
            }
        });
        if(Object.keys(updates).length > 0) window.db.ref('tokyoRpg/posts').update(updates);
    });
}, 2000); // Atualiza a cada 2 segundos

// Dispara os corações voando pelo canto direito da tela!
// =========================================================
// O NOVO MOTOR DE LIKES INTELIGENTE E BOTS
// =========================================================

// Dispara os Emojis (Estilo TikTok) Voando Pela Tela
window.spawnTiktokHeart = function() {
    let container = document.getElementById("igamble-view-posts");
    if(!container || !container.classList.contains("active")) return; 

    let h = document.createElement("div");
    h.className = "tiktok-heart";
    let emojis = ["❤️", "🔥", "⭐", "💸", "✨", "💖", "💎", "🎰"];
    h.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    
    let rightPos = 15 + Math.random() * 40; 
    h.style.right = rightPos + "px";
    h.style.fontSize = (20 + Math.random() * 20) + "px";
    
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2500);
};

// O Motor Silencioso (Só dono do post puxa os próprios likes para não travar o banco)
setInterval(() => {
    if(!window.db || !window.jogadorAtual) return;
    
    window.db.ref('tokyoRpg/posts').once('value').then(snap => {
        let posts = snap.val(); if(!posts) return;
        let updates = {};
        let meuPostGanhouLike = false;

        Object.keys(posts).forEach(k => {
            let p = posts[k];
            let autorId = p.autorId || p.autor;
            
            // Somente o DONO do post ou o MESTRE tem autorização pra atualizar o banco
            if(autorId === window.jogadorAtual || window.isMaster) {
                let uData = window.usersGlobais[autorId] || {};
                let currentTier = uData.popTier || "branca";
                if(p.isAd) currentTier = "dourado";
                
                let limits = window.popularityTiers[currentTier] || window.popularityTiers["branca"];
                let currentTarget = p.targetLikes || 0;
                
                // Mágica: Se a Fama mudou (ou postou agora), ele reseta o alvo para os novos limites
                if(currentTarget < limits.minL || currentTarget > limits.maxL) {
                    currentTarget = Math.floor(Math.random() * (limits.maxL - limits.minL + 1)) + limits.minL;
                    updates[`${k}/targetLikes`] = currentTarget;
                }

                let currentLikes = parseInt(p.likes) || 0;
                if(currentLikes < currentTarget) {
                    let missing = currentTarget - currentLikes;
                    let chunk = Math.max(1, Math.floor(missing * 0.08)); 
                    if(missing < 5) chunk = missing;
                    
                    // 50% de chance de subir agora (dá aquele aspecto de curtida humana)
                    if(Math.random() > 0.5) {
                        updates[`${k}/likes`] = currentLikes + chunk;
                        meuPostGanhouLike = true;
                    }
                }
            }
        });

        if(Object.keys(updates).length > 0) {
            window.db.ref('tokyoRpg/posts').update(updates);
            
            // Se as curtidas subiram, explode emojis na tela!
            if(meuPostGanhouLike) {
                let heartCount = Math.floor(Math.random() * 4) + 2; 
                for(let i = 0; i < heartCount; i++) {
                    setTimeout(window.spawnTiktokHeart, i * 300);
                }
            }
        }
    });
}, 2500); // Roda a cada 2.5s

// =========================================================
// SISTEMA DE CLASSES E TRABALHOS (SKILL TREE TBS)
// =========================================================
window.jobConfigGlobais = {}; 
window.currentViewingJob = null; 

window.categoriasTrabalho = {
    "Artista": ["Ilusionista", "Popstar", "Pintor"],
    "Bélico": ["Soldado", "Agente", "Sniper"],
    "Street": ["Grafiter", "Magician", "Traçador"],
    "Social": ["Firesman", "Enginer", "Guard"],
    "Tecnologicals": ["Cientist", "Hacker", "Medic"]
};

window.switchMyGambleTab = function(tabName) {
    document.getElementById("btnNavPerfil").classList.remove("active");
    document.getElementById("btnNavTrabalho").classList.remove("active");
    
    document.getElementById("view-perfil").style.display = "none";
    document.getElementById("view-trabalho").style.display = "none";

    if (tabName === 'perfil') {
        document.getElementById("btnNavPerfil").classList.add("active");
        document.getElementById("view-perfil").style.display = "flex";
    } else {
        document.getElementById("btnNavTrabalho").classList.add("active");
        document.getElementById("view-trabalho").style.display = "flex";
        window.renderizarTrabalhos();
    }
};

window.renderizarTrabalhos = function() {
    if(!window.jogadorAtual) return;
    
    let u = window.usersGlobais[window.jogadorAtual] || {};
    let mPanel = document.getElementById("masterJobPanel");
    if(window.isMaster && mPanel) mPanel.style.display = "block";

    let jobData = u.job || { locked: false, pts: 0 };
    let lblPts = document.getElementById("lblPontosTrabalho");
    if(lblPts) lblPts.innerText = jobData.pts || 0;

    if(jobData.locked && jobData.subjob) {
        document.getElementById("jobSelectionScreen").style.display = "none";
        window.abrirArvoreJob(jobData.subjob, jobData.category, false);
    } else {
        document.getElementById("jobSelectionScreen").style.display = "block";
        document.getElementById("jobTreeScreen").style.display = "none";
    }
};

window.abrirCategoriaJob = function(cat) {
    let container = document.getElementById("jobCardsContainer");
    container.innerHTML = "";
    
    let subjobs = window.categoriasTrabalho[cat];
    if(!subjobs) return;

    subjobs.forEach(sub => {
        let imgName = sub.toLowerCase().replace(/ç/g, 'c').replace(/ /g, '_');
        container.innerHTML += `
            <div class="job-card" onclick="window.abrirArvoreJob('${sub}', '${cat}', true)">
                <div style="width: 100%; height: 180px; background: #1a1a1a; border-bottom: 2px solid #ff66b2; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                    <span style="font-size: 40px; color: #444; position: absolute; z-index: 1;">💼</span>
                    <img src="img/jobs/${imgName}.png" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2;" onerror="this.style.display='none'">
                </div>
                <h3>${sub}</h3>
            </div>
        `;
    });
};

// CORREÇÃO: BOTÃO VOLTAR FUNCIONANDO AGORA!
window.voltarSelecaoJob = function() {
    document.getElementById("jobTreeScreen").style.display = "none";
    document.getElementById("jobSelectionScreen").style.display = "block";
    window.currentViewingJob = null;
};

// =========================================================
// NOVA HUD DE DETALHES DE HABILIDADE (TELA EXPANSÍVEL)
// (MATEMÁTICA DEFINITIVA: IDENTIFICAÇÕES ÚNICAS, CENTRAGEM E FORMAS PRECISAS)
// =========================================================

// 1. INJETOR AUTOMÁTICO DO MODAL (Cria a tela sem precisar mexer no index.html)
if(!document.getElementById("modalSkillDetails")) {
    let divModal = document.createElement("div");
    divModal.id = "modalSkillDetails";
    divModal.className = "modal-overlay";
    divModal.style.zIndex = "100000";
    divModal.style.display = "none";
    // Clicar fora fecha a janela
    divModal.onclick = function(e) { if(e.target === this) window.fecharDetalhesSkill(); };
    
    divModal.innerHTML = `
        <div class="modal-content" style="border-color: var(--accent-blue); width: 95%; max-width: 450px; padding: 20px; position: relative; background: rgba(10,10,15,0.98); box-shadow: 0 0 40px rgba(0, 229, 255, 0.3);">
            <button onclick="window.fecharDetalhesSkill()" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; transition: 0.2s;">✖</button>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                <div id="detSkillIcon" style="width: 80px; height: 80px; background: #111; border: 2px solid var(--accent-blue); border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(0,229,255,0.3);"></div>
                <div style="flex: 1; text-align: left;">
                    <h2 id="detSkillName" style="color: var(--accent-blue); font-size: 22px; margin: 0 0 5px 0; text-transform: uppercase; text-shadow: 0 0 10px var(--accent-blue);">---</h2>
                    <div style="font-size: 14px; color: var(--accent-gold); font-weight: bold;">Custo: <span id="detSkillPT" style="font-size: 18px;">1</span> PT</div>
                    <div style="font-size: 12px; color: #00ff66; margin-top:2px;">Energia: <span id="detSkillER">0</span>%</div>
                </div>
            </div>

            <div id="detSkillDesc" style="font-size: 13px; color: #ccc; text-align: justify; margin-bottom: 15px; line-height: 1.5; min-height: 40px; border-bottom: 1px dashed #333; padding-bottom: 15px;">---</div>

            <div style="display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; border: 1px solid #222; margin-bottom: 20px;">
                <div id="detSkillGrid" style="flex-shrink: 0;"></div>
                <div style="flex: 1; font-size: 12px; color: #aaa; text-align: left; display: grid; grid-template-columns: 1fr; gap: 6px;">
                    <div>⚔️ Base: <strong id="detSkillBase" style="color:#fff;">---</strong></div>
                    <div>💠 Forma: <strong id="detSkillShapeLabel" style="color:var(--accent-blue); text-shadow: 0 0 5px var(--accent-blue);">---</strong></div>
                    <div>🎯 Alcance: <strong id="detSkillRange" style="color:#fff;">---</strong></div>
                    <div>🎲 Efeito: <strong id="detSkillEffect" style="color:var(--accent-red);">---</strong></div>
                    <div>☣️ Status: <strong id="detSkillStatus" style="color:#ffaa00;">---</strong></div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btnLearnSkill" class="action-btn" style="flex: 2; border-color: #00ff66; background: rgba(0,255,102,0.1); color: #00ff66; font-size: 16px; padding: 12px; font-weight: bold; margin: 0;" onclick="window.comprarHabilidadeSelecionada()">APRENDER</button>
                <button id="btnEditSkill" class="action-btn" style="flex: 1; border-color: #f00; color: #f00; font-size: 14px; display: none; margin: 0;" onclick="window.editarHabilidadeSelecionada()">⚙️ EDITAR</button>
            </div>
        </div>
    `;
    document.body.appendChild(divModal);
}

window.skillSelecionadaInfo = null;

// =========================================================
// MOTOR VISUAL: DESENHA O MINI-GRID 5x5 DA HABILIDADE
// (CORRIGIDO: CENTRALIZAÇÃO DE ALVO PARA CRUZ E DIAGONAIS)
// =========================================================
// =========================================================
// TRADUTOR DA ARTE (GERA OS TEXTOS DA HUD)
// =========================================================
// =========================================================
// TRADUTOR DA ARTE (GERA OS TEXTOS DA HUD COM EMOJIS)
// =========================================================
window.parseCustomPatternDesc = function(pattern) {
    if (!pattern || typeof pattern !== 'string' || !pattern.trim() || !pattern.startsWith("{")) return { types: "Nenhum", effects: "Nenhum" };
    try {
        let pat = JSON.parse(pattern);
        let uniqueTypes = new Set(); let uniqueEffects = new Set();
        let typeNames = { 'd': '💥 Dano', 'c': '💚 Cura', 'i': '🐺 Invocação', 't': '🕸️ Armadilha', 'tp': '🌀 Teleporte' };

        Object.values(pat.effectMask || {}).forEach(sq => {
            if (typeNames[sq.t]) uniqueTypes.add(typeNames[sq.t]);
            if (sq.e && sq.e !== "Nenhum") uniqueEffects.add(`${window.effectEmojis[sq.e]||''}${sq.e} (${sq.v}F|${sq.tr}t)`);
        });
        return { types: Array.from(uniqueTypes).join(" | ") || "Nenhum", effects: Array.from(uniqueEffects).join(" | ") || "Nenhum" };
    } catch(e) { return { types: "Erro", effects: "Erro" }; }
};

window.gerarMiniGridHtml = function(customPattern) {
    if (!customPattern || !customPattern.startsWith("{")) return "<div style='color:#aaa; font-size:10px;'>Sem arte Tática.</div>";
    
    try {
        let pat = JSON.parse(customPattern);
        let html = `<div style="display:grid; grid-template-columns: repeat(9, 9px); grid-template-rows: repeat(9, 9px); gap:1px; background:#000; padding:4px; border-radius:6px; border:1px solid var(--accent-purple); flex-shrink:0; box-shadow: 0 0 10px rgba(176,0,255,0.2);">`;
        let px = 4; let py = 4; // Centro do 9x9

        for(let y=0; y<9; y++) {
            for(let x=0; x<9; x++) {
                let color = "#1a1a1a"; let emoji = "";
                if (x === px && y === py) { 
                    color = pat.castType === "alvo" ? "#ffaa00" : "#00e5ff"; 
                    emoji = pat.castType === "alvo" ? "🎯" : "🧍"; 
                }
                
                let relCoord = `${x - px}_${y - py}`;
                if (pat.effectMask && pat.effectMask[relCoord]) {
                    let d = pat.effectMask[relCoord];
                    if(d.t==='d') color = "#ff1a55"; else if(d.t==='c') color = "#00ff66"; else if(d.t==='i') color = "#0066ff"; else if(d.t==='t') color = "#006600"; else if(d.t==='tp') color = "#b000ff";
                    emoji = window.effectEmojis[d.e] || "";
                }
                html += `<div style="background:${color}; width:100%; height:100%; border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:7px;">${emoji}</div>`;
            }
        }
        return html + `</div>`;
    } catch(e) { return "<div style='color:red;'>Erro no Grid</div>"; }
};

// =========================================================
// 2. HUD MINI-GRID: DESENHA OS QUADRADINHOS E EMOJIS NA TELA
// =========================================================
window.gerarMiniGridHtml = function(shape, minRange, maxRange, aoe, customPattern) {
    let patternLimpo = customPattern;
    if (!patternLimpo || patternLimpo.trim() === "") patternLimpo = "F:0,-1,d,Nenhum,1,1"; // Fallback visual

    let html = `<div style="display:grid; grid-template-columns: repeat(11, 7px); grid-template-rows: repeat(11, 7px); gap:1px; background:#000; padding:4px; border-radius:6px; border:1px solid var(--accent-purple); flex-shrink:0; box-shadow: 0 0 10px rgba(176,0,255,0.2);">`;
    let parts = patternLimpo.split(":"); let mode = parts[0]; let blocks = parts[1] ? parts[1].split("|") : [];
    let px = 5; let py = mode === "F" ? 10 : 5;
    let paintMap = {}; blocks.forEach(b => { if(!b) return; let [x, y, t, e] = b.split(","); paintMap[`${px + parseInt(x)}_${py + parseInt(y)}`] = {t, e}; });

    for(let y=0; y<11; y++) {
        for(let x=0; x<11; x++) {
            let color = "#1a1a1a"; let emoji = "";
            if (x === px && y === py) { color = mode === "A" ? "#ffaa00" : "#00e5ff"; emoji = mode === "A" ? "🎯" : "🧍"; }
            else if (paintMap[`${x}_${y}`]) {
                let d = paintMap[`${x}_${y}`];
                if(d.t==='d') color = "#ff1a55"; else if(d.t==='c') color = "#00ff66"; else if(d.t==='i') color = "#0066ff"; else if(d.t==='t') color = "#006600"; else if(d.t==='tp') color = "#b000ff";
                emoji = window.effectEmojis[d.e] || "";
            }
            html += `<div style="background:${color}; width:100%; height:100%; border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:6px;">${emoji}</div>`;
        }
    }
    return html + `</div>`;
};

// =========================================================
// INJETOR DO MODAL DA MINI HUD
// =========================================================
if(!document.getElementById("modalSkillDetails")) {
    let divModal = document.createElement("div"); divModal.id = "modalSkillDetails"; divModal.className = "modal-overlay"; divModal.style.zIndex = "100000"; divModal.style.display = "none";
    divModal.onclick = function(e) { if(e.target === this) window.fecharDetalhesSkill(); };
    divModal.innerHTML = `
        <div class="modal-content" style="border-color: var(--accent-blue); width: 95%; max-width: 450px; padding: 20px; position: relative; background: rgba(10,10,15,0.98); box-shadow: 0 0 40px rgba(0, 229, 255, 0.3);">
            <button onclick="window.fecharDetalhesSkill()" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; transition: 0.2s;">✖</button>
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                <div id="detSkillIcon" style="width: 80px; height: 80px; background: #111; border: 2px solid var(--accent-blue); border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(0,229,255,0.3);"></div>
                <div style="flex: 1; text-align: left;">
                    <h2 id="detSkillName" style="color: var(--accent-blue); font-size: 22px; margin: 0 0 5px 0; text-transform: uppercase; text-shadow: 0 0 10px var(--accent-blue);">---</h2>
                    <div style="font-size: 14px; color: var(--accent-gold); font-weight: bold;">Custo: <span id="detSkillPT" style="font-size: 18px;">1</span> PT</div>
                    <div style="font-size: 12px; color: #00ff66; margin-top:2px;">Energia: <span id="detSkillER">0</span>%</div>
                </div>
            </div>
            <div id="detSkillDesc" style="font-size: 13px; color: #ccc; text-align: justify; margin-bottom: 15px; line-height: 1.5; min-height: 40px; border-bottom: 1px dashed #333; padding-bottom: 15px;">---</div>
            <div style="display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; border: 1px solid #222; margin-bottom: 20px;">
                <div id="detSkillGrid" style="flex-shrink: 0; display:flex; align-items:center; justify-content:center;"></div>
                <div style="flex: 1; font-size: 12px; color: #aaa; text-align: left; display: grid; grid-template-columns: 1fr; gap: 6px;">
                    <div>⚔️ Base: <strong id="detSkillBase" style="color:#fff;">---</strong></div>
                    <div>💠 Forma: <strong id="detSkillShapeLabel" style="color:var(--accent-blue); text-shadow: 0 0 5px var(--accent-blue);">---</strong></div>
                    <div>🎯 Alcance: <strong id="detSkillRange" style="color:#fff;">---</strong></div>
                    <div>🎲 Efeito: <strong id="detSkillEffect" style="color:var(--accent-red);">---</strong></div>
                    <div>☣️ Status: <strong id="detSkillStatus" style="color:#ffaa00;">---</strong></div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="btnLearnSkill" class="action-btn" style="flex: 2; border-color: #00ff66; background: rgba(0,255,102,0.1); color: #00ff66; font-size: 16px; padding: 12px; font-weight: bold; margin: 0;" onclick="window.comprarHabilidadeSelecionada()">APRENDER</button>
                <button id="btnEditSkill" class="action-btn" style="flex: 1; border-color: #f00; color: #f00; font-size: 14px; display: none; margin: 0;" onclick="window.editarHabilidadeSelecionada()">⚙️ EDITAR</button>
            </div>
        </div>
    `;
    document.body.appendChild(divModal);
}

// =========================================================
// A TELA DA HUD E SEUS DADOS
// =========================================================
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    document.getElementById("detSkillDesc").innerText = sData.desc || "Habilidade ainda não forjada.";
	document.getElementById("detSkillPT").innerText = sData.pt || 1;
    let paEl = document.getElementById("detSkillPA"); if(paEl) paEl.innerText = sData.pa || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; } 
    else { iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; iconEl.style.fontSize = "30px"; }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);
    
    document.getElementById("detSkillShapeLabel").innerText = isCustom ? "🖌️ Desenho 11x11" : (sData.shape || "🎯 Alvo Único");
    
    let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`; if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    document.getElementById("detSkillRange").innerText = isCustom ? "Livre (360º)" : (rangeTxt || "Corpo-a-corpo");

    // INJETA O TEXTO TRADUZIDO DE AÇÃO E STATUS!
    let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
    document.getElementById("detSkillEffect").innerHTML = `<span style="color:#fff;">${diceTxt}</span><br><span style="color:var(--accent-red); font-size:10px;">${actionTxt}</span>`;
    
    let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
    if(!isCustom && sData.status && sData.status !== "") statusText = `${sData.status} (${sData.statusVal || 1})`;
    document.getElementById("detSkillStatus").innerHTML = statusText;

    // CHAMA A FUNÇÃO DE GRID PRA DESENHAR NA HUD
    if(window.gerarMiniGridHtml) { document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.shape, sData.minRange, sData.maxRange, sData.aoe, sData.customPattern); }

    let btnEdit = document.getElementById("btnEditSkill"); let btnLearn = document.getElementById("btnLearnSkill");
    if(window.isMaster) { btnEdit.style.display = "block"; } else { btnEdit.style.display = "none"; }
    let u = window.usersGlobais[window.jogadorAtual] || {}; let unlockedSkills = u.job?.skills || [];
    if (!sData.nome || sData.nome === "Vazio") { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; } else if (unlockedSkills.includes(skillId)) { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; } else { btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; }

    document.getElementById("modalSkillDetails").style.display = "flex";
};

// =========================================================
// O CLIQUE DA ÁRVORE DE HABILIDADES (NÃO MEXER!)
// =========================================================
// =========================================================
// O CLIQUE DA ÁRVORE DE HABILIDADES (CORRIGIDO PARA ABRIR HUD)
// =========================================================
window.abrirArvoreJob = function(subjob, cat, isPreview) {
    window.currentViewingJob = { subjob: subjob, cat: cat };
    document.getElementById("jobSelectionScreen").style.display = "none"; 
    document.getElementById("jobTreeScreen").style.display = "flex"; 
    document.getElementById("jobTreeTitle").innerText = subjob.toUpperCase();

    let u = window.usersGlobais[window.jogadorAtual] || {}; 
    let uJob = u.job || {};
    
    if(uJob.locked && uJob.subjob === subjob && !window.isMaster) { 
        document.getElementById("btnVoltarJob").style.display = "none"; 
        document.getElementById("jobLockWarning").style.display = "none"; 
    } else { 
        document.getElementById("btnVoltarJob").style.display = "block"; 
        document.getElementById("jobLockWarning").style.display = "block"; 
    }

    let treeData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][subjob]) ? window.jobConfigGlobais[cat][subjob] : {};
    let unlockedSkills = (uJob.locked && uJob.subjob === subjob) ? (uJob.skills || []) : [];
    let nodeIds = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','u1','u2','u3']; 
    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };

    nodeIds.forEach(id => {
        let nodeEl = document.getElementById(`node_${id}`); 
        let tipEl = document.getElementById(`tip_${id}`);
        let sData = treeData[id] || { nome: "Vazio", desc: "Não configurada", pt: 1 };
        nodeEl.className = "skill-node" + (id.startsWith('u') ? " ultimate" : "");
        
        // A MÁGICA: O clique agora FORÇA a abertura da Mini HUD, e nunca o editor!
        nodeEl.onclick = function(e) {
            e.preventDefault(); // Impede qualquer comportamento padrão
            window.abrirDetalhesSkill(id, sData); 
        };

        if(sData.img && sData.img.trim() !== "") { 
            nodeEl.style.backgroundImage = `url('${sData.img}')`; nodeEl.innerText = ""; 
        } else { 
            nodeEl.style.backgroundImage = "none"; nodeEl.innerText = (sData.nome || "Vazio").substring(0, 10); 
        }

        let htmlTip = `<div class="skill-tooltip-title">${sData.nome}</div><div class="skill-tooltip-desc">${sData.desc}</div>`;
        if (sData.nome && sData.nome !== "Vazio") {
            htmlTip += `<div class="tbs-stats-grid"><span>⭐ PT: <strong>${sData.pt || 1}</strong></span>`;
            if(sData.er) htmlTip += `<span>⚡ ER: <strong style="color:#00ff66;">${sData.er}</strong></span>`;
            let nAttr = attrNames[sData.attr] || "Mágico"; htmlTip += `<span style="grid-column: span 2;">⚔️ Base: <strong>${nAttr}</strong></span>`;
            
            let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
            let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);

            let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`;
            if (rangeTxt) htmlTip += `<span style="grid-column: span 2;">🎯 Alcance: <strong>${isCustom ? 'Livre (360º)' : rangeTxt}</strong></span>`;
            
            let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
            let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
            htmlTip += `<span style="grid-column: span 2;">🎲 Ação Base: <strong style="color:#fff;">${diceTxt}</strong><br><strong style="color:var(--accent-red); font-size:9px;">${actionTxt}</strong></span>`;
            
            let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
            if(!isCustom && sData.status && sData.status !== "") statusText = `${sData.status} (${sData.statusVal || 1})`;
            
            if(statusText !== "Nenhum") htmlTip += `<span style="grid-column: span 2; font-size:10px;">☣️ Status: <strong style="color:#ffaa00;">${statusText}</strong></span>`;
            
            htmlTip += `<div style="grid-column: span 2; display:flex; justify-content:center; margin-top:5px;">`;
            htmlTip += window.gerarMiniGridHtml(sData.shape, sData.minRange, sData.maxRange, sData.aoe, sData.customPattern);
            htmlTip += `</div></div>`;
        }
        tipEl.innerHTML = htmlTip;

        if (unlockedSkills.includes(id)) { nodeEl.classList.add("unlocked"); } 
        else if (uJob.locked && uJob.subjob === subjob) { nodeEl.classList.add("available"); } 
        else if (isPreview) { nodeEl.classList.add("available"); }
    });
};

// =========================================================
// A TELA DA HUD E SEUS DADOS
// =========================================================
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    document.getElementById("detSkillDesc").innerText = sData.desc || "Habilidade ainda não forjada.";
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { 
        iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; 
    } else { 
        iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; 
        iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; 
        iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; 
        iconEl.style.fontSize = "30px"; 
    }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);
    
    document.getElementById("detSkillShapeLabel").innerText = isCustom ? "🖌️ Desenho 11x11" : (sData.shape || "🎯 Alvo Único");
    
    let rangeTxt = ""; 
    if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; 
    if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`; 
    if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    
    document.getElementById("detSkillRange").innerText = isCustom ? "Livre (360º)" : (rangeTxt || "Corpo-a-corpo");

    // INJETA O TEXTO TRADUZIDO DE AÇÃO E STATUS!
    let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
    document.getElementById("detSkillEffect").innerHTML = `<span style="color:#fff;">${diceTxt}</span><br><span style="color:var(--accent-red); font-size:10px;">${actionTxt}</span>`;
    
    let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
    if(!isCustom && sData.status && sData.status !== "") statusText = `${sData.status} (${sData.statusVal || 1})`;
    document.getElementById("detSkillStatus").innerHTML = statusText;

    // CHAMA A FUNÇÃO DE GRID PRA DESENHAR NA HUD
    if(window.gerarMiniGridHtml) { 
        document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.shape, sData.minRange, sData.maxRange, sData.aoe, sData.customPattern); 
    }

    let btnEdit = document.getElementById("btnEditSkill"); 
    let btnLearn = document.getElementById("btnLearnSkill");
    
    if(window.isMaster) { 
        btnEdit.style.display = "block"; 
    } else { 
        btnEdit.style.display = "none"; 
    }
    
    let u = window.usersGlobais[window.jogadorAtual] || {}; 
    let unlockedSkills = u.job?.skills || [];
    
    if (!sData.nome || sData.nome === "Vazio") { 
        btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; 
    } else if (unlockedSkills.includes(skillId)) { 
        btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; 
    } else { 
        btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; 
    }

    let modal = document.getElementById("modalSkillDetails");
    if (modal) modal.style.display = "flex";
};

// Funções de controle da HUD
window.fecharDetalhesSkill = function() {
    let modal = document.getElementById("modalSkillDetails");
    if(modal) modal.style.display = "none";
};

window.editarHabilidadeSelecionada = function() {
    window.fecharDetalhesSkill();
    if(window.skillSelecionadaInfo) window.clicarHabilidade(window.skillSelecionadaInfo.id); 
};

window.comprarHabilidadeSelecionada = function() {
    window.fecharDetalhesSkill();
    if(window.skillSelecionadaInfo) window.clicarHabilidade(window.skillSelecionadaInfo.id); 
};

// =========================================================
// 1. ABRIR O MODAL DA FORJA (MESTRE) OU COMPRAR (JOGADOR)
// =========================================================
window.clicarHabilidade = function(skillId) {
    if(!window.currentViewingJob) return;
    let sub = window.currentViewingJob.subjob; let cat = window.currentViewingJob.cat;

    if(window.isMaster) {
        let sData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][sub] && window.jobConfigGlobais[cat][sub][skillId]) ? window.jobConfigGlobais[cat][sub][skillId] : null;
        let isNew = !sData || sData.nome === "Vazio" || sData.nome === "";

        let setVal = (id, val) => { let el = document.getElementById(id); if(el) el.value = val; };
        setVal("editSkillId", skillId); setVal("editSkillName", isNew ? "" : (sData.nome || "")); setVal("editSkillImg", isNew ? "" : (sData.img || "")); setVal("editSkillDesc", isNew ? "" : (sData.desc || ""));
        setVal("editSkillPT", isNew ? "" : (sData.pt || "")); setVal("editSkillER", isNew ? "" : (sData.er || "")); setVal("editSkillAttr", isNew ? "int" : (sData.attr || "int"));
        setVal("editSkillMinRange", isNew ? "" : (sData.minRange || "")); setVal("editSkillMaxRange", isNew ? "" : (sData.maxRange || "")); 
        setVal("editSkillDice", isNew ? "" : (sData.dice || "")); setVal("editSkillBonus", isNew ? "" : (sData.bonus || "")); 
        setVal("editSkillCustomPattern", isNew ? "" : (sData.customPattern || ""));
        
        let modal = document.getElementById("modalEditSkill"); if(modal) modal.style.display = "flex"; return;
    }

    let u = window.usersGlobais[window.jogadorAtual] || {}; let uJob = u.job || { locked: false, pts: 0, skills: [] };
    if(uJob.locked && uJob.subjob !== sub) { window.showNeonToast("Você já possui outra classe!"); return; }
    if(uJob.skills && uJob.skills.includes(skillId)) { window.showNeonToast("Você já tem essa habilidade!"); return; }

    let sData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][sub] && window.jobConfigGlobais[cat][sub][skillId]) ? window.jobConfigGlobais[cat][sub][skillId] : null;
    if(!sData || !sData.nome || sData.nome === "Vazio") { window.showNeonToast("Habilidade não forjada."); return; }
    let custo = parseInt(sData.pt) || 1; if((uJob.pts || 0) < custo) { window.showNeonToast(`Precisa de ${custo} PT!`); return; }

    if(confirm(uJob.locked ? `Dominar [${sData.nome}] por ${custo} PT?` : `Gastar ${custo} PT irá TRAVAR você como [${sub}]. Confirmar?`)) {
        let ptsRestantes = (uJob.pts || 0) - custo; let novasSkills = uJob.skills ? [...uJob.skills] : []; novasSkills.push(skillId);
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/job`).set({ locked: true, category: cat, subjob: sub, pts: ptsRestantes, skills: novasSkills });

        // Tenta puxar o maxRange do JSON
        let mRange = sData.maxRange || 4;
        if(sData.customPattern && sData.customPattern.startsWith("{")) {
            try { let pat = JSON.parse(sData.customPattern); if(pat.maxRange) mRange = pat.maxRange; } catch(e){}
        }

        let skillPayload = {
            nome: "✨ " + sData.nome, tipo: "Skill", desc: sData.desc, img: sData.img, eq: true, w: 0, h: 0, isVTT: true,
            wpnRange: mRange, minRange: sData.minRange || 0,
            customPattern: sData.customPattern || "", // O JSON É SALVO NA MOCHILA AQUI!
            wpnDice: sData.dice, wpnBonus: sData.bonus, attr: sData.attr, erCost: sData.er
        };
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila`).push(skillPayload).then(() => { window.showNeonToast(`Adquirida!`); window.renderizarTrabalhos(); });
    }
};

// =========================================================
// 2. SALVAR AS CONFIGURAÇÕES NA FORJA (SEGURO)
// =========================================================
window.salvarEdicaoMestre = function() {
    try {
        if(!window.isMaster || !window.currentViewingJob) return;

        let skillId = document.getElementById("editSkillId").value;
        let cat = window.currentViewingJob.cat; 
        let sub = window.currentViewingJob.subjob;
        
        let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
        let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

        let payload = {
            nome: getVal("editSkillName", "").trim() || "Nova Habilidade",
            img: getVal("editSkillImg", "").trim() || "",
            desc: getVal("editSkillDesc", "").trim() || "Sem descrição.",
            pt: getInt("editSkillPT", 1), er: getInt("editSkillER", 0), attr: getVal("editSkillAttr", "int"),
            minRange: getInt("editSkillMinRange", 0), maxRange: getInt("editSkillMaxRange", 1),
            customPattern: getVal("editSkillCustomPattern", ""), // A ARTE É SALVA AQUI!
            dice: getVal("editSkillDice", "").trim() || "1d4", bonus: getInt("editSkillBonus", 0)
        };

        // Salva na memória ativa do Mestre
        if(!window.jobConfigGlobais[cat]) window.jobConfigGlobais[cat] = {};
        if(!window.jobConfigGlobais[cat][sub]) window.jobConfigGlobais[cat][sub] = {};
        window.jobConfigGlobais[cat][sub][skillId] = payload;

        let updates = {};
        updates[`tokyoRpg/jobConfig/${cat}/${sub}/${skillId}`] = payload;

        // Vasculha TODAS as mochilas e injeta a skill atualizada com o desenho novo!
        window.db.ref('tokyoRpg/users').once('value').then(snap => {
            let usrs = snap.val(); 
            if(usrs) { 
                Object.keys(usrs).forEach(uKey => { 
                    let inv = usrs[uKey].mochila; 
                    if(inv) { 
                        Object.keys(inv).forEach(mKey => { 
                            let nomeMochila = (inv[mKey].nome || "").replace("✨ ", "").replace("🧪 ", "").trim();
                            let nomePayload = payload.nome.trim();
                            if(nomeMochila === nomePayload) { 
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/customPattern`] = payload.customPattern;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnRange`] = payload.maxRange;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/desc`] = payload.desc;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/isVTT`] = true;
                            } 
                        }); 
                    } 
                }); 
            }
            
            // Dispara tudo pro Firebase
            window.db.ref().update(updates).then(() => {
                window.showNeonToast("Habilidade Forjada e Transmitida ao VTT!"); 
                let modal = document.getElementById("modalEditSkill"); if(modal) modal.style.display = "none";
                window.abrirArvoreJob(sub, cat, true); // Recarrega os visuais
                
                // Se a mira estiver aberta no mapa, reseta para pegar o desenho novo na hora!
                let wpnDiv = document.getElementById("wpnSelectDiv");
                if(window.currentSubMapKey && wpnDiv && wpnDiv.style.display === "flex") {
                    window.iniciarAtaqueVTT(); 
                }
            });
        });
    } catch (err) { window.showNeonToast("Erro na Forja."); console.error(err); }
};

// =========================================================
// 3. EQUIPAR TESTE PARA O MESTRE (SEGURO)
// =========================================================
window.testarSkillMestre = function() {
    let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
    let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

    let payload = {
        nome: "🧪 " + (getVal("editSkillName", "").trim() || "Teste"), 
        tipo: "Skill", desc: getVal("editSkillDesc", "").trim(),
        eq: true, w: 0, h: 0, isVTT: true,
        wpnStyle: getVal("editSkillShape", "Alvo"), 
        customPattern: getVal("editSkillCustomPattern", ""),
        wpnRange: getInt("editSkillMaxRange", 1), 
        minRange: getInt("editSkillMinRange", 0), 
        aoe: getInt("editSkillAoE", 0),
        wpnDice: getVal("editSkillDice", "").trim() || "1d4", 
        wpnBonus: getInt("editSkillBonus", 0), 
        wpnEffect: getVal("editSkillStatus", ""), 
        wpnEffectVal: getInt("editSkillStatusVal", 1), 
        wpnEffectTurnos: getInt("editSkillStatusTurnos", 1), 
        attr: getVal("editSkillAttr", "int"), 
        erCost: getInt("editSkillER", 0)
    };

    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).push(payload).then(() => { 
        window.showNeonToast("Skill injetada na mochila do Mestre!"); 
        let modal = document.getElementById("modalEditSkill");
        if(modal) modal.style.display = "none"; 
    });
};

// 4. ATUALIZAR HUD DE DETALHES DA SKILL (Para mostrar Força e Duração separadas)
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    let translatedDesc = sData.desc || "Habilidade ainda não forjada.";
    document.getElementById("detSkillDesc").innerText = translatedDesc;
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; } 
    else { iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; iconEl.style.fontSize = "30px"; }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    document.getElementById("detSkillShapeLabel").innerText = isCustom ? "🖌️ Pintada Manualmente" : (sData.shape || "🎯 Alvo Único");
    
    let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`; if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    document.getElementById("detSkillRange").innerText = isCustom ? "Livre (360º)" : (rangeTxt || "Corpo-a-corpo");

    // LÓGICA DE DANO BASE E STATUS: Lê do Pintor Tático se existir!
    let dmgVal = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    document.getElementById("detSkillEffect").innerText = dmgVal.trim() !== "" ? dmgVal : "Nenhum";
    
    let statusText = "Nenhum";
    if (isCustom) {
        let uniqueStatuses = new Set();
        let parts = sData.customPattern.split(":");
        if (parts[1]) {
            parts[1].split("|").forEach(b => {
                if(!b) return;
                let [x, y, t, e, v, tr] = b.split(",");
                if (e && e !== "Nenhum") uniqueStatuses.add(`${window.effectEmojis[e]||''}${e} (${v} F | ${tr}t)`);
            });
        }
        if (uniqueStatuses.size > 0) statusText = Array.from(uniqueStatuses).join(" 🔹 ");
    } else if (sData.status && sData.status !== "") { 
        statusText = `${sData.status} (Força: ${sData.statusVal || 1} | Duração: ${sData.statusTurnos || 1}t)`; 
    }
    document.getElementById("detSkillStatus").innerText = statusText;

    // INJETA O PATTERN PARA GERAR A IMAGEM
    if(window.gerarMiniGridHtml) { document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.customPattern || ""); }

    let btnEdit = document.getElementById("btnEditSkill"); let btnLearn = document.getElementById("btnLearnSkill");
    if(window.isMaster) { btnEdit.style.display = "block"; } else { btnEdit.style.display = "none"; }
    let u = window.usersGlobais[window.jogadorAtual] || {}; let unlockedSkills = u.job?.skills || [];
    if (!sData.nome || sData.nome === "Vazio") { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; } else if (unlockedSkills.includes(skillId)) { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; } else { btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; }

    document.getElementById("modalSkillDetails").style.display = "flex";
};

// Faz o mesmo para o balãozinho (Tooltip) da árvore!
window.abrirArvoreJob = function(subjob, cat, isPreview) {
    window.currentViewingJob = { subjob: subjob, cat: cat };
    document.getElementById("jobSelectionScreen").style.display = "none"; document.getElementById("jobTreeScreen").style.display = "flex"; document.getElementById("jobTreeTitle").innerText = subjob.toUpperCase();

    let u = window.usersGlobais[window.jogadorAtual] || {}; let uJob = u.job || {};
    if(uJob.locked && uJob.subjob === subjob && !window.isMaster) { document.getElementById("btnVoltarJob").style.display = "none"; document.getElementById("jobLockWarning").style.display = "none"; } 
    else { document.getElementById("btnVoltarJob").style.display = "block"; document.getElementById("jobLockWarning").style.display = "block"; }

    let treeData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][subjob]) ? window.jobConfigGlobais[cat][subjob] : {};
    let unlockedSkills = (uJob.locked && uJob.subjob === subjob) ? (uJob.skills || []) : [];
    let nodeIds = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','u1','u2','u3']; let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };

    nodeIds.forEach(id => {
        let nodeEl = document.getElementById(`node_${id}`); let tipEl = document.getElementById(`tip_${id}`);
        let sData = treeData[id] || { nome: "Vazio", desc: "Não configurada", pt: 1 };
        nodeEl.className = "skill-node" + (id.startsWith('u') ? " ultimate" : "");
        
        if(sData.img && sData.img.trim() !== "") { nodeEl.style.backgroundImage = `url('${sData.img}')`; nodeEl.innerText = ""; } 
        else { nodeEl.style.backgroundImage = "none"; nodeEl.innerText = (sData.nome || "Vazio").substring(0, 10); }

        let htmlTip = `<div class="skill-tooltip-title">${sData.nome}</div><div class="skill-tooltip-desc">${sData.desc}</div>`;
        if (sData.nome && sData.nome !== "Vazio") {
            htmlTip += `<div class="tbs-stats-grid"><span>⭐ PT: <strong>${sData.pt || 1}</strong></span>`;
            if(sData.er) htmlTip += `<span>⚡ ER: <strong style="color:#00ff66;">${sData.er}</strong></span>`;
            let nAttr = attrNames[sData.attr] || "Mágico"; htmlTip += `<span style="grid-column: span 2;">⚔️ Base: <strong>${nAttr}</strong></span>`;
            
            let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
            let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`;
            if (rangeTxt) htmlTip += `<span style="grid-column: span 2;">🎯 Alcance: <strong>${isCustom ? 'Livre (360º)' : rangeTxt}</strong></span>`;
            
            let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
            if(diceTxt.trim() !== "") htmlTip += `<span style="grid-column: span 2;">🎲 Efeito Base: <strong style="color:var(--accent-red);">${diceTxt}</strong></span>`;
            
            // LÊ OS EFEITOS PINTADOS PARA O TOOLTIP
            let statusText = "Nenhum";
            if (isCustom) {
                let uniqueStatuses = new Set();
                let parts = sData.customPattern.split(":");
                if (parts[1]) {
                    parts[1].split("|").forEach(b => {
                        if(!b) return; let [x, y, t, e, v, tr] = b.split(",");
                        if (e && e !== "Nenhum") uniqueStatuses.add(`${window.effectEmojis[e]||''}${e} (${v}F|${tr}t)`);
                    });
                }
                if (uniqueStatuses.size > 0) statusText = Array.from(uniqueStatuses).join(" ");
            } else if (sData.status && sData.status !== "") { 
                statusText = `${sData.status} (${sData.statusVal || 1})`; 
            }
            if(statusText !== "Nenhum") htmlTip += `<span style="grid-column: span 2; font-size:9px;">☣️ Status: <strong style="color:#ffaa00;">${statusText}</strong></span>`;
            
            // INJETA O MINIGRID
            htmlTip += `<div style="grid-column: span 2; display:flex; justify-content:center; margin-top:5px;">`;
            htmlTip += window.gerarMiniGridHtml(sData.customPattern || "");
            htmlTip += `</div></div>`;
        }
        tipEl.innerHTML = htmlTip;

        if (unlockedSkills.includes(id)) { nodeEl.classList.add("unlocked"); } 
        else if (uJob.locked && uJob.subjob === subjob) { nodeEl.classList.add("available"); } 
        else if (isPreview) { nodeEl.classList.add("available"); }
    });
};

// =========================================================
// CORREÇÃO: SALVAR HABILIDADE BLINDADO CONTRA ERROS
// =========================================================
window.salvarEdicaoMestre = function() {
    try {
        if(!window.isMaster || !window.currentViewingJob) {
            window.showNeonToast("Erro: Classe não selecionada!");
            return;
        }

        let skillId = document.getElementById("editSkillId").value;
        let cat = window.currentViewingJob.cat; 
        let sub = window.currentViewingJob.subjob;
        
        // Coleta blindada (Se o campo estiver vazio, ele assume o padrão e não crasha)
        let payload = {
            nome: document.getElementById("editSkillName").value.trim() || "Nova Habilidade",
            img: document.getElementById("editSkillImg").value.trim() || "",
            desc: document.getElementById("editSkillDesc").value.trim() || "Sem descrição.",
            pt: parseInt(document.getElementById("editSkillPT").value) || 1,
            er: parseInt(document.getElementById("editSkillER").value) || 0,
            attr: document.getElementById("editSkillAttr").value || "int",
            minRange: parseInt(document.getElementById("editSkillMinRange").value) || 0,
            maxRange: parseInt(document.getElementById("editSkillMaxRange").value) || 1,
            aoe: parseInt(document.getElementById("editSkillAoE").value) || 0,
            shape: document.getElementById("editSkillShape").value || "Alvo",
            dice: document.getElementById("editSkillDice").value.trim() || "1d4",
            bonus: parseInt(document.getElementById("editSkillBonus").value) || 0,
            status: document.getElementById("editSkillStatus").value || "",
            statusVal: parseInt(document.getElementById("editSkillStatusVal").value) || 1
        };

        if(payload.shape === "summon") {
            payload.summonHP = parseInt(document.getElementById("editSkillSummonHP").value) || 50;
            payload.summonTurnos = parseInt(document.getElementById("editSkillSummonTurnos").value) || 3;
        }

        window.db.ref(`tokyoRpg/jobConfig/${cat}/${sub}/${skillId}`).set(payload).then(() => {
            window.showNeonToast("Node Forjado e Salvo no Banco!"); 
            document.getElementById("modalEditSkill").style.display = "none";
        }).catch(err => {
            console.error("Erro Firebase:", err);
            window.showNeonToast("Erro de conexão ao salvar!");
        });

    } catch (err) {
        console.error("Erro no Javascript ao Salvar:", err);
        window.showNeonToast("Erro ao ler formulário. Preencha os números corretamente.");
    }
};

// Também protegemos a leitura para o caso de um Node ter salvado pela metade antes
// =========================================================
// 1. MOTOR VISUAL: DESENHA O MINI-GRID (AGORA LÊ O DESENHO!)
// =========================================================
window.gerarMiniGridHtml = function(customPattern) {
    if (!customPattern || typeof customPattern !== 'string' || !customPattern.startsWith("{")) return "<div style='color:#aaa; font-size:10px;'>Sem arte Tática JSON.</div>";
    
    try {
        let pat = JSON.parse(customPattern);
        let html = `<div style="display:grid; grid-template-columns: repeat(9, 9px); grid-template-rows: repeat(9, 9px); gap:1px; background:#000; padding:4px; border-radius:6px; border:1px solid var(--accent-purple); flex-shrink:0; box-shadow: 0 0 10px rgba(176,0,255,0.2);">`;
        let px = 4; let py = 4; // Centro do 9x9

        for(let y=0; y<9; y++) {
            for(let x=0; x<9; x++) {
                let color = "#1a1a1a"; let emoji = "";
                if (x === px && y === py) { 
                    color = pat.castType === "alvo" ? "#ffaa00" : "#00e5ff"; 
                    emoji = pat.castType === "alvo" ? "🎯" : "🧍"; 
                }
                
                let relCoord = `${x - px}_${y - py}`;
                if (pat.effectMask && pat.effectMask[relCoord]) {
                    let d = pat.effectMask[relCoord];
                    if(d.t==='d') color = "#ff1a55"; else if(d.t==='c') color = "#00ff66"; else if(d.t==='i') color = "#0066ff"; else if(d.t==='t') color = "#006600"; else if(d.t==='tp') color = "#b000ff";
                    emoji = window.effectEmojis[d.e] || "";
                }
                html += `<div style="background:${color}; width:100%; height:100%; border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:7px;">${emoji}</div>`;
            }
        }
        return html + `</div>`;
    } catch(e) { return "<div style='color:red;'>Erro no Grid</div>"; }
};

window.abrirMiniHudNova = function(skillId, sData) {
    document.getElementById("hudNovaName").innerText = sData.nome || "Vazio";
    document.getElementById("hudNovaPT").innerText = sData.pt || 1;
    document.getElementById("hudNovaER").innerText = sData.er || 0;
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    document.getElementById("hudNovaDesc").innerText = sData.desc || "Habilidade ainda não forjada.";
    
    let iconEl = document.getElementById("hudNovaIcon");
    if(sData.img && sData.img.trim() !== "") { iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; } 
    else { iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; iconEl.style.fontSize = "30px"; }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("hudNovaBase").innerText = attrNames[sData.attr] || "Mágico";
    
    let drawType = "🖌️ Sem Desenho";
    if(isCustom && sData.customPattern.startsWith("{")) {
        try {
            let pat = JSON.parse(sData.customPattern);
            if(pat.castType === "alvo") drawType = "🎯 Disparo Ranged";
            if(pat.castType === "direcional") drawType = "⬆️ Frente/Giro";
            if(pat.castType === "aura") drawType = "🔄 Aura/Self";
            
            let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (pat.maxRange > 0) rangeTxt += `Máx ${pat.maxRange}`;
            document.getElementById("hudNovaRange").innerText = pat.castType === "alvo" ? (rangeTxt || "Corpo-a-corpo") : "Livre (Grid)";
        } catch(e){}
    }
    document.getElementById("hudNovaShape").innerText = drawType;

    let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);
    let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
    document.getElementById("hudNovaEffect").innerHTML = `<span style="color:#fff;">${diceTxt}</span><br><span style="color:var(--accent-red); font-size:10px;">${actionTxt}</span>`;
    
    let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
    document.getElementById("hudNovaStatus").innerHTML = statusText;

    // AQUI ESTAVA O ERRO! AGORA PASSA SÓ 1 PARÂMETRO!
    if(window.gerarMiniGridHtml) { document.getElementById("hudNovaGrid").innerHTML = window.gerarMiniGridHtml(sData.customPattern); }

    let btnEdit = document.getElementById("hudNovaBtnEdit"); let btnLearn = document.getElementById("hudNovaBtnLearn");
    btnEdit.style.display = window.isMaster ? "block" : "none";
    btnEdit.onclick = () => { document.getElementById("miniHudNovaContainer").style.display = "none"; window.clicarHabilidade(skillId); };

    let u = window.usersGlobais[window.jogadorAtual] || {}; let unlockedSkills = u.job?.skills || [];
    if (!sData.nome || sData.nome === "Vazio") { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; } else if (unlockedSkills.includes(skillId)) { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; } else { btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; }
    btnLearn.onclick = () => { document.getElementById("miniHudNovaContainer").style.display = "none"; window.clicarHabilidade(skillId); };

    document.getElementById("miniHudNovaContainer").style.display = "flex";
};

// =========================================================
// 2. ABRIR TELA DE DETALHES (INJETANDO O DESENHO LÁ DENTRO)
// =========================================================
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    let translatedDesc = sData.desc || "Habilidade ainda não forjada.";
    if (sData.shape === 'self' || sData.shape === 'self_buff') { translatedDesc += " (Com efeitos de cura saindo dele)"; }
    document.getElementById("detSkillDesc").innerText = translatedDesc;
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; } 
    else { iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; iconEl.style.fontSize = "30px"; }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    let shapeNames = { 'self': '💖 Em Si Mesmo', 'Alvo': '🎯 Alvo Único', 'melee': '⚔️ Corpo-a-Corpo', 'ranged': '🏹 À Distância', 'heal': '💊 Cura/Buff', 'cross': '➕ Cruz', 'big_cross': '🕂 Cruz Grande', 'line': '📏 Linha Perfurante', 'alternating_line': '➖ Linha Alternada', 'x_shape': '❌ Diagonais', 'cone': '🍕 Cone Frontal', 'aoe': '💥 Quadrado (AoE)', 'self_aoe': '🌪️ Aura (Self-AoE)', 'trap': '🕸️ Armadilha (Chão)', 'summon': '🐺 Invocação', 'teleport': '🌀 Teleporte', 't_shape': '┳ Formato T', 'self_buff': '🌟 Buff Pessoal' };
    document.getElementById("detSkillShapeLabel").innerText = isCustom ? "🖌️ Pintada Manualmente" : (shapeNames[sData.shape || "Alvo"] || "🎯 Alvo Único");
    
    let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`; if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    document.getElementById("detSkillRange").innerText = isCustom ? "Livre (360º)" : (rangeTxt || "Corpo-a-corpo");

    document.getElementById("detSkillEffect").innerText = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "") || "Nenhum";
    let statusText = "Nenhum";
    if (sData.status && sData.status !== "") { statusText = `${sData.status} (Força: ${sData.statusVal || 1} | Duração: ${sData.statusTurnos || 1}t)`; }
    document.getElementById("detSkillStatus").innerText = statusText;

    // AQUI ELE CHAMA O MOTOR VISUAL PASSANDO O SEU DESENHO!
    if(window.gerarMiniGridHtml) { 
        document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.shape || "Alvo", sData.minRange || 0, sData.maxRange || 1, sData.aoe || 0, sData.customPattern); 
    }

    let btnEdit = document.getElementById("btnEditSkill"); let btnLearn = document.getElementById("btnLearnSkill");
    if(window.isMaster) { btnEdit.style.display = "block"; } else { btnEdit.style.display = "none"; }
    let u = window.usersGlobais[window.jogadorAtual] || {}; let unlockedSkills = u.job?.skills || [];
    if (!sData.nome || sData.nome === "Vazio") { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; } else if (unlockedSkills.includes(skillId)) { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; } else { btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; }

    document.getElementById("modalSkillDetails").style.display = "flex";
};

// =========================================================
// 3. ABRIR ÁRVORE (BALÃO DO MOUSE EXIBE O DESENHO TAMBÉM)
// =========================================================
window.abrirArvoreJob = function(subjob, cat, isPreview) {
    window.currentViewingJob = { subjob: subjob, cat: cat };
    document.getElementById("jobSelectionScreen").style.display = "none"; document.getElementById("jobTreeScreen").style.display = "flex"; 
    
    let titleEl = document.getElementById("jobTreeTitle");
    if (window.isMaster) {
        let selHtml = `<select onchange="let v=this.value.split('|'); window.abrirArvoreJob(v[1], v[0], true)" style="background:#000; color:var(--accent-blue); border:1px solid var(--accent-blue); padding:5px 10px; border-radius:4px; font-weight:bold; font-size:16px; outline:none; cursor:pointer;">`;
        Object.keys(window.categoriasTrabalho).forEach(c => {
            selHtml += `<optgroup label="--- ${c.toUpperCase()} ---">`;
            window.categoriasTrabalho[c].forEach(s => { let selected = (s === subjob) ? "selected" : ""; selHtml += `<option value="${c}|${s}" ${selected}>${s.toUpperCase()}</option>`; });
            selHtml += `</optgroup>`;
        });
        selHtml += `</select>`; titleEl.innerHTML = selHtml;
    } else { titleEl.innerText = subjob.toUpperCase(); }

    let u = window.usersGlobais[window.jogadorAtual] || {}; let uJob = u.job || {};
    if(uJob.locked && uJob.subjob === subjob && !window.isMaster) { document.getElementById("btnVoltarJob").style.display = "none"; document.getElementById("jobLockWarning").style.display = "none"; } 
    else { document.getElementById("btnVoltarJob").style.display = "block"; document.getElementById("jobLockWarning").style.display = "block"; }

    let treeData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][subjob]) ? window.jobConfigGlobais[cat][subjob] : {};
    let unlockedSkills = (uJob.locked && uJob.subjob === subjob) ? (uJob.skills || []) : [];
    let nodeIds = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','u1','u2','u3']; let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };

    nodeIds.forEach(id => {
        let nodeEl = document.getElementById(`node_${id}`); let tipEl = document.getElementById(`tip_${id}`);
        let sData = treeData[id] || { nome: "Vazio", desc: "Não configurada", pt: 1 };
        nodeEl.className = "skill-node" + (id.startsWith('u') ? " ultimate" : "");
        
        nodeEl.onclick = function(e) { e.preventDefault(); e.stopPropagation(); window.abrirMiniHudNova(id, sData); };

        let displayName = "";
        if(sData.img && sData.img.trim() !== "") { nodeEl.style.backgroundImage = `url('${sData.img}')`; } 
        else { nodeEl.style.backgroundImage = "none"; displayName = (sData.nome || "Vazio").substring(0, 10); }
        nodeEl.innerHTML = `<span style="text-shadow: 0 0 5px #000, 0 0 5px #000; pointer-events:none; position:relative; z-index:5;">${displayName}</span>`;

        let htmlTip = `<div class="skill-tooltip-title">${sData.nome}</div><div class="skill-tooltip-desc">${sData.desc}</div>`;
        if (sData.nome && sData.nome !== "Vazio") {
            htmlTip += `<div class="tbs-stats-grid"><span>⭐ PT: <strong>${sData.pt || 1}</strong></span>`;
            if(sData.er) htmlTip += `<span>⚡ ER: <strong style="color:#00ff66;">${sData.er}</strong></span>`;
            let nAttr = attrNames[sData.attr] || "Mágico"; htmlTip += `<span style="grid-column: span 2;">⚔️ Base: <strong>${nAttr}</strong></span>`;
            
            let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
            let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);

            let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; 
            // Tenta puxar o maxRange do JSON
            if (isCustom && sData.customPattern.startsWith("{")) { try { let pat = JSON.parse(sData.customPattern); if(pat.maxRange) rangeTxt += `Máx ${pat.maxRange}`; } catch(e){} }
            if (rangeTxt) htmlTip += `<span style="grid-column: span 2;">🎯 Alcance: <strong>${rangeTxt}</strong></span>`;
            
            let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
            let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
            htmlTip += `<span style="grid-column: span 2;">🎲 Ação Base: <strong style="color:#fff;">${diceTxt}</strong><br><strong style="color:var(--accent-red); font-size:9px;">${actionTxt}</strong></span>`;
            
            let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
            if(statusText !== "Nenhum") htmlTip += `<span style="grid-column: span 2; font-size:10px;">☣️ Status: <strong style="color:#ffaa00;">${statusText}</strong></span>`;
            
            // AQUI ESTAVA O ERRO TAMBÉM! AGORA CHAMA SÓ COM O DESENHO!
            htmlTip += `<div style="grid-column: span 2; display:flex; justify-content:center; margin-top:5px;">`;
            htmlTip += window.gerarMiniGridHtml(sData.customPattern);
            htmlTip += `</div></div>`;
        }
        tipEl.innerHTML = htmlTip;

        if (unlockedSkills.includes(id)) { nodeEl.classList.add("unlocked"); } 
        else if (uJob.locked && uJob.subjob === subjob) { nodeEl.classList.add("available"); } 
        else if (isPreview) { nodeEl.classList.add("available"); }
    });
};

// =========================================================
// SISTEMA DE INICIATIVA INTELIGENTE E PARAR COMBATE
// =========================================================

// Função que o jogador clica para alternar se ele vai lutar ou não
window.toggleVttReady = function() {
    let isReady = window.usersGlobais[window.jogadorAtual]?.vttReady || false;
    let novoStatus = !isReady;
    
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/vttReady`).set(novoStatus).then(() => {
        window.showNeonToast(novoStatus ? "⚔️ Você entrou na fila de combate!" : "Você saiu da fila de combate.");
    });
};

// Observador para pintar o botão de Verde ou Cinza
setInterval(() => {
    if(!window.db || !window.jogadorAtual) return;
    let btn = document.getElementById("btnToggleVttReady");
    let mPanel = document.getElementById("mestreIniciativaPainel");
    
    if(btn) {
        let isReady = window.usersGlobais[window.jogadorAtual]?.vttReady || false;
        if(isReady) {
            btn.style.borderColor = "#00ff66"; btn.style.color = "#00ff66";
            btn.innerHTML = "✅ PRONTO PRO COMBATE";
        } else {
            btn.style.borderColor = "#aaa"; btn.style.color = "#aaa";
            btn.innerHTML = "❌ FORA DO COMBATE";
        }
    }
    
    if(mPanel) mPanel.style.display = window.isMaster ? "flex" : "none";
}, 1000);

// Novo Motor de Iniciativa do Mestre (Filtra só quem tá pronto!)
window.iniciarIniciativaVTT = function() {
    if(!window.isMaster) return;
    
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    let onGrid = Object.values(grid);
    
    // Filtra: Tem que estar no grid E com a chave vttReady ligada
    let participantes = onGrid.filter(n => window.usersGlobais[n] && window.usersGlobais[n].vttReady === true);
    
    // Se o Mestre apertou Pronto e está no Grid, ele luta também!
    if(participantes.length === 0) { 
        window.showNeonToast("Nenhum agente confirmou participação!"); 
        return; 
    }
    
    let ini = []; 
    participantes.forEach(n => { 
        let r = Math.floor(Math.random() * 20) + 1; 
        
        let agi = (window.usersGlobais[n]?.rpg?.agi || 1); 
        let buffs = window.calcularBuffsMoveis(window.usersGlobais[n]);
        let totalAgi = agi + (buffs.agi || 0);
        
        let sum = r + totalAgi; 
        ini.push({ n: n, v: sum }); 
        
        window.db.ref('tokyoRpg/mapDados').push({ 
            nome: "SISTEMA", 
            texto: `Iniciativa de ${n}: <span class="dice-result-box">${r}</span> + ${totalAgi} = <strong>${sum}</strong>` 
        });
    });
    
    ini.sort((a,b) => b.v - a.v); 
    window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}`).set({ ordem: ini.map(x => x.n), atual: 0 }); 
    window.showNeonToast("Turnos Definidos!");
};

// O Botão de Parada de Emergência do Mestre
window.pararCombateVTT = function() {
    if(!window.isMaster) return;
    if(confirm("Deseja realmente encerrar este combate e limpar a barra de iniciativa?")) {
        window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}`).remove().then(() => {
            window.showNeonToast("🛑 Combate Encerrado!");
            
            // Opcional: Desmarca todo mundo para o próximo combate começar zerado
            let updates = {};
            Object.keys(window.usersGlobais).forEach(u => {
                if(window.usersGlobais[u].vttReady) {
                    updates[`tokyoRpg/users/${u}/vttReady`] = false;
                }
            });
            window.db.ref().update(updates);
        });
    }
};

// BOTÃO PRO MESTRE ROUBAR A SKILL E TESTAR NO VTT (Infinito)
window.testarSkillMestre = function() {
    let payload = {
        nome: "🧪 " + document.getElementById("editSkillName").value.trim(), tipo: "Skill", desc: document.getElementById("editSkillDesc").value.trim(),
        eq: true, w: 0, h: 0, isVTT: true,
        wpnStyle: document.getElementById("editSkillShape").value, wpnRange: parseInt(document.getElementById("editSkillMaxRange").value)||1, 
        minRange: parseInt(document.getElementById("editSkillMinRange").value)||0, wpnDice: document.getElementById("editSkillDice").value.trim(), 
        wpnBonus: parseInt(document.getElementById("editSkillBonus").value)||0, wpnEffect: document.getElementById("editSkillStatus").value, 
        wpnEffectVal: parseInt(document.getElementById("editSkillStatusVal").value)||1, attr: document.getElementById("editSkillAttr").value, erCost: parseInt(document.getElementById("editSkillER").value)||0
    };
    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).push(payload).then(() => {
        window.showNeonToast("Skill injetada na mochila do Mestre!");
        document.getElementById("modalEditSkill").style.display = "none";
    });
};

window.abrirCategoriaJob = function(cat) {
    let container = document.getElementById("jobCardsContainer");
    container.innerHTML = "";
    
    let subjobs = window.categoriasTrabalho[cat];
    if(!subjobs) return;

    subjobs.forEach(sub => {
        // Formata o nome para buscar a imagem local (Ex: Pintor -> pintor.png)
        let imgName = sub.toLowerCase().replace(/ç/g, 'c').replace(/ /g, '_');
        
        // Cria a carta com um quadrado cinza de fundo caso a imagem ainda não exista
        container.innerHTML += `
            <div class="job-card" onclick="window.abrirArvoreJob('${sub}', '${cat}', true)">
                <div style="width: 100%; height: 180px; background: #1a1a1a; border-bottom: 2px solid #ff66b2; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                    
                    <span style="font-size: 40px; color: #444; position: absolute; z-index: 1;">💼</span>
                    
                    <img src="img/jobs/${imgName}.png" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2;" onerror="this.style.display='none'">
                    
                </div>
                <h3>${sub}</h3>
            </div>
        `;
    });
};

// =========================================================
// SINCRONIZAÇÃO VIVA DAS HABILIDADES PARA OS JOGADORES
// =========================================================
let jobSyncInterval = setInterval(() => {
    if(window.db) {
        clearInterval(jobSyncInterval);
        window.db.ref('tokyoRpg/jobConfig').on('value', s => { 
            window.jobConfigGlobais = s.val() || {}; 
            // Se o jogador estiver olhando a árvore na hora, atualiza pra ele!
            if(window.currentViewingJob) {
                let uJob = window.usersGlobais[window.jogadorAtual]?.job || {};
                window.abrirArvoreJob(window.currentViewingJob.subjob, window.currentViewingJob.cat, !uJob.locked); 
            }
        });
    }
}, 1000);

// =========================================================
// PODER DO MESTRE: APAGAR TOKENS DO TABULEIRO
// =========================================================
window.deletarTokenVTT = function(occupier, cid, e) {
    e.stopPropagation(); // Impede de clicar no chão sem querer
    e.preventDefault();
    
    if(!confirm(`Deseja remover [${occupier}] do tabuleiro? Se for uma invocação, ela será morta.`)) return;

    let updates = {};
    // 1. Tira do mapa
    updates[`tokyoRpg/submaps/${window.currentSubMapKey}/${cid}`] = null;

    // 2. Se for invocação, mata e tira da fila de turnos
    let occData = window.usersGlobais[occupier];
    if(occData && occData.isSummon) {
        updates[`tokyoRpg/users/${occupier}/status`] = "morto";
        if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem) {
             let novaOrdem = window.turnosVTTGlobal.ordem.filter(x => x !== occupier);
             updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/ordem`] = novaOrdem;
             // Ajusta o ponteiro do turno se necessário
             let prox = window.turnosVTTGlobal.atual;
             if(prox >= novaOrdem.length) prox = 0;
             updates[`tokyoRpg/turnosVTT/${window.currentSubMapKey}/atual`] = prox;
        }
    }

    window.db.ref().update(updates).then(() => {
        window.showNeonToast("🗑️ Alvo desintegrado pelo Mestre!");
        window.updateTacticalBoard();
    });
};

// =========================================================
// HUD TÁTICA: GERADOR DE MINI-GRID PARA O TOOLTIP
// =========================================================
window.gerarMiniGridHtml = function(shape) {
    let html = `<div style="display:grid; grid-template-columns: repeat(5, 8px); grid-template-rows: repeat(5, 8px); gap:1px; background:#0a0a0a; padding:4px; border-radius:4px; border:1px solid var(--accent-blue); width: fit-content; flex-shrink: 0; box-shadow: inset 0 0 5px #000;">`;
    
    for(let y=0; y<5; y++) {
        for(let x=0; x<5; x++) {
            let color = "#222"; // Fundo vazio
            let isHit = false;

            // LÓGICA DAS FORMAS (O alvo central fica no x=2, y=2)
            if(['Alvo', 'melee', 'ranged', 'heal', 'trap', 'summon', 'teleport'].includes(shape)) {
                if(x===2 && y===2) isHit = true;
            } else if(['cross', 'big_cross'].includes(shape)) {
                if((x===2 && y>0 && y<4) || (y===2 && x>0 && x<4)) isHit = true;
            } else if(shape === 'x_shape') {
                if(Math.abs(x-2) === Math.abs(y-2) && x>0 && x<4) isHit = true;
            } else if(['aoe', 'self_aoe'].includes(shape)) {
                if(Math.abs(x-2)<=1 && Math.abs(y-2)<=1) isHit = true;
            } else if(shape === 'cone') {
                if(y===2 && x===2) isHit = true;
                if(y===1 && x>=1 && x<=3) isHit = true;
                if(y===0) isHit = true;
            } else if(['line', 'alternating_line'].includes(shape)) {
                if(x===2 && y<=3) isHit = true;
            } else if(shape === 't_shape') {
                if(x===2 && y<=2) isHit = true;
                if(y===0 && x>=1 && x<=3) isHit = true;
            } else if(['self', 'self_buff'].includes(shape)) {
                if(x===2 && y===4) isHit = true; // Atinge a si mesmo
            }

            // PINTA O JOGADOR (AZUL) E OS ALVOS (VERMELHO OU VERDE)
            if(x===2 && y===4 && shape !== 'self_aoe') color = "#00e5ff"; // Onde o jogador está parado
            if(shape === 'self_aoe' && x===2 && y===2) color = "#00e5ff"; // No self_aoe o jogador é o centro
            
            if(isHit) {
                if(shape.includes('heal') || shape.includes('buff') || shape === 'self') color = "#00ff66"; // Cura é verde
                else color = "#ff1a55"; // Dano é Vermelho
            }

            html += `<div style="background:${color}; width:100%; height:100%; border-radius:1px;"></div>`;
        }
    }
    html += `</div>`;
    return html;
};

// =========================================================
// VACINA ANTI-BUG: FORÇAR A HUD TÁTICA A PULAR PRA FORA
// =========================================================
let estiloTooltip = document.createElement('style');
estiloTooltip.innerHTML = `
    .skill-node { 
        position: relative !important; 
        overflow: visible !important; /* ISSO PERMITE O BALÃO SAIR DA CAIXA! */
    }
    .skill-tooltip {
        display: none !important;
        position: absolute;
        bottom: 115%;
        left: 50%;
        transform: translateX(-50%);
        width: 330px;
        background: rgba(10, 10, 15, 0.98);
        border: 1px solid #00e5ff;
        border-radius: 8px;
        padding: 15px;
        z-index: 9999999 !important; /* Por cima de tudo na tela */
        box-shadow: 0 15px 35px rgba(0,0,0,0.95), 0 0 20px rgba(0, 229, 255, 0.4);
        text-align: left;
        pointer-events: none;
        flex-direction: column;
        gap: 10px;
    }
    .skill-node:hover .skill-tooltip {
        display: flex !important; /* Mágica de aparecer no mouse! */
        animation: fadeInTooltip 0.2s ease-in-out forwards;
    }
    .skill-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 8px;
        border-style: solid;
        border-color: #00e5ff transparent transparent transparent;
    }
    @keyframes fadeInTooltip {
        from { opacity: 0; transform: translate(-50%, 10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    .tbs-stats-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 6px; 
        width: 100%; 
    }
    .tbs-stats-grid span { 
        background: #000; 
        padding: 5px; 
        border: 1px dashed #333; 
        border-radius: 4px; 
        font-size: 10px; 
        color: #ccc; 
    }
    .tbs-stats-grid span strong { color: #fff; }
`;
document.head.appendChild(estiloTooltip);

// =========================================================
// NOVA HUD DE DETALHES DE HABILIDADE (TELA EXPANSÍVEL)
// (MODIFICADO PARA USAR ALCANCE E ÁREA DIRETAMENTE NO MINIGRID)
// =========================================================

// 1. INJETOR AUTOMÁTICO DO MODAL (Cria a tela sem precisar mexer no index.html)
if(!document.getElementById("modalSkillDetails")) {
    let divModal = document.createElement("div");
    divModal.id = "modalSkillDetails";
    divModal.className = "modal-overlay";
    divModal.style.zIndex = "100000";
    divModal.style.display = "none";
    // Clicar fora fecha a janela
    divModal.onclick = function(e) { if(e.target === this) window.fecharDetalhesSkill(); };
    
    divModal.innerHTML = `
        <div class="modal-content" style="border-color: var(--accent-blue); width: 95%; max-width: 450px; padding: 20px; position: relative; background: rgba(10,10,15,0.98); box-shadow: 0 0 40px rgba(0, 229, 255, 0.3);">
            <button onclick="window.fecharDetalhesSkill()" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; transition: 0.2s;">✖</button>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                <div id="detSkillIcon" style="width: 80px; height: 80px; background: #111; border: 2px solid var(--accent-blue); border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(0,229,255,0.3);"></div>
                <div style="flex: 1; text-align: left;">
                    <h2 id="detSkillName" style="color: var(--accent-blue); font-size: 22px; margin: 0 0 5px 0; text-transform: uppercase; text-shadow: 0 0 10px var(--accent-blue);">---</h2>
                    <div style="font-size: 14px; color: var(--accent-gold); font-weight: bold;">Custo: <span id="detSkillPT" style="font-size: 18px;">1</span> PT</div>
                    <div style="font-size: 12px; color: #00ff66; margin-top:2px;">Energia: <span id="detSkillER">0</span>%</div>
                </div>
            </div>

            <div id="detSkillDesc" style="font-size: 13px; color: #ccc; text-align: justify; margin-bottom: 15px; line-height: 1.5; min-height: 40px; border-bottom: 1px dashed #333; padding-bottom: 15px;">---</div>

            <div style="display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; border: 1px solid #222; margin-bottom: 20px;">
                <div id="detSkillGrid" style="flex-shrink: 0;"></div>
                <div style="flex: 1; font-size: 12px; color: #aaa; text-align: left; display: grid; grid-template-columns: 1fr; gap: 6px;">
                    <div>⚔️ Base: <strong id="detSkillBase" style="color:#fff;">---</strong></div>
                    <div>💠 Forma: <strong id="detSkillShapeLabel" style="color:var(--accent-blue); text-shadow: 0 0 5px var(--accent-blue);">---</strong></div>
                    <div>🎯 Alcance: <strong id="detSkillRange" style="color:#fff;">---</strong></div>
                    <div>🎲 Efeito: <strong id="detSkillEffect" style="color:var(--accent-red);">---</strong></div>
                    <div>☣️ Status: <strong id="detSkillStatus" style="color:#ffaa00;">---</strong></div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btnLearnSkill" class="action-btn" style="flex: 2; border-color: #00ff66; background: rgba(0,255,102,0.1); color: #00ff66; font-size: 16px; padding: 12px; font-weight: bold; margin: 0;" onclick="window.comprarHabilidadeSelecionada()">APRENDER</button>
                <button id="btnEditSkill" class="action-btn" style="flex: 1; border-color: #f00; color: #f00; font-size: 14px; display: none; margin: 0;" onclick="window.editarHabilidadeSelecionada()">⚙️ EDITAR</button>
            </div>
        </div>
    `;
    document.body.appendChild(divModal);
}

window.skillSelecionadaInfo = null;

// =========================================================
// NOVA HUD DE DETALHES DE HABILIDADE (TELA EXPANSÍVEL)
// (CORRIGIDO: RECONHECE O PULAR E AOE CORRETAMENTE)
// =========================================================

// 1. INJETOR AUTOMÁTICO DO MODAL (Cria a tela sem precisar mexer no index.html)
if(!document.getElementById("modalSkillDetails")) {
    let divModal = document.createElement("div");
    divModal.id = "modalSkillDetails";
    divModal.className = "modal-overlay";
    divModal.style.zIndex = "100000";
    divModal.style.display = "none";
    // Clicar fora fecha a janela
    divModal.onclick = function(e) { if(e.target === this) window.fecharDetalhesSkill(); };
    
    divModal.innerHTML = `
        <div class="modal-content" style="border-color: var(--accent-blue); width: 95%; max-width: 450px; padding: 20px; position: relative; background: rgba(10,10,15,0.98); box-shadow: 0 0 40px rgba(0, 229, 255, 0.3);">
            <button onclick="window.fecharDetalhesSkill()" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; transition: 0.2s;">✖</button>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                <div id="detSkillIcon" style="width: 80px; height: 80px; background: #111; border: 2px solid var(--accent-blue); border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: 0 0 15px rgba(0,229,255,0.3);"></div>
                <div style="flex: 1; text-align: left;">
                    <h2 id="detSkillName" style="color: var(--accent-blue); font-size: 22px; margin: 0 0 5px 0; text-transform: uppercase; text-shadow: 0 0 10px var(--accent-blue);">---</h2>
                    <div style="font-size: 14px; color: var(--accent-gold); font-weight: bold;">Custo: <span id="detSkillPT" style="font-size: 18px;">1</span> PT</div>
                    <div style="font-size: 12px; color: #00ff66; margin-top:2px;">Energia: <span id="detSkillER">0</span>%</div>
                </div>
            </div>

            <div id="detSkillDesc" style="font-size: 13px; color: #ccc; text-align: justify; margin-bottom: 15px; line-height: 1.5; min-height: 40px; border-bottom: 1px dashed #333; padding-bottom: 15px;">---</div>

            <div style="display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; border: 1px solid #222; margin-bottom: 20px;">
                <div id="detSkillGrid" style="flex-shrink: 0;"></div>
                <div style="flex: 1; font-size: 12px; color: #aaa; text-align: left; display: grid; grid-template-columns: 1fr; gap: 6px;">
                    <div>⚔️ Base: <strong id="detSkillBase" style="color:#fff;">---</strong></div>
                    <div>💠 Forma: <strong id="detSkillShapeLabel" style="color:var(--accent-blue); text-shadow: 0 0 5px var(--accent-blue);">---</strong></div>
                    <div>🎯 Alcance: <strong id="detSkillRange" style="color:#fff;">---</strong></div>
                    <div>🎲 Efeito: <strong id="detSkillEffect" style="color:var(--accent-red);">---</strong></div>
                    <div>☣️ Status: <strong id="detSkillStatus" style="color:#ffaa00;">---</strong></div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btnLearnSkill" class="action-btn" style="flex: 2; border-color: #00ff66; background: rgba(0,255,102,0.1); color: #00ff66; font-size: 16px; padding: 12px; font-weight: bold; margin: 0;" onclick="window.comprarHabilidadeSelecionada()">APRENDER</button>
                <button id="btnEditSkill" class="action-btn" style="flex: 1; border-color: #f00; color: #f00; font-size: 14px; display: none; margin: 0;" onclick="window.editarHabilidadeSelecionada()">⚙️ EDITAR</button>
            </div>
        </div>
    `;
    document.body.appendChild(divModal);
}

window.skillSelecionadaInfo = null;

// 2. O MOTOR VISUAL CORRIGIDO (Deve vir antes da função que o chama)
// =========================================================
// MOTOR VISUAL: DESENHA O MINI-GRID 5x5 DA HABILIDADE
// (CORRIGIDO: RECONHECE O PULAR E AOE CORRETAMENTE)
// =========================================================
window.gerarMiniGridHtml = function(shape, minRange, maxRange, aoe) {
    let html = `<div style="display:grid; grid-template-columns: repeat(5, 10px); grid-template-rows: repeat(5, 10px); gap:2px; background:#000; padding:6px; border-radius:6px; border:1px solid #333; flex-shrink:0;">`;
    
    // O JOGADOR ESTÁ SEMPRE EM (2, 4) (Meio da linha inferior) para habilidades direcionadas para frente
    const playerX = 2;
    const playerY = 4;
    
    // O ALVO CENTRAL ESTÁ À DISTÂNCIA DO MAXRANGE À FRENTE DO JOGADOR
    const targetY = Math.max(0, playerY - maxRange);
    const targetX = 2;

    for(let y=0; y<5; y++) {
        for(let x=0; x<5; x++) {
            let color = "#1a1a1a"; // Fundo vazio

            // Distância para o jogador (direção)
            const distY_p = playerY - y;
            const distX_p = Math.abs(playerX - x);

            // Distância para o centro do impacto (área radial ao redor do alvo central)
            const distY_t = Math.abs(targetY - y);
            const distX_t = Math.abs(targetX - x);

            // 1. ZONA DE ALCANCE (ZONA QUE O ATAQUE PULA OU ALCANÇA)
            // Se o quadrado está na linha central à frente do jogador e dentro do range
            if (distX_p === 0 && distY_p >= 1 && distY_p <= maxRange) {
                // Se a distância está DENTRO do que pula (marrom escuro)
                if (distY_p <= minRange) {
                    color = "#4c0019"; // Zona pulada ou alcançada (Marrom/Vermelho Escuro)
                } 
            }

            // 2. ÁREA DE IMPACTO (AOE)
            // Lógica radial baseada no AoE, centralizada no target central, respeitando o pulo.
            // (y < playerY garante que a explosão não vá para trás do jogador no minigrid)
            if (distY_t <= aoe && distX_t <= aoe && y < playerY) {
                
                // Impede AoE de explodir para dentro da zona de pular
                let canHit = true;
                if (distY_p <= minRange) canHit = false;

                if (canHit) {
                    color = "#ff1a55"; // Vermelho Vivo para zona de impacto
                }
            }

            // 3. TRATAMENTOS ESPECIAIS (FORMAS DIRECIONAIS E COLOCAÇÃO)
            // Lógica especial para 'line' (não usa AoE radial, mas segue a linha reta respeitando o pulo)
            if (shape === 'line' && distX_p === 0 && distY_p > minRange && distY_p <= maxRange) {
                color = "#ff1a55"; 
            }
            // Lógica especial para 'cone' ( हार्डकोडेड visual 5x5)
            else if (shape === 'cone') {
                if (y === 2 && x === 2 && distY_p > minRange) color = "#ff1a55";
                if (y === 1 && x >= 1 && x <= 3 && distY_p > minRange) color = "#ff1a55";
                if (y === 0 && x >= 0 && x <= 4 && distY_p > minRange) color = "#ff1a55";
            }
            // Lógica especial para 'trap', 'summon', 'teleport', 'Alvo' (Pinta apenas um quadrado vermelho vivo no target central)
            else if (['summon', 'trap', 'teleport', 'Alvo', 'melee', 'ranged'].includes(shape)) {
                color = "#1a1a1a"; // Reset
                if(x===targetX && y===targetY && distY_p > minRange) color = "#ff1a55";
            }
            // Lógica especial para 'self_aoe', 'self', 'self_buff' (O jogador é o centro da AoE/Cura)
            else if (['self_aoe', 'self', 'self_buff'].includes(shape)) {
                color = "#1a1a1a"; // Reset
                const distY_s = Math.abs(playerY - y);
                const distX_s = Math.abs(playerX - x);
                if (distY_s <= aoe && distX_s <= aoe) {
                    color = "#00ff66"; // Área de cura/buff pessoal
                }
            }

            // 4. CURA/BUFF (SOBRESCREVE VERMELHO POR VERDE)
            if(['self', 'self_buff', 'self_aoe', 'heal'].includes(shape) || (shape && shape.includes('heal')) || (shape && shape.includes('buff'))) {
                if (color === "#ff1a55") color = "#00ff66";
            }

            // 5. JOGADOR (AZUL) NO CENTRO DA TELA (SEMPRE ÚLTIMO)
            if(x===playerX && y===playerY) color = "#00e5ff"; 

            html += `<div style="background:${color}; width:100%; height:100%; border-radius:2px;"></div>`;
        }
    }
    html += `</div>`;
    return html;
};

// 3. FUNÇÃO QUE PREENCHE E ABRE A TELA DA HABILIDADE (CONSERVAÇÃO)
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    
    // Preenche os dados visuais
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    document.getElementById("detSkillDesc").innerText = sData.desc || "Habilidade ainda não forjada.";
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { 
        iconEl.style.backgroundImage = `url('${sData.img}')`; 
        iconEl.innerText = ""; 
    } else { 
        iconEl.style.backgroundImage = "none"; 
        iconEl.innerText = "✖"; 
        iconEl.style.display = "flex"; 
        iconEl.style.alignItems = "center"; 
        iconEl.style.justifyContent = "center"; 
        iconEl.style.color = "#555"; 
        iconEl.style.fontSize = "30px";
    }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    // TRADUTOR DE FORMAS PARA O DISPLAY NOVO!
    let shapeNames = {
        'self': '💖 Em Si Mesmo',
        'Alvo': '🎯 Alvo Único',
        'melee': '⚔️ Corpo-a-Corpo',
        'ranged': '🏹 À Distância',
        'heal': '💊 Cura/Buff',
        'cross': '➕ Cruz Padrão',
        'big_cross': '🕂 Cruz Grande',
        'line': '📏 Linha Perfurante',
        'alternating_line': '➖ Linha Alternada',
        'x_shape': '❌ Diagonais',
        'cone': '🍕 Cone Frontal',
        'aoe': '💥 Quadrado (AoE)',
        'self_aoe': '🌪️ Aura (Ao Redor)',
        'trap': '🕸️ Armadilha (Chão)',
        'summon': '🐺 Invocação',
        'teleport': '🌀 Teleporte',
        't_shape': '┳ Formato T',
        'self_buff': '🌟 Buff Pessoal'
    };
    document.getElementById("detSkillShapeLabel").innerText = shapeNames[sData.shape || "Alvo"] || "🎯 Alvo Único";
    
    let rangeTxt = "";
    if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `;
    if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`;
    if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    document.getElementById("detSkillRange").innerText = rangeTxt || "Corpo-a-corpo";

    let dmgVal = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    document.getElementById("detSkillEffect").innerText = dmgVal.trim() !== "" ? dmgVal : "Nenhum";
    document.getElementById("detSkillStatus").innerText = sData.status ? `${sData.status} (${sData.statusVal || 1})` : "Nenhum";

    // AGORA SIM: Gera o Minitabuleiro chamando com os parâmetros corretos!
    if(window.gerarMiniGridHtml) {
        document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.shape || "Alvo", sData.minRange || 0, sData.maxRange || 1, sData.aoe || 0);
    }

    let btnEdit = document.getElementById("btnEditSkill");
    let btnLearn = document.getElementById("btnLearnSkill");
    
    // Mestre tem o botão de atalho para a forja
    if(window.isMaster) {
        btnEdit.style.display = "block";
    } else {
        btnEdit.style.display = "none";
    }

    // Lógica do Botão Aprender
    let u = window.usersGlobais[window.jogadorAtual] || {};
    let uJob = u.job || {};
    let unlockedSkills = uJob.skills || [];
    
    if (!sData.nome || sData.nome === "Vazio") {
        btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA";
    } else if (unlockedSkills.includes(skillId)) {
        btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA";
    } else {
        btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER";
    }

    // Abre a tela!
    document.getElementById("modalSkillDetails").style.display = "flex";
};

// Funções de clique dos botões da HUD
window.fecharDetalhesSkill = function() {
    document.getElementById("modalSkillDetails").style.display = "none";
};

window.editarHabilidadeSelecionada = function() {
    window.fecharDetalhesSkill();
    window.clicarHabilidade(window.skillSelecionadaInfo.id); 
};

window.comprarHabilidadeSelecionada = function() {
    window.fecharDetalhesSkill();
    window.clicarHabilidade(window.skillSelecionadaInfo.id); 
};

// 3. A NOVA ATUALIZAÇÃO DA ÁRVORE (Substitui a velha por completo!)
// =========================================================
// ABRIR ÁRVORE (AGORA COM DROPDOWN DE TROCA RÁPIDA PRO MESTRE)
// =========================================================
window.abrirArvoreJob = function(subjob, cat, isPreview) {
    window.currentViewingJob = { subjob: subjob, cat: cat };
    
    document.getElementById("jobSelectionScreen").style.display = "none";
    document.getElementById("jobTreeScreen").style.display = "flex";
    
    let titleEl = document.getElementById("jobTreeTitle");

    // MÁGICA: Se for Mestre, o título vira um Select pra trocar de classe na hora!
    if (window.isMaster) {
        let selHtml = `<select onchange="let v=this.value.split('|'); window.abrirArvoreJob(v[1], v[0], true)" style="background:#000; color:var(--accent-blue); border:1px solid var(--accent-blue); padding:5px 10px; border-radius:4px; font-weight:bold; font-size:16px; outline:none; cursor:pointer;">`;
        Object.keys(window.categoriasTrabalho).forEach(c => {
            selHtml += `<optgroup label="--- ${c.toUpperCase()} ---">`;
            window.categoriasTrabalho[c].forEach(s => {
                let selected = (s === subjob) ? "selected" : "";
                selHtml += `<option value="${c}|${s}" ${selected}>${s.toUpperCase()}</option>`;
            });
            selHtml += `</optgroup>`;
        });
        selHtml += `</select>`;
        titleEl.innerHTML = selHtml;
    } else {
        // Se for jogador normal, só mostra o nome mesmo
        titleEl.innerText = subjob.toUpperCase();
    }

    let u = window.usersGlobais[window.jogadorAtual] || {};
    let uJob = u.job || {};
    
    if(uJob.locked && uJob.subjob === subjob && !window.isMaster) {
        document.getElementById("btnVoltarJob").style.display = "none";
        document.getElementById("jobLockWarning").style.display = "none";
    } else {
        document.getElementById("btnVoltarJob").style.display = "block";
        document.getElementById("jobLockWarning").style.display = "block";
    }

    let treeData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][subjob]) ? window.jobConfigGlobais[cat][subjob] : {};
    let unlockedSkills = (uJob.locked && uJob.subjob === subjob) ? (uJob.skills || []) : [];

    let nodeIds = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','u1','u2','u3'];

    nodeIds.forEach(id => {
        let nodeEl = document.getElementById(`node_${id}`);
        let sData = treeData[id] || { nome: "Vazio", desc: "Habilidade não configurada", pt: 1 };
        
        nodeEl.className = "skill-node" + (id.startsWith('u') ? " ultimate" : "");
        
        let displayName = "";
        if(sData.img && sData.img.trim() !== "") {
            nodeEl.style.backgroundImage = `url('${sData.img}')`;
        } else {
            nodeEl.style.backgroundImage = "none";
            displayName = (sData.nome || "Vazio").substring(0, 10);
        }

        nodeEl.innerHTML = `<span style="text-shadow: 0 0 5px #000, 0 0 5px #000; pointer-events:none; position:relative; z-index:5;">${displayName}</span>`;
        nodeEl.onclick = () => window.abrirDetalhesSkill(id, sData);

        if (unlockedSkills.includes(id)) { nodeEl.classList.add("unlocked"); } 
        else if (uJob.locked && uJob.subjob === subjob) { nodeEl.classList.add("available"); } 
        else if (isPreview) { nodeEl.classList.add("available"); }
    });
};

// =========================================================
// PAINEL DE TESTE RÁPIDO DE CLASSES NO VTT (EXCLUSIVO DO MESTRE)
// =========================================================

// 1. Injetor Automático do Menu na barra do Mestre
setInterval(() => {
    if(!window.isMaster) return;
    let painelMestre = document.getElementById("mestreVTT");
    
    // Se o painel do Mestre está na tela e ainda não tem o menu de testes, ele cria:
    if(painelMestre && painelMestre.style.display !== "none" && !document.getElementById("masterClassTestWrapper")) {
        let w = document.createElement("div");
        w.id = "masterClassTestWrapper";
        w.style.display = "flex";
        w.style.alignItems = "center";
        w.style.gap = "5px";
        w.style.marginLeft = "10px";
        w.style.borderLeft = "1px dashed var(--accent-purple)";
        w.style.paddingLeft = "10px";

        let selHtml = `<span style="font-size:10px; color:#00ff66; font-weight:bold;">🎭 MUDAR CLASSE:</span>
        <select id="masterTestClassSelect" onchange="window.mudarClasseMestreVTT(this.value)" style="background:#000; color:#00ff66; border:1px solid #00ff66; padding:2px; font-size:10px; border-radius:4px; max-width: 110px; cursor:pointer; outline:none;">
            <option value="">Selecione...</option>`;
        
        if(window.categoriasTrabalho) {
            Object.keys(window.categoriasTrabalho).forEach(c => {
                selHtml += `<optgroup label="--- ${c.toUpperCase()} ---">`;
                window.categoriasTrabalho[c].forEach(s => {
                    selHtml += `<option value="${c}|${s}">${s}</option>`;
                });
                selHtml += `</optgroup>`;
            });
        }
        
        selHtml += `</select>
        <button class="action-btn" style="border-color:#f00; color:#f00; padding: 2px 6px; font-size:10px; margin:0;" onclick="window.limparMochilaMestre()" title="Apagar todas as skills de teste">🗑️ Limpar</button>`;
        
        w.innerHTML = selHtml;
        painelMestre.appendChild(w);
    }
}, 1500);

// 2. Função para o Mestre limpar a própria barra de ataque
window.limparMochilaMestre = function() {
    if(!window.isMaster) return;
    if(confirm("Deseja apagar TODAS as habilidades e itens da sua mochila de testes?")) {
        window.db.ref(`tokyoRpg/users/MESTRE/mochila`).remove().then(() => {
            window.showNeonToast("🗑️ Mochila de Testes esvaziada!");
            // Fecha a barra de ataque se ela estiver aberta pra limpar a tela
            let btnCnc = document.getElementById("btnCancelAtk");
            if(btnCnc && btnCnc.style.display !== "none") window.cancelarAtaqueVTT();
        });
    }
};

// 3. Função que puxa todas as magias da classe escolhida pra mochila na hora!
window.mudarClasseMestreVTT = function(val) {
    if(!val || !window.isMaster) return;
    let parts = val.split("|"); let cat = parts[0]; let sub = parts[1];
    let skills = window.jobConfigGlobais[cat]?.[sub] || {};
    let novaMochila = {}; let count = 0;
    
    Object.keys(skills).forEach(k => {
        let s = skills[k];
        if(s.nome && s.nome !== "Vazio") {
            count++;
            let pushId = "teste_" + k; 
            
            // Puxa o range direto do JSON se existir!
            let mRange = s.maxRange || 4;
            if(s.customPattern && s.customPattern.startsWith("{")) {
                try { let pat = JSON.parse(s.customPattern); if(pat.maxRange) mRange = pat.maxRange; } catch(e){}
            }

            novaMochila[pushId] = {
                nome: "🧪 " + s.nome, tipo: "Skill", desc: s.desc,
                eq: true, w: 0, h: 0, isVTT: true,
                wpnRange: mRange, minRange: s.minRange || 0, 
                customPattern: s.customPattern || "", // O JSON VEM PRA MOCHILA AQUI!
                wpnDice: s.dice || "1d4", wpnBonus: s.bonus || 0, attr: s.attr || "int", erCost: s.er || 0,
            };
        }
    });
    
    if (count === 0) {
        window.showNeonToast(`A classe ${sub} ainda não tem habilidades forjadas!`);
        document.getElementById("masterTestClassSelect").value = ""; return;
    }

    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).set(novaMochila).then(() => {
        window.showNeonToast(`✅ ${count} Habilidades carregadas no VTT!`);
        document.getElementById("masterTestClassSelect").value = ""; 
        let btnCnc = document.getElementById("btnCancelAtk");
        if(btnCnc && btnCnc.style.display !== "none") window.cancelarAtaqueVTT();
    });
};

// =========================================================
// 1. ABRIR O MODAL DA FORJA (MESTRE) OU COMPRAR (JOGADOR)
// =========================================================
window.salvarEdicaoMestre = function() {
    try {
        if(!window.isMaster || !window.currentViewingJob) return;

        let skillId = document.getElementById("editSkillId").value;
        let cat = window.currentViewingJob.cat; 
        let sub = window.currentViewingJob.subjob;
        
        let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
        let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

        let payload = {
            nome: getVal("editSkillName", "").trim() || "Nova Habilidade", img: getVal("editSkillImg", "").trim() || "", desc: getVal("editSkillDesc", "").trim() || "Sem descrição.",
            pt: getInt("editSkillPT", 1), er: getInt("editSkillER", 0), attr: getVal("editSkillAttr", "int"),
            minRange: getInt("editSkillMinRange", 0), maxRange: getInt("editSkillMaxRange", 1), aoe: getInt("editSkillAoE", 0),
            shape: getVal("editSkillShape", "Alvo"), 
            customPattern: getVal("editSkillCustomPattern", ""), // AQUI VAI A ARTE
            dice: getVal("editSkillDice", "").trim() || "", bonus: getInt("editSkillBonus", 0),
            status: getVal("editSkillStatus", ""), statusVal: getInt("editSkillStatusVal", 1), statusTurnos: getInt("editSkillStatusTurnos", 1)
        };

        if(payload.shape === "summon") {
            payload.summonHP = getInt("editSkillSummonHP", 50); payload.summonTurnos = getInt("editSkillSummonTurnos", 3); payload.summonLimit = getInt("editSkillSummonLimit", 1);
        }

        if(!window.jobConfigGlobais[cat]) window.jobConfigGlobais[cat] = {};
        if(!window.jobConfigGlobais[cat][sub]) window.jobConfigGlobais[cat][sub] = {};
        window.jobConfigGlobais[cat][sub][skillId] = payload;

        let updates = {};
        updates[`tokyoRpg/jobConfig/${cat}/${sub}/${skillId}`] = payload;

        // A MÁGICA: Varre todos os usuários e atualiza as magias que já estão na mochila!
        window.db.ref('tokyoRpg/users').once('value').then(snap => {
            let usrs = snap.val(); 
            if(usrs) { 
                Object.keys(usrs).forEach(uKey => { 
                    let inv = usrs[uKey].mochila; 
                    if(inv) { 
                        Object.keys(inv).forEach(mKey => { 
                            // Verifica se é a mesma skill pelo nome limpo (ignorando o brilho "✨ " ou o "🧪 ")
                            let nomeMochila = (inv[mKey].nome || "").replace("✨ ", "").replace("🧪 ", "").trim();
                            let nomePayload = payload.nome.trim();
                            
                            if(nomeMochila === nomePayload) { 
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/customPattern`] = payload.customPattern;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnStyle`] = payload.shape;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnRange`] = payload.maxRange;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/minRange`] = payload.minRange;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/aoe`] = payload.aoe;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnEffect`] = payload.status;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnEffectVal`] = payload.statusVal;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/wpnEffectTurnos`] = payload.statusTurnos;
                                updates[`tokyoRpg/users/${uKey}/mochila/${mKey}/desc`] = payload.desc;
                            } 
                        }); 
                    } 
                }); 
            }
            
            window.db.ref().update(updates).then(() => {
                window.showNeonToast("Habilidade Forjada e Mochilas Atualizadas!"); 
                let modal = document.getElementById("modalEditSkill"); if(modal) modal.style.display = "none";
                window.abrirArvoreJob(sub, cat, true);
                
                // Se a barra de ataque do VTT estiver aberta, recarrega pra pegar o desenho novo!
                if(window.currentSubMapKey && document.getElementById("wpnSelectDiv") && document.getElementById("wpnSelectDiv").style.display === "flex") {
                    window.iniciarAtaqueVTT();
                }
            });
        });

    } catch (err) { window.showNeonToast("Erro ao salvar."); console.error(err); }
};

// =========================================================
// 2. SALVAR AS CONFIGURAÇÕES NA FORJA (SEGURO E BLINDADO)
// =========================================================
window.salvarEdicaoMestre = function() {
    try {
        if(!window.isMaster || !window.currentViewingJob) return;

        let skillId = document.getElementById("editSkillId").value;
        let cat = window.currentViewingJob.cat; 
        let sub = window.currentViewingJob.subjob;
        
        let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
        let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

        let payload = {
            nome: getVal("editSkillName", "").trim() || "Nova Habilidade",
            img: getVal("editSkillImg", "").trim() || "",
            desc: getVal("editSkillDesc", "").trim() || "Sem descrição.",
            pt: getInt("editSkillPT", 1),
            er: getInt("editSkillER", 0),
            attr: getVal("editSkillAttr", "int"),
            minRange: getInt("editSkillMinRange", 0),
            maxRange: getInt("editSkillMaxRange", 1),
            aoe: getInt("editSkillAoE", 0),
            shape: getVal("editSkillShape", "Alvo"),
            customPattern: getVal("editSkillCustomPattern", ""),
            dice: getVal("editSkillDice", "").trim() || "1d4",
            bonus: getInt("editSkillBonus", 0),
            status: getVal("editSkillStatus", ""),
            statusVal: getInt("editSkillStatusVal", 1),
            statusTurnos: getInt("editSkillStatusTurnos", 1)
        };

        if(payload.shape === "summon") {
            payload.summonHP = getInt("editSkillSummonHP", 50);
            payload.summonTurnos = getInt("editSkillSummonTurnos", 3);
            payload.summonLimit = getInt("editSkillSummonLimit", 1);
        }

        window.db.ref(`tokyoRpg/jobConfig/${cat}/${sub}/${skillId}`).set(payload).then(() => {
            window.showNeonToast("Node Forjado e Salvo no Banco!"); 
            let modal = document.getElementById("modalEditSkill");
            if(modal) modal.style.display = "none";
        });

    } catch (err) { window.showNeonToast("Erro ao salvar."); console.error(err); }
};

// =========================================================
// 3. EQUIPAR TESTE PARA O MESTRE (SEGURO)
// =========================================================
window.testarSkillMestre = function() {
    let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
    let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

    let payload = {
        nome: "🧪 " + (getVal("editSkillName", "").trim() || "Teste"), 
        tipo: "Skill", desc: getVal("editSkillDesc", "").trim(),
        eq: true, w: 0, h: 0, isVTT: true,
        wpnStyle: getVal("editSkillShape", "Alvo"), 
        customPattern: getVal("editSkillCustomPattern", ""),
        wpnRange: getInt("editSkillMaxRange", 1), 
        minRange: getInt("editSkillMinRange", 0), 
        aoe: getInt("editSkillAoE", 0),
        wpnDice: getVal("editSkillDice", "").trim() || "1d4", 
        wpnBonus: getInt("editSkillBonus", 0), 
        wpnEffect: getVal("editSkillStatus", ""), 
        wpnEffectVal: getInt("editSkillStatusVal", 1), 
        wpnEffectTurnos: getInt("editSkillStatusTurnos", 1), 
        attr: getVal("editSkillAttr", "int"), 
        erCost: getInt("editSkillER", 0)
    };

    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).push(payload).then(() => { 
        window.showNeonToast("Skill injetada na mochila do Mestre!"); 
        let modal = document.getElementById("modalEditSkill");
        if(modal) modal.style.display = "none"; 
    });
};

// =========================================================
// O SUPER MOTOR DO PINTOR, COMBATE VTT E FORJA (V. DEFINITIVA 2.0)
// =========================================================

// 1. INJETA O 'X' E O CLIQUE FORA NA FORJA DE HABILIDADE
setTimeout(() => {
    let modalE = document.getElementById("modalEditSkill");
    if (modalE) {
        modalE.onclick = function(e) { if(e.target === this) this.style.display = 'none'; };
        let content = modalE.querySelector(".modal-content");
        if (content && !document.getElementById("closeModalEditSkillBtn")) {
            content.style.position = "relative";
            let btn = document.createElement("button");
            btn.id = "closeModalEditSkillBtn"; btn.innerHTML = "✖";
            btn.style.cssText = "position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer; transition: 0.2s; z-index: 100;";
            btn.onclick = (e) => { e.preventDefault(); modalE.style.display = "none"; };
            content.appendChild(btn);
        }
    }
}, 1000);

// 2. DICIONÁRIO DE EMOJIS E TRADUTOR DA ARTE PARA O HUD
window.effectEmojis = {
    "Nenhum": "", "Queimadura": "🔥", "Veneno": "🧪", "Sangramento": "🩸", "Corrupcao": "🌌", "Maldicao": "☠️", "Infeccao": "🦠", "Acido": "🧪", "Decadencia": "🥀", "ChoqueEletrico": "⚡", "CongelamentoInterno": "❄️", "Hemorragia": "🩸", "Necrose": "💀", "Atordoamento": "💫", "Congelado": "🧊", "Paralisia": "⚡", "Silencio": "🤐", "Desarmado": "❌", "Cego": "👁️", "Confusao": "😵‍💫", "Medo": "😱", "Provocacao": "🤬", "Enraizado": "⚓", "Petrificacao": "🗿", "Sono": "💤", "Hipnose": "🌀", "Aprisionamento": "⛓️", "LentidaoExtrema": "🐢", "Regeneracao": "💚", "RegeneracaoMana": "💙", "Escudo": "🛡️", "Reflexao": "🪞", "Imunidade": "🌟", "Invisibilidade": "👻", "Empurrão": "🫸", "Puxão": "🪝", "Troca": "🔄", "Derrubado": "📉", "Teleporte": "🌀",
    "Marcado": "🎯", "TrocaMarcada": "🔀" // NOVOS EFEITOS AQUI!
};

window.parseCustomPatternDesc = function(pattern) {
    if (!pattern || !pattern.trim() || !pattern.includes(":")) return { types: "", effects: "" };
    let blocks = pattern.split(":")[1].split("|");
    let uniqueTypes = new Set(); let uniqueEffects = new Set();
    let typeNames = { 'd': '💥 Dano', 'c': '💚 Cura', 'i': '🐺 Invocação', 't': '🕸️ Armadilha', 'tp': '🌀 Teleporte' };

    blocks.forEach(b => {
        if(!b) return; let [x, y, t, e, v, tr] = b.split(",");
        if (typeNames[t]) uniqueTypes.add(typeNames[t]);
        if (e && e !== "Nenhum") uniqueEffects.add(`${window.effectEmojis[e]||''}${e} (${v}F|${tr}t)`);
    });
    return { types: Array.from(uniqueTypes).join(" | "), effects: Array.from(uniqueEffects).join(" | ") };
};

// 3. CONSTRUTOR DO MINIGRID 
window.gerarMiniGridHtml = function(shape, minRange, maxRange, aoe, customPattern) {
    if (customPattern && customPattern.trim() !== "") {
        let html = `<div style="display:grid; grid-template-columns: repeat(11, 7px); grid-template-rows: repeat(11, 7px); gap:1px; background:#000; padding:4px; border-radius:6px; border:1px solid #b000ff; flex-shrink:0; box-shadow: 0 0 10px rgba(176,0,255,0.2);">`;
        let parts = customPattern.split(":"); let mode = parts[0]; let blocks = parts[1] ? parts[1].split("|") : [];
        let px = 5; let py = mode === "F" ? 10 : 5;
        let paintMap = {}; blocks.forEach(b => { if(!b) return; let [x, y, t, e] = b.split(","); paintMap[`${px + parseInt(x)}_${py + parseInt(y)}`] = {t, e}; });

        for(let y=0; y<11; y++) {
            for(let x=0; x<11; x++) {
                let color = "#1a1a1a"; let emoji = "";
                if (x === px && y === py) { 
                    color = mode === "A" ? "#ffaa00" : "#00e5ff"; // Se for Alvo, o centro é Dourado, se for Player é Azul
                    emoji = mode === "A" ? "🎯" : "🧍"; 
                }
                else if (paintMap[`${x}_${y}`]) {
                    let d = paintMap[`${x}_${y}`];
                    if(d.t==='d') color = "#ff1a55"; else if(d.t==='c') color = "#00ff66"; else if(d.t==='i') color = "#0066ff"; else if(d.t==='t') color = "#006600"; else if(d.t==='tp') color = "#b000ff";
                    emoji = window.effectEmojis[d.e] || "";
                }
                html += `<div style="background:${color}; width:100%; height:100%; border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:6px;">${emoji}</div>`;
            }
        }
        return html + `</div>`;
    }
    
    // BACKUP: A matemática padrão 5x5 se a skill não tiver desenho
    minRange = parseInt(minRange) || 0; maxRange = parseInt(maxRange) || 1; aoe = parseInt(aoe) || 0; shape = shape || "Alvo";
    let html = `<div style="display:grid; grid-template-columns: repeat(5, 10px); grid-template-rows: repeat(5, 10px); gap:2px; background:#000; padding:6px; border-radius:6px; border:1px solid #333; flex-shrink:0;">`;
    let isSelfCentered = ['self', 'self_buff', 'self_aoe'].includes(shape); let isAoEShape = ['cross', 'big_cross', 'x_shape', 'aoe', 'trap', 'summon', 'Alvo', 'heal'].includes(shape);
    const px = 2; const py = isSelfCentered ? 2 : 4; const tx = 2; let ty = 1; 
    if (isSelfCentered) { ty = py; } else if (isAoEShape) { ty = 2; } else { ty = Math.max(0, py - maxRange); }

    for(let y=0; y<5; y++) {
        for(let x=0; x<5; x++) {
            let color = "#1a1a1a"; let isHit = false; let isPath = false; let hitType = null; 
            const dy = py - y; const dx = Math.abs(px - x); const dTy = Math.abs(ty - y); const dTx = Math.abs(tx - x); 
            if (!isSelfCentered && dx === 0 && dy > 0 && dy <= maxRange) isPath = true;

            if (shape === 'self' || shape === 'self_buff') { if (x === px && y === py) { isHit = true; hitType = 'cura'; } }
            else if (shape === 'self_aoe') { if (dx <= aoe && Math.abs(py - y) <= aoe) { isHit = true; hitType = 'dano'; } } 
            else if (shape === 'line' || shape === 'alternating_line') { if (dx === 0 && dy > 0 && dy <= maxRange) { if (shape === 'alternating_line' && dy % 2 === 0) { } else { isHit = true; hitType = 'dano'; } } } 
            else if (shape === 'cross' || shape === 'big_cross') { if ((dTx === 0 && dTy <= aoe) || (dTy === 0 && dTx <= aoe)) { isHit = true; hitType = 'dano'; } } 
            else if (shape === 'x_shape') { if (dTx === dTy && dTx <= aoe && dTx > 0) { isHit = true; hitType = 'dano'; } if (x === tx && y === ty) { isHit = true; hitType = 'dano'; } } 
            else if (shape === 'cone') { if (y === ty && x === tx) { isHit = true; hitType = 'dano'; } if (y === ty + 1 && dx <= 1) { isHit = true; hitType = 'dano'; } if (y === ty + 2 && dx <= 2) { isHit = true; hitType = 'dano'; } } 
            else if (shape === 'summon') { if (x === tx && y === ty) { isHit = true; hitType = 'invocacao'; } }
            else if (shape === 'trap') { if (x === tx && y === ty) { isHit = true; hitType = 'armadilha'; } }
            else { if (aoe === 0) { if (x === tx && y === ty) { isHit = true; hitType = 'dano'; } } else { if (dTx <= aoe && dTy <= aoe) { isHit = true; hitType = 'dano'; } } }

            if (!isSelfCentered && isHit) { if (dy > 0 && dy <= minRange) { isHit = false; } }
            if (isPath && !isHit && dy <= minRange && dy > 0) color = "#4c0019"; 
            if (isHit) { color = hitType === 'cura' ? "#00ff66" : (hitType === 'invocacao' ? "#0066ff" : (hitType === 'armadilha' ? "#006600" : "#ff1a55")); }
            if(['self', 'self_buff', 'self_aoe', 'heal'].includes(shape) || (shape && shape.includes('heal')) || (shape && shape.includes('buff'))) { if (color === "#ff1a55") color = "#00ff66"; }
            if (x === px && y === py) color = "#00e5ff"; 
            html += `<div style="background:${color}; width:100%; height:100%; border-radius:2px;"></div>`;
        }
    }
    return html + `</div>`;
};

// 4. ATUALIZAR JANELONA DE DETALHES COM O TRADUTOR
window.abrirDetalhesSkill = function(skillId, sData) {
    window.skillSelecionadaInfo = { id: skillId, data: sData };
    document.getElementById("detSkillName").innerText = sData.nome || "Vazio";
    document.getElementById("detSkillPT").innerText = sData.pt || 1;
    document.getElementById("detSkillER").innerText = sData.er || 0;
    
    let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
    document.getElementById("detSkillDesc").innerText = sData.desc || "Habilidade ainda não forjada.";
    
    let iconEl = document.getElementById("detSkillIcon");
    if(sData.img && sData.img.trim() !== "") { iconEl.style.backgroundImage = `url('${sData.img}')`; iconEl.innerText = ""; } 
    else { iconEl.style.backgroundImage = "none"; iconEl.innerText = "✖"; iconEl.style.display = "flex"; iconEl.style.alignItems = "center"; iconEl.style.justifyContent = "center"; iconEl.style.color = "#555"; iconEl.style.fontSize = "30px"; }

    let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };
    document.getElementById("detSkillBase").innerText = attrNames[sData.attr] || "Mágico";
    
    let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);
    
    // Mostra se o desenho é Direcional (F), Aura (S) ou Ranged AoE (A)
    let drawType = "🖌️ Desenho Custom";
    if(isCustom) {
        if(sData.customPattern.startsWith("A")) drawType = "🎯 Disparo em Área (Desenho)";
        if(sData.customPattern.startsWith("F")) drawType = "⬆️ Direcional/Reta (Desenho)";
        if(sData.customPattern.startsWith("S")) drawType = "🔄 Aura Pessoal (Desenho)";
    }
    document.getElementById("detSkillShapeLabel").innerText = isCustom ? drawType : (sData.shape || "🎯 Alvo Único");
    
    let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`; if (sData.aoe > 0) rangeTxt += ` (Área: ${sData.aoe})`;
    document.getElementById("detSkillRange").innerText = isCustom ? (sData.customPattern.startsWith("A") ? `Distância do Tiro: ${sData.maxRange}` : "Livre (Ao Redor)") : (rangeTxt || "Corpo-a-corpo");

    let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
    let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
    document.getElementById("detSkillEffect").innerHTML = `<span style="color:#fff;">${diceTxt}</span><br><span style="color:var(--accent-red); font-size:10px;">${actionTxt}</span>`;
    
    let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
    if(!isCustom && sData.status && sData.status !== "") statusText = `${sData.status} (${sData.statusVal || 1})`;
    document.getElementById("detSkillStatus").innerHTML = statusText;

    if(window.gerarMiniGridHtml) { document.getElementById("detSkillGrid").innerHTML = window.gerarMiniGridHtml(sData.shape, sData.minRange, sData.maxRange, sData.aoe, sData.customPattern); }

    let btnEdit = document.getElementById("btnEditSkill"); let btnLearn = document.getElementById("btnLearnSkill");
    if(window.isMaster) { btnEdit.style.display = "block"; } else { btnEdit.style.display = "none"; }
    let u = window.usersGlobais[window.jogadorAtual] || {}; let unlockedSkills = u.job?.skills || [];
    if (!sData.nome || sData.nome === "Vazio") { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "NÃO FORJADA"; } else if (unlockedSkills.includes(skillId)) { btnLearn.disabled = true; btnLearn.style.opacity = "0.3"; btnLearn.innerText = "JÁ APRENDIDA"; } else { btnLearn.disabled = false; btnLearn.style.opacity = "1"; btnLearn.innerText = "APRENDER"; }

    document.getElementById("modalSkillDetails").style.display = "flex";
};

// 5. BALÃOZINHO DA ÁRVORE (TOOLTIP)
window.abrirArvoreJob = function(subjob, cat, isPreview) {
    window.currentViewingJob = { subjob: subjob, cat: cat };
    document.getElementById("jobSelectionScreen").style.display = "none"; document.getElementById("jobTreeScreen").style.display = "flex"; document.getElementById("jobTreeTitle").innerText = subjob.toUpperCase();

    let u = window.usersGlobais[window.jogadorAtual] || {}; let uJob = u.job || {};
    if(uJob.locked && uJob.subjob === subjob && !window.isMaster) { document.getElementById("btnVoltarJob").style.display = "none"; document.getElementById("jobLockWarning").style.display = "none"; } 
    else { document.getElementById("btnVoltarJob").style.display = "block"; document.getElementById("jobLockWarning").style.display = "block"; }

    let treeData = (window.jobConfigGlobais[cat] && window.jobConfigGlobais[cat][subjob]) ? window.jobConfigGlobais[cat][subjob] : {};
    let unlockedSkills = (uJob.locked && uJob.subjob === subjob) ? (uJob.skills || []) : [];
    let nodeIds = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','u1','u2','u3']; let attrNames = { 'for': '💪 Força', 'agi': '⚡ Agilidade', 'int': '🧠 Inteligência', 'vig': '🛡️ Vigor', 'man': '🎯 Manuseio' };

    nodeIds.forEach(id => {
        let nodeEl = document.getElementById(`node_${id}`); let tipEl = document.getElementById(`tip_${id}`);
        let sData = treeData[id] || { nome: "Vazio", desc: "Não configurada", pt: 1 };
        nodeEl.className = "skill-node" + (id.startsWith('u') ? " ultimate" : "");
        
        nodeEl.onclick = function(e) { e.preventDefault(); e.stopPropagation(); window.abrirDetalhesSkill(id, sData); };

        if(sData.img && sData.img.trim() !== "") { nodeEl.style.backgroundImage = `url('${sData.img}')`; nodeEl.innerText = ""; } 
        else { nodeEl.style.backgroundImage = "none"; nodeEl.innerText = (sData.nome || "Vazio").substring(0, 10); }

        let htmlTip = `<div class="skill-tooltip-title">${sData.nome}</div><div class="skill-tooltip-desc">${sData.desc}</div>`;
        if (sData.nome && sData.nome !== "Vazio") {
            htmlTip += `<div class="tbs-stats-grid"><span>⭐ PT: <strong>${sData.pt || 1}</strong></span>`;
            if(sData.er) htmlTip += `<span>⚡ ER: <strong style="color:#00ff66;">${sData.er}</strong></span>`;
            let nAttr = attrNames[sData.attr] || "Mágico"; htmlTip += `<span style="grid-column: span 2;">⚔️ Base: <strong>${nAttr}</strong></span>`;
            
            let isCustom = (sData.customPattern && sData.customPattern.trim() !== "");
            let parsedInfo = window.parseCustomPatternDesc(sData.customPattern);

            let rangeTxt = ""; if (sData.minRange > 0) rangeTxt += `Pula ${sData.minRange} | `; if (sData.maxRange > 0) rangeTxt += `Máx ${sData.maxRange}`;
            if (rangeTxt) htmlTip += `<span style="grid-column: span 2;">🎯 Alcance: <strong>${isCustom ? (sData.customPattern.startsWith("A") ? 'Tiro Livre' : 'Livre (360º)') : rangeTxt}</strong></span>`;
            
            let diceTxt = (sData.dice || "") + (sData.bonus ? ` +${sData.bonus}` : "");
            let actionTxt = isCustom && parsedInfo.types ? parsedInfo.types : "Nenhum";
            htmlTip += `<span style="grid-column: span 2;">🎲 Ação Base: <strong style="color:#fff;">${diceTxt}</strong><br><strong style="color:var(--accent-red); font-size:9px;">${actionTxt}</strong></span>`;
            
            let statusText = isCustom && parsedInfo.effects ? parsedInfo.effects : "Nenhum";
            if(!isCustom && sData.status && sData.status !== "") statusText = `${sData.status} (${sData.statusVal || 1}F | ${sData.statusTurnos || 1}t)`;
            
            if(statusText !== "Nenhum") htmlTip += `<span style="grid-column: span 2; font-size:10px;">☣️ Status: <strong style="color:#ffaa00;">${statusText}</strong></span>`;
            
            htmlTip += `<div style="grid-column: span 2; display:flex; justify-content:center; margin-top:5px;">`;
            htmlTip += window.gerarMiniGridHtml(sData.shape, sData.minRange, sData.maxRange, sData.aoe, sData.customPattern);
            htmlTip += `</div></div>`;
        }
        tipEl.innerHTML = htmlTip;

        if (unlockedSkills.includes(id)) { nodeEl.classList.add("unlocked"); } 
        else if (uJob.locked && uJob.subjob === subjob) { nodeEl.classList.add("available"); } 
        else if (isPreview) { nodeEl.classList.add("available"); }
    });
};

// 6. SALVAR A FORJA E AVISAR O FIREBASE E A RAM
window.salvarEdicaoMestre = function() {
    try {
        if(!window.isMaster || !window.currentViewingJob) return;

        let skillId = document.getElementById("editSkillId").value;
        let cat = window.currentViewingJob.cat; 
        let sub = window.currentViewingJob.subjob;
        
        let getVal = (id, def) => { let el = document.getElementById(id); return el ? el.value : def; };
        let getInt = (id, def) => { let el = document.getElementById(id); return el && el.value ? parseInt(el.value) : def; };

        let payload = {
            nome: getVal("editSkillName", "").trim() || "Nova Habilidade", img: getVal("editSkillImg", "").trim() || "", desc: getVal("editSkillDesc", "").trim() || "Sem descrição.",
            pt: getInt("editSkillPT", 1), er: getInt("editSkillER", 0), attr: getVal("editSkillAttr", "int"),
            minRange: getInt("editSkillMinRange", 0), maxRange: getInt("editSkillMaxRange", 1), aoe: getInt("editSkillAoE", 0),
            shape: getVal("editSkillShape", "Alvo"), customPattern: getVal("editSkillCustomPattern", ""),
            dice: getVal("editSkillDice", "").trim() || "", bonus: getInt("editSkillBonus", 0),
            status: getVal("editSkillStatus", ""), statusVal: getInt("editSkillStatusVal", 1), statusTurnos: getInt("editSkillStatusTurnos", 1)
        };

        if(payload.shape === "summon") {
            payload.summonHP = getInt("editSkillSummonHP", 50); payload.summonTurnos = getInt("editSkillSummonTurnos", 3); payload.summonLimit = getInt("editSkillSummonLimit", 1);
        }

        // MÁGICA: ATUALIZA A MEMÓRIA DO SISTEMA INSTANTANEAMENTE
        if(!window.jobConfigGlobais[cat]) window.jobConfigGlobais[cat] = {};
        if(!window.jobConfigGlobais[cat][sub]) window.jobConfigGlobais[cat][sub] = {};
        window.jobConfigGlobais[cat][sub][skillId] = payload;

        window.db.ref(`tokyoRpg/jobConfig/${cat}/${sub}/${skillId}`).set(payload).then(() => {
            window.showNeonToast("Node Forjado e Salvo no Banco!"); 
            let modal = document.getElementById("modalEditSkill"); if(modal) modal.style.display = "none";
            window.abrirArvoreJob(sub, cat, true); // Força redesenhar na hora!
        });

    } catch (err) { window.showNeonToast("Erro ao salvar."); console.error(err); }
};

// 7. O MODAL DE PINTURA TÁTICA (COM O MODO ALVO 'A')
// =========================================================
// 7. O MODAL DE PINTURA TÁTICA (AGORA COM RANGE EM TEMPO REAL)
// =========================================================
let oldForge = document.getElementById("vttForgeModal"); if(oldForge) oldForge.remove();

let forgeDiv = document.createElement("div"); forgeDiv.id = "vttForgeModal"; forgeDiv.className = "modal-overlay"; forgeDiv.style.zIndex = "100005"; forgeDiv.style.display = "none";
forgeDiv.onclick = function(e) { if(e.target === this) this.style.display = 'none'; }; 
forgeDiv.innerHTML = `
    <div class="modal-content" style="width: 95%; max-width: 500px; padding: 20px; background: #0a0a0f; border: 1px solid #b000ff; box-shadow: 0 0 40px rgba(176,0,255,0.4); position: relative;">
        <button onclick="document.getElementById('vttForgeModal').style.display='none'" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer;">✖</button>
        <h2 style="color:#b000ff; margin:0 0 15px 0; text-align:center; text-shadow: 0 0 10px #b000ff;">⚒️ VTT FORGE</h2>
        
        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <button class="action-btn active" id="forgeType_alvo" onclick="window.setForgeType('alvo')" style="flex:1; border-color:#ffaa00; padding:5px 0;">🎯 ALVO</button>
            <button class="action-btn" id="forgeType_direcional" onclick="window.setForgeType('direcional')" style="flex:1; border-color:var(--accent-blue); padding:5px 0;">⬆️ DIRECIONAL</button>
            <button class="action-btn" id="forgeType_aura" onclick="window.setForgeType('aura')" style="flex:1; border-color:var(--accent-gold); padding:5px 0;">🔄 AURA</button>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:15px; background:#111; padding:10px; border-radius:8px;">
            <div style="flex:1;">
                <label style="font-size:10px; color:#00e5ff;">ALCANCE MÁXIMO (Grid 9x9 limita a 4):</label>
                <input type="number" id="forgeMaxRange" value="4" min="1" max="4" style="width:100%; background:#000; border:1px solid #00e5ff; color:#fff; text-align:center; font-weight:bold; padding:5px;" oninput="window.renderForgeGrid()">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
                <button class="action-btn active" id="forgeTab_mira" onclick="window.setForgeTab('mira')" style="margin:0; padding:2px; font-size:11px; border-color:#00e5ff; color:#00e5ff;">🔵 MASCARA DE MIRA</button>
                <button class="action-btn" id="forgeTab_efeito" onclick="window.setForgeTab('efeito')" style="margin:0; padding:2px; font-size:11px; border-color:#ff1a55; color:#ff1a55;">💥 MASCARA DE EFEITO</button>
            </div>
        </div>

        <div id="forgeEffectTools" style="background:#111; padding:10px; border-radius:8px; border:1px dashed #ff1a55; margin-bottom:15px; display:none;">
            <div style="font-size:10px; color:#ff1a55; margin-bottom:5px;">AÇÕES DO PINCEL (Clique no Grid p/ Pintar):</div>
            <div style="display:flex; gap:5px; flex-wrap: wrap; margin-bottom:10px;">
                <button class="action-btn active" id="fbrush_d" style="border-color:#ff1a55; color:#ff1a55; padding:5px; margin:0; flex:1;" onclick="window.setForgeBrush('d')">🩸 Dano</button>
                <button class="action-btn" id="fbrush_c" style="border-color:#00ff66; color:#00ff66; padding:5px; margin:0; flex:1;" onclick="window.setForgeBrush('c')">💚 Cura</button>
                <button class="action-btn" id="fbrush_t" style="border-color:#006600; color:#006600; padding:5px; margin:0; flex:1;" onclick="window.setForgeBrush('t')">🕸️ Trap</button>
                <button class="action-btn" id="fbrush_tp" style="border-color:#b000ff; color:#b000ff; padding:5px; margin:0; flex:1;" onclick="window.setForgeBrush('tp')">🌀 TP</button>
                <button class="action-btn" id="fbrush_erase" style="border-color:#aaa; color:#aaa; padding:5px; margin:0; flex:1;" onclick="window.setForgeBrush('erase')">🧽 Apagar</button>
            </div>
            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:5px;">
                <select id="forgeEffectSelect" class="gamble-input" style="font-size:12px; padding:5px;">
                    <option value="Nenhum">Nenhum Status</option>
                    <option value="Marcado">🎯 Marcar Alvo</option><option value="TrocaMarcada">🔀 Trocar c/ Marcado</option>
                    <option value="Queimadura">🔥 Queimadura</option><option value="Veneno">🧪 Veneno</option><option value="Empurrão">🫸 Empurrar alvo</option><option value="Puxão">🪝 Puxar alvo</option>
                </select>
                <input type="number" id="forgeEffectVal" placeholder="Força" class="gamble-input" style="font-size:12px; padding:5px;" value="1">
                <input type="number" id="forgeEffectTurn" placeholder="Turnos" class="gamble-input" style="font-size:12px; padding:5px;" value="1">
            </div>
        </div>

        <div id="forgeGridContainer" style="display:grid; grid-template-columns: repeat(9, 32px); grid-template-rows: repeat(9, 32px); gap:2px; justify-content:center; background:#000; padding:15px; border:2px solid #333; border-radius:8px; user-select:none;"></div>
        
        <button class="action-btn" style="width:100%; border-color:#00e5ff; background:rgba(0,229,255,0.1); color:#00e5ff; font-weight:bold; font-size:16px; margin-top:15px;" onclick="window.salvarVttForge()">✅ FORJAR SISTEMA TÁTICO</button>
    </div>
`;
document.body.appendChild(forgeDiv);

window.vttForgeData = { castType: 'alvo', rangeMask: [], effectMask: {} };
window.forgeTab = 'mira'; // 'mira' ou 'efeito'
window.forgeBrush = 'd';

window.setForgeType = function(type) {
    window.vttForgeData.castType = type;
    ['alvo', 'direcional', 'aura'].forEach(t => { document.getElementById('forgeType_'+t).style.background = (t === type) ? "rgba(255,255,255,0.2)" : "transparent"; });
    
    let tabMiraBtn = document.getElementById("forgeTab_mira");
    if (type !== 'alvo') { tabMiraBtn.style.opacity = "0.3"; window.setForgeTab('efeito'); } 
    else { tabMiraBtn.style.opacity = "1"; window.setForgeTab('mira'); }
    window.renderForgeGrid();
};

window.setForgeTab = function(tab) {
    if(window.vttForgeData.castType !== 'alvo' && tab === 'mira') return; // Proíbe mira se não for Alvo
    window.forgeTab = tab;
    document.getElementById("forgeTab_mira").style.background = tab === 'mira' ? "rgba(0,229,255,0.2)" : "transparent";
    document.getElementById("forgeTab_efeito").style.background = tab === 'efeito' ? "rgba(255,26,85,0.2)" : "transparent";
    document.getElementById("forgeEffectTools").style.display = tab === 'efeito' ? "block" : "none";
    window.renderForgeGrid();
};

window.setForgeBrush = function(brush) {
    window.forgeBrush = brush;
    ['d','c','t','tp','erase'].forEach(b => { let el = document.getElementById('fbrush_'+b); if(el) el.style.boxShadow = (b === brush) ? `inset 0 0 10px ${el.style.color}` : "none"; });
};

window.renderForgeGrid = function() {
    let c = document.getElementById("forgeGridContainer"); if(!c) return; c.innerHTML = "";
    let px = 4; let py = 4; // Centro do Grid 9x9
    let maxRange = parseInt(document.getElementById("forgeMaxRange").value) || 4;

    for(let y=0; y<9; y++) {
        for(let x=0; x<9; x++) {
            let cell = document.createElement("div");
            cell.style.width = "100%"; cell.style.height = "100%"; cell.style.borderRadius = "4px"; 
            cell.style.display = "flex"; cell.style.alignItems = "center"; cell.style.justifyContent = "center"; cell.style.fontSize = "16px";
            
            let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
            let isBlocked = dist > maxRange;
            let relCoord = `${x - px}_${y - py}`; // Coordenada Relativa!

            if(window.forgeTab === 'mira') {
                if(isBlocked) { cell.style.background = "#050505"; cell.style.border = "1px solid #111"; cell.style.cursor = "not-allowed"; } 
                else {
                    cell.style.cursor = "pointer";
                    if (x === px && y === py) { cell.style.background = "#00e5ff"; cell.innerText = "🧍"; cell.style.boxShadow = "0 0 10px #00e5ff"; }
                    else {
                        let isMasked = window.vttForgeData.rangeMask.includes(relCoord);
                        cell.style.background = isMasked ? "rgba(0, 229, 255, 0.5)" : "#222";
                        cell.style.border = isMasked ? "1px solid #00e5ff" : "1px dashed #444";
                        
                        let toggleMira = (e) => { 
                            e.preventDefault(); 
                            if(window.vttForgeData.rangeMask.includes(relCoord)) { window.vttForgeData.rangeMask = window.vttForgeData.rangeMask.filter(c => c !== relCoord); } 
                            else { window.vttForgeData.rangeMask.push(relCoord); }
                            window.renderForgeGrid(); 
                        };
                        cell.onmousedown = toggleMira; cell.onmouseenter = (e) => { if(e.buttons > 0) toggleMira(e); };
                    }
                }
            } else { // ABA DE EFEITOS
                // No modo alvo, a explosão não tem limite de range travado na interface visual, você desenha a explosão em volta do alvo.
                cell.style.cursor = "crosshair"; cell.style.border = "1px solid #333";
                
                if (x === px && y === py) { 
                    cell.style.background = window.vttForgeData.castType === "alvo" ? "#ffaa00" : "#00e5ff"; 
                    cell.innerText = window.vttForgeData.castType === "alvo" ? "🎯" : "🧍"; 
                } 
                else {
                    let pData = window.vttForgeData.effectMask[relCoord];
                    if(pData) {
                        if(pData.t === 'd') cell.style.background = "#ff1a55"; else if(pData.t === 'c') cell.style.background = "#00ff66"; else if(pData.t === 't') cell.style.background = "#006600"; else if(pData.t === 'tp') cell.style.background = "#b000ff";
                        cell.innerText = window.effectEmojis[pData.e] || "";
                    } else { cell.style.background = "#1a1a1a"; }

                    let aplicarEfeito = (e) => { 
                        e.preventDefault(); 
                        if(window.forgeBrush === "erase") delete window.vttForgeData.effectMask[relCoord]; 
                        else { window.vttForgeData.effectMask[relCoord] = { t: window.forgeBrush, e: document.getElementById("forgeEffectSelect").value, v: document.getElementById("forgeEffectVal").value || 1, tr: document.getElementById("forgeEffectTurn").value || 1 }; }
                        window.renderForgeGrid(); 
                    };
                    cell.onmousedown = aplicarEfeito; cell.onmouseenter = (e) => { if(e.buttons > 0) aplicarEfeito(e); };
                }
            }
            c.appendChild(cell);
        }
    }
};

window.abrirPintor = function() {
    let customInput = document.getElementById("editSkillCustomPattern"); if(!customInput) return;
    let str = customInput.value; 
    
    // Reseta pra base limpa se não tiver arte
    window.vttForgeData = { castType: 'alvo', rangeMask: [], effectMask: {} };
    
    if(str && str.startsWith("{")) {
        try { window.vttForgeData = JSON.parse(str); } catch(e) {}
    }
    
    document.getElementById("forgeMaxRange").value = window.vttForgeData.maxRange || parseInt(document.getElementById("editSkillMaxRange").value) || 4;
    window.setForgeType(window.vttForgeData.castType);
    document.getElementById("vttForgeModal").style.display = "flex";
};

window.salvarVttForge = function() {
    let customInput = document.getElementById("editSkillCustomPattern"); 
    if(!customInput) return;
    
    // Puxa o range e embute no JSON
    window.vttForgeData.maxRange = parseInt(document.getElementById("forgeMaxRange").value) || 4;
    customInput.value = JSON.stringify(window.vttForgeData); 
    
    // Atualiza o input velho só pro Mestre ver
    let nativeRange = document.getElementById("editSkillMaxRange");
    if(nativeRange) nativeRange.value = window.vttForgeData.maxRange;

    window.showNeonToast("Sistema Tático Registrado na Forja!"); 
    document.getElementById("vttForgeModal").style.display = "none";
    
    // Ativa o salvar geral logo depois
    if(window.isMaster && window.salvarEdicaoMestre) window.salvarEdicaoMestre(); 
};

// =========================================================
// PAINEL DE TESTE RÁPIDO DE CLASSES NO VTT (EXCLUSIVO DO MESTRE)
// =========================================================
setInterval(() => {
    if(!window.isMaster) return;
    let painelMestre = document.getElementById("mestreVTT");
    
    // Injeta o menu se ele ainda não estiver lá
    if(painelMestre && painelMestre.style.display !== "none" && !document.getElementById("masterClassTestWrapper")) {
        let w = document.createElement("div");
        w.id = "masterClassTestWrapper";
        w.style.display = "flex"; w.style.alignItems = "center"; w.style.gap = "5px";
        w.style.marginLeft = "10px"; w.style.borderLeft = "1px dashed var(--accent-purple)"; w.style.paddingLeft = "10px";

        let selHtml = `<span style="font-size:10px; color:#00ff66; font-weight:bold;">🎭 MUDAR CLASSE:</span>
        <select id="masterTestClassSelect" onchange="window.mudarClasseMestreVTT(this.value)" style="background:#000; color:#00ff66; border:1px solid #00ff66; padding:2px; font-size:10px; border-radius:4px; max-width: 110px; cursor:pointer; outline:none;">
            <option value="">Selecione...</option>`;
        
        if(window.categoriasTrabalho) {
            Object.keys(window.categoriasTrabalho).forEach(c => {
                selHtml += `<optgroup label="--- ${c.toUpperCase()} ---">`;
                window.categoriasTrabalho[c].forEach(s => { selHtml += `<option value="${c}|${s}">${s}</option>`; });
                selHtml += `</optgroup>`;
            });
        }
        
        selHtml += `</select>
        <button class="action-btn" style="border-color:#f00; color:#f00; padding: 2px 6px; font-size:10px; margin:0;" onclick="window.limparMochilaMestre()" title="Apagar todas as skills de teste">🗑️ Limpar</button>`;
        
        w.innerHTML = selHtml;
        painelMestre.appendChild(w);
    }
}, 1500);

window.limparMochilaMestre = function() {
    if(!window.isMaster) return;
    if(confirm("Deseja apagar TODAS as habilidades e itens da sua mochila de testes?")) {
        window.db.ref(`tokyoRpg/users/MESTRE/mochila`).remove().then(() => {
            window.showNeonToast("🗑️ Mochila de Testes esvaziada!");
            let btnCnc = document.getElementById("btnCancelAtk");
            if(btnCnc && btnCnc.style.display !== "none") window.cancelarAtaqueVTT();
        });
    }
};

window.mudarClasseMestreVTT = function(val) {
    if(!val || !window.isMaster) return;
    let parts = val.split("|"); let cat = parts[0]; let sub = parts[1];
    let skills = window.jobConfigGlobais[cat]?.[sub] || {};
    let novaMochila = {}; let count = 0;
    
    // Varre a classe e joga as skills na mochila do Mestre (agora puxando o Desenho 9x9!)
    Object.keys(skills).forEach(k => {
        let s = skills[k];
        if(s.nome && s.nome !== "Vazio") {
            count++;
            let pushId = "teste_" + k; 
            novaMochila[pushId] = {
                nome: "🧪 " + s.nome, tipo: "Skill", desc: s.desc,
                eq: true, w: 0, h: 0, isVTT: true,
                wpnRange: s.maxRange || 4, minRange: s.minRange || 0, 
                customPattern: s.customPattern || "", // O DESENHO VEM AQUI
                wpnDice: s.dice || "1d4", wpnBonus: s.bonus || 0, attr: s.attr || "int", erCost: s.er || 0,
            };
        }
    });
    
    if (count === 0) {
        window.showNeonToast(`A classe ${sub} ainda não tem habilidades forjadas!`);
        document.getElementById("masterTestClassSelect").value = ""; return;
    }

    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).set(novaMochila).then(() => {
        window.showNeonToast(`✅ ${count} Habilidades de ${sub} carregadas!`);
        document.getElementById("masterTestClassSelect").value = ""; 
        let btnCnc = document.getElementById("btnCancelAtk");
        if(btnCnc && btnCnc.style.display !== "none") window.cancelarAtaqueVTT();
    });
};

// 1. INJETOR BLINDADO DO MENU DE TESTE DO MESTRE
setInterval(() => {
    let wrapper = document.getElementById("masterClassTestWrapper");
    
    // Só aparece se for o mestre e estiver dentro de um mapa VTT
    if(!window.isMaster || !window.currentSubMapKey) {
        if(wrapper) wrapper.style.display = "none";
        return;
    }

    // Se o menu não existir no HTML, o sistema cria ele flutuando na tela
    if(!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "masterClassTestWrapper";
        wrapper.style.cssText = "position:absolute; top:70px; right:20px; z-index:9999; background:rgba(0,0,0,0.9); border:1px solid #00ff66; padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:5px; box-shadow:0 0 15px rgba(0,255,102,0.3);";
        document.body.appendChild(wrapper);
    }

    wrapper.style.display = "flex";
    
    let selHtml = `<span style="font-size:11px; color:#00ff66; font-weight:bold; text-align:center;">🎭 MUDAR CLASSE VTT</span>
    <select id="masterTestClassSelect" onchange="window.mudarClasseMestreVTT(this.value)" style="background:#111; color:#00ff66; border:1px solid #00ff66; padding:4px; font-size:12px; border-radius:4px; cursor:pointer; outline:none; margin-bottom:5px;">
        <option value="">Selecione a Classe...</option>`;
    
    if(window.categoriasTrabalho) {
        Object.keys(window.categoriasTrabalho).forEach(c => {
            selHtml += `<optgroup label="--- ${c.toUpperCase()} ---">`;
            window.categoriasTrabalho[c].forEach(s => { selHtml += `<option value="${c}|${s}">${s}</option>`; });
            selHtml += `</optgroup>`;
        });
    }
    
    selHtml += `</select>
    <button class="action-btn" style="border-color:#f00; color:#f00; padding: 4px; font-size:11px; margin:0;" onclick="window.limparMochilaMestre()" title="Apaga tudo da mochila">🗑️ Limpar Testes</button>`;
    
    // Só injeta o HTML se ele ainda estiver vazio (evita piscar)
    if(wrapper.innerHTML === "") wrapper.innerHTML = selHtml;

}, 1500);

// 2. FUNÇÃO DE CARREGAR AS SKILLS NA HORA
window.mudarClasseMestreVTT = function(val) {
    if(!val || !window.isMaster) return;
    let parts = val.split("|"); let cat = parts[0]; let sub = parts[1];
    let skills = window.jobConfigGlobais[cat]?.[sub] || {};
    let novaMochila = {}; let count = 0;
    
    Object.keys(skills).forEach(k => {
        let s = skills[k];
        if(s.nome && s.nome !== "Vazio") {
            count++;
            
            // Puxa o range do desenho se existir
            let mRange = s.maxRange || 4;
            if(s.customPattern && s.customPattern.startsWith("{")) {
                try { let pat = JSON.parse(s.customPattern); if(pat.maxRange) mRange = pat.maxRange; } catch(e){}
            }

            novaMochila["teste_" + k] = {
                nome: "🧪 " + s.nome, tipo: "Skill", desc: s.desc,
                eq: true, w: 0, h: 0, isVTT: true,
                wpnRange: mRange, minRange: s.minRange || 0, 
                customPattern: s.customPattern || "", // PUXANDO O DESENHO DA FORJA!
                wpnDice: s.dice || "1d4", wpnBonus: s.bonus || 0, attr: s.attr || "int", erCost: s.er || 0,
            };
        }
    });
    
    if (count === 0) {
        window.showNeonToast(`A classe ${sub} não tem skills forjadas!`);
        document.getElementById("masterTestClassSelect").value = ""; return;
    }

    window.db.ref(`tokyoRpg/users/MESTRE/mochila`).set(novaMochila).then(() => {
        window.showNeonToast(`✅ ${count} Skills prontas pro combate!`);
        document.getElementById("masterTestClassSelect").value = ""; 
        let btnCnc = document.getElementById("btnCancelAtk");
        if(btnCnc && btnCnc.style.display !== "none") window.cancelarAtaqueVTT();
    });
};

window.socket.emit("joinMap", mapKey);
