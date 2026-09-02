# Personal Style Guide

This guide captures the style demonstrated by `复变函数A·第一章 复数和平面点集` and should guide future notes without forcing every topic into the same template.

## Editorial character

The finished note reads like a compact teaching text rather than a transcript. It moves quickly, but inserts explanation exactly where notation, proof logic, or geometric meaning would otherwise become opaque. Tone is direct and academic, with occasional short prompts such as “问题”, “约定”, “注”, or “即” to orient the reader.

The desired density is “one idea per short paragraph”. Prefer formulas and precise relationships over long prose, but do not let formulas appear without stating what they establish.

## Markdown hierarchy

- Begin with valid Hexo YAML frontmatter when publishing to this blog: `title`, `date`, `categories`, `tags`, and `mathjax: true`.
- Use `#` for a major conceptual block, `##` for a topic, and `###` for a focused definition, method, proof, or example family.
- Prefer semantic titles such as `复数的运算` or `欧拉公式的导出`. Do not manually number every heading unless the user asks to mirror the course numbering.
- Use a horizontal rule only for a genuine transition, not between every subsection.
- Keep paragraphs short. Use lists for parallel definitions, cases, or procedures rather than for continuous exposition.

## Emphasis system

- Use **bold** for the term being defined, a decisive condition, the central conclusion, or the part most likely to be confused.
- Use a blockquote for a compact takeaway, convention, warning, problem statement, or memorable interpretation. It should add navigational value rather than restate the preceding paragraph.
- Use `\boxed{...}` sparingly for a final formula or conclusion worth locating during review.
- Use numbered cases such as `**(1) ...**` when a result naturally splits into alternatives.

## Mathematical presentation

- Put short symbols and relations inline with `$...$`; use display math for definitions, derivations, systems, and formulas that deserve visual focus.
- Introduce symbols immediately before using them. State domains and exclusions such as `$z\ne0$` where they matter.
- For a derivation, show the conceptual bridge: announce the substitution or comparison, display the meaningful steps, then state the conclusion in words.
- Use aligned equations, cases, or implication arrows when they expose structure. Avoid an unbroken wall of algebra.
- Preserve LaTeX commands exactly. In particular, do not lose backslashes in commands such as `\rho`, `\bar z`, `\operatorname`, or line breaks.
- Keep notation consistent with the teacher's convention unless it is erroneous. If a less ambiguous notation materially improves the note, explain the change once.

## Definitions and intuition

A strong definition passage usually contains:

1. the formal definition with all conditions;
2. a one-sentence interpretation or geometric meaning when useful;
3. an equivalent characterization or immediate consequence only if it aids recall;
4. a tiny example or counterexample when the boundary of the concept is easy to confuse.

Do not pad familiar definitions with historical background or generic motivation.

## Proof depth

Give enough detail that a reader can reconstruct the argument later. Explicitly name the proof mechanism—comparison of real and imaginary parts, conjugation, parametrization, a limiting path, substitution, or an earlier theorem—and retain the steps where that mechanism becomes valid.

Skip routine expansion or arithmetic after the pattern is clear. A proof should end with a sentence identifying exactly what has been established, not merely the last equation.

## Examples

Retain a lecture example when it demonstrates a reusable move or was marked important in the handwritten notes. Present it as:

- a compact problem statement;
- the key setup or representation;
- a derivation with non-obvious steps visible;
- a concise result and, when useful, what the example teaches.

Merge examples that use the same method. Omit repetitive drill questions and computations whose only purpose is mechanical practice. Never leave a numbered subproblem unfinished without explicitly saying that only a selected part is being discussed.

## Enrichment without bloat

Useful additions include a geometric interpretation, a “no holes” intuition after a formal topological definition, why a theorem hypothesis is necessary, a connection to a later topic, or a contrasting example. Keep each addition close to the statement it illuminates and usually within one short paragraph or blockquote.

Avoid generic study tips, broad motivational commentary, and exhaustive catalogs of consequences.

## Final quality bar

The note should be faster to review than the lecture handout, substantially more complete than the handwritten note, and readable without having either source open. It should feel selective rather than abbreviated: simple material is compressed, while conceptual bottlenecks receive detail.
