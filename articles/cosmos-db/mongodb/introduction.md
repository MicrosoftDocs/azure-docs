---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for MongoDB
description: Use Azure Cosmos DB for MongoDB to store and query massive amounts of data using popular open-source drivers.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 02/28/2023
ms.custom: ignite-2022
---

# What is Azure Cosmos DB for MongoDB?

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for MongoDB makes it easy to use Azure Cosmos DB as if it were a MongoDB database. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWXr4T]

> [!TIP]
> Want to try the API for MongoDB with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## API for MongoDB benefits

The API for MongoDB has added benefits of being built on Azure Cosmos DB when compared to service offerings such as MongoDB Atlas:

- **Instantaneous scalability**: With the [Autoscale](../provision-throughput-autoscale.md) feature, your database can scale 10x with zero warmup period. Other MongoDB offerings such as MongoDB Atlas can take hours to scale up and up to days to scale down.

- **Automatic and transparent sharding**: The API for MongoDB manages all of the infrastructure for you. This management includes sharding and optimizing the number of shards. Other MongoDB offerings such as MongoDB Atlas, require you to specify and manage sharding to horizontally scale. This automation gives you more time to focus on developing applications for your users.

- **Five 9's of availability**: [99.999% availability](../high-availability.md) is easily configurable to ensure your data is always there for you. 

- **Active-active databases**: Unlike MongoDB Atlas, Cosmos DB for MongoDB supports active-active across multiple regions. Databases can span multiple regions, with no single point of failure for **writes and reads for the same data**. MongoDB Atlas global clusters only support active-passive deployments across regions.  

- **Cost efficient, granular, unlimited scalability**: Sharded collections can scale to any size, unlike other MongoDB service offerings. APIs for MongoDB users are running databases with over 600 TB of storage today. Scaling is done in a cost-efficient manner unlike other MongoDB service offerings. The Azure Cosmos DB platform can scale in increments as small as 1/100th of a VM due to economies of scale and resource governance.

- **Serverless deployments**: Cosmos DB for MongoDB is a cloud native database that offers a [serverless capacity mode](../serverless.md). With [Serverless](../serverless.md), you're only charged per operation, and don't pay for the database when you don't use it.

- **Free Tier**: With Azure Cosmos DB free tier, you get the first 1000 RU/s and 25 GB of storage in your account for free forever, applied at the account level.

- **Upgrades take seconds**: All API versions are contained within one codebase, making version changes as simple as [flipping a switch](upgrade-version.md), with zero downtime.

- **Role Based Access Control**: With Azure Cosmos DB for MongoDB, you can assign granular roles and permissions to users to control access to your data and audit user actions- all using native Azure tooling.

- **Real time analytics (HTAP) at any scale**: Cosmos DB for MongoDB offers the ability to run complex analytical queries. Use cases for these queries include business intelligence that can run against your database data in real time with no effect on your database. This analysis is fast and inexpensive, due to the cloud native analytical columnar store being utilized, with no ETL pipelines. Learn more about the [Azure Synapse Link](../synapse-link.md).

- **In-depth monitoring capabilities**: Cosmos DB for MongoDB integrates with Azure Monitor to provide in-depth monitoring capabilities.

## How the API for MongoDB works

The API for MongoDB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with native MongoDB client SDKs, drivers, and tools. Azure Cosmos DB doesn't host the MongoDB database engine. Any MongoDB client driver compatible with the API version you're using should be able to connect, with no special configuration.

> [!IMPORTANT]
> This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.

### MongoDB feature compatibility

The API for MongoDB is compatible with the following MongoDB server versions:

- [Version 5.0 (limited preview)](../access-previews.md)
- [Version 4.2](feature-support-42.md)
- [Version 4.0](feature-support-40.md)
- [Version 3.6](feature-support-36.md)
- [Version 3.2](feature-support-32.md)

### Choosing a server version

All the APIs for MongoDB versions run on the same codebase, making upgrades a simple task that can be completed in seconds with zero downtime. Azure Cosmos DB simply flips a few feature flags to go from one version to another.  The feature flags also enable continued support for older API versions such as 3.2 and 3.6. You can choose the server version that works best for you.

## What you need to know to get started

- You aren't billed for virtual machines in a cluster. [Pricing](../how-pricing-works.md) is based on throughput in request units (RUs) configured on a per database or per collection basis. The first 1000 RUs per second are free with [Free Tier](../free-tier.md).

- There are three ways to deploy the API for MongoDB:

  - [Provisioned throughput](../set-throughput.md): Set a RU/sec number and change it manually. This model best fits consistent workloads.

  - [Autoscale](../provision-throughput-autoscale.md): Set an upper bound on the throughput you need. Throughput instantly scales to match your needs. This model best fits workloads that change frequently and optimizes their costs.

  - [Serverless](../serverless.md): Only pay for the throughput you use, period. This model best fits dev/test workloads.

- Sharded cluster performance is dependent on the shard key you choose when creating a collection. Choose a shard key carefully to ensure that your data is evenly distributed across shards.

## Frequently asked questions

1. Does Cosmos DB for MongoDB support my data residency requirements?

    Yes, data residency is governed at the Database account level which is associated with one or more regions. Customers typically create a database account for each residency requirement. For example, if you have a requirement to store data in the US and EU, you would create two database accounts, one in the US and one in the EU.

2. Does Cosmos DB for MongoDB support documents larger than 2 MB?

    Yes, documents larger than 2 MB are supported. This feature can be enabled on your database account via the Azure portal or programmatically. As with all MongoDB services, larger documents are not recommended and should be avoided if possible.

3. Does Cosmos DB for MongoDB support multi-field sort?

    Yes, multi-field sort is supported. A compound index is required for the fields in the sort to ensure the operation is efficient and scalable.

4. How can I encrypt data and manage access at the field level?

    Cosmos DB for MongoDB supports Field Level Encryption.

5. How do I pay for Request Units (RUs)?

    Cosmos DB for MongoDB offers thre capacity modes: provisioned throughput, autoscale, and serverless. None require an upfront commitment. Autoscale instantaneously scales to meet your needs (with a 10% minimum charge), and serverless only charges for the throughput you use.

6. Which features are supported in Cosmos DB for MongoDB?

    Cosmos DB for MongoDB supports a rich set of MongoDB features, including: Aggregation pipelines, Change streams, Indexes, Geospatial queries, and more. See the [feature support matrix](feature-support-42.md) for more details. 

4. Does Cosmos DB for MongoDB run on-premises?

    Cosmos DB for MongoDB is a cloud-native multi-tenant service and is not available on-premises. Cosmos DB does offer an emulator for local development and testing.


## Next steps

- Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-account.md) tutorial to learn how to get your account connection string information.
- Follow the [Use Studio 3T with Azure Cosmos DB](connect-using-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in Studio 3T.
- Follow the [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to an Azure Cosmos DB database.
