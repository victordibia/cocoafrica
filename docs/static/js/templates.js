/*
Load template for page layout
Author: Victor Dibia <victor.dibia@gmail.com>
*/

$(function () {
    $("#sidebar").load("sidebar.html", function () {
        var selectedtab = "documentation"
        selectedtab = getHash() || selectedtab
        // alert (  selectedtab + $("a.sidelink").html())
        $(".sidebarlinks").removeClass("sidebarselected")
        $("a.sidelink#" + selectedtab).parent().addClass("sidebarselected")

    });


    $("#header").load("header.html");
    $("#footer").load("footer.html");

    $("#disqusbox").load("disqus.html");

    $("div.pagesection").each(function (index) {
        // console.log("hey", $(this).attr("id"))
        $(this).load($(this).attr("id") + ".html")
    });


    // Sidebar clicks to show/hide page sections


    $.getScript("static/js/masks.js", function (data, textStatus, jqxhr) {
        $(".pagesection").hide()
        selectedtab = "documentation"

        selectedtab = getHash() || selectedtab
        $(".pagesection#" + selectedtab).show()

        $(".sidelink").click(function () {
            $(".sidebarlinks").removeClass("sidebarselected")
            $("a#" + $(this).attr("id")).parent().addClass("sidebarselected")
            clickedSection = $(".pagesection#" + $(this).attr("id"))
            $(".pagesection").hide()
            clickedSection.show()
            // $(".pagesection").fadeOut("slow", function(){
            //     // $(".pagesection").hide()
            //     clickedSection.fadeIn("fast")
            // })

        })
    });

    function getHash() {
        var hash = null;
        if (window.location.hash) {
            hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        }
        return hash
    }
})

// Show Loading Spinner
function showLoading(element) {
    $(element).fadeIn("slow")
}
// Hide Loading Spinner
function hideLoading(element) {
    $(element).fadeOut("slow")
}