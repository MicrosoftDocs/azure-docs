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


Training is the process where the model learns from your [tagged data](tag-data.md) to output a trained model. At the start of the training process the tags file containing tagged data and classes is sent to the service along with the tagged files. Tagged files are split into train and test sets<!-- , where the split can either be pre-defined by developers in tags file or chosen at random during training-->. The train set alongside the tags file are processed during training to create the custom classification model. The test set is later processed by the trained model to evaluate its performance. You can have a maximum of 10 models within you rproject but you can only train one model at a time. The user can choose to train a new model or overwrite an existing one.

> [!NOTE]
> * The minimum number of tagged instances per class is 10. You can start with this and add more tagged instances if needed. Model performance depends on how distinct the classes in your documents are and how easily they can be differentiated from each other.
> The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

## Data splits

Before starting the training process, files in your dataset are divided into two sets at random: 

* The **training set** contains 80% of the files in your dataset. It is the main set that is used to train the model alongside with the tags file.

* The **test set** contains 20% of the files available in your dataset. This set is a blind set which means that it is not introduced to the model during training. Test set is later used to provide [evaluation](../how-to/view-model-evaluation.md) of the model. You can also view the correct and incorrect predictions for this set so that you can readjust the training data to [improve model](improve-model.md).

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
