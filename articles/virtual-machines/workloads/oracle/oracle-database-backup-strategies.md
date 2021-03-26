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

When using Azure Files with either SMB or NFS 4.1 (Preview) protocols to mount as backup storage, note that Azure Files does not support read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS). 

Additionally, if the backup storage requirement is greater than 5 TiB Azure Files requires [Large File Shares feature](../../../storage/files/storage-files-planning.md) enabled which does not support GRS or GZRS redundancy - only LRS is supported. 

Azure Blob mounted using NFS 3.0 (Preview) protocol currently only supports LRS and ZRS redundancy.  

Azure Blob configured with any redundancy option can be mounted using Blobfuse.

#### Recovery Services vault 

A Recovery Services vault is a management entity that stores recovery points created over time and provides an interface to perform backup related operations. These include taking on-demand backups, performing restores, and creating backup policies.
Azure Backup automatically handles storage for the vault. You do need to specify how that storage is replicated at time of creation. It cannot be changed after items are protected in the vault. For regional redundancy, choose the geo-redundant setting.

If you intend to restore to a secondary, [Azure paired region](../../../best-practices-availability-paired-regions.md) enable [Cross Region Restore](../../../backup/backup-create-rs-vault.md) feature. When cross region restore is enabled, the backup storage is moved from GRS to read-access geo-redundant storage (RA-GRS). 

### Azure Blob Storage

Azure Blob storage is a highly cost effective, durable, and secure cloud-based storage service used for storing large amounts of unstructured data and is an ideal media to use for Oracle Database backups. Azure Blob storage can be mounted to Azure Linux VM’s using NFS v3.0 protocol or Blobfuse (Linux FUSE).

#### Azure Blob Blobfuse

