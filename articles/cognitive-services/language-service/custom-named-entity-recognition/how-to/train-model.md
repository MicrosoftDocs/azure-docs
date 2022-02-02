---
title: How to train your Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for Custom Named Entity Recognition (NER).
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

# Train your Custom Named Entity Recognition (NER) model

Training is the process where the model learns from your [tagged data](tag-data.md). After training is completed, you will be able to [use the model evaluation metrics](../how-to/view-model-evaluation.md) to determine if you need to [improve your model](../how-to/improve-model.md).

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md)

See the [application development lifecycle](../overview.md#application-development-lifecycle) for more information.

## Data split

Before starting the training process, files in your dataset are divided into two groups at random:

* The **training set** contains 80% of the files in your dataset. It is the main set that is used to train the model.

* The **test set** contains 20% of the files available in your dataset. This set is used to provide an unbiased [evaluation](../how-to/view-model-evaluation.md) of the model. This set is not introduced to the model during training.

## Train model in Language studio

1. Go to your project page in [Language Studio](https://aka.ms/LanguageStudio).

2. Select **Train** from the left side menu.

3. Select **Start a training job** from the top menu.

4. To train a new model, select **Train a new model** and type in the model name in the text box below. You can **overwrite an existing model** by selecting this option and select the model you want from the dropdown below.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new model" lightbox="../media/train-model.png":::

5. Click on the **Train** button.

6. You can check the status of the training job in the same page. Only successfully completed tasks will generate models.

You can only have one training job running at a time. You cannot create or start other tasks in the same project. 

## Next steps

After training is completed, you will be able to use the [model evaluation metrics](view-model-evaluation.md) to optionally [improve your model](improve-model.md). Once you're satisfied with your model, you can deploy it, making it available to use for [extracting entities](call-api.md) from text.
