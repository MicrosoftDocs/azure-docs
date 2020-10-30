---
title: Troubleshoot common errors in Azure Cosmos DB's API for Mongo DB
description: This doc discusses the ways to troubleshoot common issues encountered in Azure Cosmos DB's API for MongoDB.
author: jasonwhowell
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: troubleshooting
ms.date: 07/15/2020
ms.author: jasonh

---

# Troubleshoot common issues in Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

The following article describes common errors and solutions for databases using the Azure Cosmos DB API for MongoDB.

>[!Note]
> Azure Cosmos DB does not host the MongoDB engine. It provides an implementation of the MongoDB [wire protocol version 3.6](mongodb-feature-support-36.md) and legacy support for [wire protocol version 3.2](mongodb-feature-support.md), therefore some of these errors are only found in Azure Cosmos DB's API for MongoDB. 

## Common errors and solutions

| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| ExceededTimeLimit   | 50 | The request has exceeded the timeout of 60 seconds of execution. | There can be many causes for this error. One of the causes is when the current allocated request units capacity is not sufficient to complete the request. This can be solved by increasing the request units of that collection or database. In other cases, this error can be worked-around by splitting a large request into smaller ones. |
| TooManyRequests     | 16500 | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput assigned to a container or a set of containers from the Azure portal or you can retry the operation. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Example: `db.getCollection('users').aggregate([{$match: {name: "Andy"}}, {$sort: {age: -1}}]))` |
| The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | 2 | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| MongoDB wire version issues | - | The older versions of MongoDB drivers are unable to detect the Azure Cosmos account's name in the connection strings. | Append *appName=@**accountName**@* at the end of your Cosmos DB's API for MongoDB connection string, where ***accountName*** is your Cosmos DB account name. |

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.

