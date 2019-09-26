---
title: Process change feed logs in Azure Blob Storage | Microsoft Docs
description: Learn how to process change feed logs in a .NET client application
author: normesta
ms.author: normesta
ms.date: 09/18/2019
ms.topic: article
ms.service: storage
ms.subservice: blobs
---

# Process change feed logs in Azure Blob Storage

Change feed logs capture change event records for all changes that occur to the blobs and the blob metadata in your storage account.

This article shows you how to process a change feed log in a .NET client application.

To learn how to enable change feed logs, find them, and interpret their contents, see [Change feed logs in Azure Blob Storage](storage-blob-change-feed.md);

> [!NOTE]
> The change feed is in public preview, and is available in the **westcentralus** and **westus2** regions. To learn more about this feature along with known issues and limitations, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md).

## Enable the change feed

Put steps here.

## Install what you need

Put something here.

These examples use .NET and rely on [System.Json](https://www.nuget.org/packages/System.Json/) and [Apache.Avro](https://www.nuget.org/packages/Apache.Avro/) NuGet Package.  

After you install the appropriate NuGet packages, add these references to your code file.

```csharp

using System.Json;
using Avro.File;
using Avro.Generic;

```

## Determine the last consumable segment

 Start by reading the [segments.json](storage-blob-change-feed#segment-json) file to determine the last consumable segment. This file appears in the `$blobchangefeed/meta/` virtual directory. Segments that appear in the `$blobchangefeed/idx/segments/` virtual directory that are dated after the last consumable segment date are not finalized and should not be consumed by your application. 

```csharp
public async Task<string> GetLastConsumableSegment(CloudBlobClient cloudBlobClient)
{
    CloudBlobContainer container =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    CloudBlockBlob cloudBlockBlob =
        container.GetBlockBlobReference("meta/segments.json");

    Stream stream = await cloudBlockBlob.OpenReadAsync();

    using (StreamReader streamReader = new StreamReader(stream))
    {
        string line = await streamReader.ReadToEndAsync();
        JsonObject result = JsonValue.Parse(line) as JsonObject;

        return (string)result["lastConsumable"];
    }
}
```

## Read the segment files of interest to you

The `$blobchangefeed/idx/segments/` virtual directory contains a list (or *index*) of these [segment files](storage-blob-change-feed#segment-index) files. A *segment* represents 60 minutes worth of change events. This example reads the segment files that are dated after the last time this index was polled and before the last consumable date obtained in the previous snippet. 

This example uses the `chunkFilePaths` property to obtain the path to related log files, and then calls a helper method to read those log files. 


```csharp
public async Task ReadChangeFeedFromSpecifiedTimeTillEnd(CloudBlobClient cloudBlobClient, 
    DateTimeOffset lastChecked, DateTimeOffset lastConsumable)
{
    CloudBlobContainer container =
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    CloudBlobDirectory segmentDirectory = container.GetDirectoryReference("idx");

    BlobContinuationToken blobContinuationToken = null;

    do
    {
        var resultSegment = await segmentDirectory.ListBlobsSegmentedAsync
            (true, BlobListingDetails.All, null, blobContinuationToken, null, null);

        blobContinuationToken = resultSegment.ContinuationToken;

        foreach (CloudBlockBlob item in resultSegment.Results)
        {                  
            await item.FetchAttributesAsync();

            DateTimeOffset lastModified = (DateTimeOffset)item.Properties.LastModified;

            if ((lastChecked < lastModified) && (lastConsumable > lastModified))
            {
                CloudBlockBlob cloudBlockBlob =
                    container.GetBlockBlobReference(item.Name);

                Stream stream = await cloudBlockBlob.OpenReadAsync();

                using (StreamReader streamReader = new StreamReader(stream))
                {
                    string line = await streamReader.ReadToEndAsync();

                    JsonObject result = JsonValue.Parse(line) as JsonObject;

                    JsonArray chunkFilePaths = result["chunkFilePaths"] as JsonArray;

                    foreach (string filePath in chunkFilePaths)
                    {
                        await ParseChangeFeedLogChunk(cloudBlobClient, filePath);
                    }
                }
            }
                  
        }
    } while (blobContinuationToken != null);

}
```

## Open the log files and read change event records

A log file contains a series of change event records. These records are listed in the order in which they occurred. These records use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format. This example opens each log file and prints the url of each blob that was created within this time window.  

```csharp
public async Task ParseChangeFeedLogChunk(CloudBlobClient cloudBlobClient, string chunkFilePath)
{
    CloudBlobContainer container = 
        cloudBlobClient.GetContainerReference("$blobchangefeed");

    string blobPath = 
        chunkFilePath.Substring(("$blobchangefeed/").Count()) + "00000.avro";

    CloudAppendBlob cloudAppendBlob =
        container.GetAppendBlobReference(blobPath);

    Stream stream = await cloudAppendBlob.OpenReadAsync();

    var dataFileReader = DataFileReader<GenericRecord>.OpenReader(stream);

    object tempDataField;

    foreach (var record in dataFileReader.NextEntries)
    {
        record.TryGetValue("eventType", out tempDataField);

        if (((Avro.Generic.GenericEnum)tempDataField).Value == "BlobCreated")
        {
            record.TryGetValue("data", out tempDataField);

            Avro.Generic.GenericRecord dataRecord = (Avro.Generic.GenericRecord)tempDataField;

            dataRecord.TryGetValue("url", out tempDataField);

            Console.WriteLine((string)tempDataField);
        }                  
    }
}

```

## Next steps

Learn more about change feed logs. See [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
Learn how to process events in real time. See [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)