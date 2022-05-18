---
title: View the evaluation for a Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a Custom Named Entity Recognition (NER) model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---


# View the model's evaluation and details

After your model has finished training, you can view the model details and see how well does it perform against the test set, which contains 10% of your data at random, which is created during [training](train-model.md). The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset. You must also have a [custom NER project](../quickstart.md) with a [trained model](train-model.md).

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)
* A [successfully trained model](train-model.md)

See the [application development lifecycle](../overview.md#application-development-lifecycle) for more information.

## View the model's evaluation details

[!INCLUDE [View model evaluation using Language Studio](../includes/view-model-evaluation-language-studio.md)]

## Next steps

* After reviewing your model's evaluation, you can start [improving your model](improve-model.md).
* Learn about the [metrics used in evaluation](../concepts/evaluation-metrics.md). 
