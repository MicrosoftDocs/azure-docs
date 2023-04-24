---
title: Understanding distributed NoSQL databases
titleSuffix: Azure Cosmos DB
description: Learn about distributed NoSQL databases and how you can use them together with your cloud-native global-scale applications at with flexible data schemas.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 11/21/2021
---

# Understanding distributed NoSQL databases

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB is a globally distributed database platform for both NoSQL and relational databases of any scale. This article explores distributed NoSQL databases in the context of Azure Cosmos DB’s various NoSQL API options.

For more information about other data storage options in Azure, see [choosing the right data store in the Azure Architecture Center](/azure/architecture/guide/technology-choices/data-store-overview).

## Challenges

One of the challenges when maintaining a database system is that many database engines apply locks and latches to enforce strict [ACID semantics](https://en.wikipedia.org/wiki/ACID). This approach is beneficial in scenarios where databases require high consistency of the state of the data no matter how it’s accessed. While this approach promises high consistency, it makes heavy trade-offs with respect to concurrency, latency, and availability. This restriction is fundamentally an architectural restriction and will force any team with a high transactional workload to find workarounds like manually distributing, or sharding, data across many different databases or database nodes. These workarounds can be time consuming and challenging to implement.

## NoSQL databases

[NoSQL databases](https://en.wikipedia.org/wiki/NoSQL) refer to databases that were designed to simplify horizontal scaling by adjusting consistency to minimize the trade-offs to concurrency, latency, and availability. NoSQL databases offered configurable levels of consistency so that data can scale across many nodes and offer speed or availability that better mapped to the needs of your application.

## Distributed databases

[Distributed databases](https://en.wikipedia.org/wiki/Distributed_database) refer to databases that scale across many different instances or locations. While many NoSQL databases are designed for scale, not all are necessarily distributed databases. Even more, many NoSQL databases require time and effort to distribute across redundant nodes for local-redundancy or globally for geo-redundancy. The planning, implementation, and networking requirements for a globally distributed database can be complex.

## Azure Cosmos DB

With a distributed database that is also a NoSQL database, high transactional workloads suddenly became easier to build and manage. [Azure Cosmos DB](introduction.md) is a database platform that offers distributed data APIs in both NoSQL and relational variants. Specifically, many of the NoSQL APIs offer various consistency options that allow you to fine tune the level of consistency or availability that meets your real-world application requirements. Your database could be configured to offer high consistency with tradeoffs to speed and availability. Similarly, your database could be configured to offer the best performance with predictable tradeoffs to consistency and latency of your replicated data. Azure Cosmos DB will automatically and dynamically distribute your data across local instances or globally. Azure Cosmos DB can also provide ACID guarantees and scale throughput to map to your application’s requirements.

## Next steps

> [!div class="nextstepaction"]
> [Understanding distributed relational databases](distributed-relational.md)

Want to get started with Azure Cosmos DB?

- [Learn about the various APIs](choose-api.md)
- [Get started with the API for NoSQL](nosql/quickstart-dotnet.md)
- [Get started with the API for MongoDB](mongodb/quickstart-nodejs.md)
- [Get started with the API for Apache Cassandra](cassandra/manage-data-java-v4-sdk.md)
- [Get started with the API for Apache Gremlin](gremlin/quickstart-python.md)
- [Get started with the API for Table](table/quickstart-dotnet.md)
