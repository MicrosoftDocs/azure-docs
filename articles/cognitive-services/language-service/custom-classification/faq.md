---
title: Custom text classification FAQ
titleSuffix: Azure Cognitive Services
description: Learn about Frequently asked questions when using the custom text classification API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
---


# Frequently asked questions

Find answers to commonly asked questions about concepts, and scenarios related to custom text classification in Azure Cognitive Service for Language.

## What are the best practices when building a custom classification model?

Get started with this [quickstart](quickstart.md) and follow the [recommended practices](concepts/recommended-practices.md).

## How many tagged files are needed?

Generally, diverse and representative [tagged data](how-to/tag-data.md) leads to better results, given that the tagging is done precisely, consistently and completely. There is no set number of tagged entities that will make every model perform well. Performance highly dependent on your schema, and the ambiguity of your entities. Ambiguous entity types need more tags. Performance also depends on the quality of your tagging. The recommended number of tagged instances per entity is 200. 

## What are the service limits?

See the [service limits article](concepts/data-limits.md) for more information.

## What to do if my model scores poorly?

Model evaluation may not always be comprehensive, especially if a specific class is missing or under-represented in your test set. Consider adding more tagged data to your model to both improve performance, and have a more representative test set.

## How do I improve model performance?

View the [confusion matrix](how-to/view-model-evaluation.md) to identify schema ambiguity. Then [review your test set](how-to/improve-model.md) to see predicted and tagged classes side-by-side so you can get a better idea of your model performance, and decide if any changes in the schema or the tags are necessary.  

## I trained my model, but I can't test it

You need to [deploy your model](quickstart.md#deploy-your-model) before you can test it. 

## How do I use the analyze API?

After deploying your model, you [call the runtime API](how-to/call-api.md). See the [Analyze API reference](https://aka.ms/ct-runtime-swagger) for more information.

## Data privacy and security

Your data is only stored in your Azure storage account, Custom classification only has access to read from it during training and evaluation. 

## Next steps

[Recommended practices](concepts/recommended-practices.md)
