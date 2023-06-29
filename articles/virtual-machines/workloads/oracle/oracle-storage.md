---
title: Storage options for Oracle on Azure VMs | Microsoft Docs
description: Storage options for Oracle on Azure VMs
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 06/13/2023
---
# Storage options for Oracle on Azure VMs
In this article, you learn about the storage choices available to you for Oracle on Azure VMs. The choices of database storage affect how well your Oracle tasks run, how reliable they are, and how much they cost. When exploring the upper limits of performance, it's important to recognize and reduce any constraints that could falsely skew results. Oracle database and applications set the bar high due to the intense demands on storage I/O with a mixed read and write workload driven by a single compute node. Understanding the choices of available storage options and their performance capabilities is the key to successfully migrating  Oracle to Azure VMs. This article describes all the Azure native storage offerings with their capabilities.

## Azure managed disks versus shared files
The throughput & IOPs are limited by the SKU of the selected disk and the virtual machine –whichever is lower.  Managed disks are less expensive and simpler to manage than shared storage; however, managed disks may offer lower IOPs and throughput than a given virtual machine allows.    

For example, while Azure’s Ultra Disks provides 160k IOPs and 2k MB/sec throughput that would become a bottleneck when attached to a Standard_L80s_v2 virtual machine that allows reads of more than 3 million IOPs and 20k MB/sec throughput.  When high IOPs are required, consider selecting an appropriate virtual machine with shared storage choices like [Azure Elastic SAN](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-introduction), [Azure NetApp Files.](https://learn.microsoft.com/azure/azure-netapp-files/performance-oracle-multiple-volumes)

 ## Azure managed disks

The [Azure Managed Disk](https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview) are block-level storage volumes managed by Azure for use with Azure Virtual Machines (VMs). They come in several performance tiers (Ultra Disk, Premium SSD, Standard SSD, and Standard HDD), offering different performance and cost options.   

- **Ultra Disk**: Azure [Ultra Disks](https://learn.microsoft.com/azure/virtual-machines/disks-enable-ultra-ssd?tabs=azure-portal) are high-performing managed disks designed for I/O-intensive workloads, including Oracle databases. They deliver high throughput and low latency, offering unparalleled performance for your data applications.  Can deliver 160,000 I/O operations per second (IOPS), 2000 MB/s per disk with dynamic scalability. Compatible with VM series ESv3, DSv3, FS, and M series, which are commonly used to host Oracles on Azure.

- **Premium SSD**: Azure [Premium SSDs](https://learn.microsoft.com/azure/virtual-machines/premium-storage-performance) are high-performance managed disks designed for production and performance-sensitive workloads. They offer a balance between cost and performance, making them a popular choice for many business applications, including Oracle databases. Can deliver 20,000 I/O operations per second (IOPS) per disk, highly available (99.9%) and compatible with DS, Gs & FS VM series.

- **Standard SSD**: Suitable for dev/test environments and noncritical workloads. 

- **Standard HDD**: Cost-effective storage for infrequently accessed data.

## Azure Elastic SAN

The [Azure Elastic SAN](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-introduction) is a cloud-native service that offers a scalable, cost-effective, high-performance, and comprehensive storage solution for a range of compute options. Gain higher resiliency and minimize downtime with rapid provisioning. Can deliver up to 64,000 IOPs & supports Volume groups.

## ANF large volumes for Oracle

The [Azure NetApp Files](https://learn.microsoft.com/azure/azure-netapp-files/performance-oracle-multiple-volumes) is able to meet the needs of this highly demanding workload. A cloud-native service that offers scalable & comprehensive storage choice. Can deliver up to 850,000 I/O requests per second and 6,800 MiB/s of storage throughput. Also provides multi host capabilities that are able to drive I/O totaling over 30,000 MiB/s across the three hosts while running in parallel. Azure NetApp also supplied comprehensive [performance bench marking](https://learn.microsoft.com/azure/azure-netapp-files/performance-benchmarks-linux) for Oracle on VM.

## Lightbits on Azure

The [Lightbits](https://www.lightbitslabs.com/azure/) Cloud Data Platform provides scalable and cost-efficient high-performance storage that is easy to consume on Azure. It removes the bottlenecks associated with native storage on the public cloud, such as scalable performance and consistently low latency. Removing these bottlenecks offers rich data services and resiliency that enterprises have come to rely on. It can deliver up to 1 million IOPS/volume and up to 3 million IOPs per VM. Lightbits cluster can scale vertically and horizontally. Lightbits support different sizes of [Lsv3](https://learn.microsoft.com/azure/virtual-machines/lsv3-series) and [Lasv3](https://learn.microsoft.com/azure/virtual-machines/lasv3-series) VMs for their clusters. For options, see L32sv3/L32asv3: 7.68 TB, L48sv3/L48asv3: 11.52 TB, L64sv3/L64asv3: 15.36 TB, L80sv3/L80asv3: 19.20 TB. 

## Next steps
- [Deploy premium SSD to Azure Virtual Machine](https://learn.microsoft.com/azure/virtual-machines/disks-deploy-premium-v2?tabs=azure-cli)  
- [Deploy an Elastic SAN](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal)  
- [Setup Azure NetApp Files & create NFS Volume](https://learn.microsoft.com/azure/azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes?tabs=azure-portal)  
- [Create Lightbits solution on Azure VM](https://www.lightbitslabs.com/resources/lightbits-on-azure-solution-brief/)