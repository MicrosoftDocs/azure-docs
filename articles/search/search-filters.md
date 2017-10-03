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
ms.date: 10/03/2017
ms.author: heidist

---
# Filters in Azure Search 

A *filter* reduces the surface area of an Azure Search query operation through selection criteria applied to content in your index. Unfiltered search is open-ended and inclusive of all documents in the index. Filtered search creates a subset of documents for a more focused query operation. For example, a filter could restrict full text search to just products having a specific brand or color.

In this article explains filtering in Azure Search, when and how to use a filter, in both text and numeric contexts.

## Filter definition and design patterns

Filters are OData expressions articulated as an **$filter** argument. You can specify one filter for each  **search** operation, but the filter itself can include multiple fields and multiple criteria.

```
$filter=[string] (optional)
```

> [!Note]
> When calling via POST, this parameter is named filter instead of $filter. 

The following examples illustrate simple and complex filters. For more detail, see [OData expression syntax > Examples](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search#bkmk_examples).

+ Standalone **$filter**, without a query string, useful when the filter expression is able to fully qualify documents of interest. Without a query string, there is no lexical or linguistic analysis, no scoring, and no ranking.

+ Combination of query string and **$filter**, where the filter creates the subset and the query string provides the input for full text search over the filtered subset. Using a filter with a query string is the most common code pattern.

The maximum limit on the filter expression is the maximum limit on the request: 16 MB for POST, 8 KB for GET.

### Alternative methods for reducing scope

If you want a narrowing effect in your search results, filters are not your only choice. These alternatives could be a better fit depending on your objectives:

 + `searchFields` query parameter pegs search to specific fields. If your index provides separate fields for English and Spanish descriptions, you can use searchFields to target specific fields to use for full text search. 

+ `$select` parameter is used to reformulate a result set, effectively trimming the response before sending it to the calling application. This parameter does not refine the query or reduce the document collection, but if a granular response is your goal, this parameter is an option to consider. 

For more information about either parameter, see [Search Documents > Request > Query parameters](https://docs.microsoft.com/rest/api/searchservice/search-documents#request).

## Field requirements

All fields are filterable by default but a field definition could include filterable=FALSE, which would prevent its inclusion in a filter. For more information about field definitions, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).

For text filters based on contents within a string field, low cardinality fields are the best candidates. Fields containing a relatively small number of values (such as a list of colors, countries, or brand names), and the number of conditions is also small (color eq ‘blue’ or color eq ‘yellow’). The performance benefit comes from caching, which Azure Search does for queries most likely to be repeated.

### Re-indexing requirements

If a non-filterable field suddenly becomes filterable, you must rebuild the field. Changing a field definition alters the physical structure of the index. In Azure Search, all allowed access paths are indexed for fast query speeds, which necessitates a rebuild of the data structures when field definitions change. 

Rebuilding individual fields can be fast, requiring only a merge operation that sends the existing document key and associated values to the index, leaving the remainder of each document intact. If a rebuild is required, see the following links for instructions:

+ [Indexing actions using the .NET SDK](https://docs.microsoft.com/azure/search/search-import-data-dotnet#decide-which-indexing-action-to-use)
+[Indexing actions using the REST API](https://docs.microsoft.com/azure/search/search-import-data-rest-api#decide-which-indexing-action-to-use). 

## When to use a filter

Filters are foundational to several search experiences, including "find near me", faceted navigation, and security filters that only show documents a user is allowed to see. If you implement any one of these experiences, a filter is required. It's the filter on the query expression that provides the geo.location coordinates, the facet category selected by the user, or the security ID of the requestor.

1. Use a filter if the search experience comes with a filter requirement:

 * Facets require a filter as the mechanism for classifying results on a per-facet basis.
 * Geo-search is implemented as a filter.
 * Security identifiers can be provided as filter criteria, with a match as proxy for access rights to the document.

2. Use a filter to prioritize, sort, group, or order by numeric data. Numeric fields are retrievable in the document and can appear in search results, but they are not searchable (subject to full text search) individually. If you need selection criteria based on numeric data, use a filter.

3. Use a filter to slice your index based on data values in the index. Given a schema with city, housing type, and amenities, you can create a filter to explicitly select documents that satisfy your criteria (Seattle, condos, waterfront). A full text search with the same inputs is likely to produce similar results, but a filter offers precision and can be defined by the developer. In a custom application, you might want to build filters to create a context for the search experience you are offering.

  A filter expression is intended for static filtering, where you control the user interaction model and thus know whether the search page is for a given language, or whether the user made selections in a faceted navigation structure.

## How filters are used

A filter is an instruction used to reduce the pool of documents for further query operations. The criteria provided in the filter qualifies a document for inclusion or exclusion in a downstream processing operation (namely, evaluating content for relevance, scoring, ranking, and returning results to the calling application). 

At query time, filter criteria are added to the query tree first and evaluated first. In a complex expression with multiple parts, each part resolves to an atomic instruction in a query tree. 

For text filters composed of strings, there is no lexical analysis or word-breaking, so comparisons are for exact matches only. For example, assume a field *f* contains "sunny day", `$filter=f eq 'sunny'`does not match, but `$filter=f eq 'sunny day'` will. 

## Text filter fundamentals

Text filters are valid for string fields, from which you want to pull some arbitrary collection of documents based on values within the field.

Filter expressions do not undergo lexical so if the expression includes text, it's important to understand that text is added verbatim to the query tree, as recieved by Azure Search. Similarly, in a filter, text strings are case-sensitive. There is no lower-casing of upper-cased words.

There are two mechanisms in Azure Search for creating text filters. 

| Approach | Description | Query parser requirement | 
|----------|-------------|--------------------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | A comma-delimited list of strings for a given field. The strings comprise the filter criteria, which are applied to every field in scope for the query.| [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) | 
| [$filter parameter](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | OData filter expression, one per request | [Simple parser](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) | 

We recommend the **search.in** function if the filter is raw text to be matched on values in a given field, assuming it is searchable, retrievable, and not otherwise excluded from the query. This approach is designed for speed. You can expect sub-second response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to the function, latency increases in proportion to the number of strings you provide.  


## Numeric filter fundamentals

Numeric fields are not `searchable` in the context of full text search. Only strings are subject to full text search. For example, if you enter 99.99 as a search term, you won't get back items priced at $99.99. Instead, you would see items that have the number 9 in string fields of the document. Thus, if you have numeric data, the assumption is that you will use them for filters, including ranges, facets, groups, and so forth. 

Documents that contain numeric fields (price, size, SKU, ID) provide those values in search results if the field is marked `retreivable`. It's just that full text search itself is not applicable to numeric data types.

## Next steps

First, try **Search explorer** in the portal to submit queries with **$filter** parameters. The [real-estate-sample index](search-get-started-portal.md) provides interesting results for the following filtered queries:

+ ``
+ ``
+ ``

To work with more examples, see [OData Filter Expression Syntax > Examples](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search#bkmk_examples).

Follow up with these articles for comprehensive guidance on specific use cases:

+ [Date filters](search-filters-dates.md)
+ [Facet filters](search-filters-facets.md)
+ ["Find near me" geo-filters](search-filters-geo.md)
+ [Language filters](search-filters-language.md)
+ [Range filters](search-filters-range.md)
+ [Security filters using Active Directory](search-filters-security-aad.md)
+ [Security filters (generic)](search-filters-security-generic.md) 

## See also

+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Search Documents REST API]()
+ [Simple query syntax]()
+ [Lucene query syntax]()
+ [Supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types)
