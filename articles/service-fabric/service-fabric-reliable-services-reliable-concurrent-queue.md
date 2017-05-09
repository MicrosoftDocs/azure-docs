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
Reliable Concurrent Queue is an asynchronous queue which is transactional and replicated. The queue allows concurrent enqueuers and dequeuers to process the queue. The data structure is aimed to deliver high throughput by relaxing the strict FIFO constraint and offers a best-effort ordering for the items.

## Apis offered
|Concurrent Queue   |Reliable Concurrent Queue   |
|-------------------|----------------------------|
| void Enqueue(T item)  | Task EnqueueAsync(ITransaction tx, T item)  |
| bool TryDequeue(out T result)  | Task< ConditionalValue < T > > TryDequeueAsync(ITransaction tx)  |
| int Count()  | long Count()  |

## Comparison with [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx)

Reliable Concurrent Queue is offered as an alternative to [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) for use cases where strict FIFO ordering is not required, as guaranteeing FIFO requires a tradeoff with concurrency.  [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) uses a locks to enforce FIFO ordering, with at most one transaction allowed to enqueue and/or dequeue at a time.   On the other hand, Reliable Concurrent Queue relaxes the ordering constraint, and allows any number concurrent transactions to interleave their enqueue and dequeue operations.  Best-effort ordering is provided, however the relative ordering of two values in a Reliable Concurrent Queue can never be guaranteed.

Reliable Concurrent Queue provides higher throughput and lower latency than [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) whenever there are multiple concurrent transactions performing enqueues and/or dequeues.   

A good use case for the ReliableConcurrentQueue would be a [Messaging Queue](https://en.wikipedia.org/wiki/Message_queue) scenario. In this scenario, we have a message producer who will create a message and add it to the queue independent of a message consumer. The message consumer can then pull a message from the queue and process it. We can have multiple producers and consumers working independent of each other and hence need to allow concurrent transactions to process the queue.

## Usage Guidelines
* The queue expects that the items have a low retention period, i.e. the items would not stay in the queue for a long time.
* The queue does not guarantee strict FIFO ordering.
* The queue does not read its own writes. This means that if an item is enqueued in a transaction, that item would not be visible to the dequeue in that same transaction.
* Dequeues are not isolated from each other. If item *A* is dequeued in transaction *txnA*, even though *txnA* is not committed, item *A* would not be visible to a concurrent transaction *txnB*.
* *TryPeekAsync* behavior can be implemented by using a *TryDequeueAsync* and then aborting the transaction. A code snippet for the same can be found below.
* Count is non-transactional. It should be used to get an idea for the number of elements in the queue but does not guarantee the be the exact number of linked elements in the queue. Dequeues can be in flight which would decrease the count before the dequeue transaction is committed.
* Expensive processing on the dequeued items must be delayed for later in the interest of avoiding long running transactions.
* Currently we do not guarantee any ordering but would be providing Enqueue ordering within a transaction. Users must not reply their business logic on the order of items in the queue.

## Code Snippets
Let us look at a few code snippets and the expected outputs for the same. Please note that the exception handling is ignored in the following snippets.

##### - EnqueueAsync
Let us look at a few code snippets for using EnqueueAsync and the expected outputs for the same.

- *Case 1 : Single Enqueue task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 10, cancellationToken).ConfigureAwait(false);
    await this.Queue.EnqueueAsync(txn, 20, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Given that the task completed successfully and there are no parallel tasks processing the queue, the user can expect the queue to have the items in any of the following order.
> 10, 20

> 20, 10



- *Case 2 : Parallel enqueue task*

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

Given that there are no other parallel tasks processing the queue, and that Task 1 and Task 2 are running in parallel, no inference can be made about the order of items in the queue. For the above code snippet, the items may appear in any of the 4! order currently.


##### - DequeueAsync
Let us look at a few code snippets for using DequeueAsync and the expected outputs for the same. Assume that the queue is already populated with the following items in the queue :
> 10, 20, 30, 40, 50, 60

- *Case 1 : Single dequeue task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Assume that there are no other parallel tasks processing the queue. The items are expected to be dequeued in the order.
> 10, 20, 30

- *Case 2 : Parallel dequeue task*

```
// Parallel Task 1
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}

// Parallel Task 2
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    await txn.CommitAsync().ConfigureAwait(false);
}
```

Given that there are no other parallel tasks processing the queue, and that Task 1 and Task 2 are running in parallel, the user can assume that the order within a transaction would be maintained but there is no ordering for items across transactions. If the dequeued items are saved in a ConcurrentQueue, the user can expect to see any of the following orders.
> 10, 20, 30, 40

> 10, 30, 20, 40

> 10, 30, 40, 20

> 30, 10, 20, 40

> 30, 10, 40, 20

> 30, 40, 10, 20

- *Case 3 : Dequeue ordering with Transaction abort*

Aborting a transaction with in-flight dequeues, will put the items back on the head of the queue. The order in which the items are put back on the head of the queue is not guaranteed. Let us look at the code below. Assume that the queue has infinite items.

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);

    // Abort the transaction
    await txn.AbortAsync().ConfigureAwait(false);
}
```
Assume that the items were dequeued in the following order :
> 10, 20

When we abort the transaction, the items would be added back to the head of the queue. Now try to dequeue the items again.

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await this.Queue.TryDequeueAsync(txn, cancellationToken).ConfigureAwait(false);
    await txn.CommitAsync().ConfigureAwait(false);
}
```
The output in the second case, as the first transaction was *Aborted* can be any of the following:
> 10, 20

> 20, 10

The same is true for every case when the transaction was not successfully *Committed*.

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
Another interesting model is to do a notification based processing. The queue Count can be used to throttle the enqueue or the dequeue task. Note that this would be best effort notification as the Count is not transactional.

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

##### Best effort Drain Queue
We cannot guarantee draining of queue due to the concurrent nature of the data structure. To implement a Drain queue Task, the user needs to make sure that there are no parallel tasks processing the queue. This is important as both committed enqueue and aborted dequeues would add items to the queue. If the number of items is the queue is large, the user should choose to do batch dequeues. The user can choose to implement this by making sure all parallel tasks are finished and then using the code snippet below.

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
ReliableConcurrentQueue does not support the *TryPeekAsync* api. The users can get the same behavior by using a *TryDequeueAsync* and then aborting the transaction. Let us take a look the code snippet for the same. In this example, we would process a dequeue only if the item's value is greater than 10;

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
