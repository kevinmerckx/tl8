set -e
set -x

npx nx run-many --target=lint
npx nx run-many --target=test --passWithNoTests

npx nx build tl8-react
cp packages/tl8-react/package.json dist/tl8-react
cp packages/tl8-react/README.md dist/tl8-react

npx nx build tl8-angular
cp packages/tl8-angular/package.json dist/packages/tl8-angular
cp packages/tl8-angular/README.md dist/packages/tl8-angular

(cd dist/tl8-react && npm publish --dry-run)
(cd dist/packages/tl8-angular && npm publish --dry-run)
