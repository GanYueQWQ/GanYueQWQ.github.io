// 诺奖经济学导读 · 经济学日志
// 编译：typst compile christmas-truce-journal.typ
// 定稿前请填写学号。字体依赖 SimSun / SimHei（Windows 自带）。
//
// 引用说明：课件页码对应《第二篇 第一章 抛砖引玉博弈论》各次讲义；
// 档案引文与核对状态见 tools/SOURCE-NOTES.md。

#set document(
  title: "从「重复博弈」到「谁能执行」——圣诞休战里的合作机制与它的前提",
  author: "甘悦",
)
#set page(
  paper: "a4",
  margin: (top: 23mm, bottom: 22mm, left: 25mm, right: 25mm),
  numbering: "1",
  number-align: center,
)
#set text(font: ("SimSun", "Times New Roman"), size: 11pt, lang: "zh", region: "CN")
#set par(justify: true, first-line-indent: 2em, leading: 0.76em, spacing: 0.8em)
#show heading.where(level: 1): set text(font: "SimHei", size: 12.5pt, weight: "regular")
#show heading.where(level: 1): set block(above: 1.35em, below: 0.55em)
#show link: set text(fill: rgb("#35576f"))

// 上标引注：正文写 #cite(3)，文末用 <ref-3> 挂参考文献
#let cite(..n) = super(
  (
    n.pos().map(x => link(label("ref-" + str(x)), "[" + str(x) + "]")).join("，")
  )
)

// 档案引文块
#let exq(body) = block(
  width: 100%,
  inset: (left: 12pt, y: 4pt),
  stroke: (left: 1.6pt + rgb("#b9c6d1")),
  above: 0.9em,
  below: 0.9em,
)[
  #set text(size: 10.5pt)
  #set par(first-line-indent: 0pt, justify: false, leading: 0.7em)
  #body
]

#align(center)[
  #text(font: "SimHei", size: 18pt)[从“重复博弈”到“谁能执行”]
  #v(3.5mm)
  #text(font: "SimHei", size: 12.5pt)[—— 圣诞休战里的合作机制与它的前提]
  #v(5mm)
  #text(size: 10pt)[《诺奖经济学导读》经济学日志　甘悦　学号：待填写]
]
#v(3mm)
#line(length: 100%, stroke: 0.5pt + rgb("#8a8a8a"))
#v(4mm)

// ================= 正文 =================

#heading(level: 1, outlined: false)[一、我为什么挑了这个题目]

课程里那句话我抄在这里：“随着时间推移，在重复博弈中，现实中自利的人也会与他人合作。”#cite(1) 我接受它，逻辑我也能自己推一遍。但它有一个地方让我不放心：它讲的是合作#emph[怎么被激励出来]，没有讲合作#emph[由谁执行]。这两件事在经济学的多数场景里是一回事——能算清收益的人，自然也能按收益行动。放在别处就不是了。

让我盯上这个问题的，是1914年12月的一份英军报告。第15步兵旅向师部报告了圣诞节当天的情况：一名德军军官或军士带着雪茄走向英军阵地，没有人向他射击，一两名英军上前会面，随后更多人加入，交换烟草、交谈，参加会面的英军约有两百人。报告的附言紧接着写道，德军表示25日至27日不会开火——然后报告人写下自己的处理：

#exq[I have issued orders for hostile operations to be carried on as usual.]

“我已下令照常进行敌对行动。”#cite(2) 同一页纸上，先有雪茄和会面，再有这句话。真正让我想算一算的不是他们会面这件事，而是这句话为什么能管用：如果前线的合作已经是一种均衡，一个旅部的命令凭什么把它抹掉？

#heading(level: 1, outlined: false)[二、先把这门工具拿出来：士兵面对的是什么博弈]

我不打算一上来就说“这是囚徒困境”。按课件的分类，这是一次#strong[完全信息静态博弈]，先看它到底有没有优势策略。#cite(3)

设某一地段的双方士兵每天同时决定：开枪，或者不开枪。把收益写出来，量级是我按情形设的，符号才是关键：

#align(center)[
  #block(inset: 6pt)[
    #table(
      columns: 3,
      align: (center + horizon, center, center),
      stroke: 0.5pt + rgb("#9aa5ae"),
      inset: 5pt,
      [ ], [对面开枪], [对面不开枪],
      [我开枪], [−8], [+3],
      [我不开枪], [−12], [0],
    )
  ]
]

