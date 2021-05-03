---
title: Planning for an Azure Files deployment | Microsoft Docs
description: Understand planning for an Azure Files deployment. You can either direct mount an Azure file share, or cache Azure file share on-premises with Azure File Sync.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 03/23/2021
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# Planning for an Azure Files deployment
[Azure Files](storage-files-introduction.md) can be deployed in two main ways: by directly mounting the serverless Azure file shares or by caching Azure file shares on-premises using Azure File Sync. Which deployment option you choose changes the things you need to consider as you plan for your deployment. 

- **Direct mount of an Azure file share**: Since Azure Files provides either Server Message Block (SMB) or Network File System (NFS) access, you can mount Azure file shares on-premises or in the cloud using the standard SMB or NFS clients available in your OS. Because Azure file shares are serverless, deploying for production scenarios does not require managing a file server or NAS device. This means you don't have to apply software patches or swap out physical disks. 

- **Cache Azure file share on-premises with Azure File Sync**: Azure File Sync enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server into a quick cache of your Azure SMB file share. 

This article primarily addresses deployment considerations for deploying an Azure file share to be directly mounted by an on-premises or cloud client. To plan for an Azure File Sync deployment, see [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).

## Available protocols

Azure Files offers two protocols that may be used when mounting your file shares, SMB and Network File System (NFS). For details on these protocols, see [Azure file share protocols](storage-files-compare-protocols.md).

> [!IMPORTANT]
> Most of the content of this article only applies to SMB shares. Anything that applies to NFS shares will specifically state it is applicable.

## Management concepts
[!INCLUDE [storage-files-file-share-management-concepts](../../../includes/storage-files-file-share-management-concepts.md)]

When deploying Azure file shares into storage accounts, we recommend:

- Only deploying Azure file shares into storage accounts with other Azure file shares. Although GPv2 storage accounts allow you to have mixed purpose storage accounts, since storage resources such as Azure file shares and blob containers share the storage account's limits, mixing resources together may make it more difficult to troubleshoot performance issues later on. 

- Paying attention to a storage account's IOPS limitations when deploying Azure file shares. Ideally, you would map file shares 1:1 with storage accounts, however this may not always be possible due to various limits and restrictions, both from your organization and from Azure. When it is not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

- Only deploy GPv2 and FileStorage accounts and upgrade GPv1 and classic storage accounts when you find them in your environment. 

## Identity
To access an Azure file share, the user of the file share must be authenticated and have authorization to access the share. This is done based on the identity of the user accessing the file share. Azure Files integrates with three main identity providers:
- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS)**: Azure storage accounts can be domain joined to a customer-owned, Active Directory Domain Services, just like a Windows Server file server or NAS device. You can deploy a domain controller on-premises, in an Azure VM, or even as a VM in another cloud provider; Azure Files is agnostic to where your domain controller is hosted. Once a storage account is domain-joined, the end user can mount a file share with the user account they signed into their PC with. AD-based authentication uses the Kerberos authentication protocol.
- **Azure Active Directory Domain Services (Azure AD DS)**: Azure AD DS provides a Microsoft-managed domain controller that can be used for Azure resources. Domain joining your storage account to Azure AD DS provides similar benefits to domain joining it to a customer-owned Active Directory. This deployment option is most useful for application lift-and-shift scenarios that require AD-based permissions. Since Azure AD DS provides AD-based authentication, this option also uses the Kerberos authentication protocol.
- **Azure storage account key**: Azure file shares may also be mounted with an Azure storage account key. To mount a file share this way, the storage account name is used as the username and the storage account key is used as a password. Using the storage account key to mount the Azure file share is effectively an administrator operation, since the mounted file share will have full permissions to all of the files and folders on the share, even if they have ACLs. When using the storage account key to mount over SMB, the NTLMv2 authentication protocol is used.

For customers migrating from on-premises file servers, or creating new file shares in Azure Files intended to behave like Windows file servers or NAS appliances, domain joining your storage account to **Customer-owned Active Directory** is the recommended option. To learn more about domain joining your storage account to a customer-owned Active Directory, see [Azure Files Active Directory overview](storage-files-active-directory-overview.md).

