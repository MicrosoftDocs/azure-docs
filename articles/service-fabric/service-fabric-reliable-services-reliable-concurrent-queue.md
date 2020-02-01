---
title: ReliableConcurrentQueue in Azure Service Fabric
description: ReliableConcurrentQueue is a high-throughput queue that allows parallel enqueues and dequeues.

ms.topic: conceptual
ms.date: 5/1/2017
---
# Introduction to ReliableConcurrentQueue in Azure Service Fabric
Reliable Concurrent Queue is an asynchronous, transactional, and replicated queue which features high concurrency for enqueue and dequeue operations. It is designed to deliver high throughput and low latency by relaxing the strict FIFO ordering provided by [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) and instead provides a best-effort ordering.

## APIs

|Concurrent Queue                |Reliable Concurrent Queue                                         |
|--------------------------------|------------------------------------------------------------------|
| void Enqueue(T item)           | Task EnqueueAsync(ITransaction tx, T item)                       |
| bool TryDequeue(out T result)  | Task< ConditionalValue < T > > TryDequeueAsync(ITransaction tx)  |
| int Count()                    | long Count()                                                     |

## Comparison with [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx)

Reliable Concurrent Queue is offered as an alternative to [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx). It should be used in cases where strict FIFO ordering is not required, as guaranteeing FIFO requires a tradeoff with concurrency.  [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) uses locks to enforce FIFO ordering, with at most one transaction allowed to enqueue and at most one transaction allowed to dequeue at a time. In comparison, Reliable Concurrent Queue relaxes the ordering constraint and allows any number concurrent transactions to interleave their enqueue and dequeue operations. Best-effort ordering is provided, however the relative ordering of two values in a Reliable Concurrent Queue can never be guaranteed.

Reliable Concurrent Queue provides higher throughput and lower latency than [Reliable Queue](https://msdn.microsoft.com/library/azure/dn971527.aspx) whenever there are multiple concurrent transactions performing enqueues and/or dequeues.

A sample use case for the ReliableConcurrentQueue is the [Message Queue](https://en.wikipedia.org/wiki/Message_queue) scenario. In this scenario, one or more message producers create and add items to the queue, and one or more message consumers pull messages from the queue and process them. Multiple producers and consumers can work independently, using concurrent transactions in order to process the queue.

## Usage Guidelines
* The queue expects that the items in the queue have a low retention period. That is, the items would not stay in the queue for a long time.
* The queue does not guarantee strict FIFO ordering.
* The queue does not read its own writes. If an item is enqueued within a transaction, it will not be visible to a dequeuer within the same transaction.
* Dequeues are not isolated from each other. If item *A* is dequeued in transaction *txnA*, even though *txnA* is not committed, item *A* would not be visible to a concurrent transaction *txnB*.  If *txnA* aborts, *A* will become visible to *txnB* immediately.
* *TryPeekAsync* behavior can be implemented by using a *TryDequeueAsync* and then aborting the transaction. An example of this behavior can be found in the Programming Patterns section.
* Count is non-transactional. It can be used to get an idea of the number of elements in the queue, but represents a point-in-time and cannot be relied upon.
* Expensive processing on the dequeued items should not be performed while the transaction is active, to avoid long-running transactions that may have a performance impact on the system.

## Code Snippets
Let us look at a few code snippets and their expected outputs. Exception handling is ignored in this section.

### Instantiation
Creating an instance of a Reliable Concurrent Queue is similar to any other Reliable Collection.

```csharp
IReliableConcurrentQueue<int> queue = await this.StateManager.GetOrAddAsync<IReliableConcurrentQueue<int>>("myQueue");
```

### EnqueueAsync
Here are a few code snippets for using EnqueueAsync followed by their expected outputs.

- *Case 1: Single Enqueue Task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 10, cancellationToken);
    await this.Queue.EnqueueAsync(txn, 20, cancellationToken);

    await txn.CommitAsync();
}
```

Assume that the task completed successfully, and that there were no concurrent transactions modifying the queue. The user can expect the queue to contain the items in any of the following orders:

> 10, 20
> 
> 20, 10


- *Case 2: Parallel Enqueue Task*

```
// Parallel Task 1
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 10, cancellationToken);
    await this.Queue.EnqueueAsync(txn, 20, cancellationToken);

    await txn.CommitAsync();
}

