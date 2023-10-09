---
title: Query types 
titleSuffix: Azure Cognitive Search
description: Learn about the types of queries supported in Cognitive Search, including free text, filter, autocomplete and suggestions, geospatial search, system queries, and document lookup.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/09/2023
---

# Querying in Azure Cognitive Search

Azure Cognitive Search supports query constructs for a broad range of scenarios, from free-form text search, to highly specified query patterns, to vector search. All queries execute over a search index that stores searchable content.

This article describes the kinds of queries you can create.

<a name="types-of-queries"></a>

## Types of queries

| Query form | Searchable content | Description |
|------------|--------------------|-------------|
| Text search | Inverted indexes of tokenized terms, raw alphanumeric content | Full text queries iterate over inverted indexes that are structured for fast scans, where a match can be found in potentially any field, within any number of search documents. Text is analyzed and tokenized for full text search. Raw content, extracted verbatim from source documents, support filters and pattern matching queries like fuzzy search and wildcards. |
| Vector search | Vector indexes of generated embeddings | Vector queries iterate over vector fields in a search index. |
| Hybrid search | All of the above, in a single search index | Combines text search and vector search in a single query request. Text search works on plain text content in "searchable" and "filterable" fields. Vector search works on content in vector fields. |

## Text search

In Cognitive Search, full text search is built on the Apache Lucene query engine. Query strings in full text search undergo lexical analysis to make scans more efficient. Analysis includes lower-casing all terms, removing stop words like "the" and reducing terms to primitive root forms. The default analyzer is Standard Lucene.

When matching terms are found, the query engine reconstitutes a search document containing the match using the document key or ID to assemble field values, ranks the documents in order of relevance, and returns the top 50 (by default) in the response or a different number if you specified **`top`**.

For more information, see [Full text search in Azure Cognitive Search](search-lucene-query-architecture.md).

## Autocomplete and suggested queries

[Autocomplete or suggested results](search-add-autocomplete-suggestions.md) are alternatives to **`search`** that fire successive query requests based on partial string inputs (after each character) in a search-as-you-type experience. You can use **`autocomplete`** and **`suggestions`** parameter together or separately, as described in [this tutorial](tutorial-csharp-type-ahead-and-suggestions.md), but you can't use them with **`search`**. Both completed terms and suggested queries are derived from index contents. The engine never returns a string or suggestion that is nonexistent in your index. For more information, see [Autocomplete (REST API)](/rest/api/searchservice/autocomplete) and [Suggestions (REST API)](/rest/api/searchservice/suggestions).

## Filter search

Filters are widely used in apps that are based on Cognitive Search. On application pages, filters are often visualized as facets in link navigation structures for user-directed filtering. Filters are also used internally to expose slices of indexed content. For example, you might initialize a search page using a filter on a product category, or a language if an index contains fields in both English and French.

You might also need filters to invoke a specialized query form, as described in the following table. You can use a filter with an unspecified search (**`search=*`**) or with a query string that includes terms, phrases, operators, and patterns.

| Filter scenario | Description |
|-----------------|-------------|
| Range filters | In Azure Cognitive Search, range queries are built using the filter parameter. For more information and examples, see [Range filter example](search-query-simple-examples.md#example-5-range-filters). |
| Faceted navigation | In [faceted navigation](search-faceted-navigation.md) tree, users can select facets. When backed by filters, search results narrow on each click. Each facet is backed by a filter that excludes documents that no longer match the criteria provided by the facet. |

> [!NOTE]
> Text that's used in a filter expression is not analyzed during query processing. The text input is presumed to be a verbatim case-sensitive character pattern that either succeeds or fails on the match. Filter expressions are constructed using [OData syntax](query-odata-filter-orderby-syntax.md) and passed in a **`filter`** parameter in all *filterable* fields in your index. For more information, see [Filters in Azure Cognitive Search](search-filters.md).

## Geospatial search

Geospatial search matches on a location's latitude and longitude coordinates for "find near me" or map-based search experience. In Azure Cognitive Search, you can implement geospatial search by following these steps:

+ Define a filterable field of one of these types: [Edm.GeographyPoint, Collection(Edm.GeographyPoint, Edm.GeographyPolygon)](/rest/api/searchservice/supported-data-types).
+ Verify the incoming documents include the appropriate coordinates.
+ After indexing is complete, build a query that uses a filter and a [geo-spatial function](search-query-odata-geo-spatial-functions.md). 

Geospatial search uses kilometers for distance. Coordinates are specified in this format: `(longitude, latitude`).

Here's an example of a filter for geospatial search. This filter finds other `Location` fields in the search index that have coordinates within a 300-kilometer radius of the geography point (in this example, Washington D.C.). It returns address information in the result, and includes an optional `facets` clause for self-navigation based on location.

```http
POST https://{{searchServiceName}}.search.windows.net/indexes/hotels-vector-quickstart/docs/search?api-version=2023-07-01-Preview
{
    "count": true,
    "search": "*",
    "filter": "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300",
    "facets": [ "Address/StateProvince"],
    "select": "HotelId, HotelName, Address/StreetAddress, Address/City, Address/StateProvince",
    "top": 7
}
```

For more information and examples, see [Geospatial search example](search-query-simple-examples.md#example-6-geospatial-search).

## Document look-up

In contrast with the previously described query forms, this one retrieves a single [search document by ID](/rest/api/searchservice/lookup-document), with no corresponding index search or scan. Only the one document is requested and returned. When a user selects an item in search results, retrieving the document and populating a details page with fields is a typical response, and a document look-up is the operation that supports it.

## Advanced search: fuzzy, wildcard, proximity, regex

An advanced query form depends on the Full Lucene parser and operators that trigger a specific query behavior.

| Query type | Usage | Examples and more information |
|------------|--------|------------------------------|
| [Fielded search](query-lucene-syntax.md#bkmk_fields) | **`search`**  parameter, **`queryType=full`**  | Build a composite query expression targeting a single field. <br/>[Fielded search example](search-query-lucene-examples.md#example-1-fielded-search) |
| [fuzzy search](query-lucene-syntax.md#bkmk_fuzzy) | **`search`** parameter, **`queryType=full`** | Matches on terms having a similar construction or spelling. <br/>[Fuzzy search example](search-query-lucene-examples.md#example-2-fuzzy-search) |
| [proximity search](query-lucene-syntax.md#bkmk_proximity) | **`search`** parameter, **`queryType=full`** | Finds terms that are near each other in a document. <br/>[Proximity search example](search-query-lucene-examples.md#example-3-proximity-search) |
| [term boosting](query-lucene-syntax.md#bkmk_termboost) | **`search`** parameter, **`queryType=full`** | Ranks a document higher if it contains the boosted term, relative to others that don't. <br/>[Term boosting example](search-query-lucene-examples.md#example-4-term-boosting) |
| [regular expression search](query-lucene-syntax.md#bkmk_regex) | **`search`** parameter, **`queryType=full`** | Matches based on the contents of a regular expression. <br/>[Regular expression example](search-query-lucene-examples.md#example-5-regex) |
|  [wildcard or prefix search](query-lucene-syntax.md#bkmk_wildcard) | **`search`** parameter with ***`~`** or **`?`**, **`queryType=full`**| Matches based on a prefix and tilde (`~`) or single character (`?`). <br/>[Wildcard search example](search-query-lucene-examples.md#example-6-wildcard-search) |

## Next steps

For a closer look at query implementation, review the examples for each syntax. If you're new to full text search, a closer look at what the query engine does might be an equally good choice.

+ [Simple query examples](search-query-simple-examples.md)
+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)git
