---
title: Ranking Similarity Algorithm
titleSuffix: Azure Cognitive Search
description: How to set the similarity algorithm to try new similarity algorithm for ranking

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/13/2020
---

# Ranking algorithm in Azure Cognitive Search

> [!IMPORTANT]
> Starting July 15, 2020, newly created search services will use the BM25 ranking function automatically, which has proven in most cases to provide search rankings that align better with user expectations than the current default ranking. Beyond superior ranking, BM25 also enables configuration options for tuning results based on factors such as document size.  
>
> With this change, you will most likely see slight changes in the ordering of your search results. For those who want to test the impact of this change, the BM25 algorithm is available in the api-version 2019-05-06-Preview and in 2020-06-30.  

This article describes how you can use the new BM25 ranking algorithm on existing search services for new indexes created and queried using the preview API.

Azure Cognitive Search is in the process of adopting the official Lucene implementation of the Okapi BM25 algorithm, *BM25Similarity*, which will replace the previously used *ClassicSimilarity* implementation. Like the older ClassicSimilarity algorithm, BM25Similarity is a TF-IDF-like retrieval function that uses the term frequency (TF) and the inverse document frequency (IDF) as variables to calculate relevance scores for each document-query pair, which is then used for ranking. 

While conceptually similar to the older Classic Similarity algorithm, BM25 takes its root in probabilistic information retrieval to improve upon it. BM25 also offers advanced customization options, such as allowing the user to decide how the relevance score scales with the term frequency of matched terms.

## How to test BM25 today

When you create a new index, you can set a **similarity** property to specify the algorithm. You can use the `api-version=2019-05-06-Preview`, as shown below, or `api-version=2020-06-30`.

```
PUT https://[search service name].search.windows.net/indexes/[index name]?api-version=2019-05-06-Preview
```

```json  
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

The **similarity** property is useful during this interim period when both algorithms are available, on existing services only. 

| Property | Description |
|----------|-------------|
| similarity | Optional. Valid values include *"#Microsoft.Azure.Search.ClassicSimilarity"* or *"#Microsoft.Azure.Search.BM25Similarity"*. <br/> Requires `api-version=2019-05-06-Preview` or later on a search service created prior to July 15, 2020. |

For new services created after July 15, 2020, BM25 is used automatically and is the sole similarity algorithm. If you try to set **similarity** to `ClassicSimilarity` on a new service, a 400 error will be returned because that algorithm is not supported on a new service.

For existing services created before July 15, 2020, the Classic similarity remains the default algorithm. If the **similarity** property is omitted or set to null, the index uses the Classic algorithm. If you want to use the new algorithm, you will need to set **similarity** as described above.

## BM25 similarity parameters

BM25 similarity adds two user customizable parameters to control the calculated relevance score.

### k1

The *k1* parameter controls the scaling function between the term frequency of each matching terms to the final relevance score of a document-query pair.

A value of zero represents a "binary model", where the contribution of a single matching term is the same for all matching documents, regardless of how many times that term appears in the text, while a larger k1 value allows the score to continue to increase as more instances of the same term is found in the document. By default, Azure Cognitive Search uses a value of 1.2 for the k1 parameter. Using a higher k1 value can be important in cases where we expect multiple terms to be part of a search query. In those cases, we might want to favor documents that match many of the different query terms being searched over documents that only match a single one, multiple times. For example, when querying the index for documents containing the terms "Apollo Spaceflight", we might want to lower the score of an article about Greek Mythology which contains the term "Apollo" a few dozen times, without mentions of "Spaceflight", compared to another article which explicitly mentions both "Apollo" and "Spaceflight" a handful of times only. 
 
### b

The *b* parameter controls how the length of a document affects the relevance score.

A value of 0.0 means the length of the document will not influence the score, while a value of 1.0 means the impact of term frequency on relevance score will be normalized by the document's length. The default value used in Azure Cognitive Search for the b parameter is 0.75. Normalizing the term frequency by the document's length is useful in cases where we want to penalize longer documents. In some cases, longer documents (such as a complete novel), are more likely to contain many irrelevant terms, compared to much shorter documents.

### Setting k1 and b parameters

To customize the b or k1 values, simply add them as properties to the similarity object when using BM25:

```json
    "similarity": {
        "@odata.type": "#Microsoft.Azure.Search.BM25Similarity",
        "b" : 0.5,
        "k1" : 1.3
    }
```

The similarity algorithm can only be set at index creation time. This means the similarity algorithm being used cannot be changed for existing indexes. The *"b"* and *"k1"* parameters can be modified when updating an existing index definition that uses BM25. Changing those values on an existing index will take the index offline for at least a few seconds, causing your indexing and query requests to fail. Because of that, you will need to set the "allowIndexDowntime=true" parameter in the query string of your update request:

```http
PUT https://[search service name].search.windows.net/indexes/[index name]?api-version=[api-version]&allowIndexDowntime=true
```

## See also  

+ [REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)   
+ [Add scoring profiles to your index](index-add-scoring-profiles.md)    
+ [Create Index API](https://docs.microsoft.com/rest/api/searchservice/create-index)   
+ [Azure Cognitive Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search?view=azure-dotnet)  
