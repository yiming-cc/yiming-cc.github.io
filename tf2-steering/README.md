# TF²-Steering temporary landing page

Published at https://yiming-cc.github.io/tf2-steering/ through this repository's GitHub Pages deployment.

This temporary version contains only the paper title, authors, affiliations, and the looping Canvas velocity-field illustration. The illustration is conceptual, not experimental rollout data. It has no videos, task gallery, abstract, method section, or results section.

Files are self-contained and buildless:

- `index.html`: paper metadata and title block.
- `style.css`: desktop and mobile layout.
- `hero.js`: the existing flow-matching animation.
- `app.js`: pause/play control and reduced-motion preference handling.

Preview from the repository root with `python3 -m http.server 8794 --bind 127.0.0.1`, then open `http://127.0.0.1:8794/tf2-steering/`.

Once the final videos are ready, replace this directory's landing-page files with the full homepage and its assets, preserving the `/tf2-steering/` URL. The full homepage remains maintained separately in the paper project.
