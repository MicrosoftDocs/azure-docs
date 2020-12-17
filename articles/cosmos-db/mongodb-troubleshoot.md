---
title: Troubleshoot common errors in Azure Cosmos DB's API for Mongo DB
description: This doc discusses the ways to troubleshoot common issues encountered in Azure Cosmos DB's API for MongoDB.
author: gahllevy
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: troubleshooting
ms.date: 12/17/2020
ms.author: gahllevy

---

# Troubleshoot common issues in Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

The following article describes common errors and solutions for deployments using the Azure Cosmos DB API for MongoDB.

>[!Note]
> Azure Cosmos DB does not host the MongoDB engine. It provides an implementation of the MongoDB wire protocol. Therefore, some of these errors are only found in Azure Cosmos DB's API for MongoDB. 

## Common errors and solutions

| Code       | Error                | Description  | Solution  |
|------------|----------------------|--------------|-----------|
| 2 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 13 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 16 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 26 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 50 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 61 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 66 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 67 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 115 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 11000 | ExceededTimeLimit   | The request has exceeded the timeout of 60 seconds of execution. | There can be many causes for this error. One of the causes is when the current allocated request units capacity is not sufficient to complete the request. This can be solved by increasing the request units of that collection or database. In other cases, this error can be worked-around by splitting a large request into smaller ones. |
| 16500 | TooManyRequests    | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput assigned to a container or a set of containers from the Azure portal or you can retry the operation. |
| 16501 | ExceededMemoryLimit | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Example: `db.getCollection('users').aggregate([{$match: {name: "Andy"}}, {$sort: {age: -1}}]))` |
| 40324 | The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |

| MongoDB wire version issues | - | The older versions of MongoDB drivers are unable to detect the Azure Cosmos account's name in the connection strings. | Append *appName=@**accountName**@* at the end of your Cosmos DB's API for MongoDB connection string, where ***accountName*** is your Cosmos DB account name. |

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.

