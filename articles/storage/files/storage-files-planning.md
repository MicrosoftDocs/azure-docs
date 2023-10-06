---
title: Planning for an Azure Files deployment
description: Understand how to plan for an Azure Files deployment. You can either direct mount an Azure file share, or cache Azure file shares on-premises with Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 10/05/2023
ms.author: kendownie
ms.custom: references_regions
---

# Planning for an Azure Files deployment
You can deploy [Azure Files](storage-files-introduction.md) in two main ways: by directly mounting the serverless Azure file shares or by caching Azure file shares on-premises using Azure File Sync. Deployment considerations will differ based on which option you choose.

- **Direct mount of an Azure file share**: Because Azure Files provides either Server Message Block (SMB) or Network File System (NFS) access, you can mount Azure file shares on-premises or in the cloud using the standard SMB or NFS clients available in your OS. Because Azure file shares are serverless, deploying for production scenarios doesn't require managing a file server or NAS device. This means you don't have to apply software patches or swap out physical disks. 

- **Cache Azure file share on-premises with Azure File Sync**: [Azure File Sync](../file-sync/file-sync-introduction.md) enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server into a quick cache of your SMB Azure file share. 

This article primarily addresses deployment considerations for deploying an Azure file share to be directly mounted by an on-premises or cloud client. To plan for an Azure File Sync deployment, see [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).

## Available protocols
Azure Files offers two industry-standard file system protocols for mounting Azure file shares: the [Server Message Block (SMB)](files-smb-protocol.md) protocol and the [Network File System (NFS)](files-nfs-protocol.md) protocol, allowing you to choose the protocol that is the best fit for your workload. Azure file shares don't support both the SMB and NFS protocols on the same file share, although you can create SMB and NFS Azure file shares within the same storage account. NFS 4.1 is currently only supported within new **FileStorage** storage account type (premium file shares only).

With both SMB and NFS file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

