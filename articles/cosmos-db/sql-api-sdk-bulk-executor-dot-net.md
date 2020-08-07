---
title: 'Azure Cosmos DB: Bulk executor .NET API, SDK & resources'
description: Learn all about the bulk executor .NET API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB bulk executor .NET SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 05/27/2020
ms.author: anfeldma
---

# .NET bulk executor library: Download information 

> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| |  |
|---|---|
| **Description**| The .NET bulk executor library allows client applications to perform bulk operations on Azure Cosmos DB accounts. This  library provides BulkImport, BulkUpdate, and BulkDelete namespaces. The BulkImport module can bulk ingest documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent. The BulkUpdate module can bulk update existing data in Azure Cosmos containers as patches. The BulkDelete module can bulk delete documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent.|
|**SDK download**| [NuGet](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.BulkExecutor/) |
| **Bulk executor library in GitHub**| [GitHub](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started)|
|**API documentation**|[.NET API reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor?view=azure-dotnet)|
|**Get started**|[Get started with the bulk executor library .NET SDK](bulk-executor-dot-net.md)|
| **Current supported framework**| Microsoft .NET Framework 4.5.2, 4.6.1 and .NET Standard 2.0 |

> [!NOTE]
> If you are using bulk executor, please see the latest version 3.x of the [.NET SDK](tutorial-sql-api-dotnet-bulk-import.md), which has bulk executor built into the SDK. 

## Release notes

### <a name="2.4.1-preview"></a>2.4.1-preview

* Fixed TotalElapsedTime in the response of BulkDelete to correctly measure the total time including any retries.

### <a name="2.4.0-preview"></a>2.4.0-preview

* Changed SDK dependency to >= 2.5.1

### <a name="2.3.0-preview2"></a>2.3.0-preview2

* Added support for graph bulk executor to accept ttl on vertices and edges

### <a name="2.2.0-preview2"></a>2.2.0-preview2

* Fixed an issue, which caused exceptions during elastic scaling of Azure Cosmos DB when running in Gateway mode. This fix makes it functionally equivalent to 1.4.1 release.

### <a name="2.1.0-preview2"></a>2.1.0-preview2

* Added BulkDelete support for SQL API accounts to accept partition key, document ID tuples to delete. This change makes it functionally equivalent to 1.4.0 release.

### <a name="2.0.0-preview2"></a>2.0.0-preview2

* Including MongoBulkExecutor to support .NET Standard 2.0. This feature makes it functionally equivalent to 1.3.0 release, with the addition of supporting .NET Standard 2.0 as the target framework.

### <a name="2.0.0-preview"></a>2.0.0-preview

* Added .NET Standard 2.0 as one of the supported target frameworks to make the bulk executor library work with .NET Core applications.

### <a name="1.8.9"></a>1.8.9

* Fixed an issue with BulkDeleteAsync when values with escaped quotes were passed as input parameters.

### <a name="1.8.8"></a>1.8.8

* Fixed an issue on MongoBulkExecutor that was increasing the document size unexpectedly by adding padding and in some cases, going over the maximum document size limit.

### <a name="1.8.7"></a>1.8.7

* Fixed an issue with BulkDeleteAsync when the Collection has nested partition key paths.

### <a name="1.8.6"></a>1.8.6

* MongoBulkExecutor now implements IDisposable and it's expected to be disposed after used.

### <a name="1.8.5"></a>1.8.5

* Removed lock on SDK version. Package is now dependent on SDK >= 2.5.1.

### <a name="1.8.4"></a>1.8.4

* Fixed handling of identifiers when calling BulkImport with a list of POCO objects with numeric values.

### <a name="1.8.3"></a>1.8.3

* Fixed TotalElapsedTime in the response of BulkDelete to correctly measure the total time including any retries.

### <a name="1.8.2"></a>1.8.2

* Fixed high CPU consumption on certain scenarios.
* Tracing now uses TraceSource. Users can define listeners for the `BulkExecutorTrace` source.
* Fixed a rare scenario that could cause a lock when sending documents near 2Mb of size.

### <a name="1.6.0"></a>1.6.0

* Updated the bulk executor to now use the latest version of the Azure Cosmos DB .NET SDK (2.4.0)

### <a name="1.5.0"></a>1.5.0

* Added support for graph bulk executor to accept ttl on vertices and edges

### <a name="1.4.1"></a>1.4.1

* Fixed an issue, which caused exceptions during elastic scaling of Azure Cosmos DB when running in Gateway mode.

### <a name="1.4.0"></a>1.4.0

* Added BulkDelete support for SQL API accounts to accept partition key, document ID tuples to delete.

### <a name="1.3.0"></a>1.3.0

* Fixed an issue, which caused a formatting issue in the user agent used by bulk executor.

### <a name="1.2.0"></a>1.2.0

* Made improvement to bulk executor import and update APIs to transparently adapt to elastic scaling of Cosmos container when storage exceeds current capacity without throwing exceptions.

### <a name="1.1.2"></a>1.1.2

* Bumped up the DocumentDB .NET SDK dependency to version 2.1.3.

### <a name="1.1.1"></a>1.1.1

* Fixed an issue, which caused bulk executor to throw JSRT error while importing to fixed collections.

### <a name="1.1.0"></a>1.1.0

* Added support for BulkDelete operation for Azure Cosmos DB SQL API accounts.
* Added support for BulkImport operation for accounts with Azure Cosmos DB's API for MongoDB.
* Bumped up the DocumentDB .NET SDK dependency to version 2.0.0. 

### <a name="1.0.2"></a>1.0.2

* Added support for BulkImport operation for Azure Cosmos DB Gremlin API accounts.

### <a name="1.0.1"></a>1.0.1

* Minor bug fix to the BulkImport operation for Azure Cosmos DB SQL API accounts.

### <a name="1.0.0"></a>1.0.0

* Added support for BulkImport and BulkUpdate operations for Azure Cosmos DB SQL API accounts.

## Next steps

To learn about the bulk executor Java library, see the following article:

[Java bulk executor library SDK and release information](sql-api-sdk-bulk-executor-java.md)
