---
title: Content tags - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn concepts related to the images tagging feature of the Image Analysis 4.0 API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Image tagging (version 4.0)

Image Analysis can return content tags for thousands of recognizable objects, living beings, scenery, and actions that appear in images. Tagging is not limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on. Tags are not organized as a taxonomy and do not have inheritance hierarchies. When tags are ambiguous or not common knowledge, the API response provides hints to clarify the meaning of the tag in context of a known setting.

Try out the image tagging features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Image tagging example

The following JSON response illustrates what Azure AI Vision returns when tagging visual features detected in the example image.

![A blue house and the front yard](./Images/house_yard.png).


```json
{
    "metadata":
    {
        "width": 300,
        "height": 200
    },
    "tagsResult":
    {
        "values":
        [
            {
                "name": "grass",
                "confidence": 0.9960499405860901
            },
            {
                "name": "outdoor",
                "confidence": 0.9956876635551453
            },
            {
                "name": "building",
                "confidence": 0.9893627166748047
            },
            {
                "name": "property",
                "confidence": 0.9853052496910095
            },
            {
                "name": "plant",
                "confidence": 0.9791355729103088
            },
            {
                "name": "sky",
                "confidence": 0.976455569267273
            },
            {
                "name": "home",
                "confidence": 0.9732913374900818
            },
            {
                "name": "house",
                "confidence": 0.9726771116256714
            },
            {
                "name": "real estate",
                "confidence": 0.972320556640625
            },
            {
                "name": "yard",
                "confidence": 0.9480281472206116
            },
            {
                "name": "siding",
                "confidence": 0.945357620716095
            },
            {
                "name": "porch",
                "confidence": 0.9410697221755981
            },
            {
                "name": "cottage",
                "confidence": 0.9143695831298828
            },
            {
                "name": "tree",
                "confidence": 0.9111745357513428
            },
            {
                "name": "farmhouse",
                "confidence": 0.8988940119743347
            },
            {
                "name": "window",
                "confidence": 0.894851803779602
            },
            {
                "name": "lawn",
                "confidence": 0.894050121307373
            },
            {
                "name": "backyard",
                "confidence": 0.8931854963302612
            },
            {
                "name": "garden buildings",
                "confidence": 0.8859137296676636
            },
            {
                "name": "roof",
                "confidence": 0.8695330619812012
            },
            {
                "name": "driveway",
                "confidence": 0.8670969009399414
            },
            {
                "name": "land lot",
                "confidence": 0.856428861618042
            },
            {
                "name": "landscaping",
                "confidence": 0.8540748357772827
            }
        ]
    }
}
```

## Use the API

The tagging feature is part of the [Analyze Image](https://aka.ms/vision-4-0-ref) API. You can call this API using REST. Include `Tags` in the **features** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"tags"` section.


* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)

## Next steps

* Learn the related concept of [describing images](concept-describe-images-40.md).
* [Call the Analyze Image API](./how-to/call-analyze-image-40.md)

