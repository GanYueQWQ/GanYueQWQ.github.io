import pymupdf, os
base = r"E:\GanYueQWQ.github.io\source\course-materials\files\大二\诺奖经济学导读\课件"
for fn in ["3. 第二篇 第一章 抛砖引玉博弈论 2026.9.15.pdf", "4. 第二篇 第一章 抛砖引玉博弈论 2026.9.22.pdf"]:
    p = os.path.join(base, fn)
    d = pymupdf.open(p)
    print("="*70); print(fn, "pages:", d.page_count); print("="*70)
    for i, pg in enumerate(d):
        t = pg.get_text().strip()
        if t: print(f"\n--- p{i+1} ---\n{t[:1400]}")
