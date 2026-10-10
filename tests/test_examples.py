"""Execute: python -m unittest discover -s tests -v. Não chama IA real."""
import io
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "examples"))
import jantar
import jantar_ollama


class DinnerTests(unittest.TestCase):
    def test_default_dinner(self):
        result = jantar.orquestrar({"pessoas": 6, "limite": 180, "vegetariano": True})
        self.assertEqual(result["cardapio"]["prato"], "Massa com tomate")
        self.assertEqual(result["orcamento"], {"total": 150, "saldo": 30, "cabe": True})

    def test_budget_edges_and_diet(self):
        for people in (2, 4, 6, 8):
            for vegetarian in (True, False):
                total = people * (25 if vegetarian else 30)
                for limit in (0, total - 1, total, total + 1):
                    with self.subTest(people=people, vegetarian=vegetarian, limit=limit):
                        result = jantar.orquestrar({"pessoas": people, "limite": limit,
                                                  "vegetariano": vegetarian})
                        self.assertEqual(result["orcamento"]["total"], total)
                        self.assertEqual(result["orcamento"]["saldo"], limit - total)
                        self.assertEqual(result["orcamento"]["cabe"], limit >= total)

    def test_invalid_input(self):
        for key, value in (("pessoas", 0), ("pessoas", 1.5), ("pessoas", True),
                           ("limite", -1), ("limite", "180"), ("vegetariano", "sim")):
            with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                jantar.orquestrar({"pessoas": 6, "limite": 180,
                                   "vegetariano": True, key: value})

    def test_model_handoff_with_simulated_responses(self):
        with patch.object(jantar_ollama, "consultar", side_effect=[
                '{"prato":"massa"}', 'Cabe no limite informado.'
        ]) as call:
            result = jantar_ollama.orquestrar_com_modelo(
                {"pessoas": 6, "limite": 180, "vegetariano": True})
            self.assertEqual(call.call_count, 2)
            sent_to_budget = call.call_args_list[1].args[1]
            self.assertEqual(sent_to_budget["plano"], result["cardapio"])
            self.assertEqual(sent_to_budget["conta_verificada"]["total"], 150)
            self.assertEqual(result["orcamento"]["total"], 150)

    def test_invalid_model_output_stops_before_second_call(self):
        for output in ('não é JSON', '[]', '{"prato":"pizza"}', '{"prato":"frango"}'):
            with self.subTest(output=output):
                with patch.object(jantar_ollama, "consultar", return_value=output) as call:
                    with self.assertRaises(ValueError):
                        jantar_ollama.orquestrar_com_modelo(
                            {"pessoas": 6, "limite": 180, "vegetariano": True})
                    self.assertEqual(call.call_count, 1)

    def test_http_contract_with_fake_transport(self):
        response = io.BytesIO(json.dumps({"message": {"content": "Resposta simulada"}}).encode())
        with patch.object(jantar_ollama, "urlopen", return_value=response) as transport:
            self.assertEqual(jantar_ollama.consultar("Instrução", {"pessoas": 6}),
                             "Resposta simulada")
            request = transport.call_args.args[0]
            payload = json.loads(request.data)
            self.assertEqual(request.full_url, "http://127.0.0.1:11434/api/chat")
            self.assertFalse(payload["stream"])
            self.assertEqual(payload["messages"][0]["role"], "system")
            self.assertEqual(json.loads(payload["messages"][1]["content"]), {"pessoas": 6})

    def test_empty_model_output(self):
        response = io.BytesIO(b'{"message":{"content":""}}')
        with patch.object(jantar_ollama, "urlopen", return_value=response):
            with self.assertRaises(ValueError):
                jantar_ollama.consultar("Instrução", {})


if __name__ == "__main__":
    unittest.main()
