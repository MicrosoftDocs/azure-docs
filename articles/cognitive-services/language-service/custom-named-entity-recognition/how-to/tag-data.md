---
title: How to tag your data for Custom Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: Learn how to tag your data for use with Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# Tag your data for Custom Named Entity Recognition (NER) in language studio

Before building your custom entity extraction models, you need to have tagged data. If your data is not tagged already, you can tag it in the language studio. To tag your data, you must have [created a project](../quickstart.md).

## Tag your data

1. Go to the projects page in [Language Studio](https://language.azure.com/customText/projects/extraction) and select your project.

2. From the left side menu, select **Tag data**

3. You can find a list of all `.txt` files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the top-right menu to navigate.

4. To start tagging, click **Add entities** in the top-right corner. You can either view all files or only tagged files by changing the view from the **Viewing** drop down.

>[!TIP]
> * See [recommended practices](../concepts/recommended-practices.md#data-tagging) for tips on tagging your data
> * There is no standard number of tags you will need, Consider starting with 20 tags per entity. The number of tags you'll need depends on how distinct your entities are, and how easily they can be differentiated from each other. It also depends on your tagging, which should be consistent and complete.

:::image type="content" source="../media/tagging-screen.png" alt-text="A screenshot showing the Language Studio screen for tagging data." lightbox="../media/tagging-screen.png":::

If you enabled multiple languages for your project, you will find a **Language** dropdown, which lets you select the language of each document.

While tagging, routinely check on the status indicator next to **Tag data**.

* Green indicates that your changes have been saved.
* Yellow indicates that saving is in progress.
* Red indicates that your changes have not been saved yet.

If you want to save manually, hover your cursor over the red indicator and click on **Save now**.

## Tagging options

You have two options to tag your document:


|Option |Description  |
|---------|---------|
|Tag using a brush     | Select the brush icon next to an entity in the top-right corner of the screen, then highlight words in the document you want to associate with the entity           |
|Tag using a menu    | Highlight the word you want to tag as an entity, and a menu will appear. Select the tag you want to assign for this entity.        |

:::image type="content" source="../media/tag-options.png" alt-text="A screenshot showing the tagging options offered in Custom NER." lightbox="../media/tag-options.png":::

## Remove tags

To remove a tag

1. Select the entity you want to remove a tag from.
2. Scroll through the menu that appears, and select **Remove Tag**.

## Delete or rename entities

To delete or rename an entity:

1. Select the entity you want to edit in the top-right corner of the menu.
2. Click on the three dots next to the entity, and select the option you want from the drop-down menu.

## Tags file format

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


## Next Steps

* [Train your model](train-model.md)
