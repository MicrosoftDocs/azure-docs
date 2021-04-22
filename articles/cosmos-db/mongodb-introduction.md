---
title: Introduction to Azure Cosmos DB's API for MongoDB
description: Learn how you can use Azure Cosmos DB to store and query massive amounts of data using Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 04/21/2021
author: sivethe
ms.author: sivethe
adobe-target: true
adobe-target-activity: DocsExp– 396298–A/B–Docs–IntroToCosmosDBAPIforMongoDB-Revamp–FY21Q4
adobe-target-experience: Experience B
adobe-target-content: ./mongodb-introduction-experiment

---
# Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

[Azure Cosmos DB](introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partitioning-overview.md) worldwide, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models. Azure Cosmos DB service implements wire protocols for common NoSQL APIs including Cassandra, MongoDB, Gremlin, and Azure Table Storage. This allows you to use your familiar NoSQL client drivers and tools to interact with your Cosmos database.

> [!NOTE]
> The [serverless capacity mode](serverless.md) is now available on Azure Cosmos DB's API for MongoDB.

## Wire protocol compatibility

Azure Cosmos DB implements the wire protocol for MongoDB. This implementation allows transparent compatibility with native MongoDB client SDKs, drivers, and tools. Azure Cosmos DB does not host the MongoDB database engine. The details of the supported features by MongoDB can be found here: 
- [Azure Cosmos DB's API for Mongo DB version 4.0](mongodb-feature-support-40.md)
- [Azure Cosmos DB's API for Mongo DB version 3.6](mongodb-feature-support-36.md)

By default, new accounts created using Azure Cosmos DB's API for MongoDB are compatible with version 3.6 of the MongoDB wire protocol. Any MongoDB client driver that understands this protocol version should be able to natively connect to Cosmos DB.

:::image type="content" source="./media/mongodb-introduction/cosmosdb-mongodb.png" alt-text="Azure Cosmos DB's API for MongoDB" border="false":::

## Key benefits

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


<sup>Note: This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.</sup>
