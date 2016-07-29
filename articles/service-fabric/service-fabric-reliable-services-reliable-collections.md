<properties
   pageTitle="Reliable Collections | Microsoft Azure"
   description="Service Fabric stateful services provide reliable collections that enable you to write highly available, scalable, and low-latency cloud applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="mcoskun"
   manager="timlt"
   editor="masnider,vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="07/28/2016"
   ms.author="mcoskun"/>

# Introduction to Reliable Collections in Azure Service Fabric stateful services

Reliable Collections enable you to write highly available, scalable, and low-latency cloud applications as though you were writing single computer applications. The classes in the **Microsoft.ServiceFabric.Data.Collections** namespace provide a set of out-of-the-box collections that automatically make your state highly available. Developers need to program only to the Reliable Collection APIs and let Reliable Collections manage the replicated and local state.

The key difference between Reliable Collections and other high-availability technologies (such as Redis, Azure Table service, and Azure Queue service) is that the state is kept locally in the service instance while also being made highly available. This means that:

- All reads are local, which results in low latency and high-throughput reads.
- All writes incur the minimum number of network IOs, which results in low latency and high-throughput writes.

![Image of evolution of collections.](media/service-fabric-reliable-services-reliable-collections/ReliableCollectionsEvolution.png)

Reliable Collections can be thought of as the natural evolution of the **System.Collections** classes: a new set of collections that are designed for the cloud and multi-computer applications without increasing complexity for the developer. As such, Reliable Collections are:

- Replicated: State changes are replicated for high availability.
- Persisted: Data is persisted to disk for durability against large-scale outages (for example, a datacenter power outage).
- Asynchronous: APIs are asynchronous to ensure that threads are not blocked when incurring IO.
- Transactional: APIs utilize the abstraction of transactions so you can manage multiple Reliable Collections within a service easily.

Reliable Collections provide strong consistency guarantees out of the box in order to make reasoning about application state easier.
Strong consistency is achieved by ensuring transaction commits finish only after the entire transaction
has been logged on a majority quorum of replicas, including the primary.
To achieve weaker consistency, applications can acknowledge back to the client/requester before the asynchronous commit returns.

The Reliable Collections APIs are an evolution of concurrent collections APIs
(found in the **System.Collections.Concurrent** namespace):

- Asynchronous: Returns a task since, unlike concurrent collections, the operations are replicated and persisted.
- No out parameters: Uses `ConditionalValue<T>` to return a bool and a value instead of out parameters. `ConditionalValue<T>` is like `Nullable<T>` but does not require T to be a struct.
- Transactions: Uses a transaction object to enable the user to group actions on multiple Reliable Collections in a transaction.

Today, **Microsoft.ServiceFabric.Data.Collections** contains two collections:

