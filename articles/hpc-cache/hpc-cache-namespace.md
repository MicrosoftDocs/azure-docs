---
title: Create an Azure HPC Cache 
description: How to create an Azure HPC Cache instance
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: v-erkell
---

# Configure aggregated namespace
<!-- change link in GUI -->

Azure HPC Cache allows clients to access a variety of storage systems through a virtual namespace that hides the details of the back-end storage system.

When you add a storage target, you set the client-facing filepath. Client machines mount this filepath. You can change the storage target associated with that path. For example, you could replace a hardware storage system with cloud storage without needing to rewrite client-facing procedures.

## Aggregated namespace example

Plan your aggregated namespace so that client machines can conveniently reach the information they need, and administrators and workflow engineers can easily distinguish the paths.

For example, consider a system where an Azure HPC Cache instance is being used to process data stored in Azure Blob. The analysis requires template files that are stored in an on-premises datacenter.

The template data is stored in a datacenter, and the information needed for this job is stored in these subdirectories:

    /goldline/templates/acme2017/sku798
    /goldline/templates/acme2017/sku980 

The datacenter storage system exposes these exports: 

    /
    /goldline
    /goldline/templates

The data to be analyzed has been copied to an Azure Blob storage container named "sourcecollection" by using the [CLFSLoad utility](hpc-cache-ingest.md#pre-load-data-in-blob-storage-with-clfsload).

To allow easy access through the cache, consider creating storage targets with these virtual namespace paths:

| Back-end NFS filepath or Blob container | Virtual namespace path |
|-----------------------------------------|------------------------|
| /goldline/templates/acme2017/sku798     | /templates/sku798      |
| /goldline/templates/acme2017/sku980     | /templates/sku980      |
| sourcecollection                        | /source/               |

Since the NFS source paths are subdirectories of the same export, you will need to define multiple namespace paths from the same storage target. 

| Storage target hostname  | NFS export path      | Subdirectory path | Namespace path    |
|--------------------------|----------------------|-------------------|-------------------|
| *IP address or hostname* | /goldline/templates  | acme2017/sku798   | /templates/sku798 |
| *IP address or hostname* | /goldline/templates  | acme2017/sku980   | /templates/sku980 |

A client application can mount the cache and easily access the aggregated namespace filepaths /source, /templates/sku798, and /templates/sku980.

## Next steps

After you have decided how to set up your virtual filesystem, [create storage targets](hpc-cache-add-storage.md) to map your back-end storage to your client-facing virtual filepaths.
