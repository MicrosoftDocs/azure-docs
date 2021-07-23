---
title: Trigger an event when an archived blob is rehydrated 
titleSuffix: Azure Storage
description: Trigger an event when an archived blob is rehydrated.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/23/2021
ms.author: tamram
ms.subservice: blobs
---

# Trigger an event when an archived blob is rehydrated 

TBD

## About rehydration

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete.

## Configure Azure Event Grid to raise an event on blob rehydration

You can change the tier of a blob by calling one of the following operations:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier) changes the blob tier.
- [Copy Blob](/rest/api/storageservices/copy-blob)/[Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) can create a destination blob in a new tier.

The following table describes the events that are raised when you change the tier of a blob with one of these operations:

| Operation status | Set Blob Tier | Copy Blob or Copy Blob from URL |
|--|--|--|
| When operation initiates | Microsoft.Storage.AsyncOperationInitiated | Microsoft.Storage.AsyncOperationInitiated |
| When operation completes | Microsoft.Storage.BlobTierChanged | Microsoft.Storage.BlobCreated |

a blob is rehydrated

## See also

TBD
