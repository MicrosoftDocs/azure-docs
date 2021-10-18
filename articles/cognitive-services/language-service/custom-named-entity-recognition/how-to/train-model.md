---
title: How to train your Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn about how to train your model for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# Train your Custom Named Entity Recognition (NER) model

After you have completed tagging your data, you can start training your model. You can create and train multiple models within the same project. However, if you retrain a specific model, it will overwrite its previous version.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

## Data split

Before starting the training process, files in your dataset are divided into three groups at random: 

* The training set contains 80% of the files in your dataset. It is the main set that is used to train the model.
    
* The test set contains 20% of the files available in your dataset. This set is used to provide an unbiased [evaluation](../how-to/view-model-evaluation.md) of the model. This set is not introduced to the model during training. The details of correct and incorrect predictions for this set are not shown so that you don't readjust your training data and alter the results.

You must also have a [custom NER project](../quickstart.md) with at least 10 [tagged data](tag-data.md) files for evaluation to be successful.

## Train model in Language studio

>[!NOTE]
> * You can only have up to 10 models per project.
> * Training can take up to few hours.

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/extraction).

2. Select **Train** from the left side menu.

3. Enter a new model name, or select an existing model from the **Model name** dropdown.

    :::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the model training screen." lightbox="../media/train-model.png":::

4. Click on the **Train** button at the bottom of the page.

5. If the model you selected is already trained, a window will appear to confirm overwriting the last model state.

## Next steps

After training is completed, you can [view the model's evaluation details](view-model-evaluation.md) and [improve your model](improve-model.md)
