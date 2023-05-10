---
title: Vector search on high-dimensional vector data
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use vector indexing and search to integrate AI-based applications in Azure Cosmos DB for MongoDB vCore
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 05/10/2023
---

# Using Vector Search on high-dimensional vector data in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Use Vector Search in Azure Cosmos DB for MongoDB vCore to seamlessly integrate your AI-based applications, including apps built using [Azure OpenAI embeddings](../../../cognitive-services/openai/tutorials/embeddings.md), with your data stored in Azure Cosmos DB. This enables you to efficiently store, index, and query high dimensional vector data stored directly in Azure Cosmos DB for MongoDB vCore, eliminating the need to transfer your data to more expensive alternatives for vector search capabilities.

## What is Vector search?

Vector search is a method that helps you find similar items based on their data characteristics rather than exact matches on a property field. This technique is useful in applications such as searching for similar texts, finding related images, making recommendations, or even detecting anomalies in data. It works by representing data points as vectors (lists of numbers) in a high-dimensional space, and then measuring the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

By integrating vector search capabilities natively, you can now unlock the full potential of your data in applications built on top of the OpenAI API, and your custom-built solutions that use vector embeddings.

## Create a vector index
To create a vector index, use the following createIndex Spec template:

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
| `index_name` | `string` | Unique name of the index. |
| `path_to_property` | `string` | Path to the property containing the vector. This can be a top-level property or a `dot-notation` path to the property. If a `dot-notation` path is used, then all the nonleaf elements can't be arrays. |
| `kind` | `string` | Type of vector index to create. Currently, "vector-ivf" is the only supported index option. |
| `numLists` | `integer` | This is number of clusters the IVF index uses to group the vector data. It's recommended that numLists be set to `rowCount()/1000` for up to 1M rows and `sqrt(rowCount)` for more than 1M rows. |
| `similarity` | `string` | Similarity metric to use with the IVF index. Possible options are `COS` (cosine distance), `L2` (Euclidean distance) or `IP` (inner product) |
| `dimensions` | `integer` | Number of dimensions for vector similarity. The maximum number of supported dimensions is 2000. |

In the examples below, we'll walk through steps how to vector indexing, adding data, vector search, and retrieving the index configuration.


### Create a vectorIndex

```javascript
use test
db.runCommand({createIndexes: 'myCollection', indexes: [{ name: 'vectorSearchIndex', key: { "vectorContent": "cosmosSearch" }, cosmosSearchOptions: { kind: 'vector-ivf', numLists: 100, similarity: 'COS', dimensions: 3 } }]})
```

This command creates a "vector-ivf" index against the "vectorContent" property in the documents stored in the "myCollection" collection. The cosmosSearchOptions specify the parameters for the IVF vector index. If your document has the vector stored in a nested property, you can set this in the key using a dot-notation path. For example, `text.vectorContent` if `vectorContent` is a subproperty of `text`.


## Adding vectors to your database

To add vectors to your database's existing collection, you can use the OpenAI Embeddings model, another API (such as HuggingFace), or your own model to generate embeddings from the data. In the example below, new documents are added with sample embeddings:

```javascript
db.myCollection.insertMany([
  {name: "Satya Nadella", bio: "Satya is th current Chairman & CEO of Microsoft.", vectorContent: [0.51, 0.12, 0.23]},
  {name: "Amy Hood", bio: "Amy Hood is the current CFO of Microsoft.", vectorContent: [0.55, 0.89, 0.44]},
  {name: "Steve Balmer", bio: "Steve is the former CEO of Microsoft and the owner of the LA Clippers NBA team.", vectorContent: [0.13, 0.92, 0.85]},
  {name: "Bill Gates", bio: "Bill gates is the co-founder of Microsoft and the Bill & Melinda Gates Foundation.", vectorContent: [0.91, 0.76, 0.83]},
]);
```

### Performing a vector search

To perform a vector search, use the `$search` aggregation pipeline stage in a MongoDB query. To use the `cosmosSearch` index, we have introduced a new `cosmosSearch` operator 

```json
{
  "$search": {
    "cosmosSearch": {
        "vector": <vector_to_search>,
        "path": "<path_to_property>",
        "k": <num_results_to_return>
      }
    ...
  }
}
```

### Query a vectorIndex using $search
Continuing with the above example, to query for the documents inserted in the previous step:

```javascript
const queryVector = [0.52, 0.28, 0.12];
db.myCollection.aggregate([
  {
    $search: {
      "cosmosSearch": {
        "vector": queryVector,
        "path": "vectorContent",
        "k": 2
      },
	  "returnStoredSource": true
    }
  }
]);
```

In this example, a vector search is performed using the queryVector as input via the Mongo shell. The result is a list of the two most similar items to the query vector, sorted by their similarity scores.

```javascript
[
  {
    _id: ObjectId("645acb54413be5502badff94"),
    name: 'Satya Nadella',
    bio: 'Satya is th current Chairman & CEO of Microsoft.',
    vectorContent: [ 0.51, 0.12, 0.23 ]
  },
  {
    _id: ObjectId("645acb54413be5502badff97"),
    name: 'Bill Gates',
    bio: 'Bill gates is the co-founder of Microsoft and the Bill & Melinda Gates Foundation.',
    vectorContent: [ 0.91, 0.76, 0.83 ]
  }
]
```

### Get vector index definitions
Vector index definitions are returned as part of the `listIndexes` command. 

``` javascript
db.myCollection.getIndexes();
```
In this example, the vectorIndex is returned along with all the cosmosSearch parameters used to create the index

```javascript
[
  { v: 2, key: { _id: 1 }, name: '_id_', ns: 'test.myCollection' },
  {
    v: 2,
    key: { vectorContent: 'cosmosSearch' },
    name: 'vectorSearchIndex',
    cosmosSearch: {
      kind: 'vector-ivf',
      numLists: 100,
      similarity: 'COS',
      dimensions: 3
    },
    ns: 'test.myCollection'
  }
]
```

## Features and limitations

* Supported distance metrics: L2 (Euclidean), inner product, and cosine.
* Supported indexing methods: IVFFLAT.
* Indexing vectors up to 2,000 dimensions in size.
* Indexing applies to only one vector per document.

## Next steps

In this guide, we've demonstrated how to create a vector index, add documents with vector data, perform a vector similarity search, and retrieve the vector index definition in Cosmos DB for MongoDB vCore. By leveraging vector search, you can efficiently store, index, and query high-dimensional vector data directly in Azure Cosmos DB for MongoDB vCore, enabling the development of AI-based applications with ease. This enables you to unlock the full potential of your data with vector embeddings, and empowers you to build more accurate, efficient, and powerful applications.

> [!div class="nextstepaction"]
> [Restore a Azure Cosmos DB for MongoDB vCore cluster](how-to-restore-cluster.md)