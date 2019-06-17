---
title: Azure Cosmos DB Table API .NET SDK & Resources
description: Learn all about the Azure Cosmos DB Table API including release dates, retirement dates, and changes made between each version.
author: wmengmsft
ms.author: wmeng
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: reference
ms.date: 08/17/2018

---
# Azure Cosmos DB Table .NET API: Download and release notes

> [!div class="op_single_selector"]
> * [.NET](table-sdk-dotnet.md)
> * [.NET Standard](table-sdk-dotnet-standard.md)
> * [Java](table-sdk-java.md)
> * [Node.js](table-sdk-nodejs.md)
> * [Python](table-sdk-python.md)

|   |   |
|---|---|
|**SDK download**|[NuGet](https://aka.ms/acdbtablenuget)|
|**API documentation**|[.NET API reference documentation](https://aka.ms/acdbtableapiref)|
|**Quickstart**|[Azure Cosmos DB: Build an app with .NET and the Table API](create-table-dotnet.md)|
|**Tutorial**|[Azure Cosmos DB: Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)|
|**Current supported framework**|[Microsoft .NET Framework 4.5.1](https://www.microsoft.com/en-us/download/details.aspx?id=40779)|

> [!IMPORTANT]
> The .NET Framework SDK [Microsoft.Azure.CosmosDB.Table](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.Table) is in maintenance mode and it will be deprecated soon. Please upgrade to the new .NET Standard library [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) to continue to get the latest features supported by the Table API.

> If you created a Table API account during the preview, please create a [new Table API account](create-table-dotnet.md#create-a-database-account) to work with the generally available Table API SDKs.
>

## Release notes

### <a name="2.1.0"/>2.1.0

* Bug fixes

### <a name="2.0.0"/>2.0.0

* Added Multi-region write support
* Fixed NuGet package dependencies on Microsoft.Azure.DocumentDB, Microsoft.OData.Core, Microsoft.OData.Edm, Microsoft.Spatial

### <a name="1.1.3"/>1.1.3

* Fixed NuGet package dependencies on Microsoft.Azure.Storage.Common and Microsoft.Azure.DocumentDB.
* Bug fixes on table serialization when JsonConvert.DefaultSettings are configured.

### <a name="1.1.1"/>1.1.1

* Added validation for malformed ETAGs in Direct Mode.
* Fixed LINQ query bug in Gateway Mode.
* Synchronous APIs now run on the thread pool with SynchronizationContext.

### <a name="1.1.0"/>1.1.0

* Add TableQueryMaxItemCount, TableQueryEnableScan, TableQueryMaxDegreeOfParallelism, and TableQueryContinuationTokenLimitInKb to TableRequestOptions
* Bug Fixes

### <a name="1.0.0"/>1.0.0

* General availability release

### <a name="0.1.0-preview"/>0.9.0-preview

* Initial preview release

## Release and Retirement dates

Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

The `Microsoft.Azure.CosmosDB.Table` library is currently available for .NET Framework only, and is in maintenance mode and will be deprecated soon. New features and functionalities and optimizations are only added to the .NET Standard library [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table), as such it is recommended that you upgrade to [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table).

The [WindowsAzure.Storage-PremiumTable](https://www.nuget.org/packages/WindowsAzure.Storage-PremiumTable/0.1.0-preview) preview package has been deprecated. The WindowsAzure.Storage-PremiumTable SDK will be retired on November 15, 2018, at which time requests to the retired SDK will not be permitted. 

Any requests to Azure Cosmos DB using a retired SDK are rejected by the service.
<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.1.0](#2.1.0) |January 22, 2019|April 01, 2020 |
| [2.0.0](#2.0.0) |September 26, 2018|March 01, 2020 |
| [1.1.3](#1.1.3) |July 17, 2018|December 01, 2019 |
| [1.1.1](#1.1.1) |March 26, 2018|December 01, 2019 |
| [1.1.0](#1.1.0) |February 21, 2018|December 01, 2019 |
| [1.0.0](#1.0.0) |November 15, 2017|November 15, 2019 |
| 0.9.0-preview |November 11, 2017 |November 11, 2019 |

## Troubleshooting

If you get the error 

```
Unable to resolve dependency 'Microsoft.Azure.Storage.Common'. Source(s) used: 'nuget.org', 
'CliFallbackFolder', 'Microsoft Visual Studio Offline Packages', 'Microsoft Azure Service Fabric SDK'`
```

when attempting to use the Microsoft.Azure.CosmosDB.Table NuGet package, you have two options to fix the issue:

* Use Package Manage Console to install the Microsoft.Azure.CosmosDB.Table package and its dependencies. To do this, type the following in the Package Manager Console for your solution. 

    ```powershell
    Install-Package Microsoft.Azure.CosmosDB.Table -IncludePrerelease
    ```

    
* Using your preferred NuGet package management tool, install the Microsoft.Azure.Storage.Common NuGet package before installing Microsoft.Azure.CosmosDB.Table.

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also

To learn more about the Azure Cosmos DB Table API, see [Introduction to Azure Cosmos DB Table API](table-introduction.md). 