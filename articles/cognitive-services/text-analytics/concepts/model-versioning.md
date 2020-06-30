---
title: Specify the model version in Text Analytics v3
titleSuffix: Azure Cognitive Services
description: Learn how to specify the Text Analytics API model used on your data. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 04/21/2020
ms.author: aahi
---

# Model versioning in the Text Analytics API

Version 3 of the Text Analytics API lets you choose the model version that gets used on your data. Use the optional `model-version` parameter to select the version of the model in your API requests. For example: `<resource-url>/text/analytics/v3.0/sentiment?model-version=2020-04-01`. If this parameter isn't specified the API will default to the latest stable version. 

## Available versions

Use the table below to find which model versions are supported by each endpoint.


| Endpoint                        | Supported Versions                       | latest version |
|---------------------------------|------------------------------------------|----------------|
| `/sentiment`                    | `2019-10-01`, `2020-04-01`               | `2020-04-01`   |
| `/languages`                    | `2019-10-01`                             | `2019-10-01`   |
| `/entities/linking`             | `2019-10-01`, `2020-02-01`               | `2020-02-01`   |
| `/entities/recognition/general` | `2019-10-01`, `2020-02-01`, `2020-04-01` | `2020-04-01`   |
| `/entities/recognition/pii`     | `2019-10-01`, `2020-02-01`, `2020-04-01` | `2020-04-01`   |
| `/keyphrases`                   | `2019-10-01`                             | `2019-10-01`   |


You can find details about the updates for these models in [What's new](../whats-new.md).

## Text Analytics for health

The [Text Analyics for health](../how-tos/text-analytics-for-healthcare.md) container uses seperate model versioning than the other API endpoints. See the table below for available model versions for Text Analytics for health.

| Supported Versions                       | latest version |
|------------------------------------------|----------------|
| `2020-07-01`                             | `2020-07-01`   |


## Next steps

* [Text Analytics overview](../overview.md)
* [Sentiment analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Entity recognition](../how-tos/text-analytics-how-to-entity-linking.md)
