// ==========================================================
// 1. CONFIGURAÇÕES BASE E VARIÁVEIS GLOBAIS
// ==========================================================
window.VTT_CELL_SIZE = 50; 
window.submapasConfig = {};
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
    "p1": { nome: "Praça Central", x: 50, y: 50 }, "p2": { nome: "Ramen Fantasma", x: 35, y: 65 }, "p3": { nome: "Viela da Fome", x: 15, y: 65 }, "p4": { nome: "Clube Neon", x: 50, y: 80 }, "p5": { nome: "Avenida Ouro", x: 35, y: 35 }, "p6": { nome: "Bar Submundo", x: 15, y: 35 }, "p7": { nome: "Beco Sombrio", x: 15, y: 50 }, "p8": { nome: "Esconderijo Alfa", x: 15, y: 80 }, "p9": { nome: "Alameda das Sombras", x: 65, y: 35 }, "p10":{ nome: "Apts Safehouse", x: 85, y: 35 }, "p11":{ nome: "Covil de Hackers", x: 85, y: 50 }, "p12":{ nome: "Mercado Negro", x: 85, y: 65 }, "p13":{ nome: "QG da Yakuza", x: 65, y: 80 }, "p14":{ nome: "Parque Sombrio", x: 85, y: 80 }, "p15":{ nome: "Cemitério", x: 35, y: 80 }
};
window.conexoesMapa = [ {de:"p1", para:"p2"}, {de:"p2", para:"p3"}, {de:"p1", para:"p4"}, {de:"p1", para:"p5"}, {de:"p5", para:"p6"}, {de:"p1", para:"p9"}, {de:"p9", para:"p10"}, {de:"p10", para:"p11"}, {de:"p11", para:"p12"}, {de:"p2", para:"p13"}, {de:"p13", para:"p14"}, {de:"p3", para:"p8"}, {de:"p7", para:"p6"}, {de:"p3", para:"p7"}, {de:"p2", para:"p15"}, {de:"p4", para:"p13"} ];
window.rotasSecretasGaia = [ {de:"p1", para:"p6"}, {de:"p15", para:"p10"}, {de:"p8", para:"p14"}, {de:"p11", para:"p4"} ];

window.filtroLojaAtual = "Promoções"; window.editandoItemId = null;
window.GRID_COLS = 5; window.GRID_ROWS = 3; window.CELL_SIZE = 45; window.GRID_GAP = 1; window.REAL_CELL_SIZE = window.CELL_SIZE + window.GRID_GAP;
window.tetrisMatrix = []; window.arrastandoKey = null; window.itemArrastado = null; window.offsetX = 0; window.offsetY = 0; window.origin = null; window.initPos = {c:-1, r:-1};

window.titulosExtensos = [ "Novato|com|0", "Alvo Fácil|com|500", "Rato de Beco|com|800", "Lutador|inc|2000", "Atirador|inc|2500", "O Hacker|epi|12000", "Demônio de Neon|leg|40000", "Deus das Apostas|leg|45000", "A Lenda Viva|leg|60000" ];

// INICIALIZAÇÃO FIREBASE 
try { firebase.initializeApp(window.firebaseConfig); window.db = firebase.database(); } catch (e) { console.error("Firebase falhou:", e); }

window.setElText = function(id, t) { let e = document.getElementById(id); if(e) e.innerText = t; };
window.setElHTML = function(id, h) { let e = document.getElementById(id); if(e) e.innerHTML = h; };
window.setElDisplay = function(id, d) { let e = document.getElementById(id); if(e) e.style.display = d; };
window.setElVal = function(id, v) { let e = document.getElementById(id); if(e) e.value = v; };

window.showNeonToast = function(msg) {
    let t = document.getElementById("neonToast");
    if(t) { t.innerText = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3000); }
};

window.getSafeRpg = function(u) { 
    let d = { for: 1, agi: 1, man: 1, vig: 1, int: 1, pontosLivres: 3, nivel: 1, integridade: 100, hp: 100 }; 
    if (!u || !u.rpg) return d; let r = u.rpg;
    let spent = Math.max(0, (r.for||1)-1) + Math.max(0, (r.agi||1)-1) + Math.max(0, (r.man||1)-1) + Math.max(0, (r.vig||1)-1) + Math.max(0, (r.int||1)-1);
    let realPts = Math.max(0, 3 + ((r.nivel||1)-1) - spent);
    return { for: r.for||1, agi: r.agi||1, man: r.man||1, vig: r.vig||1, int: r.int||1, pontosLivres: (r.pontosLivres!==undefined)?r.pontosLivres:realPts, nivel: r.nivel||1, integridade: (r.integridade!==undefined)?r.integridade:100, hp: (r.hp!==undefined)?r.hp:100 };
};

// ==========================================================
// 2. SISTEMA OS E INTERFACE GERAL (BLINDADO)
// ==========================================================
window.abrirCelularMain = function() {
    window.setElDisplay("phoneOverlay", "flex");
    let frame = document.getElementById('phoneFrameUI'); let mainScreen = document.getElementById('phoneMainScreen'); let igambleScreen = document.getElementById('phoneIgambleScreen'); let closeBtn = document.getElementById('btnClosePhone');
    if (frame) frame.style.backgroundImage = "url('bg.png')";
    if (mainScreen) mainScreen.style.display = "grid";
    if (igambleScreen) igambleScreen.style.display = "none";
    if (closeBtn) closeBtn.style.display = "flex";
};

window.fecharCelular = function() { window.setElDisplay("phoneOverlay", "none"); };

window.abrirIgambleMenu = function() {
    let frame = document.getElementById('phoneFrameUI'); let mainScreen = document.getElementById('phoneMainScreen'); let igambleScreen = document.getElementById('phoneIgambleScreen'); let closeBtn = document.getElementById('btnClosePhone');
    if (frame) frame.style.backgroundImage = "url('bg2.png')";
    if (mainScreen) mainScreen.style.display = "none";
    if (igambleScreen) igambleScreen.style.display = "block";
    if (closeBtn) closeBtn.style.display = "none"; 
};

window.voltarParaMenuIgamble = function() { window.fecharApp(); window.abrirCelularMain(); window.abrirIgambleMenu(); };

window.abrirApp = function(appId, isLocked, lockMsg) {
    if(isLocked) { window.showNeonToast(lockMsg); return; }
    window.fecharCelular(); 
    window.setElDisplay("gameContainer", "block");
    window.setElDisplay("btnHomeApp", "flex");
    window.setElDisplay("btnBackIgamble", appId === 'tab-igamble' ? "flex" : "none");
    
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    let a = document.getElementById(appId); if(a) a.classList.add('active');

    // BLINDAGEM MAPA: Só mostra o grid se for o App de Mapa
    let ma = document.querySelector(".map-visual-area");
    if(ma) {
        if(appId === 'tab-mapa') {
            ma.style.display = "flex"; 
            if(typeof window.desenharMapa === "function") window.desenharMapa();
        } else {
            ma.style.display = "none"; // Esconde o mapa para não bugar Lojas
        }
    }

    if(appId === 'tab-personagem') window.renderizarMochila();
    if(appId === 'tab-casa') window.drawCasaBoard();
    if(appId === 'tab-panteao') window.renderizarPanteao();
    if(appId === 'tab-igamble') setTimeout(() => { let chatBox = document.getElementById("chatMessages"); if(chatBox) chatBox.scrollTop = chatBox.scrollHeight; }, 50); 
};

