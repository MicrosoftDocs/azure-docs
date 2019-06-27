---
title: 'Azure Cosmos DB: .NET Change Feed Processor API, SDK & resources'
description: Learn all about the Change Feed Processor API and SDK including release dates, retirement dates, and changes made between each version of the .NET Change Feed Processor SDK.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 01/30/2019
ms.author: maquaran
---

# .NET Change Feed Processor SDK: Download and release notes

> [!div class="op_single_selector"]
>
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
> * [BulkExecutor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [BulkExecutor - Java](sql-api-sdk-bulk-executor-java.md)

|   |   |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/)|
|**API documentation**|[Change Feed Processor library API reference documentation](/dotnet/api/microsoft.azure.documents.changefeedprocessor?view=azure-dotnet)|
|**Get started**|[Get started with the Change Feed Processor .NET SDK](change-feed.md)|
|**Current supported framework**| [Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)</br> [Microsoft .NET Core](https://www.microsoft.com/net/download/core) |

## Release notes

### v2 builds

### <a name="2.2.7"/>2.2.7
* Improved load balancing strategy for scenario when getting all leases takes longer than lease expiration interval, e.g. due to network issues:
  * In this scenario load balancing algorithm used to falsely consider leases as expired, causing stealing leases from active owners. This could trigger unnecessary re-balancing a lot of leases.
  * This issue is fixed in this release by avoiding retry on conflict while acquiring expired lease which owner hasn't changed and posponing acquiring expired lease to next load balancing iteration.

### <a name="2.2.6"/>2.2.6
* Improved handling of Observer exceptions.
* Richer information on Observer errors:
  * When an Observer is closed due to an exception thrown by Observer's ProcessChangesAsync, the CloseAsync will now receive the reason parameter set to ChangeFeedObserverCloseReason.ObserverError.
  * Added traces to identify errors within user code in an Observer.

### <a name="2.2.5"/>2.2.5
* Added support for handling split in collections that use shared database throughput.
  * This release fixes an issue that may occur during split in collections using shared database throughput when split result into partition re-balancing with only one child partition key range created, rather than two. When this happens, Change Feed Processor may get stuck deleting the lease for old partition key range and not creating new leases. The issue is fixed in this release.

### <a name="2.2.4"/>2.2.4
* Added new property ChangeFeedProcessorOptions.StartContinuation to support starting change feed from request continuation token. This is only used when lease collection is empty or a lease does not have ContinuationToken set. For leases in lease collection that have ContinuationToken set, the ContinuationToken is used and ChangeFeedProcessorOptions.StartContinuation is ignored.

### <a name="2.2.3"/>2.2.3
* Added support for using custom store to persist continuation tokens per partition.
  * For example, a custom lease store can be Azure Cosmos DB lease collection partitioned in any custom way.
  * Custom lease stores can use new extensibility point ChangeFeedProcessorBuilder.WithLeaseStoreManager(ILeaseStoreManager) and ILeaseStoreManager public interface.
  * Refactored the ILeaseManager interface into multiple role interfaces.
* Minor breaking change: removed extensibility point ChangeFeedProcessorBuilder.WithLeaseManager(ILeaseManager), use ChangeFeedProcessorBuilder.WithLeaseStoreManager(ILeaseStoreManager) instead.

### <a name="2.2.2"/>2.2.2
* This release fixes an issue that occurs during processing a split in monitored collection and using a partitioned lease collection. When processing a lease for split partition, the lease corresponding to that partition may not be deleted. The issue is fixed in this release.

### <a name="2.2.1"/>2.2.1
* Fixed Estimator calculation for Multi Master accounts and new Session Token format.

### <a name="2.2.0"/>2.2.0
* Added support for partitioned lease collections. The partition key must be defined as /id.
* Minor breaking change: the methods of the IChangeFeedDocumentClient interface and the ChangeFeedDocumentClient class were changed to include RequestOptions and CancellationToken  parameters. IChangeFeedDocumentClient is an advanced extensibility point that allows you to provide custom implementation of the Document Client to use with Change Feed Processor, e.g. decorate DocumentClient and intercept all calls to it to do extra tracing, error handling, etc. With this update, the code that implement IChangeFeedDocumentClient will need to be changed to include new parameters in the implementation.
* Minor diagnostics improvements.

### <a name="2.1.0"/>2.1.0
* Added new API, Task&lt;IReadOnlyList&lt;RemainingPartitionWork&gt;&gt; IRemainingWorkEstimator.GetEstimatedRemainingWorkPerPartitionAsync(). This can be used to get estimated work for each partition.
* Supports Microsoft.Azure.DocumentDB SDK 2.0. Requires Microsoft.Azure.DocumentDB 2.0 or later.

### <a name="2.0.6"/>2.0.6
* Added ChangeFeedEventHost.HostName public property for compatibility with v1.

### <a name="2.0.5"/>2.0.5
* Fixed a race condition that occurs during partition split. The race condition may lead to acquiring lease and immediately losing it during partition split and causing contention. The race condition issue is fixed with this release.

### <a name="2.0.4"/>2.0.4
* GA SDK

### <a name="2.0.3-prerelease"/>2.0.3-prerelease
* Fixed the following issues:
  * When partition split happens, there could be duplicate processing of documents modified before the split.
  * The GetEstimatedRemainingWork API returned 0 when no leases were present in the lease collection.

* The following exceptions are made public. Extensions that implement IPartitionProcessor can throw these exceptions.
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.LeaseLostException. 
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionException. 
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionNotFoundException.
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionSplitException. 

### <a name="2.0.2-prerelease"/>2.0.2-prerelease
* Minor API changes:
  * Removed ChangeFeedProcessorOptions.IsAutoCheckpointEnabled that was marked as obsolete.

### <a name="2.0.1-prerelease"/>2.0.1-prerelease
* Stability improvements:
  * Better handling of lease store initialization. When lease store is empty, only one instance of processor can initialize it, the others will wait.
  * More stable/efficient lease renewal/release. Renewing and releasing a lease one partition is independent from renewing others. In v1 that was done sequentially for all partitions.
* New v2 API:
  * Builder pattern for flexible construction of the processor: the ChangeFeedProcessorBuilder class.
    * Can take any combination of parameters.
    * Can take DocumentClient instance for monitoring and/or lease collection (not available in v1).
  * IChangeFeedObserver.ProcessChangesAsync now takes CancellationToken.
  * IRemainingWorkEstimator - the remaining work estimator can be used separately from the processor.
  * New extensibility points:
    * IPartitionLoadBalancingStrategy - for custom load-balancing of partitions between instances of the processor.
    * ILease, ILeaseManager - for custom lease management.
    * IPartitionProcessor - for custom processing changes on a partition.
* Logging - uses [LibLog](https://github.com/damianh/LibLog) library.
* 100% backward compatible with v1 API.
* New code base.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.21.1 and above.

### v1 builds

### <a name="1.3.3"/>1.3.3
* Added more logging.
* Fixed a DocumentClient leak when calling the pending work estimation multiple times.

### <a name="1.3.2"/>1.3.2
* Fixes in the pending work estimation.

### <a name="1.3.1"/>1.3.1
* Stability improvements.
  * Fix for handling canceled tasks issue that might lead to stopped observers on some partitions.
* Support for manual checkpointing.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.21 and above.

### <a name="1.2.0"/>1.2.0
* Adds support for .NET Standard 2.0. The package now supports `netstandard2.0` and `net451` framework monikers.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.17.0 and above.
* Compatible with [SQL .NET Core SDK](sql-api-sdk-dotnet-core.md) versions 1.5.1 and above.

### <a name="1.1.1"/>1.1.1
* Fixes an issue with the calculation of the estimate of remaining work when the Change Feed was empty or no work was pending.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.13.2 and above.

### <a name="1.1.0"/>1.1.0
* Added a method to obtain an estimate of remaining work to be processed in the Change Feed.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.13.2 and above.

### <a name="1.0.0"/>1.0.0
* GA SDK
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.14.1 and below.

## Release & Retirement dates

Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any request to Cosmos DB using a retired SDK will be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.2.7](#2.2.7) |May 14, 2019 |--- |
| [2.2.6](#2.2.6) |January 29, 2019 |--- |
| [2.2.5](#2.2.5) |December 13, 2018 |--- |
| [2.2.4](#2.2.4) |November 29, 2018 |--- |
| [2.2.3](#2.2.3) |November 19, 2018 |--- |
| [2.2.2](#2.2.2) |October 31, 2018 |--- |
| [2.2.1](#2.2.1) |October 24, 2018 |--- |
| [1.3.3](#1.3.3) |May 08, 2018 |--- |
| [1.3.2](#1.3.2) |April 18, 2018 |--- |
| [1.3.1](#1.3.1) |March 13, 2018 |--- |
| [1.2.0](#1.2.0) |October 31, 2017 |--- |
| [1.1.1](#1.1.1) |August 29, 2017 |--- |
| [1.1.0](#1.1.0) |August 13, 2017 |--- |
| [1.0.0](#1.0.0) |July 07, 2017 |--- |

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also

To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
