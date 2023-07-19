---
title: Quickstart - Custom text classification
titleSuffix: Azure AI services
description: Quickly start building an AI model to identify and apply labels (classify) unstructured text.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: quickstart
ms.date: 01/25/2023
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, mode-other
zone_pivot_groups: usage-custom-language-features
---

# Quickstart: Custom text classification

Use this article to get started with creating a custom text classification project where you can train custom models for text classification. A model is artificial intelligence software that's trained to do a certain task. For this system, the models classify text, and are trained by learning from tagged data.

Custom text classification supports two types of projects: 

* **Single label classification** - you can assign a single class for each document in your dataset. For example, a movie script could only be classified as "Romance" or "Comedy". 
* **Multi label classification** - you can assign multiple classes for each document in your dataset. For example, a movie script could be classified as "Comedy" or "Romance" and "Comedy".

In this quickstart you can use the sample datasets provided to build a multi label classification where you can classify movie scripts into one or more categories or you can use single label classification dataset where you can classify abstracts of scientific papers into one of the defined domains.


::: zone pivot="language-studio"

[!INCLUDE [Language Studio quickstart](includes/quickstarts/language-studio.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API quickstart](includes/quickstarts/rest-api.md)]

::: zone-end

## Next steps

After you've created a custom text classification model, you can:
* [Use the runtime API to classify text](how-to/call-api.md)

When you start to create your own custom text classification projects, use the how-to articles to learn more about developing your model in greater detail:

* [Data selection and schema design](how-to/design-schema.md)
* [Tag data](how-to/tag-data.md)
* [Train a model](how-to/train-model.md)
* [View model evaluation](how-to/view-model-evaluation.md)