window.fecharApp = function() {
    window.setElDisplay("gameContainer", "none");
    window.setElDisplay("btnHomeApp", "none");
    window.setElDisplay("btnBackIgamble", "none"); 
    let ma = document.querySelector(".map-visual-area");
    if(ma) ma.style.display = "none"; 
};

// ==========================================================
// 3. MAPAS E TABULEIRO VTT (COM MOCHILA DO MESTRE)
// ==========================================================
window.dmPropsCache = window.dmPropsCache || [];

window.adicionarPropDock = function() {
    let url = prompt("Cole a URL da imagem (PNG Transparente):");
    if(!url) return;
    window.dmPropsCache.push(url);
    if(typeof window.renderPropDock === "function") window.renderPropDock();
};

window.renderPropDock = function() {
    let list = document.getElementById("dmPropList"); if(!list) return;
    list.innerHTML = "";
    window.dmPropsCache.forEach((url, index) => {
        let img = document.createElement("img");
        img.src = url; img.style.width = "60px"; img.style.height = "60px"; img.style.objectFit = "contain";
        img.style.cursor = "grab"; img.style.border = "1px solid #333"; img.style.borderRadius = "5px"; img.style.backgroundColor = "rgba(255,255,255,0.1)"; img.draggable = true;
        img.ondragstart = (e) => { e.dataTransfer.setData("text/plain", url); };
        img.oncontextmenu = (e) => { e.preventDefault(); window.dmPropsCache.splice(index, 1); window.renderPropDock(); };
        list.appendChild(img);
    });
};

window.propAcao = function(e, cid, action) {
    e.stopPropagation(); e.preventDefault();
    if(!window.currentSubMapKey) return;
    let conf = window.submapasConfig[window.currentSubMapKey] || {};
    let cellsData = conf.cells || {}; let cData = cellsData[cid] || {};
    if(!cData.prop) return;

    let p = cData.prop; let currentSize = p.size || 100; let currentRot = p.rot || 0;
    if(action === 'up') currentSize += 25; 
    if(action === 'down') currentSize = Math.max(25, currentSize - 25); 
    if(action === 'rot') currentRot = (currentRot + 45) % 360; 
    
    if(action === 'del') window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/prop`).remove();
    else window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/prop`).update({ size: currentSize, rot: currentRot });
};

window.desenharMapa = function() {
    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "block";
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "none";
    let btnSair = document.getElementById("btnSairVTT"); if(btnSair) btnSair.style.display = "none";
    if(!mc) return; mc.innerHTML = "";
    Object.keys(window.locaisMapa).forEach(key => {
        let loc = window.locaisMapa[key];
        let node = document.createElement("div"); node.className = "map-node"; node.style.left = loc.gx + "%"; node.style.top = loc.gy + "%";
        node.innerHTML = `<div>${loc.nome}</div>`; node.onclick = () => window.abrirSubMapa(key);
        mc.appendChild(node);
    });
};

window.abrirSubMapa = function(localKey) {
    window.currentSubMapKey = localKey;
    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "none";
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "flex";
    let btnSair = document.getElementById("btnSairVTT"); if(btnSair) btnSair.style.display = "flex";

    let loc = window.locaisMapa[localKey] || { nome: localKey.replace(/_/g, " ") };
    let titleEl = document.getElementById("subMapTitle"); if(titleEl) titleEl.innerText = loc.nome;

    let bgUrl = window.submapasBGs[localKey] || "";
    let wrapper = document.getElementById("vttWorldWrapper");
    if(wrapper) { if(bgUrl) { wrapper.style.backgroundImage = `url('${bgUrl}')`; wrapper.style.backgroundColor = "transparent"; } else { wrapper.style.backgroundImage = "none"; wrapper.style.backgroundColor = "#111"; } }
    
    if(window.isMaster && typeof window.renderPropDock === "function") window.renderPropDock();
    window.initTacticalBoard(); window.updateTacticalBoard();

    if(window.jogadorAtual && window.db) {
        window.db.ref(`tokyoRpg/submapas/${localKey}`).once('value', s => {
            let currentGrid = s.val() || {};
            if(!Object.values(currentGrid).includes(window.jogadorAtual)) window.db.ref(`tokyoRpg/submapas/${localKey}/0_0`).set(window.jogadorAtual);
        });
    }
};

window.fecharSubMapa = function() {
    window.currentSubMapKey = "";
    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "block";
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "none";
    let btnSair = document.getElementById("btnSairVTT"); if(btnSair) btnSair.style.display = "none";
};

