---
title: Change feed pull model
description: Learn how to use the Azure Cosmos DB change feed pull model to read the change feed and the differences between the pull model and Change Feed Processor
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 05/19/2020
ms.reviewer: sngun
---

# Change feed pull model in Azure Cosmos DB

With the change feed pull model, you can consume the Azure Cosmos DB change feed at your own pace. As you can already do with the [change feed processor](change-feed-processor.md), you can use the change feed pull model to parallelize the processing of changes across multiple change feed consumers.

> [!NOTE]
> The change feed pull model is currently in [preview in the Azure Cosmos DB .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.9.0-preview) only. The preview is not yet available for other SDK versions.

## Consuming an entire container's changes

You can create a `FeedIterator` to process the change feed using the pull model. When you initially create a `FeedIterator`, you can specify an optional `StartTime` within the `ChangeFeedRequestOptions`. When left unspecified, the `StartTime` will be the current time.

The `FeedIterator` comes in two flavors. In addition to the examples below that return entity objects, you can also obtain the response with `Stream` support. Streams allow you to read data without having it first deserialized, saving on client resources.

Here's an example for obtaining a `FeedIterator` that returns entity objects, in this case a `User` object:

```csharp
FeedIterator<User> iteratorWithPOCOS = container.GetChangeFeedIterator<User>();
```

Here's an example for obtaining a `FeedIterator` that returns a `Stream`:

```csharp
FeedIterator iteratorWithStreams = container.GetChangeFeedStreamIterator();
```

Using a `FeedIterator`, you can easily process an entire container's change feed at your own pace. Here's an example:

```csharp
FeedIterator<User> iteratorForTheEntireContainer= container.GetChangeFeedIterator<User>();

while (iteratorForTheEntireContainer.HasMoreResults)
{
   FeedResponse<User> users = await iteratorForTheEntireContainer.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

## Consuming a partition key's changes

In some cases, you may only want to process a specific partition key's changes. You can obtain a `FeedIterator` for a specific partition key and process the changes the same way that you can for an entire container.

```csharp
FeedIterator<User> iteratorForThePartitionKey = container.GetChangeFeedIterator<User>(new PartitionKey("myPartitionKeyValueToRead"));

while (iteratorForThePartitionKey.HasMoreResults)
{
   FeedResponse<User> users = await iteratorForThePartitionKey.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

## Using FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example showing how to obtain a list of ranges for your container:

```csharp
IReadOnlyList<FeedRange> ranges = await container.GetFeedRangesAsync();
```

When you obtain of list of FeedRanges for your container, you'll get one `FeedRange` per [physical partition](partition-data.md#physical-partitions).

Using a `FeedRange`, you can then create a `FeedIterator` to parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to obtain a single `FeedIterator` for the entire container, you can use the `FeedRange` to obtain multiple FeedIterators which can process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution could be:

* Using `FeedRange.ToJsonString` and distributing this string value. The consumers can use this value with `FeedRange.FromJsonString`
* If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample that shows how to read from the beginning of the container's change feed using two hypothetical separate machines that are reading in parallel:

Machine 1:

```csharp
FeedIterator<User> iteratorA = container.GetChangeFeedIterator<User>(ranges[0], new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});
while (iteratorA.HasMoreResults)
{
   FeedResponse<User> users = await iteratorA.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

Machine 2:

```csharp
FeedIterator<User> iteratorB = container.GetChangeFeedIterator<User>(ranges[1], new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});
while (iteratorB.HasMoreResults)
{
   FeedResponse<User> users = await iteratorB.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

## Saving continuation tokens

You can save the position of your `FeedIterator` by creating a continuation token. A continuation token is a string value that keeps of track of your FeedIterator's last processed changes. This allows the `FeedIterator` to resume at this point later. The following code will read through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed.

```csharp
FeedIterator<User> iterator = container.GetChangeFeedIterator<User>(ranges[0], new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});

string continuation = null;

while (iterator.HasMoreResults)
{
   FeedResponse<User> users = await iterator.ReadNextAsync();
   continuation = users.ContinuationToken;

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}

// Some time later
FeedIterator<User> iteratorThatResumesFromLastPoint = container.GetChangeFeedIterator<User>(continuation);
```

As long as the Cosmos container still exists, a FeedIterator's continuation token never expires.

## Comparing with change feed processor

Many scenarios can process the change feed using either the [change feed processor](change-feed-processor.md) or the pull model. The pull model's continuation tokens and the change feed processor's lease container are both "bookmarks" for the last processed item (or batch of items) in the change feed.
However, you can't convert continuation tokens to a lease container (or vice versa).

You should consider using the pull model in these scenarios:

- Reading changes from a particular partition key
- Controlling the pace at which your client receives changes for processing
- Doing a one-time read of the existing data in the change feed (for example, to do a data migration)

Here's some key differences between the change feed processor and pull model:

|Feature  | Change feed processor| Pull model |
| --- | --- | --- |
| Keeping track of current point in processing change feed | Lease (stored in an Azure Cosmos DB container) | Continuation token (stored in memory or manually persisted) |
| Ability to replay past changes | Yes, with push model | Yes, with pull model|
| Polling for future changes | Automatically checks for changes based on user-specified `WithPollInterval` | Manual |
| Process changes from entire container | Yes, and automatically parallelized across multiple threads/machine consuming from the same container| Yes, and manually parallelized using FeedTokens |
| Process changes from just a single partition key | Not supported | Yes|
| Support level | Generally available | Preview |

## Next steps

* [Overview of change feed](change-feed.md)
* [Using the change feed processor](change-feed-processor.md)
* [Trigger Azure Functions](change-feed-functions.md)