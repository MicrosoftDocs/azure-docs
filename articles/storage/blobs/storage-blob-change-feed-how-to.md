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

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to process the change feed, and read change feed records by using the blob change feed processor library that is provided with the SDK.

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

Create an instance of the **ChangeFeed** class by calling the **GetContainerReference** method. Pass in the name of the change feed container.

>[!NOTE]
> Add these statements to the top of your code file:
> - ``using Avro.Generic;``
> - ``using ChangeFeedClient;``

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

## Read all records

The simplest way to read change feed records is to create an instance of the **ChangeFeedReader** class. 

This example iterates through all records and prints some of the values of each record to the console. 
 
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
## Read all records by using segments

You can also read the change feed records of individual segments or ranges of segments. 

This section shows you one way to track segments that your application has previously read. That way, each time your application starts, it reads only those records not yet processed.

### Get the starting segment

You can keep track of the last segment that your application consumed. To keep things simple, this example refers to a [Dictionary](https://docs.microsoft.com/dotnet/api/system.collections.generic.dictionary-2) object that stores a date and time offset of the last consumed segment. Your application might use a database or a file in Azure Blob storage.

This example gets the next segment that needs to be processed. If no segments have yet been processed, this example returns the first segment in the change feed. 

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

This example creates a **ChangeFeedSegmentReader** class to iterate through the records in each time segment, and then print record values to the console.  

You can serialize the reader. That way, you can restart your application process, and initialize the reader to its previous state in the event that your application process is interrupted or closes unexpectedly. This example serialized the reader for each segment that is processed, and stores the date and time offset of the last consumed segment. 


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
