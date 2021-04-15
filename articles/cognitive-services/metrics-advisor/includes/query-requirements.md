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

When editing the query, use the `@IntervalStart` and `@IntervalEnd` parameters to specify a slice of data for a single timestamp (this timestamp means an interval corresponding to the `Granularity` you set). Metrics Advisor will replace the parameters automatically with a `yyyy-MM-ddTHH:mm:ssZ` format string when it runs the query, and in the first round query, the `@IntervalStart` will be the `@Ingest data since (UTC)` you set; in the second round query, the `@IntervalStart` will be the beginning of next interval, etc.
