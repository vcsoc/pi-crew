import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Selectable visual templates for the Kanban web board. Each supports day and night themes. */
export const KANBAN_TEMPLATES = [
  { id: "operations", name: "Operations", description: "Mission Control board with a task detail pane and terminal activity console (default)" },
  { id: "mission-control", name: "Mission Control", description: "Dense operations dashboard: KPI strip, neon status accents, monospace numerals" },
  { id: "calm-light", name: "Calm Light", description: "Minimal and airy: soft surfaces, one indigo accent, rounded cards" },
  { id: "glass-aurora", name: "Glass Aurora", description: "Frosted glass cards over a soft aurora gradient" },
  { id: "pipeline-list", name: "Pipeline List", description: "Stacked stage lanes read top-to-bottom like a prioritised list, teal accent" },
  { id: "terminal", name: "Terminal Pro", description: "Keyboard-first terminal look: monospace, phosphor green/amber, square borders" },
] as const;
export type KanbanTemplateId = (typeof KANBAN_TEMPLATES)[number]["id"];
export const DEFAULT_KANBAN_TEMPLATE: KanbanTemplateId = "operations";
/** Templates rendered by the Mission Control page (web-mission.ts); they differ only by its data-layout attribute. */
export const MISSION_PAGE_TEMPLATES: readonly string[] = ["operations", "mission-control"];
export const isMissionPageTemplate = (template: string) => MISSION_PAGE_TEMPLATES.includes(template);

export function isKanbanTemplate(value: unknown): value is KanbanTemplateId {
  return typeof value === "string" && KANBAN_TEMPLATES.some(t => t.id === value);
}
/** Resolve "2", "mission-control" or "Mission Control" to a template id (numbers follow KANBAN_TEMPLATES order). */
export function resolveKanbanTemplate(input: string): KanbanTemplateId | undefined {
  const value = input.trim().toLowerCase();
  if (!value) return undefined;
  const index = Number(value);
  if (Number.isInteger(index) && index >= 1 && index <= KANBAN_TEMPLATES.length) return KANBAN_TEMPLATES[index - 1]!.id;
  return KANBAN_TEMPLATES.find(t => t.id === value || t.name.toLowerCase() === value)?.id;
}

/** Global (all projects) board preference, stored beside Kanban state. Missing/corrupt files fall back to the default. */
export function kanbanPreferencesPath(kanbanRoot: string) { return join(kanbanRoot, "ui.json"); }
export function readKanbanTemplate(kanbanRoot: string): KanbanTemplateId {
  try {
    const value = (JSON.parse(readFileSync(kanbanPreferencesPath(kanbanRoot), "utf8")) as { template?: unknown }).template;
    return isKanbanTemplate(value) ? value : DEFAULT_KANBAN_TEMPLATE;
  } catch { return DEFAULT_KANBAN_TEMPLATE; }
}
export function writeKanbanTemplate(kanbanRoot: string, template: KanbanTemplateId) {
  if (!isKanbanTemplate(template)) throw new Error(`Unknown Kanban template: ${template}`);
  const file = kanbanPreferencesPath(kanbanRoot), temp = `${file}.${process.pid}.tmp`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(temp, `${JSON.stringify({ template }, null, 2)}\n`, { mode: 0o600 });
  renameSync(temp, file);
}

const t = (id: string) => `:root[data-template=${id}]`;
const night = (id: string) => `:root[data-template=${id}][data-theme=night]`;
const day = (id: string) => `:root[data-template=${id}][data-theme=day]`;

