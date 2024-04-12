---
title: How to use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage
titleSuffix: Azure Storage
description: Learn how to Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: tamram
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
---

# How to use Health Monitor to gain insights into BlobFuse2 mounts

This article provides references to help you deploy and use BlobFuse2 Health Monitor to gain insights into BlobFuse2 mount activities and resource usage.

You can use BlobFuse2 Health Monitor to:

- Get statistics about internal activities related to BlobFuse2 mounts
- Monitor CPU, memory, and network usage by BlobFuse2 mount processes
- Track file cache usage and events

## BlobFuse2 Health Monitor resources

For full details on how to deploy and use Health Monitor, refer to [the BlobFuse2 Health Monitor README on GitHub](https://github.com/Azure/azure-storage-fuse/blob/main/tools/health-monitor/README.md). The README file describes:

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
