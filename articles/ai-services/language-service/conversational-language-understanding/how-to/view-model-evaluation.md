---
title: How to view conversational language understanding models details
description: Use this article to learn about viewing the details for a conversational language understanding model.
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 05/16/2022
ms.author: aahi
ms.custom: language-service-custom-classification
---

# View conversational language understanding model details

After model training is completed, you can view your model details and see how well it performs against the test set. 

> [!NOTE]
> Using the **Automatically split the testing set from training data** option may result in different model evaluation result every time you [train a new model](train-model.md), as the test set is selected randomly from your utterances. To make sure that the evaulation is calcualted on the same test set every time you train a model, make sure to use the **Use a manual split of training and testing data** option when starting a training job and define your **Testing set** when [add your utterances](tag-utterances.md).

## Prerequisites

Before viewing a model's evaluation, you need:

* A successfully [created project](create-project.md).
* A successfully [trained model](train-model.md).

See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Model details

### [Language studio](#tab/Language-studio)

[!INCLUDE [Model performance](../includes/language-studio/model-performance.md)]

### [REST APIs](#tab/REST-APIs)

[!INCLUDE [Evaluate model](../includes/rest-api/model-evaluation.md)]

---

## Load or export model data

### [Language studio](#tab/Language-studio)

[!INCLUDE [Load export model](../includes/language-studio/load-export-model.md)]


### [REST APIs](#tab/REST-APIs)

[!INCLUDE [Load export model](../includes/rest-api/load-export-model.md)]

---

## Delete model

### [Language studio](#tab/Language-studio)

[!INCLUDE [Delete model](../includes/language-studio/delete-model.md)]


### [REST APIs](#tab/REST-APIs)

[!INCLUDE [Delete model](../includes/rest-api/delete-model.md)]


---


## Next steps

* As you review your how your model performs, learn about the [evaluation metrics](../concepts/evaluation-metrics.md) that are used.
* If you're happy with your model performance, you can [deploy your model](deploy-model.md)
