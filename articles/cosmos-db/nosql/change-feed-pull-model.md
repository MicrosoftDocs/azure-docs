---
title: Change feed pull model
description: Learn how to use the Azure Cosmos DB change feed pull model to read the change feed and the differences between the pull model and Change Feed Processor
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: conceptual
ms.date: 05/10/2023
ms.custom: devx-track-java, build-2023
---

# Change feed pull model in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

With the change feed pull model, you can consume the Azure Cosmos DB change feed at your own pace. As you can also do with the [change feed processor](change-feed-processor.md), you can use the change feed pull model to parallelize the processing of changes across multiple change feed consumers.

## Comparing with change feed processor

Many scenarios can process the change feed using either the [change feed processor](change-feed-processor.md) or the pull model. The pull model's continuation tokens and the change feed processor's lease container are both "bookmarks" for the last processed item (or batch of items) in the change feed.

However, you can't convert continuation tokens to a lease (or vice versa).

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
| Behavior where there are no new changes | Automatically wait `WithPollInterval` and recheck | Must check status and manually recheck |
| Process changes from entire container | Yes, and automatically parallelized across multiple threads/machines consuming from the same container| Yes, and manually parallelized using FeedRange |
| Process changes from just a single partition key | Not supported | Yes|

> [!NOTE]
> Unlike when reading using the change feed processor, you must explicitly handle cases where there are no new changes. 

## Working with the pull model

### [.NET](#tab/dotnet)

