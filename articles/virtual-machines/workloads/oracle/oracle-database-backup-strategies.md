---
title: Oracle Database in Azure Virtual Machines backup strategies
description:  Options to back up Oracle Databases in an Azure Linux VM environment.
author: cro27
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 01/28/2021
ms.author: cholse
ms.reviewer: dbakevlar 

---

# Oracle Database in Azure Linux VM backup strategies

**Applies to:** :heavy_check_mark: Linux VMs 

Database backups protect the database against data loss due to storage component failure and data center failure. They can also be a means of recovery from human error and a way to clone a database for development or testing purposes. 

In Azure, as all storage is highly redundant and the loss of one or more disks will not lead to a database outage, backups are most often used to protect against human error, for cloning operations or data preservation for regulatory purposes. They are also a means to protect against regional outage where a disaster recovery technology like DataGuard is not in use. In this case, the backups must be stored in different Azure regions using geo-redundant replication, so as to be available outside of the primary database region.

## Azure Storage 

The [Azure Storage services](../../../storage/common/storage-introduction.md) are Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers a number of services that can be used to mount external storage to the Azure Linux VM, suitable as backup media for Oracle databases. A backup tool such as Oracle RMAN is required to initiate a backup or restore operation and copy the backup to/from the Azure Storage service.
 
Azure Storage services offer the following benefits:

-  Durable and highly available. Redundancy ensures that your data is safe in the event of transient hardware failures. All storage is by default triple mirrored. You can also opt to replicate data across data centers or geographical regions for additional protection from local catastrophe or natural disaster. Data replicated in this way remains highly available in the event of an unexpected outage.

-  Secure. All data written to an Azure storage account is encrypted by the service. Azure Storage provides you with fine-grained control over who has access to your data.

-  Scalable. Azure Storage is designed to be massively scalable to meet the data storage and performance needs of today's applications.

-  Managed. Azure handles hardware maintenance, updates, and critical issues for you.

-  Accessible. Data in Azure Storage is accessible from anywhere in the world over HTTP or HTTPS. Microsoft provides client libraries for Azure Storage in a variety of languages, including .NET, Java, Node.js, Python, PHP, Ruby, Go, and others, as well as a mature REST API. Azure Storage supports scripting in Azure PowerShell or Azure CLI. And the Azure portal and Azure Storage Explorer offer easy visual solutions for working with your data.

The Azure Storage platform includes the following data services that are suitable to use as backup media for the Oracle database:

-  Azure Blobs: A massively scalable object store for text and binary data. Also includes support for big data analytics through Data Lake Storage Gen2.

-  Azure Files: Managed file shares for cloud or on-premises deployments.

-  Azure Disks: Block-level storage volumes for Azure VMs.

### Cross-regional storage mounting

