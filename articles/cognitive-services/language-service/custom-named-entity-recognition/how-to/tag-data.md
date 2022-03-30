---
title: How to tag your data for Custom Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: Learn how to tag your data for use with Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# Tag your data for Custom Named Entity Recognition (NER) in language studio

Before building your custom entity extraction models, you need to have tagged data. If your data is not tagged already, you can tag it in the language studio. To tag your data, you must have [created a project](../quickstart.md).

## Prerequisites

Before you can tag data, you need:

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](create-project.md#prepare-training-data) to your storage account.

See the [application development lifecycle](../overview.md#application-development-lifecycle) for more information.

## Tag your data

After training data is uploaded to your Azure storage account, you will need to tag it, so your model knows which words will be associated with the classes you need. When you tag data in Language Studio (or manually tag your data), these tags will be stored in [the JSON format](../concepts/data-formats.md) that your model will use during training.  

As you tag your data, remember the following:

* **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag.
* **Tag consistently**:  The same entity should have the same tag across all the files.
* **Tag completely**: Tag all the instances of the entity in all your files.

The precision, consistency and completeness of your tagged data are key factors to determining model performance. To tag your data:

1. Go to the projects page in [Language Studio](https://aka.ms/custom-extraction) and select your project.

2. From the left side menu, select **Tag data**

3. You can find a list of all `.txt` files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the bottom of the page to navigate.

4. To start tagging, click **Add entities** in the top-right corner. You can either view all files or only tagged files by changing the view from the **Viewing** drop down.

>[!TIP]
> * There is no standard number of tags you will need, Consider starting with 50 tags per entity. The number of tags you'll need depends on how distinct your entities are, and how easily they can be differentiated from each other. It also depends on your tagging, which should be consistent and complete.

:::image type="content" source="../media/tagging-screen.png" alt-text="A screenshot showing the Language Studio screen for tagging data." lightbox="../media/tagging-screen.png":::

If you enabled multiple languages for your project, you will find a **Language** dropdown, which lets you select the language of each document.

While tagging, your changes will be synced periodically, if they have not been saved yet you will find a warning at the top of your page. If you want to save manually, click on **Save tags** button at the top of the page.

## Tagging options

You have two options to tag your document:


|Option |Description  |
|---------|---------|
|Tag using a brush     | Select the brush icon next to an entity in the top-right corner of the screen, then highlight words in the document you want to associate with the entity           |
|Tag using a menu    | Highlight the word you want to tag as an entity, and a menu will appear. Select the tag you want to assign for this entity.        |

The below screenshot shows tagging using a brush.

:::image type="content" source="../media/tag-options.png" alt-text="A screenshot showing the tagging options offered in Custom NER." lightbox="../media/tag-options.png":::

## Remove tags

To remove a tag

1. Select the entity you want to remove a tag from.
2. Scroll through the menu that appears, and select **Remove Tag**.

## Delete or rename entities

To delete or rename an entity:

1. Select the entity you want to edit in the top-right corner of the menu.
2. Click on the three dots next to the entity, and select the option you want from the drop-down menu.


## Next Steps

After you've tagged your data, you can begin [training a model](train-model.md) that will learn based on your data.
