---
title: Using Azure Cosmos DB multi-master with open source NoSQL databases 
description: 
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mjbrown
ms.reviewer: sngun

---
# Using Azure Cosmos DB multi-master with open source NoSQL databases

Azure Cosmos DB multi-master support is a native, server-side implementation that is available to all the open source NoSQL offerings supported by Cosmos DB. It is also accessible by all Cosmos DB supported SDK’s.

Azure Cosmos DB is the first service in the world to offer multi-master support for these open source NoSQL databases.

|Model  |Support  |
|---------|---------|
|MongoDB  | Active-Active  |
|Graph  | Active-Active |
|Cassandra  | Active-Active   |

## Use MongoDB clients with multi-master

The multi-master feature is enabled for MongoDB API accounts in the same way it is enabled for other Azure Cosmos DB APIs. After enabling multi-master for MongoDB API accounts, each instance of a client application can select its preferred region for reads and writes. From the MongoDB driver perspective, the preferred region appears to the client as the replica set primary. In this manner, every region of your distributed database can act as replica set primary. Azure Cosmos DB multi-master allows you to significantly reduce write latencies for your globally distributed MongoDB applications. 

### Set the primary region

Each instance of a MongoDB client can select the primary region by appending `@<preferred_primary_region_name>` to the "application name" field accepted by the MongoDB client driver. Most drivers accept this in the connection string, such as:

`mongodb://fabrikam:KEY@fabrikam.documents.azure.com:10255/?ssl=true&replicaSet=globaldb&appname=@West US`

After connecting, one of the following cases can occur:

* If the preferred region name is available as a write region, then Azure Cosmos DB selects it as the primary region.

* If a preferred region name is not provided, then Azure Cosmos DB selects a default region as the primary region.

* If a preferred region name is provided but if it’s not available as a write region for the database account, then Azure Cosmos DB will select the closest write region that’s available as the primary region.

Certain drivers such as the NodeJS driver will always first issue writes to the host specified the initial connection string. For such drivers, to ensure writes are directed to the preferred region, in addition to the app name, you should modify the DNS name within the connection string to include the region name. Make sure you specify the region name without any spaces. For example:

`mongodb://fabrikam:KEY@fabrikam-westus.documents.azure.com:10255/?ssl=true&replicaSet=globaldb&appname=@West US`

### Conflict resolution mode

The conflict resolution mode for Azure Cosmos DB MongoDB API accounts is always last-writer-wins, using the regional server timestamp that accepted the write.

## Next steps

In this article, you learned about multi-master support for Azure Cosmos DB MongoDB API accounts. Next, look at the following resources:

* [How to enable multi-master for Azure Cosmos DB accounts](enable-multi-master.md)

* [Understanding conflict resolution in Azure Cosmos DB](multi-master-conflict-resolution.md)
