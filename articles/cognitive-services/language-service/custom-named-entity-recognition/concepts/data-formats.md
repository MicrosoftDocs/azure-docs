---
title: Custom NER data formats
titleSuffix: Azure Cognitive Services
description: Learn about the data formats accepted by custom NER.
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

When you tag entities, the tags are saved as in the following JSON format. If you upload a tags file, it should follow the same format.

```json
{
    //List of entity names. Their index within this array is used as an ID. 
    "entityNames": [
        "entity_name1",
        "entity_name2"
    ],
    "documents": "path_to_document", //Relative file path to get the text.
    "culture": "en-US", //Standard culture strings supported by CultureInfo.
    "entities": [
        {
            "regionStart": 0,
            "regionLength": 69,
            "labels": [
                {
                    "entity": 0, // Index of the entity in the "entityNames" array. Positions are relative to the original text (not bounding box)
                    "start": 4,
                    "length": 10
                },
                {
                    "entity": 1,
                    "start": 18,
                    "length": 11
                }
            ]
        }
    ]    
}
```

The following list describes the various JSON properties of the sample above.

* `entityNames`: An array of entity names. Index of the entity within the array is used as its ID.
* `documents`: An array of tagged documents.
  * `location`: The path of the document relative to the JSON file. For example, docs on the same level as the tags file `file.txt`, for docs inside one directory level `dir1/file.txt`.
  * `culture`: culture/language of the document. <!-- See [language support](../language-support.md) for more information. -->
  * `entities`: Specifies the entity recognition tags.
    * `regionStart`: The inclusive character position of the start of the text.
    * `regionLength`: The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region, so if this is a tagged file, set the `regionStart` to 0 and the `regionLength` to the last index of last character in the file. You can also set this region if you want to introduce a negative sample to the training, by defining the region as a portion of the file with no tags.

    * `labels`: All tags occurring within the bounding box.
      * `entity`: The index of the entity in the `entityNames` array.
      * `start`: The inclusive character position of the start of the tag in the document text. This is not relative to the bounding box.
      * `length`: The length of the tag in terms of UTF16 characters.

## Next steps

See the [how-to article](../how-to/tag-data.md)  more information about tagging your data. When you're done tagging your data, you can [train your model](../how-to/train-model.md).  