[Blobfuse](../../../storage/blobs/storage-how-to-mount-container-linux.md) is an open-source project developed to provide a virtual filesystem backed by the Azure Blob storage. It uses the libfuse open-source library to communicate with the Linux FUSE kernel module, and implements the filesystem operations using the Azure Storage Blob REST APIs. Blobfuse is currently available for Ubuntu and Centos/RedHat distributions. It is also available for Kubernetes using the [CSI driver](https://github.com/kubernetes-sigs/blob-csi-driver). 

While ubiquitous across all Azure regions, and works with all storage account types including general purpose v1/v2 and Azure Data Lake Store Gen2, performance offered by Blobfuse has shown to be less than alternative protocols such as SMB or NFS. For suitability as the database backup media, we would recommend using SMB or [NFS](../../../storage/blobs/storage-how-to-mount-container-linux.md) protocols to mount Azure Blob storage. 

#### Azure Blob NFS v3.0 (Preview)

Azure support for the Network File System (NFS) v3.0 protocol is now in preview. [NFS](../../../storage/blobs/network-file-system-protocol-support.md) support enables Windows and Linux clients to mount a Blob storage container to an Azure VM. 

NFS 3.0 public preview supports GPV2 storage accounts with standard tier performance in the following regions: 
- Australia East
- Korea Central
- South Central US. 

To ensure network security, the storage account used for NFS mounting must be contained within a VNet. Azure Active Directory (AD) security, and access control lists (ACLs) are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them.

### Azure Files

[Azure Files](../../../storage/files/storage-files-introduction.md) is a cloud-based, fully managed distributed file system that can be mounted to on premise or cloud-based Windows, Linux or macOS clients.

Azure Files offers fully managed cross-platform file shares in the cloud that are accessible via the Server Message Block (SMB) protocol and Network File System (NFS) protocol (preview). Azure Files does not currently support multi-protocol access, so a share can only be either an NFS share, or an SMB share. We recommend determining which protocol best suits your needs before creating Azure file shares.

Azure File shares can also be protected through Azure Backup to Recovery services vault, providing an additional layer of protection to the Oracle RMAN backups.

#### Azure Files NFS v4.1 (Preview)

Azure file shares can be mounted in Linux distributions using the Network File System (NFS) v4.1 protocol. While in Preview there are a number of limitations to supported features, which are documented [here](../../../storage/files/storage-files-how-to-mount-nfs-shares.md). 

While in preview Azure Files NFS v4.1 is also restricted to the following [regions](../../../storage/files/storage-files-how-to-mount-nfs-shares.md):
- East US (LRS and ZRS)
- East US 2
- West US 2
- West Europe
- Southeast Asia
- UK South
- Australia East

#### Azure Files SMB 3.0

Azure file shares can be mounted in Linux distributions using the SMB kernel client. The Common Internet File System (CIFS) Protocol, available on Linux distributions, is a dialect of SMB. When mounting Azure Files SMB on Linux VMs, it is mounted as CIFS type filesystem and the CIFS package must be installed. 

Azure Files SMB is generally available in all Azure regions, and shows the same performance characteristics as NFS v3.0 and v4.1 protocols, and so is currently the recommended method to provide backup storage media to Azure Linux VMs.  

There are two supported versions of SMB available, SMB 2.1 and SMB 3.0, with the latter recommended as it supports encryption in transit. However, different Linux kernels versions have differing support for SMB 2.1 and 3.0 and you should check the table [here](../../../storage/files/storage-how-to-use-files-linux.md) to ensure your application supports SMB 3.0. 

Because Azure Files is designed to be a multi-user file share service, there are certain characteristics you should tune to make it more suitable as a backup storage media. Turning off caching and setting the user and group IDs for files created are recommended.

## Azure NetApp Files

The [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-solution-architectures.md) service is a complete storage solution for Oracle Databases in Azure VMs. Built on an enterprise-class, high-performance, metered file storage, it  supports any workload type and is highly available by default. Together with the Oracle Direct NFS (dNFS) driver, Azure NetApp Files provides a highly optimized storage layer for the Oracle Database.

Azure NetApp Files provides efficient storage-based snapshots copies on the underlying storage system that uses a Redirect on Write (RoW) mechanism. While snapshot copies are extremely fast to take and restore, they only serve as a first-line-of-defence, which can account for the vast majority of the required restore operations of any given organization, which is often recovery from human error. However, Snapshot copies are not a complete backup. To cover all backup and restore requirements, external snapshot replicas and/or other backup copies must be created in a remote geography to protect from regional outage. 
To learn more about using NetApp Files for Oracle Databases on Azure, read this [report](https://www.netapp.com/pdf.html?item=/media/17105-tr4780pdf.pdf).

## Azure Backup service

[The Azure Backup](../../../backup/backup-overview.md) is a fully managed PaaS that provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. Azure Backup can back up and restore on-premise clients, Azure VM’s, Azure Files shares, as well as SQL Server, Oracle, MySQL, PostreSQL, and SAP HANA databases on Azure VMs. 

Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a [Recovery Services vault](../../../backup/backup-azure-recovery-services-vault-overview.md) with built-in management of recovery points. Configuration and scalability are simple, backups are optimized, and you can easily restore as needed. It uses the underlying power and unlimited scale of the Azure cloud to deliver high-availability with no maintenance or monitoring overhead. Azure Backup doesn't limit the amount of inbound or outbound data you transfer, or charge for the data that's transferred, and data is secured in transit and at rest. 

To ensure durability Azure Backup offers multiple types of replication to keep your backup data highly available.

- Locally redundant storage [(LRS)](../../../storage/common/storage-redundancy.md#locally-redundant-storage) replicates your data three times (it creates three copies of your data) in a storage scale unit in a data center.
- Geo-redundant storage [(GRS)](../../../storage/common/storage-redundancy.md#geo-redundant-storage) is the default and recommended replication option. GRS replicates your data to a secondary region (hundreds of miles away from the primary location of the source data).

A vault created with GRS redundancy includes the option to configure the [Cross Region Restore](../../../backup/backup-create-rs-vault.md#set-storage-redundancy) feature, which allows you to restore data in a secondary, Azure paired region.

Azure Backup service provides a [framework](../../../backup/backup-azure-linux-app-consistent.md) to achieve application consistency during backups of Windows and Linux VMs for various applications like Oracle, MySQL, Mongo DB, SAP HANA, and PostGreSQL, called application consistent snapshots. This involves invoking a pre-script (to quiesce the applications) before taking a snapshot of disks and calling post-script (commands to unfreeze the applications) after the snapshot is completed, to return the applications to the normal mode. While sample pre-scripts and post-scripts are provided on GitHub, the creation and maintenance of these scripts is your responsibility. In the case of Oracle, the database must be in archivelog mode to allow online backups, and the appropriate database begin and end backup commands are run in the pre and post-scripts, which you must create and maintain. 

Azure Backup is now providing an [enhanced pre-script and post-script framework](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts), currently in preview, where the Azure Backup service will provide packaged pre-scripts and post-scripts for selected applications. Azure Backup users just need to name the application and then Azure VM backup will automatically invoke the relevant pre-scripts and post-scripts. The packaged pre-scripts and post-scripts will be maintained by the Azure Backup team so users can be assured of the support, ownership, and validity of these scripts. Currently, the supported applications for the enhanced framework are Oracle and MySQL, with more application types expected in the future. The snapshot will be a full copy of the storage and not an incremental or Copy on Write snapshot, so it is an effective medium to restore your database from.

## Next steps

- [Create Oracle Database quickstart](oracle-database-quick-create.md)
- [Back up Oracle Database to Azure Files](oracle-database-backup-azure-storage.md)
- [Back up Oracle Database using Azure Backup service](oracle-database-backup-azure-backup.md)


