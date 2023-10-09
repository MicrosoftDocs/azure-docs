---
title: Using ranking to display answers - Bing Entity Search
titleSuffix: Azure AI services
description: Learn how to use ranking to display the answers that the Bing Entity Search API returns.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: conceptual
ms.date: 02/01/2019
ms.author: aahi
---

# Using ranking to display entity search results  

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

Each entity search response includes a [RankingResponse](/rest/api/cognitiveservices/bing-web-api-v7-reference#rankingresponse) answer that specifies how you must display search results returned by the Bing Entity Search API. The ranking response groups results into pole, mainline, and sidebar content. The pole result is the most important or prominent result and should be displayed first. If you do not display the remaining results in a traditional mainline and sidebar format, you must provide the mainline content higher visibility than the sidebar content. 
  
Within each group, the [Items](/rest/api/cognitiveservices/bing-web-api-v7-reference#rankinggroup-items) array identifies the order that the content must appear in. Each item provides two ways to identify the result within an answer.  
 

|Field | Description  |
|---------|---------|
|`answerType` and `resultIndex` | `answerType` identifies the answer (either Entity or Place) and `resultIndex` identifies a result within that answer (for example, an entity). The index starts at 0.|
|`value`    | `value` Contains an ID that matches the ID of either an answer or a result within the answer. Either the answer or the results contain the ID but not both. |
  
Using the `answerType` and `resultIndex` is a two-step process. First, use `answerType` to identify the answer that contains the results to display. Then use `resultIndex` to index into that answer's results to get the result to display. (The `answerType` value is the name of the field in the [SearchResponse](/rest/api/cognitiveservices/bing-web-api-v7-reference#searchresponse) object.) If you're supposed to display all the answer's results together, the ranking response item doesn't include the `resultIndex` field.

Using the ID requires you to match the ranking ID with the ID of an answer or one of its results. If an answer object includes an `id` field, display all the answer's results together. For example, if the `Entities` object includes the `id` field, display all the entities articles together. If the `Entities` object does not include the `id` field, then each entity contains an `id` field and the ranking response mixes the entities with the Places results.  
  
## Ranking response example

The following shows an example [RankingResponse](/rest/api/cognitiveservices/bing-web-api-v7-reference#rankingresponse).
  
```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "Jimi Hendrix"
  },
  "entities": { ... },
  "rankingResponse": {
    "sidebar": {
      "items": [
        {
          "answerType": "Entities",
          "resultIndex": 0,
          "value": {
            "id": "https://www.bingapis.com/api/v7/#Entities.0"
          }
        },
        {
          "answerType": "Entities",
          "resultIndex": 1,
          "value": {
            "id": "https://www.bingapis.com/api/v7/#Entities.1"
          }
        }
      ]
    }
  }
}
```

Based on this ranking response, the sidebar would display the two entity results related to Jimi Hendrix.

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](tutorial-bing-entities-search-single-page-app.md)
