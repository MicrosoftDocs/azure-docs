---
title: Custom NER data formats
titleSuffix: Azure Cognitive Services
description: Learn about the data formats accepted by custom NER.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# Data formats accepted by custom NER

When data is used by your model for learning, it expects the data to be in a specific format. When you tag your data in Language Studio, it gets converted to the JSON format described in this article. You can also manually tag your files.


## JSON file format

When you tag entities, the tags are saved as in the following JSON format. If you upload a tags file, it should follow the same format.

```json
{
    "extractors": [
        {
            "name": "Entity1"
        },
        {
            "name": "Entity2"
        }
    ],
    "documents": [
        {
            "location": "file1.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 5129,
                    "labels": [
                        {
                            "extractorName": "Entity1",
                            "offset": 77,
                            "length": 10
                        },
                        {
                            "extractorName": "Entity2",
                            "offset": 3062,
                            "length": 8
                        }
                    ]
                }
            ]
        },
        {
            "location": "file2.txt",
            "language": "en-us",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 6873,
                    "labels": [
                        {
                            "extractorName": "Entity2",
                            "offset": 60,
                            "length": 7
                        },
                        {
                            "extractorName": "Entity1",
                            "offset": 2805,
                            "length": 10
                        }
                    ]
                }
            ]
        }
    ]
}
```

### Data description

* `extractors`: An array of extractors for your data. Each extractor represents one of the entities you want to extract from your data.
* `documents`: An array of tagged documents.
  * `location`: The path of the file. The file has to be in root of the storage container.
  * `language`: Language of the file. Use one of the [supported culture locales](../language-support.md).
  * `extractors`: Array of extractor objects to be extracted from the file.
    * `regionOffset`: The inclusive character position of the start of the text.
    * `regionLength`: The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.
    * `labels`: Array of all the tagged entities within the specified region.
      * `extractorName`: Type of the entity to be extracted.
      * `offset`: The inclusive character position of the start of the entity. This is not relative to the bounding box.
      * `length`: The length of the entity in terms of UTF16 characters.

## Next steps

See the [how-to article](../how-to/tag-data.md)  more information about tagging your data. When you're done tagging your data, you can [train your model](../how-to/train-model.md).  
