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

# How to train a text classification model


Training is the process where the model learns from your [tagged data](tag-data.md). After training is completed, you will be able to [use the model evaluation metrics](../how-to/view-model-evaluation.md) to determine if you need to [improve your model](../how-to/improve-model.md).

> [!NOTE]
> * While there is no minimum of tagged instances per class, you can start with 50 files per class. Model performance depends on how distinct the entities in your documents are, and how easily they can be differentiated from each other.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project. 

:::image type="content" source="../media/development-lifecycle/train-model.png" alt-text="An image showing the data tagging and model training portion of the development lifecycle" lightbox="../media/development-lifecycle/train-model.png":::

As you train your model, keep in mind:

* [View the model's evaluation details](../how-to/view-model-evaluation.md) After model training, model evaluation is done against the [test set](../how-to/train-model.md#data-splits), which was not introduced to the model during training. By viewing the evaluation, you can get a sense of how the model performs in real-life scenarios.

* [Examine data distribution](../how-to/improve-model.md#examine-data-distribution-from-language-studio) Make sure that all classes are well represented and that you have a balanced data distribution to make sure that all your classes are adequately represented. If a certain class is tagged far less frequent than the others, this class is likely under-represented and most occurrences probably won't be recognized properly by the model at runtime. In this case, consider adding more files that belong to this class to your dataset.

* [Improve performance (optional)](../how-to/improve-model.md) Other than revising [tagged data](tag-data.md) based on error analysis, you may want to increase the number of tags for under-performing entity types, or improve the diversity of your tagged data. This will help your model learn to give correct predictions, over potential linguistic phenomena that cause failure.

<!-- * Define your own test set: If you are using a random split option and the resulting test set was not comprehensive enough, consider defining your own test to include a variety of data layouts and balanced tagged classes.
 -->

## Data splits

Before starting the training process, files in your dataset are divided into three groups at random:

* The **training set** contains 80% of the files in your dataset. It is the main set that is used to train the model.

* The **test set** contains 20% of the files available in your dataset. This set is used to provide an unbiased [evaluation](../how-to/view-model-evaluation.md) of the model. This set is not introduced to the model during training. The details of correct and incorrect predictions for this set are not shown so that you don't readjust your training data and alter the results.

## Train model in Language Studio

1. Go to your project page in [Language Studio](https://aka.ms/LanguageStudio).

2. Select **Train** from the left side menu.

3. To train a new model, select **Train a new model** and type in the model nam ein the text box below. You can **overwrite an existing model** by selecting this option and selsct the model you want from the dropdown below.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new model" lightbox="../media/train-model.png":::

4. Select the **Train** button at the bottom of the page.

## Next steps

After training is completed, you will be able to [use the model evaluation metrics](../how-to/view-model-evaluation.md) to optionally [improve your model](../how-to/improve-model.md). Once you're satisfied with your model, you can deploy it, making it available to use for [classifying text](call-api.md).
