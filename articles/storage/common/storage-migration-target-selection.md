---
title: Azure migration guidance storage target selection
description: The storage migration target selection guide describes basic guidance for the storage migration's target selection phase.
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

<!--
76 (744/17)
92 (787/3 false-positives)
-->

# Target selection

Microsoft Azure offers several storage services, such as Azure Files, Blob, Azure NetApp Files, and Managed Disks for virtual machines (VMs). In addition, there are independent software vendors partners (ISVs) who offer software-defined versions of on-premises storage platforms. These versions include block, file, and object workloads that are built on Azure core storage services. Each of these ISV offerings has their own price and performance tiers, and service limits. It's important that you evaluate the requirements captured during the assessment phase against these service capacities and limits. 

If you already have an enterprise landing zone, or planning for one, you should also evaluate the overall scale and limitations across subscriptions, the structure, and  corresponding limits.

> [!IMPORTANT]
> It's difficult to change target services post-migration due to time and complexity constraints, and the level of effort expended. Therefore, it's important to plan and decide the appropriate Azure storage service during this phase. 
> 
> Your choice should be based on performance, cost, resiliency, security, and feature requirements.
>
> For common scenarios involving block, file, and object storage, review the [**Choose an Azure storage service**](/azure/architecture/guide/technology-choices/storage-options) article to learn which Azure storage service best fits your needs.

The following are key target storage service capabilities and limits that you should evaluate against your requirements. These capabilities and limits include, but aren't limited to:

- Protocol support.
- Scale and performance targets, such as throughput and IOPS limits, file and volume size, files per volume or directory, and hierarchical file structure.
- Replication and geo-replication needs.
- Tiering.
- Retention period support.
- Backup, recovery and ransomware protection.
- Security capabilities.
- Reliability of the system, SLA, RPO, RTO.
- Service availability in various Azure regions.
- Compliance needs support.
- Specific features, such as alternate data streams.
- Support for integration.
- Feature extensibility.

1. Perform a cost analysis using Azure Pricing Calculator to compare pricing models
2. Consider any non-Microsoft solutions/ISV solutions already in use on-premises and check the availability of similar or such solutions on Azure and its feature parity. You can find our partner solutions at [https://aka.ms/azurestoragepartners](https://aka.ms/azurestoragepartners).
3. Test the capabilities of the target services against your use cases before executing a full migration.

To gain a more detailed view with broad performance, scale, protocol, and cost limits for various Azure storage services, review each product's specific documentation for performance and scale targets. Choose the target services for your workloads by comparing your requirements against these values.

Migration of unstructured data primarily includes following scenarios:

- File migration from network attached storage (NAS) to one of the Azure file offerings- [Azure Files](https://azure.microsoft.com/services/storage/files/), [Azure NetApp Files](https://azure.microsoft.com/services/netapp/), [independent software vendor (ISV) solutions](../solution-integration/validated-partners/primary-secondary-storage/partner-overview.md).
- Object migration from object storage solutions to the Azure object storage platform - [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/), [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/).

For evaluating current limits of some of the key storage services, and to determine whether you need to modify your choices based on them, see:

- [Storage account limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#standard-storage-account-limits)
- [Blob Storage limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-blob-storage-limits)
- [Azure Files scalability and performance targets](../files/storage-files-scale-targets.md)
- [Azure NetApp Files resource limits](../../azure-netapp-files/azure-netapp-files-resource-limits.md)

If any of the limits prevent you from using a specific service, there are several storage vendors that offer their solutions on Azure Marketplace. For information about validated ISV partners that provide file services, see [Azure Storage partners for primary and secondary storage](../solution-integration/validated-partners/primary-secondary-storage/partner-overview.md).

> [!TIP]
> When you migrate an SMB or NFS NAS to Azure, the likely targets are either Azure Files or Azure NetApp Files. There are, however, other options that include:
>
> - Azure Blob Storage, which supports NFS 3.0.
> - Windows or Linux Azure VMs with attached disks.
> - AKS with persistent volumes for containerized workloads.
> - File server cluster on Azure VMs or other NAS appliances in Azure. For example, NetApp ONTAP, Nasuni, Qumulo, and Dell PowerScale.
> - Migrating S3 object data to Azure Blob using Azure Storage Mover, AzCopy, or partner/ISV tools. The application layer requires deliberate changes. Azure Blob Storage doesn't natively support the S3 API, so applications must be updated to use Azure's native APIs for the migration to complete.
> - Azure VM with Managed Disks, often orchestrated via *Azure Migrate* or other *partner solutions* when migrating to VMs or databases.

#### See also

- [Choose an Azure storage service - Azure Architecture Center | Microsoft Learn](/azure/architecture/guide/technology-choices/storage-options)
- [Azure Managed Disks and Azure VMs](/azure/virtual-machines/managed-disks-overview)
- Design guides:
  - [Architecture Best Practices for Azure Blob Storage](/azure/well-architected/service-guides/azure-blob-storage)
  - [Architecture Best Practices for Azure Files](/azure/well-architected/service-guides/azure-files)
  - [Architecture Best Practices for Azure Disk Storage](/azure/well-architected/service-guides/azure-disk-storage)
- Scalability & Performance: [Blob storage](/azure/storage/blobs/storage-performance-checklist), [Azure Files and Azure NetApp Files](/azure/storage/files/storage-files-netapp-comparison),  [Azure Virtual Machines](/azure/virtual-machines/disks-scalability-targets) 
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/?msockid=0efcd8cf38ca66710905cc0b3922673d)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?msockid=0efcd8cf38ca66710905cc0b3922673d)
- [Compare NFS access to Azure Files, Blob Storage, and Azure NetApp Files](../common/nfs-comparison.md)
- [Azure Files and Azure NetApp Files comparison | Microsoft Learn](../files/storage-files-netapp-comparison.md)
- [Introduction to Blob (object) Storage - Azure Storage | Microsoft Learn](../blobs/storage-blobs-introduction.md)
- [Partner Solutions](https://aka.ms/azurestoragepartners) and [File Storage Solution Comparison](https://aka.ms/NASinAzure)
