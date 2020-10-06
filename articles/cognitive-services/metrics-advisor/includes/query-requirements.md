---
title: Query requirements
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 09/10/2020
ms.author: aahi
---

Within the query use the `@StartTime` parameter to get metric data for particular timestamp. This will be replaced with a `yyyy-MM-ddTHH:mm:ss` format string. 

> [!IMPORTANT]
> Be sure that only metric data from **a single timestamp** will be returned by the query. Metrics Advisor will run the query against every timestamp to get the corresponding metric data. For example, a query for a metric with *daily* granularity should only contain one a single timestamp, such as `2020-06-21T00:00:00Z` when running the query once. 
