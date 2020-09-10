---
title: 'Introduction to Azure Cosmos DB Gremlin API'
description: Learn how you can use Azure Cosmos DB to store, query, and traverse massive graphs with low latency by using the Gremlin graph query language of Apache TinkerPop.
author: LuisBosquez
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: overview
ms.date: 07/10/2020
ms.author: lbosq
---
# Introduction to Gremlin API in Azure Cosmos DB

[Azure Cosmos DB](introduction.md) is the globally distributed, multi-model database service from Microsoft for mission-critical applications. It is a multi-model database and supports document, key-value, graph, and column-family data models. "Azure Cosmos DB provides a graph database service via the Gremlin API on a fully managed database service designed for any scale.  

:::image type="content" source="./media/graph-introduction/cosmosdb-graph-architecture.png" alt-text="Azure Cosmos DB graph architecture" border="false":::

This article provides an overview of the Azure Cosmos DB Gremlin API and explains how to use them to store massive graphs with billions of vertices and edges. You can query the graphs with millisecond latency and evolve the graph structure easily. Azure Cosmos DB's Gremlin API is built based on the [Apache TinkerPop](https://tinkerpop.apache.org), a graph computing framework. The Gremlin API in Azure Cosmos DB uses the Gremlin query language.

Azure Cosmos DB's Gremlin API combines the power of graph database algorithms with highly scalable, managed infrastructure to provide a unique, flexible solution to most common data problems associated with lack of flexibility and relational approaches.

## Features of Azure Cosmos DB's Gremlin API
 
Azure Cosmos DB is a fully managed graph database that offers global distribution, elastic scaling of storage and throughput, automatic indexing and query, tunable consistency levels, and support for the TinkerPop standard.

The following are the differentiated features that Azure Cosmos DB Gremlin API offers:

