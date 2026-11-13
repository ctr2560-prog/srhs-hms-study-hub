#!/bin/sh
# Builds the SRHS HMS Study Hub into one self-contained file: hms.html
set -e
cd "$(dirname "$0")"
mkdir -p build
[ -f src/audio-manifest.js ] || echo "const AUDIO = null;" > src/audio-manifest.js
{
  printf 'const LOGO="data:image/png;base64,%s";\n' "$(base64 -i src/logo.png | tr -d '\n')"
  cat src/meta.js src/content-fa1a.js src/content-fa1b.js src/content-fa2a.js src/content-fa2b.js src/reader.js src/models-fa1.js src/models-fa2.js src/models-er.js src/audio-manifest.js src/app.jsx
} > build/bundle.jsx
npx esbuild build/bundle.jsx --loader:.jsx=jsx --jsx-factory=React.createElement --jsx-fragment=React.Fragment --target=es2019 --minify-syntax --minify-whitespace --outfile=build/bundle.js --log-level=warning
{
  cat src/head.html
  echo '<div id="root"><div class="boot">SRHS HMS Study Hub</div></div>'
  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>'
  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>'
  printf '<script>'
  cat build/bundle.js
  echo '</script>'
} > hms.html
echo "Built hms.html ($(wc -c < hms.html | tr -d ' ') bytes)"

# Standalone web page for GitHub Pages (full document wrapper)
{
  echo '<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  printf '<link rel="icon" href="data:image/png;base64,%s">' "$(base64 -i src/logo.png | tr -d '\n')"
  cat src/head.html
  echo '<style>body{margin:0}</style></head><body>'
  sed -n '/<div id="root">/,$p' hms.html
  echo '</body></html>'
} > index.html
echo "Built index.html ($(wc -c < index.html | tr -d ' ') bytes)"
