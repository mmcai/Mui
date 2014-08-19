/*  Js  弹出框 dialog
    作者：mmcai
    制作时间：2013-8-13
    插件描述：在页面弹出一个层，弹出框中的内容可以是html可以是一个url地址

#region

    wxDialog.show({
        id:""   弹出层的ID值
        title:"", //属性存在且不为空，弹出层则带标题，否则不带标题
        content:"",//属性不存在则为空，属性值可以是HTML字符串，jQuery对象，URL地址（同域或其它域）。
        move:""//布尔值，默认为false不可拖动，为true则可以拖动
        maskLayout:""//布尔值，默认为ture显示遮罩层，为false则不可以拖动，属性值也可以是对象｛｝
                              //color可以定义遮罩层的背景色，close：点击遮罩层是否关闭弹出层，fullScreen：是否遮罩整个浏览器窗口
        skin:""//皮肤样式后期添加——暂无
        confirm:null   //属性存在，则显示确定按钮，可取值为一个布尔值，ture表示点击关闭弹出层，false表示不关闭， 主要参数是一个对象{}，
                             //val：可以自定义确定按钮上面的字，close：点击按钮是否关闭弹出层（true&&false）， after：表示
                             //dialog关闭后执行的回调事件，before：表示关闭前执行的回调函数
        cancel:null     //属性存在，则显示取消按钮，可取值为一个布尔值，ture表示点击关闭弹出层，false表示不关闭， 主要参数是一个对象{}，
                             //val：可以自定义确定按钮上面的字，close：点击按钮是否关闭弹出层（true&&false）， after：表示
                             //dialog关闭后执行的回调事件，before：表示关闭前执行的回调函数
        width:""    //设置弹出层的宽度
        height:""   //设置弹出的高度
        follow:""    //属性存在则跟随触发的元素对象，0，3，6，9表示四个方向上右下左 ，默认在下方。也可以是一个对象｛｝
                       //elem:dom对象或者是jquery对象（跟随的对象），position:number——暂无
        fixed:""    //属性存在则显示在浏览器窗口的上下左右四个位置，1,2,4,5(看小键盘，分别表示左下，右下，右上，左上)——暂无
        single:""   //页面上所有的弹出层是否公用一个界面框架，取值布尔值，true表示是，false表示否 默认为false——暂无
        button:""   //弹出层按钮对象{｝,
        callback://当内容为URL地址的时候，此方法才有效
        data:""//参数字符串或参数数组
    });

    wxDialog.show("你好");

    var myDialog = new wxDialog({
        
    });

    myDialog.setTitle("");  //设置修改标题的内容——暂无
    myDialog.setContent(""); //设置修改弹出层的内容——暂无
    myDialog.getPosition(); //获取弹出层的位置坐标——暂无

    wxDialog.tip({});——暂无
    wxDialog.confirm({});——暂无
    参考资料artDialog——http://www.planeart.cn/demo/artDialog/
    jquery-plugin-boxy——http://onehackoranother.com/projects/jquery/boxy/
#endregion */

