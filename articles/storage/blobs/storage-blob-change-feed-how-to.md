---
title: Process change feed logs in Azure Blob Storage (Preview) | Microsoft Docs
description: Learn how to process change feed logs in a .NET client application
author: normesta
ms.author: normesta
ms.date: 10/17/2019
ms.topic: article
ms.service: storage
ms.subservice: blobs
ms.reviewer: sadodd
---

# Process change feed logs in Azure Blob Storage (Preview)

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to read change feed records by using the blob change feed processor library that is provided with the SDK.

To learn more about the change feed, see [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md).

> [!NOTE]
> The change feed is in public preview, and is available in the **westcentralus** and **westus2** regions. To learn more about this feature along with known issues and limitations, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md).
 

## Connect to the storage account

Parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

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

## Initialize the change feed

Add the following using statements to the top of your code file.

```csharp
using Avro.Generic;
using ChangeFeedClient;
```

Then, create an instance of the **ChangeFeed** class by calling the **GetContainerReference** method. Pass in the name of the change feed container.

```csharp
public async Task<ChangeFeed> GetChangeFeed(CloudBlobClient cloudBlobClient)
{
    CloudBlobContainer changeFeedContainer =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    ChangeFeed changeFeed = new ChangeFeed(changeFeedContainer);
    await changeFeed.InitializeAsync();

    return changeFeed;
}
```

## Read records

The simplest way to read records is to create an instance of the **ChangeFeedReader** class. 

This example iterates through all records in the change feed, and then prints to the console a few values from each record. 
 
```csharp
public async Task ProcessRecords(ChangeFeed changeFeed)
{
    ChangeFeedReader processor = await changeFeed.CreateChangeFeedReaderAsync();

    ChangeFeedRecord currentRecord = null;
    do
    {
        currentRecord = await processor.GetNextItemAsync();

        if (currentRecord != null)
        {
            string subject = currentRecord.record["subject"].ToString();
            string eventType = ((GenericEnum)currentRecord.record["eventType"]).Value;
            string api = ((GenericEnum)((GenericRecord)currentRecord.record["data"])["api"]).Value;

            Console.WriteLine("Subject: " + subject + "\n" +
                "Event Type: " + eventType + "\n" +
                "Api: " + api);
        }

    } while (currentRecord != null);
}
```
## Read records by using segments

You can read records from individual segments or ranges of segments. Your application needs to track the date and time offset of the last processed segment. Later, your application can use that date and time offset to read only new segments.

### Get the starting segment

To keep things simple, this example refers to values in a [Dictionary](https://docs.microsoft.com/dotnet/api/system.collections.generic.dictionary-2) object to obtain the date and time offset of the last consumed segment. Your application might refer to a database or a file in Azure Blob storage.


```csharp
public async Task<ChangeFeedSegment> GetStartSegment(ChangeFeed changeFeed)
{
    // Retrieve the last segment processed from some sort of persistent storage.
    string dateTimeOffsetString = ChangeFeedState["dateTimeOffset"];

    if (dateTimeOffsetString != null)
    {
        ChangeFeedSegment lastConsumedChangeFeedSegment =
            new ChangeFeedSegment(DateTimeOffset.Parse
                (dateTimeOffsetString), changeFeed);

        // Return the next segment.
        return await lastConsumedChangeFeedSegment.GetNextSegmentAsync();
    }
    else
    {
        List<DateTimeOffset> segments =
            (await changeFeed.ListAvailableSegmentTimesAsync()).ToList();

        return new ChangeFeedSegment(segments[0], changeFeed);
    }          

}
```

### Read records from the starting segment 

This example creates a **ChangeFeedSegmentReader** class to iterate through the records in each time segment, and then print to the console a few values from each record. 

This example saves the date and time offset of each segment that is processed. It also serializes the reader. That way, if the application is interrupted or closes unexpectedly while a segment is being read, the reader can be initialized to it's previous state, and the application can finish reading the segment.  


```csharp
public async Task ProcessSegments(ChangeFeed changeFeed, ChangeFeedSegment currentSegment)
{
    await currentSegment.InitializeAsync();

    ChangeFeedSegmentReader reader = null;

    string readerPointer = ChangeFeedState["segmentReader"];

    if (readerPointer == null)
    {
        reader = await currentSegment.CreateChangeFeedSegmentReaderAsync();
    }
    else
    {
        // If process was interrupted. Restore the reader to its previous state.
        reader = await currentSegment.CreateChangeFeedSegmentReaderFromPointerAsync
            (readerPointer);
    }

    while (currentSegment != null &&
            currentSegment.timeWindowStatus == ChangefeedSegmentStatus.Finalized &&
            currentSegment.startTime <= changeFeed.LastConsumable)
    {
        ChangeFeedRecord currentRecord = null;
        do
        {
            // Save the reader state for resiliency.
            ChangeFeedState["segmentReader"] = reader.SerializeState();

            currentRecord = await reader.GetNextItemAsync();

            if (currentRecord != null)
            {
                string subject = currentRecord.record["subject"].ToString();
                string eventType = ((GenericEnum)currentRecord.record["eventType"]).Value;
                string api = ((GenericEnum)((GenericRecord)currentRecord.record["data"])["api"]).Value;

                Console.WriteLine("Subject: " + subject + "\n" +
                    "Event Type: " + eventType + "\n" +
                    "Api: " + api);
            }
        } while (currentRecord != null);

        // Reset time and reader state.
        ChangeFeedState["segmentReader"] = null;

        // Save this as the last processed segment.
        ChangeFeedState["dateTimeOffset"] = 
            currentSegment.startTime.ToString(CultureInfo.InvariantCulture);

        // Get next segment.
        currentSegment = await currentSegment.GetNextSegmentAsync();

        if (currentSegment != null)
        {
            await currentSegment.InitializeAsync();
            reader = await currentSegment.CreateChangeFeedSegmentReaderAsync();
        }
    }            
}
```

>[!TIP]
> A segment can point to multiple log files. This pointer appears in segment file and is referred to as a *chunkFilePath* or *shard*. The system internally partitions records into multiple shards to manage publishing throughput. You can use the **ChangeFeedSegmentShardReader** class to iterate through records at the shard level if that's most efficient for your scenario. 

## Next steps

Learn more about change feed logs. See [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md)
