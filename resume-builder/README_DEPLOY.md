# Deploy `resume-builder` to GitHub Pages

This folder contains a static site (`resume-builder/`) with plain HTML/CSS/JS.

## What I added

- A GitHub Actions workflow at `.github/workflows/deploy.yml` that publishes the `resume-builder/` folder to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

## Usage

1. Commit and push the new workflow to your repository's `main` branch.

```bash
git add .github/workflows/deploy.yml
git add resume-builder/README_DEPLOY.md
git commit -m "Add GitHub Pages deploy workflow for resume-builder"
git push origin main
```

2. The action runs on push and will publish the `resume-builder` directory to the `gh-pages` branch.

3. In GitHub, go to Settings → Pages and verify the site is being served from the `gh-pages` branch (or accept the default Pages setting).

## Notes

- If your repository default branch is `master`, update the `on.push.branches` in the workflow to `master`.
- No additional secrets are required — the workflow uses `GITHUB_TOKEN` provided by Actions.
