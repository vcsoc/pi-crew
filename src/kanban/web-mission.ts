/**
 * Mission Control live board: the design of docs/kanban-redesign/2-mission-control.html driven by real board data.
 * Served by server.ts when the selected template is "mission-control". CSP forbids inline scripts, so all behaviour
 * lives in MISSION_SCRIPT (served from /app.js) and all task/user/agent text is rendered with textContent only.
 */

/** Mockup CSS (verbatim apart from the removed sample banner and day/night theme naming) plus live-board additions. */
const MISSION_CSS = `:root{
  --bg:#060a14;--bg2:#0a1122;--panel:#0d1629;--panel2:#111d35;--line:#1c2a47;--line2:#26375c;
  --text:#dbe6ff;--muted:#8a9bc0;--dim:#5d6f96;
  --cyan:#22e4ff;--green:#3dffa0;--amber:#ffbf3d;--red:#ff5470;--violet:#a98bff;
  --cyan-bg:rgba(34,228,255,.10);--green-bg:rgba(61,255,160,.10);--amber-bg:rgba(255,191,61,.12);--red-bg:rgba(255,84,112,.12);--violet-bg:rgba(169,139,255,.12);
  --mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif;
  --radius:8px;--shadow:0 20px 60px rgba(0,0,0,.55);
  --grid:rgba(34,228,255,.035);
}
[data-theme="day"]{
  --bg:#eef2f8;--bg2:#e4eaf4;--panel:#ffffff;--panel2:#f4f7fc;--line:#d3dcea;--line2:#bccadf;
  --text:#0d1830;--muted:#46577a;--dim:#6a7a99;
  --cyan:#006f86;--green:#05794a;--amber:#9a5b00;--red:#c4203f;--violet:#5b3fc4;
  --cyan-bg:rgba(0,111,134,.09);--green-bg:rgba(5,121,74,.10);--amber-bg:rgba(154,91,0,.10);--red-bg:rgba(196,32,63,.09);--violet-bg:rgba(91,63,196,.09);
  --shadow:0 20px 50px rgba(20,40,80,.22);--grid:rgba(0,60,120,.04);
}
*{box-sizing:border-box}
html,body{margin:0}
body{
  font-family:var(--sans);font-size:14px;line-height:1.45;color:var(--text);background:var(--bg);
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:28px 28px;min-height:100vh;
}
.mono,.num{font-family:var(--mono);font-variant-numeric:tabular-nums}
button{font:inherit;color:inherit;cursor:pointer}
:focus-visible{outline:2px solid var(--cyan);outline-offset:2px;border-radius:4px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}


/* header */
header.top{display:flex;align-items:center;gap:16px;padding:12px 20px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,var(--bg2),transparent);flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.logo{width:34px;height:34px;border-radius:8px;display:grid;place-items:center;border:1px solid var(--cyan);color:var(--cyan);font-family:var(--mono);font-weight:700;box-shadow:0 0 16px rgba(34,228,255,.25) inset}
.brand h1{margin:0;font-size:15px;font-weight:650;letter-spacing:.02em}
.brand .crumb{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
.brand .proj{color:var(--cyan)}
.live{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;padding:4px 10px;border:1px solid var(--line2);border-radius:999px;color:var(--green);background:var(--green-bg);text-transform:uppercase;letter-spacing:.08em}
.live .dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 0 var(--green);animation:pulse 1.8s infinite}
.live.paused{color:var(--amber);background:var(--amber-bg)}
.live.paused .dot{background:var(--amber);animation:none}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(61,255,160,.6)}70%{box-shadow:0 0 0 8px rgba(61,255,160,0)}100%{box-shadow:0 0 0 0 rgba(61,255,160,0)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
.actions{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn{border:1px solid var(--line2);background:var(--panel);padding:7px 12px;border-radius:6px;font-size:12.5px;font-weight:550;display:inline-flex;align-items:center;gap:6px;transition:border-color .15s,background .15s}
.btn:hover{border-color:var(--cyan);background:var(--panel2)}
.btn.primary{background:var(--cyan);color:#021018;border-color:var(--cyan)}
[data-theme="day"] .btn.primary{color:#fff}
.btn.primary:hover{filter:brightness(1.1);background:var(--cyan)}
.btn.warn[aria-pressed="true"]{border-color:var(--amber);color:var(--amber);background:var(--amber-bg)}
.btn .k{font-family:var(--mono);font-size:10px;color:var(--dim);border:1px solid var(--line2);border-radius:3px;padding:0 4px}
.switch{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;padding:6px 10px;border:1px solid var(--line2);border-radius:6px;background:var(--panel)}
.switch .track{width:28px;height:16px;border-radius:999px;background:var(--line2);position:relative;transition:background .15s}
.switch .track::after{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--text);transition:transform .15s}
.switch[aria-checked="true"] .track{background:var(--cyan)}
.switch[aria-checked="true"] .track::after{transform:translateX(12px);background:#021018}
.icon-btn{width:34px;height:34px;padding:0;justify-content:center}

/* KPI strip */
.kpis{display:grid;grid-template-columns:repeat(4,1fr) 1.4fr;gap:1px;background:var(--line);border-bottom:1px solid var(--line)}
.kpi{background:var(--bg2);padding:14px 20px;position:relative;overflow:hidden}
.kpi .lbl{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.kpi .val{font-family:var(--mono);font-size:30px;font-weight:600;line-height:1.1;margin-top:4px;font-variant-numeric:tabular-nums}
.kpi .sub{font-size:11.5px;color:var(--dim);margin-top:2px}
.kpi::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent,var(--cyan))}
.kpi .spark{position:absolute;right:14px;bottom:12px;opacity:.85}
.kpi.c{--accent:var(--cyan)} .kpi.c .val{color:var(--cyan)}
.kpi.a{--accent:var(--amber)} .kpi.a .val{color:var(--amber)}
.kpi.g{--accent:var(--green)} .kpi.g .val{color:var(--green)}
.kpi.v{--accent:var(--violet)} .kpi.v .val{color:var(--violet)}
.crewkpi{background:var(--bg2);padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.crewkpi .lbl{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line2);background:var(--panel);border-radius:999px;padding:3px 10px 3px 4px;font-size:12px}
.chip[aria-pressed="true"]{border-color:var(--rc);background:color-mix(in srgb,var(--rc) 14%,transparent)}
.chip .av{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:10.5px;font-weight:700;color:#020a14;background:var(--rc)}
.chip .r{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase}
.chip .st{width:6px;height:6px;border-radius:50%;background:var(--green)}
.chip .st.idle{background:var(--dim)} .chip .st.wait{background:var(--amber)}
.role-operator{--rc:var(--cyan)} .role-tester{--rc:var(--green)} .role-reviewer{--rc:var(--violet)} .role-orchestrator{--rc:var(--amber)}

/* layout */
main.wrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;padding:16px 20px 28px}
.board{display:grid;grid-template-columns:repeat(5,minmax(200px,1fr));gap:10px;align-items:start;min-width:0;overflow-x:auto;padding-bottom:6px}
.col{background:color-mix(in srgb,var(--panel) 70%,transparent);border:1px solid var(--line);border-radius:var(--radius);min-height:200px;display:flex;flex-direction:column}
.col-h{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line);position:sticky;top:0}
.col-h h2{margin:0;font-size:11.5px;font-family:var(--mono);letter-spacing:.12em;text-transform:uppercase;font-weight:600}
.col-h .cnt{margin-left:auto;font-family:var(--mono);font-size:11px;padding:1px 7px;border-radius:4px;background:var(--panel2);border:1px solid var(--line2);color:var(--muted)}
.col-h .bar{width:8px;height:8px;border-radius:2px;background:var(--cc)}
.col[data-col="backlog"]{--cc:var(--dim)} .col[data-col="ready"]{--cc:var(--violet)} .col[data-col="progress"]{--cc:var(--cyan)} .col[data-col="review"]{--cc:var(--amber)} .col[data-col="done"]{--cc:var(--green)}
.col-b{padding:8px;display:flex;flex-direction:column;gap:8px}
.empty{font-family:var(--mono);font-size:11px;color:var(--dim);text-align:center;padding:18px 6px;border:1px dashed var(--line2);border-radius:6px}

.card{position:relative;text-align:left;width:100%;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:9px 10px 9px 12px;display:flex;flex-direction:column;gap:6px;transition:border-color .15s,transform .15s,box-shadow .15s}
.card::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--sc,var(--line2))}
.card:hover{border-color:var(--line2);transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,.25)}
.card.attn{border-color:var(--amber);box-shadow:0 0 0 1px var(--amber-bg),0 0 22px rgba(255,191,61,.12)}
.card.archived{opacity:.55;border-style:dashed}
.card .row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.card .id{font-family:var(--mono);font-size:11px;color:var(--cyan)}
.card .rev{font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.card .ttl{font-size:13px;font-weight:560;line-height:1.3}
.card .who{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted)}
.card .who .av{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;font-size:9px;font-weight:700;color:#020a14;background:var(--rc)}
.card .who .role{font-family:var(--mono);font-size:10px;text-transform:uppercase;color:var(--rc)}
.mini{display:flex;gap:4px;margin-left:auto}
.mini span{font-family:var(--mono);font-size:10px;padding:0 4px;border-radius:3px;border:1px solid currentColor}
.prog{height:3px;background:var(--line);border-radius:2px;overflow:hidden}
.prog i{display:block;height:100%;background:var(--cyan)}

.badge{display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:1px 7px;border-radius:4px;border:1px solid}
.badge::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.b-working{color:var(--cyan);background:var(--cyan-bg);border-color:color-mix(in srgb,var(--cyan) 45%,transparent)}
.b-working::before{animation:blink 1.2s infinite}
.b-waiting{color:var(--amber);background:var(--amber-bg);border-color:color-mix(in srgb,var(--amber) 45%,transparent)}
.b-blocked{color:var(--red);background:var(--red-bg);border-color:color-mix(in srgb,var(--red) 45%,transparent)}
.b-cancelled{color:var(--muted);background:transparent;border-color:var(--line2)}
.b-cancelled::before{background:none;border:1px solid currentColor}
.b-accepted{color:var(--green);background:var(--green-bg);border-color:color-mix(in srgb,var(--green) 45%,transparent)}
.b-queued{color:var(--violet);background:var(--violet-bg);border-color:color-mix(in srgb,var(--violet) 45%,transparent)}
@keyframes blink{50%{opacity:.25}}
.c-g{color:var(--green)} .c-a{color:var(--amber)} .c-r{color:var(--red)}

/* side */
aside.side{display:flex;flex-direction:column;gap:14px;min-width:0}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.panel-h{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line)}
.panel-h h2{margin:0;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.panel-h .meta{margin-left:auto;font-family:var(--mono);font-size:10.5px;color:var(--dim)}

.approval{border-color:var(--amber);background:linear-gradient(180deg,var(--amber-bg),var(--panel) 60%)}
.approval .panel-h{border-color:color-mix(in srgb,var(--amber) 35%,transparent)}
.approval .panel-h h2{color:var(--amber)}
.ap-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}
.ap-who{display:flex;align-items:center;gap:8px;font-weight:600}
.ap-who .av{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;color:#020a14;background:var(--cyan)}
.ap-q{margin:0;font-size:13.5px;line-height:1.5;padding:10px 12px;border-radius:6px;background:var(--bg2);border:1px solid var(--line)}
.ap-q code{font-family:var(--mono);font-size:12px;color:var(--cyan)}
.ap-meta{font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.ap-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.yes,.no{border:1px solid;border-radius:6px;padding:9px 10px;font-weight:700;font-size:13px;letter-spacing:.02em}
.yes{background:#13c97a;border-color:#13c97a;color:#02160c}
.yes:hover{background:#2be38f}
.no{background:#e23a58;border-color:#e23a58;color:#fff}
.no:hover{background:#f04f6b}
.ap-done{padding:14px;font-size:13px;color:var(--muted)}

.feed{list-style:none;margin:0;padding:6px 0;max-height:430px;overflow:auto}
.feed li{display:grid;grid-template-columns:62px 1fr;gap:8px;padding:7px 14px;font-size:12.5px;border-left:2px solid transparent}
.feed li.new{border-left-color:var(--cyan);background:var(--cyan-bg);animation:fadein .6s}
@keyframes fadein{from{opacity:0;transform:translateY(-4px)}}
.feed time{font-family:var(--mono);font-size:11px;color:var(--dim);padding-top:1px}
.feed .act{font-weight:650;color:var(--rc,var(--text))}
.feed .tid{font-family:var(--mono);font-size:11px;color:var(--cyan)}
.feed .ev{color:var(--muted)}

/* meters */
.meter{display:grid;grid-template-columns:minmax(0,1fr) 56px;gap:4px 10px;align-items:center;position:relative}
.meter .m-lbl{font-size:12.5px;display:flex;gap:6px;align-items:baseline;min-width:0}
.meter .m-lbl .w{font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.meter .m-val{font-family:var(--mono);font-size:13px;font-weight:600;text-align:right}
.mtrack{grid-column:1 / -1;position:relative;height:10px;border-radius:5px;background:var(--bg2);border:1px solid var(--line);cursor:help}
.mtrack .fill{position:absolute;left:0;top:0;bottom:0;border-radius:5px 0 0 5px;background:var(--mc)}
.mtrack .knob{position:absolute;top:50%;width:14px;height:14px;border-radius:50%;background:var(--panel);border:2px solid var(--mc);transform:translate(-50%,-50%);box-shadow:0 0 10px color-mix(in srgb,var(--mc) 60%,transparent)}
.mtrack .pass{position:absolute;left:85%;top:-5px;bottom:-5px;width:2px;background:var(--text);opacity:.7}
.mtrack .pass::after{content:"85";position:absolute;top:-13px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:9px;color:var(--muted)}
.mg{--mc:var(--green)} .ma{--mc:var(--amber)} .mr{--mc:var(--red)}
.mg .m-val{color:var(--green)} .ma .m-val{color:var(--amber)} .mr .m-val{color:var(--red)}
.tip{position:absolute;z-index:30;left:0;right:0;top:calc(100% + 8px);background:var(--panel2);border:1px solid var(--line2);border-radius:6px;padding:9px 11px;font-size:12px;line-height:1.45;box-shadow:var(--shadow);opacity:0;visibility:hidden;transform:translateY(-3px);transition:all .12s;pointer-events:none}
.tip b{font-family:var(--mono)}
.mtrack:hover + .tip,.mtrack:focus + .tip,.mtrack:focus-visible + .tip{opacity:1;visibility:visible;transform:none}

.evalcard{border:1px solid var(--line);border-radius:8px;background:var(--panel2);padding:12px 14px;display:flex;flex-direction:column;gap:14px}
.eval-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.eval-h .av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:11px;color:#020a14;background:var(--rc)}
.eval-h .tot{margin-left:auto;font-family:var(--mono);font-size:22px;font-weight:700}
.verdict{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;padding:2px 8px;border-radius:4px;border:1px solid}

/* modal */
.scrim{position:fixed;inset:0;background:rgba(2,5,12,.72);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:24px;z-index:50}
.scrim.open{display:flex}
.modal{width:min(1040px,100%);max-height:min(820px,calc(100vh - 48px));display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line2);border-radius:12px;box-shadow:var(--shadow),0 0 0 1px rgba(34,228,255,.08);overflow:hidden}
.m-head{padding:16px 20px 0;border-bottom:1px solid var(--line);background:linear-gradient(180deg,var(--bg2),var(--panel))}
.m-top{display:flex;align-items:flex-start;gap:12px}
.m-top h2{margin:4px 0 0;font-size:19px;line-height:1.3}
.m-ids{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-family:var(--mono);font-size:11.5px;color:var(--muted)}
.m-ids .id{color:var(--cyan)}
.m-close{margin-left:auto;flex:none}
.m-stats{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0;font-size:12px;color:var(--muted)}
.m-stats b{display:block;font-family:var(--mono);color:var(--text);font-size:13px;font-weight:600}
.tabs{display:flex;gap:2px;overflow-x:auto}
.tab{background:none;border:0;border-bottom:2px solid transparent;padding:9px 14px;font-size:12.5px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--muted);white-space:nowrap}
.tab[aria-selected="true"]{color:var(--cyan);border-bottom-color:var(--cyan)}
.tab .n{font-size:10px;margin-left:5px;padding:0 5px;border-radius:3px;background:var(--panel2);border:1px solid var(--line2)}
.m-body{padding:18px 20px 22px;overflow:auto}
.tabpanel[hidden]{display:none}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.sec h3{margin:0 0 8px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.box{border:1px solid var(--line);border-radius:8px;background:var(--panel2);padding:12px 14px;font-size:13px}
.box ul{margin:0;padding-left:18px} .box li{margin:3px 0}
.kv{display:grid;grid-template-columns:110px 1fr;gap:6px 12px;font-size:12.5px}
.kv dt{color:var(--muted);font-family:var(--mono);font-size:11px;text-transform:uppercase;padding-top:2px}
.kv dd{margin:0}
.thread{display:flex;flex-direction:column;gap:12px}
.msg{display:grid;grid-template-columns:30px 1fr;gap:10px}
.msg .av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:12px;color:#020a14;background:var(--rc)}
.msg .bub{border:1px solid var(--line);background:var(--panel2);border-radius:0 8px 8px 8px;padding:9px 12px;font-size:13px}
.msg .mh{display:flex;gap:8px;align-items:baseline;margin-bottom:3px;font-size:12px}
.msg .mh b{color:var(--rc)} .msg .mh time{font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.msg.user .av{background:var(--text)}
.compose{display:flex;gap:8px;margin-top:4px}
.compose input{flex:1;background:var(--bg2);border:1px solid var(--line2);border-radius:6px;padding:8px 10px;color:var(--text);font:inherit;font-size:13px}
.term{background:#030710;border:1px solid var(--line2);border-radius:8px;overflow:hidden;font-family:var(--mono);font-size:12px}
[data-theme="day"] .term{background:#0d1626;color:#dbe6ff}
.term-h{display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid #1c2a47;color:#8a9bc0;font-size:11px}
.term-h .ec{margin-left:auto;padding:1px 7px;border-radius:4px;font-weight:700}
.ec0{color:#3dffa0;background:rgba(61,255,160,.12);border:1px solid rgba(61,255,160,.4)}
.ec1{color:#ff5470;background:rgba(255,84,112,.12);border:1px solid rgba(255,84,112,.4)}
.term pre{margin:0;padding:10px 12px;white-space:pre-wrap;word-break:break-word;color:#c8d6f5;line-height:1.55}
.term .p{color:#22e4ff} .term .ok{color:#3dffa0} .term .bad{color:#ff5470} .term .mut{color:#5d6f96}
.gate{display:flex;gap:10px;flex-wrap:wrap}
.gate .g{flex:1;min-width:150px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--panel2)}
.gate .g .lbl{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
.gate .g .v{font-family:var(--mono);font-size:20px;font-weight:700;margin-top:2px}

/* toast */
.toasts{position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:8px;z-index:80;max-width:min(380px,calc(100vw - 40px))}
.toast{display:flex;gap:10px;align-items:flex-start;background:var(--panel2);border:1px solid var(--line2);border-left:3px solid var(--tc,var(--cyan));border-radius:6px;padding:10px 12px;box-shadow:var(--shadow);font-size:13px;animation:fadein .25s}
.toast .tt{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--tc,var(--cyan))}

footer{padding:0 20px 24px;color:var(--dim);font-family:var(--mono);font-size:11px}

/* responsive */
@media (max-width:1200px){main.wrap{grid-template-columns:1fr}aside.side{display:grid;grid-template-columns:1fr 1fr}.kpis{grid-template-columns:repeat(4,1fr)}.crewkpi{grid-column:1 / -1}}
@media (max-width:760px){
  header.top{padding:10px 12px}
  .actions{margin-left:0;width:100%}
  .btn .lbl-long{display:none}
  .kpis{grid-template-columns:1fr 1fr}
  .kpi{padding:10px 14px}.kpi .val{font-size:24px}.kpi .spark{display:none}
  main.wrap{padding:12px}
  .board{grid-template-columns:1fr;overflow:visible}
  aside.side{grid-template-columns:1fr}
  .grid2{grid-template-columns:1fr}
  .scrim{padding:0}
  .modal{max-height:100vh;height:100%;border-radius:0}
  .m-head{padding:12px 14px 0}.m-body{padding:14px}
  .kv{grid-template-columns:1fr}
}
/* live-board additions */
:root{color-scheme:dark}[data-theme="day"]{color-scheme:light}
[hidden]{display:none!important}
.notice{display:none;padding:8px 20px;border-bottom:1px solid var(--line);background:var(--red-bg);color:var(--red);font-family:var(--mono);font-size:12px;overflow-wrap:anywhere}
.notice.show{display:block}
.live.offline{color:var(--red);background:var(--red-bg)}.live.offline .dot{background:var(--red);animation:none}
.btn:disabled,.yes:disabled,.no:disabled{opacity:.45;cursor:not-allowed;filter:none}
.btn:disabled:hover{border-color:var(--line2);background:var(--panel)}
.btn.danger{color:var(--red)}
.btn .cnt{font-family:var(--mono);font-size:10px;padding:0 5px;border-radius:3px;background:var(--panel2);border:1px solid var(--line2);color:var(--muted)}
.kpi .val small{font-size:16px}
.chips .none{font-size:12px;color:var(--dim)}
.prog{display:block}
.card .flag{font-family:var(--mono);font-size:10.5px;color:var(--amber)}
.card .ttl,.ap-q,.m-top h2,.feed .ev{overflow-wrap:anywhere}
.col.drop{border-color:var(--cyan);background:var(--cyan-bg)}
.runs-wrap{position:relative}
.popover{position:absolute;right:0;top:calc(100% + 8px);width:min(580px,92vw);max-height:65vh;overflow:auto;z-index:40;background:var(--panel);border:1px solid var(--line2);border-radius:8px;box-shadow:var(--shadow);padding:12px 14px;text-align:left}
.popover h3,.sec-h{margin:12px 0 8px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.popover h3:first-child{margin-top:0}
.run{display:flex;gap:10px;align-items:center;border:1px solid var(--line);border-radius:6px;padding:8px 10px;background:var(--panel2);margin-bottom:6px;font-size:12.5px}
.run .rd{color:var(--muted);font-size:12px;overflow-wrap:anywhere}.run .btn{margin-left:auto;flex:none}
.note{font-size:12px;color:var(--dim);margin:0 0 8px}
.pills{display:flex;flex-wrap:wrap;gap:6px}
.chip .stt{font-family:var(--mono);font-size:10px;color:var(--muted)}
.feed li{display:block;padding:0}
.feed .fi{display:grid;grid-template-columns:62px 1fr;gap:8px;padding:7px 14px;font-size:12.5px;border:0;background:none;width:100%;text-align:left;color:inherit;line-height:1.45}
.feed .fi:hover{background:var(--panel2)}
.feed .empty-feed{padding:10px 14px;font-size:12px;color:var(--dim)}
.ap-open{background:none;border:0;padding:0;color:var(--dim);font-family:var(--mono);font-size:10.5px;margin-left:auto}.ap-open:hover{color:var(--cyan);text-decoration:underline}
[data-theme="day"] .av{color:#fff}
.ap-more,.ap-wait{font-size:11.5px;color:var(--muted)}.ap-wait{color:var(--amber)}
.m-approval{margin:0 0 12px}
.m-alert{font-size:12.5px;color:var(--muted);margin:0 0 10px;overflow-wrap:anywhere}
.m-alert.bad{color:var(--red)}
.m-actions{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}
.m-actions .btn{padding:5px 10px;font-size:12px}
.field{display:block;width:100%;background:var(--bg2);border:1px solid var(--line2);border-radius:6px;padding:8px 10px;color:var(--text);font:inherit;font-size:13px}
textarea.field{min-height:120px;resize:vertical;line-height:1.5}
.field.mono{font-family:var(--mono);font-size:12px}
.flabel{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 4px}
.fgroup{margin:0 0 12px}
.span2{grid-column:1 / -1}
.pre{white-space:pre-wrap;overflow-wrap:anywhere}
.compose{align-items:flex-end}
.compose textarea{flex:1;min-height:64px;resize:vertical;background:var(--bg2);border:1px solid var(--line2);border-radius:6px;padding:8px 10px;color:var(--text);font:inherit;font-size:13px}
.msg .bub{min-width:0}
.msg-text{white-space:pre-wrap;overflow-wrap:anywhere}
.bub details{margin-top:6px}
summary{cursor:pointer;color:var(--muted);font-size:12px}
.xpre{white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--mono);font-size:11.5px;background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:8px 10px;max-height:50vh;overflow:auto;margin:6px 0 0}
.term pre{max-height:50vh;overflow:auto}
.term-h .cmd{color:#dbe6ff;overflow-wrap:anywhere}
.pr a{color:var(--cyan)}
.ctx{position:fixed;z-index:60;display:grid;gap:4px;padding:6px;background:var(--panel);border:1px solid var(--line2);border-radius:8px;box-shadow:var(--shadow);min-width:190px}
.ctx .btn{justify-content:flex-start}
.audit-entry{border-bottom:1px solid var(--line);padding:10px 0}
.audit-entry h3{margin:0 0 2px;font-size:13px;overflow-wrap:anywhere}
.audit-entry time{font-family:var(--mono);font-size:11px;color:var(--dim)}
.audit-entry p{margin:4px 0;font-size:12px;color:var(--muted)}
.modal.sm{width:min(640px,100%)}
.eval-pending{font-size:12.5px;color:var(--dim)}
@media (max-width:760px),(max-height:640px){.modal{overflow:auto}.m-body{overflow:visible}}
@media (max-width:760px){.popover{position:fixed;left:8px;right:8px;top:64px;width:auto}.btn{padding:7px 10px}}

/* Operations layout (data-layout="operations"): Terminal Pro detail pane, activity console and status bar in the Mission Control palette */
.pane,.console,.statusbar{display:none}
:root[data-layout="operations"] aside.side{display:none}
:root[data-layout="operations"] .pane{display:block}
:root[data-layout="operations"] .console{display:flex}
:root[data-layout="operations"] .statusbar{display:flex}
:root[data-layout="operations"] main.wrap{grid-template-columns:minmax(0,1fr) 400px;padding-bottom:12px}
@media (min-width:1101px){:root[data-layout="operations"] .board{grid-template-columns:repeat(5,minmax(168px,1fr))}}
:root[data-layout="operations"] .toasts{bottom:48px}
:root[data-layout="operations"] .card.sel{border-color:var(--cyan);box-shadow:0 0 0 2px var(--cyan),0 0 18px color-mix(in srgb,var(--cyan) 30%,transparent);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}
kbd{font-family:var(--mono);font-size:10.5px;border:1px solid var(--line2);border-bottom-width:2px;border-radius:3px;padding:0 4px;color:var(--amber);background:var(--bg2)}
.pane{position:sticky;top:12px;align-self:start;max-height:calc(100vh - 84px);overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);min-width:0;padding-bottom:6px}
.pane-h{display:flex;gap:10px;align-items:flex-start;padding:12px 14px 8px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,var(--bg2),var(--panel))}
.pane-h h2{margin:0;font-size:15px;line-height:1.3;overflow-wrap:anywhere}
.pane-h .sub{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:4px}
.pane-h .sub .id{color:var(--cyan)}
.pane-h .btn{margin-left:auto;flex:none;padding:4px 9px;font-size:11.5px}
.pane-empty{padding:16px 14px;font-family:var(--mono);font-size:12px;color:var(--dim)}
.ask{margin:12px 12px 4px;border:1px dashed var(--amber);border-radius:6px;background:var(--amber-bg);padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.ask .ask-h{display:flex;justify-content:space-between;gap:8px;font-family:var(--mono);font-size:12px;color:var(--amber);font-weight:650}
.ask .ask-h span:last-child{color:var(--dim);font-weight:400}
.ask p{margin:0;font-size:13px;line-height:1.5;overflow-wrap:anywhere}
.ask .ap-meta{overflow-wrap:anywhere}
.ask .ap-btns .yes,.ask .ap-btns .no{font-family:var(--mono);padding:7px 10px}
.frame{position:relative;border:1px solid var(--line);border-radius:6px;margin:18px 12px 6px;padding:12px 10px 8px}
.frame>.ttl{position:absolute;top:-.75em;left:10px;max-width:calc(100% - 20px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:var(--panel);padding:0 6px;font-family:var(--mono);font-size:11px;line-height:1.5;color:var(--dim)}
.frame>.ttl b{color:var(--text);font-weight:600}
.okv{display:grid;grid-template-columns:86px minmax(0,1fr);gap:3px 10px;margin:0;font-family:var(--mono);font-size:12px}
.okv dt{color:var(--dim)}.okv dd{margin:0;overflow-wrap:anywhere}
.okv .brief{font-family:var(--sans);font-size:12.5px;white-space:pre-wrap;max-height:9.5em;overflow:auto}
.chat{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.chat li{border-left:2px solid var(--rc,var(--line2));padding-left:9px;font-size:12.5px;overflow-wrap:anywhere}
.chat li.user{--rc:var(--amber)}
.chat .from{font-family:var(--mono);font-size:11px;color:var(--dim)}
.chat .from b{color:var(--rc,var(--text));font-weight:600}
.linkish{background:none;border:0;padding:0;font-family:var(--mono);font-size:11px;color:var(--cyan);margin-top:8px}.linkish:hover{text-decoration:underline}
.oeval{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.oeval-h{display:flex;align-items:baseline;gap:8px;font-family:var(--mono);font-size:12px}
.oeval-h .r{color:var(--rc)}.oeval-h .by{color:var(--dim)}
.oeval-h .verdict{margin-left:auto}
.legend{display:flex;gap:12px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;color:var(--dim)}
.oevid{font-family:var(--mono);font-size:12px;overflow-wrap:anywhere}
.oevid .cmd{color:var(--text)}
.console{flex-direction:column;margin:0 20px 12px;border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);min-width:0}
.con-h{display:flex;gap:10px;align-items:center;padding:7px 12px;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:11px;color:var(--dim)}
.con-h b{color:var(--text);font-weight:600}.con-h .meta{margin-left:auto}
.con-log{list-style:none;margin:0;padding:6px 0;max-height:220px;overflow:auto;font-family:var(--mono);font-size:12px;background:color-mix(in srgb,var(--bg) 55%,var(--panel))}
.con-log li{display:block}
.con-log .cl{display:grid;grid-template-columns:72px 150px minmax(0,1fr) 80px;gap:10px;width:100%;padding:1px 12px;border:0;background:none;text-align:left;font:inherit;line-height:1.55;color:var(--text)}
.con-log .cl:hover{background:var(--panel2)}
.con-log li.new .cl{animation:conflash 1.6s}
@keyframes conflash{from{background:var(--cyan-bg)}to{background:transparent}}
.con-log .t{color:var(--dim)}.con-log .who{color:var(--rc,var(--muted));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.con-log .ev{overflow-wrap:anywhere}.con-log .tid{color:var(--cyan);text-align:right}
.ev-g{color:var(--green)}.ev-a{color:var(--amber)}.ev-r{color:var(--red)}.ev-c{color:var(--cyan)}.ev-t{color:var(--text)}
.con-log .cursor{padding:1px 12px;color:var(--dim)}
.con-log .cursor::after{content:"\\2588";color:var(--green);animation:blink 1s steps(2,start) infinite}
.statusbar{position:sticky;bottom:0;z-index:20;gap:16px;align-items:center;padding:5px 20px;border-top:1px solid var(--line);background:var(--bg2);font-family:var(--mono);font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden}
.statusbar .mode{background:var(--green);color:#02160c;padding:0 8px;border-radius:3px;font-weight:700;letter-spacing:.06em}
.statusbar .mode.cmd{background:var(--amber)}
[data-theme="day"] .statusbar .mode{color:#fff}
.statusbar .right{margin-left:auto;color:var(--text);overflow:hidden;text-overflow:ellipsis}
.pal-scrim{align-items:flex-start;padding-top:12vh}
.pal{width:min(560px,100%);background:var(--panel);border:1px solid var(--cyan);border-radius:10px;box-shadow:var(--shadow),0 0 0 1px rgba(34,228,255,.12);overflow:hidden}
.pal-in{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line);font-family:var(--mono)}
.pal-in span{color:var(--cyan)}
.pal-in input{flex:1;min-width:0;background:none;border:0;outline:none;color:var(--text);font:inherit;font-size:14px}
.pal ul{list-style:none;margin:0;padding:6px 0;max-height:50vh;overflow:auto}
.pal li{display:flex;justify-content:space-between;gap:10px;padding:7px 14px;cursor:pointer;font-size:13px}
.pal li .grp{display:inline-block;width:64px;font-family:var(--mono);font-size:11px;color:var(--dim)}
.pal li[aria-selected="true"]{background:var(--cyan-bg);color:var(--cyan);box-shadow:inset 3px 0 0 var(--cyan)}
.pal li.none{color:var(--dim);cursor:default}
.pal-foot{display:flex;gap:14px;flex-wrap:wrap;padding:6px 12px;border-top:1px solid var(--line);font-family:var(--mono);font-size:11px;color:var(--dim)}
/* Wide screens: a viewport-height app (board and pane scroll inside), console and status bar pinned at the bottom like Terminal Pro. */
@media (min-width:1101px) and (min-height:700px){
  :root[data-layout="operations"] body{height:100vh;display:flex;flex-direction:column;overflow:hidden}
  :root[data-layout="operations"] header.top,:root[data-layout="operations"] .kpis,:root[data-layout="operations"] .notice{flex:none}
  :root[data-layout="operations"] main.wrap{flex:1;min-height:0;grid-template-rows:minmax(0,1fr)}
  :root[data-layout="operations"] .board{overflow:auto;max-height:100%}
  :root[data-layout="operations"] .pane{position:static;max-height:none;height:100%}
  :root[data-layout="operations"] .console{flex:none}
  :root[data-layout="operations"] .con-log{height:clamp(120px,22vh,220px);max-height:none}
  :root[data-layout="operations"] body>footer{display:none}
  :root[data-layout="operations"] .statusbar{flex:none}
}
@media (max-width:1100px){
  :root[data-layout="operations"] main.wrap{grid-template-columns:minmax(0,1fr)}
  .pane{position:static;max-height:none}
}
@media (max-width:760px){
  :root[data-layout="operations"] main.wrap{padding:12px}
  .console{margin:0 12px 12px}
  .con-log{max-height:min(260px,40vh)}
  .con-log .cl{grid-template-columns:62px minmax(0,1fr);gap:2px 8px}
  .con-log .ev{grid-column:2}.con-log .tid{grid-column:2;text-align:left}
  .statusbar{flex-wrap:wrap;gap:4px 12px;padding:5px 12px;white-space:normal}
  .statusbar .hint-x{display:none}
  .statusbar .right{margin-left:0;flex-basis:100%}
  .okv{grid-template-columns:1fr}.okv dt{margin-top:4px}
}
`;

