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

Use the Image Analysis REST API to to read text and generate captions for the image (version 4.0 only).

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Prerequisites" target="_target">I ran into an issue</a>

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
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/computervision/imageanalysis:analyze?features=Caption,Text&model-version=latest&language=en&api-version=2023-02-01-preview" -d "{'url':'https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png'}"
    ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Analyze-image" target="_target">I ran into an issue</a>

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
    },
    "page": 1,
    "angle": 0,
    "width": 1038,
    "height": 692,
    "unit": "pixel",
    "lines":
    [
        {
            "boundingBox": [130,129,215,130,215,149,130,148],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "9:35 AM",
            "words": [{"boundingBox":[131,130,171,130,171,149,130,149],"text":"9:35","confidence":0.993},{"boundingBox":[179,130,204,130,203,149,178,149],"text":"AM","confidence":0.998}]
        },
        {
            "boundingBox": [131,153,224,153,224,161,131,160],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Conference room 154584354",
            "words": [{"boundingBox":[142,154,174,154,173,161,142,161],"text":"Conference","confidence":0.851},{"boundingBox":[175,154,189,154,188,161,174,161],"text":"room","confidence":0.891},{"boundingBox":[192,154,224,154,223,161,191,161],"text":"154584354","confidence":0.714}]
        },
        {
            "boundingBox": [545,179,589,180,589,190,545,189],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Town Hall",
            "words": [{"boundingBox":[546,180,568,180,568,190,546,190],"text":"Town","confidence":0.988},{"boundingBox":[570,180,590,180,589,190,570,190],"text":"Hall","confidence":0.987}]
        },
        {
            "boundingBox": [545,192,596,193,596,200,545,199],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "9:00 AM - 10:00 AM",
            "words": [{"boundingBox":[545,193,556,193,556,200,545,200],"text":"9:00","confidence":0.379},{"boundingBox":[557,193,565,193,564,200,557,200],"text":"AM","confidence":0.993},{"boundingBox":[567,193,569,193,568,200,567,200],"text":"-","confidence":0.843},{"boundingBox":[570,193,584,193,584,200,570,200],"text":"10:00","confidence":0.854},{"boundingBox":[586,193,593,193,593,200,585,200],"text":"AM","confidence":0.998}]
        },
        {
            "boundingBox": [545,201,581,202,581,208,545,208],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Aston Buien",
            "words": [{"boundingBox":[545,202,560,202,559,208,546,208],"text":"Aston","confidence":0.341},{"boundingBox":[561,202,579,203,579,208,561,208],"text":"Buien","confidence":0.335}]
        },
        {
            "boundingBox": [537,258,572,258,572,265,537,265],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Daily SCRUM",
            "words": [{"boundingBox":[538,259,551,259,550,265,538,265],"text":"Daily","confidence":0.613},{"boundingBox":[552,259,570,259,570,265,552,265],"text":"SCRUM","confidence":0.947}]
        },
        {
            "boundingBox": [537,266,590,266,590,272,537,272],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "10:00 AM-11:00 AM",
            "words": [{"boundingBox":[538,267,552,267,552,273,538,273],"text":"10:00","confidence":0.931},{"boundingBox":[553,267,577,266,578,272,554,273],"text":"AM-11:00","confidence":0.57},{"boundingBox":[579,266,586,266,586,272,579,272],"text":"AM","confidence":0.995}]
        },
        {
            "boundingBox": [538,274,584,273,584,279,538,279],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Charlathe de Crum",
            "words": [{"boundingBox":[538,274,562,274,562,280,538,280],"text":"Charlathe","confidence":0.345},{"boundingBox":[563,274,568,274,568,280,563,280],"text":"de","confidence":0.784},{"boundingBox":[570,274,582,274,582,280,570,280],"text":"Crum","confidence":0.905}]
        },
        {
            "boundingBox": [538,296,589,296,589,302,538,302],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Quarterly NI Hands",
            "words": [{"boundingBox":[539,296,562,296,562,302,539,302],"text":"Quarterly","confidence":0.655},{"boundingBox":[563,296,570,296,570,302,563,302],"text":"NI","confidence":0.127},{"boundingBox":[571,296,588,296,588,302,571,302],"text":"Hands","confidence":0.617}]
        },
        {
            "boundingBox": [537,303,590,303,590,309,537,309],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "11:00 AM-12:00 PM",
            "words": [{"boundingBox":[538,304,552,304,552,309,538,310],"text":"11:00","confidence":0.649},{"boundingBox":[553,304,578,303,577,309,553,309],"text":"AM-12:00","confidence":0.781},{"boundingBox":[579,303,586,303,585,309,578,309],"text":"PM","confidence":0.788}]
        },
        {
            "boundingBox": [538,310,577,310,577,317,538,316],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Bebek Shaman",
            "words": [{"boundingBox":[539,311,554,311,554,317,539,317],"text":"Bebek","confidence":0.604},{"boundingBox":[555,311,576,311,575,317,555,317],"text":"Shaman","confidence":0.258}]
        },
        {
            "boundingBox": [505,316,518,316,517,320,505,320],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Thuare",
            "words": [{"boundingBox":[505,317,516,317,516,321,506,321],"text":"Thuare","confidence":0.097}]
        },
        {
            "boundingBox": [538,333,582,332,582,339,538,339],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Weekly stand up",
            "words": [{"boundingBox":[539,333,556,333,556,339,538,339],"text":"Weekly","confidence":0.611},{"boundingBox":[558,333,571,333,571,339,558,339],"text":"stand","confidence":0.221},{"boundingBox":[573,333,580,333,580,339,573,339],"text":"up","confidence":0.933}]
        },
        {
            "boundingBox": [538,339,586,339,586,345,538,345],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "12:00 PM-1:00 PM",
            "words": [{"boundingBox":[539,340,552,340,552,346,539,346],"text":"12:00","confidence":0.919},{"boundingBox":[553,340,574,340,574,346,553,346],"text":"PM-1:00","confidence":0.901},{"boundingBox":[575,340,582,340,582,346,575,346],"text":"PM","confidence":0.997}]
        },
        {
            "boundingBox": [537,347,584,346,584,353,537,353],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Delle Marckre",
            "words": [{"boundingBox":[538,347,558,347,558,353,539,354],"text":"Delle","confidence":0.618},{"boundingBox":[559,347,583,347,583,353,560,353],"text":"Marckre","confidence":0.349}]
        },
        {
            "boundingBox": [538,370,577,370,577,376,538,375],
            "appearance": {"style":{"name":"other","confidence":0.972}},
            "text": "Product review",
            "words": [{"boundingBox":[539,370,559,371,558,376,539,376],"text":"Product","confidence":0.615},{"boundingBox":[560,371,576,371,575,376,559,376],"text":"review","confidence":0.04}]
        }
    ]
}
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Output" target="_target">I ran into an issue</a>

## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analysis 4.0 API features.

> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../overview-image-analysis.md)
