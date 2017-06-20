---
title: Computer Vision API JavaScript quick starts | Microsoft Docs
description: Get information and code samples to help you quickly get started using JavaScript and the Computer Vision API in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 06/15/2017
ms.author: v-royhar
---

# Computer Vision JavaScript Quick Starts

This article provides information and code samples to help you quickly get started using JavaScript and the Computer Vision API to accomplish the following tasks: 
* [Analyze an image](#AnalyzeImage) 
* [Use a Domain-Specific Model](#DomainSpecificModel)
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract text from an Image](#OCR)

Learn more about obtaining free Subscription Keys [here](../Vision-API-How-to-Topics/HowToSubscribe.md)

Most of these samples use jQuery 1.9.0. For a sample that uses JavaScript without jQuery, see the sample, [Intelligently generate a thumbnail](#GetThumbnail).

## Analyze an image with Computer Vision API using JavaScript <a name="AnalyzeImage"> </a>

With the [Analyze Image method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* A detailed list of tags related to the image content. 
* A description of image content in a complete sentence. 
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clipart or a line drawing)
* The dominant color, the accent color, or whether an image is black & white.
* The category defined in this [taxonomy](../Category-Taxonomy.md). 
* Whether the image contains pornographic or sexually suggestive content. 

### Analyze an image JavaScript example request

To run the sample, perform the following steps:

1. Copy the following and save it to a file such as `analyze.html`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Drag-and-drop the file into your browser.
1. Click the `Analyze image` button.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Analyze Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "48e2a74efdaa46258f4b71d0353220dd";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

        // Request parameters.
        var params = {
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
            
            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            
            type: "POST",
            
            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })
        
        .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
    };
</script>

<h1>Analyze image:</h1>
Enter the URL to an image of a natural or artificial landmark, then click the <strong>Analyze image</strong> button.
<br><br>
Image to analyze: <input type="text" name="inputImage" id="inputImage" value="http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg" />
<button onclick="processImage()">Analyze image</button>
<br><br>
<div id="wrapper" style="width:1020px; display:table;">
    <div id="jsonOutput" style="width:600px; display:table-cell;">
        Response:
        <br><br>
        <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
    </div>
    <div id="imageDiv" style="width:420px; display:table-cell;">
        Source image:
        <br><br>
        <img id="sourceImage" width="400" />
    </div>
</div>
</body>
</html>
```

### Analyze an image response

A successful response is returned in JSON. Following is an example of a successful response: 

```json
{
  "categories": [
    {
      "name": "outdoor_water",
      "score": 0.9921875
    }
  ],
  "description": {
    "tags": [
      "nature",
      "water",
      "waterfall",
      "outdoor",
      "rock",
      "mountain",
      "rocky",
      "grass",
      "hill",
      "top",
      "covered",
      "hillside",
      "standing",
      "side",
      "group",
      "walking",
      "white",
      "man",
      "large",
      "snow",
      "grazing",
      "forest",
      "slope",
      "herd",
      "river",
      "giraffe",
      "field"
    ],
    "captions": [
      {
        "text": "a large waterfall over a rocky cliff",
        "confidence": 0.9165146827843689
      }
    ]
  },
  "requestId": "63d3c630-7f3d-43d7-8a97-143012fc53f4",
  "metadata": {
    "width": 1280,
    "height": 959,
    "format": "Jpeg"
  },
  "color": {
    "dominantColorForeground": "Grey",
    "dominantColorBackground": "Green",
    "dominantColors": [
      "Grey",
      "Green"
    ],
    "accentColor": "4D5E2F",
    "isBWImg": false
  }
}
```

## Use a Domain-Specific model <a name="DomainSpecificModel"> </a>
The Domain-Specific Model is a model trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are celebrities and landmarks. The following example identifies a landmark in an image.

### Landmark JavaScript example request

To run the sample, perform the following steps:

1. Copy the following and save it to a file such as `landmark.html`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Drag-and-drop the file into your browser.
1. Click the `Analyze image` button.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Landmark Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "48e2a74efdaa46258f4b71d0353220dd";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        //
        // Also, if you want to use the celebrities model, change "landmarks" to "celebrities" here and in
        // uriBuilder.setParameter to use the Celebrities model.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/landmarks/analyze";

        // Request parameters.
        var params = {
            "model": "landmarks", // Use "model": "celebrities" to use the Celebrities model.
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

        .done(function(data) {
			// Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
			// Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
    };
</script>

<h1>Landmark image:</h1>
Enter the URL to an image of a natural or artificial landmark, then click the <strong>Analyze image</strong> button.
<br><br>
Landscape image to analyze: <input type="text" name="inputImage" id="inputImage" value="https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg" />
<button onclick="processImage()">Analyze image</button>
<br><br>
<div id="wrapper" style="width:1020px; display:table;">
    <div id="jsonOutput" style="width:600px; display:table-cell;">
        Response:
        <br><br>
        <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
    </div>
    <div id="imageDiv" style="width:420px; display:table-cell;">
        Source image:
        <br><br>
        <img id="sourceImage" width="400" />
    </div>
</div>
</body>
</html>
```

### Landmark example response
A successful response is returned in JSON. Following is an example of a successful response:

```json
{
  "requestId": "fe0d4539-7a21-4fc6-b7af-3bb24beba390",
  "metadata": {
    "width": 2096,
    "height": 4132,
    "format": "Jpeg"
  },
  "result": {
    "landmarks": [
      {
        "name": "Space Needle",
        "confidence": 0.9998178
      }
    ]
  }
}
```

## Get a thumbnail with Computer Vision API using JavaScript <a name="GetThumbnail"> </a>
Use the [Get Thumbnail method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to  crop an image based on its region of interest (ROI) to the height and width you desire, even if the aspect ratio differs from the input image. 

### Get a thumbnail JavaScript example request

To run the sample, perform the following steps:

1. Copy the following and save it to a file such as `thumbnail.html`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Drag-and-drop the file into your browser.
1. Click the `Generate thumbnail` button.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Thumbnail Sample</title>
</head>
<body>

<script type="text/javascript">
    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "48e2a74efdaa46258f4b71d0353220dd";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail";
        
        // Request parameters.
        var params = "?width=100&height=150&smartCropping=true";
      
        // Display the source image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Prepare the REST API call:
        
        // Create the HTTP Request object.
        var xhr = new XMLHttpRequest();
        
        // Identify the request as a POST, with the URL and parameters.
        xhr.open("POST", uriBase + params);
        
        // Add the request headers.
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        
        // Set the response type to "blob" for the thumbnail image data.
        xhr.responseType = "blob";
        
        // Process the result of the REST API call.
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                
                // Thumbnail successfully created.
                if (xhr.status === 200) {
                    // Show response headers.
                    var s = JSON.stringify(xhr.getAllResponseHeaders(), null, 2);
                    document.getElementById("responseTextArea").value = JSON.stringify(xhr.getAllResponseHeaders(), null, 2);
                    
                    // Show thumbnail image.
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL(this.response);
                    document.querySelector("#thumbnailImage").src = imageUrl;
                } else {
                    // Display the error message. The error message is the response body as a JSON string. 
                    // The code in this code block extracts the JSON string from the blob response.
                    var reader = new FileReader();
                    
                    // This event fires after the blob has been read.
                    reader.addEventListener('loadend', (e) => {
                        document.getElementById("responseTextArea").value = JSON.stringify(JSON.parse(e.srcElement.result), null, 2);
                    });
                    
                    // Start reading the blob as text.
                    reader.readAsText(xhr.response);
                }
            }
        }
        
        // Execute the REST API call.
        xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');
    };
