'use strict';

// Simulação determinística: pedidos, preços, lugares e jogos são fictícios.
// Cada especialista só começa depois que os retornos de suas dependências existem.
const scenarios = {
  travel: {
    label: 'Viagem de quatro dias',
    request: 'Planeje uma viagem de quatro dias para uma pessoa, com até R$ 1.200. Quero descansar e fazer passeios ao ar livre, sem carro.',
    route: 'Estimar viagem e passeios → conferir orçamento',
    workers: [
      { id: 'stay', name: 'Transporte e estadia', color: 'lilac', why: 'Encontrar como chegar e onde dormir.', context: 'Uma pessoa, quatro dias e três noites, sem carro. Buscar opções econômicas em Vila Serena, destino fictício.', output: 'Ônibus ida e volta: R$ 180. Pousada: três noites de R$ 140 = R$ 420. Total: R$ 600.', start: 2, finish: 3, dependsOn: [] },
      { id: 'activities', name: 'Passeios e refeições', color: 'blue', why: 'Montar os quatro dias e estimar os gastos locais.', context: 'Vila Serena, quatro dias, uma pessoa. Descanso, natureza e deslocamentos a pé. Estimar também alimentação.', output: 'Dias 1–4: praça, trilha leve, parque e feira, todos gratuitos. Refeições: R$ 70 por dia × 4 = R$ 280.', start: 2, finish: 3, dependsOn: [] },
      { id: 'budget', name: 'Orçamento', color: 'green', why: 'Somar as estimativas e comparar com o limite.', context: 'Limite total: R$ 1.200. Some as duas estimativas recebidas e informe quanto sobra.', output: 'R$ 600 + R$ 280 = R$ 880. Sobram R$ 320 para imprevistos. O plano estimado cabe no limite.', start: 4, finish: 5, dependsOn: ['stay', 'activities'] }
    ],
    steps: [
      ['O pedido chega com limites e preferências', 'O orquestrador identifica quatro dias, uma pessoa, R$ 1.200 e passeios sem carro. Para este exemplo, usa Vila Serena, um destino inventado.'],
      ['Uma tarefa vira três responsabilidades', 'Transporte e estadia cuida da chegada e das noites. Passeios e refeições monta os dias. Orçamento só poderá conferir o total depois das duas estimativas.'],
      ['Dois especialistas começam juntos', 'O orquestrador envia a cada um apenas as informações relevantes. Orçamento continua aguardando: ainda não há valores para somar.'],
      ['As primeiras estimativas voltam', 'Transporte e estadia devolve R$ 600; passeios e refeições, R$ 280. Os retornos ficam disponíveis para o orquestrador repassar.'],
      ['Agora o orçamento pode trabalhar', 'O orquestrador envia os dois retornos e o limite de R$ 1.200 ao especialista em orçamento. Observe o contexto recebido abaixo.'],
      ['A conferência de custos retorna', 'Orçamento devolve R$ 880 de custo estimado e R$ 320 de sobra. Agora o orquestrador tem roteiro, logística e conferência de custos.'],
      ['O orquestrador reúne o plano', 'Ele combina a estadia do primeiro agente, os quatro dias do segundo e a soma do terceiro em uma resposta ao pedido original.']
    ],
    result: 'Viagem fictícia: quatro dias em Vila Serena, de ônibus, com três noites na pousada. Dia 1: praça; dia 2: trilha leve; dia 3: parque; dia 4: feira. Transporte e estadia: R$ 600; refeições: R$ 280; passeios: gratuitos. Total estimado: R$ 880, com R$ 320 de reserva. Nenhuma reserva ou consulta de preços foi feita.'
  },
  dinner: {
    label: 'Jantar para seis pessoas',
    request: 'Organize um jantar para seis pessoas em casa, gastando até R$ 180. Uma pessoa é vegetariana. Quero uma refeição simples, sem bebidas alcoólicas.',
    route: 'Estimar comida e bebidas → conferir orçamento',
    workers: [
      { id: 'menu', name: 'Cardápio', color: 'lilac', why: 'Planejar uma refeição que as seis pessoas possam compartilhar.', context: 'Seis pessoas, uma vegetariana. Jantar simples em casa; usar um prato sem carne para todos. Estimar ingredientes.', output: 'Massa com molho de tomate, salada e frutas para seis. Ingredientes estimados: R$ 120.', start: 2, finish: 3, dependsOn: [] },
      { id: 'drinks', name: 'Bebidas e mesa', color: 'blue', why: 'Cobrir os gastos que não entram no prato.', context: 'Seis pessoas em casa, sem álcool. Há pratos, copos e talheres reutilizáveis. Estimar bebidas e gelo.', output: 'Suco e água: R$ 24; gelo: R$ 6. Louça de casa: sem compra. Total: R$ 30.', start: 2, finish: 3, dependsOn: [] },
      { id: 'budget', name: 'Orçamento', color: 'green', why: 'Verificar se o jantar inteiro cabe no limite.', context: 'Limite total: R$ 180 para seis pessoas. Some comida e bebidas; calcule a sobra.', output: 'R$ 120 + R$ 30 = R$ 150, ou R$ 25 por pessoa. Sobram R$ 30. O jantar cabe no limite.', start: 4, finish: 5, dependsOn: ['menu', 'drinks'] }
    ],
    steps: [
      ['O pedido chega com uma necessidade do grupo', 'O orquestrador identifica seis pessoas, limite de R$ 180 e uma pessoa vegetariana. Para o exemplo, considera que a casa já tem louça.'],
      ['Comida, bebidas e conta final têm papéis diferentes', 'Cardápio monta a refeição; bebidas e mesa cuida dos complementos. Orçamento espera os dois para não esquecer parte do gasto.'],
      ['O contexto certo vai para cada especialista', 'Cardápio recebe a preferência vegetariana e o número de pessoas. Bebidas e mesa recebe a quantidade de convidados e o que já existe em casa.'],
      ['O orquestrador recebe duas partes do jantar', 'Cardápio retorna a refeição e R$ 120 de ingredientes. Bebidas e mesa retorna R$ 30. Nenhum deles, sozinho, verificou a conta completa.'],
      ['A conta completa segue para orçamento', 'Só agora o orquestrador repassa as duas estimativas e o limite de R$ 180. O agente pode conferir comida e bebidas sem contar itens duas vezes.'],
      ['O orçamento confirma a margem', 'O especialista devolve R$ 150 no total e R$ 30 de sobra. A resposta inclui todos os gastos previstos no exemplo.'],
      ['O pedido vira um plano de jantar', 'O orquestrador reúne o cardápio, as bebidas e a conferência de custos. A preferência vegetariana e o limite continuam visíveis na resposta.']
    ],
    result: 'Jantar fictício para seis: massa com molho de tomate, salada e frutas, sem carne para todos. Sirva suco e água e use a louça de casa. Comida: R$ 120; bebidas e gelo: R$ 30. Total estimado: R$ 150, ou R$ 25 por pessoa, com R$ 30 de sobra. São valores inventados; nenhuma compra foi feita.'
  },
  game: {
    label: 'Jogo para os amigos',
    request: 'Escolha um jogo cooperativo on-line para quatro amigos. Gostamos de enigmas, temos até R$ 40 por pessoa e queremos jogar nos computadores que já temos.',
    route: 'Preferências + computadores → escolher jogo',
    workers: [
      { id: 'preferences', name: 'Preferências do grupo', color: 'lilac', why: 'Separar jogos que combinam com a turma.', context: 'Quatro amigos, cooperação on-line, enigmas e até R$ 40 por pessoa. Usar somente o catálogo fictício do exemplo.', output: 'Ilha dos Enigmas: quatro jogadores, R$ 30 por pessoa. Oficina Lunar: quatro jogadores, R$ 35. Ambos têm enigmas cooperativos.', start: 2, finish: 3, dependsOn: [] },
      { id: 'compatibility', name: 'Compatibilidade', color: 'blue', why: 'Conferir se todos podem participar com seus computadores.', context: 'Perfis fictícios: três PCs com 16 GB de memória e um com 8 GB; todos com Windows 11 e vídeo integrado. Comparar com a tabela simulada do catálogo.', output: 'Na tabela fictícia, Ilha dos Enigmas aceita os quatro PCs. Oficina Lunar exige 16 GB e placa dedicada: não atende a todos.', start: 2, finish: 3, dependsOn: [] },
      { id: 'choice', name: 'Escolha em grupo', color: 'green', why: 'Cruzar os gostos com o que funciona para todos.', context: 'Escolha uma opção para os quatro amigos, até R$ 40 por pessoa. Considere as duas análises recebidas.', output: 'Ilha dos Enigmas reúne os critérios: enigmas, quatro jogadores, compatibilidade simulada e R$ 30 por pessoa. R$ 120 para o grupo.', start: 4, finish: 5, dependsOn: ['preferences', 'compatibility'] }
    ],
    steps: [
      ['O pedido precisa considerar o grupo inteiro', 'O orquestrador identifica quatro amigos, enigmas e R$ 40 por pessoa. Os perfis dos computadores e o catálogo usados aqui são inventados e já fazem parte do exemplo.'],
      ['Gostar do jogo não basta: todos precisam conseguir jogar', 'Um especialista verifica preferências; outro, os computadores. Escolha em grupo aguarda os dois para recomendar uma opção que satisfaça ambos.'],
      ['Duas verificações acontecem em paralelo', 'Preferências recebe os gostos e o limite. Compatibilidade recebe os perfis dos PCs e a tabela fictícia de requisitos. Nenhum computador real é inspecionado.'],
      ['As análises trazem uma diferença importante', 'Dois jogos combinam com o grupo, mas apenas Ilha dos Enigmas atende aos quatro computadores na tabela simulada. O orquestrador recebe as duas análises.'],
      ['Os dois resultados alimentam a escolha', 'O orquestrador passa preferências e compatibilidade ao terceiro agente. Sem esse cruzamento, um jogo atraente poderia deixar um amigo de fora.'],
      ['Uma opção atende aos critérios do exemplo', 'Escolha em grupo devolve Ilha dos Enigmas por R$ 30 por pessoa. A indicação depende da tabela fictícia; não é um teste real de desempenho.'],
      ['A resposta explica a escolha', 'O orquestrador combina a diversão indicada, a compatibilidade e o preço. Também deixa claro o limite da demonstração.']
    ],
    result: 'Escolha fictícia: Ilha dos Enigmas, para quatro amigos resolverem enigmas juntos on-line. Na tabela simulada, funciona nos quatro PCs e custa R$ 30 por pessoa: R$ 120 para o grupo. Oficina Lunar foi descartado por não atender aos computadores. Os jogos, preços e requisitos são inventados; nenhum jogo foi consultado, comprado ou testado.'
  }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let selected = 'travel';
let currentStep = -1;
let running = false;
let timer = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const phases = [0, 1, 2, 3, 3, 3, 4];

function stop() {
  clearTimeout(timer);
  timer = null;
  running = false;
}

// Resultados só ficam disponíveis após a devolução. O contexto dependente
// é montado com esses retornos, sem antecipar saídas ainda não produzidas.
function executionAt(scenario, step) {
  const results = new Map();
  return scenario.workers.map(worker => {
    const ready = worker.dependsOn.every(id => results.has(id));
    const started = step >= worker.start && ready;
    const done = started && step >= worker.finish;
    const context = started ? [worker.context, ...worker.dependsOn.map(id => {
      const source = scenario.workers.find(item => item.id === id);
      return `${source.name} devolveu: ${results.get(id)}`;
    })] : [];
    if (done) results.set(worker.id, worker.output);
    return { worker, started, done, context };
  });
}

function render() {
  const scenario = scenarios[selected];
  const lastStep = scenario.steps.length - 1;
  const finished = currentStep === lastStep;
  const phase = phases[currentStep];
  $('#sim-counter').textContent = currentStep < 0 ? 'Pronto para começar' : `Etapa ${currentStep + 1} de ${scenario.steps.length}`;
  $('#routing-label').textContent = currentStep >= 1 ? scenario.route : 'Aguardando o pedido';
  $('#play').textContent = running ? 'Ⅱ Pausar' : finished ? '↺ Executar novamente' : currentStep < 0 ? '▶ Iniciar simulação' : '▶ Continuar';
  $('#step').disabled = finished;
  $$('.steps li').forEach((node, index) => {
    node.classList.toggle('current', phase === index);
    node.classList.toggle('complete', phase > index);
    if (phase === index) node.setAttribute('aria-current', 'step');
    else node.removeAttribute('aria-current');
  });
  $('#sim-request').classList.toggle('active', currentStep === 0);
  $('#sim-request').classList.toggle('done', currentStep > 0);
  $('#sim-orchestrator').classList.toggle('active', [1, 3, 4, 5, 6].includes(currentStep));
  $('#sim-result').classList.toggle('done', finished);
  $('#agent-details').hidden = currentStep < 1;
  const execution = executionAt(scenario, currentStep);
  execution.forEach(({ worker, started, done, context }) => {
    const node = $(`#worker-${worker.id}`);
    const detail = $(`#detail-${worker.id}`);
    const state = done ? 'Retorno entregue' : started ? 'Executando tarefa' : worker.dependsOn.length ? 'Aguarda os dois retornos' : 'Aguardando contexto';
    node.dataset.state = done ? 'done' : started ? 'active' : 'waiting';
    node.classList.toggle('active', started && !done);
    node.classList.toggle('inactive', !started);
    node.querySelector('.worker-state').textContent = state;
    detail.querySelector('.agent-context').replaceChildren();
    const texts = started ? context : ['Ainda não enviado.'];
    texts.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      detail.querySelector('.agent-context').append(paragraph);
    });
    detail.querySelector('.agent-return').textContent = done ? worker.output : 'Ainda não devolvido.';
    detail.dataset.state = node.dataset.state;
  });
  $('#dependency-label').textContent = currentStep < 3 ? 'Orquestrador aguarda as duas estimativas' : currentStep === 3 ? '↑ Retornos recebidos pelo orquestrador' : '↓ Orquestrador repassa os dois retornos';
  if (selected === 'game' && currentStep < 3) $('#dependency-label').textContent = 'Orquestrador aguarda as duas análises';
  $('#dependency-label').classList.toggle('dependency-ready', currentStep >= 3);
  const info = currentStep < 0 ? ['Um pedido, tarefas diferentes.', 'Inicie ou avance por etapas. Veja quem recebe cada informação e por que alguns agentes precisam esperar.'] : scenario.steps[currentStep];
  $('#sim-status h3').textContent = info[0];
  $('#sim-status p').textContent = info[1];
  $('#result-box').hidden = !finished;
  $('#result-box').replaceChildren();
  if (finished) {
    const heading = document.createElement('h4');
    heading.textContent = 'RESPOSTA FINAL · SIMULAÇÃO FICTÍCIA';
    const paragraph = document.createElement('p');
    paragraph.textContent = scenario.result;
    $('#result-box').append(heading, paragraph);
  }
}

