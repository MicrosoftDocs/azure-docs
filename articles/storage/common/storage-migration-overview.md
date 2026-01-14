---
title: Azure Storage migration guide
description: Storage migration overview guide describes basic guidance for storage migration 
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
# Customer intent: "As a data engineer, I want to migrate unstructured and block-based data to Azure storage solutions, so that I can ensure seamless data accessibility and optimize storage cost and performance for my applications."
---

<!--
67 (1654/66)
95 (1766/6 false positive)
-->

# Migrating your data to Azure - overview

Migrating data and storage-intensive workloads to Azure enables access to scalable and secure cloud storage, enabling rapid innovation and growth. This document provides clear, practical guidance to help you achieve seamless migration of block, file, and object storage. It outlines various considerations, provides key metrics, describes relevant Azure storage services, and assists with tools selection.

## Background

<Details>
  <summary>Select to expand/contract this section</summary>

Various business and technical requirements dictate your overall Azure migration strategy. To capture specific requirements for your use cases so that appropriate architectural and technical design decisions can be made, the [**Microsoft Well-architected Framework**](/azure/well-architected/) (WAF) includes essential sets of guidance for all workload and service migrations. When followed, the process addresses reliability, security, cost optimization, operational excellence, and performance efficiency. Recommended best practices include reviewing both the WAF guidance and the following information to build a comprehensive migration approach for your specific applications and services.

> [!NOTE]
> The guidance that follows includes information specific to unstructured data migration to Azure Storage services. Scenarios involving structured data such as SQL, Oracle, or Tables and aren't covered in this document.

This guidance focuses specifically on migrating unstructured data to Azure Storage services. The content takes a data migration-centric approach, so subjects such as operational excellence and cost optimization might require separate, in-depth discussions. Scenarios involving structured data such as SQL, Oracle, or Tables introduce extra considerations that vary depending on the application. 

The following content doesn't supersede or invalidate any methodologies, frameworks, or recommendations outlined in other official Microsoft documentation.
</Details>

## Migration stages and activities

A complete migration consists of different stages including ***assessment, target selection, planning, tools selection, migration execution.*** By following a stage wise approach, data can be migrated to Azure with reduced downtime and risk. Each step ensures all necessary parameters are covered, and the most appropriate approach for **disk**, **file**, and **object** data is selected.

### Assessment

<Details>
  <summary>Select to expand/contract this section</summary>

In this stage, you determine and inventory all sources that need to be migrated like Server Message Block (SMB) shares, Network File System (NFS) volumes, or object namespaces. The entire process typically involves:

- Creating a catalog, or inventory, of all data assets and sources of data.
- Identifying and understanding data types and access patterns.
- Understanding reliability, performance, and business requirements of the data.
- Assessing replication, change rate, and resiliency and downtime tolerance.
- Understanding security and compliance requirements.

You can either perform this phase manually or use automated tools. There are several commercial tools available from Independent Software Vendors (ISVs) that can help with the assessment phase. For more information, see the [comparison matrix](../solution-integration/validated-partners/data-management/migration-tools-comparison.md) article.

[Read more](storage-migration-assessment.md) on assessment stage activities.

</Details>

### Target selection

<Details>
  <summary>Select to expand/contract this section</summary>

It's essential to understand the available options that can meet the requirements identified during the assessment stage. Microsoft Azure offers several storage services such as Azure Files, Blob Storage, Azure NetApp Files, and Managed Disks for virtual machines (VMs). In addition, there are ISV partners who offer software-defined versions of on-premises Storage platforms for block, file, and object workloads that are built on our core storage services.

This stage primarily includes the following activities:

- Assessing technical requirements to identify the best fit target Azure storage service
- Establishing the appropriate target solution architecture (based on your application or workload) with the identified storage solution.
- Evaluating pricing and costs involved in migration and target solution

[Read more](storage-migration-target-selection.md) on target selection stage activities.

</Details>

### Planning migration strategy

<Details>
  <summary>Select to expand/contract this section</summary>

Planning a migration strategy involves identifying a suitable method with which to move the data to Azure. It might also include other considerations appropriate to specific workloads, the nature of the data, or the applications involved. The following list includes some examples of these considerations:

