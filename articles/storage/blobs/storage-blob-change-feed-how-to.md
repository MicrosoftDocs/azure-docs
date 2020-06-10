---
title: Process change feed in Azure Blob Storage (Preview) | Microsoft Docs
description: Learn how to process change feed logs in a .NET client application
author: normesta
ms.author: normesta
ms.date: 06/10/2020
ms.topic: article
ms.service: storage
ms.subservice: blobs
ms.reviewer: sadodd
---

# Process change feed in Azure Blob Storage (Preview)

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to read change feed records by using the blob change feed processor library.

To learn more about the change feed, see [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md).

> [!NOTE]
> The change feed is in public preview, and is available in the **westcentralus** and **westus2** regions. To learn more about this feature along with known issues and limitations, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md). The change feed processor library is subject to change between now and when this library becomes generally available.

## Get the blob change feed processor library

1. Open a command window (For example: Windows Powershell).
2. From your project directory, install the **Microsoft.Azure.Storage.Changefeed** NuGet package.

```console
dotnet add package Azure.Storage.Blobs.ChangeFeed --source https://azuresdkartifacts.blob.core.windows.net/azure-sdk-for-net/index.json --version 12.0.0-dev.20200604.2
```
## Read records

> [!NOTE]
> The change feed is an immutable and read-only entity in your storage account. Any number of applications can read and process the change feed simultaneously and independently at their own convenience. Records aren't removed from the change feed when an application reads them. The read or iteration state of each consuming reader is independent and maintained by your application only.

This example iterates through all records in the change feed, and then prints to the console a few values from each record. 
 
```csharp
public async Task ChangeFeedAsync(string connectionString)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();

    // Get all the events in the change feed. Print a few values to the console.
    await foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedClient.GetChangesAsync())
    {
        string subject = changeFeedEvent.Subject;
        string eventType = changeFeedEvent.EventType.ToString();
        string api = changeFeedEvent.EventData.Api;

        Console.WriteLine("Subject: " + subject + "\n" +
            "Event Type: " + eventType + "\n" +
            "Api: " + api);
    }
}
```

## Resume reading records from a saved position

You can choose to save your read position in your change feed and resume iterating the records at a future time. You can save the state of your iteration of the change feed at any time getting the change feed cursor. The cursor is a **string** and your application can save that state based on your application's design (For example: to a database or a file).

```csharp
public async Task<string> ChangeFeedResumeWithCursorAsync
    (string connectionString, string cursor)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();
    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    IAsyncEnumerator<Page<BlobChangeFeedEvent>> enumerator = changeFeedClient
        .GetChangesAsync(continuation: cursor)
        .AsPages(pageSizeHint: 10)
        .GetAsyncEnumerator();

    await enumerator.MoveNextAsync();

    foreach (BlobChangeFeedEvent changeFeedEvent in enumerator.Current.Values)
    {
        changeFeedEvents.Add(changeFeedEvent);
    }
    
    // Update the change feed cursor.  The cursor is not required to get each page of events,
    // it is intended to be saved and used to resume iterating at a later date.
    cursor = enumerator.Current.ContinuationToken;
    return cursor;
}
```

## Stream processing of records

You can choose to process change feed records as they arrive. See [Specifications](storage-blob-change-feed.md#specifications).

This example periodically polls for changes. If change records exist, those records are processed and the change feed cursor is saved.

```csharp
public async Task<string> ChangeFeedStreamAsync
    (string connectionString, int waitTimeMs, string cursor)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();

    while (true)
    {
        IAsyncEnumerator<Page<BlobChangeFeedEvent>> enumerator = changeFeedClient
            .GetChangesAsync(continuation: cursor)
            .AsPages(pageSizeHint: 10)
            .GetAsyncEnumerator();

        await enumerator.MoveNextAsync();

        if (enumerator.Current.Values != null) 
        {
            foreach (BlobChangeFeedEvent changeFeedEvent in enumerator.Current.Values)
            {
                string subject = changeFeedEvent.Subject;
                string eventType = changeFeedEvent.EventType.ToString();
                string api = changeFeedEvent.EventData.Api;

                Console.WriteLine("Subject: " + subject + "\n" +
                    "Event Type: " + eventType + "\n" +
                    "Api: " + api);
            }

            cursor = enumerator.Current.ContinuationToken;
        }

        await Task.Delay(waitTimeMs);
    }

}
```

## Reading records within a time range

You can read records from change feed segments that fall within a specific time range. This example iterates through all records in the change feed that fall between 3:00 PM on February 3 2017 and 2:00 AM on July 7th 2020.

### Selecting segments for a time range

```csharp
public async Task ChangeFeedBetweenDatesAsync(string connectionString)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();
    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    // Create the start and end time.  The change feed client will round start time down to
    // the nearest hour, and round endTime up to the next hour if you provide DateTimeOffsets
    // with minutes and seconds.
    DateTimeOffset startTime = new DateTimeOffset(2017, 3, 2, 15, 0, 0, TimeSpan.Zero);
    DateTimeOffset endTime = new DateTimeOffset(2020, 10, 7, 2, 0, 0, TimeSpan.Zero);

    // You can also provide just a start or end time.
    await foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedClient.GetChangesAsync(
        start: startTime,
        end: endTime))
    {
        changeFeedEvents.Add(changeFeedEvent);
    }
}
```

## Next steps

Learn more about change feed logs. See [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md)
