---
title: Change feed pull model in Azure Cosmos DB
description: Learn how to use the Azure Cosmos DB change feed pull model to read the change feed. Understand the differences between the change feed pull model and the change feed processor.
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

You can use the change feed pull model to consume the Azure Cosmos DB change feed at your own pace. Similar to the [change feed processor](change-feed-processor.md), you can use the change feed pull model to parallelize the processing of changes across multiple change feed consumers.

## Compare to the change feed processor

Many scenarios can process the change feed by using either the [change feed processor](change-feed-processor.md) or the change feed pull model. The pull model's continuation tokens and the change feed processor's lease container both work as bookmarks for the last processed item or batch of items in the change feed.

However, you can't convert continuation tokens to a lease or vice versa.

> [!NOTE]
> In most cases, when you need to read from the change feed, the simplest option is to use the [change feed processor](change-feed-processor.md).

You should consider using the pull model in these scenarios:

- To read changes from a specific partition key.
- To control the pace at which your client receives changes for processing.
- To perform a one-time read of the existing data in the change feed (for example, to do a data migration).

Here are some key differences between the change feed processor and the change feed pull model:

|Feature  | Change feed processor| Change feed pull model |
| --- | --- | --- |
| Keeping track of the current point in processing the change feed | Lease (stored in an Azure Cosmos DB container) | Continuation token (stored in memory or manually persisted) |
| Ability to replay past changes | Yes, with push model | Yes, with pull model|
| Polling for future changes | Automatically checks for changes based on user-specified `WithPollInterval` value | Manual |
| Behavior where there are no new changes | Automatically wait the value for `WithPollInterval` and then recheck | Must check status and manually recheck |
| Process changes from an entire container | Yes, and automatically parallelized across multiple threads and machines that consume from the same container| Yes, and manually parallelized by using `FeedRange` |
| Process changes from only a single partition key | Not supported | Yes|

> [!NOTE]
> When you use the pull model, unlike when reading by using the change feed processor, you must explicitly handle cases where there are no new changes.

## Work with the pull model

### [.NET](#tab/dotnet)