- Online vs. offline transfer
- Feasibility of a lift and shift migration
- Data change rate and tiering
- Hybrid storage needs and data movement
- Replication as a strategy
- Backup and restore as a migration strategy

[Read more](storage-migration-plan-strategy.md) on Migration planning strategy.

</Details>

### Select migration tools

There are various migration tools available to help you perform your migration. For example, some open source tools include AzCopy, robocopy, xcopy, and rsync. Microsoft offers managed tools such as Azure Storage Mover, Azure Data box, Azure File Sync, Azure Migrate, and Data Box Gateway. There are also many other commercial, non-Microsoft tools available. A list of available commercial tools is available within our [comparison matrix](../solution-integration/validated-partners/data-management/migration-tools-comparison.md) article, which also provides comparisons between them.

The following table provides a selection of scenario-based migration tools for your reference. Although feasible alternatives might exist on a case-by-case basis, the following examples are considered the most suitable.

| **Scenario** | **Recommended tool(s)** |
|--------------|-------------------------|
| - Need for a fully managed, automated, resilient tool with single management pane (in Azure);<br>- File or file share migration beyond small transfers, typically > 1 TB of data, scaling up to millions of files or objects<br>- Lift and shift and/or continuous sync from on-premises NAS<br>- Windows file servers with no Azure File Sync installed or already configured<br>- Migrate to Azure involving: <br> - SMB (2.x, 3.x) to Azure Blob (Hot/Cold) or ADLS with HNS (hierarchical namespace service) enabled<br> -	 SMB (2.x, 3.x) to Azure Files (SMB only)<br> -	NFS (v3, v4.1) to Azure Blob (Hot/Cold) or ADLS with HNS enabled (NFS v3 only)<br> -	One time or continuous (including multicloud environments)<br> -	S3 to Azure Blob (Hot/Cold) or ADLS (hierarchical namespace)<br> -	"Metadata-only" copy functionality, requiring only the copy of file metadata or structure without file contents (seeding permissions or doing dry-run migrations, for example)<br> | [Azure Storage Mover](../../storage-mover/service-overview.md) |
|-	Offline data transfer (low bandwidth or no network connectivity, remote sites) <br> -	Copy from on-premises SMB/NFS shares/NAS sources to Azure Blob, Files, ADLS, to specific tiers directly, including direct import to a different region (outside source country/region).<br> -	Offline transfer from Azure Files, Premium FileStorage, Blob (Hot/Cold) to On-premises<br> -	Offline transfer of on-premises HDFS to Azure Blob (Hot/Cold) or ADLS (HNS enabled)| [Azure Data Box](../../databox/data-box-overview.md)|
| - Need to transfer large amounts of data in a short period through both offline and online solutions. <br> - Offline seeding of initial bulk data due to network constraints followed by delta sync.| Azure Data Box for seeding with Azure Storage Mover for delta sync |
| - Physical machines, VMs, and their attached disks; VMs running in Hyper-V, VMware, AWS, GCP. | [Azure Migrate](../../migrate/migrate-services-overview.md) |
| - Rapid, one-off, or incremental, small to medium scale data transfer (typically < 1 TB per job) to or from Azure<br> - Service-to-service (files-to-files, files-to-blob, etc.) transfers over Azure backbone (intra-Azure)<br> - Scripting capability requirement (filtering criteria, metadata updates, or any transformation, for example) and precise control for such transfers<br> - Doesn't involve millions of files or objects transfer<br> -	Local file system, SMB, NFS mounts to Azure<br> -	S3 to Azure Blob (typically < 1 TB)<br> - AWS EFS or AWS FSx for Windows to Azure Files<br> -	Google Cloud Storage (S3, GCS API) to Azure Storage (blob), ADLS (HNS enabled) | [AzCopy](storage-use-azcopy-v10.md) (always uses HTTPS REST APIs) |
| - Windows File Server source (SMB 2.x or 3.x to Azure Files) <br> - Hybrid data sync with reverse or bi-directional file sync <br> - Centralized file server management with on-premises cache and cloud tiering <br> - Collaboration and teamwork with branch-out deployments (multi-site access and sync)<br> -	Cloud-side backup with business continuity and disaster recovery along with on-premises cache presence<br> - One time file shares migration need with Azure File Sync already deployed and configured  | [Azure File Sync](../file-sync/file-sync-introduction.md) |
|- Continuous ingestion and cloud tiering requirements to Azure storage (Blob) with on-premises cache <br> -	Source is on-premises (NFS v3, 4.1 or SMB 2.x, 3.x) (One-way sync) or bi-directional (with manual sync) to or from Azure<br> - No need for multiple on-premises copies of that data kept in sync (one-way) | [Azure Data Box Gateway](../../databox-gateway/data-box-gateway-overview.md) |
| - Small scale, one-off transfers with custom scripting, or Linux/Windows CLI based migrations | [AzCopy](storage-use-azcopy-v10.md), rsync, Robocopy |
| - Complex data management, analytics, tiering, or unsupported use cases and targets (ANF or Lustre, for example) beyond Azure native tooling capabilities | [ISV Tools](../solution-integration/validated-partners/data-management/migration-tools-comparison.md) (Komprise, Cirata, Data Dynamics, Atempo) |
| - Large archive data migration from on-premises Tapes to Azure storage | See the [tape migration guide](tape-migration-guide.md) and explore partner solutions such as Tape Ark |
| - Large on-premises backup or archive using ISV solutions (Commvault, Veeam, or RUbrik, for example)<br> - Offline seeding with delta sync by backup tool. | Use partner specific recommendations; <br> [Azure Data Box](../../databox/data-box-overview.md) with an [ISV solution](../solution-integration/validated-partners/backup-archive-disaster-recovery/partner-overview.md) |
| - Other scenarios including: <br> - on-premises NAS to Azure Files (except via Data Box data copy service)<br> - on-premises Linux to Azure Files NFS <br> - AWS EFS/FSx/S3 to Azure Files <br> - GCP FileStorage to Azure Files | - [ISV Tools](../solution-integration/validated-partners/data-management/migration-tools-comparison.md) (Komprise, Cirata, Data Dynamics, Atempo) <br> OR <br> - Mount the source on a client and use Azure Storage Mover or AzCopy |

