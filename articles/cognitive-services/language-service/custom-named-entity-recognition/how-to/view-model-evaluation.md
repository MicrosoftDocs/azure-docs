---
title: View the evaluation for a Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a Custom Named Entity Recognition (NER) model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---


# View the model's evaluation and details

After your model has finished training, you can view the model details and see how well does it perform against the test set, which contains 10% of your data at random, which is created during [training](train-model.md#data-split). The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset. You must also have a [custom NER project](../quickstart.md) with a [trained model](train-model.md).

## View the model's evaluation details

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/extraction).

2. Select **View model details** from the menu on the left side of the screen.

3. View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column. you can click on the model name for more details.

4. You can find the **model-level** evaluation metrics under **Overview**, and the **entity-level** evaluation metrics under **Entity performance metrics**. The confusion matrix for the model is located under **Test set confusion matrix**
    
    > [!NOTE]
    > If you don't find all the entities displayed here, it's because they were not in any of the files within the test set.

    :::image type="content" source="../media/model-details.png" alt-text="A screenshot of the model performance metrics in Language Studio" lightbox="../media/model-details.png":::

## Next steps

* After reviewing your model's evaluation, you can start [improving your model](improve-model.md).
* Learn about the [metrics used in evaluation](../concepts/evaluation-metrics.md). 

