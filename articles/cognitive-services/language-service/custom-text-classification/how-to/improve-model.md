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
ms.date: 05/05/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

# Improve custom text classification model performance

In some cases, the model is expected to make predictions that are inconsistent with your labeled classes. Use this article to learn how to observe these inconsistencies and decide on the needed changes needed to improve your model performance.


## Prerequisites

To optionally improve a model, you'll need to have:

* [A custom text classification project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md) to successfully [train a model](train-model.md).
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
* Familiarized yourself with the [evaluation metrics](../concepts/evaluation-metrics.md).

See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Review test set predictions

After you have viewed your [model's evaluation](view-model-evaluation.md), you'll have formed an idea on your model performance. In this page, you can view how your model performs vs how it's expected to perform. You can view predicted and labeled classes side by side for each document in your test set. You can review documents that were predicted differently than they were originally labeled.


To review inconsistent predictions in the [test set](train-model.md#data-splitting) from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Improve model** from the left side menu.

2. Choose your trained model from **Model** drop-down menu.

3. For easier analysis, you can toggle **Show incorrect predictions only** to view documents that were incorrectly predicted only. 

Use the following information to help guide model improvements. 

* If a file that should belong to class  `X` is constantly classified as class `Y`, it means that there is ambiguity between these classes and you need to reconsider your schema. Learn more about [data selection and schema design](design-schema.md#schema-design). 

* Another solution is to consider adding more data to these classes, to help the model improve and differentiate between them.

* Consider adding more data, to help the model differentiate between different classes.

    :::image type="content" source="../media/review-validation-set.png" alt-text="A screenshot showing model predictions in Language Studio." lightbox="../media/review-validation-set.png":::


## Next steps

* Once you're satisfied with how your model performs, you can [deploy your model](call-api.md).
