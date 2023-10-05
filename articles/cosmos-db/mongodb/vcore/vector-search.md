---
title: Vector
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use vector indexing and search to integrate AI-based applications in Azure Cosmos DB for MongoDB vCore.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 08/28/2023
---

# Use vector search on embeddings in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Use vector search in Azure Cosmos DB for MongoDB vCore to seamlessly integrate your AI-based applications with your data that's stored in Azure Cosmos DB. This integration can include apps that you built by using [Azure OpenAI embeddings](../../../ai-services/openai/tutorials/embeddings.md). Vector search enables you to efficiently store, index, and query high-dimensional vector data that's stored directly in Azure Cosmos DB for MongoDB vCore. It eliminates the need to transfer your data to more expensive alternatives for vector search capabilities.

## What is vector search?

Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It works by taking the [vector representations](../../../ai-services/openai/concepts/understand-embeddings.md) (lists of numbers) of your data that you created by using a machine learning model by using an embeddings API. Examples of embeddings APIs are [Azure OpenAI Embeddings](/azure/ai-services/openai/how-to/embeddings) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/). It then measures the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

By integrating vector search capabilities natively, you can unlock the full potential of your data in applications that are built on top of the [OpenAI API](../../../ai-services/openai/concepts/understand-embeddings.md). You can also create custom-built solutions that use vector embeddings.

## Use the createIndexes template to create a vector index

To create a vector index, use the following `createIndexes` template:

```json
{
  "createIndexes": "<collection_name>",
  "indexes": [
    {
      "name": "<index_name>",
      "key": {
        "<path_to_property>": "cosmosSearch"
      },
      "cosmosSearchOptions": {
        "kind": "vector-ivf",
        "numLists": <integer_value>,
        "similarity": "<string_value>",
        "dimensions": <integer_value>
      }
    }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `index_name` | string | Unique name of the index. |
| `path_to_property` | string | Path to the property that contains the vector. This path can be a top-level property or a dot notation path to the property. If a dot notation path is used, then all the nonleaf elements can't be arrays. Vectors must be a `number[]` to be indexed and return in vector search results.|
| `kind` | string | Type of vector index to create. Currently, `vector-ivf` is the only supported index option. |
| `numLists` | integer | This integer is the number of clusters that the inverted file (IVF) index uses to group the vector data. We recommend that `numLists` is set to `documentCount/1000` for up to 1 million documents and to `sqrt(documentCount)` for more than 1 million documents. Using a `numLists` value of `1` is akin to performing brute-force search, which has limited performance. |
| `similarity` | string | Similarity metric to use with the IVF index. Possible options are `COS` (cosine distance), `L2` (Euclidean distance), and `IP` (inner product). |
| `dimensions` | integer | Number of dimensions for vector similarity. The maximum number of supported dimensions is `2000`. |

> [!IMPORTANT]
> Setting the _numLists_ parameter correctly is important for acheiving good accuracy and performance. We recommend that `numLists` is set to `documentCount/1000` for up to 1 million documents and to `sqrt(documentCount)` for more than 1 million documents.
>
> As the number of items in your database grows, you should tune _numLists_ to be larger in order to achieve good latency performance for vector search.
>
> If you're experimenting with a new scenario or creating a small demo, you can start with `numLists` set to `1` to perform a brute-force search across all vectors. This should provide you with the most accurate results from the vector search, however be aware that the search speed and latency will be slow. After your initial setup, you should go ahead and tune the `numLists` parameter using the above guidance.

> [!IMPORTANT]
> Vectors must be a `number[]` to be indexed. Using another type, such as `double[]`,  prevents the document from being indexed. Non-indexed documents won't be returned in the result of a vector search.

## Examples

The following examples show you how to index vectors, add documents that have vector properties, perform a vector search, and retrieve the index configuration.

### Create a vector index

```javascript
use test;

db.createCollection("exampleCollection");

