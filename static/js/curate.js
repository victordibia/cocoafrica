var userEmail = "" ;
$(function () {
    /**
     * Manage visualization curation interface
     * 
     */

     lastHoverTime = new Date();
     


     setInterval(function(){
        currentTime = new Date()
        if ( (currentTime - lastHoverTime)/1000 > 2 ){
            $(".hoverrig").fadeOut();
        }
     }, 4000)
      

     var searchpage = 1 ;
    
     $(".previousnavbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val()*1) - 1;
        if (searchpage > 0){
            loadSearchResults();
        }
    })
    $(".nextnavbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val()*1) + 1 ;
        if (searchpage > 0){
            loadSearchResults();
        }
    })

    $(".imagesearchbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val()*1) || 1
        loadSearchResults();
    })

    // Hover event for images
    $('body').on('mouseenter', '.imageresultimg', function () {
        lastHoverTime = new Date();
        $(".hoverrig").show()
        // alert($(this).parent().find(".imagehovermenu").html())
        $(this).parent().find(".imagehovermenu").show();
        imgurl = $(this).attr("src")
        leftOffset = ($(this).offset().left +  $(this).width()+ $(".hoverrigimg").innerWidth()) > $(window).width() ? ($(this).offset().left - $(".hoverrigimg").innerWidth() - 10) : ($(this).offset().left + $(this).width() + 10)
        topOffset = ($(this).offset().top - $(document).scrollTop()+ $(".hoverrigimg").innerWidth() ) > $(window).height() ? ($(this).offset().top - $(".hoverrigimg").innerWidth() +  $(this).height() ) : $(this).offset().top
        // console.log($(document).scrollTop(), ($(this).offset().top + $(".hoverrigimg").innerWidth() ).toFixed(2) , $(window).height()   )
        $(".hoverrigimg").attr("src", imgurl)
        $(".hoverigcaption").text($(this).attr("data-title"));
        $("div.hoverrig").offset({
            left: leftOffset,
            top: topOffset
        });

        // console.log($(this).attr("data-title"))
    });

    $('body').on('mouseout', '.imageresultimg', function () {
        // $("div.hoverrig").hide()
        $(this).parent().find(".imagehovermenu").hide();
    });

    $('body').on('click', '.imageresultimg', function () {
        console.log($(this).attr("data-id"))
        var imageparams = {
            "sort": $(".sortdropdowntext").text() ,
            "searchterm": $(".searchinputbox").val() || "lagos nigeria",
            "page": searchpage,
            "id": $(this).attr("data-id"),
            "curatedbyuser": userEmail
        }
        imageself = $(this)
        console.log(imageparams);

        $.ajax({
            url: "/curateimage",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(imageparams)
        }).done(function (result) { 
            imageself.parent().fadeOut()
            $(".hoverrig").hide()
        }).fail(function (xhr, status, error) {
            showNotification("Server Error. ", status, error + ". You might have to try again later.")
        });
        
        
    });

    $('body').on('contextmenu', '.imageresultimg', function (event) {
        console.log("intercepted right click")
        $(this).parent().fadeOut()
        $(".hoverrig").hide()
        return false
    });


    function loadSearchResults() {
        showLoading("#graph_loading_overlay")
        $(".curatephotos#photos").empty()

        sortparam = $(".sortdropdowntext").text() 
        
        var payload = {
            "searchtext": $(".searchinputbox").val() || "lagos nigeria",
            "numresults": 300,
            "page": searchpage,
            "sort": sortparam,
        }
        // console.log(payload)
        // Load vlSpec from Server
        $.ajax({
            url: "/search",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload)
        }).done(function (result) {
            hideLoading("#graph_loading_overlay");
            console.log(result)
            resultstatus = " of " + result.searchresults.pages + " ( " + result.searchresults.total + "  total )"
            $(".searchstatus").text(resultstatus);
            $(".pagenumberinputbox").val(result.searchresults.page);
            result.searchresults.photo.forEach(function (each) {
                $vizsubbox = $("<div id='" + "divid" + "' class='eachimagebox'>" +
                    "<img class='imageresultimg' src= '" + each.url_n + "'  data-title= '" + each.title + "' data-id='" + each.id + "'  />" +
                    // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                    "</div>");
                $(".curatephotos#photos").append($vizsubbox)
            });

        }).fail(function (xhr, status, error) {
            $(".vizbox").fadeOut("slow");
            hideLoading("#graph_loading_overlay");
            showNotification("Server Error. ", status, error + ". You might have to try again later.")
        });
    }

});

function onSigninFail() {
    alert("failsingin")
}
// Google Sign in client side
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    userEmail = profile.getEmail()  

    var nameemail = profile.getName() + " (" + profile.getEmail() + ")"
    $(".username").text(nameemail);
    $(".signoutbuttontext").text("Sign out " + profile.getName() )
    $(".presignin").fadeOut("fast", function () {
        $(".postsignin").fadeIn()
    })
    // 


    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    verifyToken(id_token);
};

function verifyToken(id_token){
    var payload = {"token": id_token}
    $.ajax({
        url: "/verifytoken",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload)
    }).done(function (result) { 
        console.log("token login status", result)
    }).fail(function (xhr, status, error) {
        showNotification("Server Error. ", status, error + ". You might have to try again later.")
    });
    // console.log("ID Token: " + id_token);
}

$(".usersignoutlink").click(function () {

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        $(".postsignin").fadeOut()
        $(".presignin").fadeIn()
    });
})