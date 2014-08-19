/* js plugins Js 插件
提示框*/
(function (w, $) {
    var wx_alert;
    if (wx_alert == undefined) wx_alert = {};

    wx_alert.show = function (opt) {
        return this.impl.init(opt);
    }
    wx_alert.hide = function () {
        return this.impl.hide();
    }
    wx_alert.A_timeout = null;
    wx_alert.A2_timeout = null;

    wx_alert.defaults = {
        id: "Js_alert",
        time: "2000",
        txt: "这里会开始是文字"
    }

    wx_alert.impl = {
        init: function (opt) {
            if (opt == '' || opt == undefined) opt = wx_alert.defaults;
            if (typeof (opt) != 'object') return;
            var opts = this.config = $.extend({}, wx_alert.defaults, opt);
            var lens = $("#" + opts.id).length;
            if (lens == 0) {
                this.creat();
            }
            this.show();
            this.bindEvent(opts.time);
            return this;
        },
        creat: function () {
            var self = this,
                opts = self.config,
                elem = $("#" + opts.id),
                len = elem.length,
                iframehtml = '';

            var htmlArr = '<div class="wx-alert" id="' + opts.id + '" style="display:none;" ><div id="Js_alertLeft" class="alert-left"></div>';
            htmlArr += '<div id="Js_alertCenter" class="alert-center"><span></span></div>';
            htmlArr += '<div id="Js_alertRIght" class="alert-right" ></div></div>';
            $("body").append(htmlArr);
        },
        bindEvent: function (time) {
            var
                    self = this;

            $(window).resize(function () {
                if (wx_alert.A2_timeout != null) clearTimeout(wx_alert.A2_timeout);
                wx_alert.A2_timeout = window.setTimeout(function () {
                    self.setStyle();
                }, time);
            });

            if (time == '' || time == undefined) return;

            //定时
            if (wx_alert.A_timeout != null) clearTimeout(wx_alert.A_timeout);
            wx_alert.A_timeout = window.setTimeout(function () {
                self.hide();
            }, time === 0 ? 10000 : time);

        },
        setStyle: function () {
            var
                    self = this,
                    opts = self.config,
                    wid = top.document.documentElement.clientWidth,
                    hei = top.document.documentElement.clientHeight,
                    $elem = $("#" + opts.id),
                    $w = $elem.outerWidth(),
                    $h = $elem.outerHeight();

            $elem.css({ left: (wid - $w) / 2 + "px", top: (hei - $h) / 2 + "px" });
        },
        show: function () {
            var
                    self = this,
                    opts = self.config,
                    $elem = $("#" + opts.id);

            if (opts.types == "loading") {
                $elem.find(".alert-left").hide();
                $elem.find(".alert-right").hide();
                $elem.find(".alert-center").hide();
                $elem.find("img.loading").remove();
                $elem.show().append("<img width='220px' src='/App_Themes/Frame/imgs/loading5.gif' alt='loading' class='loading' />");
               // self.maskshow();
            }
            else {
                $elem.find(".alert-left").show();
                $elem.find(".alert-right").show();
                $elem.find(".alert-center").show();
                $elem.find("img.loading").remove();
                $elem.find(".alert-center span").removeClass().addClass(opts.types).html(opts.txt).end().show();
               // self.maskhide();
            };
            if (wx_alert.A_timeout != null) clearTimeout(wx_alert.A_timeout);
            self.setStyle();
        },
        hide: function () {
            var self = this, opts = self.config, $elem = $("#" + opts.id);
            if ($elem) $elem.hide();
            self.maskhide();
        },
        maskshow: function () {
            var
                    self = this,
                    $mask = $("#Js_maskPanel"),
                    $body = $("body"),
                    maskString = "";
            if ($mask.length == 0) {
                maskString += "<div class='maskPanel' id='Js_maskPanel' style='position:absolute;top:0px; left:0px; right:0px; bottom:0px; background:#fff; opacity:0.5; filter:alpha(opacity=50); z-index:99; display:none;'></div>";
                $body.append(maskString);
                $mask.show();
            }
            $mask.bind("click", function () {
                self.hide();
            });
            $mask.show();
        },
        maskhide: function () {
            var $mask = $("#Js_maskPanel");
            if ($mask.length != 0) $mask.hide();
        }
    };

    wx_alert.impl.init.prototype = wx_alert.impl;

    w.wx_alert = wx_alert;
})(window, jQuery);
