---
title: Comparing MongoDB Atlas and Azure Cosmos DB for MongoDB
titleSuffix: Azure Cosmos DB for MongoDB
description: Compare the features and benefits of Azure Cosmos DB for MongoDB with MongoDB Atlas.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 02/27/2024
---

# Comparing MongoDB Atlas and Azure Cosmos DB for MongoDB

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Azure Cosmos DB for MongoDB](../introduction.md) provides a powerful fully managed MongoDB compatible database while seamlessly integrating with the Azure ecosystem. This allows developers to reap the benefits of Azure Cosmos DB's robust features such as global distribution, 99.999% high availability SLA, and strong security measures, while retaining the ability to use their familiar MongoDB tools and applications. Developers can remain vendor agnostic, without needing to adapt to a new set of tools or drastically change their current operations. This ensures a smooth transition and operation for MongoDB developers, making Azure Cosmos DB for MongoDB a compelling choice for a scalable, secure, and efficient database solution for their MongoDB workloads.

> [!TIP]
> Want to try the Azure Cosmos DB for MongoDB with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## Azure Cosmos DB for MongoDB vs MongoDB Atlas

| Feature | Azure Cosmos DB for MongoDB | MongoDB Atlas by MongoDB, Inc |
|---------|---------|----------------------------------|
| MongoDB wire protocol | Yes | Yes |
| Compatible with MongoDB tools and drivers | Yes | Yes |
| Global Distribution | Yes, [globally distributed](../distribute-data-globally.md) with automatic and fast data replication across any number of Azure regions | Yes, globally distributed with automatic and fast data replication across supported cloud providers or regions |
| 99.999% availability SLA | [Yes](../high-availability.md) | No. MongoDB Atlas offers a 99.995% availability SLA |
| SLA covers cloud platform | Yes | No. For more details, read the MongoDB Atlas SLA |
| Instantaneous and automatic scaling | Yes, ​Azure Cosmos DB RU-based deployments [automatically and instantaneously scale 10x with zero performance impact](../provision-throughput-autoscale.md) on your applications. Scaling of vCore-based instances is managed by users | ​​​Atlas dedicated instances managed by users, or scale automatically after analyzing the workload over a day. |
| Multi-region writes (also known as multi-master) | ​​Yes. With multi-region writes, customers can update any document in any region, enabling 99.999% availability SLA  | ​​​Yes. With multi-region zones, customers can configure different write regions per shard. Data within a single shard is writable in a single region.​​  |
| Limitless scale | ​​Azure Cosmos DB provides ability to scale RUs up to and beyond a billion requests per second, with unlimited storage, fully managed, as a service​. ​​vCore-based Azure Cosmos DB for MongoDB deployments support scaling through sharding | ​​​​MongoDB Atlas deployments support scaling through sharding​. |
| Independent scaling for throughput and storage | Yes, with RU-based Azure Cosmos DB for MongoDB | No |
| Vector Search for AI applications | Yes, with [vCore-based Azure Cosmos DB for MongoDB](./vcore/vector-search.md) | Yes, with MongoDB Atlas dedicated instances |
| Integrated text search, geospatial processing | Yes | Yes |
| Free tier | [1,000 request units (RUs) and 25 GB storage forever](../try-free.md). Prevents you from exceeding limits if you want. vCore-based Azure Cosmos DB for MongoDB offers Free Tier with 32GB storage forever. | Yes, with 512 MB storage |
| Live migration | Yes | Yes |
| Azure Integrations | [Native first-party integrations with Azure services](./integrations-overview.md) | Third party integrations, including some native Azure services |
| Choice of instance configuration | Yes, with [vCore-based Azure Cosmos DB for MongoDB](./vcore/introduction.md) | Yes |
| Expert Support | 24x7 support provided by Microsoft for Azure Cosmos DB. An Azure Support contract covers all Azure products, including Azure Cosmos DB, which allows you to work with one support team without additional support costs  | 24x7 support provided by MongoDB for MongoDB Atlas with various SLA options available |
| Support for MongoDB multi-document ACID transactions | Yes, with [vCore-based Azure Cosmos DB for MongoDB](./vcore/introduction.md) | Yes | 
| JSON data type support | BSON (Binary JSON) | BSON (Binary JSON) |
| Support for MongoDB aggregation pipeline | Yes. Supporting MongoDB wire protocol v5.0 in RU-based and 6.0 in vCore-based​ | Yes |
| Maximum document size | 16 MB | 16 MB |
| JSON schema for data governance controls | Currently in development | Yes |
| Integrated text search | Yes | Yes |
| Integrated querying of data in cloud object storage | Yes, with Synapse Link | Yes |
| Blend data with joins and unions for analytics queries | Yes | Yes |
| Performance recommendations | Yes, with native Microsoft tools | Yes |
| Replica set configuration | Yes, with [vCore-based Azure Cosmos DB for MongoDB](./vcore/introduction.md) | Yes |
| Sharding support | Azure Cosmos DB supports automatic, server-side sharding. It manages shard creation, placement, and balancing automatically | Multiple sharding methodologies supported to fit various use cases. Sharding strategy can be changed without impacting the application |
| Pause and resume clusters | Currently in development | Yes |
| Data explorer | Yes, using native Azure tooling and Azure Cosmos DB Explorer. Support for third party tools such as Robo3T  | Yes, using native MongoDB tools such as Compass and Atlas Data Explorer. Support for third party tools such as Robo3T |
| Cloud Providers | Azure. MongoDB wire protocol compatibility enables you to remain vendor-agnostic | Azure, AWS, and Google Cloud |
| SQL-based connectivity | Yes | Yes |
| Native data visualization without 3rd party BI tools | Yes, using Power BI | Yes, with Atlas Charts |
| Database supported in on-premises and hybrid deployments | No | Yes |
| Embeddable database with sync for mobile devices | No, due to low user demand | Yes |
| Granular role-based access control | Yes | Yes |
| Encryption of data in-flight | Yes | Yes | 
| Encryption of data at rest | Yes | Yes | 
| Client-side field level encryption | Yes | Yes |
| LDAP Integration | Yes | Yes | 
| Database-level auditing | Yes | Yes |
| Multi-document ACID transactions across collections and partitions | Yes | Yes |
| Continuous backup with on-demand restore | Yes | Yes |

## Next steps

- Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-account.yml) tutorial to learn how to get your account connection string information.
- Follow the [Use Studio 3T with Azure Cosmos DB](connect-using-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in Studio 3T.
- Follow the [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to an Azure Cosmos DB database.
