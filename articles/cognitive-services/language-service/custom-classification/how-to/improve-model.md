---
title: How to improve custom text classification model performance
titleSuffix: Azure Cognitive Services
description: Learn about improving a model for Custom Text Classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Improve model performance

After you've trained your model you reviewed its evaluation details, you can decide if you need to improve your model's performance. In this article, you will review inconsistencies between the predicted classes and classes tagged by the model, and examine data distribution.

## Prerequisites

To optionally improve a model, you will need to have:

* [A custom text classification project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md) to successfully [train a model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
* Familiarized yourself with the [evaluation metrics](../concepts/evaluation.md) used for evaluation

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Review test set predictions

Using Language Studio, you can review how your model performs vs how you expected it to perform. You can review predicted and tagged classes side by side for each model you have trained.

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio)).
    1. Look for the section in Language Studio labeled **Classify text**.
    2. Select **Custom text classification**. 

2. Select **Improve model** from the left side menu.

3. Select **Review test set**.

4. Choose your trained model from the **Model** drop-down menu.

5. For easier analysis, you can toggle on **Show incorrect predictions only** to view mistakes only.

    :::image type="content" source="../media/review-validation-set.png" alt-text="Review the validation set" lightbox="../media/review-validation-set.png":::

6. If a file that should belong to class  `X` is constantly classified as class `Y`, it means that there is ambiguity between these classes and you need to reconsider your schema.

## Examine data distribution from Language studio

By examining data distribution in your files, you can decide if any class is underrepresented. Data imbalance happens when the files used for training are not distributed equally among the classes and introduces a risk to model performance. For example, if *class 1* has 50 tagged files while *class 2* has 10 tagged files only, this is a data imbalance where *class 1* is over represented and *class 2* is underrepresented. 

In this case, the model is biased towards classifying your file as *class 1* and might overlook *class 2*. A more complex issue may arise from data imbalance if the schema is ambiguous. If the two classes don't have clear distinction between them and *class 2* is underrepresented the model most likely will classify the text as *class 1*.

In the [evaluation metrics](../concepts/evaluation.md), when a class is over represented it tends to have a higher recall than other classes while under represented classes have lower recall.

To examine data distribution in your dataset:

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).
    1. Look for the section in Language Studio labeled **Classify text**.
    2. Select **Custom text classification**. 

2. Select **Improve model** from the left side menu.

3. Select **Examine data distribution**

    :::image type="content" source="../media/examine-data-distribution.png" alt-text="Examine the data distribution" lightbox="../media/examine-data-distribution.png":::

4. Go back to the **Tag data** page, and make adjustments once you have formed an idea on how you should tag your data differently.

## Next steps

* Once you're satisfied with how your model performs, you can start [sending text classification requests](call-api.md) using the runtime API.
