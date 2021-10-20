---
title: Custom text classification data formats
titleSuffix: Azure Cognitive Services
description: Learn about the data formats accepted by custom entity extraction.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# Accepted data formats

When data is used by your model for learning, it expects the data to be in a specific format. When you tag your data in Language Studio, it gets converted to the JSON format described in this article. You can also manually tag your files.


## JSON file format

Your tags file should be in the `json` format below.

```json
{
    "classifiers": [
        {
            "name": "Class1"
        },
        {
            "name": "Class2"
        }
    ],
    "documents": [
        {
            "location": "doc1.txt",
            "language": "en-us",
            "classifiers": [
                {
                    "classifierName": "Class2"
                },
                {
                    "classifierName": "Class1"
                }
            ]
        }
    ]
}
```

### Data description

* `classifiers`: An array of classifiers for your data. Each classifier represents one of the classes you want to tag your data with.
* `documents`: An array of tagged documents. For example:
  * `location`: The path of the JSON file containing tags. The tags file has to be in root of the storage container.
  * `language`: Language of the document. Use one of the [supported culture locales](../language-support.md).
  * `classifiers`: Array of classifier objects assigned to the document. If you're working on a single classification project, there should be one classifier only.

## Next steps

See the [how-to article](../how-to/tag-data.md)  more information about tagging your data. When you're done tagging your data, you can [train your model](../how-to/train-model.md).  
