export function printHelp() {
  console.log(`portgrim\n\nUsage:\n  portgrim list\n  portgrim kill <port> [--yes] [--force]\n  portgrim help\n\nCommands:\n  list              Show listening local ports with PID and process details\n  kill <port>       Stop the process using the given local port\n\nOptions:\n  --yes             Skip confirmation prompt for kill\n  --force           Force kill the process\n  -h, --help        Show help\n`)
}

export function printRows(rows) {
  if (rows.length === 0) {
    console.log('No listening ports found.')
    return
  }

  const headers = ['PORT', 'PID', 'PROCESS', 'PROTO', 'ADDRESS']
  const widths = headers.map((header) => header.length)
  const normalized = rows.map((row) => {
    const values = [String(row.port), String(row.pid), row.processName || 'unknown', row.protocol, row.address]
    values.forEach((value, index) => {
      widths[index] = Math.max(widths[index], value.length)
    })
    return values
  })

  const format = (values) => values.map((value, index) => value.padEnd(widths[index])).join('  ')
  console.log(format(headers))
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  normalized.forEach((values) => console.log(format(values)))
}