</script>

<h1>Generate thumbnail image:</h1>
Enter the URL to an image to use in creating a thumbnail image, then click the <strong>Generate thumbnail</strong> button.
<br><br>
Image for thumnail: <input type="text" name="inputImage" id="inputImage" value="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Shorkie_Poo_Puppy.jpg/1280px-Shorkie_Poo_Puppy.jpg" />
<button onclick="processImage()">Generate thumbnail</button>
<br><br>
<div id="wrapper" style="width:1160px; display:table;">
    <div id="jsonOutput" style="width:600px; display:table-cell;">
        Response:
        <br><br>
        <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
    </div>
    <div id="imageDiv" style="width:420px; display:table-cell;">
        Source image:
        <br><br>
        <img id="sourceImage" width="400" />
    </div>
    <div id="thumbnailDiv" style="width:140px; display:table-cell;">
        Thumbnail:
        <br><br>
        <img id="thumbnailImage" />
    </div>
</div>
</body>
</html>
```

### Get a thumbnail response

A successful response contains the thumbnail image binary. If the request failed, the response contains an error code and message to help determine what went wrong.

## Optical Character Recognition (OCR) with Computer Vision API using JavaScript<a name="OCR"> </a>

Use the [Optical Character Recognition (OCR) method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image and extract recognized characters into a machine-usable character stream.

### OCR JavaScript example request

To run the sample, perform the following steps:

1. Copy the following and save it to a file such as `ocr.html`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Drag-and-drop the file into your browser.
1. Click the `Read image` button.

```html
<!DOCTYPE html>
<html>
<head>
    <title>OCR Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "48e2a74efdaa46258f4b71d0353220dd";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr";

        // Request parameters.
        var params = {
            "language": "unk",
            "detectOrientation ": "true",
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;
        
        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
            
            // Request headers.
            beforeSend: function(jqXHR){
                jqXHR.setRequestHeader("Content-Type","application/json");
                jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            
            type: "POST",
            
            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })
        
        .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };
