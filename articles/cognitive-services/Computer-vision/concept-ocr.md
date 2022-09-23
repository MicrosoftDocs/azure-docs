---
title: Reading text - Computer Vision
titleSuffix: Azure Cognitive Services
description: Learn concepts related to the Read feature of the Computer Vision API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 09/12/2022
ms.author: pafarley
---

# Reading text (preview)

Version 4.0 of Image Analysis offers the ability to extract text from images. Contextual information like line number and position is also returned. Text reading is also available through the [OCR service](overview-ocr.md), but the latest model version is available through Image Analysis. This version is optimized for image inputs as opposed to documents.

> [!IMPORTANT]
> you need 4.0 for this TBD

## Reading text example

The following JSON response illustrates what the Analyze API returns when reading text in the given image. The response has been truncated for simplicity.

![Photo of a sticky note with writing on it](./Images/handwritten-note.jpg)


```json
{
   "kind":"imageAnalysisResult",
   "metadata":{
      "height":945,
      "width":1000
   },
   "readResult":{
      "stringIndexType":"TextElements",
      "content":"You must be the change you\nWish to see in the world !\nEverything has its beauty , but\nnot everyone sees it !",
      "pages":[
         {
            "unit":"pixel",
            "height":945.0,
            "width":1000.0,
            "angle":-1.099,
            "pageNumber":1,
            "words":[
               {
                  "content":"You",
                  "boundingBox":[
                     253.0,
                     268.0,
                     301.0,
                     267.0,
                     304.0,
                     318.0,
                     256.0,
                     318.0
                  ],
                  "confidence":0.998,
                  "span":{
                     "offset":0,
                     "length":3
                  }
               },
               {
                  "content":"must",
                  "boundingBox":[
                     310.0,
                     266.0,
                     376.0,
                     265.0,
                     378.0,
                     316.0,
                     313.0,
                     317.0
                  ],
                  "confidence":0.988,
                  "span":{
                     "offset":4,
                     "length":4
                  }
               },
               {
                  "content":"be",
                  "boundingBox":[
                     385.0,
                     264.0,
                     426.0,
                     264.0,
                     428.0,
                     314.0,
                     388.0,
                     316.0
                  ],
                  "confidence":0.928,
                  "span":{
                     "offset":9,
                     "length":2
                  }
               },
                ...
            ],
            "spans":[
               {
                  "offset":0,
                  "length":108
               }
            ],
            "lines":[
               {
                  "content":"You must be the change you",
                  "boundingBox":[
                     253.0,
                     267.0,
                     670.0,
                     262.0,
                     671.0,
                     307.0,
                     254.0,
                     318.0
                  ],
                  "spans":[
                     {
                        "offset":0,
                        "length":26
                     }
                  ]
               },
                ...
            ]
         }
      ],
      "styles":[
         {
            "isHandwritten":true,
            "spans":[
               {
                  "offset":0,
                  "length":26
               }
            ],
            "confidence":0.95
         },
         {
            "isHandwritten":true,
            "spans":[
               {
                  "offset":27,
                  "length":58
               }
            ],
            "confidence":1.0
         },
         {
            "isHandwritten":true,
            "spans":[
               {
                  "offset":86,
                  "length":22
               }
            ],
            "confidence":0.9
         }
      ]
   }
}
```

## Use the API

The text reading feature is part of the [Analyze Image](TBD) API. You can call this API using REST. Include `Read` in the **visualFeatures** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"readResult"` section.

## Next steps

Follow the [quickstart](./quickstarts-sdk/client-library.md) to read text from an image using the Analyze API.