; (function (w, d, $) {

    //把window对象传递进来，不用每次读取window对象，加快脚本的执行顺序
    var
            that = d,
            self = top == self && self || top,
            document = self.document,
            $count = 0,
            $document = $(document),
            $window = $(w),
            $html = $("html"),
            $zIndex = 1000,
            $unique = "wxDialog" + (new Date().getTime());

    //定义wxDialog类
    wxDialog = function (config) {

        config = config || {};

        var
                $this = this,
                $default = wxDialog.defaults;

        //参数是一个字符串的情况
        if (typeof config === "string" || config.nodeType === 1) {
            config = { content: config }
        }

        //复制参数
        for (var k in $default) {
            if (config[k] === undefined) config[k] = $default[k];
        }

        //遮罩层是全屏，还是Ifram页面
        if (config.maskInner) {
            //console.log(window)
        }

        if (config.single) {
            $cacheId = "wxDialogBox";
        } else {
            $cacheId = "wxDialog" + $count;
        }

        config.id = config.id && config.id || $cacheId;

        var partner = {
            id: config.id,
            mask: "mask" + config.id
        }

        wxDialog.list[config.id] = partner;
        if (config.callback) {
            wxDialog.list[config.id].callback = config.callback;
        }

        //按钮默认处理
        if (config.button === undefined) config.button = [];

        var
                $confirm = config.confirm,
                $cancel = config.cancel;


        $confirm !== undefined && config.button.push({
            val: typeof ($confirm == "object") && $confirm.val || "确定",
            close: typeof ($confirm == "object") && $confirm.close || $confirm,
            className: "confirmBtn",
            after: typeof ($confirm == "object") && $confirm.after || null,
            before: typeof ($confirm == "object") && $confirm.before || null
        });

        $cancel !== undefined && config.button.push({
            val: typeof ($cancel) == "object" && $cancel.val || "取消",
            close: typeof ($cancel) == "object" && $cancel.close || $cancel,
            className: "cancelBtn",
            after: typeof ($cancel == "object") && $cancel.after || null,
            before: typeof ($cancel == "object") && $cancel.before || null
        });

        //拖动
        if (config.move === undefined) config.move = false;

        //遮罩层
        var $masklayout = config.maskLayout;

        if ($masklayout && typeof ($masklayout) === "object") {
            $masklayout.color = $masklayout.color && $masklayout.color || "#fff";
            $masklayout.close = $masklayout.close && $masklayout.close || false;
            $masklayout.opacity = $masklayout.opacity && $masklayout.opacity || 0.6;
        }
        //弹出层-层级
        config.zIndex = config.zIndex || $zIndex;

        //跟随
        var $follow = config.follow;

        if (typeof ($follow) === "number") {
            config.follow = {};
            config.follow.position = $follow;
            config.follow.elem = $elem;
        }

        if ($follow && typeof ($follow) === "object") {
            $follow.position = $follow.position && $follow.position || 6;
            $follow.elem = $follow.elem && $follow.elem || $elem;
        }

        $zIndex += 10;
        $count++;
        return new wxDialog.fn.init(config);
    };

    wxDialog.show = function (config) {
        new wxDialog(config);
    };

    //删除所有弹出层
    wxDialog.hide = function () {
        var
                $this = this,
                $dialogArray = wxDialog.list;

        for (var k in $dialogArray) {
            if ($dialogArray[k] && typeof ($dialogArray[k]) === "object") {
                for (var i in $dialogArray[k]) {
                    $("#" + $dialogArray[k][i]).remove();
                }
            }
        }
    };

    //删除指定弹出层
    wxDialog.close = function () {
        var
            $dialogPanel = wxDialog.list[arguments[0]].id,
            $maskPanel = wxDialog.list[arguments[0]].mask,
            $maskLayer = $("#" + $maskPanel);

        $dialogPanel && $("#" + $dialogPanel).remove();
        if ($maskLayer.length) {
            $maskLayer.remove();
        } else {
            var $innerMask = document.getElementById("js_iframe").contentWindow.document.getElementById($maskPanel);
            $innerMask.parentNode.removeChild($innerMask);
        }
    }

    //弹出层回调函数队列
    wxDialog.callback = function () {
        var
                $this = this,
                $callback = wxDialog.list[arguments[0].id].callback,
                $data = arguments[0].data;

        $callback($data);
        $this.close(arguments[0].id);
    };

    //存放弹出层的数组对象
    wxDialog.list = {};
    wxDialog.M_timeOut = null;


    wxDialog.fn = wxDialog.prototype = {
        init: function (opt) {

            if (document.getElementById(opt.id)) {
                this.show(opt.id, opt);
                return;
            }

            this.config = opt;

            var
                    $this = this,
                    $wrap = this.dialogLayout = this.creat(),
                    $dialog = $($wrap),
                    $dialogHead = $dialog.find(".dialog-header"),
                    $dialogBody = $dialog.find(".dialog-content"),
                    $dialogFoot = $dialog.find(".dialog-button"),
                    $callback = opt.callback;

            opt.id && $wrap.setAttribute("id", opt.id);
            $dialog.css({ "z-index": opt.zIndex });

            this.title(opt); //标题
            this.content(opt); //内容
            this.button(opt); //按钮
            this.bindEvent(opt);//绑定事件


            if (opt.width) {
                $dialogBody.width(opt.width);  //设置内容宽度
                $dialogHead.width(opt.width + 10);
                $dialogFoot.width(opt.width + 10);
            }
            if (opt.height) {
                $dialogBody.height(opt.height);//设置内容高度
            }

            this.setPosition(opt); //设置位置

            if (opt.move && !opt.follow) { //是否拖动
                $dialogHead.css("cursor", "move");
                $wrap.onmousedown = function (event) {
                    $this.drag(event, opt);
                }
            }

            opt.maskLayout && $this.maskShow(opt); //遮罩层
            opt.follow && $this.follow(opt);//是否跟随


            if ($callback && typeof ($callback) === "function") {
                wxDialog.list[opt.id].callback = $callback;
            }



            return this;
        },
        title: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $titleVal = $config.title || null,
                    $dialog = $($this.dialogLayout),
                    $title = $dialog.find("h2"),
                    $close = $dialog.find(".dialog-close");

            if ($titleVal != null) {
                $title.html($titleVal);
            } else {
                $title.hide();
                $close.css("border", "none");
            }
        },
        content: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $contentVal = $config.content || null,
                    $type = typeof ($contentVal),
                    $dialog = $($this.dialogLayout),
                    $body = $dialog.find(".dialog-content"),
                    $loading = $dialog.find(".dialog-loading");

            console.log($this);
            //参数
            if ($config.data && typeof ($config.data) === "object") {
                $contentVal = $this.sethash($config);
            }

            //填充内容
            if ($contentVal == null || $type != "string") return;

            //URL地址的正则表达式
            var patten = /[a-zA-Z0-9]+\.aspx|[a-zA-Z0-9]+\.html|[a-zA-Z0-9]+:\/\/[^\s]*/g


            if ($contentVal.match(patten) != null) {
                var
                        iframe = document.createElement("iframe"),
                        framebody = document.getElementById("Js_dialogContent");

                if ($contentVal.match(/[a-zA-Z]+:\/\/[^\s]*/g) != null) {
                    //内容是一串URL地址
                    iframe.src = $contentVal;
                }
                else if ($contentVal.match(/^\/[a-zA-Z0-9]+(\/[a-zA-Z0-9]+)*\.aspx$/) != null) {

                    //内容路径从根目录开始
                    var
                            $href = window.location.href,
                            $pathname = window.location.pathname,
                            $resultHref = $href.replace($pathname, "");
                    iframe.src = $resultHref + $contentVal;

                }
                else {

                    //默认在当前目录
                    if (document.getElementsByTagName("iframe").length != 0) {
                        var
                                $href = document.getElementsByTagName("iframe")[0].src,
                                hrefTop = $href.slice(0, $href.lastIndexOf("/") + 1);
                        iframe.src = hrefTop + $contentVal;
                    } else {

                        var
                                ref = window.location.href,
                                refNum = ref.lastIndexOf("/"),
                                hrefTop = ref.slice(0, refNum + 1);

                        iframe.src = hrefTop + $contentVal;
                    }
                }

                if (iframe.attachEvent) {//判断iframe中的内容是否加载完成
                    iframe.attachEvent("onload", function () {
                        $loading.hide();
                    });
                }
                else {
                    iframe.onload = function () {
                        $loading.hide();
                    };
                }
                //framebody.innerHTML = "";
                framebody.appendChild(iframe);
            }
            else {

                //一般字符串
                $loading.hide();
                $body.html($contentVal);
            }
        },
        button: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $contentVal = $config.content || null,
                    $type = typeof ($contentVal),
                    $dialog = $($this.dialogLayout),
                    $button = $dialog.find(".dialog-button"),
                    $Len = $config.button.length;

            if ($Len == 0) { $button.hide(); return; }

            $button.show();
            if (typeof ($config.button) !== "object") return;
            $.each($config.button, function (i, o) {
                $button.append("<input type='button' class='dialogBtn " + o.className + "' value='" + o.val + "' />");
                var $btn = $dialog.find("." + o.className);
                $btn.bind("click", function () {
                    o.close && o.before && o.before.apply($dialog, arguments); //窗口关闭前执行
                    o.close && $this.hide($config);
                    o.close && o.after && o.after.apply($dialog, arguments); //窗口关闭后执行
                });
            });

        },
        bindEvent: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $dialog = $($this.dialogLayout),
                    $close = $dialog.find(".dialog-close");

            //点击关闭弹出框
            $close.click(function () {
                $this.hide($config);
            });

            //弹出层随窗口大小更改位置
            $(window).resize(function () {
                if (wxDialog.M_timeOut != null) clearTimeout(wxDialog.M_timeOut);
                wxDialog.M_timeOut = window.setTimeout(function () {
                    if (!$config.follow) {
                        $this.setPosition($config);
                    }
                    $this.setSize($config);
                }, 500);
            });
        },
        drag: function (event) { //拖动
            var
                    $this = this,
                    $config = arguments[1],
                    $dragElem = $this.dialogLayout,
                    $dialog = $($this.dialogLayout);

            if (!event) event = window.event;

            var
                    startX = event.clientX,
                    startY = event.clientY;
            var
                    origX = $dragElem.offsetLeft,
                    origY = $dragElem.offsetTop;
            var
                    deltaX = startX - origX,
                    deltaY = startY - origY;

            //注册事件
            if (document.addEventListener) {
                //把事件绑定到document上面，而不是元素上面
                //事件注册方式是捕获形式
                document.addEventListener("mousemove", moveHandler, true);
                document.addEventListener("mouseup", upHandler, true);
            } else if (document.attachEvent) {
                $dragElem.setCapture(); //
                $dragElem.attachEvent("onmousemove", moveHandler);
                $dragElem.attachEvent("onmouseup", upHandler);
                $dragElem.attachEvent("onloseCapture", upHandler);
            } else {
                var oldmoveHandler = document.onmousemove;
                var oldupHandler = document.onmouseup;
                document.onmousemove = moveHandler;
                document.onmouseup = upHandler;
            }

            if (event.stopPropagation) event.stopPropagation();
            else event.cancelBubble = true;

            if (event.preventDefault) event.preventDefault();
            else event.returnValue = false;

            //移动
            function moveHandler(e) {
                if (!e) e = window.event;
                var
                        resX = e.clientX - deltaX,
                        resY = e.clientY - deltaY,
                        scrW = document.documentElement.clientWidth,
                        scrH = document.documentElement.clientHeight,
                        layW = $dragElem.clientWidth,
                        layH = $dragElem.clientHeight;

                if (resX < 0) resX = 0;
                if (resY < 0) resY = 0;

                if (resX + layW - scrW > 0) resX = scrW - layW;
                if (resY + layH - scrH > 0) resY = scrH - layH;

                $dragElem.style.left = resX + "px";

                $dragElem.style.top = resY + "px";

                if (e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
            }

            //松开鼠标
            function upHandler(e) {
                if (!e) e = window.event;
                if (document.removeEventListener) {
                    document.removeEventListener("mouseup", upHandler, true);
                    document.removeEventListener("mousemove", moveHandler, true);
                }
                else if (document.detachEvent) {
                    $dragElem.detachEvent("onlosecapture", upHandler);
                    $dragElem.detachEvent("onmouseup", upHandler);
                    $dragElem.detachEvent("onmousemove", moveHandler);
                    $dragElem.releaseCapture();
                }
                else {
                    document.onmouseup = oldupHandler;
                    document.onmousemove = oldmoveHandler;
                }

                if (e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
            }
        },
        creat: function () { //创建弹出层
            var self = self == top ? self : top,
                wrap = document.createElement("div"),
                $frame = self.document.getElementsByTagName("body")[0];
            wrap.className = "wx-dialog";
            wrap.innerHTML = wxDialog.template;
            $frame.insertBefore(wrap, $frame.firstChild);

            return wrap;
        },
        setPosition: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $dialog = $("#" + $config.id),
                    $scrWid = document.documentElement.clientWidth,
                    $scrHei = document.documentElement.clientHeight,
                    $wid = $dialog.width(),
                    $hei = $dialog.height(),
                    $resW = ($scrWid - $wid) / 2,
                    $resH = ($scrHei - $hei) / 2;

            $dialog.css({ "left": $resW + "px", "top": $resH + "px" });
        },
        setSize: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $maskId = wxDialog.list[$config.id].mask,
                    $mask = $("#" + $maskId),
                    $flag = $mask.length,
                    $wid = document.documentElement.clientWidth,
                    $hei = document.documentElement.clientHeight;

            if (!$flag) return;
            $mask.css({ "width": $wid + "px", "height": $hei + "px" });
        },
        maskCreat: function () {

            var
                    $this = this,
                    $config = arguments[0],
                    $id = $config.id,
                    $mask = document.createElement("div"),
                    $maskId = wxDialog.list[$id].mask,
                    $body = document.getElementsByTagName("body")[0];


            $mask.setAttribute("id", $maskId);
            $mask.style.display = "none";
            $mask.style.position = "absolute";
            $mask.style.left = "0px";
            $mask.style.top = "0px";
            $mask.style.background = $config.maskLayout.color && $config.maskLayout.color || "#000";
            $mask.style.width = document.documentElement.clientWidth + "px";
            $mask.style.height = document.documentElement.clientHeight + "px";
            $mask.style.zIndex = "900";

            if (!Brower.IE) {
                $mask.style.opacity = $config.maskLayout.opacity && $config.maskLayout.opacity || "0.6";
            } else {
                $mask.style.filter = $config.maskLayout.opacity ? "alpha(opacity=" + $config.maskLayout.opacity * 100 + " )" : "alpha(opacity=60 )";
            }

            $body.appendChild($mask, $body.firstChild);
            $body.style.overflow = "hidden";

            $("#" + $maskId).bind("click", function () {
                if ($config.maskLayout.close) {
                    $this.hide($config);
                }
            });

            return $mask;
        },
        maskShow: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $maskId = wxDialog.list[$config.id].mask,

                    $mask = $("#" + $maskId),
                    $flag = $mask.length;

            if (!$flag) {
                var $maskLayout = $this.maskCreat($config);
                $($maskLayout).show();
            } else {
                $mask.show();
            }
        },
        maskHide: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $body = document.getElementsByTagName("body")[0],
                    $maskId = wxDialog.list[$config.id].mask,
                    $mask = $("#" + $maskId),
                    $flag = $mask.length;



            if (!$flag) return;

            $("#" + $maskId).remove();
            //document.getElementById($maskId).style.display = "none";
            $body.style.overflow = "auto";
        },
        show: function () {
            var
                    $this = this,
                    $dialog = arguments[0],
                    $config = arguments[1];

            document.getElementById($dialog).style.display = "block";

            $this.setPosition($config);

            $config.follow && $this.follow($config);

            if ($config.maskLayout) {
                $this.maskShow($config);
            }

            $this.content($config);

        },
        hide: function () {
            var
                $this = this,
                $config = arguments[0],
                $flag = $("#" + $config.id).find("iframe").length,
                $maskflag = $config.maskLayout;

            if (!$flag) {
                $($this.dialogLayout).remove();
            }
            else {
                var
                        $dialogPanel = wxDialog.list[$config.id].id,
                        $callback = wxDialog.list[$config.id].callback,
                        $maskPanel = wxDialog.list[$config.id].mask;

                $dialogPanel && $("#" + $dialogPanel).remove();
                //$maskPanel && $("#" + $maskPanel).remove();

                $this.maskHide($config);
            }

            if ($maskflag) {
                $this.maskHide($config);
            }
        },
        follow: function () {
            var
                    $this = this,
                    $config = arguments[0],
                    $follow = $config.follow,
                    $dialog = $("#" + $config.id),
                    $followElem = $($follow.elem),
                    $position = $follow.position,
                    $posX = $followElem.offset().left,
                    $posY = $followElem.offset().top,
                    $elemWid = $followElem.width(),
                    $elemHei = $followElem.height(),
                    $bottomX = $posX,
                    $bottomY = $elemHei + $posY + 2;

            $dialog.css({ "left": $bottomX + "px", "top": $bottomY + "px" });

        },
        sethash: function () {
            //设置hash值
            var
                    $config = arguments[0],
                    $href = $config.content,
                    $data = $config.data;

            if ($href.indexOf("?") != -1) {
                for (var k in $data) {
                    $href += "&" + k + "=" + $data[k];
                }
            } else {
                $href += "?";
                for (var k in $data) {
                    $href += k + "=" + $data[k] + "&";
                }
                $href = $href.substr(0, $href.length - 1);
            }

            return $href;
        }
    }


    wxDialog.fn.init.prototype = wxDialog.fn;

    //弹出层HTML模版
    wxDialog.template = "<div class='dialog-outer'><div class='dialog-inner'>";
    wxDialog.template += "<div class='dialog-header'><h2 id='Js_dialogTitle' class='dialog-title'></h2><a id='Js_dialogClose' class='dialog-close' href='javascript:void(0);' title='关闭'>&times;</a></div>";
    wxDialog.template += "<div class='dialog-body' id='Js_dialogBody'><div class='dialog-body-inner'><div class='dialog-content' id='Js_dialogContent'></div><div class='dialog-loading'></div></div></div>";
    wxDialog.template += "<div class='dialog-button' id='Js_dialogButton'></div>";
    wxDialog.template += "</div></div>";

    //默认参数
    wxDialog.defaults = {
        //maskLayout: false//遮罩层，默认为false
        //button: []
        //id: "Js_dialog",//默认的id值，不要更改
        //className: "",//用户动态修改显示的样式
        // dataType: "",//弹出框内容类型,可取值：html,
        //content: "",//弹出框的内容,可以是Jquery对象字符串,也可以是一段HTML片段或者是iframe:
        //title: "",//弹出框标题
        //        width: "",//弹出框的宽度，可设置数字和auto
        //     height: "",//弹出框的高度，可设置数字和auto（auto是根据内容的大小自动设置)
        //move: "",//是否可以拖动，默认是false，不可以拖动
        // confirm: true,//确定按钮点击执行回调函数,可取值null,function(){},布尔值(true,false)
        //  cancel: false,//取消按钮点击执行回调函数,可取值同上
        //confirmVal: "",//确定按钮显示的文字
        //cancelVal: "",// 取消按钮默认显示的文字
        // button: null//用户可以自定义配置页面的按钮，可以设置确定按钮，取消按钮，普通按钮，按钮点击事件
        single: false
    };


    //判断浏览器
    var Brower = wxDialog.Browser = (function () {
        var ua = navigator.userAgent;
        var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
        return {
            IE: !!window.attachEvent && !isOpera,
            Opera: isOpera,
            Webkit: ua.indexOf('AppleWebKit/') > -1,
            Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
            MobileSafari: /Apple.*Mobile/.test(ua)
        }
    })();

    //把函数开放出去
    w.wxDialog = wxDialog;

})(window, document, jQuery);