---
title: View a custom classification model evaluation - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a custom classification model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# View the model evaluation

Reviewing model evaluation is an important step in developing a custom classification model. It helps you learn how well your model is performing, and gives you an idea about how it will perform when used in production. 


## Prerequisites

Before you train your model you need:
* [A custom classification project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)
* A successfully [trained model](train-model.md)

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Model evaluation

The evaluation process uses the trained model to predict user-defined classes for files in the test set, and compares them with the provided data tags. The test set consists of data that was not introduced to the model during the training process. 

## View the model details using Language Studio

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **View model details** from the left side menu.

3. In this page you can only view the successfully trained models. You can select the model name for more details.

4. You can find the **model-level** evaluation metrics under the **Overview** section and the **class-level** evaluation metrics  under the **Class performance metrics** section. See [Evaluation metrics](../concepts/evaluation.md#model-level-and-class-level-evaluation-metrics) for more information.

    :::image type="content" source="../media/model-details-2.png" alt-text="Model performance metrics" lightbox="../media/model-details-2.png":::

> [!NOTE]
> If you don't find all the classes displayed here, it is because there were no tagged files of this class in the test set.

Under the **Test set confusion matrix**, you can find the confusion matrix for the model.

> [!NOTE]
> The confusion matrix is currently not supported for multiple label classification projects.

**Single label classification**

:::image type="content" source="../media/conf-matrix-single.png" alt-text="Confusion matrix for single class classification" lightbox="../media/conf-matrix-single.png":::

<!-- **Multiple Label Classification**

:::image type="content" source="../media/conf-matrix-multi.png" alt-text="Confusion matrix for multiple class classification" lightbox="../media/conf-matrix-multi.png"::: -->

## Next steps

As you review your how your model performs, learn about the [evaluation metrics](../concepts/evaluation.md) that are used. Once you know whether your model performance needs to improve, you can begin [improving the model](improve-model.md).
