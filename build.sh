#!/bin/sh
# Bundles the ES-module sources into one classic script so the site also works from file:// (double-click).
cd "$(dirname "$0")/js" || exit 1
{ echo "(function(){'use strict';"
  for f in data storage ui app; do sed -E '/^import /d; s/^export (async )?(function|const|let|class) /\1\2 /' "$f.js"; done
  echo "})();"; } > ecosphere.js && node --check ecosphere.js && echo "built js/ecosphere.js"
