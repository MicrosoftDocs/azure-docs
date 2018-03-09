---
title: Filters in Azure Search | Microsoft Docs
description: Filter by user security identity, language, geo-location, or numeric values to reduce search results on queries in Azure Search, a hosted cloud search service on Microsoft Azure.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/19/2017
ms.author: heidist

---
# Filters in Azure Search 

A *filter* provides criteria for selecting documents used in an Azure Search query. Unfiltered search includes all documents in the index. A filter scopes a search query to a subset of documents. For example, a filter could restrict full text search to just those products having a specific brand or color, at price points above a certain threshold.

Some search experiences impose filter requirements as part of the implementation, but you can use filters anytime you want to constrain search using *value-based* criteria (scoping search to product type "books" for category "non-fiction" published by "Simon & Schuster").

If instead your goal is targeted search on specific data *structures* (scoping search to a customer-reviews field), there are alternative methods, described below.

## When to use a filter

Filters are foundational to several search experiences, including "find near me", faceted navigation, and security filters that show only  those documents a user is allowed to see. If you implement any one of these experiences, a filter is required. It's the filter attached to the search query that provides the geolocation coordinates, the facet category selected by the user, or the security ID of the requestor.

Example scenarios include the following:

1. Use a filter to slice your index based on data values in the index. Given a schema with city, housing type, and amenities, you might create a filter to explicitly select documents that satisfy your criteria (in Seattle, condos, waterfront). 

  Full text search with the same inputs often produces similar results, but a filter is more precise in that it requires an exact match of the filter term against content in your index. 

2. Use a filter if the search experience comes with a filter requirement:

 * [Faceted navigation](search-faceted-navigation.md) uses a filter to pass back the facet category selected by the user.
 * Geo-search uses a filter to pass coordinates of the current location in "find near me" apps. 
 * Security filters pass security identifiers as filter criteria, where a match in the index serves as a proxy for access rights to the document.

3. Use a filter if you want search criteria on a numeric field. 

  Numeric fields are retrievable in the document and can appear in search results, but they are not searchable (subject to full text search) individually. If you need selection criteria based on numeric data, use a filter.

### Alternative methods for reducing scope

If you want a narrowing effect in your search results, filters are not your only choice. These alternatives could be a better fit, depending on your objective:

 + `searchFields` query parameter pegs search to specific fields. For example, if your index provides separate fields for English and Spanish descriptions, you can use searchFields to target which fields to use for full text search. 

+ `$select` parameter is used to specify which fields to include in a result set, effectively trimming the response before sending it to the calling application. This parameter does not refine the query or reduce the document collection, but if a granular response is your goal, this parameter is an option to consider. 

