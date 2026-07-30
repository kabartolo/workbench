# Contributing

## Monorepo Structure

This is a pnpm monorepo. It contains npm packages and my personal site, organized into these folders:

```
packages/
apps/
    site/
```

## Commit & PR Guidelines

This repository is a monorepo containing multiple packages and applications. To maintain a clean git history and automated changelogs, please scope your commits and PR titles to the specific workspace you are modifying.

### Commit Format

Scopes reflect package names. This list will be updated as packages are added.

`<type>(<scope>): <description>`

- **Scopes:** `root`, `site`
- **Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Examples

- `feat(astro-api-mock): support mock delay options`
- `docs(astro-loader-openapi): add TypeScript usage example`

### Creating a Changeset

If your pull request modifies code in a package under `/packages` that is published to npm, please run:

\`\`\`bash
pnpm changeset
\`\`\`

Follow the prompts to describe your change. This ensures the package version and changelog are updated correctly upon release.
