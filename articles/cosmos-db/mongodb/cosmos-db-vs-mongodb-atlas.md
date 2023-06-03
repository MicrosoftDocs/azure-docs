---
title: Comparing MongoDB Atlas and Azure Cosmos DB for MongoDB
titleSuffix: Azure Cosmos DB for MongoDB
description: Compare the features and benefits of Azure Cosmos DB for MongoDB with MongoDB Atlas.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 06/03/2023
---

# Comparing MongoDB Atlas and Azure Cosmos DB for MongoDB

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for MongoDB provides a powerful fully-managed MongoDB compatible database solution while seamlessly integrating with the Azure ecosystem. This allows developers to reap the benefits of Cosmos DB's robust features such as global distribution, 99.999% high availability SLA, and strong security measures, while retaining the ability to use their familiar MongoDB tools and applications. Consequently, developers can remain vendor agnostic, without needing to adapt to a new set of tools or drastically change their current operations. This ensures a smooth transition and operation for MongoDB developers, making Cosmos DB for MongoDB a compelling choice for a scalable, secure, and efficient database solution that integrates with existing MongoDB tools and applications.

> [!TIP]
> Want to try the Azure Cosmos DB for MongoDB with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## Azure Cosmos DB for MongoDB vs MongoDB Atlas

| Feature | Cloud-Native Cosmos DB for MongoDB | Vendor-managed MongoDB Atlas |
|---------|---------|----------------------------------|
| MongoDB wire protocol | Yes | Yes |
| Compatible with MongoDB tools and drivers | Yes | Yes |
| Global Distribution | Yes, globally distributed with automatic and instant data replication across any number of Azure regions. | Yes, globally distributed with manual and scheduled data replication across any number of cloud providers or regions. |
| 99.999% availability SLA | Yes | No |
| Instantanteous Scaling | Yes, database instantaneously scales to with zero performance impact on your applications | No, requires 1+ hours to vertically scale up and 24+ hours to vertically scale down. Performance impact during scale up may be noticeable. |
| True active-active clusters | Yes, with multi-primary writes. Data for the same shard can be writtent to multiple regions.  | No |
| Integrated text search, geospatial processing | Yes | Yes |
| Free tier | 1,000 request units (RUs) and 25GB storage forever. Prevents you from exceeding limits if you want. | Yes, with 512MB storage|
| Live migration | Yes | Yes |
| Azure Integrations | Native first-party integrations with Azure services such as Azure Functions, Azure Logic Apps, Azure Stream Analytics, and Power BI and more. | Limited number of third party integrations |
| Choice of instance configuration | Yes, with Azure Cosmos DB for MongoDB vCore | Yes |
| Expert Support | Microsoft, with 24x7 support for Azure Cosmos DB. One support team to address all of your Azure products | MongoDB, Inc. with 24x7 support for MongoDB Atlas. Need separate support teams depending on the product. Support plans costs rise signficantly depending on response time chosen |
| Support for MongoDB multi-document ACID transactions | Yes, with full support in Azure Cosmos DB for MongoDB vCore | Yes | 
| JSON data type support | BSON (Binary JSON) | BSON (Binary JSON) |
| Support for MongoDB aggregation pipeline | Yes | Yes |
| Maximum document size | 16 MB | 16MB MB |
| JSON schema for data governance controls | Coming soon to Azure Cosmos DB for MongoDB vCore | Yes |
| Integrated text search | Yes | Yes |
| Integrated querying of data in cloud object storage | Yes, with Synapse Link | Yes |
| Blend data with joins and unions for analytics queries | Yes | Yes |
| Performance recommendations | Yes, with native Microsoft tools | Yes |
| Replica set configuration | Yes, with Azure Cosmos DB for MongoDB vCore | No |
| Automatic sharding support | Yes | Limited, since the number of shards must be configured by the developer. Extra costs apply for additional configuration servers. |
| Pause and resume clusters | Coming soon to Azure Cosmos DB for MongoDB vCore | Yes |
| Data explorer | Yes, using native Azure tooling and MongoDB tooling such as Robo3T | Yes |
| Cloud Providers | Azure. MongoDB wire protocol compatibility enables you to remain vendor-agnostic. | AWS, Azure & Google Cloud |
| SQL-based connectivity | Yes | Yes |
| Native data visualization without 3rd party BI tools | Yes, using PowerBI | Yes |
| Database supported in on-premise and hybrid deployments | No | Yes |
| Embeddable database with sync for mobile devices | No, due to low user demand | Yes |
| Granular role-based access control | Yes | Yes |
| Encryption of data in-flight | Yes | Yes | 
| Encryption of data at-rest | Yes | Yes | 
| Client-side field level encryption | Yes | Yes |
| LDAP Integration | Yes | Yes |  |
| Database-level auditing | Yes | Yes |

## Next steps

- Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-account.md) tutorial to learn how to get your account connection string information.
- Follow the [Use Studio 3T with Azure Cosmos DB](connect-using-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in Studio 3T.
- Follow the [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to an Azure Cosmos DB database.