* **Elastically scalable throughput and storage**

  Graphs in the real world need to scale beyond the capacity of a single server. Azure Cosmos DB supports horizontally scalable graph databases that can have a virtually unlimited size in terms of storage and provisioned throughput. As the graph database scale grows, the data will be automatically distributed using [graph partitioning](https://docs.microsoft.com/azure/cosmos-db/graph-partitioning).

* **Multi-region replication**

  Azure Cosmos DB can automatically replicate your graph data to any Azure region worldwide. Global replication simplifies the development of applications that require global access to data. In addition to minimizing read and write latency anywhere around the world, Azure Cosmos DB provides automatic regional failover mechanism that can ensure the continuity of your application in the rare case of a service interruption in a region.

* **Fast queries and traversals with the most widely adopted graph query standard**

  Store heterogeneous vertices and edges and query them through a familiar Gremlin syntax. Gremlin is an imperative, functional query language that provides a rich interface to implement common graph algorithms.
  
  Azure Cosmos DB enables rich real-time queries and traversals without the need to specify schema hints, secondary indexes, or views. Learn more in [Query graphs by using Gremlin](gremlin-support.md).

* **Fully managed graph database**

  Azure Cosmos DB eliminates the need to manage database and machine resources. Most existing graph database platforms are bound to the limitations of their infrastructure and often require a high degree of maintenance to ensure its operation. 
  
  As a fully managed service, Cosmos DB removes the need to manage virtual machines, update runtime software, manage sharding or replication, or deal with complex data-tier upgrades. Every graph is automatically backed up and protected against regional failures. These guarantees allow developers to focus on delivering application value instead of operating and managing their graph databases. 

* **Automatic indexing**

  By default, Azure Cosmos DB automatically indexes all the properties within nodes (also called as vertices) and edges in the graph and doesn't expect or require any schema or creation of secondary indices. Learn more about [indexing in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/index-overview).

* **Compatibility with Apache TinkerPop**

  Azure Cosmos DB supports the [open-source Apache TinkerPop standard](https://tinkerpop.apache.org/). The Tinkerpop standard has an ample ecosystem of applications and libraries that can be easily integrated with Azure Cosmos DB's Gremlin API.

* **Tunable consistency levels**

  Azure Cosmos DB provides five well-defined consistency levels to achieve the right tradeoff between consistency and performance for your application. For queries and read operations, Azure Cosmos DB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow you to make sound tradeoffs among consistency, availability, and latency. Learn more in [Tunable data consistency levels in Azure Cosmos DB](consistency-levels.md).

## Scenarios that use Gremlin API

Here are some scenarios where graph support of Azure Cosmos DB can be useful:

* **Social networks/Customer 365**

  By combining data about your customers and their interactions with other people, you can develop personalized experiences, predict customer behavior, or connect people with others with similar interests. Azure Cosmos DB can be used to manage social networks and track customer preferences and data.

* **Recommendation engines**

  This scenario is commonly used in the retail industry. By combining information about products, users, and user interactions, like purchasing, browsing, or rating an item, you can build customized recommendations. The low latency, elastic scale, and native graph support of Azure Cosmos DB is ideal for these scenarios.

* **Geospatial**

  Many applications in telecommunications, logistics, and travel planning need to find a location of interest within an area or locate the shortest/optimal route between two locations. Azure Cosmos DB is a natural fit for these problems.

* **Internet of Things**

  With the network and connections between IoT devices modeled as a graph, you can build a better understanding of the state of your devices and assets. You also can learn how changes in one part of the network can potentially affect another part.

## Introduction to graph databases

Data as it appears in the real world is naturally connected. Traditional data modeling focuses on defining entities separately and computing their relationships at runtime. While this model has its advantages, highly connected data can be challenging to manage under its constraints.  

A graph database approach relies on persisting relationships in the storage layer instead, which leads to highly efficient graph retrieval operations. Azure Cosmos DB's Gremlin API supports the [property graph model](https://tinkerpop.apache.org/docs/current/reference/#intro).

### Property graph objects

A property [graph](http://mathworld.wolfram.com/Graph.html) is a structure that's composed of [vertices](http://mathworld.wolfram.com/GraphVertex.html) and [edges](http://mathworld.wolfram.com/GraphEdge.html). Both objects can have an arbitrary number of key-value pairs as properties. 

* **Vertices/nodes** - Vertices denote discrete entities, such as a person, a place, or an event.

* **Edges/relationships** - Edges denote relationships between vertices. For example, a person might know another person, be involved in an event, and recently been at a location.

* **Properties** -  Properties express information about the vertices and edges. There can be any number of properties in either vertices or edges, and they can be used to describe and filter the objects in a query. Example properties include a vertex that has name and age, or an edge, which can have a time stamp and/or a weight.

* **Label** - A label is a name or the identifier of a vertex or an edge. Labels can group multiple vertices or edges such that all the vertices/edges in a group have a certain label. For example, a graph can have multiple vertices of label type "person".

Graph databases are often included within the NoSQL or non-relational database category, since there is no dependency on a schema or constrained data model. This lack of schema allows for modeling and storing connected structures naturally and efficiently.

### Graph database by example

Let's use a sample graph to understand how queries can be expressed in Gremlin. The following figure shows a business application that manages data about users, interests, and devices in the form of a graph.  

:::image type="content" source="./media/gremlin-support/sample-graph.png" alt-text="Sample database showing persons, devices, and interests" border="false"::: 

This graph has the following *vertex* types (these are also called "label" in Gremlin):

* **People**: The graph has three people, Robin, Thomas, and Ben
* **Interests**: Their interests, in this example, the game of Football
* **Devices**: The devices that people use
* **Operating Systems**: The operating systems that the devices run on
* **Place**: The places from which the devices are accessed

We represent the relationships between these entities via the following *edge* types:

* **Knows**: For example, "Thomas knows Robin"
* **Interested**: To represent the interests of the people in our graph, for example, "Ben is interested in Football"
* **RunsOS**: Laptop runs the Windows OS
* **Uses**: To represent which device a person uses. For example, Robin uses a Motorola phone with serial number 77
* **Located**: To represent the location from which the devices are accessed

The Gremlin Console is an interactive terminal offered by the Apache TinkerPop and this terminal is used to interact with the graph data. To learn more, see the quickstart doc on [how to use the Gremlin console](create-graph-gremlin-console.md). You can also perform these operations using Gremlin drivers in the platform of your choice (Java, Node.js, Python, or .NET). The following examples show how to run queries against this graph data using the Gremlin Console.

First let's look at CRUD. The following Gremlin statement inserts the "Thomas" vertex into the graph:

```java
:> g.addV('person').property('id', 'thomas.1').property('firstName', 'Thomas').property('lastName', 'Andersen').property('age', 44)
```

Next, the following Gremlin statement inserts a "knows" edge between Thomas and Robin.

```java
:> g.V('thomas.1').addE('knows').to(g.V('robin.1'))
```

The following query returns the "person" vertices in descending order of their first names:

```java
:> g.V().hasLabel('person').order().by('firstName', decr)
```

Where graphs shine is when you need to answer questions like "What operating systems do friends of Thomas use?". You can run this Gremlin traversal to get that information from the graph:

```java
:> g.V('thomas.1').out('knows').out('uses').out('runsos').group().by('name').by(count())
```

## Next steps

To learn more about graph support in Azure Cosmos DB, see:

* Get started with the [Azure Cosmos DB graph tutorial](create-graph-dotnet.md).
* Learn about how to [query graphs in Azure Cosmos DB by using Gremlin](gremlin-support.md).
