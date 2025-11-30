
function openMenu() { document.getElementById("menu_aba").style.display = "block"; }
function closeMenu() { document.getElementById("menu_aba").style.display = "none"; }


  document.getElementById("close-badge").onclick = () => {
    document.getElementById("repo-badge").style.display = "none";
  };
function temaLim() {
    document.documentElement.style.setProperty('--cor-click', '#38184C');
    document.documentElement.style.setProperty('--cor-sombra', '#9b0a59');
    document.documentElement.style.setProperty('--cor-text', 'black');
    document.documentElement.style.setProperty('--cor-back1', '#CEF09D');
}
function temaInatel() {
    document.documentElement.style.setProperty('--cor-click', '#126ae2');
    document.documentElement.style.setProperty('--cor-sombra', '#0a599b');
    document.documentElement.style.setProperty('--cor-text', 'black');
    document.documentElement.style.setProperty('--cor-back1', '#edf2f4');
}
function temaDark() {
    const cores = {
        '--cor-click': '#CEF09D',
        '--cor-sombra': '#9b0a59',
        '--cor-text': 'white', 
        '--cor-back1': '#38184C',
    };
    for (const [variavel, valor] of Object.entries(cores)) {
        document.documentElement.style.setProperty(variavel, valor);
    }
}


class Armario {
    constructor(id, local, projeto, status, data_renovacao, pendencia = false) {
        this.id = id;
        this.local = local;
        this.projeto = projeto;
        this.status = status;
        this.data_renovacao = data_renovacao;
        this.pendencia = pendencia;
    }
}

class Aluno {
    constructor(nome, matricula) {
        this.nome = nome;
        this.matricula = matricula;
    }
}

class GerenciadorArmarios {
    constructor(totalLockers, usuario) {
        this.totalLockers = totalLockers;
        this.usuario = usuario;
        this.armarios = this._carregarDadosIniciais();
    }

    _carregarDadosIniciais() {
        return [
            new Armario(101, 'Fab Lab Principal', 'Tese Pós-Graduação', 'reservado', '2026-03-15', false),
            new Armario(102, 'Fab Lab Principal', 'Projeto Interdisciplinar IHM', 'pendente_renovacao', '2025-11-06', false),
            new Armario(103, 'Laboratório X', 'Hardware Teste', 'reservado', '2025-12-01', true)
        ];
    }
    
    getArmariosDisponiveisCount() {
        return this.totalLockers - this.armarios.length;
    }
    
    getArmariosDoUsuario() {
        return this.armarios.filter(a => a.status === 'reservado' || a.status === 'pendente_renovacao');
    }
    
    solicitarNovoArmario(projeto, tempoEmDias) {
        if (!projeto) {
            return { success: false, message: 'ERRO: Preencha o nome do projeto (Campo obrigatório para utilização do Fab Lab).' };
        }
        
        if (this.getArmariosDisponiveisCount() <= 0) {
            return { success: false, message: 'ERRO: Não há armários disponíveis neste momento. Tente novamente mais tarde.' };
        }

        const novoId = Math.max(...this.armarios.map(a => a.id)) + 1;
        const novaData = new Date();
        novaData.setDate(novaData.getDate() + parseInt(tempoEmDias));

        const novoArmario = new Armario(
            novoId,
            'Fab Lab Principal',
            projeto,
            'reservado',
            this._formatDate(novaData),
            false
        );

        this.armarios.push(novoArmario);
        
        return { 
            success: true, 
            message: `SUCESSO: Armário #${novoId} (Projeto: ${projeto}) reservado por ${tempoEmDias} dias. Seu acesso RFID está ativo.` 
        };
    }
    
    renovarArmario(id) {
        const armario = this.armarios.find(a => a.id == id);
        if (!armario) {
            return { success: false, message: `ERRO: Armário com ID ${id} não encontrado.` };
        }

        if (armario.pendencia) {
            return { success: false, message: `ERRO: Não é possível renovar o armário #${id} devido a pendências. Resolva a pendência no financeiro.` };
        }

        const novaData = new Date();
        novaData.setDate(novaData.getDate() + 15);
        armario.data_renovacao = this._formatDate(novaData);
        armario.status = 'reservado';

        return { 
            success: true, 
            message: `SUCESSO: Armário #${id} (Projeto: ${armario.projeto}) renovado digitalmente até ${armario.data_renovacao}.`
        };
    }

    _formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}



class ArmarioComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.gerenciador = new GerenciadorArmarios(10, new Aluno("Julio Cesar", "253"));
    }

    connectedCallback() {
        this.render();
    }
    
    render() {
        const armariosDoUsuario = this.gerenciador.getArmariosDoUsuario();
        const armariosDisponiveisCount = this.gerenciador.getArmariosDisponiveisCount();
        
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos (mantidos como estavam, omitidos para brevidade) */
                .comp-armario { background-color: white; padding: 15px; margin: 0; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); color: var(--cor-text); font-family: 'Arimo', sans-serif; margin: 20px;}
                .titulo-funcionalidade { font-size: 18px; font-weight: bold; margin-bottom: 15px; padding-bottom: 5px; color: var(--cor-text); }
                .armario-card { padding: 12px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #fafafa; }
                .armario-card h3 { margin: 0; font-size: 14px; color: var(--cor-click); }
                .armario-card p { margin: 3px 0; font-size: 11px; }
                .status-reservado { color: var(--cor-sucesso, #28a745); font-weight: bold; }
                .status-pendente { color: var(--cor-alerta, #ffc107); font-weight: bold; }
                .status-bloqueado { color: var(--cor-erro, #dc3545); font-weight: bold; }
                .status-disponivel-box { text-align: center; background-color: var(--cor-back1, #edf2f4); padding: 10px; border-radius: 5px; font-weight: bold; color: var(--cor-text); }
                .action-button { background-color: var(--cor-click, #126ae2); color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; min-width: 100px; }
                .action-button:disabled { background-color: #ccc; cursor: not-allowed; }
                .feedback-message { margin-top: 10px; padding: 8px; border-radius: 4px; font-weight: bold; display: none; }
                .feedback-success { background-color: #d4edda; color: var(--cor-sucesso); }
                .feedback-error { background-color: #f8d7da; color: var(--cor-erro); }
                .form-field { margin-bottom: 15px; }
                .form-field input, .form-field select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-family: 'Arimo', sans-serif; margin-top: 5px; }
                .form-field label { font-size: 14px; }
            </style>
            
            <div class="comp-armario">
                <h2>Meus Armários</h2>
                
                ${armariosDoUsuario.length === 0 ? `<p>Você não possui armários reservados.</p>` : armariosDoUsuario.map(armario => {
                    const isPendente = armario.status === 'pendente_renovacao';
                    const isBloqueado = armario.pendencia;
                    const statusClass = isBloqueado ? 'status-bloqueado' : (isPendente ? 'status-pendente' : 'status-reservado');
                    const statusText = isBloqueado ? 'BLOQUEADO (PENDÊNCIA)' : (isPendente ? 'RENOVAR AGORA!' : 'Reservado e Ativo');
                    const buttonDisabled = !isPendente || isBloqueado;
                    const buttonText = isBloqueado ? 'Pendência' : (isPendente ? 'Renovar Chave' : 'Ativo');

                    return `
                        <div class="armario-card">
                            <div>
                                <h3>${armario.projeto}</h3>
                                <p>Armário: <strong>#${armario.id} (${armario.local})</strong></p>
                                <p>Status: <span class="${statusClass}">${statusText}</span></p>
                                <p>Validade: <strong>${armario.data_renovacao}</strong></p>
                            </div>
                            <button class="action-button renew-btn" data-id="${armario.id}" ${buttonDisabled ? 'disabled' : ''}>
                                ${buttonText}
                            </button>
                        </div>
                    `;
                }).join('')}

                <h2>Solicitar Novo Armário</h2>
                <div class="status-disponivel-box">
                    Armários Disponíveis: <strong>${armariosDisponiveisCount}/${this.gerenciador.totalLockers} vagas.</strong>
                </div>
                
                <div id="solicitar-form">
                    <div class="form-field">
                        <label for="tempo">Período de Uso:</label>
                        <select id="tempo">
                            <option value="7">7 dias (Padrão)</option>
                            <option value="15">15 dias (Máximo)</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="projeto">Nome do Projeto (Necessário para Fab Lab):</label>
                        <input type="text" id="projeto" placeholder="Ex: Projeto Fetin 2026" required>
                    </div>
                    <button class="action-button solicitacao-btn" ${armariosDisponiveisCount <= 0 ? 'disabled' : ''}>
                        Solicitar Chave Digital
                    </button>
                    <div id="feedback" class="feedback-message"></div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        this.shadowRoot.querySelectorAll('.renew-btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleRenovacao(e.target.dataset.id));
        });

        this.shadowRoot.querySelector('.solicitacao-btn').addEventListener('click', () => this.handleSolicitacao());
    }
    
    handleRenovacao(id) {
        const resultado = this.gerenciador.renovarArmario(id);
        this._exibirFeedback(resultado.message, resultado.success);
        
        if (resultado.success) {
            this.render();
        }
    }

    handleSolicitacao() {
        const projetoInput = this.shadowRoot.getElementById('projeto');
        const tempo = this.shadowRoot.getElementById('tempo').value;
        const projeto = projetoInput.value.trim();
        
        const resultado = this.gerenciador.solicitarNovoArmario(projeto, tempo);
        this._exibirFeedback(resultado.message, resultado.success);
        
        if (resultado.success) {
            projetoInput.value = '';
            this.render();
        }
    }
    
    _exibirFeedback(mensagem, sucesso) {
        const feedbackEl = this.shadowRoot.getElementById('feedback');
        feedbackEl.textContent = mensagem;
        feedbackEl.className = `feedback-message ${sucesso ? 'feedback-success' : 'feedback-error'}`;
        feedbackEl.style.display = 'block';
    }
}

customElements.define('armario-component', ArmarioComponent);
