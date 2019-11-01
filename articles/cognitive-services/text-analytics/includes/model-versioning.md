---
title: Model versioning
titleSuffix: Azure Cognitive Services
description: Specify model versions in the V3 endpoints
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 10/25/2019
ms.author: aahi
---

Version 3 of the Text Analytics API lets you choose the Text Analytics model used on your data. Use the optional `model-version` parameter to select a version of the model in your requests. If this parameter isn't specified the API will default to `latest`, the latest stable model version.

Available model versions:
* `2019-10-01` (`latest`)

Each response from the v3 endpoints includes a `model-version` field specifying the model version that was used.

```json
{
    “documents”: […]
    “errors”: []
    “model-version”: “2019-10-01”
}
```
