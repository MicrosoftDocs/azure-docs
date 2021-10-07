---
title: Specify the model version in Language Services
titleSuffix: Azure Cognitive Services
description: Learn how to specify the Language Services model used on your data. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 06/17/2021
ms.author: aahi
---

# Model versioning in Language Services

Language Services lets you choose the model version that gets used on your data. Use the optional `model-version` parameter to select the version of the model in your API requests. If this parameter isn't specified the API will default to the latest stable version. 

## Available versions

Use the table below to find which model versions are supported by each hosted endpoint.


| Feature                       | Supported Versions                                     | latest version |
|---------------------------------|--------------------------------------------------------|----------------|
| Sentiment Analysis                    | `2019-10-01`, `2020-04-01`                             | `2020-04-01`   |
| Language Detection                    | `2019-10-01`, `2020-07-01`, `2020-09-01`, `2021-01-05` | `2021-01-05`   |
| Entity Linking             | `2019-10-01`, `2020-02-01`                             | `2020-02-01`   |
| Entity Recognition (general) | `2019-10-01`, `2020-02-01`, `2020-04-01`,`2021-01-15`,`2021-06-01`  | `2021-06-01`   |
| Entity Recognition (`PII`)     | `2019-10-01`, `2020-02-01`, `2020-04-01`,`2020-07-01`, `2021-01-15`  | `2021-01-15`   |
| Health API              | `2021-05-15`                           | `2021-05-15`   |
| Key Phrase Extraction                   | `2019-10-01`, `2020-07-01`, `2021-06-01`  | `2021-06-01`   |
| Extractive summarization                   | `2021-08-01`  | `2021-08-01`   |

## Health API container

The [health API container](../health/how-to/use-containers.md) uses separate model versioning than the above API endpoints.  Please note that only one model version is available per container image.

| Endpoint                        | Container Image Tag                     | Model version |
|---------------------------------|-----------------------------------------|---------------|
| `/entities/health`              | `3.0.016230002-onprem-amd64` or latest            | `2021-05-15`  |
| `/entities/health`              | `3.0.015370001-onprem-amd64`            | `2021-03-01`  |
| `/entities/health`              | `1.1.013530001-amd64-preview`           | `2020-09-03`  |
| `/entities/health`              | `1.1.013150001-amd64-preview`           | `2020-07-24`  |
| `/domains/health`               | `1.1.012640001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012420001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012070001-amd64-preview`           | `2020-04-16`  |


## Next steps

* [Language Services overview](../overview.md)