[Read more](storage-migration-tools.md) about migration tools and choices.

### Migration execution

<Details>
  <summary>Select to expand/contract this section</summary>

The migration phase is the final migration step. This step performs the data movement and migration operations. Typically, the migration phase consists of an initial replication or bulk migration, followed by several incremental synchronization iterations before the final cutover. This approach generally accomplishes a smoother and more efficient switchover.

The duration of an unstructured data migration depends on several aspects. Outside of the chosen method, the most critical factors are the total size of the data and the file size distribution. The larger the total data set, the longer the migration time required. The smaller the average file size, the longer the migration time required. If you have a large number of small files, consider archiving them within larger files (compress to .tar or .zip files), if feasible, to reduce the total migration time.

[Read more](storage-migration-execution.md) on migration execution.

</Details>

#### Migration of block-based devices

<Details>
  <summary>Select to expand/contract this section</summary>

Migration of block-based devices is typically undertaken as part of virtual machine or physical host migration. Delaying block storage decisions until after a migration completes is a common mistake. Making these decisions ahead of time with a thorough understanding of workload requirements leads to a smoother migration to the cloud.

Migration of block-based devices can be accomplished in two ways:

- Migration of full virtual machines together with the underlying block-based devices. 
- Migration of block based devices only.

For help migrating VMs with their underlying block devices, see the [Azure Migrate](../../migrate/concepts-overview.md) documentation. For more complexed use cases, use [Cirrus Migrate Cloud](../solution-integration/validated-partners/data-management/cirrus-data-migration-guide.md).


To explore workloads suitable for migration and their appropriate approaches, see the [Disk Storage product page](https://azure.microsoft.com/services/storage/disks/) and the [Azure Disk types](/azure/virtual-machines/disks-types) article. You can learn about which disks best fit your requirements, and the latest capabilities such as [disk bursting](/azure/virtual-machines/disk-bursting).

</Details>

## See also

- [Choose an Azure solution for data transfer](storage-choose-data-transfer-solution.md)
- [Compare commercial migration tools](../solution-integration/validated-partners/data-management/migration-tools-comparison.md)
- [Migrate to Azure file shares](../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate](/samples/azure/azreplicate/azreplicate/)
