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
         $(".tabcontent#generated").empty()
         for (i = 0; i < 100; i++) {

             $imagebox = $("<div id='" + i + "' class='eachimagebox'>" +
                 "<img class='imageresultimg' src= 'static/assets/images/generated/" + i + ".jpg" + "' data-title= '" + i + "'data-id='" + i + "'  />" +
                 // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                 "</div>");
             $(".tabcontent#generated").append($imagebox)
             console.log($imagebox.html())
         }
     }

     loadImages()

 });