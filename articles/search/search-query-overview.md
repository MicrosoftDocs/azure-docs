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
    ms.date="03/10/2016"
    ms.author="ashmaka"/>

# Query your Azure Search index
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Portal](search-explorer.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)


## Query parameters in Azure Search
When submitting search requests to Azure Search, there are a number of parameters that can be specified alongside the actual words that are typed into the search box of your application. The combination of all these parameters forms what is called the "*query string*".

Below is a table that briefly explains most of the query string parameters in Azure Search (for full coverage of parameters and their behavior, please see [this page](https://msdn.microsoft.com/library/azure/dn798927.aspx)).

Parameter | Description
--- | ---
`api-version=[string]` (required) | The API version must be specified. See the different API versions [here](search-api-versions.md).
`search=[string]` (optional) | This is the text to search for. All fields defined as searchable in your index are searched by default unless `searchFields` is also specified. Omitting this parameter will return all documents in your index.
`searchMode=` `any`/`all` (optional, defaults to `any`) | Specifies whether any or all of the terms in the search string must be matched in order to count the document as a match.
`searchFields=[string]` (optional) | The list of comma-separated field names to search for the specified text. Target fields must be marked as searchable in your index.
`queryType=` `simple`/`full` (optional, defaults to `simple`)| When set to `simple`, search text is interpreted using a simple query language that allows for symbols such as +, * and "". When the query type is set to `full`, search text is interpreted using the Lucene query language. See the following section below to learn more about these two query syntaxes.
`$skip=#` (optional) | The number of search results to skip. This value cannot be greater than 100,000.
`$top=#` (optional) | The number of search results to retrieve. This defaults to 50. If you specify a value greater than 1000 and there are more than 1000 results, only the first 1000 results will be returned, along with a link to the next page of results. Learn more [here](https://msdn.microsoft.com/library/azure/dn798927.aspx).
`$orderby=[string]` (optional) | A list of comma-separated expressions to sort the results by. Each expression can be either a field name or a call to the [`geo.distance()`](https://msdn.microsoft.com/library/azure/dn798921.aspx) function. Each expression can be followed by `asc`to indicate ascending, and `desc`to indicate descending. The default is ascending order.


### Search string syntaxes in Azure Search
Azure Search supports two different types of query syntaxes: the [simple query syntax](https://msdn.microsoft.com/library/azure/dn798920.aspx) and the [Lucene query syntax](https://msdn.microsoft.com/library/azure/mt589323.aspx).


#### Simple query syntax
The simple query syntax is the standard query language used in Azure Search. The Simple query syntax supports a number of search operators

#### Lucene query syntax
The Lucene query syntax allows you to use the widely-adoptive and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

The Lucene query syntax allows you to easily achieve the following capabilities:
[Field-scoped queries](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_fields), [fuzzy search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_fuzzy), [proximity search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_proximity), [term boosting](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_termboost), [regular expression search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_regex), [wildcard search](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_wildcard), [syntax fundamentals](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_syntax), and [queries using boolean operators](https://msdn.microsoft.com/library/azure/mt589323.aspx#bkmk_boolean).
