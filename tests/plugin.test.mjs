/**
 * The manifest a client installs by, the hooks it loads, and the example
 * hook's behaviour against a stand-in engine.
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { register } from '../hooks/register.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = path => JSON.parse(readFileSync(join(root, path), 'utf8'))

test('the manifest names the mod and a semver version', () => {
  const manifest = readJson('.claude-plugin/plugin.json')
  assert.match(manifest.name, /^[A-Za-z0-9][A-Za-z0-9._-]*$/)
  assert.match(manifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/)
  assert.ok(typeof manifest.description === 'string' && manifest.description.trim() !== '')
})

test('every hooks module exists inside hooks/', () => {
  for (const module of readJson('hooks/hooks.json').modules) {
    assert.ok(module.startsWith('./') && !module.includes('..'), module)
    assert.ok(existsSync(join(root, 'hooks', module)), module)
  }
})

test('the turn hook lets the turn finish, then shows the count', async () => {
  const handlers = {}
  register((event, handler) => { handlers[event] = handler })
  const shown = []
  const $ = { ui: { status: async text => { shown.push(text) } } }
  const next = async e => ({ done: e.id })
  assert.deepEqual(await handlers['turn.complete']($, { id: 1 }, next), { done: 1 })
  await handlers['turn.complete']($, { id: 2 }, next)
  assert.deepEqual(shown, ['Turns: 1', 'Turns: 2'])
})
