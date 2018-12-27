var generatedVegaSpec = {}
var visualizationData = []
var generatedVegaSpecEncoding = {};
var serverUrl = "http://35.193.162.234/"

$(function () {
    var toastNotificationSelector
    var toastNotification
    CarbonComponents.settings.disableAutoInit = true;
    toastNotificationSelector = document.querySelector('[data-notification]');
    toastNotification = CarbonComponents.Notification.create(toastNotificationSelector);


    var exampleProgressBarColor = "#152934"
    var numExampleGraphsPerRow = 7
    // Assign the specification to a local variable vlSpec.
    var exampleGraphWidth = ($(".examplebox").width()) / numExampleGraphsPerRow;
    var exampleGraphHeight = 250;

    var loadDuration = 5000;
    var firstLoad = false
    var loadeddivcount = 1;
    var numGraphs = 10;

    var generatedDataHolder;

    // loadExamplesData() 


    /**
     * JS Script to load up random Vegalite data from server and display charts
     * 
     */

    // Assign the specification to a local variable vlSpec.
    var graphWidth = $(".vizbox").width();
    var graphHeight = 300;
    var loadDuration = 5000;
    var firstLoad = false


    hideLoading(".rnnsampleloader")
    hideLoading("#graph_loading_overlay")

    // generate set of examples
    $(".generateexamplesbutton").click(function () {
        numInputExamples = $(".numexamplesinput").val()
        if (numInputExamples != "" && numInputExamples <= 50) {
            numGraphs = numInputExamples * 1
        }
        $(".examplebox").empty()
        loadeddivcount = 1;
        $(".exampleprogressbarinner").width(0);
        $(".exampleprogressbarinner").css('background-color', exampleProgressBarColor)
        showLoading(".rnnsampleloader")
        loadExamplesData()
        sendGAEvent("button", "click", "generate examples set " + numInputExamples )

    });

    // generate single updateable example
    $(".generateseqbutton").click(function () {
        loadGeneratedData() 
        sendGAEvent("button", "click", "generate button dataset")
    });

    // loadExamplesData()
    $(".laodsampledataset").click(function () {
        loadSampleData()
        sendGAEvent("button", "click", "load sample dataset")
    });

    $(".documentationdemolink").click(function () {
        $(".sidelink#modifyviz").click()
        sendGAEvent("link", "click", "view demo")
    }); 

    $(".documentationexamplelink").click(function () {
        sendGAEvent("link", "click", "view documentation")
    });
    // Enable/disable Generate button if data is in input box
    jQuery('.sourcedata').on('input propertychange paste', function () {
        sendGAEvent("input", "paste", "paste or update input data")
        if ($(this).val() == "") {
            $(".generateseqbutton").attr("disabled", "disabled");
        } else {
            $(".generateseqbutton").removeAttr("disabled")
        }
    });

    // Enable/disable update visualization button if data is in input box
    jQuery('.vegaoutput').on('input propertychange paste', function () {
        sendGAEvent("input", "paste", "paste or update output visualization spec")
        if ($(this).val() == "") {
            $(".updatevizbutton").attr("disabled", "disabled");
        } else {
            $(".updatevizbutton").removeAttr("disabled")
        }
    });

    // Update the visualization using the vegaspec in the vegabox
    $(".updatevizbutton").click(function () {
        currentVegaspec = JSON.parse($(".vegaoutput").val())
        currentVegaspec.data = visualizationData
        // console.log(currentVegaspec)
        loadVisualization(currentVegaspec)
    });

    function loadSampleData() {
        showLoading("#graph_loading_overlay")
        $.ajax({
            url: serverUrl + "/testdata",
            data: {}
        }).done(function (result) {
            $(".sourcedata").val(JSON.stringify(result))
            visualizationData = result;
            loadGeneratedData()
        }).fail(function (xhr, status, error) {
            $(".vizbox").fadeOut("slow")
            hideLoading("#graph_loading_overlay")
            showNotification("Error Reaching Model Server", status, error + ".Might have to try again later." )
        });;
    }

    function loadGeneratedData() {
        showLoading("#graph_loading_overlay")
        var sourcedata = ($("textarea#sourcedata").val())   
        if (!isValidJSON(sourcedata)){
            showNotification("BAD Input Data Format", " Bad Input", "Please enter a valid JSON array without nesting." )
            hideLoading("#graph_loading_overlay");
            return
        }

        var payload = {
            sourcedata: sourcedata
        }
        // Load vlSpec from Server
        $.ajax({
            url: serverUrl + "/inference",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload)
        }).done(function (result) {
            hideLoading("#graph_loading_overlay")
            // seqdata = JSON.stringify(seqdata)
            if (result.status) {
                generatedVegaSpec = JSON.parse(JSON.stringify(result.vegaspec))
                visualizationData = generatedVegaSpec.data
                generatedVegaSpecEncoding = JSON.parse(JSON.stringify(result.vegaspec))
                delete generatedVegaSpecEncoding.data
                // alert(visualizationData)

                $("#vegaoutput").val("")
                $(".updatevizbutton").removeAttr("disabled")
                $("#vegaoutput").val(JSON.stringify(generatedVegaSpecEncoding, null, 2))

                loadVisualization(generatedVegaSpec)
            } else {
                result = JSON.parse(JSON.stringify(result))
                showNotification("An Error Occurred", result.reason, error + "." )
        }
            // console.log(JSON.stringify(result))

        }).fail(function (xhr, status, error) {
            $(".vizbox").fadeOut("slow")
            hideLoading("#graph_loading_overlay")
            showNotification("Error Reaching Model Server", status, error + ".Might have to try again later." )
        
        });;
    }
 

    function loadVisualization(vlSpec) {

        // check if we likely have a phantomfield
        specString = $(".vegaoutput").val()
        containsPhantom = specString.includes("str") && !isNaN(specString.charAt(specString.indexOf("str")+3)) || specString.includes("num") && !isNaN(specString.charAt(specString.indexOf("num")+3))
        phantomContent = containsPhantom ? " Model generated a non-existent (phantom) field." : "No non-existent (phantom) field generated."
        phantomClass = containsPhantom ? "outputeval phantomred" : "outputeval phantomgreen"
        $(".outputeval").text(phantomContent);
        $(".outputeval").attr("class",phantomClass);

        graphWidth = $(".vizbox").width();
        vlSpec.width = graphWidth
        vlSpec.height = graphHeight
        vlSpec.autosize = {
            "type": "fit",
            "contains": "padding"
        }
        // optional argument passed to Vega-Embed to specify vega-lite spec. More info at https://github.com/vega/vega-embed
        var opt = {
            "mode": "vega-lite"
        };

        $(".vizbox").fadeOut("slow", function () {
            // Embed the visualization in the container with id `vis`
            vegaEmbed("#vis", vlSpec, opt).then(function (result) {
                // Callback receiving the View instance and parsed Vega spec
                // result.view is the View, which resides under the '#vis' element
                $(".vizbox").fadeIn("slow")
            }).catch(console.warn);

        })
    }

    function loadExamplesData() {
        $.ajax({
            url: serverUrl + "/examplesdata"
        }).done(function (result) {
            // alert(JSON.stringify(result))
            loadExampleVisualization(result.vegaspec)
        }).fail(function (xhr, status, error) {
            // error handling
            console.log("Eroor fetchng data!!")
        });;
    }



    function loadExampleVisualization(vlSpec) {
        exampleGraphWidth = ($(".examplebox").width()) / numExampleGraphsPerRow;
        loadStatus = loadeddivcount + " / " + numGraphs
        progressBarWidth = (loadeddivcount / numGraphs) * $(".exampleprogresbarouter").width()
        $(".exampleprogressbarinner").width(progressBarWidth)
        $(".examplesStatus").text(loadStatus)
        vlSpec.width = exampleGraphWidth
        vlSpec.height = exampleGraphHeight
        var opt = {
            "mode": "vega-lite",
            "actions": false,
            "width": exampleGraphWidth,
            "height": exampleGraphHeight
        };

        divid = "divbox" + loadeddivcount
        $vizsubbox = $("<div id='" + divid + "' class='vizsubbox'></div>")

        $(".examplebox").append($vizsubbox)
        $vizsubbox.hide()

        vegaEmbed("#" + divid, vlSpec, opt).then(function (result) {
            // Callback receiving the View instance and parsed Vega spec
            // result.view is the View, which resides under the '#vis' element
            $vizsubbox.fadeIn("slow")
            reloadData()

        }).catch(function (err) {
            reloadData()
        });

    }

    function reloadData() {
        if (loadeddivcount < numGraphs) {
            loadExamplesData()
            loadeddivcount++;
        } else {
            hideLoading(".rnnsampleloader")
            $(".exampleprogressbarinner").css('background-color', '#3BD804');
        }
    }

    // Show Loading Spinner
    function showLoading(element) {
        $(element).fadeIn("slow")
    }
    // Hide Loading Spinner
    function hideLoading(element) {
        $(element).fadeOut("slow")
    }

    // Check if valid JSON
    function isValidJSON(text){
        if (typeof text!=="string"){
            return false;
        }
        try{
            JSON.parse(text);
            return true;
        }
        catch (error){
            return false;
        }
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

    function sendGAEvent(eCategory, eAction, eLabel){
        console.log("logging", eCategory, eAction, eLabel)
        ga('send', {
            hitType: 'event',
            eventCategory: eCategory,
            eventAction: eAction,
            eventLabel: eLabel
          });
    }

});