window.initTacticalBoard = function() {
    try {
        let b = document.getElementById("gridCells"); if(!b) return; b.innerHTML = "";
        let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia"));
        let conf = window.submapasConfig[window.currentSubMapKey] || {};
        let cols = conf.cols || 16; let rows = conf.rows || 12; let shape = conf.shape || 'quadrado';
        let cellsData = conf.cells || {}; let cellSize = window.VTT_CELL_SIZE || 50; 

        let wrapper = document.getElementById("vttWorldWrapper");
        if(wrapper) { wrapper.style.width = (cols * cellSize) + "px"; wrapper.style.height = (rows * cellSize) + "px"; }
        b.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`; b.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                let cid = `${x}_${y}`; 
                let cData = cellsData[cid] || {}; let isObs = cData.obs || false; 
                let obsClass = isObs ? (isGaia ? "cell-obstacle-gaia" : "cell-obstacle") : "";
                
                let isHidden = false;
                if (shape === 'l_shape') { if (x >= Math.floor(cols/2) && y < Math.floor(rows/2)) isHidden = true; } 
                else if (shape === 'u_shape') { if (x >= Math.floor(cols/4) && x < Math.floor(cols*0.75) && y < Math.floor(rows/2)) isHidden = true; } 
                else if (shape === 'cross') { if ((x < Math.floor(cols/3) || x >= Math.floor(cols*0.66)) && (y < Math.floor(rows/3) || y >= Math.floor(rows*0.66))) isHidden = true; } 
                else if (shape === 'corredor') { if (y < Math.floor(rows/3) || y >= Math.floor(rows*0.66)) isHidden = true; } 
                else if (shape === 'hexagono') { let hW = cols/2; let hH = rows/2; if ((Math.abs(x - hW + 0.5) / hW) + (Math.abs(y - hH + 0.5) / hH) > 1.3) isHidden = true; }

                let cell = document.createElement("div"); 
                cell.id = `cell_${x}_${y}`; 
                cell.className = `tactical-cell ${obsClass} ${isHidden ? "hidden-vtt-cell" : ""}`;
                
                if(cData.prop) {
                    let pSize = cData.prop.size || 100; let pRot = cData.prop.rot || 0;
                    let pCont = document.createElement("div"); pCont.className = "prop-container";
                    let pImg = document.createElement("img");
                    pImg.src = cData.prop.url; pImg.style.width = pSize + "%"; pImg.style.height = pSize + "%";
                    pImg.style.objectFit = "contain"; pImg.style.pointerEvents = "none"; pImg.style.transform = `rotate(${pRot}deg)`; 
                    pCont.appendChild(pImg);
                    
                    if (window.isMaster) {
                        pCont.style.pointerEvents = "auto"; pCont.draggable = true;
                        pCont.ondragstart = (e) => { e.dataTransfer.setData("text/plain", JSON.stringify({ action: "move", cid: cid, prop: cData.prop })); };
                        let ctrl = document.createElement("div"); ctrl.className = "prop-controls";
                        ctrl.innerHTML = `<span title="Aumentar" onclick="window.propAcao(event, '${cid}', 'up')">➕</span><span title="Diminuir" onclick="window.propAcao(event, '${cid}', 'down')">➖</span><span title="Girar" onclick="window.propAcao(event, '${cid}', 'rot')">↻</span><span title="Apagar" onclick="window.propAcao(event, '${cid}', 'del')">🗑️</span>`;
                        pCont.appendChild(ctrl);
                        pCont.onclick = (e) => { if(!e.target.closest('.prop-controls')) { if(typeof window.clicarGrid === "function") window.clicarGrid(x, y, isObs, cData.portal); } };
                    } else { pCont.style.pointerEvents = "none"; }
                    cell.appendChild(pCont);
                }

                if (!isHidden) { 
                    if(window.isMaster) {
                        cell.ondragover = (e) => e.preventDefault();
                        cell.ondrop = (e) => {
                            e.preventDefault(); let dataStr = e.dataTransfer.getData("text/plain"); if(!dataStr) return;
                            try {
                                if(dataStr.startsWith("{")) {
                                    let data = JSON.parse(dataStr);
                                    if(data.action === "move" && data.cid !== cid) {
                                        window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${data.cid}/prop`).remove();
                                        window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/prop`).set(data.prop);
                                    }
                                } else { window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/prop`).set({ url: dataStr, rot: 0, size: 100 }); }
                            } catch(err) { console.error(err); }
                        };
                        cell.oncontextmenu = (e) => { if(e.target === cell) { e.preventDefault(); window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}/cells/${cid}/obs`).set(!isObs); window.showNeonToast(!isObs ? "Bloqueado!" : "Livre!"); } };
                    }
                    cell.onclick = (e) => { if(e.target === cell || e.target.tagName !== "IMG") { if(typeof window.clicarGrid === "function") window.clicarGrid(x, y, isObs, cData.portal); } };
                }
                b.appendChild(cell);
            }
        }
    } catch(e) { console.error("Erro critico no grid:", e); }
};

window.updateTacticalBoard = function() {
    try {
        if(!window.currentSubMapKey) return;
        let painelMestre = document.getElementById("mestreVTT"); let propDock = document.getElementById("dmPropDock");
        if(window.isMaster) {
            if(painelMestre) painelMestre.style.display = "flex";
            if(propDock) { propDock.style.display = "flex"; if(typeof window.renderPropDock === "function") window.renderPropDock(); }
            let conf = window.submapasConfig[window.currentSubMapKey] || {};
            if(document.getElementById("vttColsInp")) document.getElementById("vttColsInp").value = conf.cols || 16;
            if(document.getElementById("vttRowsInp")) document.getElementById("vttRowsInp").value = conf.rows || 12;
            if(document.getElementById("vttShapeInp")) document.getElementById("vttShapeInp").value = conf.shape || 'quadrado';
        } else {
            if(painelMestre) painelMestre.style.display = "none"; if(propDock) propDock.style.display = "none";
        }

        let grid = window.submapasGlobais[window.currentSubMapKey] || {}; let layer = document.getElementById("tokensLayer"); if(!layer) return;
        let conf = window.submapasConfig[window.currentSubMapKey] || {}; let cols = conf.cols || 16; let rows = conf.rows || 12; let cellSize = window.VTT_CELL_SIZE || 50; 

        let currentTokens = [];
        Object.keys(grid).forEach(cid => {
            let occupier = grid[cid]; if(!occupier) return; let parts = cid.split("_"); let x = parseInt(parts[0]); let y = parseInt(parts[1]);
            if(x >= cols || y >= rows) return; 

            let tokenId = `token_${occupier}`; currentTokens.push(tokenId); let tokenEl = document.getElementById(tokenId);
            let avToken = window.usersGlobais[occupier]?.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${occupier}`;
            let isMe = (occupier === window.jogadorAtual);
            let leftPx = (x * cellSize); let topPx = (y * cellSize);

            if(tokenEl) {
                tokenEl.style.left = leftPx + "px"; tokenEl.style.top = topPx + "px"; tokenEl.style.width = cellSize + "px"; tokenEl.style.height = cellSize + "px";
            } else {
                let tHtml = document.createElement("div"); tHtml.id = tokenId; tHtml.className = "tactical-token";
                if(isMe) { tHtml.style.borderColor = "#fff"; tHtml.style.boxShadow = "0 0 20px #fff"; tHtml.style.zIndex = "10"; }
                tHtml.style.backgroundImage = `url('${avToken}')`; tHtml.style.left = leftPx + "px"; tHtml.style.top = topPx + "px";
                tHtml.style.width = cellSize + "px"; tHtml.style.height = cellSize + "px";
                layer.appendChild(tHtml); tokenEl = tHtml; 
            }

            if(isMe && tokenEl) {
                setTimeout(() => {
                    let board = document.getElementById("tacticalBoard");
                    if(board) {
                        let margin = window.VTT_CELL_SIZE * 3; let vL = board.scrollLeft, vR = vL + board.clientWidth, vT = board.scrollTop, vB = vT + board.clientHeight;
                        let targetL = vL, targetT = vT;
                        if (leftPx < vL + margin) targetL = leftPx - margin; else if (leftPx + cellSize > vR - margin) targetL = leftPx + cellSize + margin - board.clientWidth;
                        if (topPx < vT + margin) targetT = topPx - margin; else if (topPx + cellSize > vB - margin) targetT = topPx + cellSize + margin - board.clientHeight;
                        if(targetL !== vL || targetT !== vT) board.scrollTo({ left: targetL, top: targetT, behavior: 'smooth' });
                    }
                }, 100);
            }
        });

        Array.from(layer.children).forEach(t => { if(!currentTokens.includes(t.id)) t.remove(); });
    } catch(e) { console.error("Erro na atualização do board:", e); }
};

window.clicarGrid = function(x,y, isObs) {
    if(!window.jogadorAtual) return;
    let u = window.usersGlobais[window.jogadorAtual]; let isGaia = (u.deus && u.deus.includes("Gaia"));
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0 && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Espere seu turno."); return; }
    
    let grid = window.submapasGlobais[window.currentSubMapKey] || {};
    if(grid[`${x}_${y}`]) return; 
    
    let px = -1, py = -1; let isAlreadyOnBoard = false;
    Object.keys(grid).forEach(cid => { if(grid[cid] === window.jogadorAtual) { isAlreadyOnBoard = true; let parts = cid.split("_"); px = parseInt(parts[0]); py = parseInt(parts[1]); } });

    if(!window.isMaster && isAlreadyOnBoard) {
        let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
        if(dist > window.movimentosRestantes) { return; } 
        if(isObs && !isGaia) { window.showNeonToast("Obstáculo! Apenas Gaia atravessa."); return; }
        window.movimentosRestantes -= dist; window.setElText("movRestantes", `Passos Livres: ${window.movimentosRestantes}`);
    } else if (isObs && !isGaia && !window.isMaster) {
        window.showNeonToast("Obstáculo! Apenas Gaia atravessa."); return;
    }

    let up = {}; Object.keys(grid).forEach(k => { if(grid[k]===window.jogadorAtual) up[k] = null; }); up[`${x}_${y}`] = window.jogadorAtual;
    window.db.ref(`tokyoRpg/submaps/${window.currentSubMapKey}`).update(up);
};

