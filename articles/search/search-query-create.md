---
title: Create a basic query
titleSuffix: Azure Cognitive Search
description: Learn how to construct a query request in Cognitive Search, which tools and APIs to use for testing and code, and how query decisions start with index design.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/12/2020
---

# Create a basic query in Azure Cognitive Search

This article explains query construction step by step. Examples are in REST so that you can copy strings into **Search Explorer** in the portal, or build queries interactively, using Postman or Visual Studio code. You can use any tier or version of Cognitive Search for the examples in this article.

## Choose a tool or API

Choose from the following tools and APIs for submitting queries.

| Methodology | Description |
|-------------|-------------|
| Portal| [Search explorer (portal)](search-explorer.md) provides a search bar and options for index and api-version selections. Results are returned as JSON documents. Recommended for early investigation, testing, and validation. <br/>[Learn more.](search-explorer.md) |
| Web testing tools| [Postman or Visual Studio Code](search-get-started-rest.md) are strong choices for formulating [Search Documents](/rest/api/searchservice/search-documents) REST calls. The REST API supports every programmatic operation in Azure Cognitive Search, so you can issue requests interactively to understand how it works before investing in code.  |
| Azure SDK | [SearchClient (.NET)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in C#.  [Learn more.](search-howto-dotnet-sdk.md) <br/><br/>[SearchClient (Python)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in Python. [Learn more.](search-get-started-python.md) <br/><br/> [SearchClient (JavaScript)](/dotnet/api/azure.search.documents.searchclient) can be used to query a search index in JavaScript. [Learn more.](search-get-started-javascript.md)  |

## Set up a search client

A search client authenticates to the search service, sends requests, and handles responses. Queries are always directed at the documents collection of a single index. You cannot join indexes or create custom or temporary data structures as a query target.

In the portal, Search Explorer and other tools have a built-in client connection to the service, with direct access indexes and other objects from portal pages. Access to tools, wizards, and objects assume that you have administrative rights on the service. With Search Explorer, you can focus specifying the search string and other parameters. 

For REST calls, you can use Postman or another tool as the client to specify a [Search Documents](/rest/api/searchservice/search-documents) request. Each request is standalone, so you must provide the endpoint (URL to the service) and an admin or query API key for access. Depending on the request, the URL might also include the index name, the documents collection, and other properties. A few properties, such as Content-Type and `api-key` are passed on the request header. Other parameters can be passed on the URL or in the body of the request. All REST calls require an API key for authentication, and an api-version.

Azure SDKs provide clients that can persist state, allowing connection reuse. For query operations, you will instantiate a SearchClient and provide values for the following properties: Endpoint, Key, Index. You can then call the Search method to provide the query string. 

| Language | Client | Example |
|----------|--------|---------|
| C# and .NET | [SearchClient](/dotnet/api/azure.search.documents.searchclient) | [Send your first search query in C#](/dotnet/api/overview/azure/search.documents-readme#send-your-first-search-query) |
| Python      | [SearchClient](/python/api/azure-search-documents/azure.search.documents.searchclient) | [Send your first search query in Python](/python/api/overview/azure/search-documents-readme#send-your-first-search-request) |
| Java        | [SearchClient](/java/api/com.azure.search.documents.searchclient) | [Send your first search query in Java](/java/api/overview/azure/search-documents-readme#send-your-first-search-query)  |
| JavaScript  | [SearchClient](/javascript/api/@azure/search-documents/searchclient) | [Send your first search query in JavaScript](/javascript/api/overview/azure/search-documents-readme#send-your-first-search-query)  |

## Choose a parser: simple | full

Azure Cognitive Search gives you a choice between two query parsers for handling typical and specialized queries. Requests using the simple parser are typically full text search queries, formulated using the [simple query syntax](query-simple-syntax.md), selected as the default for its speed and effectiveness in free form text queries. This syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

The [full Lucene query syntax](query-Lucene-syntax.md#bkmk_syntax), enabled when you add `queryType=full` to the request, exposes the widely adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html). Full syntax extends the simple syntax. Any query you write for the simple syntax runs under the full Lucene parser. 

The following examples illustrate the point: same query, but with different **`queryType`** settings, which yield different results. In the first query, the `^3` after `historic` is treated as part of the search term. The top-ranked result for this query is "Marquis Plaza & Suites", which has *ocean* in its description.

```http
queryType=simple&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

The same query using the full Lucene parser interprets `^3` as an in-field term booster. Switching parsers changes the rank, with results containing the term *historic* moving to the top.

```http
queryType=full&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

## Specify match criteria

Use Search, Autocomplete, Suggestions

Use Filter with any of the above, or by itself.

Use SearchFields to constrain the query to specific fields.

## Compose results

Use Select to choose which fields
Use Count
Use Top, Skip
Use hit highlighting

## How field attributes in an index determine query behaviors

Index design and query design are tightly coupled in Azure Cognitive Search. The *index schema*, with attributes on each field, determines the kind of query you can build.

Index attributes on a field set the allowed operations - whether a field is *searchable* in the index, *retrievable* in results, *sortable*, *filterable*, and so forth. In the example schema, `"$orderby": "Rating desc"` only works because the Rating field is marked as *sortable* in the index schema.

![Index definition for the hotel sample](./media/search-query-overview/hotel-sample-index-definition.png "Index definition for the hotel sample")

The above screenshot is a partial list of index attributes for the [hotels sample index](search-get-started-portal.md). You can create and view the entire index schema in the portal. For more information about index attributes, see [Create Index (REST API)](/rest/api/searchservice/create-index).

## Next steps

Now that you understand how the request is constructed, try examples using both the simple and full syntax.

+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [Simple query examples](search-query-simple-examples.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)