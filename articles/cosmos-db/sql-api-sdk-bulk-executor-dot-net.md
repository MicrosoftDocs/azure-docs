---
title: 'Azure Cosmos DB: Bulk Executor .NET API, SDK & resources | Microsoft Docs'
description: Learn all about the Bulk Executor .NET API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Bulk Executor .NET SDK.
services: cosmos-db
author: tknandu
manager: kfile
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 09/14/2018
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
> * [SQL](https://msdn.microsoft.com/library/azure/dn782250.aspx)
> * [Bulk Executor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk Executor - Java](sql-api-sdk-bulk-executor-java.md)

<table>

<tr><td>**Description**</td><td>The Bulk Executor library allows client applications to perform bulk operations in Azure Cosmos DB accounts. Bulk Executor library provides BulkImport, BulkUpdate and BulkDelete namespaces. The BulkImport module can bulk ingest documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent. The BulkUpdate module can bulk update existing data in Azure Cosmos DB containers as patches. The BulkDelete module can bulk delete documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent.</td></tr>

<tr><td>**SDK download**</td><td>[NuGet](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.BulkExecutor/)</td></tr>

<tr><td>**BulkExecutor library in GitHub**</td><td>[GitHub](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started)</td></tr>

<tr><td>**API documentation**</td><td>[.Net API reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor?view=azure-dotnet)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the Bulk Executor library .NET SDK](bulk-executor-dot-net.md)</td></tr>

<tr><td>**Current supported framework**</td><td><ul><li>[Microsoft.Azure.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/)(version >= 2.0.0)</li><li>
[Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/)(version >= 9.0.1)
</li></ul></td></tr>
</table></br>

## Release notes

### <a name="1.1.0"/>1.1.0

* Added support for BulkDelete operation for Azure Cosmos DB SQL API accounts.
* Added support for BulkImport operation for Azure Cosmos DB MongoDB API accounts.
* Bumped up the DocumentDB .NET SDK dependency to version 2.0.0. 

### <a name="1.0.2"/>1.0.2

* Added support for BulkImport operation for Azure Cosmos DB Gremlin API accounts.

### <a name="1.0.1"/>1.0.1

* Minor bug fix to the BulkImport operation for Azure Cosmos DB SQL API accounts.

### <a name="1.0.0"/>1.0.0

* Added support for BulkImport and BulkUpdate operations for Azure Cosmos DB SQL API accounts.