逐格说：双方对射，我随时可能被狙击或被炮火覆盖，净收益最差；我单方面开火而对面还蒙在鼓里，要么白捡便宜，要么换来同地段的报复性炮击，期望上小赚；两边都克制，我能收尸、取水、修工事、把湿透的靴子烤干，收益为零但比挨炮弹强；最坏的是我克制而对面开枪——我既没设防，又暴露在对方的报复火力下。

这样一来，#strong[“不开枪”是我的优势策略]：对面开枪时它更安全（−12 对 −8），对面不开枪时它也不吃亏（0 对 +3 中那点侥幸并不值得拿命换）。双方都选克制是一个纳什均衡，而且按课件的说法，它比双方对射更#strong[帕累托有效]。#cite(4) 顺带说一句，这个矩阵和囚徒困境不一样：囚徒困境里占优的偏偏是背叛，而这里占优的是合作。所以圣诞休战不需要用“人性本善”来解释——按这套收益，克制本身就是自利的选法。真正要解释的是另一件事：这么好的结果，为什么大部分时候没有出现。

到这一步结论很漂亮，也很有问题。既然不开枪各自都更好，战争为什么还能打四年？这说明#emph[纳什均衡本身没有解释任何事情]——两个均衡都可能存在，真正要问的是哪一个会被选中。课件里那句“纳什均衡是一种僵局”在这里正好用得上：它能告诉我“单方面改变没有好处”，但不能告诉我“一开始为什么走到这里”。#cite(4)

#heading(level: 1, outlined: false)[三、合作靠什么被激励出来，又靠什么被守住]

课件把这个问题问得很直白：“什么条件下才能从没有集权的利己主义者中产生合作？”#cite(1) 它给的答案是重复：把一次性博弈变成重复博弈，未来的报复进入今天的账。

阿克塞尔罗德那场计算机锦标赛的结论也在这里——胜出的“针锋相对”具备四个特征：清晰、善意、刺激性、宽容。刺激性和宽容放在一起看才完整：对方背叛，我报复；只要他回头，我立刻恢复合作，不追究。#cite(1) 课件紧接着提了它的毛病：任何一个错误都会像回声一样反复出现，所以如果可能出现误会，就不要对看到的每一次背叛都施行惩罚。#cite(1) 后来的模拟把这一点做成了正式结果：只要执行有噪声，这类策略就可能锁死在互相报复里。#cite(12)

战壕里这套机制是实打实运转的。阿克塞尔罗德记录过一种双方之间的对称账目：谁的狙击手打死了对面的士兵，对面的炮兵就还击同一个地段；为了少挨炮弹，双方渐渐学会不打对方的“软目标”，也不在对方取水、修工事的时候打扰。他甚至点明，这种默契依赖“同一批人对同一批人”，一旦换防或者上头下来袭击任务，就会断。#cite(5) 课件里举的商业街小吃例子是同一个机制的另一种情形：单品类做法之所以谁也改不动，是因为每个商家都清楚“单方面改变、处境就会变差”，这就是一个靠互相牵制维持住的纳什均衡。#cite(1)

我特别喜欢他把话说到底的那一句：这套体系最终是被袭击任务搞垮的，而袭击之所以特殊，是因为它“#emph[是一种司令部能够监督的持续进攻]”，交火记录、战果统计、任务完成情况都要上报，于是前线再不能靠“今天你打我一下、明天我还你一下”的默契糊过去。他用的是：这些前线小单位 #emph[lost their freedom of action]，“失去了行动自由”。#cite(5)

这句话是关键，而它的分量在经济学上很清楚：阿克塞尔罗德列出的合作条件里，藏着一个他没单独标出来的变量——#strong[参与人必须能自由选择自己下一期的行动]。这不是道德条件，是机制条件。失去它，“针锋相对”这套策略就没法执行，因为执行策略的人已经不在博弈桌上了。

#heading(level: 1, outlined: false)[四、惩罚要可置信：合作机制的第二个前提]

课上讲的“巧妙惩罚”其实是一套组织得很精细的机制：纽约两家音响店搞“终身低价保证”，别处更便宜就按差价双倍赔偿；看起来是在打价格战，实际是用一个公开承诺的惩罚条款把价格联盟焊死了——察觉作弊，惩罚作弊者。#cite(1) 也就是说，重复博弈里那个“未来报复”的威胁，在现实中往往需要一个人为设计的装置才能变得可信。

战壕里的装置不一样：它没有中央执行者，全靠双方自己动手。这既是它的优势（不需要谁来协调，成本极低，能覆盖整条战线），也是它的死穴——它的执行完全依赖每个参与人#strong[还能自己开枪或者自己不开枪]。#cite(5) 一旦有人被拿走了这个自由，装置不是变弱，是直接失效。

战壕里发生了两次“拿走自由”，值得分开看。