window.salvarFormatoMapa = function() {
    if(!window.isMaster || !window.currentSubMapKey) return;
    let cols = parseInt(document.getElementById("vttColsInp").value) || 16; let rows = parseInt(document.getElementById("vttRowsInp").value) || 12; let shape = document.getElementById("vttShapeInp").value || "quadrado";
    window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}`).update({ cols: cols, rows: rows, shape: shape });
    window.showNeonToast(`Terreno alterado para ${cols}x${rows}!`);
};

// ==========================================================
// 4. INVENTÁRIO (MOCHILA E CASA) TETRIS
// ==========================================================
window.calcularMaxInteg = function(u) { let m = 100; if(u && u.mochila) { Object.values(u.mochila).forEach(i => { if(i.tipo==="Móvel" && i.inHouse === true && i.buffType==="integ" && i.poder) { m += parseInt(i.poder); } }); } return m; };
window.calcularBuffsMoveis = function(u) { let buffs = { for:0, agi:0, int:0, vig:0, man:0 }; if(u && u.mochila) { Object.values(u.mochila).forEach(i => { if(i.tipo==="Móvel" && i.inHouse === true && i.buffType && i.poder && buffs[i.buffType] !== undefined) { buffs[i.buffType] += parseInt(i.poder); } }); } return buffs; };
window.calcularDefesa = function(u) { let def = 0; if(u && u.mochila) { Object.values(u.mochila).forEach(i => { if(i.eq && i.tipo === 'Roupa') def += (parseInt(i.poder) || 0); }); } return def; };
window.getPesoStatus = function(u) { let r = window.getSafeRpg(u); let buffs = window.calcularBuffsMoveis(u); let max = 10 + ((r.for+buffs.for)*5); let peso = 0; if(u?.mochila) Object.values(u.mochila).forEach(i => peso += (parseInt(i.peso)||1)); return {atual:peso, max:max, sobrepeso: peso > max}; };

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
        if (i.tipo === 'Móvel') return; // Moveis ficam na casa

        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris ${i.tipo || 'Arma'}`; el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        
        let btnRotate = `<button class="btn-rotate-item" onpointerdown="window.girarItemMochila('${k}', ${w}, ${h}, ${i.eq}, event)">↻</button>`;
        el.innerHTML = `${btnRotate}<span>${window.iconesMercado[i.tipo]||''} ${i.nome}</span><button class="${i.eq ? 'btn-excluir-item' : 'btn-excluir-item discard'}" onpointerdown="window.removerItemMochila('${k}', event)">${i.eq ? '▼' : '✖'}</button>`;

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
};

