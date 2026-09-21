# 📋 Master Development Plan: Fathom AI Web App Clone

## 🎯 Project Goal
Build and deploy a public, interactive web clone of **Fathom AI (`fathom.video`)** within a 24-hour window. The application will be a pure Web App—faking/stubbing the live meeting recorder bot while delivering a rich, fully populated call management, summary, and video playback workspace.

---

## 🛠️ Architecture & Tech Stack

* **Framework:** Next.js 14+ (App Router) + TypeScript
* **Styling & UI:** Tailwind CSS + `shadcn/ui` + Lucide Icons
* **State Management:** React Context / Zustand (for meeting lists, template toggling, search, and sharing)
* **Hosting / Deployment:** Vercel (Free tier, zero deployment cost, immediate SSL public URL)
* **Agent Logging:** `8x` agent capture tool output stored directly inside `.agent-logs/`

---

## 📅 Execution Roadmap (6-Hour Build Strategy)

```
[Phase 1] Prerequisites & Capture Logging (30 Mins)
  └── Setup 8x Capture Setup ──> Run Test Check ──> Commit .agent-logs/

[Phase 2] Data Architecture & Mock Engine (45 Mins)
  └── Create Seed Data (4-6 Rich Calls including 8-person 1-hr call)

[Phase 3] Core UI Layout & Sidebar (60 Mins)
  └── Navigation, Search Bar, Calendar Views, Meeting Repository List

[Phase 4] Dynamic Call View & Interactive Features (2 Hours)
  └── Video Player Sync + Transcript + AI Summary + Template Switcher + Share Dialog

[Phase 5] Deployment & Quality Assurance (45 Mins)
  └── Vercel Deployment + Incognito Testing + Unauthenticated Link Check

[Phase 6] 5-Minute Walkthrough Video (30 Mins)
  └── Loom Video Recording with Camera ON
```

---

## 🤖 Detailed Prompt Instructions for Your AI Agent

Copy and paste the instructions below directly into your AI coding assistant (e.g., Cursor / Claude Code):

---

### **Prompt 1: Setup & Agent Capture Verification**
> **Task:** Initialize a Next.js (App Router, TypeScript, Tailwind CSS, `shadcn/ui`) project. 
> 
> **Instructions:**
> 1. Set up the environment for the **8x agent capture setup** as specified in the brief.
> 2. Ensure all prompt-response pairs generated during your execution log automatically into the root directory under `.agent-logs/`.
> 3. Verify the capture setup works by running a test log, then create an initial Git commit containing the `.agent-logs/` directory.

---

### **Prompt 2: Seed Data Engine (`src/data/meetings.ts`)**
> **Task:** Build a comprehensive TypeScript mock database of meeting records.
> 
> **Requirements:**
> * Create a robust dataset with **at least 5 distinct meetings** (e.g., *Engineering Standup*, *Design Review*, *Sales Discovery*, and one **8-person, 1-hour All-Hands Sprint Review** as explicitly requested in the brief).
> * Each meeting object must include:
>   * `id`, `title`, `date`, `duration`, `attendees` (avatar URLs, names, roles)
>   * `videoUrl` (standard web-compatible video sample or synthetic HTML5 video mock)
>   * `transcript`: Array of objects containing `timestamp` (in seconds), `speaker`, `avatar`, and `text`.
>   * `summaries`: Object mapped by template type (`executive`, `engineering`, `sales`, `action-items`).
>   * `highlights`: Array of saved clip moments with start/end timestamps and custom titles.

---

### **Prompt 3: Navigation, Layout & Global Search (`src/app/page.tsx`)**
> **Task:** Build the Fathom web dashboard layout.
> 
> **Requirements:**
> * **Sidebar:** Left navbar featuring Fathom branding, *My Meetings*, *Shared with Me*, *Templates*, and *Settings*.
> * **Top Header:** Include a **Global Search Bar** that dynamically filters across all meeting titles, transcript contents, and speaker names in real time.
> * **Main Panel:** A responsive grid/list of meetings displaying date badges, attendee avatars, summary snippets, and call duration.
> * **Web-Only Note:** Include a subtle banner/badge: *"Web Application Portal (Recording Bot Stubbed for Web Execution)"* to demonstrate intentional product judgment.

---

### **Prompt 4: Deep Dive Call Page (`src/app/meetings/[id]/page.tsx`)**
> **Task:** Build the primary Fathom call view experience.
> 
> **Requirements:**
> 1. **Video/Transcript Sync:** 
>    * Split UI: Video Player on the left, Scrollable Transcript on the right.
>    * **Bi-directional seeking:** Clicking any timestamp or sentence in the transcript jumps the video player to that exact second.
> 2. **AI Summary Panel with Template Switcher:**
>    * Tabs to switch AI templates (*Executive Overview*, *Key Decisions*, *Action Items*).
>    * Switching tabs instantly re-renders the summary structure.
> 3. **Moment Highlighting & Clip Creation:**
>    * A button to highlight a timestamped moment mid-call.
>    * Hovering over transcript lines reveals a *"Create Clip"* action button.
> 4. **Public Share Dialog:**
>    * A *"Share Clip / Meeting"* button opening a modal with a shareable URL.
>    * Ensure public shared URLs can be accessed by anyone without requiring a login.

---

## 📌 Submission Checklist & Grading Matrix Alignment

Before submitting, double-check all items against the criteria:

| Requirement | Verification Step | Status |
| :--- | :--- | :---: |
| **Live Deployed Link** | Open in a private/incognito browser window without logging in to verify it loads populated data. | 🟩 |
| **Public Repository** | Ensure the GitHub repo is set to **Public**. | 🟩 |
| **Agent Logs** | Verify that the `.agent-logs/` folder is committed and visible on GitHub. | 🟩 |
| **Walkthrough Video** | Keep video **under 5 minutes** with **Camera ON**, highlighting product choices, speed, and agent capture setup. | 🟩 |