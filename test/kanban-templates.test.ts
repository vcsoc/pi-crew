import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_KANBAN_TEMPLATE, isMissionPageTemplate, KANBAN_TEMPLATE_CSS, KANBAN_TEMPLATES, kanbanPreferencesPath, MISSION_PAGE_TEMPLATES, readKanbanTemplate, resolveKanbanTemplate, writeKanbanTemplate } from "../src/kanban/templates.js";
import { KANBAN_HTML, KANBAN_SCRIPT } from "../src/kanban/web.js";
import { MISSION_HTML, MISSION_SCRIPT } from "../src/kanban/web-mission.js";

const roots: string[] = [];
afterEach(() => { for (const r of roots.splice(0)) rmSync(r, { recursive: true, force: true }); });
const root = () => { const r = mkdtempSync(join(tmpdir(), "kanban-tpl-")); roots.push(r); return r; };

describe("Kanban board templates", () => {
  it("defaults to Operations and falls back on missing or corrupt preferences", () => {
    const r = root();
    expect(DEFAULT_KANBAN_TEMPLATE).toBe("operations");
    expect(readKanbanTemplate(r)).toBe("operations");
    writeFileSync(kanbanPreferencesPath(r), "{not json");
    expect(readKanbanTemplate(r)).toBe("operations");
    writeFileSync(kanbanPreferencesPath(r), JSON.stringify({ template: "../../evil" }));
    expect(readKanbanTemplate(r)).toBe("operations");
  });
  it("keeps a saved mission-control preference working", () => {
    const r = root();
    writeFileSync(kanbanPreferencesPath(r), JSON.stringify({ template: "mission-control" }, null, 2));
    expect(readKanbanTemplate(r)).toBe("mission-control");
    expect(isMissionPageTemplate("mission-control")).toBe(true);
  });
  it("lists six templates with Operations first as the default", () => {
    expect(KANBAN_TEMPLATES.map(t => t.id)).toEqual(["operations", "mission-control", "calm-light", "glass-aurora", "pipeline-list", "terminal"]);
    expect(KANBAN_TEMPLATES.map(t => t.name)).toEqual(["Operations", "Mission Control", "Calm Light", "Glass Aurora", "Pipeline List", "Terminal Pro"]);
    expect(KANBAN_TEMPLATES[0].description).toContain("(default)");
    expect(KANBAN_TEMPLATES.filter(t => t.description.includes("(default)")).map(t => t.id)).toEqual(["operations"]);
    expect([...MISSION_PAGE_TEMPLATES]).toEqual(["operations", "mission-control"]);
  });
  it("persists a selected template and rejects unknown ids", () => {
    const r = root();
    writeKanbanTemplate(r, "terminal");
    expect(readKanbanTemplate(r)).toBe("terminal");
    expect(JSON.parse(readFileSync(kanbanPreferencesPath(r), "utf8"))).toEqual({ template: "terminal" });
    expect(() => writeKanbanTemplate(r, "nope" as never)).toThrow(/Unknown/);
  });
  it("wires /crew kban template to a selectable list and persists the choice", () => {
    const source = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
    expect(source).toContain("/^kban\\s+template\\b/");
    expect(source).toContain('ctx.ui.select("Kanban board template');
    expect(source).toContain("writeKanbanTemplate(kanbanRoot, chosen)");
  });
  it("resolves list numbers, ids and names", () => {
    expect(resolveKanbanTemplate("1")).toBe("operations");
    expect(resolveKanbanTemplate("2")).toBe("mission-control");
    expect(resolveKanbanTemplate("6")).toBe("terminal");
    expect(resolveKanbanTemplate("Operations")).toBe("operations");
    expect(resolveKanbanTemplate("mission control")).toBe("mission-control");
    expect(resolveKanbanTemplate("Glass Aurora")).toBe("glass-aurora");
    expect(resolveKanbanTemplate("pipeline-list")).toBe("pipeline-list");
    expect(resolveKanbanTemplate("7")).toBeUndefined();
    expect(resolveKanbanTemplate("0")).toBeUndefined();
    expect(resolveKanbanTemplate("")).toBeUndefined();
  });
  it("ships day and night variants for every template and applies the template live", () => {
    // Classic-page templates carry their own day/night skins.
    for (const t of KANBAN_TEMPLATES.filter(t => !isMissionPageTemplate(t.id))) {
      expect(KANBAN_TEMPLATE_CSS).toContain(`:root[data-template=${t.id}][data-theme=night]{`);
      expect(KANBAN_TEMPLATE_CSS).toContain(`:root[data-template=${t.id}][data-theme=day]{`);
    }
    expect(KANBAN_HTML).toContain(KANBAN_TEMPLATE_CSS);
    expect(KANBAN_HTML).toContain('id="theme-toggle"');
    expect(KANBAN_SCRIPT).toContain("dataset.template=data.template");
    // Operations and Mission Control share the mission page: night is the :root palette, day overrides it, and the
    // Operations layout is styled through variables so it follows both themes.
    expect(KANBAN_TEMPLATES.filter(t => isMissionPageTemplate(t.id)).map(t => t.id)).toEqual(["operations", "mission-control"]);
    expect(MISSION_HTML).toMatch(/:root\{\s*--bg:#060a14/);
    expect(MISSION_HTML).toContain('[data-theme="day"]{\n  --bg:#eef2f8');
    expect(MISSION_HTML).toContain('[data-theme="day"]{color-scheme:light}');
    expect(MISSION_HTML).toContain(':root[data-layout="operations"] .pane{display:block}');
    expect(MISSION_HTML).toContain('[data-theme="day"] .statusbar .mode{color:#fff}');
    const opsCss = MISSION_HTML.slice(MISSION_HTML.indexOf("/* Operations layout"), MISSION_HTML.indexOf("</style>"));
    expect(opsCss).not.toMatch(/background:#[0-9a-f]{3,6}[;}]/i);
    expect(MISSION_SCRIPT).toContain("root.dataset.template=tpl;root.dataset.layout=next");
  });
});
