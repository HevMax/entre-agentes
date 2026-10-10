"""Prepara o site e URLs absolutas de compartilhamento, sem dependências."""
from pathlib import Path
from urllib.parse import urlsplit
import argparse
import html
import shutil

parser = argparse.ArgumentParser()
parser.add_argument('--url', required=True, help='URL pública do site, incluindo o caminho do repositório')
args = parser.parse_args()
url = args.url.rstrip('/')
parsed = urlsplit(url)
if parsed.scheme not in ('http', 'https') or not parsed.netloc or parsed.query or parsed.fragment:
    parser.error('Informe uma URL HTTP(S) absoluta, sem query string ou fragmento.')
root = Path(__file__).resolve().parent.parent
output = root / 'dist'
output.mkdir(exist_ok=True)
for filename in ('styles.css', 'app.js', 'workshop.css', 'workshop.js', '.nojekyll'):
    shutil.copy2(root / filename, output / filename)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
shutil.copytree(root / 'examples', output / 'examples', dirs_exist_ok=True,
                ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
page = (root / 'index.html').read_text(encoding='utf-8')
safe_url = html.escape(url, quote=True)
page = page.replace('content="assets/social.png"', f'content="{safe_url}/assets/social.png"')
page = page.replace('</head>', f'  <meta property="og:url" content="{safe_url}/">\n  <link rel="canonical" href="{safe_url}/">\n</head>')
(output / 'index.html').write_text(page, encoding='utf-8')
print(f'Site preparado em {output}; URL pública: {url}/')
