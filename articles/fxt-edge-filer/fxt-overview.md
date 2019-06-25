---
title: Microsoft Azure FXT Edge Filer overview 
description: Describes Azure FXT Edge Filer hybrid storage cache, an active archive and file access accelerator solution for high performance computing 
author: ekpgh
ms.service: fxt-edge-filer
ms.topic: overview
ms.date: 06/20/2019
ms.author: v-erkell 
---

# What is Azure FXT Edge Filer hybrid storage cache? (Preview)

Azure FXT Edge Filer is a hybrid storage caching appliance that provides fast file access and active archive for high-performance computing (HPC) tasks.

It works with multiple data sources, whether stored in a local data center, remotely, or in the cloud. The Azure FXT Edge Filer can provide a unified namespace for data in diverse storage systems.

Three or more FXT Edge Filer hardware devices work together as a clustered filesystem to provide the cache. For details about purchasing the required hardware, contact your Microsoft representative. 

To learn more, read the product information and data sheet on [Azure FXT Edge Filer](https://azure.microsoft.com/services/fxt-edge-filer/).

> [!IMPORTANT]
> Azure FXT Edge Filer is in *preview*. You must contact Microsoft's HPC team or the Azure FXT Edge Filer team to access this service. Contact information is available in the [Azure FXT Edge Filer hybrid storage cache data sheet](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-fxt-edge-filer-hybrid-storage-cache-software-defined-networking-fast-file-access-and-active-archive-for-hpc/FXT%20Edge%20Filer%20datasheet-032219.pdf). 

## Use cases

The Azure FXT Edge Filer enhances productivity best for workflows like these:

* Read-heavy file access workflow 
* NFSv3 or SMB2 protocols
* Compute farms of 1000 to 100,000 CPU cores

### NAS optimization and scaling

You can use the Azure FXT Edge Filer cache to smooth access to existing NetApp and Dell EMC Isilon NAS systems. You also can add Azure Blob or other cloud storage to provide scalability without having to rework data access processes on the client side. 

### WAN caching

Azure FXT Edge Filer can be used to support fast file access from power users when the data they need is stored elsewhere. Provide access while keeping backup and other data management systems in a centralized data center. 

### Active archive in Azure Blob

Expand your data center into cloud storage with Azure FXT Edge Filer as the access point. 

## Features 

Two hardware models are available. 

| Model | DRAM | NVMe SSD | Network ports | 
|-------|------|----------|---------------|
| FXT 6600 | 1536 GB | 25.6 TB | 6 x 25Gb/10Gb + 2 x 1Gb |
| FXT 6400 | 768 GB | 12.8 TB | 6 x 25Gb/10Gb + 2 x 1Gb |


## Next steps

* Continue learning about the Azure FXT Edge Filer by reading the [specifications](fxt-specs.md) or [installation tutorial](fxt-install.md).
* Learn how to qualify for the product preview: Contact the Azure FXT Edge Filer team at the address provided in the [data sheet](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-fxt-edge-filer-hybrid-storage-cache-software-defined-networking-fast-file-access-and-active-archive-for-hpc/FXT%20Edge%20Filer%20datasheet-032219.pdf). Learn more on the [Azure FXT Edge Filer product page](https://azure.microsoft.com/services/fxt-edge-filer/).