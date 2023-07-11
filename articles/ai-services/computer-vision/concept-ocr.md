---
title: OCR for images - Azure AI Vision
titleSuffix: Azure AI services
description: Extract text from in-the-wild and non-document images with a fast and synchronous Azure AI Vision Image Analysis 4.0 API.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/04/2023
ms.author: pafarley
---

# OCR for images (version 4.0 preview)

> [!NOTE]
>
> For extracting text from PDF, Office, and HTML documents and document images, use the [Document Intelligence Read OCR model](../../ai-services/document-intelligence/concept-read.md) optimized for text-heavy digital and scanned documents with an asynchronous API that makes it easy to power your intelligent document processing scenarios.

OCR traditionally started as a machine-learning-based technique for extracting text from in-the-wild and non-document images like product labels, user-generated images, screenshots, street signs, and posters. For several scenarios, such as single images that aren't text-heavy, you need a fast, synchronous API or service. This allows OCR to be embedded in near real-time user experiences to enrich content understanding and follow-up user actions with fast turn-around times.

## What is Computer Vision v4.0 Read OCR (preview)?

The new Computer Vision Image Analysis 4.0 REST API offers the ability to extract printed or handwritten text from images in a unified performance-enhanced synchronous API that makes it easy to get all image insights including OCR results in a single API operation. The Read OCR engine is built on top of multiple deep learning models supported by universal script-based models for [global language support](./language-support.md).

## Text extraction example

The following JSON response illustrates what the Image Analysis 4.0 API returns when extracting text from the given image.

![Photo of a sticky note with writing on it.](./Images/handwritten-note.jpg)

```json
{
    "metadata":
    {
        "width": 1000,
        "height": 945
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

## Use the API

The text extraction feature is part of the [Analyze Image API](https://aka.ms/vision-4-0-ref). Include `Read` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"readResult"` section.


## Next steps

Follow the [Image Analysis quickstart](./quickstarts-sdk/image-analysis-client-library-40.md) to extract text from an image using the Image Analysis 4.0 API.
