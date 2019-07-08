---
title: 'Azure Cosmos DB: Bulk Executor .NET API, SDK & resources'
description: Learn all about the Bulk Executor .NET API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Bulk Executor .NET SDK.
author: tknandu
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 11/19/2018
ms.author: ramkris

---

# .NET Bulk Executor library: Download information 

> [!div class="op_single_selector"]
> * [.NET](sql-api-sdk-dotnet.md)
> * [.NET Change Feed](sql-api-sdk-dotnet-changefeed.md)
> * [.NET Core](sql-api-sdk-dotnet-core.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Async Java](sql-api-sdk-async-java.md)
> * [Java](sql-api-sdk-java.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](https://docs.microsoft.com/rest/api/cosmos-db/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk Executor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk Executor - Java](sql-api-sdk-bulk-executor-java.md)

| |  |
|---|---|
| **Description**| The Bulk Executor library allows client applications to perform bulk operations on Azure Cosmos DB accounts. Bulk Executor library provides BulkImport, BulkUpdate, and BulkDelete namespaces. The BulkImport module can bulk ingest documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent. The BulkUpdate module can bulk update existing data in Azure Cosmos DB containers as patches. The BulkDelete module can bulk delete documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent.|
|**SDK download**| [NuGet](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.BulkExecutor/) |
| **BulkExecutor library in GitHub**| [GitHub](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started)|
|**API documentation**|[.NET API reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor?view=azure-dotnet)|
|**Get started**|[Get started with the Bulk Executor library .NET SDK](bulk-executor-dot-net.md)|
| **Current supported framework**| Microsoft .NET Framework 4.5.2, 4.6.1 and .NET Standard 2.0 |

## Release notes

### <a name="2.3.0-preview2"/>2.3.0-preview2

* Added support for graph bulk executor to accept ttl on vertices and edges

### <a name="2.2.0-preview2"/>2.2.0-preview2

* Fixed an issue, which caused exceptions during elastic scaling of Azure Cosmos DB when running in Gateway mode. This fix makes it functionally equivalent to 1.4.1 release.

### <a name="2.1.0-preview2"/>2.1.0-preview2

* Added BulkDelete support for SQL API accounts to accept partition key, document id tuples to delete. This change makes it functionally equivalent to 1.4.0 release.

### <a name="2.0.0-preview2"/>2.0.0-preview2

* Including MongoBulkExecutor to support .NET Standard 2.0. This feature makes it functionally equivalent to 1.3.0 release, with the addition of supporting .NET Standard 2.0 as the target framework.

### <a name="2.0.0-preview"/>2.0.0-preview

* Added .NET Standard 2.0 as one of the supported target frameworks to make the BulkExecutor library work with .NET Core applications.

### <a name="1.6.0"/>1.6.0

* Updated the Bulk Executor to now use the latest version of the Azure Cosmos DB .NET SDK (2.4.0)

### <a name="1.5.0"/>1.5.0

* Added support for graph bulk executor to accept ttl on vertices and edges

### <a name="1.4.1"/>1.4.1

* Fixed an issue, which caused exceptions during elastic scaling of Azure Cosmos DB when running in Gateway mode.

### <a name="1.4.0"/>1.4.0

* Added BulkDelete support for SQL API accounts to accept partition key, document id tuples to delete.

### <a name="1.3.0"/>1.3.0

* Fixed an issue, which caused a formatting issue in the user agent used by BulkExecutor.

### <a name="1.2.0"/>1.2.0

* Made improvement to BulkExecutor import and update APIs to transparently adapt to elastic scaling of Cosmos DB container when storage exceeds current capacity without throwing exceptions.

### <a name="1.1.2"/>1.1.2

* Bumped up the DocumentDB .NET SDK dependency to version 2.1.3.

### <a name="1.1.1"/>1.1.1

* Fixed an issue, which caused BulkExecutor to throw JSRT error while importing to fixed collections.

### <a name="1.1.0"/>1.1.0

* Added support for BulkDelete operation for Azure Cosmos DB SQL API accounts.
* Added support for BulkImport operation for accounts with Azure Cosmos DB's API for MongoDB.
* Bumped up the DocumentDB .NET SDK dependency to version 2.0.0. 

### <a name="1.0.2"/>1.0.2

* Added support for BulkImport operation for Azure Cosmos DB Gremlin API accounts.

### <a name="1.0.1"/>1.0.1

* Minor bug fix to the BulkImport operation for Azure Cosmos DB SQL API accounts.

### <a name="1.0.0"/>1.0.0

* Added support for BulkImport and BulkUpdate operations for Azure Cosmos DB SQL API accounts.

## Next steps

To learn about the Bulk Executor Java library, see the following article:

[Java Bulk Executor library SDK and release information](sql-api-sdk-bulk-executor-java.md)
