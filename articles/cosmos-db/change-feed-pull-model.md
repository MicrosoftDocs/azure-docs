---
title: Change feed pull model
description: Learn how to use the Azure Cosmos DB change feed pull model to read the change feed and the differences between the pull model and Change Feed Processor
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 10/27/2020
ms.reviewer: sngun
---

# Change feed pull model in Azure Cosmos DB
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

With the change feed pull model, you can consume the Azure Cosmos DB change feed at your own pace. As you can already do with the [change feed processor](change-feed-processor.md), you can use the change feed pull model to parallelize the processing of changes across multiple change feed consumers.

> [!NOTE]
> The change feed pull model is currently in [preview in the Azure Cosmos DB .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.15.0-preview) only. The preview is not yet available for other SDK versions.

## Comparing with change feed processor

Many scenarios can process the change feed using either the [change feed processor](change-feed-processor.md) or the pull model. The pull model's continuation tokens and the change feed processor's lease container are both "bookmarks" for the last processed item (or batch of items) in the change feed.

However, you can't convert continuation tokens to a lease container (or vice versa).

> [!NOTE]
> In most cases when you need to read from the change feed, the simplest option is to use the [change feed processor](change-feed-processor.md).

You should consider using the pull model in these scenarios:

- Read changes from a particular partition key
- Control the pace at which your client receives changes for processing
- Perform a one-time read of the existing data in the change feed (for example, to do a data migration)

Here's some key differences between the change feed processor and pull model:

|Feature  | Change feed processor| Pull model |
| --- | --- | --- |
| Keeping track of current point in processing change feed | Lease (stored in an Azure Cosmos DB container) | Continuation token (stored in memory or manually persisted) |
| Ability to replay past changes | Yes, with push model | Yes, with pull model|
| Polling for future changes | Automatically checks for changes based on user-specified `WithPollInterval` | Manual |
| Behavior where there are no new changes | Automatically wait `WithPollInterval` and recheck | Must catch exception and manually recheck |
| Process changes from entire container | Yes, and automatically parallelized across multiple threads/machine consuming from the same container| Yes, and manually parallelized using FeedTokens |
| Process changes from just a single partition key | Not supported | Yes|
| Support level | Generally available | Preview |

> [!NOTE]
> Unlike when reading using the change feed processor, you must explicitly handle cases where there no are no new changes. 

## Consuming an entire container's changes

You can create a `FeedIterator` to process the change feed using the pull model. When you initially create a `FeedIterator`, you must specify a required `ChangeFeedStartFrom` value which consists of both the starting position for reading changes as well as the desired `FeedRange`. The `FeedRange` is a range of partition key values and specifies the items that will be read from the change feed using that specific `FeedIterator`.

You can optionally specify `ChangeFeedRequestOptions` to set a `PageSizeHint`. The `PageSizeHint` is the maximum number of items that will be returned in a single page.

The `FeedIterator` comes in two flavors. In addition to the examples below that return entity objects, you can also obtain the response with `Stream` support. Streams allow you to read data without having it first deserialized, saving on client resources.

Here's an example for obtaining a `FeedIterator` that returns entity objects, in this case a `User` object:

```csharp
FeedIterator<User> InteratorWithPOCOS = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning());
```

Here's an example for obtaining a `FeedIterator` that returns a `Stream`:

```csharp
FeedIterator iteratorWithStreams = container.GetChangeFeedStreamIterator<User>(ChangeFeedStartFrom.Beginning());
```

If you don't supply a `FeedRange` to a `FeedIterator`, you can process an entire container's change feed at your own pace. Here's an example which starts reading all changes starting at the current time:

```csharp
FeedIterator iteratorForTheEntireContainer = container.GetChangeFeedStreamIterator<User>(ChangeFeedStartFrom.Now());

while (iteratorForTheEntireContainer.HasMoreResults)
{
    try {
        FeedResponse<User> users = await iteratorForTheEntireContainer.ReadNextAsync();

        foreach (User user in users)
            {
                Console.WriteLine($"Detected change for user with id {user.id}");
            }
    }
    catch {
        Console.WriteLine($"No new changes");
        Thread.Sleep(5000);
    }
}
```

