# example-mod

Describe what this mod does.

A mod for [Velloc](https://velloc.app), shipped through its built-in
marketplace.

## Layout

The repository root is the plugin, exactly as a client installs it, except
`.github/`, `tests/` and the npm files, which never ship.

```
.claude-plugin/plugin.json   name, version (bump it with every release), description
hooks/hooks.json             {"modules": ["./register.js"]}
hooks/register.js            register(on): the mod's hooks
tests/                       node tests (npm test)
```

## Releasing

1. Bump `version` in `.claude-plugin/plugin.json`. A client upgrades an
   installed plugin only to a higher version.
2. Push to `main`. The pin workflow opens (or moves) one pull request on
   the marketplace that pins this commit; merging it publishes the build,
   and clients pick it up within a day.

The pin workflow needs the repository variable `MARKETPLACE_REPO` (the
marketplace's owner/name), the secret `MARKETPLACE_TOKEN` (a fine-grained
token on the marketplace with Contents and Pull requests read/write) and
this repository's entry in the marketplace's `sources.json`; without any of
them it does nothing. `new_mod.mjs` sets the first two.

To try a change in Velloc before release, link this folder as
`~/.velloc/plugins/example-mod` and restart Velloc.

## Starting a new mod from this template

From a checkout of the marketplace:

```bash
node scripts/new_mod.mjs <name> --description "<one line>"
```
