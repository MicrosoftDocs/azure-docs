---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn about Azure Cosmos DB for MongoDB vCore, a fully managed MongoDB-compatible database for building modern applications with a familiar architecture.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 08/28/2023
---

# What is Azure Cosmos DB for MongoDB vCore?

Azure Cosmos DB for MongoDB vCore provides developers with a fully managed MongoDB-compatible database service for building modern applications with a familiar architecture. With Cosmos DB for MongoDB vCore, developers can enjoy the benefits of native Azure integrations, low total cost of ownership (TCO), and the familiar vCore architecture when migrating existing applications or building new ones.

## Effortless integration with the Azure platform

Azure Cosmos DB for MongoDB vCore provides a comprehensive and integrated solution for resource management, making it easy for developers to seamlessly manage their resources using familiar Azure tools. The service features deep integration into various Azure products, such as Azure Monitor and Azure CLI. This deep integration ensures that developers have everything they need to work efficiently and effectively.

Developers can rest easy knowing that they have access to one unified support team for all their services, eliminating the need to juggle multiple support teams for different services.

## Low total cost of ownership (TCO)

Azure Cosmos DB for MongoDB's scalable architecture is designed to deliver the best performance and cost efficiency for your workloads. Visit the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to learn more about pricing for each cluster tier or price out a cluster in the Azure portal. With optional high availability (HA), there's no need to pay for resources you don't need for workloads such as development and testing. With HA disabled, cost savings are passed on to you in the form of a reduced per-hour cost.

Here are the current tiers for the service:

| Cluster tier | Base storage | RAM | vCPUs |
| --- | --- | --- | --- |
| M30 | 128 GB | 8 GB | 2 |
| M40 | 128 GB | 16 GB | 4 |
| M50 | 128 GB | 32 GB | 8 |
| M60 | 128 GB | 64 GB | 16 |
| M80 | 128 GB | 128 GB | 32 |

Azure Cosmos DB for MongoDB vCore is organized into easy to understand cluster tiers based on vCPUs, RAM, and attached storage. These tiers make it easy to lift and shift your existing workloads or build new applications.

## Flexibility for developers

Cosmos DB for MongoDB vCore is built with flexibility for developers in mind. The service offers high capacity vertical and horizontal scaling with no shard key required until the database surpasses TBs. The service also supports automatically sharding existing databases with no downtime. Developers can easily scale their clusters up or down, vertically and horizontally, all with no downtime, to meet their needs.

## Next steps

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).
