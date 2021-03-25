---
title: Use NFS Blob storage with Azure HPC Cache 
description: Describes procedures and limitations when using ADLS-NFS blob storage with Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/25/2021
ms.author: v-erkel
---

# Use NFS-mounted blob storage (PREVIEW) with Azure HPC Cache

Starting in March 2021 you can use NFS-mounted blob containers with Azure HPC Cache. Read more about the [NFS 3.0 protocol support in Azure Blob storage](../storage/blobs/network-file-system-protocol-support.md) on the Blob storage documentation site.

> [!NOTE]
> NFS 3.0 protocol support in Azure Blob storage is in preview and should not be used in production environments. Check for updates and more details in the [NFS protocol support documentation](../storage/blobs/network-file-system-protocol-support.md).

Azure HPC Cache uses NFS-enabled blob storage in its ADLS-NFS storage target type. These storage targets are similar to regular NFS storage targets, but also have some overlap with regular Azure Blob targets.

This article explains strategies and limitations that you should understand when you use ADLS-NFS storage targets.

You should also read the NFS blob documentation, especially these sections that describe compatible and incompatible scenarios:

* [Feature overview](../storage/blobs/network-file-system-protocol-support.md#applications-and-workloads-suited-for-this-feature)
* [Features not yet supported](../storage/blobs/network-file-system-protocol-support.md#azure-storage-features-not-yet-supported)
* [Performance considerations](../storage/blobs/network-file-system-protocol-support-performance.md)

## Understand consistency requirements

HPC cache requires strong consistency for ADLS-NFS storage targets. By default, NFS-enabled blob storage does not strictly update file metadata, which prevents HPC cache from accurately comparing file versions.

To work around this difference, Azure HPC Cache automatically disables NFS attribute caching on any NFS-enabled blob container used as a storage target.

This setting persists for the lifetime of the container, even if you remove it from the cache.

## Preload data with NFS protocol

On an NFS-enabled blob container, *a file can only be edited by the same protocol used when it was created*. That is, if you use the Azure REST API to populate a container, you cannot use NFS to update those files. This means that Azure HPC Cache can't edit the files directly, since HPC cache only uses NFS.

It's not a problem for the cache if your container is empty, or if the files were created by using NFS.

However, if the files in your container were created with Azure Blob's REST API instead of NFS, Azure HPC Cache is restricted to these actions on the original files:

* List the file in a directory.
* Read the file (and hold it in the cache for subsequent reads).
* Delete the file.
* Empty the file (truncate it to 0).
* Save a copy of the file. The copy is marked as an NFS-created file, and it can be edited using NFS.

Azure HPC Cache **can't** edit the contents of a file that was created using REST. This means that it can't save a changed file back to the storage target.

It's important to understand this limitation, because it can cause data integrity problems if you use read/write caching usage models on files that were not created with NFS.

> [!TIP]
> Learn more about read and write caching in [Understand cache usage models](cache-usage-models.md).

### Write caching scenarios

These cache usage models include write caching:

* **Greater than 15% writes**
* **Greater than 15% writes, checking the backing server for changes every 30 seconds**
* **Greater than 15% writes, checking the backing server for changes every 60 seconds**
* **Greater than 15% writes, write back to the server every 30 seconds**

Only use these usage models to edit files that were created with NFS.

If you try to use write caching on REST-created files, you could corrupt or lose data because the cache does not try to save file edits to the storage container immediately.

Here is how trying to cache writes to REST-created files puts data at risk:

1. The cache accepts edits from clients, and returns a success message on each change.
1. The cache keeps the changed file in its storage and waits for additional changes.
1. After some time has passed, the cache tries to save the changed file to the back-end container. At this point, it will get an error message because it is trying to write to a REST-created file with NFS. It is too late to tell the client machine that its changes were not accepted, and the cache has no way to update the original file.

### Read caching scenarios

Read caching scenarios are appropriate for files created with either NFS or Azure Blob REST API.

These usage models use only read caching:

* **Read heavy, infrequent write**s
* **Clients write to the NFS target, bypassing the cache**
* **Read heavy, checking the backing server every 3 hours**

You can use these usage models with files created by REST API or by NFS. Any NFS writes sent from a client to the back-end container will still fail, but they will fail immediately and return an error message to the client.

A read caching workflow can still involve file changes, as long as these are not cached. For example, clients might access files from the container but write their changes back as a new file, or they could save modified files in a different location.

<!-- 
| Usage model | Type of caching | Files from REST API | Files from NFS |
|--|--|--|--|
| Greater than 15% writes (**all versions**) | read and write caching | X | ok |
| Clients write to the NFS target, bypassing the cache | read | ok | ok |
| Read heavy, infrequent writes | read | ok but writes will fail immediately | ok |
| Read heavy, checking the backing server every 3 hours | read | ok but writes will fail immediately | ok |

- what to do if you didn't load data with nfs
- limitations of blob nfs
- how to populate blob 

-->

## Streamline writes to NFS-enabled containers with HPC cache

Azure HPC Cache can help improve performance in a workload that includes writing changes to an ADLS-NFS storage target.

> [!NOTE]
> You must use NFS to populate your ADLS-NFS storage container if you want to modify its files through Azure HPC Cache.

One of the limitations outlined in the NFS-enabled blob [Performance considerations article](../storage/blobs/network-file-system-protocol-support-performance.md) is that ADLS-NFS storage is not very efficient at overwriting existing files. If you use Azure HPC Cache with NFS-mounted blob storage, the cache handles intermittent rewrites as clients modify an active file. The latency of writing a file to the back end container is hidden from the clients.

Keep in mind the limitations explained above in [Preload data with NFS protocol](#preload-data-with-nfs-protocol).

## Next steps

* Learn [ADLS-NFS storage target prerequisites](hpc-cache-prerequisites.md#nfs-mounted-blob-adls-nfs-storage-requirements-preview)
* Create an [NFS-enabled blob storage account](../storage/blobs/network-file-system-protocol-support-how-to.md)
