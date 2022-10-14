---
title: Use BlobFuse2 Preview Health Monitor to monitor mount activities and resource usage
titleSuffix: Azure Blob Storage
description: Learn how to use BlobFuse2 Health Monitor to gain insights into BlobFuse2 Preview mount activities and resource usage.
author: jimmart-dev
ms.author: jammart
ms.reviewer: tamram
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 09/26/2022
---

# Use Health Monitor to gain insights into BlobFuse2 Preview mounts

This article provides references to help you deploy and use BlobFuse2 Preview Health Monitor to gain insights into BlobFuse2 mount activities and resource usage.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and currently is in preview. The preview version is provided without a service-level agreement. We recommend that you don't use the preview version for production workloads. In BlobFuse2 Preview, some features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> To use BlobFuse in a production environment, use the BlobFuse v1 general availability (GA) version. For information about the GA version, see:
>
> - [Mount Azure Blob Storage as a file system by using BlobFuse v1](storage-how-to-mount-container-linux.md)
> - [BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

You can use BlobFuse2 Health Monitor to:

- Get statistics about internal activities related to BlobFuse2 mounts
- Monitor CPU, memory, and network usage by BlobFuse2 mount processes
- Track file cache usage and events

## BlobFuse2 Health Monitor resources

During the preview of BlobFuse2, refer to [the BlobFuse2 Health Monitor README on GitHub](https://github.com/Azure/azure-storage-fuse/blob/main/tools/health-monitor/README.md) for full details on how to deploy and use Health Monitor. The README file describes:

- What Health Monitor collects
- How to set it up in the configuration file used for mounting a storage container
- The name, location, and contents of the output

## See also

- [Migrate to BlobFuse2 from BlobFuse v1](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)
- [BlobFuse2 commands](blobfuse2-commands.md)
- [Troubleshoot BlobFuse2 issues](blobfuse2-troubleshooting.md)

## Next steps

- [Configure settings for BlobFuse2](blobfuse2-configuration.md)
- [Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage](blobfuse2-health-monitor.md)