// Parallel Task 2
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.EnqueueAsync(txn, 30, cancellationToken);
    await this.Queue.EnqueueAsync(txn, 40, cancellationToken);

    await txn.CommitAsync();
}
```

Assume that the tasks completed successfully, that the tasks ran in parallel, and that there were no other concurrent transactions modifying the queue. No inference can be made about the order of items in the queue. For this code snippet, the items may appear in any of the 4! possible orderings.  The queue will attempt to keep the items in the original (enqueued) order, but may be forced to reorder them due to concurrent operations or faults.


### DequeueAsync
Here are a few code snippets for using TryDequeueAsync followed by the expected outputs. Assume that the queue is already populated with the following items in the queue:
> 10, 20, 30, 40, 50, 60

- *Case 1: Single Dequeue Task*

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken);
    await this.Queue.TryDequeueAsync(txn, cancellationToken);
    await this.Queue.TryDequeueAsync(txn, cancellationToken);

    await txn.CommitAsync();
}
```

Assume that the task completed successfully, and that there were no concurrent transactions modifying the queue. Since no inference can be made about the order of the items in the queue, any three of the items may be dequeued, in any order. The queue will attempt to keep the items in the original (enqueued) order, but may be forced to reorder them due to concurrent operations or faults.  

- *Case 2: Parallel Dequeue Task*

```
// Parallel Task 1
List<int> dequeue1;
using (var txn = this.StateManager.CreateTransaction())
{
    dequeue1.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken)).val;
    dequeue1.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken)).val;

    await txn.CommitAsync();
}

// Parallel Task 2
List<int> dequeue2;
using (var txn = this.StateManager.CreateTransaction())
{
    dequeue2.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken)).val;
    dequeue2.Add(await this.Queue.TryDequeueAsync(txn, cancellationToken)).val;

    await txn.CommitAsync();
}
```

Assume that the tasks completed successfully, that the tasks ran in parallel, and that there were no other concurrent transactions modifying the queue. Since no inference can be made about the order of the items in the queue, the lists *dequeue1* and *dequeue2* will each contain any two items, in any order.

The same item will *not* appear in both lists. Hence, if dequeue1 has *10*, *30*, then dequeue2 would have *20*, *40*.

- *Case 3: Dequeue Ordering With Transaction Abort*

Aborting a transaction with in-flight dequeues puts the items back on the head of the queue. The order in which the items are put back on the head of the queue is not guaranteed. Let us look at the following code:

```
using (var txn = this.StateManager.CreateTransaction())
{
    await this.Queue.TryDequeueAsync(txn, cancellationToken);
    await this.Queue.TryDequeueAsync(txn, cancellationToken);

    // Abort the transaction
    await txn.AbortAsync();
}
```
Assume that the items were dequeued in the following order:
> 10, 20

When we abort the transaction, the items would be added back to the head of the queue in any of the following orders:
> 10, 20
> 
> 20, 10

The same is true for all cases where the transaction was not successfully *Committed*.

## Programming Patterns
In this section, let us look at a few programming patterns that might be helpful in using ReliableConcurrentQueue.

### Batch Dequeues
A recommended programming pattern is for the consumer task to batch its dequeues instead of performing one dequeue at a time. The user can choose to throttle delays between every batch or the batch size. The following code snippet shows this programming model. Be aware, in this example, the processing is done after the transaction is committed, so if a fault were to occur while processing, the unprocessed items will be lost without having been processed.  Alternatively, the processing can be done within the transaction's scope, however it may have a negative impact on performance and requires handling of the items already processed.

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
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken);

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

        await txn.CommitAsync();
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }

    int delayFactor = batchSize - processItems.Count;
    await Task.Delay(TimeSpan.FromMilliseconds(delayMs * delayFactor), cancellationToken);
}
```

### Best-Effort Notification-Based Processing
Another interesting programming pattern uses the Count API. Here, we can implement best-effort notification-based processing for the queue. The queue Count can be used to throttle an enqueue or a dequeue task.  Note that as in the previous example, since the processing occurs outside the transaction, unprocessed items may be lost if a fault occurs during processing.

```
int threshold = 5;
long delayMs = 1000;

