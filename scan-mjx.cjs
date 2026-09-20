const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let total = 0;
for (const f of walk('public')) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /data-mjx-error="([^"]*)"/g;
  const counts = {};
  let m;
  while ((m = re.exec(html))) counts[m[1]] = (counts[m[1]] || 0) + 1;
  const keys = Object.keys(counts);
  if (keys.length) {
    const n = keys.reduce((a, k) => a + counts[k], 0);
    total += n;
    console.log(`${f.split(path.sep).join('/')}  ->  ${JSON.stringify(counts)}`);
  }
}
console.log('TOTAL MATH ERRORS: ' + total);