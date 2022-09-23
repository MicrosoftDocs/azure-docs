---
title: How to use BlobFuse2 Health Monitor to gain insights into BlobFuse2 mount point activities and resource usage (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: How to use BlobFuse2 Health Monitor to gain insights into BlobFuse2 mount point activities and resource usage (preview).
author: jammart
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 09/23/2022
ms.author: jammart
ms.reviewer: tamram
---

# Use Health Monitor to gain insights into BlobFuse2 mount points (preview)

This article provides references to assist in deploying and using BlobFuse2 Health Monitor to gain insights into BlobFuse2 mount point activities and resource usage.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

## The BlobFuse2 Health Monitor

You can use BlobFuse2 Health Monitor to:

- Get statistics about internal activities related to BlobFuse2 mounts
- Monitor CPU and memory usage by BlobFuse2 mount processes
- Track file cache usage and file caching events

During the preview of BlobFuse2, refer to [BlobFuse2 Health Monitor README on GitHub](https://github.com/Azure/azure-storage-fuse/blob/main/tools/health-monitor/README.md) for full details on how to deploy and use Health Monitor.

Use the [BlobFuse2 health-monitor command reference (preview)](blobfuse2-commands-health-monitor.md) for details on how to configure and start a Health Monitor session

## See also

- [What is BlobFuse2? (preview)](blobfuse2-what-is.md)
- [BlobFuse2 configuration reference (preview)](blobfuse2-configuration.md)
- [How to mount an Azure blob storage container on Linux with BlobFuse2 (preview)](blobfuse2-how-to-deploy.md)
