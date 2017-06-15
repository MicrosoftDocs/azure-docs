---
title: Azure DocumentDB .NET Core API, SDK & Resources | Microsoft Docs
description: Learn all about the .NET Core API and SDK including release dates, retirement dates, and changes made between each version of the DocumentDB .NET Core SDK.
services: cosmos-db
documentationcenter: .net
author: rnagpal
manager: jhubbard
editor: cgronlun

ms.assetid: f899b314-26ac-4ddb-86b2-bfdf05c2abf2
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 06/12/2017
ms.author: rnagpal
ms.custom: H1Hack27Feb2017

---
# DocumentDB .NET Core SDK: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET](documentdb-sdk-dotnet.md)
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

<tr><td>**SDK download**</td><td>[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.Core/)</td></tr>

<tr><td>**API documentation**</td><td>[.NET API reference documentation](https://msdn.microsoft.com/library/azure/dn948556.aspx)</td></tr>

<tr><td>**Samples**</td><td>[.NET code samples](documentdb-dotnet-samples.md)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the DocumentDB .NET Core SDK](documentdb-dotnetcore-get-started.md)</td></tr>

<tr><td>**Web app tutorial**</td><td>[Web application development with DocumentDB](documentdb-dotnet-application.md)</td></tr>

<tr><td>**Current supported framework**</td><td>[.NET Standard 1.6 and .NET Standard 1.5](https://www.nuget.org/packages/NETStandard.Library)</td></tr>
</table></br>

## Release Notes

The DocumentDB .NET Core SDK has feature parity with the latest version of the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md).

> [!NOTE] 
> The DocumentDB .NET Core SDK is not yet compatible with Universal Windows Platform (UWP) apps. If you are interested in the .NET Core SDK that does support UWP apps, send email to [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com).

### <a name="1.3.2"/>1.3.2

*	Supporting .NET Standard 1.5 as one of the target frameworks.

### <a name="1.3.1"/>1.3.1

*	Fixed an issue that affected x64 machines that don’t support SSE4 instruction and throw SEHException when running DocumentDB queries.

### <a name="1.3.0"/>1.3.0

*	Added support for Request Unit per Minute (RU/m) feature.
*	Added support for a new consistency level called ConsistentPrefix.
*	Added support for query metrics for individual partitions.
*	Added support for limiting the size of the continuation token for queries.
*	Added support for more detailed tracing for failed requests.
*	Made some performance improvements in the SDK.

### <a name="1.2.2"/>1.2.2

* Fixed an issue that ignored the PartitionKey value provided in FeedOptions for aggregate queries.
* Fixed an issue in transparent handling of partition management during mid-flight cross-partition Order By query execution.

### <a name="1.2.1"/>1.2.1

* Fixed an issue which caused deadlocks in some of the async APIs when used inside ASP.NET context.

### <a name="1.2.0"/>1.2.0

* Fixes to make SDK more resilient to automatic failover under certain conditions.

### <a name="1.1.2"/>1.1.2

* Fix for an issue that occasionally causes a WebException: The remote name could not be resolved.
* Added the support for directly reading a typed document by adding new overloads to ReadDocumentAsync API.

### <a name="1.1.1"/>1.1.1

* Added LINQ support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Fix for a memory leak issue for the ConnectionPolicy object caused by the use of event handler.
* Fix for an issue wherein UpsertAttachmentAsync was not working when ETag was used.
* Fix for an issue wherein cross partition order-by query continuation was not working when sorting on string field.

### <a name="1.1.0"/>1.1.0

* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG). See [Aggregation support](documentdb-sql-query.md#Aggregates).
* Lowered minimum throughput on partitioned collections from 10,100 RU/s to 2500 RU/s.

### <a name="1.0.0"/>1.0.0

The DocumentDB .NET Core SDK enables you to build fast, cross-platform [ASP.NET Core](https://www.asp.net/core) and [.NET Core](https://www.microsoft.com/net/core#windows) apps to run on Windows, Mac, and Linux. The latest release of the DocumentDB .NET Core SDK is fully [Xamarin](https://www.xamarin.com) compatible and be used to build applications that target iOS, Android, and Mono (Linux).  

### <a name="0.1.0-preview"/>0.1.0-preview

The DocumentDB .NET Core Preview SDK enables you to build fast, cross-platform [ASP.NET Core](https://www.asp.net/core) and [.NET Core](https://www.microsoft.com/net/core#windows) apps to run on Windows, Mac, and Linux.

The DocumentDB .NET Core Preview SDK has feature parity with the latest version of the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) and supports the following:
* All [connection modes](performance-tips.md#networking): Gateway mode, Direct TCP, and Direct HTTPs. 
* All [consistency levels](consistency-levels.md): Strong, Session, Bounded Staleness, and Eventual.
* [Partitioned collections](partition-data.md). 
* [Multi-region database accounts and geo-replication](distribute-data-globally.md).

If you have questions related to this SDK, post to [StackOverflow](http://stackoverflow.com/questions/tagged/azure-documentdb), or file an issue in the [github repository](https://github.com/Azure/azure-documentdb-dotnet/issues). 

## Release & Retirement Dates

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [1.3.2](#1.3.2) |June 12, 2017 |--- |
| [1.3.1](#1.3.1) |May 23, 2017 |--- |
| [1.3.0](#1.3.0) |May 10, 2017 |--- |
| [1.2.2](#1.2.2) |April 19, 2017 |--- |
| [1.2.1](#1.2.1) |March 29, 2017 |--- |
| [1.2.0](#1.2.0) |March 25, 2017 |--- |
| [1.1.2](#1.1.2) |March 20, 2017 |--- |
| [1.1.1](#1.1.1) |March 14, 2017 |--- |
| [1.1.0](#1.1.0) |February 16, 2017 |--- |
| [1.0.0](#1.0.0) |December 21, 2016 |--- |
| [0.1.0-preview](#0.1.0-preview) |November 15, 2016 |December 31, 2016 |

## See Also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page. 

