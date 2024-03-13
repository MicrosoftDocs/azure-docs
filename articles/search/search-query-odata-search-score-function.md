---
title: OData search.score function reference
titleSuffix: Azure AI Search
description: Syntax and reference documentation for using the search.score function in Azure AI Search queries.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 04/18/2023
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# OData `search.score` function in Azure AI Search

When you send a query to Azure AI Search without the [**$orderby** parameter](search-query-odata-orderby.md), the results that come back will be sorted in descending order by relevance score. Even when you do use **$orderby**, the relevance score is used to break ties by default. However, sometimes it's useful to use the relevance score as an initial sort criteria, and some other criteria as the tie-breaker. The example in this article demonstrates using the `search.score` function for sorting.

> [!NOTE]
> The relevance score is computed by the relevance ranking algorithm, and the range varies depending on which algorithm you use. For more information, see [Relevance and scoring in Azure AI Search](index-similarity-and-scoring.md).

## Syntax

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` doesn't take any parameters. It can be used with the `asc` or `desc` sort-order specifier, just like any other clause in the **$orderby** parameter. It can appear anywhere in the list of sort criteria.

## Example

Sort hotels in descending order by `search.score` and `rating`, and then in ascending order by distance from the given coordinates so that between two hotels with identical ratings, the closest one is listed first:

```odata-filter-expr
    search.score() desc,rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc
```

## Next steps  

- [OData expression language overview for Azure AI Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure AI Search REST API&#41;](/rest/api/searchservice/Search-Documents)
