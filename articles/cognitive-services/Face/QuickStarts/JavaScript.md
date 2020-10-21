---
title: "Quickstart: Detect faces in an image using the REST API and JavaScript"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you detect faces from an image using the Face API with JavaScript in Cognitive Services.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.custom: devx-track-js
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 08/05/2020
ms.author: pafarley
---
# Quickstart: Detect faces in an image using the REST API and JavaScript

In this quickstart, you'll use the Azure Face REST API with JavaScript to detect human faces in an image.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* A code editor such as [Visual Studio Code](https://code.visualstudio.com/download)

## Initialize the HTML file

Create a new HTML file, *detectFaces.html*, and add the following code.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Detect Faces Sample</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    </head>
    <body></body>
</html>
```

Then add the following code inside the `body` element of the document. This code sets up a basic user interface with a URL field, an **Analyze face** button, a response pane, and an image display pane.

:::code language="html" source="~/cognitive-services-quickstart-code/javascript/web/face/rest/detect.html" id="html_include":::

## Write the JavaScript script

Add the following code immediately above the `h1` element in your document. This code sets up the JavaScript code that calls the Face API.

:::code language="html" source="~/cognitive-services-quickstart-code/javascript/web/face/rest/detect.html" id="script_include":::

You'll need to update the `subscriptionKey` field with the value of your subscription key, and you need to change the `uriBase` string so that it contains the correct endpoint string. The `returnFaceAttributes` field specifies which face attributes to retrieve; you may wish to change this string depending on your intended use.

[!INCLUDE [subdomains-note](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Run the script

Open *detectFaces.html* in your browser. When you click the **Analyze face** button, the app should display the image from the given URL and print out a JSON string of face data.

![GettingStartCSharpScreenshot](../Images/face-detect-javascript.png)

The following text is an example of a successful JSON response.

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    }
  }
]
```

## Extract Face Attributes
 
To extract face attributes, use detection model 1 and add the `returnFaceAttributes` query parameter.

```javascript
// Request parameters.
var params = {
    "detectionModel": "detection_01",
    "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    "returnFaceId": "true"
};
```

The response now includes face attributes. For example:

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    },
    "faceAttributes": {
      "smile": 0,
      "headPose": {
        "pitch": 0,
        "roll": 0.1,
        "yaw": -32.9
      },
      "gender": "female",
      "age": 22.9,
      "facialHair": {
        "moustache": 0,
        "beard": 0,
        "sideburns": 0
      },
      "glasses": "NoGlasses",
      "emotion": {
        "anger": 0,
        "contempt": 0,
        "disgust": 0,
        "fear": 0,
        "happiness": 0,
        "neutral": 0.986,
        "sadness": 0.009,
        "surprise": 0.005
      },
      "blur": {
        "blurLevel": "low",
        "value": 0.06
      },
      "exposure": {
        "exposureLevel": "goodExposure",
        "value": 0.67
      },
      "noise": {
        "noiseLevel": "low",
        "value": 0
      },
      "makeup": {
        "eyeMakeup": true,
        "lipMakeup": true
      },
      "accessories": [],
      "occlusion": {
        "foreheadOccluded": false,
        "eyeOccluded": false,
        "mouthOccluded": false
      },
      "hair": {
        "bald": 0,
        "invisible": false,
        "hairColor": [
          {
            "color": "brown",
            "confidence": 1
          },
          {
            "color": "black",
            "confidence": 0.87
          },
          {
            "color": "other",
            "confidence": 0.51
          },
          {
            "color": "blond",
            "confidence": 0.08
          },
          {
            "color": "red",
            "confidence": 0.08
          },
          {
            "color": "gray",
            "confidence": 0.02
          }
        ]
      }
    }
  }
]
```

## Next steps

In this quickstart, you wrote a JavaScript script that calls the Azure Face service to detect faces in an image and return their attributes. Next, explore the Face API reference documentation to learn more.

> [!div class="nextstepaction"]
> [Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
