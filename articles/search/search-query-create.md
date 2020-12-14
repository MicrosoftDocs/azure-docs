---
title: Create a basic query
titleSuffix: Azure Cognitive Search
description: Learn how to construct a query request in Cognitive Search, which tools and APIs to use for testing and code, and how query decisions start with index design.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/14/2020
---

# Create a query in Azure Cognitive Search

Learn about the tools and APIs for building a query, which methods are used to create a query, and how index structure and content can impact query outcomes. For an introduction to what a query request looks like, start with [Query types and compositions](search-query-overview.md).

## Choose tools and APIs

You can use any of the following tools and APIs to create queries for testing or production workloads.

| Methodology | Description |
|-------------|-------------|
| Portal| [Search explorer (portal)](search-explorer.md) is a query interface in the Azure portal that can be used to run queries against indexes on the underlying search service. The portal makes REST API calls behind the scenes. You can select any index and any supported REST API version, including preview versions. A query string can be in simple and full syntax, and can include filter expressions, facets, select and searchField statements, and searchMode. In the portal, when you open an index, you can work with Search Explorer alongside the index JSON definition in side-by-side tabs for easy access to field attributes. You can check what fields are searchable, sortable, filterable, and facetable while testing queries. Recommended for early investigation, testing, and validation. <br/>[Learn more.](search-explorer.md) |
| Web testing tools| [Postman or Visual Studio Code](search-get-started-rest.md) are strong choices for formulating a [Search Documents](/rest/api/searchservice/search-documents) request in REST. The REST API supports every programmatic operation in Azure Cognitive Search, and when you use a tool like Postman or Visual Studio Code, you can issue requests interactively to understand how it works before investing in code. A web testing tool is a good choice if you don't have contributor or administrative rights in the Azure portal. As long as you have a search URL and a query API key, you can use the tools to run queries against an existing index. |
| Azure SDK | When you are ready to write code, you can use the Azure.Search.Document client libraries in the Azure SDKs for .NET, Python, JavaScript, or Java. Each SDK is on its own release schedule, but you can create and query indexes in all of them. <br/><br/>[SearchClient (.NET)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in C#.  [Learn more.](search-howto-dotnet-sdk.md)<br/><br/>[SearchClient (Python)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in Python. [Learn more.](search-get-started-python.md) <br/><br/> [SearchClient (JavaScript)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in JavaScript. [Learn more.](search-get-started-javascript.md) |

## Set up a search client

A search client authenticates to the search service, sends requests, and handles responses. Regardless of which tool or API you use, a search client must have the following:

| Properties | Description |
|------------|-------------|
| Endpoint | A search service is URL addressable in this format: `https://[service-name].search.windows.net`. |
| API access key (admin or query) | Authenticates the request to the search service. |
| Index name | Queries are always directed at the documents collection of a single index. You cannot join indexes or create custom or temporary data structures as a query target. |
| API version | REST calls explicitly require the `api-version` on the request. In contrast, client libraries in the Azure SDK are versioned against a specific REST API version. For SDKs, the `api-version` is implicit. |

### In the portal

Search Explorer and other portal tools have a built-in client connection to the service, with direct access indexes and other objects from portal pages. Access to tools, wizards, and objects require membership in the Contributor role or above on the service. 

### Using REST

For REST calls, you can use [Postman or similar tools](search-get-started-rest.md) as the client to specify a [Search Documents](/rest/api/searchservice/search-documents) request. Each request is standalone, so you must provide the endpoint, index name, and API version on every request. Other properties, Content-Type and API key, are passed on the request header. 

You can use POST or GET to query an index. POST, with parameters specified in the request body, is easier to work with. If you use POST, be sure to include `docs/search` in the URL:

```http
POST https://myservice.search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30
{
    "count": true,
    "queryType": "simple",
    "search": "*"
}
```

### Using Azure SDKs

If you're using an Azure SDK, you'll create the client in code. All of the SDKs provide search clients that can persist state, allowing for connection reuse. For query operations, you will instantiate a **`SearchClient`** and give values for the following properties: Endpoint, Key, Index. You can then call the **`Search method`** to pass in the query string. 

| Language | Client | Example |
|----------|--------|---------|
| C# and .NET | [SearchClient](/dotnet/api/azure.search.documents.searchclient) | [Send your first search query in C#](/dotnet/api/overview/azure/search.documents-readme#send-your-first-search-query) |
| Python      | [SearchClient](/python/api/azure-search-documents/azure.search.documents.searchclient) | [Send your first search query in Python](/python/api/overview/azure/search-documents-readme#send-your-first-search-request) |
| Java        | [SearchClient](/java/api/com.azure.search.documents.searchclient) | [Send your first search query in Java](/java/api/overview/azure/search-documents-readme#send-your-first-search-query)  |
| JavaScript  | [SearchClient](/javascript/api/@azure/search-documents/searchclient) | [Send your first search query in JavaScript](/javascript/api/overview/azure/search-documents-readme#send-your-first-search-query)  |

## Choose a parser: simple | full

If your query is full text search, a parser will be used to process the contents of the search parameter. Azure Cognitive Search offers two query parsers. The simple parser understands the [simple query syntax](query-simple-syntax.md). This parser was selected as the default for its speed and effectiveness in free form text queries. The syntax supports common search operators (AND, OR, NOT) for term and phrase searches, and prefix (`*`) search (as in "sea*" for Seattle and Seaside). A general recommendation is to try the simple parser first, and then move on to full parser if application requirements call for more powerful queries.

The [full Lucene query syntax](query-Lucene-syntax.md#bkmk_syntax), enabled when you add `queryType=full` to the request, is based on the [Apache Lucene Parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

Full syntax is an extension of the simple syntax, with more operators so that you can construct advanced queries such as fuzzy search, wildcard search, proximity search, and regular expressions. The following examples illustrate the point: same query, but with different **`queryType`** settings, which yield different results. In the first simple query, the `^3` after `historic` is treated as part of the search term. The top-ranked result for this query is "Marquis Plaza & Suites", which has *ocean* in its description.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30
{
    "count": true,
    "queryType": "simple",
    "search": "ocean historic^3",
    "searchFields": "Description",
    "select": "HotelId, HotelName, Tags, Description",
}
```

The same query using the full Lucene parser interprets `^3` as an in-field term booster. Switching parsers changes the rank, with results containing the term *historic* moving to the top.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "ocean historic^3",
    "searchFields": "Description",
    "select": "HotelId, HotelName, Tags, Description",
}
```

## Choose query methods

Search is fundamentally a user-driven exercise, where terms or phrases are collected from a search box, or from click events on a page. The following table summarizes the mechanisms by which you can collect user input, along with the expected search experience.

| Input | Experience |
|-------|---------|
| [Search method](/rest/api/searchservice/search-documents) | A user types terms or phrases into a search box, with or without operators, and clicks Search to send the request. Search can be used with filters on the same request, but not with autocomplete or suggestions. |
| [Autocomplete method](/rest/api/searchservice/autocomplete) | A user types a few characters, and queries are initiated after each new character is typed. The response is a completed string from the index. If the string provided is valid, the user clicks Search to send that query to the service. |
| [Suggestions method](/rest/api/searchservice/suggestions) | As with autocomplete, a user types a few characters and incremental queries are generated. The response is a dropdown list of matching documents, typically represented by a few unique or descriptive fields. If any of the selections are valid, the user clicks one and the matching document is returned. |
| [Faceted navigation](/rest/api/searchservice/search-documents#query-parameters) | A page shows clickable navigation links or breadcrumbs that narrow the scope of the search. A faceted navigation structure is composed dynamically based on an initial query. For example, `search=*` to populate a faceted navigation tree composed of every possible category. A faceted navigation structure is created from a query response, but it's also a mechanism for expressing the next query. n REST API reference, `facets` is documented as a query parameter of a Search Documents operation, but it can be used without the `search` parameter.|
| [Filter method](/rest/api/searchservice/search-documents#query-parameters) | Filters are used with facets to narrow results. You can also implement a filter behind the page, for example to initialize the page with language-specific fields. In REST API reference, `$filter` is documented as a query parameter of a Search Documents operation, but it can be used without the `search` parameter.|

## Know your field attributes

If you previously reviewed the [fundamentals of a query request](search-query-overview.md), you might remember that the parameters on the query request depend on how fields are attributed in an index. For example, to be used in a query, filter, or sort order, a field must be *searchable*, *filterable*, and *sortable*. Similarly, only fields marked as *retrievable* can appear in results. As you begin to specify the `search`, `filter`, and `orderby` parameters in your request, be sure to check attributes as you go to avoid unexpected results.

In the portal screenshot below of the [hotels sample index](search-get-started-portal.md), only the last two fields "LastRenovationDate" and "Rating" can be used in an `"$orderby"` only clause.

![Index definition for the hotel sample](./media/search-query-overview/hotel-sample-index-definition.png "Index definition for the hotel sample")

For a description of field attributes, see [Create Index (REST API)](/rest/api/searchservice/create-index).

## Know your tokens

During indexing, the query engine uses an analyzer to perform text analysis on strings, maximizing the potential for matching at query time. At a minimum, strings are lower-cased, but might also undergo lemmatization and stop word removal. Larger strings or compound words are typically broken up by whitespace, hyphens, or dashes, and indexed as separate tokens. 

The point to take away here is that what you think your index contains, and what's actually in it, can be different. If queries do not return expected results, you can inspect the tokens created by the analyzer through the [Analyze Text (REST API)](/rest/api/searchservice/test-analyzer). For more information about tokenization and the impact on queries, see [Partial term search and patterns with special characters](search-query-partial-matching.md).

## Next steps

Now that you have a better understanding of how a query request is constructed, try the following quickstarts for hands-on experience.

+ [Search explorer](search-explorer.md)
+ [How to query in REST](search-get-started-rest.md)
+ [How to query in .NET](search-get-started-dotnet.md)
+ [How to query in Python](search-get-started-python.md)
+ [How to query in JavaScript](search-get-started-javascript.md)