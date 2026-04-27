const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const Blockchain = require('./blockchain');

const PORT = process.argv[2] || 3000;
const PEERS = (process.argv[3] || '').split(',').filter(Boolean); // e.g. ws://192.168.1.5:3000

const bc = new Blockchain();
const peers = new Set();

// ── HTTP Server (serves the UI) ──────────────────────────
const httpServer = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/vote') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const { voterId, candidate } = JSON.parse(body);
      const result = bc.castVote(voterId, candidate);
      if (result.success) broadcastChain();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ...result, tally: bc.getTally(), chain: bc.chain }));
    });
  } else if (req.url === '/tally') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tally: bc.getTally(), chainLength: bc.chain.length, valid: bc.isValid() }));
  } else {
    fs.readFile('./public/index.html', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
});

// ── WebSocket P2P Layer ──────────────────────────────────
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', ws => {
  ws.on('message', msg => handleMessage(JSON.parse(msg)));
  ws.send(JSON.stringify({ type: 'CHAIN', chain: bc.chain }));
});

function connectToPeer(address) {
  const ws = new WebSocket(address);
  ws.on('open', () => {
    peers.add(ws);
    ws.send(JSON.stringify({ type: 'CHAIN', chain: bc.chain }));
  });
  ws.on('message', msg => handleMessage(JSON.parse(msg)));
  ws.on('error', () => console.log(`Could not connect to ${address}`));
}

function handleMessage({ type, chain }) {
  if (type === 'CHAIN') {
    bc.replaceChain(chain);
    console.log(`Chain updated. Length: ${bc.chain.length}`);
  }
}

function broadcastChain() {
  const msg = JSON.stringify({ type: 'CHAIN', chain: bc.chain });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
  peers.forEach(peer => {
    if (peer.readyState === WebSocket.OPEN) peer.send(msg);
  });
}

// Connect to known peers on startup
PEERS.forEach(connectToPeer);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Node running at http://localhost:${PORT}`);
  console.log(`   Share your IP so others can connect: ws://<your-ip>:${PORT}`);
});