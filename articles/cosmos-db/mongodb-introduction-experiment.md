---
title: Introduction to Azure Cosmos DB API for MongoDB
description: Learn how you can use Azure Cosmos DB to store and query massive amounts of data using Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 04/20/2021
author: gahl-levy
ms.author: gahllevy
robots: noindex

---
# Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

The Azure Cosmos DB API for MongoDB makes it easy to use Cosmos DB as if it were a MongoDB database. You can leverage your MongoDB experience and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the API for MongoDB account's connection string.

The API for MongoDB has the following added benefits of being built on [Azure Cosmos DB](introduction.md):

* **Instantaneous scalability**: By enabling the [Autoscale](provision-throughput-autoscale.md) feature, your database can scale up/down with zero warmup period. 
* **Fully managed sharding**: Managing database infrastructure is hard and time consuming. The API for MongoDB manages the infrastructure for you, which includes sharding. So you don't have to worry about the management and focus your time on building applications for your users.
* **Up to five 9's of availability**: [99.999% availability](high-availability.md) is easily configurable to ensure your data is always there for you.  
* **Cost efficient, unlimited scalability**: Sharded collections can scale to any size, in a cost-efficient manner, in increments as small as 1/100th of a VM due to economies of scale and resource governance.
* **Upgrades take seconds**: All API versions are contained within one codebase, making version changes as simple as [flipping a switch](mongodb-version-upgrade.md), with zero downtime.
* **Synapse link analytics**: Analyze your real-time data using the fully-isolated [Azure Synapse analytical store](synapse-link.md) for fast and cheap analytics queries. A simple checkbox ensures your data is available in Synapse with no-ETL (extract-transform-load).

> [!NOTE]
> [You can use Azure Cosmos DB API for MongoDB for free with the free Tier!](how-pricing-works.md). With Azure Cosmos DB free tier, you'll get the first 400 RU/s and 5 GB of storage in your account for free, applied at the account level.


## How the API works

Azure Cosmos DB API for MongoDB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with native MongoDB client SDKs, drivers, and tools. Azure Cosmos DB does not host the MongoDB database engine. Any MongoDB client driver compatible with the API version you are using should be able to connect, with no special configuration.

MongoDB feature compatibility:

Azure Cosmos DB API for MongoDB is compatible with the following MongoDB server versions:
- [Version 4.0](mongodb-feature-support-40.md)
- [Version 3.6](mongodb-feature-support-36.md)
- [Version 3.2](mongodb-feature-support.md)

All the API for MongoDB versions run on the same codebase, making upgrades a simple task that can be completed in seconds with zero downtime. Azure Cosmos DB simply flips a few feature flags to go from one version to another.  The feature flags also enable continued support for older API versions such as 3.2 and 3.6. You can choose the server version that works best for you.

:::image type="content" source="./media/mongodb-introduction/cosmosdb-mongodb.png" alt-text="Azure Cosmos DB's API for MongoDB" border="false":::

## What you need to know to get started

* You are not billed for virtual machines in a cluster. [Pricing](how-pricing-works.md) is based on throughput in request units (RUs) configured on a per database or per collection basis. The first 400 RUs per second are free with [Free Tier](how-pricing-works.md).

* There are three ways to deploy Azure Cosmos DB API for MongoDB:
     * [Provisioned throughput](set-throughput.md): Set a RU/sec number and change it manually. This model best fits consistent workloads.
     * [Autoscale](provision-throughput-autoscale.md): Set an upper bound on the throughput you need. Throughput instantly scales to match your needs. This model best fits workloads that change frequently and optimizes their costs.
     * [Serverless](serverless.md) (preview): Only pay for the throughput you use, period. This model best fits dev/test workloads. 

* Sharded cluster performance is dependent on the shard key you choose when creating a collection. Choose a shard key carefully to ensure that your data is evenly distributed across shards.

## Quickstart

* [Migrate an existing MongoDB Node.js web app](create-mongodb-nodejs.md).
* [Build a web app using Azure Cosmos DB's API for MongoDB and .NET SDK](create-mongodb-dotnet.md)
* [Build a console app using Azure Cosmos DB's API for MongoDB and Java SDK](create-mongodb-java.md)

## Next steps

* Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use Studio 3T with Azure Cosmos DB](mongodb-mongochef.md) tutorial to learn how to create a connection between your Cosmos database and MongoDB app in Studio 3T.
* Follow the [Import MongoDB data into Azure Cosmos DB](../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to a Cosmos database.
* Connect to a Cosmos account using [Robo 3T](mongodb-robomongo.md).
* Learn how to [Configure read preferences for globally distributed apps](../cosmos-db/tutorial-global-distribution-mongodb.md).
* Find the solutions to commonly found errors in our [Troubleshooting guide](mongodb-troubleshoot.md)
