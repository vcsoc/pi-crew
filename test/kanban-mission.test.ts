import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Script } from "node:vm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KanbanController } from "../src/kanban/controller.js";
import { type KanbanWebServer, startKanbanServer } from "../src/kanban/server.js";
import { KanbanStore } from "../src/kanban/store.js";
import { KANBAN_HTML, KANBAN_SCRIPT } from "../src/kanban/web.js";
import { MISSION_HTML, MISSION_SCRIPT, OPS_KEYMAP } from "../src/kanban/web-mission.js";

let root: string, controller: KanbanController, server: KanbanWebServer | undefined;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "pi-kanban-mission-")); const cwd = join(root, "project"); mkdirSync(cwd);
  const store = new KanbanStore(cwd, join(root, "state"));
  controller = new KanbanController(store, { spawn: () => { throw new Error("No model calls in page tests"); }, record: () => undefined, stop: vi.fn(), steer: vi.fn(), validAgent: () => true, notify: vi.fn() });
});
afterEach(async () => { await server?.close(); server = undefined; await controller.close(); rmSync(root, { recursive: true, force: true }); });
async function page(template?: string) {
  server = await startKanbanServer(controller, template ? { template: () => template } : {});
  const origin = new URL(server.url).origin;
  return { html: await (await fetch(origin + "/")).text(), script: await (await fetch(origin + "/app.js")).text() };
}

