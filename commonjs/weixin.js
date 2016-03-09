var sharetitle="[有明星@你] 陈坤倪妮和你拜早年";
var sharedesc='教你穿新衣💓！还有红包啊🎁！';

var shareimg="http://minires.hdtmedia.com/uniqlo20160104/img/share.jpg";
var sharelink="http://uniqlo.hdtmedia.com/20160104/index.php";
var isweixin=false;

function SetWeixin(appid,timestamp,noncestr,sign){
    wx.config({
        debug: false,
        appId: appid, // 必填，公众号的唯一标识
        timestamp:timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名，见附录1
        jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice'

        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.error(function(res){

        console.log("wxerror:"+res.errMsg);
        $("#loadword").empty().append("初始化失败");
    });


    wx.ready(function(){
        $("#loadword").empty().append("初始化完成");
        isweixin=true;
       // LoadComplete();
        SetShare();


    });
   // LoadComplete();

}



function SetShare(){
    //alert(sharedesc);
    //alert(navigator.userAgent);
    if(isweixin){
        wx.onMenuShareTimeline({
            title: sharedesc, // 分享标题
            link: sharelink, // 分享链接
            imgUrl: shareimg, // 分享图标
            success: function () {
                TrackWeb("sharetimeline");
                ShowQR();

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });


        wx.onMenuShareAppMessage({
            title: sharetitle, // 分享标题
            desc: sharedesc, // 分享描述
            link: sharelink, // 分享链接
            imgUrl: shareimg, // 分享图标
            type:"link", // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                TrackWeb("sharefriend");
                ShowQR();

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    }

}


function CheckWxVersion(){
    var s=navigator.userAgent.toLowerCase();
    var a = s.match(/micromessenger\/(\d+\.\d+\.\d+)/) || s.match(/micromessenger\/(\d+\.\d+)/);
    var w=a ? a[1] :"";
   // alert("wx version:"+w);
    return "6.0.2"<=w;


}