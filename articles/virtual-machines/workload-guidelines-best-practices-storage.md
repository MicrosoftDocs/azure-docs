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

### Decision tree

Start with the amount of data that you plan to store, and narrow down your choice of core storage (and, if applicable, the accelerator) based on CPU cores and file sizes:

- Under 50 TiB: Consider [**Azure Files**](/azure/storage/files/) or [**Azure NetApp Files**](/azure/azure-netapp-files/). With smaller scale workloads, it’s best to keep the solution simple. See [Azure Files and Azure NetApp Files comparison](/azure/storage/files/storage-files-netapp-comparison)
- Over 50 TiB, less than 5,000 TiB: 
  - If <= 500 CPU cores, consider core-only [**Azure Files**](/azure/storage/files/) or [**Azure NetApp Files**](/azure/azure-netapp-files/). See [Azure Files and Azure NetApp Files comparison](/azure/storage/files/storage-files-netapp-comparison)
  - If > 500 CPU cores, and file sizes are:
    - Mostly 1 MiB or larger, consider [**Azure Standard Blob**](/azure/storage/blobs/). It is supported by all accelerators, supports many protocols, and is cost effective. For the accelerator, consider [**Azure Managed Lustre**](/azure/azure-managed-lustre/).
    - Mostly smaller than 1 MiB, consider [**Azure Premium Blob**](/azure/storage/blobs/storage-blob-block-blob-premium)** or** [**Azure Standard Blob**](/azure/storage/blobs/). For the accelerator, consider [**Azure Managed Lustre**](/azure/azure-managed-lustre/).
    - Mostly smaller than 512 KiB, consider [**Azure NetApp Files**](/azure/azure-netapp-files/).
- Over 5,000 TiB: Talk to your field or account team.

## At a glance

|Configuration  |Recommendation  |Benefits  |
|---------|---------|---------|
|[Applications running on a single VM](#recommendations-for-applications-running-on-a-single-vm)     |[Use Ultra Disks, Premium SSD v2, and Premium SSD disks](#use-ultra-disks-premium-ssd-v2-or-premium-ssd).         |Single VMs using only Ultra Disks, Premium SSD v2, or Premium SSD disks have the highest uptime service level agreement (SLA), and these disk types offer the best performance.         |
|     |[Use zone-redundant storage (ZRS) disks](#use-zone-redundant-storage-disks).         |Access to your data even if an entire zone experiences an outage.         |
|[Applications running on multiple VMs](#recommendations-for-applications-running-on-multiple-vms)    |Distribute VMs and disks across multiple availability zones using a [zone redundant Virtual Machine Scale Set with flexible orchestration mode](#use-zone-redundant-virtual-machine-scale-sets-with-flexible-orchestration) or by deploying VMs and disks across [three availability zones](#deploy-vms-and-disks-across-three-availability-zones).        |Multiple VMs have the highest uptime SLA when deployed across multiple zones.         |
|     |Deploy VMs and disks across multiple fault domains with either [regional Virtual Machine Scale Sets with flexible orchestration mode](#use-regional-virtual-machine-scale-sets-with-flexible-orchestration) or [availability sets](#use-availability-sets).         |Multiple VMs have the second highest uptime SLA when deployed across fault domains.         |
|     |[Use ZRS disks when sharing disks between VMs](#use-zrs-disks-when-sharing-disks-between-vms).         |Prevents a shared disk from becoming a single point of failure.         |

### Solution details

If you are still stuck between options after using the decision trees, here are more details for each solution:

| **Solution** **(link to each)** | **Optimal Performance & Scale** | **Data Access (Access Protocol)** | **Billing Model** | **Core Storage or Accelerator?** |
|---|---|---|---|---|
| [**Azure Standard Blob**](**/azure/storage/blobs/**) | Large file, bandwidth intensive workloads | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| **Azure Premium Blob** | Data sets with many medium-sized files and mixed file sizes | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| **Azure Premium Files** | Smaller scale (<1k cores), IOPS/latency good for medium sized files (>512 KiB) | Easy integration with Linux (NFS) and Windows (SMB), but can't use both NFS+SMB to access the same data | Pay for what you provision | Core Storage |
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
