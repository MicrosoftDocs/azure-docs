---
title: Azure Cosmos DB Table API .NET Standard SDK & Resources
description: Learn all about the Azure Cosmos DB Table API and the .NET Standard SDK including release dates, retirement dates, and changes made between each version.
author: sakash279
ms.author: akshanka
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: reference
ms.date: 03/18/2019

---
# Azure Cosmos DB Table .NET Standard API: Download and release notes
> [!div class="op_single_selector"]
> 
> * [.NET](table-sdk-dotnet.md)
> * [.NET Standard](table-sdk-dotnet-standard.md)
> * [Java](table-sdk-java.md)
> * [Node.js](table-sdk-nodejs.md)
> * [Python](table-sdk-python.md)

|   |   |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table)|
|**Sample**|[Cosmos DB Table API .NET Sample](https://github.com/Azure-Samples/azure-cosmos-table-dotnet-core-getting-started)|
|**Quickstart**|[Quickstart](create-table-dotnet.md)|
|**Tutorial**|[Tutorial](tutorial-develop-table-dotnet.md)|
|**Current supported framework**|[Microsoft .NET Standard 2.0](https://www.nuget.org/packages/NETStandard.Library)|
|**Report Issue**|[Report Issue](https://github.com/Azure/azure-cosmos-table-dotnet/issues)|

## Release notes for 2.0.0 series
2.0.0 series takes the dependency on [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/), with performance improvements and namespace consolidation to Cosmos DB endpoint.

### <a name="2.0.0-preview"></a>2.0.0-preview
* initial preview of 2.0.0 Table SDK that takes the dependency on [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/), with performance improvements and namespace consolidation to Cosmos DB endpoint. The public API remains the same.

## Release notes for 1.0.0 series
1.0.0 series takes the dependency on [Microsoft.Azure.DocumentDB.Core](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.Core/).

### <a name="1.0.7"></a>1.0.7
* Performance improvement by setting Table SDK default trace level to SourceLevels.Off, which can be opted in via app.config

### <a name="1.0.5"></a>1.0.5
* Introduce new config under TableClientConfiguration to use Rest Executor to communicate with Cosmos DB Table API

### <a name="1.0.5-preview"></a>1.0.5-preview
* Bug fixes

### <a name="1.0.4"></a>1.0.4
* Bug fixes
* Provide HttpClientTimeout option for RestExecutorConfiguration.

### <a name="1.0.4-preview"></a>1.0.4-preview
* Bug fixes
* Provide HttpClientTimeout option for RestExecutorConfiguration.

### <a name="1.0.1"></a>1.0.1
* Bug fixes

### <a name="1.0.0"></a>1.0.0
* General availability release

### <a name="0.11.0-preview"></a>0.11.0-preview
* Changes were made to how CloudTableClient can be configured. It now takes an a TableClientConfiguration object during construction. TableClientConfiguration provides different properties to configure the client behavior depending on whether the target endpoint is Cosmos DB Table API or Azure Storage Table API.
* Added support to TableQuery to return results in sorted order on a custom column. This feature is only supported on Cosmos DB Table endpoints.
* Added support to expose RequestCharges on various result types. This feature is only supported on Cosmos DB Table endpoints.

### <a name="0.10.1-preview"></a>0.10.1-preview
* Add support for SAS token, operations of TablePermissions, ServiceProperties, and ServiceStats against Azure Storage Table endpoints. 
   > [!NOTE]
   > Some functionalities in previous Azure Storage Table SDKs are not yet supported, such as client-side encryption.

### <a name="0.10.0-preview"></a>0.10.0-preview
* Add support for core CRUD, batch, and query operations against Azure Storage Table endpoints. 
   > [!NOTE]
   > Some functionalities in previous Azure Storage Table SDKs are not yet supported, such as client-side encryption.

### <a name="0.9.1-preview"></a>0.9.1-preview
* Azure Cosmos DB Table .NET Standard SDK is a cross-platform .NET library that provides efficient access to the Table data model on Cosmos DB. This initial release supports the full set of Table and Entity CRUD + Query functionalities with similar APIs as the [Cosmos DB Table SDK For .NET Framework](table-sdk-dotnet.md). 
   > [!NOTE]
   >  Azure Storage Table endpoints are not yet supported in the 0.9.1-preview version.

## Release and Retirement dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

This cross-platform .NET Standard library [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) will replace the .NET Framework library [Microsoft.Azure.CosmosDB.Table](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.Table).

### 2.0.0 series
| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.0.0-preview](#2.0.0-preview) |Auguest 22, 2019 |--- |

### 1.0.0 series
| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [1.0.5](#1.0.5) |September 13, 2019 |--- |
| [1.0.5-preview](#1.0.5-preview) |Auguest 20, 2019 |--- |
| [1.0.4](#1.0.4) |Auguest 12, 2019 |--- |
| [1.0.4-preview](#1.0.4-preview) |July 26, 2019 |--- |
| 1.0.2-preview |May 2, 2019 |--- |
| [1.0.1](#1.0.1) |April 19, 2019 |--- |
| [1.0.0](#1.0.0) |March 13, 2019 |--- |
| [0.11.0-preview](#0.11.0-preview) |March 5, 2019 |--- |
| [0.10.1-preview](#0.10.1-preview) |January 22, 2019 |--- |
| [0.10.0-preview](#0.10.0-preview) |December 18, 2018 |--- |
| [0.9.1-preview](#0.9.1-preview) |October 18, 2018 |--- |


## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about the Azure Cosmos DB Table API, see [Introduction to Azure Cosmos DB Table API](table-introduction.md).
