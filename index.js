var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os')
var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  /**
   * 游客IP
   */
  const ip = os.networkInterfaces()['以太网'][1].address;
  console.log('+++++++++++++++++++++++++++++++')
  console.log(`${ip} --------  connected!`)
  console.log('获取计算机名称： ' + os.hostname());
  console.log('获取操作系统类型： ' + os.type());
  console.log('获取操作系统平台： ' + os.platform());
  console.log('获取CPU架构： ' + os.arch());
  console.log('获取操作系统版本号： ' + os.release());
  console.log('获取系统当前运行的时间： ' + os.uptime())
  console.log('系统总内存量： ' + (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + 'G')
  console.log('+++++++++++++++++++++++++++++++')
  io.emit('connected', ip)
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    console.log('=========  发送信息如下 ============')
    console.log(msg)
    console.log('====================================')
  });
  socket.on('disconnect', () => {
    console.log('--------------------------------')
    console.log(`${ip} --------  disconnect!`)
    console.log('--------------------------------')
    io.emit('disconnect', ip)
  });
  //接收数据
 socket.on('login', function (obj) {    
  console.log(obj.username);
  // 发送数据
  io.emit('relogin', {
    msg: `你好${obj.username}`,
    code: 200
  }); 
 });

});


http.listen(port, () => {
  console.log('listening on *:' + port);
  console.log(`go to http://localhost:${port}`);
});