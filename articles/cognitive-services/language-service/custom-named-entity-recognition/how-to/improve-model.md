---
title: How to improve Custom Named Entity Recognition (NER) model performance
titleSuffix: Azure Cognitive Services
description: Learn about improving a model for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 05/06/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Improve model performance

In some cases, the model is expected to extract entities that are inconsistent with your labeled ones. In this page you can observe these inconsistencies and decide on the needed changes needed to improve your model performance.

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
    * Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md)
* A [successfully trained model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
* Familiarized yourself with the [evaluation metrics](../concepts/evaluation-metrics.md).

See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.


## Review test set predictions

After you have viewed your [model's evaluation](view-model-evaluation.md), you'll have formed an idea on your model performance. In this page, you can view how your model performs vs how it's expected to perform. You can view predicted and labeled entities side by side for each document in your test set. You can review entities that were extracted differently than they were originally labeled.


To review inconsistent predictions in the [test set](train-model.md) from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Improve model** from the left side menu.

2. Choose your trained model from **Model** drop-down menu.

3. For easier analysis, you can toggle **Show incorrect predictions only** to view entities that were incorrectly predicted only. You should see all documents that include entities that were incorrectly predicted.

5. You can expand each document to see more details about predicted and labeled entities.

    Use the following information to help guide model improvements. 
    
    * If entity `X` is constantly identified as entity `Y`, it means that there is ambiguity between these entity types and you need to reconsider your schema. Learn more about [data selection and schema design](design-schema.md#schema-design). Another solution is to consider labeling more instances of these entities, to help the model improve and differentiate between them.
    
    * If a complex entity is repeatedly not predicted, consider [breaking it down to simpler entities](design-schema.md#schema-design) for easier extraction. 
    
    * If an entity is predicted while it was not labeled in your data, this means to you need to review your labels. Be sure that all instances of an entity are properly labeled in all documents.
    
    
    :::image type="content" source="../media/review-predictions.png" alt-text="A screenshot showing model predictions in Language Studio." lightbox="../media/review-predictions.png":::




## Next steps

Once you're satisfied with how your model performs, you can [deploy your model](call-api.md).
