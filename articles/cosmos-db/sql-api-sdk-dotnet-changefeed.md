---
title: Azure Cosmos DB .NET change feed Processor API, SDK release notes 
description: Learn all about the Change Feed Processor API and SDK including release dates, retirement dates, and changes made between each version of the .NET Change Feed Processor SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: reference
ms.date: 04/06/2021
ms.author: anfeldma
---

# .NET Change Feed Processor SDK: Download and release notes
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
>
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
> * [REST Resource Provider](/rest/api
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

|   | Links  |
|---|---|
|**SDK download**|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/)|
|**API documentation**|[Change Feed Processor library API reference documentation](/dotnet/api/microsoft.azure.documents.changefeedprocessor)|
|**Get started**|[Get started with the Change Feed Processor .NET SDK](change-feed.md)|
|**Current supported framework**| [Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)</br> [Microsoft .NET Core](https://dotnet.microsoft.com/download) |

> [!NOTE]
> If you are using change feed processor, please see the latest version 3.x of the [.NET SDK](change-feed-processor.md), which has change feed built into the SDK. 

## Release notes

### v2 builds

### <a id="2.3.2"></a>2.3.2
* Added lease store compatibility with [V3 SDK that enables hot migration paths. An application can migrate to V3 SDK and migrate back to the Change Feed processor library without losing any state.

### <a id="2.3.1"></a>2.3.1
* Corrected a case when `FeedProcessing.ChangeFeedObserverCloseReason.Unknown` close reason was sent to `FeedProcessing.IChangeFeedObserver.CloseAsync` if the partition cannot be found or if the target replica is not up to date up with the read session. In these cases `FeedProcessing.ChangeFeedObserverCloseReason.ResourceGone` and `FeedProcessing.ChangeFeedObserverCloseReason.ReadSessionNotAvailable` close reasons are now used.
* Added a new close reason `FeedProcessing.ChangeFeedObserverCloseReason.ReadSessionNotAvailable` that is sent to close the change feed observer when the target replica is not up to date up with the read session.

### <a id="2.3.0"></a>2.3.0
* Added a new method `ChangeFeedProcessorBuilder.WithCheckpointPartitionProcessorFactory` and corresponding public interface `ICheckpointPartitionProcessorFactory`. This allows an implementation of the `IPartitionProcessor` interface to use built-in checkpointing mechanism. The new factory is similar to the existing `IPartitionProcessorFactory`, except that its `Create` method also takes the `ILeaseCheckpointer` parameter.
* Only one of the two methods, either `ChangeFeedProcessorBuilder.WithPartitionProcessorFactory` or `ChangeFeedProcessorBuilder.WithCheckpointPartitionProcessorFactory`, can be used for the same `ChangeFeedProcessorBuilder` instance.

### <a id="2.2.8"></a>2.2.8
* Stability and diagnosability improvements:
  * Added support to detect reading change feed taking long time. When it takes longer than the value specified by the `ChangeFeedProcessorOptions.ChangeFeedTimeout` property, the following steps are taken:
    * The operation to read change feed on the problematic partition is aborted.
    * The change feed processor instance drops ownership of the problematic lease. The dropped lease will be picked up during the next lease acquire step that will be done by the same or different change feed processor instance. This way, reading change feed will start over.
    * An issue is reported to the health monitor. The default heath monitor sends all reported issues to trace log.
  * Added a new public property: `ChangeFeedProcessorOptions.ChangeFeedTimeout`. The default value of this property is 10 mins.
  * Added a new public enum value: `Monitoring.MonitoredOperation.ReadChangeFeed`. When the value of `HealthMonitoringRecord.Operation` is set to `Monitoring.MonitoredOperation.ReadChangeFeed`, it indicates the health issue is related to reading change feed.

### <a id="2.2.7"></a>2.2.7
* Improved load-balancing strategy for scenario when getting all leases takes longer than lease expiration interval, for example, due to network issues:
  * In this scenario load-balancing algorithm used to falsely consider leases as expired, causing stealing leases from active owners. This could trigger unnecessary rebalancing many leases.
  * This issue is fixed in this release by avoiding retry on conflict while acquiring expired lease which owner hasn't changed and postponing acquiring expired lease to next load-balancing iteration.

### <a id="2.2.6"></a>2.2.6
* Improved handling of Observer exceptions.
* Richer information on Observer errors:
  * When an Observer is closed due to an exception thrown by Observer's ProcessChangesAsync, the CloseAsync will now receive the reason parameter set to ChangeFeedObserverCloseReason.ObserverError.
  * Added traces to identify errors within user code in an Observer.

### <a id="2.2.5"></a>2.2.5
* Added support for handling split in collections that use shared database throughput.
  * This release fixes an issue that may occur during split in collections using shared database throughput when split result into partition rebalancing with only one child partition key range created, rather than two. When this happens, Change Feed Processor may get stuck deleting the lease for old partition key range and not creating new leases. The issue is fixed in this release.

### <a id="2.2.4"></a>2.2.4
* Added new property ChangeFeedProcessorOptions.StartContinuation to support starting change feed from request continuation token. This is only used when lease collection is empty or a lease does not have ContinuationToken set. For leases in lease collection that have ContinuationToken set, the ContinuationToken is used and ChangeFeedProcessorOptions.StartContinuation is ignored.

### <a id="2.2.3"></a>2.2.3
* Added support for using custom store to persist continuation tokens per partition.
  * For example, a custom lease store can be Azure Cosmos DB lease collection partitioned in any custom way.
  * Custom lease stores can use new extensibility point ChangeFeedProcessorBuilder.WithLeaseStoreManager(ILeaseStoreManager) and ILeaseStoreManager public interface.
  * Refactored the ILeaseManager interface into multiple role interfaces.
* Minor breaking change: removed extensibility point ChangeFeedProcessorBuilder.WithLeaseManager(ILeaseManager), use ChangeFeedProcessorBuilder.WithLeaseStoreManager(ILeaseStoreManager) instead.

### <a id="2.2.2"></a>2.2.2
* This release fixes an issue that occurs during processing a split in monitored collection and using a partitioned lease collection. When processing a lease for split partition, the lease corresponding to that partition may not be deleted. The issue is fixed in this release.

### <a id="2.2.1"></a>2.2.1
* Fixed Estimator calculation for accounts with multiple write regions and new Session Token format.

### <a id="2.2.0"></a>2.2.0
* Added support for partitioned lease collections. The partition key must be defined as /id.
* Minor breaking change: the methods of the IChangeFeedDocumentClient interface and the ChangeFeedDocumentClient class were changed to include RequestOptions and CancellationToken  parameters. IChangeFeedDocumentClient is an advanced extensibility point that allows you to provide custom implementation of the Document Client to use with Change Feed Processor, for example, decorate DocumentClient and intercept all calls to it to do extra tracing, error handling, etc. With this update, the code that implement IChangeFeedDocumentClient will need to be changed to include new parameters in the implementation.
* Minor diagnostics improvements.

### <a id="2.1.0"></a>2.1.0
* Added new API, Task&lt;IReadOnlyList&lt;RemainingPartitionWork&gt;&gt; IRemainingWorkEstimator.GetEstimatedRemainingWorkPerPartitionAsync(). This can be used to get estimated work for each partition.
* Supports Microsoft.Azure.DocumentDB SDK 2.0. Requires Microsoft.Azure.DocumentDB 2.0 or later.

### <a id="2.0.6"></a>2.0.6
* Added ChangeFeedEventHost.HostName public property for compatibility with v1.

### <a id="2.0.5"></a>2.0.5
* Fixed a race condition that occurs during partition split. The race condition may lead to acquiring lease and immediately losing it during partition split and causing contention. The race condition issue is fixed with this release.

### <a id="2.0.4"></a>2.0.4
* GA SDK

### <a id="2.0.3-prerelease"></a>2.0.3-prerelease
* Fixed the following issues:
  * When partition split happens, there could be duplicate processing of documents modified before the split.
  * The GetEstimatedRemainingWork API returned 0 when no leases were present in the lease collection.

* The following exceptions are made public. Extensions that implement IPartitionProcessor can throw these exceptions.
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.LeaseLostException. 
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionException. 
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionNotFoundException.
  * Microsoft.Azure.Documents.ChangeFeedProcessor.Exceptions.PartitionSplitException. 

### <a id="2.0.2-prerelease"></a>2.0.2-prerelease
* Minor API changes:
  * Removed ChangeFeedProcessorOptions.IsAutoCheckpointEnabled that was marked as obsolete.

### <a id="2.0.1-prerelease"></a>2.0.1-prerelease
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

### <a id="1.3.3"></a>1.3.3
* Added more logging.
* Fixed a DocumentClient leak when calling the pending work estimation multiple times.

### <a id="1.3.2"></a>1.3.2
* Fixes in the pending work estimation.

### <a id="1.3.1"></a>1.3.1
* Stability improvements.
  * Fix for handling canceled tasks issue that might lead to stopped observers on some partitions.
* Support for manual checkpointing.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.21 and above.

### <a id="1.2.0"></a>1.2.0
* Adds support for .NET Standard 2.0. The package now supports `netstandard2.0` and `net451` framework monikers.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.17.0 and above.
* Compatible with [SQL .NET Core SDK](sql-api-sdk-dotnet-core.md) versions 1.5.1 and above.

### <a id="1.1.1"></a>1.1.1
* Fixes an issue with the calculation of the estimate of remaining work when the Change Feed was empty or no work was pending.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.13.2 and above.

### <a id="1.1.0"></a>1.1.0
* Added a method to obtain an estimate of remaining work to be processed in the Change Feed.
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.13.2 and above.

### <a id="1.0.0"></a>1.0.0
* GA SDK
* Compatible with [SQL .NET SDK](sql-api-sdk-dotnet.md) versions 1.14.1 and below.

## Release & Retirement dates

Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version. New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible.

> [!WARNING]
> After 31 August 2022, Azure Cosmos DB will no longer make bug fixes, add new features, and provide support to versions 1.x of the Azure Cosmos DB .NET or .NET Core SDK for SQL API. If you prefer not to upgrade, requests sent from version 1.x of the SDK will continue to be served by the Azure Cosmos DB service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.3.2](#2.3.2) |August 11, 2020 |--- |
| [2.3.1](#2.3.1) |July 30, 2020 |--- |
| [2.3.0](#2.3.0) |April 2, 2020 |--- |
| [2.2.8](#2.2.8) |October 28, 2019 |--- |
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