To process the change feed by using the pull model, create an instance of `FeedIterator`. When you initially create `FeedIterator`, you must specify a required `ChangeFeedStartFrom` value, which consists of both the starting position for reading changes and the value you want to use for `FeedRange`. The `FeedRange` is a range of partition key values and specifies the items that can be read from the change feed by using that specific `FeedIterator`. You must also specify a required `ChangeFeedMode` value for the mode in which you want to process changes: [latest version](change-feed-modes.md#latest-version-change-feed-mode) or [all versions and deletes](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview). Use either `ChangeFeedMode.LatestVersion` or `ChangeFeedMode.AllVersionsAndDeletes` to indicate which mode you want to use to read the change feed. When you use all versions and deletes mode, you must select a change feed start from value of either `Now()` or from a specific continuation token.

You can optionally specify `ChangeFeedRequestOptions` to set a `PageSizeHint`. When set, this property sets the maximum number of items received per page. If operations in the monitored collection are performed through stored procedures, transaction scope is preserved when reading items from the change feed. As a result, the number of items received might be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch.

Here's an example of how to obtain `FeedIterator` in latest version mode that returns entity objects, in this case a `User` object:

```csharp
FeedIterator<User> InteratorWithPOCOS = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.LatestVersion);
```

> [!TIP]
> Prior to version `3.34.0`, latest version mode can be used by setting `ChangeFeedMode.Incremental`. Both `Incremental` and `LatestVersion` refer to latest version mode of the change feed and applications that use either mode will see the same behavior.

All versions and deletes mode is in preview and can be used with preview .NET SDK versions >= `3.32.0-preview`. Here's an example for obtaining `FeedIterator` in all versions and deletes mode that returns dynamic objects:

```csharp
FeedIterator<dynamic> InteratorWithDynamic = container.GetChangeFeedIterator<dynamic>(ChangeFeedStartFrom.Now(), ChangeFeedMode.AllVersionsAndDeletes);
```

> [!NOTE]
> In latest version mode, you receive objects that represent the item that changed, with some [extra metadata](change-feed-modes.md#parse-the-response-object). All versions and deletes mode returns a different data model. For more information, see [Parse the response object](change-feed-modes.md#parse-the-response-object-1).

### Consume the change feed via streams

`FeedIterator` for both change feed modes has two options. In addition to the examples that return entity objects, you can also obtain the response with `Stream` support. Streams allow you to read data without having it first deserialized, so you save on client resources.

Here's an example of how to obtain `FeedIterator` in latest version mode that returns `Stream`:

```csharp
FeedIterator iteratorWithStreams = container.GetChangeFeedStreamIterator(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.LatestVersion);
```

### Consume the changes for an entire container

If you don't supply a `FeedRange` parameter to `FeedIterator`, you can process an entire container's change feed at your own pace. Here's an example, which starts reading all changes, starting at the current time by using latest version mode:

```csharp
FeedIterator<User> iteratorForTheEntireContainer = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Now(), ChangeFeedMode.LatestVersion);

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

Because the change feed is effectively an infinite list of items that encompass all future writes and updates, the value of `HasMoreResults` is always `true`. When you try to read the change feed and there are no new changes available, you receive a response with `NotModified` status. In the preceding example, it's handled by waiting five seconds before rechecking for changes.

### Consume the changes for a partition key

In some cases, you might want to process only the changes for a specific partition key. You can obtain `FeedIterator` for a specific partition key and process the changes the same way that you can for an entire container.

```csharp
FeedIterator<User> iteratorForPartitionKey = container.GetChangeFeedIterator<User>(
    ChangeFeedStartFrom.Beginning(FeedRange.FromPartitionKey(new PartitionKey("PartitionKeyValue")), ChangeFeedMode.LatestVersion));

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

### Use FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example that shows how to get a list of ranges for your container:

```csharp
IReadOnlyList<FeedRange> ranges = await container.GetFeedRangesAsync();
```

When you get a list of `FeedRange` values for your container, you get one `FeedRange` per [physical partition](../partitioning-overview.md#physical-partitions).

By using a `FeedRange`, you can create a `FeedIterator` to parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to obtain a `FeedIterator` for the entire container or a single partition key, you can use FeedRanges to obtain multiple FeedIterators, which can process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution might be:

- Using `FeedRange.ToJsonString` and distributing this string value. The consumers can use this value with `FeedRange.FromJsonString`.
- If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample that shows how to read from the beginning of the container's change feed by using two hypothetical separate machines that read in parallel:

Machine 1:

```csharp
FeedIterator<User> iteratorA = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[0]), ChangeFeedMode.LatestVersion);
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
FeedIterator<User> iteratorB = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(ranges[1]), ChangeFeedMode.LatestVersion);
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

### Save continuation tokens

You can save the position of your `FeedIterator` by obtaining the continuation token. A continuation token is a string value that keeps of track of your FeedIterator's last processed changes and allows the `FeedIterator` to resume at this point later. The continuation token, if specified, takes precedence over the start time and start from beginning values. The following code reads through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed.

```csharp
FeedIterator<User> iterator = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.LatestVersion);

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
FeedIterator<User> iteratorThatResumesFromLastPoint = container.GetChangeFeedIterator<User>(ChangeFeedStartFrom.ContinuationToken(continuation), ChangeFeedMode.LatestVersion);
```

When you're using latest version mode, the `FeedIterator` continuation token never expires as long as the Azure Cosmos DB container still exists. When you're using all versions and deletes mode, the `FeedIterator` continuation token is valid as long as the changes happened within the retention window for continuous backups.

### [Java](#tab/java)

To process the change feed by using the pull model, create an instance of `Iterator<FeedResponse<JsonNode>> responseIterator`. When you create `CosmosChangeFeedRequestOptions`, you must specify where to start reading the change feed from and pass the `FeedRange` parameter that you want to use. The `FeedRange` is a range of partition key values that specifies the items that can be read from the change feed.

If you want to read the change feed in [all versions and deletes mode](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview), you must also specify `allVersionsAndDeletes()` when you create the `CosmosChangeFeedRequestOptions`. All versions and deletes mode doesn't support processing the change feed from the beginning or from a point in time. You must either process changes from now or from a continuation token. All versions and deletes mode is in preview and is available in Java SDK version >= `4.42.0`.

### Consume the changes for an entire container

If you specify `FeedRange.forFullRange()`, you can process the change feed for an entire container at your own pace. You can optionally specify a value in `byPage()`. When set, this property sets the maximum number of items received per page.

>[!NOTE]
> All of the following code snippets are taken from a samples in GitHub. You can use the [latest version mode sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java) and the [all versions and deletes mode sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModelForAllVersionsAndDeletesMode.java).

Here's an example of how to obtain a `responseIterator` value in latest version mode:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=FeedResponseIterator)]

Here's an example of how to obtain a `responseIterator` in all versions and deletes mode:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModelForAllVersionsAndDeletesMode.java?name=FeedResponseIterator)]

We can then iterate over the results. Because the change feed is effectively an infinite list of items that encompasses all future writes and updates, the value of `responseIterator.hasNext()` is always `true`. Here's an example in latest version mode, which reads all changes, starting from the beginning. Each iteration persists a continuation token after it processes all events. It picks up from the last processed point in the change feed and is handled by using `createForProcessingFromContinuation`:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=AllFeedRanges)]

### Consume a partition key's changes

In some cases, you might want to process only the changes for a specific partition key. You can process the changes for a specific partition key the same way that you can for an entire container. Here's an example that uses latest version mode:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=PartitionKeyProcessing)]

### Use FeedRange for parallelization

In the [change feed processor](change-feed-processor.md), work is automatically spread across multiple consumers. In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example that uses latest version mode showing how to obtain a list of ranges for your container:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=GetFeedRanges)]

When you obtain of list of FeedRanges for your container, you get one `FeedRange` per [physical partition](../partitioning-overview.md#physical-partitions).

By using a `FeedRange`, you can parallelize the processing the change feed across multiple machines or threads. Unlike the previous example that showed how to process changes for the entire container or a single partition key, you can use FeedRanges to process the change feed in parallel.

In the case where you want to use FeedRanges, you need to have an orchestrator process that obtains FeedRanges and distributes them to those machines. This distribution might be:

- Using `FeedRange.toString()` and distributing this string value.
- If the distribution is in-process, passing the `FeedRange` object reference.

Here's a sample that uses latest version mode. It shows how to read from the beginning of the container's change feed by using two hypothetical separate machines that read in parallel:

Machine 1:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=Machine1)]

Machine 2:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeedpull/SampleChangeFeedPullModel.java?name=Machine2)]

### [JavaScript](#tab/JavaScript)

To process the change feed by using the pull model, create an instance of `ChangeFeedPullModelIterator`. When you initially create `ChangeFeedPullModelIterator`, you must specify a required `changeFeedStartFrom` value inside the `ChangeFeedIteratorOptions` which consists of both the starting position for reading changes and the resource(a partition key or a FeedRange) for which changes are to be fetched.
> [!NOTE]
> If no `changeFeedStartFrom` value is specified, then changefeed will be fetched for an entire container from Now().
> Currently, only [latest version](change-feed-modes.md#latest-version-change-feed-mode) is supported by JS SDK and is selected by default.

You can optionally use `maxItemCount` in `ChangeFeedIteratorOptions` to set the maximum number of items received per page.
Here's an example of how to obtain the iterator in latest version mode that returns entity objects:

```js
const options = {
    changeFeedStartFrom: ChangeFeedStartFrom.Now()
};

const iterator = container.items.getChangeFeedIterator(options);
```

### Consume the changes for an entire container

If you don't supply a `FeedRange` or `PartitionKey` parameter inside `ChangeFeedStartFrom`, you can process an entire container's change feed at your own pace. Here's an example, which starts reading all changes, starting at the current time: 

```js
async function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning()
};

const iterator = container.items.getChangeFeedIterator(options);

let timeout = 0;

while(iterator.hasMoreResults) {
    const response = await iterator.readNext();
    if (response.statusCode === StatusCodes.NotModified) {
        timeout = 5000;
    } 
    else {
        console.log("Result found", response.result);
        timeout = 0;
    }
    await waitFor(timeout);
}
```

Because the change feed is effectively an infinite list of items that encompass all future writes and updates, the value of `hasMoreResults` is always `true`. When you try to read the change feed and there are no new changes available, you receive a response with `NotModified` status. In the preceding example, it's handled by waiting five seconds before rechecking for changes.

### Consume the changes for a partition key

In some cases, you might want to process only the changes for a specific partition key. You can obtain iterator for a specific partition key and process the changes the same way that you can for an entire container.

```js
async function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning("partitionKeyValue")
};

