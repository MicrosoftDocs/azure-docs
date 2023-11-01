---
title: Text query filters
titleSuffix: Azure AI Search
description: Apply filter criteria to include or exclude content before text query execution in Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/31/2023
ms.custom: devx-track-csharp
---

# Filters in text queries

A *filter* provides value-based criteria for including or excluding content before query execution. For example, including or excluding documents based on dates, locations, or language. Filters are specified on individual fields. A field definition must be attributed as "filterable" if you want to use it in filter expressions.

A filter is specified using [OData filter expression syntax](search-query-odata-filter.md). In contrast with full text search, a filter succeeds only if the match is exact.

## When to use a filter

Filters are foundational to several search experiences, including "find near me" geospatial search, faceted navigation, and security filters that show only  those documents a user is allowed to see. If you implement any one of these experiences, a filter is required. It's the filter attached to the search query that provides the geolocation coordinates, the facet category selected by the user, or the security ID of the requestor.

Common scenarios include:

+ Slice search results based on content in the index. Given a schema with hotel location, categories, and amenities, you might create a filter to explicitly match on criteria (in Seattle, on the water, with a view). 

+ Implement a search experience comes with a filter dependency:

  + [Faceted navigation](search-faceted-navigation.md) uses a filter to pass back the facet category selected by the user.
  + [Geospatial search](search-query-odata-geo-spatial-functions.md) uses a filter to pass coordinates of the current location in "find near me" apps and functions that match within an area or by distance.
  + [Security filters](search-security-trimming-for-azure-search.md) pass security identifiers as filter criteria, where a match in the index serves as a proxy for access rights to the document.

+ Do a "numbers search". Numeric fields are retrievable and can appear in search results, but they aren't searchable (subject to full text search) individually. If you need selection criteria based on numeric data, use a filter.

## How filters are executed

At query time, a filter parser accepts criteria as input, converts the expression into atomic Boolean expressions represented as a tree, and then evaluates the filter tree over filterable fields in an index.

Filtering occurs in tandem with search, qualifying which documents to include in downstream processing for document retrieval and relevance scoring. When paired with a search string, the filter effectively reduces the recall set of the subsequent search operation. When used alone (for example, when the query string is empty where `search=*`), the filter criteria is the sole input. 

## Defining filters

Filters are OData expressions, articulated in the [filter syntax](search-query-odata-filter.md) supported by Azure AI Search.

You can specify one filter for each **search** operation, but the filter itself can include multiple fields, multiple criteria, and if you use an **`ismatch`** function, multiple full-text search expressions. In a multi-part filter expression, you can specify predicates in any order (subject to the rules of operator precedence). There's no appreciable gain in performance if you try to rearrange predicates in a particular sequence.

One of the limits on a filter expression is the maximum size limit of the request. The entire request, inclusive of the filter, can be a maximum of 16 MB for POST, or 8 KB for GET. There's also a limit on the number of clauses in your filter expression. A good rule of thumb is that if you have hundreds of clauses, you are at risk of running into the limit. We recommend designing your application in such a way that it doesn't generate filters of unbounded size.

The following examples represent prototypical filter definitions in several APIs.

```http
POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2020-06-30
{
    "search": "*",
    "filter": "Rooms/any(room: room/BaseRate lt 150.0)",
    "select": "HotelId, HotelName, Rooms/Description, Rooms/BaseRate"
}
```

```csharp
    parameters =
        new SearchParameters()
        {
            Filter = "Rooms/any(room: room/BaseRate lt 150.0)",
            Select = new[] { "HotelId", "HotelName", "Rooms/Description" ,"Rooms/BaseRate"}
        };

    var results = searchIndexClient.Documents.Search("*", parameters);
```

## Filter patterns

