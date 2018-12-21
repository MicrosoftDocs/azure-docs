---
title: 'Introduction to Azure Cosmos DB for MongoDB API'
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of JSON documents with low latency using the popular OSS MongoDB API.
keywords: Azure Cosmos DB for MongoDB API
services: cosmos-db
author: SnehaGunda

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.topic: overview
ms.date: 12/19/2018
ms.author: sclyon
experimental: true
experiment_id: "662dc5fd-886f-4a"
---
# Azure Cosmos DB for MongoDB API clients

[Azure Cosmos DB](introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partition-data.md) worldwide, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models. By default, you can interact with Cosmos DB using SQL API. Additionally, the Cosmos DB service implements wire protocols for common NoSQL APIs including Cassandra, MongoDB, Gremlin, and Azure Table Storage. This allows you to use your familiar NoSQL client drivers and tools to interact with your Cosmos database.

## Wire protocol compatibility

Cosmos DB implements wire protocols of common NoSQL databases including Cassandra, MongoDB, Gremlin, and Azure Tables Storage. By providing a native implementation of the wire protocols directly and efficiently inside Cosmos DB, it allows existing client SDKs, drivers, and tools of the NoSQL databases to interact with Cosmos DB transparently. Cosmos DB does not use any source code of the databases for providing wire-compatible APIs for any of the NoSQL databases.

By default, the Azure Cosmos DB for MongoDB API is compatible with version 3.2 of the wire protocol. Features or query operators added in version 3.4 of the wire protocol are currently available as a preview feature. Any client driver that understands these protocol versions for the MongoDB API should be able to natively connect to Azure Cosmos DB.

![Azure Cosmos DB for MongoDB API](./media/mongodb-introduction/cosmosdb-mongodb.png) 

## Key benefits

The key benefits of Cosmos DB as a fully managed, globally distributed, database as a service are described [here](introduction.md). Additionally, by natively implementing wire protocols of popular NoSQL APIs, Cosmos DB provides the following benefits:

* Easily migrate your application to Cosmos DB while preserving significant portions of your application logic.
* Keep your application portable and continue to remain cloud vendor-agnostic.
* Get industry leading, financially backed SLAs for the common NoSQL APIs powered by Cosmos DB.
* Elastically scale the provisioned throughput and storage for your Cosmos databases based on your need and pay only for the throughput and storage you need. This leads to significant cost savings.
* Turnkey, global distribution with multi-master replication.

## Cosmos DB for MongoDB API clients

Follow the MongoDB quickstarts to create an Azure Cosmos DB account and migrate your existing MongoDB application to use Azure Cosmos DB, or build a new one:

* [Migrate an existing Node.js MongoDB web app](create-mongodb-nodejs.md).
* [Build a web app with .NET and the Azure portal using Azure Cosmos DB for MongoDB API](create-mongodb-dotnet.md)
* [Build a console app with Java and the Azure portal using Azure Cosmos DB for MongoDB API](create-mongodb-java.md)

## Next steps

Here are a few pointers to get you started:

* Follow the [Connect to a MongoDB account](connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use Studio 3T (MongoChef) with Azure Cosmos DB](mongodb-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in Studio 3T.
* Follow the [Migrate data to Azure Cosmos DB with protocol support for MongoDB API](mongodb-migrate.md) tutorial to import your data to a Cosmos database.
* Connect to a Cosmos account using [Robomongo](mongodb-robomongo.md).
* Learn how to [configure read preferences for globally distributed apps](../cosmos-db/tutorial-global-distribution-mongodb.md).

<sup>Note: This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.</sup>
