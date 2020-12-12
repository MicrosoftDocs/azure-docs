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
| [Search explorer (portal)](search-explorer.md) | Provides a search bar and options for index and api-version selections. Results are returned as JSON documents. Recommended for early investigation, testing, and validation. <br/>[Learn more.](search-explorer.md) | 
| [Postman or Visual Studio Code](search-get-started-rest.md) | Web testing tools are a strong choice for formulating [Search Documents](/rest/api/searchservice/search-documents) REST calls. The REST API supports every programmatic operation in Azure Cognitive Search, so you can issue requests interactively to understand how it works before investing in code.  |
| [SearchClient (.NET)](/dotnet/api/azure.search.documents.searchclient) | Client that can be used to query a search index in C#.  <br/>[Learn more.](search-howto-dotnet-sdk.md)  |
| [SearchClient (Python)](/dotnet/api/azure.search.documents.searchclient) | Client that can be used to query a search index in Python. <br/>[Learn more.](search-get-started-python.md)  |
| [SearchClient (JavaScript)](/dotnet/api/azure.search.documents.searchclient) | Client that can be used to query a search index in JavaScript.  <br/>[Learn more.](search-get-started-javascript.md)  |

## Set up a search client

Endpoint
Key

For REST, add the api-version. 

The client or endpoint must specify which index to use. In REST calls, appends the docs collection to the index name.

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

use SearchFields to constrain the query to specific fields.

## Results composition

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