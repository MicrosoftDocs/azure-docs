---
title: How to tag your data for custom classification - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to tag your data for use with the custom text classification API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Tag your data in language studio

Before building your custom text classification models, you need to have tagged data first. If your data is not tagged already, you can tag it in the language studio. 

## Prerequisites

* a [created project](create-project.md) with a valid resource and storage account.

## File format

Your tags file should be in the `json` format below.

```json
{
  //List of intent names. Their index within this array is used as an ID.
  "intentNames": [
      "intent_name1",
      "intent_name2"
  ],
  "documents": [
      {
          "location": "path to document", //Relative file path to get the text.
          "culture": "en-US", //Standard culture strings supported by CultureInfo
          "intents": [
              0,
              3
          ]
      }
  ]
}
```

## Description of data

* `intentNames`: An array of classes. Index of the class within the array is used as its ID.
* `documents`: An array of tagged documents.
* `location`: The path of the document relative to the JSON file. For example: 
    * `file.txt` for documents on the same level as the tags file. 
    * `dir1/file.txt` For documents within a directory level. 
    *  `../file.txt` for documents one directory level above.
* `culture`: culture/language of the document. Use one of the [supported culture locales](../language-support.md).
* `intents`: array of classes assigned to the document. For single classification this value must be one item only.

## Tag your data

1. Go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/classifciation) and select your project.

2. From the left side menu, select **Tag data**

3. You can find a list of all `.txt` files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the top-right menu to navigate.
    
    >[!TIP]
    > See the [recommended practices](../concepts/recommended-practices.md#data-tagging) for tagging your data
    
4.  You can either view all files or only tagged files by changing the view from the **Viewing** drop-down menu.

    :::image type="content" source="../media/tag-1.png" alt-text="View the tag" lightbox="../media/tag-1.png":::

5. If you enabled multiple languages for your project, you will find an additional **Language** drop-down menu. Select the language of each document.

    :::image type="content" source="../media/tag-multilingual.png" alt-text="View the multilingual tag" lightbox="../media/tag-multilingual.png":::

6. Before you start tagging, add classes to your project from the top-right corner

    :::image type="content" source="../media/tag-add-class.png" alt-text="Add entities to the tag" lightbox="../media/tag-add-class.png":::

    * **Single Class Classification**: your file can only be tagged with one class, you can do so by checking one of the radio buttons next to the class you want to tag this file with.

      :::image type="content" source="../media/tag-single.png" alt-text="View a single class classification" lightbox="../media/tag-single.png":::

    * **Multiple Class Classification**: your file can be tagged with multiple classes, you can do so by checking all applicable check boxes next to the classes you want to tag this file with.

      :::image type="content" source="../media/tag-multi.png" alt-text="View multiple classes" lightbox="../media/tag-multi.png":::


While tagging, keep an eye on the status indicator next to **Tag data**:

  * **Green** indicates that your changes have been saved.
  * **Yellow** indicates that saving is in progress.
  * **Red** indicates that your changes have not been saved yet.

If you want to save manually, hover over the red indicator and click on **Save now**.

:::image type="content" source="../media/tag-status.png" alt-text="The tag status" lightbox="../media/tag-status.png":::

To remove a tag:
  * **Single Class Classification**: 
  * **Multiple Class Classification**: uncheck the class you want to remove from file.

To delete/rename a class,
  * Select the class you want to edit from the right side menu
  * Click on the three dots and select the option you want from the drop-down menu.

:::image type="content" source="../media/tag-edit-class.png" alt-text="Edit the tag class" lightbox="../media/tag-edit-class.png":::

>[!NOTE]
> The number of tags you need will vary depending on your dataset; how distinct your entities are and how easily they can be  differentiated from each other. Your tagging should be consistent and complete. Consider starting with 20 tagged files per classification.

While you are tagging your data keep an eye for the training readiness recommendation at the top right of the page.
:::image type="content" source="../media/tag-train-ready.png" alt-text="Readiness recommendation" lightbox="../media/tag-train-ready.png":::

## Next Steps

* [Train your model](train-model.md)
