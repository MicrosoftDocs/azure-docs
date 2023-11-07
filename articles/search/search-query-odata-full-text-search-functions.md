---
title: OData full-text search function reference
titleSuffix: Azure Cognitive Search
description: OData full-text search functions, search.ismatch and search.ismatchscoring, in Azure Cognitive Search queries.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.topic: reference
ms.date: 09/16/2021
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
# OData full-text search functions in Azure Cognitive Search - `search.ismatch` and `search.ismatchscoring`

Azure Cognitive Search supports full-text search in the context of [OData filter expressions](query-odata-filter-orderby-syntax.md) via the `search.ismatch` and `search.ismatchscoring` functions. These functions allow you to combine full-text search with strict Boolean filtering in ways that are not possible just by using the top-level `search` parameter of the [Search API](/rest/api/searchservice/search-documents).

> [!NOTE]
> The `search.ismatch` and `search.ismatchscoring` functions are only supported in filters in the [Search API](/rest/api/searchservice/search-documents). They are not supported in the [Suggest](/rest/api/searchservice/suggestions) or [Autocomplete](/rest/api/searchservice/autocomplete) APIs.

## Syntax

The following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) defines the grammar of the `search.ismatch` and `search.ismatchscoring` functions:

<!-- Upload this EBNF using https://bottlecaps.de/rr/ui to create a downloadable railroad diagram. -->

```
search_is_match_call ::=
    'search.ismatch'('scoring')?'(' search_is_match_parameters ')'

search_is_match_parameters ::=
    string_literal(',' string_literal(',' query_type ',' search_mode)?)?

query_type ::= "'full'" | "'simple'"

search_mode ::= "'any'" | "'all'"
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Cognitive Search](https://azuresearch.github.io/odata-syntax-diagram/#search_is_match_call)

> [!NOTE]
> See [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md) for the complete EBNF.

### search.ismatch

The `search.ismatch` function evaluates a full-text search query as a part of a filter expression. The documents that match the search query will be returned in the result set. The following overloads of this function are available:

- `search.ismatch(search)`
- `search.ismatch(search, searchFields)`
- `search.ismatch(search, searchFields, queryType, searchMode)`

The parameters are defined in the following table:

| Parameter name | Type | Description |
| --- | --- | --- |
| `search` | `Edm.String` | The search query (in either [simple](query-simple-syntax.md) or [full](query-lucene-syntax.md) Lucene query syntax). |
| `searchFields` | `Edm.String` | Comma-separated list of searchable fields to search in; defaults to all searchable fields in the index. When using [fielded search](query-lucene-syntax.md#bkmk_fields) in the `search` parameter, the field specifiers in the Lucene query override any fields specified in this parameter. |
| `queryType` | `Edm.String` | `'simple'` or `'full'`; defaults to `'simple'`. Specifies what query language was used in the `search` parameter. |
| `searchMode` | `Edm.String` | `'any'` or `'all'`, defaults to `'any'`. Indicates whether any or all of the search terms in the `search` parameter must be matched in order to count the document as a match. When using the [Lucene Boolean operators](query-lucene-syntax.md#bkmk_boolean) in the `search` parameter, they will take precedence over this parameter. |

All the above parameters are equivalent to the corresponding [search request parameters in the Search API](/rest/api/searchservice/search-documents).

The `search.ismatch` function returns a value of type `Edm.Boolean`, which allows you to compose it with other filter sub-expressions using the Boolean [logical operators](search-query-odata-logical-operators.md).

> [!NOTE]
> Azure Cognitive Search does not support using `search.ismatch` or `search.ismatchscoring` inside lambda expressions. This means it is not possible to write filters over collections of objects that can correlate full-text search matches with strict filter matches on the same object. For more details on this limitation as well as examples, see [Troubleshooting collection filters in Azure Cognitive Search](search-query-troubleshoot-collection-filters.md). For more in-depth information on why this limitation exists, see [Understanding collection filters in Azure Cognitive Search](search-query-understand-collection-filters.md).


### search.ismatchscoring

The `search.ismatchscoring` function, like the `search.ismatch` function, returns `true` for documents that match the full-text search query passed as a parameter. The difference between them is that the relevance score of documents matching the `search.ismatchscoring` query will contribute to the overall document score, while in the case of `search.ismatch`, the document score won't be changed. The following overloads of this function are available with parameters identical to those of `search.ismatch`:

- `search.ismatchscoring(search)`
- `search.ismatchscoring(search, searchFields)`
- `search.ismatchscoring(search, searchFields, queryType, searchMode)`

Both the `search.ismatch` and `search.ismatchscoring` functions can be used in the same filter expression.

## Examples

Find documents with the word "waterfront". This filter query is identical to a [search request](/rest/api/searchservice/search-documents) with `search=waterfront`.

```odata-filter-expr
    search.ismatchscoring('waterfront')
```

Find documents with the word "hostel" and rating greater or equal to 4, or documents with the word "motel" and rating equal to 5. Note, this request could not be expressed without the `search.ismatchscoring` function.

```odata-filter-expr
    search.ismatchscoring('hostel') and Rating ge 4 or search.ismatchscoring('motel') and Rating eq 5
```

Find documents without the word "luxury".

```odata-filter-expr
    not search.ismatch('luxury')
```

Find documents with the phrase "ocean view" or rating equal to 5. The `search.ismatchscoring` query will be executed only against fields `HotelName` and `Rooms/Description`.

Documents that matched only the second clause of the disjunction will be returned too -- hotels with `Rating` equal to 5. To make it clear that those documents didn't match any of the scored parts of the expression, they will be returned with score equal to zero.

```odata-filter-expr
    search.ismatchscoring('"ocean view"', 'Rooms/Description,HotelName') or Rating eq 5
```

Find documents where the terms "hotel" and "airport" are within 5 words from each other in the description of the hotel, and where smoking is not allowed in at least some of the rooms. This query uses the [full Lucene query language](query-lucene-syntax.md).

```odata-filter-expr
    search.ismatch('"hotel airport"~5', 'Description', 'full', 'any') and Rooms/any(room: not room/SmokingAllowed)
```

Find documents that have a word that starts with the letters "lux" in the Description field. This query uses [prefix search](query-simple-syntax.md#prefix-queries) in combination with `search.ismatch`.

```odata-filter-expr
    search.ismatch('lux*', 'Description')
```

## Next steps  

- [Filters in Azure Cognitive Search](search-filters.md)
- [OData expression language overview for Azure Cognitive Search](query-odata-filter-orderby-syntax.md)
- [OData expression syntax reference for Azure Cognitive Search](search-query-odata-syntax-reference.md)
- [Search Documents &#40;Azure Cognitive Search REST API&#41;](/rest/api/searchservice/Search-Documents)
