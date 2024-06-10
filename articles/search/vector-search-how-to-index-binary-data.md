---
title: Index binary vectors for vector search
titleSuffix: Azure AI Search
description: Explains how to configure fields for binary vectors and the vector search configuration for querying the fields.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/30/2024
---

# Index binary vectors for vector search

Beginning with the 2024-05-01-preview REST API, Azure AI Search supports a packed binary type of `Collection(Edm.Byte)` for further reducing the storage and memory footprint of vector data. You can use this data type for output from models such as [Cohere's Embed v3 binary embedding models](https://cohere.com/blog/introducing-embed-v3).

There are three steps to configuring an index for binary vectors:

> [!div class="checklist"]
> + Add a vector search algorithm that specifies Hamming distance for binary vector comparison
> + Add a vector profile that points to the algorithm
> + Add the vector profile to your binary field definition

This article assumes you're familiar with [creating an index in Azure AI Search](search-how-to-create-search-index.md). It uses the REST APIs to illustrate each step. You can also add a binary field type to an index in the Azure portal.

## Prerequisites

+ Binary vectors, with 1 bit per dimension, packaged in uint8 values with 8 bits per value. These can be obtained by using models that directly generate "packaged binary" vectors, or by quantizing vectors into binary vectors client-side during indexing and searching.

## Limitations

+ No scalar compression or integrated vectorization support.
+ No Azure portal support in the Import and vectorize data wizard.
+ No support for binary fields in the [AML skill](cognitive-search-aml-skill.md) that's used for integrated vectorization of models in the Azure AI Studio model catalog.

## Add a vector search algorithm and vector profile

Vector search algorithms are used to create the query navigation structures during indexing. For binary vector fields, vector comparisons are performed using the Hamming distance metric. 

1. To add a binary field to an index, set up a [`Create or Update Index`](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true) request using the **2024-05-01-preview REST API** or the Azure portal.

1. In the index schema, add a `vectorSearch` section that specifies profiles and algorithms.

1. Add one or more [vector search algorithms](vector-search-ranking.md) that have a similarity metric of `hamming`. It's common to use Hierarchical Navigable Small Worlds (HNSW), but you can also use Hamming distance with exhaustive K-nearest neighbors.

1. Add one or more vector profiles that specify the algorithm. You can't specify scalar compression or a vectorizer in this preview.

The following example shows a basic `vectorSearch` configuration:

```json
  "vectorSearch": { 
    "profiles": [ 
      { 
        "name": "myHnswProfile", 
        "algorithm": "myHnsw", 
        "compression": null, 
        "vectorizer": null 
      } 
    ], 
    "algorithms": [ 
      { 
        "name": "myHnsw", 
        "kind": "hnsw", 
        "hnswParameters": { 
          "metric": "hamming" 
        } 
      }, 
      { 
        "name": "myExhaustiveKnn", 
        "kind": "exhaustiveKnn", 
        "exhaustiveKnnParameters": { 
          "metric": "hamming" 
        } 
      } 
    ] 
  }
```

## Add a binary field to an index

The fields collection of an index must include a field for the document key, vector fields, and any other fields that you need for hybrid search scenarios.

Binary fields are of type `Collection(Edm.Binary)` and contain embeddings in packed form. For example, if the original embedding dimension is `1024`, the packed binary vector length is `ceiling(1024 / 8) = 128`. You get the packed form by setting the `vectorEncoding` property on the field.

1. Add a field to the fields collection and give it name.
1. Set data type to `Collection(Edm.Binary)`.
1. Set `vectorEncoding` to `packedBit` for binary encoding. 
1. Set `dimensions` to `1024`. Specify the original (unpacked) vector dimension.
1. Set `vectorSearchProfile` to a profile you defined in the previous step.

The minimum definition of a fields collection should look similar to the following example:

```json
  "fields": [ 
    { 
      "name": "Id", 
      "type": "Edm.String", 
      "key": true, 
      "searchable": true 
    }, 
    { 
      "name": "my-binary-vector-field", 
      "type": "Collection(Edm.Byte)", 
      "vectorEncoding": "packedBit", 
      "dimensions": 1024, 
      "vectorSearchProfile": "myHnswProfile" 
    } 
  ]
```

## See also

Code samples in the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repository demonstrate end-to-end workflows that include schema definition, vectorization, indexing, and queries.

There's demo code for [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet), and [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).
