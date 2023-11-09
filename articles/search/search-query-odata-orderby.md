---
title: OData order-by reference
titleSuffix: Azure AI Search
description: Syntax and language reference documentation for using order-by in Azure AI Search queries.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.topic: reference
ms.date: 11/02/2022
---

# OData $orderby syntax in Azure AI Search

In Azure AI Search, the **$orderby** parameter specifies a custom sort order for search results. This article describes the OData syntax of **$orderby** and provides examples.

Field path construction and constants are described in the [OData language overview in Azure AI Search](query-odata-filter-orderby-syntax.md). For more information about sorting behaviors, see [Ordering results](search-pagination-page-layout.md#ordering-results).

## Syntax

The **$orderby** parameter accepts a comma-separated list of up to 32 **order-by clauses**. The syntax of an order-by clause is described by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)):

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
order_by_clause ::= (field_path | sortable_function) ('asc' | 'desc')?

sortable_function ::= geo_distance_call | 'search.score()'
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure AI Search](https://azuresearch.github.io/odata-syntax-diagram/#order_by_clause)

> [!NOTE]
> See [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md) for the complete EBNF.

Each clause has sort criteria, optionally followed by a sort direction (`asc` for ascending or `desc` for descending). If you don't specify a direction, the default is ascending. If there are null values in the field, null values appear first if the sort is `asc` and last if the sort is `desc`.

The sort criteria can either be the path of a `sortable` field or a call to either the [`geo.distance`](search-query-odata-geo-spatial-functions.md) or the [`search.score`](search-query-odata-search-score-function.md) functions.

For string fields, the default [ASCII sort order](https://en.wikipedia.org/wiki/ASCII#Printable_characters) and default [Unicode sort order](https://en.wikipedia.org/wiki/List_of_Unicode_characters) will be used. By default, sorting is case sensitive but you can use a [normalizer](search-normalizers.md) to preprocess the text before sorting to change this behavior. You can also use an `asciifolding` normalizer to convert non-ASCII characters to their ASCII equivalent, if one exists. 

If multiple documents have the same sort criteria and the `search.score` function isn't used (for example, if you sort by a numeric `Rating` field and three documents all have a rating of 4), ties will be broken by document score in descending order. When document scores are the same (for example, when there's no full-text search query specified in the request), then the relative ordering of the tied documents is indeterminate.

You can specify multiple sort criteria. The order of expressions determines the final sort order. For example, to sort descending by score, followed by Rating, the syntax would be `$orderby=search.score() desc,Rating desc`.

The syntax for `geo.distance` in **$orderby** is the same as it is in **$filter**. When using `geo.distance` in **$orderby**, the field to which it applies must be of type `Edm.GeographyPoint` and it must also be `sortable`.

The syntax for `search.score` in **$orderby** is `search.score()`. The function `search.score` doesn't take any parameters.

## Examples

Sort hotels ascending by base rate:

```odata-filter-expr
    $orderby=BaseRate asc
```

Sort hotels descending by rating, then ascending by base rate (remember that ascending is the default):

```odata-filter-expr
    $orderby=Rating desc,BaseRate
```

Sort hotels descending by rating, then ascending by distance from the given coordinates:

```odata-filter-expr
    $orderby=Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc
```

Sort hotels in descending order by search.score and rating, and then in ascending order by distance from the given coordinates. Between two hotels with identical relevance scores and ratings, the closest one is listed first:

```odata-filter-expr
    $orderby=search.score() desc,Rating desc,geo.distance(Location, geography'POINT(-122.131577 47.678581)') asc
```

## See also 

- [How to work with search results in Azure AI Search](search-pagination-page-layout.md)
- [OData expression language overview for Azure AI Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure AI Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure AI Search REST API&#41;](/rest/api/searchservice/Search-Documents)
