---
title: Vector Search
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use vector indexing and search to integrate AI-based applications in Azure Cosmos DB for MongoDB vCore.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/1/2023
---

# Use vector search on embeddings in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Use vector search in Azure Cosmos DB for MongoDB vCore to seamlessly integrate your AI-based applications with your data that's stored in Azure Cosmos DB. This integration can include apps that you built by using [Azure OpenAI embeddings](../../../ai-services/openai/tutorials/embeddings.md). Vector search enables you to efficiently store, index, and query high-dimensional vector data that's stored directly in Azure Cosmos DB for MongoDB vCore. It eliminates the need to transfer your data to more expensive alternatives for vector search capabilities.

## What is vector search?

Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It works by taking the [vector representations](../../../ai-services/openai/concepts/understand-embeddings.md) (lists of numbers) of your data that you created by using a machine learning model by using an embeddings API. Examples of embeddings APIs are [Azure OpenAI Embeddings](/azure/ai-services/openai/how-to/embeddings) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/). It then measures the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

By integrating vector search capabilities natively, you can unlock the full potential of your data in applications that are built on top of the [OpenAI API](../../../ai-services/openai/concepts/understand-embeddings.md). You can also create custom-built solutions that use vector embeddings.

## Create a vector index
To perform vector similiarity search over vector properties in your documents, you'll have to first create a _vector index_.

### Create a vector index using HNSW

You can create (Hierarchical Navigable Small World) indexes on M40 cluster tiers and higher. To create the HSNW index, you need to create a vector index with the `"kind"` parameter set to `"vector-hnsw"` following the template below:

```javascript
{ 
    "createIndexes": "<collection_name>",
    "indexes": [
        {
            "name": "<index_name>",
            "key": {
                "<path_to_property>": "cosmosSearch"
            },
            "cosmosSearchOptions": { 
                "kind": "vector-hnsw", 
                "m": <integer_value>, 
                "efConstruction": <integer_value>, 
                "similarity": "<string_value>", 
                "dimensions": <integer_value> 
            } 
        } 
    ] 
}
```

|Field    |Type     |Description  |
|---------|---------|---------|
| `index_name` | string | Unique name of the index. |
| `path_to_property` | string | Path to the property that contains the vector. This path can be a top-level property or a dot notation path to the property. If a dot notation path is used, then all the nonleaf elements can't be arrays. Vectors must be a `number[]` to be indexed and return in vector search results.|
| `kind` | string | Type of vector index to create. The options are `vector-ivf` and `vector-hnsw`. Note `vector-ivf` is available on all cluster tiers and `vector-hnsw` is available on M40 cluster tiers and higher. |
|`m`        |integer    |The max number of connections per layer (`16` by default, minimum value is `2`, maximum value is `100`). Higher m is suitable for datasets with high dimensionality and/or high accuracy requirements.    |
|`efConstruction` |integer    |the size of the dynamic candidate list for constructing the graph (`64` by default, minimum value is `4`, maximum value is `1000`). Higher `efConstruction` will result in better index quality and higher accuracy, but it will also increase the time required to build the index. `efConstruction` has to be at least `2 * m`    |
|`similarity`     |string     |Similarity metric to use with the index. Possible options are `COS` (cosine distance), `L2` (Euclidean distance), and `IP` (inner product).    |
|`dimensions`     |integer     |Number of dimensions for vector similarity. The maximum number of supported dimensions is `2000`.     |

### Perform a vector search with HNSW
To perform a vector search, use the `$search` aggregation pipeline stage the query with the `cosmosSearch` operator.
```javascript
{
    "$search": {
        "cosmosSearch": {
            "vector": <query_vector>,
            "path": "<path_to_property>",
            "k": <num_results_to_return>,
            "efSearch": <integer_value>
        },
    }
  }
}

```
|Field    |Type     |Description  |
|---------|---------|---------|
|`efSearch`     |integer    |The size of the dynamic candidate list for search (`40` by default). A higher value provides better recall at the cost of speed.     |
|`k`        |integer    |The number of results to return. it should be less than or equal to `efSearch`    |

> [!NOTE]
> Creating an HSNW index with large datasets can result in your Azure Cosmos DB for MongoDB vCore resource running out of memory, or can limit the performance of other operations running on your database. If you encounter such issues, these can be mitigated by scaling your resource to a higher cluster tier, or reducing the size of the dataset.

### Create an vector index using IVF

