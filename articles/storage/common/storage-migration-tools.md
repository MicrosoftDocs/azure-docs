---
title: Azure Storage migration tools selection guide
description: Azure Storage migration tools selection guide describes basic guidance for storage migration tools selection
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

<!--
  Initial score: 71 (2051/65)
  Current score: 95 (2667/10 false positives)
-->

# Select migration tools 

In this article, you learn about the various types of solutions that migrate data both online and offline. Some solutions also provide for repeatable sync, merge, and hybrid deployment capabilities. Often, these tools bring overlapping technical capabilities and are suitable for similar use cases. This article provides guidance on selecting the appropriate migration tool for your needs, and identifies both native Azure tools as well as partner and independent software vendor (ISV) solutions.

This article discusses the various scenarios for which each tool is best suited. It also provides a broad perspective on comparing and contrasting these tools.

## Online tools

### Online network transfer

Tools that provide online network transfer enable you to transfer your data to Azure over either your network connection or the public internet. This transfer can be done in many ways, and by using various tools.

#### Azure Storage Mover

Azure Storage Mover is a fully managed migration service that helps you to migrate terabyte to petabyte scale data to Azure storage over the network. Storage Mover is a hybrid cloud service, consisting of a cloud service component and an on-premises migration agent virtual machine (VM). Storage Mover is used for migration scenarios such as *lift-and-shift*, and for cloud migrations that you repeat periodically.

The following list highlights many of Storage Mover's key scenarios and capabilities, which might make it the recommended tool for some use cases.

* Consists of a fully managed, automated, resilient tool in Azure.
* A single Azure Storage Mover resource can manage and orchestrate multiple agents globally, providing visibility into all migrations within a single dashboard.
* Suitable for both relatively small data sizes of a few terabytes, and large petabyte scale-files, folders, and file shares. For one-off data transfers and small data sets of less than 1 terabyte, use `AzCopy` instead.
* Suitable for one-off transfers such as a lift-and-shift, or repeated, periodic syncs and transfers.
* Offers a simple, reliable process for which default configurations are sufficient.
* Preserves file metadata.
* Migration sources and destinations include:
    - Server Message Block (SMB) or Network File System (NFS) source to Azure Blob target
    - SMB Source to Azure Files target
    - S3 source to Azure Blob target
    - "Metadata-only" copy functionality, where only file metadata or structure is copied without the file contents. For example, seeding permissions or performing "dry-run" migrations.

You can read more about Azure Storage Mover in the [service overview](/azure/storage-mover/service-overview) article. The following articles can also help you utilize Azure Storage Mover for your cloud migration:

- [Become familiar with the Storage Mover resource hierarchy](../../storage-mover/resource-hierarchy.md)
- [Learn how to deploy a Storage Mover in your Azure subscription](../../storage-mover/storage-mover-create.md)
- [Learn how to deploy a Storage Mover agent in your environment](../../storage-mover/agent-deploy.md)

### Sync and tiering tools

#### Azure File Sync

Azure File Sync enables migrations of Windows file servers with near-zero downtime, and also provides a hybrid storage solution. Azure File Sync enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of a Windows file server. Azure File Sync is primarily a sync and tiering tool, while Storage Mover's primary function is as a migration service.

Choose Azure File Sync for traditional file server extensions and multi-site synchronization with Azure File shares. This option includes Entra ID integration and two-way sync. It also preserves New Technology File System (NTFS) permissions and attributes automatically. These capabilities make Azure File Sync an ideal approach if you want to keep an on-premises cache and utilize [cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md), or if your server must continue serving during your migration.

You can use any available Windows Server protocol to access your data locally, including SMB, NFS, and FTPS. You can also have as many caches as you need across the world. 

You can find all supported migration scenarios for File Sync within the [migration overview](../files/storage-files-migration-overview.md) article.

Learn more about [Azure File Sync](../file-sync/file-sync-introduction.md) and various [migration scenarios here](../files/storage-files-migration-overview.md).

#### Data Box Gateway

Data Box Gateway is a cloud storage solution that acts as a virtual device, enabling seamless one-way data transfer between your on-premises infrastructure and Azure. It consists of a VM in your local environment and connects to Azure via standard protocols like SMB or NFS.

The gateway caches and uploads data to Azure Blob or File Storage efficiently and securely. Data Box Gateway is a permanent, continual feed streaming gateway, ideal for hybrid cloud workflows.

Choose Data Box Gateway for one-way, high-volume data funneling to Azure, especially for NFS data or continuous feeds. Data Box Gateway is also the appropriate choice when you don't need multiple on-premises copies of your data kept in sync. Data Box Gateway's primary function is to move data offsite and into Azure quickly, especially for processing or archive. It also supports a manual sync option to refresh the on-premises share with the content from the Azure.

