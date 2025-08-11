---
title: Target selection
author: bapic
ms.date: 08/11/2025
---

# Target selection

Microsoft Azure offers several storage services such as Azure Files, Blob and Azure NetApp Files and Managed Disks (for VMs). In addition, there are ISV partners who offer software-defined versions of on-premises Storage platforms for block, file, and object workloads that are built on our core Storage services. Each of these has their own price/performance tires and service limits. It is recommended to **evaluate your requirements (captured during assessment) against these service capacities and limits**. If you already have an enterprise landing zone, or planning for one, do also evaluate the overall scale and limitations across subscriptions, the structure and the corresponding limits.

> **! Pro Tip**
> - It is hard to change target service later (due to added time, complexity and efforts involved). Hence, plan & decide the appropriate Azure storage service during this phase. Choose based on performance, cost, resiliency, security and feature needs.
> - For common storage scenarios involving block, file and object, please review [**Choose an Azure storage service**](/azure/architecture/guide/technology-choices/storage-options) article to learn which Azure storage service fits your needs.

Mentioned below are key target storage service capabilities and limits that you must evaluate against your requirements. This includes but is not limited to:

1. Technical
   - Protocol support
   - Scale & performance targets - throughput/IOPS limits, file size, volume size, file per volume/directory, hierarchical file structure
   - Replication & geo-replication needs
   - Tiering
   - Retention period support
   - Backup, recovery and ransomware protection
   - Security capabilities
   - Reliability of the system, SLA, RPO, RTO
   - Service availability in various Azure regions
   - Compliance needs support
   - Specific features -ex., additional data streams
   - Support for integration
   - Feature extensibility

1. Perform a cost analysis using Azure Pricing Calculator to compare pricing models
2. Consider any non-Microsoft solutions/ISV solutions already in use on-premises and check the availability of similar or such solutions on Azure and its feature parity. You can find our partner solutions at <https://aka.ms/azurestoragepartners>.
3. It is also advisable to test the capabilities of the target services against your use cases before executing a full migration.

To gain a more detailed view with broad performance, scale, protocol and cost limits for various Azure storage services, please review each product specific documentation performance and scale targets. Weigh in your requirements against these values to decide on the target services.

Migration of unstructured data mostly includes following scenarios:

- File migration from network attached storage (NAS) to one of the Azure file offerings- [Azure Files](https://azure.microsoft.com/services/storage/files/), [Azure NetApp Files](https://azure.microsoft.com/services/netapp/), [independent software vendor (ISV) solutions](/azure/storage/solution-integration/validated-partners/primary-secondary-storage/partner-overview)
- Object migration from object storage solutions to the Azure object storage platform - [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/), [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/).

For evaluating current limits of some of the key storage services, and to determine whether you need to modify your choices based on them, see:

- [Storage account limits](/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Blob Storage limits](/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Azure Files scalability and performance targets](/azure/storage/files/storage-files-scale-targets)
- [Azure NetApp Files resource limits](/azure/azure-netapp-files/azure-netapp-files-resource-limits)

If any of the limits pose a blocker for using a service, Azure supports several storage vendors that offer their solutions on Azure Marketplace. For information about validated ISV partners that provide file services, see [Azure Storage partners for primary and secondary storage](/azure/storage/solution-integration/validated-partners/primary-secondary-storage/partner-overview).

> **!Pro Tip**
> - Migrating a SMB/NFS NAS to Azure, the likely targets are Azure Files or ANF. There are, however, other options which include Azure Blob Storage (NFS 3.0), Windows or Linux Azure VM with disks attached, AKS with persistent volumes for containerized workloads, File server cluster on Azure VMs or other NAS appliances in Azure (NetApp ONTAP, Nasuni, Qumulo, Dell PowerScale).<br>
> - Migrating S3 object data to Azure Blob (using Azure Storage Mover, AzCopy or partner/ISV tools),the application layer requires deliberate changes. Azure Blob Storage does not natively support the S3 API, so applications must be updated to use Azure's native APIs for the migration to complete.
> - If migrating to VMs or databases, targeting Azure VM + Managed Disks, often orchestrated via *Azure Migrate* or other *partner solutions*.

#### See also

Here are additional resources for your reference.

- [Choose an Azure storage service - Azure Architecture Center | Microsoft Learn](/azure/architecture/guide/technology-choices/storage-options)
- [Azure Managed Disks (and Azure VMs)](/azure/virtual-machines/managed-disks-overview)
- Design guides:
  - [Architecture Best Practices for Azure Blob Storage ](/azure/well-architected/service-guides/azure-blob-storage)
  - [Architecture Best Practices for Azure Files ](/azure/well-architected/service-guides/azure-files)
  - [Architecture Best Practices for Azure Disk Storage   ](/azure/well-architected/service-guides/azure-disk-storage)
- Scalability & Performance: [Blob storage ](/azure/storage/blobs/storage-performance-checklist), [Azure Files and Azure NetApp Files](/azure/storage/files/storage-files-netapp-comparison),  [Azure Virtual Machines](/azure/virtual-machines/disks-scalability-targets) 
- [Azure Storage pricing ](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/?msockid=0efcd8cf38ca66710905cc0b3922673d)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?msockid=0efcd8cf38ca66710905cc0b3922673d)
- [Compare NFS access to Azure Files, Blob Storage, and Azure NetApp Files | Microsoft Learn](/azure/storage/common/nfs-comparison)
- [Azure Files and Azure NetApp Files comparison | Microsoft Learn](/azure/storage/files/storage-files-netapp-comparison)
- [Introduction to Blob (object) Storage - Azure Storage | Microsoft Learn](/azure/storage/blobs/storage-blobs-introduction)
- [Partner Solutions](https://aka.ms/azurestoragepartners) and [File Storage Solution Comparison](https://aka.ms/NASinAzure)