To create a vector index using the IVF (Inverted File) algorithm, use the following `createIndexes` template and set the `"kind"` paramter to `"vector-ivf"`:

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
| `kind` | string | Type of vector index to create. The options are `vector-ivf` and `vector-hnsw`. Note `vector-ivf` is available on all cluster tiers and `vector-hnsw` is available on M40 cluster tiers and higher.  |
| `numLists` | integer | This integer is the number of clusters that the inverted file (IVF) index uses to group the vector data. We recommend that `numLists` is set to `documentCount/1000` for up to 1 million documents and to `sqrt(documentCount)` for more than 1 million documents. Using a `numLists` value of `1` is akin to performing brute-force search, which has limited performance. |
| `similarity` | string | Similarity metric to use with the index. Possible options are `COS` (cosine distance), `L2` (Euclidean distance), and `IP` (inner product). |
| `dimensions` | integer | Number of dimensions for vector similarity. The maximum number of supported dimensions is `2000`. |

> [!IMPORTANT]
> Setting the _numLists_ parameter correctly is important for acheiving good accuracy and performance. We recommend that `numLists` is set to `documentCount/1000` for up to 1 million documents and to `sqrt(documentCount)` for more than 1 million documents.
>
> As the number of items in your database grows, you should tune _numLists_ to be larger in order to achieve good latency performance for vector search.
>
> If you're experimenting with a new scenario or creating a small demo, you can start with `numLists` set to `1` to perform a brute-force search across all vectors. This should provide you with the most accurate results from the vector search, however be aware that the search speed and latency will be slow. After your initial setup, you should go ahead and tune the `numLists` parameter using the above guidance.

### Perform a vector search with IVF

To perform a vector search, use the `$search` aggregation pipeline stage in a MongoDB query. To use the `cosmosSearch` index, use the new `cosmosSearch` operator.

```json
{
  {
  "$search": {
    "cosmosSearch": {
        "vector": <query_vector>,
        "path": "<path_to_property>",
        "k": <num_results_to_return>,
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


> [!IMPORTANT]
> Vectors must be a `number[]` to be indexed. Using another type, such as `double[]`,  prevents the document from being indexed. Non-indexed documents won't be returned in the result of a vector search.

## Example using an HNSW index.

The following examples show you how to index vectors, add documents that have vector properties, perform a vector search, and retrieve the index configuration.

```javascript
use test;

db.createCollection("exampleCollection");

