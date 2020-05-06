---
title: Change feed pull model
description: Learn how to use the Azure Cosmos DB change feed pull model to read the change feed and the differences between the pull model and Change Feed Processor
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 05/06/2020
ms.reviewer: sngun
---

# Change feed pull model in Azure Cosmos DB

The change feed pull model is part of the [Azure Cosmos DB SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3). You can use the change feed pull model to parallelize processing of changes across multiple change feed consumers.

> [!NOTE]
> The change feed pull model is currently in [preview in the .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.9.0-preview) only. The preview is not yet available for other SDK versions.

## Using FeedTokens for parallelization

In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values. This range could match a complete physical partition, a smaller range, or a single partition key value.

Here's an example showing how to obtain a list of ranges for your container.

```csharp
IReadOnlyList<FeedRange> ranges = await container.GetFeedRangesAsync();
```

Using a `FeedRange`, you can then create a `FeedIterator` to parallelize the processing of change feed across multiple machines or threads. When you initially obtain a `FeedIterator`, you can specify an optional `StartTime` within the `ChangeFeedRequestOptions`. When left unspecified, the `StartTime` will be the current time.

The `FeedIterator` comes in two flavors. In addition to the examples below that return entity objects, you can also obtain the response with `Stream` support.

Here's an example for obtaining a `FeedIterator` that returns entity objects, in this case a `User` object:

```csharp
FeedIterator<User> iteratorWithPOCOS = container.GetChangeFeedIterator<User>();
```

Here's an example for obtaining a `FeedIterator` that returns a `Stream`:

```csharp
FeedIterator iteratorWithStreams = container.GetChangeFeedStreamIterator();
```

Here's a sample that shows reading an example `User` object from the beginning of the container's change feed using two hypothetical separate machines that are reading in parallel:

Machine 1:

```csharp
FeedIterator<User> iteratorA = container.GetChangeFeedIterator<Person>(ranges[0], new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});
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

## Saving FeedTokens

You can save the position of your `FeedIterator` by creating a continuation token. A continuation token is a string value that keeps of track of your FeedIterator's last processed changes. This allows the `FeedIterator` to resume at this point later. The following code will read through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed.

```csharp
FeedIterator<User> iterator = container.GetChangeFeedIterator<User>(ranges[0], new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});

string continuation = null;

while (iterator.HasMoreResults)
{
   FeedResponse<User> users = await iterator.ReadNextAsync();
   continuation = orders.ContinuationToken;

   foreach (User user in Users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}

// Some time later
FeedIterator<User> iteratorThatResumesFromLastPoint = container.GetChangeFeedIterator<User>(lastProcessedToken);
```

## Consuming an entire container

Sometimes you might not need any parallelization when reading the change feed. By creating a `FeedIterator` without any `FeedToken` input, you can read an entire container's change feed on one machine:

```csharp
FeedIterator<User> iteratorForTheEntireContainer= container.GetChangeFeedIterator(new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});

while (iteratorForTheEntireContainer.HasMoreResults)
{
   FeedResponse<User> users = await iteratorForTheEntireContainer.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

If you need to stop and resume reading from the entire container's change feed, you can obtain a continuation token from the `FeedIterator`, just as you can for a `FeedRange`.

## Consuming a partition key's changes

In some cases, you may only want to process a specific partition key's changes. You can obtain a `FeedIterator` for a specific partition key.

```csharp
FeedIterator<User> iteratorForThePartitionKey = container.GetChangeFeedIterator(new PartitionKey("myPartitionKeyValueToRead"), new ChangeFeedRequestOptions{StartTime = DateTime.MinValue});

while (iteratorForThePartitionKey.HasMoreResults)
{
   FeedResponse<User> users = await iteratorForThePartitionKey.ReadNextAsync();

   foreach (User user in users)
    {
        Console.WriteLine($"Detected change for user with id {user.id}");
    }
}
```

If you need to stop and resume reading from the change feed for a specific partition key, you can obtain a continuation token from the `FeedIterator`, just as you can for a `FeedRange`.

## Comparing with change feed processor

Many scenarios can process the change feed using either the [change feed processor](change-feed-processor.md) or the pull model. The pull model's continuation tokens and the change feed processor's lease container are both "bookmarks" for the last processed item (or batch of items) in the change feed.
However, you can't convert continuation tokens to a lease container (or vice versa).

You should consider using the pull model in these scenarios:

- You want to do a one-time read of the existing data in the change feed
- You only want to read changes from a particular partition key
- You don't want a push model and want to consume the change feed at your own pace

Here's some key differences between the change feed processor and pull model:

|  | Change feed processor| Pull model |
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