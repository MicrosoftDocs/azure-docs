---
title: Query requirements
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 09/30/2020
ms.author: mbullwin
---

Within the query use the `@StartTime` parameter to get metric data for a single timestamp. Metrics Advisor will replace the parameter with a `yyyy-MM-ddTHH:mm:ss` format string when it runs the query.

> [!IMPORTANT]
> The query should return at most one record for each dimension combination, at each timestamp. And all records returned by the query must have the same timestamps. Metrics Advisor will run this query for each timestamp to ingest your data. See the [FAQ section on queries](../faq.md#how-do-i-write-a-valid-query-for-ingesting-my-data) for more information, and examples. 