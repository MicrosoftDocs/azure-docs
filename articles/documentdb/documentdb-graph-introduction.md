---
title: 'What is Azure DocumentDB: API for graph? | Microsoft Docs'
description: Learn how you can use DocumentDB to store, query, and traverse massive graphs with low latency using the Gremlin query language. 
keywords: nosql, graph, gremlin, vertices, edges
services: documentdb
author: arramac
documentationcenter: ''

ms.assetid: b916644c-4f28-4964-95fe-681faa6d6e08
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 04/21/2017
ms.author: arramac

---
# Introduction to Graph support in Azure DocumentDB
Azure DocumentDB is a fully-managed, blazing fast, planet-scale distributed database with multi-model support for key-value, document, and graph data models. Azure DocumentDB provides graph modeling and traversal APIs along with turn-key global distribution, elastic scaling of storage and throughput, <10ms read latencies and <15ms at p99, automatic indexing and query, tunable consistency levels, and comprehensive SLAs including 99.99% availability. Azure DocumentDB is a [TinkerPop-enabled graph database](http://tinkerpop.apache.org/providers.html), can be queried using the [Gremlin language](http://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps), and integrates with other TinkerPop-enabled graph systems.

In this article, we provide an overview of the Azure DocumentDB Graph API, and how you can use it to store massive graphs with billions of vertices and edges, query them within order of milliseconds latency, and evolve the graph structure and schema easily. 

## Graph databases
Data as it appears in the real world is naturally connected. Traditional data modeling focuses on entities. But for many applications, there is also a need to model the rich relationships between entities. Graphs allow you to model both entities and relationships naturally. 

A [graph](http://mathworld.wolfram.com/Graph.html) is a structure composed of [vertices](http://mathworld.wolfram.com/GraphVertex.html) and [edges](http://mathworld.wolfram.com/GraphEdge.html). Both vertices and edges can have an arbitrary number of properties. Vertices denote discrete objects such as a person, a place, or an event. Edges denote relationships between vertices. For instance, a person may know another person, have been involved in an event, and/or was recently at a particular place. Properties express information about the vertices and edges. Example properties include a vertex having a name, an age and an edge having a timestamp and/or a weight. More formally, this model is known as a [property graph](https://github.com/tinkerpop/blueprints/wiki/Property-Graph-Model). Azure DocumentDB supports the property graph model. 

For example, the following diagram sample graph that shows the relationship between people, mobile devices, interests, and operating systems. 

![Sample dataase showing persons, devices, and interests](./media/documentdb-graph-introduction/sample-graph.png) 

Graphs are useful in understanding a wide diversity of datasets in science, technology, and business. Graph databases provide the ability to model and store graphs naturally and efficiently, which makes them appealing for a number of scenarios. Graph databases are typically NoSQL databases, because these use cases often also need schema flexibility and rapid iteration. 

Graphs offer a novel and powerful data modeling technique. But this by itself, is not a sufficient reason to use a graph database. For many use cases and patterns involving graph traversals, graphs outperform traditional SQL and NoSQL databases by orders of magnitude. This difference in performance is further amplified when traversing more than one relationship like friend-of-a-friend. 

You can combine the fast traversals provided by graph databases with graph algorithms like depth-first search, breadth-first search, Dijkstra’s algorithm, etc., to solve problems in various domains like social networking, geospatial, content management, geospatial, and recommendations. 

## Planet-scale graphs with Azure DocumentDB
Azure DocumentDB is a fully-managed graph database that offers global distribution, elastic scaling of storage and throughput, automatic indexing and query, tunable consistency levels, and supports the TinkerPop standard.  

![DocumentDB graph architecture](./media/documentdb-graph-introduction/documentdb-graph-architecture.png) 

DocumentDB offers the following differentiated capabilities compared to other graph databases in the market: 

* **Elastically scalable throughput and storage**: Easily scale up or scale down your graph database to meet your application needs. Your data is stored on solid state disks (SSD) for low predictable latencies. DocumentDB supports graph databases that can scale to virtually unlimited storage sizes and provisioned throughput. 

* **Multi-region replication**: DocumentDB transparently replicates your graph data to all regions you've associated with your account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability and performance, all with corresponding guarantees. DocumentDB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe.

* **Fast queries and traversals with familiar Gremlin syntax**: Store heterogeneous vertices and edges and query these documents through a familiar Gremlin syntax (enhanced-SQL will also be available soon). DocumentDB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all content. This enables rich real-time queries and traversals without the need to specify schema hints, secondary indexes, or views. Learn more in [Query Graphs using Gremlin](documentdb-gremlin-support.md).

* **Fully managed**: Eliminate the need to manage database and machine resources. As a fully-managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, manage scaling, or deal with complex data-tier upgrades. Every graph is automatically backed up and protected against regional failures. You can easily add a DocumentDB account and provision capacity as you need it, allowing you to focus on your application instead of operating and managing your database.

* **Automatic indexing**: By default, Azure DocumentDB automatically indexes all the properties within nodes and edges in the graph and does not expect or require any schema or creation of secondary indices. 

* **Compatibility with TinkerPop**: Azure DocumentDB natively supports the open-source TinkerPop framework, and can be queried using the Gremlin language and integrated with other TinkerPop-enabled graph systems. So, you can easily migrate from an another different graph database like Titan or Neo4j, or use graph analytics frameworks that are written on top of TinkerPop.

* **Tunable consistency levels**: Select from five well defined consistency levels to achieve optimal trade-off between consistency and performance. 

DocumentDB also provides the ability to use multiple models like document and graph within the same collections/databases. You can use a document collection to store graph data side by side with documents, and use both SQL queries over JSON and Gremlin queries to query the collection. 

## Getting started
DocumentDB accounts can be created via the Azure CLI, Azure Powershell, or Azure Portal. When you provision a Azure DocumentDB account with Graph APIs,  DocumentDB provisions an independently-scalable  TinkerPop-compatible WebSocket API server running on [Azure WebApps](../app-service-web/app-service-web-overview.md) in your subscription. You can connect to the service endpoint and build applications in Java, Node.js, or any TinkerPop client driver.

The following table shows popular Gremlin drivers that you can start using against Azure DocumentDB:

| Download | Documentation |
| --- | --- |
| [Java](https://mvnrepository.com/artifact/com.tinkerpop.gremlin/gremlin-java) |[Gremlin JavaDoc](http://tinkerpop.apache.org/javadocs/current/full/) |
| [Node.js](https://www.npmjs.com/package/gremlin) |[Gremlin-JavaScript on Github](https://github.com/jbmusso/gremlin-javascript) |
| [Gremlin console](https://tinkerpop.apache.org/downloads.html) |[TinkerPop docs](http://tinkerpop.apache.org/docs/current/reference/#gremlin-console) |

Azure DocumentDB also provides first-party .NET and .NET Core libraries via Nuget that provide Gremlin extension methods on top of the [DocumentDB SDKs](documentdb-sdk-dotnet.md). These libraries provide an "in-proc" Gremlin server that can be used to connect directly to DocumenDB collections. 

| Download | Documentation |
| --- | --- |
| [.NET](https://www.nuget.org/packages/Microsoft.Azure.Graph/) |[Microsoft.Azure.Graphs](https://msdn.microsoft.com/library/azure/dn948556.aspx) |
| [.NET Core](https://www.nuget.org/packages/Microsoft.Azure.Graph.Core/) |[Microsoft.Azure.Graphs](https://msdn.microsoft.com/library/azure/dn948556.aspx) |

Using the [Azure DocumentDB Emulator](documentdb-nosql-local-emulator.md), you can develop and test locally using the Graph API, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the Emulator, you can switch to using an Azure DocumentDB account in the cloud.

## Scenarios for DocumentDB's Graph support
Here are some scenarios where Azure DocumentDB's graph support can be used: 

* **Social networks**: By combining data about people and their  interactions with other people, organizations can develop personalized experiences, gain insight into their customers, predict customer behavior, and connect people with similar interests. DocumentDB can be used to manage social networks and track customer preferences and data. 

* **Recommendation engines**: Commonly used in the retail industry. By combining information about products, users, and user interactions like purchasing, browsing or rating an item, you can build customized recommendations. DocumentDB with its low latency, elastic scale, and native graph support is ideal for modeling these interactions.

* **Geospatial**: Many applications in telecommunications, logistics, and travel planning need to find a location of interest withi a particular area, or locate the shortest/optimal route between two locations. DocumentDB is a natural fit for these applications 

* **Internet of Things**: With the network and connections between IoT devices modeled as a graph, you can build a better understanding of the state of your devices and assets, and how changes in one part of the network can potentially affect another part. 

## Next steps
To learn more about graph support in Azure DocumentDB, see:

* Get started with the [DocumentDB graph tutorial](documentdb-connect-graph-dotnet.md)
* Learn about how to [query graphs in DocumentDB using Gremlin](documentdb-gremlin-support.md)
