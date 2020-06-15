---
title: Similarity and scoring overview
titleSuffix: Azure Cognitive Search
description: Explains the concepts of similarity and scoring, and what a developer can do to customize the scoring result.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/27/2020
---
# Similarity and scoring in Azure Cognitive Search

Scoring refers to the computation of a search score for every item returned in search results for full text search queries. The score is an indicator of an item's relevance in the context of the current search operation. The higher the score, the more relevant the item. In search results, items are rank ordered from high to low, based on the search scores calculated for each item. 

By default, the top 50 are returned in the response, but you can use the **$top** parameter to return a smaller or larger number of items (up to 1000 in a single response), and **$skip** to get the next set of results.

The search score is computed based on statistical properties of the data and the query. Azure Cognitive Search finds documents that match on search terms (some or all, depending on [searchMode](https://docs.microsoft.com/rest/api/searchservice/search-documents#searchmodeany--all-optional)), favoring documents that contain many instances of the search term. The search score goes up even higher if the term is rare across the data index, but common within the document. The basis for this approach to computing relevance is known as *TF-IDF or* term frequency-inverse document frequency.

Search score values can be repeated throughout a result set. When multiple hits have the same search score, the ordering of the same scored items is not defined, and is not stable. Run the query again, and you might see items shift position, especially if you are using the free service or a billable service with multiple replicas. Given two items with an identical score, there is no guarantee which one appears first.

If you want to break the tie among repeating scores, you can add an **$orderby** clause to first order by score, then order by another sortable field (for example, `$orderby=search.score() desc,Rating desc`). For more information, see [$orderby](https://docs.microsoft.com/azure/search/search-query-odata-orderby).

> [!NOTE]
> A `@search.score = 1.00` indicates an un-scored or un-ranked result set. The score is uniform across all results. Un-scored results occur when the query form is fuzzy search, wildcard or regex queries, or a **$filter** expression. 

## Scoring profiles

You can customize the way different fields are ranked by defining a custom *scoring profile*. Scoring profiles give you greater control over the ranking of items in search results. For example, you might want to boost items based on their revenue potential, promote newer items, or perhaps boost items that have been in inventory too long. 

A scoring profile is part of the index definition, composed of weighted fields, functions, and parameters. For more information about defining one, see [Scoring Profiles](index-add-scoring-profiles.md).

<a name="scoring-statistics"></a>

## Scoring statistics and sticky sessions (preview)

For scalability, Azure Cognitive Search distributes each index horizontally through a sharding process, which means that portions of an index are physically separate.

By default, the score of a document is calculated based on statistical properties of the data *within a shard*. This approach is generally not a problem for a large corpus of data, and it provides better performance than having to calculate the score based on information across all shards. That said, using this performance optimization could cause two very similar documents (or even identical documents) to end up with different relevance scores if they end up in different shards.

If you prefer to compute the score based on the statistical properties across all shards, you can do so by adding *scoringStatistics=global* as a [query parameter](https://docs.microsoft.com/rest/api/searchservice/search-documents) (or add *"scoringStatistics": "global"* as a body parameter of the [query request](https://docs.microsoft.com/rest/api/searchservice/search-documents)).

```http
GET https://[service name].search.windows.net/indexes/[index name]/docs?scoringStatistics=global&api-version=2019-05-06-Preview&search=[search term]
  Content-Type: application/json
  api-key: [admin or query key]  
```
Using scoringStatistics will ensure that all shards in the same replica provide the same results. That said, different replicas may be slightly different from one another as they are always getting updated with the latest changes to your index. In some scenarios, you may want your users to get more consistent results during a "query session". In such scenarios, you can provide a `sessionId` as part of your queries. The `sessionId` is a unique string that you create to refer to a unique user session.

```http
GET https://[service name].search.windows.net/indexes/[index name]/docs?sessionId=[string]&api-version=2019-05-06-Preview&search=[search term]
  Content-Type: application/json
  api-key: [admin or query key]  
```
As long as the same `sessionId` is used, a best-effort attempt will be made to target the same replica, increasing the consistency of results your users will see. 

> [!NOTE]
> Reusing the same `sessionId` values repeatedly can interfere with the load balancing of the requests across replicas and adversely affect the performance of the search service. The value used as sessionId cannot start with a '_' character.

## Similarity ranking algorithms

Azure Cognitive Search supports two different similarity ranking algorithms: A *classic similarity* algorithm and the official implementation of the *Okapi BM25* algorithm (currently in preview). The classical similarity algorithm is the default algorithm, but starting July 15, any new services created after that date use the new BM25 algorithm. It will be the only algorithm available on new services.

For now, you can specify which similarity ranking algorithm you would like to use. For more information, see [Ranking algorithm](index-ranking-similarity.md).

The following video segment fast-forwards to an explanation of the ranking algorithms used in Azure Cognitive Search. You can watch the full video for more background.

> [!VIDEO https://www.youtube.com/embed/Y_X6USgvB1g?version=3&start=322&end=643]

## See also

 [Scoring Profiles](index-add-scoring-profiles.md)
 [REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)   
 [Search Documents API](https://docs.microsoft.com/rest/api/searchservice/search-documents)   
 [Azure Cognitive Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search?view=azure-dotnet)  
