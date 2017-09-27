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
ms.date: 09/30/2017
ms.author: heidist

---
# Filters in Azure Search 

In Azure Search, filters reduce the search results by applying 

+ explicitly exclude results returned to the calling application...

+ qualify a query, similar to a WHERE clause, to narrow the query to specific fields.


## Filter approaches and syntax

This article explains the two mechanisms in Azure Search for adding filters to search queries. 

| Approach | Description | Query parser requirement | Availability |
|----------|-------------|--------------------------|--------------|
| [search.in()](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | An OData function passing a comma-delimted list of strings for text filtering | [Full Lucene parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) | In preview, [REST API](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) only |
| [$filter parameter](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) | OData filter expression, one per request | [Simple parser](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) | Generally available, [REST](https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents) and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameterspayload.filter) |

## Choose a filter mechanism

Use the **$filter** parameter for:

+ faceted navigation
+ complex expressions with operands
+ range filters
+ geographic filters
+ language filters
+ Low cardinality fields with small number of conditions <sup>1</sup>

<sup>1</sup> A **$filter** typically offers better performance if the filter condition is on a low cardinality field containing a relatively small number of vlaues (such as a list of colors, countries, or brand names), and the number of conditions is also small (color eq ‘blue’ or color eq ‘yellow’). The performance benefit comes from caching, which Azure Search does for queries most likely to be repeated.

**$filters** are intended for static filtering, where you control the user interaction model and thus know whether the search page is for a given language, or whether the user made selections in a faceted navigation structure.

Use the **search.in** function if the filter is raw text to be matched on values in any field, assuming it is searchable, retrievable, and not otherwise excluded from the query. This approach tends to be fast. You can expect sub-second response time for hundreds to thousands of values. While there is no explicit limit on the number of items you can pass to search.in, there is a latency cost as the number of values increase. 


## How to use search.in (goes in reference)

Applies to: api-version=2016-09-01-Preview, api-version=2015-02-28-Preview

An OData function, used to pass in a comma-delimited list of strings. The strings comprise the filter criteria, which are applied to every field in scope for the query.

There is no lexical analysis on filter criteria. Strings are added to the query tree as provided by your application.

Maximum limit on the function is the maximum limit on the request: 16 MB for POST, 8 KB for GET.


## How to use $filter (goes in reference)
you require an expression. You can create multiple filter expressions, up to XXXX, but each one can have only set of criteria. If you want to search on multiple phrases, for example a city name, a type of hotel, ...

TBD
```
$filter=[string] (optional)
```
A structured search expression in standard OData syntax. When calling via POST, this parameter is named filter instead of $filter. 

## Filter by language

TBD

## Filter by geo-location

TBD

## Set up range filters

TBD

## Filter by user (security trimming workaround)

TBD

## Next steps

You can try **Search explorer** in the portal to submit queries with **$filter** or **search.in** parameters. The following examples work against the built-in sample index, but can be easily adapted to work with any index published to your service.

1. Sign in to [Azure portal]() and open the search dashboard. If it isn't pinned to the dashboard, you can search 

## See also

+ [How full text search works in Azure Search]()
+ [Search Documents REST API]()
+ [Simple query syntax]()
+ [Lucene query syntax]()

