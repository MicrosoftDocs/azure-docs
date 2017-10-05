---
title: Query your Azure Search Index | Microsoft Docs
description: Build a search query in Azure search and use search parameters to filter and sort search results.
services: search
manager: jhubbard
documentationcenter: ''
author: ashmaka

ms.assetid: 69205d7a-363f-4b92-a53f-6ca818a3d2c7
ms.service: search
ms.devlang: na
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 04/26/2017
ms.author: ashmaka

---
# Query your Azure Search index
> [!div class="op_single_selector"]
> * [Overview](search-query-overview.md)
> * [Portal](search-explorer.md)
> * [.NET](search-query-dotnet.md)
> * [REST](search-query-rest-api.md)
> 
> 

When submitting search requests to Azure Search, there are a number of parameters that can be specified alongside the actual words that are typed into the search box of your application. These query parameters allow you to achieve some deeper control of the [full-text search experience](search-lucene-query-architecture.md).

Below is a list that briefly explains common uses of the query parameters in Azure Search. For full coverage of query parameters and their behavior, please see the detailed pages for the [REST API](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) and [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters#microsoft_azure_search_models_searchparameters#properties_summary).

## Types of queries
Azure Search offers many options to create extremely powerful queries. The two main types of query you will use are `search` and `filter`. A `search` query searches for one or more terms in all *searchable* fields in your index, and works the way you would expect a search engine like Google or Bing to work. A `filter` query evaluates a boolean expression over all *filterable* fields in an index. Unlike `search` queries, `filter` queries match the exact contents of a field, which means they are case-sensitive for string fields.

You can use searches and filters together or separately. If you use them together, the filter is applied first to the entire index, and then the search is performed on the results of the filter. Filters can therefore be a useful technique to improve query performance since they reduce the set of documents that the search query needs to process.

The syntax for filter expressions is a subset of the [OData filter language](https://docs.microsoft.com/rest/api/searchservice/OData-Expression-Syntax-for-Azure-Search). For search queries you can use either the [simplified syntax](https://docs.microsoft.com/rest/api/searchservice/Simple-query-syntax-in-Azure-Search) or the [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search) which are discussed below.

### Simple query syntax
The [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/Simple-query-syntax-in-Azure-Search) is the default query language used in Azure Search. The simple query syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

### Lucene query syntax
The [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search) allows you to use the widely-adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

Using this query syntax allows you to easily achieve the following capabilities:
[Field-scoped queries](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_fields), [fuzzy search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_fuzzy), [proximity search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_proximity), [term boosting](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_termboost), [regular expression search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_regex), [wildcard search](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_wildcard), [syntax fundamentals](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_syntax), and [queries using boolean operators](https://docs.microsoft.com/rest/api/searchservice/Lucene-query-syntax-in-Azure-Search#bkmk_boolean).

## Ordering results
When receiving results for a search query, you can request that Azure Search serves the results ordered by values in a specific field. By default, Azure Search orders the search results based on the rank of each document's search score, which is derived from [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf).

If you want Azure Search to return your results ordered by a value other than the search score, you can use the `orderby` search parameter. You can specify the value of the `orderby` parameter to include field names and calls to the [`geo.distance()` function](https://docs.microsoft.com/rest/api/searchservice/OData-Expression-Syntax-for-Azure-Search) for geospatial values. Each expression can be followed by `asc` to indicate that results are requested in ascending order, and `desc` to indicate that results are requested in descending order. The default ranking ascending order.

## Paging
Azure Search makes it easy to implement paging of search results. By using the `top` and `skip` parameters, you can smoothly issue search requests that allow you to receive the total set of search results in manageable, ordered subsets that easily enable good search UI practices. When receiving these smaller subsets of results, you can also receive the count of documents in the total set of search results.

You can learn more about paging search results in the article [How to page search results in Azure Search](search-pagination-page-layout.md).

## Hit highlighting
In Azure Search, emphasizing the exact portion of search results that match the search query is made easy by using the `highlight`, `highlightPreTag`, and `highlightPostTag` parameters. You can specify which *searchable* fields should have their matched text emphasized as well as specifying the exact string tags to append to the start and end of the matched text that Azure Search returns.

## Try out query syntax

The best way to understand syntax differences is by submitting queries and reviewing results.

+ Use [Search Explorer](search-explorer.md) in the Azure portal. By deploying [the sample index](search-get-started-portal.md), you can query the index in minutes using tools in the portal.

+ Use [Fiddler](search-fiddler.md) or Chrome Postman to submit queries to an index that you have uploaded to your search service. Both tools support REST calls to an HTTP endpoint. 