/// <reference path="jquery.1.8.3.js" />
$(".tree").delegate("a","click", function () {
    var $that = $(this);
    $(".tree").find("a").removeClass("selected");
    $that.addClass("selected");
});

//带子菜单的折叠树
$(".tree-item").each(function (i) {
    var
            $this = $(this),
            $toggle = $this.find("a:first");

    $toggle.bind("click", function (e) {

        var
                $that = $(this),
                $menu = $that.next(".tree-menu");

        if ($that.closest("li").hasClass("open")) {
            $menu.hide();
            $this.removeClass("open");
            $that.removeClass("selected");
        } else {
            $menu.show();
            $this.addClass("open");
            $(this).addClass("selected");
        }

        e.stopPropagation();
        e.preventDefault();
    });
});