To process the change feed using the pull model, create a `FeedIterator`. When you initially create a `FeedIterator`, you must specify a required `ChangeFeedStartFrom` value, which consists of both the starting position for reading changes and the desired `FeedRange`. The `FeedRange` is a range of partition key values and specifies the items that can be read from the change feed using that specific `FeedIterator`. You must also specify a required `ChangeFeedMode` value for the mode in which you want to process changes: [latest version](change-feed-modes.md#latest-version-change-feed-mode) or [all versions and deletes](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview). Use `ChangeFeedMode.Incremental` for reading the change feed in latest version mode or `ChangeFeedMode.LatestVersion` in the preview NuGet package. If you're reading the change feed in all versions and deletes mode, you must select a change feed start from value of either `Now()` or from a specific continuation token.

You can optionally specify `ChangeFeedRequestOptions` to set a `PageSizeHint`. When set, this property sets the maximum number of items received per page. If operations in the monitored collection are performed through stored procedures, transaction scope is preserved when reading items from the change feed. As a result, the number of items received could be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch.

Here's an example for obtaining a `FeedIterator` in latest version mode that returns entity objects, in this case a `User` object:

```csharp
FeedIterator<User> InteratorWithPOCOS = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.Incremental);
```

All versions and deletes mode is in preview and can be used with .NET SDK version >= `3.32.0-preview`. Here's an example for obtaining a `FeedIterator` in all versions and deletes mode that returns dynamic objects:

```csharp
FeedIterator<dynamic> InteratorWithDynamic = container.GetChangeFeedIterator<dynamic>(ChangeFeedStartFrom.Now(), ChangeFeedMode.AllVersionsAndDeletes);
```

> [!Note]
> In latest version mode, you will receive objects that represent the item that changed with some [extra metadata](change-feed-modes.md#parsing-the-response-object). All versions and deletes mode returns a different data model, and you can find more information [here](change-feed-modes.md#parsing-the-response-object-1).

### Consuming the change feed with streams

The `FeedIterator` for both change feed modes comes in two flavors. In addition to the examples that return entity objects, you can also obtain the response with `Stream` support. Streams allow you to read data without having it first deserialized, saving on client resources.

Here's an example for obtaining a `FeedIterator` in latest version mode that returns a `Stream`:

```csharp
FeedIterator iteratorWithStreams = container.GetChangeFeedStreamIterator(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.Incremental);
```

### Consuming an entire container's changes

If you don't supply a `FeedRange` to a `FeedIterator`, you can process an entire container's change feed at your own pace. Here's an example, which starts reading all changes starting at the current time using latest version mode:

```csharp
FeedIterator<User> iteratorForTheEntireContainer = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Now(), ChangeFeedMode.Incremental);

while (iteratorForTheEntireContainer.HasMoreResults)
{
    FeedResponse<User> response = await iteratorForTheEntireContainer.ReadNextAsync();

    if (response.StatusCode == HttpStatusCode.NotModified)
    {
        Console.WriteLine($"No new changes");
        await Task.Delay(TimeSpan.FromSeconds(5));
    }
    else 
    {
        foreach (User user in response)
        {
            Console.WriteLine($"Detected change for user with id {user.id}");
        }
    }
}
```

Because the change feed is effectively an infinite list of items encompassing all future writes and updates, the value of `HasMoreResults` is always true. When you try to read the change feed and there are no new changes available, you receive a response with `NotModified` status. In the above example, it's handled by waiting 5 seconds before rechecking for changes.

### Consuming a partition key's changes

In some cases, you may only want to process a specific partition key's changes. You can obtain a `FeedIterator` for a specific partition key and process the changes the same way that you can for an entire container.

```csharp
FeedIterator<User> iteratorForPartitionKey = container.GetChangeFeedIterator<User>(
    ChangeFeedStartFrom.Beginning(FeedRange.FromPartitionKey(new PartitionKey("PartitionKeyValue")), ChangeFeedMode.Incremental));

while (iteratorForThePartitionKey.HasMoreResults)
{
    FeedResponse<User> response = await iteratorForThePartitionKey.ReadNextAsync();

    if (response.StatusCode == HttpStatusCode.NotModified)
    {
        Console.WriteLine($"No new changes");
        await Task.Delay(TimeSpan.FromSeconds(5));
    }
    else
    {
        foreach (User user in response)
        {
            Console.WriteLine($"Detected change for user with id {user.id}");
        }
    }
}
```

### Using FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example showing how to obtain a list of ranges for your container:

```csharp
IReadOnlyList<FeedRange> ranges = await container.GetFeedRangesAsync();
```

When you obtain of list of FeedRanges for your container, you'll get one `FeedRange` per [physical partition](../partitioning-overview.md#physical-partitions).

Using a `FeedRange`, you can then create a `FeedIterator` to parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to obtain a `FeedIterator` for the entire container or a single partition key, you can use FeedRanges to obtain multiple FeedIterators, which can process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution could be:

* Using `FeedRange.ToJsonString` and distributing this string value. The consumers can use this value with `FeedRange.FromJsonString`.
* If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample that shows how to read from the beginning of the container's change feed using two hypothetical separate machines that are reading in parallel:

Machine 1:

```csharp
FeedIterator<User> iteratorA = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[0]), ChangeFeedMode.Incremental);
while (iteratorA.HasMoreResults)
{
    FeedResponse<User> response = await iteratorA.ReadNextAsync();

    if (response.StatusCode == HttpStatusCode.NotModified)
    {
        Console.WriteLine($"No new changes");
        await Task.Delay(TimeSpan.FromSeconds(5));
    }
    else
    {
        foreach (User user in response)
        {
            Console.WriteLine($"Detected change for user with id {user.id}");
        }
    }
}
```

Machine 2:

```csharp
FeedIterator<User> iteratorB = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[1]), ChangeFeedMode.Incremental);
while (iteratorB.HasMoreResults)
{
    FeedResponse<User> response = await iteratorA.ReadNextAsync();

    if (response.StatusCode == HttpStatusCode.NotModified)
    {
        Console.WriteLine($"No new changes");
        await Task.Delay(TimeSpan.FromSeconds(5));
    }
    else
    {
        foreach (User user in response)
        {
            Console.WriteLine($"Detected change for user with id {user.id}");
        }
    }
}
```

### Saving continuation tokens

You can save the position of your `FeedIterator` by obtaining the continuation token. A continuation token is a string value that keeps of track of your FeedIterator's last processed changes and allows the `FeedIterator` to resume at this point later. The continuation token, if specified, takes precedence over the start time and start from beginning values. The following code reads through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed. 

```csharp
FeedIterator<User> iterator = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.Incremental);

string continuation = null;

while (iterator.HasMoreResults)
{
    FeedResponse<User> response = await iterator.ReadNextAsync();

    if (response.StatusCode == HttpStatusCode.NotModified)
    {
        Console.WriteLine($"No new changes");
        continuation = response.ContinuationToken;
        // Stop the consumption since there are no new changes
        break;
    }
    else
    {
        foreach (User user in response)
        {
            Console.WriteLine($"Detected change for user with id {user.id}");
        }
    }
}

// Some time later when I want to check changes again
FeedIterator<User> iteratorThatResumesFromLastPoint = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.ContinuationToken(continuation), ChangeFeedMode.Incremental);
```

As long as the Azure Cosmos DB container still exists, a FeedIterator's continuation token never expires.

### [Java](#tab/java)

To process the change feed using the pull model, create a `Iterator<FeedResponse<JsonNode>> responseIterator`. When creating `CosmosChangeFeedRequestOptions`, you must specify where to start reading the change feed from and pass the desired `FeedRange`. The `FeedRange` is a range of partition key values that specifies the items that can be read from the change feed. 

If you want to read the change feed in [all versions and deletes mode](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview), you must also specify `allVersionsAndDeletes()` when creating the `CosmosChangeFeedRequestOptions`. All versions and deletes mode doesn't support processing the change feed from the beginning or from a point in time. You must either process changes from now or from a continuation token. All versions and deletes mode is in preview and is available in Java SDK version >= `4.42.0`.

### Consuming an entire container's changes

If you specify `FeedRange.forFullRange()`, you can process an entire container's change feed at your own pace. You can optionally specify a value in `byPage()`. When set, this property sets the maximum number of items received per page.

>[!NOTE]
> All of the below code snippets are taken from a samples in GitHub. You can find the latest version mode sample [here](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java) and the all versions and deletes mode sample [here](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModelForAllVersionsAndDeletesMode.java).

Here is an example for obtaining a `responseIterator` in latest version mode:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=FeedResponseIterator)]