db.runCommand({ 
    "createIndexes": "exampleCollection",
    "indexes": [
        {
            "name": "VectorSearchIndex",
            "key": {
                "contentVector": "cosmosSearch"
            },
            "cosmosSearchOptions": { 
                "kind": "vector-hnsw", 
                "m": 16, 
                "efConstruction": 64, 
                "similarity": "COS", 
                "dimensions": 3
            } 
        } 
    ] 
});
```
This command creates an HNSW index against the `contentVector` property in the documents that are stored in the specified collection, `exampleCollection`. The `cosmosSearchOptions` property specifies the parameters for the HNSW vector index. If your document has the vector stored in a nested property, you can set this property by using a dot notation path. For example, you might use `text.contentVector` if `contentVector` is a subproperty of `text`.

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

Continuing with the last example, create another vector, `queryVector`. Vector search measures the distance between `queryVector` and the vectors in the `contentVector` path of your documents. You can set the number of results that the search returns by setting the parameter `k`, which is set to `2` here. You can also set `efSearch`, which is an integer that controls the size of the candidate vector list. A higher value may improve accuracy, however the search will be slower as a result. This is an optional parameter with a default value of 40.

```javascript
const queryVector = [0.52, 0.28, 0.12];
db.exampleCollection.aggregate([
  {
    "$search": {
        "cosmosSearch": {
            "vector": "queryVector",
            "path": "contentVector",
            "k": 2,
            "efSearch": 40
        },
    }
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
    key: { contentVector: 'cosmosSearch' },
    name: 'vectorSearchIndex',
    cosmosSearch: {
      kind: 'vector-hnsw',
      m: 40,
      efConstruction: 64
      similarity: 'COS',
      dimensions: 3
    },
    ns: 'test.exampleCollection'
  }
]
```

## Example using an IVF Index

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
  {
  "$search": {
    "cosmosSearch": {
        "vector": <vector_to_search>,
        "path": "<path_to_property>",
        "k": <num_results_to_return>,
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

Continuing with the last example, create another vector, `queryVector`. Vector search measures the distance between `queryVector` and the vectors in the `vectorContent` path of your documents. You can set the number of results that the search returns by setting the parameter `k`, which is set to `2` here. You can also set `nProbes`, which is an integer that controls the number of nearby clusters that are inspected in each search. A higher value may improve accuracy, however the search will be slower as a result. This is an optional parameter with a default value of 1 and cannot be larger than the `numLists` value specified in the vector index. 


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

## Filtered vector search (preview)
You can now execute vector searches with any supported query filter such as `$lt`, `$lte`, `$eq`, `$neq`, `$gte`, `$gt`, `$in`, `$nin`, and `$regex`. Enable the "filtering vector search" feature in the "Preview Features" tab of your Azure Subscription. Learn more about preview features [here](../../../azure-resource-manager/management/preview-features.md).

First, you'll need to define an index for your filter in addition to a vector index. For example, you can define the filter index on a property  

```javascript
db.runCommand({ 
     "createIndexes": "<collection_name",
    "indexes": [ {
        "key": { 
            "<property_to_filter>": 1 
               }, 
        "name": "<name_of_filter_index>" 
    }
    ] 
});
```

Next, you can add the `"filter"` term to your vector search as shown below. In this example the filter is looking for documents where the `"title"` property is not in the list of `["not in this text", "or this text"]`.

```javascript

db.exampleCollection.aggregate([
  {
      '$search': {
          "cosmosSearch": {
              "vector": "<query_vector>",
              "path": <path_to_vector>,
              "k": num_results,
              "filter": {<property_to_filter>: {"$nin": ["not in this text", "or this text"]}}
          },
          "returnStoredSource": True }},
      {'$project': { 'similarityScore': { '$meta': 'searchScore' }, 'document' : '$$ROOT' }
}
]);
```
> [!IMPORTANT]
> While in preview, filtered vector search may require you to adjust your vector index parameters to achieve higher accuracy. For example, increasing `m`, `efConstruction`, or `efSearch` when using HNSW, or `numLists`, or `nProbes` when using IVF, may lead to better results. You should test your configuration before use to ensure that the results are satisfactory. 

## Use LLM Orchestration tools

### Use as a vector database with Semantic Kernel
Use Semantic Kernel to orchestrate your information retrieval from Azure Cosmos DB for MongoDB vCore and your LLM. Learn more [here](https://github.com/microsoft/semantic-kernel/tree/main/python/semantic_kernel/connectors/memory/azure_cosmosdb).

https://github.com/microsoft/semantic-kernel/tree/main/python/semantic_kernel/connectors/memory/azure_cosmosdb

###  Use as a vector database with LangChain
Use LangChain to orchestrate your information retrieval from Azure Cosmos DB for MongoDB vCore and your LLM. Learn more [here](https://python.langchain.com/docs/integrations/vectorstores/azure_cosmos_db).

### Use as a semantic cache with LangChain
Use LangChain and Azure Cosmos DB for MongoDB (vCore) to orchestrate Semantic Caching, using previously recocrded LLM respones that can save you LLM API costs and reduce latency for responses. Learn more [here](https://python.langchain.com/docs/integrations/llms/llm_caching#azure-cosmos-db-semantic-cache)

## Features and limitations

- Supported distance metrics: L2 (Euclidean), inner product, and cosine.
- Supported indexing methods: IVFFLAT (GA), and HSNW (preview)
- Indexing vectors up to 2,000 dimensions in size.
- Indexing applies to only one vector per path.
- Only one index can be created per vector path.

## Summary

This guide demonstrates how to create a vector index, add documents that have vector data, perform a similarity search, and retrieve the index definition. By using vector search, you can efficiently store, index, and query high-dimensional vector data directly in Azure Cosmos DB for MongoDB vCore. Vector search enables you to unlock the full potential of your data via [vector embeddings](../../../ai-services/openai/concepts/understand-embeddings.md), and it empowers you to build more accurate, efficient, and powerful applications.

## Related content

- [With Semantic Kernel, orchestrate your data retrieval with Azure Cosmos DB for MongoDB vCore](/semantic-kernel/memories/vector-db#available-connectors-to-vector-databases)

## Next step

> [!div class="nextstepaction"]
> [Build AI apps with Azure Cosmos DB for MongoDB vCore vector search](vector-search-ai.md)
