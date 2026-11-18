/* ==========================================================================
   deacald.js — behaviour for deacald.css (window.deacald)
   Load with `defer` in <head>. No dependencies, no build step.

     deacald.icon(name)                 inline icon markup (sprite injected on load)
     deacald.segbar(el, value)          segment bars   deacald.digits(el, "0:15")
     deacald.toast({ title, body, icon, color })
     deacald.confetti({ x, y, count })  deacald.fadeThrough(swap)
     deacald.confirm({ title, body, items, icon, warning, confirm, cancel, danger }) → Promise<boolean>; cancel: "" shows one button
     deacald.achievement({ title, body, tier }, { style, kicker })
     deacald.chart.line(svg, data, opts)   deacald.chart.target(svg, items, opts)
     deacald.emojiUrl(ch)  deacald.countUp(el)   deacald.reveal(root)   (.reveal, .glow, .hero, .tilt work on their own)

   Segmented controls and steppers fire a bubbling "deacald:change" event.
   ========================================================================== */

(() => {
  const dc = (window.deacald = {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const change = (el, detail) => el.dispatchEvent(new CustomEvent("deacald:change", { detail, bubbles: true }));
  dc.esc = esc;

  /* ---------- Icons (one sprite per page) -------------------------------- */
  /* <svg class="icon"><use href="#i-star"/></svg>, or deacald.icon("star") */

  const ICONS = {
    back: '<path d="m15 5-7 7 7 7"/>',
    arrow: '<path d="M4.5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
    star: '<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
    trophy: '<path d="M8 4h8v5.5a4 4 0 0 1-8 0z"/><path d="M8 6H5.2a3 3 0 0 0 3.1 4.2M16 6h2.8a3 3 0 0 1-3.1 4.2M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
    medal: '<circle cx="12" cy="14.5" r="5.8"/><circle cx="12" cy="14.5" r="2.4"/><path d="M8.6 9.8 6.2 3.5h4.1l1.7 4.2M15.4 9.8l2.4-6.3h-4.1L12 7.7"/>',
    lock: '<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8.2 11V8a3.8 3.8 0 0 1 7.6 0v3"/>',
    sparkle: '<path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5zM19 16v4M17 18h4"/>',
    flame: '<path d="M12 21.5c-3.9 0-6.6-2.6-6.6-6.1 0-3.6 3.1-5.4 3.6-9.4 2 1.4 3.1 3.4 3.1 5.2 1-.9 1.5-2.1 1.5-3.6 2.2 1.6 5 4.6 5 7.8 0 3.5-2.7 6.1-6.6 6.1z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    gift: '<rect x="4" y="9" width="16" height="11.5" rx="1.5"/><path d="M3 9h18M12 9v11.5M12 9c-1.5-3.5-5.5-4-5.5-1.5S12 9 12 9zM12 9c1.5-3.5 5.5-4 5.5-1.5S12 9 12 9z"/>',
    thermo: '<path d="M14 14.6V5a2 2 0 0 0-4 0v9.6a4 4 0 1 0 4 0z"/><path d="M12 10v7"/>',
    chat: '<path d="M4 5.5h16v10.5H10l-5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.6A8 8 0 1 1 9.4 4a6.4 6.4 0 0 0 10.6 10.6z"/>',
    music: '<path d="M9 18V5.5l10.5-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17" cy="16" r="2.5"/>',
    vibrate: '<rect x="8" y="4" width="8" height="16" rx="2"/><path d="M4.5 9v6M19.5 9v6"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    home: '<path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
    gear: '<circle cx="12" cy="12" r="2.6"/><path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/><circle cx="12" cy="12" r="6.2"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    share: '<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M6 11v8.5h12V11"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    pencil: '<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  };
  dc.icons = Object.keys(ICONS);
  dc.icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const injectSprite = () => document.body.insertAdjacentHTML("afterbegin",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0">${
      Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("")}</svg>`);

  /* ---------- Controls --------------------------------------------------- */

  /** Segment bar: <div class="segbar" data-segments="10" data-value="6">. Half segments allowed. */
  dc.segbar = (el, value) => {
    const n = +el.dataset.segments || 10;
    const v = Math.max(0, Math.min(n, +value || 0));
    const fresh = el.children.length !== n;
    if (fresh) el.innerHTML = "<i></i>".repeat(n);
    [...el.children].forEach((seg, i) => {
      const on = i < Math.floor(v);
      if (on && !fresh && !seg.classList.contains("is-on")) {
        seg.classList.remove("is-pop"); void seg.offsetWidth; seg.classList.add("is-pop"); // replay the pop
      }
      seg.classList.toggle("is-on", on);
      seg.classList.toggle("is-half", !on && v - i >= 0.5);
    });
    el.dataset.value = v;
    el.setAttribute("role", "meter");
    el.setAttribute("aria-valuemin", 0);
    el.setAttribute("aria-valuemax", n);
    el.setAttribute("aria-valuenow", v);
  };

  /** Split-flap digits: deacald.digits(el, "0:15"). A changed digit folds its
      top half down over the hinge, then the new bottom half falls into place. */
  const half = (cls, ch) => `<span class="${cls}"><span>${esc(ch)}</span></span>`;
  dc.digits = (el, text) => {
    const chars = [...String(text)];
    if (el.children.length !== chars.length) el.innerHTML = chars.map(() => "<span></span>").join("");
    chars.forEach((ch, i) => {
      const tile = el.children[i], old = tile.dataset.ch;
      if (old === ch) return;
      tile.dataset.ch = ch;
      if (!/\d/.test(ch)) { tile.className = "digits__sep"; tile.textContent = ch; return; }
      tile.className = "digit";
      if (old === undefined || reducedMotion()) {
        tile.innerHTML = half("digit__half digit__half--top", ch) + half("digit__half digit__half--bottom", ch);
        return;
      }
      // static: new top, old bottom; flaps: old top folds away, new bottom falls in
      tile.innerHTML = half("digit__half digit__half--top", ch) + half("digit__half digit__half--bottom", old) +
        half("digit__flap digit__flap--top", old) + half("digit__flap digit__flap--bottom", ch);
      tile.querySelector(".digit__flap--bottom").addEventListener("animationend", () => {
        if (tile.dataset.ch === ch) tile.innerHTML = half("digit__half digit__half--top", ch) + half("digit__half digit__half--bottom", ch);
      }, { once: true });
    });
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", text);
  };

  document.addEventListener("click", (e) => {
    const seg = e.target.closest(".segmented button");
    if (seg) {
      const group = seg.closest(".segmented");
      group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === seg));
      change(group, seg.value);
    }
    const step = e.target.closest(".stepper button[data-step]");
    if (step) {
      const box = step.closest(".stepper"), out = box.querySelector("output");
      out.value = Math.max(+(box.dataset.min ?? -Infinity), Math.min(+(box.dataset.max ?? Infinity), +out.value + +step.dataset.step));
      change(box, +out.value);
    }
  });

  // Range sliders fill up to the thumb (--p)
  const syncRange = (r) => r.style.setProperty("--p", ((r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0))) * 100);
  document.addEventListener("input", (e) => { if (e.target.matches("input.range")) syncRange(e.target); });

  /* ---------- Feedback: toast, confetti, screen fade, confirm ------------ */

  dc.toast = ({ title, body = "", icon = "check", color = "blue", duration = 3500 }) => {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "status");
      document.body.append(stack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="badge badge--sm badge--${esc(color)}">${dc.icon(icon)}</span>
      <div><div class="toast__title">${esc(title)}</div>${body ? `<div class="toast__body">${esc(body)}</div>` : ""}</div>`;
    const leave = () => {
      if (el.classList.contains("is-leaving")) return;
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    };
    el.addEventListener("click", leave);
    stack.append(el);
    setTimeout(leave, duration);
  };

  dc.confetti = ({ x = innerWidth / 2, y = innerHeight / 2, count = 26 } = {}) => {
    if (reducedMotion()) return;
    const colors = ["blue", "green", "blue-2", "green-2"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("i");
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const dist = 120 + Math.random() * 180;
      c.className = "confetti";
      c.style.cssText = `left:${x}px;top:${y}px;--tone:var(--${colors[i % colors.length]});` +
        `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;--r:${(Math.random() - 0.5) * 720}deg`;
      c.addEventListener("animationend", () => c.remove(), { once: true });
      document.body.append(c);
    }
  };

  /** Fade the screen to paper, run swap(), fade back. Timer-driven, so the
      swap still happens in a background tab where animations are paused. */
  dc.fadeThrough = (swap, { inMs = 280, outMs = 450 } = {}) => {
    const k = reducedMotion() ? 0.01 : 1;
    const el = document.createElement("div");
    el.className = "screen-fade";
    el.style.transition = `opacity ${inMs * k}ms ease`;
    document.body.append(el);
    void el.offsetWidth;
    el.style.opacity = "1";
    return new Promise((resolve) => setTimeout(() => {
      try { swap(); } finally {
        el.style.transition = `opacity ${outMs * k}ms ease`;
        el.style.opacity = "0";
        setTimeout(() => { el.remove(); resolve(); }, outMs * k + 30);
      }
    }, inMs * k));
  };

  /** Confirm dialog → Promise<boolean>. items: bullet points; icon: an emoji;
      warning: a consequence shown with the "!" mark under the text. */
  dc.confirm = ({ title, body = "", items = [], icon = "", warning = "", confirm = "OK", cancel = "Cancel", danger = false }) =>
    new Promise((resolve) => {
      const d = document.createElement("dialog");
      d.className = "modal";
      d.innerHTML = `
        ${icon ? `<div class="modal__icon" aria-hidden="true"><span class="emoji">${esc(icon)}</span></div>` : ""}
        <h2 class="modal__title">${esc(title)}</h2>
        ${body ? `<p class="modal__body">${esc(body)}</p>` : ""}
        ${items.length ? `<ul class="modal__list">${items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>` : ""}
        ${warning ? `<p class="warning modal__warning">${esc(warning)}</p>` : ""}
        <div class="modal__actions">
          ${cancel ? `<button class="btn" value="cancel">${esc(cancel)}</button>` : ""}
          <button class="btn ${danger ? "btn--danger" : "btn--primary"}" value="ok">${esc(confirm)}</button>
        </div>`;
      d.addEventListener("click", (e) => {
        const b = e.target.closest("button[value]");
        const r = d.getBoundingClientRect();
        const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (b || outside) d.close(b ? b.value : "cancel"); // a click on the backdrop cancels
      });
      d.addEventListener("close", () => { resolve(d.returnValue === "ok"); d.remove(); });
      document.body.append(d);
      d.showModal();
    });

  /* ---------- Achievement popups ----------------------------------------- */
  /* Styles: pill (bottom centre), corner (bottom right), banner (top left).
     Tiers colour them: bronze, silver, gold, platinum. CSS plays the visit. */

  const TIERS = ["bronze", "silver", "gold", "platinum"];

  /** The standard badge icon: a medal, 💎 for platinum, a lock while locked. */
  dc.tierIcon = (tier, locked = false) =>
    locked ? dc.icon("lock") : tier === "platinum" ? '<span class="emoji" aria-hidden="true">💎</span>' : dc.icon("medal");

  /** Popup HTML (add .is-static to show one inline). */
  dc.achievementMarkup = ({ title, body = "", tier }, { style = "pill", kicker = "Achievement unlocked" } = {}) => {
    tier = TIERS.includes(tier) ? tier : "bronze";
    return `<div class="ach ach--${esc(style)} tier--${tier}"><div class="ach__icon">${dc.tierIcon(tier)}</div><div class="ach__text">
      <div class="ach__kicker">${esc(kicker)}</div><div class="ach__title">${esc(title)}</div>${body ? `<div class="ach__body">${esc(body)}</div>` : ""}</div></div>`;
  };

  let popups = Promise.resolve();
  /** Show a popup; queued, so they never overlap. Platinum gets confetti. */
  dc.achievement = (data, opts) => (popups = popups.then(() => new Promise((done) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = dc.achievementMarkup(data, opts);
    const el = tpl.content.firstElementChild;
    el.setAttribute("role", "status");
    el.addEventListener("animationend", (e) => {
      if (e.target === el && e.animationName === "ach-out") { el.remove(); done(); }
    });
    document.body.append(el);
    if (data.tier === "platinum") {
      const r = el.getBoundingClientRect();
      setTimeout(() => dc.confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2 }), 400);
    }
  })));

  /* ---------- Charts ----------------------------------------------------- */
  /* Soft-light SVG charts that animate in (styles: .lc-* and .tc-*).
     delay (seconds) holds the animation back, e.g. until a screen fade clears. */

  let chartId = 0;
  const glowFilter = (id) => `<filter id="${id}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>`;

  // Monotone cubic curve through the points: gentle, never overshoots
  const monotonePath = (pts) => {
    const n = pts.length, dx = [], m = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
    const tg = [m[0]];
    for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    tg[n - 1] = m[n - 2];
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) { tg[i] = tg[i + 1] = 0; continue; }
      const a = tg[i] / m[i], b = tg[i + 1] / m[i], h = a * a + b * b;
      if (h > 9) { const s = 3 / Math.sqrt(h); tg[i] = s * a * m[i]; tg[i + 1] = s * b * m[i]; }
    }
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], third = dx[i] / 3;
      d += ` C${(x0 + third).toFixed(1)},${(y0 + tg[i] * third).toFixed(1)} ${(x1 - third).toFixed(1)},${(y1 - tg[i + 1] * third).toFixed(1)} ${x1},${y1}`;
    }
    return d;
  };

  dc.chart = {
    /** Line chart (2+ points). data: [{ value, x }], x = the label under the point. */
    line(svg, data, { max = 100, gridSteps = 3, delay = 0 } = {}) {
      const id = `lc${++chartId}`;
      const W = 440, H = 220, L = 40, R = 18, T = 26, B = 36, PAD = 18;
      const x = (i) => L + PAD + (i / (data.length - 1)) * (W - L - R - PAD);
      const y = (v) => T + (1 - v / max) * (H - T - B);
      const pts = data.map((d, i) => [x(i), y(d.value)]);
      const line = monotonePath(pts);
      const [ex, ey] = pts[pts.length - 1];
      let out = `<defs><linearGradient id="${id}-fill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="var(--tone)" stop-opacity=".22"/><stop offset="1" stop-color="var(--tone)" stop-opacity="0"/>
        </linearGradient>${glowFilter(`${id}-glow`)}</defs>`;
      for (let v = 0; v <= max + 1e-9; v += max / gridSteps) {
        out += `<line class="lc-grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
          <text class="lc-axis" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
      }
      out += `<line class="lc-marker" x1="${ex}" x2="${ex}" y1="${T - 6}" y2="${y(0)}"/>
        <path class="lc-area" d="${line} L${ex},${y(0)} L${pts[0][0]},${y(0)} Z" fill="url(#${id}-fill)"/>
        <path class="lc-halo" d="${line}" pathLength="1"/>
        <path class="lc-line" d="${line}" pathLength="1"/>`;
      data.forEach((d, i) => {
        const [px, py] = pts[i], last = i === data.length - 1;
        out += `<text class="lc-label${last ? " is-last" : ""}" style="--i:${i}" x="${px}" y="${py - (last ? 16 : 12)}" text-anchor="middle">${esc(d.value)}</text>
          <text class="lc-x" x="${px}" y="${H - 10}" text-anchor="middle">${esc(d.x)}</text>`;
      });
      out += `<circle class="lc-glow" cx="${ex}" cy="${ey}" r="13" filter="url(#${id}-glow)"/><circle class="lc-end" cx="${ex}" cy="${ey}" r="6"/>`;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.classList.add("lc");
      svg.style.setProperty("--delay", `${delay}s`);
      svg.innerHTML = out;
    },

    /** Target ("bullseye") chart. items: [{ dist, label }], dist 0 = the centre, `zero` = the edge.
        rungs: [{ value, pct }] filled circles (pct = colour strength); ringLabels: [{ value, text }]. */
    target(svg, items, { zero = 10, rungs = [], ringLabels = [], slots = items.length, delay = 0 } = {}) {
      const id = `tc${++chartId}`;
      const C = 210, R = 150;
      const rad = (v) => R * Math.sqrt(Math.min(v, zero) / zero);
      const angle = (i) => -Math.PI / 2 + (i / slots) * Math.PI * 2;
      const at = (a, r) => [C + Math.cos(a) * r, C + Math.sin(a) * r];
      const origin = `transform-origin:${C}px ${C}px`;
      let out = `<defs>${glowFilter(`${id}-glow`)}</defs>`;
      [...rungs].sort((a, b) => b.value - a.value).forEach((g, i) => {
        out += `<circle class="tc-rung" style="--i:${i};${origin};fill:color-mix(in srgb, var(--tone) ${g.pct}%, var(--paper))" cx="${C}" cy="${C}" r="${rad(g.value)}"/>`;
      });
      out += `<circle class="tc-rung tc-edge" style="${origin}" cx="${C}" cy="${C}" r="${R}"/>`;
      for (let i = 0; i < slots; i++) {
        const [x2, y2] = at(angle(i), R);
        out += `<line class="tc-spoke" pathLength="1" x1="${C}" y1="${C}" x2="${x2}" y2="${y2}"/>`;
      }
      ringLabels.forEach((g) => {
        const [lx, ly] = at(-Math.PI / 2 + Math.PI / slots, rad(g.value) - 11); // between the first two spokes
        out += `<text class="tc-ring-label" x="${lx}" y="${ly + 4}" text-anchor="middle">${esc(g.text)}</text>`;
      });
      items.forEach((it, i) => {
        const outside = it.dist > zero; // misses beyond the edge sit just outside it
        const [x, y] = at(angle(i), outside ? R + 16 : Math.max(9, rad(it.dist)));
        const [lx, ly] = at(angle(i), R + (outside ? 46 : 36));
        out += `<circle class="tc-glow" style="--i:${i}" cx="${x}" cy="${y}" r="14" filter="url(#${id}-glow)"/>
          <circle class="tc-dot" style="--i:${i};--dx:${(C - x).toFixed(1)}px;--dy:${(C - y).toFixed(1)}px" cx="${x}" cy="${y}" r="7"/>
          <text class="tc-label" style="--i:${i}" x="${lx}" y="${ly + 5}" text-anchor="middle">${esc(it.label)}</text>`;
      });
      svg.setAttribute("viewBox", "0 0 420 420");
      svg.classList.add("tc");
      svg.style.setProperty("--delay", `${delay}s`);
      svg.innerHTML = out;
    },
  };

  /* ---------- Pointer effects -------------------------------------------- */
  /* .glow follows the pointer with a spotlight (--gx/--gy), .hero with a
     brighter one (--hx/--hy), and .tilt leans toward it (--tx/--ty, gloss at --lx/--ly). */

  const setVars = (el, vars) => Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    for (const el of e.target.closest ? [e.target.closest(".glow"), e.target.closest(".hero"), e.target.closest(".tilt")] : []) {
      if (!el) continue;
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (el.matches(".glow")) setVars(el, { "--gx": `${x}px`, "--gy": `${y}px` });
      if (el.matches(".hero")) setVars(el, { "--hx": `${x}px`, "--hy": `${y}px` });
      if (el.matches(".tilt") && !reducedMotion()) {
        const px = x / r.width - 0.5, py = y / r.height - 0.5;
        setVars(el, { "--tx": `${(px * 27).toFixed(2)}deg`, "--ty": `${(-py * 27).toFixed(2)}deg`, "--px": px.toFixed(3), "--py": py.toFixed(3), "--lx": `${x}px`, "--ly": `${y}px` });
      }
    }
  });
  document.addEventListener("pointerout", (e) => {
    for (const el of e.target.closest ? [e.target.closest(".glow"), e.target.closest(".tilt")] : []) {
      if (!el || el.contains(e.relatedTarget)) continue;
      setVars(el, { "--tx": "0deg", "--ty": "0deg", "--px": 0, "--py": 0 }); // a glow fades out where it is
    }
  });

  /* ---------- Scroll effects --------------------------------------------- */

  /** Count a number up to its value: deacald.countUp(el, { duration }). Keeps any prefix/suffix ("£", "%"). */
  dc.countUp = (el, { duration = 1200 } = {}) => {
    const m = /^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(el.textContent);
    if (!m || reducedMotion()) return;
    const raw = m[2].replace(/,/g, ""), to = parseFloat(raw), dec = (raw.split(".")[1] || "").length, group = m[2].includes(",");
    const fmt = (v) => (group ? v.toLocaleString("en", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec));
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / duration);
      el.textContent = m[1] + fmt(to * (1 - (1 - k) ** 3)) + m[3];
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // .reveal containers get .is-in once they scroll into view (once); [data-count] numbers inside count up then.
  const revealSeen = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    en.target.querySelectorAll("[data-count]").forEach((n) => dc.countUp(n));
    revealSeen.unobserve(en.target);
  }), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  /** Watch new .reveal containers (called on load; call again after adding some). */
  dc.reveal = (root = document) => root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
    if (reducedMotion()) el.classList.add("is-in");
    else revealSeen.observe(el);
  });

  /* ---------- Boot ------------------------------------------------------- */

  /* ---------- Emoji ------------------------------------------------------ */
  /* Emoji fonts sit glyphs off-centre, differently on every platform. So each
     .emoji is drawn once to a canvas, cropped to its ink and shown centred as
     an image; the character stays in the page (invisible) for copy and screen
     readers. New .emoji elements are picked up as they're added. */

  const emojiArt = new Map();
  const drawEmoji = (ch) => {
    if (emojiArt.has(ch)) return emojiArt.get(ch);
    let url = "";
    try {
      const F = 160, S = F * 2; // font size = the output's 1em; a roomy canvas to draw in
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.font = `${F}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-emoji")}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(ch, S / 2, S / 2);
      const px = g.getImageData(0, 0, S, S).data;
      let x0 = S, y0 = S, x1 = -1, y1 = -1;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        if (px[(y * S + x) * 4 + 3] < 12) continue;
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      if (x1 >= 0) {
        const w = x1 - x0 + 1, h = y1 - y0 + 1, k = Math.min(1, (F * 0.96) / Math.max(w, h));
        const out = document.createElement("canvas");
        out.width = out.height = F;
        out.getContext("2d").drawImage(c, x0, y0, w, h, (F - w * k) / 2, (F - h * k) / 2, w * k, h * k);
        url = out.toDataURL();
      }
    } catch { /* keep the glyph as text */ }
    emojiArt.set(ch, url);
    return url;
  };
  /** A centred image of an emoji as a data URL ("" if it can't be drawn), e.g. for SVG <image>. */
  dc.emojiUrl = drawEmoji;
  const fixEmoji = (root) => {
    if (root.nodeType !== 1) return;
    const els = root.matches(".emoji") ? [root] : root.querySelectorAll(".emoji");
    els.forEach((el) => {
      if (el.querySelector(".emoji__glyph")) return;
      const ch = el.textContent.trim(), url = ch && drawEmoji(ch);
      if (!url) return;
      el.style.backgroundImage = `url(${url})`;
      el.innerHTML = `<span class="emoji__glyph">${esc(ch)}</span>`;
    });
  };

  const boot = () => {
    injectSprite();
    fixEmoji(document.body);
    new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach(fixEmoji)))
      .observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll(".segbar[data-segments]").forEach((el) => dc.segbar(el, el.dataset.value));
    document.querySelectorAll("input.range").forEach(syncRange);
    dc.reveal();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