window.iniciarArrasteTetris = function(e) {
    if(e.target.tagName.toLowerCase() === 'button') return;
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
window.arrastarTetris = function(e) { e.preventDefault(); if(!window.itemArrastado) return; const gridRect = document.getElementById("grid-personagem").getBoundingClientRect(); window.itemArrastado.style.left = `${e.clientX - gridRect.left - window.offsetX}px`; window.itemArrastado.style.top = `${e.clientY - gridRect.top - window.offsetY}px`; };
window.soltarTetris = function(e) {
    document.removeEventListener('pointermove', window.arrastarTetris); document.removeEventListener('pointerup', window.soltarTetris);
    if(!window.itemArrastado) return; window.itemArrastado.classList.remove('dragging');
    const w = parseInt(window.itemArrastado.getAttribute('data-w')), h = parseInt(window.itemArrastado.getAttribute('data-h'));
    let tC = Math.round(parseFloat(window.itemArrastado.style.left || 0) / window.REAL_CELL_SIZE); let tR = Math.round(parseFloat(window.itemArrastado.style.top || 0) / window.REAL_CELL_SIZE);

    if (tC < 0 || tC + w > window.GRID_COLS || tR < 0 || tR + h > window.GRID_ROWS) {
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null});
    } else {
        let livre = true; for(let r=tR; r<tR+h; r++) for(let c=tC; c<tC+w; c++) if(window.tetrisMatrix[r][c] === 1) livre = false;
        if(livre) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: tC, r: tR});
        else {
            if(window.origin === 'grid') window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: true, c: window.initPos.c, r: window.initPos.r});
            else window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKey}`).update({eq: false, c: null, r: null});
        }
    }
    window.arrastandoKey = null; window.itemArrastado = null; window.renderizarMochila();
};

window.girarItemMochila = function(k, w, h, eq, ev) {
    if(ev) ev.stopPropagation(); let up = {}; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/w`] = h; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/h`] = w;
    if(eq) { up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/eq`] = false; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/c`] = null; up[`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}/r`] = null; window.showNeonToast("Enviado ao depósito ao girar."); }
    window.db.ref().update(up);
};
window.removerItemMochila = function(k, ev) { 
    if(ev) ev.stopPropagation(); let item = window.usersGlobais[window.jogadorAtual]?.mochila?.[k];
    if(item && item.eq) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({eq: false, c: null, r: null}); } 
    else { if(confirm("Descartar item permanentemente?")) window.db.ref('tokyoRpg/users/' + window.jogadorAtual + '/mochila/' + k).remove(); }
};

window.drawCasaBoard = function() {
    let g = document.getElementById("grid-casa"); let l = document.getElementById("lista-moveis-soltos"); if(!g || !l) return;
    let cData = window.usersGlobais[window.jogadorAtual]?.casaConfig || {};
    window.CASA_COLS = parseInt(cData.w) || 10; window.CASA_ROWS = parseInt(cData.h) || 10;
    
    if(document.getElementById("casaNomeInp")) document.getElementById("casaNomeInp").value = cData.nome || "";
    if(document.getElementById("casaBgInp")) document.getElementById("casaBgInp").value = cData.bg || "";
    if(document.getElementById("casaW")) document.getElementById("casaW").value = window.CASA_COLS;
    if(document.getElementById("casaH")) document.getElementById("casaH").value = window.CASA_ROWS;
    
    g.style.gridTemplateColumns = `repeat(${window.CASA_COLS}, 45px)`; g.style.gridTemplateRows = `repeat(${window.CASA_ROWS}, 45px)`;
    g.innerHTML = ""; l.innerHTML = ""; window.casaMatrix = Array(window.CASA_ROWS).fill(null).map(()=>Array(window.CASA_COLS).fill(0));
    for(let i = 0; i < (window.CASA_COLS * window.CASA_ROWS); i++) { g.innerHTML += `<div class="grid-cell" style="background:rgba(0,0,0,0.4);"></div>`; }
    g.style.backgroundImage = (cData && cData.bg) ? `url('${cData.bg}')` : "none"; g.style.backgroundSize = "100% 100%";

    let itens = window.usersGlobais[window.jogadorAtual]?.mochila || {};
    Object.keys(itens).forEach(k => {
        let i = itens[k]; if (i.tipo !== 'Móvel') return; 
        
        let w = parseInt(i.w) || 1; let h = parseInt(i.h) || 1;
        let el = document.createElement('div'); el.className = `item-tetris Móvel`; el.setAttribute('data-key', k); el.setAttribute('data-w', w); el.setAttribute('data-h', h);
        el.style.width = `${(w * window.CELL_SIZE) + ((w-1) * window.GRID_GAP)}px`; el.style.height = `${(h * window.CELL_SIZE) + ((h-1) * window.GRID_GAP)}px`;
        el.innerHTML = `<button class="btn-rotate-item" onpointerdown="window.girarItemMochila('${k}', ${w}, ${h}, ${i.inHouse}, event)">↻</button><span>${i.nome}</span><button class="${i.inHouse ? 'btn-excluir-item' : 'btn-excluir-item discard'}" onpointerdown="window.removerMovel('${k}', event)">${i.inHouse ? '▼' : '✖'}</button>`;

        if(i.inHouse === true && i.hc !== undefined && i.hr !== undefined && parseInt(i.hc) < window.CASA_COLS && parseInt(i.hr) < window.CASA_ROWS) {
            let ic = parseInt(i.hc); let ir = parseInt(i.hr);
            el.style.left = `${ic * window.REAL_CELL_SIZE}px`; el.style.top = `${ir * window.REAL_CELL_SIZE}px`;
            el.setAttribute('data-c', ic); el.setAttribute('data-r', ir);
            for(let row=ir; row<ir+h; row++) { for(let col=ic; col<ic+w; col++) { if (row < window.CASA_ROWS && col < window.CASA_COLS) window.casaMatrix[row][col] = 1; } }
            g.appendChild(el);
        } else {
            if(i.inHouse) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({inHouse: false, hc: null, hr: null});
            el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto'; l.appendChild(el);
        }
        el.addEventListener('pointerdown', window.iniciarArrasteCasa);
    });
};

window.iniciarArrasteCasa = function(e) {
    if(e.target.tagName.toLowerCase() === 'button') return;
    e.preventDefault(); window.itemArrastadoCasa = e.currentTarget; window.arrastandoKeyCasa = window.itemArrastadoCasa.getAttribute('data-key');
    let gridEl = document.getElementById("grid-casa"); let rectOrig = window.itemArrastadoCasa.getBoundingClientRect();
    if (window.itemArrastadoCasa.parentElement === gridEl) {
        window.originCasa = 'grid'; window.initPosCasa = {c: parseInt(window.itemArrastadoCasa.getAttribute('data-c')), r: parseInt(window.itemArrastadoCasa.getAttribute('data-r'))};
        let w = parseInt(window.itemArrastadoCasa.getAttribute('data-w')); let h = parseInt(window.itemArrastadoCasa.getAttribute('data-h'));
        for(let row=window.initPosCasa.r; row<window.initPosCasa.r+h; row++) for(let col=window.initPosCasa.c; col<window.initPosCasa.c+w; col++) if(row < window.CASA_ROWS && col < window.CASA_COLS) window.casaMatrix[row][col] = 0; 
    } else { 
        window.originCasa = 'inv'; let gridRect = gridEl.getBoundingClientRect();
        window.itemArrastadoCasa.style.margin = "0"; window.itemArrastadoCasa.style.left = (rectOrig.left - gridRect.left) + 'px'; window.itemArrastadoCasa.style.top = (rectOrig.top - gridRect.top) + 'px';
        gridEl.appendChild(window.itemArrastadoCasa); 
    }
    window.itemArrastadoCasa.classList.add('dragging'); window.itemArrastadoCasa.style.position = 'absolute'; 
    let newRect = window.itemArrastadoCasa.getBoundingClientRect(); window.offsetXCasa = e.clientX - newRect.left; window.offsetYCasa = e.clientY - newRect.top;
    document.addEventListener('pointermove', window.arrastarCasa); document.addEventListener('pointerup', window.soltarCasa);
};
window.arrastarCasa = function(e) { e.preventDefault(); if(!window.itemArrastadoCasa) return; const gridRect = document.getElementById("grid-casa").getBoundingClientRect(); window.itemArrastadoCasa.style.left = `${e.clientX - gridRect.left - window.offsetXCasa}px`; window.itemArrastadoCasa.style.top = `${e.clientY - gridRect.top - window.offsetYCasa}px`; };
window.soltarCasa = function(e) {
    document.removeEventListener('pointermove', window.arrastarCasa); document.removeEventListener('pointerup', window.soltarCasa);
    if(!window.itemArrastadoCasa) return; window.itemArrastadoCasa.classList.remove('dragging');
    const w = parseInt(window.itemArrastadoCasa.getAttribute('data-w')); const h = parseInt(window.itemArrastadoCasa.getAttribute('data-h'));
    let tC = Math.round(parseFloat(window.itemArrastadoCasa.style.left || 0) / window.REAL_CELL_SIZE); let tR = Math.round(parseFloat(window.itemArrastadoCasa.style.top || 0) / window.REAL_CELL_SIZE);

    if (tC < 0 || tC + w > window.CASA_COLS || tR < 0 || tR + h > window.CASA_ROWS) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: false, hc: null, hr: null}); } 
    else {
        let livre = true; for(let r=tR; r<tR+h; r++) for(let c=tC; c<tC+w; c++) if(window.casaMatrix[r][c] === 1) livre = false;
        if(livre) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: true, hc: tC, hr: tR}); } 
        else {
            if(window.originCasa === 'grid') { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: true, hc: window.initPosCasa.c, hr: window.initPosCasa.r}); } 
            else { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${window.arrastandoKeyCasa}`).update({inHouse: false, hc: null, hr: null}); }
        }
    }
    window.arrastandoKeyCasa = null; window.itemArrastadoCasa = null; 
};
window.removerMovel = function(k, ev) { 
    if(ev) ev.stopPropagation(); let item = window.usersGlobais[window.jogadorAtual]?.mochila?.[k];
    if(item && item.inHouse) { window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila/${k}`).update({inHouse: false, hc: null, hr: null}); } 
    else { if(confirm("Vender/Descartar este móvel?")) window.db.ref('tokyoRpg/users/' + window.jogadorAtual + '/mochila/' + k).remove(); }
};
window.salvarConfigCasa = function() { 
    if(!window.jogadorAtual) return; 
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/casaConfig`).update({ nome: document.getElementById("casaNomeInp").value, bg: document.getElementById("casaBgInp").value, w: parseInt(document.getElementById("casaW").value) || 10, h: parseInt(document.getElementById("casaH").value) || 10 }); 
    window.showNeonToast("Planta da Casa Atualizada!"); setTimeout(window.drawCasaBoard, 500);
};

// ==========================================================
// 5. RPG, COMPRAS E LOJA
// ==========================================================
window.renderizarFicha = function() {
    if(!window.jogadorAtual || !window.usersGlobais[window.jogadorAtual]) return;
    let u = window.usersGlobais[window.jogadorAtual]; let r = window.getSafeRpg(u); let mInteg = window.calcularMaxInteg(u); let buffs = window.calcularBuffsMoveis(u); let def = window.calcularDefesa(u);
    
    if(document.getElementById("fichaNome")) window.setElText("fichaNome", u.nome || window.jogadorAtual);
    if(document.getElementById("fichaSerial")) window.setElText("fichaSerial", u.serial || "----");
    let avURL = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${window.jogadorAtual}`;
    if(document.getElementById("myAvatarImg")) document.getElementById("myAvatarImg").src = avURL;
    
    // MÁGICA DO CHIP CELULAR E CASA
    let temCel = u.numero ? true : false; let temCasa = (u.casa && Object.keys(u.casa).length > 0) ? true : false;
    if (u.mochila) { Object.values(u.mochila).forEach(i => { let t = (i.tipo || "").toLowerCase(); let n = (i.nome || "").toLowerCase(); if (t === 'tecnologia' || n.includes('celular') || n.includes('gamblenger')) temCel = true; if (t === 'móvel' || t === 'movel') temCasa = true; }); }
    
    if (temCel && !u.numero && window.jogadorAtual !== "MESTRE") {
        let novoNumero = "9" + Math.floor(1000 + Math.random() * 9000).toString(); u.numero = novoNumero; 
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/numero`).set(novoNumero).then(() => { window.showNeonToast(`📱 Celular Ativado! Número: ${novoNumero}`); });
    }
    if(document.getElementById("perfilTelefone")) window.setElText("perfilTelefone", u.numero || "Sem Sinal");

    let iCel = document.getElementById('icon-celular'); if(iCel) { if(temCel || window.isMaster) { iCel.classList.remove('locked'); iCel.onclick = () => { window.abrirApp('tab-celular', false); window.carregarContatosSMS(); }; } else { iCel.classList.add('locked'); iCel.onclick = () => window.abrirApp('none', true, "Compre um Celular."); } }
    let iCasa = document.getElementById('icon-casa'); if(iCasa) { if(temCasa || window.isMaster) { iCasa.classList.remove('locked'); iCasa.onclick = () => window.abrirApp('tab-casa', false); } else { iCasa.classList.add('locked'); iCasa.onclick = () => window.abrirApp('none', true, "Compre um Imóvel."); } }
};

