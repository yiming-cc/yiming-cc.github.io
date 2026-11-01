# TF²-Steering paper homepage

Full project page: https://yiming-cc.github.io/tf2-steering/

Published by this repository’s GitHub Pages workflow from `main`. This full version replaces the temporary title-only page on 2026-11-01.

## Contents

- Title, authors, affiliations, and looping flow-matching illustration.
- PDF link; arXiv and Code buttons remain disabled until URLs are available.
- Six real-world task videos, shown silently at 1.5× speed, with full-size playback.
- Manuscript abstract, interactive method illustration, and Tables 1–2 result charts.

Fruit on Plate, Close Zipper, and Dropper Transfer use `put_fruit_2`, `close_zipper_2`, and `liquid_transfer`, respectively. There are no placeholder task videos or Film section.

The method follows the manuscript: world priors are predicted once per action chunk and remain fixed; separate predicted- and real-tactile subexperts use independent sigmoid weighting to refine the action expert’s velocity during flow matching. The 16-step / 4-step timeline is illustrative.

## Maintenance

This is a buildless HTML/CSS/JavaScript site with local assets and no frontend dependencies. From the repository root, run `python3 -m http.server 8794 --bind 127.0.0.1`, then visit `http://127.0.0.1:8794/tf2-steering/`.

- `index.html`: title block, resources, abstract, and section headings.
- `app.js`: task video mapping and page interactions.
- `hero.js`, `method.js`, `results.js`: visualizations and table values.
- `assets/`: six MP4 files, their posters, favicon, and the 19-page paper PDF.

Asset URLs and module imports are relative to this directory. Update their version query strings when changing code to prevent cached temporary-page scripts from being reused.

The full authoring version is maintained separately in the paper project. The simulation chart reproduces the displayed table averages (68.3 and 57.7), yielding 10.6 pp; the unchanged manuscript abstract reports 10.7 pp.
