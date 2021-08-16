---
title: How to train your custom extraction model
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for custom text extraction.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Train your custom text extraction model

After you have completed tagging your data, you can start training your model. You can create and train multiple models within the same project]. However, if you re-train a specific model, it will overwrite it's previous version.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. While training, your tagged files will be spilt into 3 parts: 

* 80% for training
* 10% for validation 
* 10% for testing. 

You must have minimum of 10 docs in your project for the [evaluation](view-model-evaluation.md) process to be successful. 

## Prerequisites

* A [custom extraction project](../quickstart.md)

* Completed [data tagging](tag-data.md).

## Train model in Language studio

>[!NOTE]
> * You can only have up to 10 models per project.
> * Training can take up to few hours.

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/extraction).

2. Select **Train** from the left side menu.

3. Enter a new model name, or select an existing model from the **Model name** dropdown.

![train-model-1](../../media/extraction/ct-train-model-1.png)
    :::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the model training screen." lightbox="../media/train model.png":::
4. Click on the **Train** button at the bottom of the page.

5. If the model you selected is already trained, a pop up will appear to confirm overwriting the last model state.

## Next steps

After training is completed, you can [view the model's evaluation details](view-model-evaluation.md) and [improve your model](improve-model.md)
