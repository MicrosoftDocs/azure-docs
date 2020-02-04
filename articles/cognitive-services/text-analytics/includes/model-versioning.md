---
title: Model versioning
titleSuffix: Azure Cognitive Services
description: Specify model versions in the V3 endpoints
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/31/2019
ms.author: aahi
---

Version 3 of the Text Analytics API lets you choose the model version that is most current for your data. Use the optional `model-version` parameter to select the version of the model that is desired for your requests. If this parameter isn't specified the API will default to `latest`, the latest stable version. See [What's new](../whats-new.md) for details on these model versions.

| Model version           | Features updated         | Latest version           |
|-------------------------|--------------------------|--------------------------|
| `2020-02-01`            | NER                      | NER                      |
| `2019-10-01`            | NER, Sentiment Analysis  | Language Detection, Keyphrases, Sentiment Analysis|


Each response from the v3 endpoints includes a `model-version` field specifying the model version that was used.

```json
{
    "documents": […]
    "errors": []
    "model-version": "2019-10-01"
}
```
