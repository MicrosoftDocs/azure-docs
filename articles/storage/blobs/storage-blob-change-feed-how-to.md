---
title: Process change feed logs in Azure Blob Storage | Microsoft Docs
description: Learn how to enable change feed logs, and then process them.
author: normesta
ms.author: normesta
ms.date: 09/18/2019
ms.topic: article
ms.service: storage
ms.subservice: blobs
---

# Process change feed logs in Azure Blob Storage

Quick intro + reference to conceptual article.

## Enable the change feed

The only way to do this is via the Portal or Azure CLI. Currently the portal work is in the backlog so there is no way to do this right now.

## Find the change feed logs

Located in a container named **$blobchangefeed**. This is created automatically when you enable change feed.
Change feed log files appear in the **$blobchangefeed/log** path.

## Process the change feed in an application

Put something here.
These examples use .NET and rely on [System.Json](https://www.nuget.org/packages/System.Json/) and [Apache.Avro](https://www.nuget.org/packages/Apache.Avro/) NuGet Package.  

After you install the appropriate NuGet packages, add these references to your code file.

```csharp

using System.Json;
using Avro.File;
using Avro.Generic;

```

Parse the index of segments. It is a json file. (need format). Use that file to determine which segment to examine.

```csharp
public async Task<string> ProcessIndexFile(CloudBlobClient cloudBlobClient)
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

Parse the segment file(s). This file describes a segment and points to an avro file.

```csharp
public async Task GetCreatedFiles(CloudBlobClient cloudBlobClient, 
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
                        await ParseAvroFile(cloudBlobClient, filePath);
                    }
                }
            }
                  
        }
    } while (blobContinuationToken != null);
}
```

Parse each avro file for information. Contents of this file conform to the Event Grid Change Event Schema.

```csharp
public async Task ParseAvroFile(CloudBlobClient cloudBlobClient, string chunkFilePath)
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

Learn more about Event Grid and give Blob storage events a try:

- [About Event Grid](../../event-grid/overview.md)
- [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)
