---
title: Simple query examples for Azure Search | Microsoft Docs
description: Simple query examples for full text search, filter search, geo search, faceted search, and other query strings used to query an Azure Search index.
author: HeidiSteen
manager: cgronlun
tags: Simple query analyzer syntax
services: search
ms.service: search
ms.topic: conceptual
ms.date: 07/16/2018
ms.author: heidist
---

# Simple syntax query examples for building queries in Azure Search

[Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) is the default query parser for constructing full text search queries against an Azure Search index. The simple query analyzer is fast and handles common scenarios in Azure Search, including full text search, filtered search, faceted search, geo-search, and so forth. In this article, step through examples demonstrating query operations available when using the simple syntax.

The alternative query syntax is [full Lucene](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search), supporting more complex query structures, which sometimes take additional time to process. For more information and examples, see [Lucene syntax query examples](search-query-lucene-examples.md).

## Formulate requests in Postman

The following examples leverage a NYC Jobs search index consisting of jobs available based on a dataset provided by the [City of New York OpenData](https://nycopendata.socrata.com/) initiative. This data should not be considered current or complete. The index is on a sandbox service provided by Microsoft. You do not need an Azure subscription or Azure Search to try these queries.

You will need Postman or an equivalent tool for issuing HTTP request on GET. For more information, see [Test with REST clients](search-fiddler.md).

Request headers must have Content-Type set to `application/json` and an api-key set to `252044BE3886FE4A8E3BAA4F595114BB`. After you specify the request header, you can reuse it for all of the queries, swapping out only the **search=** string. 

  ![Postman request header](media/search-query-lucene-examples/postman-header.png)

Request is a GET command paired with a URL containing the Azure Search endpoint and search string.

  ![Postman request header](media/search-query-lucene-examples/postman-basic-url-request-elements.png)

Important points include the following items:

+ **`https://azs-playground.search.windows.net/`** is a sandbox search service maintained by the Azure Search development team. 
+ **`indexes/nycjobs/`** is the NYC Jobs index in the indexes collection of that service. Both the service name and index are required on the request.
+ **`docs`** is the documents collection containing all searchable content. The query api-key provided for NYC Jobs index only works on requests targeting read operations on the documents collection.
+ **`api-version=2017-11-11`** is required on every request.
+ **`search=*`** is the query string, which in the initial query is null, returning the first 50 results (by default).

## Send your first query

As a verification step, paste the following request into GET and click **Send**. Results are returned as verbose JSON documents. 

  ```http
  https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&search=*
  ```

The query string, **`search=*`**, is an unspecified search equivalent to null or empty search. It's not especially useful, but it is the simplest search you can do.

Optionally, you can add **`$count=true`** to the URL to return a count of the documents matching the search criteria. On an empty search string, this is all the documents in the index (2802 in the case of NYC Jobs).

## How to invoke simple query parsing

For interactive queries, you don't have to specify anything: simple is the default. In code, if you previously invoked **queryType=full** for full query syntax, you can reset back to default with **queryType=simple**.

## Example 1: field-scoped query

The first query is not syntax-specific (the query works for both simple and full syntax) but we lead with this example to introduce a baseline query that produces a reasonably readable JSON response. For brevity, the query specifies only business titles are returned. 

```http
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=*
```

The **searchFields** parameter restricts the search to just the business title field. The **select** parameter determines which fields are included in the result set.

Response for this query should look similar to the following screenshot.

  ![Postman sample response](media/search-query-lucene-examples/postman-sample-results.png)

You might have noticed that the search score is also returned for every document even though search score is not specified. This is because search score is metadata, with the value indicating rank order of results. Uniform scores of 1 occur when there is no rank, either because the search was not full text search, or because there is no criteria to apply. For null search, there is no criteria and the rows coming back are in arbitrary order. As the search criteria takes on more definition, you will see search scores evolve into meaningful values.

## Example 2: Lookup a specific document

This example is a bit atypical, but when testing your indexing code, you might want to verify whether a specific document is loaded or refreshed in the index. The way to fully validate whether a document is indexed is to do a [lookup by ID](https://docs.microsoft.com/rest/api/searchservice/lookup-document). You can use the simple syntax for that.

All documents have a unique identifier. To try out the syntax for a lookup query, first return a list of document IDs so that you can find one to use. For NYC Jobs, the identifiers are stored in the `id` field.

```http
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=id&$select=id&search=*
 ```

The next example is a lookup query returning a specific document based on `id` "9E1E3AF9-0660-4E00-AF51-9B654925A2D5", which appeared first in the previous response. The following query returns the entire document, not just selected fields. 

```http
https://azs-playground.search.windows.net/indexes/nycjobs/docs/9E1E3AF9-0660-4E00-AF51-9B654925A2D5?api-version=2017-11-11&$count=true&search=*
 ```

## Example 3: Term and phrase queries

## Example 4: Boolean operators

## Example 5: Filtered query

## Example 6: Sorted results

## Next steps
Try specifying the Lucene Query Parser in your code. The following links explain how to set up search queries for both .NET and the REST API. The links use the default simple syntax so you will need to apply what you learned from this article to specify the **queryType**.

* [Query your Azure Search Index using the .NET SDK](search-query-dotnet.md)
* [Query your Azure Search Index using the REST API](search-query-rest-api.md)

## See also

+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) 
+ [Full Lucene query](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search)
+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)