The ability to access backup storage across regions is an important aspect of BCDR and useful for cloning databases from backups into different geographical regions. 
Azure cloud storage provides five levels of [redundancy](../../../storage/common/storage-redundancy.md)
- Locally Redundant Storage [(LRS)](../../../storage/common/storage-redundancy.md#locally-redundant-storage) where your data is replicated three times within a single physical location in the primary region.  
- Zone Redundant Storage [(ZRS)](../../../storage/common/storage-redundancy.md#zone-redundant-storage) where your data is protected by LRS in the primary region, and replicated synchronously across three availability zones (AZ) in the primary region. Each AZ is LRS protected too. 
- Geo-Redundant Storage [(GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) where your data is protected by LRS in the primary region, and replicated asynchronously to a secondary region where it is also protected by LRS.
- Geo-zone-redundant storage [(GZRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) copies your data synchronously across three Azure availability zones in the primary region using ZRS. It then copies your data asynchronously to a single physical location in the secondary region. In all locations data is protected by LRS too. 
- Read Access Geo-Redundant Storage [(RA-GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) and Read Access Geo-Zone-Redundant Storage [(RA-GZRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) allows read-only access to data replicated to the secondary region at all times. 

#### Blob storage and file storage

When using Azure Files with either SMB or NFS 4.1 protocols to mount as backup storage, note that Azure Files does not support read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS). 

Additionally, if the backup storage requirement is greater than 5 TiB Azure Files requires [Large File Shares feature](../../../storage/files/storage-files-planning.md) enabled which does not support GRS or GZRS redundancy - only LRS is supported. 

Azure Blob mounted using NFS 3.0 protocol currently only supports LRS and ZRS redundancy.  

Azure Blob configured with any redundancy option can be mounted using Blobfuse.

#### Recovery Services vault 

A Recovery Services vault is a management entity that stores recovery points created over time and provides an interface to perform backup related operations. These include taking on-demand backups, performing restores, and creating backup policies.
Azure Backup automatically handles storage for the vault. You do need to specify how that storage is replicated at time of creation. It cannot be changed after items are protected in the vault. For regional redundancy, choose the geo-redundant setting.

If you intend to restore to a secondary, [Azure paired region](../../../availability-zones/cross-region-replication-azure.md) enable [Cross Region Restore](../../../backup/backup-create-rs-vault.md) feature. When cross region restore is enabled, the backup storage is moved from GRS to read-access geo-redundant storage (RA-GRS). 

### Azure Blob Storage

Azure Blob storage is a highly cost effective, durable, and secure cloud-based storage service used for storing large amounts of unstructured data and is an ideal media to use for Oracle Database backups. Azure Blob storage can be mounted to Azure Linux VM’s using NFS v3.0 protocol or Blobfuse (Linux FUSE).

#### Azure Blob Blobfuse

[Blobfuse](../../../storage/blobs/storage-how-to-mount-container-linux.md) is an open-source project developed to provide a virtual filesystem backed by the Azure Blob storage. It uses the libfuse open-source library to communicate with the Linux FUSE kernel module, and implements the filesystem operations using the Azure Storage Blob REST APIs. Blobfuse is currently available for Ubuntu and Centos/RedHat distributions. It is also available for Kubernetes using the [CSI driver](https://github.com/kubernetes-sigs/blob-csi-driver). 

While ubiquitous across all Azure regions, and works with all storage account types including general purpose v1/v2 and Azure Data Lake Store Gen2, performance offered by Blobfuse has shown to be less than alternative protocols such as SMB or NFS. For suitability as the database backup media, we would recommend using SMB or [NFS](../../../storage/blobs/storage-how-to-mount-container-linux.md) protocols to mount Azure Blob storage. 

#### Azure Blob NFS v3.0

Azure support for the Network File System (NFS) v3.0 protocol is now available. [NFS](../../../storage/blobs/network-file-system-protocol-support.md) support enables Windows and Linux clients to mount a Blob storage container to an Azure VM. 

To ensure network security, the storage account used for NFS mounting must be contained within a VNet. Azure Active Directory (AD) security, and access control lists (ACLs) are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them.

### Azure Files

[Azure Files](../../../storage/files/storage-files-introduction.md) is a cloud-based, fully managed distributed file system that can be mounted to on premise or cloud-based Windows, Linux or macOS clients.

Azure Files offers fully managed cross-platform file shares in the cloud that are accessible via the Server Message Block (SMB) protocol and Network File System (NFS) protocol. Azure Files does not currently support multi-protocol access, so a share can only be either an NFS share, or an SMB share. We recommend determining which protocol best suits your needs before creating Azure file shares.

Azure File shares can also be protected through Azure Backup to Recovery services vault, providing an additional layer of protection to the Oracle RMAN backups.

#### Azure Files NFS v4.1

Azure file shares can be mounted in Linux distributions using the Network File System (NFS) v4.1 protocol. There are a number of limitations to supported features. For more information, see [Support for Azure Storage features](../../../storage/files/files-nfs-protocol.md#support-for-azure-storage-features). 

[!INCLUDE [files-nfs-regional-availability](../../../../includes/files-nfs-regional-availability.md)]

#### Azure Files SMB 3.0

Azure file shares can be mounted in Linux distributions using the SMB kernel client. The Common Internet File System (CIFS) Protocol, available on Linux distributions, is a dialect of SMB. When mounting Azure Files SMB on Linux VMs, it is mounted as CIFS type filesystem and the CIFS package must be installed. 

Azure Files SMB is generally available in all Azure regions, and shows the same performance characteristics as NFS v3.0 and v4.1 protocols, and so is currently the recommended method to provide backup storage media to Azure Linux VMs.  

There are two supported versions of SMB available, SMB 2.1 and SMB 3.0, with the latter recommended as it supports encryption in transit. However, different Linux kernels versions have differing support for SMB 2.1 and 3.0. For more information, see [Mount SMB Azure file share on Linux](../../../storage/files/storage-how-to-use-files-linux.md) to ensure your application supports SMB 3.0. 

Because Azure Files is designed to be a multi-user file share service, there are certain characteristics you should tune to make it more suitable as a backup storage media. Turning off caching and setting the user and group IDs for files created are recommended.

## Azure NetApp Files

The [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md) service is a complete storage solution for Oracle Databases in Azure VMs. Built on an enterprise-class, high-performance, metered file storage, it  supports any workload type and is highly available by default. Together with the Oracle Direct NFS (dNFS) driver, Azure NetApp Files provides a highly optimized storage layer for the Oracle Database.

Azure NetApp Files provides efficient storage-based snapshots on the underlying storage system that uses a Redirect on Write (RoW) mechanism. While snapshots are extremely fast to take and restore, they only serve as a first-line-of-defence, which can account for the vast majority of the required restore operations of any given organization, which is often recovery from human error. However, snapshots are not a complete backup. To cover all backup and restore requirements, [external snapshot replicas](../../../azure-netapp-files/cross-region-replication-introduction.md) and/or other [backup vaults](../../../azure-netapp-files/backup-introduction.md) must be created in a (remote) geography to protect from regional outage. Read more about [how Azure NetApp Files snapshots work](../../../azure-netapp-files/snapshots-introduction.md).

In order to ensure the creation of database consistent snapshots the backup process must be orchestrated between the database and the storage. Azure Application Consistent Snapshot tool (AzAcSnap) is a command-line tool that enables data protection for third-party databases by handling all the orchestration required to put them into an application consistent state before taking a storage snapshot, after which it returns them to an operational state. Oracle databases are supported with AzAcSnap since [version 5.1](../../../azure-netapp-files/azacsnap-release-notes.md#azacsnap-v51-preview-build-2022012585030).

To learn more about using Azure NetApp Files for Oracle Databases on Azure, read more [here](../../../azure-netapp-files/azure-netapp-files-solution-architectures.md#oracle).

## Azure Backup service

[The Azure Backup](../../../backup/backup-overview.md) is a fully managed PaaS that provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. Azure Backup can back up and restore on-premises clients, Azure VM’s, Azure Files shares, as well as SQL Server, Oracle, MySQL, PostreSQL, and SAP HANA databases on Azure VMs. 

Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a [Recovery Services vault](../../../backup/backup-azure-recovery-services-vault-overview.md) with built-in management of recovery points. Configuration and scalability are simple, backups are optimized, and you can easily restore as needed. It uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability with no maintenance or monitoring overhead. Azure Backup doesn't limit the amount of inbound or outbound data you transfer, or charge for the data that's transferred, and data is secured in transit and at rest. 

To ensure durability Azure Backup offers multiple types of replication to keep your backup data highly available.

- Locally redundant storage [(LRS)](../../../storage/common/storage-redundancy.md#locally-redundant-storage) replicates your data three times (it creates three copies of your data) in a storage scale unit in a data center.
- Geo-redundant storage [(GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) is the default and recommended replication option. GRS replicates your data to a secondary region (hundreds of miles away from the primary location of the source data).

A vault created with GRS redundancy includes the option to configure the [Cross Region Restore](../../../backup/backup-create-rs-vault.md#set-storage-redundancy) feature, which allows you to restore data in a secondary, Azure paired region.

Azure Backup service provides a [framework](../../../backup/backup-azure-linux-app-consistent.md) to achieve application consistency during backups of Windows and Linux VMs for various applications like Oracle, MySQL, Mongo DB, SAP HANA, and PostGreSQL, called application consistent snapshots. This involves invoking a pre-script (to quiesce the applications) before taking a snapshot of disks and calling post-script (commands to unfreeze the applications) after the snapshot is completed, to return the applications to the normal mode. While sample pre-scripts and post-scripts are provided on GitHub, the creation and maintenance of these scripts is your responsibility. In the case of Oracle, the database must be in archivelog mode to allow online backups, and the appropriate database begin and end backup commands are run in the pre and post-scripts, which you must create and maintain. 

Azure Backup is now providing an [enhanced pre-script and post-script framework](../../../backup/backup-azure-linux-database-consistent-enhanced-pre-post.md), now generally available, where the Azure Backup service will provide packaged pre-scripts and post-scripts for selected applications. Azure Backup users just need to name the application and then Azure VM backup will automatically invoke the relevant pre-scripts and post-scripts. The packaged pre-scripts and post-scripts will be maintained by the Azure Backup team so users can be assured of the support, ownership, and validity of these scripts. Currently, the supported applications for the enhanced framework are Oracle 12.1 or higher and MySQL, with more application types expected in the future. The snapshot will be a full copy of the storage and not an incremental or Copy on Write snapshot, so it is an effective medium to restore your database from.

## VLDB considerations

Backup strategies for Very large databases (VLDB) require careful consideration due to their size. Using RMAN to back up to Azure Blob or Azure Files storage may not provide the required throughput to backup a VLDB in the target time frame. RMAN incremental backup can be used to reduce backup sizes which may allow Azure Storage to be used as the backup medium for VLDB's, however for VLDB's with high volumes of changes this might not be effective. 

Using Azure services that provide snapshot capabilities such as Azure Backup service or Azure NetApp Files (ANF) is the recommended approach for VLDB's. Application consistent snapshots, where the databases are automatically placed in and out of backup mode, take only seconds to create regardless of the size of the database.

Your backup strategy may be also tied to the overall storage solution used for the Oracle database. Extreme IO throughput database workloads often use Azure NetApp Files or third party Azure Marketplace solutions such as Silk, to underpin the database storage throughput and IOPS requirements. These solutions also provide application consistent snapshots that can be used for fast database backup and restore operations. 

## Next steps

- [Create Oracle Database quickstart](oracle-database-quick-create.md)
- [Back up Oracle Database to Azure Files](oracle-database-backup-azure-storage.md)
- [Back up Oracle Database using Azure Backup service](oracle-database-backup-azure-backup.md)
