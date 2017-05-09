---
title: ReliableConcurrentQueue in Azure Serice Fabric
description: ReliableConcurrentQueue is a high throughput queue which allows parallel enqueues and dequeues.
services: service-fabric
documentationcenter: .net
author: sangarg,tyadam
manager: timlt
editor: raja,masnider,vturecek

ms.assetid: 62857523-604b-434e-bd1c-2141ea4b00d1
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 5/1/2017
ms.author: sangarg,tyadam

---
# Introduction to ReliableConcurrentQueue
Reliable Concurrent Queue is an asynchronous queue which is transactional and replicated. The queue allows concurrent enqueues and dequeues to process the queue. The data structure is aimed to deliver high throughput by relaxing the strict FIFO constraint and offers a best-effort ordering for the items.

## Apis offered
|Concurrent Queue   |Reliable Concurrent Queue   |
|-------------------|----------------------------|
| void Enqueue(T item)  | Task EnqueueAsync(ITransaction tx, T item)  |
| bool TryDequeue(out T result)  | Task< ConditionalValue < T > > TryDequeueAsync(ITransaction tx)  |
| int Count()  | long Count()  |

## Comparison with [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx)

Reliable Concurrent Queue is offered as an alternative to [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx). It should be used in cases where strict FIFO ordering is not required, as guaranteeing FIFO requires a tradeoff with concurrency.  [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) uses locks to enforce FIFO ordering, with at most one transaction allowed to enqueue and/or dequeue at a time. In comparison, the Reliable Concurrent Queue relaxes the ordering constraint. It allows any number concurrent transactions to interleave their enqueue and dequeue operations. Best-effort ordering is provided, however the relative ordering of two values in a Reliable Concurrent Queue can never be guaranteed.

Reliable Concurrent Queue provides higher throughput and lower latency than [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) whenever there are multiple concurrent transactions performing enqueues and/or dequeues.   

A good use case for the ReliableConcurrentQueue would be a [Messaging Queue](https://en.wikipedia.org/wiki/Message_queue) scenario. In this scenario, we have a message producer who creates a message and adds it to the queue independent of a message consumer. The message consumer can then pull a message from the queue and process it. We can have multiple producers and consumers working independent of each other and hence need to allow concurrent transactions to process the queue.

## Usage Guidelines
* The queue expects that the items have a low retention period, that is, the items would not stay in the queue for a long time.
* The queue does not guarantee strict FIFO ordering.
* The queue does not read its own writes. If an item is enqueued in a transaction, it would not be visible to a dequeuer in the same transaction.
* Dequeues are not isolated from each other. If item *A* is dequeued in transaction *txnA*, even though *txnA* is not committed, item *A* would not be visible to a concurrent transaction *txnB*.
* *TryPeekAsync* behavior can be implemented by using a *TryDequeueAsync* and then aborting the transaction. A code snippet for the same can be found in the Programming Patterns section.
* Count is non-transactional. It should be used to get an idea of the number of elements in the queue. It does not guarantee the queue count.
* Expensive processing on the dequeued items must be delayed for later to avoid long running transactions.
* Currently we do not guarantee any ordering but would be providing Enqueue ordering within a transaction. Users must not reply their business logic on the order of items in the queue.

## Code Snippets
Let us look at a few code snippets and the expected outputs for the same. Exception handling is ignored in this section.

##### - EnqueueAsync
Here are a few code snippets for using EnqueueAsync followed by the expected outputs.

- *Case 1: Single Enqueue task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 10, cancellationToken).ConfigureAwait(false);
    await this.Queue.EnqueueAsync(txn, 20, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Assume that the task completed successfully and there were no parallel tasks processing the queue. The user can expect the queue to have the items in any of the following orders:
> 10, 20

> 20, 10



- *Case 2: Parallel enqueue task*

```
// Parallel Task 1
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 10, cancellationToken).ConfigureAwait(false);
    await this.Queue.EnqueueAsync(txn, 20, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}

// Parallel  Task 2
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 30, cancellationToken).ConfigureAwait(false);
    await this.Queue.EnqueueAsync(txn, 40, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Assume that there are no other parallel tasks processing the queue, and that Task 1 and Task 2 are running in parallel. No inference can be made about the order of items in the queue. For this code snippet, the items may appear in any of the 4! order currently.


##### - DequeueAsync
Here are a few code snippets for using TryDequeueAsync followed by the expected outputs. Assume that the queue is already populated with the following items in the queue:
> 10, 20, 30, 40, 50, 60

- *Case 1: Single dequeue task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Assume that there are no other parallel tasks processing the queue. The items would be dequeued in the following order:
> 10, 20, 30

- *Case 2: Parallel dequeue task*

```
// Parallel Task 1
List<int> dequeue1;
using (var txn = this.StateManager.CreateTransaction())
{
    dequeue1.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false)).val;
    dequeue1.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false)).val;

    await txn.CommitAsync().ConfigureAwait(false);
}

// Parallel Task 2
List<int> dequeue2;
using (var txn = this.StateManager.CreateTransaction())
{
    dequeue2.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false)).val;
    dequeue2.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false)).val;

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Assume that there are no other parallel tasks processing the queue, and that Task 1 and Task 2 are running in parallel. The user can expect the order within a transaction would be maintained but there is no ordering for items across transactions. The lists dequeue1 and dequeue2 would be in any of the following orders:
> 10, 20

> 10, 30