If you intend to use the storage account key to access your Azure file shares, we recommend using service endpoints as described in the [Networking](#networking) section.

## Networking
Azure file shares are accessible from anywhere via the storage account's public endpoint. This means that authenticated requests, such as requests authorized by a user's logon identity, can originate securely from inside or outside of Azure. In many customer environments, an initial mount of the Azure file share on your on-premises workstation will fail, even though mounts from Azure VMs succeed. The reason for this is that many organizations and internet service providers (ISPs) block the port that SMB uses to communicate, port 445. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](https://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To unblock access to your Azure file share, you have two main options:

- Unblock port 445 for your organization's on-premises network. Azure file shares may only be externally accessed via the public endpoint using internet safe protocols such as SMB 3.0 and the FileREST API. This is the easiest way to access your Azure file share from on-premises since it doesn't require advanced networking configuration beyond changing your organization's outbound port rules, however, we recommend you remove legacy and deprecated versions of the SMB protocol, namely SMB 1.0. To learn how to do this, see [Securing Windows/Windows Server](storage-how-to-use-files-windows.md#securing-windowswindows-server) and [Securing Linux](storage-how-to-use-files-linux.md#securing-linux).

- Access Azure file shares over an ExpressRoute or VPN connection. When you access your Azure file share via a network tunnel, you are able to mount your Azure file share like an on-premises file share since SMB traffic does not traverse your organizational boundary.   

Although from a technical perspective it's considerably easier to mount your Azure file shares via the public endpoint, we expect most customers will opt to mount their Azure file shares over an ExpressRoute or VPN connection. Mounting with these options is possible with both SMB and NFS shares. To do this, you will need to configure the following for your environment:  

- **Network tunneling using ExpressRoute, Site-to-Site, or Point-to-Site VPN**: Tunneling into a virtual network allows accessing Azure file shares from on-premises, even if port 445 is blocked.
- **Private endpoints**: Private endpoints give your storage account a dedicated IP address from within the address space of the virtual network. This enables network tunneling without needing to open on-premises networks up to all the of the IP address ranges owned by the Azure storage clusters. 
- **DNS forwarding**: Configure your on-premises DNS to resolve the name of your storage account (`storageaccount.file.core.windows.net` for the public cloud regions) to resolve to the IP address of your private endpoints.

To plan for the networking associated with deploying an Azure file share, see [Azure Files networking considerations](storage-files-networking-overview.md).

## Encryption
Azure Files supports two different types of encryption: encryption in transit, which relates to the encryption used when mounting/accessing the Azure file share, and encryption at rest, which relates to how the data is encrypted when it is stored on disk. 

### Encryption in transit

> [!IMPORTANT]
> This section covers encryption in transit details for SMB shares. For details regarding encryption in transit with NFS shares, see [Security](storage-files-compare-protocols.md#security).

By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files will only allow the connection if it is made with SMB 3.0+ with encryption or HTTPS. Clients that do not support SMB 3.0 or clients that support SMB 3.0 but not SMB encryption will not be able to mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.0 with encryption, see our detailed documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.  

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1, SMB 3.0 without encryption, and unencrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, will not be able to access the file share.

We strongly recommend ensuring encryption of data in-transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Encryption at rest
[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

## Data protection
Azure Files has a multi-layered approach to ensuring your data is backed up, recoverable, and protected from security threats.

### Soft delete
Soft delete for file shares (preview) is a storage-account level setting that allows you to recover your file share when it is accidentally deleted. When a file share is deleted, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted data is recoverable before it's permanently deleted, and undelete the share anytime during this retention period. 

We recommend turning on soft delete for most file shares. If you have a workflow where share deletion is common and expected, you may decide to have a short retention period or not have soft delete enabled at all.

For more information about soft delete, see [Prevent accidental data deletion](./storage-files-prevent-file-share-deletion.md).

### Backup
You can back up your Azure file share via [share snapshots](./storage-snapshots-files.md), which are read-only, point-in-time copies of your share. Snapshots are incremental, meaning they only contain as much data as has changed since the previous snapshot. You can have up to 200 snapshots per file share and retain them for up to 10 years. You can either manually take these snapshots in the Azure portal, via PowerShell, or command-line interface (CLI), or you can use [Azure Backup](../../backup/azure-file-share-backup-overview.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). Snapshots are stored within your file share, meaning that if you delete your file share, your snapshots will also be deleted. To protect your snapshot backups from accidental deletion, ensure soft delete is enabled for your share.

[Azure Backup for Azure file shares](../../backup/azure-file-share-backup-overview.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) handles the scheduling and retention of snapshots. Its grandfather-father-son (GFS) capabilities mean that you can take daily, weekly, monthly, and yearly snapshots, each with their own distinct retention period. Azure Backup also orchestrates the enablement of soft delete and takes a delete lock on a storage account as soon as any file share within it is configured for backup. Lastly, Azure Backup provides certain key monitoring and alerting capabilities that allow customers to have a consolidated view of their backup estate.

You can perform both item-level and share-level restores in the Azure portal using Azure Backup. All you need to do is choose the restore point (a particular snapshot), the particular file or directory if relevant, and then the location (original or alternate) you wish you restore to. The backup service handles copying the snapshot data over and shows your restore progress in the portal.

For more information about backup, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Azure Defender for Azure Files 
Azure Defender for Azure Storage (formerly Advanced Threat Protection for Azure Storage) provides an additional layer of security intelligence that provides alerts when it detects anomalous activity on your storage account, for example unusual access attempts. It also runs malware hash reputation analysis and will alert on known malware. You can configure Azure Defender on a subscription or storage account level via Azure Security Center. 

For more information, see [Introduction to Azure Defender for Storage](../../security-center/defender-for-storage-introduction.md).

## Storage tiers
[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

### Enable standard file shares to span up to 100 TiB
By default, standard file shares can span only up to 5 TiB, but you can increase the share limit to 100 TiB. To learn how to increase your share limit, see [Enable and create large file shares](storage-files-how-to-create-large-file-share.md).


#### Limitations
[!INCLUDE [storage-files-tiers-large-file-share-availability](../../../includes/storage-files-tiers-large-file-share-availability.md)]

## Redundancy
[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

## Migration
In many cases, you will not be establishing a net new file share for your organization, but instead migrating an existing file share from an on-premises file server or NAS device to Azure Files. Picking the right migration strategy and tool for your scenario is important for the success of your migration. 

The [migration overview article](storage-files-migration-overview.md) briefly covers the basics and contains a table that leads you to migration guides that likely cover your scenario.

## Next steps
* [Planning for an Azure File Sync Deployment](../file-sync/file-sync-planning.md)
* [Deploying Azure Files](./storage-how-to-create-file-share.md)
* [Deploying Azure File Sync](../file-sync/file-sync-deployment-guide.md)
* [Check out the migration overview article to find the migration guide for your scenario](storage-files-migration-overview.md)