---
title: 'Azure Cosmos DB: SQL .NET Standard API, SDK & resources'
description: Learn all about the SQL API and .NET SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB .NET SDK.
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 07/12/2019
ms.author: dech


---
# Azure Cosmos DB .NET Standard SDK for SQL API: Download and release notes
> [!div class="op_single_selector"]
> * [.NET Standard](sql-api-sdk-dotnet-standard.md)
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
> * [Bulk executor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| |  |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/)|
|**API documentation**|[.NET API reference documentation](/dotnet/api/overview/azure/cosmosdb?view=azure-dotnet)|
|**Samples**|[.NET code samples](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/CodeSamples)|
|**Get started**|[Get started with the Azure Cosmos DB .NET SDK](sql-api-get-started.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](sql-api-dotnet-application.md)|
|**Current supported framework**|[Microsoft .NET Standard 2.0](/dotnet/standard/net-standard)|

## Release notes

### <a name="3.0.0"/>3.0.0 
* General availability of [Version 3.0.0](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/) of the .NET SDK
* Targets .NET Standard 2.0, which supports .NET framework 4.6.1+ and .NET Core 2.0+
* New object model, with top-level CosmosClient and methods split across relevant Database and Container classes
* New highly performant stream APIs
* Built-in support for Change Feed processor APIs
* Fluent builder APIs for CosmosClient, Container, and Change Feed processor
* Idiomatic throughput management APIs
* Granular RequestOptions and ResponseTypes for database, container, item, query and throughput requests
* Ability to scale non-partitioned containers 
* Extensible and customizable serializer
* Extensible request pipeline with support for custom handlers


## Release & Retirement dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any requests to Azure Cosmos DB using a retired SDK are rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [3.0.0](#3.0.0) |July 15, 2019 |--- |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page. 