> 10, 40

> 20, 30

> 20, 40

> 30, 40

The same element would *not* appear in both the lists. Hence, if the first list has 10, 30, the second list would have 20, 40.

- *Case 3: Dequeue ordering with Transaction abort*

Aborting a transaction with in-flight dequeues, puts the items back on the head of the queue. The order in which the items are put back on the head of the queue is not guaranteed. Let us look at the following code:

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    // Abort the transaction
    await txn.AbortAsync().ConfigureAwait(false);
}
```
Assume that the items were dequeued in the following order:
> 10, 20

When we abort the transaction, the items would be added back to the head of the queue. As the dequeue operations did not complete successfully, the items can be added back to the queue in any of the following orders:
> 10, 20

> 20, 10

The same is true for all case where the transaction was not successfully *Committed*.

## Programming patterns
In this section, let us look at a few programming patterns that might be helpful in using the ReliableConcurrentQueue.

##### Batch Dequeues
A recommended programming pattern is for the consumer task to batch its deueues instead of doing one dequeue at a time. The user can choose to throttle between every batch. The following code snippet shows this programming model.

```
int batchSize = 5;
long delayMs = 100;

while(!cancellationToken.IsCancellationRequested)
{
    // Buffer for dequeued items
    List<int> processItems = new List<int>();

    using (var txn = this.StateManager.CreateTransaction())
    {
        ConditionalValue<int> ret;

        for(int i = 0; i < batchSize; ++i)
        {
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

            if (ret.HasValue)
            {
                // If an item was dequeued, add to the buffer for processing
                processItems.Add(ret.Value);
            }
            else
            {
                // else break the for loop
                break;
            }
        }

        await txn.CommitAsync().ConfigureAwait(false);
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }

    int delayFactor = batchSize - processItems.Count;
    await Task.Delay(TimeSpan.FromMilliseconds(delayMs * delayFactor), cancellationToken).ConfigureAwait(false);
}
```

##### Notification based processing
Another interesting programming pattern uses the Count api. Here, we can implement notification based processing for the queue. The queue Count can be used to throttle an enqueue or a dequeue task.

```
int threshold = 5;
long delayMs = 1000;

while(!cancellationToken.IsCancellationRequested)
{
    while (this.Queue.Count < threshold)
    {
        cancellationToken.ThrowIfCancellationRequested();

        // If the queue does not have the threshold number of items, delay the task and check again
        await Task.Delay(TimeSpan.FromMilliseconds(delayMs), cancellationToken).ConfigureAwait(false);
    }

    // If there are approximately threshold number of items, try and process the queue

    // Buffer for dequeued items
    List<int> processItems = new List<int>();

    using (var txn = this.StateManager.CreateTransaction())
    {
        ConditionalValue<int> ret;

        do
        {
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

            if (ret.HasValue)
            {
                // If an item was dequeued, add to the buffer for processing
                processItems.Add(ret.Value);
            }
        } while (processItems.Count < threshold && ret.HasValue);

        await txn.CommitAsync().ConfigureAwait(false);
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }
}
```

##### Best effort DrainQueueAsync
We cannot guarantee draining of queue due to the concurrent nature of the data structure. To implement a *DrainQueueAsync* Task, the user must wait for all parallel tasks processing the queue to be completed. As both committed enqueues and aborted dequeues adds items to the queue, all in-flight enqueues and dequeues should be completed. If the number of items is the queue is large, the user should choose to batch the dequeues. Once all the parallel tasks are completed, *DrainQueueAsync* can be implemented as follows:

```
int numItemsDequeued;
int batchSize = 5;

ConditionalValue ret;

do
{
    List<int> processItems = new List<int>();
    numItemsDequeued = 0;

    using (var txn = this.StateManager.CreateTransaction())
    {
        do
        {
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

            if(ret.HasValue)
            {
                // Buffer the dequeues
                processItems.Add(ret.Value);
                ++numItemsDequeued;
            }
        } while (ret.HasValue && numItemsDequeued < batchSize);

        await txn.CommitAsync().ConfigureAwait(false);
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }
} while (ret.HasValue);
```

##### TryPeekAsync
ReliableConcurrentQueue does not support the *TryPeekAsync* api. The users can get the same behavior by using a *TryDequeueAsync* and then aborting the transaction. Let us look at a code snippet for the same. In this example, we would process dequeues only if the item's value is greater than 10;

```
bool valueProcessed = false;

using (var txn = this.StateManager.CreateTransaction())
{
    ret = await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    if (ret.HasValue)
    {
        if (ret.Value > 10)
        {
            // Process the item
            Console.WriteLine("Value : " + ret.Value);
            valueProcessed = true;
        }
    }

    if (valueProcessed)
    {
        await txn.CommitAsync().ConfigureAwait(false);    
    }
    else
    {
        await txn.AbortAsync().ConfigureAwait(false);
    }
}
```

## Must Read
* [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
* [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
* [Reliable Services notifications](service-fabric-reliable-services-notifications.md)
* [Reliable Services backup and restore (disaster recovery)](service-fabric-reliable-services-backup-restore.md)
* [Reliable State Manager configuration](service-fabric-reliable-services-configuration.md)
* [Getting started with Service Fabric Web API services](service-fabric-reliable-services-communication-webapi.md)
* [Advanced usage of the Reliable Services programming model](service-fabric-reliable-services-advanced-usage.md)
* [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)
