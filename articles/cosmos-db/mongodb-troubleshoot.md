---
title: Troubleshoot common errors in Azure Cosmos DB's API for Mongo DB
description: This doc discusses the ways to troubleshoot common issues encountered in Azure Cosmos DB's API for MongoDB.
author: LuisBosquez
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: troubleshooting
ms.date: 06/05/2019
ms.author: lbosq

---

# Troubleshoot common issues in Azure Cosmos DB's API for MongoDB

Azure Cosmos DB implements the wire protocols of common NoSQL databases, including MongoDB. Due to the wire protocol implementation, you can transparently interact with Azure Cosmos DB by using the existing client SDKs, drivers, and tools that work with NoSQL databases. Azure Cosmos DB does not use any source code of the databases for providing wire-compatible APIs for any of the NoSQL databases. Any MongoDB client driver that understands the wire protocol versions can connect to Azure Cosmos DB.

While Azure Cosmos DB's API for MongoDB is compatible with 3.2 version of the MongoDB's wire protocol (the query operators and features added in version 3.4 are currently available as a preview), there are some custom error codes that correspond to Azure Cosmos DB specific errors. This article explains different errors, error codes, and the steps to resolve those errors.

## Common errors and solutions

| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput assigned to a container or a set of containers from the Azure portal or you can retry the operation. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Example: `db.getCollection('users').aggregate([{$match: {name: "Andy"}}, {$sort: {age: -1}}]))` |
| The index path corresponding to the specified order-by item is excluded / The order by query does not have a corresponding composite index that it can be served from. | 2 | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| MongoDB wire version issues | - | The older versions of MongoDB drivers are unable to detect the Azure Cosmos account's name in the connection strings. | Append *appName=@**accountName**@* at the end of your Cosmos DB's API for MongoDB connection string, where ***accountName*** is your Cosmos DB account name. |


## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.

