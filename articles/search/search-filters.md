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

In Azure Search, a *filter* reduces the collection of documents based on the criteria you provide. Unfiltered search is open-ended and inclusive of all documents in the index. Filters are a mechanism for establishing a subset of documents. For example, restricting full text search to language-specific descriptions or titles.

In this article, we explain the filter methodologies available in Azure Search, when to use filters, and general usage requirements.

## How filters are used in Azure Search.

A filter is an instruction used to reduce the pool of documents for further query operations. The criteria provided in the filter either qualifies a document for inclusion or exclusion for more downstream processing (namely, evaluating for relevance and assigning a score). 

At query time, filter criteria are added to the query tree first and evaluated first. Subsequent query operations are performed only on the filtered subset of documents.

Filters provide additional input into the query structure used in a search operation. Filter composition can be as simple as one or more strings. Alternatively, it could be an expression articulated in OData syntax, where the expression resolves to additional items in a query tree. 

Contents of a filter expression do not undergo linguistic analysis, but are added verbatim to the query tree.

## Use cases for filters

Filters are foundational to several search experiences, including "find near me", faceted navigation, and security filters that only show documents a user is allowed to see. In all cases, the filter adds elements to the query tree that improve relevance by categorically selecting documents based on criteria, as opposed to relying on algorithms as the sole determinant of which documents constitute a possible match.


Numeric filters -- fast. Numeric fields are not searchable in the context of full text search. so if you have numeric data, the assumption is that you will use them for ranges, facets, sort, group. Documents that contain numeric fields (price, size, SKU, ID) will include the numeric values if the field is marked Returnable, but its not searchable (i.e., if enter $99.99 as a search term, you won't get all items priced at $99.99. Instead, you will get items that have 9s in string fields of the doucment)

Text filters -- case-sensitive

Field filters -- select specific feilds (such as Spanish strings if the browser local is Spanish).

MSDN forum post: "access privileges to limit indexes and articles per client"


### Use cases

The following articles explore each use case in detail.

+ [Composite multi-field filter](search-filters-composite.md)
+ [Date filters](search-filters-dates.md)
+ [Facet filters](search-filters-facets.md)
+ ["Find near me" geo-filters](search-filters-geo.md)
+ [Language filters](search-filters-language.md)
+ [Range filters](search-filters-range.md)
+ [Seurity filters using Active Directory](search-filters-security-aad.md)
+ [Security filters (generic)](search-filters-security-generic.md)

## Filter design patterns

Combination of query string and $filter, used to search over a subset of documents, where $filter defines the subset.

Standalone $filter without a query string, useful when the filter expression is able to fully qualify the matching documents. Without a query string, there is no lexical or linguistic analysis. Results are unscored (not evaluated for relevance), and  not ranked.

Stacked or multiple $filter expressions on the query, subject to the 16 MB limit on the request. As you can imagine, each additional $filter contributes to latency. This is not a common use case, but we include it here because its possible.

## Rules

Filter expressions are not analyzed so if the expression includes text, it's important to understand that text is added to the query tree as given. 

Case-sensitive.

$filter -- Do not forget the $. 

OData

Do not forget to reindex (rebuild the field -- updateAndMerge documents). Why rebuild?

The limitation is not due to admin/non-admin roles, but rather a result of how Azure Search indexes content. Azure Search is fast because all allowed access paths are indexed, so changing a field from non-filterable to filterable is not just a matter of adjusting configuration, it would still require that we re-build the index under the covers (since we can't support the filtering functionality without an actual index backing it and still keep it fast). 

For 4 million documents you might be able to update a new field relatively quickly (not a few minutes, but not a day either). You wouldn't need to update all content, just the new field, using "merge" operations in indexing batches to only send the document key and the new value, leaving the rest of each document intact. ("merge" is documented here for .NET SDK, here for the REST API).

https://social.msdn.microsoft.com/Forums/azure/en-US/cfb2e9d9-a33f-4127-955b-f9e893d22675/how-to-make-a-field-filterable-we-have-uploaded-all-our-data-already?forum=azuresearch 

## Filter definitions

A filter has criteria, and a document is either included or excluded based on evaluation.

1. Your use-case imposes a filter requirement:
* Facets require a filter as the mechanism for classifying results on a per-facet basis.
* Geo-search is implemented as a filter.
* Security filters

2. If you want to prioritize/sort/group on numeric data. Numeric fields aren't searchable or subject to full text search. If you need to manipulate results based on a numeric field (rather than rely on full text search and lexical analysis to do the right thing), use a filter.

3. You need to use operands that are not available in a search string. A query string can include AND, OR, NOT, precedence -- but if you need 'between x and y', or 'greater than x', etc. you need a filter expression.

4. From a code design standpoint, you want the query contructor to be simple and flexible, so you offload specialized logic to filters.

## Filter methodologies

There are two mechanisms in Azure Search for adding filters to search queries. 

| Approach | Description | Query parser requirement | Availability |
|----------|-------------|--------------------------|--------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | An OData function passing a comma-delimted list of strings for text filtering | [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) | In preview, [REST API](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) only |
| [$filter parameter](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | OData filter expression, one per request | [Simple parser](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) | Generally available, [REST](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameterspayload.filter) |

## Compare approaches

Use the **search.in** function if the filter is raw text to be matched on values in a given field, assuming it is searchable, retrievable, and not otherwise excluded from the query. This approach is designed for speaed. You can expect sub-second response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to search.in, latency increases in proportion to the number of strings you provide.  

*why wouldn't I use search.in for a language? what's the diff between search.in="fr-fr" and $filter="fr-fr"*

Use the **$filter** parameter for everything else. A filter expression is intended for static filtering, where you control the user interaction model and thus know whether the search page is for a given language, or whether the user made selections in a faceted navigation structure.

*I don't know where the above statements come from, or if it even makes sense*

+ faceted navigation
+ complex expressions with operands
+ range filters
+ geographic filters
+ language filters
+ Low cardinality fields with small number of conditions

 A **$filter** typically offers better performance if the filter condition is on a low cardinality field containing a relatively small number of vlaues (such as a list of colors, countries, or brand names), and the number of conditions is also small (color eq ‘blue’ or color eq ‘yellow’). The performance benefit comes from caching, which Azure Search does for queries most likely to be repeated.

## How to build text filters

Use search.in if possible.

Applies to: api-version=2016-09-01-Preview, api-version=2015-02-28-Preview

An OData function, used to pass in a comma-delimited list of strings. The strings comprise the filter criteria, which are applied to every field in scope for the query.

There is no lexical analysis on filter criteria. Strings are added to the query tree as provided by your application.

Maximum limit on the function is the maximum limit on the request: 16 MB for POST, 8 KB for GET.


## How to build numeric filters

use $filter

you require an expression. You can create multiple filter expressions, up to XXXX, but each one can have only one set of criteria. If you want to search on multiple phrases, for example a city name, a type of hotel, ...

TBD
```
$filter=[string] (optional)
```
A structured search expression in standard OData syntax. When calling via POST, this parameter is named filter instead of $filter. 

## Next steps

You can try **Search explorer** in the portal to submit queries with **$filter** or **search.in** parameters. The following examples work against the built-in sample index, but can be easily adapted to work with any index published to your service.

*check for the preview API for search.in*

1. Sign in to [Azure portal]() and open the search dashboard. If it isn't pinned to the dashboard, you can search 

## See also

+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Search Documents REST API]()
+ [Simple query syntax]()
+ [Lucene query syntax]()

