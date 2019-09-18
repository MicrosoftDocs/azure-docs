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

## Enabling change feed logs

The only way to do this is via the Portal or Azure CLI. Currently the portal work is in the backlog so there is no way to do this right now.

## Finding change feed logs

Located in a container named **$blobchangefeed**. This is created automatically when you enable change feed.
Change feed log files appear in the **$blobchangefeed/log** path.

## Understanding change feed logs

* Organized into segments. 60 minutes apart.
* Segment index file.
* Segment metadata files.
* Change event records. These are in [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format and are stored in Azure Storage Append Blobs in your account.

- Only the event information for the change is available in the Change Event Record, not the changed data.


The tracked change event records are stored as the ordered list of Blob Change Event records in the order ( per Blob key ) in which they were modified. The change event records are stored using Apache Avro file format in Azure Storage Append Blobs in the same Account in a special Change Feed container. 

Change records are segregated into hour long portions called ‘Segments’. There is an index maintained of the available hour Segments sorted by time order. You can use the ‘Segments’ to consume the changes at the time points. This capability allows changes from large collections to be incrementally and for required approximate time-ranges. Note that the Segment boundary timesamp is approximate and can contain change records with timestamps from the previous or next hour window with a bound of 15min.

Changes are batched and appened to the change feed at approximately 60-120 sec frequency. For more latency sensitive applications requiring reaction to events within a second, the sister feature of ‘change events’ can be used via EventGrid. Streaming applications can continously poll for newer changes in the feed based on this frequency.

Changes are available as records serialized using Apache Avro 1.8.2 file format persisted into AppendBlobs.

•	All Change Feed artifact files are stored in special container called $blobchangefeed under your Account. This will be created automatically when you enable Change Feed. The Account cannot delete or modify any Blob objects within this container. All objects are read-only in this special container (specification below).
•	Change Feed log files are placed under the $blobchangefeed/log path. Although you can list them and read them directly, for regular usage, you would go through the ‘Segment’ index described below.
•	Change Event Records are written in the log files using Apache Avro 1.8.2 file format specification and are stored in Azure Storage Append Blobs in your account.
•	The log files which contain the changes are segregated into hour long sections called Segments. The ‘Segment’ index is under the $blobchangefeed/idx path. You would use a Blob List API on this path to see the Segments available sorted by time.
•	The manifest file (meta.json) for each Segment has details of where the log files for Segment are located. Each Segment can have multiple log files ( due to internal Sharding ). So you have to consume all the log files in a Segment to process all the changes.
•	The ‘Segment’ index is under the $blobchangefeed/idx path. You would use a Blob List API on this path to see the Segments available sorted by time.

$blobchangefeed container
Name                                                                    Blob Type    Blob Tier      Length  Content Type    
----------------------------------------------------------------------  -----------  -----------  --------  ----------------
$blobchangefeed/idx/segments/1601/01/01/0000/meta.json                  BlockBlob                      584  application/json
$blobchangefeed/idx/segments/2019/02/22/1810/meta.json                  BlockBlob                      584  application/json
$blobchangefeed/idx/segments/2019/02/22/1910/meta.json                  BlockBlob                      584  application/json
$blobchangefeed/idx/segments/2019/02/23/0110/meta.json                  BlockBlob                      584  application/json
$blobchangefeed/idx/segments/2019/02/24/1210/meta.json                  BlockBlob                      585  application/json
$blobchangefeed/log/00/2019/02/22/1810/00000.avro                       AppendBlob                   12297  avro/binary     
$blobchangefeed/log/00/2019/02/22/1910/00000.avro                       AppendBlob                 1751255  avro/binary     
$blobchangefeed/log/00/2019/02/23/0110/00000.avro                       AppendBlob                 2517329  avro/binary     
$blobchangefeed/log/00/2019/02/24/1210/00000.avro                       AppendBlob                 2460321  avro/binary     
$blobchangefeed/log/01/2019/02/22/1810/00000.avro                       AppendBlob                    9072  avro/binary     
$blobchangefeed/log/01/2019/02/22/1910/00000.avro                       AppendBlob                 1774781  avro/binary     
$blobchangefeed/log/01/2019/02/23/0110/00000.avro                       AppendBlob                 2647207  avro/binary     
$blobchangefeed/log/01/2019/02/24/1210/00000.avro                       AppendBlob                 2507923  avro/binary     
$blobchangefeed/meta/segments.json                                      BlockBlob                      225  application/json
Order of Change Event Records
•	All changes are ordered by modification order per blob-key.
•	All changes in a prior Segment are ‘before’ any subsequent Segments
•	With an Segment’s log file, the changes will be in order of read ( per blob-key )
•	Due to Sharding, if there are multiple log files within a Segment, then each Sharded file will contain mutually-exclusive blob-keys (hash-distributed) and each file can be processed indepedently without violating order per blob-key
Segments
•	Log is arranged in Segments containing changes for the approximate hour. The ‘time’ is when the change happened (not when it was published)
•	Segment index is useful as means to start iteration or restrict the scope of consumption of change events
•	For each Segment there is a manifest metadata file which desribes the Segment and points to the location path in your account which contains the files which have the changes
•	The property-bag called ‘StorageDiagnostics’ is for internal use only and should not be relied upon by the customer. There is no gurantee or schema-contract on this property-bag.
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
•	Segments uses a concept of ‘finalization’. Segments which are beyond the indicated ‘LastConsumable’ should not be consumed (although visible in the index). This information is kept updated in the Segment.json file.
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
Change Event Record
•	This conforms to v1 schema
•	Is in Apache Avro 1.8.2 file format ( Avro files hold the schema and self-contained )
•	Schema elements are defined in EventGrid Change Event Schema
•	All records with ‘eventType’ as ‘Control’ should be IGNORED by the consumer. These are internal system records which do not refer to any real change. There may or may not be be a few records of ‘Control’ eventType within a log file.
•	The property-bag called ‘StorageDiagnostics’ is for internal use only and should not be relied upon by the customer. There is no gurantee or schema-contract on this property-bag.
•	Event Record Schema v1
•	Example
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



## Processing the change feed logs

Some explanation here for the general workflow. Then, link to the how to article.

## Pricing

–	Storage : Regular Azure Blob Storage prices apply to retain the Change Feed log files
–	Reading : Regular Blob API pricing for GetBlob and ListBlob are charged read from the change feed.
–	Change Tracking : There is a variable cost based on per-volume-of-change-events-tracked if change feed is enabled. ( cost : tbd )

## Questions

Question: For public preview, what regions and what opt-in process.
Question: Is this enabled for HNS accounts?
Question: Read-only and durable. Does this mean that you can't delete them?

## Next steps

Learn more about Event Grid and give Blob storage events a try:

- [About Event Grid](../../event-grid/overview.md)
- [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)
