var net = require('net');
var readLine = require('readline');
const address = require('address');
const localIp = address.ip();

// 端口和HOST
var PORT = 6666;
var HOST = localIp;
console.log(`Server Ip: ${HOST}:${PORT}`);
// 创建readline的接口，指定输入和输出
var rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// 广播消息
function broadcast(server, msg) {
  clients.map((ctx) => {
    ctx.conn.write(msg);
  });
}
function getRndStr() {
  return Math.random().toString(36).slice(2);
}
function closeClient(id) {
  let idx;
  const clt = clients.find((v, i) => {
    const cond = v.id === id;
    if (cond) {
      idx = i;
    }
    return cond;
  });
  if (clt) {
    clt.conn.destroy();
    clients.splice(idx, 1);
  }
}
// 所有客户端
var clients = [];
// 创建服务端 并进行监听
var server = net.createServer(function (connection) {
  const rndStr = getRndStr();
  const len = clients.length;
  const cid = `${len}_${rndStr}`;
  clients.push({
    id: cid,
    conn: connection,
  });
  console.warn('[System] client connected...');
  // console.log(666, connection);
  //如果客户端结束了链接  监听end
  connection.on('end', function () {
    console.warn('[System] client close the connection...', connection);
    // console.log(444, cid, clients.map(v => v.id));
    closeClient(cid);
  });
  //如果发生了错误 监听错误事件
  connection.on('error', function (err) {
    console.error('[Error] ' + err.message);
    // console.log(555, cid, clients.map(v => v.id));
    closeClient(cid);
  });
  // 进行通信 通过监听data来实现
  // 接收消息 进行显示
  connection.on('data', function (data) {
    // console.log(111, server.connections);
    // console.log(333, cid, clients.map(v => v.id));
    const msg = data.toString();
    if (msg.indexOf('[Connected Client]') === 0) {
      console.log(msg);
      return;
    }
    console.log('[Client] ' + data.toString());
    // connection.write(msg);
	// 广播消息
    broadcast(server, msg);
  });
  // connection.pipe(connection);
  // 监听终端的输入
  rl.on('line', function (line) {
    // 有输入则写入
    const msg = `[Server Admin]: ${line.toString()}`;
    connection.write(msg);
    // 服务端输入消息不用广播，否则出现多遍
    // broadcast(server, msg);
  });
});

// 监听端口
server.listen(PORT, HOST, function () {
  console.warn('[System] server is listening:6666');
});
// 监听关闭
server.on('close', function () {
  console.error('[System] connection closed...');
});
// 监听错误
server.on('error', function (err) {
  console.error('[Error] ' + err.message);
});
