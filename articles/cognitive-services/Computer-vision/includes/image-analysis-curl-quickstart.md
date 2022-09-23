---
title: "Quickstart: Image Analysis REST API"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, get started with the Image Analysis REST API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 09/12/2022
ms.author: pafarley
ms.custom: seodec18
---

Use the Image Analysis REST API to analyze an image for tags.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../how-to/call-analyze-image.md) for examples that showcase all of the available features.

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/ComputerVision/REST), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/ComputerVision/REST), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/ComputerVision/REST), and [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/ComputerVision/REST).\

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze an image

To analyze an image for various visual features, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your key.
    1. Replace the first part of the request URL (`westcentralus`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

    #### [Version 3.2](#tab/3-2)

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Description,Tags" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.JPG/800px-Salto_del_Angel-Canaima-Venezuela08.JPG'}"
    ```

    #### [Version 4.0](#tab/4-0)

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: 9628575870314fdc909295d965e4ec40" -H "Content-Type: application/json" "https://pafarley-computer-vision.cognitiveservices.azure.com/vision/v4.0-preview.1/operations/imageanalysis:analyze?visualFeatures=Description,Tags" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.JPG/800px-Salto_del_Angel-Canaima-Venezuela08.JPG'}"
    ```
    ---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:

#### [Version 3.2](#tab/3-2)
```json
{
   "tags":[
      {
         "name":"waterfall",
         "confidence":0.9950293898582458
      },
      {
         "name":"nature",
         "confidence":0.9945577383041382
      },
      {
         "name":"outdoor",
         "confidence":0.9904685616493225
      },
      {
         "name":"sky",
         "confidence":0.954681932926178
      },
      {
         "name":"water",
         "confidence":0.9417277574539185
      },
      {
         "name":"mountain",
         "confidence":0.9049681425094604
      },
      {
         "name":"cloud",
         "confidence":0.8891517519950867
      },
      {
         "name":"landscape",
         "confidence":0.4679204523563385
      }
   ],
   "description":{
      "tags":[
         "outdoor",
         "nature",
         "sky",
         "mountain",
         "waterfall",
         "water",
         "hill",
         "slope"
      ],
      "captions":[
         {
            "text":"Angel Falls in a mountain",
            "confidence":0.3540296256542206
         }
      ]
   },
   "requestId":"4aa2195b-2ab3-4163-832e-f7eacf4c417c",
   "metadata":{
      "height":1067,
      "width":800,
      "format":"Jpeg"
   },
   "modelVersion":"2021-05-01"
}
```

#### [Version 4.0](#tab/4-0)

```json
{
   "kind":"imageAnalysisResult",
   "metadata":{
      "height":1067,
      "width":800
   },
   "tagResult":{
      "tags":[
         {
            "name":"waterfall",
            "confidence":0.9950293898582458
         },
         {
            "name":"nature",
            "confidence":0.9945577383041382
         },
         {
            "name":"outdoor",
            "confidence":0.9904685616493225
         },
         {
            "name":"sky",
            "confidence":0.954681932926178
         },
         {
            "name":"water",
            "confidence":0.9417277574539185
         },
         {
            "name":"mountain",
            "confidence":0.9049681425094604
         },
         {
            "name":"cloud",
            "confidence":0.8891517519950867
         },
         {
            "name":"landscape",
            "confidence":0.4679204523563385
         }
      ]
   },
   "describeResult":{
      "description":{
         "tags":[
            "outdoor",
            "nature",
            "sky",
            "mountain",
            "waterfall",
            "water",
            "hill",
            "slope"
         ],
         "captions":[
            {
               "text":"Angel Falls in a rocky area",
               "confidence":0.36895880103111267
            }
         ]
      }
   }
}
```
---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../how-to/call-analyze-image.md)

* [Image Analysis overview](../overview-image-analysis.md)