export const MISSION_HTML = `<!DOCTYPE html>
<html lang="en" data-template="operations" data-layout="operations">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pi Crew | Mission Control</title>
<style>
${MISSION_CSS}</style>
<script src="/app.js"></script>
</head>
<body>
<div class="notice" id="notice" role="alert"></div>

<header class="top">
  <div class="brand">
    <div class="logo" aria-hidden="true">&pi;</div>
    <div>
      <div class="crumb">Pi Crew / <span id="crumbName">Operations</span></div>
      <h1>Project <span class="proj mono" id="project">loading</span></h1>
    </div>
    <span class="live offline" id="live" role="status" aria-live="polite"><span class="dot" aria-hidden="true"></span><span id="liveTxt">Connecting</span></span>
  </div>
  <div class="actions">
    <button class="btn primary" id="newTask" type="button" aria-keyshortcuts="N"><span aria-hidden="true">+</span> New task <span class="k" aria-hidden="true">N</span></button>
    <button class="btn warn" id="pauseAll" type="button" aria-pressed="false"><span aria-hidden="true">&#10073;&#10073;</span> <span id="pauseLbl">Pause all</span></button>
    <button class="btn" id="archiveDone" type="button" disabled><span aria-hidden="true">&#8681;</span> Archive done</button>
    <span class="runs-wrap">
      <button class="btn" id="runsBtn" type="button" aria-expanded="false" aria-controls="runsPanel"><span aria-hidden="true">&#9776;</span> <span class="lbl-long">Runs</span> <span class="cnt" id="runsCnt">0</span></button>
      <div class="popover" id="runsPanel" role="region" aria-label="Live harness runs and worker runtime status" hidden>
        <h3>Live harness runs</h3>
        <p class="note">Pi owns execution. Closing this view does not stop work. Explicit pause stops active runs; native agents can be resumed in Pi.</p>
        <div id="harnessRuns"></div>
        <h3>Worker runtime status</h3>
        <p class="note">Worker runtime completion is separate from task acceptance. Select a worker to open its task.</p>
        <div class="pills" id="runtime" aria-live="polite"></div>
      </div>
    </span>
    <button class="switch" id="showArchived" type="button" role="switch" aria-checked="false"><span class="track" aria-hidden="true"></span>Show archived</button>
    <button class="btn icon-btn" id="themeBtn" type="button" aria-label="Switch to day theme"><span aria-hidden="true" id="themeIcon">&#9788;</span></button>
  </div>
</header>

<section class="kpis" aria-label="Key metrics">
  <div class="kpi c" id="kpiFlight"><div class="lbl">Tasks in flight</div><div class="val num" id="kInFlight">--</div><div class="sub" id="kInFlightSub">&nbsp;</div></div>
  <div class="kpi a" id="kpiAwait"><div class="lbl">Awaiting approval</div><div class="val num" id="kAwait">--</div><div class="sub" id="kAwaitSub">&nbsp;</div></div>
  <div class="kpi v" id="kpiAvg"><div class="lbl">Average score</div><div class="val num" id="kAvg">--</div><div class="sub" id="kAvgSub">&nbsp;</div></div>
  <div class="kpi g" id="kpiPass"><div class="lbl">Gate pass rate</div><div class="val num" id="kPass">--</div><div class="sub" id="kPassSub">&nbsp;</div></div>
  <div class="crewkpi">
    <div class="lbl">Crew &middot; filter by agent</div>
    <div class="chips" id="crew" role="group" aria-label="Filter tasks by agent"></div>
  </div>
</section>

<main class="wrap">
  <section class="board" id="board" aria-label="Kanban board"></section>
  <aside class="side">
    <section class="panel approval" id="approvalPanel" aria-labelledby="apH" hidden>
      <div class="panel-h"><h2 id="apH">Approval required</h2><button type="button" class="meta mono ap-open" id="apOpen"></button></div>
      <div id="apBody"></div>
    </section>
    <section class="panel" aria-labelledby="feedH">
      <div class="panel-h"><h2 id="feedH">Live activity</h2><span class="meta" id="feedMeta">connecting</span></div>
      <ol class="feed" id="feed" aria-live="polite" aria-relevant="additions"></ol>
    </section>
  </aside>
  <aside class="pane" id="pane" aria-label="Selected task detail" tabindex="-1"></aside>
</main>
<section class="console" id="console" aria-labelledby="conH">
  <div class="con-h"><span id="conH">&#9484;&#9472; <b>activity</b> &#9472; tail -f events.log</span><span class="meta" id="conMeta">connecting</span></div>
  <ol class="con-log" id="conLog" tabindex="0" aria-label="Live activity log"></ol>
</section>
<footer>Pi Crew &middot; completion gate: recorded tests plus tester, reviewer and orchestrator rubric scores must each be &ge; 85%. Pause in backlog to edit; release to ready to resume. Right-click a card or press Shift+F10 for task actions.</footer>

<div class="scrim" id="taskScrim" aria-hidden="true">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle" id="taskModal">
    <div class="m-head">
      <div class="m-top">
        <div style="min-width:0">
          <div class="m-ids" id="mIds"></div>
          <h2 id="mTitle">Task</h2>
        </div>
        <button class="btn icon-btn m-close" id="mClose" type="button" aria-label="Close task details">&#10005;</button>
      </div>
      <div class="m-stats" id="mStats"></div>
      <div class="m-approval" id="mApproval"></div>
      <div class="m-alert" id="mAlert"></div>
      <div class="m-actions" role="group" aria-label="Task actions">
        <button class="btn primary" id="saveTask" type="button">Save backlog edits</button>
        <button class="btn" id="backlogTask" type="button">Pause in backlog</button>
        <button class="btn" id="readyTask" type="button">Release to ready</button>
        <button class="btn" id="approveMerge" type="button">Approve PR merge</button>
        <button class="btn danger" id="archiveTask" type="button">Archive Done task</button>
        <button class="btn" id="auditTask" type="button">Full audit trail</button>
      </div>
      <div class="tabs" role="tablist" aria-label="Task detail sections">
        <button class="tab" type="button" role="tab" id="t-scope" aria-controls="p-scope" aria-selected="true">Scope</button>
        <button class="tab" type="button" role="tab" id="t-conv" aria-controls="p-conv" aria-selected="false" tabindex="-1">Conversation <span class="n" id="nConv">0</span></button>
        <button class="tab" type="button" role="tab" id="t-eval" aria-controls="p-eval" aria-selected="false" tabindex="-1">Evaluations <span class="n" id="nEval">0</span></button>
        <button class="tab" type="button" role="tab" id="t-evid" aria-controls="p-evid" aria-selected="false" tabindex="-1">Test evidence <span class="n" id="nEvid">0</span></button>
        <button class="tab" type="button" role="tab" id="t-exec" aria-controls="p-exec" aria-selected="false" tabindex="-1">Execution</button>
      </div>
    </div>
    <div class="m-body" id="mBody">
      <div class="tabpanel" role="tabpanel" id="p-scope" aria-labelledby="t-scope" tabindex="0">
        <div id="scopeEdit"></div>
        <div class="grid2" id="scopeRead"></div>
      </div>
      <div class="tabpanel" role="tabpanel" id="p-conv" aria-labelledby="t-conv" tabindex="0" hidden>
        <div class="thread" id="thread" aria-live="polite"></div>
        <form class="compose" id="commentForm"><label class="sr-only" for="comment">Your comment or steering instruction</label><textarea id="comment" required placeholder="Ask a question, clarify acceptance criteria, or steer the assigned agent..."></textarea><button class="btn primary" type="submit">Send</button></form>
      </div>
      <div class="tabpanel" role="tabpanel" id="p-eval" aria-labelledby="t-eval" tabindex="0" hidden>
        <div class="gate" id="gate" style="margin-bottom:14px"></div>
        <div class="grid2" id="evals"></div>
        <p style="font-size:12px;color:var(--dim);margin:12px 0 0">Hover or focus a bar for criterion detail. White marker = 85% pass threshold. Totals are as reported by each evaluator.</p>
      </div>
      <div class="tabpanel" role="tabpanel" id="p-evid" aria-labelledby="t-evid" tabindex="0" hidden>
        <div style="display:flex;flex-direction:column;gap:12px" id="evid"></div>
      </div>
      <div class="tabpanel" role="tabpanel" id="p-exec" aria-labelledby="t-exec" tabindex="0" hidden>
        <div class="box"><dl class="kv" id="execKv"></dl></div>
        <details data-stable-key="exec-details"><summary>Execution details</summary><pre class="xpre" id="execDetails" tabindex="0"></pre></details>
        <details data-stable-key="exec-history"><summary>Complete task history</summary><pre class="xpre" id="history" tabindex="0"></pre></details>
      </div>
    </div>
  </div>
</div>

<div class="scrim" id="createScrim" aria-hidden="true">
  <div class="modal sm" role="dialog" aria-modal="true" aria-labelledby="cTitle">
    <div class="m-head">
      <div class="m-top" style="margin-bottom:12px">
        <div style="min-width:0"><div class="m-ids">New task &middot; orchestrator intake</div><h2 id="cTitle">Add a task for the orchestrator</h2></div>
        <button class="btn icon-btn m-close" id="cClose" type="button" aria-label="Close new task">&#10005;</button>
      </div>
    </div>
    <form class="m-body" id="createForm">
      <p class="note">Submitted for immediate orchestrator preparation and Ready release using independent operator, tester and reviewer sessions. A Backlog hold requires your explicit request; required approvals still apply.</p>
      <div class="fgroup"><label class="flabel" for="newTitle">Title</label><input class="field" id="newTitle" required maxlength="200"></div>
      <div class="fgroup"><label class="flabel" for="newScope">Scope and acceptance criteria</label><textarea class="field" id="newScope" required></textarea></div>
      <div class="fgroup"><label class="flabel" for="newAssignee">Operator agent</label><input class="field" id="newAssignee" required value="operate"></div>
      <div class="fgroup"><label class="flabel" for="newCriterion">Project-specific acceptance criterion (100% weight)</label><textarea class="field" id="newCriterion" required></textarea></div>
      <button class="btn primary" type="submit">Submit task</button>
    </form>
  </div>
</div>

<div class="scrim" id="auditScrim" aria-hidden="true">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="auditTitle">
    <div class="m-head"><div class="m-top" style="margin-bottom:12px"><div style="min-width:0"><div class="m-ids">Full audit trail</div><h2 id="auditTitle">Audit</h2></div><button class="btn icon-btn m-close" id="auditClose" type="button" aria-label="Close audit trail">&#10005;</button></div></div>
    <div class="m-body" id="auditContent"></div>
  </div>
</div>

<div class="ctx" id="context" role="group" aria-label="Task actions" hidden>
  <button class="btn" type="button" id="ctxOpen">Open task</button>
  <button class="btn" type="button" id="ctxPause">Pause in backlog</button>
  <button class="btn" type="button" id="ctxAudit">Full audit trail</button>
  <button class="btn danger" type="button" id="ctxArchive">Archive Done task</button>
</div>

<div class="statusbar" id="statusbar" aria-label="Keyboard shortcuts and selection">
  <span class="mode" id="mode">NORMAL</span>
  <span><kbd>j</kbd>/<kbd>k</kbd> move</span>
  <span><kbd>h</kbd>/<kbd>l</kbd> lane</span>
  <span><kbd>enter</kbd> open</span>
  <span><kbd>y</kbd>/<kbd>n</kbd> approve</span>
  <span class="hint-x"><kbd>/</kbd> commands</span>
  <span class="hint-x"><kbd>esc</kbd> close</span>
  <span class="right" id="posTxt" aria-live="polite"></span>
</div>

<div class="scrim pal-scrim" id="palScrim" aria-hidden="true">
  <div class="pal" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="pal-in"><span aria-hidden="true">&gt;</span><label class="sr-only" for="palIn">Type a command</label><input id="palIn" autocomplete="off" spellcheck="false" placeholder="Type a command..." role="combobox" aria-expanded="true" aria-controls="palList" aria-autocomplete="list"></div>
    <ul id="palList" role="listbox" aria-label="Commands"></ul>
    <div class="pal-foot"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> select</span><span><kbd>enter</kbd> run</span><span><kbd>esc</kbd> close</span></div>
  </div>
</div>

<div class="toasts" id="toasts" aria-live="polite"></div>
</body>
</html>`;