while(!cancellationToken.IsCancellationRequested)
{
    while (this.Queue.Count < threshold)
    {
        cancellationToken.ThrowIfCancellationRequested();

        // If the queue does not have the threshold number of items, delay the task and check again
        await Task.Delay(TimeSpan.FromMilliseconds(delayMs), cancellationToken);
    }

    // If there are approximately threshold number of items, try and process the queue

    // Buffer for dequeued items
    List<int> processItems = new List<int>();

    using (var txn = this.StateManager.CreateTransaction())
    {
        ConditionalValue<int> ret;

        do
        {
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken);

            if (ret.HasValue)
            {
                // If an item was dequeued, add to the buffer for processing
                processItems.Add(ret.Value);
            }
        } while (processItems.Count < threshold && ret.HasValue);

        await txn.CommitAsync();
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }
}
```

### Best-Effort Drain
A drain of the queue cannot be guaranteed due to the concurrent nature of the data structure.  It is possible that, even if no user operations on the queue are in-flight, a particular call to TryDequeueAsync may not return an item that was previously enqueued and committed.  The enqueued item is guaranteed to *eventually* become visible to dequeue, however without an out-of-band communication mechanism, an independent consumer cannot know that the queue has reached a steady-state even if all producers have been stopped and no new enqueue operations are allowed. Thus, the drain operation is best-effort as implemented below.

The user should stop all further producer and consumer tasks, and wait for any in-flight transactions to commit or abort, before attempting to drain the queue.  If the user knows the expected number of items in the queue, they can set up a notification that signals that all items have been dequeued.

```
int numItemsDequeued;
int batchSize = 5;

ConditionalValue ret;

do
{
    List<int> processItems = new List<int>();

    using (var txn = this.StateManager.CreateTransaction())
    {
        do
        {
            ret = await this.Queue.TryDequeueAsync(txn, cancellationToken);

            if(ret.HasValue)
            {
                // Buffer the dequeues
                processItems.Add(ret.Value);
            }
        } while (ret.HasValue && processItems.Count < batchSize);

        await txn.CommitAsync();
    }

    // Process the dequeues
    for (int i = 0; i < processItems.Count; ++i)
    {
        Console.WriteLine("Value : " + processItems[i]);
    }
} while (ret.HasValue);
```

### Peek
ReliableConcurrentQueue does not provide the *TryPeekAsync* api. Users can get the peek semantic by using a *TryDequeueAsync* and then aborting the transaction. In this example, dequeues are processed only if the item's value is greater than *10*.

```
using (var txn = this.StateManager.CreateTransaction())
{
    ConditionalValue ret = await this.Queue.TryDequeueAsync(txn, cancellationToken);
    bool valueProcessed = false;

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
        await txn.CommitAsync();    
    }
    else
    {
        await txn.AbortAsync();
    }
}
```

## Must Read
* [Reliable Services quickstart](service-fabric-reliable-services-quick-start.md)
* [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
* [Reliable Services notifications](service-fabric-reliable-services-notifications.md)
* [Reliable Services Backup and Restore (Disaster Recovery)](service-fabric-reliable-services-backup-restore.md)
* [Reliable State Manager Configuration](service-fabric-reliable-services-configuration.md)
* [Getting Started with Service Fabric Web API Services](service-fabric-reliable-services-communication-webapi.md)
* [Advanced Usage of the Reliable Services Programming Model](service-fabric-reliable-services-advanced-usage.md)
* [Developer Reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)
