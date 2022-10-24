---
title: Reading text - Computer Vision
titleSuffix: Azure Cognitive Services
description: Learn concepts related to the Read feature of the Computer Vision API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/12/2022
ms.author: pafarley
---

# Image Analysis v4.0 Read OCR (preview)

The new Computer Vision Image Analysis v4.0 REST API preview offers the ability to extract printed or handwritten text from images in a unified performance-enhanced synchronous API that makes it easy to get all image insights including OCR results in a single API operation. The Read OCR engine is built on top of multiple deep learning models supported by universal script-based models for [global language support](./language-support.md).

[!INCLUDE [read-editions](./includes/read-editions.md)]

## Use the v4.0 REST API preview

The text extraction feature is part of the [Image Analysis v4.0 REST API preview](https://aka.ms/vision-4-0-ref). Include `Read` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"readResult"` section.

For an example, copy the following command into a text editor and replace the `<key>` with your API key and optionally, your API endpoint URL. Then open a command prompt window and run the command.

```bash
    curl.exe -H "Ocp-Apim-Subscription-Key: <key>" -H "Content-Type: application/json" "https://westcentralus.api.cognitive.microsoft.com/computervision/imageanalysis:analyze?features=Read&model-version=latest&language=en&api-version=2022-10-12-preview" -d "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Salto_del_Angel-Canaima-Venezuela08.JPG/800px-Salto_del_Angel-Canaima-Venezuela08.JPG'}"
    
```

## Text extraction output

The following JSON response illustrates what the Image Analysis v4.0 API returns when extracting text from the given image.

![Photo of a sticky note with writing on it.](./Images/handwritten-note.jpg)

```json
{
    "modelVersion": "2022-10-12-preview",
    "metadata": {
        "width": 1000,
        "height": 945
    },
    "tagsResult": {
        "values": [
            {
                "name": "text",
                "confidence": 0.9992657899856567
            },
            {
                "name": "post-it note",
                "confidence": 0.9879658818244934
            },
            {
                "name": "handwriting",
                "confidence": 0.9730166792869568
            },
            {
                "name": "rectangle",
                "confidence": 0.8658561706542969
            },
            {
                "name": "paper product",
                "confidence": 0.8561886548995972
            },
            {
                "name": "purple",
                "confidence": 0.596200168132782
            }
        ]
    },
    "readResult": {
        "stringIndexType": "TextElements",
        "content": "You must be the change you\nWish to see in the world !\nEverything has its beauty , but\nnot everyone sees it !",
        "pages": [
            {
                "height": 945.0,
                "width": 1000.0,
                "angle": -1.099,
                "pageNumber": 1,
                "words": [
                    {
                        "content": "You",
                        "boundingBox": [
                            253.0,
                            268.0,
                            301.0,
                            267.0,
                            304.0,
                            318.0,
                            256.0,
                            318.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 0,
                            "length": 3
                        }
                    },
                    {
                        "content": "must",
                        "boundingBox": [
                            310.0,
                            266.0,
                            376.0,
                            265.0,
                            378.0,
                            316.0,
                            313.0,
                            317.0
                        ],
                        "confidence": 0.988,
                        "span": {
                            "offset": 4,
                            "length": 4
                        }
                    },
                    {
                        "content": "be",
                        "boundingBox": [
                            385.0,
                            264.0,
                            426.0,
                            264.0,
                            428.0,
                            314.0,
                            388.0,
                            316.0
                        ],
                        "confidence": 0.928,
                        "span": {
                            "offset": 9,
                            "length": 2
                        }
                    },
                    {
                        "content": "the",
                        "boundingBox": [
                            435.0,
                            263.0,
                            494.0,
                            263.0,
                            496.0,
                            311.0,
                            437.0,
                            314.0
                        ],
                        "confidence": 0.997,
                        "span": {
                            "offset": 12,
                            "length": 3
                        }
                    },
                    {
                        "content": "change",
                        "boundingBox": [
                            503.0,
                            263.0,
                            600.0,
                            262.0,
                            602.0,
                            306.0,
                            506.0,
                            311.0
                        ],
                        "confidence": 0.995,
                        "span": {
                            "offset": 16,
                            "length": 6
                        }
                    },
                    {
                        "content": "you",
                        "boundingBox": [
                            609.0,
                            262.0,
                            665.0,
                            263.0,
                            666.0,
                            302.0,
                            611.0,
                            305.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 23,
                            "length": 3
                        }
                    },
                    {
                        "content": "Wish",
                        "boundingBox": [
                            327.0,
                            348.0,
                            391.0,
                            343.0,
                            392.0,
                            380.0,
                            328.0,
                            382.0
                        ],
                        "confidence": 0.98,
                        "span": {
                            "offset": 27,
                            "length": 4
                        }
                    },
                    {
                        "content": "to",
                        "boundingBox": [
                            406.0,
                            342.0,
                            438.0,
                            340.0,
                            439.0,
                            378.0,
                            407.0,
                            379.0
                        ],
                        "confidence": 0.997,
                        "span": {
                            "offset": 32,
                            "length": 2
                        }
                    },
                    {
                        "content": "see",
                        "boundingBox": [
                            446.0,
                            340.0,
                            492.0,
                            337.0,
                            494.0,
                            376.0,
                            447.0,
                            378.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 35,
                            "length": 3
                        }
                    },
                    {
                        "content": "in",
                        "boundingBox": [
                            500.0,
                            337.0,
                            527.0,
                            336.0,
                            529.0,
                            375.0,
                            501.0,
                            376.0
                        ],
                        "confidence": 0.983,
                        "span": {
                            "offset": 39,
                            "length": 2
                        }
                    },
                    {
                        "content": "the",
                        "boundingBox": [
                            534.0,
                            336.0,
                            588.0,
                            334.0,
                            590.0,
                            373.0,
                            536.0,
                            375.0
                        ],
                        "confidence": 0.993,
                        "span": {
                            "offset": 42,
                            "length": 3
                        }
                    },
                    {
                        "content": "world",
                        "boundingBox": [
                            599.0,
                            334.0,
                            655.0,
                            333.0,
                            658.0,
                            371.0,
                            601.0,
                            373.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 46,
                            "length": 5
                        }
                    },
                    {
                        "content": "!",
                        "boundingBox": [
                            663.0,
                            333.0,
                            687.0,
                            333.0,
                            690.0,
                            370.0,
                            666.0,
                            371.0
                        ],
                        "confidence": 0.915,
                        "span": {
                            "offset": 52,
                            "length": 1
                        }
                    },
                    {
                        "content": "Everything",
                        "boundingBox": [
                            255.0,
                            446.0,
                            371.0,
                            441.0,
                            372.0,
                            490.0,
                            256.0,
                            494.0
                        ],
                        "confidence": 0.97,
                        "span": {
                            "offset": 54,
                            "length": 10
                        }
                    },
                    {
                        "content": "has",
                        "boundingBox": [
                            380.0,
                            441.0,
                            421.0,
                            440.0,
                            421.0,
                            488.0,
                            381.0,
                            489.0
                        ],
                        "confidence": 0.793,
                        "span": {
                            "offset": 65,
                            "length": 3
                        }
                    },
                    {
                        "content": "its",
                        "boundingBox": [
                            430.0,
                            440.0,
                            471.0,
                            439.0,
                            471.0,
                            487.0,
                            431.0,
                            488.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 69,
                            "length": 3
                        }
                    },
                    {
                        "content": "beauty",
                        "boundingBox": [
                            480.0,
                            439.0,
                            552.0,
                            439.0,
                            552.0,
                            485.0,
                            481.0,
                            487.0
                        ],
                        "confidence": 0.296,
                        "span": {
                            "offset": 73,
                            "length": 6
                        }
                    },
                    {
                        "content": ",",
                        "boundingBox": [
                            561.0,
                            439.0,
                            571.0,
                            439.0,
                            571.0,
                            485.0,
                            562.0,
                            485.0
                        ],
                        "confidence": 0.742,
                        "span": {
                            "offset": 80,
                            "length": 1
                        }
                    },
                    {
                        "content": "but",
                        "boundingBox": [
                            580.0,
                            439.0,
                            636.0,
                            439.0,
                            636.0,
                            485.0,
                            580.0,
                            485.0
                        ],
                        "confidence": 0.885,
                        "span": {
                            "offset": 82,
                            "length": 3
                        }
                    },
                    {
                        "content": "not",
                        "boundingBox": [
                            364.0,
                            516.0,
                            412.0,
                            512.0,
                            413.0,
                            546.0,
                            366.0,
                            549.0
                        ],
                        "confidence": 0.994,
                        "span": {
                            "offset": 86,
                            "length": 3
                        }
                    },
                    {
                        "content": "everyone",
                        "boundingBox": [
                            422.0,
                            511.0,
                            520.0,
                            504.0,
                            521.0,
                            540.0,
                            423.0,
                            545.0
                        ],
                        "confidence": 0.993,
                        "span": {
                            "offset": 90,
                            "length": 8
                        }
                    },
                    {
                        "content": "sees",
                        "boundingBox": [
                            530.0,
                            503.0,
                            586.0,
                            500.0,
                            588.0,
                            538.0,
                            531.0,
                            540.0
                        ],
                        "confidence": 0.988,
                        "span": {
                            "offset": 99,
                            "length": 4
                        }
                    },
                    {
                        "content": "it",
                        "boundingBox": [
                            596.0,
                            500.0,
                            627.0,
                            498.0,
                            628.0,
                            536.0,
                            598.0,
                            537.0
                        ],
                        "confidence": 0.998,
                        "span": {
                            "offset": 104,
                            "length": 2
                        }
                    },
                    {
                        "content": "!",
                        "boundingBox": [
                            634.0,
                            498.0,
                            657.0,
                            497.0,
                            659.0,
                            536.0,
                            635.0,
                            536.0
                        ],
                        "confidence": 0.994,
                        "span": {
                            "offset": 107,
                            "length": 1
                        }
                    }
                ],
                "spans": [
                    {
                        "offset": 0,
                        "length": 108
                    }
                ],
                "lines": [
                    {
                        "content": "You must be the change you",
                        "boundingBox": [
                            253.0,
                            267.0,
                            670.0,
                            262.0,
                            671.0,
                            307.0,
                            254.0,
                            318.0
                        ],
                        "spans": [
                            {
                                "offset": 0,
                                "length": 26
                            }
                        ]
                    },
                    {
                        "content": "Wish to see in the world !",
                        "boundingBox": [
                            326.0,
                            343.0,
                            691.0,
                            332.0,
                            693.0,
                            369.0,
                            327.0,
                            382.0
                        ],
                        "spans": [
                            {
                                "offset": 27,
                                "length": 26
                            }
                        ]
                    },
                    {
                        "content": "Everything has its beauty , but",
                        "boundingBox": [
                            254.0,
                            443.0,
                            640.0,
                            438.0,
                            641.0,
                            485.0,
                            255.0,
                            493.0
                        ],
                        "spans": [
                            {
                                "offset": 54,
                                "length": 31
                            }
                        ]
                    },
                    {
                        "content": "not everyone sees it !",
                        "boundingBox": [
                            364.0,
                            512.0,
                            658.0,
                            496.0,
                            660.0,
                            534.0,
                            365.0,
                            549.0
                        ],
                        "spans": [
                            {
                                "offset": 86,
                                "length": 22
                            }
                        ]
                    }
                ]
            }
        ],
        "styles": [
            {
                "isHandwritten": true,
                "spans": [
                    {
                        "offset": 0,
                        "length": 26
                    }
                ],
                "confidence": 0.95
            },
            {
                "isHandwritten": true,
                "spans": [
                    {
                        "offset": 27,
                        "length": 58
                    }
                ],
                "confidence": 1.0
            },
            {
                "isHandwritten": true,
                "spans": [
                    {
                        "offset": 86,
                        "length": 22
                    }
                ],
                "confidence": 0.9
            }
        ],
        "modelVersion": "2022-04-30"
    }
}
```

## Next steps

Follow the Version 4.0 REST API sections in the [quickstart](./quickstarts-sdk/image-analysis-client-library.md) to extract text from an image using the Image Analysis 4.0 API.
