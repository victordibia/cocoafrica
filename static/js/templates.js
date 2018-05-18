/*
Load template for page layout
Author: Victor Dibia <victor.dibia@gmail.com>
*/

var selectedtab = "project"
var pagesection
$(function () {
    // $("#sidebar").load("sidebar.html", function(){
    setupPage()


})

// Show Loading Spinner
function showLoading(element) {
    $(element).fadeIn("slow")
}
// Hide Loading Spinner
function hideLoading(element) {
    $(element).fadeOut("slow")
}

function checkPageSectionLoad() {
    pagesection = $(".pagesection").html()
    if (pagesection === undefined) {
        checkPageSectionLoad()
        console.log("notloaded")
    } else {
        console.log("page loaded", pagesection)

    }
}

function setupPage() {
    hideLoading("#graph_loading_overlay")
    selectedtab = getHash() || selectedtab
    // alert(selectedtab)
    // alert (  selectedtab + $("a.sidelink").html())
    $(".sidebarlinks").removeClass("sidebarselected")
    $("a.sidelink#" + selectedtab).parent().addClass("sidebarselected")



    $(".pagesection").hide() 
    selectedtab = getHash() || selectedtab
    $(".pagesection#" + selectedtab).show()

    $(".sidelink").click(function (e) {
        e.preventDefault();
        $(".sidebarlinks").removeClass("sidebarselected")
        $("a#" + $(this).attr("id")).parent().addClass("sidebarselected")
        clickedSection = $(".pagesection#" + $(this).attr("id"))
        window.location.hash = '#'+$(this).attr("id");
        $(".pagesection").hide()
        clickedSection.show()
    })


}

function getHash() {
    var hash = null;
    if (window.location.hash) {
        hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    }
    return hash
}

// show Notification
function showNotification(title, subtitle, caption){

    $(".toasttemplate").find(".bx--toast-notification__title").text(title)
    $(".toasttemplate").find(".bx--toast-notification__subtitle").text(subtitle)
    $(".toasttemplate").find(".bx--toast-notification__caption").text(caption)

    toastInstance = $( ".toasttemplate").clone()
    toastInstance.removeClass("toasttemplate")
    
    toastInstance.hide().appendTo( ".toastDivBox" )
    toastInstance.fadeIn("slow")
    toastInstance.find(".bx--toast-notification__close-button").click(function() {
        $(this).parent().fadeOut("slow", function(){
            $(this).remove()
        })
       
    });
}
 