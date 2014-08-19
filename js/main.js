var source = $("#menu-template").html();
var template = Handlebars.compile(source);
var navHtml = template(datas);
$("#nav").find("ul").html(navHtml);