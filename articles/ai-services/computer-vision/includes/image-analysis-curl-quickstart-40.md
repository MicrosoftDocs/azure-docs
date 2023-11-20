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
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US, East Asia. After it deploys, select **Go to resource**.
  * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [cURL](https://curl.haxx.se/) installed



## Analyze an image

To analyze an image for various visual features, do the following steps:

1. Copy the following `curl` command into a text editor.

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview" -d "{'url':'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'}"
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
    "captionResult":
    {
        "text": "a man pointing at a screen",
        "confidence": 0.4891590476036072
    },
    "modelVersion": "2023-02-01-preview",
    "metadata":
    {
        "width": 1038,
        "height": 692
    },
    "readResult":
    {
        "stringIndexType": "TextElements",
        "content": "9:35 AM\nE Conference room 154584354\n#: 555-173-4547\nTown Hall\n9:00 AM - 10:00 AM\nAaron Buaion\nDaily SCRUM\n10:00 AM 11:00 AM\nChurlette de Crum\nQuarterly NI Hands\n11.00 AM-12:00 PM\nBebek Shaman\nWeekly stand up\n12:00 PM-1:00 PM\nDelle Marckre\nProduct review",
        "pages":
        [
            {
                "height": 692,
                "width": 1038,
                "angle": 0.3048,
                "pageNumber": 1,
                "words":
                [
                    {"content":"9:35","boundingBox":[131,130,171,130,171,149,130,149],"confidence":0.993,"span":{"offset":0,"length":4}},
                    {"content":"AM","boundingBox":[179,130,204,130,203,149,178,149],"confidence":0.998,"span":{"offset":5,"length":2}},
                    {"content":"E","boundingBox":[131,154,135,154,135,161,131,161],"confidence":0.104,"span":{"offset":8,"length":1}},
                    {"content":"Conference","boundingBox":[142,154,174,154,173,161,141,161],"confidence":0.902,"span":{"offset":10,"length":10}},
                    {"content":"room","boundingBox":[175,154,189,155,188,161,175,161],"confidence":0.796,"span":{"offset":21,"length":4}},
                    {"content":"154584354","boundingBox":[192,155,224,154,223,162,191,161],"confidence":0.864,"span":{"offset":26,"length":9}},
                    {"content":"#:","boundingBox":[131,163,139,164,139,171,131,171],"confidence":0.036,"span":{"offset":36,"length":2}},
                    {"content":"555-173-4547","boundingBox":[142,164,182,165,181,171,142,171],"confidence":0.597,"span":{"offset":39,"length":12}},
                    {"content":"Town","boundingBox":[547,181,568,181,568,190,546,191],"confidence":0.981,"span":{"offset":52,"length":4}},
                    {"content":"Hall","boundingBox":[570,181,590,181,590,191,570,190],"confidence":0.991,"span":{"offset":57,"length":4}},
                    {"content":"9:00","boundingBox":[546,192,555,192,555,200,546,200],"confidence":0.09,"span":{"offset":62,"length":4}},
                    {"content":"AM","boundingBox":[557,192,565,192,565,200,557,200],"confidence":0.991,"span":{"offset":67,"length":2}},
                    {"content":"-","boundingBox":[567,192,569,192,569,200,567,200],"confidence":0.691,"span":{"offset":70,"length":1}},
                    {"content":"10:00","boundingBox":[570,192,585,193,584,200,570,200],"confidence":0.885,"span":{"offset":72,"length":5}},
                    {"content":"AM","boundingBox":[586,193,593,194,593,200,586,200],"confidence":0.991,"span":{"offset":78,"length":2}},
                    {"content":"Aaron","boundingBox":[545,202,560,202,559,208,544,208],"confidence":0.602,"span":{"offset":81,"length":5}},
                    {"content":"Buaion","boundingBox":[561,202,580,202,579,208,560,208],"confidence":0.291,"span":{"offset":87,"length":6}},
                    {"content":"Daily","boundingBox":[538,259,551,260,550,266,538,265],"confidence":0.175,"span":{"offset":94,"length":5}},
                    {"content":"SCRUM","boundingBox":[552,260,570,260,570,266,551,266],"confidence":0.114,"span":{"offset":100,"length":5}},
                    {"content":"10:00","boundingBox":[539,267,553,267,552,273,538,272],"confidence":0.857,"span":{"offset":106,"length":5}},
                    {"content":"AM","boundingBox":[554,267,561,267,560,273,553,273],"confidence":0.998,"span":{"offset":112,"length":2}},
                    {"content":"11:00","boundingBox":[564,267,578,267,577,273,563,273],"confidence":0.479,"span":{"offset":115,"length":5}},
                    {"content":"AM","boundingBox":[579,267,586,267,585,273,578,273],"confidence":0.994,"span":{"offset":121,"length":2}},
                    {"content":"Churlette","boundingBox":[539,274,562,274,561,279,538,279],"confidence":0.464,"span":{"offset":124,"length":9}},
                    {"content":"de","boundingBox":[563,274,569,274,568,279,562,279],"confidence":0.81,"span":{"offset":134,"length":2}},
                    {"content":"Crum","boundingBox":[570,274,582,273,581,279,569,279],"confidence":0.885,"span":{"offset":137,"length":4}},
                    {"content":"Quarterly","boundingBox":[540,296,562,296,562,302,539,302],"confidence":0.523,"span":{"offset":142,"length":9}},
                    {"content":"NI","boundingBox":[563,296,570,296,570,302,563,302],"confidence":0.303,"span":{"offset":152,"length":2}},
                    {"content":"Hands","boundingBox":[572,296,588,296,588,302,571,302],"confidence":0.613,"span":{"offset":155,"length":5}},
                    {"content":"11.00","boundingBox":[538,304,552,304,552,310,538,310],"confidence":0.618,"span":{"offset":161,"length":5}},
                    {"content":"AM-12:00","boundingBox":[554,304,578,304,577,310,553,310],"confidence":0.27,"span":{"offset":167,"length":8}},
                    {"content":"PM","boundingBox":[579,304,586,304,586,309,578,310],"confidence":0.662,"span":{"offset":176,"length":2}},
                    {"content":"Bebek","boundingBox":[539,310,554,310,554,317,539,316],"confidence":0.611,"span":{"offset":179,"length":5}},
                    {"content":"Shaman","boundingBox":[555,310,576,311,576,317,555,317],"confidence":0.605,"span":{"offset":185,"length":6}},
                    {"content":"Weekly","boundingBox":[538,332,557,333,556,339,538,338],"confidence":0.606,"span":{"offset":192,"length":6}},
                    {"content":"stand","boundingBox":[558,333,572,334,571,340,557,339],"confidence":0.489,"span":{"offset":199,"length":5}},
                    {"content":"up","boundingBox":[574,334,580,334,580,340,573,340],"confidence":0.815,"span":{"offset":205,"length":2}},
                    {"content":"12:00","boundingBox":[539,341,553,341,552,347,538,347],"confidence":0.826,"span":{"offset":208,"length":5}},
                    {"content":"PM-1:00","boundingBox":[554,341,575,341,574,347,553,347],"confidence":0.209,"span":{"offset":214,"length":7}},
                    {"content":"PM","boundingBox":[576,341,583,341,582,347,575,347],"confidence":0.039,"span":{"offset":222,"length":2}},
                    {"content":"Delle","boundingBox":[540,348,559,347,558,353,539,353],"confidence":0.58,"span":{"offset":225,"length":5}},
                    {"content":"Marckre","boundingBox":[560,347,582,348,582,353,559,353],"confidence":0.275,"span":{"offset":231,"length":7}},
                    {"content":"Product","boundingBox":[539,370,559,371,558,376,539,376],"confidence":0.615,"span":{"offset":239,"length":7}},
                    {"content":"review","boundingBox":[560,371,576,371,575,376,559,376],"confidence":0.04,"span":{"offset":247,"length":6}}
                ],
                "spans":
                [
                    {"offset":0,"length":253}
                ],
                "lines":
                [
                    {"content":"9:35 AM","boundingBox":[130,129,215,130,215,149,130,148],"spans":[{"offset":0,"length":7}]},
                    {"content":"E Conference room 154584354","boundingBox":[130,153,224,154,224,161,130,161],"spans":[{"offset":8,"length":27}]},
                    {"content":"#: 555-173-4547","boundingBox":[130,163,182,164,181,171,130,170],"spans":[{"offset":36,"length":15}]},
                    {"content":"Town Hall","boundingBox":[546,180,590,180,590,190,546,190],"spans":[{"offset":52,"length":9}]},
                    {"content":"9:00 AM - 10:00 AM","boundingBox":[546,191,596,192,596,200,546,199],"spans":[{"offset":62,"length":18}]},
                    {"content":"Aaron Buaion","boundingBox":[543,201,581,201,581,208,543,208],"spans":[{"offset":81,"length":12}]},
                    {"content":"Daily SCRUM","boundingBox":[537,259,575,260,575,266,537,265],"spans":[{"offset":94,"length":11}]},
                    {"content":"10:00 AM 11:00 AM","boundingBox":[536,266,590,266,590,272,536,272],"spans":[{"offset":106,"length":17}]},
                    {"content":"Churlette de Crum","boundingBox":[538,273,584,273,585,279,538,279],"spans":[{"offset":124,"length":17}]},
                    {"content":"Quarterly NI Hands","boundingBox":[538,295,588,295,588,301,538,302],"spans":[{"offset":142,"length":18}]},
                    {"content":"11.00 AM-12:00 PM","boundingBox":[536,304,588,303,588,309,536,310],"spans":[{"offset":161,"length":17}]},
                    {"content":"Bebek Shaman","boundingBox":[538,310,577,310,577,316,538,316],"spans":[{"offset":179,"length":12}]},
                    {"content":"Weekly stand up","boundingBox":[537,332,582,333,582,339,537,338],"spans":[{"offset":192,"length":15}]},
                    {"content":"12:00 PM-1:00 PM","boundingBox":[537,340,583,340,583,347,536,346],"spans":[{"offset":208,"length":16}]},
                    {"content":"Delle Marckre","boundingBox":[538,347,582,347,582,352,538,353],"spans":[{"offset":225,"length":13}]},
                    {"content":"Product review","boundingBox":[538,370,577,370,577,376,538,375],"spans":[{"offset":239,"length":14}]}
                ]
            }
        ],
        "styles": [],
        "modelVersion": "2022-04-30"
    }
}
```



## Next steps

In this quickstart, you learned how to make basic image analysis calls using the REST API. Next, learn more about the Analysis 4.0 API features.

> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../overview-image-analysis.md)
