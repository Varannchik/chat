//back-end
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

const connection=[];
const user=[];

io.on('connection', function (socket) {  
   

  socket.emit('news', { hello: 'world' });              //отправляет
  socket.on('my other event', function (data) {         //слушает
    console.log(data);
    user.push(data)
  });
  
  console.log("Успешное соединение");
  connection.push(socket);
  

  socket.on('new-msg', function (data) {     
      socket.emit('msg', {msg: data.msg, name: data.name});
      socket.broadcast.emit('msg', {msg: data.msg, name: data.name});       //слушает
      
  });

  socket.on('disconnect', function(data){ 
    console.log(user)
    connection.splice(connection.indexOf(socket), 1)     //удаляем эемент из массива, указывая его индекс и количество удаляемх элементов в socket
    console.log("Отключил");    
    const status="logOut"
    socket.broadcast.emit('dis', {name: user.splice(user.indexOf(socket)), status: status});
  })
});

