---
title: "Azure HPC workload best practices guide"
description: A comprehensive guide to choosing a storage solution best suited to your HPC workloads.
author: christinechen2
ms.author: christchen
ms.reviewer: normesta
ms.date: 05/09/2024
ms.service: virtual-machines
ms.subservice: hpc
ms.topic: conceptual 
---
# High-performance computing (HPC) workload best practices guide

<!-- [!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)] -->

This article provides storage best practices and guidelines to optimize performance for your HPC workloads Azure Virtual Machines (VM). This is a starting point to help you choose the storage service that is best suited to your workload.

There's typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for HPC workloads on Azure VMs. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Initial Considerations

If you’re beginning from the ground up, consider reviewing [Understand data store models](/azure/architecture/guide/technology-choices/data-store-overview) to choose a data store and [Choose an Azure storage service](/azure/architecture/guide/technology-choices/storage-options) or [Cloud storage on Azure](/azure/storage/common/storage-introduction) to evaluate storage service available.

## Overview

Storage for HPC workloads consists of core storage and in some cases, an accelerator. 

Core storage acts as the permanent home for your data. It is durable, available and secure, it contains rich data management features, and it is scalable and elastic. You have a few options for core storage.

An accelerator enhances core storage by providing higher performance for data access. It can be provisioned on-demand and provide higher performance when accessing data from your computational workload. 

Start with the amount of data that you plan to store, and narrow down your choice of core storage (and, if applicable, the accelerator) based on CPU cores and file sizes:
 

## At a glance

|Configuration  |CPU cores  |Sizes of files  |Core Storage Recommendation  |Accelarator Reccomendation  |
|---------|---------|---------|---------|---------|
|Under 50 TiB     |N/A |N/A        | [Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No Accelarator  |
|50 TiB - 5,000 TiB |Less than 500 |N/A|[Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No Accelarator  |
|50 TiB - 5,000 TiB |Over 500      |1 MiB and larger| [Azure Standard Blob](/azure/storage/blobs/). | [Azure Managed Lustre](/azure/azure-managed-lustre/).    |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 1 MiB| Azure Premium Blob](/azure/storage/blobs/storage-blob-block-blob-premium) or [Azure Standard Blob](/azure/storage/blobs/). | [Azure Managed Lustre](/azure/azure-managed-lustre/).     |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 512 kiB| [Azure NetApp Files](/azure/azure-netapp-files/).    |No Accelarator  |
|Over 5,000 TiB |N/A      |N/A|    |Talk to your field or account team.   |  |
<!---|     |[Use ZRS disks when sharing disks between VMs](#use-zrs-disks-when-sharing-disks-between-vms).         |Prevents a shared disk from becoming a single point of failure.         | --->

### Solution details

If you are still stuck between options after using the decision trees, here are more details for each solution:

|Solution |Optimal Performance & Scale |Data Access (Access Protocol) |Billing Model |Core Storage or Accelerator |
|---|---|---|---|---|
| [**Azure Standard Blob**](**/azure/storage/blobs/**) | Large file, bandwidth intensive workloads | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| [**Azure Premium Blob**](**/azure/storage/blobs/storage-blob-block-blob-premium**) | Data sets with many medium-sized files and mixed file sizes | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| [**Azure Premium Files**](**/azure/storage/files/**) | Smaller scale (<1k cores), IOPS/latency good for medium sized files (>512 KiB) | Easy integration with Linux (NFS) and Windows (SMB), but can't use both NFS+SMB to access the same data | Pay for what you provision | Core Storage |
| [**Azure NetApp Files**](**/azure/azure-netapp-files/**) | Midrange jobs (1k-10k cores), IOPS+latency good for small-file datasets (<512 KiB), excellent for small, many-file workloads | Easy to integrate for Linux and Windows, supports multiprotocol for workflows using both Linux + Windows | Pay what you provision | Either |
| [**Azure Managed Lustre**](**/azure/azure-managed-lustre/**) | All job sizes (1k - >10k cores) IOPS/latency for 1000s of medium-sized files (>512 KiB), best for bandwidth-intensive read + write workloads | Lustre, CSI | Pay for what you provision | Durable enough to run as standalone (core) storage, most cost-effective as an accelerator |

### Core storage price comparison

In order of most to least expensive, the core storage option prices are: Azure NetApp Files > Azure Premium Blob and Azure Premium Files > Azure Standard Blob.

## Next steps

To learn more, see the other articles in this best practices series:

- [Cloud storage on Azure](/azure/storage/common/storage-introduction/)
- [Azure Storage](/azure/storage/files/)
- [Azure NetApp files](/azure/azure-netapp-files/)
- [Azure Blob Storage](/azure/storage/blobs/)
- [Azure Managed Lustre](/azure/azure-managed-lustre/)