window.renderizarLojaUI = function() {
    let b = document.getElementById("shopGrid"); if(!b) return; b.innerHTML="";
    let mPanel = document.getElementById("masterShopPanel"); if(mPanel) mPanel.style.display = window.isMaster ? "block" : "none";
    if(!window.lojaGlobal) return;

    Object.keys(window.lojaGlobal).forEach(k => {
        let i = window.lojaGlobal[k]; let show = false;
        if(window.filtroLojaAtual === "Promoções" && i.isPromo === true) show = true; else if(window.filtroLojaAtual === i.tipo) show = true; else if(window.filtroLojaAtual === "Tudo") show = true;

        if(show) {
            let promoTag = i.isPromo ? `<div class="shop-promo-tag">PROMO</div>` : '';
            let mC = window.isMaster ? `onclick="window.prepararEdicaoLoja('${k}')" class="shop-item master-edit" style="cursor:pointer;"` : `class="shop-item"`;
            b.innerHTML += `<div ${mC}>
                ${promoTag}
                <div class="shop-item-content">
                    <span style="font-size:10px;color:#aaa;">${window.iconesMercado[i.tipo]||''} [${i.w}x${i.h} | ${i.peso}kg | ${i.cd||0}s]</span>
                    <h3 class="neon-blue">${i.nome}</h3><p style="font-size:12px;color:#ccc;">${i.desc}</p>
                </div>
                <div class="shop-item-footer">
                    <h2 class="neon-green">${i.preco}¥</h2>
                    <button class="action-btn" onclick="window.comprarItem('${k}','${i.nome}',${i.preco},'${i.tipo}','${i.desc}', ${i.poder||0}, '${i.buffType||''}', ${i.w||1}, ${i.h||1}, ${i.extraW||0}, ${i.extraH||0}, ${i.peso||1}, ${i.cd||2}, event)">Comprar</button>
                </div>
            </div>`;
        }
    });
};
window.filtrarLoja = function(t, btn) { window.filtroLojaAtual = t; document.querySelectorAll(".shop-tab-btn").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); window.renderizarLojaUI(); };
window.navegarLoja = function(dir) { let grid = document.getElementById("shopGrid"); if(!grid) return; grid.scrollBy({ left: dir * (grid.clientWidth * 0.8), behavior: 'smooth' }); };
window.comprarItem = function(id, n, p, t, d, poder, buff, w, h, exW, exH, peso, cd, ev) {
    if(ev) ev.stopPropagation(); if(!window.jogadorAtual || window.isMaster) return; let c = window.usersGlobais[window.jogadorAtual].carteira||0; if(c<p) {window.showNeonToast("Sem Yenes.");return;}
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/carteira`).set(c-p);
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/mochila`).push({ id: id, nome: n, tipo: t, desc: d, poder: poder, buffType: buff, w:w, h:h, extraW:exW, extraH:exH, peso:peso, cd:cd, eq:false }); window.showNeonToast("Comprado!");
};

// ==========================================================
// 6. REDE SOCIAL, CHAT E NOTIFICAÇÕES (BLINDADO)
// ==========================================================

window.switchIGambleTab = function(tabId, btnEl) {
    document.querySelectorAll(".igamble-tab-btn").forEach(b => b.classList.remove("active")); if(btnEl) btnEl.classList.add("active");
    document.querySelectorAll(".igamble-view").forEach(v => v.classList.remove("active"));
    let target = document.getElementById("igamble-view-" + tabId); if(target) target.classList.add("active");
    
    // Limpa Notificações da Aba
    if(tabId === 'chat') window.marcarNotificacoesComoLidas('gchat');
    if(tabId === 'posts') window.marcarNotificacoesComoLidas('gpost');
    if(tabId === 'embates') window.marcarNotificacoesComoLidas('embates');

    if(tabId === "chat") setTimeout(() => { let cb = document.getElementById("chatMessages"); if(cb) cb.scrollTop = cb.scrollHeight; }, 50); 
    if(tabId === "posts") {
        setTimeout(() => {
            let feed = document.getElementById("igamblePostsFeed"); if(!feed || window.postAudioMuted) return;
            feed.querySelectorAll('.post-card').forEach(card => {
                let rect = card.getBoundingClientRect();
                if(rect.top >= -200 && rect.top <= (window.innerHeight / 2)) { let a = card.querySelector('audio.post-audio'); if(a) { a.volume = 1.0; a.play().catch(()=>{}); } }
                if(window.postObserver) { window.postObserver.unobserve(card); window.postObserver.observe(card); }
            });
        }, 100);
    } else {
        document.querySelectorAll('audio.post-audio').forEach(a => { a.pause(); a.currentTime = 0; });
    }
};

window.enviarMsgGamble = function() {
    try {
        if (!window.db || !window.jogadorAtual) return;
        const inp = document.getElementById("chatInputMsg"); const txt = (inp.value || "").trim(); if (!txt) return;
        let msgData = { nome: window.jogadorAtual, texto: txt, data: new Date().toLocaleTimeString(), ts: Date.now() };
        
        if (window.mensagemEmResposta) { msgData.replyTo = window.mensagemEmResposta.nome; msgData.replyText = window.mensagemEmResposta.texto; }
        
        window.db.ref("tokyoRpg/chat").push(msgData).then(() => {
            if(typeof window.dispatchMentions === "function") window.dispatchMentions({ from: window.jogadorAtual, contextType: "gchat", contextId: "", text: txt });
        });
        
        inp.value = ""; if(typeof window.cancelarResposta === "function") window.cancelarResposta();
    } catch (e) { console.error(e); }
};

window.enviarComentario = function() {
    if(!window.currentPostIdForComment || !window.jogadorAtual) return;
    let inp = document.getElementById("commentInput"); let txt = inp.value.trim(); if(!txt) return;
    window.db.ref(`tokyoRpg/posts/${window.currentPostIdForComment}/comentarios`).push({ autor: window.jogadorAtual, texto: txt, timestamp: Date.now() }).then(() => {
        inp.value = ""; window.closeMentionDropdown();
        if(typeof window.dispatchMentions === "function") window.dispatchMentions({ from: window.jogadorAtual, contextType: "gpost", contextId: window.currentPostIdForComment, text: txt });
    });
};

window.enviarNotificacao = function(alvo, contextType, from, text, contextId = "") {
    if (!window.db || !alvo || alvo === from) return;
    window.db.ref(`tokyoRpg/users/${alvo}/notificacoes`).push({ from: from, contextType: contextType, contextId: contextId, texto: text, lida: false, ts: Date.now() });
};

window.dispatchMentions = function({ from, contextType, contextId, text }) {
    try {
        if (!window.db || !text) return;
        let matches = text.match(/@([\w_]+)/g); if (!matches) return;
        let users = Object.keys(window.usersGlobais || {}); let mencionados = new Set();

        matches.forEach(m => {
            let nomeMencionadoOriginal = m.substring(1).replace(/_/g, ' '); 
            let usuarioReal = users.find(u => u.toLowerCase() === nomeMencionadoOriginal.toLowerCase());
            if (usuarioReal && usuarioReal !== from) mencionados.add(usuarioReal);
        });

        mencionados.forEach(alvo => { window.enviarNotificacao(alvo, contextType, from, "mencionou você", contextId); });
    } catch(e) {}
};

