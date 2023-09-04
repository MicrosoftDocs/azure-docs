---
title: Sentiment analysis - LUIS
titleSuffix: Azure AI services
description: If Sentiment analysis is configured, the LUIS json response includes sentiment analysis.
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 10/28/2021
---

# Sentiment analysis

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

If Sentiment analysis is configured, the LUIS json response includes sentiment analysis. Learn more about sentiment analysis in the [Language service](../language-service/index.yml) documentation.

LUIS uses V2 of the API. 

Sentiment Analysis is configured when publishing your application. See [how to publish an app](./how-to/publish.md) for more information.

## Resolution for sentiment

Sentiment data is a score between 1 and 0 indicating the positive (closer to 1) or negative (closer to 0) sentiment of the data.

#### [English language](#tab/english)

When culture is `en-us`, the response is:

```JSON
"sentimentAnalysis": {
  "label": "positive",
  "score": 0.9163064
}
```

#### [Other languages](#tab/other-languages)

For all other cultures, the response is:

```JSON
"sentimentAnalysis": {
  "score": 0.9163064
}
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).
