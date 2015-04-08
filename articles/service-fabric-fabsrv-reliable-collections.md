<properties
   pageTitle="Reliable Collections"
   description="Reliable Collections "
   services="service-fabric"
   documentationCenter=".net"
   authors="mcoskun"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="04/07/2015"
   ms.author="mcoskun@microsoft.com"/>

# Reliable Collections

Reliable Collections enable you to write highly available, scalable, and low latency cloud applications as though you are writing single machine applications. The classes in the Microsoft.ServiceFabric.Collections.Distributed namespace provide a set of out-of-the-box state providers that automatically make your state highly available. Developers need only to program to the Reliable Collection APIs and let Reliable Collections manage the replicated and local state.

The key difference between Reliable Collections and other high-availability technologies (such as Redis, Azure Table service, and Azure Queue service) is that the state is kept locally in the service instance while also being made highly available. This means that:
1. All reads are local, which results in low latency and high throughput reads.
2. All writes incur the minimum number of network IOs, which results in low latency and high throughput writes.

![Image of Evolution of Collections.](./media/service-fabric-fabsrv-reliable-collections\ReliableCollectionsEvolution.png)

Reliable Collections can be thought as the natural evolution of the System.Collections Collection classes: a new set of collections that are designed for the cloud and multi-node applications without increasing complexity for the developer. As such, they are
1. Replicated: Replicates the state changes for high availability,
2. Persisted: Collections are persisted to disk (using Log & Checkpoint model) to survive cluster or partition wide black outs. Note that all state in Reliable Collections is also in-memory for fast access.
3. Asynchronous: Asynchronous APIs to ensure threads are not blocked when incurring IO.
4. Transactional: Utilize the abstraction of transactions to allow you to manage multiple distributed collections with in a service easily.

In addition, to make reasoning about applications easier, Reliable Collections provide strong consistency by default. This is achieved by transaction commits only completing after the entire transactions has been applied on quorum or replicas including the primary.

The Reliable Collections APIs are a straightforward evolution of concurrent collections (found in the System.Collections.Concurrent namespace):
1. Asynchronous: Returns a Task since, unlike distributed collections, the operations are replicated and persisted.
2. No out parameters: Uses Tuples to return multiple objects instead of out parameters.
3. Transaction object: Uses a transaction object to enable the user to group actions in a transaction.

Today, Microsoft.ServiceFabric.Collections.Distributed contains to collections:
1. Reliable Dictionary: Represents a replicated, transactional and asynchronous collection of key/value pairs. Similar to ConcurrentDictionary, both the key and the value can be of any type.
2. Reliable Queue: Represents a replicated, transactional and asynchronous strict first-in first-out (FIFO) queue. Similar to ConcurrentQueue, the value can be of any type.

## Isolation Levels
Reliable Collections automatically choose the isolation level to use for a given read operation depending on the operation and the role of the replica.

Isolation means that a transaction behaves as it would in a system that only allows one transaction to be in-flight at any given point of time.

Isolation level is a measure of the degree isolation is achieved.

There are two isolation levels that are supported in Reliable Collections:
- **Repeatable Read**: "Specifies that statements cannot read data that has been modified but not yet committed by other transactions and that no other transactions can modify data that has been read by the current transaction until the current transaction completes. (https://msdn.microsoft.com/en-us/library/ms173763.aspx)"
- **Snapshot**: "Specifies that data read by any statement in a transaction will be the transactionally consistent version of the data that existed at the start of the transaction. The transaction can only recognize data modifications that were committed before the start of the transaction. Data modifications made by other transactions after the start of the current transaction are not visible to statements executing in the current transaction. The effect is as if the statements in a transaction get a snapshot of the committed data as it existed at the start of the transaction. (https://msdn.microsoft.com/en-us/library/ms173763.aspx)"

Both the Reliable Dictionary and the Reliable Queue support Read Your Writes. In other words, any write within a transaction will be visible to a following read that belongs to the same transaction.

### Reliable Dictionary
| Operation \ Role      | Primary           | Secondary        |
| --------------------- | :---------------- | :--------------- |
| Single Entity Read    | Repeatable Read   | Snapshot         |
| Scan                  | Snapshot          | Snapshot         |

### Reliable Queue
| Operation \ Role      | Primary          | Secondary        |
| --------------------- | :--------------- | :--------------- |
| Single Entity Read    | Snapshot         | Snapshot         |
| Scan                  | Snapshot         | Snapshot         |

## Recommendations
- **DO NOT** modify an object of custom type returned by read operations (e.g TryPeekAsync ir TryGetAsync). Reliable Collections return a reference to the objects and not a copy.
- **DO** deep copy returned object of custom type before modifying it. Since, built-in types are pass-by-value, you do not need to do a deep copy them.
- **DO NOT** use MaxValue for timeouts. Timeouts should be used to detect deadlocks.
- **DO NOT** create a transaction within another transaction’s using statement because it can cause deadlocks.

Here are some things to keep in mind:
- The default timeout is 4 seconds for all the Reliable Collection APIs.
- The default CancellationToken is None in all Reliable Collections APIs.
- Enumerations are snapshot consistent within a collection. However, enumerations of multiple collections is not consistent across collections.
- To achieve high availability for the Reliable Collections, each service partition should have at least target and minimum replica set size of 3.
