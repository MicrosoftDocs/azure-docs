---
title: 'Azure Cosmos DB: Bulk executor Java API, SDK & resources'
description: Learn all about the bulk executor Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB bulk executor Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 05/11/2020
ms.author: anfeldma

---

# Java bulk executor library: Download information

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
> * [REST](https://docs.microsoft.com/rest/api/cosmos-db/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| |  |
|---|---|
|**Description**|The bulk executor library allows client applications to perform bulk operations in Azure Cosmos DB accounts. bulk executor library provides BulkImport, and BulkUpdate namespaces. The BulkImport module can bulk ingest documents in an optimized way such that the throughput provisioned for a collection is consumed to its maximum extent. The BulkUpdate module can bulk update existing data in Azure Cosmos containers as patches.|
|**SDK download**|[Maven](https://search.maven.org/#search%7Cga%7C1%7Cdocumentdb-bulkexecutor)|
|**Bulk executor library in GitHub**|[GitHub](https://github.com/Azure/azure-cosmosdb-bulkexecutor-java-getting-started)|
| **API documentation**| [Java API reference documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.bulkexecutor)|
|**Get started**|[Get started with the bulk executor library Java SDK](bulk-executor-java.md)|
|**Minimum supported runtime**|[Java Development Kit (JDK) 7+](/java/azure/jdk/?view=azure-java-stable)|

## Release notes

### <a name="2.10.0"></a>2.10.0

* Fix for DocumentAnalyzer.java to correctly extract nested partition key values from json.

### <a name="2.9.4"></a>2.9.4

* Add functionality in BulkDelete operations to retry on specific failures and also return a list of failures to the user that could be retried.

### <a name="2.9.3"></a>2.9.3

* Update for Cosmos SDK version 2.4.7.

### <a name="2.9.2"></a>2.9.2

* Fix for 'mergeAll' to continue on 'id' and partition key value so that any patched document properties which are placed after 'id' and partition key value get added to the updated item list.

### <a name="2.9.1"></a>2.9.1

* Update start degree of concurrency to 1 and added debug logs for minibatch.


