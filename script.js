// =========================================================
// SISTEMA DE VOICE CHAT: ANTI-FIREWALL COM SERVIDOR TURN (RELAY)
// =========================================================

window.rtcPeer = null;
window.localStream = null;
window.callIdAtual = null;
window._escutaLigacaoAtiva = false;
window.callStartTime = 0; 
window.quemTaLigando = null; 

// CONFIGURAÇÃO BLINDADA: STUN (P2P) + TURN (SERVIDOR NA NUVEM)
const rtcServers = { 
    iceServers: [
        // Plano A: Tenta conexão direta (Rápida e leve)
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        // Plano B: Se o 4G/Firewall bloquear, usa esse servidor central (Relay)
        { 
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        { 
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        { 
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        }
    ] 
};

// --- FUNÇÃO PARA GERAR O LOG NO CHAT ---
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
    window.db.ref(`tokyoRpg/smsChats/${chatId}`).push({
        de: window.jogadorAtual,
        para: alvo,
        msg: msg,
        data: new Date().toLocaleTimeString().substring(0, 5),
        ts: Date.now()
    });
};

// 1. FAZER A LIGAÇÃO
window.iniciarLigacao = async function() {
    if(!window.contatoSmsAtual) return;
    let alvo = window.contatoSmsAtual;
    let me = window.jogadorAtual;
    window.callIdAtual = [me, alvo].sort().join("_");
    window.callStartTime = 0; 
    window.quemTaLigando = alvo;

    let remoteAudio = document.getElementById("remoteAudio");
    if(remoteAudio) remoteAudio.play().catch(e => {});

    let callBtn = document.getElementById("btnCallUI");
    callBtn.innerText = "🔴 Desligar";
    callBtn.style.borderColor = "#f00"; callBtn.style.color = "#f00";
    callBtn.onclick = window.encerrarLigacao;

    window.showNeonToast(`📞 Ligando para ${alvo}...`);

    try {
        window.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch(e) {
        window.showNeonToast("Erro: Permita o microfone no navegador!");
        window.encerrarLigacaoLimpo(); return;
    }

    window.rtcPeer = new RTCPeerConnection(rtcServers);
    window.localStream.getTracks().forEach(track => window.rtcPeer.addTrack(track, window.localStream));

    window.rtcPeer.ontrack = event => {
        if(remoteAudio) {
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play().catch(e => console.log(e));
        }
    };

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);
    await callDoc.remove(); 
    await callDoc.set({ from: me, to: alvo, status: "calling" });

    window.rtcPeer.onicecandidate = event => {
        if(event.candidate) callDoc.child('callerCandidates').push(event.candidate.toJSON());
    };

    const offer = await window.rtcPeer.createOffer();
    await window.rtcPeer.setLocalDescription(offer);
    await callDoc.update({ offer: { type: offer.type, sdp: offer.sdp } });

    window.db.ref(`tokyoRpg/users/${alvo}/incomingCall`).set({ from: me, callId: window.callIdAtual, ts: Date.now() });

    callDoc.child('answer').on('value', async snap => {
        let ans = snap.val();
        if(ans && window.rtcPeer && !window.rtcPeer.currentRemoteDescription) {
            await window.rtcPeer.setRemoteDescription(new RTCSessionDescription(ans));
            window.showNeonToast("✅ Ligação Atendida!");
            window.callStartTime = Date.now();

            callDoc.child('calleeCandidates').on('child_added', snapIce => {
                let candidate = snapIce.val();
                if(candidate && window.rtcPeer) window.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
            });
        }
    });

    callDoc.child('status').on('value', snap => {
        if(snap.val() === "ended") window.encerrarLigacaoLimpo();
    });
};

// 2. RADAR DE TOQUE DO CELULAR
setInterval(() => {
    if(window.jogadorAtual && window.db && !window._escutaLigacaoAtiva) {
        window._escutaLigacaoAtiva = true;
        
        window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).on('value', snap => {
            let data = snap.val();
            let modal = document.getElementById("callModal");
            
            if(!data) { 
                if(modal) modal.style.display = "none";
                return;
            }
            if(Date.now() - data.ts > 30000) return; 

            window.callIdAtual = data.callId;
            window.quemTaLigando = data.from;
            
            let u = window.usersGlobais[data.from] || {};
            let av = u.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${data.from}`;
            let imgEl = document.getElementById("callModalAvatar");
            if(imgEl) imgEl.src = av;
            
            document.getElementById("callModalName").innerText = data.from;
            if(modal) modal.style.display = "block";
        });
    }
}, 2000);

// 3. ATENDER LIGAÇÃO
window.aceitarLigacao = async function() {
    document.getElementById("callModal").style.display = "none";

    let remoteAudio = document.getElementById("remoteAudio");
    if(remoteAudio) remoteAudio.play().catch(e => {});

    let callBtn = document.getElementById("btnCallUI");
    if(callBtn) {
        callBtn.style.display = "block";
        callBtn.innerText = "🔴 Desligar";
        callBtn.style.borderColor = "#f00"; callBtn.style.color = "#f00";
        callBtn.onclick = window.encerrarLigacao;
    }

    try {
        window.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch(e) {
        window.showNeonToast("Microfone bloqueado! Autorize no navegador."); window.recusarLigacao(); return;
    }

    window.rtcPeer = new RTCPeerConnection(rtcServers);
    window.localStream.getTracks().forEach(track => window.rtcPeer.addTrack(track, window.localStream));

    window.rtcPeer.ontrack = event => {
        if(remoteAudio) {
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play().catch(e => console.log(e));
        }
    };

    let callDoc = window.db.ref(`tokyoRpg/calls/${window.callIdAtual}`);

    window.rtcPeer.onicecandidate = event => {
        if(event.candidate) callDoc.child('calleeCandidates').push(event.candidate.toJSON());
    };

    callDoc.child('offer').once('value', async snap => {
        let offer = snap.val();
        if(!offer) return;

        await window.rtcPeer.setRemoteDescription(new RTCSessionDescription(offer));

        callDoc.child('callerCandidates').on('child_added', snapIce => {
            let candidate = snapIce.val();
            if(candidate && window.rtcPeer) window.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
        });

        const answer = await window.rtcPeer.createAnswer();
        await window.rtcPeer.setLocalDescription(answer);

        await callDoc.update({
            answer: { type: answer.type, sdp: answer.sdp },
            status: "answered"
        });

        window.callStartTime = Date.now(); 
    });

    callDoc.child('status').on('value', snap => {
        if(snap.val() === "ended") window.encerrarLigacaoLimpo();
    });

    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
};

// 4. RECUSAR LIGAÇÃO
window.recusarLigacao = function() {
    document.getElementById("callModal").style.display = "none";
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    
    window.enviarLogChamada("recusada");
    window.db.ref(`tokyoRpg/users/${window.jogadorAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 5. DESLIGAR
window.encerrarLigacao = function() {
    if(window.callIdAtual) window.db.ref(`tokyoRpg/calls/${window.callIdAtual}/status`).set("ended");
    
    if(window.callStartTime > 0) {
        window.enviarLogChamada("finalizada");
    } else {
        window.enviarLogChamada("cancelada");
    }

    if(window.contatoSmsAtual) window.db.ref(`tokyoRpg/users/${window.contatoSmsAtual}/incomingCall`).remove();
    window.encerrarLigacaoLimpo();
};

// 6. LIMPEZA TOTAL DA CHAMADA
window.encerrarLigacaoLimpo = function() {
    let modal = document.getElementById("callModal");
    if(modal) modal.style.display = "none";
    
    if(window.rtcPeer) { window.rtcPeer.close(); window.rtcPeer = null; }
    if(window.localStream) { window.localStream.getTracks().forEach(t => t.stop()); window.localStream = null; }

    let remoteAudio = document.getElementById("remoteAudio");
    if(remoteAudio) remoteAudio.srcObject = null;

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
    window.showNeonToast("Ligação encerrada.");
};
