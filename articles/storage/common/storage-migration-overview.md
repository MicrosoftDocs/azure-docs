---
title: Azure Storage migration guide
description: Storage migration overview guide describes basic guidance for storage migration 
author: bapic
ms.author: bapic
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
# Customer intent: "As a data engineer, I want to migrate unstructured and block-based data to Azure storage solutions, so that I can ensure seamless data accessibility and optimize storage cost and performance for my applications."
---

# Migrating your data to Azure - Overview

Migrating data and storage-intensive workloads to Azure enables access to powerful, scalable, and secure cloud storage, supporting rapid innovation and growth. This document provides clear, practical guidance for seamless migration of block, file, and object storage, highlighting various considerations, key metrics, Azure storage services, and tools selection.

## Background

<Details>
  <summary>Click to expand/contract this section</summary>

Migrating data to Azure is governed by various business and technical requirements. To capture specific requirements for your use cases so that appropriate architectural and technical design decisions can be made, [**Microsoft Well-architected Framework**](/azure/well-architected/) includes essential sets of guidance to follow for all workload and service migration. The process aims to address reliability, security, cost optimization, operational excellence, and performance efficiency. Reviewing the WAF guidance, along with the information provided here, is recommended for a comprehensive migration approach for your application and service.

**The guidance that follows includes very specific information to migrate unstructured data to Azure Storage services only.** It takes a very ‘*data migration'* centric approach and hence some of the key aspects of operational excellence and cost optimization may need greater discussions separately. The contents included below do not override the considerations, methodologies and frameworks established and mentioned in other Microsoft articles or documents.
</Details>

## Migration stages and activities

A complete migration consists of different stages including ***assessment, target selection, planning, tools selection, migration execution.*** By following a stage wise approach, data can be migrated to Azure with reduced downtime and risk. Each step ensures all necessary parameters are covered, and the most appropriate approach for **disk**, **file**, and **object** data is selected.

### Assessment

<Details>
  <summary>Click to expand/contract this section</summary>

In this stage, you determine & inventory all sources that need to be migrated like SMB shares, NFS volumes, or object namespaces. The entire process typically involves:

- Creating a catalogue, inventory of all data assets and sources of data
- Identify & understand data types, access patterns
- Understand reliability, performance and business requirements of the data
- Assess replication, change rate, resiliency & downtime tolerance
- Security and compliance requirements.

You can do this phase manually or use automated tools. There are several commercial (ISV) tools that can help with the assessment phase. See the [comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison).

[Read more](1-Assessment-stage.md) on assessment stage activities.

</Details>

### Target selection

<Details>
  <summary>Click to expand/contract this section</summary>

This phase is essential to understand the available options that match your requirements identified during the assessment stage. Microsoft Azure offers several storage services such as Azure Files, Blob and Azure NetApp Files and Managed Disks (for VMs). In addition, there are ISV partners who offer software-defined versions of on-premises Storage platforms for block, file, and object workloads that are built on our core Storage services.

This stage primarily includes the below activities:

- Assess technical requirements to identify the best fit target Azure storage service
- Establish the appropriate target solution architecture (based on your application or workload) with the identified storage solution.
- Evaluating pricing and costs involved in migration and target solution

[Read more](2-Target-selection.md) on target selection stage activities.

</Details>

### Planning migration strategy

<Details>
  <summary>Click to expand/contract this section</summary>

Planning a migration strategy involves identifying a suitable method to move the data to Azure. It may also include various other considerations such as the below, that is appropriate to the workloads, nature of the data or applications involved. 

- Determine online vs offline transfer
- Lift& shift data migration
- Data change rate and tiering
- Hybrid storge needs & data movement
- Replication as a strategy
- Backup and restore as a migration strategy

[Read more](3-Planning-migration-strategy.md) on Migration planning strategy.

</Details>

### Select migration tools

There are various migration tools that you can use to perform the migration. Some are open source like AzCopy, robocopy, xcopy, and rsync, some are managed and offered by Microsoft such as Azure Storage Mover, Azure Data box, Azure File Sync, Azure Migrate, Data Box Gateway, while others are commercial. List of available commercial tools and comparison between them is available on our [comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison).

