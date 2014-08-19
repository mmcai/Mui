/// <reference path="jquery.1.8.3.js" />
$dropdown = $(".dropdown");
$dropdown.each(function () {
    var
            $this = $(this),
            $toggle = $this.find(".drop-toggle"),
            $menu = $this.find(".drop-menu");

    $toggle.on("click", function (e) {

        if ($this.hasClass("open")) {
            $this.removeClass("open");
            $menu.hide();
        } else {
            $this.addClass("open");
            $menu.show();
        }

        e.stopPropagation();
        e.preventDefault();
    });

});

$(document).on("click", function () {
    if ($(".dropdown").hasClass("open")) {
        $(".dropdown").removeClass("open");
        $(".dropdown").find(".drop-menu").hide();
    }
});