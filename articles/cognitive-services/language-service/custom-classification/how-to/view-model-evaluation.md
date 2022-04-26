---
title: View a custom text classification model evaluation - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a custom text classification model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# View the model evaluation

Reviewing model evaluation is an important step in developing a custom text classification model. It helps you learn how well your model is performing, and gives you an idea about how it will perform when used in production. 


## Prerequisites

Before you train your model you need:
* [A custom text classification project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)
* A successfully [trained model](train-model.md)

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Model evaluation

The evaluation process uses the trained model to predict user-defined classes for files in the test set, and compares them with the provided data tags. The test set consists of data that was not introduced to the model during the training process. 

## View the model details using Language Studio

[!INCLUDE [View model details](../includes/model-evaluation-language-studio.md)]


Under the **Test set confusion matrix**, you can find the confusion matrix for the model.

> [!NOTE]
> The confusion matrix is currently not supported for multi label classification projects.

**Single label classification**

:::image type="content" source="../media/conf-matrix-single.png" alt-text="Confusion matrix for single label classification" lightbox="../media/conf-matrix-single.png":::

<!-- **Multi label classification**

:::image type="content" source="../media/conf-matrix-multi.png" alt-text="Confusion matrix for multi label classification" lightbox="../media/conf-matrix-multi.png"::: -->

## Next steps

As you review your how your model performs, learn about the [evaluation metrics](../concepts/evaluation.md) that are used. Once you know whether your model performance needs to improve, you can begin [improving the model](improve-model.md).