| Feature | SMB | NFS |
|---------|-----|---------------|
| Supported protocol versions | SMB 3.1.1, SMB 3.0, SMB 2.1 | NFS 4.1 |
| Recommended OS | <ul><li>Windows 11, version 21H2+</li><li>Windows 10, version 21H1+</li><li>Windows Server 2019+</li><li>Linux kernel version 5.3+</li></ul> | Linux kernel version 4.3+ |
| [Available tiers](storage-files-planning.md#storage-tiers)  | Premium, transaction optimized, hot, and cool | Premium |
| Billing model | <ul><li>[Provisioned capacity for premium file shares](./understanding-billing.md#provisioned-model)</li><li>[Pay-as-you-go for standard file shares](./understanding-billing.md#pay-as-you-go-model)</li></ul> | [Provisioned capacity](./understanding-billing.md#provisioned-model) |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md#storage-account-endpoints) | Supported | Supported |
| [Redundancy](storage-files-planning.md#redundancy) | LRS, ZRS, GRS, GZRS | LRS, ZRS |
| File system semantics | Win32 | POSIX |
| Authentication | Identity-based authentication (Kerberos), shared key authentication (NTLMv2) | Host-based authentication |
| Authorization | Win32-style access control lists (ACLs) | UNIX-style permissions |
| Case sensitivity | Case insensitive, case preserving | Case sensitive |
| Deleting or modifying open files | With lock only | Yes |
| File sharing | [Windows sharing mode](/windows/win32/fileio/creating-and-opening-files) | Byte-range advisory network lock manager |
| Hard link support | Not supported | Supported |
| Symbolic link support | Not supported | Supported |
| Optionally internet accessible | Yes (SMB 3.0+ only) | No |
| Supports FileREST | Yes | Subset: <br /><ul><li>[Operations on the `FileService`](/rest/api/storageservices/operations-on-the-account--file-service-)</li><li>[Operations on `FileShares`](/rest/api/storageservices/operations-on-shares--file-service-)</li><li>[Operations on `Directories`](/rest/api/storageservices/operations-on-directories)</li><li>[Operations on `Files`](/rest/api/storageservices/operations-on-files)</li></ul> |
| Mandatory byte range locks | Supported | Not supported |
| Advisory byte range locks | Not supported | Supported |
| Extended/named attributes | Not supported | Not supported |
| Alternate data streams | Not supported | N/A |
| Object identifiers | Not supported | N/A |
| Reparse points | Not supported | N/A |
| Sparse files | Not supported | N/A |
| Compression | Not supported | N/A |
| Named pipes | Not supported | N/A |
| SMB Direct | Not supported | N/A |
| SMB Directory Leasing | Not supported | N/A |
| Volume Shadow Copy | Not supported | N/A |
| Short file names (8.3 alias ) | Not supported | N/A |
| Server service | Not supported | N/A |
| File system transactions (TxF) | Not supported | N/A |

## Management concepts
[!INCLUDE [storage-files-file-share-management-concepts](../../../includes/storage-files-file-share-management-concepts.md)]

When deploying Azure file shares into storage accounts, we recommend:

- Only deploying Azure file shares into storage accounts with other Azure file shares. Although GPv2 storage accounts allow you to have mixed purpose storage accounts, because storage resources such as Azure file shares and blob containers share the storage account's limits, mixing resources together may make it more difficult to troubleshoot performance issues later on. 

- Paying attention to a storage account's IOPS limitations when deploying Azure file shares. Ideally, you would map file shares 1:1 with storage accounts. However, this may not always be possible due to various limits and restrictions, both from your organization and from Azure. When it is not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

- Only deploying GPv2 and FileStorage accounts, and upgrading GPv1 and classic storage accounts when you find them in your environment. 

## Identity
To access an Azure file share, the user of the file share must be authenticated and authorized to access the share. This is done based on the identity of the user accessing the file share. Azure Files supports the following methods of authentication:

- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS)**: Azure storage accounts can be domain joined to a customer-owned Active Directory Domain Services, just like a Windows Server file server or NAS device. You can deploy a domain controller on-premises, in an Azure VM, or even as a VM in another cloud provider; Azure Files is agnostic to where your domain controller is hosted. Once a storage account is domain-joined, the end user can mount a file share with the user account they signed into their PC with. AD-based authentication uses the Kerberos authentication protocol.
- **Azure Active Directory Domain Services (Azure AD DS)**: Azure AD DS provides a Microsoft-managed domain controller that can be used for Azure resources. Domain joining your storage account to Azure AD DS provides similar benefits to domain joining it to a customer-owned AD DS. This deployment option is most useful for application lift-and-shift scenarios that require AD-based permissions. Since Azure AD DS provides AD-based authentication, this option also uses the Kerberos authentication protocol.
- **Azure Active Directory (Azure AD) Kerberos for hybrid identities**: Azure AD Kerberos allows you to use Azure AD to authenticate [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which are on-premises AD identities that are synced to the cloud. This configuration uses Azure AD to issue Kerberos tickets to access the file share with the SMB protocol. This means your end users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from hybrid Azure AD-joined and Azure AD-joined VMs.
- **Active Directory authentication over SMB for Linux clients**: Azure Files supports identity-based authentication over SMB for Linux clients using the Kerberos authentication protocol through either AD DS or Azure AD DS.
- **Azure storage account key**: Azure file shares may also be mounted with an Azure storage account key. To mount a file share this way, the storage account name is used as the username and the storage account key is used as a password. Using the storage account key to mount the Azure file share is effectively an administrator operation, because the mounted file share will have full permissions to all of the files and folders on the share, even if they have ACLs. When using the storage account key to mount over SMB, the NTLMv2 authentication protocol is used. If you intend to use the storage account key to access your Azure file shares, we recommend using private endpoints or service endpoints as described in the [Networking](#networking) section.

For customers migrating from on-premises file servers, or creating new file shares in Azure Files intended to behave like Windows file servers or NAS appliances, domain joining your storage account to **Customer-owned AD DS** is the recommended option. To learn more about domain joining your storage account to a customer-owned AD DS, see [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md).

## Networking
Directly mounting your Azure file share often requires some thought about networking configuration because:

- The port that SMB file shares use for communication, port 445, is frequently blocked by many organizations and internet service providers (ISPs) for outbound (internet) traffic.
- NFS file shares rely on network-level authentication and are therefore only accessible via restricted networks. Using an NFS file share always requires some level of networking configuration.

To configure networking, Azure Files provides an internet accessible public endpoint and integration with Azure networking features like *service endpoints*, which help restrict the public endpoint to specified virtual networks, and *private endpoints*, which give your storage account a private IP address from within a virtual network IP address space. While there's no extra charge for using public endpoints or service endpoints, standard data processing rates apply for private endpoints.

From a practical perspective, this means you'll need to consider the following network configurations:

- If the required protocol is SMB and all access over SMB is from clients in Azure, no special networking configuration is required.
- If the required protocol is SMB and the access is from clients on-premises, then a VPN or ExpressRoute connection from on-premises to your Azure network is required, with Azure Files exposed on your internal network using private endpoints.
- If the required protocol is NFS, you can use either service endpoints or private endpoints to restrict the network to specified virtual networks. If you need a static IP address and/or your workload requires high availability, use a private endpoint.

To learn more about how to configure networking for Azure Files, see [Azure Files networking considerations](storage-files-networking-overview.md).

In addition to directly connecting to the file share using the public endpoint or using a VPN/ExpressRoute connection with a private endpoint, SMB provides an additional client access strategy: SMB over QUIC. SMB over QUIC offers zero-config "SMB VPN" for SMB access over the QUIC transport protocol. Although Azure Files does not directly support SMB over QUIC, you can create a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM using Azure File Sync. To learn more about this option, see [SMB over QUIC with Azure File Sync](storage-files-networking-overview.md#smb-over-quic).

## Encryption
Azure Files supports two different types of encryption: 

- **Encryption in transit**, which relates to the encryption used when mounting/accessing the Azure file share
- **Encryption at rest**, which relates to how the data is encrypted when it's stored on disk

### Encryption in transit

> [!IMPORTANT]
> This section covers encryption in transit details for SMB shares. For details regarding encryption in transit with NFS shares, see [Security and networking](files-nfs-protocol.md#security-and-networking).

By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files will only allow the connection if it is made with SMB 3.x with encryption or HTTPS. Clients that don't support SMB 3.x or clients that support SMB 3.x but not SMB encryption won't be able to mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.x with encryption, see our documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.  

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1 and SMB 3.x without encryption, and unencrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or an older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, won't be able to access the file share.

We strongly recommend ensuring encryption of data in-transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=/azure/storage/files/toc.json).

### Encryption at rest
[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

## Data protection
Azure Files has a multi-layered approach to ensuring your data is backed up, recoverable, and protected from security threats. See [Azure Files data protection overview](files-data-protection-overview.md).

### Soft delete
Soft delete is a storage-account level setting for SMB file shares that allows you to recover your file share when it's accidentally deleted. When a file share is deleted, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted shares are recoverable before they're permanently deleted, and undelete the share anytime during this retention period. 

Soft delete is enabled by default for new storage accounts from January 2021 onward, and we recommend leaving it on for most SMB file shares. If you have a workflow where share deletion is common and expected, you might decide to have a short retention period or not have soft delete enabled at all. Soft delete doesn't work for NFS shares, even if it's enabled for the storage account.

For more information about soft delete, see [Prevent accidental data deletion](./storage-files-prevent-file-share-deletion.md).

### Backup
You can back up your Azure file share via [share snapshots](./storage-snapshots-files.md), which are read-only, point-in-time copies of your share. Snapshots are incremental, meaning they only contain as much data as has changed since the previous snapshot. You can have up to 200 snapshots per file share and retain them for up to 10 years. You can either manually take snapshots in the Azure portal, via PowerShell, or command-line interface (CLI), or you can use [Azure Backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json). 

[Azure Backup for Azure file shares](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json) handles the scheduling and retention of snapshots. Its grandfather-father-son (GFS) capabilities mean that you can take daily, weekly, monthly, and yearly snapshots, each with their own distinct retention period. Azure Backup also orchestrates the enablement of soft delete and takes a delete lock on a storage account as soon as any file share within it is configured for backup. Lastly, Azure Backup provides certain key monitoring and alerting capabilities that allow customers to have a consolidated view of their backup estate.

You can perform both item-level and share-level restores in the Azure portal using Azure Backup. All you need to do is choose the restore point (a particular snapshot), the particular file or directory if relevant, and then the location (original or alternate) you wish you restore to. The backup service handles copying the snapshot data over and shows your restore progress in the portal.

### Protect Azure Files with Microsoft Defender for Storage
Microsoft Defender for Storage is an Azure-native layer of security intelligence that detects potential threats to your storage accounts. It provides comprehensive security by analyzing the data plane and control plane telemetry generated by Azure Files. It uses advanced threat detection capabilities powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) to provide contextual security alerts, including steps to mitigate the detected threats and prevent future attacks.

Defender for Storage continuously analyzes the telemetry stream generated by Azure Files. When potentially malicious activities are detected, security alerts are generated. These alerts are displayed in Microsoft Defender for Cloud, along with the details of the suspicious activity, investigation steps, remediation actions, and security recommendations.

Defender for Storage detects known malware, such as ransomware, viruses, spyware, and other malware uploaded to a storage account based on full file hash (only supported for REST API). This helps prevent malware from entering the organization and spreading to more users and resources. See [Understanding the differences between Malware Scanning and hash reputation analysis](../../defender-for-cloud/defender-for-storage-introduction.md#understanding-the-differences-between-malware-scanning-and-hash-reputation-analysis).

Defender for Storage doesn't access the storage account data and doesn't impact its performance. You can [enable Microsoft Defender for Storage](../common/azure-defender-storage-configure.md) at the subscription level (recommended) or the resource level.

## Storage tiers
[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

#### Limitations
[!INCLUDE [storage-files-tiers-large-file-share-availability](../../../includes/storage-files-tiers-large-file-share-availability.md)]

## Redundancy
[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

For more information about redundancy, see [Azure Files data redundancy](files-redundancy.md).

### Standard ZRS availability

ZRS for standard general-purpose v2 storage accounts is available for a [subset of Azure regions](../common/redundancy-regions-zrs.md).

### Premium ZRS availability

ZRS for premium file shares is available for a [subset of Azure regions](redundancy-premium-file-shares.md#premium-file-share-accounts).

### Standard GZRS availability

GZRS is available for a [subset of Azure regions](../common/redundancy-regions-gzrs.md).

## Disaster recovery and failover

In the case of an unplanned regional service outage, you should have a disaster recovery (DR) plan in place for your Azure file shares. To understand the concepts and processes involved with DR and storage account failover, see [Disaster recovery and failover for Azure Files](files-disaster-recovery.md).

## Migration
In many cases, you won't be establishing a net new file share for your organization, but instead migrating an existing file share from an on-premises file server or NAS device to Azure Files. Picking the right migration strategy and tool for your scenario is important for the success of your migration. 

The [migration overview article](storage-files-migration-overview.md) briefly covers the basics and contains a table that leads you to migration guides that likely cover your scenario.

## Next steps
* [Planning for an Azure File Sync Deployment](../file-sync/file-sync-planning.md)
* [Deploying Azure Files](./storage-how-to-create-file-share.md)
* [Deploying Azure File Sync](../file-sync/file-sync-deployment-guide.md)
* [Check out the migration overview article to find the migration guide for your scenario](storage-files-migration-overview.md)