For more information about either parameter, see [Search Documents > Request > Query parameters](https://docs.microsoft.com/rest/api/searchservice/search-documents#request).


## Filters in the query pipeline

At query time, a filter parser accepts criteria as input, converts the expression into atomic Boolean expressions, and builds a filter tree, which is then evaluated over filterable fields in an index.  

Filtering occurs before search, qualifying which documents to include in downstream processing for document retrieval and relevance scoring. When paired with a search string, the filter effectively reduces the surface area of the subsequent search operation. When used alone (for example, when the query string is empty where `search=*`), the filter criteria is the sole input. 

## Filter definition

Filters are OData expressions, articulated using a [subset of OData V4 syntax supported in Azure Search](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search). 

You can specify one filter for each **search** operation, but the filter itself can include multiple fields, multiple criteria, and if you use an **ismatch** function, multiple expressions. In a multi-part filter expression, you can specify predicates in any order. There is no appreciable gain in performance if you try to rearrange predicates in a particular sequence.

The hard limit on a filter expression is the maximum limit on the request. The entire request, inclusive of the filter, can be a maximum of 16 MB for POST, or 8 KB for GET. Soft limits correlate to the number of clauses in your filter expression. A good rule of thumb is that if you have hundreds of clauses, you are at risk of running into the limit. We recommend designing your application in such a way that it does not generate filters of unbounded size.

The following examples represent prototypical filter definitions in several APIs.

```http
# Option 1:  Use $filter for GET
GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$filter=baseRate lt 150&$select=hotelId,description&api-version=2016-09-01

# Option 2: Use filter for POST and pass it in the header
POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2016-09-01
{
    "search": "*",
    "filter": "baseRate lt 150",
    "select": "hotelId,description"
}
```

```csharp
    parameters =
        new SearchParameters()
        {
            Filter = "baseRate lt 150",
            Select = new[] { "hotelId", "description" }
        };

```

## Filter design patterns

The following examples illustrate several design patterns for filter scenarios. For more ideas, see [OData expression syntax > Examples](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search#bkmk_examples).

+ Standalone **$filter**, without a query string, useful when the filter expression is able to fully qualify documents of interest. Without a query string, there is no lexical or linguistic analysis, no scoring, and no ranking. Notice the search string is empty.

   ```
   search=*&$filter=(baseRate ge 60 and baseRate lt 300) and accommodation eq 'Hotel' and city eq 'Nogales'
   ```

+ Combination of query string and **$filter**, where the filter creates the subset, and the query string provides the term inputs for full text search over the filtered subset. Using a filter with a query string is the most common code pattern.

   ```
   search=hotels ocean$filter=(baseRate ge 60 and baseRate lt 300) and city eq 'Los Angeles'
   ```

+ Compound queries, separated by "or", each with its own filter criteria (for example, 'beagles' in 'dog' or 'siamese' in 'cat'). OR'd expressions are evaluated individually, with responses from each one combined into one response sent back to the calling application. This design pattern is achieved through the search.ismatch function. You can use the non-scoring version (search.ismatch) or the scoring version (search.ismatchscoring).

   ```
   # Match on hostels rated higher than 4 OR 5-star motels.
   $filter=search.ismatchscoring('hostel') and rating ge 4 or search.ismatchscoring('motel') and rating eq 5

   # Match on 'luxury' or 'high-end' in the description field OR on category exactly equal to 'Luxury'.
   $filter=search.ismatchscoring('luxury | high-end', 'description') or category eq 'Luxury'
   ```

Follow up with these articles for comprehensive guidance on specific use cases:

+ [Facet filters](search-filters-facets.md)
+ [Language filters](search-filters-language.md)
+ [Security trimming](search-security-trimming-for-azure-search.md) 

## Field requirements for filtering

In the REST API, filterable is *on* by default. Filterable fields increase index size; be sure to set `filterable=FALSE` for fields that you don't plan to actually use in a filter. For more information about settings for field definitions, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).

In the .NET SDK, the filterable is *off* by default. The API for setting the filterable property is [IsFilterable](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.isfilterableattribute). In the example below, its set on the BaseRate field definition.

```csharp
    [IsFilterable, IsSortable, IsFacetable]
    public double? BaseRate { get; set; }
```

### Reindexing requirements

If a field is non-filterable and you want to make it filterable, you have to add a new field, or rebuild the existing field. Changing a field definition alters the physical structure of the index. In Azure Search, all allowed access paths are indexed for fast query speed, which necessitates a rebuild of the data structures when field definitions change. 

Rebuilding individual fields can be a low impact operation, requiring only a merge operation that sends the existing document key and associated values to the index, leaving the remainder of each document intact. If you encounter a rebuild requirement, see the following links for instructions:

 + [Indexing actions using the .NET SDK](https://docs.microsoft.com/azure/search/search-import-data-dotnet#decide-which-indexing-action-to-use)
 + [Indexing actions using the REST API](https://docs.microsoft.com/azure/search/search-import-data-rest-api#decide-which-indexing-action-to-use)

## Text filter fundamentals

Text filters are valid for string fields, from which you want to pull some arbitrary collection of documents based on values within search corpus.

For text filters composed of strings, there is no lexical analysis or word-breaking, so comparisons are for exact matches only. For example, assume a field *f* contains "sunny day", `$filter=f eq 'Sunny'`does not match, but `$filter=f eq 'Sunny day'` will. 

Text strings are case-sensitive. There is no lower-casing of upper-cased words: `$filter=f eq 'Sunny day'` will not find 'sunny day'`.


| Approach | Description | 
|----------|-------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A function providing comma-delimited list of strings for a given field. The strings comprise the filter criteria, which are applied to every field in scope for the query. <br/><br/>`search.in(f, ‘a, b, c’)` is semantically equivalent to `f eq ‘a’ or f eq ‘b’ or f eq ‘c’`, except that it executes much faster when the list of values is large.<br/><br/>We recommend the **search.in** function for [security filters](search-security-trimming-for-azure-search.md) and for any filters composed of raw text to be matched on values in a given field. This approach is designed for speed. You can expect subsecond response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to the function, latency increases in proportion to the number of strings you provide. | 
| [search.ismatch()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A function that allows you to mix full-text search operations with strictly Boolean filter operations in the same filter expression. It enables multiple query-filter combinations in one request. You can also use it for a *contains* filter to filter on a partial string within a larger string. |  
| [$filter=field operator string](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A user-defined expression composed of fields, operators, and values. | 

## Numeric filter fundamentals

Numeric fields are not `searchable` in the context of full text search. Only strings are subject to full text search. For example, if you enter 99.99 as a search term, you won't get back items priced at $99.99. Instead, you would see items that have the number 99 in string fields of the document. Thus, if you have numeric data, the assumption is that you will use them for filters, including ranges, facets, groups, and so forth. 

Documents that contain numeric fields (price, size, SKU, ID) provide those values in search results if the field is marked `retrievable`. The point here is that full text search itself is not applicable to numeric field types.

## Next steps

First, try **Search explorer** in the portal to submit queries with **$filter** parameters. The [real-estate-sample index](search-get-started-portal.md) provides interesting results for the following filtered queries when you paste them into the search bar:

```
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

To work with more examples, see [OData Filter Expression Syntax > Examples](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search#bkmk_examples).

## See also

+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents)
+ [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search)
+ [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search)
+ [Supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types)
