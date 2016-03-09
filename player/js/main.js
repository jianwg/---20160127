
var picloaded=0;
var lastheight=0;


var mytoken;

function QueryString()
{
    var name, value, i;
    var str = location.href;
    var num = str.indexOf("?")
    str = str.substr(num + 1);
    var arrtmp = str.split("&");
    for ( i = 0; i < arrtmp.length; i++) {
        num = arrtmp[i].indexOf("=");
        if (num > 0) {
            name = arrtmp[i].substring(0, num);
            value = arrtmp[i].substr(num + 1);
            this[name] = value;
        }
    }
}

var Request = new QueryString();
var id=Request["id"];
var showshare=Request["share"];

$(function(){

    InitAll();

    onResize();
    $(window).bind("resize",onResize);

});

function onResize(){
    if($(window).height()<=960){

        $("body").css("height",1138);
        $(".panels").css("height",1138);
    }else{
        $("body").css("height",$(window).height());
        $(".panels").css("height",$(window).height());
    }

}

function InitAll(){
    if(id==""||isNaN(id)){
        alert("数据错误");
    }else{

        $.get("../getwx.php",{siteurl:location.href},function(json){

            if(json.result==1){
                SetWeixin(json.appid,json.timestamp,json.noncestr,json.signature);
                GetData();
            }else{
                alert("微信授权失败");
            }

        },"json");

    }

    GetData();

}


function GetData(){


    $.getJSON("../api/index.php?m=weibo&c=interface&a=getinfo&id="+id,null,function(json){
        if(json.headimgurl==""||json.headimgurl==null){

            $(".userhead").attr("src","http://minires.hdtmedia.com/uniqlo20160104/player/assets/images/default-avatar.jpg");
        }else{
            $(".userhead").attr("src",json.headimgurl);
        }

        if(parseInt(json.pid)<=4){
            ShowIdol(json.pid,json.aid);
        }else{
            ShowUser(json.pic,json.aid);
        }

        $("#loading").fadeOut();

    });



    $(".btndiy").unbind("click").bind("click",function(){
       TrackWeb("godiy");
        setTimeout(function(){
           location.href="../index.php";
        },200);
    });

}



function ShowIdol(id,vid){
    $("#panelidols").addClass("idol"+id).fadeIn();

    $("#panelidols .btnhear").unbind("click").bind("click",function(){
        wx.downloadVoice({
            serverId: vid, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var locid = res.localId; // 返回音频的本地ID
                wx.playVoice({
                    localId: locid
                });
                $("#panelidols .btnhear").removeClass("on").addClass("on");
                wx.onVoicePlayEnd({
                    success: function (res) {
                        $("#panelidols .btnhear").removeClass("on");
                    }
                });
            }
        });
    });
    TrackWeb("showidol");
}


function ShowUser(photo,vid){
    $("#userpic").attr("src",photo);
    $("#paneldiy").fadeIn();
    $("#paneldiy .btnhear").unbind("click").bind("click",function(){
        wx.downloadVoice({
            serverId: vid, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var locid = res.localId; // 返回音频的本地ID
                wx.playVoice({
                    localId: locid
                });
                $("#paneldiy .btnhear").removeClass("on").addClass("on");
                wx.onVoicePlayEnd({
                    success: function (res) {
                        $("#paneldiy .btnhear").removeClass("on");
                    }
                });
            }
        });

    });
    TrackWeb("showdiy");
}



function GetTicket(){

}