import test from 'node:test'
import assert from 'node:assert/strict'
import { runCli } from '../src/index.js'

test('help renders without throwing', async () => {
  await assert.doesNotReject(() => runCli(['--help']))
})

test('invalid kill port throws', async () => {
  await assert.rejects(() => runCli(['kill', '99999', '--yes']), /valid port number/)
})

test('unknown command throws', async () => {
  await assert.rejects(() => runCli(['dance']), /Unknown command/)
})
