---
title: Azure Cosmos DB Table API .NET Standard SDK & Resources
description: Learn all about the Azure Cosmos DB Table API and the .NET Standard SDK including release dates, retirement dates, and changes made between each version.
author: wmengmsft
ms.author: wmeng
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: reference
ms.date: 10/18/2018

---
# Azure Cosmos DB Table .NET Standard API: Download and release notes
> [!div class="op_single_selector"]

> * [.NET](table-sdk-dotnet.md)
> * [.NET Standard](table-sdk-dotnet-standard.md)
> * [Java](table-sdk-java.md)
> * [Node.js](table-sdk-nodejs.md)
> * [Python](table-sdk-python.md)

|   |   |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table)|
|**Current supported framework**|[Microsoft .NET Standard 2.0](https://www.nuget.org/packages/NETStandard.Library)|

## Release notes

### <a name="0.10.1-preview"/>0.10.1-preview
* Add support for SAS token, operations of TablePermissions, ServiceProperties, and ServiceStats against Azure Storage Table endpoints. 
   > [!NOTE] Some functionalities in previous Azure Storage Table SDKs are not yet supported, such as client-side encryption.

### <a name="0.10.0-preview"/>0.10.0-preview
* Add support for core CRUD, batch, and query operations against Azure Storage Table endpoints. 
   > [!NOTE] Some functionalities in previous Azure Storage Table SDKs are not yet supported, such as client-side encryption.

### <a name="0.9.1-preview"/>0.9.1-preview
* Azure Cosmos DB Table .NET Standard SDK is a cross-platform .NET library that provides efficient access to the Table data model on Cosmos DB. This initial release supports the full set of Table and Entity CRUD + Query functionalities with similar APIs as the [Cosmos DB Table SDK For .NET Framework](table-sdk-dotnet.md). 
   > [!NOTE] Azure Storage Table endpoints are not yet supported in the 0.9.1-preview version.

## Release and Retirement dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [0.10.1-preview](#0.10.1-preview) |January 22, 2019 |--- |
| [0.10.0-preview](#0.10.0-preview) |December 18, 2018 |--- |
| [0.9.1-preview](#0.9.1-preview) |October 18, 2018 |--- |


## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about the Azure Cosmos DB Table API, see [Introduction to Azure Cosmos DB Table API](table-introduction.md). 
