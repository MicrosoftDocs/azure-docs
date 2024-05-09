---
author: Robert McMurray
ms.date: 05/07/2024
---
# High-performance computing (HPC) workload best practices guide

## Initial Considerations

If you are starting from scratch, see [Understand data store models - Azure Application Architecture Guide | Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-overview) to choose a data store and [Choose an Azure storage service - Azure Architecture Center | Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/storage-options)  or [Introduction to Azure Storage - Cloud storage on Azure | Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) to get an idea of your storage service options.

## Heading suggestion

This guide is a starting point to help you choose the storage service that is best suited to your workload.

Storage for HPC workloads consists of core storage and in some cases, an accelerator. 

Core storage acts as the permanent home for your data. It is durable, available and secure, it contains rich data management features, and it is scalable and elastic. You have a few options for core storage.

An accelerator enhances core storage by providing higher performance for data access. It can be provisioned on-demand and provide higher performance when accessing data from your computational workload. 

### Decision tree

Start with the amount of data that you plan to store, and narrow down your choice of core storage (and, if applicable, the accelerator) based on CPU cores and file sizes:

- Under 50 TiB: Consider [**Azure Files**](https://learn.microsoft.com/azure/storage/files/)** or** [**Azure NetApp Files**](https://learn.microsoft.com/azure/azure-netapp-files/). With smaller scale workloads, it’s best to keep the solution simple. See [Azure Files and Azure NetApp Files comparison | Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-netapp-comparison)
- Over 50 TiB, less than 5,000 TiB: 
  - If <= 500 CPU cores, consider core-only [**Azure Files**](https://learn.microsoft.com/azure/storage/files/)** or** [**Azure NetApp Files**](https://learn.microsoft.com/azure/azure-netapp-files/). See [Azure Files and Azure NetApp Files comparison | Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-netapp-comparison)
  - If > 500 CPU cores, and file sizes are:
    - Mostly 1 MiB or larger, consider [**Azure Standard Blob**](https://learn.microsoft.com/azure/storage/blobs/). It is supported by all accelerators, supports many protocols, and is cost effective. For the accelerator, consider [**Azure Managed Lustre**](https://learn.microsoft.com/azure/azure-managed-lustre/).
    - Mostly smaller than 1 MiB, consider [**Azure Premium Blob**](https://learn.microsoft.com/azure/storage/blobs/storage-blob-block-blob-premium)** or** [**Azure Standard Blob**](https://learn.microsoft.com/azure/storage/blobs/)**.** For the accelerator, consider [**Azure Managed Lustre**](https://learn.microsoft.com/azure/azure-managed-lustre/).
    - Mostly smaller than 512 KiB, consider [**Azure NetApp Files**](https://learn.microsoft.com/azure/azure-netapp-files/)**.**
- Over 5,000 TiB: Talk to your field or account team.

### Solution details

If you are still stuck between options after using the decision trees, here are more details for each solution:

| **Solution** **(link to each)** | **Optimal Performance & Scale** | **Data Access (Access Protocol)** | **Billing Model** | **Core Storage or Accelerator?** |
|---|---|---|---|---|
| **Azure Standard Blob** | Large file, bandwidth intensive workloads | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| **Azure Premium Blob** | Data sets with many medium-sized files and mixed file sizes | Good for traditional (file) and cloud-native (REST) HPC appsEasy to access, share, manage datasetsWorks with all accelerators | Pay for what you use | Core Storage |
| **Azure Premium Files** | Smaller scale (<1k cores), IOPS/latency good for medium sized files (>512 KiB) | Easy integration with Linux (NFS) and Windows (SMB), but can't use both NFS+SMB to access the same data | Pay for what you provision | Core Storage |
| **Azure NetApp Files** | Midrange jobs (1k-10k cores), IOPS+latency good for small-file datasets (<512 KiB), excellent for small, many-file workloads | Easy to integrate for Linux and Windows, supports multiprotocol for workflows using both Linux + Windows | Pay what you provision | Either |
| **Azure Managed Lustre** | All job sizes (1k - >10k cores) IOPS/latency for 1000s of medium-sized files (>512 KiB), best for bandwidth-intensive read + write workloads | Lustre, CSI | Pay for what you provision | Durable enough to run as standalone (core) storage, most cost-effective as an accelerator |

### Core storage price comparison

In order of most to least expensive, the core storage option prices are: Azure NetApp Files > Azure Premium Blob and Azure Premium Files > Azure Standard Blob.

