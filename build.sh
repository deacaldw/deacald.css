#!/usr/bin/env sh
# Builds the docs site into public/, ready to upload or deploy.
set -eu
cd "$(dirname "$0")"

rm -rf public
mkdir public
cp index.html deacald.css deacald.js public/

echo "Built public/ at $(git rev-parse --short HEAD 2>/dev/null || echo 'an uncommitted state')."
