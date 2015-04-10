<properties
   pageTitle="Reliable Collections"
   description="Reliable Collections Dictionary Queue Isolation Lock"
   services="service-fabric"
   documentationCenter=".net"
   authors="mcoskun"
   manager="timlt"
   editor="masnider"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="04/08/2015"
   ms.author="mcoskun@microsoft.com"/>

# Reliable Collections

Reliable Collections enable you to write highly available, scalable, and low latency
cloud applications as though you are writing single machine applications.
The classes in the Microsoft.ServiceFabric.Data.Collections namespace provide a set of out-of-the-box
collections that automatically make your state highly available.
Developers need only to program to the Reliable Collection APIs and let Reliable Collections
manage the replicated and local state.

The key difference between Reliable Collections and other high-availability technologies
(such as Redis, Azure Table service, and Azure Queue service) is that the state is
kept locally in the service instance while also being made highly available.
This means that:
1. All reads are local, which results in low latency and high throughput reads.
2. All writes incur the minimum number of network IOs, which results in low latency and high throughput writes.

![Image of Evolution of Collections.](media/service-fabric-fabsrv-reliable-collections/ReliableCollectionsEvolution.png)

Reliable Collections can be thought of as the natural evolution of the System.Collections
classes: a new set of collections that are designed for the cloud and multi-machine
applications without increasing complexity for the developer.
As such, they are
1. Replicated: Replicates the state changes for high availability,
2. Persisted: Data is persisted to disk for durability against large-scale outages (for example, a datacenter power outage).
3. Asynchronous: Asynchronous APIs to ensure threads are not blocked when incurring IO.
4. Transactional: Utilize the abstraction of transactions to allow you to manage multiple Reliable Collections within a service easily.

Reliable Collections provide strong consistency guarantees out of the box in order
to make reasoning about application state easier.
This is achieved by transaction commits only completing after the entire transactions
has been applied on quorum of replicas including the primary.
To achieve weaker consistency application can acknowledge back to the client / requester
before ITransaction.CommitAsync returns.

The Reliable Collections APIs are an evolution of concurrent collections APIs
(found in the System.Collections.Concurrent namespace):
1. Asynchronous: Returns a Task since, unlike Reliable Collections, the operations are replicated and persisted.
2. No out parameters: Uses ConditionalResult<T> to return bool and a value instead of out parameters. ConditionalResult<T> is like Nullable<T> but does not require T to a struct.
3. Transaction object: Uses a transaction object to enable the user to group actions on multiple Reliable Collections in a transaction.

Today, Microsoft.ServiceFabric.Data.Collections contains two collections:
1. Reliable Dictionary: Represents a replicated, transactional, and asynchronous collection of key/value pairs. Similar to ConcurrentDictionary, both the key and the value can be of any type.
2. Reliable Queue: Represents a replicated, transactional and asynchronous strict first-in first-out (FIFO) queue. Similar to ConcurrentQueue, the value can be of any type.

## Isolation Levels
Isolation level is a measure of the degree isolation is achieved.
Isolation means that a transaction behaves as it would in a system that only allows
one transaction to be in-flight at any given point of time.

Reliable Collections automatically choose the isolation level to use for a given
read operation depending on the operation and the role of the replica.

There are two isolation levels that are supported in Reliable Collections:
- **Repeatable Read**: "Specifies that statements cannot read data that has been modified but not yet committed by other transactions and that no other transactions can modify data that has been read by the current transaction until the current transaction completes. (https://msdn.microsoft.com/en-us/library/ms173763.aspx)"
- **Snapshot**: "Specifies that data read by any statement in a transaction will be the transactionally consistent version of the data that existed at the start of the transaction. The transaction can only recognize data modifications that were committed before the start of the transaction. Data modifications made by other transactions after the start of the current transaction are not visible to statements executing in the current transaction. The effect is as if the statements in a transaction get a snapshot of the committed data as it existed at the start of the transaction. (https://msdn.microsoft.com/en-us/library/ms173763.aspx)"

Both the Reliable Dictionary and the Reliable Queue support Read Your Writes.
In other words, any write within a transaction will be visible to a following read
that belongs to the same transaction.

