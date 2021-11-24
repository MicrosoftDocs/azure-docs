---
title: How to work with search results
titleSuffix: Azure Cognitive Search
description: Structure and sort search results, get a document count, and add content navigation to search results in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/29/2021
---

# How to work with search results in Azure Cognitive Search

This article explains how to work with a query response in Azure Cognitive Search. 

The structure of a response is determined by parameters in the query itself: [Search Documents (REST)](/rest/api/searchservice/Search-Documents) or [SearchResults Class (Azure for .NET)](/dotnet/api/azure.search.documents.models.searchresults-1). Parameters on the query determine:

+ Number of results in the response (up to 50, by default)
+ Fields in each result
+ Order of items in results
+ Highlighting of terms within a result, matching on either the whole or partial term in the body of the result

## Result composition

While a search document might consist of a large number of fields, typically only a few are needed to represent each document in the result set. On a query request, append `$select=<field list>` to specify which fields show up in the response. A field must be attributed as **Retrievable** in the index to be included in a result. 

Fields that work best include those that contrast and differentiate among documents, providing sufficient information to invite a click-through response on the part of the user. On an e-commerce site, it might be a product name, description, brand, color, size, price, and rating. For the hotels-sample-index built-in sample, it might be fields in the following example:

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30 
    {  
      "search": "sandy beaches",
      "select": "HotelId, HotelName, Description, Rating, Address/City"
      "count": true
    }
```

> [!NOTE]
> If want to include image files in a result, such as a product photo or logo, store them outside of Azure Cognitive Search, but include a field in your index to reference the image URL in the search document. Sample indexes that support images in the results include the **realestate-sample-us** demo (a built-in sample dataset that you can build easily in the Import Data wizard), and the [New York City Jobs demo app](https://aka.ms/azjobsdemo).

### Tips for unexpected results

Occasionally, the substance and not the structure of results are unexpected. When query outcomes are unexpected, you can try these query modifications to see if results improve:

+ Change **`searchMode=any`** (default) to **`searchMode=all`** to require matches on all criteria instead of any of the criteria. This is especially true when boolean operators are included the query.

+ Experiment with different lexical analyzers or custom analyzers to see if it changes the query outcome. The default analyzer will break up hyphenated words and reduce words to root forms, which usually improves the robustness of a query response. However, if you need to preserve hyphens, or if strings include special characters, you might need to configure custom analyzers to ensure the index contains tokens in the right format. For more information, see [Partial term search and patterns with special characters (hyphens, wildcard, regex, patterns)](search-query-partial-matching.md).

## Paging results

By default, the search engine returns up to the first 50 matches. The top 50 is determined by search score, assuming the query is full text search or semantic search, or in an arbitrary order for exact match queries (where "@searchScore=1.0").

To control the paging of all documents returned in a result set, add `$top` and `$skip` parameters to the query request. The following list explains the logic.

+ Add `$count=true` to get a count of the total number of matching documents found within an index. Depending on your query and the content of your documents, the count could be as high as every document in the index.

+ Return the first set of 15 matching documents plus a count of total matches: `GET /indexes/<INDEX-NAME>/docs?search=<QUERY STRING>&$top=15&$skip=0&$count=true`

+ Return the second set, skipping the first 15 to get the next 15: `$top=15&$skip=15`. Repeat for the third set of 15: `$top=15&$skip=30`

The results of paginated queries are not guaranteed to be stable if the underlying index is changing. Paging changes the value of `$skip` for each page, but each query is independent and operates on the current view of the data as it exists in the index at query time (in other words, there is no caching or snapshot of results, such as those found in a general purpose database).
 
Following is an example of how you might get duplicates. Assume an index with four documents:

```text
{ "id": "1", "rating": 5 }
{ "id": "2", "rating": 3 }
{ "id": "3", "rating": 2 }
{ "id": "4", "rating": 1 }
```
 
Now assume you want results returned two at a time, ordered by rating. You would execute this query to get the first page of results: `$top=2&$skip=0&$orderby=rating desc`, producing the following results:

```text
{ "id": "1", "rating": 5 }
{ "id": "2", "rating": 3 }
```
 
On the service, assume a fifth document is added to the index in between query calls: `{ "id": "5", "rating": 4 }`.  Shortly thereafter, you execute a query to fetch the second page: `$top=2&$skip=2&$orderby=rating desc`, and get these results:

```text
{ "id": "2", "rating": 3 }
{ "id": "3", "rating": 2 }
```
 
Notice that document 2 is fetched twice. This is because the new document 5 has a greater value for rating, so it sorts before document 2 and lands on the first page. While this behavior might be unexpected, it's typical of how a search engine behaves.

## Ordering results

In a full text search query, results can be ranked by a search score, a semantic re-ranker score (if using [semantic search](semantic-search-overview.md)), or by an **`$orderby`** expression in the query request.

A @search.score equal to 1.00 indicates an un-scored or un-ranked result set, where the 1.0 score is uniform across all results. Un-scored results occur when the query form is fuzzy search, wildcard or regex queries, or an empty search (`search=*`). If you need to impose a ranking structure over un-scored results, an **`$orderby`** expression will help you achieve that objective.

For full text search queries, results are automatically ranked by a search score, calculated based on term frequency and proximity in a document (derived from [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)), with higher scores going to documents having more or stronger matches on a search term.

Search scores convey general sense of relevance, reflecting the strength of match relative to other documents in the same result set. But scores are not always consistent from one query to the next, so as you work with queries, you might notice small discrepancies in how search documents are ordered. There are several explanations for why this might occur.

| Cause | Description |
|-----------|-------------|
| Data volatility | Index content varies as you add, modify, or delete documents. Term frequencies will change as index updates are processed over time, affecting the search scores of matching documents. |
| Multiple replicas | For services using multiple replicas, queries are issued against each replica in parallel. The index statistics used to calculate a search score are calculated on a per-replica basis, with results merged and ordered in the query response. Replicas are mostly mirrors of each other, but statistics can differ due to small differences in state. For example, one replica might have deleted documents contributing to their statistics, which were merged out of other replicas. Typically, differences in per-replica statistics are more noticeable in smaller indexes. For more information about this condition, see [Concepts: search units, replicas, partitions, shards](search-capacity-planning.md#concepts-search-units-replicas-partitions-shards) in the capacity planning documentation. |
| Identical scores | If multiple documents have the same score, any one of them might appear first.  |

### How to get consistent ordering

If consistent ordering is an application requirement, you can explicitly define an [**`$orderby`** expression](query-odata-filter-orderby-syntax.md) on a field. Only fields that are indexed as **`sortable`** can be used to order results.

Fields commonly used in an **`$orderby`** include rating, date, and location. Filtering by location requires that the filter expression calls the [**`geo.distance()` function**](search-query-odata-geo-spatial-functions.md?#order-by-examples), in addition to the field name.

Another approach that promotes order consistency is using a [custom scoring profile](index-add-scoring-profiles.md). Scoring profiles give you more control over the ranking of items in search results, with the ability to boost matches found in specific fields. The additional scoring logic can help override minor differences among replicas because the search scores for each document are farther apart. We recommend the [ranking algorithm](index-ranking-similarity.md) for this approach.

## Hit highlighting

Hit highlighting refers to text formatting (such as bold or yellow highlights) applied to matching terms in a result, making it easy to spot the match. Hit highlighting instructions are provided on the [query request](/rest/api/searchservice/search-documents).  Queries that trigger query expansion in the engine, such as fuzzy and wildcard search, have limited support for hit highlighting.

To enable hit highlighting, add `highlight=[comma-delimited list of string fields]` to specify which fields will use highlighting. Highlighting is useful for longer content fields, such as a description field, where the match is not immediately obvious. Only field definitions that are attributed as **searchable** qualify for hit highlighting.

By default, Azure Cognitive Search returns up to five highlights per field. You can adjust this number by appending to the field a dash followed by an integer. For example, `highlight=Description-10` returns up to 10 highlights on matching content in the Description field.

Formatting is applied to whole term queries. The type of formatting is determined by tags, `highlightPreTag` and `highlightPostTag`, and your code handles the response (for example, applying a bold font or a yellow background).

In the following query request example, the terms "divine", "secrets", and "secret" found within the Description field are tagged for highlighting.

```http
POST /indexes/good-books/docs/search?api-version=2020-06-30 
    {  
      "search": "divine secrets",  
      "highlight": "Description"
    }
