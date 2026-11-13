# Kanban redesign sample brief (shared by all 5 mockups)

Static, self-contained HTML mockup (one file, inline CSS + vanilla JS, no external fonts/CDNs/images). Must look polished at 1440x900 and remain usable at 390px wide.

Product: "Pi Crew" Kanban board for one project ("test1"). AI worker agents (operator implements, tester tests, reviewer reviews, orchestrator accepts) move tasks through: Backlog, Ready, In progress, Review, Done. Completion needs tester, reviewer and orchestrator rubric scores >= 85%.

Must show, with realistic sample data:
1. Header: project name, live connection indicator, buttons: New task, Pause all, Archive done, Show archived toggle, theme toggle.
2. All five columns with counts; 6-8 tasks total across columns, short IDs (e.g. 04028acf), revision, assigned worker name + role (Fern/operator, Uma/tester, Wade/reviewer), status badges (working, waiting user, blocked, cancelled).
3. A task needing user approval: question "Add the sentence 'Changes to this README require owner approval.' after the project-contract link in README.md?" with a green "Yes" and red "No" button and "Fern needs your approval". Clicking either shows a confirmation toast and removes the prompt (mock only).
4. Rubric scores shown as color-coded slider/meter bars (green >=85, amber 70-84, red <70) with score values and an 85% pass marker; hovering/focusing each shows a tooltip with the criterion explanation and points contributed. Show tester 87.8% (95/88/72) and reviewer 76% (90/60/80) for rubric: Correct README placement 40%, Approval honoured 35%, Clear wording 25%.
5. Live activity feed (timestamps, actor, event).
6. Task detail view (drawer, modal or panel) reachable by clicking a card, showing scope, conversation/comments, evaluations with sliders, test evidence (command + exit code).

Accessibility: semantic buttons, visible focus, aria labels, sufficient contrast. Label the page as "Design sample N - <name> (static mockup, not live data)".
