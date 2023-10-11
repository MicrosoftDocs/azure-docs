---
title: What's new in Azure Files and Azure File Sync
description: Learn about new features and enhancements in Azure Files and Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 10/11/2023
ms.author: kendownie
---

# What's new in Azure Files
Azure Files is updated regularly to offer new features and enhancements. This article provides detailed information about what's new in Azure Files and Azure File Sync.

## What's new in 2023

### 2023 quarter 4 (October, November, December)

#### Azure Files now supports all valid Unicode characters

Expanded character support will allow users to create SMB file shares with file and directory names on par with the NTFS file system for all valid Unicode characters. It also enables tools like AzCopy and Storage Mover to migrate all the files into Azure Files using the REST protocol. Expanded character support is now available in all Azure regions.

For more information, [read the announcement](https://azure.microsoft.com/updates/azurefilessupportforunicodecharacters/).

### 2023 quarter 3 (July, August, September)

#### Azure Active Directory support for Azure Files REST API with OAuth authentication is generally available

This feature enables share-level read and write access to SMB Azure file shares for users, groups, and managed identities when accessing file share data through the REST API. Cloud native and modern applications that use REST APIs can utilize identity-based authentication and authorization to access file shares. For more information, [read the blog post](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-introducing-azure-ad-support-for-azure-files-smb/ba-p/3826733).

### 2023 quarter 2 (April, May, June)

#### Azure Files scalability improvement for Azure Virtual Desktop and other workloads that open root directory handles is generally available

Azure Files has increased the root directory handle limit per share from 2,000 to 10,000 for standard and premium file shares. This improvement benefits applications that keep an open handle on the root directory. For example, Azure Virtual Desktop with FSLogix profile containers now supports 10,000 active users per share (5x improvement). 

Note: The number of active users supported per share is dependent on the applications that are accessing the share. If your applications are not opening a handle on the root directory, Azure Files can support more than 10,000 active users per share.
 
The root directory handle limit has been increased in all regions and applies to all existing and new file shares. For more information about Azure Files scale targets, see: [Azure Files scalability and performance targets](storage-files-scale-targets.md).

#### Geo-redundant storage for large file shares is in public preview

Azure Files geo-redundancy for large file shares preview significantly improves capacity and performance for standard SMB file shares when using geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) options. The preview is only available for standard SMB Azure file shares. For more information, see [Azure Files geo-redundancy for large file shares preview](geo-redundant-storage-for-large-file-shares.md).

#### New SLA of 99.99 percent uptime for Azure Files Premium Tier is generally available

Azure Files now offers a 99.99 percent SLA per file share for all Azure Files Premium shares, regardless of protocol (SMB, NFS, and REST) or redundancy type. This means that you can benefit from this SLA immediately, without any configuration changes or extra costs. If the availability drops below the guaranteed 99.99 percent uptime, you’re eligible for service credits.

#### Azure Active Directory support for Azure Files REST API with OAuth authentication is in public preview

This preview enables share-level read and write access to SMB Azure file shares for users, groups, and managed identities when accessing file share data through the REST API. Cloud native and modern applications that use REST APIs can utilize identity-based authentication and authorization to access file shares. For more information, [read the blog post](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-introducing-azure-ad-support-for-azure-files-smb/ba-p/3826733).

#### AD Kerberos authentication for Linux clients (SMB) is generally available

Azure Files customers can now use identity-based Kerberos authentication for Linux clients over SMB using either on-premises Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS). For more information, see [Enable Active Directory authentication over SMB for Linux clients accessing Azure Files](storage-files-identity-auth-linux-kerberos-enable.md).

### 2023 quarter 1 (January, February, March)
#### Nconnect for NFS Azure file shares is generally available

Nconnect is a client-side Linux mount option that increases performance at scale by allowing you to use more TCP connections between the Linux client and the Azure Premium Files service for NFSv4.1. With nconnect, you can increase performance at scale using fewer client machines to reduce total cost of ownership. For more information, see [Improve NFS Azure file share performance](nfs-performance.md).

#### Improved Azure File Sync service availability

Azure File Sync is now a zone-redundant service, which means an outage in a zone has limited impact while improving the service resiliency to minimize customer impact. To fully leverage this improvement, configure your storage accounts to use zone-redundant storage (ZRS) or geo-zone redundant storage (GZRS) replication. To learn more about different redundancy options for your storage accounts, see [Azure Files redundancy](files-redundancy.md).

Note: Azure File Sync is zone-redundant in all regions that [support zones](../../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support) except US Gov Virginia.

## What's new in 2022