</script>

<h1>Optical Character Recognition (OCR):</h1>
Enter the URL to an image of printed text, then click the <strong>Read image</strong> button.
<br><br>
Image to read: <input type="text" name="inputImage" id="inputImage" value="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png" />
<button onclick="processImage()">Read image</button>
<br><br>
<div id="wrapper" style="width:1020px; display:table;">
    <div id="jsonOutput" style="width:600px; display:table-cell;">
        Response:
        <br><br>
        <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
    </div>
    <div id="imageDiv" style="width:420px; display:table-cell;">
        Source image:
        <br><br>
        <img id="sourceImage" width="400" />
    </div>
</div>
</body>
</html>
```

### OCR example response

A successful response is returned in JSON. The OCR results returned include text, bounding box for regions, lines, and words.

Following is an example of a successful response:

```json 
{
  "language": "en",
  "textAngle": 0,
  "orientation": "Up",
  "regions": [
    {
      "boundingBox": "21,16,304,451",
      "lines": [
        {
          "boundingBox": "28,16,288,41",
          "words": [
            {
              "boundingBox": "28,16,288,41",
              "text": "NOTHING"
            }
          ]
        },
        {
          "boundingBox": "27,66,283,52",
          "words": [
            {
              "boundingBox": "27,66,283,52",
              "text": "EXISTS"
            }
          ]
        },
        {
          "boundingBox": "27,128,292,49",
          "words": [
            {
              "boundingBox": "27,128,292,49",
              "text": "EXCEPT"
            }
          ]
        },
        {
          "boundingBox": "24,188,292,54",
          "words": [
            {
              "boundingBox": "24,188,292,54",
              "text": "ATOMS"
            }
          ]
        },
        {
          "boundingBox": "22,253,297,32",
          "words": [
            {
              "boundingBox": "22,253,105,32",
              "text": "AND"
            },
            {
              "boundingBox": "144,253,175,32",
              "text": "EMPTY"
            }
          ]
        },
        {
          "boundingBox": "21,298,304,60",
          "words": [
            {
              "boundingBox": "21,298,304,60",
              "text": "SPACE."
            }
          ]
        },
        {
          "boundingBox": "26,387,294,37",
          "words": [
            {
              "boundingBox": "26,387,210,37",
              "text": "Everything"
            },
            {
              "boundingBox": "249,389,71,27",
              "text": "else"
            }
          ]
        },
        {
          "boundingBox": "127,431,198,36",
          "words": [
            {
              "boundingBox": "127,431,31,29",
              "text": "is"
            },
            {
              "boundingBox": "172,431,153,36",
              "text": "opinion."
            }
          ]
        }
      ]
    }
  ]
}
```

## Text Recognition with Computer Vision API using JavaScript<a name="RecognizeText"> </a>

Use the [RecognizeText method](https://ocr.portal.azure-api.net/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200) to detect handwritten or printed text in an image and extract recognized characters into a machine-usable character stream.

### Handwriting recognition Java example

To run the sample, perform the following steps:

1. Copy the following and save it to a file such as `handwriting.html`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
1. Drag-and-drop the file into your browser.
1. Click the `Read image` button.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Handwriting Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    function processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "48e2a74efdaa46258f4b71d0353220dd";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/RecognizeText";

        // Request parameters.
        var params = {
            "handwriting": "true",
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;
        
        // This operation requrires two REST API calls. One to submit the image for processing,
        // the other to retrieve the text found in the image. 
        //
        // Perform the first REST API call to submit the image for processing.
        $.ajax({
            url: uriBase + "?" + $.param(params),
            
            // Request headers.
            beforeSend: function(jqXHR){
                jqXHR.setRequestHeader("Content-Type","application/json");
                jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            
            type: "POST",
            
            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })
        
        .done(function(data, textStatus, jqXHR) {
            // Show progress.
            $("#responseTextArea").val("Handwritten text submitted. Waiting 10 seconds to retrieve the recognized text.");
            
            // Note: The response may not be immediately available. Handwriting recognition is an
            // async operation that can take a variable amount of time depending on the length
            // of the text you want to recognize. You may need to wait or retry this GET operation.
            //
            // Wait ten seconds before making the second REST API call.
            setTimeout(function () { 
                // The "Operation-Location" in the response contains the URI to retrieve the recognized text.
                var operationLocation = jqXHR.getResponseHeader("Operation-Location");
                
                // Perform the second REST API call and get the response.
                $.ajax({
                    url: operationLocation,
                    
                    // Request headers.
                    beforeSend: function(jqXHR){
                        jqXHR.setRequestHeader("Content-Type","application/json");
                        jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                    },
                    
                    type: "GET",
                })
                
                .done(function(data) {
                    // Show formatted JSON on webpage.
                    $("#responseTextArea").val(JSON.stringify(data, null, 2));
                })
                
                .fail(function(jqXHR, textStatus, errorThrown) {
                    // Display error message.
                    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                        jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                    alert(errorString);
                });
            }, 10000);
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Put the JSON description into the text area.
            $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));
            
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };
</script>
<h1>Read handwritten image image:</h1>
Enter the URL to an image of handwritten text, then click the <strong>Read image</strong> button.
<br><br>
Image to read: <input type="text" name="inputImage" id="inputImage" value="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg" />
<button onclick="processImage()">Read image</button>
<br><br>
<div id="wrapper" style="width:1020px; display:table;">
    <div id="jsonOutput" style="width:600px; display:table-cell;">
        Response:
        <br><br>
        <textarea id="responseTextArea" class="UIInput" style="width:580px; height:400px;"></textarea>
    </div>
    <div id="imageDiv" style="width:420px; display:table-cell;">
        Source image:
        <br><br>
        <img id="sourceImage" width="400" />
    </div>
</div>
</body>
</html>
```

