---
title: Vector Search in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn how to use vector indexing and search in Azure Cosmos DB for MongoDB vCore
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.date: 05/05/2023
---

# Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

In this article, you'll learn how to use the Vector Search feature in Azure Cosmos DB for MongoDB vCore to seamlessly integrate AI-based applications, including those built on Azure OpenAI embeddings, with the data already stored in Cosmos DB. This enables you to efficiently store, index, and query high dimensional vector data directly in Azure Cosmos DB for MongoDB vCore, eliminating the need to transfer your data to more expensive alternatives for vector search.

## What is Vector Search?
Vector search is a method that helps you find similar items in your data based on their characteristics rather than exact matches. This technique is particularly useful in applications such as searching for similar texts, finding related images, making recommendations, or even detecting anomalies in data. It works by representing data points as vectors (lists of numbers) in a high-dimensional space, and then measuring the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are most similar.

By integrating vector search capabilities natively, you can now unlock the full potential of your data in applications built on top of the OpenAI API, as well as your custom-built solutions that leverage vector embeddings.

## Getting started
By creating a vector index, you enable your database to efficiently search for similar items in your data based on their similarity.

### Create a vector index
To create a vector index, use the following createIndex Spec template:

```json
{
  "createIndexes": "collName",
  "indexes": [
    {
      "name": "vectorSearchIndex",
      "key": {
        "content": "cosmosSearch"
      },
      "cosmosSearchOptions": {
        "kind": "vector-ivf",
        "numLists": 100,
        "similarity": "COS",
        "dimensions": 3
      }
    }
  ]
}
```

In this example, a vector index is created on the content field in the collName collection. The index uses the following vector search options:

* kind: Specifies the type of index, which is set to "vector-ivf" for vector search using an inverted file index.
* numLists:
* similarity: Specifies the similarity metric used to measure the distance between vectors. It can be set to "COS" for cosine similarity, "L2" for Euclidean distance, or "IP" for inner product.
* dimensions: Indicates the number of dimensions in the vectors.

### Performing a Vector Similarity Search

To perform a vector similarity search, use the $search aggregation pipeline stage in a MongoDB query:

``` javascript
const queryVector = [0.52, 0.28, 0.12];
db.collName.aggregate([
  {
    $search: {
      "cosmosSearch": {
        "kind": "vector",
        "query": queryVector,
        "field": "content",
        "similarity": "COS",
        "version": "V1",
        "limit": 10
      }
    }
  }
]);
```

In this example, a vector similarity search is performed using the queryVector as input in the Mongo shell. The $search stage is configured with the following options:

* kind: Specifies the type of search, which is set to "vector" for vector search.
* query: The input query vector used for searching similar items.
* field: The field in the collection containing the vector data to be searched.
* similarity: Specifies the similarity metric used to measure the distance between vectors, the same as the one used when creating the index.
version: Indicates the version of the vector index, the same as the one used when creating the index.
* limit: The maximum number of results to be returned.

The result is a list of the most similar items to the query vector, sorted by their similarity scores.

## Features and limitations

* Can index vectors with up to 2,000 dimensions
* Supported distance metrics: L2 (Euclidean), inner product, and cosine
* Supported indexing methods: FLAT, IVFFLAT
* Indexing applies to only one vector per document (will support multi-vector indexing in future)

## Next steps

In this guide, we've demonstrated how to create a vector index and perform a vector similarity search in Cosmos DB for MongoDB vCore. By leveraging vector indexing, you can efficiently store, index, and query high-dimensional vector data directly in Azure Cosmos DB for MongoDB vCore, enabling the development of AI-based applications with ease. This powerful feature allows you to unlock insights from your data that were previously hidden or hard to find, leading to more accurate and powerful applications.

> [!div class="nextstepaction"]
> [Restore a Azure Cosmos DB for MongoDB vCore cluster](how-to-restore-cluster.md)
