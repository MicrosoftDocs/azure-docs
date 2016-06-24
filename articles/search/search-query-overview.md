<properties
    pageTitle="Query your Azure Search Index | Microsoft Azure | Hosted cloud search service"
    description="Build a search query in Azure search and use search parameters to filter and sort search results."
    services="search"
    documentationCenter=""
	authors="ashmaka"
/>

<tags
    ms.service="search"
    ms.devlang="na"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="ashmaka"/>

# Query your Azure Search index
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Portal](search-explorer.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

When submitting search requests to Azure Search, there are a number of parameters that can be specified alongside the actual words that are typed into the search box of your application. These query parameters allow you to achieve some deeper control of the full-text search experience.

Below is a list that briefly explains common uses of the query parameters in Azure Search. For full coverage of query parameters and their behavior, please see the detailed pages for the [REST API](https://msdn.microsoft.com/library/azure/dn798927.aspx) and [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.search.models.searchparameters_properties.aspx).

## Types of queries

Azure Search offers many options to create extremely powerful queries. The two main types of query you will use are `search` and `filter`. A `search` query searches for one or more terms in all _searchable_ fields in your index, and works the way you would expect a search engine like Google or Bing to work. A `filter` query evaluates a boolean expression over all _filterable_ fields in an index. Unlike `search` queries, `filter` queries match the exact contents of a field, which means they are case-sensitive for string fields.

You can use searches and filters together or separately. If you use them together, the filter is applied first to the entire index, and then the search is performed on the results of the filter. Filters can therefore be a useful technique to improve query performance since they reduce the set of documents that the search query needs to process.

The syntax for filter expressions is a subset of the [OData filter language](https://msdn.microsoft.com/library/azure/dn798921.aspx). For search queries you can use either the [simplified syntax](https://msdn.microsoft.com/library/azure/dn798920.aspx) or the [Lucene query syntax](https://msdn.microsoft.com/library/azure/mt589323.aspx) which are discussed below.

### Simple query syntax
The [simple query syntax](https://msdn.microsoft.com/library/azure/dn798920.aspx) is the default query language used in Azure Search. The simple query syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

### Lucene query syntax
The [Lucene query syntax](https://msdn.microsoft.com/library/azure/mt589323.aspx) allows you to use the widely-adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

Using this query syntax allows you to easily achieve the following capabilities:
[Field-scoped queries](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_fields), [fuzzy search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_fuzzy), [proximity search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_proximity), [term boosting](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_termboost), [regular expression search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_regex), [wildcard search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_wildcard), [syntax fundamentals](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_syntax), and [queries using boolean operators](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_boolean).



## Ordering results
When receiving results for a search query, you can request that Azure Search serves the results ordered by values in a specific field. By default, Azure Search orders the search results based on the rank of each document's search score, which is derived from [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf).

If you want Azure Search to return your results ordered by a value other than the search score, you can use the `orderby` search parameter. You can specify the value of the `orderby` parameter to include field names and calls to the [`geo.distance()` function](https://msdn.microsoft.com/library/azure/dn798921.aspx) for geospatial values. Each expression can be followed by `asc` to indicate that results are requested in ascending order, and `desc` to indicate that results are requested in descending order. The default ranking ascending order.

## Paging
Azure Search makes it easy to implement paging of search results. By using the `top` and `skip` parameters, you can smoothly issue search requests that allow you to receive the total set of search results in manageable, ordered subsets that easily enable good search UI practices. When receiving these smaller subsets of results, you can also receive the count of documents in the total set of search results.

You can learn more about paging search results in the article [How to page search results in Azure Search](search-pagination-page-layout.md).


## Hit highlighting
In Azure Search, emphasizing the exact portion of search results that match the search query is made easy by using the `highlight`, `highlightPreTag`, and `highlightPostTag` parameters. You can specify which _searchable_ fields should have their matched text emphasized as well as specifying the exact string tags to append to the start and end of the matched text that Azure Search returns.
