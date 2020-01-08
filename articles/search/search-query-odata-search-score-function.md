---
title: OData search.score function reference
titleSuffix: Azure Cognitive Search
description: Syntax and reference documentation for using the search.score function in Azure Cognitive Search queries.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
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
# OData `search.score` function in Azure Cognitive Search

When you send a query to Azure Cognitive Search without the [**$orderby** parameter](search-query-odata-orderby.md), the results that come back will be sorted in descending order by relevance score. Even when you do use **$orderby**, the relevance score will be used to break ties by default. However, sometimes it is useful to use the relevance score as an initial sort criteria, and some other criteria as the tie-breaker. The `search.score` function allows you to do this.

## Syntax

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` does not take any parameters. It can be used with the `asc` or `desc` sort-order specifier, just like any other clause in the **$orderby** parameter. It can appear anywhere in the list of sort criteria.

## Example

Sort hotels in descending order by `search.score` and `rating`, and then in ascending order by distance from the given coordinates so that between two hotels with identical ratings, the closest one is listed first:

    search.score() desc,rating desc,geo.distance(location, geography'POINT(-122.131577 47.678581)') asc

## Next steps  

- [OData expression language overview for Azure Cognitive Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Cognitive Search EST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
