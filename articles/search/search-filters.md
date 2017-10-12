---
title: Filters in Azure Search | Microsoft Docs
description: Filter criteria by user security identity, language, geo-location, or numeric values to reduce search results on queries in Azure Search, a hosted cloud search service on Microsoft Azure.
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
ms.date: 10/04/2017
ms.author: heidist

---
# Filters in Azure Search 


A *filter* provides criteria for selecting documents used in an Azure Search query. Unfiltered search is open-ended and inclusive of all documents in the index. Filtered search creates a slice or subset of documents for a more focused query operation. For example, a filter could restrict full text search to just those products having a specific brand or color, at price points above a certain threshold.

Some search experiences impose filter requirements as part of the implementation, but you can use filters anytime you want to scope a query based on *data-related criteria* pulled from your search corpus.

If your goal is instead to target search on specific *data structures* (for example, scope search to a comments field), there are alternative methods, described below.

## When to use a filter

A filter expression is intended for static filtering in your search application, where you control the user interaction model. For example, when you know whether the search page is for a specific city or product category, or whether the user has made a selection in a faceted navigation structure.

Filters are foundational to several search experiences, including "find near me", faceted navigation, and security filters that only show documents a user is allowed to see. If you implement any one of these experiences, a filter is required. It's the filter attached to the query structure that provides the geo.location coordinates, the facet category selected by the user, or the security ID of the requestor.

The following conditions point to a filter solution:

1. Use a filter if the search experience comes with a filter requirement:

 * [Faceted navigation](search-faceted-navigation.md) uses a filter to pass back the facet category selected by the user.
 * Geo-search uses a filter to pass coordinates of the current location in "find near me" apps. 
 * Security filters pass security identifiers as filter criteria, where a match in the index serves as a proxy for access rights to the document.

2. Use a filter to slice your index based on data values in the index. Given a schema with city, housing type, and amenities, you might create a filter to explicitly select documents that satisfy your criteria (in Seattle, condos, waterfront). You can make criteria so expressive that it returns a single match.

  A full text search with the same inputs is likely to produce similar results, but a filter offers precision and can be defined by the developer. In a custom application, you might want to build filter pages to create a context for the search experience you are offering.

3. Use a filter to prioritize, sort, group, or order by numeric data. 

  Numeric fields are retrievable in the document and can appear in search results, but they are not searchable (subject to full text search) individually. If you need selection criteria based on numeric data, use a filter.

### Alternative methods for reducing scope

If you want a narrowing effect in your search results, filters are not your only choice. These alternatives could be a better fit, depending on your objective:

 + `searchFields` query parameter pegs search to specific fields. If your index provides separate fields for English and Spanish descriptions, you can use searchFields to target which fields to use for full text search. 

+ `$select` parameter is used to reformulate a result set, effectively trimming the response before sending it to the calling application. This parameter does not refine the query or reduce the document collection, but if a granular response is your goal, this parameter is an option to consider. 

For more information about either parameter, see [Search Documents > Request > Query parameters](https://docs.microsoft.com/rest/api/searchservice/search-documents#request).


## Filters in the query pipeline

Criteria provided in a filter qualifies a document for inclusion or exclusion in a downstream processing operation (namely, evaluating content for relevance, scoring, ranking, and returning results to the calling application). 

At query time, filter criteria are added to a filter tree that is evaluated before the query. In a complex expression with multiple parts, each part resolves to an atomic instruction in a filter tree. 

You can specify predicates in any order. There is no appreciable difference in performance if you try to arrange predicates in a particular seqquence.

> [!Note]
> A filter is a query type, one of two, where the other query type is search. A search query searches for one or more terms in all searchable fields in your index. A filter query evaluates a boolean expression over filterable fields in an index. Filters, which can be complex, are broken down into atomic instructions, as a boolean expression, and added to a filter tree.

## Filter definition

Filters are OData expressions, articulated using a [subset of OData syntax supported in Azure Search](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search).

You can specify one filter for each **search** operation, but the filter itself can include multiple fields, multiple criteria, and if you use an **ismatch** function, multiple expressions. The maximum limit on the filter expression is the maximum limit on the request: 16 MB for POST, 8 KB for GET.

The following examples represent prototypical filters in several APIs.

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

+ Standalone **$filter**, without a query string, useful when the filter expression is able to fully qualify documents of interest. Without a query string, there is no lexical or linguistic analysis, no scoring, and no ranking. The search string is empty.

   ```
   search=*&$filter=(baseRate ge 60 and baseRate lt 300) and accommodation eq 'Hotel' and city eq 'Nogales'
   ```

+ Combination of query string and **$filter**, where the filter creates the subset, and the query string provides the term inputs for full text search over the filtered subset. Using a filter with a query string is the most common code pattern.

   ```
   search=hotels ocean$filter=(baseRate ge 60 and baseRate lt 300) or city eq 'Los Angeles'
   ```

+ "Contains" filters. Filters come with precision requirements for fully-qualified, case-sensitive terms. If you want to filter on a term that appears in a description, you can use the search.ismatch function to relax some of these restrictions.

  ```
   # search.ismatch selects documents where 'ocean' appears in any field, for a search on white sand.
   search=white sand&$filter=search.ismatch('ocean')

   # Contrast with a standard filter, which requires a field (such as tags) and exact articulation.
   # If the tag is Ocean or ocean-front instead of 'ocean', the filter is ignored.
   search=white sand&$filter=tags/any(t: t eq 'ocean') 
  ```

+ Multiple query-filter combinations, or defining search words to query on in separate fields ('beagles' in 'dog' or 'siamese' in 'cat'). OR'd expressions are evaluated individually, with responses from each one combined into one result sent back to the calling application. This design pattern is achieved through the search.ismatch function. You can use the non-scored version (search.ismatch) or the scored version (search.ismatchscoring).

   ```
   # Match on hostels rated higher than 4 OR 5-star motels.
   $filter=search.ismatchscoring('hostel') and rating ge 4 or search.ismatchscoring('motel') and rating eq 5

   # Match on 'luxury' or 'high-end' in the description field OR on category exactly equal to 'Luxury'.
   $filter=search.ismatchscoring('luxury | high-end', 'description') or category eq 'Luxury'
   ```

Follow up with these articles for comprehensive guidance on specific use cases:

+ [Facet filters](search-filters-facets.md)
+ [Language filters](search-filters-language.md)
+ [Security filters (generic)](search-filters-security-generic.md) 

## Field requirements for filtering

All fields are filterable by default but a field definition could include filterable=FALSE, which would prevent its inclusion in a filter. For more information about field definitions, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).