db.runCommand({
  createIndexes: 'exampleCollection',
  indexes: [
    {
      name: 'vectorSearchIndex',
      key: {
        "vectorContent": "cosmosSearch"
      },
      cosmosSearchOptions: {
        kind: 'vector-ivf',
        numLists: 3,
        similarity: 'COS',
        dimensions: 3
      }
    }
  ]
});
```

This command creates a `vector-ivf` index against the `vectorContent` property in the documents that are stored in the specified collection, `exampleCollection`. The `cosmosSearchOptions` property specifies the parameters for the IVF vector index. If your document has the vector stored in a nested property, you can set this property by using a dot notation path. For example, you might use `text.vectorContent` if `vectorContent` is a subproperty of `text`.

### Add vectors to your database

To add vectors to your database's collection, you first need to create the [embeddings](../../../ai-services/openai/concepts/understand-embeddings.md) by using your own model, [Azure OpenAI Embeddings](../../../cognitive-services/openai/tutorials/embeddings.md), or another API (such as [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/)). In this example, new documents are added through sample embeddings:

```javascript
db.exampleCollection.insertMany([
  {name: "Eugenia Lopez", bio: "Eugenia is the CEO of AdvenureWorks.", vectorContent: [0.51, 0.12, 0.23]},
  {name: "Cameron Baker", bio: "Cameron Baker CFO of AdvenureWorks.", vectorContent: [0.55, 0.89, 0.44]},
  {name: "Jessie Irwin", bio: "Jessie Irwin is the former CEO of AdventureWorks and now the director of the Our Planet initiative.", vectorContent: [0.13, 0.92, 0.85]},
  {name: "Rory Nguyen", bio: "Rory Nguyen is the founder of AdventureWorks and the president of the Our Planet initiative.", vectorContent: [0.91, 0.76, 0.83]},
]);
```

### Perform a vector search

To perform a vector search, use the `$search` aggregation pipeline stage in a MongoDB query. To use the `cosmosSearch` index, use the new `cosmosSearch` operator.

```json
{
  "$search": {
    "cosmosSearch": {
        "vector": <vector_to_search>,
        "path": "<path_to_property>",
        "k": <num_results_to_return>
      },
      "returnStoredSource": True }},
  {
    "$project": { "<custom_name_for_similarity_score>": {
           "$meta": "searchScore" },
            "document" : "$$ROOT"
        }
  }
}
```
To retrieve the similarity score (`searchScore`) along with the documents found by the vector search, use the `$project` operator to include `searchScore` and rename it as `<custom_name_for_similarity_score>` in the results. Then the document is also projected as nested object. Note that the similarity score is calculated using the metric defined in the vector index.

### Query vectors and vector distances (aka similarity scores) using $search"

Continuing with the last example, create another vector, `queryVector`. Vector search measures the distance between `queryVector` and the vectors in the `vectorContent` path of your documents. You can set the number of results that the search returns by setting the parameter `k`, which is set to `2` here.

```javascript
const queryVector = [0.52, 0.28, 0.12];
db.exampleCollection.aggregate([
  {
    $search: {
      "cosmosSearch": {
        "vector": queryVector,
        "path": "vectorContent",
        "k": 2
      },
    "returnStoredSource": true }},
  {
    "$project": { "similarityScore": {
           "$meta": "searchScore" },
            "document" : "$$ROOT"
        }
  }
]);
```

In this example, a vector search is performed by using `queryVector` as an input via the Mongo shell. The search result is a list of two items that are most similar to the query vector, sorted by their similarity scores.

```javascript
[
  {
    similarityScore: 0.9465376,
    document: {
      _id: ObjectId("645acb54413be5502badff94"),
      name: 'Eugenia Lopez',
      bio: 'Eugenia is the CEO of AdvenureWorks.',
      vectorContent: [ 0.51, 0.12, 0.23 ]
    }
  },
  {
    similarityScore: 0.9006955,
    document: {
      _id: ObjectId("645acb54413be5502badff97"),
      name: 'Rory Nguyen',
      bio: 'Rory Nguyen is the founder of AdventureWorks and the president of the Our Planet initiative.',
      vectorContent: [ 0.91, 0.76, 0.83 ]
    }
  }
]
```

### Get vector index definitions

To retrieve your vector index definition from the collection, use the `listIndexes` command:

``` javascript
db.exampleCollection.getIndexes();
```

In this example, `vectorIndex` is returned with all the `cosmosSearch` parameters that were used to create the index:

```javascript
[
  { v: 2, key: { _id: 1 }, name: '_id_', ns: 'test.exampleCollection' },
  {
    v: 2,
    key: { vectorContent: 'cosmosSearch' },
    name: 'vectorSearchIndex',
    cosmosSearch: {
      kind: 'vector-ivf',
      numLists: 3,
      similarity: 'COS',
      dimensions: 3
    },
    ns: 'test.exampleCollection'
  }
]
```

## Features and limitations

- Supported distance metrics: L2 (Euclidean), inner product, and cosine.
- Supported indexing methods: IVFFLAT.
- Indexing vectors up to 2,000 dimensions in size.
- Indexing applies to only one vector per document.

## Next steps

This guide demonstrates how to create a vector index, add documents that have vector data, perform a similarity search, and retrieve the index definition. By using vector search, you can efficiently store, index, and query high-dimensional vector data directly in Azure Cosmos DB for MongoDB vCore. Vector search enables you to unlock the full potential of your data via [vector embeddings](../../../ai-services/openai/concepts/understand-embeddings.md), and it empowers you to build more accurate, efficient, and powerful applications.

> [!div class="nextstepaction"]
> [Build AI apps with Azure Cosmos DB for MongoDB vCore vector search](vector-search-ai.md)