describe("Mission Control live board page", () => {
  it("is served by default (operations template) and for operations and mission-control", async () => {
    for (const template of [undefined, "operations", "mission-control"]) {
      const { html, script } = await page(template);
      expect(html).toBe(MISSION_HTML); expect(script).toBe(MISSION_SCRIPT);
      await server?.close(); server = undefined;
    }
  });
  it("serves the classic page for every other template", async () => {
    for (const template of ["calm-light", "glass-aurora", "pipeline-list", "terminal"]) {
      const { html, script } = await page(template);
      expect(html).toBe(KANBAN_HTML); expect(script).toBe(KANBAN_SCRIPT);
      await server?.close(); server = undefined;
    }
  });
  it("ships a parseable script with no inline scripts or inline event handlers", () => {
    expect(() => new Script(MISSION_SCRIPT)).not.toThrow();
    expect(MISSION_HTML).toContain('<script src="/app.js"></script>');
    expect(MISSION_HTML.match(/<script\b[^>]*>/g)).toEqual(['<script src="/app.js">']);
    expect(MISSION_HTML).not.toMatch(/\son[a-z]+\s*=/i);
    expect(MISSION_HTML).not.toContain("Design sample");
    expect(MISSION_HTML).not.toContain("static mockup");
  });
  it("renders data with textContent only and allows only https PR links", () => {
    expect(MISSION_SCRIPT).not.toContain("innerHTML");
    expect(MISSION_SCRIPT).not.toContain("insertAdjacentHTML");
    expect(MISSION_SCRIPT).toContain("/^https:\\/\\//.test(");
  });
  it("wires the same user actions as the classic board", () => {
    for (const action of ['"respond-approval"', '"comment"', '"move"', '"edit"', '"archive"', '"archive-done"', '"pause-all"', '"pause-agent"', '"approve-merge"', '"create"']) expect(MISSION_SCRIPT).toContain(action);
    expect(MISSION_SCRIPT).toContain("decision:d");
    expect(MISSION_SCRIPT).toContain("b.disabled=!!t.lease");
    expect(MISSION_SCRIPT).toContain("expectedUpdatedAt");
    expect(MISSION_SCRIPT).not.toContain('"cancel"');
  });
  it("persists the day/night theme and reloads into the classic page on template change", () => {
    expect(MISSION_SCRIPT).toContain('localStorage.getItem("pi-kanban-theme")');
    expect(MISSION_SCRIPT).toContain('localStorage.setItem("pi-kanban-theme",theme)');
    expect(MISSION_HTML).toContain('[data-theme="day"]{');
    expect(MISSION_SCRIPT).toContain('family(data.template)!=="mission"');
    expect(MISSION_SCRIPT).toContain('const family=t=>t==="mission-control"||t==="operations"?"mission":"classic"');
    expect(MISSION_SCRIPT).toContain("location.reload()");
    expect(KANBAN_SCRIPT).toContain('if(data.template==="mission-control"||data.template==="operations")');
  });
  it("exposes accessible tabs, dialog and score meters", () => {
    expect(MISSION_HTML).toContain('role="tablist"');
    expect(MISSION_HTML).toContain('aria-modal="true"');
    expect(MISSION_SCRIPT).toContain('"aria-valuenow"');
    expect(MISSION_SCRIPT).toContain('e.key==="Escape"');
    expect(MISSION_SCRIPT).toContain("criterionNotes");
  });

  it("wires the Operations layout attribute from the snapshot template without reloading inside the page family", () => {
    expect(MISSION_HTML).toContain('<html lang="en" data-template="operations" data-layout="operations">');
    expect(MISSION_SCRIPT).toContain('localStorage.getItem("pi-kanban-layout")==="mission-control"?"mission-control":"operations"');
    expect(MISSION_SCRIPT).toContain("if(data.template)setLayout(data.template);");
    expect(MISSION_SCRIPT).toContain('root=document.documentElement,next=tpl==="mission-control"?"mission-control":"operations"');
    expect(MISSION_SCRIPT).toContain("root.dataset.layout=next");
    // Mission Control keeps its sidebar; Operations swaps it for the pane, console and status bar.
    expect(MISSION_HTML).toContain(".pane,.console,.statusbar{display:none}");
    expect(MISSION_HTML).toContain(':root[data-layout="operations"] aside.side{display:none}');
    for (const id of ['id="pane"', 'id="conLog"', 'id="statusbar"', 'id="mode">NORMAL<', 'id="posTxt"', 'id="palScrim"', 'id="approvalPanel"', 'id="feed"']) expect(MISSION_HTML).toContain(id);
    for (const hint of ["<kbd>j</kbd>/<kbd>k</kbd> move", "<kbd>h</kbd>/<kbd>l</kbd> lane", "<kbd>enter</kbd> open", "<kbd>y</kbd>/<kbd>n</kbd> approve", "<kbd>/</kbd> commands", "<kbd>esc</kbd> close"]) expect(MISSION_HTML).toContain(hint);
    expect(MISSION_SCRIPT).toContain("if(isOps()&&opsKeydown(e))return;");
    expect(MISSION_SCRIPT).toContain(OPS_KEYMAP);
  });
  it("Operations key map ignores inputs and open dialogs except Esc, and maps the documented keys", () => {
    const opsKey = new Function(`${OPS_KEYMAP};return opsKey;`)() as (e: object, s: object) => string;
    const closed = { palette: false, dialog: false };
    const key = (k: string, target: object = { tagName: "BODY" }, mods: object = {}) => ({ key: k, target, ...mods });
    expect(["j", "k", "h", "l", "y", "n", "/"].map(k => opsKey(key(k), closed))).toEqual(["down", "up", "left", "right", "yes", "no", "palette"]);
    expect(opsKey(key("k", { tagName: "BODY" }, { ctrlKey: true }), closed)).toBe("palette");
    expect(opsKey(key("K", { tagName: "BODY" }, { metaKey: true }), closed)).toBe("palette");
    expect(opsKey(key("Enter", { tagName: "BUTTON", classList: { contains: (c: string) => c === "card" } }), closed)).toBe("open");
    expect(opsKey(key("Enter", { tagName: "BUTTON", classList: { contains: () => false } }), closed)).toBe("");
    expect(opsKey(key("Enter"), closed)).toBe("open");
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT", "input"]) for (const k of ["j", "y", "n", "/", "Enter"]) expect(opsKey(key(k, { tagName }), closed)).toBe("");
    expect(opsKey(key("y", { tagName: "DIV", isContentEditable: true }), closed)).toBe("");
    expect(opsKey(key("k", { tagName: "TEXTAREA" }, { ctrlKey: true }), closed)).toBe("");
    for (const k of ["j", "y", "n", "/", "Enter"]) expect(opsKey(key(k), { palette: false, dialog: true })).toBe("");
    expect(opsKey(key("y", { tagName: "BODY" }, { altKey: true }), closed)).toBe("");
    expect(opsKey(key("N"), closed)).toBe("");
    // Esc is left to the shared handler that closes the context menu or modal; the palette closes itself.
    expect(opsKey(key("Escape"), closed)).toBe("");
    expect(opsKey(key("Escape", { tagName: "INPUT" }), { palette: true, dialog: false })).toBe("palette-close");
    expect(opsKey(key("y", { tagName: "INPUT" }), { palette: true, dialog: false })).toBe("");
    expect(opsKey(key("ArrowDown", { tagName: "INPUT" }), { palette: true, dialog: false })).toBe("palette-next");
    expect(opsKey(key("Enter", { tagName: "INPUT" }), { palette: true, dialog: false })).toBe("palette-run");
  });
  it("answers approvals with y/n through respond-approval only when the buttons would be enabled", () => {
    expect(MISSION_SCRIPT).toContain("const canAnswer=t=>openApproval(t)&&!t.lease;");
    expect(MISSION_SCRIPT).toContain('else if(a==="yes"||a==="no")keyAnswer(a);');
    const keyAnswer = MISSION_SCRIPT.slice(MISSION_SCRIPT.indexOf("function keyAnswer("), MISSION_SCRIPT.indexOf("const CMDS="));
    expect(keyAnswer).toContain("if(!canAnswer(t)){");
    expect(keyAnswer).toContain("void answer(t,d);");
    const answer = MISSION_SCRIPT.slice(MISSION_SCRIPT.indexOf("async function answer("), MISSION_SCRIPT.indexOf("function renderApproval("));
    expect(answer).toContain('action("respond-approval",t.id,{decision:d})');
    expect(answer).toContain('toast(d==="yes"?"Approved":"Declined"');
    expect(MISSION_SCRIPT).toContain("b.disabled=!canAnswer(t)");
    expect(MISSION_SCRIPT).toContain('[["yes","[y] Yes"],["no","[n] No"]]');
  });
  it("offers the Operations command palette commands", () => {
    for (const cmd of ['"New task"', '"Pause all"', '"Archive done"', '"Toggle archived"', '"Toggle theme"']) expect(MISSION_SCRIPT).toContain(cmd);
    expect(MISSION_SCRIPT).toContain('["board","Pause all",()=>$("pauseAll").click()]');
    expect(MISSION_SCRIPT).toContain('confirm("Pause all pending tasks');
  });
});
