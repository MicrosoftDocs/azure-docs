---
title: Data schema requirements
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 07/13/2020
ms.author: aahi
---

## Data schema requirements

Metrics Monitoring is a service for time series anomaly detection, diagnostics and analysis. As an AI powered service, it uses your data to train a model. The service accepts tables of aggregated data with the following columns:

* **Measure** [required]: one or more columns containing numeric values.
* **Timestamp** [optional]: zero or one column with type of `DateTime` or `String`. When this column is not set, the timestamp is set as the start time of each ingestion period.
* **Dimension** [optional]: columns can be of any data types. Be extreme cautious with columns of large cardinality (meaning that columns with huge amount of different values) to prevent dimension explosion.

> [!Note]
> For one metric, at one particular timestamp there should only have one measure corresponding to one dimension combination. Please aggregate your data ahead of onboarding or use query to specify data to be ingested.