Here is an example for obtaining a `responseIterator` in all versions and deletes mode:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModelForAllVersionsAndDeletesMode.java?name=FeedResponseIterator)]

We can then iterate over the results. Because the change feed is effectively an infinite list of items encompassing all future writes and updates, the value of `responseIterator.hasNext()` is always true. Here is an example in latest version mode, which reads all changes starting from the beginning. Each iteration persists a continuation token after processing all events, and will pick up from the last processed point in the change feed. This is handled using `createForProcessingFromContinuation`:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=AllFeedRanges)]


### Consuming a partition key's changes

In some cases, you may only want to process a specific partition key's changes. You can process the changes for a specific partition key in the same way that you can for an entire container. Here's an example using latest version mode:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=PartitionKeyProcessing)]


### Using FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example using latest version mode showing how to obtain a list of ranges for your container:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=GetFeedRanges)]

When you obtain of list of FeedRanges for your container, you get one `FeedRange` per [physical partition](../partitioning-overview.md#physical-partitions).

Using a `FeedRange`, you can then parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to process changes for the entire container or a single partition key, you can use FeedRanges to process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution could be:

* Using `FeedRange.toString()` and distributing this string value. 
* If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample using latest version mode that shows how to read from the beginning of the container's change feed using two hypothetical separate machines that are reading in parallel:

Machine 1:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=Machine1)]

Machine 2:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=Machine2)]

---

## Next steps

* [Overview of change feed](../change-feed.md)
* [Using the change feed processor](change-feed-processor.md)
* [Trigger Azure Functions](change-feed-functions.md)