### Reindexing requirements

If a non-filterable field suddenly becomes filterable, you must rebuild the field. Changing a field definition alters the physical structure of the index. In Azure Search, all allowed access paths are indexed for fast query speed, which necessitates a rebuild of the data structures when field definitions change. 

Rebuilding individual fields can be fast, requiring only a merge operation that sends the existing document key and associated values to the index, leaving the remainder of each document intact. If a rebuild is required, see the following links for instructions:

 + [Indexing actions using the .NET SDK](https://docs.microsoft.com/azure/search/search-import-data-dotnet#decide-which-indexing-action-to-use)
 + [Indexing actions using the REST API](https://docs.microsoft.com/azure/search/search-import-data-rest-api#decide-which-indexing-action-to-use)

## Text filter fundamentals

Text filters are valid for string fields, from which you want to pull some arbitrary collection of documents based on values within search corpus.

For text filters based on contents within a string field, low cardinality fields are the best candidates. Choose fields containing a relatively small number of values (such as a list of colors, countries, or brand names), and the number of conditions is also small (color eq ‘blue’ or color eq ‘yellow’). The performance benefit comes from caching, which Azure Search does for queries most likely to be repeated.

For text filters composed of strings, there is no lexical analysis or word-breaking, so comparisons are for exact matches only. For example, assume a field *f* contains "sunny day", `$filter=f eq 'Sunny'`does not match, but `$filter=f eq 'Sunny day'` will. 

Text strings are case-sensitive. There is no lower-casing of upper-cased words: `$filter=f eq 'Sunny day'` will not find 'sunny day'`.

There are several mechanisms in Azure Search for creating text filters. 

| Approach | Description | Parser | 
|----------|-------------|--------------------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A function providing comma-delimited list of strings for a given field. The strings comprise the filter criteria, which are applied to every field in scope for the query.<br/><br/>We recommend the **search.in** function if the filter is raw text to be matched on values in a given field, assuming it is searchable, retrievable, and not otherwise excluded from the query. This approach is designed for speed. You can expect subsecond response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to the function, latency increases in proportion to the number of strings you provide. | [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) | 
| [search.ismatch()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A function providing a multi-instance, query-plus-filter structure for OR'd queries. It allows you to send multiple query-filter pairs in one request. You can also use it for a *contains* filter to filter on a partial string within a larger string. | [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) |  
| [$filter=field operator string](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A user-defined expression composed of fields, operators, and values. | [Simple](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) or [Full](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search)|  

## Numeric filter fundamentals

Numeric fields are not `searchable` in the context of full text search. Only strings are subject to full text search. For example, if you enter 99.99 as a search term, you won't get back items priced at $99.99. Instead, you would see items that have the number 9 in string fields of the document. Thus, if you have numeric data, the assumption is that you will use them for filters, including ranges, facets, groups, and so forth. 

Documents that contain numeric fields (price, size, SKU, ID) provide those values in search results if the field is marked `retreivable`. The point here is that full text search itself is not applicable to numeric data types.

## Next steps

First, try **Search explorer** in the portal to submit queries with **$filter** parameters. The [real-estate-sample index](search-get-started-portal.md) provides interesting results for the following filtered queries when you paste them into the search bar:

    ```
    # Geo-filter returning documents within 5 kilometers of Redmond, Washington state
    # Use count to get a number of hits returned by the query
    # Use select to trim results, showing values for named fields only
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
