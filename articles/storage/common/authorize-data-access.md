---
title: Authorize operations for data access
titleSuffix: Azure Storage
description: Learn about the different ways to authorize access to data in Azure Storage. Azure Storage supports authorization with Azure Active Directory, Shared Key authorization, or shared access signatures (SAS), and also supports anonymous access to blobs.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: conceptual
ms.date: 04/14/2022
ms.author: jammart
ms.reviewer: nachakra
ms.subservice: common
---

# Authorize access to data in Azure Storage

Each time you access data in your storage account, your client application makes a request over HTTP/HTTPS to Azure Storage. By default, every resource in Azure Storage is secured, and every request to a secure resource must be authorized. Authorization ensures that the client application has the appropriate permissions to access a particular resource in your storage account.

## Understand authorization for data operations

The following table describes the options that Azure Storage offers for authorizing access to data:

| Azure artifact | Shared Key (storage account key) | Shared access signature (SAS) | Azure Active Directory (Azure AD) | On-premises Active Directory Domain Services | Anonymous public read access | Storage Local Users |
|--|--|--|--|--|--|--|
| Azure Blobs | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](../blobs/authorize-access-azure-active-directory.md) | Not supported | [Supported](../blobs/anonymous-read-access-configure.md) | [Supported, only for SFTP](../blobs/secure-file-transfer-protocol-support-how-to.md) |
| Azure Files (SMB) | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | Not supported | [Supported, only with AAD Domain Services](../files/storage-files-active-directory-overview.md) | [Supported, credentials must be synced to Azure AD](../files/storage-files-active-directory-overview.md) | Not supported | Supported |
| Azure Files (REST) | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | Not supported | Not supported | Not supported | Not supported |
| Azure Queues | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](../queues/authorize-access-azure-active-directory.md) | Not Supported | Not supported | Not supported |
| Azure Tables | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](../tables/authorize-access-azure-active-directory.md) | Not supported | Not supported | Not supported |

Each authorization option is briefly described below:
- **Shared Key authorization** for blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/).

    Microsoft recommends that you disallow Shared Key authorization for your storage account. When Shared Key authorization is disallowed, clients must use Azure AD or a user delegation SAS to authorize requests for data in that storage account. For more information, see [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md).

- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide limited delegated access to resources in a storage account via a signed URL. The signed URL specifies the permissions granted to the resource and the interval over which the signature is valid. A service SAS or account SAS is signed with the account key, while the user delegation SAS is signed with Azure AD credentials and applies to blobs only. For more information, see [Using shared access signatures (SAS)](storage-sas-overview.md).


- **Azure Active Directory (Azure AD) integration** for authorizing requests to blob, queue, and table resources. Microsoft recommends using Azure AD credentials to authorize requests to data when possible for optimal security and ease of use. For more information about Azure AD integration, see the articles for either [blob](../blobs/authorize-access-azure-active-directory.md), [queue](../queues/authorize-access-azure-active-directory.md), or [table](../tables/authorize-access-azure-active-directory.md) resources.

    You can use Azure role-based access control (Azure RBAC) to manage a security principal's permissions to blob, queue, and table resources in a storage account. You can additionally use Azure attribute-based access control (ABAC) to add conditions to Azure role assignments for blob resources. For more information about RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md). For more information about ABAC, see [What is Azure attribute-based access control (Azure ABAC)? (preview)](../../role-based-access-control/conditions-overview.md).

- **Azure Active Directory Domain Services (Azure AD DS) authentication** for Azure Files. Azure Files supports identity-based authorization over Server Message Block (SMB) through Azure AD DS. You can use Azure RBAC for fine-grained control over a client's access to Azure Files resources in a storage account. For more information about Azure Files authentication using domain services, see the [overview](../files/storage-files-active-directory-overview.md).

- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS) authentication** for Azure Files. Azure Files supports identity-based authorization over SMB through AD DS. Your AD DS environment can be hosted in on-premises machines or in Azure VMs. SMB access to Files is supported using AD DS credentials from domain joined machines, either on-premises or in Azure. You can use a combination of Azure RBAC for share level access control and NTFS DACLs for directory/file level permission enforcement. For more information about Azure Files authentication using domain services, see the [overview](../files/storage-files-active-directory-overview.md).

- **Anonymous public read access** for containers and blobs. When anonymous access is configured, then clients can read blob data without authorization. For more information, see [Manage anonymous read access to containers and blobs](../blobs/anonymous-read-access-configure.md).

    You can disallow anonymous public read access for a storage account. When anonymous public read access is disallowed, then users cannot configure containers to enable anonymous access, and all requests must be authorized. For more information, see [Prevent anonymous public read access to containers and blobs](../blobs/anonymous-read-access-prevent.md).

- **Storage Local Users** can be used to access blobs with SFTP or files with SMB. Storage Local Users support container level permissions for authorization. See [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](../blobs/secure-file-transfer-protocol-support-how-to.md) for more information on how Storage Local Users can be used with SFTP.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## Next steps

- Authorize access with Azure Active Directory to either [blob](../blobs/authorize-access-azure-active-directory.md), [queue](../queues/authorize-access-azure-active-directory.md), or [table](../tables/authorize-access-azure-active-directory.md) resources.
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
