---
title: How to work with search results
titleSuffix: Azure Cognitive Search
description: Structure and sort search results, get a document count, and add content navigation to search results in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/01/2020
---

# How to work with search results in Azure Cognitive Search

This article explains how to get a query response that comes back with a total count of matching documents, paginated results, sorted results, and hit-highlighted terms.

The structure of a response is determined by parameters in the query: [Search Document](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) in the REST API, or [DocumentSearchResult Class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.documentsearchresult-1) in the .NET SDK.

## Total hits and result composition

On the query, specify the following parameters to return the total number of matches and which fields to include in the results.

+ Add `$count=true` to return the total number of matching documents within an index.

+ Use `$select` to specify which fields show up in the response. A field must be attributed as **Retrievable** in the index to be included. When specifying fields, choose those that provide the best contrast and differentiation among documents, with sufficient information to invite a click-through response on the part of the user. On an e-commerce site, it might be a product name, description, brand, color, size, price, and rating.

## Paginated queries

By default, the search engine returns the first 50 matches, either ranked by search score if the query is full text search, or in arbitrary order for exact match queries.

Paged results are achieved by adding `$top`, and `$skip` parameters to the query request: 

+ Return the first set of 15 matching documents plus a count of total matches: `GET /indexes/<INDEX-NAME>/docs?search=<QUERY STRING>&$top=15&$skip=0&$count=true`

+ Return the second set, skipping the first 15 to get the next 15: `$top=15&$skip=15`. Do the same for the third set of 15: `$top=15&$skip=30`

The results of paginated queries are not guaranteed to be stable if the underlying index is changing. Paging changes the value of `$skip` for each page, but each query is independent and operates on the current view of the data as it exists in the index at query time (in other words, there is no caching or snapshot of results, such as those found in a general purpose database).
 
Following is an example of how you might get duplicates. Assume an index with four documents:

    { "id": "1", "rating": 5 }
    { "id": "2", "rating": 3 }
    { "id": "3", "rating": 2 }
    { "id": "4", "rating": 1 }
 
Now assume you want results returned two at a time, ordered by rating. You would execute this query to get the first page of results: `$top=2&$skip=0&$orderby=rating desc`, producing the following results:

    { "id": "1", "rating": 5 }
    { "id": "2", "rating": 3 }
 
On the service, assume a fifth document has just been added to the index: `{ "id": "5", "rating": 4 }`.  Shortly thereafter, you execute a query to fetch the second page: `$top=2&$skip=2&$orderby=rating desc`, and get these results:

    { "id": "2", "rating": 3 }
    { "id": "3", "rating": 2 }
 
Notice that document 2 is fetched twice. This is because the new document 5 has a greater value for rating, so it sorts before document 2 and lands on the first page. While this behavior might be unexpected, it's typical of how a search engine behaves.

## Sorting results

For full text search queries that include a search score, results are automatically ranked in order of relevance based on how well each document matches against the search criteria. Relevance is determined [scoring profiles](index-add-scoring-profiles.md). You can use the default scoring, which relies on text analysis and statistics to rank order all results, with higher scores going to documents with more or stronger matches on a search term.

However, if you want to sort by a specific field, for example by a rating or date, you can define an [`$orderby` expression](query-odata-filter-orderby-syntax.md), which can be applied to any field that is indexed as **Sortable**.

## Hit highlighting

Formatting applied to matching terms in search results makes it easy to spot the match. Hit highlighting instructions are provided on the [query request](https://docs.microsoft.com/rest/api/searchservice/search-documents). 

Formatting is applied to whole term queries. Queries on partial terms, such as fuzzy search or wildcard search that result in query expansion in the engine, cannot use hit highlighting.

```http
POST /indexes/hotels/docs/search?api-version=2019-05-06 
    {  
      "search": "something",  
      "highlight": "Description"  
    }
```

> [!IMPORTANT]
> Services created after July 15, 2020 will provide a different highlighting experience. Services created before that date will not change in their highlighting behavior. With this change, only phrases that match the full phrase query will be returned. Also, it will be possible to specify the fragment size returned for the highlight.
>
> When you are writing client code that implements hit highlighting, be aware of this change. Note that this will not impact you unless you create a completely new search service.

## Next steps

To quickly generate a search page for your client, consider these options:

+ Use the [application generator](search-create-app-portal.md) in the portal to create an HTML page with a search bar, faceted navigation, and results area.
+ Follow the [Create your first app in C#](tutorial-csharp-create-first-app.md) tutorial to create a functional client that covers paginated queries, hit highlighting, and sorting.

Several code samples include a web front-end interface, which you can find here: [New York City Jobs demo app](https://aka.ms/azjobsdemo), [JavaScript sample code with a live demo site](https://github.com/liamca/azure-search-javascript-samples), and [CognitiveSearchFrontEnd](https://github.com/LuisCabrer/CognitiveSearchFrontEnd).