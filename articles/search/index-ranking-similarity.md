---
title: Configure the similarity algorithm
titleSuffix: Azure Cognitive Search
description: Learn how to enable BM25 on older search services, and how BM25 parameters can be modified to better accommodate the content of your indexes.
manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/12/2021
---

# Configure the similarity ranking algorithm in Azure Cognitive Search

Azure Cognitive Search supports two similarity ranking algorithms:

+ A *classic similarity* algorithm, used by all search services up until July 15, 2020.
+ An implementation of the *Okapi BM25* algorithm, used in all search services created after July 15.

BM25 ranking is the new default because it tends to produce search rankings that align better with user expectations. It comes with [parameters](#set-bm25-parameters) for tuning results based on factors such as document size. 

For new services created after July 15, 2020, BM25 is used automatically and is the sole similarity algorithm. If you try to set similarity to ClassicSimilarity on a new service, an HTTP 400 error will be returned because that algorithm is not supported by the service.

For older services created before July 15, 2020, classic similarity remains the default algorithm. Older services can upgrade to BM25 on a per-index basis, as explained below. If you are switching from classic to BM25, you can expect to see some differences how search results are ordered.

> [!NOTE]
> Semantic ranking, currently in preview for standard services in selected regions, is an additional step forward in producing more relevant results. Unlike the other algorithms, it is an add-on feature that iterates over an existing result set. For more information, see [Semantic search overview](semantic-search-overview.md) and [Semantic ranking](semantic-ranking.md).

## Enable BM25 scoring on older services

If you are running a search service that was created prior to July 15, 2020, you can enable BM25 by setting a Similarity property on new indexes. The property is only exposed on new indexes, so if want BM25 on an existing index, you must drop and [rebuild the index](search-howto-reindex.md) with a new Similarity property set to "Microsoft.Azure.Search.BM25Similarity".

Once an index exists with a Similarity property, you can switch between BM25Similarity or ClassicSimilarity. 

The following links describe the Similarity property in the Azure SDKs. 

| Client library | Similarity property |
|----------------|---------------------|
| .NET  | [SearchIndex.Similarity](/dotnet/api/azure.search.documents.indexes.models.searchindex.similarity) |
| Java | [SearchIndex.setSimilarity](/java/api/com.azure.search.documents.indexes.models.searchindex.setsimilarity) |
| JavaScript | [SearchIndex.Similarity](/javascript/api/@azure/search-documents/searchindex#similarity) |
| Python | [similarity property on SearchIndex](/python/api/azure-search-documents/azure.search.documents.indexes.models.searchindex) |

### REST example

You can also use the [REST API](/rest/api/searchservice/create-index), as the following example illustrates:

```http
PUT https://[search service name].search.windows.net/indexes/[index name]?api-version=2020-06-30
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

## Set BM25 parameters

BM25 similarity adds two user customizable parameters to control the calculated relevance score. You can set BM25 parameters during index creation, or as an index update if the BM25 algorithm was specified during index creation.

| Property | Type | Description |
|----------|------|-------------|
| k1 | number | Controls the scaling function between the term frequency of each matching terms to the final relevance score of a document-query pair. Values are usually 0.0 to 3.0, with 1.2 as the default. </br></br>A value of 0.0 represents a "binary model", where the contribution of a single matching term is the same for all matching documents, regardless of how many times that term appears in the text, while a larger k1 value allows the score to continue to increase as more instances of the same term is found in the document. </br></br>Using a higher k1 value can be important in cases where we expect multiple terms to be part of a search query. In those cases, we might want to favor documents that match many of the different query terms being searched over documents that only match a single one, multiple times. For example, when querying the index for documents containing the terms "Apollo Spaceflight", we might want to lower the score of an article about Greek Mythology that contains the term "Apollo" a few dozen times, without mentions of "Spaceflight", compared to another article that explicitly mentions both "Apollo" and "Spaceflight" a handful of times only. |
| b | number | Controls how the length of a document affects the relevance score. Values are between 0 and 1, with 0.75 as the default. </br></br>A value of 0.0 means the length of the document will not influence the score, while a value of 1.0 means the impact of term frequency on relevance score will be normalized by the document's length. </br></br>Normalizing the term frequency by the document's length is useful in cases where we want to penalize longer documents. In some cases, longer documents (such as a complete novel), are more likely to contain many irrelevant terms, compared to much shorter documents. |

### Setting k1 and b parameters

To set or modify b or k1 values, add them to the BM25 similarity object. Setting or changing these values on an existing index will take the index offline for at least a few seconds, causing active indexing and query requests to fail. Consequently, you should set the "allowIndexDowntime=true" parameter of the update request:

```http
PUT https://[search service name].search.windows.net/indexes/[index name]?api-version=2020-06-30&allowIndexDowntime=true
{
    "similarity": {
        "@odata.type": "#Microsoft.Azure.Search.BM25Similarity",
        "b" : 0.5,
        "k1" : 1.3
    }
}
```

## See also  

+ [REST API Reference](/rest/api/searchservice/)
+ [Add scoring profiles to your index](index-add-scoring-profiles.md)
+ [Create Index API](/rest/api/searchservice/create-index)
+ [Azure Cognitive Search .NET SDK](/dotnet/api/overview/azure/search)