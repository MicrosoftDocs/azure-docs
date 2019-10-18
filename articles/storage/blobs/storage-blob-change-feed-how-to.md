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

Change feed provides transaction logs of all the changes that occur to the blobs and the blob metadata in your storage account. This article shows you how to process the change feed and read the records that appear in transaction logs by using .NET. 

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

## Initialize the change feed

Explanation here.

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

The simplest way to iterate through a collection of records is to use the **ChangeFeedReader** class. This example iterates through all records. You can read records by using the **record** property of a **ChangeFeedRecord** object.
 
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

                Console.WriteLine("Subject: " + subject + "\n" +
               "Event Type: " + eventType + "\n");
        }

    } while (currentRecord != null);
}
```
<a id="read-change-record" />

## Read all records by using segments

The change feed organizes logs into **hourly** *segments*.  You can read records of changes that occur within specific ranges of time. This section shows you one way to read records from segments your application has not yet consumed.

### Get the starting segment

You can keep track of the last segment that your application consumed. To keep things simple, this example refers a Dictionary that stores a date and time offset of the last consumed segment. Your application might use a database or a file in Azure Blob storage.

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

### Read all records

This example creates a **ChangeFeedSegmentReader** class to iterate through records by time segment and print record values to the console.  

You can serialize the reader in case your application process is interrupted or closes unexpectedly. That way, you can restart your application process and initialize the reader to its previous state. This example serialized the reader for each segment that is processed. This example also stores the date and time offset of the last consumed segment. 

>[!NOTE]
> A segment can point to multiple log files. This pointer appears in segment file and is referred to as a *chunkFilePath* or *shard*. The system internally partitions records into multiple shards to manage publishing throughput. You can use the **ChangeFeedSegmentShardReader** class to iterate through records at the shard level if that's most efficient for your scenario. 

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
            // Save the reader state for resiliancy.
            ChangeFeedState["segmentReader"] = reader.SerializeState();

            currentRecord = await reader.GetNextItemAsync();

            if (currentRecord != null)
            {
                string subject = currentRecord.record["subject"].ToString();
                string eventType = ((GenericEnum)currentRecord.record["eventType"]).Value;

                Console.WriteLine("Subject: " + subject + "\n" +
               "Event Type: " + eventType + "\n");
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

## Next steps

Learn more about change feed logs. See [Change feed in Azure Blob Storage (Preview)](storage-blob-change-feed.md)
