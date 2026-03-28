# portgrim

`portgrim` is a small npm CLI for local developers who need to see which processes are listening on ports and stop them quickly.

## Features

- list listening local ports
- show PID and process name when available
- kill the process bound to a chosen port
- works on Windows and Unix-like systems

## Install

### Run without installing

```bash
npx portgrim list
```

### Global install

```bash
npm install -g portgrim
```

## Usage

### List listeners

```bash
portgrim list
```

Example output:

```text
PORT  PID    PROCESS  PROTO  ADDRESS
----  -----  -------  -----  -----------------
3000  12345  node     TCP    0.0.0.0:3000
5173  25252  node     TCP    127.0.0.1:5173
```

### Kill a port

```bash
portgrim kill 5173
```

### Skip confirmation

```bash
portgrim kill 5173 --yes
```

### Force kill

```bash
portgrim kill 5173 --yes --force
```

## Notes

- This tool only manages processes on the **local machine**.
- You may need elevated privileges for some system-owned processes.
- On Unix-like systems, `lsof` must be available.

## Development

```bash
npm test
npm run lint
```

## License

MIT
