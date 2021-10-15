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
ms.date: 11/02/2021
ms.author: aahi
---

# Tag your data in language studio

Before creating a custom text classification model, you need to have tagged data first. If your data is not tagged already, you can tag it in the language studio. Tagged data informs the model how to interpret text, and is used for training and evaluation.


## Prerequisites

* a [created project](../quickstart.md) with a valid resource and storage account.

## Tag your data

1. Go to your projects page in [Language Studio](https://language.azure.com/customText/projects/classifciation) and select your project.

2. From the left side menu, select **Tag data**

3. You can find a list of all `.txt` files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the top-right menu to navigate.
    
    >[!TIP]
    > See the [recommended practices](../concepts/recommended-practices.md#data-tagging) for tagging your data
    
4.  You can either view all files or only tagged files by changing the view from the **Viewing** drop-down menu.

    :::image type="content" source="../media/tag-1.png" alt-text="A screenshot showing the data tagging screen" lightbox="../media/tag-1.png":::

5. If you enabled multiple languages for your project, you will find an additional **Language** drop-down menu. Select the language of each document.

    :::image type="content" source="../media/tag-multilingual.png" alt-text="A screenshot showing the multilingual selector" lightbox="../media/tag-multilingual.png":::

6. Before you start tagging, add classes to your project from the top-right corner

    :::image type="content" source="../media/tag-add-class.png" alt-text="A screenshot showing the menu to add entities to a tag" lightbox="../media/tag-add-class.png":::

    * **Single label classification**: your file can only be tagged with one class, you can do so by checking one of the radio buttons next to the class you want to tag this file with.

      :::image type="content" source="../media/tag-single.png" alt-text="A screenshot showing the single label classification menu" lightbox="../media/tag-single.png":::

    * **Multiple label classification**: your file can be tagged with multiple classes, you can do so by checking all applicable check boxes next to the classes you want to tag this file with.

      :::image type="content" source="../media/tag-multi.png" alt-text="A screenshot showing the multiple label classification menu" lightbox="../media/tag-multi.png":::


While tagging, keep an eye on the status indicator next to **Tag data**:

  * **Green** indicates that your changes have been saved.
  * **Yellow** indicates that saving is in progress.
  * **Red** indicates that your changes have not been saved yet.

If you want to save manually, hover over the red indicator and click on **Save now**.

:::image type="content" source="../media/tag-status.png" alt-text="The tag status" lightbox="../media/tag-status.png":::

If you want to remove a tag, uncheck the button next to the class.

To delete/rename a class,
  * Select the class you want to edit from the right side menu
  * Click on the three dots and select the option you want from the drop-down menu.

:::image type="content" source="../media/tag-edit-class.png" alt-text="Edit the tag class" lightbox="../media/tag-edit-class.png":::

>[!NOTE]
> The number of tags you need will vary depending on your dataset; how distinct your entities are and how easily they can be  differentiated from each other. Your tagging should be consistent and complete. Consider starting with 20 tagged files per classification.

As you tag your data, you can find a training readiness recommendation in the top-right corner of the page.
:::image type="content" source="../media/tag-train-ready.png" alt-text="Readiness recommendation" lightbox="../media/tag-train-ready.png":::

## Data tag JSON file format

Your tags file should be in the `json` format below.

```json
{
  //List of intent names. Their index within this array is used as an ID.
  "classNames": [
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

### Data description

* `intentNames`: An array of classes. Index of the class within the array is used as its ID.
* `documents`: An array of tagged documents. For example:
    * `file.txt` For documents on the same level as the tags file. 
    * `dir1/file.txt` For documents within a directory level. 
    *  `../file.txt` For documents one directory level above.
* `location`: The path of the JSON file containing tags. The tags file has to be in root of the storage container.
* `culture`: Culture/language of the document. Use one of the [supported culture locales](../language-support.md).
* `intents`: Array of classes assigned to the document. If you're working on a single classification project, this value must be one item only.

## Next Steps

* [Train your model](train-model.md)
