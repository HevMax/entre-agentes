"""Fluxo funcional sem IA. Valores em reais inteiros, todos fictícios."""
import json


def cardapio(contexto):
    """Especialista 1: recebe convidados e preferência, não o pedido inteiro."""
    pessoas = contexto["pessoas"]
    vegetariano = contexto["vegetariano"]
    return {
        "prato": "Massa com tomate" if vegetariano else "Frango com arroz",
        "comida": pessoas * (20 if vegetariano else 25),
        "bebidas": pessoas * 5,
    }


def orcamento(plano, limite):
    """Especialista 2: depende do plano e usa uma soma como ferramenta."""
    total = sum([plano["comida"], plano["bebidas"]])
    return {"total": total, "saldo": limite - total, "cabe": total <= limite}


def validar(pedido):
    if type(pedido["pessoas"]) is not int or pedido["pessoas"] < 1:
        raise ValueError("Informe um número inteiro positivo de pessoas.")
    if type(pedido["limite"]) is not int or pedido["limite"] < 0:
        raise ValueError("O limite deve ser um inteiro não negativo.")
    if type(pedido["vegetariano"]) is not bool:
        raise ValueError("Vegetariano deve ser True ou False.")


def orquestrar(pedido):
    """Coordena a ordem, distribui contexto e reúne os dois resultados."""
    validar(pedido)
    contexto = {"pessoas": pedido["pessoas"],
                "vegetariano": pedido["vegetariano"]}
    plano = cardapio(contexto)
    # Esta chamada só acontece depois de obter as estimativas do cardápio.
    conta = orcamento(plano, pedido["limite"])
    return {"cardapio": plano, "orcamento": conta}


if __name__ == "__main__":
    pedido = {"pessoas": 6, "limite": 180, "vegetariano": True}
    print(json.dumps(orquestrar(pedido), ensure_ascii=False, indent=2))
