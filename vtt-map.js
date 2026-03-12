// ====================================================
// MÓDULO: GAMBLE MAPS VTT (Lógica Isolada e Blindada)
// ====================================================
window.VTT_CELL_SIZE = 50; 
window.dmPropsCache = window.dmPropsCache || [];
window.submapasConfig = window.submapasConfig || {};

// Boot Seguro - Aguarda a Base de Dados
let vttBootInterval = setInterval(() => {
    if (window.db && window.jogadorAtual) {
        clearInterval(vttBootInterval);
        
        window.db.ref('tokyoRpg/submapConfig').on('value', s => { 
            window.submapasConfig = s.val() || {}; 
            if(window.currentSubMapKey && document.getElementById('tab-mapa').style.display === 'block') { 
                window.initTacticalBoard(); 
                window.updateTacticalBoard(); 
            }
        });
        
        window.db.ref('tokyoRpg/submapsBGs').on('value', s => { 
            window.submapasBGs = s.val() || {}; 
            if(window.currentSubMapKey) { 
                let wrapper = document.getElementById("vttWorldWrapper"); 
                if(wrapper && window.submapasBGs[window.currentSubMapKey]) { 
                    wrapper.style.backgroundImage = `url("${window.submapasBGs[window.currentSubMapKey]}")`; 
                } 
            }
        });

        window.db.ref('tokyoRpg/submaps').on('value', s => { 
            window.submapasGlobais = s.val() || {}; 
            if(document.getElementById('tab-mapa').style.display === 'block') window.updateTacticalBoard(); 
        });
        
        window.db.ref('tokyoRpg/turnosVTT').on('value', s => { 
            let d = s.val()||{}; 
            window.turnosVTTGlobal = d[window.currentSubMapKey]||null; 
            if(document.getElementById('tab-mapa').style.display === 'block') window.updateTacticalBoard(); 
        });
    }
}, 1000);

// --- NAVEGAÇÃO DE MAPAS BLINDADA ---
// Substitui a chamada padrão do sistema base e força o mapa a obedecer ao display
window.desenharMapa = function() {
    let tabMapa = document.getElementById("tab-mapa");
    if(tabMapa) tabMapa.style.display = "block"; // Força a aba ser visível APENAS AQUI

    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "block";
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "none";
    if(!mc) return; mc.innerHTML = "";
    
    // Conexões
    let svg = `<svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2;">`;
    window.conexoesMapa.forEach(c => { let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; if(p1&&p2) svg += `<line x1="${p1.x}%" y1="${p1.y}%" x2="${p2.x}%" y2="${p2.y}%" stroke="var(--accent-blue)" stroke-width="2" opacity="0.6"/>`; });
    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus?.includes("Gaia"));
    if(isGaia || window.isMaster) window.rotasSecretasGaia.forEach(c => { let p1=window.locaisMapa[c.de]; let p2=window.locaisMapa[c.para]; if(p1&&p2) svg += `<line x1="${p1.x}%" y1="${p1.y}%" x2="${p2.x}%" y2="${p2.y}%" stroke="#00ff00" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>`; });
    svg += `</svg>`;
    
    mc.innerHTML = svg;
    
    Object.keys(window.locaisMapa).forEach(key => {
        let loc = window.locaisMapa[key];
        let node = document.createElement("div"); 
        node.className = "map-node"; node.style.left = loc.gx || loc.x + "%"; node.style.top = loc.gy || loc.y + "%";
        node.innerHTML = `<span class="node-label">${loc.nome}</span>`; 
        node.onclick = () => window.abrirSubMapa(key);
        mc.appendChild(node);
    });
};

window.abrirSubMapa = function(localKey) {
    window.currentSubMapKey = localKey;
    
    // Garante que a tab inteira do mapa está visível
    let tabMapa = document.getElementById("tab-mapa");
    if(tabMapa) tabMapa.style.display = "block";

    let mc = document.getElementById("mapCanvas"); if(mc) mc.style.display = "none";
    let sc = document.getElementById("subMapCanvas"); if(sc) sc.style.display = "flex";

    let loc = window.locaisMapa[localKey] || { nome: localKey.replace(/_/g, " ") };
    let titleEl = document.getElementById("subMapTitle"); if(titleEl) titleEl.innerText = loc.nome;

    let bgUrl = window.submapasBGs[localKey] || "";
    let wrapper = document.getElementById("vttWorldWrapper");
    if(wrapper) { wrapper.style.backgroundImage = bgUrl ? `url('${bgUrl}')` : "none"; }
    
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
};

window.mudarBgSubMapa = function() {
    let url = document.getElementById("vttBgInp").value;
    if(window.db && window.currentSubMapKey) { window.db.ref(`tokyoRpg/submapsBGs/${window.currentSubMapKey}`).set(url); window.showNeonToast("Fundo Salvo!"); }
};

window.salvarFormatoMapa = function() {
    if(!window.isMaster || !window.currentSubMapKey) return;
    let cols = parseInt(document.getElementById("vttColsInp").value) || 16; let rows = parseInt(document.getElementById("vttRowsInp").value) || 12; let shape = document.getElementById("vttShapeInp").value || "quadrado";
    window.db.ref(`tokyoRpg/submapConfig/${window.currentSubMapKey}`).update({ cols: cols, rows: rows, shape: shape });
    window.showNeonToast(`Terreno alterado para ${cols}x${rows}!`);
};

