---
title: Azure Storage migration guide
description: Storage migration overview guide describes basic guidance for storage migration 
author: dukicn
ms.author: nikoduki
ms.topic: conceptual 
ms.date: 03/31/2021
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

# Azure Storage migration overview

This article focuses on storage migrations to Azure and provides guidance on the following storage migration scenarios:

- Migration of unstructured data, such as files and objects
- Migration of block-based devices, such as disks and storage area networks (SANs)

## Migration of unstructured data

Migration of unstructured data includes following scenarios:

- File migration from network attached storage (NAS) to one of the Azure file offerings:
  - [Azure Files](https://azure.microsoft.com/services/storage/files/)
  - [Azure NetApp Files](https://azure.microsoft.com/services/netapp/)
  - [independent software vendor (ISV) solutions](../solution-integration/validated-partners/primary-secondary-storage/partner-overview.md).
- Object migration from object storage solutions to the Azure object storage platform:
  - [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/)
  - [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/).

### Migration phases

A full migration consists of several different phases: discovery, assessment, and migration.

| Discovery | Assessment | Migration |
| --------- | ---------- | --------- |
| - Discover sources to be migrated | - Assess applicable target service <br> - Technical vs. cost considerations | - Initial migration <br> - Resync <br> - Final switch over |

#### Discovery phase

In the discovery phase, you determine all sources that need to be migrated like SMB shares, NFS exports, or object namespaces. You can do this phase manually, or use automated tools.

#### Assessment phase

The assessment phase is critical in understanding available options for the migration. To reduce the risk during migration, and to avoid common pitfalls follow these three steps:

| Assessment phase steps                     | Options                                                                          |
|--------------------------------------------|----------------------------------------------------------------------------------|
| **Choose a target storage service**            | - Azure Blob Storage and Data Lake Storage<br>- Azure Files<br>- Azure NetApp Files<br>- ISV solutions |
| **Select a migration method**                  | - Online<br>- Offline<br> - Combination of both                                  |
| **Choose the best migration tool for the job** | - Commercial tools (Azure and ISV)<br> - Open source

There are several commercial (ISV) tools that can help with the assessment phase. See the [comparison matrix](../solution-integration/validated-partners/data-management/migration-tools-comparison.md).

##### Choose a target storage service

Choosing a target storage service depends on the application or users who access the data. The correct choice depends on both technical and financial aspects. First, do a technical assessment to assess possible targets and determine which services satisfy the requirements. Next, do a financial assessment to determine the best choice.

To help select the target storage service for the migration, evaluate the following aspects of each service:

- Protocol support
- Performance characteristics
- Limits of the target storage service

The following diagram is a simplified decision tree that helps guide you to the recommended Azure file service. If native Azure services do not satisfy requirements, a variety of [independent software vendor (ISV) solutions](../solution-integration/validated-partners/primary-secondary-storage/partner-overview.md) will.

After you finish the technical assessment, and select the proper target, do a cost assessment to determine the most cost-effective option.

![Basic decision tree on choosing the correct file service](./media/storage-migration-overview/files-decision-tree.png)

To keep the decision tree simple, limits of the target storage service aren't incorporated in the diagram. To find out more about current limits, and to determine whether you need to modify your choices based on them, see:

- [Storage account limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits)
- [Blob Storage limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-blob-storage-limits)
- [Azure Files scalability and performance targets](../files/storage-files-scale-targets.md)
- [Azure NetApp Files resource limits](../../azure-netapp-files/azure-netapp-files-resource-limits.md)

If any of the limits pose a blocker for using a service, Azure supports several storage vendors that offer their solutions on Azure Marketplace. For information about validated ISV partners that provide file services, see [Azure Storage partners for primary and secondary storage](../solution-integration/validated-partners/primary-secondary-storage/partner-overview.md).

##### Select the migration method

There are two basic migration methods for storage migrations.

- **Online**. The online method uses the network for data migration. Either the public internet or [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) can be used. If the service doesn't have a public endpoint, you must use a VPN with public internet.
- **Offline.** The offline method uses one of the [Azure Data Box](https://azure.microsoft.com/services/databox/) devices.

The decision to use an online method versus an offline method depends on the available network bandwidth. The online method is preferred in cases where there's sufficient network bandwidth to perform a migration within the needed timeline.

It's possible to use a combination of both methods, offline method for the initial bulk migration and an online method for incremental migration of changes. Using both methods simultaneously requires a high level of coordination and isn't recommended for this reason. If you choose to use both methods isolate the data sets that are migrated online from the data sets that are migrated offline.

For more information about the different migration methods and guidelines, see [Choose an Azure solution for data transfer](./storage-choose-data-transfer-solution.md) and [Migrate to Azure file shares](../files/storage-files-migration-overview.md).

##### Choose the best migration tool for the job

There are various migration tools that you can use to perform the migration. Some are open source like AzCopy, robocopy, xcopy, and rsync while others are commercial. List of available commercial tools and comparison between them is available on our [comparison matrix](../solution-integration/validated-partners/data-management/migration-tools-comparison.md).

Open-source tools are well suited for small-scale migrations. For migration from Windows file servers to Azure Files, Microsoft recommends starting with Azure Files native capability and using [Azure File Sync](/windows-server/manage/windows-admin-center/azure/azure-file-sync). For more complex migrations consisting of different sources, large capacity, or special requirements like throttling or detailed reporting with audit capabilities, commercial tools are the best choice. These tools make the migration easier and reduce the risk significantly. Most commercial tools can also perform the discovery, which provides a valuable input for the assessment.

#### Migration phase

The migration phase is the final migration step that does data movement and migration. Typically, you'll run through the migration phase several times to accomplish an easier switchover. The migration phase consists of the following steps:

1. **Initial migration.** The initial migration step migrates all the data from the source to the target. This step migrates the bulk of the data that needs to be migrated.
2. **Resync.** A resync operation migrates any data that was changed after the initial migration step. You can repeat this step several times if there are numerous changes. The goal of running multiple resync operations is to reduce the time it takes for the final step. For inactive data and for data that has no changes (like backup or archive data), you can skip this step.
3. **Final switchover**. The final switchover step switches the active usage of the data from the source to the target and retires the source.

The duration of the migration for unstructured data depends on several aspects. Outside of the chosen method, the most critical factors are the total size of the data and file size distribution. The bigger the total data set, the longer the migration time. The smaller the average file size, the longer the migration time. If you have a large number of small files consider archiving them in larger files (like to a .tar or .zip file), if applicable, to reduce the total migration time.

## Migration of block-based devices

Migration of block-based devices is typically done as part of virtual machine or physical host migration. It's a common misconception to delay block storage decisions until after the migration. Making these decisions ahead of time with appropriate considerations for workload requirements leads to a smoother migration to the cloud.

To explore workloads to migrate and approach to take, see the [Azure Disk Storage documentation](../../virtual-machines/disks-types.md), and resources on the [Disk Storage product page](https://azure.microsoft.com/services/storage/disks/#resources). You can learn about which disks fit your requirements, and the latest capabilities such as [disk bursting](../../virtual-machines/disk-bursting.md). Migration of block based devices can be done in two ways:
- For migration of full virtual machines together with the underlying block-based devices, see the [Azure Migrate](../../migrate/index.yml) documentation
- For migration of block based devices only, and more complexed use cases, use [Cirrus Migrate Cloud](../solution-integration/validated-partners/data-management/cirrus-data-migration-guide.md).

## See also

- [Choose an Azure solution for data transfer](./storage-choose-data-transfer-solution.md)
- [Commercial migration tools comparison](../solution-integration/validated-partners/data-management/migration-tools-comparison.md)
- [Migrate to Azure file shares](../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](./storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate](/samples/azure/azreplicate/azreplicate/)
