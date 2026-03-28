import os from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

function uniqBy(items, keyFn) {
  const seen = new Set()
  return items.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function resolveWindowsProcessName(pid) {
  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).ProcessName`,
    ])
    return stdout.trim() || 'unknown'
  } catch {
    return 'unknown'
  }
}

async function listWindowsPorts() {
  const { stdout } = await execFileAsync('netstat', ['-ano', '-p', 'tcp'])
  const lines = stdout.split(/\r?\n/).slice(4)
  const rows = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.includes('LISTENING')) continue
    const parts = trimmed.split(/\s+/)
    if (parts.length < 5) continue

    const localAddress = parts[1]
    const pid = Number(parts[4])
    const port = Number(localAddress.split(':').pop())
    if (!Number.isInteger(port) || !Number.isInteger(pid)) continue

    rows.push({
      protocol: parts[0].toUpperCase(),
      address: localAddress,
      port,
      pid,
      processName: await resolveWindowsProcessName(pid),
    })
  }

  return uniqBy(rows, (row) => `${row.protocol}:${row.address}:${row.pid}`).sort((a, b) => a.port - b.port)
}

async function listUnixPorts() {
  const { stdout } = await execFileAsync('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN'])
  const lines = stdout.split(/\r?\n/).slice(1)
  const rows = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const parts = trimmed.split(/\s+/)
    const processName = parts[0]
    const pid = Number(parts[1])
    const nameColumn = parts.at(-1)
    const port = Number(nameColumn.split(':').pop())
    if (!Number.isInteger(pid) || !Number.isInteger(port)) continue

    rows.push({
      protocol: 'TCP',
      address: nameColumn,
      port,
      pid,
      processName,
    })
  }

  return uniqBy(rows, (row) => `${row.address}:${row.pid}`).sort((a, b) => a.port - b.port)
}

export async function listPorts() {
  if (os.platform() === 'win32') return listWindowsPorts()
  return listUnixPorts()
}

export async function findPort(port) {
  const rows = await listPorts()
  return rows.find((row) => row.port === Number(port)) ?? null
}

export async function killPort(port, { force = false } = {}) {
  const match = await findPort(port)
  if (!match) {
    throw new Error(`No listening process found on port ${port}`)
  }

  if (os.platform() === 'win32') {
    const args = ['/PID', String(match.pid)]
    if (force) args.push('/F')
    await execFileAsync('taskkill', args)
  } else {
    const signal = force ? '-9' : '-15'
    await execFileAsync('kill', [signal, String(match.pid)])
  }

  return match
}
