set -e
set -x

npx nx build tl8-react
cp packages/tl8-react/package.json dist/tl8-react

(cd dist/tl8-react && npm publish --dry-run)