### 2022 quarter 4 (October, November, December)
#### Azure Active Directory (Azure AD) Kerberos authentication for hybrid identities on Azure Files is generally available
This [feature](storage-files-identity-auth-hybrid-identities-enable.md) builds on top of [FSLogix profile container support](../../virtual-desktop/create-profile-container-azure-ad.md) released in December 2022 and expands it to support more use cases (SMB only). Hybrid identities, which are user identities created in Active Directory Domain Services (AD DS) and synced to Azure AD, can mount and access Azure file shares without the need for line-of-sight to an Active Directory domain controller. While the initial support is limited to hybrid identities, it’s a significant milestone as we simplify identity-based authentication for Azure Files customers. [Read the blog post](https://techcommunity.microsoft.com/t5/azure-storage-blog/general-availability-azure-active-directory-kerberos-with-azure/ba-p/3612111).

### 2022 quarter 2 (April, May, June)
#### SUSE Linux support for SAP HANA System Replication (HSR) and Pacemaker
Azure customers can now [deploy a highly available SAP HANA system in a scale-out configuration](../../virtual-machines/workloads/sap/sap-hana-high-availability-scale-out-hsr-suse.md) with HSR and Pacemaker on Azure SUSE Linux Enterprise Server virtual machines (VMs), using NFS Azure file shares for a shared file system.

### 2022 quarter 1 (January, February, March)
#### Azure File Sync TCO improvements
To offer sync and tiering, Azure File Sync performs two types of transactions on behalf of the customer:
- Transactions from churn, including changed files (sync) and recalled files (tiering).
- Transactions from cloud change enumeration, done to discover changes made directly on the Azure file share. Historically, this was a major component of an Azure File Sync customer’s Azure Files bill.

To improve TCO, we markedly decreased the number of transactions needed to fully scan an Azure file share. Prior to this change, most customers were best off in the hot tier. Now most customers are best off in the cool tier.

## What's new in 2021

### 2021 quarter 4 (October, November, December)
#### Increased IOPS for premium file shares
Premium Azure file shares now have additional included baseline IOPS and a higher minimum burst IOPS. The baseline IOPS included with a provisioned share was increased from 400 to 3,000, meaning that a 100 GiB share (the minimum share size) is guaranteed 3,100 baseline IOPS. Additionally, the floor for burst IOPS was increased from 4,000 to 10,000, meaning that every premium file share will be able to burst up to at least 10,000 IOPS. 

Formula changes:

| Item | Old value | New value
|-|-|-|
| Baseline IOPS formula | `MIN(400 + 1 * ProvisionedGiB, 100000)` | `MIN(3000 + 1 * ProvisionedGiB, 100000)` |
| Burst limit | `MIN(MAX(4000, 3 * ProvisionedGiB), 100000)` | `MIN(MAX(10000, 3 * ProvisionedGiB), 100000)` |

For more information, see:
- [The provisioned model for premium Azure file shares](understanding-billing.md#provisioned-model)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

#### NFSv4.1 protocol support is generally available
Premium Azure file shares now support either the SMB or the NFSv4.1 protocols. NFSv4.1 is available in all regions where Azure Files supports the premium tier, for both locally redundant storage and zone-redundant storage. Azure file shares created with the NFSv4.1 protocol enabled are fully POSIX-compliant, distributed file shares that support a wide variety of Linux and container-based workloads. Some example workloads include: highly available SAP application layer, enterprise messaging, user home directories, custom line-of-business applications, database backups, database replication, and Azure Pipelines.

For more information, see:

- [NFS file shares in Azure Files](files-nfs-protocol.md)
- [High availability for SAP NetWeaver on Azure VMs with NFS on Azure Files](../../virtual-machines/workloads/sap/high-availability-guide-suse-nfs-azure-files.md)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

#### Symmetric throughput for premium file shares
Premium Azure file shares now support symmetric throughput provisioning, which enables the provisioned throughput for an Azure file share to be used for 100% ingress, 100% egress, or some mixture of ingress and egress. Symmetric throughput provides the flexibility to make full utilization of available throughput and aligns premium file shares with standard file shares.

Formula changes:

| Item | Old value | New value
|-|-|-|
| Throughput (MiB/sec) | <ul><li>Ingress: `40 + CEILING(0.04 * ProvisionedGiB)`</li><li>Egress: `60 + CEILING(0.06 * ProvisionedGiB)`</li></ul> | `100 + CEILING(0.04 * ProvisionedGiB) + CEILING(0.06 * ProvisionedGiB)` |

For more information, see:
- [The provisioned model for premium Azure file shares](understanding-billing.md#provisioned-model)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

### 2021 quarter 3 (July, August, September)
#### SMB Multichannel is generally available
SMB Multichannel enables SMB clients to establish multiple parallel connections to an Azure file share. This allows SMB clients to take full advantage of all available network bandwidth and makes them resilient to network failures, reducing total cost of ownership and enabling 2-3x for reads and 3-4x for writes through a single client. SMB Multichannel is available for premium file shares (file shares deployed in the FileStorage storage account kind) and is disabled by default. 

For more information, see:

- [SMB Multichannel performance in Azure Files](smb-performance.md)
- [Enable SMB Multichannel](files-smb-protocol.md#smb-multichannel)
- [Overview on SMB Multichannel in the Windows Server documentation](/azure-stack/hci/manage/manage-smb-multichannel)

#### SMB 3.1.1 and SMB security settings
SMB 3.1.1 is the most recent version of the SMB protocol, released with Windows 10, containing important security and performance updates. Azure Files SMB 3.1.1 ships with two additional encryption modes, AES-128-GCM and AES-256-GCM, in addition to AES-128-CCM which was already supported. To maximize performance, AES-128-GCM is negotiated as the default SMB channel encryption option; AES-128-CCM will only be negotiated on older clients that don't support AES-128-GCM. 

Depending on your organization's regulatory and compliance requirements, AES-256-GCM can be negotiated instead of AES-128-GCM by either restricting allowed SMB channel encryption options on the SMB clients, in Azure Files, or both. Support for AES-256-GCM was added in Windows Server 2022 and Windows 10, version 21H1.

In addition to SMB 3.1.1, Azure Files exposes security settings that change the behavior of the SMB protocol. With this release, you may configure allowed SMB protocol versions, SMB channel encryption options, authentication methods, and Kerberos ticket encryption options. By default, Azure Files enables the most compatible options, however these options may be toggled at any time.

For more information, see:

- [SMB security settings](files-smb-protocol.md#smb-security-settings)
- [Windows](storage-how-to-use-files-windows.md) and [Linux](storage-how-to-use-files-linux.md) SMB version information
- [Overview of SMB features in the Windows Server documentation](/windows-server/storage/file-server/file-server-smb-overview)

### 2021 quarter 2 (April, May, June)
#### Premium, hot, and cool storage reservations 
Azure Files supports storage reservations (also referred to as *reserved instances*). Azure Files Reservations allow you to achieve a discount on storage by pre-committing to storage utilization. Azure Files supports Reservations on the premium, hot, and cool tiers. Reservations are sold in units of 10 TiB or 100 TiB, for terms of either one year or three years. 

For more information, see:

- [Understanding Azure Files billing](understanding-billing.md)
- [Optimized costs for Azure Files with reservations](files-reserve-capacity.md)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

#### Improved portal experience for domain joining to Active Directory
The experience for domain joining an Azure storage account has been improved to help guide first-time Azure file share admins through the process. When you select Active Directory under **File share settings** in the **File shares** section of the Azure portal, you will be guided through the steps required to domain join.

:::image type="content" source="media/files-whats-new/ad-domain-join-1.png" alt-text="Screenshot of the new portal experience for domain joining a storage account to Active Directory" lightbox="media/files-whats-new/ad-domain-join-1.png":::

For more information, see:

- [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md)
- [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md)

### 2021 quarter 1 (January, February, March)
#### Azure Files management now available through the control plane
Management APIs for Azure Files resources, the file service and file shares, are now available through control plane (`Microsoft.Storage` resource provider). This enables Azure file shares to be created with an Azure Resource Manager or Bicep template, to be fully manageable when the data plane (i.e. the FileREST API) is inaccessible (like when the storage account's public endpoint is disabled), and to support full role-based access control (RBAC) semantics.

We recommend you manage Azure Files through the control plane in most cases. To support management of the file service and file shares through the control plane, the Azure portal, Azure storage PowerShell module, and Azure CLI have been updated to support most management actions through the control plane. 

To preserve existing script behavior, the Azure storage PowerShell module and the Azure CLI maintain the existing commands that use the data plane to manage the file service and file shares, as well as adding new commands to use the control plane. Portal requests only go through the control plane resource provider. PowerShell and CLI commands are named as follows:

- Az.Storage PowerShell:
    - Control plane file share cmdlets are prefixed with `Rm`, for example: `New-AzRmStorageShare`, `Get-AzRmStorageShare`, `Update-AzRmStorageShare`, and `Remove-AzRmStorageShare`. 
    - Traditional data plane file share cmdlets don't have a prefix, for example `New-AzStorageShare`, `Get-AzStorageShare`, `Set-AzStorageShareQuota`, and `Remove-AzStorageShare`.
    - Cmdlets to manage the file service are only available through the control plane and don't have any special prefix, for example `Get-AzStorageFileServiceProperty` and `Update-AzStorageFileServiceProperty`.
- Azure storage CLI:
    - Control plane file share commands are available under the `az storage share-rm` command group, for example: `az storage share-rm create`, `az storage share-rm update`, etc.
    - Traditional file share commands are available under the `az storage share` command group, for example: `az storage share create`, `az storage share update`, etc.
    - Commands to manage the file service are only available through the control plane, and are available through the `az storage account file-service-properties` command group, for example: `az storage account file-service-properties show` and `az storage account file-service-properties update`.

To learn more about the Azure Files management API, see:

- [Azure Files REST API overview](/rest/api/storageservices/file-service-rest-api)
- Control plane (`Microsoft.Storage` resource provider) API for Azure Files resources: 
    - [`FileService`](/rest/api/storagerp/file-services) 
    - [`FileShare`](/rest/api/storagerp/file-shares) 
- [Azure PowerShell](/powershell/module/az.storage) and [Azure CLI](/en-us/cli/azure/storage)

## See also
- [What is Azure Files?](storage-files-introduction.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Create an Azure file share](storage-how-to-create-file-share.md)
