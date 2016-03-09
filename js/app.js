var isShare=false;
(function ($, window) {
    // returnID保存图片ID值;
    var returnID,
        shareID,
        recid = 0, //保存需要上传的音频的本地ID
        recording = false,
        serverId = 0; //保存服务器返回语音Id值;
    $(function () {
        app.init();
        playAudio();
        TrackWeb("loading");
    });
    /* 初始化一些函数 */

    var isman = false, timer3 = null;

    function initFunc() {

        $(".p1_04,.p1_05,#p1 .man,#p1 .women").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            timer3 && clearInterval(timer3);
            var val = $(this).data("sex");
            if (val == "man") {
                isman = true;
            } else if (val == "women") {
                isman = false;
            }
            initPage2(val);
            picsTab();
        });

        $(".ruleBtn").off("touchstart").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#rulePage").fadeIn();
        });

        $("#btnclosetnc").off("touchstart").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#rulePage").fadeOut();
        });

        $("#closeBtn").off("touchstart").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            GetTicket();
            //$("#sharePage1").fadeOut();
        });

        $("#p3_returnBtn,#p4_returnBtn").off().on("touchstart",function(e){
            e.stopPropagation();
            e.preventDefault();
            $("#p3,#p4").fadeOut();
            $("#p2").fadeIn();
        })


        //选取照片，或选择拍照
        $("#upload1,#upload2").off("change").on("change", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#p2").fadeOut();
            $("#p4").fadeIn();
            TrackWeb(e.target.id+":xuanzaopian");
            app.getUrlData(e);
        });

        $("#sureBtn").off().on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#p2").fadeOut();
            $("#p3").fadeIn();
            console.log(curInfosIndex);
            music.pause();
            $("#audioBtn").removeClass("on");
            var number = 4 - curInfosIndex;
            if (isman) {
                if (curInfosIndex == 0) {
                    number = 2;
                } else if (curInfosIndex == 1) {
                    number = 1;
                } else if (curInfosIndex == 2) {
                    number = 4;
                } else if (curInfosIndex == 3) {
                    number = 3;
                }
            }
            TrackWeb("isman:"+isman+"; number:"+number);
            $("#theOne").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_theOne_0" + number + ".jpg");
        })

        $("#mark1").off().on("touchstart touchend", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $(".sureAudioBtnMark").off().on("touchstart touchend", function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("sureAudioBtnMark");
            return false;
        });

        $("#markPage .closebtn").off().on("touchstart",function(e){
            e.stopPropagation();
            e.preventDefault();
            $("#markPage").fadeOut();
        })

        /*document.body.addEventListener("touchstart",function(e){
         e.preventDefault();
         */
        /*e.stopPropagation();*/
        /*
         },false)*/

        $("#p4_sureBtn").off("touchstart").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#tips").show();
            //调后台接口，保存图片;
            var canvas = app.can;
            var ctx = app.ctx;
            $("#p4_returnBtn").remove();
            var img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0);

                var encoder = new JPEGEncoder();
                var wishCard = encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), 80);
                console.log(wishCard);

                $.post("api/index.php?m=weibo&c=interface&a=setuserinfo", {
                    type: 5,
                    pic: wishCard
                }, function (data, status) {
                    returnID = (data.match(/\d+/))[0];
                    console.log(returnID);
                    $("#p4_sureBtn,#p4_alignBtn,#upload2,#tips").fadeOut(400);
                    $(".p4_01,.p4_startRecording,#mark1,.p4_pressBtn,.daofu").fadeIn();
                });
            };
            img.src = "p4_card.png";
            TrackWeb("zixuan");
            /*var wishCard = canvas.toDataURL("image/jpeg");*/


        });
        /* ----------- P3页，确定按钮 -------- */
        $("#p3 .p3_sureAudioBtn").off().on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            // 需要停止的音频的本地ID，由stopRecord接口获得
            wx.stopVoice({
                localId: recid
            });
            $(".sureAudioBtnMark").fadeIn();
            var typeValue;
            if (isman) {
                if (curInfosIndex == 0) {
                    typeValue = 2;
                } else if (curInfosIndex == 1) {
                    typeValue = 1;
                } else if (curInfosIndex == 2) {
                    typeValue = 4;
                } else if (curInfosIndex == 3) {
                    typeValue = 3;
                }
            } else {
                typeValue = 4 - curInfosIndex;
            }
            TrackWeb("xuanmorenluyin");
            console.log(typeValue);
            //上传语音，上传成功后，在提交请求
            wx.uploadVoice({
                localId: recid, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    serverId = res.serverId; // 返回音频的服务器端ID

                    $.post("api/index.php?m=weibo&c=interface&a=setuserinfo", {
                        type: typeValue,
                        aid: serverId
                    }, function (data, status) {
                        if(data.su=="n"){
                            alert("请勿重复提交")
                            return;
                        }else{
                            shareID = (data.match(/\d+/))[0];
                            console.log(shareID);
                            sharelink = "http://uniqlo.hdtmedia.com/20160104/player/index.html?id=" + shareID;
                            SetShare();
                            isShare=true;
                            $("#p3").fadeOut();
                            $("#sharePage").fadeIn();
                        }
                    })
                }
            });

        });
        /* ----------- P4页，确定按钮 -------- */
        $("#p4 .p4_sureAudioBtn").off().on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            TrackWeb("xuanshangchuanluyin");
            // 需要停止的音频的本地ID，由stopRecord接口获得
            wx.stopVoice({
                localId: recid
            });
            $(".sureAudioBtnMark").fadeIn();
            //上传语音，上传成功后，在提交请求
            wx.uploadVoice({
                localId: recid, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    serverId = res.serverId; // 返回音频的服务器端ID

                    $.post("http://uniqlo.hdtmedia.com/20160104/api/index.php?m=weibo&c=interface&a=upuserinfo", {
                        id: returnID,
                        aid: serverId
                    }, function (data, status) {
                        shareID = (data.match(/\d+/))[0];
                        console.log(shareID);
                        sharelink = "http://uniqlo.hdtmedia.com/20160104/player/index.html?id=" + shareID;
                        SetShare();
                        isShare=true;
                        $("#p4").fadeOut();
                        $("#sharePage").fadeIn();
                    })
                }
            });
        });

        var timer1, timer2,lastTimes=0;
        /* --------点击长按添加语音祝福 开始录音 ---------- */
        $(".pressBtn").on("touchstart", function (e) {
            e.preventDefault();
            e.stopPropagation();
            music.pause();
            lastTimes=new Date()*1;
            $("#audioBtn").removeClass("on");
            console.log(12, recording);
            $(".startRecording").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/press_btn.png");
            $(".countTimes").show();
            var $timeText = $(".countTimes>span");
            if (!recording) {
                wx.startRecord();
                console.log(recording);
                recording = true;
                $timeText.empty().append("15秒");
                var timeLen = 15;
                timer2 = setInterval(function () {
                    timeLen--;
                    if (timeLen >= 0) {
                        var value = timeLen + "秒";
                        $timeText.empty().append(value);
                    } else {
                        clearInterval(timer2);
                    }
                }, 1000)
                //只能录制15秒，超过15秒后结束录音;
                timer1 = setTimeout(function () {
                    timer2 && clearInterval(timer2);
                    $timeText.empty().append("");
                    wx.stopRecord({
                        success: function (res) {
                            recid = res.localId;
                            recording = false;
                        }
                    });
                    $(".countTimes,.startRecording,.pressBtn").fadeOut();
                    $(".sureAudioBtn,.alignRecBtn,.playAudioBtn").fadeIn();
                    clearTimeout(timer1);
                }, 15000);
            }
            ;
            return false;
        });
        /* -------- 松开按钮 停止录音---------- */
        $(".pressBtn").off("touchend").on("touchend", function (e) {
            e.preventDefault();
            e.stopPropagation();
            timer1 && clearTimeout(timer1);
            timer2 && clearInterval(timer2);
            var curTimes=new Date()*1;
            wx.stopRecord({
                success: function (res) {
                    recid = res.localId;
                    recording = false;
                }
            });
            if((curTimes-lastTimes)<=1000){
                recording = false;
                $(".countTimes").hide();
                $(".startRecording").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/startRecording.png");
                $("#markPage").fadeIn();
                //alert("亲，录音时间不能少于一秒哟！");
            }else{
                recording = false;
                $(".countTimes,.startRecording,.pressBtn").fadeOut();
                $(".sureAudioBtn,.alignRecBtn,.playAudioBtn").fadeIn();
            };

        });
        /* -------- 点击播放语音按钮 播放语音---------- */
        $(".playAudioBtn").off().on("touchstart", function (e) {
            e.preventDefault();
            e.stopPropagation();
            wx.playVoice({
                localId: recid // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            $(".playAudioBtn").addClass("on");
            wx.onVoicePlayEnd({
                success: function (res) {
                    $(".playAudioBtn").removeClass("on");
                }
            });
            return false;
        });
        /* --------点击重录按钮 返回开始录音界面 ---------- */
        $(".alignRecBtn").off().on("touchstart", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(".sureAudioBtn,.alignRecBtn,.playAudioBtn").fadeOut(400, function () {
                $(".startRecording").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/startRecording.png").fadeIn();
                $(".playAudioBtn").removeClass("on");
                $(".pressBtn").show();
                recording = false;
            });
        });
    };



    /* ---------- p2页面陈坤或倪妮推倦衣服切换 ------------ */
    var curInfosIndex = 0;

    function picsTab() {
        if (isman) {
            var infosCon = document.querySelector("#p2 .clothesCon>ul.man");
        } else {
            var infosCon = document.querySelector("#p2 .clothesCon>ul.women");
        }
        /*var infosCon = document.querySelector("#p2 .clothesCon>ul");*/
        var elemWidth = $(".singleClose").width();
        var length = $(infosCon).find("li").size();

        var isMouseDown = false, startX = 0, curX = 0, lenX = 0, endX = 0, startLeft = 0;

        infosCon.addEventListener("touchstart", startHander1, false);

        $("#p2_prev_btn,#p2_next_btn").off("touchstart").on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var val = parseFloat($(this).data("goto"));
            goIndex1(val);
        });

        function startHander1(e) {
            e.stopPropagation();
            if (!isMouseDown) {
                isMouseDown = true;
                startX = e.touches[0].pageX;
                startLeft = parseFloat($(infosCon).css("margin-left"));
                infosCon.addEventListener("touchmove", moveHander1, false);
                infosCon.addEventListener("touchend", endHander1, false);
            }
        }

        function moveHander1(e) {
            e.stopPropagation();
            e.preventDefault();
            if (isMouseDown) {
                curX = e.changedTouches[0].pageX;
                lenX = curX - startX;
                var nextLeft = startLeft + lenX;
                $(infosCon).css("margin-left", nextLeft);
            }
        }

        function endHander1(e) {
            e.stopPropagation();
            if (isMouseDown) {
                endX = e.changedTouches[0].pageX;
                lenX = endX - startX;
                if (lenX > 50) {
                    goIndex1(-1);
                } else if (lenX < -50) {
                    goIndex1(1);
                } else {
                    goIndex1(0);
                }
                infosCon.removeEventListener("touchmove", moveHander1, false);
                infosCon.removeEventListener("touchend", endHander1, false);
            }
        }

        function goIndex1(desc) {
            curInfosIndex += desc;
            var left = -elemWidth - curInfosIndex * elemWidth;
            if (curInfosIndex == -1) {
                curInfosIndex = length - 3;
            } else if (curInfosIndex == (length - 2)) {
                curInfosIndex = 0;
            }
            desc != 0 && infoShowFunc(curInfosIndex);
            TweenMax.to(infosCon, 0.5, {
                "marginLeft": left,
                onComplete: function () {
                    isMouseDown = false;
                    if (desc != 0) {
                        var left = -elemWidth - curInfosIndex * elemWidth;
                        $(infosCon).css("margin-left", left);
                        console.log(curInfosIndex);
                        if (curInfosIndex == 4) {
                            $("#upload1").show();
                            $("#sureBtn").fadeOut(200);
                        } else {
                            $("#upload1").hide();
                            $("#sureBtn").fadeIn(200);
                        }
                    }
                }
            })
        }

        var $theInfo = $("#p2 .info");

        function infoShowFunc(num) {
            $theInfo.removeClass("infoHide infoShow").addClass("infoHide").one("animationend webkitAnimationEnd", function (e) {
                e.stopPropagation();
                e.preventDefault();
                var number = num + 1;
                if (isman) {
                    if (num == 0) {
                        number = 3
                    } else if (num == 1) {
                        number = 4
                    } else if (num == 2) {
                        number = 1
                    } else if (num == 3) {
                        number = 2
                    } else if (num == 4) {
                        number = 5
                    }
                }
                $theInfo.find("img").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_0" + number + ".png");
                $(this).addClass("infoShow");
            })
        }
    }

    var music = null;

    function playAudio() {
        music = new Audio("http://minires.hdtmedia.com/uniqlo20160104//resources/audio.mp3");
        music.autoplay = true;
        music.loop = true;
        var audioBtn = $("#audioBtn");
        music.addEventListener("canplaythrough", function () {
            audioBtn.addClass("on");
            audioBtn[0].addEventListener("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (music.paused) {
                    music.play();
                    audioBtn.addClass("on");
                } else {
                    music.pause();
                    audioBtn.removeClass("on");
                }
                return false;
            })
        });
    };

    function initPage2(sex) {
        $("#p2 .person>img").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_person_" + sex + ".png");
        $("#p1").fadeOut();
        /*var elemWidth = $(".singleClose").width();
         $(".clothesCon>ul").css("margin-left", -elemWidth * (curInfosIndex + 1));
         $("#p2 .info>img").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_0" + (curInfosIndex + 1) + ".png");*/
        if (isman) {
            $("#p2 .info>img").attr("src", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_03.png");
        }
        $(".clothesCon ul").hide();
        $("ul." + sex).show();
        $("#p2>").css("opacity", 0);
        $("#p2").fadeIn(400, showPage2);
    }

    function showPage1() {
        var durt = 0.5;
        TweenMax.to($(".p1_man"), 0.3, {
            delay: durt,
            opacity: 1,
            ease: Linear.easeIn
        });
        TweenMax.to($(".p1_women"), 0.3, {
            delay: durt + 0.3,
            opacity: 1,
            ease: Linear.easeOut
        })
        TweenMax.to($(".p1_01"), 0, {
            bottom: "+=50",
            delay: durt + 0.6,
            onComplete: function () {
                TweenMax.to($(".p1_01"), 0.3, {
                    bottom: "-=50",
                    opacity: 1,
                    ease: Linear.easeOut
                })
            }
        })
        TweenMax.to($(".p1_02"), 0.2, {
            delay: durt + 0.9,
            opacity: 1,
            ease: Linear.easeIn
        })
        TweenMax.to($(".p1_03"), 0, {
            delay: durt + 1.1,
            scaleX: 0,
            scaleY: 0,
            onComplete: function () {
                TweenMax.to($(".p1_03"), 0.2, {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    ease: Linear.easeIn
                })
            }
        });
        TweenMax.to($(".p1_04,.p1_05"), 0, {
            bottom: "-=50"
        })
        TweenMax.staggerTo($(".p1_04,.p1_05"), 0.4, {
            delay: durt + 1.3,
            bottom: "+=50",
            opacity: 1,
            ease: Linear.easeIn
        }, 0.2);
        var $stars = $("#p1 .stars");
        var num = 0;
        setTimeout(function () {
            $stars.eq(0).show().addClass("playStar");
            timer3 = setInterval(function () {
                num++;
                $stars.removeClass("playStar").eq(num).addClass("playStar");
                console.log(num);
                if (num >= 3) {
                    num = -1;
                }
            }, 800)
        }, 2200)
    }

    function showPage2() {
        var durt = 0.5;
        TweenMax.to($(".clothesCon"), 0.3, {
            delay: durt,
            opacity: 1,
            ease: Linear.easeIn
        });
        TweenMax.to($(".person"), 0.3, {
            delay: durt + 0.6,
            opacity: 1,
            ease: Linear.easeIn
        });
        TweenMax.to($(".info"), 0.2, {
            delay: durt + 0.8,
            opacity: 1,
            ease: Linear.easeIn
        });

        TweenMax.staggerTo($(".p2_01,#p2_prev_btn,#p2_next_btn,#sureBtn"), 0.6, {
            delay: durt + 1,
            opacity: 1,
            ease: Linear.easeIn
        }, 0.2);
        TweenMax.to($("#sureBtn"), 0.5, {
            delay: durt + 1.6,
            opacity: 1,
            ease: Linear.easeIn
        });
    }

    var app = {

        init: function () {
            app.can = document.getElementById("canvas");
            app.ctx = app.can.getContext("2d");
            app.can.width = 496;
            app.can.height = 815;
            app.loadFunc();
        },
        loadFunc: function () {
            var curPicIndex = 0;

            function imgLoad() {
                curPicIndex++;
                var per = Math.ceil(100 * (curPicIndex / imgs.length)) + "%";
                $(".loadnum").empty().append(per);
                /* 图片预加载完毕调用下一步 */
                if (curPicIndex >= imgs.length) {
                    app.getSure();
                }
            }

            if (true) {
                var imgs = [ "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_bg.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_02.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_03.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_btn_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_btn_02.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_man.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p1_women.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_bg.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_btn_sure.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_btn_upload.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_closees_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_closees_02.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_closees_03.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_closees_04.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_closees_05.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_02.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_03.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_04.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_info_05.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_person_man.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_person_women.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_prev_btn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p2_next_btn.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_card.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_countTimes_bg.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_playAudio_btn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_theOne_01.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_theOne_02.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_theOne_03.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p3_theOne_04.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/startRecording.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_bg.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_btn_01.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_btn_02.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_countTimes_bg.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_playAudio_btn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/playAudio_btn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/pngBg.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/press_btn.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/ruleBtn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/tnc.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/tncback.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/alignRec_btn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/btnclosetnc.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/closeBtn.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/countTimes_bg.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/loadicon.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/loadlight.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/logo.png",
                    "http://minires.hdtmedia.com/uniqlo20160104/resources/img/sharePage_bg.jpg", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_card.png", "p4_card.png", "http://minires.hdtmedia.com/uniqlo20160104/resources/img/p4_playAudio_btn_2.png"
                ];
                var len = imgs.length;
                for (var i = 0; i < len; i++) {
                    var img = new Image();
                    img.onload = imgLoad;
                    img.src = imgs[i];
                }
            } else {
                app.getSure();
            }
        },
        getSure: function () {
            $.get("getwx.php", {
                siteurl: location.href
            }, function (json) {
                if (json.result == 1) {
                    SetWeixin(json.appid, json.timestamp, json.noncestr, json.signature);
                    app.renderDOM();
                } else {
                    alert("微信授权错误");
                }
            }, "json");
            //app.renderDOM();
        },
        renderDOM: function () {
            $("#loadPage").fadeOut();
            $("#p1>img").not(".ruleBtn").css("opacity", 0);
            $("#p1").fadeIn(400, function () {
                showPage1();
                TrackWeb("p1");
            });
            initFunc();
        },
        getUrlData: function (e) {
            if (!e.target || !e.target.files.length || !e.target.files[0]) {
                return;
            }
            var _file = e.target.files[0];
            if (typeof window.FileReader === "function" || typeof window.FileReader === "object") {
                var oFile = new FileReader();
                var passFileType = /^(?:image\/bmp|image\/gif|image\/jpeg|image\/png)$/i;
                if (!passFileType.test(_file.type)) {
                    return;
                }
                oFile.onload = function (oFREvent) {
                    console.log(1, oFREvent);
                    var img = new Image();
                    app.img = img;
                    app.island = false;
                    app.lenX = 0;
                    app.lenY = 0;
                    app.scaleDistance = 1;
                    app.scaleAngle = 0;
                    img.onload = function () {
                        EXIF.getData(_file, function () {
                            var orient = EXIF.getTag(this, "Orientation");
                            if (orient == 6) {
                                app.scaleDistance = app.can.width / img.height;
                                app.lenY = (app.can.height - img.width) / 2;
                                app.lenX = (img.height - app.can.width) / 2;
                                app.scaleAngle = 90;
                                app.island = true;
                            } else {
                                app.scaleDistance = app.can.width / img.width;
                                app.lenX = (app.can.width - img.width) / 2;
                                app.lenY = (app.can.height - img.height ) / 2;
                                app.scaleAngle = 0;
                            }
                            app.drawImageInCanvas();
                            console.log(app.scaleAngle, orient);
                        });
                    };
                    img.src = oFREvent.target.result;
                };
                oFile.readAsDataURL(_file);
            }
        },
        drawImageInCanvas: function () {
            app.setImageInCanvas();
            app.dealWithImg();
        },
        dealWithImg: function () {
            var content = document.getElementById("content");
            var startX = 0, startY = 0, curX = 0, curY = 0, lastdistance = 0, lastangle = 0, curdistance = 0, curangle = 0, isMousedown = false;
            content.addEventListener("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();
                lastdistance=-1;
                lastangle=-1;
                if (e.touches.length == 1) {
                    if (!isMousedown) {
                        isMousedown = true;
                        //app.scaleDistance=1;
                        startX = e.touches[0].pageX;
                        startY = e.touches[0].pageY;
                    }
                } else if (e.touches.length == 2) {
                   // lastdistance = getDistance(e.touches[0], e.touches[1]);
                   // lastangle = getAngle(e.touches[0], e.touches[1]);
                }
            }, false);

            content.addEventListener("touchmove", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (e.touches.length == 1) {
                    if (isMousedown) {

                        curX = e.changedTouches[0].pageX;
                        curY = e.changedTouches[0].pageY;
                        app.lenX += (curX - startX) / app.scaleDistance;
                        app.lenY += (curY - startY) / app.scaleDistance;
                        app.setImageInCanvas();
                        startX = curX;
                        startY = curY;
                    }
                } else if (e.touches.length == 2) {

                    curdistance = getDistance(e.changedTouches[0], e.changedTouches[1]);
                    curangle = getAngle(e.changedTouches[0], e.changedTouches[1]);
                    if(lastdistance<0){
                        lastdistance=curdistance;
                        lastangle=curangle;
                    }

                    app.scaleDistance *= (curdistance / lastdistance);
                    app.scaleAngle += (curangle - lastangle);
                    app.setImageInCanvas();
                    lastdistance = curdistance;
                    lastangle = curangle;
                }
            }, false);

            content.addEventListener("touchend", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isMousedown = false;
                /*if (e.touches.length == 0) {
                 isMousedown = false;
                 //app.setImageInCanvas();
                 } else if (e.touches.length == 1) {
                 curX = e.changedTouches[0].pageX;
                 curY = e.changedTouches[0].pageY;
                 }*/
            }, false);
            function getDistance(tc1, tc2) {
                var x = tc2.pageX - tc1.pageX;
                var y = tc2.pageY - tc1.pageY;
                return Math.sqrt(x * x + y * y);
            }

            function getAngle(tc1, tc2) {
                var x = tc2.pageX - tc1.pageX;
                var y = tc2.pageY - tc1.pageY;
                return 180 * Math.atan2(y, x) / Math.PI;
            }
        },
        setImageInCanvas: function () {
            var w = app.can.width, h = app.can.height;
            app.ctx.clearRect(0, 0, w, h);
            app.ctx.save();
            /*app.ctx.setTransform(1, 0, 0, 1, 0, 0);*/
            app.ctx.translate(w / 2, h / 2);
            app.ctx.scale(app.scaleDistance, app.scaleDistance);
            app.ctx.rotate(app.scaleAngle * Math.PI / 180);
            app.ctx.translate(-w / 2, -h / 2);
            if (app.island == false) {
                app.ctx.translate(app.lenX, app.lenY);
            } else {
                app.ctx.translate(app.lenY, -1 * app.lenX);
            }
            app.ctx.drawImage(app.img, 0, 0);
            app.ctx.restore();
        }
    }
    window.app = app;
})(jQuery, window);

function GetTicket() {
    if(isShare){
        TrackWeb("GetTicket");
        window.location.href = "http://uniqlo.hdtmedia.com/20160104/ticket/index.html";
    }else{
        return false;
    }
}