---
title: Vector store
titleSuffix: Azure Cosmos DB for NoSQL
description: Use vector store in Azure Cosmos DB for NoSQL to enhance AI-based applications.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.custom:
  - Build 2024
  - build-2024
ms.topic: conceptual
ms.date: 5/7/2024
---

# Vector Search in Azure Cosmos DB for NoSQL (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB for NoSQL now offers vector indexing and search in preview. This feature is designed to handle high-dimensional vectors, enabling efficient and accurate vector search at any scale. You can now store vectors directly in the documents alongside your data. This means that each document in your database can contain not only traditional schema-free data, but also high-dimensional vectors as other properties of the documents. This colocation of data and vectors allows for efficient indexing and searching, as the vectors are stored in the same logical unit as the data they represent. This simplifies data management, AI application architectures, and the efficiency of vector-based operations. 

Azure Cosmos DB for NoSQL offers the flexibility it offers in choosing the vector indexing method: 
- A "flat" or k-nearest neighbors exact search (sometimes called brute-force) can provide 100% retrieval recall for smaller, focused vector searches. especially when combined with query filters and partition-keys.
- A quantized flat index that compresses vectors using DiskANN-based quantization methods for better efficiency in the kNN search.
- DiskANN, a suite of state-of-the-art vector indexing algorithms developed by Microsoft Research to power efficient, high accuracy vector search at any scale.

[Learn more about vector indexing here](../index-policy.md#vector-indexes)

  
Vector search in Azure Cosmos DB can be combined with all other supported Azure Cosmos DB NoSQL query filters and indexes using `WHERE` clauses. This enables your vector searches to be the most relevant data to your applications.

This feature enhances the core capabilities of Azure Cosmos DB, making it more versatile for handling vector data and search requirements in AI applications.

## What is a vector store?

A vector store or [vector database](../vector-database.md) is a database designed to store and manage vector embeddings, which are mathematical representations of data in a high-dimensional space. In this space, each dimension corresponds to a feature of the data, and tens of thousands of dimensions might be used to represent sophisticated data. A vector's position in this space represents its characteristics. Words, phrases, or entire documents, and images, audio, and other types of data can all be vectorized. 

## How does a vector store work?

In a vector store, vector search algorithms are used to index and query embeddings. Some well-known vector search algorithms include Hierarchical Navigable Small World (HNSW), Inverted File (IVF), DiskANN, etc. Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It's used to query the [vector embeddings](../../ai-services/openai/concepts/understand-embeddings.md) of your data that you created by using a machine learning model by using an embeddings API. Examples of embeddings APIs are [Azure OpenAI Embeddings](../../ai-services/openai/how-to/embeddings.md) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/). Vector search measures the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

In the Integrated Vector Database in Azure Cosmos DB for NoSQL, embeddings can be stored, indexed, and queried alongside the original data. This approach eliminates the extra cost of replicating data in a separate pure vector database. Moreover, this architecture keeps the vector embeddings and original data together, which better facilitates multi-modal data operations, and enables greater data consistency, scale, and performance.

## Enroll in the Vector Search Preview Feature
Vector search for Azure Cosmos DB for NoSQL requires preview feature registration on the Features page of your Azure Cosmos DB . Follow the below steps to register: 

1. Navigate to your Azure Cosmos DB for NoSQL resource page.
   
2. Select the "Features" pane under the "Settings" menu item.

3. Select for “Vector Search in Azure Cosmos DB for NoSQL”.

4. Read the description of the feature to confirm you want to enroll in the preview.

5. Select "Enable" to enroll in the preview. 

> [!NOTE]  
> The registration request will be autoapproved, however it may take several minutes to take effect.

> [!NOTE]  
> DiskANN is available in early gated-preview and requires filling out [this form](https://aka.ms/DiskANNSignUp). You'll be contacted by a member of the Azure Cosmos DB team when your resource has been onboarded to use the DiskANN index.

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](../free-tier.md)

## Container Vector Policies
Performing vector search with Azure Cosmos DB for NoSQL requires you to define a vector policy for the container. This provides essential information for the database engine to conduct efficient similarity search for vectors found in the container's documents. This also informs the vector indexing policy of necessary information, should you choose to specify one. The following information is included in the contained vector policy:

   * “path”: the property containing the vector (required).
   * “datatype”: the data type of the vector property (default Float32).  
   * “dimensions”: The dimensionality or length of each vector in the path. All vectors in a path should have the same number of dimensions. (default 1536).
   * “distanceFunction”: The metric used to compute distance/similarity (default Cosine). 
  
> [!NOTE]
> Each unique path can have at most one policy. However, multiple policies can be specified provided that they all target a different path.
 
The container vector policy can be described as JSON objects. Here are two examples of valid container vector policies:

**A policy with a single vector path**
```json
{
    "vectorEmbeddings": [
        {
            "path":"/vector1",
            "dataType":"float32",
            "distanceFunction":"cosine",
            "dimensions":1536
        }
    ]
}
```

**A policy with two vector paths**
```json
{
    "vectorEmbeddings": [
        {
            "path":"/vector1",
            "dataType":"float32",
            "distanceFunction":"cosine",
            "dimensions":1536
        },
        {
            "path":"/vector2",
            "dataType":"int8",
            "distanceFunction":"dotproduct",
            "dimensions":100
        }
    ]
}
```

## Vector indexing policies

**Vector** indexes increase the efficiency when performing vector searches using the `VectorDistance` system function. Vectors searches have lower latency, higher throughput, and less RU consumption when using a vector index.  You can specify the following types of vector index policies:

| Type | Description | Max dimensions |
| --- | --- |
| **`flat`** | Stores vectors on the same index as other indexed properties. | 505 |
| **`quantizedFlat`** | Quantizes (compresses) vectors before storing on the index. This can improve latency and throughput at the cost of a small amount of accuracy. | 4096 |
| **`diskANN`** | Creates an index based on DiskANN for fast and efficient approximate search. | 4096 |

A few points to note:
  - The `flat` and `quantizedFlat` index types uses Azure Cosmos DB's index to store and read each vector when performing a vector search. Vector searches with a `flat` index are brute-force searches and produce 100% accuracy or recall. That is, it's guaranteed to find the most similar vectors in the dataset. However, there's a limitation of `505` dimensions for vectors on a flat index.

  - The `quantizedFlat` index stores quantized (compressed) vectors on the index. Vector searches with `quantizedFlat` index are also brute-force searches, however their accuracy might be slightly less than 100% since the vectors are quantized before adding to the index. However, vector searches with `quantized flat` should have lower latency, higher throughput, and lower RU cost than vector searches on a `flat` index. This is a good option for smaller scenarios, or scenarios where you're using query filters to narrow down the vector search to a relatively small set of vectors. `quantizedFlat` should be used when there are at least 1,000 vectors and fewer than 100,000 vectors in the container.

  - The `diskANN` index is a separate index defined specifically for vectors using [DiskANN](https://www.microsoft.com/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/), a suite of high performance vector indexing algorithms developed by Microsoft Research. DiskANN indexes can offer some of the lowest latency, highest throughput, and lowest RU cost queries, while still maintaining high accuracy. However, since DiskANN is an approximate nearest neighbors (ANN) index, the accuracy can be lower than `quantizedFlat` or `flat`. DiskANN is available in early gated-preview and requires filling out [this form](https://aka.ms/DiskANNSignUp).

Here are examples of valid vector index policies:

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/_etag/?"
        }
    ],
    "vectorIndexes": [
        {
            "path": "/vector1",
            "type": "quantizedFlat"
        }
    ]
}
```

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/_etag/?"
        }
    ],
    "vectorIndexes": [
        {
            "path": "/vector1",
            "type": "quantizedFlat"
        },
        {
            "path": "/vector2",
            "type": "DiskANN"
        }
    ]
}
```
> [!NOTE]
> The Quantized Flat index requires that at least 1,000 vectors to be inserted. This is to ensure accuracy of the quantization process. If there are fewer than 1,000 vectors, a full scan is executed instead, and will lead to higher RU charges for a vector search query.

