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
ms.custom: seodec18, ignite-2022
---

Use the Image Analysis REST API to analyze an image for tags and read text in the image (version 4.0 only).

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../how-to/call-analyze-image.md) for examples that showcase all of the available features.

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
    1. Optionally, change the image URL in the request body (`http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\`) to the URL of a different image to be analyzed.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window, and then run the command.

    #### [Version 3.2](#tab/3-2)

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Tags" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.JPG/800px-Salto_del_Angel-Canaima-Venezuela08.JPG'}"
    ```

    #### [Version 4.0](#tab/4-0)

    ```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/computervision/imageanalysis:analyze?features=Description,Tags,Read&model-version=latest&language=en&api-version=2022-10-12-preview" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.JPG/800px-Salto_del_Angel-Canaima-Venezuela08.JPG'}"
    ```
    ---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

### Examine the response

A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:

#### [Version 3.2](#tab/3-2)
```json
{{
   "tags":[
      {
         "name":"text",
         "confidence":0.9992657899856567
      },
      {
         "name":"post-it note",
         "confidence":0.9879657626152039
      },
      {
         "name":"handwriting",
         "confidence":0.9730165004730225
      },
      {
         "name":"rectangle",
         "confidence":0.8658561706542969
      },
      {
         "name":"paper product",
         "confidence":0.8561884760856628
      },
      {
         "name":"purple",
         "confidence":0.5961999297142029
      }
   ],
   "requestId":"2788adfc-8cfb-43a5-8fd6-b3a9ced35db2",
   "metadata":{
      "height":945,
      "width":1000,
      "format":"Jpeg"
   },
   "modelVersion":"2021-05-01"
}
```

#### [Version 4.0](#tab/4-0)

```json
{
    "metadata":
    {
        "width": 1000,
        "height": 945
    },
    "tagsResult":
    {
        "values":
        [
            {
                "name": "text",
                "confidence": 0.9992657899856567
            },
            {
                "name": "post-it note",
                "confidence": 0.9879657626152039
            },
            {
                "name": "handwriting",
                "confidence": 0.9730165004730225
            },
            {
                "name": "rectangle",
                "confidence": 0.8658561706542969
            },
            {
                "name": "paper product",
                "confidence": 0.8561884760856628
            },
            {
                "name": "purple",
                "confidence": 0.5961999297142029
            }
        ]
    },
    "readResult":
    {
        "stringIndexType": "TextElements",
        "content": "You must be the change you\nWish to see in the world !\nEverything has its beauty , but\nnot everyone sees it !",
        "pages":
        [
            {
                "height": 945,
                "width": 1000,
                "angle": -1.099,
                "pageNumber": 1,
                "words":
                [
                    {
                        "content": "You",
                        "boundingBox": [253,268,301,267,304,318,256,318],
                        "confidence": 0.998,
                        "span": {"offset":0,"length":3}
                    },
                    {
                        "content": "must",
                        "boundingBox": [310,266,376,265,378,316,313,317],
                        "confidence": 0.988,
                        "span": {"offset":4,"length":4}
                    },
                    {
                        "content": "be",
                        "boundingBox": [385,264,426,264,428,314,388,316],
                        "confidence": 0.928,
                        "span": {"offset":9,"length":2}
                    },
                    {
                        "content": "the",
                        "boundingBox": [435,263,494,263,496,311,437,314],
                        "confidence": 0.997,
                        "span": {"offset":12,"length":3}
                    },
                    {
                        "content": "change",
                        "boundingBox": [503,263,600,262,602,306,506,311],
                        "confidence": 0.995,
                        "span": {"offset":16,"length":6}
                    },
                    {
                        "content": "you",
                        "boundingBox": [609,262,665,263,666,302,611,305],
                        "confidence": 0.998,
                        "span": {"offset":23,"length":3}
                    },
                    {
                        "content": "Wish",
                        "boundingBox": [327,348,391,343,392,380,328,382],
                        "confidence": 0.98,
                        "span": {"offset":27,"length":4}
                    },
                    {
                        "content": "to",
                        "boundingBox": [406,342,438,340,439,378,407,379],
                        "confidence": 0.997,
                        "span": {"offset":32,"length":2}
                    },
                    {
                        "content": "see",
                        "boundingBox": [446,340,492,337,494,376,447,378],
                        "confidence": 0.998,
                        "span": {"offset":35,"length":3}
                    },
                    {
                        "content": "in",
                        "boundingBox": [500,337,527,336,529,375,501,376],
                        "confidence": 0.983,
                        "span": {"offset":39,"length":2}
                    },
                    {
                        "content": "the",
                        "boundingBox": [534,336,588,334,590,373,536,375],
                        "confidence": 0.993,
                        "span": {"offset":42,"length":3}
                    },
                    {
                        "content": "world",
                        "boundingBox": [599,334,655,333,658,371,601,373],
                        "confidence": 0.998,
                        "span": {"offset":46,"length":5}
                    },
                    {
                        "content": "!",
                        "boundingBox": [663,333,687,333,690,370,666,371],
                        "confidence": 0.915,
                        "span": {"offset":52,"length":1}
                    },
                    {
                        "content": "Everything",
                        "boundingBox": [255,446,371,441,372,490,256,494],
                        "confidence": 0.97,
                        "span": {"offset":54,"length":10}
                    },
                    {
                        "content": "has",
                        "boundingBox": [380,441,421,440,421,488,381,489],
                        "confidence": 0.793,
                        "span": {"offset":65,"length":3}
                    },
                    {
                        "content": "its",
                        "boundingBox": [430,440,471,439,471,487,431,488],
                        "confidence": 0.998,
                        "span": {"offset":69,"length":3}
                    },
                    {
                        "content": "beauty",
                        "boundingBox": [480,439,552,439,552,485,481,487],
                        "confidence": 0.296,
                        "span": {"offset":73,"length":6}
                    },
                    {
                        "content": ",",
                        "boundingBox": [561,439,571,439,571,485,562,485],
                        "confidence": 0.742,
                        "span": {"offset":80,"length":1}
                    },
                    {
                        "content": "but",
                        "boundingBox": [580,439,636,439,636,485,580,485],
                        "confidence": 0.885,
                        "span": {"offset":82,"length":3}
                    },
                    {
                        "content": "not",
                        "boundingBox": [364,516,412,512,413,546,366,549],
                        "confidence": 0.994,
                        "span": {"offset":86,"length":3}
                    },
                    {
                        "content": "everyone",
                        "boundingBox": [422,511,520,504,521,540,423,545],
                        "confidence": 0.993,
                        "span": {"offset":90,"length":8}
                    },
                    {
                        "content": "sees",
                        "boundingBox": [530,503,586,500,588,538,531,540],
                        "confidence": 0.988,
                        "span": {"offset":99,"length":4}
                    },
                    {
                        "content": "it",
                        "boundingBox": [596,500,627,498,628,536,598,537],
                        "confidence": 0.998,
                        "span": {"offset":104,"length":2}
                    },
                    {
                        "content": "!",
                        "boundingBox": [634,498,657,497,659,536,635,536],
                        "confidence": 0.994,
                        "span": {"offset":107,"length":1}
                    }
                ],
                "spans":
                [
                    {
                        "offset": 0,
                        "length": 108
                    }
                ],
                "lines":
                [
                    {
                        "content": "You must be the change you",
                        "boundingBox": [253,267,670,262,671,307,254,318],
                        "spans": [{"offset":0,"length":26}]
                    },
                    {
                        "content": "Wish to see in the world !",
                        "boundingBox": [326,343,691,332,693,369,327,382],
                        "spans": [{"offset":27,"length":26}]
                    },
                    {
                        "content": "Everything has its beauty , but",
                        "boundingBox": [254,443,640,438,641,485,255,493],
                        "spans": [{"offset":54,"length":31}]
                    },
                    {
                        "content": "not everyone sees it !",
                        "boundingBox": [364,512,658,496,660,534,365,549],
                        "spans": [{"offset":86,"length":22}]
                    }
                ]
            }
        ],
        "styles":
        [
            {
                "isHandwritten": true,
                "spans":
                [
                    {
                        "offset": 0,
                        "length": 26
                    }
                ],
                "confidence": 0.95
            },
            {
                "isHandwritten": true,
                "spans":
                [
                    {
                        "offset": 27,
                        "length": 58
                    }
                ],
                "confidence": 1
            },
            {
                "isHandwritten": true,
                "spans":
                [
                    {
                        "offset": 86,
                        "length": 22
                    }
                ],
                "confidence": 0.9
            }
        ]
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