/**
 * Operations-layout key map, kept pure so tests can evaluate it without a DOM. `e` is a KeyboardEvent (or a stand-in
 * with key/ctrlKey/metaKey/altKey/target); `s` says whether the command palette or another dialog is open. Returns
 * an action name, or "" to leave the key to the browser and the shared handlers (which also handle Esc for dialogs).
 */
export const OPS_KEYMAP = `function opsKey(e,s){
  const k=e.key,t=e.target||{},tag=String(t.tagName||"").toUpperCase(),typing=tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"||!!t.isContentEditable;
  if(s.palette){if(k==="Escape")return "palette-close";if(k==="ArrowDown")return "palette-next";if(k==="ArrowUp")return "palette-prev";if(k==="Enter")return "palette-run";if(k==="Tab")return "palette-trap";return "";}
  if(k==="Escape"||s.dialog||typing)return "";
  if((e.ctrlKey||e.metaKey)&&!e.altKey&&String(k).toLowerCase()==="k")return "palette";
  if(e.ctrlKey||e.metaKey||e.altKey)return "";
  if(k==="/")return "palette";
  if(k==="j")return "down";if(k==="k")return "up";if(k==="h")return "left";if(k==="l")return "right";
  if(k==="y")return "yes";if(k==="n")return "no";
  if(k==="Enter"){const card=!!(t.classList&&t.classList.contains("card"));return card||!/^(BUTTON|A|SUMMARY)$/.test(tag)?"open":"";}
  return "";
}`;

