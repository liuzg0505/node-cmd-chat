var net = require('net');
var readLine = require('readline');
const address = require('address');
const localIp = address.ip();
console.log('my ip:', localIp);

//端口和HOST
var PORT = 6666;
var HOST = '192.168.3.77';

//从终端读取输入
var rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 客户端连接服务器
var client = net.connect(PORT, HOST, function () {
  console.warn(`[System] connected to server ${HOST}:${PORT}...`);
  client.write(`[Connected Client]: [${localIp}]`);
});
// 接收服务器发来的消息
client.on('data', function (data) {
  const msg = data.toString();
  if (msg.indexOf(localIp) === 1) return;
  // const msg = '[Server] ' + data.toString();
  console.log(msg);
  // client.end();
});
// 监听终端读取
rl.on('line', function (line) {
  // 有输入后发给服务端
  const msg = line.toString();
  client.write(`[${localIp}]: ${msg}`);
});
// 服务端关闭之后
client.on('close', function () {
  console.warn('[System] server close the connection...');
  process.exit(0);
});

// 监听错误
client.on('error', function (err) {
  console.error('[Error] ' + err.message);
});