Here is a scenario-based migration tools list for your reference. Although alternative choices may exist and could be decided otherwise in a case-to-case basis, we intend to present the most suitable ones as below.
<br>

| **Scenario** | **Recommended Tool(s)** |
|--------------|---|
| Need for a fully managed, automated, resilient tool with single management pane (in Azure);<br> File/file share migration beyond small transfers (typically > 1TB of data) scaling up to millions of files, objects; <br> Lift and shift and/or continuous sync from on-prem NAS,<br> Windows file servers with no Azure File Sync installed or already configured; <br> Migrate to Azure involving: <br>-	SMB (2.x, 3.x) to Azure Blob (Hot/Cold) or ADLS with HNS (hierarchical namespace service) enabled <br> -	SMB (2.x, 3.x) to Azure Files (SMB only) <br> -	NFS (v3, v4.1) to Azure Blob (Hot/Cold) or ADLS with HNS enabled (NFS v3 only) <br> -	One time or continuous (including multi-cloud environments) <br> -	S3 to Azure Blob (Hot/Cold) or ADLS (hierarchical namespace) <br> -	“Metadata-only” copy functionality, wherein, you need to copy only file metadata or structure without the file contents. (e.g., seeding permissions or doing dry-run migrations) <br> | [Azure Storage Mover](/azure/storage-mover/service-overview) |
|-	Offline data transfer (low bandwidth or no network connectivity, remote sites) <br> -	Copy from on-prem SMB/NFS shares/NAS sources to Azure Blob, Files, ADLS, to specific tiers directly, including direct import to a different region (outside source country).<br> -	Offline transfer from Azure Files, Premium FileStorage, Blob (Hot/Cold) to On-premises<br> -	Offline transfer of on-premises HDFS to Azure Blob (Hot/Cold) or ADLS (HNS enabled)| [Azure Data Box](/azure/databox/data-box-overview)|
|- Need to transfer very large amount of data in a short period by leveraging both offline and online solutions. <br> - Offline seeding of initial bulk data due to network constraints followed by delta sync.| Azure Data Box for seeding + Azure Storage Mover for delta sync|
|Physical machines, VMs and its attached disks; VMs running in Hyper-V, VMWare, AWS, GCP. |[Azure Migrate](/azure/migrate/migrate-services-overview)|
|Rapid, one-off or incremental, small to medium scale data transfer (typically < 1 TB per job) to/from Azure.<br> Service-service (files-files, files-blob etc) transfers over Azure backbone (intra Azure). <br> You require scripting capabilities (e.g., filtering criteria, metadata updates or any transformation) and precise control for such transfers;<br> Does not involve millions of files, objects transfer <br> -	Local file system, SMB, NFS mounts to Azure<br>-	S3 to Azure Blob (typically < 1 TB)<br>-	AWS EFS or AWS FSx for Windows to Azure Files<br>-	Google Cloud Storage (S3, GCS API) to Azure Storage (blob), ADLS (HNS enabled)|[AzCopy](/azure/storage/common/storage-use-azcopy-v10) (always uses HTTPS REST APIs)|
|Source: Windows File Server (SMB 2.x or 3.x to Azure Files) <br> - Hybrid data sync with reverse/bi-directional file sync <br> - Centralized file server management with on-prem cache and cloud tiering <br> - Collaboration and teamwork with branch-out deployments (multi-site access and sync)<br> -	Cloud-side backup with business continuity and disaster recovery along with on-prem cache presence; <br>- One time file shares migration need with Azure File Sync already deployed & configured  |[Azure File Sync](/azure/storage/file-sync/file-sync-introduction)|
|- Continuous ingestion and cloud tiering requirements to Azure storage (Blob) with on-prem cache <br>-	Source is on-prem (NFS v3, 4.1 or SMB 2.x, 3.x) (One-way sync) or bi-directional (with manual sync) to/from Azure.<br>-	You don’t need multiple on-prem copies of that data kept in sync (one-way)|[Azure Data Box Gateway](/azure/databox-gateway) |
|Very small scale, one-off transfers with custom scripting or Linux/Windows CLI based migrations|[AzCopy](/azure/storage/common/storage-use-azcopy-v10), [rsync](/azure/storage/common/storage-use-rsync), [Robocopy](/azure/storage/common/storage-use-robocopy)|
|Complex data management, analytics, tiering, or unsupported use cases and targets (e.g., ANF, Lustre) beyond what Azure’s native tools provide|[ISV Tools](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) (Komprise, Cirata, Data Dynamics, Atempo)|
|Large archive data migration from on-premises Tapes to Azure storage|[See guidance here](/azure/storage/common/tape-migration-guide); also see partner solution such as Tape Ark|
|- Large on-premises backup/archive using ISV solutions (e.g., Commvault, Veeam, Rubrik or other)<br>- Offline seeding with delta sync by backup tool. | Use partner specific recommendations; <br> [Azure Data Box](/azure/databox/data-box-overview) + [ISV solution](/azure/storage/solution-integration/validated-partners/backup-archive-disaster-recovery/partner-overview)|
|Other scenarios including: <br> - On-prem NAS to Azure Files (except via Data Box data copy service)<br> - On-prem Linux to Azure Files NFS <br> -AWS EFS/FSx/S3 to Azure Files <br> - GCP FileStorage to Azure Files|- [ISV Tools](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) (Komprise, Cirata, Data Dynamics, Atempo) <br> OR <br> - Mount the source on a client and use Azure Storage Mover or AzCopy|
|

