---
title: Use NFS Blob storage with Azure HPC Cache 
description: Describes procedures and limitations when using ADLS-NFS blob storage with Azure HPC Cache
author: ronhogue
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/02/2022
ms.author: rohogue
---

# Use NFS-mounted blob storage with Azure HPC Cache

You can use NFS-mounted blob containers with Azure HPC Cache. Read more about the [NFS 3.0 protocol support in Azure Blob storage](../storage/blobs/network-file-system-protocol-support.md) on the Blob storage documentation site.

Azure HPC Cache uses NFS-enabled blob storage in its ADLS-NFS storage target type. These storage targets are similar to regular NFS storage targets, but also have some overlap with regular Azure Blob targets.

This article explains strategies and limitations that you should understand when you use ADLS-NFS storage targets.

You should also read the NFS blob documentation, especially these sections that describe compatible and incompatible scenarios, and give troubleshooting tips:

* [Feature overview](../storage/blobs/network-file-system-protocol-support.md)
* [Performance considerations](../storage/blobs/network-file-system-protocol-support-performance.md)
* [Known issues and limitations](../storage/blobs/network-file-system-protocol-known-issues.md)
* [How-to procedure and troubleshooting guide](../storage/blobs/network-file-system-protocol-support-how-to.md#resolve-common-errors)

## Understand consistency requirements

HPC Cache requires strong consistency for ADLS-NFS storage targets. By default, NFS-enabled blob storage does not strictly update file metadata, which prevents HPC Cache from accurately comparing file versions.

To work around this difference, Azure HPC Cache automatically disables NFS attribute caching on any NFS-enabled blob container used as a storage target.

This setting persists for the lifetime of the container, even if you remove it from the cache.

## Pre-load data with NFS protocol
<!-- cross-referenced from hpc-cache-ingest.md and here -->

On an NFS-enabled blob container, *a file can only be edited by the same protocol used when it was created*. That is, if you use the Azure REST API to populate a container, you cannot use NFS to update those files. Because Azure HPC Cache only uses NFS, it can't edit any files that were created with the Azure REST API. (Learn more about [known issues with blob storage APIs](../storage/blobs/data-lake-storage-known-issues.md#blob-storage-apis))

It's not a problem for the cache if your container is empty, or if the files were created by using NFS.

If the files in your container were created with the Azure Blob REST API instead of NFS, Azure HPC Cache is restricted to these actions on the original files:

* List the file in a directory.
* Read the file (and hold it in the cache for subsequent reads).
* Delete the file.
* Empty the file (truncate it to 0).
* Save a copy of the file. The copy is marked as an NFS-created file, and it can be edited using NFS.

**Azure HPC Cache can't edit the contents of a file that was created using REST.** This means that the cache can't save a changed file from a client back to the storage target.

It's important to understand this limitation, because it can cause data integrity problems if you use read/write caching usage models on files that were not created with NFS.

> [!TIP]
> Learn more about read and write caching in [Understand cache usage models](cache-usage-models.md).

### Write caching scenarios

These cache usage models include write caching:

* **Greater than 15% writes**
* **Greater than 15% writes, checking the backing server for changes every 30 seconds**
* **Greater than 15% writes, checking the backing server for changes every 60 seconds**
* **Greater than 15% writes, write back to the server every 30 seconds**

Write caching usage models should be used only on files that were created with NFS.

If you try to use write caching on REST-created files, your file changes could be lost. This is because the cache does not try to save file edits to the storage container immediately.

Here is how trying to cache writes to REST-created files puts data at risk:

1. The cache accepts edits from clients, and returns a success message on each change.
1. The cache keeps the changed file in its storage and waits for additional changes.
1. After some time has passed, the cache tries to save the changed file to the back-end container. At this point, it will get an error message because it is trying to write to a REST-created file with NFS.

   It is too late to tell the client machine that its changes were not accepted, and the cache has no way to update the original file. So the changes from clients will be lost.

### Read caching scenarios

Read caching scenarios are appropriate for files created with either NFS or Azure Blob REST API.

These usage models use only read caching:

* **Read heavy, infrequent writes**
* **Clients write to the NFS target, bypassing the cache**
* **Read heavy, checking the backing server every 3 hours**

You can use these usage models with files created by REST API or by NFS. Any NFS writes sent from a client to the back-end container will still fail, but they will fail immediately and return an error message to the client.

A read caching workflow can still involve file changes, as long as these are not cached. For example, clients might access files from the container but write their changes back as a new file, or they could save modified files in a different location.

## Recognize Network Lock Manager (NLM) limitations

NFS-enabled blob containers do not support Network Lock Manager (NLM), which is a commonly used NFS protocol to protect files from conflicts.

If your NFS workflow was originally written for hardware storage systems, your client applications might include NLM requests. To work around this limitation when moving your process to NFS-enabled blob storage, make sure that your clients disable NLM when they mount the cache.

To disable NLM, use the option ``-o nolock`` in your clients' ``mount`` command. This option prevents the clients from requesting NLM locks and receiving errors in response. The ``nolock`` option is implemented differently in different operating systems; check your client OS documentation (man 5 nfs) for details.

## Streamline writes to NFS-enabled containers with HPC Cache

Azure HPC Cache can help improve performance in a workload that includes writing changes to an ADLS-NFS storage target.

> [!NOTE]
> You must use NFS to populate your ADLS-NFS storage container if you want to modify its files through Azure HPC Cache.

One of the limitations outlined in the NFS-enabled blob [Performance considerations article](../storage/blobs/network-file-system-protocol-support-performance.md) is that ADLS-NFS storage is not very efficient at overwriting existing files. If you use Azure HPC Cache with NFS-mounted blob storage, the cache handles intermittent rewrites as clients modify an active file. The latency of writing a file to the back end container is hidden from the clients.

Keep in mind the limitations explained above in [Pre-load data with NFS protocol](#pre-load-data-with-nfs-protocol).

## Next steps

* Learn [ADLS-NFS storage target prerequisites](hpc-cache-prerequisites.md#nfs-mounted-blob-adls-nfs-storage-requirements)
* Create an [NFS-enabled blob storage account](../storage/blobs/network-file-system-protocol-support-how-to.md)
