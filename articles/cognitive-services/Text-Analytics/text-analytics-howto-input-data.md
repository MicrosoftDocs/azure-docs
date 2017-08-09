---
title: 'Upload text data for analysis (Azure Cognitive Services > Text Analysis API) | Microsoft Docs'
description: Submit data for text analysis, language dections, and scoring using Text Analytics API in Cognitive Services.
services: cognitive-services
documentationcenter: ''
author: LuisCabrer
manager: jhubbard
editor: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/24/2017
ms.author: luisca

---

# How to structure and manage data inputs (Azure Cognitive Services > Text Analytics API)

TBD...

## Talking points

+ All 3 APIs are POST commands with mostly identical request structures
+ Required and optional parameters. If you know the language, specify it.
+ Order of operations (not sure this applies, but if you're using all 3, is there a recommended order in terms of performance or efficiency)
+ How to operate within limits (batch)
+ Generic recommendations: segment text into smaller units for improved sentiment analysis, enlarge text payload for improved language detection, batch documents to extract key phrases in a larger context (?)
+ Examples: Twitter, Facebook, Cosmos DB, Azure Data Lake, Azure SQL Database

## Scoring large number of records (original text)

You can send several records in a single call, but keep in mind the following limits: Max request size: 1MB (for sentiment, KP and language) Max number of documents per request: 1000 Max size of a single document: 10KB +
If you need more than 1000 records analyzed, break up your content into several calls. You can make up to 100 API calls per minute -- effectively allowing you to score 100,000 records per minute.

## Next steps

## See also