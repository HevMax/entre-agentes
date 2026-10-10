"""Evolução local com duas chamadas reais ao Ollama, quando instalado.

Salve junto de jantar.py. Execute: python jantar_ollama.py
Não é um agente autônomo: a sequência continua definida pelo código.
"""
import json
import sys
from urllib.error import URLError
from urllib.request import Request, urlopen
from jantar import cardapio, orcamento, validar

MODELO = "llama3.2:1b"  # Baixe antes: ollama pull llama3.2:1b
ENDERECO = "http://127.0.0.1:11434/api/chat"


def consultar(instrucoes, contexto, formato=None):
    """Acesso ao modelo local; nenhuma chave ou pacote Python é necessário."""
    dados = {
        "model": MODELO,
        "stream": False,
        "messages": [
            {"role": "system", "content": instrucoes},
            {"role": "user", "content": json.dumps(contexto)},
        ],
    }
    if formato:
        dados["format"] = formato
    requisicao = Request(ENDERECO, data=json.dumps(dados).encode("utf-8"),
                         headers={"Content-Type": "application/json"})
    with urlopen(requisicao, timeout=180) as resposta:
        texto = json.load(resposta)["message"]["content"]
    if not isinstance(texto, str) or not texto.strip():
        raise ValueError("O modelo não devolveu texto utilizável.")
    return texto


def agente_cardapio(contexto):
    formato = {"type": "object", "properties": {
        "prato": {"type": "string", "enum": ["massa", "frango"]}},
        "required": ["prato"], "additionalProperties": False}
    texto = consultar(
        "Escolha massa ou frango. Se vegetariano for true, escolha massa. "
        "Responda em JSON com apenas a chave prato.", contexto, formato)
    escolha = json.loads(texto)
    if not isinstance(escolha, dict):
        raise ValueError("O modelo deve devolver um objeto JSON.")
    prato = escolha.get("prato")
    if prato not in ("massa", "frango"):
        raise ValueError("Prato fora do catálogo fictício.")
    if contexto["vegetariano"] and prato != "massa":
        raise ValueError("A resposta ignorou a preferência vegetariana.")
    # Os preços continuam nas regras locais, não são inventados pelo modelo.
    return cardapio({"pessoas": contexto["pessoas"],
                     "vegetariano": prato == "massa"})


def agente_orcamento(plano, limite):
    conta = orcamento(plano, limite)  # Ferramenta determinística faz a conta.
    comentario = consultar(
        "Explique em uma frase se o plano cabe, usando o campo cabe. "
        "Não acrescente preços nem altere valores. Responda em português.",
        {"plano": plano, "limite": limite, "conta_verificada": conta})
    return {**conta, "comentario_do_modelo_para_revisar": comentario}


def orquestrar_com_modelo(pedido):
    validar(pedido)
    plano = agente_cardapio({"pessoas": pedido["pessoas"],
                            "vegetariano": pedido["vegetariano"]})
    conta = agente_orcamento(plano, pedido["limite"])
    return {"cardapio": plano, "orcamento": conta}


if __name__ == "__main__":
    try:
        pedido = {"pessoas": 6, "limite": 180, "vegetariano": True}
        print(json.dumps(orquestrar_com_modelo(pedido),
                         ensure_ascii=False, indent=2))
    except (URLError, TimeoutError, OSError, ValueError, KeyError, TypeError) as erro:
        print(f"Execução interrompida: {erro}", file=sys.stderr)
        print("Confira o Ollama aberto e o modelo baixado. "
              "Se o retorno for inválido, revise-o antes de tentar novamente.",
              file=sys.stderr)
        sys.exit(1)
