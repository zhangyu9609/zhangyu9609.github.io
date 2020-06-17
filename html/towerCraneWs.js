const PORT = 8080; // 监听端口
const WebSocket = require("ws"); // 引入 ws 库

const wss = new WebSocket.Server({ port: PORT }); // 声明wss对象

let angle1 = 80;
let angle2 = 322;

/* 客户端接入，触发 connection */
wss.on("connection", function connection(ws, req) {
    let ip = req.connection.remoteAddress; // 通过req对象可以获得客户端信息，比如：ip，headers等
    console.log("用户+1");
    /* 客户端发送消息，触发 message */
    ws.on("message", function incoming(message) {
        var obj  = JSON.parse(message);
        console.log(obj.id);
        // setInterval(function () {
        //     angle1 += 1;
        //     angle2 += 1;
            let arr = [
                {name:'T1塔吊',x:175,y:114,radius:55,shortRadius:14,startAngle:0,endAngle:360,angle: angle1},
                {name:'T2塔吊',x:227,y:188,radius:55,shortRadius:14,startAngle:0,endAngle:360,angle: angle2}
            ];
            ws.send(JSON.stringify(arr)); // 向客户端发送消息
        // },100)
    });
});