第一次是双向的，也是我原以为最该出现的那种。苏格兰卫队的赫尔斯上尉在12月25日记下：他上午回营报告，再出来时发现自己的战壕几乎空了——士兵们没经他同意全跑到中间地带去了，他用的词是“#emph[completely denuded against my orders]”；他只好重新下令，只准一名军士带两个人出去。到27日他们仍在会面，因为他得到的指示是“对方不开枪我们就不开枪”，而对方坚持停火没有结束。#cite(6) 纪律在战壕里失效过一次：士兵自己扩大了合作，军官只能跟上。这件事对我的前提是个反例，我记着它。

第二次是单向的，而且非常具体。12月27日——正是赫尔斯还在跟对面见面的那天——第2军军长史密斯-多里恩下发了一份机密备忘录：

#exq[I have issued the strictest orders that on no account is socialising to be allowed between opposing troops. ... I am calling as to particulars of names of officers and units who took part in this Christmas gathering, with a view to disciplinary action.]

“我已下过最严的命令，绝不允许敌对双方的士兵交往。……我正在收集参加了这次圣诞聚会的人员名单，以便作出纪律处理。”#cite(7) 注意他收集的是“姓名和单位”。他不需要说服任何人，也不需要改谁的偏好，他只要把每个参与人下一期的行动从“自由选择”变成“按规定选择”。

这个机制的效果后来是可以观察的。1915年圣诞节，赫尔斯同团的伊恩·科尔洪上尉又和对面谈了一次停火——只为收尸，外加十几分钟换烟，时间到了他吹哨让双方回战壕。结果他被指控“认可与敌停战”，1916年1月17日接受军事审判，到场作证的是黑格本人，他被判有罪，最后处以申斥。#cite(8) 判得不算重，但这件事的信息价值极高。课件在讲惩罚机制时提过三个要求：方式简单明确、参与者确信作弊者必受惩罚、以及“侦查机制出错时不至于造成过于严重的错误”。#cite(4) 科尔洪案在后两点上都给出了答案：惩罚不重（只是申斥），但确定性很高，因为下命令的是军长、作证的是总司令。它把一个类型识别的问题解决了——一个军官今后还会不会默许停火？不会了。

我要把克罗克（Terri Blom Crocker）的研究放进来，因为它是对我这套说法最有分量的反驳。她查完档案后的结论是：军官普遍默许甚至赞成休战，而且没有士兵因为参加1914年那次休战而受罚。#cite(9) 我核对了一下，这两件事其实并不冲突，反而互相印证了同一个机制：合作在#emph[惩罚不确定、执行不到位]的时候最稳定。史密斯-多里恩那份备忘录本身就带着一股火气，他抱怨自己下过的命令“没有用”；科尔洪案里，被指控的行为按当时的军法并不构成犯罪，最后是靠“行为不利于良好秩序与军纪”这一条套进去的，而结果只是申斥。惩罚的力度不大，但确定性一旦被高层反复确认，合作就撑不住了。

可以说得更宽松一点：1914年12月之后，西线各地未必完全没有零星的默契，通行的研究（#cite(10)所引两书）系统梳理过其后的禁令、轮换与处置；我没能逐份读到那批命令原件，所以这里只用了两件有第一手材料支撑的案子，把判断限定在“哪种激励结构更容易维持合作”这个层面。用课件的话说，我关心的是#strong[激励相容]：一套安排要立得住，必须让每个参与人按它行事时自己的收益不吃亏。#cite(4)

#heading(level: 1, outlined: false)[五、我的判断：观点要精练，不是推翻]

我的结论是：课件那句话成立，但它的成立条件是分层的，把条件写清楚以后，它的预测会变。各地情形本来就不整齐——英国国家陆军博物馆依馆藏日记做的说明也强调，休战不是一次统一行动，有些地段照打。#cite(11)

#strong[原来的说法]：反复相遇让自利者也可能合作。

#strong[我的改法]：反复相遇让合作变得值得（激励机制），而合作能否稳定下来，还取决于参与人能否自主执行自己下一期的行动、以及对方能否观察到他的行动（执行与信息机制）。后一组条件不被满足时，前一组条件再好也守不住均衡——第三、四节里那些档案就是这个判断的证据。

这个改法不只是措辞上的补丁，它改变预测。如果合作只由激励决定，那么双方越有耐心、未来越长，合作应当越稳；如果合作还受执行机制约束，那么同一个偏好不变、耐心不变的博弈，会因为#emph[谁能决定行动]改变而突然崩掉。第二节那个矩阵没有变，士兵的收益没有变，耐心也没有变，变的只是“我下一期还能不能自己选”——均衡就没了。这正好是重复博弈这套工具在结构上缺的那一格。

