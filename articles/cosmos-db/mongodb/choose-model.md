---
title: Choose between RU-based and vCore-based models
titleSuffix: Azure Cosmos DB for MongoDB
description: Choose whether the RU-based or vCore-based option for Azure Cosmos DB for MongoDB is ideal for your workload.
author: seesharprun
ms.author: sidandrews
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 09/12/2023
---

# What is RU-based and vCore-based Azure Cosmos DB for MongoDB?

Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development.

Both, the Request Unit (RU) and vCore-based Azure Cosmos DB for MongoDB offering make it easy to use Azure Cosmos DB as if it were a MongoDB database. Both options work without the overhead of complex management and scaling approaches. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB. Additionally, both are cloud-native offerings that can be integrated seamlessly with other Azure services to build enterprise-grade modern applications.

## Choose between RU-based and vCore-based

Here are a few key factors to help you decide which is the right option for you.

### Choose RU-based if

- You're building new cloud-native MongoDB apps or refactoring existing apps for cloud-native benefits.
- Your workload has more point reads (fetching a single item by its _id and shard key value) and few long-running queries and complex aggregation pipeline operations.
- You want limitless horizontal scalability, instantaneous scale up, and granular throughput control.
- You're running mission-critical applications requiring industry-leading 99.999% availability.

[**Get started with Azure Cosmos DB for MongoDB RU**](./quickstart-python.md)

> [!TIP]
> Want to try the Azure Cosmos DB for MongoDB RU with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

### Choose vCore-based if

- You're migrating (lift & shift) an existing MongoDB workload or building a new MongoDB application.
- Your workload has more long-running queries, complex aggregation pipelines, distributed transactions, joins, etc.
- You prefer high-capacity vertical and horizontal scaling with familiar vCore-based cluster tiers such as M30, M40, M50 and more.
- You're running applications requiring 99.995% availability.
- You need native support for storing and searching vector embeddings.

[**Get started with Azure Cosmos DB for MongoDB vCore**](./vcore/quickstart-portal.md)

## Resource and billing differences between the options

The RU and vCore services have different architectures with important billing differences.

### RU-based resources and billing

- You'd like a multi-tenant service that instantly allocates resources to your workload, aligning with storage and throughput requirements.

> [!NOTE]
> Throughput is based on [Request Units (RUs)](../request-units.md).

- You prefer to pay fixed (standard provisioned throughput) or variable (autoscale) fees corresponding to Request Units (RUs) and consumed storage.

> [!NOTE]
> RU charges depend on the selected model: provisioned throughput (standard or autoscale) or serverless.

[**Get started with Azure Cosmos DB for MongoDB RU**](./quickstart-python.md)

### vCore-based resources and billing

- You'd like dedicated instances that utilize preset CPU, memory, and storage resources, which can dynamically scale to suit your needs.
- You prefer to pay a consistent flat fee based on compute (CPU, memory, and the number of nodes) and storage.

[**Get started with Azure Cosmos DB for MongoDB vCore**](./vcore/quickstart-portal.md)

## Next steps

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for free](../try-free.md)
