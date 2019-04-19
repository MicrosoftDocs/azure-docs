---
title: Guidelines & Recommendations for Reliable Collections in  Azure Service Fabric | Microsoft Docs
description: Guidelines and Recommendations for using Service Fabric Reliable Collections
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: masnider,rajak,zhol

ms.assetid: 62857523-604b-434e-bd1c-2141ea4b00d1
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 12/10/2017
ms.author: aljo

---
# Guidelines and recommendations for Reliable Collections in Azure Service Fabric
This section provides guidelines for using Reliable State Manager and Reliable Collections. The goal is to help users avoid common pitfalls.

The guidelines are organized as simple recommendations prefixed with the terms *Do*, *Consider*, *Avoid* and *Do not*.

* Do not modify an object of custom type returned by read operations (for example, `TryPeekAsync` or `TryGetValueAsync`). Reliable Collections, just like Concurrent Collections, return a reference to the objects and not a copy.
* Do deep copy the returned object of a custom type before modifying it. Since structs and built-in types are pass-by-value, you do not need to do a deep copy on them unless they contain reference-typed fields or properties that you intend to modify.
* Do not use `TimeSpan.MaxValue` for time-outs. Time-outs should be used to detect deadlocks.
* Do not use a transaction after it has been committed, aborted, or disposed.
* Do not use an enumeration outside of the transaction scope it was created in.
* Do not create a transaction within another transaction’s `using` statement because it can cause deadlocks.
* Do not create reliable state with `IReliableStateManager.GetOrAddAsync` and use the reliable state in the same transaction. This results in an InvalidOperationException.
* Do ensure that your `IComparable<TKey>` implementation is correct. The system takes dependency on `IComparable<TKey>` for merging checkpoints and rows.
* Do use Update lock when reading an item with an intention to update it to prevent a certain class of deadlocks.
* Consider keeping number of Reliable Collections per partition to be less than 1000. Prefer Reliable Collections with more items over more Reliable Collections with fewer items.
* Consider keeping your items (for example, TKey + TValue for Reliable Dictionary) below 80 KBytes: smaller the better. This reduces the amount of Large Object Heap usage as well as disk and network IO requirements. Often, it reduces replicating duplicate data when only one small part of the value is being updated. Common way to achieve this in Reliable Dictionary, is to break your rows in to multiple rows.
* Consider using backup and restore functionality to have disaster recovery.
* Avoid mixing single entity operations and multi-entity operations (e.g `GetCountAsync`, `CreateEnumerableAsync`) in the same transaction due to the different isolation levels.
* Do handle InvalidOperationException. User transactions can be aborted by the system for variety of reasons. For example, when the Reliable State Manager is changing its role out of Primary or when a long-running transaction is blocking truncation of the transactional log. In such cases, user may receive InvalidOperationException indicating that their transaction has already been terminated. Assuming, the termination of the transaction was not requested by the user, best way to handle this exception is to dispose the transaction, check if the cancellation token has been signaled (or the role of the replica has been changed), and if not create a new transaction and retry.  

Here are some things to keep in mind:

* The default time-out is four seconds for all the Reliable Collection APIs. Most users should use the default time-out.
* The default cancellation token is `CancellationToken.None` in all Reliable Collections APIs.
* The key type parameter (*TKey*) for a Reliable Dictionary must correctly implement `GetHashCode()` and `Equals()`. Keys must be immutable.
* To achieve high availability for the Reliable Collections, each service should have at least a target and minimum replica set size of 3.
* Read operations on the secondary may read versions that are not quorum committed.
  This means that a version of data that is read from a single secondary might be false progressed.
  Reads from Primary are always stable: can never be false progressed.
* Security/Privacy of the data persisted by your application in a reliable collection is your decision and subject to the protections provided by your storage management; I.E. Operating System disk encryption could be used to protect your data at rest.  

### Next steps
* [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
* [Transactions and Locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)
* Managing Data
  * [Backup and Restore](service-fabric-reliable-services-backup-restore.md)
  * [Notifications](service-fabric-reliable-services-notifications.md)
  * [Serialization and Upgrade](service-fabric-application-upgrade-data-serialization.md)
  * [Reliable State Manager configuration](service-fabric-reliable-services-configuration.md)
* Others
  * [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
  * [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)
