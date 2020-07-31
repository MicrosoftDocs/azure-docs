---
title: Similarity and Scoring in Azure Cognitive Search
titleSuffix: Azure Cognitive Search
description: Explains the concepts of similarity and scoring, and what the developer can do to customize the scoring result.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/21/2020
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Similarity and Scoring in Azure Cognitive Search

Scoring refers to the computation of a search score for every item returned in search results. The score is an indicator of an item's relevance in the context of the current search operation. The higher the score, the more relevant the item. In search results, items are rank ordered from high to low, based on the search scores calculated for each item.

Scoring computes a search score for each item in a rank ordered result set. Every item in a search result set is assigned a search score, then ranked highest to lowest. Items with the higher scores are returned to the application. By default, the top 50 are returned, but you can use the $top parameter to return a smaller or larger number of items (up to 1000 in a single response).

The search score is computed based on statistical properties of the data and the query. Azure Cognitive Search finds documents that include the search terms in the query string (some or all, depending on [searchMode](https://docs.microsoft.com/rest/api/searchservice/search-documents#searchmodeany--all-optional)), favoring documents that contain many instances of the search term. The search score goes up even higher if the term is rare across the data index, but common within the document. The basis for this approach to computing relevance is known as TF-IDF or term frequency-inverse document frequency.

Assuming there is no custom sorting, results are then ranked by search score before they are returned to the calling application. If $top is not specified, 50 items having the highest search score are returned.

Search score values can be repeated throughout a result set. For example, you might have 10 items with a score of 1.2, 20 items with a score of 1.0, and 20 items with a score of 0.5. When multiple hits have the same search score, the ordering of same scored items is not defined, and is not stable. Run the query again, and you might see items shift position. Given two items with an identical score, there is no guarantee which one appears first.

## Scoring profiles

You can customize the way different fields are ranked by defining a custom *scoring profile*. Scoring profiles give you greater control over the ranking of items in search results. For example, you might want to boost items based on their revenue potential, promote newer items, or perhaps boost items that have been in inventory too long.   A scoring profile is part of the index definition, composed of weighted fields, functions, and parameters.  

Learn more about [Scoring Profiles](index-add-scoring-profiles)

## Scoring statistics

Azure Cognitive Search pre-divides each index into 12 shards so that it can be spread in equal portions across all partitions. For example, if your service has three partitions and you create an index, each partition will contain four shards of the index.

By default, the score of a document is calculated based on statistical properties of the data *within the shard*. This is generally not a problem for a large corpus of data and can provide better performance than having to calculate the score based on information across all shards. That said, using this performance optimization could cause two very similar documents (or even identical documents) to end up with different relevance scores if they end up in different shards.

If you would prefer to compute the scored based on the statistical properties across all of the shards, you can do so by adding *scoringStatistics=global* as a [query](https://docs.microsoft.com/rest/api/searchservice/search-documents) string parameter (or add *"scoringStatistics": "global"*  as a body parameter of the [query](https://docs.microsoft.com/rest/api/searchservice/search-documents)).

```http
GET https://[service name].search.windows.net/indexes/[index name]/docs?scoringStatistics=global
  Content-Type: application/json
  api-key: [admin or query key]  
```

## Similarity ranking algorithms in Azure Cognitive Search

Azure Cognitive Search supports two different similarity ranking algorithms: A classic similarity algorithm and the official implementation of the Okapi BM25 algorithm (currently in preview). The classical similarity algorithm is the default algorithm, but starting July 15, any new services created will default to use the new BM25 algorithm.

You can specify which similarity ranking algorithm you would like to use, as described in the [relevance tuning documentation](index-ranking-similarity.md).


## Watch this video

In this 16-minute video, software engineer Raouf Merouche explains the process of indexing, querying and how to create scoring profiles. It gives you a good idea of what is going on under the hood as your documents are being indexed and retrieved.

>[!VIDEO https://channel9.msdn.com/Shows/AI-Show/Similarity-and-Scoring-in-Azure-Cognitive-Search/player]

+ 2 - 3 minutes cover indexing: text processing and lexical analysis.
+ 3 - 4 minutes cover indexing: inverted indexes.
+ 4 - 6 minutes cover querying: retrieval and ranking.
+ 7 - 16 minutes covers scoring profiles.

## See also

 [Scoring Profiles](index-add-scoring-profiles.md)
 [Azure Cognitive Search REST](https://docs.microsoft.com/rest/api/searchservice/)   
 [Query Index &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/search-documents)   
 [Azure Cognitive Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search?view=azure-dotnet)  
