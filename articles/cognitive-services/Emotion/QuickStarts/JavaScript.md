---
title: Emotion API JavaScript quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Emotion API with JavaScript in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: emotion
ms.topic: article
ms.date: 05/23/2017
ms.author: anroth
---

# Emotion API JavaScript Quick Start

> [!IMPORTANT]
> Video API Preview will end on October 30th, 2017. Try the new [Video Indexer API Preview](https://azure.microsoft.com/services/cognitive-services/video-indexer/) to easily extract insights from 
videos and to enhance content discovery experiences, such as search results, by detecting spoken words, faces, characters, and emotions. [Learn more](https://docs.microsoft.com/azure/cognitive-services/video-indexer/video-indexer-overview).

This article provides information and code samples to help you quickly get started using the [Emotion API Recognize method](https://dev.projectoxford.ai/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa) with JavaScript to recognize the emotions expressed by one or more people in an image.

## Prerequisite
* Get your free Subscription Key [here](https://azure.microsoft.com/en-us/try/cognitive-services/)

## Recognize Emotions JavaScript Example Request

Copy the following and save it to a file such as `test.html`. Change the `url` to use the location where you obtained your subscription keys, and replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key, and change the request body to the location of an image you want to use. To run the sample, drag-and-drop the file into your browser.

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
        };
      
        $.ajax({
            // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
            //   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
            //   URL below with "westcentralus".
            url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");

                // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","13hc77781f7e4b19b5fcdd72a8df7156");
            },
            type: "POST",
            // Request body
            data: '{"url": "http://www.example.com/images/image.jpg"}',
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

## Recognize Emotions Sample Response
A successful call returns an array of face entries and their associated emotion scores, ranked by face rectangle size in descending order. An empty response indicates that no faces were detected. An emotion entry contains the following fields:
* faceRectangle - Rectangle location of face in the image.
* scores - Emotion scores for each face in the image. 

```json
application/json 
[
  {
    "faceRectangle": {
      "left": 68,
      "top": 97,
      "width": 64,
      "height": 97
    },
    "scores": {
      "anger": 0.00300731952,
      "contempt": 5.14648448E-08,
      "disgust": 9.180124E-06,
      "fear": 0.0001912825,
      "happiness": 0.9875571,
      "neutral": 0.0009861537,
      "sadness": 1.889955E-05,
      "surprise": 0.008229999
    }
  }
]
