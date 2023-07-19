---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: Use Azure Cosmos DB for Apache Gremlin to store, query, and traverse massive graphs with the Gremlin graph query language of Apache TinkerPop.
author: manishmsfte
ms.author: mansha
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: overview
ms.date: 02/28/2023
ms.custom: ignite-2022
---

# What is Azure Cosmos DB for Apache Gremlin?

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for Apache Gremlin is a graph database service that can be used to store massive graphs with billions of vertices and edges. You can query the graphs with millisecond latency and evolve the graph structure easily. The API for Gremlin is built based on [Apache TinkerPop](https://tinkerpop.apache.org), a graph computing framework that uses the Gremlin query language.

> [!IMPORTANT]
> Azure Cosmos DB graph engine closely follows Apache TinkerPop specification. However, there are some differences in the implementation details that are specific for Azure Cosmos DB. Some features supported by Apache TinkerPop are not available in Azure Cosmos DB, to learn more about the unsupported features, see [compatibility with Apache TinkerPop](support.md) article.

The API for Gremlin combines the power of graph database algorithms with highly scalable, managed infrastructure. This approach provides a unique and flexible solution to common data problems associated with inflexible or relational constraints.

> [!TIP]
> Want to try the API for Gremlin with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## API for Gremlin benefits

The API for Gremlin has added benefits of being built on Azure Cosmos DB:

- **Elastically scalable throughput and storage**: Graphs in the real world need to scale beyond the capacity of a single server. Azure Cosmos DB supports horizontally scalable graph databases that can have an unlimited size in terms of storage and provisioned throughput. As the graph database scale grows, the data is automatically distributed using [graph partitioning](./partitioning.md).

- **Multi-region replication**: Azure Cosmos DB can automatically replicate your graph data to any Azure region worldwide. Global replication simplifies the development of applications that require global access to data. In addition to minimizing read and write latency anywhere around the world, Azure Cosmos DB provides a service-managed regional failover mechanism. This mechanism can ensure the continuity of your application in the rare case of a service interruption in a region.

- **Fast queries and traversals with the most widely adopted graph query standard**: Store heterogeneous vertices and edges and query them through a familiar Gremlin syntax. Gremlin is an imperative, functional query language that provides a rich interface to implement common graph algorithms. The API for Gremlin enables rich real-time queries and traversals without the need to specify schema hints, secondary indexes, or views. For more information, see [query graphs by using Gremlin](tutorial-query.md).

- **Fully managed graph database**: Azure Cosmos DB eliminates the need to manage database and machine resources. Most existing graph database platforms are bound to the limitations of their infrastructure and often require a high degree of maintenance to ensure its operation. As a fully managed service, Cosmos DB removes the need to manage virtual machines, update runtime software, manage sharding or replication, or deal with complex data-tier upgrades. Every graph is automatically backed up and protected against regional failures. This management allows developers to focus on delivering application value instead of operating and managing their graph databases.

- **Automatic indexing**: By default, the API for Gremlin automatically indexes all the properties within nodes (also called as vertices) and edges in the graph and doesn't expect or require any schema or creation of secondary indices. For more information, see [indexing in Azure Cosmos DB](../index-overview.md).

- **Compatibility with Apache TinkerPop**: The API for Gremlin supports the [open-source Apache TinkerPop standard](https://tinkerpop.apache.org/). The Apache TinkerPop standard has an ample ecosystem of applications and libraries that can be easily integrated with the API.

- **Tunable consistency levels**: Azure Cosmos DB provides five well-defined consistency levels to achieve the right tradeoff between consistency and performance for your application. For queries and read operations, Azure Cosmos DB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow you to make sound tradeoffs among consistency, availability, and latency. For more information, see [tunable data consistency levels in Azure Cosmos DB](../consistency-levels.md).

## Common scenarios for API for Gremlin

Here are some scenarios where graph support of Azure Cosmos DB can be useful:

- **Social networks/Customer 365**: By combining data about your customers and their interactions with other people, you can develop personalized experiences, predict customer behavior, or connect people with others with similar interests. Azure Cosmos DB can be used to manage social networks and track customer preferences and data.

- **Recommendation engines**: This scenario is commonly used in the retail industry. By combining information about products, users, and user interactions, like purchasing, browsing, or rating an item, you can build customized recommendations. The low latency, elastic scale, and native graph support of Azure Cosmos DB is ideal for these scenarios.

- **Geospatial**: Many applications in telecommunications, logistics, and travel planning need to find a location of interest within an area or locate the shortest/optimal route between two locations. Azure Cosmos DB is a natural fit for these problems.

- **Internet of Things**: With the network and connections between IoT devices modeled as a graph, you can build a better understanding of the state of your devices and assets. You also can learn how changes in one part of the network can potentially affect another part.

## Introduction to graph databases

Data as it appears in the real world is naturally connected. Traditional data modeling focuses on defining entities separately and computing their relationships at runtime. While this model has its advantages, highly connected data can be challenging to manage under its constraints.  

A graph database approach relies on persisting relationships in the storage layer instead, which leads to highly efficient graph retrieval operations. The API for Gremlin supports the [property graph model](https://tinkerpop.apache.org/docs/current/reference/#intro).

### Property graph objects

A property [graph](https://mathworld.wolfram.com/Graph.html) is a structure that's composed of [vertices](https://mathworld.wolfram.com/GraphVertex.html) and [edges](https://mathworld.wolfram.com/GraphEdge.html). Both objects can have an arbitrary number of key-value pairs as properties.

- **Vertices/nodes**: Vertices denote discrete entities, such as a person, place, or an event.

- **Edges/relationships**: Edges denote relationships between vertices. For example, a person might know another person, be involved in an event, or have recently been at a location.

- **Properties**: Properties express information (or metadata) about the vertices and edges. There can be any number of properties in either vertices or edges, and they can be used to describe and filter the objects in a query. Example properties include a vertex that has name and age, or an edge, which can have a time stamp and/or a weight.

- **Label** - A label is a name or the identifier of a vertex or an edge. Labels can group multiple vertices or edges such that all the vertices/edges in a group have a certain label. For example, a graph can have multiple vertices with a label of "person".

Graph databases are often included within the NoSQL or non-relational database category, since there's no dependency on a schema or constrained data model. This lack of schema allows for modeling and storing connected structures naturally and efficiently.

### Example of a graph database

Let's use a sample graph to understand how queries can be expressed in Gremlin. The following figure shows a business application that manages data about users, interests, and devices in the form of a graph.  

:::image type="content" source="media/introduction/example-graph.png" lightbox="media/introduction/example-graph.png" alt-text="Sample property graph showing persons, devices, and interests." border="false":::

This graph has the following *vertex* types. These types are also called *labels* in Gremlin:

- **People**: The graph has three people; Robin, Thomas, and Ben.

- **Interests**: Their interests, in this example, include the game of Football.

- **Devices**: The devices that people use.

- **Operating Systems**: The operating systems that the devices run on.

- **Place**: The place\[s\] where devices are accessed.

We represent the relationships between these entities via the following *edge* types:

- **Knows**: Represent familiarity. For example, "Thomas knows Robin".

- **Interested**: Represent the interests of the people in our graph. For example, "Ben is interested in Football".

- **RunsOS**: Represent what OS a device runs. For example, "Laptop runs the Windows OS".

- **Uses**: Represent which device a person uses. For example, "Robin uses a Motorola phone with serial number 77".

- **Located**: Represent the location from which the devices are accessed.

The Gremlin Console is an interactive terminal offered by the Apache TinkerPop and this terminal is used to interact with the graph data. For more information, see [the Gremlin console quickstart](quickstart-console.md). You can also perform these operations using Gremlin drivers in the platform of your choice (Java, Node.js, Python, or .NET). The following examples show how to run queries against this graph data using the Gremlin Console.

First let's look at create, read, update, and delete (CRUD). The following Gremlin statement inserts the **Thomas** *vertex* into the graph with a few properties:

```console
g.addV('person').
  property('id', 'thomas.1').
  property('firstName', 'Thomas').
  property('lastName', 'Andersen').
  property('age', 44)
```

> [!TIP]
> If you are following along with these examples, you can use any of these properties (`age`, `firstName`, `lastName`) as a partition key when you create your graph. The `id` property is not supported as a partition key in a graph.

Next, the following Gremlin statement inserts a *knows* edge between **Thomas** and **Robin**.

```console
g.V('thomas.1').
  addE('knows').
  to(g.V('robin.1'))
```

The following query returns the *person* vertices in descending order of their first names:

```console
g.V().
  hasLabel('person').
  order().
  by('firstName', decr)
```

Where graphs shine is when you need to answer questions like "What operating systems do friends of Thomas use?". You can run this Gremlin traversal to get that information from the graph:

```console
g.V('thomas.1').
  out('knows').
  out('uses').
  out('runsos').
  group().
  by('name').
  by(count())
```

## Next steps

- Get started with the [API for Graph .NET quickstart](quickstart-dotnet.md).
- Learn how to [query graphs in API for Graph using Gremlin](tutorial-query.md).
- Learn about [graph data modeling](modeling.md).
