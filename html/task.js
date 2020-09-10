onmessage = function(event) {
    var num = event.data.val;
    var index = event.data.index;
    var result = 0;
    for (var i = 0; i < num; i++) {
        result += i;
        // console.log(index+": "+result);
    }
    console.log("线程结束");
    // 向线程创建源送回消息
    postMessage(result);
};