/** Classic-page skins layered over the base board CSS (Operations and Mission Control are styled in web-mission.ts). Variables drive both themes; rules add each template's character. */
export const KANBAN_TEMPLATE_CSS = [
  // Shared: KPI strip (only Mission Control and Terminal show it) and per-column accent colours.
  `.kpis{display:none}${t("mission-control")} .kpis,${t("terminal")} .kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:0 20px 10px;border:1px solid var(--line);border-radius:10px;overflow:hidden;flex:none}.kpi{padding:10px 16px;border-right:1px solid var(--line);background:var(--card)}.kpi:last-child{border-right:0}.kpi .label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}.kpi .value{font-size:26px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.3}.kpi .sub{font-size:11px;color:var(--muted)}.kpi[data-tone=cyan] .value{color:var(--k-cyan)}.kpi[data-tone=amber] .value{color:var(--k-amber)}.kpi[data-tone=violet] .value{color:var(--k-violet)}.kpi[data-tone=green] .value{color:var(--k-green)}@media(max-width:650px){${t("mission-control")} .kpis,${t("terminal")} .kpis{grid-template-columns:repeat(2,1fr)}}`,

  // Mission Control skin for the classic page (only reached if a stale classic page renders before reloading)
  `${night("mission-control")}{color-scheme:dark;--paper:#070d1a;--ink:#e2e8f0;--muted:#8a9ab5;--line:#1f2b45;--accent:#fbbf24;--leaf:#22d3ee;--card:#0d1527;--blue:#38bdf8;--k-cyan:#22d3ee;--k-amber:#fbbf24;--k-violet:#a78bfa;--k-green:#34d399}
${day("mission-control")}{color-scheme:light;--paper:#eef2f8;--ink:#0b1324;--muted:#4b5a73;--line:#c9d3e3;--accent:#b45309;--leaf:#0891b2;--card:#ffffff;--blue:#0369a1;--k-cyan:#0891b2;--k-amber:#b45309;--k-violet:#6d28d9;--k-green:#047857}
${t("mission-control")} body{background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/32px 32px,var(--paper);background-blend-mode:normal}
${night("mission-control")} body{background:linear-gradient(#ffffff06 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,#ffffff06 1px,transparent 1px) 0 0/32px 32px,var(--paper)}
${day("mission-control")} body{background:linear-gradient(#0b132408 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,#0b132408 1px,transparent 1px) 0 0/32px 32px,var(--paper)}
${t("mission-control")} header{background:color-mix(in srgb,var(--paper) 88%,transparent);border-bottom:1px solid var(--line)}
${t("mission-control")} .column{background:var(--card);border:1px solid var(--line);border-top:3px solid var(--line);border-radius:10px}
${t("mission-control")} .column[data-column=backlog]{border-top-color:#64748b}${t("mission-control")} .column[data-column=ready]{border-top-color:var(--k-violet)}${t("mission-control")} .column[data-column="in progress"]{border-top-color:var(--k-cyan)}${t("mission-control")} .column[data-column=review]{border-top-color:var(--k-amber)}${t("mission-control")} .column[data-column=done]{border-top-color:var(--k-green)}
${t("mission-control")} .column-head{background:var(--card);letter-spacing:2px;font-weight:700}
${t("mission-control")} .card{background:color-mix(in srgb,var(--card) 70%,var(--paper));border:1px solid var(--line);border-left:3px solid var(--k-cyan);border-radius:8px;box-shadow:none}
${t("mission-control")} .card:hover{border-color:var(--k-cyan);box-shadow:0 0 0 1px var(--k-cyan),0 0 18px color-mix(in srgb,var(--k-cyan) 25%,transparent)}
${t("mission-control")} .card h3{letter-spacing:0;font-size:14px}
${t("mission-control")} .badge{border-radius:4px;text-transform:uppercase;letter-spacing:1px}
${t("mission-control")} .badge.blocked{color:#f87171;border-color:#f87171}
${t("mission-control")} button.primary,${t("mission-control")} .live{background:var(--k-cyan);color:#04111d;border-color:var(--k-cyan)}
${t("mission-control")} .activity-item{border:1px solid var(--line);border-radius:8px;background:var(--card)}`,

  // Calm Light
  `${day("calm-light")}{color-scheme:light;--paper:#f6f7f9;--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--accent:#dc2626;--leaf:#4f46e5;--card:#ffffff;--blue:#4f46e5}
${night("calm-light")}{color-scheme:dark;--paper:#0f1115;--ink:#e5e7eb;--muted:#9ca3af;--line:#262a33;--accent:#f87171;--leaf:#818cf8;--card:#171a21;--blue:#a5b4fc}
${t("calm-light")} body,${t("calm-light")} button,${t("calm-light")} input,${t("calm-light")} textarea,${t("calm-light")} select,${t("calm-light")} .card h3,${t("calm-light")} h1,${t("calm-light")} h2,${t("calm-light")} .column-head,${t("calm-light")} .eyebrow{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:0}
${t("calm-light")} body{background:var(--paper);font-size:14px}
${t("calm-light")} header{background:var(--card);border-bottom:1px solid var(--line)}
${t("calm-light")} .column{background:color-mix(in srgb,var(--paper) 60%,var(--line));border:0;border-radius:14px}
${t("calm-light")} .column-head{background:transparent;text-transform:none;font-weight:600;font-size:14px;letter-spacing:0}
${t("calm-light")} .card{border:1px solid var(--line);border-radius:10px;box-shadow:0 1px 2px #0000000d,0 2px 8px #0000000a}
${t("calm-light")} .card:hover{box-shadow:0 4px 16px #4f46e522;border-color:var(--leaf)}
${t("calm-light")} .card h3{font-weight:600;font-size:15px;text-transform:none}
${t("calm-light")} button{border-radius:8px}${t("calm-light")} button.primary,${t("calm-light")} .live{background:var(--leaf);color:#fff;border-color:var(--leaf)}
${t("calm-light")} .badge{border-radius:999px;padding:2px 8px}
${t("calm-light")} .activity-item{border-radius:10px;border:1px solid var(--line);background:var(--card)}`,

  // Glass Aurora
  `${night("glass-aurora")}{color-scheme:dark;--paper:#120b2a;--ink:#f8fafc;--muted:#c7c2e6;--line:#ffffff26;--accent:#fb7185;--leaf:#c084fc;--card:#ffffff14;--blue:#67e8f9}
${day("glass-aurora")}{color-scheme:light;--paper:#f3efff;--ink:#1e1537;--muted:#5b5280;--line:#1e153726;--accent:#be123c;--leaf:#7c3aed;--card:#ffffffa6;--blue:#0e7490}
${t("glass-aurora")} body{background:radial-gradient(60% 50% at 15% 10%,#7c3aed66,transparent 70%),radial-gradient(50% 45% at 85% 20%,#14b8a655,transparent 70%),radial-gradient(55% 50% at 60% 95%,#ec489955,transparent 70%),var(--paper);background-size:140% 140%;animation:aurora 24s ease-in-out infinite alternate}
@keyframes aurora{from{background-position:0% 0%}to{background-position:100% 100%}}@media(prefers-reduced-motion:reduce){${t("glass-aurora")} body{animation:none}}
${t("glass-aurora")} body,${t("glass-aurora")} button,${t("glass-aurora")} .card h3,${t("glass-aurora")} h1,${t("glass-aurora")} .column-head{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;letter-spacing:0}
${t("glass-aurora")} header,${t("glass-aurora")} .column,${t("glass-aurora")} .card,${t("glass-aurora")} .activity-item,${t("glass-aurora")} dialog{background:var(--card);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border:1px solid var(--line)}
${t("glass-aurora")} header{margin:12px 16px 8px;border-radius:20px}
${t("glass-aurora")} .column{border-radius:22px}${t("glass-aurora")} .column-head{background:transparent}
${t("glass-aurora")} .card{border-radius:16px;box-shadow:0 8px 30px #0000002e}
${t("glass-aurora")} .card:hover{border-color:var(--leaf);transform:translateY(-1px)}
${t("glass-aurora")} button{border-radius:999px;background:var(--card);border-color:var(--line);color:var(--ink)}
${t("glass-aurora")} button.primary,${t("glass-aurora")} .live{background:linear-gradient(90deg,#a855f7,#ec4899);color:#fff;border:0}
${t("glass-aurora")} .badge{border-radius:999px;background:#ffffff1a}
${t("glass-aurora")} .activity-item{border-radius:14px}`,

  // Pipeline List: stages stack vertically as full-width lanes; cards flow horizontally inside each lane.
  `${day("pipeline-list")}{color-scheme:light;--paper:#f1f3f5;--ink:#0f172a;--muted:#64748b;--line:#dde3ea;--accent:#b91c1c;--leaf:#0f766e;--card:#ffffff;--blue:#0f766e}
${night("pipeline-list")}{color-scheme:dark;--paper:#0b1416;--ink:#e2f1ef;--muted:#8fb3ae;--line:#1f3335;--accent:#f87171;--leaf:#2dd4bf;--card:#11201f;--blue:#5eead4}
${t("pipeline-list")} body,${t("pipeline-list")} button,${t("pipeline-list")} .card h3,${t("pipeline-list")} h1,${t("pipeline-list")} .column-head{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;letter-spacing:0}
${t("pipeline-list")} .board{grid-template-columns:1fr!important;grid-auto-rows:max-content;overflow:auto;align-items:start}
${t("pipeline-list")} .column{min-height:0;overflow:visible;background:var(--card);border:1px solid var(--line);border-left:4px solid var(--leaf);border-radius:10px;display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}
${t("pipeline-list")} .column-head{position:static;flex:0 0 100%;background:transparent;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;color:var(--muted)}
${t("pipeline-list")} .column[data-column=done]{border-left-color:#16a34a}${t("pipeline-list")} .column[data-column=review]{border-left-color:#d97706}${t("pipeline-list")} .column[data-column=backlog]{border-left-color:#94a3b8}
${t("pipeline-list")} .card-row,${t("pipeline-list")} .approval{flex:1 1 300px;max-width:520px}
${t("pipeline-list")} .card{margin:0;border-radius:8px;border:1px solid var(--line);box-shadow:none}
${t("pipeline-list")} .card:hover{border-color:var(--leaf)}
${t("pipeline-list")} .empty{flex:1 1 100%;padding:4px}
${t("pipeline-list")} button.primary,${t("pipeline-list")} .live{background:var(--leaf);color:#fff;border-color:var(--leaf)}`,

  // Terminal Pro
  `${night("terminal")}{color-scheme:dark;--paper:#050805;--ink:#c8f7c5;--muted:#6fa86b;--line:#1f3d1d;--accent:#ffb000;--leaf:#39ff14;--card:#0a120a;--blue:#ffb000;--k-cyan:#39ff14;--k-amber:#ffb000;--k-violet:#7dd3fc;--k-green:#39ff14}
${day("terminal")}{color-scheme:light;--paper:#f4f1e6;--ink:#1a2a12;--muted:#55693f;--line:#a9b48e;--accent:#9a5b00;--leaf:#1f7a12;--card:#fbf9f0;--blue:#9a5b00;--k-cyan:#1f7a12;--k-amber:#9a5b00;--k-violet:#1d4ed8;--k-green:#1f7a12}
${t("terminal")} *{border-radius:0!important}
${t("terminal")} body{background:var(--paper);text-shadow:0 0 1px color-mix(in srgb,var(--ink) 30%,transparent)}
${t("terminal")} header{border-bottom:1px dashed var(--line);background:var(--paper)}
${t("terminal")} .column{background:transparent;border:1px solid var(--line);border-top:2px solid var(--leaf)}
${t("terminal")} .column-head{background:var(--paper);color:var(--leaf);letter-spacing:2px}
${t("terminal")} .card{background:var(--card);border:1px solid var(--line);box-shadow:none}
${t("terminal")} .card:hover,${t("terminal")} .card:focus{border-color:var(--leaf);outline:1px solid var(--leaf)}
${t("terminal")} .card h3{text-transform:none;font-size:14px}
${t("terminal")} .card h3::before{content:"> ";color:var(--leaf)}
${t("terminal")} button{background:transparent;border:1px solid var(--line);color:var(--ink)}
${t("terminal")} button:hover{border-color:var(--leaf);color:var(--leaf)}
${t("terminal")} button.primary,${t("terminal")} .live{background:transparent;color:var(--leaf);border:1px solid var(--leaf)}
${t("terminal")} .approval{background:var(--card)!important;color:var(--ink)!important;border:1px dashed var(--accent)!important}
${t("terminal")} .approval p{color:var(--ink)}
${t("terminal")} .activity-item{border-left:2px solid var(--line);background:transparent}`,
].join("\n");
