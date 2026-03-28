import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { killPort, listPorts } from './ports.js'
import { printHelp, printRows } from './ui.js'

function isValidPort(value) {
  const port = Number(value)
  return Number.isInteger(port) && port > 0 && port <= 65535
}

async function confirmKill(port) {
  const rl = readline.createInterface({ input, output })
  try {
    const answer = await rl.question(`Kill the process listening on port ${port}? [y/N] `)
    return ['y', 'yes'].includes(answer.trim().toLowerCase())
  } finally {
    rl.close()
  }
}

export async function runCli(args) {
  const [command, ...rest] = args

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  if (command === 'list') {
    const rows = await listPorts()
    printRows(rows)
    return
  }

  if (command === 'kill') {
    const [portArg, ...flags] = rest
    if (!isValidPort(portArg)) {
      throw new Error('Please provide a valid port number (1-65535).')
    }

    const port = Number(portArg)
    const skipConfirm = flags.includes('--yes')
    const force = flags.includes('--force')

    if (!skipConfirm) {
      const confirmed = await confirmKill(port)
      if (!confirmed) {
        console.log('Aborted.')
        return
      }
    }

    const killed = await killPort(port, { force })
    console.log(`Stopped ${killed.processName} (PID ${killed.pid}) on port ${killed.port}.`)
    return
  }

  throw new Error(`Unknown command: ${command}`)
}