换个比方：重复博弈讲的是“因为会再见，所以今天别骗人”，前提是双方明天都#emph[有能力]继续履约。而战壕里的合作不是被偏好打断的，是被#strong[一份名单]打断的。

#heading(level: 1, outlined: false)[六、这个道理我用得到的地方]

课程要求用到真实场景。这件事我在课程网站的制作里遇过一次。

三个人分工：我写正文，一位同学排版，另一位管发布。头两周很顺，谁缺什么直接在群里喊，当天补上——这很像一个每天重复的博弈，我的认真校对和对方的及时合入互为回报，大家没有签任何协议，成本也很低。第三周换了一位管发布的同学，他把仓库设成只有自己能合入，理由是怕有人写坏格式。接下来发生的事情很具体：我发现一处数据错，改不动文件，只能把修改方案写在群里等人代改；代改的人当天不在，我等到两天后才合入。再往后，我不再主动校对了。

重点不在“合作破裂”，而在断点在哪。三个人的偏好都没变，谁也没想坑谁，耐心也没变。变的是“我这一期的行动还是不是我自己选的”：我的合作动作从“直接执行”变成了“请求别人执行”，回报要绕一个中间环节才回得来。用第二节的话说，均衡没被偏好改变，是被行动集改变了；用第四节的话说，权限收紧就是那个把“自由选择”变成“按规定选择”的动作。

我还想加一句不太好听的话。让合作消失的力量并不恶毒，它来自很正常的组织逻辑：要完成任务、要维持纪律、要显得在进攻。一门课的仓库权限、一个小组的审核流程，背后是同一套逻辑。所以在评价这类安排时，我不会停在“它符合组织目标”这一层——课件说得比我好：“一种制度安排要发生效力，必须是一种纳什均衡。否则，这种制度安排不能成立。”#cite(4) 换句话说，只看制度想不想要合作是不够的，还得看它对每个参与人是否构成激励相容。1914年12月那些在无人区交换香烟的人，和替他们下命令的人，都在“军队”这个集体里，但他们面对的是两张不同的支付表。

#heading(level: 1, outlined: false)[七、还没查清的地方]

两件事我没做完。一是开头那份第15步兵旅的报告，国家档案馆那套教学专题已经下架，政府网页存档对自动访问另有人机验证，#emph[我在这次写作中没能读到转录原文]；雪茄、“约两百人”和那句附言的准确措辞，请按档案号 WO 95/1510/4 亲自核实，我在参考文献里已经标明它是待核材料，全文的论证并不依赖它。

二是我想顺着找1914年12月底到1915年初那批上级命令的原件，以及科尔洪那份审判记录，它们是“执行机制”这条解释最直接的证据。现在我手上的是研究著作、当事人日记的转述和博物馆网页，还没读到档案原件。

有一点我比较有把握：判断“合作为什么断”，要区分“当事人改主意了”和“当事人的手被拿住了”。重复博弈这门工具把前一种情况讲得很清楚，对后一种情况基本沉默。补上它，这门工具会笨一点，但会更好用。

// ================= 参考文献 =================

#heading(level: 1, outlined: false)[参考文献]

#set par(first-line-indent: 0pt, leading: 0.6em, spacing: 0.55em)
#set text(size: 9pt)

#block(breakable: false)[
  *[1]* 《诺奖经济学导读》课堂讲义《第二篇 第一章 抛砖引玉博弈论》，2026年9月29日，共27页。本文参照：重复博弈中自利者合作（第5页）、Axelrod 锦标赛与“针锋相对”的四个特征及其“错误会如回声般反复”（第3页）、价格匹配与卡特尔惩罚机制（第1页）。
] <ref-1>

#block(breakable: false)[
  *[2]* The National Archives (UK). “Western Front Christmas Truce 1914”：1914年12月26日第15步兵旅致师部报告，档案号 WO 95/1510/4（WO 95/1510 即第5师司令部战地日记，第15步兵旅属该师）。#strong[核验提示]：该教学专题页面已下架（原链接返回 410），政府网页存档对自动访问另有人机验证，本文写作时未能读到转录原文，正文已明示此条为待核材料。引用时请以档案号调阅原件或查政府网页存档。
] <ref-2>

#block(breakable: false)[
  *[3]* 同上讲义，2026年9月29日，第6页“博弈的分类与对应的均衡概念”表（完全信息静态博弈—纳什均衡）及第6页所列博弈基本要素（参与人、行动、信息、战略、支付函数、结果、均衡）。
] <ref-3>

