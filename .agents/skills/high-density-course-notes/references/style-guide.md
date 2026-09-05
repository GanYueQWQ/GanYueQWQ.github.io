# Personal Style Guide

This guide captures the style demonstrated by `复变函数A·第一章 复数和平面点集` and the user's later compression of `光学 第一章 几何光学`. It should guide future notes without copying subject-specific quirks or forcing every topic into the same template.

## Editorial character

The finished note reads like a compact, structured teaching text rather than a transcript. State the concept or conclusion directly, then add explanation only where notation, proof logic, physical meaning, or an application would otherwise be unclear. Tone is direct and academic, with occasional short prompts such as “问题”, “约定”, “注”, “例” or “易考点” to orient the reader.

The desired density is “one idea per short paragraph”. Prefer formulas, short lists, and precise relationships over continuous exposition. Remove broad scene-setting, repeated transitions, and conclusions already obvious from the formula, but do not shorten away a condition that changes the result.

## Markdown hierarchy

- Begin with valid Hexo YAML frontmatter when publishing to this blog: `title`, `date`, `categories`, `tags`, and `mathjax: true`.
- Preserve the hierarchy of the selected textbook or official lecture sequence when it is coherent. Use `#` for a chapter-level block, `##` for a section, and `###` or `####` for a focused law, phenomenon, derivation, or example.
- Prefer the textbook's subject names, such as `几何光学的基本定律` followed by `几何光学三定律` and `反射与折射`. Keep chapter or section numbers only when they help the reader map the note to the source.
- Use a horizontal rule only for a genuine transition, not between every subsection.
- Keep paragraphs short. Use lists for parallel definitions, cases, or procedures. Use a compact table when several phenomena share the same comparison dimensions, such as optical path, conditions, or observed order.

## Emphasis system

- Use **bold** for the term being defined, a decisive condition, the central conclusion, or the part most likely to be confused.
- Use a blockquote for a compact takeaway, convention, warning, problem statement, or memorable interpretation. It should add navigational value rather than restate the preceding paragraph.
- Use `\boxed{...}` sparingly for a final formula or conclusion worth locating during review.
- Use numbered cases such as `**(1) ...**` when a result naturally splits into alternatives.
- Use `> **易考点**：...` for a source-backed detail that is easy to overlook and naturally testable. Use `> **易错点**：...` for a sign, condition, boundary case, or conceptual distinction that commonly changes an answer. Keep both sparse and specific.

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

If a formal definition is already clear from the formula and surrounding heading, a single sentence plus the formula is enough. Do not repeat the same definition in prose before and after the display equation.

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

For a familiar physical phenomenon, a one-line statement of mechanism may replace a full derivation. If several such phenomena are compared, prefer a list or table. Keep a calculation only when it demonstrates a reusable setup, a course-specific convention, or a likely assessment move.

## Enrichment without bloat

Useful additions include a geometric interpretation, why a theorem hypothesis is necessary, a connection to a later topic, a contrasting example, or a source-backed detail likely to appear as a short exam question. Keep each addition close to the statement it illuminates and usually within one short paragraph or blockquote.

Avoid generic study tips, broad motivational commentary, and exhaustive catalogs of consequences.

## Final quality bar

The note should be faster to review than the lecture handout, more reliable than the handwritten note, and readable without having either source open. Its outline should remain recognizable from the course or textbook. It should feel selective rather than merely shortened: familiar material is compressed, conceptual bottlenecks receive detail, and overlooked assessment conditions are surfaced without turning the note into an exam-tip catalog.