- [Reliable Dictionary](https://msdn.microsoft.com/library/azure/dn971511.aspx): Represents a replicated, transactional, and asynchronous collection of key/value pairs. Similar to **ConcurrentDictionary**, both the key and the value can be of any type.
- [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx): Represents a replicated, transactional, and asynchronous strict first-in, first-out (FIFO) queue. Similar to **ConcurrentQueue**, the value can be of any type.

## Isolation levels
Isolation level defines the degree to which the transaction must be isolated from modifications made by other transactions.
There are two isolation levels that are supported in Reliable Collections:

- **Repeatable Read**: Specifies that statements cannot read data that has been modified but not yet committed by other transactions and that no other transactions can modify data that has been read by the current transaction until the current transaction finishes. For more details, see [https://msdn.microsoft.com/library/ms173763.aspx](https://msdn.microsoft.com/library/ms173763.aspx).
- **Snapshot**: Specifies that data read by any statement in a transaction will be the transactionally consistent version of the data that existed at the start of the transaction.
The transaction can recognize only data modifications that were committed before the start of the transaction.
Data modifications made by other transactions after the start of the current transaction are not visible to statements executing in the current transaction.
The effect is as if the statements in a transaction get a snapshot of the committed data as it existed at the start of the transaction.
Snapshots are consistent across Reliable Collections.
For more details, see [https://msdn.microsoft.com/library/ms173763.aspx](https://msdn.microsoft.com/library/ms173763.aspx).

Reliable Collections automatically choose the isolation level to use for a given read operation depending on the operation and the role of the replica at the time of transaction's creation.
Following is the table that depicts isolation level defaults for Reliable Dictionary and Queue operations.

| Operation \ Role      | Primary          | Secondary        |
| --------------------- | :--------------- | :--------------- |
| Single Entity Read    | Repeatable Read  | Snapshot         |
| Enumeration \ Count   | Snapshot         | Snapshot         |

>[AZURE.NOTE] Common examples for Single Entity Operations are `IReliableDictionary.TryGetValueAsync`, `IReliableQueue.TryPeekAsync`.

Both the Reliable Dictionary and the Reliable Queue support Read Your Writes.
In other words, any write within a transaction will be visible to a following read
that belongs to the same transaction.

## Locking
In Reliable Collections, all transactions are two-phased: a transaction does not release
the locks it has acquired until the transaction terminates with either an abort or a commit.

Reliable Dictionary uses row level locking for all single entity operations.
Reliable Queue trades off concurrency for strict transactional FIFO property.
Reliable Queue uses operation level locks allowing one transaction with `TryPeekAsync` and/or `TryDequeueAsync` and one transaction with `EnqueueAsync` at a time.
Note that to preserve FIFO, if a `TryPeekAsync` or `TryDequeueAsync` ever observes that the Reliable Queue is empty, they will also lock `EnqueueAsync`.

Write operations always take Exclusive locks.
For read operations, the locking depends on a couple of factors.
Any read operation done using Snapshot isolation is lock free.
Any Repeatable Read operation by default takes Shared locks.
However, for any read operation that supports Repeatable Read, the user can ask for an Update lock instead of the Shared lock.
An Update lock is an asymmetric lock used to prevent a common form of deadlock that occurs when multiple transactions lock resources for potential updates at a later time.

The lock compatibility matrix can be found below:

| Request \ Granted | None         | Shared       | Update      | Exclusive    |
| ----------------- | :----------- | :----------- | :---------- | :----------- |
| Shared            | No conflict  | No conflict  | Conflict    | Conflict     |
| Update            | No conflict  | No conflict  | Conflict    | Conflict     |
| Exclusive         | No conflict  | Conflict     | Conflict    | Conflict     |

Note that a time-out argument in the Reliable Collections APIs is used for deadlock detection.
For example, two transactions (T1 and T2) are trying to read and update K1.
It is possible for them to deadlock, because they both end up having the Shared lock.
In this case, one or both of the operations will time out.

Note that the above deadlock scenario is a great example of how an Update lock can prevent deadlocks.

## Persistence model
The Reliable State Manager and Reliable Collections follow a persistence model that is called Log and Checkpoint.
This is a model where each state change is logged on disk and applied only in memory.
The complete state itself is persisted only occasionally (a.k.a. Checkpoint).
The benefit that it provides is:

- Deltas are turned into sequential append-only writes on disk for improved performance.

To better understand the Log and Checkpoint model, let’s first look at the infinite disk scenario.
The Reliable State Manager logs every operation before it is replicated.
This allows the Reliable Collection to apply only the operation in memory.
Since logs are persisted, even when the replica fails and needs to be restarted, the Reliable State Manager has enough information in its logs to replay all the operations the replica has lost.
As the disk is infinite, log records never need to be removed and the Reliable Collection needs to manage only the in-memory state.

Now let’s look at the finite disk scenario.
At one point, the Reliable State Manager will run out of disk space.
Before that happens, the Reliable State Manager needs to truncate its log to make room for the newer records.
It will request the Reliable Collections to checkpoint their in-memory state to disk.
It is the Reliable Collection's responsibility to persist its state up to that point.
Once the Reliable Collections complete their checkpoints, the Reliable State Manager can truncate the log to free up disk space.
This way, when the replica needs to be restarted, Reliable Collections will recover their checkpointed state, and the Reliable State Manager will recover and play back all the state changes that occurred since the checkpoint.

## Recommendations

- Do not modify an object of custom type returned by read operations (e.g., `TryPeekAsync` or `TryGetValueAsync`). Reliable Collections, just like Concurrent Collections, return a reference to the objects and not a copy.
- Do deep copy the returned object of a custom type before modifying it. Since structs and built-in types are pass-by-value, you do not need to do a deep copy on them.
- Do not use `TimeSpan.MaxValue` for time-outs. Time-outs should be used to detect deadlocks.
- Do not use a transaction after it has been committed, aborted, or disposed.
- Enumerators constructed inside a transaction scope should not be used outside the transaction scope.
- Do not create a transaction within another transaction’s `using` statement because it can cause deadlocks.
- Do ensure that your `IComparable<TKey>` implementation is correct. The system takes dependency on this for merging checkpoints.
- Do use Update lock when reading an item with an intention to update it.
- Consider using backup and restore functionality to have disaster recovery.
- Consider not mixing single entity operations and multi-entity operations (e.g `GetCountAsync`, `CreateEnumerableAsync`) in the same transaction.

Here are some things to keep in mind:

- The default time-out is 4 seconds for all the Reliable Collection APIs. Most users should not override this.
- The default cancellation token is `CancellationToken.None` in all Reliable Collections APIs.
- The key type parameter (*TKey*) for a Reliable Dictionary must correctly implement `GetHashCode()` and `Equals()`. Keys must be immutable.
- To achieve high availability for the Reliable Collections, each service should have at least a target and minimum replica set size of 3.
- Read operations on the secondary may read versions that are not quorum committed.
This means that a version of data that is read from a single secondary might be false progressed.
Of course, reads from Primary are always stable: can never be false progressed.

## Next steps

- [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
- [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
- [Reliable Services notifications](service-fabric-reliable-services-notifications.md)
- [Reliable Services backup and restore (disaster recovery)](service-fabric-reliable-services-backup-restore.md)
- [Reliable State Manager configuration](service-fabric-reliable-services-configuration.md)
- [Getting started with Service Fabric Web API services](service-fabric-reliable-services-communication-webapi.md)
- [Advanced usage of the Reliable Services programming model](service-fabric-reliable-services-advanced-usage.md)
- [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)
