---
title: Commonly encountered errors with resolution in Azure Cosmos DB's API for Mongo DB. 
description: This doc provides the post-migration optimization techniques from MongoDB to Azure Cosmos DB's APi for Mongo DB.
author: roaror
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: roaror

---

# Custom errors and how to resolve them

After you migrate the data stored in MongoDB database to Azure Cosmos DB’s API for MongoDB, you can connect to Azure Cosmos DB and manage the data. This guide provides the steps you should consider after the migration. See the [Migrate MongoDB to Azure Cosmos DB’s API for MongoDB tutorial](../dms/tutorial-mongodb-cosmos-db.md) for the migration steps.

Azure Cosmos DB implements the wire protocols of common NoSQL databases, including MongoDB. By providing a native implementation of the wire protocols directly and efficiently inside Cosmos DB, it allows existing client SDKs, drivers, and tools of the NoSQL databases to interact with Cosmos DB transparently. Cosmos DB does not use any source code of the databases for providing wire-compatible APIs for any of the NoSQL databases. Any MongoDB client driver that understands the wire protocol versions should be able to natively connect to Cosmos DB. 

While Azure Cosmos DB's API for MongoDB is compatible with version 3.2 of the MongoDB's wire protocol (and features or query operators added in version 3.4 of the wire protocol are currently available as a preview feature), there are some custom error codes that apply to point users to Cosmos DB specific errors. These, along with their respective solutions are discussed below.

# Custom error codes and solutions

| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput  assigned to a container or a set of containers from the Azure portal or retrying again. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). <br><br>Example: <em>&nbsp;&nbsp;&nbsp;&nbsp;db.getCollection('users').aggregate([<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$match: {name: "Andy"}}, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$sort: {age: -1}}<br>&nbsp;&nbsp;&nbsp;&nbsp;])</em>) |


