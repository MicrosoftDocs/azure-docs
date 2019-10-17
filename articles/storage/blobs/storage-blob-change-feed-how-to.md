---
title: Process change feed logs in Azure Blob Storage (Preview) | Microsoft Docs
description: Learn how to process change feed logs in a .NET client application
author: normesta
ms.author: normesta
ms.date: 11/17/2019
ms.topic: article
ms.service: storage
ms.subservice: blobs
ms.reviewer: sadodd
---

# Process change feed logs in Azure Blob Storage (Preview)

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to process a change feed log in a .NET client application. 

To learn more about the change feed, see [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md).

> [!NOTE]
> The change feed is in public preview, and is available in the **westcentralus** and **westus2** regions. To learn more about this feature along with known issues and limitations, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md).
 
## Set up your project

Put instructions to install the change feed NuGet package here.

After you install the appropriate NuGet packages, add these references to your code file.

```csharp
using Avro.Generic;
using ChangeFeedClient;
```

## Connect to the storage account

First, parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

Then, create an object that represents Blob storage in your storage account by calling the [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method.

```cs
public bool GetBlobClient(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
{
    if (CloudStorageAccount.TryParse
        (storageConnectionString, out CloudStorageAccount storageAccount))
        {
            cloudBlobClient = storageAccount.CreateCloudBlobClient();

            return true;
        }
        else
        {
            return false;
        }
    }
}
```

## Read all records

The simplest way to read change feed records is to use the `ChangeFeedReader` class. This example iterates through all records. It calls a helper method named `printAvroRecordsToConsole` to print record values to the console. The code in that helper method appears in the next section. 
 
```csharp
public async Task ProcessRecords(CloudBlobClient cloudBlobClient)
{
    CloudBlobContainer changeFeedContainer =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    ChangeFeed changeFeed = new ChangeFeed(changeFeedContainer);
    await changeFeed.InitializeAsync();
    ChangeFeedReader processor = await changeFeed.CreateChangeFeedReaderAsync();

    ChangeFeedRecord currentRecord = null;
    do
    {
        currentRecord = await processor.GetNextItemAsync();
        if (currentRecord != null)
        {
            printAvroRecordsToConsole(currentRecord);
        }
    } while (currentRecord != null);
}

```
<a id="read-change-record" />

## Read a change feed record

This reads the values of a change feed record, and then prints those values to the console.

You can read those values by using the `record` property of a `ChangeFeedRecord` object.  TODO: Put more values in here. For example: string api = ((GenericEnum)((GenericRecord)currentRecord.record["data"])["api"]).Value;

```csharp
private void printAvroRecordsToConsole(ChangeFeedRecord currentRecord)
{
    string subject = currentRecord.record["subject"].ToString();
    string eventType = ((GenericEnum)currentRecord.record["eventType"]).Value;

    Console.WriteLine("Subject: " + subject + "\n" +
        "Event Type: " + eventType + "\n");
} 
```

## Read records in each segment

Use the `ChangeFeedSegmentReader` class to iterate through records by time segment.  This example iterates through all records by time segment and then calls a helper method named `printAvroRecordsToConsole` to print record values to the console. The code in that helper method appears in the [Read a change feed record](#read-change-record) section of this article.  

```csharp
public async Task ProcessSegments(CloudBlobClient cloudBlobClient)
{
    CloudBlobContainer changeFeedContainer =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    ChangeFeed changeFeed = new ChangeFeed(changeFeedContainer);
    await changeFeed.InitializeAsync();

    List<DateTimeOffset> segments = 
        (await changeFeed.ListAvailableSegmentTimesAsync()).ToList();
    DateTimeOffset initialSegment = segments[0];
    
    ChangeFeedSegment currentSegment = 
        new ChangeFeedSegment(segments[0], changeFeed);

    await currentSegment.InitializeAsync();

    while (currentSegment != null &&
            currentSegment.timeWindowStatus == ChangefeedSegmentStatus.Finalized &&
            currentSegment.startTime <= changeFeed.LastConsumable)
    {
        ChangeFeedSegmentReader reader = 
            await currentSegment.CreateChangeFeedSegmentReaderAsync();

        ChangeFeedRecord currentRecord = null;
        do
        {
            currentRecord = await reader.GetNextItemAsync();

            if (currentRecord != null)
            {
                printAvroRecordsToConsole(currentRecord);
            }
        } while (currentRecord != null);

        currentSegment = await currentSegment.GetNextSegmentAsync();
        if (currentSegment != null)
        {
            await currentSegment.InitializeAsync();
        }
    }
}
```

## Read records in each shard

A segment can point to multiple log files. This pointer, is referred to as a `chunkFilePath` or `shard`. The system internally partitions records into multiple shards to manage publishing throughput. You can use the `ChangeFeedSegmentShardReader` class to iterate through records at the shard level. 

This example iterates through all segments, and for each segment, reads all records in all shards. 

```csharp
public async Task ProcessShards(CloudBlobClient cloudBlobClient)
{
    CloudBlobContainer changeFeedContainer =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    ChangeFeed changeFeed = new ChangeFeed(changeFeedContainer);
    await changeFeed.InitializeAsync();

    List<DateTimeOffset> segments = 
        (await changeFeed.ListAvailableSegmentTimesAsync()).ToList();
    DateTimeOffset initialSegment = segments[0];

    ChangeFeedSegment currentSegment = 
        new ChangeFeedSegment(segments[0], changeFeed);

    await currentSegment.InitializeAsync();

    while (currentSegment != null && 
            currentSegment.startTime <= changeFeed.LastConsumable)
    {
        List<ChangeFeedSegmentShard> shards = 
            currentSegment.GetChangeFeedSegmentShards().ToList();

        foreach (ChangeFeedSegmentShard shard in shards)
        {
            ChangeFeedSegmentShardReader reader = 
                await shard.CreateChangeFeedSegmentShardReaderAsync();

            ChangeFeedRecord currentRecord = null;

            do
            {
                currentRecord = await reader.GetNextItemAsync();

                if (currentRecord != null)
                {
                    printAvroRecordsToConsole(currentRecord);
                }
            } while (currentRecord != null);
        }

        currentSegment = await currentSegment.GetNextSegmentAsync();
        if (currentSegment != null)
        {
            await currentSegment.InitializeAsync();
        }
    }
}

```

## Read segments after a specific time

Your application can save the time offset of the last consumed segment, and then periodically poll the change feed for new records that have been added after that time period.

This example reads segments starting at a specific checkpoint (time offset). This example uses a helper method named  `IsSegmentConsumableAsync` to ensure that the segment is finalized and ready to be read. 

An alternative way to save a checkpoint is to serialize the reader by calling `SerializeState` method of the reader object. Then, you can instantiate the reader at a later time by using the serialize string. You can use any of these methods to do that:

- `ChangeFeedReader.CreateChangeFeedReaderFromPointerAsync`
- `ChangeFeedSegmentReader.CreateChangeFeedSegmentReaderFromPointerAsync`
- `ChangeFeedSegmentShardReader.CreateChangeFeedSegmentShardReaderFromPointerAsync`

```csharp
public async Task ProcessSegmentsWithCheckpoints(CloudBlobClient cloudBlobClient, 
    string currentSegmentTimestamp)
{
    CloudBlobContainer changeFeedContainer =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    ChangeFeed changeFeed = new ChangeFeed(changeFeedContainer);

    await changeFeed.InitializeAsync();

    DateTimeOffset dateTimeOffset;

    if (currentSegmentTimestamp != null)
    {
        dateTimeOffset = DateTimeOffset.Parse(currentSegmentTimestamp);
    }
    else
    {
        List<DateTimeOffset> segments =
            (await changeFeed.ListAvailableSegmentTimesAsync()).ToList();
        DateTimeOffset initialSegment = segments[0];
        dateTimeOffset = segments[0];
    }

    ChangeFeedSegment currentSegment = new ChangeFeedSegment(dateTimeOffset, changeFeed);         

    while (true)
    {
        await currentSegment.InitializeAsync();

        while (!await IsSegmentConsumableAsync(currentSegment, changeFeed)) 
        {
            await Task.Delay(60 * 1000);
        }

        ChangeFeedSegmentReader reader = await currentSegment.CreateChangeFeedSegmentReaderAsync(); 

        do
        {
            await reader.CheckForFinalizationAsync();

            ChangeFeedRecord currentRecord = null;

            do
            {
                currentRecord = await reader.GetNextItemAsync();

                if (currentRecord != null)
                {
                    printAvroRecordsToConsole(currentRecord);
                }
            } while (currentRecord != null);

        } while (currentSegment.timeWindowStatus != ChangefeedSegmentStatus.Finalized);

        currentSegment = await currentSegment.GetNextSegmentAsync();
    }

}

private async Task<bool> IsSegmentConsumableAsync(ChangeFeedSegment segment, 
    ChangeFeed changeFeed)
{
    if (changeFeed.LastConsumable >= segment.startTime)
    {
        return true;
    }
    await changeFeed.InitializeAsync();
    return changeFeed.LastConsumable >= segment.startTime;
}

```

## Next steps

Learn more about change feed logs. See [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
Learn how to process events in real time. See [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)