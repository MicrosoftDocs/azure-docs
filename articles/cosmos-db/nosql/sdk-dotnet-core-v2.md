---
title: 'Azure Cosmos DB: SQL .NET Core API, SDK & resources'
description: Learn all about the SQL .NET Core API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB .NET Core SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: reference
ms.date: 03/20/2023
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-dotnet, ignite-2022
---
# Azure Cosmos DB .NET Core SDK v2 for API for NoSQL: Release notes and resources (Legacy)
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

| | Links |
|---|---|
|**Release notes**| [Release notes](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md)|
|**SDK download**| [NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.Core/)|
|**API documentation**|[.NET API reference documentation](/dotnet/api/microsoft.azure.documents)|
|**Samples**|[.NET code samples](samples-dotnet.md)|
|**Get started**|[Get started with the Azure Cosmos DB .NET](sdk-dotnet-v2.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](tutorial-dotnet-web-app.md)|
|**Current supported framework**|[.NET Standard 1.6 and .NET Standard 1.5](https://www.nuget.org/packages/NETStandard.Library)|

> [!WARNING]
> On August 31, 2024 the Azure Cosmos DB .NET SDK v2.x will be retired; the SDK and all applications using the SDK will continue to function;
> Azure Cosmos DB will simply cease to provide further maintenance and support for this SDK. 
> We recommend [migrating to the latest version](migrate-dotnet-v3.md) of the .NET SDK v3 SDK.
>

> [!NOTE]
> If you are using .NET Core, please see the latest version 3.x of the [.NET SDK](sdk-dotnet-v3.md), which targets .NET Standard.

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

To learn more about Azure Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
