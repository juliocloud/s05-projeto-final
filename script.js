// Funções básicas de controle de tema/menu (mantidas dos exemplos de snippet)
function openMenu() { document.getElementById("menu_aba").style.display = "block"; } [18-20]
function closeMenu() { document.getElementById("menu_aba").style.display = "none"; } [18, 19, 21]
function temaLim() { 
    document.documentElement.style.setProperty('--cor-click', '#38184C'); 
    document.documentElement.style.setProperty('--cor-sombra', '#9b0a59'); 
    document.documentElement.style.setProperty('--cor-text', 'black'); 
    document.documentElement.style.setProperty('--cor-back1', '#CEF09D'); 
    // Outras propriedades... 
} [18, 19, 21]
function temaInatel() { 
    document.documentElement.style.setProperty('--cor-click', '#126ae2'); 
    document.documentElement.style.setProperty('--cor-sombra', '#0a599b'); 
    document.documentElement.style.setProperty('--cor-text', 'black'); 
    document.documentElement.style.setProperty('--cor-back1', '#edf2f4'); 
} [18, 19, 22]
function temaDark() { 
    const cores = { 
        '--cor-click': '#CEF09D', 
        '--cor-sombra': '#9b0a59', 
        '--cor-text': 'black', 
        '--cor-back1': '#38184C', 
    }; 
    for (const [variavel, valor] of Object.entries(cores)) { 
        document.documentElement.style.setProperty(variavel, valor); 
    } 
} [19, 23, 24]

class ArmarioComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.totalLockers = 10;
        
        this.usuario = { nome: "Julio Cesar", matricula: "253" };

        this.armarios = [
            { id: 101, local: 'Fab Lab Principal', projeto: 'Tese Pós-Graduação', status: 'reservado', data_renovacao: '2026-03-15', pendencia: false },
            { id: 102, local: 'Fab Lab Principal', projeto: 'Projeto Interdisciplinar IHM', status: 'pendente_renovacao', data_renovacao: '2025-11-06', pendencia: false }, 
            { id: 103, local: 'Laboratório X', projeto: 'Hardware Teste', status: 'reservado', data_renovacao: '2025-12-01', pendencia: true } 
        ];
    }

    connectedCallback() {
        this.render();
    }

    formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        const armariosEmUso = this.armarios.length;
        const armariosDisponiveisCount = this.totalLockers - armariosEmUso;
        const armariosDoUsuario = this.armarios.filter(a => a.status === 'reservado' || a.status === 'pendente_renovacao');
        
        // estilos inseridos no dom
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos copiados do style.css para o Shadow DOM */
                .comp-armario { 
                    background-color: white; padding: 15px; margin: 0; 
                    border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                    color: black; font-family: 'Arimo', sans-serif;
                }
                .titulo-funcionalidade {
                    font-size: 18px; font-weight: bold; margin-bottom: 15px;
                    padding-bottom: 5px; color: black;
                }
                .armario-card {
                    padding: 12px; margin-bottom: 12px; border-radius: 8px;
                    border: 1px solid #ddd; display: flex; justify-content: space-between;
                    align-items: center; background-color: #fafafa;
                }
                .armario-card h3 { margin: 0; font-size: 14px; color: var(--cor-click); }
                .armario-card p { margin: 3px 0; font-size: 11px; }
                .status-reservado { color: var(--cor-sucesso, #28a745); font-weight: bold; }
                .status-pendente { color: var(--cor-alerta, #ffc107); font-weight: bold; }
                .status-bloqueado { color: var(--cor-erro, #dc3545); font-weight: bold; }
                .status-disponivel-box {
                    text-align: center; background-color: var(--cor-back1, #edf2f4);
                    padding: 10px; border-radius: 5px; font-weight: bold; color: black;
                }
                .action-button {
                    background-color: var(--cor-click, #126ae2); color: white;
                    border: none; padding: 8px 12px; border-radius: 4px;
                    cursor: pointer; font-size: 13px; min-width: 100px;
                }
                .action-button:disabled { background-color: #ccc; cursor: not-allowed; }
                .feedback-message {
                    margin-top: 10px; padding: 8px; border-radius: 4px; 
                    font-weight: bold; display: none;
                }
                .feedback-success { background-color: #d4edda; color: var(--cor-sucesso); }
                .feedback-error { background-color: #f8d7da; color: var(--cor-erro); }
                .form-field { margin-bottom: 15px; }
                .form-field input, .form-field select {
                    width: 100%; padding: 10px; border: 1px solid #ccc;
                    border-radius: 5px; box-sizing: border-box;
                    font-family: 'Arimo', sans-serif;
                }
            </style>
            
            <div class="comp-armario">
                <div class="titulo-funcionalidade">Gerenciamento de Armários (Solicitação & Renovação)</div>
                
                <h2>Meus Armários (${this.usuario.nome})</h2>
                ${armariosDoUsuario.length === 0 ? `<p>Você não possui armários reservados.</p>` : ''}

                ${armariosDoUsuario.map(armario => {
                    const statusClass = armario.pendencia ? 'status-bloqueado' : (armario.status === 'reservado' ? 'status-reservado' : 'status-pendente');
                    const statusText = armario.pendencia ? 'BLOQUEADO (PENDÊNCIA)' : (armario.status === 'reservado' ? 'Reservado e Ativo' : 'RENOVAR AGORA!');
                    const buttonDisabled = armario.status === 'reservado' || armario.pendencia;
                    const buttonText = armario.pendencia ? 'Pendência' : (armario.status === 'reservado' ? 'Ativo' : 'Renovar Chave');

                    return `
                        <div class="armario-card">
                            <div>
                                <h3>${armario.projeto}</h3>
                                <p>Armário: <strong>#${armario.id} (${armario.local})</strong></p>
                                <p>Status: <span class="${statusClass}">${statusText}</span></p>
                                <p>Validade: <strong>${armario.data_renovacao}</strong></p>
                            </div>
                            
                            <button class="action-button renew-btn" 
                                data-id="${armario.id}" 
                                ${buttonDisabled ? 'disabled' : ''}>
                                ${buttonText}
                            </button>
                        </div>
                    `;
                }).join('')}

                <h2>Solicitar Novo Armário</h2>
                <div class="status-disponivel-box">
                    Armários Disponíveis: <strong>${armariosDisponiveisCount}/${this.totalLockers} vagas.</strong>
                </div>
                
                <div id="solicitar-form">
                    <div class="form-field">
                        <label for="tempo">Período de Uso (máx. 15 dias):</label>
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
        // registrando event listener pra renovação e solicitação
        this.shadowRoot.querySelectorAll('.renew-btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleRenovacao(e.target.dataset.id));
        });

        this.shadowRoot.querySelector('.solicitacao-btn').addEventListener('click', () => this.handleSolicitacao());
    }

    handleRenovacao(id) {
        const armario = this.armarios.find(a => a.id == id);
        const feedbackEl = this.shadowRoot.getElementById('feedback');
        
        if (armario.pendencia) {
            feedbackEl.textContent = `ERRO: Não é possível renovar o armário #${id} devido a pendências. Resolva a pendência (pagamento/uso indevido) no financeiro. (Heurística 9)`;
            feedbackEl.className = 'feedback-message feedback-error';
            feedbackEl.style.display = 'block';
            return;
        }
        
        // calculando nova data de validade
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 15);
        armario.data_renovacao = this.formatDate(newDate); 
        armario.status = 'reservado';
        
        feedbackEl.textContent = `SUCESSO: Armário #${id} (Projeto: ${armario.projeto}) renovado digitalmente até ${armario.data_renovacao}. (Heurística 1)`;
        feedbackEl.className = 'feedback-message feedback-success';
        feedbackEl.style.display = 'block';
        
        this.render(); 
    }

    handleSolicitacao() {
        const projetoInput = this.shadowRoot.getElementById('projeto');
        const tempo = this.shadowRoot.getElementById('tempo').value;
        const projeto = projetoInput.value.trim();
        const feedbackEl = this.shadowRoot.getElementById('feedback');

        if (!projeto) {
             feedbackEl.textContent = `ERRO: Preencha o nome do projeto (Campo obrigatório para utilização do Fab Lab).`;
             feedbackEl.className = 'feedback-message feedback-error';
             feedbackEl.style.display = 'block';
             return;
        }
        
        const armariosEmUso = this.armarios.length;
        if (armariosEmUso >= this.totalLockers) {
             feedbackEl.textContent = `ERRO: Não há armários disponíveis neste momento. Tente novamente mais tarde.`;
             feedbackEl.className = 'feedback-message feedback-error';
             feedbackEl.style.display = 'block';
             return;
        }

        const novoId = Math.max(...this.armarios.map(a => a.id)) + 1;
        
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + parseInt(tempo));
        const dataFormatada = this.formatDate(newDate);

        const novoArmario = {
             id: novoId, 
             local: 'Fab Lab Principal',
             projeto: projeto, 
             status: 'reservado',
             chave: 'RFID ES012345', 
             data_renovacao: dataFormatada,
             pendencia: false
        };

        this.armarios.push(novoArmario);

        feedbackEl.textContent = `SUCESSO: Armário #${novoId} (Projeto: ${projeto}) reservado por ${tempo} dias. Seu acesso RFID está ativo. (Heurística 1, 5)`;
        feedbackEl.className = 'feedback-message feedback-success';
        feedbackEl.style.display = 'block';
        
        // limpa o formulário e renderiza vagas
        projetoInput.value = '';
        this.render();
    }
}

customElements.define('armario-component', ArmarioComponent);
