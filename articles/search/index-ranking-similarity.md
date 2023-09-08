---
title: Configure relevance scoring
titleSuffix: Azure Cognitive Search
description: Enable Okapi BM25 ranking to upgrade the search ranking and relevance behavior on older Azure Search services.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/18/2023
---

# Configure relevance scoring

In this article, you'll learn how to configure the similarity scoring algorithm used by Azure Cognitive Search. The BM25 scoring model has defaults for weighting term frequency and document length. You can customize these properties if the defaults aren't suited to your content.

Configuration changes are scoped to individual indexes, which means you can adjust relevance scoring based on the characteristics of each index.

## Default scoring algorithm

Depending on the age of your search service, Azure Cognitive Search supports two [similarity scoring algorithms](index-similarity-and-scoring.md) for a full text search query:

+ Okapi BM25 algorithm (after July 15, 2020)
+ Classic similarity algorithm (before July 15, 2020)

BM25 ranking is the default because it tends to produce search rankings that align better with user expectations. It includes [parameters](#set-bm25-parameters) for tuning results based on factors such as document size. For search services created after July 2020, BM25 is the only scoring algorithm. If you try to set "similarity" to ClassicSimilarity on a new service, an HTTP 400 error will be returned because that algorithm is not supported by the service.

For older services, classic similarity remains the default algorithm. Older services can [upgrade to BM25](#enable-bm25-scoring-on-older-services) on a per-index basis. When switching from classic to BM25, you can expect to see some differences how search results are ordered.

## Set BM25 parameters

BM25 similarity adds two parameters to control the relevance score calculation. 

1. Formulate a [Create or Update Index](/rest/api/searchservice/create-index) request as illustrated by the following example.

    ```http
    PUT [service-name].search.windows.net/indexes/[index-name]?api-version=2020-06-30&allowIndexDowntime=true
    {
        "similarity": {
            "@odata.type": "#Microsoft.Azure.Search.BM25Similarity",
            "b" : 0.75,
            "k1" : 1.2
        }
    }
    ```

1. Set "b" and "k1" to custom values. See the property descriptions in the next section for details.

1. If the index is live, append the "allowIndexDowntime=true" URI parameter on the request.

   Because Cognitive Search won't allow updates to a live index, you'll need to take the index offline so that the parameters can be added. Indexing and query requests will fail while the index is offline. The duration of the outage is the amount of time it takes to update the index, usually no more than several seconds. When the update is complete, the index comes back automatically.

1. Send the request.

### BM25 property descriptions

| Property | Type | Description |
|----------|------|-------------|
| k1 | number | Controls the scaling function between the term frequency of each matching terms to the final relevance score of a document-query pair. Values are usually 0.0 to 3.0, with 1.2 as the default. </br></br>A value of 0.0 represents a "binary model", where the contribution of a single matching term is the same for all matching documents, regardless of how many times that term appears in the text, while a larger k1 value allows the score to continue to increase as more instances of the same term is found in the document. </br></br>Using a higher k1 value can be important in cases where we expect multiple terms to be part of a search query. In those cases, we might want to favor documents that match many of the different query terms being searched over documents that only match a single one, multiple times. For example, when querying the index for documents containing the terms "Apollo Spaceflight", we might want to lower the score of an article about Greek Mythology that contains the term "Apollo" a few dozen times, without mentions of "Spaceflight", compared to another article that explicitly mentions both "Apollo" and "Spaceflight" a handful of times only. |
| b | number | Controls how the length of a document affects the relevance score. Values are between 0 and 1, with 0.75 as the default. </br></br>A value of 0.0 means the length of the document will not influence the score, while a value of 1.0 means the impact of term frequency on relevance score will be normalized by the document's length. </br></br>Normalizing the term frequency by the document's length is useful in cases where we want to penalize longer documents. In some cases, longer documents (such as a complete novel), are more likely to contain many irrelevant terms, compared to much shorter documents. |

## Enable BM25 scoring on older services

If you're running a search service that was created from March 2014 through July 15, 2020, you can enable BM25 by setting a "similarity" property on new indexes. The property is only exposed on new indexes, so if want BM25 on an existing index, you must drop and [rebuild the index](search-howto-reindex.md) with a "similarity" property set to "Microsoft.Azure.Search.BM25Similarity".

Once an index exists with a "similarity" property, you can switch between `BM25Similarity` or `ClassicSimilarity`. 

The following links describe the Similarity property in the Azure SDKs. 

| Client library | Similarity property |
|----------------|---------------------|
| .NET  | [SearchIndex.Similarity](/dotnet/api/azure.search.documents.indexes.models.searchindex.similarity) |
| Java | [SearchIndex.setSimilarity](/java/api/com.azure.search.documents.indexes.models.searchindex.setsimilarity) |
| JavaScript | [SearchIndex.Similarity](/javascript/api/@azure/search-documents/searchindex#similarity) |
| Python | [similarity property on SearchIndex](/python/api/azure-search-documents/azure.search.documents.indexes.models.searchindex) |

### REST example

You can also use the [REST API](/rest/api/searchservice/create-index). The following example creates a new index with the "similarity" property set to BM25:

```http
PUT [service-name].search.windows.net/indexes/[index name]?api-version=2020-06-30
{
    "name": "indexName",
    "fields": [
        {
            "name": "id",
            "type": "Edm.String",
            "key": true
        },
        {
            "name": "name",
            "type": "Edm.String",
            "searchable": true,
            "analyzer": "en.lucene"
        },
        ...
    ],
    "similarity": {
        "@odata.type": "#Microsoft.Azure.Search.BM25Similarity"
    }
}
```

## See also  

+ [Similarity and scoring in Azure Cognitive Search](index-similarity-and-scoring.md)
+ [REST API Reference](/rest/api/searchservice/)
+ [Add scoring profiles to your index](index-add-scoring-profiles.md)
+ [Create Index API](/rest/api/searchservice/create-index)
+ [Azure Cognitive Search .NET SDK](/dotnet/api/overview/azure/search)
