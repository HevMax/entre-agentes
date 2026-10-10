# Entre agentes

Experiência educativa em português sobre orquestradores de agentes de IA. Site estático em HTML, CSS e JavaScript, pronto para GitHub Pages, sem backend, API de IA ou instalação de pacotes.

## Executar localmente

Abra `index.html` no navegador ou, na pasta do projeto, execute:

```sh
python -m http.server 8000
```

Acesse **http://localhost:8000**. O conteúdo e as interações funcionam localmente. As fontes DM Sans e Manrope são carregadas do Google Fonts; sem internet, o navegador usa fontes de sistema. Nenhuma solicitação do simulador é enviada a serviços externos. Não há analytics, cookies ou armazenamento de dados do visitante.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos, incluindo a pasta `.github`, para a branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. Em **Actions**, execute **Publicar no GitHub Pages → Run workflow**, ou envie um novo commit para `main`.
4. Aguarde o workflow terminar. O endereço aparece no ambiente `github-pages` e em **Settings → Pages**.

Se sua branch principal tiver outro nome, ajuste `branches` em `.github/workflows/pages.yml`. O workflow usa a URL fornecida pelo GitHub Pages, incluindo o nome do repositório ou domínio personalizado, para gerar os metadados absolutos de Open Graph e a URL canônica. Apenas `dist/` é publicado; scripts e documentação ficam fora do site.

