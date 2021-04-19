---
title: Introduction to Azure Cosmos DB's API for MongoDB
description: Learn how you can use Azure Cosmos DB to store and query massive amounts of data using Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 11/25/2020
author: sivethe
ms.author: sivethe
---
# Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

## Overview
The Azure Cosmos DB API for MongoDB makes it easy to use Cosmos DB as if it were a MongoDB database. You can leverage your MongoDB experience and continue to use your favorite MongoDB drivers, SDKs, and tools by simply pointing your application to your Azure Cosmos DB API for MongoDB account connection string. It's the API you love, with the added benefits of being built on Azure Cosmos DB such as:

* Instantaneous scalability: With Autoscale throughput enabled, your database will scale up/down with zero warmup period, keeping your users happy. 
* Fully managed sharding: Managing database infrastructure is hard work. Azure Cosmos DB API for MongoDB manages the infrastructure (including sharding) for you, leaving you with time to focus on what you do best - building applications for your users.
* Up to Five 9's of availability: 99.999% availability is easily configurable to ensure your data is always there for you.  
* Upgrades take seconds: All API versions are contained within one codebase, making version changes as simple as flipping a switch, with zero downtime.
* Cost efficient, unlimited scalability: Sharded collections can scale to any size, in a cost-efficient manner, in increments as small as 1/100th of a VM utilizing our economies of scale. 

## How the API works

Azure Cosmos DB API for MongoDB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with native MongoDB client SDKs, drivers, and tools. Azure Cosmos DB does not host the MongoDB database engine. Any MongoDB client driver compatible with the API version you are using should be able to connect, with no special configuration.

MongoDB feature compatibility:
- [Azure Cosmos DB's API for Mongo DB engine version 4.0](mongodb-feature-support-40.md)
- [Azure Cosmos DB's API for Mongo DB engine version 3.6](mongodb-feature-support-36.md)
- [Azure Cosmos DB's API for Mongo DB engine version 3.2](mongodb-feature-support.md)

All Azure Cosmos DB API for MongoDB API versions run on the same codebase, making upgrades a simple task that can be completed in seconds with zero downtime. Azure Cosmos DB simply flips a few feature flags to go from version to version!

:::image type="content" source="./media/mongodb-introduction/cosmosdb-mongodb.png" alt-text="Azure Cosmos DB's API for MongoDB" border="false":::

## What you need to know to get started

The key benefits of Cosmos DB as a fully managed, globally distributed, database as a service are described [here](introduction.md). Additionally, by natively implementing wire protocols of popular NoSQL APIs, Cosmos DB provides the following benefits:

* Easily migrate your application to Cosmos DB while preserving significant portions of your application logic.
* Keep your application portable and continue to remain cloud vendor-agnostic.
* Get industry leading, financially backed SLAs for the common NoSQL APIs powered by Cosmos DB.
* Elastically scale the provisioned throughput and storage for your Cosmos databases based on your need and pay only for the throughput and storage you need. This leads to significant cost savings.
* Turnkey, global distribution with multi-region writes replication.

## Cosmos DB's API for MongoDB

Follow the quickstarts to create an Azure Cosmos account and migrate your existing MongoDB application to use Azure Cosmos DB, or build a new one:

* [Migrate an existing MongoDB Node.js web app](create-mongodb-nodejs.md).
* [Build a web app using Azure Cosmos DB's API for MongoDB and .NET SDK](create-mongodb-dotnet.md)
* [Build a console app using Azure Cosmos DB's API for MongoDB and Java SDK](create-mongodb-java.md)

## Next steps

Here are a few pointers to get you started:

* Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use Studio 3T with Azure Cosmos DB](mongodb-mongochef.md) tutorial to learn how to create a connection between your Cosmos database and MongoDB app in Studio 3T.
* Follow the [Import MongoDB data into Azure Cosmos DB](../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json) tutorial to import your data to a Cosmos database.
* Connect to a Cosmos account using [Robo 3T](mongodb-robomongo.md).
* Learn how to [Configure read preferences for globally distributed apps](../cosmos-db/tutorial-global-distribution-mongodb.md).
* Find the solutions to commonly found errors in our [Troubleshooting guide](mongodb-troubleshoot.md)

## About Azure Cosmos DB
[Azure Cosmos DB](introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partitioning-overview.md) worldwide, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models. Azure Cosmos DB service implements wire protocols for common NoSQL APIs including Cassandra, MongoDB, Gremlin, and Azure Table Storage. This allows you to use your familiar NoSQL client drivers and tools to interact with your Cosmos database.

<sup>Note: This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.</sup>