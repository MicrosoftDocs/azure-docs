---
title: Backup strategies for Oracle Database on an Azure Linux VM
description:  Get options to back up Oracle Database instances in an Azure Linux VM environment.
author: cro27
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 01/28/2021
ms.author: cholse
ms.reviewer: jjaygbay1 

---

# Backup strategies for Oracle Database on an Azure Linux VM

**Applies to:** :heavy_check_mark: Linux VMs

Database backups help protect the database against data loss that's due to storage component failure and datacenter failure. They can also be a means of recovery from human error and a way to clone a database for development or testing purposes.

In Azure, all storage is highly redundant. The loss of one or more disks won't lead to a database outage. Backups are most often used to protect against human error, to facilitate cloning operations, or to preserve data for regulatory purposes.

Backups also help protect against regional outages when a disaster recovery technology like DataGuard is not in use. In this case, the backups must be stored in different Azure regions via geo-redundant replication, so they're available outside the primary database region.

## Azure Storage

The [Azure Storage services](../../../storage/common/storage-introduction.md) are Microsoft's cloud solution for modern data-storage scenarios. Azure Storage offers services that you can use to mount external storage to an Azure Linux virtual machine (VM), which is suitable as backup media for Oracle Database instances. A backup tool such as Oracle Recovery Manager (RMAN) is required to initiate a backup or restore operation, and to copy the backup to or from Azure Storage.

Azure Storage services offer the following benefits:

- **Durable and highly available**. Redundancy helps keep data safe during transient hardware failures. All storage is triple mirrored by default. You can also opt to replicate data across datacenters or geographical regions for more protection from local catastrophes or natural disasters. Data replicated in this way remains highly available in the event of an unexpected outage.

- **Secure**: Azure Storage encrypts all data written to a storage account. Azure Storage gives you detailed control over who has access to your data.

- **Scalable**: Azure Storage is massively scalable to meet the data storage and performance needs of today's applications.

- **Managed**: Azure handles hardware maintenance, updates, and critical issues for you.

- **Accessible**: Data in Azure Storage is accessible from anywhere in the world over HTTP or HTTPS. Microsoft provides client libraries for Azure Storage in a variety of languages, including .NET, Java, Node.js, Python, PHP, Ruby, and Go. Microsoft also provides a mature REST API.

  Azure Storage supports scripting in Azure PowerShell or the Azure CLI. The Azure portal and Azure Storage Explorer offer visual solutions for working with your data.

The Azure Storage platform includes the following data services that are suitable to use as backup media for Oracle Database:

- **Azure Blob Storage**: An object store for text and binary data. It also includes support for big data analytics through Azure Data Lake Storage Gen2.

- **Azure Files**: Managed file shares for cloud or on-premises deployments.

- **Azure Disk Storage**: Block-level storage volumes for Azure VMs.

### Cross-regional storage mounting

The ability to access backup storage across regions is an important aspect of business continuity and disaster recovery (BCDR). It's also useful for cloning databases from backups into different geographical regions. Azure cloud storage provides five levels of [redundancy](../../../storage/common/storage-redundancy.md):

