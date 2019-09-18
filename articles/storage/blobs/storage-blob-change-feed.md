---
title: Change feed logs in Azure Blob Storage  | Microsoft Docs
description: Learn about change feed logs in Azure Blob Storage and how to use them.
author: normesta
ms.author: normesta
ms.date: 09/18/2019
ms.topic: conceptual
ms.service: storage
ms.subservice: blobs
---

# Change feed logs in Azure Blob Storage

Change feed logs capture change event records for all changes that occur to the blobs and the blob metadata in your storage account. The logs that contain these records are stored as blobs in your account. They are durable, immutable and read-only, and you can manage their lifetime based on your requirements.

Unlike change events which enable your applications to react to real-time changes, change feed logs provide an ordered log of change event records. You can use them at your convenience to audit changes over any period of time. Your applications can take action on objects that have changed, synchronize data with a cache, search engine or data warehouse, archive data to cold storage, or perform other derivative batch or analytic processing.

> [!NOTE]
> Change feed logs are in public preview, and are available in [these regions](#region-availability). To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this page](storage-blob-change-feed.md).

## Enabling change feed logs

Change feed logs aren't enabled by default. You can enable them by using the Azure portal, PowerShell, or the Azure CLI.

Show the steps for each of these here.

## How change feed logs are organized

A change feed log contains a series of change event records. You can find those logs in a container named **$blobchangefeed**. Also in this container are several metadata files that you can use to identity which logs you are interested in processing. The following table describes each file that you'll find in the **$blobchangefeed** container.

| File    | Purpose    |
|--------|-----------|
| **Index metadata file** | This file is named *segments.json* and there is only one of them. Use the data in this file to help you decide which logs you're interested in processing |
| **Segment metadata file** | A *segment* represents a 60 minute interval of event activity. Logs are divided into segments for easier processing. Each segment contains a metadata file ending with the suffix *meta.json*. This file contains a path to the associated change feed log for that segment. |
| **Change feed log(s)** |  One or more log files that represent 60 minutes of event activity. log files contain a series of change event records. These records use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format. |

Put an image here of a directory that contains these files....

Start by processing the index metadata file. Then, for each segment you're interested in, read the segment metadata file to obtain the path to the change feed log. Obtain all of the change event records in that segment by reading the associated change feed logs. To see an example of doing this by using in a .NET client application, see [Process change feed logs in Azure Blob Storage](storage-blob-change-feed-how-to.md).

> [!NOTE]
> Changes are batched and appended to change feed logs every 60 - 120 seconds. If your application has to respond to changes immediately, use [Azure Storage events](storage-blob-event-overview.md) instead.

## Index metadata file

The index metadata file describes blah. Start by processing this file.

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

### File properties

The index file contains the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| version | string | Description |
| lastConsumable | string | The date of the last segment that your application can consume. Segments that are dated beyond this date haven't been finalized and shouldn't be consumed by your application.  |
| storageDiagnostics | string | Description |
| storageDiagnostics.version | string | Description |
| storageDiagnostics.lastModifiedTime  | string | The date that this metadata file was last updated. |
| storageDiagnostics.data | object | Description |
| Data | string | Description |
| Data.aid | string | Description |
| Data.lfz | string | Description |

## Segment metadata file

Use segment files to process changes at specific time points, or ranges of time points. A segment metadata file describes the details of a segment and points to one or more change feed logs that capture the change event records associated with the time segment.

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

### File properties

The index file contains the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| version | string | Description |
| begin | string | Description  |
| intervalSecs | string | Description |
| status | string | Description |
| config  | string | Description |
| config.version | object | Description |
| config.configVersionEtag | object | Description |
| config.numShards | object | Description |
| config.recordsFormat | object | Description |
| config.formatSchemaVersion | object | Description |
| config.shardDistFnVersion | object | Description |
| chunkFilePaths | string | Description |
| storageDiagnostics | string | For internal use only and not designed for use by your application. |

## Change feed log file

Change feed logs are stored as [append blobs](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs) that have the *.avro* file extension (For example: `00000.avro`).

Each log file contains a series of change event records listed in the order in which events occurred. Change event records use the [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format.

Each change event record captures only information about the event and do not capture details about specific data that was changed. For example, if a word document was replaced by a newer version of that document, the change event record would not capture the specific changes that were made to the document.

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

### File properties

To view the complete schema along with field descriptions here: [Azure Event Grid event schema for Blob storage](https://docs.microsoft.com/azure/event-grid/event-schema-blob-storage?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#event-properties).

As you process change event records, disregard records where the `eventType` has a value of `Control`. These are internal system records and don't reflect a change to objects in your account. The `storageDiagnonstics` property bag is for internal use only and not designed for use by your application.

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

Learn more about Event Grid and give Blob storage events a try:

- [About Event Grid](../../event-grid/overview.md)
- [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)
