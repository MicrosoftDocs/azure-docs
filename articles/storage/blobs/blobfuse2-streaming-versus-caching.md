---
title: Streaming versus caching mode (BlobFuse)  
titleSuffix: Azure Storage
description: Learn about streaming and caching mode and choose which mode is most appropriate for your workload.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 01/26/2026

ms.custom: linux-related-content

# Customer intent: "As a developer using BlobFuse, I want to understand the differences between streaming and caching modes, so that I can choose the optimal mode for my workload's performance and storage requirements."
---

# Streaming versus caching mode for BlobFuse mounts

You can use BlobFuse to mount an Azure Blob Storage container in either _streaming mode_(block cache) or _caching mode_(file cache). This article describes each mode and helps you decide which mode is best suited for your workloads.

## Choosing between streaming and caching modes

In _streaming mode_, data is streamed in chunks (blocks) and served as it downloads. This mode is designed for workloads involving **large files**, such as AI/ML training datasets, genomic sequencing, and high performance computing (HPC) simulations. 

Use streaming mode for large files, as it supports streaming for both read and write operations. BlobFuse caches blocks of streaming files in memory. For smaller files that don't consist of blocks, the entire file is stored in memory. Caching mode is the alternative mode, which you should use for workloads that don't involve large files, where files are stored on disk in their entirety.

In _caching mode_, BlobFuse downloads the entire file from Azure Blob Storage into a **local cache directory** before making it available to the application. All subsequent reads and writes come from this local cache until the file is evicted or invalidated. If a file is created or modified, closing the file handle from the application triggers the upload of this file to the storage container. This mode is suitable for workloads with repeated reads of files or datasets that can fit on the local disk.

The following diagram helps you decide between these two modes when working with read-only workloads.

:::image type="content" source="media/blobfuse2-choose-data-transfer-mode/read-workload-decision-tree.png" alt-text="Diagram that helps you choose between block cache or file cache for read-only workloads." lightbox="media/blobfuse2-choose-data-transfer-mode/read-workload-decision-tree.png":::

The following diagram helps you decide between these two modes when working with read-write workloads.

:::image type="content" source="media/blobfuse2-choose-data-transfer-mode/read-write-workload-decision-tree.png" alt-text="Diagram that shows how to choose between block cache and file cache mode for read-write workloads." lightbox="media/blobfuse2-choose-data-transfer-mode/read-write-workload-decision-tree.png":::

## Next steps

- [Configure BlobFuse for streaming mode](blobfuse2-configure-streaming.md)
- [Configure BlobFuse for caching mode](blobfuse2-configure-caching.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
