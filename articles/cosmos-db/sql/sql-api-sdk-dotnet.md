---
title: 'Azure Cosmos DB: SQL .NET API, SDK & resources'
description: Learn all about the SQL .NET API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB .NET SDK.
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: reference
ms.date: 11/11/2021
ms.author: jroth
ms.custom: devx-track-dotnet

---
# Azure Cosmos DB .NET SDK v2 for SQL API: Download and release notes (Legacy)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Spring Data v2](sql-api-sdk-java-spring-v2.md)
> * [Spring Data v3](sql-api-sdk-java-spring-v3.md)
> * [Spark 3 OLTP Connector](sql-api-sdk-java-spark-v3.md)
> * [Spark 2 OLTP Connector](sql-api-sdk-java-spark.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-query-getting-started.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| | Links |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/)|
|**API documentation**|[.NET API reference documentation](/dotnet/api/overview/azure/cosmosdb)|
|**Samples**|[.NET code samples](https://github.com/Azure/azure-cosmos-dotnet-v2/tree/master/samples)|
|**Get started**|[Get started with the Azure Cosmos DB .NET SDK](sql-api-get-started.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](sql-api-dotnet-application.md)|
|**Current supported framework**|[Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)|

> [!WARNING]
> On August 31, 2024 the Azure Cosmos DB .NET SDK v2.x will be retired; the SDK and all applications using the SDK will continue to function;
> Azure Cosmos DB will simply cease to provide further maintenance and support for this SDK. 
> We recommend [migrating to the latest version](migrate-dotnet-v3.md) of the .NET SDK v3 SDK.
>

> [!NOTE]
> If you are using .NET Framework, please see the latest version 3.x of the [.NET SDK](sql-api-sdk-dotnet-standard.md), which targets .NET Standard.

## <a name="release-history"></a> Release history

Release history is maintained in the Azure Cosmos DB .NET SDK source repo. For a detailed list of feature releases and bugs fixed in each release, see the [SDK changelog documentation](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md)

Because version 3 of the Azure Cosmos DB .NET SDK includes updated features and improved performance, The 2.x of this SDK will be retired on 31 August 2024. You must update your SDK to version 3 by that date. We recommend following the [instructions](migrate-dotnet-v3.md) to migrate to Azure Cosmos DB .NET SDK version 3.

## <a name="recommended-version"></a> Recommended version

Different sub versions of .NET SDKs are available under the 2.x.x version. **The minimum recommended version is 2.16.2**.

## <a name="known-issues"></a> Known issues

Below is a list of any know issues affecting the [recommended minimum version](#recommended-version):

| Issue | Impact | Mitigation | Tracking link |
| --- | --- | --- | --- |
| When using Direct mode with an account with multiple write locations, the SDK might not detect when a region is added to the account. The background process that [refreshes the account information](troubleshoot-sdk-availability.md#adding-a-region-to-an-account) fails to start. |If a new region is added to the account which is part of the PreferredLocations on a higher order than the current region, the SDK won't detect the new available region. |Restart the application. |https://github.com/Azure/azure-cosmos-dotnet-v2/issues/852 |

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)]

## See also

To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
