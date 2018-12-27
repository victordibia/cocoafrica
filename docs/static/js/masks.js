 $(function () {


     hideLoading("#graph_loading_overlay")

     //  $(".masktabcontent").html($("#generated").html())
     $("#generated").show()

     $("div.masktab").click(function () {
         $(".masktab").removeClass("maskactive")
         $(this).addClass("maskactive")

         $(".tabcontent").hide();
         clickedTab = $(this).attr("tab")
         $("#" + clickedTab).fadeIn("slow")

         //  $(".masktabcontent").hide().html($("#" + clickedTab).html()).fadeIn("slow")

     })

     function loadImages() {
         $(".ganimagebox").empty()
         for (i = 0; i < 100; i++) {

             $imagebox = $("<div id='" + i + "' class='eachimagebox'>" +
                 "<img class='imageresultimg' src= 'static/assets/images/generated/" + i + ".jpg" + "' data-title= '" + i + "'data-id='" + i + "'  />" +
                 // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                 "</div>");
             $(".ganimagebox").append($imagebox)
             //  console.log($imagebox.html())
         }
     }

     loadImages()


     //  // Hover event for images
     //  $('body').on('mouseenter', '.imageresultimg', function () {
     //      lastHoverTime = new Date();
     //      console.log("hover", lastHoverTime)
     //      $(".hoverrig").show()
     //      // alert($(this).parent().find(".imagehovermenu").html())
     //      $(this).parent().find(".imagehovermenu").show();
     //      imgurl = $(this).attr("src")
     //      leftOffset = ($(this).offset().left + $(this).width() + $(".hoverrigimg").innerWidth()) > $(window).width() ? ($(this).offset().left - $(".hoverrigimg").innerWidth() - 10) : ($(this).offset().left + $(this).width() + 10)
     //      topOffset = ($(this).offset().top - $(document).scrollTop() + $(".hoverrigimg").innerWidth()) > $(window).height() ? ($(this).offset().top - $(".hoverrigimg").innerWidth() + $(this).height()) : $(this).offset().top
     //      // console.log($(document).scrollTop(), ($(this).offset().top + $(".hoverrigimg").innerWidth() ).toFixed(2) , $(window).height()   )
     //      $(".hoverrigimg").attr("src", imgurl)
     //      $(".hoverigcaption").text($(this).attr("data-title"));
     //      $("div.hoverrig").offset({
     //          left: leftOffset,
     //          top: topOffset
     //      });

     //      // console.log($(this).attr("data-title"))
     //  });


 });