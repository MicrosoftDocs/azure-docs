---
title: Understand the Azure HPC Cache aggregated namespace
description: How to plan the virtual namespace for your Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 05/02/2022
ms.author: rohogue
---

# Plan the aggregated namespace

Azure HPC Cache allows clients to access a variety of storage systems through a virtual namespace that hides the details of the back-end storage system.

After you add a storage target, you set up one or more client-facing namespace paths for the storage target. Client machines mount this file path and can make file read requests to the cache instead of mounting the storage system directly.

Because Azure HPC Cache manages this virtual file system, you can change the storage target without changing the client-facing path. For example, you could replace a hardware storage system with cloud storage without needing to rewrite client-side procedures.

## Aggregated namespace example

Plan your aggregated namespace so that client machines can conveniently reach the information they need, and so that administrators and workflow engineers can easily distinguish the paths.

For example, consider a system where an Azure HPC Cache instance is being used to process data stored in Azure Blob. The analysis requires template files that are stored in an on-premises datacenter.

The template data is stored in a datacenter, and the information needed for this job is stored in these subdirectories:

* */goldline/templates/acme2017/sku798*
* */goldline/templates/acme2017/sku980*

The datacenter storage system exposes these exports:

* */*
* */goldline*
* */goldline/templates*

The data to be analyzed has been copied to an Azure Blob storage container named "sourcecollection" by using the NFS data import techniques outlined in [Move data to Azure Blob storage](hpc-cache-ingest.md).

To allow easy access through the cache, consider creating storage targets with these virtual namespace paths:

| Back-end storage system <br/> (NFS file path or Blob container) | Virtual namespace path |
|-----------------------------------------|------------------------|
| /goldline/templates/acme2017/sku798     | /templates/sku798      |
| /goldline/templates/acme2017/sku980     | /templates/sku980      |
| sourcecollection                        | /source/               |

An NFS storage target can have multiple virtual namespace paths, as long as each one references a unique export path. (Read [NFS namespace paths](add-namespace-paths.md#nfs-namespace-paths) to learn more about using multiple namespace paths with an NFS storage target.)

Because the NFS source paths are subdirectories of the same export, you will need to define multiple namespace paths from the same storage target.

| Storage target hostname  | NFS export path     | Subdirectory path | Namespace path    |
|--------------------------|---------------------|-------------------|-------------------|
| *IP address or hostname* | /goldline/templates | acme2017/sku798   | /templates/sku798 |
| *IP address or hostname* | /goldline/templates | acme2017/sku980   | /templates/sku980 |

A client application can mount the cache and easily access the aggregated namespace file paths ``/source``, ``/templates/sku798``, and ``/templates/sku980``.

An alternate approach might be to create a virtual path like `/templates` that links to the parent directory, `acme2017`, and then have the clients navigate to the individual `sku798` and `sku980` directories after mounting the cache. However, you can't create a namespace path that is a subdirectory of another namespace path. So if you create a path to the `acme2017` directory you can't also create any namespace paths to directly access its subdirectories.

The Azure HPC Cache **Namespace** settings page shows the client-facing filesystem and lets you add or edit paths. Read [Set up the aggregated namespace](add-namespace-paths.md) for details.

## Next steps

After you have decided how to set up your virtual file system, take these steps to create it:

* [Create storage targets](hpc-cache-add-storage.md) to add your back-end storage systems to your Azure HPC Cache
* [Add namespace paths](add-namespace-paths.md) to create the aggregated namespace that client machines use to access files
