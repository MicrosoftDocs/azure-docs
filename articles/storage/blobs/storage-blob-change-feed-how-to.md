---
title: Process change feed in Azure Blob Storage
titleSuffix: Azure Storage
description: Learn how to process change feed transaction logs in a .NET client application using the Blobs Change Feed client library.
author: normesta

ms.author: normesta
ms.date: 06/06/2024
ms.topic: article
ms.service: azure-blob-storage
ms.reviewer: sadodd
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Process change feed in Azure Blob Storage

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to read change feed records by using the blob change feed processor library.

To learn more about the change feed, see [Change feed in Azure Blob Storage](storage-blob-change-feed.md).

## Set up your project

This section walks you through preparing a project to work with the Blobs Change Feed client library for .NET.

### Install packages

From your project directory, install the package for the [Azure Storage Blobs Change Feed client library for .NET](/dotnet/api/overview/azure/storage.blobs.changefeed-readme) using the `dotnet add package` command. In this example, we add the `--prerelease` flag to the command to install the latest preview version. 

```console
dotnet add package Azure.Storage.Blobs.ChangeFeed --prerelease
```

The code examples in this article also use the [Azure Blob Storage](/dotnet/api/azure.storage.blobs) and [Azure Identity](/dotnet/api/azure.identity) packages.

```console
dotnet add package Azure.Identity
dotnet add package Azure.Storage.Blobs
```

### Add `using` directives

Add the following `using` directives to your code file:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.ChangeFeed;
```

### Create a client object

To connect the application to Blob Storage, create an instance of the `BlobServiceClient` class. The following example shows how to create a client object using `DefaultAzureCredential` for authorization. To learn more, see [Authorize access and connect to Blob Storage](storage-blob-dotnet-get-started.md#authorize-access-and-connect-to-blob-storage). To work with the change feed, you need Azure RBAC built-in role **Storage Blob Data Reader** or higher.

```csharp
// TODO: Replace <storage-account-name> with the name of your storage account
string accountName = "<storage-account-name>";

BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());
```

The client object is passed as a parameter to some of the methods shown in this article.

## Read records in the change feed

> [!NOTE]
> The change feed is an immutable and read-only entity in your storage account. Any number of applications can read and process the change feed simultaneously and independently at their own convenience. Records aren't removed from the change feed when an application reads them. The read or iteration state of each consuming reader is independent and maintained by your application only.

The following code example iterates through all records in the change feed, adds them to a list, and then returns the list of change feed events:

```csharp
public async Task<List<BlobChangeFeedEvent>> ChangeFeedAsync(BlobServiceClient client)
{
    // Create a new BlobChangeFeedClient
    BlobChangeFeedClient changeFeedClient = client.GetChangeFeedClient();

    List<BlobChangeFeedEvent> changeFeedEvents = [];

    // Get all the events in the change feed
    await foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedClient.GetChangesAsync())
    {
        changeFeedEvents.Add(changeFeedEvent);
    }

    return changeFeedEvents;
}
```

The following code example prints some values from the list of change feed events:
```csharp
public void showEventData(List<BlobChangeFeedEvent> changeFeedEvents)
{
    foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedEvents)
    {
        string subject = changeFeedEvent.Subject;
        string eventType = changeFeedEvent.EventType.ToString();
        BlobOperationName operationName = changeFeedEvent.EventData.BlobOperationName;

        Console.WriteLine("Subject: " + subject + "\n" +
        "Event Type: " + eventType + "\n" +
        "Operation: " + operationName.ToString());
    }
}
```

## Resume reading records from a saved position

You can choose to save your read position in the change feed, and then resume iterating through the records at a future time. You can save the read position by getting the change feed cursor. The cursor is a **string** and your application can save that string in any way that makes sense for your application's design, for example, to a file or database.

This example iterates through all records in the change feed, adds them to a list, and saves the cursor. The list and the cursor are returned to the caller.

```csharp
public async Task<(string, List<BlobChangeFeedEvent>)> ChangeFeedResumeWithCursorAsync(
    BlobServiceClient client,
    string cursor)
{
    // Get a new change feed client
    BlobChangeFeedClient changeFeedClient = client.GetChangeFeedClient();
    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    IAsyncEnumerator<Page<BlobChangeFeedEvent>> enumerator = changeFeedClient
        .GetChangesAsync(continuationToken: cursor)
        .AsPages(pageSizeHint: 10)
        .GetAsyncEnumerator();

    await enumerator.MoveNextAsync();

    foreach (BlobChangeFeedEvent changeFeedEvent in enumerator.Current.Values)
    {

        changeFeedEvents.Add(changeFeedEvent);
    }

    // Update the change feed cursor. The cursor is not required to get each page of events,
    // it's intended to be saved and used to resume iterating at a later date.
    cursor = enumerator.Current.ContinuationToken;
    return (cursor, changeFeedEvents);
}
```

## Stream processing of records

You can choose to process change feed records as they're committed to the change feed. See [Specifications](storage-blob-change-feed.md#specifications). The change events are published to the change feed at a period of 60 seconds on average. We recommend that you poll for new changes with this period in mind when specifying your poll interval.

This example periodically polls for changes. If change records exist, this code processes those records and saves change feed cursor. That way if the process is stopped and then started again, the application can use the cursor to resume processing records where it last left off. This example saves the cursor to a local file for demonstration purposes, but your application can save it in any form that makes the most sense for your scenario.

```csharp
public async Task ChangeFeedStreamAsync(
    BlobServiceClient client,
    int waitTimeMs,
    string cursor)
{
    // Get a new change feed client
    BlobChangeFeedClient changeFeedClient = client.GetChangeFeedClient();

    while (true)
    {
        IAsyncEnumerator<Page<BlobChangeFeedEvent>> enumerator = changeFeedClient
        .GetChangesAsync(continuationToken: cursor).AsPages().GetAsyncEnumerator();

        while (true)
        {
            var result = await enumerator.MoveNextAsync();

            if (result)
            {
                foreach (BlobChangeFeedEvent changeFeedEvent in enumerator.Current.Values)
                {
                    string subject = changeFeedEvent.Subject;
                    string eventType = changeFeedEvent.EventType.ToString();
                    BlobOperationName operationName = changeFeedEvent.EventData.BlobOperationName;

                    Console.WriteLine("Subject: " + subject + "\n" +
                        "Event Type: " + eventType + "\n" +
                        "Operation: " + operationName.ToString());
                }

                // Helper method to save cursor
                SaveCursor(enumerator.Current.ContinuationToken);
            }
            else
            {
                break;
            }

        }
        await Task.Delay(waitTimeMs);
    }
}

void SaveCursor(string cursor)
{
    // Specify the path to the file where you want to save the cursor
    string filePath = "path/to/cursor.txt";

    // Write the cursor value to the file
    File.WriteAllText(filePath, cursor);
}
```

## Read records within a specific time range

You can read records that fall within a specific time range. This example iterates through all records in the change feed that fall within a specific date and time range, adds them to a list, and returns the list:

```csharp
async Task<List<BlobChangeFeedEvent>> ChangeFeedBetweenDatesAsync(BlobServiceClient client)
{
    // Get a new change feed client
    BlobChangeFeedClient changeFeedClient = client.GetChangeFeedClient();
    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    // Create the start and end time.  The change feed client will round start time down to
    // the nearest hour, and round endTime up to the next hour if you provide DateTimeOffsets
    // with minutes and seconds.
    DateTimeOffset startTime = new DateTimeOffset(2024, 3, 1, 0, 0, 0, TimeSpan.Zero);
    DateTimeOffset endTime = new DateTimeOffset(2024, 6, 1, 0, 0, 0, TimeSpan.Zero);

    // You can also provide just a start or end time.
    await foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedClient.GetChangesAsync(
        start: startTime,
        end: endTime))
    {
        changeFeedEvents.Add(changeFeedEvent);
    }

    return changeFeedEvents;
}
```

The start time that you provide is rounded down to the nearest hour and the end time is rounded up to the nearest hour. It's possible that users might see events that occurred before the start time and after the end time. It's also possible that some events that occur between the start and end time won't appear. That's because events might be recorded during the hour previous to the start time or during the hour after the end time.

## Next steps

- [Data protection overview](data-protection-overview.md)
- [Change feed in Azure Blob Storage](storage-blob-change-feed.md)
