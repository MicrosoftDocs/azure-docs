---
title: Custom classification FAQ - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about Frequently asked questions when using the custom text classification API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---


# Frequently asked questions

### What are the best practices when building custom classification model?

Get started with this [quickstart](quickstart/using-language-studio.md) and follow the [recommended practices](concepts/recommended-practices.md)

### How many tagged files are needed?

Generally, more tagged data leads to better results given tagging is done precisely, consistently and completely. while there is no magical number of tagged entities that would make your model perform well. This is highly dependent on your schema and entities ambiguity; ambiguous entity types need more tags. This also depends on the quality of your tagging. The recommended number of tagged instances per entity is 200. 

### Service limits

You can find more details about about service limite [here](concepts/data-limits.md)

### What to do if I get low scores?

Model evaluation may not always be comprehensive, especially if a specific entity is missing or under-represented in your test set. Consider adding more tagged data to your model to both improve perfomrance and have a more representative test set.

### Improve model performance

View the your [confusion matrix](how-to/view-model-evaluation.md) to identify schema ambiguity. Then [review your test set](how-to/improve-model.md#review-validation-set) to see predicted and tagged classes side by side so you can get a better idea of your model performance and decide if any changes in the schema or the tags are necessary.  

### Model trained but cannot test

You need to [deploy your model](quickstart/using-language-studio.md#deploy-your-model) before you can test it. 

### How to use analyze API

After deploying your model, [submit text classification tasks](how-to/run-inference.md). You can learn more about using the Analyze API [here](https://aka.ms/ct-runtime-swagger)

## Data privacy and security

Your data is only stored in your Azure storage account, Custom classification only has access to read from it during training and evaluation. 
