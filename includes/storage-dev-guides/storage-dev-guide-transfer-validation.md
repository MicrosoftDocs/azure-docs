---
title: "include file"
description: "include file"
services: storage
author: willmarkley
ms.service: azure-blob-storage
ms.topic: include
ms.date: 05/01/2026
ms.author: wmarkley
ms.custom: include file
---

Transfer validation with CRC64-NVME provides client-level data integrity for Azure Blob Storage, allowing you to verify that the data sent by your application is the same data stored and read from Azure. When enabled, the Blob SDK computes and validates CRC64-NVME checksums during upload and download operations, while the service independently computes and validates CRC64-NVME checksums for the data it receives and returns. Validation is performed on each request and across the full data stream, ensuring that the entire blob is verified even when data is transferred in partitions such as block uploads or ranged reads.  See [Structured Body Format](/rest/api/storageservices/structured-body-format) for more details.
