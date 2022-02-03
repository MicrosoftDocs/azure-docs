---
title: View the evaluation for a Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a Custom Named Entity Recognition (NER) model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---


# View the model's evaluation and details

After your model has finished training, you can view the model details and see how well does it perform against the test set, which contains 10% of your data at random, which is created during [training](train-model.md#data-split). The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset. You must also have a [custom NER project](../quickstart.md) with a [trained model](train-model.md).

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)
* A [successfully trained model](train-model.md)

See the [application development lifecycle](../overview.md#application-development-lifecycle) for more information.

## View the model's evaluation details

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **View model details** from the menu on the left side of the screen.

3. In this page you can only view the sucessfuly trained models. You can click on the model name for more details.

4. You can find the **model-level** evaluation metrics under **Overview**, and the **entity-level** evaluation metrics under **Entity performance metrics**. The confusion matrix for the model is located under **Test set confusion matrix**
    
    > [!NOTE]
    > If you don't find all the entities displayed here, it's because they were not in any of the files within the test set.

    :::image type="content" source="../media/model-details.png" alt-text="A screenshot of the model performance metrics in Language Studio" lightbox="../media/model-details.png":::

## Next steps

* After reviewing your model's evaluation, you can start [improving your model](improve-model.md).
* Learn about the [metrics used in evaluation](../concepts/evaluation-metrics.md). 
