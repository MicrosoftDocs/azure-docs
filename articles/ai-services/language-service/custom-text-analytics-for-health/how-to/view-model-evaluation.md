---
title: Evaluate a Custom Text Analytics for health model
titleSuffix: Azure AI services
description: Learn how to evaluate and score your Custom Text Analytics for health model
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 04/14/2023
ms.author: aahi
ms.custom: language-service-custom-ta4h
---


# View a custom text analytics for health model's evaluation and details

After your model has finished training, you can view the model performance and see the extracted entities for the documents in the test set. 

> [!NOTE]
> Using the **Automatically split the testing set from training data** option may result in different model evaluation result every time you train a new model, as the test set is selected randomly from the data. To make sure that the evaluation is calculated on the same test set every time you train a model, make sure to use the **Use a manual split of training and testing data** option when starting a training job and define your **Test** documents when [labeling data](label-data.md).

## Prerequisites

Before viewing model evaluation, you need:

* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](label-data.md)
* A [successfully trained model](train-model.md)


## Model details

There are several metrics you can use to evaluate your mode. See the [performance metrics](../concepts/evaluation-metrics.md) article for more information on the model details described in this article.

### [Language studio](#tab/language-studio)

[!INCLUDE [View model evaluation using Language Studio](../../includes/custom/model-evaluation-language-studio.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [Model evaluation](../includes/rest-api/model-evaluation.md)]

---

## Load or export model data

### [Language studio](#tab/Language-studio)

[!INCLUDE [Load export model](../../includes/custom/load-export-model-language-studio.md)]


### [REST APIs](#tab/REST-APIs)

[!INCLUDE [Load export model](../../includes/custom/load-export-model-rest-api.md)]

---

## Delete model

### [Language studio](#tab/language-studio)

[!INCLUDE [Delete model](../../includes/custom/delete-model-language-studio.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [Delete model](../../includes/custom/delete-model-rest-api.md)]

---

## Next steps

* [Deploy your model](deploy-model.md)
* Learn about the [metrics used in evaluation](../concepts/evaluation-metrics.md). 
