---
title: How to tag your data for custom classification - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to tag your data for use with the custom text classification API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Tag text data for training your model 

Before creating a custom text classification model, you need to have tagged data first. If your data isn't tagged already, you can tag it in the language studio. Tagged data informs the model how to interpret text, and is used for training and evaluation.

## Prerequisites

Before you can tag data, you need:
* [A successfully created project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Tag your data

After training data is uploaded to your Azure storage account, you will need to tag it, so your model knows which words will be associated with the classes you need. When you tag data in Language Studio (or manually tag your data), these tags will be stored in [the JSON format](../concepts/data-formats.md) that your model will use during training. 

As you tag your data, keep in mind:

* In general, more tagged data leads to better results, provided the data is tagged accurately.

* Although we recommended having around 50 tagged files per class, there's no fixed number that can guarantee your model will perform the best, because model performance also depends on possible ambiguity in your [schema](design-schema.md), and the quality of your tagged data.

Use the following steps to tag your data

1. Go to your project page in [Language Studio](https://aka.ms/custom-classification).

1. From the left side menu, select **Tag data**

3. You can find a list of all .txt files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the bottom of the page to navigate.  
    
4.  You can either view all files or only tagged files by changing the view from the **Viewing** drop-down menu. 

    > [!NOTE]
    > If you enabled multiple languages for your project, you will find an additional **Language** drop-down menu. Select the language of each document.

5. Before you start tagging, add classes to your project from the top-right corner

    :::image type="content" source="../media/tag-1.png" alt-text="A screenshot showing the data tagging screen" lightbox="../media/tag-1.png":::

6. Start tagging your files. In the images below:

    * *Section 1*: is where the content of the text file is displayed.

    * *Section 2*: includes your project's classes and distribution across your files and tags. 

    * *Section 3* is the split project data toggle. You can choose to add the selected text file to your training set or the testing set. By default, the toggle is off, and all text files are added to your training set.     

    **Single label classification**: your file can only be tagged with one class; you can do so by selecting one of the buttons next to the class you want to tag this file with.

    :::image type="content" source="../media/single.png" alt-text="A screenshot showing the single label classification tag page" lightbox="../media/single.png":::

    **Multi label classification**: your file can be tagged with multiple classes, you can do so by selecting all applicable check boxes next to the classes you want to tag this file with.

    :::image type="content" source="../media/multiple.png" alt-text="A screenshot showing the multiple label classification tag page." lightbox="../media/multiple.png":::

For distribution section, you can **View class distribution across** Training and Testing sets.
   
:::image type="content" source="../media/distribution.png" alt-text="A screenshot showing the distribution options" lightbox="../media/distribution.png":::

To add a text file to a training or testing set, use the buttons choose the set it belongs to.

> [!TIP]
> It is recommended to define your testing set.

Your changes will be saved periodically as you add tags. If they have not been saved yet you will find a warning at the top of your page. If you want to save manually, select **Save tags** at the top of the page.

## Remove tags

If you want to remove a tag, uncheck the button next to the class.

## Delete or classes

To delete/rename a class,

1. Select the class you want to edit from the right side menu
2. Click on the three dots and select the option you want from the drop-down menu.

## Next steps

After you've tagged your data, you can begin [training a model](train-model.md) that will learn based on your data.
