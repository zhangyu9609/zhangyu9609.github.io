
$(() => {
    // 首页加载
    $('#footer').load('html/footer.html',function(responseTxt,statusTxt,xhr){
        if(statusTxt=='success'){
            latestBlog();
        }
    });
    router($.getHash());
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
    $('html,body').animate({scrollTop:0},0);
    $(".current").removeClass("current");
    if (hash == "articles/article") {
        $("#articles").addClass("current");
    }else {
        $("#"+hash).addClass("current");
    }
    // 使用switch判断hash的值是多少
    switch(hash){
        case 'index' :
            $('#main').load('html/indexMain.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#banner").show();
                    index();
                }
            });
            break;
        case 'articles' :
            $('#main').load('html/articleListMain.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#banner").hide();
                    articleList();
                }
            });
            break;
        case 'articles/article' :
            $('#main').load('html/articleMain.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#banner").hide();
                    article();
                }
            });
            break;
        case 'me' :
            $('#main').load('html/meMain.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#banner").hide();
                    testMe();
                }
            });
            break;
        case 'canvas' :
            $('#main').load('html/canvas.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#banner").hide();
                }
            });
            break;
        default :
            $('#main').load('html/indexMain.html',function(responseTxt,statusTxt,xhr){
                if(statusTxt=='success'){
                    $("#index").addClass("current");
                    $("#banner").show();
                    index();
                }
            });
    }
};

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
        // html += '<li><a href="javascript:void(0);" class="button alt icon solid fa-comment">33 comments</a></li>\n';
        html += '</ul></footer>\n';
        html += '</section></div>\n';
    });
    $("#blogTypes").html(html);
};

/**
 * 最新博客底部显示
 * @param name
 */
var latestBlog = (name) =>{
    var blogTypes = [];
    var articles = [];
    $.ajaxSettings.async = false;
    $.getJSON("assets/blogs/blogsConfig.json", (data) => {
        blogTypes = data.blogTypes || [];
        blogTypes.forEach((blogType,index) => {
            $.getJSON("assets/blogs/"+blogType.type+".json", (result) => {
                articles = articles.length == 0 ? (result.articles || []) : articles.concat((result.articles || []));
                articles = articles.sort((a,b)=>{
                    var i = new Date(a.createDate).getTime();
                    var j = new Date(b.createDate).getTime();
                    return j - i;
                })
            });
        })
    });
    $.ajaxSettings.async = true;
    var html = "";
    for (var i = 0; i < 3; i++){
        var date = articles[i].createDate.split("-");
        html += '<li><span class="date">'+date[0]+' <strong>'+date[1]+'.'+date[2]+'</strong></span>\n';
        html += '<h3><a href="#articles/article?url='+articles[i].fileUrl+'&openWay='+articles[i].openWay+'" >'+articles[i].title+'</a></h3>';
        html += '<p>'+(articles[i].describe).slice(0,30)+'...</p>\n';
        html += '</li>\n';
    }
    $("#latestBlog").html(html);
};

/**
 * 文章列表页数据加载
 * @param name
 */
var articleList = (name) =>{
    var articles = [];
    $.ajaxSettings.async = false;
    var type = $.getQueryParam('type') || "frontEnd";
    $.getJSON("assets/blogs/"+type+".json", (result) => {
        $("#blogType").text("BlogType - "+result.type);
        $("#blogDescribe").text(result.describe);
        articles = result.articles || [];
        if (name){
            articles = articles.filter(item => (item.title.toUpperCase()).indexOf(name.toUpperCase()) != -1 );
        }
        articles = articles.sort((a,b)=>{
            var i = new Date(a.createDate).getTime();
            var j = new Date(b.createDate).getTime();
            return j - i;
        })
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
        html += '<p>'+(article.describe).slice(0,30)+'...</p>\n';
        html += '<footer><ul class="actions">\n';
        html += '<li><a href="#articles/article?url='+article.fileUrl+'&openWay='+article.openWay+'" class="button icon solid fa-file-alt">Continue Reading</a></li>\n';
        html += '</ul></footer>\n';
        html += '</section></div>\n';
    });
    $("#blogList").html(html);
};

/**
 * 文章搜索
 */
var searchArticle = () => {
    var name = $("#searchName").val();
    articleList(name);
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

/**
 * testMe
 */
var testMe = () =>{
    var md = window.markdownit();
    $.get("assets/blogs/resume.md").then((response) => {
        var content = response;
        var result = md.render(content);
        $(".markdown-body").html(result);
    });
};