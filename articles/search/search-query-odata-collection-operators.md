---
title: OData collection operator reference
titleSuffix: Azure Cognitive Search
description: When creating filter expressions in Azure Cognitive Search queries, use "any" and "all" operators in lambda expressions when the filter is on a collection or complex collection field.  

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

# OData collection operators in Azure Cognitive Search - `any` and `all`

When writing an [OData filter expression](query-odata-filter-orderby-syntax.md) to use with Azure Cognitive Search, it is often useful to filter on collection fields. You can achieve this using the `any` and `all` operators.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of an OData expression that uses `any` or `all`.

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
collection_filter_expression ::=
    field_path'/all(' lambda_expression ')'
    | field_path'/any(' lambda_expression ')'
    | field_path'/any()'

lambda_expression ::= identifier ':' boolean_expression
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#collection_filter_expression)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

There are three forms of expression that filter collections.

- The first two iterate over a collection field, applying a predicate given in the form of a lambda expression to each element of the collection.
  - An expression using `all` returns `true` if the predicate is true for every element of the collection.
  - An expression using `any` returns `true` if the predicate is true for at least one element of the collection.
- The third form of collection filter uses `any` without a lambda expression to test whether a collection field is empty. If the collection has any elements, it returns `true`. If the collection is empty, it returns `false`.

A **lambda expression** in a collection filter is like the body of a loop in a programming language. It defines a variable, called the **range variable**, that holds the current element of the collection during iteration. It also defines another boolean expression that is the filter criteria to apply to the range variable for each element of the collection.

## Examples

Match documents whose `tags` field contains exactly the string "wifi":

    tags/any(t: t eq 'wifi')

Match documents where every element of the `ratings` field falls between 3 and 5, inclusive:

    ratings/all(r: r ge 3 and r le 5)

Match documents where any of the geo coordinates in the `locations` field is within the given polygon:

    locations/any(loc: geo.intersects(loc, geography'POLYGON((-122.031577 47.578581, -122.031577 47.678581, -122.131577 47.678581, -122.031577 47.578581))'))

Match documents where the `rooms` field is empty:

    not rooms/any()

Match documents where for all rooms, the `rooms/amenities` field contains "tv" and `rooms/baseRate` is less than 100:

    rooms/all(room: room/amenities/any(a: a eq 'tv') and room/baseRate lt 100.0)

## Limitations

Not every feature of filter expressions is available inside the body of a lambda expression. The limitations differ depending on the data type of the collection field that you want to filter. The following table summarizes the limitations.

[!INCLUDE [Limitations on OData lambda expressions in Azure Cognitive Search](../../includes/search-query-odata-lambda-limitations.md)]

For more details on these limitations as well as examples, see [Troubleshooting collection filters in Azure Cognitive Search](search-query-troubleshoot-collection-filters.md). For more in-depth information on why these limitations exist, see [Understanding collection filters in Azure Cognitive Search](search-query-understand-collection-filters.md).

## Next steps  

- [Filters in Azure Cognitive Search](search-filters.md)
- [OData expression language overview for Azure Cognitive Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
