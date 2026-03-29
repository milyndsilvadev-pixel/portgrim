# portgrim

`portgrim` is a lightweight CLI for local developers who want to inspect which processes are listening on ports and shut them down quickly.

It is built for **local machine process management** — handy when a dev server, preview app, or background service is still holding onto a port.

## Why portgrim?

Common use cases:
- your dev server crashes but leaves port `3000` occupied
- Vite, Next.js, Express, or another tool refuses to start because a port is already in use
- you want a quick command to see what is listening locally
- you want to stop the process on a specific port without digging through Task Manager or system tools

## Features

- list listening local TCP ports
- show PID and process name when available
- kill the process bound to a chosen port
- confirmation prompt before stopping a process
- optional force kill support
- works on Windows and Unix-like systems

## Installation

### Run with npx

```bash
npx portgrim list
```

### Install globally

```bash
npm install -g portgrim
```

## Requirements

- Node.js `18+`
- On Unix-like systems, `lsof` must be available

## Usage

### Show all listening ports

```bash
portgrim list
```

Example output:

```text
PORT  PID    PROCESS  PROTO  ADDRESS
----  -----  ----------------  -----  -----------------
3000  12345  node              TCP    0.0.0.0:3000
5173  25252  node              TCP    127.0.0.1:5173
```

### Kill the process on a port

```bash
portgrim kill 5173
```

By default, `portgrim` asks for confirmation before stopping the process.

### Skip confirmation

```bash
portgrim kill 5173 --yes
```

### Force kill

```bash
portgrim kill 5173 --yes --force
```

## Command reference

### `portgrim list`

Lists local listening TCP ports with:
- port
- PID
- process name
- protocol
- bound address

### `portgrim kill <port>`

Stops the process using the given port.

Options:
- `--yes` — skip the confirmation prompt
- `--force` — use a forceful termination method

## Safety notes

- `portgrim` only targets processes on the **local machine**.
- Some processes may require elevated privileges to inspect or terminate.
- Be careful when killing system services or shared development tools.
- `--force` should be used sparingly.

## Examples

```bash
# See what is listening locally
portgrim list

# Stop the app on port 3000
portgrim kill 3000

# Stop it without a confirmation prompt
portgrim kill 3000 --yes

# Force stop it
portgrim kill 3000 --yes --force
```

## Development

```bash
npm test
npm run lint
```

## Roadmap ideas

Possible future improvements:
- `portgrim info <port>` for extra process details
- UDP support
- JSON output for scripting
- filtering by process name

## License

MIT