## Perform vector search with queries using VectorDistance()

Once you have created a container with the desired vector policy, and inserted vector data into the container, you can conduct a vector search using the [Vector Distance](query/vectordistance.md) system function in a query. An example of a NoSQL query that projects the similarity score as the alias `SimilarityScore`, and sorts in order of most-similar to least-similar is shown below:

```sql
SELECT c.title, VectorDistance(c.contentVector, [1,2,3]) AS SimilarityScore   
FROM c  
ORDER BY VectorDistance(c.contentVector, [1,2,3])   
```

## Current limits and constraints
Vector indexing and search in Azure Cosmos DB for NoSQL has some limitations while in early stages of public preview.
- You can specify, at most, one index type per path in the vector index policy
- You can specify, at most, one DiskANN index type per container
- Vector indexing is only supported on new containers.
- Vectors indexed with the `flat` index type can be at most 505 dimensions. Vectors indexed with the `quantizedFlat` or `DiskANN` index type can be at most 4,096 dimensions.
- `quantizedFlat` utilizes the same quantization method as DiskANN and is not configurable at this time. 
- Shared throughput databases can't use the vector search preview feature at this time.
- Ingestion rate should be limited while using an early preview of DiskANN.

## Next step
- [.NET - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [Python - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [JavaScript - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [Java - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [VectorDistance system function](query/vectordistance.md)
- [Vector index overview](../index-overview.md#vector-indexes)
- [Vector index policies](../index-policy.md#vector-indexes)
- [Manage index](how-to-manage-indexing-policy.md#vector-indexing-policy-examples)
