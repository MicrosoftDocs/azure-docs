---
title: Using ranking to display answers - Bing Entity Search
titlesuffix: Azure Cognitive Services
description: Shows how to use ranking to display the answers that the Bing Entity Search API returns.
services: cognitive-services
author: v-jerkin
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: conceptual
ms.date: 12/12/2017
ms.author: v-jerkin
---

# Using ranking to display results  

Each entity search response includes a [RankingResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference#rankingresponse) answer, similar to the one in a Bing Web Search response, that specifies how you must display the search results. The ranking response groups results into pole, mainline, and sidebar content. The pole result is the most important or prominent result and should be displayed first. If you do not display the remaining results in a traditional mainline and sidebar format, you must provide the mainline content higher visibility than the sidebar content. 
  
Within each group, the [Items](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference#rankinggroup-items) array identifies the order that the content must appear in. Each item provides two ways to identify the result within an answer.  
  
-   `answerType` and `resultIndex` — The `answerType` field identifies the answer (either Entity or Place) and `resultIndex` identifies a result within the answer (for example, an entity). The index is zero based.  
  
-   `value` — The `value` field contains an ID that matches the ID of either an answer or a result within the answer. Either the answer or the results contain the ID but not both.  
  
Using the ID requires you to match the ranking ID with the ID of an answer or one of its results. If an answer object includes an `id` field, display all the answer's results together. For example, if the `Entities` object includes the `id` field, display all the entities articles together. If the `Entities` object does not include the `id` field, then each entity contains an `id` field and the ranking response mixes the entities with the Places results.  
  
Using the `answerType` and `resultIndex` is a two-step process. First, you use `answerType` to identify the answer that contains the results to display. Then you use `resultIndex` to index into that answer's results to get the result to display. (The `answerType` value is the name of the field in the [SearchResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference#searchresponse) object.) If you're supposed to display all the answer's results together, the ranking response item doesn't include the `resultIndex` field.

## Ranking response example

The following shows an example [RankingResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference#rankingresponse).
  
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
> [Bing Entity Search tutorial](tutorial-bing-entities-search-single-page-app.md)
