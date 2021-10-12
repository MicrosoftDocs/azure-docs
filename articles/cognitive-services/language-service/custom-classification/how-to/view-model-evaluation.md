---
title: View a custom classification model evaluation - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a custom classification model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# View the model evaluation

Reviewing model evaluation is an important step in developing a custom classification model. It helps you learn how well your model is performing, and gives you an idea about how it will perform when used in production. 

Model evaluation comes after you've [created a text classification project](../quickstart.md), and finished [training your model](train-model.md) successfully. The evaluation process uses the trained model to predict user-defined classes for files in the test set, and compares them with the provided data tags. The test set consists of data that was not introduced to the model during the training process. 

## View the model details using Language Studio

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/classification).

2. Select **View model details** from the left side menu.

3. View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column.

    :::image type="content" source="../media/model-details-1.png" alt-text="View model details button" lightbox="../media/model-details-1.png":::

1. Click on the model name for more details.

2. You can find the **model-level** evaluation metrics under the **Overview** section and the **class-level** evaluation metrics  under the **Class performance metrics** section. See [Evaluation metrics](../concepts/evaluation.md#model-level-and-class-level-evaluation-metrics) for more information.

    :::image type="content" source="../media/model-details-2.png" alt-text="Model performance metrics" lightbox="../media/model-details-2.png":::

> [!NOTE]
> If you don't find all the classes displayed here, it is because there were no tagged files of this class in the test set.

Under the **Test set confusion matrix**, you can find the confusion matrix for the model.

**Single Label Classification**

:::image type="content" source="../media/conf-matrix-single.png" alt-text="Confusion matrix for single class classification" lightbox="../media/conf-matrix-single.png":::

**Multiple Label Classification**

:::image type="content" source="../media/conf-matrix-multi.png" alt-text="Confusion matrix for multiple class classification" lightbox="../media/conf-matrix-multi.png":::

## Next steps

* [Improve model](improve-model.md)
* [Evaluation metrics](../concepts/evaluation.md)
