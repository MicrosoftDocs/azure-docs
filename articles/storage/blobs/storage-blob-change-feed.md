---
title: Working with change feed support in Azure Blob Storage | Microsoft Docs
description: Work with the change feed and Azure Blob Storage 
author: normesta
ms.author: normesta
ms.date: 08/19/2019
ms.topic: conceptual
ms.service: storage
ms.subservice: blobs
---

# Change feed in Azure Blob Storage

Put introduction here.

Question: For public preview, what regions and what opt-in process.
Question: Is this enabled for HNS accounts?

## Scenarios

Put information here.

## Enabling the change feed

The only way to do this is via the Portal or Azure CLI. Currently the portal work is in the backlog so there is no way to do this right now.

## Finding the change feed logs

Located in a container named **$blobchangefeed**. This is created automatically when you enable change feed.
Change feed log files appear in the **$blobchangefeed/log** path.

## Understanding change feed logs

* Organized into segments. 60 minutes apart.
* Segment index file.
* Segment metadata files.
* Change event records. These are in [Apache Avro 1.8.2](https://avro.apache.org/docs/1.8.2/spec.html) format and are stored in Azure Storage Append Blobs in your account.

## Parsing the change feed

Put something here.

* Parse the index of segments. It is a json file. (need format). Use that file to determine which segment to examine.
* Parse the segment file(s). This file describes a segment and points to an avro file.
* Parse each avro file for information. Contents of this file conform to the Event Grid Change Event Schema.

## Next steps

Learn more about Event Grid and give Blob storage events a try:

- [About Event Grid](../../event-grid/overview.md)
- [Route Blob storage Events to a custom web endpoint](storage-blob-event-quickstart.md)
