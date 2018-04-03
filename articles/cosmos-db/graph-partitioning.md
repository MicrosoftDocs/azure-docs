---
title: 'Graph API Partitioning | Microsoft Docs'
description: Learn how you can use a partitioned Graph in Azure Cosmos DB.
services: cosmos-db
author: luisbosquez
documentationcenter: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 02/28/2018
ms.author: lbosq

---
# Using a partitioned graph in Azure Cosmos DB

One of the key features of the Graph API in Azure Cosmos DB is the ability to handle large-scale graphs through horizontal scalability. This process is achieved through the [partitioning capabilities in Cosmos DB](partition-data.md#how-does-partitioning-work), which make use of collections, also referred to as containers, that can scale independently in terms of storage and throughput. Cosmos DB Graph API uses the same types of collections for all Cosmos DB APIs:

- Fixed Collection: These collections can store a graph database up to 10 GB in size with a maximum of 10,000 request units per second allocated to it. To create a fixed collection it isn't necessary to specify a partitioning key property in the data.

- Unlimited Collection: These collections can automatically scale to store a graph beyond the 10-GB limit through horizontal partitioning. Each partition will store 10 GB and the data will be automatically balanced based on the **specified partitioning key**, which will be a required parameter when using an unlimited collection. This type of collection can store a virtually unlimited data size and can allow up to 100,000 request units per second, or more [by contacting support](https://aka.ms/cosmosdbfeedback?subject=Cosmos%20DB%20More%20Throughput%20Request).

In this document, the specifics on how graph databases are partitioned will be described along with its implications for both vertices (or nodes) and edges. The following are considerations that should be followed when creating a partitioned graph collection.

## Necessary options for partitioned graph databases

For a graph database, the following are details that need to be understood when partitioning a graph database:
- **Setting up partitioning will be necessary** if the collection is expected to be more than 10 GB in size and/or if allocating more than 10,000 request units per second (RU/s) will be required.
- **Both vertices and edges are stored as documents** in the back-end of Cosmos DB Graph API. These objects stored in the JSON format in the storage layer.
- **Vertices require a partitioning key**. This key will determine in which partition the vertex will be stored through a hashing algorithm. The name of this partitioning key is a single-word string without spaces or special characters, and it is defined when creating a new collection using the format `/partitioning-key-name` on the portal.
- **Edges will be stored with their source vertex**. In other words, for each vertex its partitioning key will define where they will be stored along with its outgoing edges. This is done to avoid cross-partition queries when using the `out()` cardinality in graph queries.
- **Graph queries need to specify a partitioning key**. To take full advantage of the horizontal partitioning in Cosmos DB, the partitioning key should be specified whenever a single vertex is selected. The following are queries for inserting vertices in partitioned collections:
    - Selecting a vertex by ID, then **filtering by the partitioning key property**: 
        `g.V('vertex_id').has('partitionKey', 'partitionKey_value')`
    - Specifying an **array of tuples of partition key values and IDs**: 
        `g.V(['pk0', 'id0'], ['pk1', 'id1'], ...)`
    - Selecting a vertex by **specifying a tuple including partitioning key value and ID**: 
        `g.V(['partitionKey_value', 'vertex_id'])`
    - Selecting a set of vertices and **specifying a list of partitioning key values**: 
        `g.V('vertex_id0', 'vertex_id1', 'vertex_id2', …).has('partitionKey', within('partitionKey_value0', 'partitionKey_value01', 'partitionKey_value02', …)`
    - **Specifying a Partition Strategy** before selecting a vertex: 
        `g.withStrategies(PartitionStrategy.build().partitionKey('partitionKey').readPartitions('partitionKey_value').create()).V('vertex_id')`

## Best practices when using a partitioned graph

The following are guidelines that should be followed to ensure the most efficient performance and scalability when using partitioned graphs in unlimited collections:
- **Always specify the partitioning key value when querying a vertex**. Obtaining a vertex from a known partition is the most efficient way in terms of performance.
- **Use the outgoing direction when querying edges whenever it's possible**. As mentioned above, edges are stored with their source vertices in the outgoing direction. This means that the chances of resorting to cross-partition queries are minimized when the data and queries are designed with this pattern in mind.
- **Choose a partitioning key that will evenly distribute data across partitions**. This decision heavily depends on the model of the data. A partitioning key should be chosen when its value can be hashed evenly into different partitions. This behavior will increase the chances of queries not resorting to cross-partition lookups. A random value for the partition key would provide an approximate even distribution of the data for the partitions when no other attribute can be chosen.
- **Optimize queries to obtain data within the boundaries of a partition**. An optimal partitioning strategy would be aligned to the querying patterns. Queries that obtain data from a single partition provide the best possible performance.

## Next steps
In this article, an overview of concepts and best practices for partitioning with an Azure Cosmos DB Graph API was provided. 

* Learn about [Partition and scale in Azure Cosmos DB](partition-data.md).
* Learn about the [Gremlin support in Graph API](gremlin-support.md).
* Learn about [Introduction to Graph API](graph-introduction.md).
