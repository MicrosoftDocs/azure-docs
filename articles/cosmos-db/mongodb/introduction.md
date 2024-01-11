---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for MongoDB
description: Use Azure Cosmos DB for MongoDB to store and query massive amounts of data using popular open-source drivers.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 09/12/2023
---

# What is Azure Cosmos DB for MongoDB?

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for MongoDB makes it easy to use Azure Cosmos DB as if it were a MongoDB database. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWXr4T]

## Cosmos DB for MongoDB benefits

Cosmos DB for MongoDB has numerous benefits compared to other MongoDB service offerings such as MongoDB Atlas:

### Request Unit (RU) architecture

[A fully managed MongoDB-compatible service](./ru/introduction.md) with flexible scaling using [Request Units (RUs)](../request-units.md). Designed for cloud-native applications.

- **Instantaneous scalability**: With the [Autoscale](../provision-throughput-autoscale.md) feature, your database scales instantaneously with zero warmup period. Other MongoDB offerings such as MongoDB Atlas can take hours to scale up and up to days to scale down.

- **Automatic and transparent sharding**: The API for MongoDB manages all of the infrastructure for you. This management includes sharding and optimizing the number of shards. Other MongoDB offerings such as MongoDB Atlas, require you to specify and manage sharding to horizontally scale. This automation gives you more time to focus on developing applications for your users.

- **Five 9's of availability**: [99.999% availability](../high-availability.md) is easily configurable to ensure your data is always there for you.

- **Active-active database**: Unlike MongoDB Atlas, Cosmos DB for MongoDB supports active-active across multiple regions. Databases can span multiple regions, with no single point of failure for **writes and reads for the same data**. MongoDB Atlas global clusters only support active-passive deployments for writes for the same data.  
- **Cost efficient, granular, unlimited scalability**: Sharded collections can scale to any size, unlike other MongoDB service offerings. The Azure Cosmos DB platform can scale in increments as small as 1/100th of a VM due to its architecture. This scalability means that you can scale your database to the exact size you need, without paying for unused resources.

- **Real time analytics (HTAP) at any scale**: Run analytics workloads against your transactional MongoDB data in real time with no effect on your database. This analysis is fast and inexpensive, due to the cloud native analytical columnar store being utilized, with no ETL pipelines. Easily create Power BI dashboards, integrate with Azure Machine Learning and Azure AI services, and bring all of your data from your MongoDB workloads into a single data warehousing solution. Learn more about the [Azure Synapse Link](../synapse-link.md).

- **Serverless deployments**: Cosmos DB for MongoDB offers a [serverless capacity mode](../serverless.md). With [Serverless](../serverless.md), you're only charged per operation, and don't pay for the database when you don't use it.

> [!TIP]
> Visit [Choose your model](./choose-model.md) for an in-depth comparison of each architecture to help you choose which one is right for you.

### vCore Architecture

[A fully managed MongoDB-compatible service](./vcore/introduction.md) with dedicated instances for new and existing MongoDB apps. This architecture offers a familiar vCore architecture for MongoDB users, efficient scaling, and seamless integration with Azure services.

- **Native Vector Search**: Seamlessly integrate your AI-based applications with your data that's stored in Azure Cosmos DB for MongoDB vCore. This integration is an all-in-one solution, unlike other vector search solutions that send your data between service integrations.  

- **Flat pricing with Low total cost of ownership**: Enjoy a familiar pricing model for Azure Cosmos DB for MongoDB vCore, based on compute (vCores & RAM) and storage (disks).

- **Elevate querying with Text Indexes**: Enhance your data querying efficiency with our text indexing feature. Seamlessly navigate full-text searches across MongoDB collections, simplifying the process of extracting valuable insights from your documents.

- **Scale with no shard key required**: Simplify your development process with high-capacity vertical scaling, all without the need for a shard key. Sharding and scaling horizontally is simple once collections are into the TBs.

- **Free 35 day Backups with point in time restore (PITR)**: Azure Cosmos DB for MongoDB vCore offers free 35 day backups for any amount of data.

> [!TIP]
> Visit [Choose your model](./choose-model.md) for an in-depth comparison of each architecture to help you choose which one is right for you.

## How Azure Cosmos DB for MongoDB works

Cosmos DB for MongoDB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with MongoDB client SDKs, drivers, and tools. Azure Cosmos DB doesn't host the MongoDB database engine. Any MongoDB client driver compatible with the API version you're using should be able to connect, with no special configuration.

> [!IMPORTANT]
> This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.

## Next steps

- Read the [FAQ](faq.yml)
- [Connect an existing MongoDB application to Azure Cosmos DB for MongoDB RU](connect-account.md)