const iterator = container.items.getChangeFeedIterator(options);

let timeout = 0;

while(iterator.hasMoreResults) {
    const response = await iterator.readNext();
    if (response.statusCode === StatusCodes.NotModified) {
        timeout = 5000;
    } 
    else {
        console.log("Result found", response.result);
        timeout = 0;
    }
    await waitFor(timeout);
}
```

### Use FeedRange for parallelization

In the change feed pull model, you can use the `FeedRange` to parallelize the processing of the change feed. A `FeedRange` represents a range of partition key values.

Here's an example that shows how to get a list of ranges for your container:

```js
const ranges = await container.getFeedRanges();
```

When you get a list of `FeedRange` values for your container, you get one `FeedRange` per [physical partition](../partitioning-overview.md#physical-partitions).

By using a `FeedRange`, you can create iterator to parallelize the processing of the change feed across multiple machines or threads. Unlike the previous example that showed how to obtain a changefeed iterator for the entire container or a single partition key, you can use FeedRanges to obtain multiple iterators, which can process the change feed in parallel.

Here's a sample that shows how to read from the beginning of the container's change feed by using two hypothetical separate machines that read in parallel:

Machine 1:

```js
async function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning(ranges[0])
};

const iterator = container.items.getChangeFeedIterator(options);