[Read more](4-Select-migration-tools.md) on migration tools and choices.

### Migration execution

<Details>
  <summary>Click to expand/contract this section</summary>

The migration phase is the final migration step that does data movement and migration. Typically, you'll run through the migration phase several times to accomplish an easier switchover. The migration phase consists of an initial replication or bulk migration, incremental synchronization and final cutover.

The duration of the migration for unstructured data depends on several aspects. Outside of the chosen method, the most critical factors are the total size of the data and file size distribution. The bigger the total data set, the longer the migration time. The smaller the average file size, the longer the migration time. If you have a large number of small files, consider archiving them in larger files (like to a .tar or .zip file), if applicable, to reduce the total migration time.

[Read more](5-Migration-execution.md) on migration tools and choices.

</Details>


#### Migration of block-based devices

<Details>
  <summary>Click to expand/contract this section</summary>

Migration of block-based devices is typically done as part of virtual machine or physical host migration. It's a common misconception to delay block storage decisions until after the migration. Making these decisions ahead of time with appropriate considerations for workload requirements leads to a smoother migration to the cloud.

To explore workloads to migrate and approach to take, see the [Azure Disk Storage documentation](/azure/virtual-machines/disks-types), and resources on the [Disk Storage product page](https://azure.microsoft.com/services/storage/disks/). You can learn about which disks fit your requirements, and the latest capabilities such as [disk bursting](/azure/virtual-machines/disk-bursting). Migration of block-based devices can be done in two ways:

- For migration of full virtual machines together with the underlying block-based devices, see the [Azure Migrate](/azure/migrate/) documentation.
- For migration of block based devices only, and more complexed use cases, use [Cirrus Migrate Cloud](/azure/storage/solution-integration/validated-partners/data-management/cirrus-data-migration-guide).

</Details>

## See also

- [Choose an Azure solution for data transfer](/azure/storage/common/storage-choose-data-transfer-solution)
- [Commercial migration tools comparison](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison)
- [Migrate to Azure file shares](/azure/storage/files/storage-files-migration-overview)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](/azure/storage/blobs/migrate-gen2-wandisco-live-data-platform)
- [Copy or move data to Azure Storage with AzCopy](/azure/storage/common/storage-use-azcopy-v10)
- [Migrate large datasets to Azure Blob Storage with AzReplicate](/samples/azure/azreplicate/azreplicate/)
