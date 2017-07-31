---
title: Use Azure Text Analytics API with other technologies (Azure Cognitive Services) | Microsoft Docs
description: Use-cases and scenarios for using the Text Analytics API for standalone apps or in combination with other services to flex a broader range of technologies.
services: cognitive-services
author: LuisCabrer
manager: mwinkle

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/31/2017
ms.author: luisca
---

# How to use Text Analytics API with other technologies

This article explains three problems a customer will want to solve:

Problem #1: How to use the output Text Analytics API produces?  APis return a list of JSON documents. Document composition includes an ID, sentiment score, language type or phrases that you presumably want to do something with.

Problem #2: How to use other technology to create inputs used by the API? Assume Azure Data Lake, or Azure Cosmos DB, or (anything) that provides raw text data output in some form. This might be a minor use case, but it is also very common.

Problem #3: (hybrid scenario) How do you implement sophisticated text analysis that performs tasks not currently supported by the API as it exists today?  Examples include collection, parsing, cleansing, summarization, classification, and visualization.  

What is possible, and what is not possible, for each of these focus areas?

Other ways of framing this material: 

+ Aggregate and analyze API results using Power BI

+ Data Consolidation + Linguistic Analysis + Text Analytics

+ Ad hoc or on-demand analysis (see the [Text Analytics API in PowerApps](https://powerapps.microsoft.com/blog/custom-connectors-and-text-analytics-in-powerapps-part-one/) example for the whole story).


## Next steps

## See also