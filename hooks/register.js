/**
 * The mod's entry: `register(on)` is called once per session. This one
 * counts the session's turns in the status line; replace it with the mod.
 */
export function register(on) {
  let turns = 0
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    turns += 1
    await $.ui.status(`Turns: ${turns}`)
    return result
  })
}
