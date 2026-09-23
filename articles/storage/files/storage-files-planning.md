---
title: Plan an Azure Files deployment
description: Plan your Azure Files deployment by choosing a management model, protocol, identity configuration, networking approach, and media tier.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 08/17/2026
ms.author: kendownie
# Customer intent: As a system architect, I want to evaluate deployment options for Azure Files, so that I can determine the best approach for directly mounting or caching file shares while considering performance, compatibility, and organizational needs.
---

# Plan an Azure Files deployment

Planning an Azure Files deployment involves a few key decisions. Use this article to choose the right options for your workload.

You need to decide the following:

1. **How will clients access the share?** Directly mount from cloud or on-premises clients, or cache on-premises with [Azure File Sync](../file-sync/file-sync-introduction.md)?
2. **Which management model?** Classic file shares (storage accounts) or the new [Microsoft.FileShares](files-management-concepts.md#file-shares-microsoftfileshares) resource provider?
3. **Which protocol?** [SMB](#available-protocols) (Windows/Linux/macOS) or [NFS](#available-protocols) (Linux only)?
4. **How will users authenticate?** [Identity-based authentication](#identity) or storage account key?
5. **What networking configuration?** Public endpoint, service endpoints, or [private endpoints](#networking)?
6. **What performance tier and redundancy option?** [SSD or HDD](#storage-tiers), and which [redundancy option](#redundancy)?

The following sections cover each decision in detail.

> [!TIP]
> If you plan to use Azure File Sync, see [Plan for an Azure File Sync deployment](../file-sync/file-sync-planning.md) instead.

## Management concepts

Azure Files offers two management models for deploying file shares:

- **Classic file shares (Microsoft.Storage resource provider)**: Deploy file shares within a storage account. Supports SMB and NFS, SSD and HDD, all redundancy types, and all regions.
- **File shares (Microsoft.FileShares resource provider)**: Deploy file shares as top-level Azure resources without a storage account. Simplify management with per-share networking, billing, and security. Currently only available for NFS file shares.

For details about resource providers, feature comparisons, and regional availability, see [Azure Files management concepts](files-management-concepts.md).

## Available protocols

Azure Files offers two industry-standard file system protocols for mounting Azure file shares: the [Server Message Block (SMB)](files-smb-protocol.md) protocol and the [Network File System (NFS)](files-nfs-protocol.md) protocol. Choose the protocol that best fits your workload. Azure file shares don't support both the SMB and NFS protocols on the same file share, although you can create SMB and NFS Azure file shares within the same storage account.

With both SMB and NFS file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs, and thousands of clients can access them concurrently.

| Feature | SMB | NFS |
|-|-|-|
| Supported protocol versions | SMB 3.1.1, SMB 3.0, SMB 2.1 | NFS 4.1 |
| Recommended OS | <ul><li>Windows 11, version 21H2+</li><li>Windows 10, version 21H1+</li><li>Windows Server 2019+</li><li>Linux kernel version 5.3+</li></ul> | Linux kernel version 4.3+ |
| [Available media tiers](storage-files-planning.md#storage-tiers) | SSD and HDD | SSD only |
| [Redundancy](storage-files-planning.md#redundancy) | <ul><li>Local (LRS)</li><li>Zone (ZRS)</li><li>Geo (GRS)</li><li>GeoZone (GZRS)</li></ul> | <ul><li>Local (LRS)</li><li>Zone (ZRS)</li></ul> |
| File system semantics | Win32 | POSIX |
| Authentication | Identity-based authentication (Kerberos), shared key authentication (NTLMv2) | Host-based authentication |
| Authorization | Win32-style access control lists (ACLs) | UNIX-style permissions |
| Case sensitivity | Case insensitive, case preserving | Case sensitive |
| Deleting or modifying open files | With lock only | Yes |
| File sharing | [Windows sharing mode](/windows/win32/fileio/creating-and-opening-files) | Byte-range advisory network lock manager |
| Hard link support | Not supported | Supported |
| Symbolic link support | Not supported | Supported |
| Optionally internet accessible | Yes (SMB 3.0+ only) | No |
| Supports FileREST | Yes | Yes (Microsoft.Storage only) |
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
| Short file names (8.3 alias) | Not supported | N/A |
| File system transactions (TxF) | Not supported | N/A |

## Identity

To access an Azure file share, you must be authenticated and authorized to access the share. In nearly all cases, use [identity-based authentication](storage-files-active-directory-overview.md) instead of the storage account key to access SMB Azure file shares.

Azure Files supports the following methods of authentication for SMB shares:

- **On-premises Active Directory Domain Services (AD DS)**: You can domain join Azure storage accounts to a customer-owned Active Directory Domain Services, just like a Windows Server file server or NAS device. You can deploy a domain controller on-premises, in an Azure VM, or even as a VM in another cloud provider. Azure Files is agnostic to where your domain controller is hosted. After you domain join a storage account, the end user can mount a file share with the user account they signed into their PC with. AD-based authentication uses the Kerberos authentication protocol.
- **Microsoft Entra Domain Services**: Microsoft Entra Domain Services provides a Microsoft-managed domain controller that you can use for Azure resources. Domain joining your storage account to Microsoft Entra Domain Services provides similar benefits to domain joining it to a customer-owned AD DS. This deployment option is most useful for application lift-and-shift scenarios that require AD-based permissions. Because Domain Services provides AD-based authentication, this option also uses the Kerberos authentication protocol.
- **Microsoft Entra Kerberos**: Microsoft Entra Kerberos allows you to use Microsoft Entra ID to authenticate [hybrid](../../active-directory/hybrid/whatis-hybrid-identity.md) or cloud-only identities. This configuration uses Microsoft Entra ID to issue Kerberos tickets to access the file share with the SMB protocol. This means your end users can access Azure file shares over the internet from Microsoft Entra hybrid joined and Microsoft Entra joined VMs.
- **Active Directory authentication over SMB for Linux clients**: Azure Files supports identity-based authentication over SMB for Linux clients by using the Kerberos authentication protocol through either AD DS or Microsoft Entra Domain Services.
- **Azure storage account key**: Although it's not recommended for security reasons, you can also mount Azure file shares by using an Azure storage account key instead of using an identity. To mount a file share by using the storage account key, use the storage account name as the username and the storage account key as a password. Using the storage account key to mount the Azure file share is effectively an administrator operation, because the mounted file share has full permissions to all of the files and folders on the share, even if they have ACLs. When you use the storage account key to mount over SMB, the NTLMv2 authentication protocol is used. If you must use the storage account key, use private endpoints or service endpoints as described in the [Networking](#networking) section.

For customers migrating from on-premises file servers or creating new file shares in Azure Files intended to behave like Windows Server file servers or NAS appliances, domain join your storage account to the customer-owned AD DS. To learn more, see [Overview - on-premises AD DS authentication over SMB for Azure file shares](storage-files-identity-ad-ds-overview.md).

## Networking

Directly mounting your Azure file share often requires some thought about networking configuration because:

- Many organizations and internet service providers (ISPs) block port 445, which SMB file shares use for communication, for outbound (internet) traffic.
- NFS file shares rely on network-level authentication and are therefore only accessible via restricted networks. Using an NFS file share always requires some level of networking configuration.

To configure networking, Azure Files provides an internet accessible public endpoint and integration with Azure Networking features like _service endpoints_, which help restrict the public endpoint to specified virtual networks, and _private endpoints_, which give your storage account a private IP address from within a virtual network IP address space. While there's no extra charge for using public endpoints or service endpoints, standard data processing rates apply for private endpoints.

Consider the following network configurations:

- If the required protocol is SMB and all access over SMB is from clients in Azure, no special networking configuration is required.
- If the required protocol is SMB and the access is from clients on-premises, then a VPN or Azure ExpressRoute connection from on-premises to your Azure network is required, with Azure Files exposed on your internal network using private endpoints.
- If the required protocol is NFS, you can use either service endpoints or private endpoints to restrict the network to specified virtual networks. If you need a static IP address and/or your workload requires high availability, use a private endpoint. With service endpoints, a rare event such as a zone outage could cause the underlying IP address of the storage account to change. While the data is still available on the file share, the client would require a remount of the share.

For more information, see [Azure Files networking considerations](storage-files-networking-overview.md).

In addition to directly connecting to the file share using the public endpoint or using a VPN/ExpressRoute connection with a private endpoint, SMB provides an additional client access strategy: SMB over QUIC. SMB over QUIC offers zero-config "SMB VPN" for SMB access over the QUIC transport protocol. Although Azure Files doesn't directly support SMB over QUIC, you can create a lightweight cache of your Azure file shares on a Windows Server 2022 Azure Edition VM by using Azure File Sync. To learn more about this option, see [SMB over QUIC with Azure File Sync](storage-files-networking-overview.md#smb-over-quic).

## Encryption for Azure Files

Azure Files supports two different types of encryption:

- **Encryption in transit**, which relates to the encryption used when mounting or accessing the Azure file share
- **Encryption at rest**, which relates to how the data is encrypted when it's stored on disk

### Encryption in transit

By default, all Azure storage accounts have encryption in transit enabled. This feature means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files only allows the connection if it's made with SMB 3.x with encryption or HTTPS. Clients that don't support SMB 3.x or clients that support SMB 3.x but not SMB encryption can't mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.x with encryption, see the documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.

You can disable encryption in transit for an Azure storage account. When you disable encryption, Azure Files also allows SMB 2.1 and SMB 3.x without encryption, and unencrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must run on an older operating system, such as Windows Server 2008 R2 or an older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share. An SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, can't access the file share.

Ensure encryption of data in transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=/azure/storage/files/toc.json) and [Encryption in transit for NFS Azure file shares](encryption-in-transit-for-nfs-shares.md).

### Encryption at rest

[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

You can't use customer-managed keys for encryption at rest with Azure file shares created using the Microsoft.FileShares resource provider. You must use Microsoft-managed keys.

## Data protection

Azure Files uses a multilayered approach to ensure your data is backed up, recoverable, and protected from security threats. See [Azure Files data protection overview](files-data-protection-overview.md).

### Soft delete

Soft delete is a storage-account level setting that you can use to recover your file share when it's accidentally deleted. When you delete a file share, it transitions to a soft deleted state instead of being permanently erased. You can configure the amount of time soft deleted shares are recoverable before they're permanently deleted, and undelete the share anytime during this retention period.

Soft delete is enabled by default for new storage accounts. If you have a workflow where share deletion is common and expected, you might decide to set a short retention period or not enable soft delete.

For more information about soft delete, see [Prevent accidental data deletion](./storage-files-prevent-file-share-deletion.md).

### Backup

Back up your Azure file shares by using [share snapshots](./storage-snapshots-files.md), which are read-only, point-in-time copies of your share. Snapshots are incremental, so they only include data that changed since the previous snapshot. Each file share supports up to 200 snapshots, and you can keep them for up to 10 years. You can manually create snapshots in the Azure portal, or use PowerShell or the command-line interface (CLI). You can also use [Azure Backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json).

[Azure Backup for SMB Azure file shares](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json) handles the scheduling and retention of snapshots. Its grandfather-father-son (GFS) capabilities mean that you can take daily, weekly, monthly, and yearly snapshots, each with their own distinct retention period. Azure Backup also orchestrates the enablement of soft delete and takes a delete lock on a storage account as soon as any file share within it is configured for backup. Azure Backup provides certain key monitoring and alerting capabilities that allow customers to have a consolidated view of their backup estate.

You can perform both item-level and share-level restores in the Azure portal using Azure Backup. Choose the restore point (a particular snapshot), the particular file or directory if relevant, and then the location (original or alternate) you want to restore to. The backup service handles copying the snapshot data over and shows your restore progress in the portal.

### Protect Azure Files with Microsoft Defender for Storage

Microsoft Defender for Storage is an Azure-native layer of security intelligence that detects potential threats to your storage accounts. It provides comprehensive security by analyzing the data plane and control plane telemetry generated by Azure Files. It uses advanced threat detection capabilities powered by [Microsoft Threat Intelligence](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence) to provide contextual security alerts, including steps to mitigate the detected threats and prevent future attacks.

Defender for Storage continuously analyzes the telemetry stream generated by Azure Files. When potentially malicious activities are detected, security alerts are generated. These alerts are displayed in Microsoft Defender for Cloud, along with the details of the suspicious activity, investigation steps, remediation actions, and security recommendations.

Defender for Storage detects known malware, such as ransomware, viruses, spyware, and other malware uploaded to a storage account based on full file hash (only supported for REST API). This helps prevent malware from entering the organization and spreading to more users and resources. See [Understanding the differences between Malware Scanning and hash reputation analysis](/azure/defender-for-cloud/defender-for-storage-introduction#understanding-the-differences-between-malware-scanning-and-hash-reputation-analysis).

Defender for Storage doesn't access the storage account data and doesn't impact its performance. You can [enable Microsoft Defender for Storage](../common/azure-defender-storage-configure.md) at the subscription level (recommended) or the resource level.

## Storage tiers

[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

## Redundancy

[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

For more information about redundancy, see [Azure Files data redundancy](files-redundancy.md).

### Availability of zone redundant SSD file shares

Zone redundant SSD file shares are available for a [subset of Azure regions](redundancy-premium-file-shares.md#zrs-support-for-ssd-classic-file-shares).

## Disaster recovery and failover

In the case of an unplanned regional service outage, you should have a disaster recovery (DR) plan in place for your Azure file shares. To understand the concepts and processes involved with DR and storage account failover, see [Disaster recovery and failover for Azure Files](files-disaster-recovery.md).

## Migration

In many cases, you won't be establishing a net new file share for your organization, but instead migrating an existing file share from an on-premises file server or NAS device to Azure Files. Picking the right migration strategy and tool is important for the success of your migration.

For SMB migrations, see [SMB migration overview](storage-files-migration-overview.md) which contains a table that leads you to migration guides that likely cover your scenario.

For NFS migrations, see [Migrate to NFS Azure file shares](storage-files-migration-nfs.md).

## Next steps

- [Plan for an Azure File Sync Deployment](../file-sync/file-sync-planning.md)
- [Deploy Azure Files](./storage-how-to-create-file-share.md)
- [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md)



