# Hexo Mathematics Rendering

Read this reference only when the note will be published through Hexo. The repository's installed renderer and plugin versions determine the required source syntax; valid standalone TeX is not sufficient if Markdown transforms it before MathJax runs.

## Identify the pipeline

Inspect package.json, the site _config.yml, theme configuration, and the installed mathematics plugin before editing formulas. Do not assume that all Hexo sites use the same renderer.

When the site uses hexo-renderer-marked followed by the server-side hexo-filter-mathjax, Markdown processes the source before MathJax. Apply the compatibility rules below.

## Marked and MathJax compatibility

- Put the formula immediately between the display delimiters. Do not leave a blank line after the opening double-dollar delimiter or before the closing delimiter.
- Escape every TeX subscript underscore as \_ in Markdown source. Marked consumes the escape and passes _ to MathJax. Do not clean up these escapes as though the file were standalone TeX.
- In starred TeX environments, escape the star for Markdown, for example \begin{eqnarray\*} and \end{eqnarray\*}.
- Where TeX requires a \\ row break, write \\\\ in Markdown source so the intended two backslashes reach MathJax.
- Preserve the mathematical meaning while applying renderer escapes. In particular, check dot accents, derivative order, signs, indices, and equation alignment after any mechanical rewrite.

A compatible display block has this shape:

    $$
    m\_i\ddot{\boldsymbol r}\_i
    =\sum\_{j\ne i}\boldsymbol F\_{ji}+\boldsymbol F\_i^{\mathrm e}.
    $$

These rules are specific to the verified renderer pipeline. If the site uses Pandoc or another math-aware Markdown renderer, follow that renderer's syntax instead of carrying over Marked-specific escapes blindly. Changing the site's renderer or dependencies is a project-level decision and requires the user's request; do not do it merely to avoid fixing one note.

## Verification

Build the actual Hexo site after the final edit, then inspect the generated HTML for the target article.

Require all of the following:

- no literal display delimiters in ordinary paragraph elements;
- no emphasis, strong, or other Markdown-generated tags inside an unrendered formula;
- no data-mjx-error attribute or visible MathJax error node;
- representative inline, display, multi-line aligned, and boxed formulas appear as MathJax container output;
- the generated page reflects the current source rather than a stale earlier build.

Finally inspect representative formulas visually. Count-based or HTML checks can detect raw or errored formulas, but they do not prove that a correct-looking formula still has the intended derivative order, sign, index, or line break.
