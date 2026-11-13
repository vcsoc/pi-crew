import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_KANBAN_TEMPLATE, KANBAN_TEMPLATE_CSS, KANBAN_TEMPLATES, kanbanPreferencesPath, readKanbanTemplate, resolveKanbanTemplate, writeKanbanTemplate } from "../src/kanban/templates.js";
import { KANBAN_HTML, KANBAN_SCRIPT } from "../src/kanban/web.js";

const roots: string[] = [];
afterEach(() => { for (const r of roots.splice(0)) rmSync(r, { recursive: true, force: true }); });
const root = () => { const r = mkdtempSync(join(tmpdir(), "kanban-tpl-")); roots.push(r); return r; };

describe("Kanban board templates", () => {
  it("defaults to Mission Control and falls back on missing or corrupt preferences", () => {
    const r = root();
    expect(DEFAULT_KANBAN_TEMPLATE).toBe("mission-control");
    expect(readKanbanTemplate(r)).toBe("mission-control");
    writeFileSync(kanbanPreferencesPath(r), "{not json");
    expect(readKanbanTemplate(r)).toBe("mission-control");
    writeFileSync(kanbanPreferencesPath(r), JSON.stringify({ template: "../../evil" }));
    expect(readKanbanTemplate(r)).toBe("mission-control");
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
    expect(resolveKanbanTemplate("1")).toBe("mission-control");
    expect(resolveKanbanTemplate("5")).toBe("terminal");
    expect(resolveKanbanTemplate("Glass Aurora")).toBe("glass-aurora");
    expect(resolveKanbanTemplate("pipeline-list")).toBe("pipeline-list");
    expect(resolveKanbanTemplate("6")).toBeUndefined();
    expect(resolveKanbanTemplate("")).toBeUndefined();
  });
  it("ships day and night variants for every template and applies the template live", () => {
    for (const t of KANBAN_TEMPLATES) {
      expect(KANBAN_TEMPLATE_CSS).toContain(`:root[data-template=${t.id}][data-theme=night]{`);
      expect(KANBAN_TEMPLATE_CSS).toContain(`:root[data-template=${t.id}][data-theme=day]{`);
    }
    expect(KANBAN_HTML).toContain(KANBAN_TEMPLATE_CSS);
    expect(KANBAN_HTML).toContain('id="theme-toggle"');
    expect(KANBAN_SCRIPT).toContain("dataset.template=data.template");
  });
});
