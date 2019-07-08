---
title: Introduction to Azure Cosmos DB's API for MongoDB
description: Learn how you can use Azure Cosmos DB to store and query massive amounts of data using Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 05/20/2019
author: sivethe
ms.author: sivethe
---
# Azure Cosmos DB's API for MongoDB

[Azure Cosmos DB](introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partition-data.md) worldwide, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models. By default, you can interact with Cosmos DB using SQL API. Additionally, the Cosmos DB service implements wire protocols for common NoSQL APIs including Cassandra, MongoDB, Gremlin, and Azure Table Storage. This allows you to use your familiar NoSQL client drivers and tools to interact with your Cosmos database.

## Wire protocol compatibility

Azure Cosmos DB implements wire protocols of common NoSQL databases including Cassandra, MongoDB, Gremlin, and Azure Tables Storage. By providing a native implementation of the wire protocols directly and efficiently inside Cosmos DB, it allows existing client SDKs, drivers, and tools of the NoSQL databases to interact with Cosmos DB transparently. Cosmos DB does not use any source code of the databases for providing wire-compatible APIs for any of the NoSQL databases.

By default, Azure Cosmos DB's API for MongoDB is compatible with version 3.2 of the MongoDB's wire protocol. Features or query operators added in version 3.4 of the wire protocol are currently available as a preview feature. Any MongoDB client driver that understands these protocol versions should be able to natively connect to Cosmos DB.

![Azure Cosmos DB's API for MongoDB](./media/mongodb-introduction/cosmosdb-mongodb.png) 

## Key benefits

The key benefits of Cosmos DB as a fully managed, globally distributed, database as a service are described [here](introduction.md). Additionally, by natively implementing wire protocols of popular NoSQL APIs, Cosmos DB provides the following benefits:

* Easily migrate your application to Cosmos DB while preserving significant portions of your application logic.
* Keep your application portable and continue to remain cloud vendor-agnostic.
* Get industry leading, financially backed SLAs for the common NoSQL APIs powered by Cosmos DB.
* Elastically scale the provisioned throughput and storage for your Cosmos databases based on your need and pay only for the throughput and storage you need. This leads to significant cost savings.
* Turnkey, global distribution with multi-master replication.

## Cosmos DB's API for MongoDB

Follow the quickstarts to create an Cosmos account and migrate your existing MongoDB application to use Azure Cosmos DB, or build a new one:

* [Migrate an existing MongoDB Node.js web app](create-mongodb-nodejs.md).
* [Build a web app using Azure Cosmos DB's API for MongoDB and .NET SDK](create-mongodb-dotnet.md)
* [Build a console app using Azure Cosmos DB's API for MongoDB and Java SDK](create-mongodb-java.md)

## Next steps

Here are a few pointers to get you started:

* Follow the [Connect a MongoDB application to Azure Cosmos DB](connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use Studio 3T with Azure Cosmos DB](mongodb-mongochef.md) tutorial to learn how to create a connection between your Cosmos database and MongoDB app in Studio 3T.
* Follow the [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md) tutorial to import your data to a Cosmos database.
* Connect to a Cosmos account using [Robo 3T](mongodb-robomongo.md).
* Learn how to [Configure read preferences for globally distributed apps](../cosmos-db/tutorial-global-distribution-mongodb.md).

<sup>Note: This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.</sup>
