---
title: Custom text classification data formats
titleSuffix: Azure Cognitive Services
description: Learn about the data formats accepted by custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
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
            "location": "file1.txt",
            "language": "en-us",
            "classifiers": [
                {
                    "classifierName": "Class2"
                },
                {
                    "classifierName": "Class1"
                }
            ]
        },
        {
            "location": "file2.txt",
            "language": "en-us",
            "classifiers": [
                {
                    "classifierName": "Class2"
                }
            ]
        }
    ]
}
```

### Data description

* `classifiers`: An array of classifiers for your data. Each classifier represents one of the classes you want to tag your data with.
* `documents`: An array of tagged documents.
  * `location`: The path of the file. The file has to be in root of the storage container.
  * `language`: Language of the file. Use one of the [supported culture locales](../language-support.md).
  * `classifiers`: Array of classifier objects assigned to the file. If you're working on a single label classification project, there should be one classifier per file only.

## Next steps

See the [how-to article](../how-to/tag-data.md)  more information about tagging your data. When you're done tagging your data, you can [train your model](../how-to/train-model.md).  