let timeout = 0;

while(iterator.hasMoreResults) {
    const response = await iterator.readNext();
    if (response.statusCode === StatusCodes.NotModified) {
        timeout = 5000;
    } 
    else {
        console.log("Result found", response.result);
        timeout = 0;
    }
    await waitFor(timeout);
}
```

Machine 2:

```js
async function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning(ranges[1])
};

const iterator = container.items.getChangeFeedIterator(options);

let timeout = 0;

while(iterator.hasMoreResults) {
    const response = await iterator.readNext();
    if (response.statusCode === StatusCodes.NotModified) {
        timeout = 5000;
    } 
    else {
        console.log("Result found", response.result);
        timeout = 0;
    }
    await waitFor(timeout);
}
```

### Save continuation tokens

You can save the position of your iterator by obtaining the continuation token. A continuation token is a string value that keeps of track of your changefeed iterator last processed changes and allows the iterator to resume at this point later. The continuation token, if specified, takes precedence over the start time and start from beginning values. The following code reads through the change feed since container creation. After no more changes are available, it will persist a continuation token so that change feed consumption can be later resumed.

```js
const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning()
};

const iterator = container.items.getChangeFeedIterator(options);

let timeout = 0;
let continuation = "";
while(iterator.hasMoreResults) {
    const response = await iterator.readNext();
    if (response.statusCode === StatusCodes.NotModified) {
        continuation = response.continuationToken;
        break;
    } 
    else {
        console.log("Result found", response.result);
    }
}

// For checking any new changes using the continuation token
const continuationOptions = {
    changeFeedStartFrom: ChangeFeedStartFrom(continuation)
}
const newIterator = container.items.getChangeFeedIterator(continuationOptions);
```
Continuation token never expires as long as the Azure Cosmos DB container still exists.

### Use AsyncIterator 

You can use the JavaScript Async Iterator to fetch the changefeed. Here is an example to use Async Iterator.

```js
async function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
const options = {
      changeFeedStartFrom: ChangeFeedStartFrom.Beginning()
};
let timeout = 0;

for await(const result of container.items.getChangeFeedIterator(options).getAsyncIterator()) {
    if (result.statusCode === StatusCodes.NotModified) {
      timeout = 5000;
    }
    else {
      console.log("Result found", result.result);
      timeout = 0;
    }
    await waitFor(timeout);
}
```
---

## Next steps

- [Overview of change feed](../change-feed.md)
- [Using the change feed processor](change-feed-processor.md)
- [Trigger Azure Functions](change-feed-functions.md)