#block(breakable: false)[
  *[4]* 《诺奖经济学导读》课堂讲义《第二篇 第一章 抛砖引玉博弈论》，2026年9月22日，共27页。本文参照：纳什均衡是“僵局”、只能通过改变博弈条件改变激励（第15页）；囚徒困境的纳什均衡并非帕累托有效（第21页）；“一种制度安排要发生效力，必须是一种纳什均衡”（第20页）；个人理性与集体理性冲突及“设计一种机制，在满足个人理性的前提下达到集体理性”（第9页）；解决困境的惩罚机制及其“信心机制”（第27页）。
] <ref-4>

#block(breakable: false)[
  *[5]* Axelrod, Robert. _The Evolution of Cooperation_. New York: Basic Books, 1984, Chapter 4, “The Live-and-Let-Live System in Trench Warfare in World War I,” pp. 73–87。本文参照#link("https://gwern.net/doc/economics/1984-axelrod-theevolutionofcooperation-ch4-theliveandletlivesysteminwwi.html")[该章公开节录]；“a type of incessant aggression that the headquarters could monitor… the raid”与结语“lost their freedom of action”均出此章。其中狙击手与炮兵互相还击一例，阿克塞尔罗德注明转引自 Belton Cobb（1916）。
] <ref-5>

#block(breakable: false)[
  *[6]* Hulse, Edward Hamilton Westrow, Sir. 苏格兰卫队第2营上尉，1914年12月25—27日亲历记述，原刊于 _I Was There!_ 第7期，并见其书信集 _Letters Written from the English Front in France between September 1914 and March 1915_（1916）。本文引文据#link("https://www.westernfrontassociation.com/news/2024/december/the-historic-christmas-truce-of-1914-by-capt-sir-edward-hulse-bart/")[西部战线协会（WFA）所刊全文转录]逐字核对，原书可在#link("https://archive.org/details/letterswrittenfr00hulsrich")[Internet Archive]查阅。该上尉1915年3月12日于Neuve Chapelle阵亡。
] <ref-6>

#block(breakable: false)[
  *[7]* Smith-Dorrien, Horace. 第2军军长机密备忘录，1914年12月27日，原件藏英国国家档案馆（IWM 转录注为 WO 95-1560）。“Lives of the First World War”条目刊出档案转录：#link("https://livesofthefirstworldwar.iwm.org.uk/story/10435")[Confidential memorandum from General Sir Horace Smith-Dorrien, 27 December 1914]。本文所引“I have issued the strictest orders that on no account is socialising to be allowed between opposing troops… with a view to disciplinary action”即出其中。
] <ref-7>

#block(breakable: false)[
  *[8]* Colquhoun, Iain. 苏格兰卫队上尉，1915年圣诞节停火及其后的军事审判（1916年1月17日，指控为“approving of a truce with the enemy”，黑格出庭作证，判有罪、处以申斥）。当事人日记与书信的引述见 “Christmas Truce a miracle not to be repeated, under penalty of court martial.” _RTÉ News_, 24 December 2014. #link("https://www.rte.ie/news/2014/1224/668806-christmas-truce-a-miracle-not-to-be-repeated/")[在线报道]。审判档案原件本文未直接查阅。
] <ref-8>

#block(breakable: false)[
  *[9]* Crocker, Terri Blom. _The Christmas Truce: Myth, Memory, and the First World War_. Lexington: University Press of Kentucky, 2015。该书依据战地日记与团史主张：军官多默许甚至赞成休战，且无士兵因参加1914年休战受罚。本文把它作为对“上级压制”说的限定。
] <ref-9>

#block(breakable: false)[
  *[10]* Brown, Malcolm, and Shirley Seaton. _Christmas Truce: The Western Front December 1914_. London: Pan Books, 1984。与[8][9]配合，用于休战之后禁令、轮换与处置的背景判断。
] <ref-10>

#block(breakable: false)[
  *[11]* Rix, Hayley. “The Christmas Truce.” National Army Museum, 22 December 2014. #link("https://ww1.nam.ac.uk/1331/news/christmas-truce/")[在线资料]，引用馆藏 William Eve 与 Lieutenant-Colonel Schoolbred 日记。
] <ref-11>

#block(breakable: false)[
  *[12]* Nowak, Martin A., and Karl Sigmund. “A Strategy of Win-Stay, Lose-Shift That Outperforms Tit-for-Tat in the Prisoner’s Dilemma Game.” _Nature_ 364 (1993): 56–58。用于说明执行噪声下“一报还一报”可能锁死在互相报复，与课件第3页“任何一个错误都会犹如回声一般反复出现”相印证。
] <ref-12>
