
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?f9e3e13d902ee37b36b2ce177e86df25";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    })();


function TrackWeb(act){

    if(typeof(_hmt)!="undefined"){
        _hmt.push(['_trackEvent', "wapevent", act]);
    }
}
