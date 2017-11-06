---
title: Azure DocumentDB .NET Change Feed Processor SDK & Resources | Microsoft Docs
description: Learn all about the Change Feed Processor API and SDK including release dates, retirement dates, and changes made between each version of the DocumentDB .NET Change Feed Processor SDK.
services: cosmos-db
documentationcenter: .net
author: ealsur
manager: kirillg
editor: mimig1

ms.assetid: f2dd9438-8879-4f74-bb6c-e1efc2cd0157
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 08/29/2017
ms.author: maquaran

---
# DocumentDB .NET Change Feed Processor SDK: Download and release notes
> [!div class="op_single_selector"]
> * [.NET](documentdb-sdk-dotnet.md)
> * [.NET Change Feed](documentdb-sdk-dotnet-changefeed.md)
> * [.NET Core](documentdb-sdk-dotnet-core.md)
> * [Node.js](documentdb-sdk-node.md)
> * [Java](documentdb-sdk-java.md)
> * [Python](documentdb-sdk-python.md)
> * [REST](https://docs.microsoft.com/rest/api/documentdb/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/documentdbresourceprovider/)
> * [SQL](https://msdn.microsoft.com/library/azure/dn782250.aspx)
> 
> 

<table>

<tr><td>**SDK download**</td><td>[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/)</td></tr>

<tr><td>**API documentation**</td><td>[Change Feed Processor library API reference documentation](/dotnet/api/microsoft.azure.documents.changefeedprocessor?view=azure-dotnet)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the DocumentDB Change Feed Processor .NET SDK](change-feed.md)</td></tr>

<tr><td>**Current supported framework**</td><td>[Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)</td></tr>
</table></br>

## Release notes

### <a name="1.1.1"/>1.1.1
* Fixes an issue with the calculation of the estimate of remaining work when the Change Feed was empty or no work was pending.
* Compatible with [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) versions 1.13.2 and above.

### <a name="1.1.0"/>1.1.0
* Added a method to obtain an estimate of remaining work to be processed in the Change Feed.
* Compatible with [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) versions 1.13.2 and above.

### <a name="1.0.0"/>1.0.0
* GA SDK
* Compatible with [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) versions 1.14.1 and below.

## Release & Retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any request to Cosmos DB using a retired SDK will be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [1.1.1](#1.1.1) |August 29, 2017 |--- |
| [1.1.0](#1.1.0) |August 13, 2017 |--- |
| [1.0.0](#1.0.0) |July 07, 2017 |--- |


## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page. 

