# -*- coding: utf-8 -*-
"""中文文风自检：把稿子里的"AI 腔"拆成可复现的指标。

用法：
    python zh_style_check.py 稿件.typ [另一稿.typ ...]
    python zh_style_check.py 旧稿.typ 新稿.typ      # 自动对比
    python zh_style_check.py 稿件.md --json

支持 .typ / .md / .txt。Typst 文件会自动剥掉 #set / #show / 注释等排版指令，
只统计正文散文段落。

指标三类：
  1. 节奏均匀度 —— 人写波动大，模型写更均匀（段落/句长变异系数）。
  2. 对举与限定 —— "A，却/但/而/则 B" 一类平衡句、模糊限定词的密度。
  3. 抽象与具体 —— 抽象名词多、实体细节少，是论证体模型输出的典型症状。
另附经济学内容配比（经济学词 vs 史实词），用于检查"经济学文章有没有在讲经济学"。
"""
import json
import re
import statistics as st
import sys
from collections import Counter

SENT_END = "。！？"

# 抽象词：出现本身没问题，密度过高才是症状
ABSTRACT = """条件 空间 动力 权限 代价 预期 利益 目标 差异 结构 机制 关系 安排 维度 层面
框架 逻辑 视角 边界 前提 约束 意义 价值 作用 影响 特征 属性 路径 模式 过程 状态
内在 外在 微观 宏观 整体 局部 主体 客体 要素 功能 均衡 激励 范式 话语 建构""".split()

# 具体/感官词：人写的文章里通常反超抽象词
CONCRETE = """泥 水 雨 雪 霜 冷 冻 烟 火 血 尸 味 枪 炮 战壕 铁 木 教堂 村庄 面包
香肠 布丁 巧克力 烟草 酒 雪茄 纽扣 靴 报纸 灯 树 蜡烛 手 脸 眼睛 唱 喊 走
罐头 香烟 帽子 信件 母亲 咖啡 饼干 桌子 椅子 门 窗 街 车 钱 饭 茶""".split()

HEDGE = r"可能|未必|或许|也许|大概|大体|在一定程度上|一定程度上|需要指出|值得注意的是|不难看出|显而易见"

# 对举句式：一句里出现转折/并列连接词
PAIR_RE = re.compile(r"[^。！？]{4,}(?:，|；)(?:却|但|而|则|也|又|同时)[^。！？]{4,}")
# 双分支条件句
DUAL_RE = re.compile(r"如果[^。]{2,}，[^。]{2,}；如果")

ECO_WORDS = """博弈 均衡 纳什 帕累托 收益 支付 策略 激励 贴现 重复 机制 参与人 占优
囚徒 卡特尔 偏好 信息 效用 边际 成本 理性 契约 制度 产权 外部性 公共品 搭便车
信号 委托 代理 均衡选择 激励相容 机会成本 稀缺 权衡 弹性 剩余""".split()

HIS_WORDS = """赫尔斯 报告 档案 德军 英军 战壕 雪茄 备忘录 日记 1914 圣诞节 士兵
上尉 军长 步兵旅 阵地 停火 军法 审判 书信 史料 考证 原件 转录""".split()


def strip_markup(text):
    """把文件切成"散文段"。

    Typst 的指令可以跨行且括号嵌套，用正则逐行处理不可靠，所以这里改用
    结构判据 + 保留空行分段：
      1. 丢掉注释与代码块；
      2. 丢掉"碎行"——不以汉字为主、或汉字太少的行（指令、括号、表格参数）；
      3. 丢掉标题行（#heading / # / ## 开头）与行首方括号；
      4. **保留空行**，让调用方仍能按段落切分。
    每个碎行单独替换为空串，这样它所在的位置会留下空行，段落边界因此得以保留。
    """
    text = re.sub(r"//.*", "", text)                       # Typst 行注释
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"```.*?```", "", text, flags=re.S)      # 代码块

    out = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            out.append("")
            continue
        han = len(re.findall(r"[\u4e00-\u9fa5]", s))
        # 标题行、非散文行、汉字太少的行：丢成空行
        if s.startswith(("#", "|", ">", "-", "*")) or han < 12:
            out.append("")
            continue
        if han / max(len(s), 1) < 0.5:
            out.append("")
            continue
        out.append(s)

    lines = []
    for line in out:
        line = re.sub(r"#cite\([^)]*\)", "", line)
        line = re.sub(r"#\w+(\([^)]*\))?(\[[^\]]*\])?", "", line)
        line = re.sub(r"<ref-[^>]*>", "", line)
        line = re.sub(r"\[[^\]]*\]", "", line)
        line = re.sub(r"[*_`#]", "", line)
        line = re.sub(r"（\s*）|\(\s*\)", "", line)
        lines.append(line.strip())
    return "\n".join(lines)


def cut_to_body(text):
    """只取正文：截到参考文献小节之前。

    注意不能直接 find("参考文献")——它可能出现在文件开头的注释里。这里只认
    小节标记（形如 [参考文献] 的标题，或独占一行的"参考文献"/"References"）。
    """
    marks = []
    m = re.search(r"#heading[^\n]*\[参考文献\]", text)
    if m:
        marks.append(m.start())
    for pat in (r"(?m)^\s*#{1,6}\s*参考文献\s*$", r"(?m)^\s*参考文献\s*$",
                r"(?m)^\s*#{1,6}\s*References\s*$"):
        mm = re.search(pat, text)
        if mm:
            marks.append(mm.start())
    if marks:
        text = text[:min(marks)]
    return text


def load_body(path):
    raw = open(path, encoding="utf-8").read()
    text = cut_to_body(strip_markup(raw))
    blocks = [re.sub(r"\s+", " ", b).strip()
              for b in re.split(r"\n\s*\n", text) if b.strip()]
    paras = [b for b in blocks if len(re.findall(r"[\u4e00-\u9fa5]", b)) >= 10]
    return "".join(paras), paras