export const MISSION_SCRIPT = String.raw`"use strict";
(function(){
// Blocking same-origin script: apply the saved theme and last layout before first paint.
var theme="night";try{theme=localStorage.getItem("pi-kanban-theme")==="day"?"day":"night";}catch(e){}
var layout="operations";try{layout=localStorage.getItem("pi-kanban-layout")==="mission-control"?"mission-control":"operations";}catch(e){}
document.documentElement.dataset.theme=theme;document.documentElement.dataset.template=layout;document.documentElement.dataset.layout=layout;
${OPS_KEYMAP}
document.addEventListener("DOMContentLoaded",function(){
const $=id=>document.getElementById(id);
if(!$("taskScrim")){location.reload();return;}
const NS="http://www.w3.org/2000/svg";
const COLS=[["backlog","Backlog","backlog"],["ready","Ready","ready"],["in progress","In progress","progress"],["review","Review","review"],["done","Done","done"]];
const ROLES=["operator","tester","reviewer","orchestrator"];
const COLOR={working:"var(--cyan)",waiting:"var(--amber)",blocked:"var(--red)",cancelled:"var(--dim)",accepted:"var(--green)",queued:"var(--violet)"};
let token=location.hash.slice(1),board=null,selected=null,editVersion=null,editKey=null,filter=null,showArchived=false,latency=null,live=false;
let contextId=null,contextTask=null,contextTrigger=null,auditId=null,lastTaskId=null;
let paneId=null,conKey="",palOpen=false,palItems=[],palI=0,palLast=null;
const CONSOLE_N=80;
const seen=new Map();let firstFeed=true;
try{if(token)sessionStorage.setItem("pi-kanban-token",token);else token=sessionStorage.getItem("pi-kanban-token")||"";history.replaceState(null,"",location.pathname);}catch(e){}

// ---------- helpers (text is always assigned via textContent) ----------
const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined&&text!==null)e.textContent=String(text);return e;};
const setText=(e,t)=>{if(e.textContent!==t)e.textContent=t;};
const short=id=>String(id).slice(0,8);
const initial=name=>(String(name||"?").trim()[0]||"?").toUpperCase();
const stamp=at=>{const d=new Date(at);return Number.isNaN(d.getTime())?"Unknown time":d.toLocaleString();};
const pad=n=>String(n).padStart(2,"0");
const clock=at=>{const d=new Date(at);if(Number.isNaN(d.getTime()))return "--:--";const n=new Date();return d.toDateString()===n.toDateString()?pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds()):pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes());};
const ago=at=>{const s=Math.max(0,Math.round((Date.now()-new Date(at).getTime())/1000));if(!Number.isFinite(s))return "unknown";if(s<60)return s+"s";if(s<3600)return Math.floor(s/60)+"m "+(s%60)+"s";return Math.floor(s/3600)+"h "+Math.floor(s%3600/60)+"m";};
const tone=v=>v>=85?"g":v>=70?"a":"r";
const roleClass=r=>ROLES.includes(r)?"role-"+r:"";
const colName=c=>(COLS.find(x=>x[0]===c)||[c,c])[1];
// Operations and Mission Control are one page family: switching between them flips data-layout without a reload.
const family=t=>t==="mission-control"||t==="operations"?"mission":"classic";
const isOps=()=>document.documentElement.dataset.layout==="operations";
function task(id){return board&&board.tasks.find(t=>t.id===id);}
const openApproval=t=>!!(t&&t.approval&&!t.approval.answer&&!t.archived&&!t.disposition);
// Approval buttons (and the y/n keys) are enabled only once the worker has stopped.
const canAnswer=t=>openApproval(t)&&!t.lease;
const canPause=t=>t&&!t.archived&&t.column!=="backlog"&&t.column!=="done";
const agentFor=(t,role)=>({operator:t.assignee,tester:t.testerAgent,reviewer:t.reviewerAgent,orchestrator:"orchestrator"})[role]||role;
const workerName=(t,role)=>t.workerStatus&&t.workerStatus.identity&&t.workerStatus.identity.role===role?t.workerStatus.identity.name:(t.workers&&t.workers[role]&&t.workers[role].name)||agentFor(t,role)+" (unassigned identity)";
const shortName=(t,role)=>(t.workers&&t.workers[role]&&t.workers[role].name)||(t.workerStatus&&t.workerStatus.identity&&t.workerStatus.identity.role===role&&t.workerStatus.identity.name)||agentFor(t,role);
const cardWho=t=>{const role=t.phase||"operator";const w=t.workers&&t.workers[role];return {name:w?w.name:agentFor(t,role),role,assigned:!!w};};

function notice(msg){$("notice").textContent=msg||"";$("notice").classList.toggle("show",!!msg);}
function toast(title,msg,color){const box=$("toasts"),e=h("div","toast");e.setAttribute("role","status");e.style.setProperty("--tc",color||"var(--cyan)");const inner=h("div");inner.append(h("div","tt",title),h("div",null,msg));e.append(inner);box.append(e);setTimeout(()=>e.remove(),4200);}
function setLive(state,text){live=state==="live";const l=$("live");l.classList.toggle("offline",state==="offline");l.classList.toggle("paused",state==="paused");$("liveTxt").textContent=text;}

// Keep focus, scroll and open <details> stable across live re-renders.
function preserve(root,fn){
  const scroll=root.scrollTop,left=root.scrollLeft,focused=document.activeElement,hadFocus=root.contains(focused),key=focused&&focused.dataset?focused.dataset.stableKey:undefined;
  const elements=[...root.querySelectorAll("[data-stable-key]")],open=new Set(elements.filter(e=>e.matches("details[open]")).map(e=>e.dataset.stableKey));
  const positions=new Map(elements.filter(e=>e.scrollTop||e.scrollLeft).map(e=>[e.dataset.stableKey,[e.scrollTop,e.scrollLeft]]));
  fn();
  for(const e of root.querySelectorAll("[data-stable-key]")){
    if(e.matches("details")&&open.has(e.dataset.stableKey))e.open=true;
    const p=positions.get(e.dataset.stableKey);if(p){e.scrollTop=p[0];e.scrollLeft=p[1];}
  }
  if(hadFocus&&key&&!root.contains(document.activeElement)){const n=[...root.querySelectorAll("[data-stable-key]")].find(e=>e.dataset.stableKey===key);if(n)n.focus({preventScroll:true});}
  root.scrollTop=scroll;root.scrollLeft=left;
}

async function api(path,body){
  const started=performance.now();
  const r=await fetch(path,{method:body?"POST":"GET",headers:{Authorization:"Bearer "+token,...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined});
  const data=await r.json();latency=Math.round(performance.now()-started);
  if(!r.ok)throw new Error(data.error||"Board request failed");
  if(live)setLive("live","Live \u00b7 "+latency+"ms");
  return data;
}
async function action(name,id,extra,contextVersion){
  try{
    const current=id?task(id):null;const payload={action:name,id,...(extra||{})};
    if(contextVersion!==undefined&&(!canPause(current)||current.updatedAt!==contextVersion)){toast("Task changed","Reopen its actions before pausing.","var(--amber)");return false;}
    if(name==="archive"&&(!current||current.archived||current.column!=="done")){toast("Not archived","Only Done tasks can be archived. Pause active work instead.","var(--amber)");return false;}
    if(current)payload.expectedUpdatedAt=contextVersion!==undefined?contextVersion:(name==="edit"?editVersion:current.updatedAt);
    const data=await api("/api/action",payload);
    update(data);
    if(name==="edit"||(name==="move"&&selected===id)){const t=task(id);if(t){editVersion=t.updatedAt;openTask(id,true);}}
    return true;
  }catch(e){toast("Action failed",e.message,"var(--red)");return false;}
}

// ---------- snapshot ----------
function update(data){
  if(data.template&&family(data.template)!=="mission"){try{history.replaceState(null,"",location.pathname+"#"+token);}catch(e){}location.reload();return;}
  if(data.template)setLayout(data.template);
  board={...data,activity:data.activity||data.tasks.flatMap(t=>t.history.map(e=>({...e,taskId:t.id}))).sort((a,b)=>String(b.at).localeCompare(String(a.at)))};
  $("project").textContent=board.name;document.title=board.name+(isOps()?" | Pi Crew Operations":" | Pi Crew Mission Control");$("project").title=board.id+" / "+board.projectPath;
  const active=board.tasks.filter(t=>!t.archived),done=active.filter(t=>t.column==="done").length;
  $("archiveDone").disabled=!active.length||done!==active.length;
  $("archiveDone").title=done+" / "+active.length+" tasks done. Only completed scope can be archived.";
  renderKpis();preserve($("crew"),renderCrew);ensurePane();preserve($("board"),renderBoard);preserve($("approvalPanel"),renderApproval);renderFeed();
  preserve($("pane"),renderPane);renderConsole();renderStatus();
  preserve($("harnessRuns"),renderRuns);preserve($("runtime"),renderRuntime);refreshContext();
  if(selected)preserve($("taskModal"),refreshTask);
  if(auditId&&isOpen("auditScrim"))renderAudit();
}

// ---------- KPI strip ----------
function spark(values,color){
  if(!values||values.length<2)return null;
  const max=Math.max(...values),min=Math.min(...values),span=max-min;
  const svg=document.createElementNS(NS,"svg"),pl=document.createElementNS(NS,"polyline");
  for(const [k,v] of [["class","spark"],["width","80"],["height","26"],["viewBox","0 0 80 26"],["aria-hidden","true"]])svg.setAttribute(k,v);
  pl.setAttribute("fill","none");pl.setAttribute("stroke","currentColor");pl.setAttribute("stroke-width","1.5");pl.style.color=color;
  pl.setAttribute("points",values.map((v,i)=>(i*80/(values.length-1)).toFixed(1)+","+(span?(23-(v-min)/span*19):13).toFixed(1)).join(" "));
  svg.append(pl);return svg;
}
function hourly(events,test){const now=Date.now(),buckets=new Array(12).fill(0);for(const a of events){if(!test(a))continue;const age=Math.floor((now-new Date(a.at).getTime())/3600000);if(age>=0&&age<12)buckets[11-age]++;}return buckets.some(Boolean)?buckets:null;}
function kpi(id,valueId,subId,value,sub,sparkline){
  const v=$(valueId);v.replaceChildren();if(value&&value.pct!==undefined){v.append(value.pct);v.append(h("small",null,"%"));}else v.textContent=value;
  $(subId).textContent=sub;const box=$(id);box.querySelector(".spark")?.remove();if(sparkline)box.append(sparkline);
}
function renderKpis(){
  const alive=board.tasks.filter(t=>!t.archived&&!t.disposition);
  const flight=alive.filter(t=>t.column==="in progress"||t.column==="review"),blocked=flight.filter(t=>t.blocked||t.suspension||openApproval(t)).length;
  const waiting=alive.filter(openApproval).sort((a,b)=>String(a.approval.at).localeCompare(String(b.approval.at)));
  const evals=alive.flatMap(t=>Object.values(t.evaluations||{})).filter(e=>e&&typeof e.total==="number").sort((a,b)=>String(a.at).localeCompare(String(b.at)));
  const avg=evals.length?evals.reduce((s,e)=>s+e.total,0)/evals.length:null,pass=evals.filter(e=>e.total>=85).length;
  const recent=evals.slice(-12);let passed=0;const passSeries=recent.map((e,i)=>{if(e.total>=85)passed++;return passed/(i+1)*100;});
  kpi("kpiFlight","kInFlight","kInFlightSub",String(flight.length),(flight.length-blocked)+" active \u00b7 "+blocked+" blocked or waiting",spark(hourly(board.activity||[],()=>true),"var(--cyan)"));
  const w=waiting[0];
  kpi("kpiAwait","kAwait","kAwaitSub",String(waiting.length),w?((w.approval.identity&&w.approval.identity.name)||w.approval.role)+" \u00b7 waiting "+ago(w.approval.at):"queue clear",spark(hourly(board.activity||[],a=>/approval/i.test(a.event||"")),"var(--amber)"));
  kpi("kpiAvg","kAvg","kAvgSub",avg===null?"--":{pct:avg.toFixed(1)},evals.length?"across "+evals.length+" evaluation"+(evals.length===1?"":"s"):"no evaluations yet",spark(recent.map(e=>e.total),"var(--violet)"));
  kpi("kpiPass","kPass","kPassSub",evals.length?{pct:String(Math.round(pass/evals.length*100))}:"--",evals.length?pass+" of "+evals.length+" \u2265 85% threshold":"no evaluations yet",spark(passSeries,"var(--green)"));
}

// ---------- crew chips ----------
function identities(){
  const map=new Map();
  for(const t of board.tasks.filter(t=>!t.archived)){
    for(const w of Object.values(t.workers||{})){
      if(!w||!w.id)continue;const entry=map.get(w.id)||{w,tasks:[],state:"idle",detail:null};entry.tasks.push(t);
      const s=t.workerStatus&&t.workerStatus.identity&&t.workerStatus.identity.id===w.id?t.workerStatus:null;
      const st=t.disposition?"idle":(s&&["working","thinking"].includes(s.state)&&t.lease)?"active":(t.blocked||t.suspension||(s&&["waiting_dependency","waiting_user","stuck","error"].includes(s.state)))&&t.column!=="done"?"wait":"idle";
      if(st==="active"||(st==="wait"&&entry.state==="idle")){entry.state=st;entry.detail={t,s};}
      if(!entry.detail)entry.detail={t,s};
      map.set(w.id,entry);
    }
  }
  return [...map.values()].sort((a,b)=>ROLES.indexOf(a.w.role)-ROLES.indexOf(b.w.role)||String(a.w.name).localeCompare(String(b.w.name)));
}
function renderCrew(){
  const target=$("crew");target.replaceChildren();const list=identities();
  if(filter&&!list.some(e=>e.w.id===filter))filter=null;
  for(const e of list){
    const c=h("button","chip "+roleClass(e.w.role));c.type="button";c.dataset.stableKey="chip:"+e.w.id;c.setAttribute("aria-pressed",String(filter===e.w.id));
    const label=e.state==="active"?"active":e.state==="wait"?"waiting":"idle";
    const dot=h("span","st"+(e.state==="idle"?" idle":e.state==="wait"?" wait":""));dot.setAttribute("role","img");dot.setAttribute("aria-label",label);
    const av=h("span","av",initial(e.w.name));av.setAttribute("aria-hidden","true");
    c.append(av,document.createTextNode(e.w.name+" "),h("span","r",e.w.role),dot);
    const s=e.detail&&e.detail.s;c.title=e.w.name+" ("+e.w.definition+") \u00b7 "+e.tasks.length+" task"+(e.tasks.length===1?"":"s")+" \u00b7 "+(s?s.state.replaceAll("_"," ")+": "+s.reason:label)+". Click to filter cards.";
    c.onclick=()=>{filter=filter===e.w.id?null:e.w.id;preserve($("crew"),renderCrew);ensurePane();preserve($("board"),renderBoard);refreshOps();};
    target.append(c);
  }
  if(!list.length)target.append(h("span","none","No worker identities yet"));
}

// ---------- board ----------
function status(t){
  if(t.disposition)return ["cancelled","cancelled"];
  if(openApproval(t))return ["waiting","awaiting you"];
  if(t.blocked)return ["blocked","blocked"];
  if(t.suspension)return ["blocked","suspended"];
  if(t.queue)return ["queued","waiting / "+t.queue.state];
  const s=t.workerStatus;
  if(s&&t.column!=="done"){
    if(["working","thinking"].includes(s.state))return ["working",s.state];
    if(s.state==="waiting_user")return ["waiting","waiting user"];
    if(s.state==="waiting_dependency")return ["waiting","waiting dep"];
    if(["stuck","error"].includes(s.state))return ["blocked",s.state];
  }
  if(t.lease)return ["working","working"];
  if(t.column==="done"){const e=t.evaluations||{};return ["tester","reviewer","orchestrator"].every(r=>e[r]&&e[r].total>=85)?["accepted","accepted"]:["accepted","done"];}
  if(t.column==="ready")return ["queued","queued"];
  if(t.userPaused&&t.column==="backlog")return ["cancelled","paused"];
  return null;
}
const PHASE_PROGRESS={operator:25,tester:50,reviewer:75,orchestrator:90};
function card(t){
  const st=status(t),who=cardWho(t),attn=openApproval(t);
  const c=h("button","card"+(attn?" attn":"")+(t.archived?" archived":"")+(t.id===paneId?" sel":""));c.type="button";c.dataset.taskId=t.id;c.dataset.stableKey="card:"+t.id;c.draggable=!t.archived;
  c.style.setProperty("--sc",st?COLOR[st[0]]:"var(--line2)");
  c.setAttribute("aria-label",(isOps()?"Select task ":"Open task ")+short(t.id)+": "+t.title+", "+colName(t.column)+(st?", "+st[1]:"")+(attn?", needs your approval":""));c.setAttribute("aria-keyshortcuts","Shift+F10");
  const r1=h("span","row");r1.append(h("span","id","#"+short(t.id)),h("span","rev","r"+t.revision));
  if(t.archived)r1.append(h("span","rev","\u00b7 archived"));
  if(t.proposal&&!t.proposal.approved)r1.append(h("span","flag","proposal"));
  if(t.suspension&&st&&st[1]!=="suspended")r1.append(h("span","flag","suspended"));
  if(t.prMode==="merge"&&!t.mergeApproved&&!t.archived)r1.append(h("span","flag","merge?"));
  const ev=t.evaluations||{},te=ev.tester,re=ev.reviewer;
  if(te||re){const mini=h("span","mini");mini.setAttribute("aria-label","Scores: "+(te?"tester "+te.total.toFixed(1)+"%":"tester pending")+", "+(re?"reviewer "+re.total.toFixed(1)+"%":"reviewer pending"));if(te)mini.append(h("span","c-"+tone(te.total),"T "+Math.round(te.total)));if(re)mini.append(h("span","c-"+tone(re.total),"R "+Math.round(re.total)));r1.append(mini);}
  const r2=h("span","row"),w=h("span","who "+roleClass(who.role)),av=h("span","av",initial(who.name));av.setAttribute("aria-hidden","true");
  w.append(av,document.createTextNode(who.name+" "),h("span","role",who.role));if(!who.assigned)w.title="Unassigned identity: agent definition "+who.name;
  const right=h("span");right.style.marginLeft="auto";if(st)right.append(h("span","badge b-"+st[0],st[1]));r2.append(w,right);
  c.append(r1,h("span","ttl",t.title),r2);
  if((t.column==="in progress"||t.column==="review")&&!t.archived&&!t.disposition){const p=h("span","prog"),i=h("i");i.style.width=(PHASE_PROGRESS[t.phase]||10)+"%";p.title="Phase: "+t.phase;p.setAttribute("aria-hidden","true");p.append(i);c.append(p);}
  const reason=t.blocked||(t.queue&&t.queue.reason)||(t.workerStatus&&t.column!=="done"&&t.workerStatus.reason?t.workerStatus.state.replaceAll("_"," ")+": "+t.workerStatus.reason:"")||(t.disposition&&"Cancelled (not accepted): "+t.disposition.reason)||"";
  c.title=t.title+(reason?"\n"+reason:"")+"\nCreated "+stamp(t.createdAt)+" \u00b7 Updated "+stamp(t.updatedAt);
  // Operations: click selects into the detail pane; double-click (or Enter) opens the full task window.
  c.addEventListener("click",()=>{if(isOps())selectTask(t.id);else openTask(t.id);});
  c.addEventListener("dblclick",()=>{if(isOps())openTask(t.id);});
  c.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",t.id));
  c.addEventListener("contextmenu",e=>{e.preventDefault();showContext(t.id,e.clientX,e.clientY,c);});
  c.addEventListener("keydown",e=>{if(e.key==="ContextMenu"||(e.shiftKey&&e.key==="F10")){e.preventDefault();const r=c.getBoundingClientRect();showContext(t.id,r.left,r.top,c);}});
  return c;
}
function laneTasks(key){return board?board.tasks.filter(t=>t.column===key&&(showArchived||!t.archived)&&(!filter||Object.values(t.workers||{}).some(w=>w&&w.id===filter))):[];}
function renderBoard(){
  const target=$("board");target.replaceChildren();
  for(const [key,name,slug] of COLS){
    const tasks=laneTasks(key);
    const col=h("section","col");col.dataset.col=slug;col.dataset.column=key;col.dataset.stableKey="col:"+slug;col.setAttribute("aria-labelledby","h-"+slug);
    const head=h("div","col-h"),bar=h("span","bar"),cnt=h("span","cnt",String(tasks.length));bar.setAttribute("aria-hidden","true");cnt.setAttribute("aria-label",tasks.length+" tasks");
    const h2=h("h2",null,name);h2.id="h-"+slug;head.append(bar,h2,cnt);
    const body=h("div","col-b");
    for(const t of tasks)body.append(card(t));
    if(!tasks.length)body.append(h("div","empty",key==="backlog"&&!filter?"no tasks \u00b7 the orchestrator captures scope here":"no tasks"));
    col.append(head,body);
    col.addEventListener("dragover",e=>{if(key==="backlog"||key==="ready"){e.preventDefault();col.classList.add("drop");}});
    col.addEventListener("dragleave",()=>col.classList.remove("drop"));
    col.addEventListener("drop",e=>{e.preventDefault();col.classList.remove("drop");const id=e.dataTransfer.getData("text/plain");if(task(id))void action("move",id,{column:key});});
    target.append(col);
  }
}

// ---------- approvals ----------
function approvalBody(t,where){
  const a=t.approval,name=(a.identity&&a.identity.name)||a.role,body=h("div","ap-body");
  const who=h("div","ap-who"),av=h("span","av",initial(name));av.setAttribute("aria-hidden","true");who.append(av,document.createTextNode(name+" needs your approval"));
  const q=h("p","ap-q",a.question);q.id="apq-"+where+"-"+short(t.id);
  body.append(who,q,h("div","ap-meta",a.role+" paused \u00b7 asked "+clock(a.at)+" ("+ago(a.at)+" ago) \u00b7 blocks task "+short(t.id)));
  const btns=h("div","ap-btns");
  for(const [d,label] of [["yes","Yes"],["no","No"]]){
    const b=h("button",d,label);b.type="button";b.dataset.answer=d;b.dataset.stableKey="ap-"+d+":"+where+":"+t.id;b.disabled=!!t.lease;b.setAttribute("aria-describedby",q.id);
    b.title=t.lease?"Wait for the worker to stop before answering":(d==="yes"?"Approve: ":"Decline: ")+a.question;
    b.onclick=e=>{e.stopPropagation();void answer(t,d);};
    btns.append(b);
  }
  body.append(btns);
  if(t.lease)body.append(h("div","ap-wait","Worker still stopping; buttons enable shortly."));
  return body;
}
async function answer(t,d){
  const a=t.approval,name=(a&&a.identity&&a.identity.name)||(a&&a.role)||"the worker";
  if(await action("respond-approval",t.id,{decision:d}))toast(d==="yes"?"Approved":"Declined",(d==="yes"?"Recorded approval for ":"Recorded decline for ")+name+" on task "+short(t.id)+".",d==="yes"?"var(--green)":"var(--red)");
}
function renderApproval(){
  const waiting=board.tasks.filter(openApproval).sort((a,b)=>String(a.approval.at).localeCompare(String(b.approval.at)));
  const panel=$("approvalPanel");panel.hidden=!waiting.length;$("apBody").replaceChildren();if(!waiting.length)return;
  const t=waiting[0];$("apOpen").textContent=short(t.id)+" \u00b7 r"+t.revision;$("apOpen").setAttribute("aria-label","Open task "+short(t.id)+": "+t.title);$("apOpen").dataset.stableKey="ap-open";$("apOpen").onclick=()=>openTask(t.id);
  const body=approvalBody(t,"panel");if(waiting.length>1)body.append(h("div","ap-more","+"+(waiting.length-1)+" more awaiting your answer (highlighted cards)"));
  $("apBody").append(body);
}

// ---------- feed ----------
function renderFeed(){
  const target=$("feed"),items=[...(board.activity||[])].sort((a,b)=>String(b.at).localeCompare(String(a.at))).slice(0,200);
  const now=Date.now();
  preserve(target,()=>{
    target.replaceChildren();
    for(const a of items){
      const t=task(a.taskId);if(!t)continue;const key=a.id||a.taskId+a.at+a.event;
      if(!seen.has(key))seen.set(key,firstFeed?0:now);
      const li=h("li",(a.identity?roleClass(a.identity.role):"")+(seen.get(key)&&now-seen.get(key)<8000?" new":""));
      const b=h("button","fi");b.type="button";b.dataset.stableKey="feed:"+key;
      const tm=h("time",null,clock(a.at));tm.dateTime=a.at;tm.title=stamp(a.at);
      const d=h("div");d.append(h("span","act",(a.identity&&a.identity.name)||a.actor)," ",h("span","tid","#"+short(t.id))," ",h("span","ev",a.event+(a.summary?" - "+a.summary:"")));
      b.title=t.title;b.setAttribute("aria-label",((a.identity&&a.identity.name)||a.actor)+" "+a.event+" on "+t.title+" at "+stamp(a.at));
      b.append(tm,d);b.onclick=()=>{openTask(t.id);if(a.commentId){selectTab("t-conv");const c=[...$("thread").children].find(e=>e.dataset.commentId===a.commentId);if(c){const det=c.querySelector("details");if(det)det.open=true;c.scrollIntoView({block:"nearest"});}}};
      li.append(b);target.append(li);
    }
    if(!target.children.length){const li=h("li","empty-feed","No recorded activity yet.");target.append(li);}
  });
  firstFeed=false;$("feedMeta").textContent=live?"streaming":"offline";
}

// ---------- operations layout: detail pane, activity console, status bar, keyboard, palette ----------
function setLayout(tpl){
  const root=document.documentElement,next=tpl==="mission-control"?"mission-control":"operations",was=root.dataset.layout;
  root.dataset.template=tpl;root.dataset.layout=next;try{localStorage.setItem("pi-kanban-layout",next);}catch(e){}
  layoutText();if(was!==next){conKey="";if(next!=="operations")closePalette(false);}
}
function layoutText(){setText($("crumbName"),isOps()?"Operations":"Mission Control");}
function visibleTasks(){return COLS.flatMap(c=>laneTasks(c[0]));}
// Default selection: the oldest open approval, else the first task in progress, else the first visible task.
function ensurePane(){
  const vis=visibleTasks();if(paneId&&vis.some(t=>t.id===paneId))return;
  const ap=vis.filter(openApproval).sort((a,b)=>String(a.approval.at).localeCompare(String(b.approval.at)))[0];
  const pick=ap||vis.find(t=>t.column==="in progress")||vis[0];paneId=pick?pick.id:null;
}
function refreshOps(){preserve($("pane"),renderPane);renderStatus();}
function selectTask(id,focus){
  if(!task(id))return;const changed=paneId!==id;paneId=id;lastTaskId=id;
  for(const c of $("board").querySelectorAll(".card"))c.classList.toggle("sel",c.dataset.taskId===id);
  refreshOps();if(changed)$("pane").scrollTop=0;
  if(focus){const c=[...$("board").querySelectorAll(".card")].find(e=>e.dataset.taskId===id);if(c){c.focus({preventScroll:true});c.scrollIntoView({block:"nearest",inline:"nearest"});}}
}
function moveSel(dy,dx){
  const lanes=COLS.map(c=>laneTasks(c[0]));let li=lanes.findIndex(l=>l.some(t=>t.id===paneId));
  if(li<0){const first=lanes.find(l=>l.length);if(first)selectTask(first[0].id,true);return;}
  let ri=lanes[li].findIndex(t=>t.id===paneId);
  if(dy)ri=Math.max(0,Math.min(lanes[li].length-1,ri+dy));
  if(dx)for(let k=li+dx;k>=0&&k<lanes.length;k+=dx)if(lanes[k].length){li=k;ri=Math.min(ri,lanes[k].length-1);break;}
  selectTask(lanes[li][ri].id,true);
}
function frame(name,extra,content){
  const f=h("section","frame"),ttl=h("span","ttl");f.setAttribute("aria-label",name);
  ttl.append("\u250c\u2500 ",h("b",null,name));if(extra)ttl.append(" \u2500 "+extra);ttl.setAttribute("aria-hidden","true");f.append(ttl,content);return f;
}
function paneAsk(t){
  const a=t.approval,name=(a.identity&&a.identity.name)||a.role,box=h("div","ask");box.setAttribute("role","group");box.setAttribute("aria-label","Approval request for task "+short(t.id));
  const hd=h("div","ask-h");hd.append(h("span",null,"? "+name+" needs your approval"),h("span",null,"y / n"));
  const q=h("p",null,a.question);q.id="apq-pane-"+short(t.id);
  box.append(hd,q,h("div","ap-meta",a.role+" paused \u00b7 asked "+clock(a.at)+" ("+ago(a.at)+" ago)"));
  const btns=h("div","ap-btns");
  for(const [d,label] of [["yes","[y] Yes"],["no","[n] No"]]){
    const b=h("button",d,label);b.type="button";b.dataset.answer=d;b.dataset.stableKey="ap-"+d+":pane:"+t.id;b.disabled=!canAnswer(t);b.setAttribute("aria-describedby",q.id);b.setAttribute("aria-keyshortcuts",d==="yes"?"Y":"N");
    b.title=t.lease?"Wait for the worker to stop before answering":(d==="yes"?"Approve: ":"Decline: ")+a.question;
    b.onclick=e=>{e.stopPropagation();void answer(t,d);};btns.append(b);
  }
  box.append(btns);if(t.lease)box.append(h("div","ap-wait","Worker still stopping; buttons enable shortly."));
  return box;
}
function paneEvals(t){
  const ev=t.evaluations||{},box=h("div");
  for(const r of ["tester","reviewer","orchestrator"]){
    const e=ev[r],sec=h("div","oeval "+roleClass(r)),hd=h("div","oeval-h");hd.append(h("span","r",r),h("span","by",e?"@"+e.actor+" \u00b7 r"+e.revision:shortName(t,r)));sec.append(hd);
    if(!e){const v=h("span","verdict","pending");v.style.cssText="color:var(--dim);border-color:var(--line2)";hd.append(v);box.append(sec);continue;}
    const tn=tone(e.total),v=h("span","verdict c-"+tn,e.total>=85?"pass":"below gate");v.style.borderColor="currentColor";hd.append(v);
    sec.append(meter("Overall (weighted)",0,e.total,r+" overall weighted rubric score (as reported). Gate requires at least 85%.\n\n"+e.notes,"pane:"+r+":total"));
    (t.rubric||[]).forEach((c,i)=>{const own=e.criterionNotes&&e.criterionNotes[i];sec.append(meter(c.title,c.weight,Number((e.scores||[])[i]??0),own||("No per-criterion note; overall evaluation:\n"+e.notes),"pane:"+r+":"+i));});
    box.append(sec);
  }
  const lg=h("div","legend");lg.append(h("span","c-g","\u25a0 \u226585 pass"),h("span","c-a","\u25a0 70-84"),h("span","c-r","\u25a0 <70"),h("span",null,"| = 85% gate"));box.append(lg);
  return box;
}
function renderPane(){
  const p=$("pane");p.replaceChildren();const t=task(paneId);
  if(!t){p.append(h("div","pane-empty","No task selected. Click a card or press j / k."));return;}
  const st=status(t),head=h("div","pane-h"),left=h("div"),sub=h("div","sub");left.style.minWidth="0";
  sub.append(h("span","id","#"+short(t.id)),h("span",null,"rev "+t.revision),h("span",null,"\u00b7 "+colName(t.column)),h("span",null,"\u00b7 "+t.phase));
  if(st)sub.append(h("span","badge b-"+st[0],st[1]));if(t.archived)sub.append(h("span","badge b-cancelled","archived"));
  left.append(h("h2",null,t.title),sub);
  const open=h("button","btn","Open \u21b5");open.type="button";open.dataset.stableKey="pane-open";open.title="Open the full task window (Enter)";open.setAttribute("aria-label","Open task "+short(t.id)+" in the full task window");open.onclick=()=>openTask(t.id);
  head.append(left,open);p.append(head);
  if(openApproval(t))p.append(paneAsk(t));
  const dl=h("dl","okv"),row=(k,v,cls)=>{dl.append(h("dt",null,k),h("dd",cls,v));},who=cardWho(t);
  row("assignee","@"+who.name+" /"+who.role);
  row("crew",["tester","reviewer"].map(r=>shortName(t,r)+" /"+r).join(" \u00b7 "));
  row("gate","tests + tester, reviewer, orchestrator \u2265 85%");
  row("runs",t.runs+" / "+t.maxRuns+(t.prMode&&t.prMode!=="none"?" \u00b7 PR "+t.prMode:""));
  const reason=t.blocked||(t.queue&&t.queue.reason)||(t.disposition&&"Cancelled (not accepted): "+t.disposition.reason)||(t.workerStatus&&t.column!=="done"&&t.workerStatus.reason?t.workerStatus.state.replaceAll("_"," ")+": "+t.workerStatus.reason:"");
  if(reason&&!openApproval(t))row("status",reason);
  row("brief",t.scope,"brief");
  p.append(frame("scope",null,dl));
  const comments=t.comments||[],conv=h("div");
  if(comments.length){
    const ul=h("ul","chat");
    for(const c of comments.slice(-5)){
      const name=(c.identity&&c.identity.name)||c.author,role=c.identity?c.identity.role:(ROLES.includes(c.author)?c.author:"");
      const li=h("li",role?roleClass(role):"user"),from=h("div","from");from.append(h("b",null,name),(role?" /"+role:" /you")+" \u00b7 "+clock(c.at));
      li.append(from,h("div",null,c.summary||String(c.text||"").split(/\r?\n/)[0]||"Comment"));ul.append(li);
    }
    conv.append(ul);
  }else conv.append(h("div","eval-pending","No comments yet."));
  const more=h("button","linkish",comments.length>5?"View all "+comments.length+" in the task window \u2192":"Reply in the task window \u2192");more.type="button";more.dataset.stableKey="pane-conv";
  more.onclick=()=>{openTask(t.id);selectTab("t-conv");};conv.append(more);
  p.append(frame("conversation",String(comments.length),conv));
  p.append(frame("evaluations","rubric",paneEvals(t)));
  const tests=t.tests||[],ev=h("div","oevid");
  if(!tests.length)ev.append(h("span","eval-pending","No recorded test evidence yet."));
  else{const x=tests[tests.length-1],l1=h("div"),l2=h("div");l1.append(h("span","c-g","$ "),h("span","cmd",x.command));l2.append("exit code ",h("b",x.exitCode===0?"c-g":"c-r",String(x.exitCode))," \u00b7 "+clock(x.at)+(tests.length>1?" \u00b7 "+tests.length+" runs":""));ev.append(l1,l2);}
  p.append(frame("test evidence",null,ev));
}
const evTone=e=>/declin|reject|fail|block|cancel|error|stuck/i.test(e)?"r":/approv|wait|pause|suspend|question/i.test(e)?"a":/accept|pass|done|complet|merge|archiv/i.test(e)?"g":/creat|move|claim|dispatch|releas|assign|start/i.test(e)?"c":"t";
function renderConsole(){
  const ol=$("conLog"),items=[...(board.activity||[])].filter(a=>task(a.taskId)).sort((a,b)=>String(a.at).localeCompare(String(b.at))).slice(-CONSOLE_N);
  $("conMeta").textContent=(live?"streaming":"offline")+" \u00b7 last "+items.length;
  const last=items[items.length-1],key=items.length+"|"+(last?(last.id||last.taskId+last.at+last.event):"");
  if(key===conKey)return;
  const stick=!conKey||ol.scrollHeight-ol.scrollTop-ol.clientHeight<48,now=Date.now();conKey=key;
  ol.replaceChildren();
  for(const a of items){
    const t=task(a.taskId),k=a.id||a.taskId+a.at+a.event,li=h("li",(a.identity?roleClass(a.identity.role):"")+(seen.get(k)&&now-seen.get(k)<8000?" new":""));
    const actor=a.identity&&a.identity.name?a.identity.name+"/"+a.identity.role:a.actor,b=h("button","cl"),tm=h("span","t",clock(a.at));b.type="button";tm.title=stamp(a.at);
    b.append(tm,h("span","who",actor),h("span","ev ev-"+evTone(a.event||""),a.event+(a.summary?" - "+a.summary:"")),h("span","tid","#"+short(t.id)));
    b.title=t.title+" \u00b7 "+stamp(a.at);b.setAttribute("aria-label",actor+" "+a.event+" on "+t.title+" at "+stamp(a.at)+". Select task.");b.onclick=()=>selectTask(t.id);
    li.append(b);ol.append(li);
  }
  if(!items.length)ol.append(h("li","cursor","No recorded activity yet. "));else{const cur=h("li","cursor","--:--:-- ");cur.setAttribute("aria-hidden","true");ol.append(cur);}
  if(stick)ol.scrollTop=ol.scrollHeight;
}
function renderStatus(){
  const all=visibleTasks(),i=all.findIndex(t=>t.id===paneId);
  $("posTxt").textContent=(i>=0?"#"+short(paneId)+"  "+(i+1)+"/"+all.length:"-/"+all.length)+(board?"  "+board.name:"");
}
function setMode(m){setText($("mode"),m);$("mode").classList.toggle("cmd",m!=="NORMAL");}
function keyAnswer(a){
  const t=task(paneId),d=a==="yes"?"yes":"no";
  if(!openApproval(t)){toast("Nothing to answer","The selected task has no open approval.","var(--dim)");return;}
  if(!canAnswer(t)){toast("Not yet","Wait for the worker to stop before answering.","var(--amber)");return;}
  void answer(t,d);
}
const CMDS=[
  ["task","New task",()=>$("newTask").click()],
  ["board","Pause all",()=>$("pauseAll").click()],
  ["board","Archive done",()=>{if($("archiveDone").disabled)toast("Nothing to archive",$("archiveDone").title||"Only a fully Done board can be archived.","var(--amber)");else $("archiveDone").click();}],
  ["view","Toggle archived",()=>$("showArchived").click()],
  ["view","Toggle theme",()=>$("themeBtn").click()],
];
function palRender(){
  const q=$("palIn").value.trim().toLowerCase(),ul=$("palList");palItems=CMDS.filter(c=>!q||(c[0]+" "+c[1]).toLowerCase().includes(q));if(palI>=palItems.length)palI=0;ul.replaceChildren();
  if(!palItems.length){const li=h("li","none","No matching command");li.setAttribute("role","option");li.setAttribute("aria-disabled","true");ul.append(li);$("palIn").removeAttribute("aria-activedescendant");return;}
  palItems.forEach((c,i)=>{const li=h("li"),l=h("span");li.id="po"+i;li.setAttribute("role","option");li.setAttribute("aria-selected",String(i===palI));l.append(h("span","grp",c[0]),c[1]);li.append(l);li.onclick=()=>palRun(i);ul.append(li);});
  $("palIn").setAttribute("aria-activedescendant","po"+palI);$("po"+palI).scrollIntoView({block:"nearest"});
}
function openPalette(){if(palOpen)return;palLast=document.activeElement;palOpen=true;palI=0;$("palIn").value="";$("palScrim").classList.add("open");$("palScrim").setAttribute("aria-hidden","false");setMode("COMMAND");palRender();$("palIn").focus();}
function closePalette(restore){
  if(!palOpen)return;palOpen=false;$("palScrim").classList.remove("open");$("palScrim").setAttribute("aria-hidden","true");setMode("NORMAL");
  if(restore!==false&&palLast&&document.contains(palLast))palLast.focus({preventScroll:true});
}
function palRun(i){const c=palItems[i];if(!c)return;closePalette();c[2]();}
$("palIn").addEventListener("input",()=>{palI=0;palRender();});
{let down=false;$("palScrim").addEventListener("pointerdown",e=>{down=e.target===$("palScrim");});$("palScrim").addEventListener("click",e=>{if(down&&e.target===$("palScrim"))closePalette();down=false;});}
// Returns true when the Operations layout consumed the key.
function opsKeydown(e){
  const a=opsKey(e,{palette:palOpen,dialog:stack.length>0||!$("context").hidden});
  if(palOpen){
    if(a)e.preventDefault();
    if(a==="palette-close")closePalette();
    else if(a==="palette-next"||a==="palette-prev"){const n=Math.max(1,palItems.length);palI=(palI+(a==="palette-next"?1:n-1))%n;palRender();}
    else if(a==="palette-run")palRun(palI);
    else if(a==="palette-trap")$("palIn").focus();
    return true;
  }
  if(!a)return false;
  e.preventDefault();
  if(a==="palette")openPalette();
  else if(a==="down"||a==="up")moveSel(a==="down"?1:-1,0);
  else if(a==="left"||a==="right")moveSel(0,a==="right"?1:-1);
  else if(a==="open"){const c=e.target&&e.target.closest?e.target.closest(".card"):null;if(c&&c.dataset.taskId)selectTask(c.dataset.taskId);if(paneId)openTask(paneId);}
  else if(a==="yes"||a==="no")keyAnswer(a);
  return true;
}
layoutText();

// ---------- harness runs + runtime ----------
function renderRuns(){
  const target=$("harnessRuns");target.replaceChildren();const runs=board.harnessRuns||[];
  $("runsCnt").textContent=String(runs.filter(r=>["running","queued"].includes(r.status)).length);
  if(!runs.length)target.append(h("p","note","No retained harness runs in this Pi session."));
  for(const run of runs){
    const item=h("div","run"),txt=h("div");txt.append(h("b",null,run.name+" \u00b7 "+run.status),h("div","rd",run.description||""));item.append(txt);
    if(["running","queued"].includes(run.status)){const p=h("button","btn warn","Pause run");p.type="button";p.dataset.stableKey="run-pause:"+run.id;p.onclick=()=>{if(confirm("Stop this harness run? Resume it explicitly in Pi when ready."))void action("pause-agent",run.id);};item.append(p);}
    target.append(item);
  }
}
function renderRuntime(){
  const target=$("runtime");target.replaceChildren();
  for(const t of board.tasks.filter(t=>!t.archived)){
    for(const w of Object.values(t.workers||{})){
      if(!w)continue;const s=t.workerStatus&&t.workerStatus.identity&&t.workerStatus.identity.id===w.id?t.workerStatus:null;
      const state=t.disposition?"idle":t.blocked||t.suspension||(s&&["waiting_dependency","stuck","error"].includes(s.state))?"blocked":t.column==="done"||(s&&s.state==="finished")?"completed":(s&&["working","thinking"].includes(s.state)&&t.lease)?"active":"idle";
      const pill=h("button","chip "+roleClass(w.role));pill.type="button";pill.dataset.state=state;pill.dataset.stableKey="status:"+t.id+":"+w.id;
      const dot=h("span","st"+(state==="active"?"":state==="blocked"?" wait":" idle"));dot.setAttribute("aria-hidden","true");
      const av=h("span","av",initial(w.name));av.setAttribute("aria-hidden","true");
      const label=t.disposition?"cancelled (not accepted)":s?s.state.replaceAll("_"," "):state;
      pill.append(av,document.createTextNode(w.name+" "),h("span","stt",label),dot);
      pill.title="Task "+w.role+" ("+w.definition+"): "+t.title+". Task: "+t.column+"; worker: "+((s&&s.state)||state)+". Worker runtime completion is separate from task acceptance. "+((s&&s.reason)||state);
      pill.setAttribute("aria-label",w.name+" / "+label+"; "+w.role+"; "+state+"; open "+t.title);
      pill.onclick=()=>{toggleRuns(false);openTask(t.id);};target.append(pill);
    }
  }
  if(!target.children.length)target.append(h("span","note","No created task agents"));
}
function toggleRuns(open){const p=$("runsPanel");p.hidden=open===undefined?!p.hidden:!open;$("runsBtn").setAttribute("aria-expanded",String(!p.hidden));}
$("runsBtn").onclick=e=>{e.stopPropagation();toggleRuns();};
document.addEventListener("click",e=>{if(!$("runsPanel").hidden&&!e.target.closest(".runs-wrap"))toggleRuns(false);if(!e.target.closest("#context"))closeContext();});

// ---------- modals ----------
const stack=[];
function isOpen(id){return $(id).classList.contains("open");}
function openModal(id,focus){if(isOpen(id))return;const s=$(id);stack.push({id,last:document.activeElement});s.classList.add("open");s.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";(focus||s.querySelector(".m-close")).focus();}
function closeModal(id){
  const s=$(id);if(!isOpen(id))return;s.classList.remove("open");s.setAttribute("aria-hidden","true");
  const i=stack.findIndex(x=>x.id===id),entry=i>=0?stack.splice(i,1)[0]:null;if(!stack.length)document.body.style.overflow="";
  if(id==="taskScrim"){selected=null;editKey=null;}
  if(id==="auditScrim")auditId=null;
  if(entry&&entry.last&&document.contains(entry.last))entry.last.focus({preventScroll:true});
  else if(id==="taskScrim"&&!stack.length)focusCard(lastTaskId);
}
for(const id of ["taskScrim","createScrim","auditScrim"]){let down=false;$(id).addEventListener("pointerdown",e=>{down=e.target===$(id);});$(id).addEventListener("click",e=>{if(down&&e.target===$(id))closeModal(id);down=false;});}
$("mClose").onclick=()=>closeModal("taskScrim");$("cClose").onclick=()=>closeModal("createScrim");$("auditClose").onclick=()=>closeModal("auditScrim");
function focusCard(id){const c=[...$("board").querySelectorAll(".card")].find(e=>e.dataset.taskId===id);if(c)c.focus({preventScroll:true});}
document.addEventListener("keydown",e=>{
  if(isOps()&&opsKeydown(e))return;
  if(e.key==="Escape"){
    if(!$("context").hidden){e.preventDefault();closeContext(true);return;}
    if(stack.length){e.preventDefault();closeModal(stack[stack.length-1].id);return;}
    if(!$("runsPanel").hidden){e.preventDefault();toggleRuns(false);$("runsBtn").focus();return;}
  }
  if(e.key==="Tab"&&stack.length){
    const m=$(stack[stack.length-1].id).querySelector(".modal");
    const f=[...m.querySelectorAll('button:not([tabindex="-1"]):not([disabled]),input,textarea,summary,a[href],[tabindex="0"]')].filter(x=>!x.closest("[hidden]")&&x.getClientRects().length);
    if(!f.length)return;const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    else if(!m.contains(document.activeElement)){e.preventDefault();first.focus();}
  }
  if(!stack.length&&e.key.toLowerCase()==="n"&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$("newTask").click();}
});

// ---------- tabs ----------
const TABS=["t-scope","t-conv","t-eval","t-evid","t-exec"];
function selectTab(id){for(const t of TABS){const on=t===id,tab=$(t);tab.setAttribute("aria-selected",String(on));tab.tabIndex=on?0:-1;$(tab.getAttribute("aria-controls")).hidden=!on;}}
document.querySelector(".tabs").addEventListener("click",e=>{const t=e.target.closest(".tab");if(t)selectTab(t.id);});
document.querySelector(".tabs").addEventListener("keydown",e=>{const i=TABS.indexOf(document.activeElement.id);if(i<0)return;let n;if(e.key==="ArrowRight")n=(i+1)%TABS.length;else if(e.key==="ArrowLeft")n=(i+TABS.length-1)%TABS.length;else if(e.key==="Home")n=0;else if(e.key==="End")n=TABS.length-1;else return;e.preventDefault();selectTab(TABS[n]);$(TABS[n]).focus();});

// ---------- task modal ----------
function openTask(id,keepTab){
  const t=task(id);if(!t)return;selected=id;lastTaskId=id;editVersion=t.updatedAt;editKey=null;
  refreshTask();
  if(!isOpen("taskScrim")){if(!keepTab)selectTab("t-scope");openModal("taskScrim",$("mClose"));}
}
function kvRow(dl,k,v){dl.append(h("dt",null,k));const dd=h("dd","pre");if(v instanceof Node)dd.append(v);else dd.textContent=v;dl.append(dd);}
function sec(title,content,cls){const s=h("div","sec"+(cls?" "+cls:""));s.append(h("h3",null,title),content);return s;}
function buildEdit(t){
  const target=$("scopeEdit");target.replaceChildren();
  if(!(t.column==="backlog"&&!t.archived))return;
  const grid=h("div","grid2");grid.style.marginBottom="14px";
  const field=(label,id,tag,value,cls,span)=>{const g=h("div","fgroup"+(span?" span2":""));const l=h("label","flabel",label);l.htmlFor=id;const f=h(tag,"field"+(cls?" "+cls:""));f.id=id;f.value=value;g.append(l,f);grid.append(g);return f;};
  field("Title","fTitle","input",t.title,"",true);
  field("Scope and acceptance criteria","fScope","textarea",t.scope,"",true);
  field("Operator agent","fAssignee","input",t.assignee);
  const rb=field("Weighted rubric (JSON; weights total 100)","fRubric","textarea",JSON.stringify(t.rubric,null,2),"mono");rb.style.minHeight="160px";
  const head=h("div","sec");head.append(h("h3",null,"Backlog edits"),h("p","note","This task is paused in backlog: edit, then Save. Release to ready to resume work."));
  target.append(head,grid);
}
function refreshTask(){
  const t=task(selected);if(!t)return;const editable=t.column==="backlog"&&!t.archived,st=status(t);
  const key=t.id+":"+editable;if(editKey!==key){buildEdit(t);editKey=key;}
  // header
  const ids=$("mIds");ids.replaceChildren(h("span","id","#"+short(t.id)),h("span",null,"rev "+t.revision),h("span",null,"\u00b7"),h("span",null,colName(t.column)),h("span",null,"\u00b7 phase "+t.phase));
  if(st)ids.append(h("span","badge b-"+st[0],st[1]));if(t.archived)ids.append(h("span","badge b-cancelled","archived"));
  if(t.proposal&&!t.proposal.approved)ids.append(h("span","badge b-queued","proposal / unassigned"));
  ids.title=t.id;setText($("mTitle"),t.title);
  const stats=$("mStats");stats.replaceChildren();
  const stat=(label,value,cls)=>{const d=h("div",null,label);const b=h("b",cls,value);d.append(b);stats.append(d);};
  for(const r of ROLES)stat(r[0].toUpperCase()+r.slice(1),shortName(t,r));
  const ev=t.evaluations||{};
  stat("Tester score",ev.tester?ev.tester.total.toFixed(1)+"%":"\u2014",ev.tester?"c-"+tone(ev.tester.total):"");
  stat("Reviewer score",ev.reviewer?ev.reviewer.total.toFixed(1)+"%":"\u2014",ev.reviewer?"c-"+tone(ev.reviewer.total):"");
  stat("Worker runs",t.runs+" / "+t.maxRuns);
  stat("PR policy",t.prMode+(t.prMode==="merge"?(t.mergeApproved?" / approved":" / awaiting you"):""));
  // approval
  const ap=$("mApproval");ap.replaceChildren();if(openApproval(t)){const p=h("section","panel approval");p.setAttribute("aria-label","Approval needed for "+t.title);const ph=h("div","panel-h");ph.append(h("h2",null,"Approval required"),h("span","meta",short(t.id)+" \u00b7 r"+t.revision));p.append(ph,approvalBody(t,"modal"));ap.append(p);}
  const alert=t.blocked||(t.queue&&t.queue.reason)||(t.disposition?"Cancelled (not accepted): "+t.disposition.reason:"")||(t.suspension?"Suspended until dependencies are Done: "+t.suspension.dependencyIds.map(short).join(", "):"")||(t.archived?"Archived. No future work will be dispatched. History and comments remain available.":"Comments steer a running worker and remain in the task for subsequent agents. Move to backlog before changing scope.");
  setText($("mAlert"),alert);$("mAlert").classList.toggle("bad",!!(t.blocked||t.disposition||t.suspension));
  // actions
  $("saveTask").disabled=!editable;$("readyTask").disabled=!editable;$("backlogTask").disabled=t.archived||t.column==="backlog";
  $("archiveTask").disabled=t.archived||t.column!=="done";$("approveMerge").hidden=t.prMode!=="merge"||t.mergeApproved||t.archived;
  // scope (read-only parts)
  const read=$("scopeRead");read.replaceChildren();
  if(!editable)read.append(sec("Scope",h("div","box pre",t.scope)));
  const dl=h("dl","kv");
  kvRow(dl,"Operator",t.assignee+" \u00b7 "+workerName(t,"operator"));kvRow(dl,"Tester",t.testerAgent+" \u00b7 "+workerName(t,"tester"));kvRow(dl,"Reviewer",t.reviewerAgent+" \u00b7 "+workerName(t,"reviewer"));
  kvRow(dl,"Gate","Recorded tests + tester, reviewer and orchestrator \u2265 85%");kvRow(dl,"PR policy",t.prMode+(t.prMode==="merge"?(t.mergeApproved?" / user approved":" / awaiting user approval"):""));
  if(t.pr){let v=h("span",null,"Pull request #"+t.pr.number+" (non-https link hidden)");if(/^https:\/\//.test(String(t.pr.url))){v=h("span","pr");const a=h("a",null,"Pull request #"+t.pr.number);a.href=t.pr.url;a.target="_blank";a.rel="noopener noreferrer";v.append(a);}kvRow(dl,"Pull request",v);}
  kvRow(dl,"Budget","Worker runs "+t.runs+" / "+t.maxRuns);
  if(t.lease)kvRow(dl,"Lease",t.lease.role+" \u00b7 "+((t.lease.identity&&t.lease.identity.name)||t.lease.owner));
  if(t.workerStatus)kvRow(dl,"Worker",t.workerStatus.identity.name+" \u00b7 "+t.workerStatus.state.replaceAll("_"," ")+": "+t.workerStatus.reason);
  if(t.queue)kvRow(dl,"Queue",t.queue.state+": "+t.queue.reason);
  const ab=h("div","box");ab.append(dl);read.append(sec("Assignment",ab));
  const rub=h("div","box"),ul=h("ul");for(const c of t.rubric||[]){const li=h("li");li.append(h("b",null,c.title)," ",h("span","mono",c.weight+"%"));li.lastChild.style.color="var(--muted)";ul.append(li);}rub.append(ul);read.append(sec("Acceptance rubric",rub));
  read.append(sec("Best practices",h("div","box pre",t.bestPractices||"None recorded.")));
  // conversation
  const comments=t.comments||[];setText($("nConv"),String(comments.length));
  const thread=$("thread"),ids2=new Set(comments.map(c=>c.id));for(const old of [...thread.children])if(!ids2.has(old.dataset.commentId))old.remove();
  for(const c of comments){
    let m=[...thread.children].find(e=>e.dataset.commentId===c.id);
    const name=(c.identity&&c.identity.name)||c.author,role=c.identity?c.identity.role:(ROLES.includes(c.author)?c.author:"");
    if(!m){
      m=h("div","msg "+(role?roleClass(role):"user"));m.dataset.commentId=c.id;const av=h("span","av",initial(name));av.setAttribute("aria-hidden","true");
      const bub=h("div","bub"),mh=h("div","mh");mh.append(h("b"),h("span","mono"),h("time"));mh.children[1].style.cssText="font-size:10px;color:var(--muted);text-transform:uppercase";
      const d=h("details");d.dataset.stableKey="comment:"+c.id;const s=h("summary",null,"Show full comment");const pre=h("pre","xpre");pre.tabIndex=0;d.append(s,pre);
      bub.append(mh,h("div","msg-text"),d);m.append(av,bub);thread.append(m);
    }
    const mh=m.querySelector(".mh");setText(mh.children[0],name);setText(mh.children[1],role);setText(mh.children[2],stamp(c.at));
    const summary=c.summary||String(c.text||"").split(/\r?\n/)[0]||"Comment",full=c.details!==undefined?c.details:c.text;
    setText(m.querySelector(".msg-text"),summary);const d=m.querySelector("details");d.hidden=!full||String(full).trim()===String(summary).trim();setText(d.querySelector("pre"),String(full||""));
  }
  if(!comments.length&&!thread.querySelector(".note"))thread.append(h("p","note","No comments yet. Comments steer a running worker and stay with the task."));
  if(comments.length)thread.querySelector(":scope > .note")?.remove();
  // evaluations
  renderEvaluations(t);
  // tests
  const tests=t.tests||[];setText($("nEvid"),String(tests.length));const evid=$("evid");evid.replaceChildren();
  if(!tests.length)evid.append(h("p","note","No certified test executions yet."));
  for(const x of tests){const term=h("div","term"),th=h("div","term-h");th.append(h("span",null,stamp(x.at)),h("span","mono cmd",x.command),h("span","ec ec"+(x.exitCode===0?0:1),"exit "+x.exitCode));const pre=h("pre",null,x.output);pre.tabIndex=0;pre.dataset.stableKey="test:"+x.at+x.command;term.append(th,pre);evid.append(term);}
  // execution
  const kv=$("execKv");kv.replaceChildren();
  kvRow(kv,"Task id",t.id);kvRow(kv,"Column",t.column+" / phase "+t.phase+" / revision "+t.revision);kvRow(kv,"Workspace",t.workspace||board.projectPath);
  kvRow(kv,"Created",stamp(t.createdAt));kvRow(kv,"Updated",stamp(t.updatedAt));kvRow(kv,"Budget","Worker runs "+t.runs+" / "+t.maxRuns+". Tester: "+workerName(t,"tester")+". Reviewer: "+workerName(t,"reviewer")+".");
  if(t.blocked)kvRow(kv,"Blocked",t.blocked);if(t.queue)kvRow(kv,"Queue",t.queue.state+": "+t.queue.reason);
  if(t.suspension)kvRow(kv,"Suspension","Waiting on "+t.suspension.dependencyIds.join(", "));
  if(t.disposition)kvRow(kv,"Disposition","Cancelled by "+t.disposition.actor+" ("+stamp(t.disposition.at)+"): "+t.disposition.reason+" \u2014 not accepted");
  if(t.proposal)kvRow(kv,"Proposal",(t.proposal.approved?"approved":"unassigned")+": "+t.proposal.reason+" \u2192 "+t.proposal.expectedResult);
  if(t.parentId)kvRow(kv,"Parent",t.parentId);if(t.links&&t.links.length)kvRow(kv,"Links",t.links.map(l=>l.type+" "+short(l.targetId)+(l.blocking?" (blocking)":"")).join(", "));
  setText($("execDetails"),JSON.stringify({id:t.id,revision:t.revision,workspace:t.workspace||board.projectPath,snapshot:t.snapshot,queue:t.queue,fingerprint:t.fingerprint,parentId:t.parentId,links:t.links,proposal:t.proposal,suspension:t.suspension,bestPractices:t.bestPractices,createdAt:t.createdAt,updatedAt:t.updatedAt,runs:t.runs,maxRuns:t.maxRuns,pr:t.pr,userPaused:t.userPaused,archived:t.archived},null,2));
  setText($("history"),JSON.stringify(t.history,null,2));
}
function meter(label,weight,val,desc,key){
  const v=Math.max(0,Math.min(100,Number(val)||0)),t=tone(v),id="tip-"+key;
  const m=h("div","meter m"+t),lbl=h("div","m-lbl",label);if(weight)lbl.append(" ",h("span","w",weight+"%"));
  const track=h("div","mtrack");track.tabIndex=0;track.dataset.stableKey="meter:"+key;
  for(const [k,x] of [["role","meter"],["aria-valuemin","0"],["aria-valuemax","100"],["aria-valuenow",String(v)],["aria-label",label+" "+v+"%"],["aria-describedby",id]])track.setAttribute(k,x);
  const fill=h("span","fill"),pass=h("span","pass"),knob=h("span","knob");fill.style.width=v+"%";knob.style.left=v+"%";pass.setAttribute("aria-hidden","true");track.append(fill,pass,knob);
  const tip=h("div","tip");tip.id=id;tip.setAttribute("role","tooltip");tip.append(h("div","pre",desc));
  if(weight){const c=h("div");c.style.marginTop="5px";c.append("Contributes ",h("b",null,(v*weight/100).toFixed(1))," of "+weight+" pts \u00b7 "+(v>=85?"above":"below")+" 85% marker");tip.append(c);}
  m.append(lbl,h("div","m-val",v.toFixed(v%1?1:0)+"%"),track,tip);return m;
}
function renderEvaluations(t){
  const ev=t.evaluations||{},roles=["tester","reviewer","orchestrator"],present=roles.filter(r=>ev[r]);
  setText($("nEval"),String(present.length));
  const gate=$("gate");gate.replaceChildren();
  for(const r of roles){const g=h("div","g"),e=ev[r];g.append(h("div","lbl",r+" \u00b7 "+(e?e.actor:shortName(t,r)))),g.append(h("div","v"+(e?" c-"+tone(e.total):""),e?e.total.toFixed(1)+"%":"pending"));if(!e)g.lastChild.style.color="var(--dim)";gate.append(g);}
  const all=roles.every(r=>ev[r]&&ev[r].total>=85),fail=present.some(r=>ev[r].total<85);
  const g=h("div","g");g.append(h("div","lbl","Gate"),h("div","v "+(all?"c-g":fail?"c-r":""),all?(t.tests&&t.tests.length?"PASS":"NO TESTS"):fail?"BLOCKED":"PENDING"));if(!all&&!fail)g.lastChild.style.color="var(--dim)";if(all&&!(t.tests&&t.tests.length))g.lastChild.className="v c-a";gate.append(g);
  const box=$("evals");box.replaceChildren();
  for(const r of present){
    const e=ev[r],tn=tone(e.total),card=h("div","evalcard "+roleClass(r)),head=h("div","eval-h"),av=h("span","av",initial(e.actor));av.setAttribute("aria-hidden","true");
    const who=h("div");who.append(h("b",null,e.actor));const sub=h("div","mono",r+" \u00b7 r"+e.revision);sub.style.cssText="font-size:10.5px;color:var(--muted);text-transform:uppercase";who.append(sub);
    const verdict=h("span","verdict c-"+tn,e.total>=85?"pass":e.total>=70?"revise":"fail");verdict.style.borderColor="currentColor";
    head.append(av,who,verdict,h("span","tot c-"+tn,e.total.toFixed(1)+"%"));card.append(head);
    card.append(meter("Overall",0,e.total,r+" overall weighted rubric score (as reported). Gate requires at least 85%.\n\n"+e.notes,r+":total"));
    (t.rubric||[]).forEach((c,i)=>{const own=e.criterionNotes&&e.criterionNotes[i];card.append(meter(c.title,c.weight,Number((e.scores||[])[i]??0),own||("No per-criterion note; overall evaluation:\n"+e.notes),r+":"+i));});
    const n=h("div","pre",e.notes);n.style.cssText="font-size:12.5px;color:var(--muted)";card.append(n);const at=h("div","mono",e.actor+" \u00b7 "+stamp(e.at));at.style.cssText="font-size:10.5px;color:var(--dim)";card.append(at);
    box.append(card);
  }
  if(!present.length)box.append(h("p","eval-pending","No evaluations recorded yet. Tester, reviewer and orchestrator scores appear here."));
}

// ---------- audit ----------
const timing=v=>typeof v==="number"&&Number.isFinite(v)&&v>=0?Math.round(v*100)/100+" ms":"Unknown (not recorded)";
function renderAudit(){
  const t=task(auditId);if(!t)return;setText($("auditTitle"),t.title);
  const target=$("auditContent");let intro=target.querySelector(".note");
  if(!intro){intro=h("p","note","Execution duration is not inferred from mutation time. Unknown means no timing was recorded.");target.prepend(intro);}
  const events=t.history.map((e,i)=>({e,key:"audit:"+t.id+":"+(e.id||i)})),keys=new Set(events.map(x=>x.key));
  const rows=new Map([...target.querySelectorAll(".audit-entry")].map(r=>[r.dataset.auditKey,r]));
  for(const [k,r] of rows)if(!keys.has(k))r.remove();
  let prev=intro;
  for(const {e,key} of events){
    let row=rows.get(key);
    if(!row){row=h("section","audit-entry");row.dataset.auditKey=key;const d=h("details"),s=h("summary",null,"Full event data"),pre=h("pre","xpre");d.dataset.stableKey=key;pre.tabIndex=0;d.append(s,pre);row.append(h("h3"),h("time"),h("p"),d);}
    setText(row.querySelector("h3"),((e.identity&&e.identity.name)||e.actor)+" / "+e.event);setText(row.querySelector("time"),stamp(e.at));
    setText(row.querySelector("p"),"Duration: "+timing(e.durationMs)+" \u2022 Delay: "+timing(e.delayMs)+" \u2022 Mutation: "+timing(e.mutationDurationMs));
    setText(row.querySelector("pre"),JSON.stringify(e,null,2));
    if(prev.nextElementSibling!==row)target.insertBefore(row,prev.nextElementSibling);prev=row;
  }
}
function openAudit(id){auditId=id;$("auditContent").replaceChildren();renderAudit();openModal("auditScrim");}

// ---------- context menu ----------
function closeContext(restore){
  if($("context").hidden)return;$("context").hidden=true;
  if(restore){const k=contextTrigger&&contextTrigger.dataset.stableKey,n=[...document.querySelectorAll("[data-stable-key]")].find(e=>e.dataset.stableKey===k);if(n)n.focus({preventScroll:true});else focusCard(contextId);}
}
function refreshContext(){if($("context").hidden)return;const t=task(contextId);if(!t||!contextTask||t.updatedAt!==contextTask.updatedAt||t.column!==contextTask.column||t.archived!==contextTask.archived){const restore=$("context").contains(document.activeElement);contextTask=null;closeContext(restore);}}
function showContext(id,x,y,trigger){
  const t=task(id),menu=$("context");contextId=id;contextTrigger=trigger;contextTask={updatedAt:t.updatedAt,column:t.column,archived:t.archived};
  $("ctxArchive").disabled=t.archived||t.column!=="done";$("ctxPause").disabled=!canPause(t);menu.hidden=false;
  menu.style.left=Math.max(8,Math.min(x,innerWidth-menu.offsetWidth-8))+"px";menu.style.top=Math.max(8,Math.min(y,innerHeight-menu.offsetHeight-8))+"px";$("ctxOpen").focus();
}
$("ctxOpen").onclick=()=>{closeContext();openTask(contextId);};
$("ctxAudit").onclick=()=>{closeContext();openAudit(contextId);};
$("ctxPause").onclick=async()=>{const t=task(contextId);if(!contextTask||!canPause(t)||t.updatedAt!==contextTask.updatedAt||t.column!==contextTask.column){closeContext(true);return;}await action("move",contextId,{column:"backlog"},contextTask.updatedAt);closeContext(true);};
$("ctxArchive").onclick=async()=>{const t=task(contextId);if(t&&t.column==="done"&&confirm("Archive this Done task?")){await action("archive",contextId);closeContext(true);}};
$("context").addEventListener("keydown",e=>{const b=[...$("context").querySelectorAll("button:not([disabled])")],i=b.indexOf(document.activeElement);if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();b[(i+(e.key==="ArrowDown"?1:b.length-1))%b.length].focus();}});

// ---------- header + task controls ----------
function applyTheme(){document.documentElement.dataset.theme=theme;$("themeIcon").textContent=theme==="night"?"\u263C":"\u263E";$("themeBtn").setAttribute("aria-label","Switch to "+(theme==="night"?"day":"night")+" theme");$("themeBtn").title=$("themeBtn").getAttribute("aria-label");}
applyTheme();$("themeBtn").onclick=()=>{theme=theme==="night"?"day":"night";try{localStorage.setItem("pi-kanban-theme",theme);}catch(e){}applyTheme();};
$("showArchived").onclick=()=>{showArchived=!showArchived;$("showArchived").setAttribute("aria-checked",String(showArchived));if(board){ensurePane();preserve($("board"),renderBoard);refreshOps();}};
$("newTask").onclick=()=>openModal("createScrim",$("newTitle"));
$("pauseAll").onclick=async()=>{if(confirm("Pause all pending tasks and stop current harness runs in this Pi session? Nothing resumes automatically.")&&await action("pause-all"))toast("All work paused","Pending tasks moved to backlog and harness runs stopped. Release tasks to ready to resume.","var(--amber)");};
$("archiveDone").onclick=async()=>{if(confirm("Archive all completed tasks? History remains available.")&&await action("archive-done"))toast("Archived","Completed tasks archived. Toggle Show archived to view.","var(--violet)");};
$("createForm").onsubmit=async e=>{e.preventDefault();if(await action("create",undefined,{task:{title:$("newTitle").value,scope:$("newScope").value,assignee:$("newAssignee").value,rubric:[{title:$("newCriterion").value,weight:100}],prMode:"none"}})){closeModal("createScrim");$("createForm").reset();toast("Task submitted","The orchestrator will prepare and release it.","var(--cyan)");}};
$("backlogTask").onclick=()=>void action("move",selected,{column:"backlog"});
$("readyTask").onclick=()=>void action("move",selected,{column:"ready"});
$("approveMerge").onclick=()=>{if(confirm("Allow the reviewer to merge this task PR after passing checks and rubric review?"))void action("approve-merge",selected);};
$("archiveTask").onclick=()=>{if(confirm("Archive this Done task? History and comments remain available."))void action("archive",selected);};
$("auditTask").onclick=()=>openAudit(selected);
$("saveTask").onclick=()=>{const t=task(selected);if(!t||!$("fTitle"))return;let rubric;try{rubric=JSON.parse($("fRubric").value);}catch(e){toast("Invalid rubric","Rubric must be valid JSON: "+e.message,"var(--red)");return;}void action("edit",selected,{task:{title:$("fTitle").value,scope:$("fScope").value,assignee:$("fAssignee").value,rubric,testerAgent:t.testerAgent,reviewerAgent:t.reviewerAgent,prMode:t.prMode}}).then(ok=>{if(ok)toast("Saved","Backlog edits saved.","var(--green)");});};
$("commentForm").onsubmit=async e=>{e.preventDefault();const value=$("comment").value;if(!value.trim())return;if(await action("comment",selected,{text:value})){$("comment").value="";toast("Comment posted","Visible to the task's crew.","var(--cyan)");}};
setInterval(()=>{if(board){renderKpis();preserve($("approvalPanel"),renderApproval);preserve($("pane"),renderPane);}},15000);

// ---------- live stream ----------
async function stream(){
  for(;;){
    try{
      const response=await fetch("/api/events",{headers:{Authorization:"Bearer "+token}});
      if(!response.ok)throw new Error("Authentication failed; reopen /crew kban");
      setLive("live","Live"+(latency!==null?" \u00b7 "+latency+"ms":""));notice("");
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer="";
      for(;;){const part=await reader.read();if(part.done)break;buffer+=decoder.decode(part.value,{stream:true});let end;while((end=buffer.indexOf("\n\n"))>=0){const ev=buffer.slice(0,end);buffer=buffer.slice(end+2);const data=ev.split("\n").filter(l=>l.startsWith("data: ")).map(l=>l.slice(6)).join("\n");if(data)update(JSON.parse(data));}}
    }catch(e){notice(e.message);}
    setLive("offline","Reconnecting");$("feedMeta").textContent="offline";$("conMeta").textContent="offline";await new Promise(r=>setTimeout(r,2000));
  }
}
if(!token){notice("Open this project board using /crew kban in Pi.");setLive("offline","Not connected");}
else api("/api/board").then(d=>{setLive("live","Live \u00b7 "+latency+"ms");update(d);}).then(stream).catch(e=>{notice(e.message);setLive("offline","Offline");});
});
})();`;
