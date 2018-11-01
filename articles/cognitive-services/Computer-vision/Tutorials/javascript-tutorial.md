---
title: "Tutorial: Computer Vision API JavaScript"
titlesuffix: Azure Cognitive Services
description: Explore a basic JavaScript app that uses the Computer Vision API in Azure Cognitive Services. Perform OCR, create thumbnails, and work with visual features in an image.
services: cognitive-services
author: KellyDF
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: tutorial
ms.date: 09/19/2017
ms.author: kefre
---

# Tutorial: Computer Vision API JavaScript

This tutorial shows the features of the Azure Cognitive Services Computer Vision REST API.

Explore a JavaScript application that uses the Computer Vision REST API to perform optical character recognition (OCR), create smart-cropped thumbnails, plus detect, categorize, tag, and describe visual features, including faces, in an image. This example lets you submit an image URL for analysis or processing. You can use this open source example as a template for building your own JavaScript app to use the Computer Vision REST API.

The JavaScript form application has already been written, but has no Computer Vision functionality. In this tutorial, you add the code specific to the Computer Vision REST API to complete the application's functionality.

## Prerequisites

### Platform requirements

This tutorial has been developed using a simple text editor.

### Subscribe to Computer Vision API and get a subscription key 

Before creating the example, you must subscribe to Computer Vision API which is part of the Azure Cognitive Services. For subscription and key management details, see [Subscriptions](https://azure.microsoft.com/try/cognitive-services/). Both the primary and secondary keys are valid to use in this tutorial. 

## Acquire the incomplete tutorial project

### Download the tutorial project

Clone the [Cognitive Services JavaScript Computer Vision Tutorial](https://github.com/Azure-Samples/cognitive-services-javascript-computer-vision-tutorial), or download the .zip file and extract it to an empty directory.

If you would prefer to use the finished tutorial with all tutorial code added, you can use the files in the **Completed** folder.

## Add the tutorial code to the project

The JavaScript application is set up with six .html files, one for each feature. Each file demonstrates a different function of Computer Vision (analyze, OCR, etc). The six tutorial sections do not have interdependencies, so you can add the tutorial code to one file, all six files, or only a couple of files. And you can add the tutorial code to the files in any order.

Let's get started.

### Analyze an image

The Analyze feature of Computer Vision scans an image for more than 2,000 recognizable objects, living things, scenery, and actions. Once the analysis is complete, Analyze returns a JSON object that describes the image with descriptive tags, color analysis, captions, and more.

To complete the Analyze feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

Open the **analyze.html** file in a text editor and locate the **analyzeButtonClick** function near the bottom of the file.

The **analyzeButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **AnalyzeImage** function to analyze the image.

Copy and paste the following code into the **analyzeButtonClick** function.

```javascript
function analyzeButtonClick() {

    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    $("#captionSpan").text("");
    
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    
    AnalyzeImage(sourceImageUrl, $("#responseTextArea"), $("#captionSpan"));
}
```

#### Add the wrapper for the REST API call

The **AnalyzeImage** function wraps the REST API call to analyze an image. Upon a successful return, the formatted JSON analysis will be displayed in the specified textarea, and the caption will be displayed in the specified span.

Copy and paste the **AnalyzeImage** function code to just underneath the **analyzeButtonClick** function.

```javascript
/* Analyze the image at the specified URL by using Microsoft Cognitive Services Analyze Image API.
 * @param {string} sourceImageUrl - The URL to the image to analyze.
 * @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 * @param {<span> element} captionSpan - The span to display the image caption.
 */
function AnalyzeImage(sourceImageUrl, responseTextArea, captionSpan) {
    // Request parameters.
    var params = {
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };
    
    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion + 
             $("#subscriptionRegionSelect").val() + 
             common.uriBasePostRegion + 
             common.uriBaseAnalyze +
             "?" + 
             $.param(params),
                    
        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", 
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },
        
        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    
    .done(function(data) {
        // Show formatted JSON on webpage.
        responseTextArea.val(JSON.stringify(data, null, 2));
        
        // Extract and display the caption and confidence from the first caption in the description object.
        if (data.description && data.description.captions) {
            var caption = data.description.captions[0];
            
            if (caption.text && caption.confidence) {
                captionSpan.text("Caption: " + caption.text +
                    " (confidence: " + caption.confidence + ").");
            }
        }
    })
    
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Prepare the error string.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        
        // Put the error JSON in the response textarea.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));
        
        // Show the error message.
        alert(errorString);
    });
}
```

#### Run the application

Save the **analyze.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image to analyze, then click the **Analyze Image** button to analyze an image and see the result.

### Recognize a landmark

The Landmark feature of Computer Vision analyzes an image for natural and artificial landmarks, such as mountains or famous buildings. Once the analysis is complete, Landmark returns a JSON object that identifies the landmarks found in the image.

To complete the Landmark feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

Open the **landmark.html** file in a text editor and locate the **landmarkButtonClick** function near the bottom of the file.

The **landmarkButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **IdentifyLandmarks** function to analyze the image.

Copy and paste the following code into the **landmarkButtonClick** function.

```javascript
function landmarkButtonClick() {

    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    $("#captionSpan").text("");
    
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    
    IdentifyLandmarks(sourceImageUrl, $("#responseTextArea"), $("#captionSpan"));
}
```

#### Add the wrapper for the REST API call

The **IdentifyLandmarks** function wraps the REST API call to analyze an image. Upon a successful return, the formatted JSON analysis will be displayed in the specified textarea, and the caption will be displayed in the specified span.

Copy and paste the **IdentifyLandmarks** function code to just underneath the **landmarkButtonClick** function.

```javascript
/* Identify landmarks in the image at the specified URL by using Microsoft Cognitive Services 
 * Landmarks API.
 * @param {string} sourceImageUrl - The URL to the image to analyze for landmarks.
 * @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 * @param {<span> element} captionSpan - The span to display the image caption.
 */
function IdentifyLandmarks(sourceImageUrl, responseTextArea, captionSpan) {
    // Request parameters.
    var params = {
        "model": "landmarks"
    };
    
    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion + 
             $("#subscriptionRegionSelect").val() + 
             common.uriBasePostRegion + 
             common.uriBaseLandmark +
             "?" + 
             $.param(params),
                    
        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", 
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },
        
        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    
    .done(function(data) {
        // Show formatted JSON on webpage.
        responseTextArea.val(JSON.stringify(data, null, 2));
        
        // Extract and display the caption and confidence from the first caption in the description object.
        if (data.result && data.result.landmarks) {
            var landmark = data.result.landmarks[0];
            
            if (landmark.name && landmark.confidence) {
                captionSpan.text("Landmark: " + landmark.name +
                    " (confidence: " + landmark.confidence + ").");
            }
        }
    })
    
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Prepare the error string.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        
        // Put the error JSON in the response textarea.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));
        
        // Show the error message.
        alert(errorString);
    });
}
```

#### Run the application

Save the **landmark.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image to analyze, then click the **Analyze Image** button to analyze an image and see the result.

### Recognize celebrities

The Celebrities feature of Computer Vision analyzes an image for famous people. Once the analysis is complete, Celebrities returns a JSON object that identifies the Celebrities found in the image.

To complete the Celebrities feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

Open the **celebrities.html** file in a text editor and locate the **celebritiesButtonClick** function near the bottom of the file.

The **celebritiesButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **IdentifyCelebrities** function to analyze the image.

Copy and paste the following code into the **celebritiesButtonClick** function.

```javascript
function celebritiesButtonClick() {

    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    $("#captionSpan").text("");
    
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    
    IdentifyCelebrities(sourceImageUrl, $("#responseTextArea"), $("#captionSpan"));
}
```

#### Add the wrapper for the REST API call

```javascript
/* Identify celebrities in the image at the specified URL by using Microsoft Cognitive Services 
 * Celebrities API.
 * @param {string} sourceImageUrl - The URL to the image to analyze for celebrities.
 * @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 * @param {<span> element} captionSpan - The span to display the image caption.
 */
function IdentifyCelebrities(sourceImageUrl, responseTextArea, captionSpan) {
    // Request parameters.
    var params = {
        "model": "celebrities"
    };
    
    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion + 
             $("#subscriptionRegionSelect").val() + 
             common.uriBasePostRegion + 
             common.uriBaseCelebrities +
             "?" + 
             $.param(params),
                    
        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", 
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },
        
        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    
    .done(function(data) {
        // Show formatted JSON on webpage.
        responseTextArea.val(JSON.stringify(data, null, 2));
        
        // Extract and display the caption and confidence from the first caption in the description object.
        if (data.result && data.result.celebrities) {
            var celebrity = data.result.celebrities[0];
            
            if (celebrity.name && celebrity.confidence) {
                captionSpan.text("Celebrity name: " + celebrity.name +
                    " (confidence: " + celebrity.confidence + ").");
            }
        }
    })
    
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Prepare the error string.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        
        // Put the error JSON in the response textarea.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));
        
        // Show the error message.
        alert(errorString);
    });
}
```

#### Run the application

Save the **celebrities.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image to analyze, then click the **Analyze Image** button to analyze an image and see the result.

### Intelligently generate a thumbnail

The Thumbnail feature of Computer Vision generates a thumbnail from an image. By using the **Smart Crop** feature, the Thumbnail feature will identify the area of interest in an image and center the thumbnail on this area, to generate more aesthetically pleasing thumbnail images.

To complete the Thumbnail feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

Open the **thumbnail.html** file in a text editor and locate the **thumbnailButtonClick** function near the bottom of the file.

The **thumbnailButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **getThumbnail** function twice to create two thumbnails, one smart cropped and one without smart crop.

Copy and paste the following code into the **thumbnailButtonClick** function.

```javascript
function thumbnailButtonClick() {

    // Clear the display fields.
    document.getElementById("sourceImage").src = "#";
    document.getElementById("thumbnailImageSmartCrop").src = "#";
    document.getElementById("thumbnailImageNonSmartCrop").src = "#";
    document.getElementById("responseTextArea").value = "";
    document.getElementById("captionSpan").text = "";
    
    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.getElementById("sourceImage").src = sourceImageUrl;
    
    // Get a smart cropped thumbnail.
    getThumbnail (sourceImageUrl, true, document.getElementById("thumbnailImageSmartCrop"), 
        document.getElementById("responseTextArea"));
    
    // Get a non-smart-cropped thumbnail.
    getThumbnail (sourceImageUrl, false, document.getElementById("thumbnailImageNonSmartCrop"),
        document.getElementById("responseTextArea"));
}
```

#### Add the wrapper for the REST API call

The **getThumbnail** function wraps the REST API call to analyze an image. Upon a successful return, the thumbnail will be displayed in the specified img element.

Copy and paste the following **getThumbnail** function to just underneath the **thumbnailButtonClick** function.

```javascript
/* Get a thumbnail of the image at the specified URL by using Microsoft Cognitive Services
 * Thumbnail API.
 * @param {string} sourceImageUrl URL to image.
 * @param {boolean} smartCropping Set to true to use the smart cropping feature which crops to the
 *                                more interesting area of an image; false to crop for the center
 *                                of the image.
 * @param {<img> element} imageElement The img element in the DOM which will display the thumnail image.
 * @param {<textarea> element} responseTextArea - The text area to display the Response Headers returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 */
function getThumbnail (sourceImageUrl, smartCropping, imageElement, responseTextArea) {
    // Create the HTTP Request object.
    var xhr = new XMLHttpRequest();
    
    // Request parameters.
    var params = "width=100&height=150&smartCropping=" + smartCropping.toString();

    // Build the full URI.
    var fullUri = common.uriBasePreRegion + 
                  document.getElementById("subscriptionRegionSelect").value + 
                  common.uriBasePostRegion + 
                  common.uriBaseThumbnail +
                  "?" + 
                  params;
    
    // Identify the request as a POST, with the URI and parameters.
    xhr.open("POST", fullUri);
    
    // Add the request headers.
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", 
        encodeURIComponent(document.getElementById("subscriptionKeyInput").value));
    
    // Set the response type to "blob" for the thumbnail image data.
    xhr.responseType = "blob";
    
    // Process the result of the REST API call.
    xhr.onreadystatechange = function(e) {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            
            // Thumbnail successfully created.
            if (xhr.status === 200) {
                // Show response headers.
                var s = JSON.stringify(xhr.getAllResponseHeaders(), null, 2);
                responseTextArea.value = JSON.stringify(xhr.getAllResponseHeaders(), null, 2);
                
                // Show thumbnail image.
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(this.response);
                imageElement.src = imageUrl;
            } else {
                // Display the error message. The error message is the response body as a JSON string. 
                // The code in this code block extracts the JSON string from the blob response.
                var reader = new FileReader();
                
                // This event fires after the blob has been read.
                reader.addEventListener('loadend', (e) => {
                    responseTextArea.value = JSON.stringify(JSON.parse(e.srcElement.result), null, 2);
                });
                
                // Start reading the blob as text.
                reader.readAsText(xhr.response);
            }
        }
    }
    
    // Execute the REST API call.
    xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');
}
```

#### Run the application

Save the **thumbnail.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image to analyze, then click the **Generate Thumbnails** button to analyze an image and see the result.

### Read printed text (OCR)

The Optical Character Recognition (OCR) feature of Computer Vision analyzes an image of printed text. After the analysis is complete, OCR returns a JSON object that contains the text and the location of the text in the image.

To complete the OCR feature of the tutorial application, perform the following steps:

### OCR step 1: Add the event handler code for the form button

Open the **ocr.html** file in a text editor and locate the **ocrButtonClick** function near the bottom of the file.

The **ocrButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **ReadOcrImage** function to analyze the image.

Copy and paste the following code into the **ocrButtonClick** function.

```javascript
function ocrButtonClick() {

    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    $("#captionSpan").text("");
    
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    
    ReadOcrImage(sourceImageUrl, $("#responseTextArea"));
}
```

#### Add the wrapper for the REST API call

The **ReadOcrImage** function wraps the REST API call to analyze an image. Upon a successful return, the formatted JSON describing the text and the location of the text will be displayed in the specified textarea.

Copy and paste the following **ReadOcrImage** function to just underneath the **ocrButtonClick** function.

```javascript
/* Recognize and read printed text in an image at the specified URL by using Microsoft Cognitive 
 * Services OCR API.
 * @param {string} sourceImageUrl - The URL to the image to analyze for printed text.
 * @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 */
function ReadOcrImage(sourceImageUrl, responseTextArea) {
    // Request parameters.
    var params = {
        "language": "unk",
        "detectOrientation ": "true",
    };

    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion + 
             $("#subscriptionRegionSelect").val() + 
             common.uriBasePostRegion + 
             common.uriBaseOcr +
             "?" + 
             $.param(params),
        
        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", 
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },
        
        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    
    .done(function(data) {
        // Show formatted JSON on webpage.
        responseTextArea.val(JSON.stringify(data, null, 2));
    })
    
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Put the JSON description into the text area.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));
        
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}
```

#### Run the application

Save the **ocr.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image of text to read, then click the **Read Image** button to analyze an image and see the result.

### Read handwritten text (Handwriting Recognition)

The Handwriting Recognition feature of Computer Vision analyzes an image of handwritten text. After the analysis is complete, Handwriting Recognition returns a JSON object that contains the text and the location of the text in the image.

To complete the Handwriting Recognition feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

Open the **handwriting.html** file in a text editor and locate the **handwritingButtonClick** function near the bottom of the file.

The **handwritingButtonClick** event handler function clears the form, displays the image specified in the URL, then calls the **HandwritingImage** function to analyze the image.

Copy and paste the following code into the **handwritingButtonClick** function.

```javascript
function handwritingButtonClick() {

    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    
    ReadHandwrittenImage(sourceImageUrl, $("#responseTextArea"));
}
```

#### Add the wrapper for the REST API call

The **ReadHandwrittenImage** function wraps the two REST API calls needed to analyze an image. Because Handwriting Recognition is a time consuming process, a two step process is used. The first call submits the image for processing; the second call retrieves the detected text when the processing is complete.

After the text is retrieved, the formatted JSON describing the text and the location of the text will be displayed in the specified textarea.

Copy and paste the following **ReadHandwrittenImage** function to just underneath the **handwritingButtonClick** function.

```javascript
/* Recognize and read text from an image of handwriting at the specified URL by using Microsoft 
 * Cognitive Services Recognize Handwritten Text API.
 * @param {string} sourceImageUrl - The URL to the image to analyze for handwriting.
 * @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
 *                             from the REST API call, or to display the error message if there was 
 *                             an error.
 */
function ReadHandwrittenImage(sourceImageUrl, responseTextArea) {
    // Request parameters.
    var params = {
        "handwriting": "true",
    };

    // This operation requrires two REST API calls. One to submit the image for processing,
    // the other to retrieve the text found in the image. 
    //
    // Perform the first REST API call to submit the image for processing.
    $.ajax({
        url: common.uriBasePreRegion + 
             $("#subscriptionRegionSelect").val() + 
             common.uriBasePostRegion + 
             common.uriBaseHandwriting +
             "?" + 
             $.param(params),
        
        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", 
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },
        
        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    
    .done(function(data, textStatus, jqXHR) {
        // Show progress.
        responseTextArea.val("Handwritten image submitted.");
        
        // Note: The response may not be immediately available. Handwriting Recognition is an
        // async operation that can take a variable amount of time depending on the length
        // of the text you want to recognize. You may need to wait or retry this GET operation.
        //
        // Try once per second for up to ten seconds to receive the result.
        var tries = 10;
        var waitTime = 100;
        var taskCompleted = false;
        
        var timeoutID = setInterval(function () { 
            // Limit the number of calls.
            if (--tries <= 0) {
                window.clearTimeout(timeoutID);
                responseTextArea.val("The response was not available in the time allowed.");
                return;
            }

            // The "Operation-Location" in the response contains the URI to retrieve the recognized text.
            var operationLocation = jqXHR.getResponseHeader("Operation-Location");
            
            // Perform the second REST API call and get the response.
            $.ajax({
                url: operationLocation,
                
                // Request headers.
                beforeSend: function(jqXHR){
                    jqXHR.setRequestHeader("Content-Type","application/json");
                    jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                        encodeURIComponent($("#subscriptionKeyInput").val()));
                },
                
                type: "GET",
            })
            
            .done(function(data) {
                // If the result is not yet available, return.
                if (data.status && (data.status === "NotStarted" || data.status === "Running")) {
                    return;
                }
                
                // Show formatted JSON on webpage.
                responseTextArea.val(JSON.stringify(data, null, 2));
                
                // Indicate the task is complete and clear the timer.
                taskCompleted = true;
                window.clearTimeout(timeoutID);
            })
            
            .fail(function(jqXHR, textStatus, errorThrown) {
                // Indicate the task is complete and clear the timer.
                taskCompleted = true;
                window.clearTimeout(timeoutID);
                
                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
        }, waitTime);
    })
    
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Put the JSON description into the text area.
        responseTextArea.val(JSON.stringify(jqXHR, null, 2));
        
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}
```

#### Run the application

Save the **handwriting.html** file and open it in a Web browser. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image of text to read, then click the **Read Image** button to analyze an image and see the result.

## Next steps

- [Computer Vision API C&#35; Tutorial](CSharpTutorial.md)
- [Computer Vision API Python Tutorial](PythonTutorial.md)
