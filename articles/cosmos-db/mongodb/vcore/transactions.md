---
title: ACID Transactions in Azure Cosmos DB for MongoDB vCore
description: Delve deep into the importance and functionality of ACID transactions in Azure Cosmos DB's MongoDB vCore.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 08/08/2023
author: gahl-levy
ms.author: gahllevy
---
# ACID Transactions in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

ACID stands for Atomicity, Consistency, Isolation, and Durability. These principles in database management ensure transactions are processed reliably:

- **Atomicity**: Transactions complete entirely or not at all.
- **Consistency**: Databases transition from one consistent state to another.
- **Isolation**: Individual transactions are shielded from simultaneous ones.
- **Durability**: Finished transactions are permanent, ensuring data remains consistent, even during system failures.

Azure Cosmos DB for MongoDB vCore builds off these principles, enabling developers to harness the advantages of ACID properties while benefiting from the innate flexibility and performance of Cosmos DB. This native feature is pivotal for a range of applications, from basic ones to comprehensive enterprise-grade solutions, especially when it comes to preserving transactional data integrity across distributed sharded clusters.

## Why Use Azure Cosmos DB for MongoDB vCore?
- **Native Vector Search**: Power your AI apps directly within Azure Cosmos DB, leveraging native high-dimensional data search and bypassing pricier external solutions.
- **Fully-Managed Azure Service**: Rely on a unified, dedicated support team for seamless database operations.
- **Effortless Azure Integrations**: Easily connect with a wide range of Azure services without the typical maintenance hassles.

## Next Steps

- Begin your journey with ACID transactions in Azure Cosmos DB for MongoDB vCore by accessing our [guide and tutorials](quickstart-portal.md).
- Explore further capabilities and benefits of Azure Cosmos DB for MongoDB vCore in our [documentation](introduction.md).

