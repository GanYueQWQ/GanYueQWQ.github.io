// 直接测 hexo-filter-mathjax 同款 MathJax 渲染 cases,判断 \\ 数量影响
const { mathjax } = require('@mathjax/src/js/mathjax.js');
const { TeX } = require('@mathjax/src/js/input/tex.js');
const { SVG } = require('@mathjax/src/js/output/svg.js');
const { LiteAdaptor } = require('@mathjax/src/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('@mathjax/src/js/handlers/html.js');
require('@mathjax/src/js/util/asyncLoad/node.js');

(async () => {
  const adaptor = new LiteAdaptor();
  RegisterHTMLHandler(adaptor);
  const tex = new TeX({ tags: 'ams', inlineMath: { '[+]': [['$','$']] } });
  const svg = new SVG({ fontCache: 'none' });
  const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

  // 语法: 编译源里 \\\\ 是JS字符串的两个反斜杠,即tex源码 \\ 两个字符
  // 用JS String.raw 精确保留反斜杠
  const casesTwo = String.raw`\begin{cases} a = b \\ c = d \end{cases}`;   // tex收到 \\ (2反斜杠)
  const casesFour = String.raw`\begin{cases} a = b \\\\ c = d \end{cases}`; // tex收到 \\\\ (4反斜杠)

  for (const [label, src] of [['tex_2bs', casesTwo], ['tex_4bs', casesFour]]) {
    try {
      const out = adaptor.innerHTML(html.convert(src, { display: true, em: 16, ex: 8, containerWidth: 800 }));
      console.log(`${label}: mtable=${out.includes('<mtable')} mtr=${out.includes('<mtr')}`);
    } catch(e) {
      console.log(`${label}: ERROR ${e.message}`);
    }
  }
  process.exit(0);
})();
