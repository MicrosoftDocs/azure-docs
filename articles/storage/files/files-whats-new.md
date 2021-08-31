---
title: What's new in Azure Files
description: Learn more about new features and enhancements in Azure Files.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 08/31/2021
ms.author: rogarana
ms.subservice: files
---

# What's new in Azure Files
Azure Files is updated regularly to offer new features and enhancements. This article provides detailed information about what's new in Azure Files.

## 2021 quarter 3 (July, August, September)
### SMB Multichannel is generally available
SMB Multichannel enables SMB clients to establish multiple parallel connections to an Azure file share. This allows SMB clients to take full advantage of all available network bandwidth and makes them resilient to network failures, reducing total cost of ownership and enabling 2-3x for reads and 3-4x for writes through a single client. SMB Multichannel is available for premium file shares (file shares deployed in the FileStorage storage account kind) and is disabled by default. 

For more information, see:

- [SMB Multichannel performance in Azure Files](storage-files-smb-multichannel-performance.md)
- [Enable SMB Multichannel](files-smb-protocol.md#smb-multichannel)
- [Overview on SMB Multichannel in the Windows Server documentation](/azure-stack/hci/manage/manage-smb-multichannel)

### SMB 3.1.1 and SMB security settings
SMB 3.1.1 is the most recent version of the SMB protocol, released with Windows 10, containing important security and performance updates. Azure Files SMB 3.1.1 ships with two additional encryption modes, AES-128-GCM and AES-256-GCM, in addition to AES-128-CCM which was already supported. To maximize performance, AES-128-GCM is negotiated as the default SMB channel encryption option; AES-128-CCM will only be negotiated on older clients that don't support AES-128-GCM. 

Depending on your organization's regulatory and compliance requirements, AES-256-GCM can be negotiated instead of AES-128-GCM by either restricting allowed SMB channel encryption options on the SMB clients, in Azure Files, or both. Support for AES-256-GCM was added in Windows Server 2022 and Windows 10, version 21H1.

In addition to SMB 3.1.1, Azure Files exposes security settings that change the behavior of the SMB protocol. With this release, you may configure allowed SMB protocol versions, SMB channel encryption options, authentication methods, and Kerberos ticket encryption options. By default, Azure Files enables the most compatible options, however these options may be toggled at any time.

For more information, see:

- [SMB security settings](files-smb-protocol.md#smb-security-settings)
- [Windows](storage-how-to-use-files-windows.md) and [Linux](storage-how-to-use-files-linux.md) SMB version information
- [Overview of SMB features in the Windows Server documentation](/windows-server/storage/file-server/file-server-smb-overview)

## 2021 quarter 2 (April, May, June)
### Premium, hot, and cool storage capacity reservations 
Azure Files supports storage capacity reservations (also referred to as *reserve instances*). Storage capacity reservations allow you to achieve a discount on storage by pre-committing to storage utilization. Azure Files supports capacity reservations on the premium, hot, and cool tiers. Capacity reservations are sold in units of 10 TiB or 100 TiB, for terms of either one year or three years. 

For more information, see:

- [Understanding Azure Files billing](understanding-billing.md)
- [Optimized costs for Azure Files with reserved capacity](files-reserve-capacity.md)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

### Improved portal experience for domain joining to Active Directory
The experience for domain joining an Azure storage account has been improved to help guide first-time Azure file share admins through the process. When you select Active Directory under **File share settings** in the **File shares** section of the Azure portal, you will be guided through the steps required to domain join.

:::image type="content" source="media/files-whats-new/ad-domain-join-1.png" alt-text="Screenshot of the new portal experience for domain joining a storage account to Active Directory" lightbox="media/files-whats-new/ad-domain-join-1.png":::

For more information, see:

- [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md)
- [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md)

## 2021 quarter 1 (January, February, March)
### Azure Files management now available through the control plane
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

## 2020 quarter 4 (October, November, December)
### Azure file share soft-delete
Azure file shares support soft-delete. When soft-delete is enabled, accidentally deleted shares can easily be recovered if undeleted within the user defined retention period. During the retention period, soft-deleted shares incur data used capacity charges during the retention period at the share snapshot rate.

To learn more about soft-delete, see:

- [Soft-delete overview](storage-files-prevent-file-share-deletion.md)
- [Enable soft-delete](storage-files-enable-soft-delete.md)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)

## See also
- [What is Azure Files?](storage-files-introduction.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Create an Azure file share](storage-how-to-create-file-share.md)
