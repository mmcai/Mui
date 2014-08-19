var $tabs = $(".mui-tabs");
$tabs.each(function () {
    var
            $this = $(this),
            $tabToggle = $this.find(".tabs-hd li a"),
            $tabBody = $this.find(".tabs-panel");
    $tabToggle.on("click", function (i) {
        var
                $that = $(this),
                $ind = $that.parent().index();

        $this.find(".tabs-hd a").removeClass("active");
        $that.addClass("active");

        $this.find(".tabs-panel").removeClass("active");
        $this.find(".tabs-panel").eq($ind).addClass("active");

    });
});