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

# Tag text data for training your model 

Before creating a custom text classification model, you need to have tagged data first. If your data is not tagged already, you can tag it in the language studio. Tagged data informs the model how to interpret text, and is used for training and evaluation.

Before you can tag data, you need [a successfully created project](../quickstart.md) with a valid resource and storage account.
You will then need to [upload training data](project-requirements.md#prepare-training-data) for your model to learn from. Tagging your data will let you [train your model](train-model.md), [evaluate it](train-model.md), and use it to [classify text](call-api.md).

As you tag your data, keep in mind:

* In general, more tagged data leads to better results, provided the data is tagged accurately.

* Although we recommended to have around 50 tagged files per class, there is no fixed number that can guarantee your model will perform the best, because model performance also depends on possible ambiguity in your [schema](../concepts/recommended-practices.md), and the quality of your tagged data.


:::image type="content" source="../media/development-lifecycle/tag-data.png" alt-text="An image showing the data tagging and model training portion of the development lifecycle" lightbox="../media/development-lifecycle/tag-data.png":::

## Tag your data

After training data is uploaded to your Azure storage account, you will need to tag it, so your model knows which words will be associated with the classes you need. When you tag data in Language Studio (or manually tag your data), these tags will be stored in [the JSON format](../concepts/data-formats.md) that your model will use during training.  

1. Go to your projects page in [Language Studio](https://language.azure.com/customText/projects/classifciation) and select your project.

2. From the left side menu, select **Tag data**

3. You can find a list of all `.txt` files available in your projects to the left. You can select the file you want to start tagging or you can use the **Back** and **Next** button from the top-right menu to navigate.
    
4.  You can either view all files or only tagged files by changing the view from the **Viewing** drop-down menu. 

    > [!NOTE]
    > If you enabled multiple languages for your project, you will find an additional **Language** drop-down menu. Select the language of each document.

    :::image type="content" source="../media/tag-1.png" alt-text="A screenshot showing the data tagging screen" lightbox="../media/tag-1.png":::

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
> The number of tags you need will vary depending on your dataset; how distinct your entities are and how easily they can be  differentiated from each other. Your tagging should be consistent and complete. Consider starting with 50 tagged files per classification and more as you go.

As you tag your data, you can find a training readiness recommendation in the top-right corner of the page.
:::image type="content" source="../media/tag-train-ready.png" alt-text="Readiness recommendation" lightbox="../media/tag-train-ready.png":::

## Next steps

After you've tagged your data, you can begin [training a model](train-model.md) that will learn based on your data.
