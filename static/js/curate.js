var userEmail = "";
var idHolder = []
var imageData = {}
$(function () {
    /**
     * Manage visualization curation interface
     * 
     */

    lastHoverTime = new Date();



    setInterval(function () {
        currentTime = new Date()
        if ((currentTime - lastHoverTime) / 1000 > 2) {
            $(".hoverrig").fadeOut();
        }
    }, 4000)


    var searchpage = 1;

    $(".previousnavbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val() * 1) - 1;
        if (searchpage > 0) {
            loadSearchResults();
        }
    })
    $(".nextnavbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val() * 1) + 1;
        if (searchpage > 0) {
            loadSearchResults();
        }
    })

    $(".imagesearchbutton").click(function () {
        searchpage = ($(".pagenumberinputbox").val() * 1) || 1
        // alert("search")
        loadSearchResults();
    })

    // Download selected images
    $(".saveimagesbutton").click(function () {
        imageids = []
        idHolder.forEach(function (each) {
            imageids.push(imageData[each])
        })
        // console.log(imageids)
        var imageparams = {

            "searchterm": $(".searchinputbox").val() || "lagos nigeria",
            "searchsource": $(".searchsourcedropdowntext").text(),
            "imageids": imageids,
            "searchtags": {
                "page": searchpage,
                "searchsource": $(".searchsourcedropdowntext").text(),
                "searchterm": $(".searchinputbox").val() || "lagos nigeria",
                "sort": $(".sortdropdowntext").text(),
                "curatedbyuser": userEmail,
            }
        }

        // toggle selected

        // imageself = $(this)
        console.log(imageparams);

        $.ajax({
            url: "/saveimages",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(imageparams)
        }).done(function (result) {
            console.log(result)
            // imageself.parent().fadeOut()
            // $(".hoverrig").hide()
        }).fail(function (xhr, status, error) {
            showNotification("Server Error. ", status, error + ". You might have to try again later.")
        });
    })


    // Remove results with broken links
    $(".removebadimagesbutton").click(function () {
        removeBroken();
    })

    overlayHTML = "<div class='selectoverlay'> <div class='selectcontent'>&#10006;</div> </div>"
    $selectOverlay = $(overlayHTML);

    $('body').on('click', '.selectoverlay', function () {
        $(this).remove();
        updateSelectCount()
    });

    // Update the list of selected images each time selection event occurs
    function updateSelectCount() {
        idHolder = []
        $(".eachimagebox").not(":has(.selectoverlay)").each(function () {
            idHolder.push($(this).attr("id"))
        });
        $(".numselected").html(idHolder.length)
    }

    // Click event for each image
    $('body').on('click', '.imageresultimg', function () {
        $(this).parent().append($(overlayHTML))
        updateSelectCount()
    });

    // Select all check box toggle
    $(".selectalltoggle").change(function () {
        // removeBroken()
        if (this.checked) {
            $(".imageresultimg").parent().append($selectOverlay)
        } else {
            $(".selectoverlay").remove()
        }
        updateSelectCount()
    });

    // Remove all broken images that may have been deleted
    function removeBroken() {
        $('img.imageresultimg').each(function () {
            if (this.naturalWidth === 0 || this.naturalHeight === 0 || this.complete === false) {
                $(this).parent().fadeOut().remove()
            }
        });
        updateSelectCount()
    }

    // Hover event for images
    $('body').on('mouseenter', '.imageresultimg', function () {
        // lastHoverTime = new Date();
        // $(".hoverrig").show()
        // // alert($(this).parent().find(".imagehovermenu").html())
        // $(this).parent().find(".imagehovermenu").show();
        // imgurl = $(this).attr("src")
        // leftOffset = ($(this).offset().left + $(this).width() + $(".hoverrigimg").innerWidth()) > $(window).width() ? ($(this).offset().left - $(".hoverrigimg").innerWidth() - 10) : ($(this).offset().left + $(this).width() + 10)
        // topOffset = ($(this).offset().top - $(document).scrollTop() + $(".hoverrigimg").innerWidth()) > $(window).height() ? ($(this).offset().top - $(".hoverrigimg").innerWidth() + $(this).height()) : $(this).offset().top
        // // console.log($(document).scrollTop(), ($(this).offset().top + $(".hoverrigimg").innerWidth() ).toFixed(2) , $(window).height()   )
        // $(".hoverrigimg").attr("src", imgurl)
        // $(".hoverigcaption").text($(this).attr("data-title"));
        // $("div.hoverrig").offset({
        //     left: leftOffset,
        //     top: topOffset
        // });

        // console.log($(this).attr("data-title"))
    });

    $('body').on('mouseout', '.imageresultimg', function () {
        // $("div.hoverrig").hide()
        $(this).parent().find(".imagehovermenu").hide();
    });



    $('body').on('contextmenu', '.imageresultimg', function (event) {
        console.log("intercepted right click")
        // $(this).parent().fadeOut()
        $(".hoverrig").show()
        return false
    });




    function loadSearchResults() {
        showLoading("#graph_loading_overlay")

        // empty photos div
        $(".curatephotos#photos").empty()

        // uncheck toggle select all button
        $(".selectalltoggle").prop("checked", false)

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
            imageData = {}
            console.log("results:", result.searchresults.photo.length)
            resultstatus = " of " + result.searchresults.pages + " ( " + result.searchresults.total + "  total )"
            $(".searchstatus").text(resultstatus);
            $(".pagenumberinputbox").val(result.searchresults.page);
            result.searchresults.photo.forEach(function (each) {
                imageData[each.id] = {
                    "title": each.title,
                    "id": each.id,
                    "url": each.url_n
                };
                $vizsubbox = $("<div id='" + each.id + "' class='eachimagebox'>" +
                    "<img class='imageresultimg' src= '" + each.url_n + "'data-title= '" + each.title + "'data-id='" + each.id + "'  />" +
                    // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                    "</div>");
                $(".curatephotos#photos").append($vizsubbox)

            });

            $(".saveimagesbutton").prop('disabled', false);
            $(".removebadimagesbutton").prop('disabled', false);
            updateSelectCount()

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
    $(".signoutbuttontext").text("Sign out " + profile.getName())
    $(".presignin").fadeOut("fast", function () {
        $(".postsignin").fadeIn()
    })
    // 


    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    verifyToken(id_token);
};

function verifyToken(id_token) {
    var payload = {
        "token": id_token
    }
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