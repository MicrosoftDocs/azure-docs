---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: storage
ms.topic: include
ms.date: 04/21/2023
ms.author: pauljewell
ms.custom: include file
---

## About downloading blobs

The client library methods covered in this article wrap the [Get Blob](/rest/api/storageservices/put-blob) operation. This operation reads or downloads a blob from Azure Storage, including its metadata and properties. To learn more about the `Get Blob` operation, including timeout parameters and error conditions, see [Get Blob remarks](/rest/api/storageservices/get-blob#remarks).

To maximize performance and reliability for download operations, it's important to be proactive in configuring client library transfer options based on the environment your app runs in. To learn more about considerations for tuning data transfer options, see [Performance tuning for uploads and downloads](../../articles/storage/blobs/storage-blobs-tune-upload-download.md).