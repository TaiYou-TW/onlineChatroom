var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
//var bodyParser = require('body-parser');

//rapp.use(bodyParser.urlencoded({ extended: true }));

http.listen(3000, function(){
  console.log('listening on port:3000');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/message.html');
});

var online_list = [];
var id = 0;

io.on('connection', function(socket){ // 連接時
	socket.on('disconnect', function(){
  		var obj = new Object;
  		obj.name = '系統通知';
  		obj.msg = socket.name + ' 已離開';

  		for(i = 0; i < online_list.length; i++)
  			if(socket.name == online_list[i])
  				online_list[i] = "";

		io.sockets.emit('list', online_list);
        //io.sockets.emit('msg', obj);
 		io.emit('msg', obj);
	});

	socket.on('msg', function(msg){
		var obj = new Object;
		obj.name = socket.name;
		obj.msg = msg;

		//socket.emit('msg', obj);
		socket.broadcast.emit('msg',obj);
	});

	socket.on('login',function(data){
		var obj = new Object;
		obj.name = '系統通知';
		obj.msg = data.name+" 上線啦";

		socket.id = id;
		online_list[id] = data.name;

		socket.name = data.name;
		//socket.emit('msg', obj);
		socket.broadcast.emit('msg',obj);
		io.sockets.emit('list', online_list);
		id++;
	})

	socket.on('keyinIng',function(data){
		var obj = new Object;
		obj.name = '系統通知';
		obj.msg = socket.name+"輸入中";

		//socket.emit('keyinIng', obj);
		socket.broadcast.emit('keyinIng',obj);
	})
	socket.on('not_keyinIng',function(data){
		socket.emit('not_keyinIng', data);
		socket.broadcast.emit('not_keyinIng',data);
	})
	io.sockets.emit('list', online_list);
});