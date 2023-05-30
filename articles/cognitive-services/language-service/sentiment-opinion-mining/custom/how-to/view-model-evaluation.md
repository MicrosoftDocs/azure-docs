---
title: View a Custom sentiment analysis model evaluation - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a Custom sentiment analysis model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 10/12/2022
ms.author: aahi
ms.custom: language-service-custom-classification
---

# View your Custom sentiment analysis model's evaluation and details

After your model has finished training, you can view the model performance and see the predicted classes for the documents in the test set. 

> [!NOTE]
> Using the **Automatically split the testing set from training data** option may result in different model evaluation result every time you [train a new model](train-model.md), as the test set is selected randomly from the data. To make sure that the evaluation is calculated on the same test set every time you train a model, make sure to use the **Use a manual split of training and testing data** option when starting a training job and define your **Test** documents when labeling data.

## Prerequisites

Before viewing model evaluation you need:

* [A Custom sentiment analysis project](create-project.md) with a configured Azure blob storage account.
* Text data that has [been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](label-data.md).
* A successfully [trained model](train-model.md).

See the [project development lifecycle](../../overview.md#project-development-lifecycle) for more information.

## Model details

### [Language studio](#tab/language-studio)

[!INCLUDE [View model details](../../includes/custom/model-evaluation.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [Model evaluation](../../includes/custom/rest-api/model-evaluation.md)]

---

## Load or export model data

### [Language studio](#tab/Language-studio)

[!INCLUDE [Load export model](../../../includes/custom/language-studio/load-export-model.md)]


### [REST APIs](#tab/REST-APIs)

[!INCLUDE [Load export model](../../includes/custom/rest-api/load-export-model.md)]

---

## Delete model

### [Language studio](#tab/language-studio)

[!INCLUDE [Delete model](../../../includes/custom/language-studio/delete-model.md)]


### [REST APIs](#tab/rest-api)

[!INCLUDE [Delete model](../../includes/custom/rest-api/delete-model.md)]


---

## Next steps

* [Call the Sentiment analysis API](./call-api.md)
<!--As you review your how your model performs, learn about the [evaluation metrics](../concepts/evaluation-metrics.md) that are used. Once you know whether your model performance needs to improve, you can begin improving the model.-->