function selectScenario(key) {
  stop();
  selected = key;
  currentStep = -1;
  const scenario = scenarios[key];
  $$('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
  $('#original-request').textContent = `“${scenario.request}”`;
  $('#request-label').textContent = scenario.label;
  $('#sim-workers').replaceChildren();
  $('#dependent-worker').replaceChildren();
  $('#agent-details').replaceChildren();
  scenario.workers.forEach(worker => {
    const node = document.createElement('div');
    node.className = `worker ${worker.color}`;
    node.id = `worker-${worker.id}`;
    const title = document.createElement('strong');
    title.textContent = worker.name;
    const status = document.createElement('small');
    status.className = 'worker-state';
    node.append(title, status);
    $(worker.dependsOn.length ? '#dependent-worker' : '#sim-workers').append(node);

    const detail = document.createElement('article');
    detail.className = 'agent-detail';
    detail.id = `detail-${worker.id}`;
    // Somente estrutura estática: todo o conteúdo do cenário usa textContent.
    detail.innerHTML = '<h4></h4><p class="agent-why"></p><span class="small-label">CONTEXTO ENVIADO</span><div class="agent-context"></div><span class="small-label">RESULTADO DEVOLVIDO</span><p class="agent-return"></p>';
    detail.querySelector('h4').textContent = worker.name;
    detail.querySelector('.agent-why').textContent = worker.why;
    $('#agent-details').append(detail);
  });
  render();
}

function advance() {
  const lastStep = scenarios[selected].steps.length - 1;
  if (currentStep < lastStep) currentStep++;
  if (currentStep === lastStep) stop();
  render();
}

function schedule() {
  if (!running) return;
  timer = setTimeout(() => { advance(); schedule(); }, 6500);
}

$$('[data-scenario]').forEach(button => button.addEventListener('click', () => selectScenario(button.dataset.scenario)));
$('#play').addEventListener('click', () => {
  if (running) { stop(); render(); return; }
  if (currentStep === scenarios[selected].steps.length - 1) currentStep = -1;
  running = true;
  if (currentStep === -1) advance();
  else render();
  schedule();
});
$('#step').addEventListener('click', () => { stop(); advance(); });
$('#reset').addEventListener('click', () => selectScenario(selected));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && running) { stop(); render(); }
});
selectScenario('travel');

