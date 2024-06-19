---
title: "Azure HPC workload best practices guide"
description: A comprehensive guide to choosing a storage solution best suited to your HPC workloads.
author: christinechen2
ms.author: padmalathas
ms.reviewer: normesta
ms.date: 05/09/2024
ms.service: virtual-machines
ms.subservice: hpc
ms.topic: conceptual 
---
# High-performance computing (HPC) workload best practices guide

<!-- [!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)] -->

This guide provides best practices and guidelines to a storage solution that is best suited to your high-performance computing (HPC) workload.

There's typically a trade-off between optimizing for costs and optimizing for performance. This workload best practices series is focused on getting the *best* storage solution for HPC workloads on Azure VMs. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Overview

Storage for HPC workloads consists of core storage and in some cases, an accelerator.  

Core storage acts as the permanent home for your data. It contains rich data management features and is durable, available, scalable, elastic, and secure. An accelerator enhances core storage by providing high-performance data access. An accelerator can be provisioned on demand and gives your computational workload much faster access to data.


## Initial consideration

If you are starting from scratch, see [Understand data store models](/azure/architecture/guide/technology-choices/data-store-overview) to choose a data store and [Choose an Azure storage service](/azure/architecture/guide/technology-choices/storage-options) or [Introduction to Azure Storage](/azure/storage/common/storage-introduction) to get an idea of your storage service options. 

## At a glance

Start with the amount of data that you plan to store. Then, consider the number of CPU cores used by your workload and the size of your files. These factors help you to narrow down which core storage service best suits your workload and whether to use an accelerator to enhance performance.


|Configuration  |CPU cores  |Sizes of files  |Core Storage Recommendation  |Accelerator Recommendation  |
|---------|---------|---------|---------|---------|
|Under 50 TiB     |N/A |N/A        | [Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No accelerator  |
|50 TiB - 5,000 TiB |Less than 500 |N/A|[Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No accelerator  |
|50 TiB - 5,000 TiB |Over 500      |1 MiB and larger| [Azure Standard Blob](/azure/storage/blobs/). It’s supported by all accelerators, supports many protocols, and is cost-effective. | [Azure Managed Lustre](/azure/azure-managed-lustre/).    |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 1 MiB| [Azure Premium Blob](/azure/storage/blobs/storage-blob-block-blob-premium) or [Azure Standard Blob](/azure/storage/blobs/). | [Azure Managed Lustre](/azure/azure-managed-lustre/).     |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 512 KiB| [Azure NetApp Files](/azure/azure-netapp-files/).    |No accelerator  |
|Over 5,000 TiB |N/A      |N/A|    |Talk to your field or account team.   |
<!---|     |[Use ZRS disks when sharing disks between VMs](#use-zrs-disks-when-sharing-disks-between-vms).         |Prevents a shared disk from becoming a single point of failure.         | --->

## Solution details

If you are still stuck between options after using the decision trees, here are more details for each solution:

|Solution |Optimal Performance & Scale |Data Access (Access Protocol) |Billing Model |Core Storage or Accelerator |
|---|---|---|---|---|
| [**Azure Standard Blob**](/azure/storage/blobs/) | Good for large file, bandwidth-intensive workloads. | Good for traditional (file) and cloud-native (REST) HPC apps. <br><br> Easy to access, share, manage datasets.<br><br> Works with all accelerators. | Pay for what you use. | Core Storage. |
| [**Azure Premium Blob**](/azure/storage/blobs/storage-blob-block-blob-premium) | IOPS and latency better than Standard Blob. <br><br> Good for datasets with many medium-sized files and mixed file sizes.  | Good for traditional (file) and cloud-native (REST) HPC apps. <br><br> Easy to access, share, manage datasets. <br><br> Works with all accelerators.| Pay for what you use. | Core Storage. |
| [**Azure Premium Files**](/azure/storage/files/) | Capacity and bandwidth suited for smaller scale (<1k cores). <br><br> IOPS and latency good for medium sized files (>512 KiB). | Easy integration with Linux (NFS) and Windows (SMB), but can't use both NFS+SMB to access the same data. | Pay for what you provision. | Core Storage. |
| [**Azure NetApp Files**](/azure/azure-netapp-files/) | Capacity and bandwidth good for midrange jobs (1k-10k cores). <br><br> IOPS and latency good for small-file datasets (<512 KiB). <br><br> Excellent for small, many-file workloads. | Easy to integrate for Linux and Windows, supports multiprotocol for workflows using both Linux + Windows. | Pay what you provision. | Either. |
| [**Azure Managed Lustre**](/azure/azure-managed-lustre/) | Bandwidth to support all job sizes (1k - >10k cores). <br><br> IOPS and latency good for thousands of medium-sized files (>512 KiB). <br><br> Best for bandwidth-intensive read and write workloads. | Lustre, CSI. | Pay for what you provision. | Durable enough to run as standalone (core) storage, most cost-effective as an accelerator. |

## Core storage price comparison

In order of most to least expensive, the core storage option prices are: 
- Azure NetApp Files
- Azure Premium Blob and Azure Premium Files
- Azure Standard Blob

For more info on the pricing, see [Azure product pricing](https://azure.microsoft.com/pricing/#product-pricing).