window.escutarNotificacoes = function() {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);

    notifRef.on('value', snap => {
        let data = snap.val() || {}; let nGchat = 0, nGpost = 0, nGchallenger = 0;
        Object.values(data).forEach(n => {
            if (!n.lida) { if (n.contextType === "gchat") nGchat++; if (n.contextType === "gpost") nGpost++; if (n.contextType === "embates") nGchallenger++; }
        });
        window.atualizarBadgesHUD(nGchat, nGpost, nGchallenger);
    });

    let readyToNotify = false;
    notifRef.limitToLast(1).on('child_added', snap => {
        if (!readyToNotify) return; 
        let n = snap.val(); if (!n || n.lida) return;
        if (Date.now() - n.ts > 15000) return; 
        window.showNeonToast(`🔔 @${n.from} marcou você!`);
    });
    setTimeout(() => { readyToNotify = true; }, 2000);
};

window.atualizarBadgesHUD = function(chat, post, challenger) {
    let total = chat + post + challenger;
    let bM = document.getElementById('badge-igamble-main'); if (bM) { bM.innerText = total; bM.style.display = total > 0 ? 'flex' : 'none'; }
    let bC = document.getElementById('badge-chat'); if (bC) { bC.innerText = chat; bC.style.display = chat > 0 ? 'flex' : 'none'; }
    let bP = document.getElementById('badge-posts'); if (bP) { bP.innerText = post; bP.style.display = post > 0 ? 'flex' : 'none'; }
    let bE = document.getElementById('badge-embates'); if (bE) { bE.innerText = challenger; bE.style.display = challenger > 0 ? 'flex' : 'none'; }
};

window.marcarNotificacoesComoLidas = function(cType) {
    if (!window.jogadorAtual || !window.db) return;
    let notifRef = window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/notificacoes`);
    notifRef.once('value', snap => {
        let data = snap.val(); if(!data) return; let updates = {};
        Object.keys(data).forEach(k => { if (data[k].contextType === cType && !data[k].lida) updates[`${k}/lida`] = true; });
        if (Object.keys(updates).length > 0) notifRef.update(updates);
    });
};

// ==========================================================
// 7. WEBRTC: CHAMADAS DE VOZ GAMBLENGER (BLINDADO)
// ==========================================================
window.rtcServers = { iceServers: [ { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }, { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' } ] };
window.rtcPeer = null; window.localStream = null; window.callIdAtual = null; window._escutaLigacaoAtiva = false; window.callStartTime = 0; window.quemTaLigando = null; 
window.audioContext = null; window.audioMeterInterval = null; window.callTimerInterval = null;

window.carregarContatosSMS = function() {
    let lista = document.getElementById("listaContatosSMS"); if(!lista || !window.usersGlobais || !window.jogadorAtual) return;
    lista.innerHTML = ""; let meusContatos = window.usersGlobais[window.jogadorAtual]?.contatos || {}; let contatosArray = Object.keys(meusContatos);
    if(window.isMaster) contatosArray = Object.keys(window.usersGlobais).filter(n => n !== "MESTRE" && n !== window.jogadorAtual);
    if(contatosArray.length === 0) { lista.innerHTML = `<div style="text-align:center; color:#555; font-size:10px; margin-top:20px;">Sua agenda está vazia.<br><br>Adicione o nº de alguém.</div>`; return; }

    contatosArray.forEach(n => {
        let u = window.usersGlobais[n]; if(!u) return; let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${n}`;
        let isSel = (window.contatoSmsAtual === n) ? "background:rgba(0, 229, 255, 0.2); border-left:3px solid var(--accent-blue);" : "background:#111; border-left:3px solid #333;";
        lista.innerHTML += `<div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-radius:4px; margin-bottom:5px; ${isSel}" onclick="window.abrirChatSMS('${n}')"><img src="${av}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid #555;"><div style="color:#fff; font-weight:bold; font-size:12px;">${n}</div></div>`;
    });
};

window.abrirChatSMS = function(contato) {
    window.contatoSmsAtual = contato;
    let headerName = document.getElementById("smsChatName"); let callBtn = document.getElementById("btnCallUI");
    if(headerName) headerName.innerText = "Criptografado: " + contato;
    if(callBtn) callBtn.style.display = "block"; 
    window.carregarContatosSMS(); window.renderizarSMSLog(); 
};