### Handwriting example response

A successful response is returned in JSON. The handwriting results returned include text, bounding box for regions, lines, and words.

Following is an example of a successful response:

```json 
{
  "status": "Succeeded",
  "recognitionResult": {
    "lines": [
      {
        "boundingBox": [
          2,
          84,
          783,
          96,
          782,
          154,
          1,
          148
        ],
        "text": "Pack my box with five dozen liquor jugs",
        "words": [
          {
            "boundingBox": [
              6,
              86,
              92,
              87,
              71,
              151,
              0,
              150
            ],
            "text": "Pack"
          },
          {
            "boundingBox": [
              86,
              87,
              172,
              88,
              150,
              152,
              64,
              151
            ],
            "text": "my"
          },
          {
            "boundingBox": [
              165,
              88,
              241,
              89,
              219,
              152,
              144,
              152
            ],
            "text": "box"
          },
          {
            "boundingBox": [
              234,
              89,
              343,
              90,
              322,
              154,
              213,
              152
            ],
            "text": "with"
          },
          {
            "boundingBox": [
              347,
              90,
              432,
              91,
              411,
              154,
              325,
              154
            ],
            "text": "five"
          },
          {
            "boundingBox": [
              432,
              91,
              538,
              92,
              516,
              154,
              411,
              154
            ],
            "text": "dozen"
          },
          {
            "boundingBox": [
              554,
              92,
              696,
              94,
              675,
              154,
              533,
              154
            ],
            "text": "liquor"
          },
          {
            "boundingBox": [
              710,
              94,
              800,
              96,
              800,
              154,
              688,
              154
            ],
            "text": "jugs"
          }
        ]
      },
      {
        "boundingBox": [
          2,
          52,
          65,
          46,
          69,
          89,
          7,
          95
        ],
        "text": "dog",
        "words": [
          {
            "boundingBox": [
              0,
              62,
              79,
              39,
              94,
              82,
              0,
              105
            ],
            "text": "dog"
          }
        ]
      },
      {
        "boundingBox": [
          6,
          2,
          771,
          13,
          770,
          75,
          5,
          64
        ],
        "text": "The quick brown fox jumps over the lazy",
        "words": [
          {
            "boundingBox": [
              8,
              4,
              92,
              5,
              77,
              71,
              0,
              71
            ],
            "text": "The"
          },
          {
            "boundingBox": [
              89,
              5,
              188,
              5,
              173,
              72,
              74,
              71
            ],
            "text": "quick"
          },
          {
            "boundingBox": [
              188,
              5,
              323,
              6,
              308,
              73,
              173,
              72
            ],
            "text": "brown"
          },
          {
            "boundingBox": [
              316,
              6,
              386,
              6,
              371,
              73,
              302,
              73
            ],
            "text": "fox"
          },
          {
            "boundingBox": [
              396,
              7,
              508,
              7,
              493,
              74,
              381,
              73
            ],
            "text": "jumps"
          },
          {
            "boundingBox": [
              501,
              7,
              604,
              8,
              589,
              75,
              487,
              74
            ],
            "text": "over"
          },
          {
            "boundingBox": [
              600,
              8,
              673,
              8,
              658,
              75,
              586,
              75
            ],
            "text": "the"
          },
          {
            "boundingBox": [
              670,
              8,
              800,
              9,
              787,
              76,
              655,
              75
            ],
            "text": "lazy"
          }
        ]
      }
    ]
  }
}
```