Because the change feed is effectively an infinite list of items encompassing all future writes and updates, the value of `HasMoreResults` is always true. When you try to read the change feed and there are no new changes available, you'll receive an exception. In the above example, the exception is handled by waiting 5 seconds before rechecking for changes.

## Consuming a partition key's changes

In some cases, you may only want to process a specific partition key's changes. You can obtain a `FeedIterator` for a specific partition key and process the changes the same way that you can for an entire container.

```csharp
FeedIterator<User> iteratorForPartitionKey = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(FeedRange.FromPartitionKey(new PartitionKey("PartitionKeyValue"))));

while (iteratorForThePartitionKey.HasMoreResults)
{
    try {
        FeedResponse<User> users = await iteratorForThePartitionKey.ReadNextAsync();

        foreach (User user in users)
            {
                Console.WriteLine($"Detected change for user with id {user.id}");
            }
    }
    catch {
        Console.WriteLine($"No new changes");
        Thread.Sleep(5000);
    }
}
```

## Using FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example showing how to obtain a list of ranges for your container:

```csharp
IReadOnlyList<FeedRange> ranges = await container.GetFeedRangesAsync();
```

When you obtain of list of FeedRanges for your container, you'll get one `FeedRange` per [physical partition](partitioning-overview.md#physical-partitions).

Using a `FeedRange`, you can then create a `FeedIterator` to parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to obtain a `FeedIterator` for the entire container or a single partition key, you can use FeedRanges to obtain multiple FeedIterators which can process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution could be:

* Using `FeedRange.ToJsonString` and distributing this string value. The consumers can use this value with `FeedRange.FromJsonString`
* If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample that shows how to read from the beginning of the container's change feed using two hypothetical separate machines that are reading in parallel:

Machine 1:

```csharp
FeedIterator<User> iteratorA = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[0]));
while (iteratorA.HasMoreResults)
{
    try {
        FeedResponse<User> users = await iteratorA.ReadNextAsync();

        foreach (User user in users)
            {
                Console.WriteLine($"Detected change for user with id {user.id}");
            }
    }
    catch {
        Console.WriteLine($"No new changes");
        Thread.Sleep(5000);
    }
}
```

Machine 2:

```csharp
FeedIterator<User> iteratorB = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[1]));
while (iteratorB.HasMoreResults)
{
    try {
        FeedResponse<User> users = await iteratorA.ReadNextAsync();

        foreach (User user in users)
            {
                Console.WriteLine($"Detected change for user with id {user.id}");
            }
    }
    catch {
        Console.WriteLine($"No new changes");
        Thread.Sleep(5000);
    }
}
```

## Saving continuation tokens

You can save the position of your `FeedIterator` by creating a continuation token. A continuation token is a string value that keeps of track of your FeedIterator's last processed changes. This allows the `FeedIterator` to resume at this point later. The following code will read through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed.

```csharp
FeedIterator<User> iterator = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning());

string continuation = null;

while (iterator.HasMoreResults)
{
   try { 
        FeedResponse<User> users = await iterator.ReadNextAsync();
        continuation = users.ContinuationToken;

        foreach (User user in users)
            {
                Console.WriteLine($"Detected change for user with id {user.id}");
            }
   }
    catch {
        Console.WriteLine($"No new changes");
        Thread.Sleep(5000);
    }   
}

// Some time later
FeedIterator<User> iteratorThatResumesFromLastPoint = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.ContinuationToken(continuation));
```

As long as the Cosmos container still exists, a FeedIterator's continuation token never expires.

## Next steps

* [Overview of change feed](change-feed.md)
* [Using the change feed processor](change-feed-processor.md)
* [Trigger Azure Functions](change-feed-functions.md)