window.iniciarLigacao = async function() {
    if(!window.contatoSmsAtual) return; let alvo = window.contatoSmsAtual; let me = window.jogadorAtual;

    let inCallSnap = await window.db.ref(`tokyoRpg/users/${alvo}/inCall`).once('value');
    if (inCallSnap.val() === true) { window.showNeonToast(`❌ ${alvo} está ocupado!`); return; }

    window.db.ref(`tokyoRpg/users/${me}/inCall`).set(true);
    window.callIdAtual = [me, alvo].sort().join("_"); window.callStartTime = 0; window.quemTaLigando = alvo;

    if (!navigator.mediaDevices) { window.showNeonToast("❌ ERRO: Use HTTPS!"); window.encerrarLigacaoLimpo(); return; }

    try { window.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); } 
    catch(e) { window.showNeonToast("❌ Microfone bloqueado!"); window.encerrarLigacaoLimpo(); return; }

    window.rtcPeer = new RTCPeerConnection(window.rtcServers);
    window.localStream.getTracks().forEach(track => window.rtcPeer.addTrack(track, window.localStream));

    let remoteAudio = document.getElementById("remoteAudio");
    window.rtcPeer.ontrack = event => {
        let remoteStream = event.streams[0];
        if(remoteAudio) { remoteAudio.srcObject = remoteStream; remoteAudio.play().catch(e => {}); }
        window.setupAudioMeters(window.localStream, remoteStream);
    };

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);
    await callDoc.remove(); await callDoc.set({ from: me, to: alvo, status: "calling" });

    window.rtcPeer.onicecandidate = event => { if(event.candidate) callDoc.child('callerCandidates').push(event.candidate.toJSON()); };

    try {
        const offer = await window.rtcPeer.createOffer(); await window.rtcPeer.setLocalDescription(offer);
        await callDoc.update({ offer: { type: offer.type, sdp: offer.sdp } });
    } catch (err) {}

    window.db.ref(`tokyoRpg/users/${alvo}/incomingCall`).set({ from: me, callId: window.callIdAtual, ts: Date.now() });

    callDoc.child('answer').on('value', async snap => {
        let ans = snap.val();
        if(ans && window.rtcPeer && window.rtcPeer.signalingState !== "closed" && !window.rtcPeer.currentRemoteDescription) {
            try {
                await window.rtcPeer.setRemoteDescription(new RTCSessionDescription(ans));
                window.callStartTime = Date.now();
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

window.aceitarLigacao = async function() {
    let modal = document.getElementById("callModal"); if(modal) modal.style.display = "none";
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(true);

    if (!navigator.mediaDevices) { window.showNeonToast("❌ ERRO: Use HTTPS."); window.recusarLigacao(); return; }
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
        let offer = snap.val(); if(!offer) return;
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

window.recusarLigacao = function() {
    let modal = document.getElementById("callModal"); if(modal) modal.style.display = "none";
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

window.encerrarLigacao = function() {
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    if(window.contatoSmsAtual) window.db.ref(`tokyoRpg/users/${window.contatoSmsAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

window.encerrarLigacaoLimpo = function() {
    document.getElementById("callModal") && (document.getElementById("callModal").style.display = "none");
    document.getElementById("activeCallModal") && (document.getElementById("activeCallModal").style.display = "none");
    
    if(window.jogadorAtual) window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/inCall`).set(false);
    
    if(window.audioMeterInterval) clearInterval(window.audioMeterInterval);
    if(window.callTimerInterval) clearInterval(window.callTimerInterval);
    if(window.rtcPeer) { window.rtcPeer.close(); window.rtcPeer = null; }
    if(window.localStream) { window.localStream.getTracks().forEach(t => t.stop()); window.localStream = null; }

    let remoteAudio = document.getElementById("remoteAudio"); if(remoteAudio) remoteAudio.srcObject = null;
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`).off();
    window.callIdAtual = null; window.callStartTime = 0; window.quemTaLigando = null;
};

// ==========================================================
// 8. INITIALIZAÇÃO E FIREBASE ONLOAD
// ==========================================================
window.onload = function() {
    if (window.db) {
        window.carregarAvatares(); 
        
        window.db.ref('tokyoRpg/users').on('value', s => { 
            window.usersGlobais = s.val()||{}; 
            window.renderizarFicha(); window.renderizarMochila(); window.drawMapVisuals(); window.drawCasaBoard(); window.renderizarLojaUI(); window.updateTacticalBoard();
        });
        
        window.db.ref('tokyoRpg/submapConfig').on('value', s => { 
            window.submapasConfig = s.val() || {}; 
            if(window.currentSubMapKey) { window.initTacticalBoard(); window.updateTacticalBoard(); }
        });
        
        window.db.ref('tokyoRpg/submapsBGs').on('value', s => { 
            window.submapasBGs = s.val() || {}; 
            if(window.currentSubMapKey) { 
                let wrapper = document.getElementById("vttWorldWrapper"); 
                if(wrapper && window.submapasBGs[window.currentSubMapKey]) { wrapper.style.backgroundImage = `url("${window.submapasBGs[window.currentSubMapKey]}")`; wrapper.style.backgroundColor = "transparent"; } 
            }
        });

        window.db.ref('tokyoRpg/loja').on('value', s => { window.lojaGlobal = s.val() || {}; window.renderizarLojaUI(); window.renderizarMochila(); window.drawCasaBoard(); }); 
        window.db.ref('tokyoRpg/submaps').on('value', s => { window.submapasGlobais = s.val() || {}; window.updateTacticalBoard(); });
        window.db.ref('tokyoRpg/turnosVTT').on('value', s => { let d = s.val()||{}; window.turnosVTTGlobal = d[window.currentSubMapKey]||null; window.updateTacticalBoard(); });
        
        window.db.ref('tokyoRpg/chat').limitToLast(40).on('value', s => { 
            try {
                let d = s.val(); let b = document.getElementById("chatMessages"); if(!b) return; b.innerHTML=""; 
                if(d){ Object.keys(d).forEach(k => { 
                    let m = d[k]; let uData = window.usersGlobais[m.nome] || {}; 
                    let curAv = uData.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${m.nome}`; 
                    let textoBonito = (m.texto||"").replace(/@([\w_]+)/g, function(match, nomeMention) { return `<span style="color:var(--accent-blue); font-weight:bold;">@${nomeMention.replace(/_/g, ' ')}</span>`; });
                    b.innerHTML += `<div class="msg-box"><img src="${curAv}" class="msg-avatar"><div class="msg-content"><strong style="color:var(--accent-blue); font-size:14px;">${m.nome}</strong><p style="font-size:13px; line-height:1.4; margin-top:2px;">${textoBonito}</p></div></div>`; 
                }); b.scrollTop = b.scrollHeight; }
            } catch (err) {}
        });
    }
};

window.dispararLoadingLogin = async function(isS) {
    let n = document.getElementById("loginName").value.trim().toUpperCase(); let p = document.getElementById("loginPass").value; let s = document.getElementById("loginSerial").value.trim().toUpperCase();
    if(isS) { if(!s) return; s = s + "-DC1"; } if(!isS && (!n || !p)) return;
    window.setElDisplay('loginScreen', 'none'); window.setElDisplay('loadingTerminal', 'flex');
    let lines = [ "ESTABELECENDO CONEXÃO SECRETA...", "VERIFICANDO CREDENCIAIS...", "ACESSO CONCEDIDO." ]; let txt = "";
    for(let line of lines) { txt += line + "<br><br>"; window.setElHTML('loadingText', txt); await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); }
    window.setElDisplay('loadingTerminal', 'none');
    if(isS) window.logarComSerialFinal(s); else window.logarComSenhaFinal(n, p);
};

window.logarComSenhaFinal = function(n, s) { window.db.ref('tokyoRpg/users/' + n).once('value').then((snap) => { let ud = snap.val(); if(ud) { if (ud.senha !== s) { alert("Senha incorreta."); window.setElDisplay('loginScreen', 'block'); return; } window.logarSucesso(n, ud.serial); } else { let ns = Math.floor(1000 + Math.random()*9000)+"-DC1"; window.db.ref('tokyoRpg/users/' + n).set({ senha: s, serial: ns, carteira: 0, rpg: window.getSafeRpg(null), local: "p1" }); window.logarSucesso(n, ns); alert(`Criado.`); } }); };
window.logarComSerialFinal = function(s) { if(s === window.MASTER_SERIAL) { window.db.ref('tokyoRpg/users/MESTRE').update({ serial: window.MASTER_SERIAL, carteira: 9999999 }); window.logarSucesso("MESTRE", window.MASTER_SERIAL); return; } let achou = false; Object.keys(window.usersGlobais).forEach(n => { if(window.usersGlobais[n].serial === s) { achou = true; window.logarSucesso(n, s); }}); if(!achou) { alert("Serial não encontrado."); window.setElDisplay('loginScreen', 'block'); } };

window.logarSucesso = function(n, s) {
    window.jogadorAtual = n; window.serialAtual = s; window.isMaster = (s === window.MASTER_SERIAL); 
    window.setElDisplay("loginModal", "none"); window.setElDisplay("base-desktop", "flex"); window.setElDisplay("gameContainer", "none");
    window.renderizarFicha(); window.renderizarMochila(); window.renderizarLojaUI(); window.drawMapVisuals(); window.escutarNotificacoes();
    
    // Liga o Radar de Chamadas
    if(!window._escutaLigacaoAtiva) {
        window._escutaLigacaoAtiva = true;
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).on('value', snap => {
            let data = snap.val(); let modal = document.getElementById("callModal");
            if(!data) { if(modal) modal.style.display = "none"; return; }
            if(Date.now() - data.ts > 30000) return; 
            window.callIdAtual = data.callId; window.quemTaLigando = data.from;
            let u = window.usersGlobais[data.from] || {}; let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${data.from}`;
            let imgEl = document.getElementById("callModalAvatar"); if(imgEl) imgEl.src = av;
            let nameEl = document.getElementById("callModalName"); if(nameEl) nameEl.innerText = data.from;
            if(modal) modal.style.display = "block";
        });
    }
};

window.deslogar = function() { window.jogadorAtual = ""; window.serialAtual = ""; window.isMaster = false; window.setElVal("loginName", ""); window.setElVal("loginPass", ""); window.setElVal("loginSerial", ""); window.fecharCelular(); window.setElDisplay('gameContainer', 'none'); window.setElDisplay('base-desktop', 'none'); window.setElDisplay("loginModal", "flex"); };
