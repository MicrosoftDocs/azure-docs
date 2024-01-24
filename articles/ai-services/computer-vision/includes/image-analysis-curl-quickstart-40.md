---
title: "Quickstart: Image Analysis 4.0 REST API"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the Image Analysis 4.0 REST API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022, references_regions
---

Use the Image Analysis REST API to read text and generate captions for the image (version 4.0 only).

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Computer Vision resource"  target="_blank">create a Computer Vision resource</a> in the Azure portal to get your key and endpoint. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US, East Asia. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed



## Analyze an image

To analyze an image for various visual features, do the following steps:

1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-10-01" -d "{'url':'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'}"
    ```

1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your Vision resource key.
    1. Replace the value of `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    1. Optionally, change the image URL in the request body (`https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.



### Examine the response

A successful response is returned in JSON, similar to the following example:


```json
{
    "modelVersion": "2023-10-01",
    "captionResult":
    {
        "text": "a man pointing at a screen",
        "confidence": 0.7767987847328186
    },
    "metadata":
    {
        "width": 1038,
        "height": 692
    },
    "readResult":
    {
        "blocks":
        [
            {
                "lines":
                [
                    {
                        "text": "9:35 AM",
                        "boundingPolygon": [{"x":131,"y":130},{"x":214,"y":130},{"x":214,"y":148},{"x":131,"y":148}],
                        "words": [{"text":"9:35","boundingPolygon":[{"x":132,"y":130},{"x":172,"y":131},{"x":171,"y":149},{"x":131,"y":148}],"confidence":0.977},{"text":"AM","boundingPolygon":[{"x":180,"y":131},{"x":203,"y":131},{"x":202,"y":149},{"x":180,"y":149}],"confidence":0.998}]
                    },
                    {
                        "text": "Conference room 154584354",
                        "boundingPolygon": [{"x":132,"y":153},{"x":224,"y":153},{"x":224,"y":161},{"x":132,"y":160}],
                        "words": [{"text":"Conference","boundingPolygon":[{"x":143,"y":153},{"x":174,"y":154},{"x":174,"y":161},{"x":143,"y":161}],"confidence":0.693},{"text":"room","boundingPolygon":[{"x":176,"y":154},{"x":188,"y":154},{"x":188,"y":161},{"x":176,"y":161}],"confidence":0.959},{"text":"154584354","boundingPolygon":[{"x":192,"y":154},{"x":224,"y":154},{"x":223,"y":161},{"x":192,"y":161}],"confidence":0.705}]
                    },
                    {
                        "text": ": 555-123-4567",
                        "boundingPolygon": [{"x":133,"y":164},{"x":183,"y":164},{"x":183,"y":170},{"x":133,"y":170}],
                        "words": [{"text":":","boundingPolygon":[{"x":134,"y":165},{"x":137,"y":165},{"x":136,"y":171},{"x":133,"y":171}],"confidence":0.162},{"text":"555-123-4567","boundingPolygon":[{"x":143,"y":165},{"x":182,"y":165},{"x":181,"y":171},{"x":143,"y":171}],"confidence":0.653}]
                    },
                    {
                        "text": "Town Hall",
                        "boundingPolygon": [{"x":545,"y":178},{"x":588,"y":179},{"x":588,"y":190},{"x":545,"y":190}],
                        "words": [{"text":"Town","boundingPolygon":[{"x":545,"y":179},{"x":569,"y":180},{"x":569,"y":190},{"x":545,"y":190}],"confidence":0.988},{"text":"Hall","boundingPolygon":[{"x":571,"y":180},{"x":589,"y":180},{"x":589,"y":190},{"x":571,"y":190}],"confidence":0.99}]
                    },
                    {
                        "text": "9:00 AM - 10:00 AM",
                        "boundingPolygon": [{"x":545,"y":191},{"x":596,"y":191},{"x":596,"y":199},{"x":545,"y":198}],
                        "words": [{"text":"9:00","boundingPolygon":[{"x":546,"y":191},{"x":556,"y":192},{"x":556,"y":199},{"x":546,"y":199}],"confidence":0.758},{"text":"AM","boundingPolygon":[{"x":558,"y":192},{"x":565,"y":192},{"x":564,"y":199},{"x":558,"y":199}],"confidence":0.989},{"text":"-","boundingPolygon":[{"x":567,"y":192},{"x":570,"y":192},{"x":569,"y":199},{"x":567,"y":199}],"confidence":0.896},{"text":"10:00","boundingPolygon":[{"x":571,"y":192},{"x":585,"y":192},{"x":585,"y":199},{"x":571,"y":199}],"confidence":0.797},{"text":"AM","boundingPolygon":[{"x":587,"y":192},{"x":594,"y":193},{"x":593,"y":199},{"x":586,"y":199}],"confidence":0.994}]
                    },
                    {
                        "text": "Aaron Blaion",
                        "boundingPolygon": [{"x":542,"y":201},{"x":581,"y":201},{"x":581,"y":207},{"x":542,"y":207}],
                        "words": [{"text":"Aaron","boundingPolygon":[{"x":545,"y":201},{"x":560,"y":202},{"x":560,"y":208},{"x":545,"y":208}],"confidence":0.718},{"text":"Blaion","boundingPolygon":[{"x":562,"y":202},{"x":579,"y":202},{"x":579,"y":207},{"x":562,"y":207}],"confidence":0.274}]
                    },
                    {
                        "text": "Daily SCRUM",
                        "boundingPolygon": [{"x":537,"y":258},{"x":574,"y":259},{"x":574,"y":266},{"x":537,"y":265}],
                        "words": [{"text":"Daily","boundingPolygon":[{"x":538,"y":259},{"x":551,"y":259},{"x":551,"y":266},{"x":538,"y":265}],"confidence":0.404},{"text":"SCRUM","boundingPolygon":[{"x":553,"y":259},{"x":570,"y":260},{"x":570,"y":265},{"x":553,"y":266}],"confidence":0.697}]
                    },
                    {
                        "text": "10:00 AM-11:00 AM",
                        "boundingPolygon": [{"x":535,"y":266},{"x":589,"y":265},{"x":589,"y":272},{"x":535,"y":273}],
                        "words": [{"text":"10:00","boundingPolygon":[{"x":539,"y":267},{"x":553,"y":266},{"x":552,"y":273},{"x":539,"y":274}],"confidence":0.219},{"text":"AM-11:00","boundingPolygon":[{"x":554,"y":266},{"x":578,"y":266},{"x":578,"y":272},{"x":554,"y":273}],"confidence":0.175},{"text":"AM","boundingPolygon":[{"x":580,"y":266},{"x":587,"y":266},{"x":586,"y":272},{"x":580,"y":272}],"confidence":1}]
                    },
                    {
                        "text": "Charlene de Crum",
                        "boundingPolygon": [{"x":538,"y":272},{"x":588,"y":273},{"x":588,"y":279},{"x":538,"y":279}],
                        "words": [{"text":"Charlene","boundingPolygon":[{"x":538,"y":273},{"x":562,"y":273},{"x":562,"y":280},{"x":538,"y":280}],"confidence":0.322},{"text":"de","boundingPolygon":[{"x":563,"y":273},{"x":569,"y":273},{"x":569,"y":280},{"x":563,"y":280}],"confidence":0.91},{"text":"Crum","boundingPolygon":[{"x":570,"y":273},{"x":582,"y":273},{"x":583,"y":280},{"x":571,"y":280}],"confidence":0.871}]
                    },
                    {
                        "text": "Quarterly NI Handa",
                        "boundingPolygon": [{"x":537,"y":295},{"x":588,"y":295},{"x":588,"y":302},{"x":537,"y":302}],
                        "words": [{"text":"Quarterly","boundingPolygon":[{"x":539,"y":296},{"x":563,"y":296},{"x":563,"y":302},{"x":538,"y":302}],"confidence":0.603},{"text":"NI","boundingPolygon":[{"x":564,"y":296},{"x":570,"y":296},{"x":571,"y":302},{"x":564,"y":302}],"confidence":0.73},{"text":"Handa","boundingPolygon":[{"x":572,"y":296},{"x":588,"y":296},{"x":588,"y":302},{"x":572,"y":302}],"confidence":0.905}]
                    },
                    {
                        "text": "11.00 AM-12:00 PM",
                        "boundingPolygon": [{"x":538,"y":303},{"x":587,"y":303},{"x":587,"y":309},{"x":538,"y":309}],
                        "words": [{"text":"11.00","boundingPolygon":[{"x":539,"y":303},{"x":552,"y":303},{"x":553,"y":309},{"x":539,"y":310}],"confidence":0.671},{"text":"AM-12:00","boundingPolygon":[{"x":554,"y":303},{"x":578,"y":303},{"x":578,"y":309},{"x":554,"y":309}],"confidence":0.656},{"text":"PM","boundingPolygon":[{"x":579,"y":303},{"x":586,"y":303},{"x":586,"y":309},{"x":580,"y":309}],"confidence":0.454}]
                    },
                    {
                        "text": "Bobek Shemar",
                        "boundingPolygon": [{"x":538,"y":310},{"x":577,"y":310},{"x":577,"y":316},{"x":538,"y":316}],
                        "words": [{"text":"Bobek","boundingPolygon":[{"x":539,"y":310},{"x":554,"y":311},{"x":554,"y":317},{"x":539,"y":317}],"confidence":0.632},{"text":"Shemar","boundingPolygon":[{"x":556,"y":311},{"x":576,"y":311},{"x":577,"y":317},{"x":556,"y":317}],"confidence":0.219}]
                    },
                    {
                        "text": "Weekly aband up",
                        "boundingPolygon": [{"x":538,"y":332},{"x":583,"y":333},{"x":583,"y":339},{"x":538,"y":338}],
                        "words": [{"text":"Weekly","boundingPolygon":[{"x":539,"y":333},{"x":557,"y":333},{"x":557,"y":339},{"x":539,"y":339}],"confidence":0.575},{"text":"aband","boundingPolygon":[{"x":558,"y":334},{"x":573,"y":334},{"x":573,"y":339},{"x":558,"y":339}],"confidence":0.475},{"text":"up","boundingPolygon":[{"x":574,"y":334},{"x":580,"y":334},{"x":580,"y":339},{"x":574,"y":339}],"confidence":0.865}]
                    },
                    {
                        "text": "12:00 PM-1:00 PM",
                        "boundingPolygon": [{"x":538,"y":339},{"x":585,"y":339},{"x":585,"y":346},{"x":538,"y":346}],
                        "words": [{"text":"12:00","boundingPolygon":[{"x":539,"y":339},{"x":553,"y":340},{"x":553,"y":347},{"x":539,"y":346}],"confidence":0.709},{"text":"PM-1:00","boundingPolygon":[{"x":554,"y":340},{"x":575,"y":340},{"x":575,"y":346},{"x":554,"y":347}],"confidence":0.908},{"text":"PM","boundingPolygon":[{"x":576,"y":340},{"x":583,"y":340},{"x":583,"y":346},{"x":576,"y":346}],"confidence":0.998}]
                    },
                    {
                        "text": "Danielle MarchTe",
                        "boundingPolygon": [{"x":538,"y":346},{"x":583,"y":346},{"x":583,"y":352},{"x":538,"y":352}],
                        "words": [{"text":"Danielle","boundingPolygon":[{"x":539,"y":347},{"x":559,"y":347},{"x":559,"y":352},{"x":539,"y":353}],"confidence":0.196},{"text":"MarchTe","boundingPolygon":[{"x":560,"y":347},{"x":582,"y":347},{"x":582,"y":352},{"x":560,"y":352}],"confidence":0.571}]
                    },
                    {
                        "text": "Product reviret",
                        "boundingPolygon": [{"x":537,"y":370},{"x":578,"y":370},{"x":578,"y":375},{"x":537,"y":375}],
                        "words": [{"text":"Product","boundingPolygon":[{"x":539,"y":370},{"x":559,"y":370},{"x":559,"y":376},{"x":539,"y":375}],"confidence":0.7},{"text":"reviret","boundingPolygon":[{"x":560,"y":370},{"x":578,"y":371},{"x":578,"y":375},{"x":560,"y":376}],"confidence":0.218}]
                    }
                ]
            }
        ]
    }
}
```



## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analysis 4.0 API features.

> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../overview-image-analysis.md)
