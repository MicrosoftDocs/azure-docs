---
title: Introduction
titleSuffix: Azure Cosmos DB for MongoDB
description: Use Azure Cosmos DB for MongoDB to store and query massive amounts of data using popular open-source drivers.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: overview
ms.date: 11/30/2022
ms.custom: ignite-2022
---

# Introduction to Azure Cosmos DB for MongoDB

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for MongoDB makes it easy to use Azure Cosmos DB as if it were a MongoDB database. You can use your existing MongoDB skills and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the connection string for your account using the API for MongoDB.

> [!TIP]
> Want to try the API for MongoDB with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## API for MongoDB benefits

The API for MongoDB has added benefits of being built on Azure Cosmos DB when compared to service offerings such as MongoDB Atlas:

- **Instantaneous scalability**: With the [Autoscale](../provision-throughput-autoscale.md) feature, your database can scale up/down with zero warmup period.

- **Automatic and transparent sharding**: The API for MongoDB manages all of the infrastructure for you. This management includes sharding and optimizing the number of shards. Other MongoDB offerings such as MongoDB Atlas, require you to specify and manage sharding to horizontally scale. This automation gives you more time to focus on developing applications for your users.

- **Five 9's of availability**: [99.999% availability](../high-availability.md) is easily configurable to ensure your data is always there for you.  

- **Cost efficient, granular, unlimited scalability**: Sharded collections can scale to any size, unlike other MongoDB service offerings. APIs for MongoDB users are running databases with over 600 TB of storage today. Scaling is done in a cost-efficient manner unlike other MongoDB service offerings. The Azure Cosmos DB platform can scale in increments as small as 1/100th of a VM due to economies of scale and resource governance.

- **Serverless deployments**: Unlike MongoDB Atlas, the API for MongoDB is a cloud native database that offers a [serverless capacity mode](../serverless.md). With [Serverless](../serverless.md), you're only charged per operation, and don't pay for the database when you don't use it.

- **Free Tier**: With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage in your account for free forever, applied at the account level.

- **Upgrades take seconds**: All API versions are contained within one codebase, making version changes as simple as [flipping a switch](upgrade-version.md), with zero downtime.

- **Real time analytics (HTAP) at any scale**: The API for MongoDB offers the ability to run complex analytical queries. Use cases for these queries include business intelligence that can run against your database data in real time with no effect on your database. This analysis is fast and inexpensive, due to the cloud native analytical columnar store being utilized, with no ETL pipelines. Learn more about the [Azure Synapse Link](../synapse-link.md).

## How the API for MongoDB works

The API for MongoDB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with native MongoDB client SDKs, drivers, and tools. Azure Cosmos DB doesn't host the MongoDB database engine. Any MongoDB client driver compatible with the API version you're using should be able to connect, with no special configuration.

> [!IMPORTANT]
> This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.

### MongoDB feature compatibility

The API for MongoDB is compatible with the following MongoDB server versions:

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

## Next steps

> [!div class="nextstepaction"]
> [Get started with our Node.js Quickstart](quickstart-nodejs.md)

Want to learn more?

- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
- Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-account.md) tutorial to learn how to get your account connection string information.
- Follow the [Use Studio 3T with Azure Cosmos DB](connect-using-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in Studio 3T.
- Follow the [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to an Azure Cosmos DB database.
- Connect to an Azure Cosmos DB account using [Robo 3T](connect-using-robomongo.md).
- Learn how to [Configure read preferences for globally distributed apps](tutorial-global-distribution.md).
- Find the solutions to commonly found errors in our [Troubleshooting guide](error-codes-solutions.md)
- Configure near real time analytics with [Azure Synapse Link for Azure Cosmos DB](../configure-synapse-link.md)
