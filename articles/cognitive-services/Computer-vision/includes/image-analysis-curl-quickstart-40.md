---
title: "Quickstart: Image Analysis 4.0 REST API"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, get started with the Image Analysis 4.0 REST API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

Use the Image Analysis REST API to generate captions for the image (version 4.0 only).

> [!TIP]
> The Analyze API can do many different operations other than generate captions. See the [Image Analysis how-to guide](../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/ComputerVision/REST), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/ComputerVision/REST), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/ComputerVision/REST), and [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/ComputerVision/REST).

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
    1. Optionally, change the image URL in the request body (`https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.


    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/computervision/imageanalysis:analyze?features=Description&model-version=latest&language=en&api-version=2022-10-12-preview" -d "{'url':'https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png'}"
    ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:


```json
{
    "kind": "imageAnalysisResult",
    "metadata": {
        "height": 692,
        "width": 1038
    },
    "describeResult": {
    "description": {
      "tags": [
        "text",
        "person",
        "indoor",
        "electronics",
        "television",
        "standing",
        "display"
      ],
      "captions": [
        {
          "text": "a man pointing at a screen",
          "confidence": 0.4891590476036072
        }
      ]
    }
    }
}
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../overview-image-analysis.md)
