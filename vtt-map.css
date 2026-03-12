/* ====================================================
   MÓDULO: GAMBLE MAPS VTT (Estilos Isolados)
   ==================================================== */

/* --- Células do Tabuleiro --- */
.tactical-cell {
    border: 1px solid rgba(0, 0, 0, 0.7); 
    background-color: rgba(0, 0, 0, 0.4); 
    box-sizing: border-box;
    transition: background-color 0.2s;
    position: relative; /* Segura os props arrastados */
}
.tactical-cell:hover {
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid #fff;
    cursor: pointer;
}
.hidden-vtt-cell {
    visibility: hidden !important;
    pointer-events: none !important;
    border: none !important;
    background: transparent !important;
}

/* --- Estados Táticos --- */
.tactical-cell.in-range { background: rgba(0, 255, 100, 0.25); box-shadow: inset 0 0 15px rgba(0, 255, 100, 0.6); border: 1px dashed #0f0; z-index: 3;}
.tactical-cell.in-range-blocked { background: rgba(255, 26, 85, 0.25); box-shadow: inset 0 0 15px rgba(255, 26, 85, 0.6); cursor: not-allowed; border: 1px dashed #f00; z-index: 3;}
.cell-obstacle { background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255, 26, 85, 0.3) 5px, rgba(255, 26, 85, 0.3) 10px); border: 1px solid rgba(255, 26, 85, 0.5); cursor: not-allowed;}
.cell-obstacle-gaia { border-color: #00ff00 !important; cursor: crosshair !important; box-shadow: inset 0 0 10px rgba(0,255,0,0.2);}

/* --- Tokens (Jogadores) --- */
.tactical-token {
    position: absolute;
    background-size: cover;
    border-radius: 50%;
    border: 2px solid #00ff00;
    box-shadow: 0 0 15px #00ff00;
    transition: left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    pointer-events: none;
    z-index: 10;
}

/* --- Itens Tetris do Mestre (Props) --- */
.prop-container {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    display: flex; justify-content: center; align-items: center;
    z-index: 5; cursor: grab;
}
.prop-container:active { cursor: grabbing; }

.prop-controls {
    display: none;
    position: absolute;
    top: -45px; left: 50%; transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--accent-blue);
    border-radius: 8px;
    padding: 8px 15px; gap: 15px; font-size: 18px;
    z-index: 9999; white-space: nowrap; pointer-events: auto;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.8);
}
.prop-container:hover .prop-controls { display: flex; }
.prop-controls span { cursor: pointer; transition: 0.2s; }
.prop-controls span:hover { color: var(--accent-red); transform: scale(1.3); }

/* --- Barra de Turnos --- */
.turn-order-bar { display:flex; gap:10px; overflow-x:auto; background:rgba(0,0,0,0.8); padding:5px; border:1px solid var(--accent-red); border-radius: 4px; }
.turn-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #555; opacity: 0.5; transition: 0.3s; flex-shrink: 0; }
.turn-avatar.active { border-color: #00ff00; opacity: 1; box-shadow: 0 0 15px #00ff00; transform: scale(1.1); }
