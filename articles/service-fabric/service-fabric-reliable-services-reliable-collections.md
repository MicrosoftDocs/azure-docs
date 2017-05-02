---
title: Save application state in Azure microservices| Microsoft Docs
description: Service Fabric stateful services provide reliable collections that enable you to write highly available, scalable, and low-latency cloud applications.
services: service-fabric
documentationcenter: .net
author: mcoskun
manager: timlt
editor: masnider,vturecek,rajak

ms.assetid: 62857523-604b-434e-bd1c-2141ea4b00d1
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 5/1/2017
ms.author: mcoskun

---
# Introduction to Reliable Collections in Azure Service Fabric stateful services
Reliable Collections enable you to write highly available, scalable, and low-latency cloud applications as though you were writing single computer applications. The classes in the **Microsoft.ServiceFabric.Data.Collections** namespace provide a set of out-of-the-box collections that automatically make your state highly available. Developers need to program only to the Reliable Collection APIs and let Reliable Collections manage the replicated and local state.

The key difference between Reliable Collections and other high-availability technologies (such as Redis, Azure Table service, and Azure Queue service) is that the state is kept locally in the service instance while also being made highly available. This means that:

* All reads are local, which results in low latency and high-throughput reads.
* All writes incur the minimum number of network IOs, which results in low latency and high-throughput writes.

![Image of evolution of collections.](media/service-fabric-reliable-services-reliable-collections/ReliableCollectionsEvolution.png)

Reliable Collections can be thought of as the natural evolution of the **System.Collections** classes: a new set of collections that are designed for the cloud and multi-computer applications without increasing complexity for the developer. As such, Reliable Collections are:

* Replicated: State changes are replicated for high availability.
* Persisted: Data is persisted to disk for durability against large-scale outages (for example, a datacenter power outage).
* Asynchronous: APIs are asynchronous to ensure that threads are not blocked when incurring IO.
* Transactional: APIs utilize the abstraction of transactions so you can manage multiple Reliable Collections within a service easily.

Reliable Collections provide strong consistency guarantees out of the box in order to make reasoning about application state easier.
Strong consistency is achieved by ensuring transaction commits finish only after the entire transaction
has been logged on a majority quorum of replicas, including the primary.
To achieve weaker consistency, applications can acknowledge back to the client/requester before the asynchronous commit returns.

The Reliable Collections APIs are an evolution of concurrent collections APIs
(found in the **System.Collections.Concurrent** namespace):

* Asynchronous: Returns a task since, unlike concurrent collections, the operations are replicated and persisted.
* No out parameters: Uses `ConditionalValue<T>` to return a bool and a value instead of out parameters. `ConditionalValue<T>` is like `Nullable<T>` but does not require T to be a struct.
* Transactions: Uses a transaction object to enable the user to group actions on multiple Reliable Collections in a transaction.

Today, **Microsoft.ServiceFabric.Data.Collections** contains two collections:

* [Reliable Dictionary](https://msdn.microsoft.com/library/azure/dn971511.aspx): Represents a replicated, transactional, and asynchronous collection of key/value pairs. Similar to **ConcurrentDictionary**, both the key and the value can be of any type.
* [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx): Represents a replicated, transactional, and asynchronous strict first-in, first-out (FIFO) queue. Similar to **ConcurrentQueue**, the value can be of any type.

## Next steps
* [Transactions and Locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)
* [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
* [Reliable State Manager and Collection Internals](service-fabric-reliable-services-reliable-collections-internals.md)
* Managing Data
  * [Backup and Restore][Reliable Services backup and restore (disaster recovery)]
  * [Notifications](service-fabric-reliable-services-notifications.md)
  * [Serialization and Upgrade](service-fabric-application-upgrade-data-serialization.md)
  * [Reliable State Manager configuration](service-fabric-reliable-services-configuration.md)
(service-fabric-reliable-services-backup-restore.md)
* Others
  * [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
  * [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)

## Recommendations
* Do not modify an object of custom type returned by read operations (e.g., `TryPeekAsync` or `TryGetValueAsync`). Reliable Collections, just like Concurrent Collections, return a reference to the objects and not a copy.
* Do deep copy the returned object of a custom type before modifying it. Since structs and built-in types are pass-by-value, you do not need to do a deep copy on them.
* Do not use `TimeSpan.MaxValue` for time-outs. Time-outs should be used to detect deadlocks.
* Do not use a transaction after it has been committed, aborted, or disposed.
* Do not use an enumeration outside of the transaction scope it was created in.
* Do not create a transaction within another transaction’s `using` statement because it can cause deadlocks.
* Do ensure that your `IComparable<TKey>` implementation is correct. The system takes dependency on this for merging checkpoints.
* Do use Update lock when reading an item with an intention to update it to prevent a certain class of deadlocks.
* Consider keeping your items (e.g. TKey + TValue for Reliable Dictionary) below 80 KBytes: smaller the better. This will reduce the amount of Large Object Heap usage as well as disk and network IO requirements. In many cases, it will also reduce replicating duplicate data when only one small part of the value is being updated. Common way to achieve this in Reliable Dictionary, is to break your rows in to multiple rows. 
* Consider using backup and restore functionality to have disaster recovery.
* Avoid mixing single entity operations and multi-entity operations (e.g `GetCountAsync`, `CreateEnumerableAsync`) in the same transaction due to the different isolation levels.
* Do handle InvalidOperationException. User transactions can be aborted by the system for variety of reasons. For example, when the Reliable State Manager is changing its role out of Primary or when a long-running transaction is blocking truncation of the transactional log. In such cases, user may receve InvalidOperationException indicating that their transaction has already been terminated. Assuming, the termination of the transaction was not requested by the user, best way to handle this exception is to dispose the transaction, check if the cancellation token has been signaled (or the role of the replica has been changed), and if not create a new transaction and retry.  

Here are some things to keep in mind:

* The default time-out is 4 seconds for all the Reliable Collection APIs. Most users should not override this.
* The default cancellation token is `CancellationToken.None` in all Reliable Collections APIs.
* The key type parameter (*TKey*) for a Reliable Dictionary must correctly implement `GetHashCode()` and `Equals()`. Keys must be immutable.
* To achieve high availability for the Reliable Collections, each service should have at least a target and minimum replica set size of 3.
* Read operations on the secondary may read versions that are not quorum committed.
  This means that a version of data that is read from a single secondary might be false progressed.
  Of course, reads from Primary are always stable: can never be false progressed.