def cv(xs):
    return st.pstdev(xs) / st.mean(xs) if len(xs) > 1 and st.mean(xs) else 0.0


def analyze(path):
    text, paras = load_body(path)
    sents = [s for s in re.split(r"[。！？]", text) if len(s.strip()) > 1]
    plen = [len(p) for p in paras] or [0]
    slen = [len(s) for s in sents] or [0]

    pairs = PAIR_RE.findall(text)
    dual = DUAL_RE.findall(text)
    hedge = re.findall(HEDGE, text)
    abs_n = sum(text.count(w) for w in ABSTRACT)
    con_n = sum(text.count(w) for w in CONCRETE)
    eco_n = sum(text.count(w) for w in ECO_WORDS)
    his_n = sum(text.count(w) for w in HIS_WORDS)
    quotes = re.findall(r"[“「][^”」]{2,}[”」]", text)
    n = max(len(text), 1)

    return {
        "file": path,
        "chars": len(text),
        "paras": len(paras),
        "para_min": min(plen), "para_max": max(plen),
        "para_cv": round(cv(plen), 3),
        "sent_mean": round(st.mean(slen), 1),
        "sent_cv": round(cv(slen), 3),
        "short_sents": sum(1 for x in slen if x <= 12),
        "long_sents": sum(1 for x in slen if x >= 60),
        "pairs": len(pairs),
        "pairs_per100": round(100 * len(pairs) / n, 2),
        "dual_conditionals": len(dual),
        "hedges": len(hedge),
        "hedges_per100": round(100 * len(hedge) / n, 2),
        "abstract": abs_n,
        "concrete": con_n,
        "abs_con_ratio": round(abs_n / max(con_n, 1), 1),
        "digits": len(re.findall(r"[0-9]+", text)),
        "quoted_citations": len(quotes),
        "eco_words": eco_n,
        "his_words": his_n,
        "eco_share": round(100 * eco_n / max(eco_n + his_n, 1), 1),
        "top_words": Counter(re.findall(r"[\u4e00-\u9fa5]{2,4}", text)).most_common(10),
        "pair_samples": [p.strip() for p in pairs[:5]],
    }


def verdict(key, v):
    """给单个指标一个粗判，便于快速定位问题。"""
    if key == "para_cv":
        return "偏AI" if v < 0.2 else ("自然" if v > 0.4 else "中间")
    if key == "sent_cv":
        return "偏AI" if v < 0.45 else ("自然" if v > 0.6 else "中间")
    if key == "pairs_per100":
        return "偏AI" if v > 0.7 else ("自然" if v < 0.55 else "中间")
    if key == "hedges_per100":
        return "偏AI" if v > 1.2 else ("自然" if v < 0.6 else "中间")
    if key == "abs_con_ratio":
        return "偏AI" if v > 2 else ("自然" if v < 1 else "中间")
    return ""


def show(r):
    print(f"\n=== {r['file']} ===")
    print(f"正文 {r['chars']} 字 / 段落 {r['paras']} 个")
    print(f"段落长度 {r['para_min']}–{r['para_max']} 字   CV={r['para_cv']}  "
          f"[{verdict('para_cv', r['para_cv'])}]")
    print(f"句长 平均 {r['sent_mean']} 字   CV={r['sent_cv']}  "
          f"[{verdict('sent_cv', r['sent_cv'])}]   短句 {r['short_sents']} / 长句 {r['long_sents']}")
    print(f"对举句 {r['pairs']} 处（每百字 {r['pairs_per100']}）"
          f"  [{verdict('pairs_per100', r['pairs_per100'])}]   双分支条件句 {r['dual_conditionals']} 处")
    print(f"模糊限定词 {r['hedges']} 个（每百字 {r['hedges_per100']}）"
          f"  [{verdict('hedges_per100', r['hedges_per100'])}]")
    print(f"抽象词 {r['abstract']} : 具体感官词 {r['concrete']} = {r['abs_con_ratio']} : 1"
          f"  [{verdict('abs_con_ratio', r['abs_con_ratio'])}]")
    print(f"阿拉伯数字 {r['digits']} 处   引号内引用 {r['quoted_citations']} 处")
    print(f"内容配比：经济学词 {r['eco_words']} : 史实词 {r['his_words']}"
          f"  → 经济学占比 {r['eco_share']}%")
    print("高频词：" + " ".join(f"{w}×{c}" for w, c in r["top_words"]))
    if r["pair_samples"]:
        print("对举句样本：")
        for p in r["pair_samples"]:
            print("   · " + p)


def main(argv):
    args = [a for a in argv[1:] if not a.startswith("--")]
    as_json = "--json" in argv
    if not args:
        print(__doc__)
        return 2
    results = [analyze(p) for p in args]
    if as_json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
        return 0
    for r in results:
        show(r)
    if len(results) == 2:
        a, b = results
        print("\n--- 对比 ---")
        for k, label, better in [("chars", "正文长度", None),
                                 ("para_cv", "段落CV", "high"),
                                 ("sent_cv", "句长CV", "high"),
                                 ("pairs_per100", "对举句/百字", "low"),
                                 ("hedges_per100", "限定词/百字", "low"),
                                 ("abs_con_ratio", "抽象:具体", "low"),
                                 ("digits", "数字", "high"),
                                 ("quoted_citations", "引号引用", "high")]:
            va, vb = a[k], b[k]
            if better is None:
                tag = ""
            else:
                improved = (vb > va) if better == "high" else (vb < va)
                tag = "  ← 改善" if improved else ("  ← 变差" if vb != va else "")
            print(f"  {label:14} {va} → {vb}{tag}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
