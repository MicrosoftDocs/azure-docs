---
title: Computer Vision API JavaScript quick starts | Microsoft Docs
description: Get information and code samples to help you quickly get started using JavaScript and the Computer Vision API in Cognitive Services.
services: cognitive-services
author: JuliaNik
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 05/22/2017
ms.author: juliakuz
---

# Computer Vision JavaScript Quick Starts

This article provides information and code samples to help you quickly get started using JavaScript and the Computer Vision API to accomplish the following tasks: 
* [Analyze an image](#AnalyzeImage) 
* [Use a Domain-Specific Model](#DomainSpecificModel)
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract text from an Image](#OCR)

Learn more about obtaining free Subscription Keys [here](../Vision-API-How-to-Topics/HowToSubscribe.md)

## Analyze an Image With Computer Vision API Using JavaScript <a name="AnalyzeImage"> </a>

With the [Analyze Image method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* The category defined in this [taxonomy](../Category-Taxonomy.md). 
* A detailed list of tags related to the image content. 
* A description of image content in a complete sentence. 
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clipart or a line drawing)
* The dominant color, the accent color, or whether an image is black & white.
* Whether the image contains pornographic or sexually suggestive content. 

### Analyze an Image JavaScript Example Request

Copy the following and save it to a file such as `analyze.html`. Change the `url` to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key. To run the sample, drag-and-drop the file into your browser.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Analyze an Image Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
        };

        $.ajax({
            // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
            
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
    
                // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");
            },
            
            type: "POST",
            
            // Request body
            data: '{"url": "http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg"}',
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
    });
</script>
REST response:
<br><br>
<textarea id="responseTextArea" class="UIInput" cols="120" rows="32"></textarea>
</body>
</html>
```

### Analyze an Image Response

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
        "confidence": 0.9165147003194483
      }
    ]
  },
  "requestId": "b372f8d6-4b56-43ed-9fbb-0ae2a888a1e9",
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

## Use a Domain-Specific Model <a name="DomainSpecificModel"> </a>
The Domain-Specific Model is a model trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are celebrities and landmarks. The following example identifies a landmark in an image.

### Landmark JavaScript Example Request

Copy the following and save it to a file such as `landmark.html`. Change the `url` to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key. Then drag-and-drop the file into your browser to run this sample.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Landscape Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters.
            "model": "landmarks", // Use "model": "celebrities" to use the Celebrities model.
        };

        $.ajax({
            // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            //
            // Also, change "landmarks" to "celebrities" in the url to use the Celebrities model.
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/landmarks/analyze?" + $.param(params),

            beforeSend: function(xhrObj) {
                // Request headers.
                xhrObj.setRequestHeader("Content-Type", "application/json");

                // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "13hc77781f7e4b19b5fcdd72a8df7156");
            },

            type: "POST",

            // Request body
            data: '{"url": "https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg"}',
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
    });
</script>
REST response:
<br><br>
<textarea id="responseTextArea" class="UIInput" cols="120" rows="32"></textarea>
</body>
</html>
```

### Landmark Example Response
A successful response is returned in JSON. Following is an example of a successful response:  

```json
{
  "requestId": "e0970003-1cb7-4ac6-b0d4-f36a1914bf4e",
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

## Get a Thumbnail with Computer Vision API Using JavaScript <a name="GetThumbnail"> </a>
Use the [Get Thumbnail method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to  crop an image based on its region of interest (ROI) to the height and width you desire, even if the aspect ratio differs from the input image. 

### Get a Thumbnail JavaScript Example Request

Copy the following and save it to a file such as `thumbnail.html`. Change the `url` to use the location where you obtained your subscription keys, replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key, and add the body. To run the sample, drag-and-drop the file into your browser.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Thumbnail Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "width": "{number}",        // Replace "{number}" with the desired width of your thumbnail.
            "height": "{number}",       // Replace "{number}" with the desired height of your thumbnail.
            "smartCropping": "true",
        };
      
        $.ajax({
            // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");

                // Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","13hc77781f7e4b19b5fcdd72a8df7156");
            },
            type: "POST",
            // Request body
            data: "{body}",     // Replace "{body}" with the body. For example, '{"url": "http://www.example.com/images/image.jpg"}'
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```

### Get a Thumbnail Response

A successful response contains the thumbnail image binary. If the request failed, the response contains an error code and a message to help determine what went wrong.

## Optical Character Recognition (OCR) with Computer Vision API Using JavaScript<a name="OCR"> </a>

Use the [Optical Character Recognition (OCR) method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image and extract recognized characters into a machine-usable character stream.

### OCR JavaScript Example Request

Copy the following and save it to a file such as `thumbnail.html`. Change the `url` to use the location where you obtained your subscription keys, replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key, and add the body. Then drag-and-drop the file into your browser to run this sample.

```html
<!DOCTYPE html>
<html>
<head>
    <title>OCR Sample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "language": "unk",
            "detectOrientation ": "true",
        };
      
        $.ajax({
            // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
            //   URL below with "westus".
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");

                // Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","13hc77781f7e4b19b5fcdd72a8df7156");
            },
            type: "POST",
            // Request body
            data: "{body}",     // Replace with the body, for example, "{"url": "http://www.example.com/images/image.jpg"}
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>

```

### OCR Example Response

Upon success, the OCR results returned include text, bounding box for regions, lines, and words. 

```json 
{
  "language": "en",
  "textAngle": -2.0000000000000338,
  "orientation": "Up",
  "regions": [
    {
      "boundingBox": "462,379,497,258",
      "lines": [
        {
          "boundingBox": "462,379,497,74",
          "words": [
            {
              "boundingBox": "462,379,41,73",
              "text": "A"
            },
            {
              "boundingBox": "523,379,153,73",
              "text": "GOAL"
            },
            {
              "boundingBox": "694,379,265,74",
              "text": "WITHOUT"
            }
          ]
        },
        {
          "boundingBox": "565,471,289,74",
          "words": [
            {
              "boundingBox": "565,471,41,73",
              "text": "A"
            },
            {
              "boundingBox": "626,471,150,73",
              "text": "PLAN"
            },
            {
              "boundingBox": "801,472,53,73",
              "text": "IS"
            }
          ]
        },
        {
          "boundingBox": "519,563,375,74",
          "words": [
            {
              "boundingBox": "519,563,149,74",
              "text": "JUST"
            },
            {
              "boundingBox": "683,564,41,72",
              "text": "A"
            },
            {
              "boundingBox": "741,564,153,73",
              "text": "WISH"
            }
          ]
        }
      ]
    }
  ]
}

```

