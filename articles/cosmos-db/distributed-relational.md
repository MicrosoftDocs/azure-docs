---
title: Understanding distributed relational databases
titleSuffix: Azure Cosmos DB
description: Learn about distributed relational databases and how you can use them together with your global-scale applications and your existing RDBMS development skills.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: overview
ms.date: 11/21/2021
---

# Understanding distributed relational databases

[!INCLUDE[PostgreSQL](includes/appliesto-postgresql.md)]

Azure Cosmos DB is a globally distributed database platform for both NoSQL and relational databases of any scale. This article explores distributed relational databases in the context of Azure Cosmos DB’s relational API option.

For more information about other data storage options in Azure, see [choosing the right data store in the Azure Architecture Center](/azure/architecture/guide/technology-choices/data-store-overview).

## Challenges

Many times when you read about large volume or high transactional workloads, it’s easy to think that these workloads are much larger than any that your application may face. The assumption that your workload will stay small can be a safe assumption at the start of a project, idea, or organization. However, that assumption can quickly lead to a scenario where your application’s workload grows far beyond any predictions you have made. It’s not uncommon to hear stories of workloads that meet the maximum throughput or processing power of the single-instance database that was economical and performant at the start of a project.

## Relational databases

[Relational databases](https://en.wikipedia.org/wiki/Relational_database) organize data into a tabular (row/column) format with relations between different tables in the databases. Relational databases are common in various enterprises. These enterprises often have a wealth of software developers who have written code against a relational database or administrators who design schemas and manage relational database platforms. Relational databases also often support transactions with [ACID guarantees](https://en.wikipedia.org/wiki/ACID).

Unfortunately, many relational database systems are initially configured by organizations in a single-node manner with upper constraints on compute, memory, and networking resources. This context can lead to an incorrect assumption that all relational databases are single node by their very nature.

## Distributed databases

With many cloud-native whitepapers, it’s common to hear about the benefits of NoSQL databases making it seem like relational databases aren't a reasonable choice for large scale databases or distributed workloads. While many [distributed databases](https://en.wikipedia.org/wiki/Distributed_database) are non-relational, that are options out there for distributed relational database workloads.

Many of these options for distributed relational databases require your organization to plan for large scale and distribution from the beginning of the project. This planning requirement can add significant complexity at the start of a project to make sure all relevant server nodes are configured, managed, and maintained by your team. The planning, implementation, and networking requirements for a globally distributed relational database can easily grow to be far more complex than standing up a single instance (or node).

## Azure Cosmos DB

[Azure Cosmos DB](introduction.md) is a database platform that offers distributed data APIs in both NoSQL and relational variants. Specifically, the relational API for Azure Cosmos DB is based on [PostgreSQL](https://www.postgresql.org/) and the [Citus extension](https://github.com/citusdata/citus).

Citus is a PostgreSQL extension that adds support to Postgres for distribution of data and transactions. [Azure Cosmos DB for PostgreSQL](postgresql/introduction.md) is a fully managed service, using Citus, that automatically gives you high availability without the need to manually plan, manage, and maintain individual server nodes. With the API for PostgreSQL, you can start with a fully managed single-node cluster, build your database solution and then scale it in a turnkey fashion as your application’s needs grow over time. With the API for PostgreSQL, there’s no need to plan a complex distribution project in advance or plan a project to migrate your data from a single-node to a distributed database down the road.

## Next steps

> [!div class="nextstepaction"]
> [Understanding distributed NoSQL databases](distributed-nosql.md)

Want to get started with Azure Cosmos DB?

- [Learn about the various APIs](choose-api.md)
- [Get started with the API for PostgreSQL](postgresql/quickstart-app-stacks-python.md)