More detail on Azure Data Box gateway is available in the [Use Cases](/azure/databox-gateway/data-box-gateway-use-cases) article.

#### Azure Data Factory

Azure Data Factory (ADF) enables you to prepare and transform data from a wide variety of sources, including databases, data warehouses, lakehouses, and real-time streams. It then ingests this data into your network for further use. ADF is the ideal choice when you need one or more of the following features or capabilities:

- Custom workflows
- Data transformation during migration
- Complex or repeatable pipelines
- Migrating big data workloads, data lake, or enterprise data warehouse (EDW) to Microsoft Azure

Before beginning a migration using ADF, you should run a proof-of-concept (POC) to ensure the service meets your requirements due to the number of complexities involved. Several supported scenarios are discussed in the [ADF migration guidance](../../data-factory/data-migration-guidance-overview.md) article.

### Unmanaged tools

#### AzCopy

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. It's ideal for fast, scriptable, one-time transfers, particularly for object data or smaller file sets. AzCopy is an excellent choice if you need fine-grained control over your transfers, or need to implement automation via scripts. It's also useful for smaller transfers of data that can be completed within a relatively short timeframe. 

However, as an unmanaged tool, it can't automatically sync changes or keep track of transfer state. There is no error handling capability, so you need to manually review logs and retry any failed operations yourself. AzCopy might not be ideal for large-scale migrations involving billions of objects due to performance limitations, especially in listing and scanning.

> [!NOTE]
> AzCopy doesn't support "Metadata-only" copy in which only file metadata or structure is copied without the associated file contents. For example, seeding permissions or performing dry-run migrations are not supported. Instead, use Storage Mover for these types of use cases.

You can read more details on AzCopy in the [Getting started with AzCopy](../common/storage-use-azcopy-v10.md) article. 

### Partner solutions for specialized capabilities

#### Partner and independent software vendor (ISV) tools

If you need advanced features that native Azure tools don't cover, consider [Partner or ISV tools](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md). These features might include: 

- Alerting.
- Per-file handling.
- Deep assessments.
- Specialized source file systems.
- Policy-based moves.
- Delta sync with minimal cutover.
- Support for sources and capabilities.