const contexts = {
  complete: {
    title: 'O necessário para agir',
    items: ['Objetivo: investigar a falha no login', 'Aplicação: Portal · versão v2.4', 'Janela: 14h–14h10 · homologação', 'Evidência: trecho de log sem dados pessoais', 'Entrega: hipóteses, fontes e próximos passos'],
    verdict: 'Há um ponto de partida.',
    description: 'Com escopo, evidências e critério de entrega, o agente pode formular hipóteses verificáveis. Contexto adequado ajuda, mas não garante uma conclusão correta.',
    tag: 'CONTEXTO SUFICIENTE ≠ RESULTADO GARANTIDO'
  },
  missing: {
    title: '“O login não funciona.”',
    items: ['Objetivo: investigar a falha no login', 'Qual aplicação e versão?', 'Em qual ambiente e horário?', 'Onde estão as evidências?', 'Qual resultado se espera?'],
    verdict: 'Primeiro, pedir esclarecimentos.',
    description: 'Sem aplicação, intervalo ou evidências, o agente não tem base para um diagnóstico. O comportamento adequado é solicitar os dados ausentes, sem preencher lacunas com suposições.',
    tag: 'EFEITO: MAIS TROCAS ANTES DE INVESTIGAR'
  },
  excess: {
    title: 'O relevante se perde no volume',
    items: ['Aplicação, versão e log do incidente', 'Histórico de versões sem relação', 'Conversas de outros projetos', 'Manuais de serviços não envolvidos', 'Cópias repetidas dos mesmos registros'],
    verdict: 'É preciso filtrar antes de agir.',
    description: 'Informação irrelevante ocupa a janela de contexto, pode elevar custo e dificultar a seleção de evidências. O orquestrador deve preservar o que importa e descartar ruído.',
    tag: 'EFEITO: MAIS PROCESSAMENTO, SEM GANHO CERTO'
  }
};
function selectContext(key) {
  const context = contexts[key];
  $$('[data-context]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.context === key)));
  $('#context-heading').textContent = context.title;
  $('#context-items').replaceChildren();
  context.items.forEach((text, index) => {
    const item = document.createElement('div');
    item.className = `context-item${key === 'missing' && index > 0 ? ' missing' : key === 'excess' && index > 0 ? ' noise' : ''}`;
    item.textContent = text;
    $('#context-items').append(item);
  });
  $('.context-outcome').dataset.state = key;
  $('#context-verdict').textContent = context.verdict;
  $('#context-description').textContent = context.description;
  $('#context-tag').textContent = context.tag;
}
$$('[data-context]').forEach(button => button.addEventListener('click', () => selectContext(button.dataset.context)));
selectContext('complete');

const roles = {
  orchestrator: 'Orquestrador → distribui tarefas e contexto e consolida os retornos. Pode coordenar por regras, por um modelo ou pelos dois.',
  analyst: 'Analista → examina dados e formula hipóteses. Consulta evidências com ferramentas, dentro do escopo recebido.',
  developer: 'Desenvolvedor → usa contexto e código para propor soluções. Alterações reais precisam de testes e permissões.',
  reviewer: 'Revisor → verifica os resultados com critérios explícitos. Também pode errar; revisão não é garantia de correção.'
};
$$('[data-role]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    $$('[data-role]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
    $('#role-detail').textContent = roles[button.dataset.role];
  });
});
let motionPaused = reducedMotion.matches;
function setMotion() {
  $('.hero-visual').classList.toggle('motion-paused', motionPaused);
  $('#motion-toggle').textContent = motionPaused ? '▶ Animar' : 'Ⅱ Pausar';
  $('#motion-toggle').setAttribute('aria-pressed', String(motionPaused));
  $('#motion-toggle').setAttribute('aria-label', motionPaused ? 'Retomar animação da arquitetura' : 'Pausar animação da arquitetura');
}
$('#motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; setMotion(); });
reducedMotion.addEventListener('change', event => { motionPaused = event.matches; setMotion(); });
setMotion();
