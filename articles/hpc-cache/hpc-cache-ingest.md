---
title: Move data to an Azure HPC Cache cloud container 
description: How to
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 08/30/2019
ms.author: v-erkell
---

# Move data to Azure Blob storage for Azure HPC Cache

If your workflow includes moving data to Azure Blob storage, make sure you are using an efficient strategy to copy your data through the Azure HPC Cache.

This article explains the best ways to move data to Blob storage for use with Azure HPC Cache.

Keep these facts in mind:

* Azure HPC Cache uses a customized filesystem to store and reference data in Blob storage. This is why a Blob storage target must either be a new, empty container or a Blob container that was previously used for Azure HPC Cache data. ([Avere vFXT for Azure](https://azure.microsoft.com/services/storage/avere-vfxt/) also uses this cloud filesystem.)

* Copying data through the Azure HPC Cache is best when you use multiple clients and parallel operations. A simple copy command from one client gives slow copy performance.

A Python-based utility is available to load content onto a Blob storage container. Read [Pre-load data in Blob storage](#pre-load-data-in-blob-storage-with-clfsload) to learn more.

If you don't want to use the loading utility, or if you want to add content to an existing storage target, follow the parallel data ingest instructions to write the data through the Azure HPC Cache.

## Pre-load data in Blob storage with CLFSLoad

You can use the [Avere CLFSLoad](https://aka.ms/avere-clfsload) utility to copy data to a new Blob storage container before you add it as a storage target. This utility runs on a Linux VM and writes data in the proprietary format needed for Azure HPC Cache.

This option works with new, empty containers only. Create the container before using Avere CLFSLoad.

Detailed information is included in the [Avere CLFSLoad readme](https://aka.ms/avere-clfsload).

A general overview of the process:

1. Prepare a Linux system (physical or VM) with Python version 3.6 or later. (Python 3.7 is recommended for better performance.)
1. Install the Avere-CLFSLoad software on the Linux system.
1. Execute the transfer from the Linux command line. 

The Avere CLFSLoad utility needs the following information:

* The storage account ID that contains your Blob storage container
* The name of the empty Blob storage container
* A shared access signature (SAS) token that allows the utility to write to the container
* A local path to the data source - either a local directory that contains the data to copy, or a local path to a mounted remote system with the data.

The requirements are explained in detail in the [Avere CLFSLoad readme](https://aka.ms/avere-clfsload).

## Copy data through the Azure HPC Cache

Because the Azure HPC Cache is designed to serve multiple clients simultaneously, the most efficient way to write data to a Blob storage target is with parallel writes from multiple clients.

![Diagram showing multi-client, multi-threaded data movement: At the top left, an icon for on-premises hardware storage has multiple arrows coming from it. The arrows point to four client machines. From each client machine three arrows point toward the Azure HPC Cache. From the Azure HPC Cache, multiple arrows point to Blob storage.](media/hpc-cache-parallel-ingest.png) 

The ``cp`` or ``copy`` commands that are commonly used to using to transfer data from one storage system to another are single-threaded processes that copy only one file at a time. This means that the file server is ingesting only one file at a time - which is a waste of the cluster’s resources.

This section explains strategies for creating a multi-client, multi-threaded file copying system to move data to Blob storage with the Azure HPC Cache. It explains file transfer concepts and decision points that can be used for efficient data copying using multiple clients and simple copy commands.

It also explains some utilities that can help. The ``msrsync`` utility can be used to partially automate the process of dividing a dataset into buckets and using rsync commands. The ``parallelcp`` script is another utility that reads the source directory and issues copy commands automatically.

### Strategic planning

When building a strategy to copy data in parallel, you should understand the tradeoffs in file size, file count, and directory depth.

* When files are small, the metric of interest is files per second.
* When files are large (10MiBi or greater), the metric of interest is bytes per second.

Each copy process has a throughput rate and a files-transferred rate, which can be measured by timing the length of the copy command and factoring the file size and file count. Explaining how to measure the rates is outside the scope of this document, but it is imperative to understand whether you’ll be dealing with small or large files.

Strategies for parallel data ingest with Azure HPC Cache include:

* Manual copying - You can manually create a multi-threaded copy on a client by running more than one copy command at once in the background against predefined sets of files or paths. Read [Azure HPC Cloud data ingest - manual copy method](hpc-cache-ingest-manual.md) for details.

* Partially automated copying with ``msrsync`` - ``msrsync`` is a wrapper utility that runs multiple parallel ``rsync`` processes. For details, read [Azure HPC Cache data ingest - msrsync method](hpc-cache-ingest-msrsync.md).

* Scripted copying with ``parallelcp`` - Learn how to create and run a parallel copy script in [Azure HPC Cache data ingest - parallel copy script method](hpc-cache-ingest-parallelcp.md).

<!-- ### Data ingestor VM template

A data ingestor Resource Manager template is available on GitHub to automatically create a VM with the parallel data ingestion tools mentioned in this article.

![diagram showing multiple arrows each from blob storage, hardware storage, and Azure file sources. The arrows point to a "data ingestor vm" and from there, multiple arrows point to the Avere vFXT](media/avere-vfxt-ingestor-vm.png)

The data ingestor VM is part of a tutorial for the Avere vFXT for Azure, but it applies to testing the Azure HPC Cache as well. In this tutorial, where the newly created VM mounts the Avere vFXT cluster and downloads its bootstrap script from the cluster. Read [Bootstrap a data ingestor VM](https://github.com/Azure/Avere/blob/master/docs/data_ingestor.md) for details. -->

## Next steps

After you set up your storage, learn how clients can mount the cache.

* [Access the Azure HPC Cache system](hpc-cache-mount.md)
