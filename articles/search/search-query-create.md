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
| [Search explorer (portal)](search-explorer.md) | Provides a search bar and options for index and api-version selections. Results are returned as JSON documents. Recommended for exploration, testing, and validation. <br/>[Learn more.](search-get-started-portal.md#query-index) | 
| [Postman or Visual Studio Code](search-get-started-rest.md) | Web testing tools are an excellent choice for formulating [Search Documents](/rest/api/searchservice/search-documents) REST calls. The REST API supports every programmatic operation in Azure Cognitive Search, so you can issue requests interactively to focus your exploration on a specific task.  |
| [SearchClient (.NET)](/dotnet/api/azure.search.documents.searchclient) | Client that can be used to query an Azure Cognitive Search index.  <br/>[Learn more.](search-howto-dotnet-sdk.md)  |

> [!Tip]
> Before writing any code, you can use query tools to learn the syntax and experiment with different parameters. The quickest approach is the built-in portal tool, [Search Explorer](search-explorer.md).
>
> If you followed this [quickstart to create the hotels demo index](search-get-started-portal.md), you can paste this query string into the explorer's search bar to run your first query: `search=+"New York" +restaurant&searchFields=Description, Address/City, Tags&$select=HotelId, HotelName, Description, Rating, Address/City, Tags&$top=10&$orderby=Rating desc&$count=true`

## Choose a parser: simple | full

Azure Cognitive Search gives you a choice between two query parsers for handling typical and specialized queries. Requests using the simple parser are formulated using the [simple query syntax](query-simple-syntax.md), selected as the default for its speed and effectiveness in free form text queries. This syntax supports a number of common search operators including the AND, OR, NOT, phrase, suffix, and precedence operators.

The [full Lucene query syntax](query-Lucene-syntax.md#bkmk_syntax), enabled when you add `queryType=full` to the request, exposes the widely adopted and expressive query language developed as part of [Apache Lucene](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html). Full syntax extends the simple syntax. Any query you write for the simple syntax runs under the full Lucene parser. 

The following examples illustrate the point: same query, but with different queryType settings, yield different results. In the first query, the `^3` after `historic` is treated as part of the search term. The top-ranked result for this query is "Marquis Plaza & Suites", which has *ocean* in its description.

```http
queryType=simple&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

The same query using the full Lucene parser interprets `^3` as an in-field term booster. Switching parsers changes the rank, with results containing the term *historic* moving to the top.

```http
queryType=full&search=ocean historic^3&searchFields=Description, Tags&$select=HotelId, HotelName, Tags, Description&$count=true
```

## How field attributes in an index determine query behaviors

Index design and query design are tightly coupled in Azure Cognitive Search. The *index schema*, with attributes on each field, determines the kind of query you can build. 

Index attributes on a field set the allowed operations - whether a field is *searchable* in the index, *retrievable* in results, *sortable*, *filterable*, and so forth. In the example query string, `"$orderby": "Rating desc"` only works because the Rating field is marked as *sortable* in the index schema. 

![Index definition for the hotel sample](./media/search-query-overview/hotel-sample-index-definition.png "Index definition for the hotel sample")

The above screenshot is a partial list of index attributes for the hotels sample. You can view the entire index schema in the portal. For more information about index attributes, see [Create Index REST API](/rest/api/searchservice/create-index). -->

> [!Note]
> Some query functionality is enabled index-wide rather than on a per-field basis. These capabilities include: [synonym maps](search-synonyms.md), [custom analyzers](index-add-custom-analyzers.md), [suggester constructs (for autocomplete and suggested queries)](index-add-suggesters.md), [scoring logic for ranking results](index-add-scoring-profiles.md).

## Formulate requests in Postman

The following examples leverage a NYC Jobs search index consisting of jobs available based on a dataset provided by the [City of New York OpenData](https://nycopendata.socrata.com/) initiative. This data should not be considered current or complete. The index is on a sandbox service provided by Microsoft, which means you do not need an Azure subscription or Azure Cognitive Search to try these queries.

What you do need is Postman or an equivalent tool for issuing HTTP request on GET. For more information, see [Quickstart: Explore Azure Cognitive Search REST API](search-get-started-rest.md).

### Set the request header

1. In the request header, set **Content-Type** to `application/json`.

2. Add an **api-key**, and set it to this string: `252044BE3886FE4A8E3BAA4F595114BB`. This is a query key for the sandbox search service hosting the NYC Jobs index.

After you specify the request header, you can reuse it for all of the queries in this article, swapping out only the **search=** string. 

  :::image type="content" source="media/search-query-lucene-examples/postman-header.png" alt-text="Postman request header set parameters" border="false":::

### Set the request URL

Request is a GET command paired with a URL containing the Azure Cognitive Search endpoint and search string.

  :::image type="content" source="media/search-query-lucene-examples/postman-basic-url-request-elements.png" alt-text="Postman request header GET" border="false":::

URL composition has the following elements:

+ **`https://azs-playground.search.windows.net/`** is a sandbox search service maintained by the Azure Cognitive Search development team. 
+ **`indexes/nycjobs/`** is the NYC Jobs index in the indexes collection of that service. Both the service name and index are required on the request.
+ **`docs`** is the documents collection containing all searchable content. The query api-key provided in the request header only works on read operations targeting the documents collection.
+ **`api-version=2020-06-30`** sets the api-version, which is a required parameter on every request.
+ **`search=*`** is the query string, which in the initial query is null, returning the first 50 results (by default).

## Send your first query

As a verification step, paste the following request into GET and click **Send**. Results are returned as verbose JSON documents. Entire documents are returned, which allows you to see all fields and all values.

Paste this URL into a REST client as a validation step and to view document structure.

  ```http
  https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2020-06-30&$count=true&search=*
  ```

The query string, **`search=*`**, is an unspecified search equivalent to null or empty search. It's not especially useful, but it is the simplest search you can do.

Optionally, you can add **`$count=true`** to the URL to return a count of the documents matching the search criteria. On an empty search string, this is all the documents in the index (about 2800 in the case of NYC Jobs).

## Next steps

Now that you understand how the request is constructed, try examples in both the simple and full syntax.

+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [Simple query examples](search-query-simple-examples.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)