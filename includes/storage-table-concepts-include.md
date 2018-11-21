---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
## What is Table storage
Azure Table storage stores large amounts of structured data. The service is a NoSQL datastore which accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data. Common uses of Table storage include:

* Storing TBs of structured data capable of serving web scale applications
* Storing datasets that don't require complex joins, foreign keys, or stored procedures and can be denormalized for fast access
* Quickly querying data using a clustered index
* Accessing data using the OData protocol and LINQ queries with WCF Data Service .NET Libraries

You can use Table storage to store and query huge sets of structured, non-relational data, and your tables will scale as demand increases.

## Table storage concepts
Table storage  contains the following components:

![Tables storage component diagram][Table1]

* **URL format:** Azure Table Storage accounts use this format: `http://<storage account>.table.core.windows.net/<table>`

  Azure Cosmos DB Table API accounts use this format: 
  `http://<storage account>.table.cosmosdb.azure.com/<table>`  

  You can address Azure tables directly using this address with the OData protocol. For more information, see [OData.org][OData.org].
* **Accounts:** All access to Azure Storage is done through a storage account. See [Azure Storage Scalability and Performance Targets](../articles/storage/common/storage-scalability-targets.md) for details about storage account capacity. 

    All access to Azure Cosmos DB is done through a Table API account. See [Create a Table API account](../articles/cosmos-db/create-table-dotnet.md#create-a-database-account) for details creating a Table API account.
* **Table**: A table is a collection of entities. Tables don't enforce a schema on entities, which means a single table can contain entities that have different sets of properties.  
* **Entity**: An entity is a set of properties, similar to a database row. An entity in Azure Storage can be up to 1MB in size. An entity in Azure Cosmos DB can be up to 2MB in size.
* **Properties**: A property is a name-value pair. Each entity can include up to 252 properties to store data. Each entity also has three system properties that specify a partition key, a row key, and a timestamp. Entities with the same partition key can be queried more quickly, and inserted/updated in atomic operations. An entity's row key is its unique identifier within a partition.

For details about naming tables and properties, see [Understanding the Table Service Data Model](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model).

[Table1]: ./media/storage-table-concepts-include/table1.png
[OData.org]: http://www.odata.org/
