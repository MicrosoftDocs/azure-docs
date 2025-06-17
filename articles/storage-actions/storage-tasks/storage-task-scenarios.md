---
title: Storage task scenarios
titleSuffix: Azure Storage Actions
description: Scenarios for using storage tasks
services: storage
author: normesta

ms.service: azure-storage-actions
ms.topic: conceptual
ms.date: 05/05/2025
ms.author: normesta

---

# Storage task scenarios

Large data lakes can have thousands of data sets with different object types that need various processing methods. Depending on their attributes, individual objects in a blob container might need specific retention or expiry periods, different tiering transitions, or tagging with different labels. With Azure Storage Actions, you can define tasks to scan billions of blobs, examining each one based on properties like file extension, naming pattern, index tags, blob metadata, or system properties such as creation time, content type, and blob tier. This approach simplifies many recurring or one-off use cases. This article describes scenarios where Storage Actions have been applied or could be applied.

## Managing retention and expiry with object tags

A financial services agency uses Azure Blob Storage to ingest customer service call recordings. These recordings have blob tags that indicate if a trading order was placed or account information was updated. The retention requirements for these recordings vary based on the call type. With Azure Storage Actions, they can now define a task that automatically manages the retention and expiry durations of the ingested recordings using a combination of blob tags and creation time.

## Managing data protection in datasets 

A leading travel services company uses blob versioning and snapshots, but their datasets have different protection needs. Sensitive data requires strict version history, while others don't. Keeping extensive version and snapshot history for all datasets is too expensive. With Azure Storage Actions, they can now use metadata and tags to manage the retention and lifecycle of versions and snapshots more flexibly.

## Cost optimization based on naming patterns and file types

Many Azure Storage customers need to manage the tiering, expiry, and retention of blobs based on path-prefix, naming conventions, or file type. These attributes can be combined with blob properties like size, creation time, last modified or accessed times, access tier, version counts, and more to process the objects as needed.

## One-off processing of blobs at scale

Azure Storage Actions can be used for one-time processing of billions of objects, in addition to ongoing data management operations. For example, you can define tasks to rehydrate a large dataset from the archive tier, reset tags on part of a dataset when restarting an analytic pipeline, initialize blob tags for a new or updated process, or clean up redundant and outdated datasets.

## See also

- [Storage task operations](storage-task-operations.md)
- [Define conditions and operations](storage-task-conditions-operations-edit.md)