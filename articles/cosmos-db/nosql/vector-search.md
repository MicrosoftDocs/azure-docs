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
ms.topic: conceptual
ms.date: 5/7/2024
---

# Vector Store in Azure Cosmos DB for NoSQL

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Use the Integrated Vector Database in Azure Cosmos DB for NoSQL to seamlessly connect your AI-based applications with your data that's stored in Azure Cosmos DB. This integration can include apps that you built by using [Azure OpenAI embeddings](../../../ai-services/openai/tutorials/embeddings.md). The natively integrated vector database enables you to efficiently store, index, and query high-dimensional vector data that's stored directly in Azure Cosmos DB for NoSQL, along with the original data from which the vector data is created. It eliminates the need to transfer your data to alternative vector stores and incur additional costs.

## What is a vector store?

A vector store or [vector database](../../vector-database.md) is a database designed to store and manage vector embeddings, which are mathematical representations of data in a high-dimensional space. In this space, each dimension corresponds to a feature of the data, and tens of thousands of dimensions might be used to represent sophisticated data. A vector's position in this space represents its characteristics. Words, phrases, or entire documents, and images, audio, and other types of data can all be vectorized. 

## How does a vector store work?

In a vector store, vector search algorithms are used to index and query embeddings. Some well-known vector search algorithms include Hierarchical Navigable Small World (HNSW), Inverted File (IVF), DiskANN, etc. Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It is used to query the [vector embeddings](../../../ai-services/openai/concepts/understand-embeddings.md) (lists of numbers) of your data that you created by using a machine learning model by using an embeddings API. Examples of embeddings APIs are [Azure OpenAI Embeddings](/azure/ai-services/openai/how-to/embeddings) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/). Vector search measures the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

In the Integrated Vector Database in Azure Cosmos DB for NoSQL, embeddings can be stored, indexed, and queried alongside the original data. This approach eliminates the extra cost of replicating data in a separate pure vector database. Moreover, this architecture keeps the vector embeddings and original data together, which better facilitates multi-modal data operations, and enables greater data consistency, scale, and performance.

## Enroll in the preview feature
Vector search for Azure Cosmos DB for NoSQL requires preview feature registration at the subscription level using [Azure Feature Enablement Control (AFEC)](../../azure-resource-manager/management). Please follow the below steps to register: 

1. Navigate to your Subscription page. 

2. Under the “Settings” menu in the left panel, click on the “Preview features”. 

3. Search for “Vector” in the search bar for the Preview features. 

4. Check the “Vector search in Azure Cosmos DB for NoSQL” and click Register. 

This will enroll every Azure Cosmos DB resource in your subscription in the vector search preview. Please note that the registration request will be auto-approved, however it may take several minutes to take effect. 

## Create a container vector policy
Performing vector search with Azure Cosmos DB for NoSQL requires you to define a vector policy for the container. This provides essential information for the database engine to conduct efficient similarity search for vectors found in the container's documents. This also informs the vector indexing policy of necessary information, should you choose to specify one. The following information is included in the contain vector policy:

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

## Create a vector indexing policy



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

## Perform vector search with queries using VectorDistance()

Once you have created a container with the desired vector policy, and inserted vector data into the container, you can conduct a vector search using the [Vector Distance](query/vectordistance.md) system function in a query. An example of a NoSQL query that projects the similarity score as the alias `SimilarityScore`, and sorts in order of most-similar to least-similar is shown below:

```sql
SELECT c.title, VectorDistance(c.contentVector, [1,2,3]) AS SimilarityScore   
FROM c  
ORDER BY VectorDistance(c.contentVector, [1,2,3])   
```

## Current limits and constraints
Vector indexing and search in Azure Cosmos DB for NoSQL has some limitations while in early stages of public preview. These limitations and constraints will be eased in the future as improvements are released.
- You can specify, at most, one index type per path in the vector index policy
- You can specify, at most, one DiskANN index type per container
- Vector indexing an search is only supported on new Containers.
- Vectors indexed with the `flat` index type can be at most 505 dimensions. Vectors indexed with the `quantizedFlat` or `DiskANN` index type can be at most 4096 dimensions.
- `quantizedFlat` is based off Product Quantization 
- Shared throughput databases can't use the vector search preview feature at this time. 


## Next step
- [.NET - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [Python - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [JavaScript - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [Java - How-to Index and query vector data](how-to-python-vector-index-query.md)
- [VectorDistance system function](query/vectordistance.md)
- [Vector index overview](../index-overview.md#vector-indexes)
- [Vector index policies](../index-policy.md#vector-indexes)
- [Manage index](how-to-manage-indexing-policy.md#vector-indexing-policy-examples)