### Reliable Dictionary
| Operation \ Role      | Primary          | Secondary        |
| --------------------- | :--------------- | :--------------- |
| Single Entity Read    | Repeatable Read  | Snapshot         |
| Enumeration \ Count   | Snapshot         | Snapshot         |

### Reliable Queue
| Operation \ Role      | Primary          | Secondary        |
| --------------------- | :--------------- | :--------------- |
| Single Entity Read    | Snapshot         | Snapshot         |
| Enumeration \ Count   | Snapshot         | Snapshot         |

## Persistence Model
Reliable Object State Manager (ROSM) and Reliable Collections follow a persistence model that is called Log and Checkpoint.
This is a model where each state change is logged on disk and only applied in memory.
The complete state itself is only persisted occasionally (aka. Checkpoint).
Benefit it provides is  
- Deltas are turned into sequential append only writes on disk for improved performance.

To better understand the log and checkpoint model, let’s first look at the infinite disk scenario.
ROSM logs every operation before it is replicated.
This allows the Reliable Collection to only apply the operation in memory.
Since logs are persisted, even when the replica fails and needs to be restarted, the Reliable Object State Manager
has enough information in its logs to replay all the operations the replica has lost.
As disk is infinite, log records never need to be removed and the Reliable Collection only needs to manage the in-memory state.

Now let’s look at the finite disk scenario.
At one point the replicator will run out of disk space.
Before that happens the ROSM needs to truncate its log to make room for the newer records.
So it will call checkpoint on the Reliable Collection.
It is the Reliable Collection's responsibility to persist its state up to that point.
Once Reliable Collection completes the checkpoint, ROSM can truncate the log.
This way, when the replica needs to be restarted, Reliable Collections will recover their
checkpointed state and the ROSM will recover and play back all the states that occurred
after the checkpoint.

## Locking
In Reliable Collections, all transactions are two-phased: Transaction does not release
the locks it has acquired until the transaction terminates with either
Abort or CommitAsync.

Reliable Collections always takes Exclusive locks.
For reads, the locking is dependent on couple of factors.
Any read operation done using Shapshot Isolation is lock free.
Any Repeatable read operation by default takes Shared locks.
However, for any read operation that supports Repeatable Read, user can ask for a
Update lock instead of the Shared lock.
Update lock is an asymmetric lock used to prevent a common form of deadlock that
occurs when multiple transaction lock resources for potential update at a later time.

Lock compatibility matrix can be found below;

| Request \ Granted | None         | Shared       | Update      | Exclusive    |
| ----------------- | :----------- | :----------- | :---------- | :----------- |
| Shared            | No Conflict  | No Conflict  | Conflict    | Conflict     |
| Update            | No Conflict  | No Conflict  | Conflict    | Conflict     |
| Exclusive         | No Conflict  | Conflict     | Conflict    | Conflict     |

Note that timeout argument in the Reliable Collections API is used as a deadlock detection.
For example, two transactions (T1 and T2) are trying to read and update K1.
It is possible for them to deadlock, because they both end up having the Shared lock.
In this case, one or both of the operations will timeout.

Note that the above deadlock scenario is a great example of how Update lock can prevent deadlocks.

## Recommendations
- **DO NOT** modify an object of custom type returned by read operations (e.g TryPeekAsync or TryGetAsync). Reliable Collections, just like Concurrent Collections, return a reference to the objects and not a copy.
- **DO** deep copy returned object of custom type before modifying it. Since, built-in types are pass-by-value, you do not need to do a deep copy them.
- **DO NOT** use MaxValue for timeouts. Timeouts should be used to detect deadlocks.
- **DO NOT** create a transaction within another transaction’s using statement because it can cause deadlocks.

Here are some things to keep in mind:
- The default timeout is 4 seconds for all the Reliable Collection APIs. Most users should not override this.
- The default CancellationToken is CancellationToken.None in all Reliable Collections APIs.
- Enumerations are snapshot consistent within a collection. However, enumerations of multiple collections is not consistent across collections.
- To achieve high availability for the Reliable Collections, each service should have at least target and minimum replica set size of 3.
