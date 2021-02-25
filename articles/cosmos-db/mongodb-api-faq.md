---
title: Frequently asked questions about the Azure Cosmos DB's API for MongoDB
description: Get answers to Frequently asked questions about the Azure Cosmos DB's API for MongoDB
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 04/28/2020
ms.author: sngun
---

# Frequently asked questions about the Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

The Azure Cosmos DB's API for MongoDB is a wire-protocol compatibility layer that allows applications to easily and transparently communicate with the native Azure Cosmos database engine by using existing, community-supported SDKs and drivers for MongoDB. Developers can now use existing MongoDB toolchains and skills to build applications that take advantage of Azure Cosmos DB. Developers benefit from the unique capabilities of Azure Cosmos DB, which include global distribution with multi-region write replication, auto-indexing, backup maintenance, financially backed service level agreements (SLAs) etc.

## How do I connect to my database?

The quickest way to connect to a Cosmos database with Azure Cosmos DB's API for MongoDB is to head over to the [Azure portal](https://portal.azure.com). Go to your account and then, on the left navigation menu, click **Quick Start**. Quickstart is the best way to get code snippets to connect to your database.

Azure Cosmos DB enforces strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via TLS, so be sure to use TLSv1.2.

For more information, see [Connect to your Cosmos database with Azure Cosmos DB's API for MongoDB](connect-mongodb-account.md).

## Error codes while using Azure Cosmos DB's API for MongoDB?

Along with the common MongoDB error codes, the Azure Cosmos DB's API for MongoDB has its own specific error codes. These can be found in the [Troubleshooting Guide](mongodb-troubleshoot.md).

## Supported drivers

### Is the Simba driver for MongoDB supported for use with Azure Cosmos DB's API for MongoDB?

Yes, you can use Simba's Mongo ODBC driver with Azure Cosmos DB's API for MongoDB

## Next steps

* [Build a .NET web app using Azure Cosmos DB's API for MongoDB](create-mongodb-dotnet.md)
* [Create a console app with Java and the MongoDB API in Azure Cosmos DB](create-mongodb-java.md)