For more details to help you choose the appropriate tool, review the [recommendations and capability matrix](#recommendations-and-capability-matrix) section provided.

## Offline tools 
Offline data transfer tools are used when you want to transfer large amounts of data to Azure without relying on your network connection. These tools are useful for scenarios where network bandwidth is limited, expensive, or unavailable. They allow you to physically ship data to Azure, which can significantly speed up the migration process.

Physical, shippable devices are an ideal choice when you want to perform a one-time offline bulk data transfer. These use cases involve copying data to either a disk or a specialized device, and shipping it to a secure Microsoft facility where the data is uploaded. You can purchase and ship your own disks, or you choose to order a Microsoft-supplied disk or device. Microsoft-supplied solutions for offline transfers include [Azure Data Box Next-Gen](../../databox/data-box-overview.md) and [Data Box Disk](../../databox/data-box-disk-overview.md).

**Azure Data Box and Data Box disk**

The underlying Azure Data Box service allows you to migrate data to your preferred Azure storage service offline. There are several key considerations for choosing to migrate using Azure Data Box. Azure Data Box is a logical choice when data copy over a network is constrained, too slow, too costly, or isn't an option. 

Because Data Box integrates well with other partner and ISV tools, you can use an approach known as *offline seeding*. After migrating an initial data set using Data Box, you can use online tools to more quickly sync file changes.

Azure Data Box supports direct cross-region data import, so your data source can reside in an entirely different region than your storage account. For example, this capability allows you to migrate data residing in the UK to a new destination in the US. This ability helps manage large migrations involving many geographies while avoiding costs for inter-region network charges.

The following examples highlight common use cases in which Azure Data Box might be the right choice:

- **When migrating your compute infrastructure using Azure Migrate**<br>By migrating unstructured data using offline mode, you can reduce time, cost, and network bandwidth utilization. This parallel execution can accelerate the overall migration process and reduce the load on the network.

- **When performing initial data seeding**<br>You can initially migrate a large data set using Azure Data Box, and then switch to online transfer tools to sync the recent changes, or *deltas*.

- **When exporting data from Azure storage**<br>If you have cloud data stored on Azure, you can export and bring it back on-premises using Data Box offline transfer.

- **When transferring massive amounts of data**<br>Data Box can handle tens to hundreds of terabytes per device, and multiple devices can be used in parallel. It's especially useful for remote sites with limited connectivity or a one-time bulk migration.

* Migration use cases include:
  * Source SMB/NFS to Azure Blob, Files, or Azure Data Lake Storage (ADLS)
  * Source on-premises VM disks to managed disks
  * Move data directly to one or more of the specific access tiers: *hot*, *cold*, *cool*, or *archive*.

You can find more details about Azure Data Box features in the [Microsoft learn documentation](../../databox/data-box-overview.md).

#### Azure Import/Export

Azure Import/Export service is used to securely import large amounts of data to Azure Blob storage and Azure Files by shipping disk drives to an Azure datacenter. This service can also be used to transfer data from Azure Blob storage to disk drives and ship to your on-premises sites. You can supply your own disk drives or disk drives supplied by Microsoft.

You can read more about Azure Import/Export in the [service overview](../../import-export/storage-import-export-service.md) article.

### Other miscellaneous tools

#### Graphical interfaces 

If you occasionally transfer a few files and don't need to automate your data transfer, you can choose a graphical interface tool such as [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer) or a [web-based exploration tool](../blobs/storage-quickstart-blobs-portal.md) within the Azure portal.

#### Scripted or programmatic transfer

You can use Microsoft's optimized software tools or call the Azure REST APIs or software development kits (SDKs) directly. The available scriptable tools include AzCopy, Azure PowerShell, and Azure CLI. For programmatic interface, you can use one of the many SDKs and choose between .NET, Java, Python, Node/JS, C++, Go, PHP, or Ruby.

## Recommendations and capability matrix

Selecting appropriate tools for data migration is vital for seamless, efficient, and reliable transfers. Tailored approaches based on scenarios such as file share migrations or service-to-service transfers help optimize processes while reducing risks and disruptions. Review the key scenarios and choose the most suitable and preferred migration tool for your use cases. 

Although there are possible alternatives available on a case-by-case basis, the following tables provide tailored guidance for the most preferred tools for common scenarios. They also include more detailed capabilities and supported features, allowing you to compare, contrast, and make an informed decision for the next step of data migration process.

### Migration tools

When planning your data migration to Azure, it's important to select the right tool based on your specific needs, data volume, and migration complexity. Always ensure that you read about and thoroughly understand their corresponding capabilities before finalizing tool selection.

The following tables provide a source and target-based supportability matrix for key migration tools. The tables provided use the following icons to indicate support level:

| Icon           | Description                    |
|----------------|--------------------------------|
| &#x2705;       | Fully supported                |
| &#x1F7E6;      | Partially supported            |
| &#x274C;       | Not _yet_ supported            |

#### Microsoft tools

> [!IMPORTANT]
> Each Microsoft-provided migration tool provides various capabilities. No single tool supports every source and target combination or network protocol.
> 
> Only Azure Data Box supports offline data transfer to Azure Storage. All other tools are online solutions.

| Tool                | Storage assessment provided | Source     | Source protocol | Azure blob; ADLS | Azure files | Azure NetApp files | Azure disks |
|---------------------|-----------------------------|------------|-----------------|------------------|-------------|--------------------|-------------|
| Azure Storage Mover | &#x274C;  | SMB/NFS server shares; NAS devices | SMB 2.x, 3.x | &#x1F7E6;<sup>1</sup> | &#x1F7E6;<sup>2</sup> | &#x274C;       | &#x274C;        |
| Azure Storage Mover | &#x274C;  | NAS devices; file shares | NFS 3.x, 4.x | &#x1F7E6;<sup>1</sup>         | &#x274C;        | &#x274C;               | &#x274C;        |
| Azure Storage Mover | &#x274C;  | AWS S3                              | S3  | &#x2705;                    | &#x274C;        | &#x274C;               | &#x274C;        |
| Azure Data Box      | &#x274C;  | SMB/NFS server shares; NAS devices  | -            | &#x2705; | &#x1F7E6;<sup>2</sup> | &#x1F7E6;<sup>3</sup> | &#x1F7E6;<sup>4</sup>|
| Data Box Gateway    | &#x274C;  | Local; locally mounted; SMB 2.x, 3.x; NFS v3, v4.1 | - | &#x2705; | &#x1F7E6;<sup>2</sup> | &nbsp;&#x274C;         | &#x274C;        |
| Azure File Sync     | &#x274C;  | Windows file server                 | SMB | &#x274C; | &#x1F7E6;<sup>2</sup>              | &#x274C;               | &#x274C;        |
| Azure Data Factory  | &#x274C;  | On-premises data lake; HDFS; AWS S3 | -   | &#x2705; | &#x1F7E6;<sup>5</sup>              | &#x274C;               | &#x274C;        |
| Azure Migrate       | &#x1F7E6; | Hypervisors; VM disks               | -   | &#x274C; | &#x274C;                           | &#x274C;               | &#x2705;        |


<sup>1</sup> HNS enabled<br>
<sup>2</sup> SMB only<br>
<sup>3</sup> Requires two-steps: migrate to Azure Files using Data Box first, then move from Azure Files to ANF<br>
<sup>4</sup> You can migrate as page blobs to managed disks with a maximum supported size of 8 TB; PV2 and Ultra disks aren't supported<br>
<sup>5</sup> Multicloud connector required<br>
<sup>6</sup> Azure Blob and Files support only NFS v3 v4.1, respectively; consider corresponding application and user functionality, and post-migration accessibility<br>

#### ISV partner tools

> [!IMPORTANT]
> Each ISV partner-provided migration tool provides various capabilities. No single tool supports every source and target combination or network protocol.
>
> Only Tape Ark supports offline data transfer to Azure Storage. All other tools are online solutions.

| Tool | Storage assessment provided | Source | Source protocol | SAN source | NAS source | Azure blob; ADLS | Azure files | Azure NetApp files | Azure disks | E-SAN | Managed Lustre | Partner managed |
|---------------|-----------|------------|-----------------|------------------|-------------|--------------------|-------------|----|-------|------|------|------|
| Komprise      | &#x1F7E6; | NAS devices; Cloud file storage; S3 | SMB; NFS | &#x274C; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x274C; | &#x274C; | &#x274C; | 3p<sup>1</sup> |
| Atempo        | &#x1F7E6; | NAS devices; S3; PFS; Swift    | SMB; NFS | &#x274C; | &#x2705; | &#x1F7E6;<sup>2</sup> | &#x2705; | &#x2705; | &#x274C; | &#x274C; | &#x2705; | 3p<sup>1</sup> |
| Data Dynamics | &#x1F7E6; | NAS devices; S3    | SMB; NFS  | &#x274C; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x274C; | &#x274C; | &#x274C; | 3p<sup>1</sup> |
| Cirrus Data   | &#x1F7E6; | SAN; AWS; Hypervisors                 | - | &#x2705; | &#x274C; | &#x274C; | &#x274C; | &#x274C; | &#x2705; | &#x2705; | &#x274C; | 3p<sup>1</sup> |
| Cirata        | &#x274C;  | Hadoop, POSIX compliant FS            | - | &#x274C; | &#x274C; | &#x2705; | &#x274C; | &#x274C; | &#x274C; | &#x274C; | &#x274C; | 3p |
| Tape Ark      | &#x274C;  | Tapes, disks, and other offline media | - | &#x274C; | &#x274C; | &#x2705; | &#x2705; | &#x2705; | &#x274C; | &#x274C; | &#x274C; | 3p |

<sup>1</sup> Part of SMP.<br>
<sup>2</sup> Does not support ADLS.<br>

### Other command line, unmanaged tools

> [!IMPORTANT]
> Unmanaged command line tools such as AzCopy, Robocopy, Rsync, and DistCP provide various capabilities. Scanning several million files, tracking file changes, calculating the total data size, error detection and handling, and running multiple simultaneous copy jobs can present extreme challenges.
>
> None of the command line tools within the following table are capable of offline data transfer, nor do they provide storage assessments. None of the tools support enterprise NAS or SAN as a source, nor do they support Azure E-SAN or managed Lustre as a destination.

| Tool          | Source                                              | Source protocol | Azure blob; ADLS | Azure files | Azure NetApp files | Azure disks | Managed   |
|---------------|-----------------------------------------------------|-----------------|------------------|-------------|--------------------|-------------|-----------|
| AzCopy        | Azure; local; locally mounted; AWS S3, Glacier; GCP | SMB; S3      | &#x2705;      | &#x2705;    | &#x2705;      | &#x1F7E6;<sup>1</sup>  | Unmanaged |
| Robocopy      | Local; locally mounted; SMB                         | SMB          | &#x274C;      | &#x2705;    | &#x2705;      | &#x1F7E6;<sup>1</sup>  | Unmanaged |
| Rsync; fpsync | Local; locally mounted; NFS                         | NFS          | &#x2705;      | &#x2705;    | &#x2705;      | &#x1F7E6;<sup>1</sup>  | Unmanaged |
| DistCP        | Hadoop                                              | -            | &#x2705;      | &#x274C;    | &#x274C;      | &#x274C;               | Unmanaged |