- [Locally redundant storage (LRS)](../../../storage/common/storage-redundancy.md#locally-redundant-storage): Your data is replicated three times within a single physical location in the primary region.  
- [Zone-redundant storage (ZRS)](../../../storage/common/storage-redundancy.md#zone-redundant-storage): Your data is replicated synchronously across three availability zones in the primary region. LRS helps protect your data in the primary region and helps protect each availability zone.
- [Geo-redundant storage (GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage): Your data is replicated asynchronously to a secondary region. LRS helps protect your data in the primary and secondary regions.
- [Geo-zone-redundant storage (GZRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage): Your data is copied synchronously across three Azure availability zones in the primary region via ZRS. Your data is then copied asynchronously to a single physical location in the secondary region. In all locations, LRS helps protect the data.
- [Read-access geo-redundant storage (RA-GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) and [read-access geo-zone-redundant storage (RA-GZRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage): You have read-only access to data replicated to the secondary region at all times.

#### Blob and file storage

When you're using Azure Files with either the Server Message Block (SMB) protocol or the Network File System (NFS) 4.1 protocol to mount as backup storage, Azure Files doesn't support RA-GRS or RA-GZRS.

If the backup storage requirement is greater than 5 tebibytes (TiB), Azure Files requires you to enable the [large file shares](../../../storage/files/storage-files-planning.md) feature. This feature doesn't support GRS or GZRS redundancy. It supports only LRS.

Azure Blob Storage mounted via the NFS 3.0 protocol currently supports only LRS and ZRS redundancy. Azure Blob Storage configured with any redundancy option can be mounted via Blobfuse.

#### Recovery Services vault

A Recovery Services vault is a management entity that stores recovery points created over time. It provides an interface to perform backup-related operations. These operations include taking on-demand backups, performing restores, and creating backup policies.

Azure Backup automatically handles storage for the vault. You do need to specify how that storage is replicated at the time of creation. You can't change replication after items are protected in the vault. For regional redundancy, choose the geo-redundant setting.

If you intend to restore to a secondary [Azure paired region](../../../availability-zones/cross-region-replication-azure.md), enable the [Cross Region Restore](../../../backup/backup-create-rs-vault.md) feature. When you enable Cross Region Restore, the backup storage is moved from GRS to RA-GRS.

### Azure Blob Storage

Azure Blob Storage is a cloud-based service for storing large amounts of unstructured data and is suitable for Oracle Database backups. You can mount Azure Blob Storage to Azure Linux VMs by using Blobfuse (Linux FUSE) or the NFS v3.0 protocol.

#### Blobfuse

[Blobfuse](../../../storage/blobs/storage-how-to-mount-container-linux.md) is an open-source project that provides a virtual file system backed by Azure Blob Storage. It uses the libfuse open-source library to communicate with the Linux FUSE kernel module. It implements file-system operations by using the Azure Blob Storage REST APIs.

Blobfuse is currently available for Ubuntu and Centos/RedHat distributions. It's also available for Kubernetes via the [CSI driver](https://github.com/kubernetes-sigs/blob-csi-driver).

Blobfuse is ubiquitous across Azure regions and works with all storage account types, including general-purpose v1/v2 and Azure Data Lake Storage Gen2. But it doesn't perform as well as alternative protocols. For suitability as the database backup medium, we recommend using the SMB or [NFS](../../../storage/blobs/storage-how-to-mount-container-linux.md) protocol to mount Azure Blob Storage.

#### NFS v3.0

Azure support for the NFS v3.0 protocol is available. [NFS support](../../../storage/blobs/network-file-system-protocol-support.md) enables Windows and Linux clients to mount an Azure Blob Storage container to an Azure VM.

To ensure network security, the storage account that you use for NFS mounting must be contained within a virtual network. Azure Active Directory (Azure AD) security and access control lists (ACLs) are not yet supported in accounts that have NFS 3.0 protocol support enabled on them.

### Azure Files

[Azure Files](../../../storage/files/storage-files-introduction.md) is a cloud-based, fully managed distributed file system. You can mount it to on-premises or cloud-based Windows, Linux, or macOS clients.

Azure Files offers fully managed cross-platform file shares in the cloud that are accessible via the SMB and NFS protocols. Azure Files doesn't currently support multiple-protocol access, so a share can only be either an NFS share or an SMB share. We recommend determining which protocol best suits your needs before you create Azure file shares.

You can also help protect Azure file shares by using Azure Backup for a Recovery Services vault. This approach provides another layer of protection to the Oracle RMAN backups.

#### Azure Files with NFS v4.1

You can mount Azure file shares in Linux distributions by using the NFS v4.1 protocol. There are limitations to supported features. For more information, see [Support for Azure Storage features](../../../storage/files/files-nfs-protocol.md#support-for-azure-storage-features).

[!INCLUDE [files-nfs-regional-availability](../../../../includes/files-nfs-regional-availability.md)]

#### Azure Files with SMB 3.0

You can mount Azure file shares in Linux distributions by using the SMB kernel client. The Common Internet File System (CIFS) protocol, available on Linux distributions, is a dialect of SMB. When you mount an Azure file share on Linux VMs by using SMB, it's mounted as a CIFS-type file system, and the CIFS package must be installed.

The ability to mount Azure file shares via SMB is generally available in all Azure regions. It shows the same performance characteristics as NFS v3.0 and v4.1 protocols, so we currently recommend it as the method to provide backup storage media to Azure Linux VMs.  

Two supported versions of SMB are available: SMB 2.1 and SMB 3.0. We recommend SMB 3.0, because it supports encryption in transit. However, Linux kernel versions have differing support for SMB 2.1 and 3.0. To ensure that your application supports SMB 3.0, see [Mount an SMB Azure file share on Linux](../../../storage/files/storage-how-to-use-files-linux.md).

Because Azure Files is a multiuser file-share service, you should tune certain characteristics to make it more suitable as backup storage media. We recommend turning off caching and setting the user and group IDs for created files.

## Azure NetApp Files

The [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md) service is a complete storage solution for Oracle Database in Azure VMs. Built on metered file storage, it supports any workload type and is highly available by default. Together with the Oracle Direct NFS driver, Azure NetApp Files provides a highly optimized storage layer for Oracle Database.

Azure NetApp Files provides efficient storage-based snapshots on the underlying storage system that uses a redirect-on-write mechanism. Although snapshots are fast to take and restore, they serve only as a first line of defense. They can account for most of the required restore operations of any organization, which are often part of recovery from human error.

However, snapshots are not a complete backup. To cover all backup and restore requirements, you must create [external snapshot replicas](../../../azure-netapp-files/cross-region-replication-introduction.md) or other [backup vaults](../../../azure-netapp-files/backup-introduction.md) in a remote geography to help protect against regional outages. [Read more about how Azure NetApp Files snapshots work](../../../azure-netapp-files/snapshots-introduction.md).

To ensure the creation of database-consistent snapshots, the backup process must be orchestrated between the database and the storage. The Azure Application Consistent Snapshot (AzAcSnap) command-line tool enables data protection for third-party databases. It handles all the orchestration required to put those databases into an application-consistent state before taking a storage snapshot. After that, it returns the databases to an operational state. Oracle Database instances are supported with AzAcSnap since [version 5.1](../../../azure-netapp-files/azacsnap-release-notes.md#azacsnap-v51-preview-build-2022012585030).

To learn more about using Azure NetApp Files for Oracle Database on Azure, see [Solution architectures using Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-solution-architectures.md#oracle).

## Azure Backup service

[Azure Backup](../../../backup/backup-overview.md) is a fully managed platform as a service (PaaS) solution for backing up your data and recovering it from the Microsoft Azure cloud. Azure Backup can back up and restore on-premises clients, Azure VMs, and Azure file shares. It can also back up SQL Server, Oracle, MySQL, PostgreSQL, and SAP HANA databases on Azure VMs.

Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a [Recovery Services vault](../../../backup/backup-azure-recovery-services-vault-overview.md) with built-in management of recovery points.

Azure Backup uses the Azure cloud to deliver high availability with no maintenance or monitoring overhead. It doesn't limit the amount of inbound or outbound data that you transfer, and it doesn't charge for the data that you transfer. Data is secured in transit and at rest.

Azure Backup offers multiple types of replication to keep your backup data highly available:

- [LRS](../../../storage/common/storage-redundancy.md#locally-redundant-storage) replicates your data three times (that is, it creates three copies of your data) in a storage scale unit in a datacenter.
- [GRS](../../../storage/common/storage-redundancy.md#geo-redundant-storage) is the default and recommended replication option. GRS replicates your data to a secondary region, hundreds of miles away from the primary location of the source data.

A vault created with GRS redundancy includes the option to configure the [Cross Region Restore](../../../backup/backup-create-rs-vault.md#set-storage-redundancy) feature. You can use this feature to restore data in a secondary Azure paired region.

The Azure Backup service provides a [framework](../../../backup/backup-azure-linux-app-consistent.md) to achieve application consistency during backups of Windows and Linux VMs for various applications like Oracle, MySQL, Mongo DB, SAP HANA, and PostgreSQL: application-consistent snapshots. This framework involves invoking pre-scripts (to quiesce the applications) before taking a snapshot of disks. It calls post-scripts (commands to unfreeze the applications) after the snapshot is completed, to return the applications to the normal mode.

Although you can find sample pre-scripts and post-scripts on GitHub, you're responsible for creating and maintaining these scripts. In the case of Oracle, the database must be in archive log mode to allow online backups. You must create and maintain the appropriate database beginning and ending backup commands that are run in the pre-scripts and post-scripts.

Azure Backup provides an [enhanced pre-script and post-script framework](../../../backup/backup-azure-linux-database-consistent-enhanced-pre-post.md) in which it provides packaged pre-scripts and post-scripts for selected applications. You just name the application, and then Azure Backup automatically invokes the relevant pre-scripts and post-scripts. Microsoft manages the packaged pre-scripts and post-scripts, so you can be assured of the support, ownership, and validity of these scripts.

Currently, the supported applications for the enhanced framework are Oracle 12.1 or later and MySQL. The snapshot is a full copy of the storage and not an incremental or copy-on-write snapshot, so it's an effective medium to restore your database from.

## VLDB considerations

Backup strategies for very large databases (VLDBs) require careful consideration because of their size. Using RMAN to back up to Azure Blob Storage or Azure Files might not provide the required throughput to back up a VLDB in the target time frame.

You can use RMAN incremental backup to reduce backup sizes. This approach might allow Azure Storage to be used as the backup medium for VLDBs. However, it might not be effective for VLDBs that have high volumes of changes.

We recommend using Azure services that provide snapshot capabilities, such as Azure Backup or Azure NetApp Files, for VLDBs. Application-consistent snapshots, where the databases are automatically placed in and out of backup mode, take only seconds to create regardless of the size of the database.

Your backup strategy might be also tied to the overall storage solution that the organization uses for Oracle Database. Database workloads that have extreme I/O throughput often use Azure NetApp Files or third-party Azure Marketplace solutions such as Silk to underpin the database storage throughput and IOPS requirements. These solutions also provide application-consistent snapshots for fast database backup and restore operations.

## Next steps

- [Create an Oracle Database instance on an Azure VM](oracle-database-quick-create.md)
- [Back up Oracle Database to Azure Files](oracle-database-backup-azure-storage.md)
- [Back up Oracle Database by using the Azure Backup service](oracle-database-backup-azure-backup.md)
