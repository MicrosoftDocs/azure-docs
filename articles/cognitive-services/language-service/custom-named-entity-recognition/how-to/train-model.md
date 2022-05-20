---
title: How to train your Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
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

## Train model in Language studio

1. Go to your project page in [Language Studio](https://aka.ms/LanguageStudio).

2. Select **Train** from the left side menu.

3. Select **Start a training job** from the top menu.

4. To train a new model, select **Train a new model** and type in the model name in the text box below. You can **overwrite an existing model** by selecting this option and select the model you want from the dropdown below.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new training job" lightbox="../media/train-model.png":::
    
If you have enabled [your project data to be split manually](tag-data.md) when you were tagging your data, you will see two training options:

* **Automatic split the testing**: The data will be randomly split for each class between training and testing sets, according to the percentages you choose. The default value is 80% for training and 20% for testing. To change these values, choose which set you want to change and write the new value.
* **Use a manual split**: Assign each document to either the training or testing set, this required first adding files in the test dataset.


5. Click on the **Train** button.

6. You can check the status of the training job in the same page. Only successfully completed training jobs will generate models.

You can only have one training job running at a time. You cannot create or start other tasks in the same project. 

## Next steps

After training is completed, you will be able to use the [model evaluation metrics](view-model-evaluation.md) to optionally [improve your model](improve-model.md). Once you're satisfied with your model, you can deploy it, making it available to use for [extracting entities](call-api.md) from text.
