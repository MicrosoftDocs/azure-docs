---
title: Basic query construction in Azure Search | Microsoft Docs
description: Build a search query in Azure search and use search parameters to filter and sort search results.
author: HeidiSteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.topic: conceptual
ms.date: 07/13/2018

---
# Basic query construction in Azure Search

A query definition in Azure Search is a full specification of a request that includes these parts: service URL endpoint, target index, api-key, api-version, and a query string. Query string composition consists of parameters as defined in [Search Documents API](https://docs.microsoft.com/rest/api/searchservice/search-documents). Most important is the **search=** parameter, which could be undefined (`*`) but more likely consists of terms, phrases, and operators:

```
"search": "seattle townhouse +\"lake\""
```

Other parameters are used to direct query processing or enhance the response. Setting the query parser (to use the simple or full syntax), fields, search mode, paging results, and adding counts are a few of the more notable parameters.

```
{  
    "search": "seattle townhouse* +\"lake\"",  
    "searchFields": "description, city",  
    "searchMode": "all",
    "count": "true", 
    "queryType": "simple" 
 } 
```

During index development, attributes on fields determine what is possible at query time. For example, to qualify for full text search and inclusion in search results, a field must be marked as both *searchable* and *retrievable*.

Query execution is always against one index, authenticated using an api-key provided in the request. You cannot join indexes or create custom or temporary data structures as a query target.  

Query results are streamed as JSON documents in the REST API, but if you use .NET APIs, serialization is built in. 

To summarize, the substance of the query request specifies scope and operations: which fields to include in search, which fields to include in the result set, whether to sort or filter, and so forth. Unspecified, a query runs against all searchable fields as a full text search operation, returning an unscored result set in arbitrary order.

## APIs and tools for testing

The following table lists the APIs and tool-based approaches for submitting squeries.

| Methodology | Description |
|-------------|-------------|
| [SearchIndexClient (.NET)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchindexclient?view=azure-dotnet) | Client that can be used to query an Azure Search index.  <br/>[Learn more.](search-howto-dotnet-sdk.md#core-scenarios)  |
| [Search Documents (REST API)](https://docs.microsoft.com/rest/api/searchservice/search-documents) | GET or POST methods on an index, using query parameters for additional input.  |
| [Fiddler, Postman, or other HTTP testing tool](earch-fiddler.md) | Explains how to set up a request header and body for sending queries to Azure Search.  |
| [Search explorer in Azure portal](search-explorer.md) | Provides a search bar and options for index and api-version selections. Results are returned as JSON documents. <br/>[Learn more.](earch-get-started-portal.md#query-index) | 

## Required and optional elements

Required elements on a query request include the following components:

+ Service endpoint and index documents collection, expressed here as a URL `https://<your-service-name>.search.windows.net/indexes/<your-index-name>/docs`.
+ API version (REST only), expressed as **api-version=**
+ query or admin api-key, expressed as **api-key=**
+ query string expressed as **search=**, which can be unspecified if you want to perform an empty search. You can also send just a filter expression as **$filter=**.
+ **queryType=**, either simple or full, which can be omitted if you want to use the default simple syntax.

All other search parameters are optional.

## Code examples

The following snippets are derived from current samples.

TBD

## Original

When submitting search requests to Azure Search, there are a number of parameters that can be specified alongside the actual words that are typed into the search box of your application. These query parameters allow you to achieve some deeper control of the [full-text search experience](search-lucene-query-architecture.md).

Below is a list that briefly explains common uses of the query parameters in Azure Search. For full coverage of query parameters and their behavior, please see the detailed pages for the [REST API](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) and [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters#microsoft_azure_search_models_searchparameters#properties_summary).

## Search and $filter queries

Azure Search offers many options to create extremely powerful queries. The two main types of query you will use are `search` and `filter`. A `search` query searches for one or more terms in all *searchable* fields in your index, and works the way you would expect a search engine like Google or Bing to work. A `filter` query evaluates a boolean expression over all *filterable* fields in an index. Unlike `search` queries, `filter` queries match the exact contents of a field, which means they are case-sensitive for string fields.

You can use searches and filters together or separately. If you use them together, the filter is applied first to the entire index, and then the search is performed on the results of the filter. Filters can therefore be a useful technique to improve query performance since they reduce the set of documents that the search query needs to process.

The syntax for filter expressions is a subset of the [OData filter language](https://docs.microsoft.com/rest/api/searchservice/OData-Expression-Syntax-for-Azure-Search). For search queries you can use either the [simplified syntax](https://docs.microsoft.com/rest/api/searchservice/Simple-query-syntax-in-Azure-Search) or the [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search) which are discussed below.

## Simple and full query syntax

Azure Search sits on top of Apache Lucene and provides two query parsers for handling typical and specialized queries. Typical search requests are formulated using the default [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/Simple-query-syntax-in-Azure-Search). This syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

The [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_syntax), enabled when you add **queryType=full** to the request, exposes the widely-adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html). Using this query syntax allows specialized queries:

+ [Field-scoped queries](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_fields)
+ [fuzzy search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_fuzzy)
+ [proximity search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_proximity)
+ [term boosting](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_termboost)
+ [regular expression search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_regex)
+ [wildcard search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_wildcard)

Boolean operators are mostly the same in both syntax, with additional formats in full Lucene:

+ [Boolean operators in simple syntax]()
+ [Boolean operators in  full Lucene syntax](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_boolean)

## Search mode



## Managing search results

Parameters on the query can be used to structure the result set.

how many documents in the result
number of hits returned in one batch
paging a long result set
ordering
highlighting

When results are not what you expect to see, you can try these query modifications to see if results improve:

change searchMode=any (default) to searchMode=all to require matches on all criteria instead of any of the criteria. This is especially true when boolean operators are included the queyr.

Text or lexical analysis that auto-corrects for spelling errors, singular-plural word forms, and even irregular verbs or nouns is not part of the query parsing pipeline on searches like fuzzy search, wildcard search, or prefix search. If you require both specialized search and lexical analysis, you can sometimes get by with using regular expressions....



### Ordering results
When receiving results for a search query, you can request that Azure Search serves the results ordered by values in a specific field. By default, Azure Search orders the search results based on the rank of each document's search score, which is derived from [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf).

If you want Azure Search to return your results ordered by a value other than the search score, you can use the `orderby` search parameter. You can specify the value of the `orderby` parameter to include field names and calls to the [`geo.distance()` function](https://docs.microsoft.com/rest/api/searchservice/OData-Expression-Syntax-for-Azure-Search) for geospatial values. Each expression can be followed by `asc` to indicate that results are requested in ascending order, and `desc` to indicate that results are requested in descending order. The default ranking ascending order.

### Paging results
Azure Search makes it easy to implement paging of search results. By using the `top` and `skip` parameters, you can smoothly issue search requests that allow you to receive the total set of search results in manageable, ordered subsets that easily enable good search UI practices. When receiving these smaller subsets of results, you can also receive the count of documents in the total set of search results.

You can learn more about paging search results in the article [How to page search results in Azure Search](search-pagination-page-layout.md).

### Hit highlighting
In Azure Search, emphasizing the exact portion of search results that match the search query is made easy by using the `highlight`, `highlightPreTag`, and `highlightPostTag` parameters. You can specify which *searchable* fields should have their matched text emphasized as well as specifying the exact string tags to append to the start and end of the matched text that Azure Search returns.


## See also

+ [How full text search works in Azure Search (query parsing architecture](search-lucene-query-architecture.md)
+ [Search explorer](search-explorer.md)
+ [How to query in .NET](search-query-dotnet.md)
+ [How to query in REST](search-query-rest-api.md)
