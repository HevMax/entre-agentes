// Esta oficina executa somente regras JavaScript locais. Não chama IA ou Python.
(() => {
  'use strict';
  const root = document.querySelector('#construa');
  if (!root) return;
  const find = selector => root.querySelector(selector);
  const all = selector => [...root.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  }).format(value);
  let phase = 0;
  let inspected = 'coordinator';
  let plan = null;
  let bill = null;

  function request() {
    return { people: Number(find('#build-people').value),
      limit: Number(find('#build-limit').value),
      veggie: find('#build-veggie').checked };
  }

  function describePlan() {
    return `${plan.dish}. Comida: ${money(plan.food)}; bebidas: ${money(plan.drinks)}.`;
  }

  function describeBill() {
    return `Total: ${money(bill.total)}. ${bill.fits ? `Sobram ${money(bill.balance)}.` : `Faltam ${money(-bill.balance)}; é preciso ajustar o pedido.`}`;
  }

  function render() {
    const input = request();
    const people = `${input.people} pessoas; ${input.veggie ? 'refeição vegetariana' : 'sem preferência vegetariana'}`;
    const states = {
      coordinator: {
        title: 'Orquestrador',
        responsibility: 'Organizar a ordem e juntar as respostas.',
        instruction: 'Receba o pedido, envie pessoas e preferência ao cardápio. Repasse as estimativas ao orçamento e reúna os retornos.',
        context: phase ? `Pedido: jantar para ${people}, até ${money(input.limit)}.` : 'Pedido definido nos campos acima; aguardando o início.',
        result: phase === 4 ? `${describePlan()} ${describeBill()}` : 'A resposta final espera os dois especialistas.'
      },
      menu: {
        title: 'Especialista em cardápio',
        responsibility: 'Escolher uma refeição e estimar comida e bebidas.',
        instruction: 'Se houver vegetariano, escolha massa para todos. Caso contrário, frango. Multiplique os valores fictícios pelo número de pessoas.',
        context: phase >= 2 ? people : 'O contexto ainda não foi enviado.',
        result: plan ? describePlan() : 'Nenhuma estimativa produzida.'
      },
      budget: {
        title: 'Especialista em orçamento',
        responsibility: 'Conferir o total depois de receber as estimativas.',
        instruction: 'Some comida e bebidas. Compare com o limite. Se ultrapassar, informe quanto falta; não invente um desconto.',
        context: phase >= 3 ? `Orquestrador repassou: ${describePlan()} Limite: ${money(input.limit)}.` : 'Aguardando o orquestrador repassar o cardápio e o limite.',
        result: bill ? describeBill() : 'Não há conta sem as estimativas.'
      }
    };
    const detail = states[inspected];
    find('#build-role-title').textContent = detail.title;
    find('#build-responsibility').textContent = detail.responsibility;
    find('#build-instruction').textContent = detail.instruction;
    find('#build-context').textContent = detail.context;
    find('#build-return').textContent = detail.result;
    all('[data-build-role]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.buildRole === inspected));
      const threshold = { coordinator: 1, menu: 2, budget: 3 }[button.dataset.buildRole];
      button.dataset.state = phase >= threshold ? 'done' : 'waiting';
    });
    find('#build-menu-state').textContent = plan ? 'Estimativa devolvida' : 'Aguarda contexto';
    find('#build-budget-state').textContent = bill ? 'Conta devolvida' : 'Aguarda cardápio';
    find('#build-link').textContent = phase < 2 ? '↓ Envia o pedido' : phase === 2 ? '↓ Repassa a estimativa ao orçamento' : '↑ Reúne os retornos';
    const statuses = [
      'Pronto. O pedido será recebido pelo orquestrador.',
      '1 de 4 · Pedido recebido. O orquestrador separa cardápio e orçamento.',
      '2 de 4 · Cardápio devolvido. Orçamento ainda aguarda o repasse.',
      '3 de 4 · Orçamento recebeu o cardápio e devolveu a conta.',
      '4 de 4 · O orquestrador reuniu as duas respostas. Nenhuma IA foi usada.'
    ];
    find('#build-status').textContent = statuses[phase];
    find('#build-next').disabled = phase === 4;
    find('#build-next').textContent = phase === 0 ? 'Iniciar fluxo →' : phase === 4 ? 'Fluxo concluído' : 'Próxima etapa →';
    find('#build-result').hidden = phase !== 4;
    find('#build-result').textContent = phase === 4 ? `RESPOSTA SIMULADA · ${describePlan()} ${describeBill()}` : '';
    find('#build-result').dataset.over = String(Boolean(bill && !bill.fits));
  }

  function reset() {
    phase = 0;
    inspected = 'coordinator';
    plan = null;
    bill = null;
    render();
  }

  find('#build-next').addEventListener('click', () => {
    if (phase >= 4) return;
    const input = request();
    phase++;
    if (phase === 2) {
      plan = { dish: input.veggie ? 'Massa com tomate' : 'Frango com arroz',
        food: input.people * (input.veggie ? 20 : 25), drinks: input.people * 5 };
      inspected = 'menu';
    } else if (phase === 3) {
      // Esta operação depende do resultado já produzido, não o recalcula.
      const total = plan.food + plan.drinks;
      bill = { total, balance: input.limit - total, fits: total <= input.limit };
      inspected = 'budget';
    } else inspected = 'coordinator';
    render();
  });
  find('#build-reset').addEventListener('click', reset);
  ['#build-people', '#build-limit', '#build-veggie'].forEach(selector => {
    find(selector).addEventListener('change', reset);
  });
  all('[data-build-role]').forEach(button => button.addEventListener('click', () => {
    inspected = button.dataset.buildRole;
    render();
  }));

  all('[data-code-version]').forEach(button => button.addEventListener('click', () => {
    all('[data-code-version]').forEach(item => {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      find(`#code-${item.dataset.codeVersion}`).hidden = !active;
    });
    find('#code-copy-status').textContent = '';
  }));
  all('[data-copy-code]').forEach(button => button.addEventListener('click', async () => {
    const code = find(`#${button.dataset.copyCode}`);
    try {
      await navigator.clipboard.writeText(code.textContent);
      find('#code-copy-status').textContent = 'Código copiado. Cole em um arquivo .py no seu computador.';
    } catch {
      // Também funciona ao abrir index.html diretamente ou negar o clipboard.
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      find('#code-copy-status').textContent = 'Cópia automática indisponível. O código foi selecionado: use Ctrl+C ou ⌘C, ou baixe o arquivo .py.';
    }
  }));

  reset();
})();
