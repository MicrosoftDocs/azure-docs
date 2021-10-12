---
title: How to improve Custom Named Entity Recognition (NER) model performance
titleSuffix: Azure Cognitive Services
description: Learn about improving a model for Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---

# Improve the performance of Custom Named Entity Recognition (NER) models 

After you've trained your model you reviewed its evaluation details, you can start to improve model performance. In this article, you will review inconsistencies between the predicted classes and classes tagged by the model, and examine data distribution.

## Prerequisites

* Successfully created a [Custom text classification project](../quickstart.md).
* Completed [model training](train-model.md) successfully.
* Viewed [model evaluation details](view-model-evaluation.md).

## Improve model

After you have reviewed your [model's evaluation](view-model-evaluation.md), you'll have formed an idea on what's wrong with your model's prediction. 

> [!NOTE]
> This guide focuses on data from the [validation set](train-model.md#data-split) that was created during training.

### Review validation set

Using Language Studio, you can review how your model performs against how you expected it to perform. You can review predicted and tagged classes for each model you have trained.

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/extraction).

2. Select **Improve model** from the left side menu.

3. Select **Review validation set**.

4. Choose your trained model from **Model** drop-down menu.

5. For easier analysis, you can toggle **Show incorrect predictions only** to view mistakes only.

Use the following information to help guide model improvements. 

* If entity `X` is constantly identified as entity `Y`, it means that there is ambiguity between these entity types and you need to reconsider your schema.

* If a complex entity is repeatedly not extracted, consider breaking it down to simpler entities for easier extraction.

* If an entity is predicted while it was not tagged in your data, this means to you need to review your tags. Be sure that all instances of an entity are properly tagged in all files.

* You can [view recommended practices](../concepts/recommended-practices.md) to help you improve your model.
    
### Examine data distribution

By examining data distribution in your files, you can decide if any entity is underrepresented. Data imbalance happens when tags are not distributed equally among your entities, and is a risk to your model's performance. For example, if *entity 1* has 50 tags while *entity 2* has 10 tags only, this is an example of data imbalance where *entity 1* is over represented, and *entity 2* is underrepresented. The model is biased towards extracting *entity 1* and might overlook *entity 2*. More complex issues may come from data imbalance if the schema is ambiguous. If the two entities are some how similar and *entity 2* is underrepresented the model most likely will extract it as *entity 1*.

In [model evaluation](view-model-evaluation.md), entities that are over represented tend to have a higher recall than other entities, while under represented entities have lower recall.

To examine data distribution in your dataset:

1. Go to your project page in [Language Studio](https://language.azure.com/customText/projects/extraction).

2. Select **Improve model** from the left side menu.

3. Select **Examine data distribution**.

## Next steps

* After examining the data distribution, you should have an idea of how to [tag your data](tag-data.md) differently.
* [View the recommended practices](../concepts/recommended-practices.md) to help you tag your data and improve your model. 
