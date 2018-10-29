---
title: 'Partitioning in Azure Cosmos DB Gremlin API | Microsoft Docs'
description: Learn how you can use a partitioned Graph in Azure Cosmos DB.
services: cosmos-db
author: luisbosquez
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-graph
ms.devlang: na
ms.topic: conceptual
ms.date: 02/28/2018
ms.author: lbosq

---
# Using a partitioned graph in Azure Cosmos DB

One of the key features of the Gremlin API in Azure Cosmos DB is the ability to handle large-scale graphs through horizontal scalability. This process is achieved through the [partitioning capabilities in Azure Cosmos DB](partition-data.md#how-does-partitioning-work), which make use of containers, that can scale independently in terms of storage and throughput. Azure Cosmos DB supports the following types of containers across all APIs:

- **Fixed container**: These containers can store a graph database up to 10 GB in size with a maximum of 10,000 request units per second allocated to it. To create a fixed container it isn't necessary to specify a partition key property in the data.

- **Unlimited container**: These containers can automatically scale to store a graph beyond the 10-GB limit through horizontal partitioning. Each partition will store 10 GB and the data will be automatically balanced based on the **specified partition key**, which will be a required parameter when using an unlimited container. This type of container can store a virtually unlimited data size and can allow up to 100,000 request units per second, or more [by contacting support](https://aka.ms/cosmosdbfeedback?subject=Cosmos%20DB%20More%20Throughput%20Request).

In this document, the specifics on how graph databases are partitioned will be described along with its implications for both vertices (or nodes) and edges.

## Requirements for partitioned graph

The following are details that need to be understood when creating a partitioned graph container:

- **Setting up partitioning will be necessary** if the container is expected to be more than 10 GB in size and/or if allocating more than 10,000 request units per second (RU/s) will be required.

- **Both vertices and edges are stored as JSON documents** in the back-end of an Azure Cosmos DB Gremlin API container.

- **Vertices require a partition key**. This key will determine in which partition the vertex will be stored through a hashing algorithm. The name of this partition key is a single-word string without spaces or special characters, and it is defined when creating a new container using the format `/partitioning-key-name` on the portal.

- **Edges will be stored with their source vertex**. In other words, for each vertex its partition key will define where they will be stored along with its outgoing edges. This is done to avoid cross-partition queries when using the `out()` cardinality in graph queries.

- **Graph queries need to specify a partition key**. To take full advantage of the horizontal partitioning in Azure Cosmos DB, the partition key should be specified when a single vertex is selected, whenever it's possible. The following are queries for selecting one or multiple vertices in a partitioned graph:

    - `/id` and `/label` are not supported as partition keys for a container in Gremlin API..


    - Selecting a vertex by ID, then **using the `.has()` step to specify the partition key property**: 
    
        ```
        g.V('vertex_id').has('partitionKey', 'partitionKey_value')
        ```
    
    - Selecting a vertex by **specifying a tuple including partition key value and ID**: 
    
        ```
        g.V(['partitionKey_value', 'vertex_id'])
        ```
        
    - Specifying an **array of tuples of partition key values and IDs**:
    
        ```
        g.V(['partitionKey_value0', 'verted_id0'], ['partitionKey_value1', 'vertex_id1'], ...)
        ```
        
    - Selecting a set of vertices and **specifying a list of partition key values**: 
    
        ```
        g.V('vertex_id0', 'vertex_id1', 'vertex_id2', …).has('partitionKey', within('partitionKey_value0', 'partitionKey_value01', 'partitionKey_value02', …)
        ```

## Best practices when using a partitioned graph

The following are guidelines that should be followed to ensure the most efficient performance and scalability when using partitioned graphs in unlimited containers:

- **Always specify the partition key value when querying a vertex**. Obtaining a vertex from a known partition is the most efficient way in terms of performance.

- **Use the outgoing direction when querying edges whenever it's possible**. As mentioned above, edges are stored with their source vertices in the outgoing direction. This means that the chances of resorting to cross-partition queries are minimized when the data and queries are designed with this pattern in mind.

- **Choose a partition key that will evenly distribute data across partitions**. This decision heavily depends on the data model of the solution. Read more about creating an appropriate partition key in [Partitioning and scale in Azure Cosmos DB](partition-data.md).

- **Optimize queries to obtain data within the boundaries of a partition when possible**. An optimal partitioning strategy would be aligned to the querying patterns. Queries that obtain data from a single partition provide the best possible performance.

## Next steps
In this article, an overview of concepts and best practices for partitioning with an Azure Cosmos DB Gremlin API was provided. 

* Learn about [Partition and scale in Azure Cosmos DB](partition-data.md).
* Learn about the [Gremlin support in Gremlin API](gremlin-support.md).
* Learn about [Introduction to Gremlin API](graph-introduction.md).