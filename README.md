# deacald.css

This is my UI kit. It's a soft, light style in blue and green with crisp cards and gentle glows. It's just one CSS file and one JS file, so there's nothing to install or build.

You can see every component along with its code on the demo page: [deacald.css.deancaldwell.com](https://deacald.css.deancaldwell.com/). It's the same page as `index.html` in this repo.

## Use it

Add these lines to your page's `<head>`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=JetBrains+Mono:wght@400..700&display=swap">
<link rel="stylesheet" href="deacald.css">
<script defer src="deacald.js"></script>
```

## Rules

- Colour comes from `--tone`, and children pick it up from their parent. You can set it with a modifier like `badge--green`, `widget--red` or `tier--gold`, or you can set it inline.
- Class names follow BEM, so they look like `block__element--modifier`. States use `.is-*`.
- Each view gets one main button, and its label says what it does. Don't use disabled buttons.
- Fields go in this order: label, hint, error, then the input. An error message tells you what to do.
- Things that stand on their own lift when you hover over them. Rows, segments and menu items only change colour.
- Use one kind of edge: a 1px `--line` border, or `--edge-fill` on coloured surfaces.
- Glows are big and soft inside an element. Outside, they stay small unless the element lifts.

## JavaScript

```js
deacald.icon("star")
deacald.segbar(el, 5)
deacald.digits(el, "0:15")
deacald.toast({ title, body, icon, color })
deacald.confetti({ x, y })
deacald.fadeThrough(swap)
await deacald.confirm({ title, body, items, icon, warning, confirm, cancel, danger })
deacald.achievement({ title, body, tier }, { style, kicker })
deacald.chart.line(svg, data, opts)
deacald.chart.target(svg, items, opts)
deacald.emojiUrl("🔥")
deacald.countUp(el)
deacald.reveal(root)
```

Segmented controls and steppers fire a `deacald:change` event.

## Use it in other projects

Add this repo as a git submodule:

```bash
git submodule add https://github.com/deacaldw/deacald.css res/deacald
```

Then load `res/deacald/deacald.css` and `res/deacald/deacald.js` in your page. The submodule stays on the commit you added until you move it. To get the latest version, run `git submodule update --remote res/deacald` in that project and commit the change.

## See the docs

```bash
python -m http.server 8000
```

Then open http://localhost:8000. To build the docs site, run `./build.sh`, and it copies everything it needs into `public/`.
