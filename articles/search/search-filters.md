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

A *filter* reduces the surface area of an Azure Search query operation through selection criteria on documents used for the query. Unfiltered search is open-ended and inclusive of all documents in the index. Filtered search creates a subset of documents for a more focused query operation. For example, a filter could restrict full text search to just products having a specific brand or color.

In this article, we explain filter design patterns and general usage requirements for text and numeric filters.

## Filter definition

Filters are OData expressions embedded in a search query as an **$filter** argument. In a complex expression with multiple parts, each part resolves to an atomic instruction in a query tree. 

Maximum limit on the filter expression is the maximum limit on the request: 16 MB for POST, 8 KB for GET.

## Filter design patterns

There are several patterns for constructing filters, presented below from simplest to complex.

+ Standalone **$filter**, without a query string, useful when the filter expression is able to fully qualify the matching documents. Without a query string, there is no lexical or linguistic analysis, no scoring, no ranking.

+ Combination of query string and **$filter**, where the filter creates the subset and the query string provides the input for full text search over the filtered subset. Using a filter with a query string is the most common code pattern.

+ Composite filter expressions, where you have multiple filters, subject to the 16 MB limit on the request. As you can imagine, each additional filter contributes to latency. This is not a common use case, but we include it here for completeness.

Alternative methodologies exist for reducing scope. If you want to peg search to specific fields, consider these options:

 + `searchFields` query parameter targets individual fields by name. If your index provides separate fields for English and Spanish descriptions, your query can specify which field to use for a full text search query. 

+ `$select` parameter is used to formulate the result set, effectively trimming the response sent to the calling appliation. It does not refine the query operation itself, but if a granular response is your goal, this parameter is an option to consider. 

For more information about either parameter, see [Search Documents > Request > Query parameters](https://docs.microsoft.com/rest/api/searchservice/search-documents#request).

## Field requirements

All fields are filterable by default but a field definition could include filterable=FALSE, which would prevent its inclusion in a filter. For more information about field definitions, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index). For more information about field types, see [Supported data types](https://docs.microsoft.com/rest/api/searchservice/supported-data-types)

For text filters based on contents within a string field, low cardinality fields are the best candidates. Fields containing a relatively small number of values (such as a list of colors, countries, or brand names), and the number of conditions is also small (color eq ‘blue’ or color eq ‘yellow’). The performance benefit comes from caching, which Azure Search does for queries most likely to be repeated.

### Re-indexing requirements

If a non-filterable field suddenly becomes filterable, rebuild the field. Changing a field definition is not a metadata change; it is a change to the physical structure of the index. In Azure Search, all allowed access paths are indexed for fast query speeds, which necessitates a rebuild of data structures when you might not expect it. 

Fortunately, you can rebuild individual fields using a merge operation, sending only the existing document key and new values, leaving the rest of each document intact. For more information, see [Indexing actions using the .NET SDK](https://docs.microsoft.com/azure/search/search-import-data-dotnet#decide-which-indexing-action-to-use) and [Indexing actions using the REST API](https://docs.microsoft.com/azure/search/search-import-data-rest-api#decide-which-indexing-action-to-use). 

## How filters are used

A filter is an instruction used to reduce the pool of documents for further query operations. The criteria provided in the filter qualifies a document for inclusion or exclusion in a downstream processing operation (namely, evaluating content for relevance, scoring, ranking, and returning results to the calling application). 

At query time, filter criteria are added to the query tree first and evaluated first. 

For text filters composed of strings, there is no lexical analysis or word-breaking, so comparisons are for exact matches only. For example, if you set such a field f to "sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'sunny day'` will. 

## When to use a filter

Filters are foundational to several search experiences, including "find near me", faceted navigation, and security filters that only show documents a user is allowed to see. If you are implementing these experiences, a filter is required. It's the filter on the query expression that provides the geo.location coordinates, the facet category selected by the user, or the security ID of the requestor.

1. Use a filter if the search experience comes with a filter requirement:
* Facets require a filter as the mechanism for classifying results on a per-facet basis.
* Geo-search is implemented as a filter.
* Security filters

2. Use a filter to prioritize/sort/group on numeric data. Numeric fields aren't searchable or subject to full text search. If you need to manipulate results based on a numeric field (rather than rely on full text search and lexical analysis to do the right thing), use a filter.

3. You need to use operands that are not available in a search string. A query string can include AND, OR, NOT, precedence -- but if you need 'between x and y', or 'greater than x', etc. you need a filter expression.

4. From a code design standpoint, keep the base query constructor simple and flexible, so you offload specialized logic to filters.

## Text filter fundamentals

Text filters -- case-sensitive. Not analyzed. Access privileges, used to limit indexes and articles by user identity, are a derivative of text filtering.

For text filters, the contents of the expression do not undergo linguistic analysis, but are added verbatim to the query tree.

Use search.in if possible.
Applies to: api-version=2016-09-01-Preview, api-version=2015-02-28-Preview
An OData function, used to pass in a comma-delimited list of strings. The strings comprise the filter criteria, which are applied to every field in scope for the query.

Use $filter if the text is a pattern (regular expression) or has a logic component.

Filter expressions are not analyzed so if the expression includes text, it's important to understand that text is added to the query tree as given. 

Case-sensitive.


There is no lexical analysis on filter criteria. Strings are added to the query tree as provided by your application.



There are two mechanisms in Azure Search for adding filters to search queries. 

| Approach | Description | Query parser requirement | Availability |
|----------|-------------|--------------------------|--------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | An OData function passing a comma-delimited list of strings for text filtering | [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) | In preview, [REST API](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) only |
| [$filter parameter](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | OData filter expression, one per request | [Simple parser](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) | Generally available, [REST](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameterspayload.filter) |

Use the **search.in** function if the filter is raw text to be matched on values in a given field, assuming it is searchable, retrievable, and not otherwise excluded from the query. This approach is designed for speed. You can expect sub-second response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to search.in, latency increases in proportion to the number of strings you provide.  

Use the **$filter** parameter for everything else. A filter expression is intended for static filtering, where you control the user interaction model and thus know whether the search page is for a given language, or whether the user made selections in a faceted navigation structure.


## Numeric filter fundamentals

Numeric filters -- fast. Numeric fields are not searchable in the context of full text search. so if you have numeric data, the assumption is that you will use them for ranges, facets, sort, group. Documents that contain numeric fields (price, size, SKU, ID) will include the numeric values if the field is marked Returnable, but its not searchable (i.e., if enter $99.99 as a search term, you won't get all items priced at $99.99. Instead, you will get items that have 9s in string fields of the document)

use $filter

you require an expression. You can create multiple filter expressions, up to XXXX, but each one can have only one set of criteria. If you want to search on multiple phrases, for example a city name, a type of hotel, ...

TBD
```
$filter=[string] (optional)
```
A structured search expression in standard OData syntax. When calling via POST, this parameter is named filter instead of $filter. 


## Next steps

First, try **Search explorer** in the portal to submit queries with **$filter** parameters. The following examples work against the built-in sample index, but can be easily adapted to work with any index published to your service.

1. Sign in to [Azure portal](https://portal.azure.com) and open the search dashboard. If it isn't pinned to the dashboard, you can search your subscription for services by type. 
2. Click **Search explorer** on the command menu at the menu at the top. 
3. Change the index to . Set the API to 
4. To scope full text search to a single field (French): `$filter=()`
5. To 

For more examples, see [OData Filter Expression Syntax > Examples](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search#bkmk_examples).

Follow up with the following articles for comprehensive guidance for specific use cases:

+ [Composite multi-field filter](search-filters-composite.md)
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

