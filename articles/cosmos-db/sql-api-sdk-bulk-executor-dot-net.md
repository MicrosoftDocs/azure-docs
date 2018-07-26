---
title: 'Azure Cosmos DB: bulk executor .NET API, SDK & resources | Microsoft Docs'
description: Learn all about the bulk executor .NET API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB bulk executor .NET SDK.
services: cosmos-db
author: tknandu
manager: kfile
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 05/07/2018
ms.author: ramkris

---

# .NET bulk executor library: Download information 

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
> * [bulk executor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

<table>

<tr><td>**Description**</td><td>The bulk executor library allows client applications to perform bulk operations in Azure Cosmos DB accounts. bulk executor library provides BulkImport, and BulkUpdate namespaces. The BulkImport module can bulk ingest documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent. The BulkUpdate module can bulk update existing data in Azure Cosmos DB containers as patches.</td></tr>

<tr><td>**SDK download**</td><td>[NuGet](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.BulkExecutor/)</td></tr>

<tr><td>**BulkExecutor library in GitHub**</td><td>[GitHub](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started)</td></tr>

<tr><td>**API documentation**</td><td>[.Net API reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor?view=azure-dotnet)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the bulk executor library .NET SDK](bulk-executor-dot-net.md)</td></tr>

<tr><td>**Current supported framework**</td><td><ul><li>[Microsoft.Azure.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/)(version >= 1.21.1)</li><li>
[Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/)(version >= 10.0.2)
</li></ul></td></tr>
</table></br>