// --- RENDERIZAÇÃO DO TABULEIRO E PROPS ---
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
                            } catch(err) {}
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
        
        let px = -1, py = -1;
        Object.keys(grid).forEach(cid => { if(grid[cid] === window.jogadorAtual) { let parts = cid.split("_"); px = parseInt(parts[0]); py = parseInt(parts[1]); } });

        // Highlight do alcance
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                let cell = document.getElementById(`cell_${x}_${y}`);
                if(cell && !cell.classList.contains("hidden-vtt-cell")) {
                    cell.classList.remove("in-range", "in-range-blocked");
                    let isObs = conf.cells && conf.cells[`${x}_${y}`] ? conf.cells[`${x}_${y}`].obs : false;
                    let isGaia = (window.usersGlobais[window.jogadorAtual]?.deus && window.usersGlobais[window.jogadorAtual].deus.includes("Gaia"));
                    let canWalk = !isObs || isGaia || window.isMaster;
                    if(px !== -1 && py !== -1 && window.movimentosRestantes > 0) {
                        let dist = Math.max(Math.abs(x - px), Math.abs(y - py));
                        if(dist > 0 && dist <= window.movimentosRestantes && !grid[`${x}_${y}`]) {
                            if(canWalk) cell.classList.add("in-range"); else cell.classList.add("in-range-blocked");
                        }
                    }
                }
            }
        }

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
        
        let tBar = document.getElementById("turnOrderUI"); let btnP = document.getElementById("btnPassTurno");
        if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0) {
            if(tBar) { tBar.style.display="flex"; tBar.innerHTML=""; }
            if(btnP) btnP.style.display="inline-block";
            window.turnosVTTGlobal.ordem.forEach((n,i) => { if(tBar) tBar.innerHTML+=`<img src="${window.usersGlobais[n]?.avatarUrl||'https://api.dicebear.com/9.x/adventurer/svg?seed='+n}" class="turn-avatar ${i===window.turnosVTTGlobal.atual?'active':''}" title="${n}">`; });
        } else { 
            if(tBar) tBar.style.display="none"; 
            if(btnP) btnP.style.display="none"; 
        }

    } catch(e) { console.error(e); }
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
        if(dist > window.movimentosRestantes) return; 
        if(isObs && !isGaia) { window.showNeonToast("Obstáculo!"); return; }
        window.movimentosRestantes -= dist; window.setElText("movRestantes", `Passos Livres: ${window.movimentosRestantes}`);
    } else if (isObs && !isGaia && !window.isMaster) {
        window.showNeonToast("Obstáculo!"); return;
    }

    let up = {}; Object.keys(grid).forEach(k => { if(grid[k]===window.jogadorAtual) up[k] = null; }); up[`${x}_${y}`] = window.jogadorAtual;
    window.db.ref(`tokyoRpg/submaps/${window.currentSubMapKey}`).update(up);
};

// --- MOCHILA TETRIS DO MESTRE ---
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

// Movimentação RPG
window.rolarDadoMovimento = function() {
    if(!window.jogadorAtual) return;
    if(window.turnosVTTGlobal && window.turnosVTTGlobal.ordem && window.turnosVTTGlobal.ordem.length>0 && window.turnosVTTGlobal.ordem[window.turnosVTTGlobal.atual] !== window.jogadorAtual && !window.isMaster) { window.showNeonToast("Não é seu turno!"); return; }
    let roll = Math.floor(Math.random()*4)+1; 
    window.movimentosRestantes = roll; // Aqui pode cruzar com o peso depois se precisar
    window.setElText("movRestantes", `Passos Livres: ${window.movimentosRestantes}`);
    if(window.mostrarDadoOverlay) window.mostrarDadoOverlay(window.jogadorAtual, "Movimento", [roll], 4);
    window.updateTacticalBoard();
};

window.iniciarIniciativaVTT = function() {
    if(!window.isMaster) return;
    let onGrid = Object.values(window.submapasGlobais[window.currentSubMapKey]||{}).filter(x=>x!=="MESTRE");
    if(onGrid.length===0) { alert("Ninguém no grid!"); return; }
    let ini = []; onGrid.forEach(n => { let r=Math.floor(Math.random()*20)+1; let agi = (window.usersGlobais[n]?.rpg?.agi || 1); let sum = r+agi; ini.push({n:n, v:sum}); });
    ini.sort((a,b)=>b.v-a.v); window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}`).set({ordem: ini.map(x=>x.n), atual:0});
    window.showNeonToast("Turnos Definidos!");
};
window.passarTurnoVTT = function() {
    if(!window.turnosVTTGlobal) return;
    window.db.ref(`tokyoRpg/turnosVTT/${window.currentSubMapKey}/atual`).set((window.turnosVTTGlobal.atual+1)%window.turnosVTTGlobal.ordem.length);
    window.movimentosRestantes = 0; window.setElText("movRestantes", "Passos Livres: 0");
};
