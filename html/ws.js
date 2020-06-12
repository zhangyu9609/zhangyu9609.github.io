const PORT = 8080; // 监听端口
const WebSocket = require("ws"); // 引入 ws 库

const wss = new WebSocket.Server({ port: PORT }); // 声明wss对象

/**
 * 向除了本身之外所有客户端发送消息，实现群聊功能
 * @param {*} data 要发送的数据
 * @param {*} ws 客户端连接对象
 */
wss.broadcastToElse = function broadcast(data, ws) {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

/* 客户端接入，触发 connection */
wss.on("connection", function connection(ws, req) {
    let ip = req.connection.remoteAddress; // 通过req对象可以获得客户端信息，比如：ip，headers等
    console.log("用户+1");
    /* 客户端发送消息，触发 message */
    ws.on("message", function incoming(message) {
        ws.send(message); // 向客户端发送消息
        wss.broadcastToElse(message, ws); // 向 其他的 客户端发送消息，实现群聊效果
    });
});