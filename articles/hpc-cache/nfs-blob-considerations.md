---
title: Use NFS Blob storage with Azure HPC Cache 
description: Describes procedures and limitations when using ADLS-NFS blob storage with Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/24/2021
ms.author: v-erkel
---

# Use NFS-mounted blob storage (PREVIEW) with Azure HPC Cache

Starting in March 2021 you can use NFS-mounted blob containers with Azure HPC Cache.

> [!NOTE]
> NFS 3.0 protocol support in Azure Blob storage is in preview and should not be used in production environments. Read more in the [NFS protocol support documentation](../storage/blobs/network-file-system-protocol-support.md)


**PLACEHOLDER TEXT - ARTICLE IN DEVELOPMENT 3/24**

The [Performance considerations article](../storage/blobs/network-file-system-protocol-support-performance.md) outlines some limitations. One of these is that ADLS-NFS storage is not very efficient at overwriting existing files. However, if you use Azure HPC Cache with NFS-mounted blob storage, the cache handles intermittent rewrites as clients modify an active file. The latency of writing a file to the back end container is hidden from the clients.

That being said, you should not use an ADLS-NFS storage target in a "write-around" situation - where some clients write changes directly to the storage system instead of sending file changes through the cache.

Also, HPC cache requires strong consistency for ADLS-NFS storage targets. To accomplish this, Azure HPC Cache automatically disables NFS attribute caching on any NFS-enabled blob container used as a storage target. This setting persists for the lifetime of the container, even if you remove it from the cache.