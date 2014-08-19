$(function () {
    var
            $nav = $("#nav"),
            $main = $("#main"),
            $navTab = $("#navTab"),
            $body = $("#body");

    $body.delegate("a[rel=extend]", "click", function (e) {
        var
                $this = $(this),
                $href = $this.attr("href"),
                $target = $this.attr("target"),
                $title = $this.text(),
                $filejs = $this.attr("data-js"),
                $id = $this.attr("data-id"),
                $panelBody = $id + "Panel",
                $panelNav = $id + "Tab";

        $navTab.find("a").removeClass("active");
        $navTab.find(".drop-nav a").removeClass("active");

        //如果该选项卡页面已经打开，直接显示该选项卡页面，加载相关的JS文件

        if ($("#" + $panelNav).length > 0) {

            $("#" + $panelNav).addClass("active");
            $main.find(".page-panel").hide();
            $("#" + $panelBody).show();

        } else {
            //创建页面选项卡



            $navTab.find(".nav-btn").hide();
            $navTab.find("ul:first").append("<li class='tabs-nav'><a class='active' data-id='" + $id + "' id='" + $panelNav + "' href='javascript:void(0)' title='" + $title + "'><i class='fa fa-file-text-o'></i>" + $title + "<i class='close'>&times;</i></a></li>")
            $navTab.find("dl").append("<dd class='drop-nav'><a class='active' data-id='" + $id + "' href='javascription:void(0);' title='" + $title + "'>" + $title + "</a></dd> ")

            if ($navTab.find("ul:first li").length > 7) {
                $navTab.find("ul").css("width", $navTab.find("ul:first li").length * 121 + 6 + "px");
                $navTab.find(".nav-btn").show();
                var
                        $ml = parseInt($navTab.find("ul").css("marginLeft")),
                        $movepx = $ml - 121 + "px";
                $navTab.find("ul").animate({ marginLeft: $movepx });

            }



            //删除上次存在的iframe
            if ($("#frame").length > 0) {
                $("#frame").remove();
            }

            //打开页面的方式target=iframe,target=navTab
            if ($target == "" || $target == undefined || $target == "navTab") {

                var _frame = document.createElement("iframe");
                _frame.setAttribute("id", "frame");
                _frame.setAttribute("name", "frame");
                _frame.src = $href;
                document.getElementById("body").appendChild(_frame);

                var $frame = document.getElementById("frame");

                //$frame//判断iframe中的内容是否加载完成
                if ($frame.attachEvent) {
                    $frame.attachEvent("onload", function () {
                        var _html = $frame.contentDocument.getElementById("body").innerHTML;
                        $main.append("<div class='page-panel " + $id + "-panel' id='" + $panelBody + "' data-id='" + $id + "'>" + _html + "</div>");
                        $main.find(".page-panel").hide();
                        $("#" + $panelBody).show();

                    });
                }
                else {
                    $frame.onload = function () {
                        var _html = $frame.contentDocument.getElementById("body").innerHTML;
                        $main.append("<div class='page-panel' id='" + $panelBody + "'  data-id='" + $id + "'>" + _html + "</div>");
                        $main.find(".page-panel").hide();
                        $("#" + $panelBody).show();
                    };
                }

                //创建脚本
                if ($filejs != "" || $filejs != undefined) {
                    var $script = document.createElement("script");
                    $script.setAttribute("src", "/js/page/" + $filejs);
                    $script.setAttribute("id", $id + "Script");
                    $(document).append($script);
                }

            } else if ($target == "iframe") {
                var _html = "<iframe class='iframe-panel' height='100%' width='100%'  name='" + $panelBody + "' frameborder='no' onscroll='auto' src='" + $href + "'></iframe>";
                $main.append("<div class='page-panel " + $id + "-panel' id='" + $panelBody + "' data-id='" + $id + "'>" + _html + "</div>");
                $main.find(".page-panel").hide();
                $("#" + $panelBody).show();
            }
        }
        e.stopPropagation();
        e.preventDefault();

    });

    //切换选项卡页面
    $navTab.delegate("ul:first a", "click", function () {
        var
                $this = $(this),
                $id = $this.attr("data-id");

        $navTab.find("a").removeClass("active");
        $this.addClass("active");

        $navTab.find(".drop-nav a").removeClass("active");
        $navTab.find(".drop-nav a[data-id=" + $id + "]").addClass("active");

        $main.find(".page-panel").hide();
        $("#" + $id + "Panel").show();
    });

    //关闭选项卡页面
    $navTab.delegate("a .close", "click", function (e) {
        var
                $this = $(this),
                $that = $this.parent(),
                $prev = $this.parents("li").prev().find("a"),
                $prevId = $prev.attr("data-id"),
                $prevTab = $("#" + $prevId + "Tab"),
                $prevBody = $("#" + $prevId + "Panel"),
                $next = $this.parents("li").next().find("a"),
                $id = $that.attr("data-id"),
                $panelBody = $("#" + $id + "Panel");

        if ($next.length > 0) {
            $("#" + $next.attr("data-id") + "Tab").addClass("active");
            $("#" + $next.attr("data-id") + "Tab").trigger("click");

        } else {
            $prevTab.addClass("active");
            $navTab.find("li:first a").trigger("click");
        }


        $that.parent("li").remove();
        $panelBody.remove();
        $("#" + $id + "Script").remove();

        //删除下拉位置的代码
        $navTab.find("a[data-id=" + $id + "]").parent().remove();

        
        //删除的时候滚动部分的代码
        if ($navTab.find("ul:first li").length >= 7) {
            $navTab.find("ul").css("width", $navTab.find("ul:first li").length * 121 + 6 + "px");
            var
                    $ulwid = parseInt($navTab.find("ul").css("width")),
                    $navtabsBox = parseInt($navTab.find(".tabsnav").css("width")),
                    $result = $ulwid - $navtabsBox,
                    $ml = parseInt($navTab.find("ul").css("marginLeft"));


            if ($result > 0 && $ml >= 0) {
                var
                        $ml = parseInt($navTab.find("ul").css("marginLeft")),
                        $movepx = $ml + 121 + "px";
                $navTab.find("ul").animate({ marginLeft: $movepx });
            }
        }

        if ($navTab.find("li").length <= 7) {
            $navTab.find(".nav-btn").hide();
        }

        e.stopPropagation();
        e.preventDefault();
    });

    //下拉的页面标签“全部关闭”
    $navTab.delegate(".closeNav", "click", function () {
        var
                $this = $(this);

        $navTab.find(".drop-nav").each(function () {
            var
                    $that = $(this),
                    $key = $that.find("a").attr("data-id");

            if ($that.hasClass("default-navs")) { return; }

            $("#" + $key + "Tab").parent().remove();
            $("#" + $key + "Panel").remove();
            $that.remove();

            $navTab.find("ul:first li:first a").trigger("click");
        });
    });

    //下拉的页面标签，切换页面
    $navTab.delegate(".drop-nav a", "click", function () {
        var $this = $(this), $key = $this.attr("data-id");
        $("#" + $key + "Tab").trigger("click");

        $(".drop-nav a").removeClass("active");
        $this.addClass("active");
    });

    //菜单左右切换
    $navTab.find(".nav-btn").on("click", function () {
        var $this = $(this);

        var
                $ulwid = parseInt($navTab.find("ul").css("width")),
                $navtabsBox = parseInt($navTab.find(".tabsnav").css("width")),
                $result = $ulwid - $navtabsBox,
                $ml = parseInt($navTab.find("ul").css("marginLeft"));

        if ($this.hasClass("nav-next")) {
            if (Math.abs($ml) === $result) return false;
            $ml = $ml - 121 + "px";
            $navTab.find("ul").animate({ marginLeft: $ml });
        } else {
            if ($ml == 0) return false;
            $ml = $ml + 121 + "px";
            $navTab.find("ul").animate({ marginLeft: $ml });
        }

    });
});

function closeTabsPanel(key) {

}