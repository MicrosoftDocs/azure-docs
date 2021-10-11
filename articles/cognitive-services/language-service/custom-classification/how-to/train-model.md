---
title: How to train your custom classification model - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# How to train your model


Training is the process where the model learns from your [tagged data](tag-data.md). Training uses deep learning technology built on top of [Microsoft Turing](https://msturing.org/about). After training is completed you can [view model evaluation](../how-to/view-model-evaluation.md), and [Improve your model](../how-to/improve-model.md). 

> [!NOTE]
> * You must have a minimum of 10 documents in your project for the evaluation process to be successful. While training may run with less than 10 tagged files there will be no evaluation data for the model. 
> * While there is no minimum of tagged instances per class, you can start with 20 files per class. Model performance depends on how distinct the entities in your documents are, and how easily they can be differentiated from each other.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

## Data splits

Before starting the training process, files in your dataset are divided into three groups at random: 

* The **training set** contains 80% of the files in your dataset. It is the main set that is used to train the model.

* The **validation set** contains 10% and is introduced to the model during training. Later you can view the incorrect predictions made by the model on this set so you examine your data and tags and make necessary adjustments.

* The **test set** contains 10% of the files available in your dataset. This set is used to provide an unbiased [evaluation](../how-to/view-model-evaluation.md) of the model. This set is not introduced to the model during training. The details of correct and incorrect predictions for this set are not shown so that you don't readjust your training data and alter the results.

## Prerequisites

* Successfully created a [Custom text classification project](../quickstart.md)

* Finished [tagging your data](tag-data.md).
    * You can create and train multiple [models](../definitions.md#model) within the same [project](../definitions.md#project). However, if you re-train a specific model it will overwrite the previous state.

## Train model in Language studio

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/classification).

2. Select **Train** from the left side menu.

3. Select the model you want to train from the **Model name** dropdown, if you don’t have models already, type in the name of your model and select **create new model**.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new model" lightbox="../media/train-model.png":::

4. Select the **Train** button at the bottom of the page. If the model you selected is already trained, a pop-up window will appear to confirm overwriting the last model state.

5. After training is completed, you can [view the model evaluation details](view-model-evaluation.md) and [improve your model](improve-model.md)

## Next steps

* [View the model evaluation details](view-model-evaluation.md)
* [Improve model](improve-model.md)
