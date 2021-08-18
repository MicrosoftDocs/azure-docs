---
title: "Face REST API quickstart"
description: Use the Face REST API with cURL to detect faces, find similar (face search by image), identify faces (facial recognition search) and migrate your face data.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 12/06/2020
ms.author: pafarley
---

Get started with facial recognition using the Face REST API. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face REST API to:

* [Detect and analyze faces](#detect-and-analyze-faces)
* [Find similar faces](#find-similar-faces)

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Face/rest), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/Face/rest), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/Face/rest), [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/Face/rest), and [Go](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/go/Face/rest).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.


## Detect and analyze faces

You'll use a command like the following to call the Face API and get face attribute data from an image. First, copy the code into a text editor&mdash;you'll need to make changes to certain parts of the command before you can run it.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detection_model_3":::

Make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.
   [!INCLUDE [subdomains-note](../../../../../includes/cognitive-services-custom-subdomains-note.md)]
1. Optionally change the URL in the body of the request to point to a different image.

Once you've made your changes, open a command prompt and enter the new command. 

### Examine the results

You should see the face information displayed as JSON data in the console window. For example:

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

### Get face attributes
 
To extract face attributes, call the Detect API again, but set `detectionModel` to `detection_01`. Add the `returnFaceAttributes` query parameter as well. The command should now look like the following. As before, insert your Face subscription key and endpoint.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detection_model_1":::

### Examine the results

The returned face information now includes face attributes. For example:

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

## Find similar faces

This operation takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, you need to detect faces in images before you can compare them. Run this command as you did in the [Detect and analyze](#detect-and-analyze-faces) section. This detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different detection model.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="detect_for_similar":::

Find the `"faceId"` value in the JSON response and save it to a temporary location. Then, call the above command again for these other image URLs, and save their face IDs as well. You'll use these IDs as the target group of faces from which to find a similar face.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_group":::

Finally, detect the single source face that you'll use for matching, and save its ID. Keep this ID separate from the others.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_matcher":::

### Find matches

Copy the following command to a text editor.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar":::

Then make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.

Use the following JSON content for the `body` value:

:::code language="JSON" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="similar_body":::

1. Use the source face ID for `"faceId"`.
1. Paste the other face IDs as terms in the `"faceIds"` array.

### Examine the results

You'll receive a JSON response that lists the IDs of the faces that match your query face.

```json
[
    {
        "persistedFaceId" : "015839fb-fbd9-4f79-ace9-7675fc2f1dd9",
        "confidence" : 0.82
    },
    ...
] 
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face REST API to do basic facial recognition tasks. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../Face-API-How-to-Topics/specify-detection-model.md)

* [What is the Face service?](../../overview.md)