The following examples illustrate several usage patterns for filter scenarios. For more ideas, see [OData expression syntax > Examples](./search-query-odata-filter.md#examples).

+ Standalone **$filter**, without a query string, useful when the filter expression is able to fully qualify documents of interest. Without a query string, there's no lexical or linguistic analysis, no scoring, and no ranking. Notice the search string is just an asterisk, which means "match all documents".

  ```json
  {
    "search": "*",
    "filter": "Rooms/any(room: room/BaseRate ge 60 and room/BaseRate lt 300) and Address/City eq 'Honolulu"
  }
  ```

+ Combination of query string and **$filter**, where the filter creates the subset, and the query string provides the term inputs for full text search over the filtered subset. The addition of terms (walking distance theaters) introduces search scores in the results, where documents that best match the terms are ranked higher. Using a filter with a query string is the most common usage pattern.

  ```json
  {
    "search": "walking distance theaters",
    "filter": "Rooms/any(room: room/BaseRate ge 60 and room/BaseRate lt 300) and Address/City eq 'Seattle'"
  }

+ Compound queries, separated by "or", each with its own filter criteria (for example, 'beagles' in 'dog' or 'siamese' in 'cat'). Expressions combined with `or` are evaluated individually, with the union of documents matching each expression sent back in the response. This usage pattern is achieved through the `search.ismatchscoring` function. You can also use the nonscoring version, `search.ismatch`.

   ```http
   # Match on hostels rated higher than 4 OR 5-star motels.
   $filter=search.ismatchscoring('hostel') and Rating ge 4 or search.ismatchscoring('motel') and Rating eq 5

   # Match on 'luxury' or 'high-end' in the description field OR on category exactly equal to 'Luxury'.
   $filter=search.ismatchscoring('luxury | high-end', 'Description') or Category eq 'Luxury'&$count=true
   ```

  It's also possible to combine full-text search via `search.ismatchscoring` with filters using `and` instead of `or`, but this is functionally equivalent to using the `search` and `$filter` parameters in a search request. For example, the following two queries produce the same result:

  ```http
  $filter=search.ismatchscoring('pool') and Rating ge 4

  search=pool&$filter=Rating ge 4
  ```

## Field requirements for filtering

In the REST API, filterable is *on* by default for simple fields. Filterable fields increase index size; be sure to set `"filterable": false` for fields that you don't plan to actually use in a filter. For more information about settings for field definitions, see [Create Index](/rest/api/searchservice/create-index).

In the .NET SDK, the filterable is *off* by default. You can make a field filterable by setting the [IsFilterable property](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable) of the corresponding [SearchField](/dotnet/api/azure.search.documents.indexes.models.searchfield) object to `true`. In the next example, the attribute is set on the `BaseRate` property of a model class that maps to the index definition.

```csharp
[IsFilterable, IsSortable, IsFacetable]
public double? BaseRate { get; set; }
```

### Making an existing field filterable

You can't modify existing fields to make them filterable. Instead, you need to add a new field, or rebuild the index. For more information about rebuilding an index or repopulating fields, see [How to rebuild an Azure AI Search index](search-howto-reindex.md).

## Text filter fundamentals

Text filters match string fields against literal strings that you provide in the filter: `$filter=Category eq 'Resort and Spa'`

Unlike full-text search, there's no lexical analysis or word-breaking for text filters, so comparisons are for exact matches only. For example, assume a field *f* contains "sunny day", `$filter=f eq 'sunny'` doesn't match, but `$filter=f eq 'sunny day'` will. 

Text strings are case-sensitive, which means text filters are case sensitive by default. For example, `$filter=f eq 'Sunny day'` won't find "sunny day". However, you can use a [normalizer](search-normalizers.md) to make it so filtering isn't case sensitive.

### Approaches for filtering on text

| Approach | Description | When to use |
|----------|-------------|-------------|
| [`search.in`](search-query-odata-search-in-function.md) | A function that matches a field against a delimited list of strings. | Recommended for [security filters](search-security-trimming-for-azure-search.md) and for any filters where many raw text values need to be matched with a string field. The **search.in** function is designed for speed and is much faster than explicitly comparing the field against each string using `eq` and `or`. | 
| [`search.ismatch`](search-query-odata-full-text-search-functions.md) | A function that allows you to mix full-text search operations with strictly Boolean filter operations in the same filter expression. | Use **search.ismatch** (or its scoring equivalent, **search.ismatchscoring**) when you want multiple search-filter combinations in one request. You can also use it for a *contains* filter to filter on a partial string within a larger string. |
| [`$filter=field operator string`](search-query-odata-comparison-operators.md) | A user-defined expression composed of fields, operators, and values. | Use this when you want to find exact matches between a string field and a string value. |

## Numeric filter fundamentals

Numeric fields aren't `searchable` in the context of full text search. Only strings are subject to full text search. For example, if you enter 99.99 as a search term, you won't get back items priced at $99.99. Instead, you would see items that have the number 99 in string fields of the document. Thus, if you have numeric data, the assumption is that you'll use them for filters, including ranges, facets, groups, and so forth. 

Documents that contain numeric fields (price, size, SKU, ID) provide those values in search results if the field is marked `retrievable`. The point here's that full text search itself isn't applicable to numeric field types.

## Next steps

First, try **Search explorer** in the portal to submit queries with **$filter** parameters. The [real-estate-sample index](search-get-started-portal.md) provides interesting results for the following filtered queries when you paste them into the search bar:

```http
# Geo-filter returning documents within 5 kilometers of Redmond, Washington state
# Use $count=true to get a number of hits returned by the query
# Use $select to trim results, showing values for named fields only
# Use search=* for an empty query string. The filter is the sole input

search=*&$count=true&$select=description,city,postCode&$filter=geo.distance(location,geography'POINT(-122.121513 47.673988)') le 5

# Numeric filters use comparison like greater than (gt), less than (lt), not equal (ne)
# Include "and" to filter on multiple fields (baths and bed)
# Full text search is on John Leclerc, matching on John or Leclerc

search=John Leclerc&$count=true&$select=source,city,postCode,baths,beds&$filter=baths gt 3 and beds gt 4

# Text filters can also use comparison operators
# Wrap text in single or double quotes and use the correct case
# Full text search is on John Leclerc, matching on John or Leclerc

search=John Leclerc&$count=true&$select=source,city,postCode,baths,beds&$filter=city gt 'Seattle'
```

To work with more examples, see [OData Filter Expression Syntax > Examples](./search-query-odata-filter.md#examples).

## See also

+ [How full text search works in Azure AI Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](/rest/api/searchservice/search-documents)
+ [Simple query syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search)
+ [Lucene query syntax](/rest/api/searchservice/lucene-query-syntax-in-azure-search)
+ [Supported data types](/rest/api/searchservice/supported-data-types)
