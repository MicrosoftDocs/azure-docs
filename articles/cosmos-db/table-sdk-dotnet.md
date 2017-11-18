---
title: Azure CosmosDB Table API .NET SDK & Resources | Microsoft Docs
description: Learn all about the Azure Cosmos DB Table API including release dates, retirement dates, and changes made between each version.
services: cosmos-db
documentationcenter: .net
author: rnagpal
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 11/17/2017
ms.author: mimig

---
# Azure Cosmos DB Table .NET API: Download and release notes
> [!div class="op_single_selector"]
> * [.NET](table-sdk-dotnet.md)
> * [Java](table-sdk-java.md)
> * [Node.js](table-sdk-nodejs.md)
> * [Python](table-sdk-python.md)

|   |   |
|---|---|
|**SDK download**|[NuGet](https://aka.ms/acdbtablenuget)|
|**API documentation**|[.NET API reference documentation](https://aka.ms/acdbtableapiref)|
|**Quickstart**|[Azure Cosmos DB: Build an app with .NET and the Table API](create-table-dotnet.md)|
|**Tutorial**|[Azure Cosmos DB: Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)|
|**Current supported framework**|[Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)|

## Release notes

### <a name="1.0.0"/>1.0.0
* General availability release

### <a name="0.1.0-preview"/>0.9.0-preview
* Initial preview release

## Release and Retirement dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any requests to Azure Cosmos DB using a retired SDK are rejected by the service.
<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [1.0.0](#1.0.0) |November 15, 2017|--- |
| [0.9.0-preview](#0.1.0-preview) |November 11, 2017 |--- |

## Troubleshooting

If you get the error 

```
Unable to resolve dependency 'Microsoft.Azure.Storage.Common'. Source(s) used: 'nuget.org', 
'CliFallbackFolder', 'Microsoft Visual Studio Offline Packages', 'Microsoft Azure Service Fabric SDK'`
```
when attempting to use the Microsoft.Azure.CosmosDB.Table NuGet package, you have two options to fix the issue:

* Use Package Manage Console to install the Microsoft.Azure.CosmosDB.Table package and its dependencies. To do this, type the following in the Package Manager Console for your solution. 
    ```
    Install-Package Microsoft.Azure.CosmosDB.Table -IncludePrerelease
    ```
    
* Using your preferred Nuget package management tool, install the Microsoft.Azure.Storage.Common Nuget package before installing Microsoft.Azure.CosmosDB.Table.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about the Azure Cosmos DB Table API, see [Introduction to Azure Cosmos DB Table API](table-introduction.md). 
