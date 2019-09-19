---
title: Change feed in Azure Blob Storage  | Microsoft Docs
description: Learn about change feed logs in Azure Blob Storage and how to use them.
author: normesta
ms.author: normesta
ms.date: 09/18/2019
ms.topic: conceptual
ms.service: storage
ms.subservice: blobs
---

# Change feed in Azure Blob Storage

Change feed logs record all changes that occur to the blobs and the blob metadata in your storage account. These logs are stored as blobs in your account. They are durable, immutable, and read-only, and you can manage their lifetime based on your requirements.

Unlike *Blob Storage events*, which enable your applications to react to changes in real-time, change feed logs provide an ordered log of records called *change event records*. You can use them at your convenience to audit changes over any period of time. Your applications can take action on objects that have changed, synchronize data with a cache, search engine or data warehouse, archive data to cold storage, or perform other derivative batch or analytic processing.

> [!NOTE]
> The change feed is in public preview, and is available in [these regions](#region-availability). To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this page](storage-blob-change-feed.md).

## Enable the change feed

You have to enable change feed logs to use them.

Show the steps for each of these here.

## Change feed files

The change feed creates several files, and you can find them in the **$blobchangefeed** container. This table describes each file.

| File    | Purpose    |
|--------|-----------|
| Index file | This file is named *segments.json* and there is only one of them. Use this file to determine the last consumable log file. |
| Segment files | A *segment* represents a 60-minute interval of event activity. Logs are divided into segments. Each segment contains a metadata file that ends with the suffix *meta.json*. This file contains a path to the associated change feed logs for that segment. |
| Log files |  A log file represents 60 minutes of event activity. Each file contains a series of event records. These records use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format. |

First, read the index metadata file to determine the last consumable segment. Then, read the meta file for each segment of interest. These files contain a path to each log file related to that segment. Read log files to iterate through all of the change event records.

There are several libraries available to process files that use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format. This article shows examples that use the [Apache.Avro](https://www.nuget.org/packages/Apache.Avro/) NuGet Package for .NET client applications.

## Index file

Need a good description here.

### Example

```json
{
    "version": 0,
    "lastConsumable": "2019-02-23T01:10:00.000Z",
    "storageDiagnostics": {
        "version": 0,
        "lastModifiedTime": "2019-02-23T02:24:00.556Z",
        "data": {
            "aid": "55e551e3-8006-0000-00da-ca346706bfe4",
            "lfz": "2019-02-22T19:10:00.000Z"
        }
    }
}

```

### Properties

The index file contains the following properties:

| Property | Description |
| -------- | ---- | ----------- |
| version |  Description |
| lastConsumable |  The date of the last segment that your application can consume. Segments that are dated beyond this date haven't been finalized and shouldn't be consumed by your application.  |
| storageDiagnostics | For internal use only and not designed for use by your application.|

### Code example

This example processes the index metadata file by using a .NET client application. This example uses the [System.Json](https://www.nuget.org/packages/System.Json/) NuGet package.

```csharp
using System.Json;

class Storage
{
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
}

```

## Segment files

Use segment files to process changes at specific time points, or between ranges of time points. A segment file describes the details of a segment, and points to one or more change feed logs.

### Example

```json
{
    "version": 0,
    "begin": "2019-02-22T18:10:00.000Z",
    "intervalSecs": 3600,
    "status": "Finalized",
    "config": {
        "version": 0,
        "configVersionEtag": "0x8d698f0fba563db",
        "numShards": 2,
        "recordsFormat": "avro",
        "formatSchemaVersion": 1,
        "shardDistFnVersion": 1
    },
    "chunkFilePaths": [
        "$blobchangefeed/log/00/2019/02/22/1810/",
        "$blobchangefeed/log/01/2019/02/22/1810/"
    ],
    "storageDiagnostics": {
        "version": 0,
        "lastModifiedTime": "2019-02-22T18:11:01.187Z",
        "data": {
            "aid": "55e507bf-8006-0000-00d9-ca346706b70c"
        }
    }
}

```

### Properties

The segment file contains the following properties.

| Property | Description |
| -------- |  ----------- |
| version |  Description |
| begin | The start time of the segment.  |
| intervalSecs |  The number of seconds captured by this segment. |
| status |  Description |
| config  |  Description |
| config.version |  Description |
| config.configVersionEtag |  Description |
| config.numShards |  The number of log files associated with this segment. |
| config.recordsFormat |  Always `avro`. |
| config.formatSchemaVersion |  Description |
| config.shardDistFnVersion |  Description |
| chunkFilePaths |  Paths to the change feed log files associated with the segment. |
| storageDiagnostics |  For internal use only and not designed for use by your application. |

### Code example

This example processes the segment metadata files by using a .NET client application. This example uses the [System.Json](https://www.nuget.org/packages/System.Json/) and [Apache.Avro](https://www.nuget.org/packages/Apache.Avro/) NuGet packages.

```csharp

using System.Json;
using Avro.File;
using Avro.Generic;

class Storage
{
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
}

```

## Log files

Change feed log files are stored as [append blobs](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs). Changes are batched and appended to change feed logs every 60 to 120 seconds.

Change event records use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format so the log file has the *.avro* file extension (For example: `00000.avro`).

Each log file contains a series of change event records. Those records are listed in the order in which events occurred.

### Example

```json
{
     "schemaVersion": 1,
     "topic": "/subscriptions/dd40261b-437d-43d0-86cf-ef222b78fd15/resourceGroups/sadodd/providers/Microsoft.Storage/storageAccounts/SADODD-DEV-09",
     "subject": "/blobServices/default/containers/apitestcontainerver/blobs/F_0003",
     "eventType": "BlobCreated",
     "eventTime": "2019-02-22T18:12:01.079Z",
     "id": "55e5531f-8006-0000-00da-ca3467000000",
     "data": {
         "api": "PutBlob",
         "clientRequestId": "edf598f4-e501-4750-a3ba-9752bb22df39",
         "requestId": "00000000-0000-0000-0000-000000000000",
         "etag": "0x8D698F13DCB47F6",
         "contentType": "application/octet-stream",
         "contentLength": 128,
         "blobType": "BlockBlob",
         "url": "",
         "sequencer": "000000000000000100000000000000060000000000006d8a",
         "storageDiagnostics": {
             "bid": "11cda41c-13d8-49c9-b7b6-bc55c41b3e75",
             "seq": "(6,5614,28042,28038)",
             "sid": "591651bd-8eb3-c864-1001-fcd187be3efd"
         }
  }
}

```

### Properties

For a description of each property, see [Azure Event Grid event schema for Blob storage](https://docs.microsoft.com/azure/event-grid/event-schema-blob-storage?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#event-properties).

You can skip records where the `eventType` has a value of `Control`. These are internal system records and don't reflect a change to objects in your account. You can also ignore values in the `storageDiagnonstics` property bag. That property bag is for internal use only and not designed for use by your application.

### Code example

This example processes the change feed log file by using a .NET client application. This examples uses the [System.Json](https://www.nuget.org/packages/System.Json/) and [Apache.Avro](https://www.nuget.org/packages/Apache.Avro/) NuGet packages.

```csharp
using System.Json;
using Avro.File;
using Avro.Generic;

class Storage
{
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
}

```

<a id="region-availability" />

## Region availability

Change feed logs are in public preview, and are available in the following regions:

|||||
|-|-|-|-|
|Central US|West Central US|Canada Central|
|East US|East Asia|North Europe|
|East US 2|Southeast Asia|West Europe|
|West US|Australia East|Japan East|
|West US 2|Brazil South||

## Next steps

Learn about how to react to events in real time. See [Reacting to Blob storage events](storage-blob-event-overview.md);
