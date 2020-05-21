
$(() => {
    // 首页加载
    $.ajaxSetup({async : false});
    $("#footer").load("html/footer.html");
    router($.getHash());
    $.ajaxSetup({async : true});
});

/**
 * hash监听
 */
window.addEventListener('hashchange',function(){
    // 将hash的值拿到（去掉参数）
    var hash = $.getHash();
    router(hash);
});

/**
 * 根据hash改变路由
 */
var router = (hash)=>{
    // 回到顶部
    $('html,body').animate({scrollTop:0},500);
    $(".current").removeClass("current");
    if (hash == "articles/article") {
        $("#articles").addClass("current");
    }else {
        $("#"+hash).addClass("current");
    }

    // 使用switch判断hash的值是多少
    $.ajaxSetup({async : false});
    switch(hash){
        case 'index' :
            $("#main").load("html/indexMain.html");
            $("#banner").show();
            index();
            break;
        case 'articles' :
            $("#main").load("html/articleListMain.html");
            $("#banner").hide();
            articleList();
            break;
        case 'articles/article' :
            $("#main").load("html/articleMain.html");
            $("#banner").hide();
            article();
            break;
        case 'me' :
            $("#main").load("html/meMain.html");
            $("#banner").hide();
            break;
        default :
            $("#main").load("html/indexMain.html");
            $("#index").addClass("current");
            $("#banner").show();
            index();
    }
    $.ajaxSetup({async : true});
};


// 监听屏幕滚动条
// $(window).scroll(function(event){
//
//     var oTop = document.body.scrollTop==0?document.documentElement.scrollTop:document.body.scrollTop;
//     window.location.hash;
//     debugger
// });

/**
 * 首页数据加载
 */
var index = () =>{
    var blogTypes = [];
    $.ajaxSettings.async = false;
    $.getJSON("assets/blogs/blogsConfig.json", (result) => {
        blogTypes = result.blogTypes;
    });
    $.ajaxSettings.async = true;
    var html = "";
    blogTypes.forEach((blogType,index) => {
        var blogNum = 0;
        var articles = [];
        $.ajaxSettings.async = false;
        $.getJSON("assets/blogs/"+blogType.type+".json", (result) => {
            articles = result.articles;
            blogNum = articles.length;
        });
        $.ajaxSettings.async = true;
        var num = Math.round(Math.random()*7) + 2;
        var marginTop = Math.round(Math.random()*10);
        html += '<div class="col-6 col-12-small"><section class="box">\n';
        html += '<a href="javascript:void(0);" class="image featured" style="height: 150px;overflow: hidden"><img src="images/pic0'+num+'.jpg" alt="" style="margin-top: -'+marginTop+'%;"/></a>\n';
        html += '<header><h3>'+blogType.name+'</h3><p>'+blogNum+'篇文章</p></header>\n';
        html += '<p>'+blogType.describe+'</p>\n';
        html += '<footer><ul class="actions">\n';
        html += '<li><a href="#articles?type='+blogType.type+'" class="button icon solid fa-file-alt">Continue Reading</a></li>\n';
        html += '<li><a href="javascript:void(0);" class="button alt icon solid fa-comment">33 comments</a></li>\n';
        html += '</ul></footer>\n';
        html += '</section></div>\n';
    });
    $("#blogTypes").html(html);
};

/**
 * 文章列表页数据加载
 */
var articleList = () =>{
    var articles = [];
    $.ajaxSettings.async = false;
    var type = $.getQueryParam('type') || "frontEnd";
    $.getJSON("assets/blogs/"+type+".json", (result) => {
        $("#blogType").text(result.type);
        $("#blogDescribe").text(result.describe);
        articles = result.articles;
    });
    $.ajaxSettings.async = true;
    var html = "";
    articles.forEach((article,index) => {
        var num = Math.round(Math.random()*8) + 1;
        var marginTop = Math.round(Math.random()*10);
        var days = getDaysBetween(article.createDate);
        html += '<div class="col-12 col-12-small"><section class="box">\n';
        html += '<a href="javascript:void(0);" class="image featured" style="height: 100px;overflow: hidden"><img src="images/pic0'+num+'.jpg" alt="" style="margin-top: -'+marginTop+'%;"/></a>\n';
        html += '<header><h3>'+article.title+'</h3><p>'+(days == 0 ? "Posted today" : "Posted "+days+" days ago")+'</p></header>\n';
        html += '<p>xxxx.</p>\n';
        html += '<footer><ul class="actions">\n';
        html += '<li><a href="#articles/article?url='+article.fileUrl+'&openWay='+article.openWay+'" class="button icon solid fa-file-alt">Continue Reading</a></li>\n';
        html += '</ul></footer>\n';
        html += '</section></div>\n';
    });
    $("#blogList").html(html);
};

/**
 * 文章页数据加载
 */
var article = () => {
    var url = $.getQueryParam('url') || "";
    var openWay = $.getQueryParam('openWay') || "";
    if (!(url&&openWay)) {
        alert("无法获取文章，将返回主页");
        window.location.replace("index.html");
        return;
    }
    if (openWay == "md"){
        var md = window.markdownit();
        $.get(url).then((response) => {
            var content = response;
            var result = md.render(content);
            $(".markdown-body").html(result);
        });
    } else if (openWay == "iframe") {
        var iframe = '<iframe name="myframe" src="'+url+'" width="100%" onload="this.height=myframe.document.body.scrollHeight" scrolling="no"></iframe>';
        $(".markdown-body").html(iframe);
    }
};

/**
 * 距当前日期计算
 */
var getDaysBetween = (date) =>{
    var date1Str = date.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
    //根据年 . 月 . 日的值创建Date对象
    var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
    var t1 = date1Obj.getTime();
    var t2 = (new Date()).getTime();
    var dateTime = 1000*60*60*24; //每一天的毫秒数
    var minusDays = Math.floor(((t2-t1)/dateTime));//计算出两个日期的天数差
    var days = Math.abs(minusDays);//取绝对值
    return days;
};