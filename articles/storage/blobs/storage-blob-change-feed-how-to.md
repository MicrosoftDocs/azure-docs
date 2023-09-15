---
title: Process change feed in Azure Blob Storage
titleSuffix: Azure Storage
description: Learn how to process change feed logs in a .NET client application
author: normesta

ms.author: normesta
ms.date: 03/03/2022
ms.topic: article
ms.service: azure-blob-storage
ms.reviewer: sadodd
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Process change feed in Azure Blob Storage

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to read change feed records by using the blob change feed processor library.

To learn more about the change feed, see [Change feed in Azure Blob Storage](storage-blob-change-feed.md).

## Get the blob change feed processor library

1. Open a command window (For example: Windows PowerShell).
2. From your project directory, install the [**Azure.Storage.Blobs.Changefeed** NuGet package](https://www.nuget.org/packages/Azure.Storage.Blobs.ChangeFeed/).

```console
dotnet add package Azure.Storage.Blobs --version 12.5.1
dotnet add package Azure.Storage.Blobs.ChangeFeed --version 12.0.0-preview.4
```

## Read records

> [!NOTE]
> The change feed is an immutable and read-only entity in your storage account. Any number of applications can read and process the change feed simultaneously and independently at their own convenience. Records aren't removed from the change feed when an application reads them. The read or iteration state of each consuming reader is independent and maintained by your application only.

This example iterates through all records in the change feed, adds them to a list, and then returns that list to the caller.

```csharp
public async Task<List<BlobChangeFeedEvent>> ChangeFeedAsync(string connectionString)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();

    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    // Get all the events in the change feed. 
    await foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedClient.GetChangesAsync())
    {
        changeFeedEvents.Add(changeFeedEvent);
    }

    return changeFeedEvents;
}
```

This example prints to the console a few values from each record in the list.

```csharp
public void showEventData(List<BlobChangeFeedEvent> changeFeedEvents)
{
    foreach (BlobChangeFeedEvent changeFeedEvent in changeFeedEvents)
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

You can choose to save your read position in the change feed, and then resume iterating through the records at a future time. You can save the read position by getting the change feed cursor. The cursor is a **string** and your application can save that string in any way that makes sense for your application's design (For example: to a file, or database).

This example iterates through all records in the change feed, adds them to a list, and saves the cursor. The list and the cursor are returned to the caller.

```csharp
public async Task<(string, List<BlobChangeFeedEvent>)> ChangeFeedResumeWithCursorAsync
    (string connectionString,  string cursor)
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
    return (cursor, changeFeedEvents);
}
```

## Stream processing of records

You can choose to process change feed records as they are committed to the change feed. See [Specifications](storage-blob-change-feed.md#specifications). The change events are published to the change feed at a period of 60 seconds on average. We recommend that you poll for new changes with this period in mind when specifying your poll interval.

This example periodically polls for changes.  If change records exist, this code processes those records and saves change feed cursor. That way if the process is stopped and then started again, the application can use the cursor to resume processing records where it last left off. This example saves the cursor to a local application configuration file, but your application can save it in any form that makes the most sense for your scenario.

```csharp
public async Task ChangeFeedStreamAsync
    (string connectionString, int waitTimeMs, string cursor)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();

    while (true)
    {
        IAsyncEnumerator<Page<BlobChangeFeedEvent>> enumerator = changeFeedClient
        .GetChangesAsync(continuation: cursor).AsPages().GetAsyncEnumerator();

        while (true) 
        {
            var result = await enumerator.MoveNextAsync();

            if (result)
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

                // helper method to save cursor. 
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

public void SaveCursor(string cursor)
{
    System.Configuration.Configuration config = 
        ConfigurationManager.OpenExeConfiguration
        (ConfigurationUserLevel.None);

    config.AppSettings.Settings.Clear();
    config.AppSettings.Settings.Add("Cursor", cursor);
    config.Save(ConfigurationSaveMode.Modified);
}
```

## Reading records within a time range

You can read records that fall within a specific time range. This example iterates through all records in the change feed that fall between 3:00 PM on March 2 2020 and 2:00 AM on August 7 2020, adds them to a list, and then returns that list to the caller.

### Selecting segments for a time range

```csharp
public async Task<List<BlobChangeFeedEvent>> ChangeFeedBetweenDatesAsync(string connectionString)
{
    // Get a new blob service client.
    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

    // Get a new change feed client.
    BlobChangeFeedClient changeFeedClient = blobServiceClient.GetChangeFeedClient();
    List<BlobChangeFeedEvent> changeFeedEvents = new List<BlobChangeFeedEvent>();

    // Create the start and end time.  The change feed client will round start time down to
    // the nearest hour, and round endTime up to the next hour if you provide DateTimeOffsets
    // with minutes and seconds.
    DateTimeOffset startTime = new DateTimeOffset(2020, 3, 2, 15, 0, 0, TimeSpan.Zero);
    DateTimeOffset endTime = new DateTimeOffset(2020, 8, 7, 2, 0, 0, TimeSpan.Zero);

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
