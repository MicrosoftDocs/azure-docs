---
title: How to use autotagging in custom named entity recognition
titleSuffix: Azure Cognitive Services
description: Learn how to use autotagging in custom named entity recognition.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/09/2022
ms.author: aahi
---

# How to use autotagging

[Tagging process](tag-data.md) is an important part of preparing your dataset. Since this process requires a lot of time and effort, you can use the autotagging feature to automatically tag your entities. With autotagging, you can start tagging a few of your files, train a model, then create an autotagging job to produce tagged entities on your behalf, automatically. This feature can save you the time and effort of manually tagging your entities. 

## Prerequisites

Before you can use autotagging, you must have a [trained model](train-model.md).


## Trigger an autotagging job

When you trigger an autotagging job, there's a monthly limit of 5,000 text records per month, per resource. This means the same limit will apply on all projects within the same resource.

> [!TIP]
> A text record is calculated as the ceiling of (Number of characters in a file / 1,000). For example, if a file has 8921 characters, the number of text records is: 
>
> `ceil(8921/1000) = ceil(8.921)`, which is 9 text records.

1. From the left navigation menu, select **Autotag data**.
2. Select **Trigger Autotag** to start an autotagging job


    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::

3.	Choose a trained model. It's recommended to check the model performance before using it for autotagging.

    :::image type="content" source="../media/choose-model.png" alt-text="A screenshot showing how to choose trained model for autotagging." lightbox="../media/choose-model.png":::


4.	Choose the entities you want to be included in the autotagging job. By default, all entities are selected. You can see the total tags, precision and recall of each entity. It's recommended to include entities that perform well to ensure the quality of the automatically tagged entities. 

    :::image type="content" source="../media/choose-entities.png" alt-text="A screenshot showing which entities to be included in autotag job." lightbox="../media/choose-entities.png":::

5.	Choose the files you want to be automatically tagged. You'll see the number of text records of each file. When you select one or more files, you should see the number of texts records selected. It's recommended to choose the untagged files from the filter. 

    > [!NOTE]
    > * If an entity was automatically tagged, but has a user defined tag, only the user defined tag will be used and be visible.  
    > * You can view the files by clicking on the file name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which files to be included in the autotag job." lightbox="../media/choose-files.png":::

6.	Select **Autotag** to trigger the autotagging job. 
You should see the model used, number of files included in the autotag job, number of text records and entities to be automatically tagged. Autotag jobs can take anywhere from a few seconds to a few minutes, depending on the number of files you included. 


    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::

## Review the tagged files

When the autotag job is complete, you can see the output files in the **Tag data** page of Language Studio. Select **Review files with autotags** to view the files with the **Auto tagged** filter applied.

:::image type="content" source="../media/open-autotag-files.png" alt-text="A screenshot showing the autotagged files, and an autotagged job ID." lightbox="../media/open-autotag-files.png":::

Entities that have been automatically tagged will appear with a dotted line. These entities will have two selectors (a checkmark and an "X") that will let you accept or reject the automatic tag.

Once an entity is accepted, the dotted line will change to solid line, and this tag will be included in any further model training and be a user defined tag.

Alternatively, you can accept or reject all automatically tagged entities within the file, using **Accept all** or **Reject all** in the top right corner of the screen. 

After you accept or reject the tagged entities, select **Save tags** to apply the changes.

> [!NOTE]
> * We recommend validating automatically tagged entities before accepting them. 
> * All tags that were not accepted will be deleted when you train your model.

:::image type="content" source="../media/accept-reject-entities.png" alt-text="A screenshot showing how to accept and reject autotagged entities." lightbox="../media/accept-reject-entities.png":::

## Next steps

* Learn more about [tagging your data](tag-data.md).
