# -*- coding: utf-8 -*-
"""AI 腔体检测试：从 .typ 正文里抽正文段，算可复现的风格指标。

用法： python ai_taste_check.py <file.typ> [...]

只统计"正文散文段"：跳过注释、以 # 开头的排版指令、标题行、参考文献区。
段落 = 一个连续的散文块（Typst 里就是一个空行分隔的块）。

指标：
  1. 节奏均匀度：段落长度/句长的变异系数 CV。人写波动大，模型写更均匀。
  2. 对举句式密度："A，却/但/而/则 B" 这类平衡句每百字出现次数。
  3. 抽象:实体 词频比：论证体模型输出的典型症状。
"""
import re
import sys
import statistics as st
from collections import Counter

ABSTRACT = """条件 空间 动力 权限 代价 预期 利益 目标 差异 结构 机制 关系 安排 维度 层面
框架 逻辑 视角 边界 前提 约束 意义 价值 作用 影响 特征 属性 路径 模式 过程 状态
内在 外在 微观 宏观 整体 局部 主体 客体 要素 功能 均衡 激励""".split()

CONCRETE = """泥 水 雨 雪 霜 冷 冻 烟 火 血 尸 味 枪 炮 战壕 铁 木 教堂 村庄 面包
香肠 布丁 巧克力 烟草 酒 雪茄 纽扣 靴 报纸 灯 树 蜡烛 手 脸 眼睛 唱 喊 走
罐头 香烟 帽子 信件 母亲 咖啡 饼干""".split()

HEDGE = r"可能|未必|或许|不一定|并不|需要|应该|有助于|不能简单|容易|大概|大体"


def load_body(path):
    raw = open(path, encoding="utf-8").read()
    raw = re.sub(r"//.*", "", raw)              # 去掉行注释
    blocks = re.split(r"\n\s*\n", raw)
    body, started, out = [], False, []
    for b in blocks:
        s = b.strip()
        if not s:
            continue
        if s.startswith("#heading") and "参考文献" in s:
            break
        if not started:
            # 正文从第一个散文块开始（跳过 #set / #align 抬头块）
            if s.startswith("#"):
                continue
            if s.startswith("#line"):
                continue
            started = True
        if s.startswith(("#", "//")):
            continue
        body.append(s)
        out.append(s)
    text = "".join(out)
    return re.sub(r"#cite\([^)]*\)", "", text), out


def clean(p):
    p = re.sub(r"#cite\([^)]*\)", "", p)
    p = re.sub(r"#strong\[(.*?)\]", r"\1", p, flags=re.S)
    p = re.sub(r"#\w+(\[[^\]]*\])?", "", p)
    p = re.sub(r"[#*_`]", "", p)
    return p.strip()


def cv(xs):
    return st.pstdev(xs) / st.mean(xs) if len(xs) > 1 and st.mean(xs) else 0.0


def report(path):
    text, raw_paras = load_body(path)
    paras = [clean(p) for p in raw_paras]
    paras = [p for p in paras if len(p) > 20]
    sents = [s for s in re.split(r"[。！？]", text) if len(s.strip()) > 1]
    plen = [len(p) for p in paras]
    slen = [len(s) for s in sents]

    pairs = re.findall(r"[^。！？]{4,}(?:，|；)(?:却|但|而|则|也|又)[^。！？]{4,}", text)
    hedge = re.findall(HEDGE, text)
    dual = re.findall(r"如果[^。]{2,}，[^。]{2,}；如果", text)
    abs_n = sum(text.count(w) for w in ABSTRACT)
    con_n = sum(text.count(w) for w in CONCRETE)

    print(f"\n=== {path} ===")
    print(f"正文长度        {len(text)} 字   段落 {len(paras)} 个   句 {len(sents)} 个")
    print(f"段落长度        最短 {min(plen)} / 最长 {max(plen)} 字，"
          f"CV={cv(plen):.3f}（越高越像人）")
    print(f"句长            平均 {st.mean(slen):.1f} 字，CV={cv(slen):.3f}")
    print(f"  短句(<=12字)  {sum(1 for x in slen if x <= 12)} 个"
          f"   长句(>=60字) {sum(1 for x in slen if x >= 60)} 个")
    print(f"对举句          {len(pairs)} 处（每百字 {100*len(pairs)/max(len(text),1):.2f}，越低越好）")
    print(f"双分支条件句    {len(dual)} 处")
    print(f"模糊限定词      {len(hedge)} 个（每百字 {100*len(hedge)/max(len(text),1):.2f}，越低越好）")
    print(f"抽象词 {abs_n} / 实体感官词 {con_n} = "
          f"{abs_n/max(con_n,1):.1f} : 1（越接近 1 越好）")
    print(f"逗号:句号       {text.count('，')}:{text.count('。')}")
    print(f"阿拉伯数字      {len(re.findall(r'[0-9]+', text))} 处（具体信息量）")
    print(f"引号内引用      {len(re.findall(r'[“][^”]{2,}[”]', text))} 处")
    top = Counter(re.findall(r"[\u4e00-\u9fa5]{2,4}", text)).most_common(10)
    print("高频词          " + " ".join(f"{w}×{c}" for w, c in top))


if __name__ == "__main__":
    for p in sys.argv[1:]:
        report(p)
