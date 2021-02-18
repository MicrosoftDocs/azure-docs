---
title: Troubleshoot common errors in Azure Cosmos DB's API for Mongo DB
description: This doc discusses the ways to troubleshoot common issues encountered in Azure Cosmos DB's API for MongoDB.
author: christopheranderson
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: troubleshooting
ms.date: 07/15/2020
ms.author: chrande

---

# Troubleshoot common issues in Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

The following article describes common errors and solutions for deployments using the Azure Cosmos DB API for MongoDB.

>[!Note]
> Azure Cosmos DB does not host the MongoDB engine. It provides an implementation of the MongoDB [wire protocol version 4.0](mongodb-feature-support-40.md), [3.6](mongodb-feature-support-36.md), and legacy support for [wire protocol version 3.2](mongodb-feature-support.md). Therefore, some of these errors are only found in Azure Cosmos DB's API for MongoDB.

## Common errors and solutions

| Code       | Error                | Description  | Solution  |
|------------|----------------------|--------------|-----------|
| 2 | The index path corresponding to the specified order-by item is excluded or the order by query does not have a corresponding composite index that it can be served from. | The query requests a sort on a field that is not indexed. | Create a matching index (or composite index) for the sort query being attempted. |
| 13 | Unauthorized | The request lacks the permissions to complete. | Ensure that you set proper permissions for your database and collection.  |
| 16 | InvalidLength | The request specified has an invalid length. | If you are using the explain() function, ensure that you supply only one operation. |
| 26 | NamespaceNotFound | The database or collection being referenced in the query cannot be found. | Ensure your database/collection name precisely matches the name in your query.|
| 50 | ExceededTimeLimit | The request has exceeded the timeout of 60 seconds of execution. |  There can be many causes for this error. One of the causes is when the currently allocated request units capacity is not sufficient to complete the request. This can be solved by increasing the request units of that collection or database. In other cases, this error can be worked-around by splitting a large request into smaller ones. Retrying a write operation that has received this error may result in a duplicate write. <br><br>If you are trying to delete large amounts of data without impacting RUs: <br>-Consider using TTL (Based on Timestamp): [Expire data with Azure Cosmos DB's API for MongoDB](https://docs.microsoft.com/azure/cosmos-db/mongodb-time-to-live) <br>-Use Cursor/Batch size to perform the delete. You can fetch a single document at a time and delete it through a loop. This will help you slowly delete data without impacting your production application.|
| 61 | ShardKeyNotFound | The document in your request did not contain the collection's shard key (Azure Cosmos DB partition key). | Ensure the collection's shard key is being used in the request.|
| 66 | ImmutableField | The request is attempting to change an immutable field | "id" fields are immutable. Ensure that your request does not attempt to update that field. |
| 67 | CannotCreateIndex | The request to create an index cannot be completed. | Up to 500 single field indexes can be created in a container. Up to eight fields can be included in a compound index (compound indexes are supported in version 3.6+). |
| 115 | CommandNotSupported | The request attempted is not supported. | Additional details should be provided in the error. If this functionality is important for your deployments, please let us know by creating a support ticket in the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). |
| 11000 | DuplicateKey | The shard key (Azure Cosmos DB partition key) of the document you're inserting already exists in the collection or a unique index field constraint has been violated. | Use the update() function to update an existing document. If the unique index field constraint has been violated, insert or update the document with a field value that does not exist in the shard/partition yet. |
| 16500 | TooManyRequests  | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput assigned to a container or a set of containers from the Azure portal or you can retry the operation. If you [enable SSR](prevent-rate-limiting-errors.md) (server-side retry), Azure Cosmos DB automatically retries the requests that fail due to this error. |
| 16501 | ExceededMemoryLimit | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Example: `db.getCollection('users').aggregate([{$match: {name: "Andy"}}, {$sort: {age: -1}}]))` |
| 40324 | Unrecognized pipeline stage name. | The stage name in your aggregation pipeline request was not recognized. | Ensure that all aggregation pipeline names are valid in your request. |
| - | MongoDB wire version issues | The older versions of MongoDB drivers are unable to detect the Azure Cosmos account's name in the connection strings. | Append *appName=@**accountName**@* at the end of your Cosmos DB's API for MongoDB connection string, where ***accountName*** is your Cosmos DB account name. |
| - | MongoDB client networking issues (such as socket or endOfStream exceptions)| The network request has failed. This is often caused by an inactive TCP connection that the MongoDB client is attempting to use. MongoDB drivers often utilize connection pooling, which results in a random connection chosen from the pool being used for a request. Inactive connections typically timeout on the Azure Cosmos DB end after four minutes. | You can either retry these failed requests in your application code, change your MongoDB client (driver) settings to teardown inactive TCP connections before the four-minute timeout window, or configure your OS keepalive settings to maintain the TCP connections in an active state.<br><br>To avoid connectivity messages, you may want to change the connection string to set maxConnectionIdleTime to 1-2 minutes.<br>- Mongo driver: configure *maxIdleTimeMS=120000* <br>- Node.JS: configure *socketTimeoutMS=120000*, *autoReconnect* = true, *keepAlive* = true, *keepAliveInitialDelay* = 3 minutes

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.
