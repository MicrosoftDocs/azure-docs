---
title: 'Azure Cosmos DB: SQL .NET Core API, SDK & resources'
description: Learn all about the SQL .NET Core API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB .NET Core SDK.
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: reference
ms.date: 04/18/2022
ms.author: jroth
ms.custom: devx-track-dotnet


---
# Azure Cosmos DB .NET Core SDK v2 for SQL API: Release notes and resources (Legacy)
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
> * [REST](/rest/api
> * [REST Resource Provider](/azure/azure-resource-manager/management/azure-services-resource-providers)
> * [SQL](sql-query-getting-started.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| | Links |
|---|---|
|**Release notes**| [Release notes](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md)|
|**SDK download**| [NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.Core/)|
|**API documentation**|[.NET API reference documentation](/dotnet/api/overview/azure/cosmosdb)|
|**Samples**|[.NET code samples](sql-api-dotnet-samples.md)|
|**Get started**|[Get started with the Azure Cosmos DB .NET](sql-api-sdk-dotnet.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](sql-api-dotnet-application.md)|
|**Current supported framework**|[.NET Standard 1.6 and .NET Standard 1.5](https://www.nuget.org/packages/NETStandard.Library)|

> [!WARNING]
> On August 31, 2024 the Azure Cosmos DB .NET SDK v2.x will be retired; the SDK and all applications using the SDK will continue to function;
> Azure Cosmos DB will simply cease to provide further maintenance and support for this SDK. 
> We recommend [migrating to the latest version](migrate-dotnet-v3.md) of the .NET SDK v3 SDK.
>

> [!NOTE]
> If you are using .NET Core, please see the latest version 3.x of the [.NET SDK](sql-api-sdk-dotnet-standard.md), which targets .NET Standard.

## <a name="release-history"></a> Release history

Release history is maintained in the Azure Cosmos DB .NET SDK source repo. For a detailed list of feature releases and bugs fixed in each release, see the [SDK changelog documentation](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md)

Because version 3 of the Azure Cosmos DB .NET SDK includes updated features and improved performance, The 2.x of this SDK will be retired on 31 August 2024. You must update your SDK to version 3 by that date. We recommend following the instructions to migrate to Azure Cosmos DB .NET SDK version 3.

## <a name="recommended-version"></a> Recommended version

Different sub versions of .NET SDKs are available under the 2.x.x version. **The minimum recommended version is 2.18.0**.

## <a name="known-issues"></a> Known issues

Below is a list of any known issues affecting the [recommended minimum version](#recommended-version):

| Issue | Impact | Mitigation | Tracking link |
| --- | --- | --- | --- |

## See Also

To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