Referência: [documentação oficial de workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Publicação manual em outra hospedagem estática

```sh
python scripts/prepare-pages.py --url https://seu-usuario.github.io/seu-repositorio
```

Publique o conteúdo de `dist/`. Não publique apenas o HTML original para compartilhamento social: ele usa uma imagem relativa para funcionar localmente. O script gera as URLs absolutas necessárias à prévia social. Não é necessário editar o HTML para usar a publicação automatizada recomendada.

## Compartilhar no LinkedIn

A imagem `assets/social.png` tem **1200 × 630 pixels**. O HTML inclui título, descrição, idioma, tipo, dimensões e descrição alternativa da imagem, além de `twitter:card`. O processo de publicação acrescenta `og:url`, URL canônica e URL absoluta da imagem **no HTML estático**, para funcionar sem JavaScript nos rastreadores.

Depois da publicação, confira o link público no [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), que também permite solicitar uma nova leitura caso a prévia esteja em cache. A renderização final é controlada pelo LinkedIn; a imagem precisa estar acessível publicamente. Não há postagem automática nem integração com o LinkedIn.

## O que é interativo

- Diagrama inicial: selecione orquestrador ou especialistas para conhecer seus papéis. A animação pode ser pausada.
- Simulador: três situações cotidianas (viagem de quatro dias, jantar para seis e jogo cooperativo), com pedido original, divisão de tarefas, contexto e retorno de cada especialista. São sete etapas agrupadas nas cinco fases do fluxo, com pausa, continuação, avanço manual e reinício. Trocar o cenário cancela a execução anterior. Ao ocultar a aba, a reprodução pausa.
- Contexto: alterne entre completo, insuficiente e desnecessário para ver o pacote enviado e seu efeito possível.
- Decisão arquitetural: expanda os cenários de uso.
- Navegação por âncoras, link de salto para conteúdo, foco visível, botões nativos, atualizações anunciadas e respeito a `prefers-reduced-motion`.
- Jornada **Construa seu primeiro orquestrador**: conceitos, documentação oficial, oficina de jantar com dois especialistas, código Python para copiar/baixar e comparação local/API.

## Jornada prática e exemplos Python

A oficina permite escolher convidados, limite e preferência vegetariana. O cardápio produz estimativas fictícias; só depois o orçamento recebe esses valores. As operações no navegador são JavaScript local, sem IA e sem executar Python. Alterar qualquer campo reinicia o fluxo.

O exemplo inicial é funcional e usa somente a biblioteca padrão do Python:

```sh
python examples/jantar.py
python -m unittest discover -s tests -v
```

Com o pedido padrão, o total é R$ 150 e o saldo R$ 30. Os especialistas são funções determinísticas, não agentes de IA. A oficina utiliza as mesmas regras. Todos os valores monetários são inventados para o exercício.

A evolução em `examples/jantar_ollama.py` usa duas chamadas ao endpoint local oficial do Ollama. Requer Ollama instalado e ativo e o modelo baixado:

```sh
ollama pull llama3.2:1b
python examples/jantar_ollama.py
```

Se necessário, abra `ollama serve` em outro terminal. O modelo escolhe um prato do catálogo e comenta a conta; a validação e a aritmética permanecem em Python. A sequência é fixa, sem ciclo autônomo de ferramentas. O comentário é identificado como resposta a revisar. O script usa apenas a biblioteca padrão e importa `jantar.py`, que deve estar na mesma pasta.

Os testes cobrem os resultados determinísticos, entradas inválidas, limites de orçamento, dependência entre especialistas, validação do retorno e formato da chamada HTTP com transporte simulado. **Não houve execução de modelo real nesta validação**, pois Ollama não está instalado no ambiente. Qualidade da geração e desempenho dependem do modelo e do computador.

Os exemplos mostrados no HTML correspondem integralmente aos arquivos para download. Ao modificá-los, atualize também os blocos `basic-code` e `model-code` em `index.html`. `scripts/prepare-pages.py` inclui os dois arquivos, `workshop.css` e `workshop.js` na publicação. Nenhum backend Python é executado pelo GitHub Pages.

As referências oficiais estão junto das explicações na jornada: Python, LangGraph, CrewAI, Gemini API, Ollama e GitHub Pages. Limites e condições podem mudar; não são fixados preços de serviços. O site não pede chaves nem chama essas APIs. Nunca publique credenciais no código da página ou no repositório.

## Limites da demonstração

Todos os pedidos, lugares, jogos, preços, requisitos e respostas do simulador são **fictícios e predefinidos**. Não há reservas, compras, consultas externas ou testes reais de computadores. O tempo de cada etapa não representa latência real. O fluxo demonstra uma arquitetura centralizada possível, não um padrão obrigatório para todos os sistemas.

Os cenários destacam paralelismo e dependências sequenciais. Nos cenários de viagem e jantar, orçamento recebe as estimativas dos dois primeiros especialistas antes de conferir o total. No cenário de jogo, a escolha cruza preferências e compatibilidade. A lógica monta o contexto dependente com os retornos já disponíveis e não antecipa resultados. Contexto suficiente não garante correção, múltiplos agentes não garantem melhoria e consolidação não substitui validação. Valores monetários são exemplos didáticos, não cotações.

## Validação realizada

Na revisão dos exemplos, foram verificados no Chrome local os três cenários e suas 21 etapas, a espera por dependências e o repasse dos resultados para o contexto seguinte. Reprodução automática, pausa, retomada, reinício, troca de cenário, teclado e redução de movimento também foram testados. Cada etapa foi verificada nas larguras de 320, 390, 768 e 1440 pixels, sem transbordamento horizontal ou erros de JavaScript. O conteúdo HTML e a lógica das demais seções foram comparados com a versão anterior para confirmar sua preservação.

A checagem automatizada com axe-core não encontrou violações nas regras WCAG 2 A/AA e 2.1 AA aplicadas ao simulador no estado final dos três cenários. Isso não substitui uma auditoria completa com tecnologias assistivas. A publicação e a prévia efetiva no LinkedIn devem ser verificadas após disponibilizar a URL pública.

Na jornada prática, foram testadas as 24 combinações de convidados, limite e preferência, a ordem das dependências, reinício automático, inspeção dos papéis, cópia e seleção alternativa de código, download e alternância de exemplos. A responsividade foi verificada em 320, 390, 768, 1024 e 1440 pixels. A nova seção passou pela checagem automatizada de acessibilidade nas duas versões do código. Os sete testes Python passaram; a integração opcional usou transporte e respostas simulados. Os testes dos três cenários anteriores também passaram novamente.

## Organização

```text
index.html                  Conteúdo, estrutura e metadados
styles.css                  Layout, animações e responsividade
app.js                      Roteiros e todas as interações
workshop.js                 Oficina, inspeção de papéis e cópia
workshop.css                Estilos restritos à jornada prática
examples/jantar.py          Exemplo funcional sem IA
examples/jantar_ollama.py   Evolução opcional com Ollama local
tests/test_examples.py      Testes Python sem dependências externas
assets/favicon.svg          Marca vetorial
assets/social.png           Prévia social pronta para compartilhar
scripts/prepare-pages.py    Empacotamento e URLs absolutas
.github/workflows/pages.yml Publicação automatizada
```

Para editar cenários, altere `scenarios` em `app.js`. Para editar os exemplos de contexto, altere `contexts`. Estilos e cores ficam em `styles.css`. Não há compilação do JavaScript.

## Referências de conteúdo

- [Building effective agents — Anthropic, 2024](https://www.anthropic.com/engineering/building-effective-agents): diferenças entre workflows e agentes, roteamento e orquestração.
- [How we built our multi-agent research system — Anthropic, 2025](https://www.anthropic.com/engineering/multi-agent-research-system): delegação, paralelismo e dificuldades de coordenação em um sistema real.
- [Effective context engineering for AI agents — Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): seleção de contexto, limites e troca de informações.

Os textos são explicações autorais e didáticas baseadas nessas leituras. As referências descrevem experiências específicas; não constituem prova de que a mesma arquitetura será adequada a qualquer aplicação.