```

The following portal screenshot illustrates the results of phrase query highlighting. Results are returned in the "@search.highlights" field. Individual terms, single or consecutive, are marked up in the result.

:::image type="content" source="media/search-pagination-page-layout/highlighting-example.png" alt-text="Screenshot of highlighting over a phrase query." border="true":::

### Highlighting behavior on older search services

Search services that were created before July 15, 2020 implement a different highlighting experience for phrase queries.

Before July 2020, any term in the phrase is highlighted:

  ```json
  "@search.highlights": {
      "sentence": [
          "The <em>super</em> <em>bowl</em> is <em>super</em> awesome with a <em>bowl</em> of chips"
     ]
  ```

After July 2020, only phrases that match the full phrase query will be returned in "@search.highlights":

  ```json
  "@search.highlights": {
      "sentence": [
          "The <em>super</em> <em>bowl</em> is super awesome with a bowl of chips"
     ]
  ```

## Next steps

To quickly generate a search page for your client, consider these options:

+ [Application Generator](search-create-app-portal.md), in the portal, creates an HTML page with a search bar, faceted navigation, and results area that includes images.

+ [Create your first app in C#](tutorial-csharp-create-first-app.md) is a tutorial and code sample that builds a functional client. Sample code demonstrates paginated queries, hit highlighting, and sorting.

+ [Add search to web apps](tutorial-csharp-overview.md) is a tutorial and code sample that uses the React JavaScript libraries for the user experience. The app is deployed using Azure Static Web Apps.
