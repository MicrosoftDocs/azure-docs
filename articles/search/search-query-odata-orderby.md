---
title: OData order-by reference - Azure Search
description: OData language reference for order-by syntax in Azure Search queries.
ms.date: 06/13/2019
services: search
ms.service: search
ms.topic: conceptual
author: "Brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
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
# OData $orderby syntax in Azure Search

 You can use the [OData **$orderby** parameter](query-odata-filter-orderby-syntax.md) to apply a custom sort order for search results in Azure Search. This article describes the syntax of **$orderby** in detail. For more general information about how to use **$orderby** when presenting search results, see [How to work with search results in Azure Search](search-pagination-page-layout.md).

## Syntax

The **$orderby** parameter accepts a comma-separated list of up to 32 **order-by clauses**. The syntax of an order-by clause is described by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)):

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
order_by_clause ::= (field_path | sortable_function) ('asc' | 'desc')?

sortable_function ::= geo_distance_call | 'search.score()'
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Search](https://azuresearch.github.io/odata-syntax-diagram/#order_by_clause)

> [!NOTE]
> See [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md) for the complete EBNF.

Each clause has sort criteria, optionally followed by a sort direction (`asc` for ascending or `desc` for descending). If you don't specify a direction, the default is ascending. The sort criteria can either be the path of a `sortable` field or a call to either the [`geo.distance`](search-query-odata-geo-spatial-functions.md) or the [`search.score`](search-query-odata-search-score-function.md) functions.

If multiple documents have the same sort criteria and the `search.score` function isn't used (for example, if you sort by a numeric `Rating` field and three documents all have a rating of 4), ties will be broken by document score in descending order. When document scores are the same (for example, when there's no full-text search query specified in the request), then the relative ordering of the tied documents is indeterminate.

You can specify multiple sort criteria. The order of expressions determines the final sort order. For example, to sort descending by score, followed by Rating, the syntax would be `$orderby=search.score() desc,Rating desc`.

The syntax for `geo.distance` in **$orderby** is the same as it is in **$filter**. When using `geo.distance` in **$orderby**, the field to which it applies must be of type `Edm.GeographyPoint` and it must also be `sortable`.

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` doesn't take any parameters.

## Examples

Sort hotels ascending by base rate:

    $orderby=BaseRate asc

Sort hotels descending by rating, then ascending by base rate (remember that ascending is the default):

    $orderby=Rating desc,BaseRate

Sort hotels descending by rating, then ascending by distance from the given coordinates:

    $orderby=Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc

Sort hotels in descending order by search.score and rating, and then in ascending order by distance from the given coordinates. Between two hotels with identical relevance scores and ratings, the closest one is listed first:

    $orderby=search.score() desc,Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc

## Next steps  

- [How to work with search results in Azure Search](search-pagination-page-layout.md)
- [OData expression language overview for Azure Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
