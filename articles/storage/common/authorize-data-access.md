---
title: Authorize data operations
titleSuffix: Azure Storage
description: Learn about the different ways to authorize access to data in Azure Storage. Azure Storage supports authorization with Azure Active Directory, Shared Key authorization, or shared access signatures (SAS), and also supports anonymous access to blobs.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/14/2021
ms.author: tamram
ms.subservice: common
---

# Authorize access to data in Azure Storage

Each time you access data in your storage account, your client application makes a request over HTTP/HTTPS to Azure Storage. By default, every resource in Azure Storage is secured, and every request to a secure resource must be authorized. Authorization ensures that the client application has the appropriate permissions to access data in your storage account.

The following table describes the options that Azure Storage offers for authorizing access to data:

| Azure artifact | Shared Key (storage account key) | Shared access signature (SAS) | Azure Active Directory (Azure AD) | On-premises Active Directory Domain Services | Anonymous public read access |
|--|--|--|--|--|--|
| Azure Blobs | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](authorize-data-access.md) | Not supported | [Supported](../blobs/anonymous-read-access-configure.md) |
| Azure Files (SMB) | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | Not supported | [Supported, only with AAD Domain Services](../files/storage-files-active-directory-overview.md) | [Supported, credentials must be synced to Azure AD](../files/storage-files-active-directory-overview.md) | Not supported |
| Azure Files (REST) | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | Not supported | Not supported | Not supported |
| Azure Queues | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](authorize-data-access.md) | Not Supported | Not supported |
| Azure Tables | [Supported](/rest/api/storageservices/authorize-with-shared-key/) | [Supported](storage-sas-overview.md) | [Supported](../tables/authorize-access-azure-active-directory.md) (preview) | Not supported | Not supported |

Each authorization option is briefly described below:

- **Azure Active Directory (Azure AD) integration** for authorizing requests to blob, queue, and table resources. Microsoft recommends using Azure AD credentials to authorize requests to data when possible for optimal security and ease of use. For more information about Azure AD integration, see [Authorize access to data in Azure Storage](authorize-data-access.md).

    You can use Azure role-based access control (Azure RBAC) to manage a security principal's permissions to blob, queue, and table resources in a storage account. You can additionally use Azure attribute-based access control (ABAC) to add conditions to Azure role assignments for blob resources. For more information about RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md). For more information about ABAC, see [What is Azure attribute-based access control (Azure ABAC)? (preview)](../../role-based-access-control/conditions-overview.md).

- **Azure Active Directory Domain Services (Azure AD DS) authentication** for Azure Files. Azure Files supports identity-based authorization over Server Message Block (SMB) through Azure AD DS. You can use Azure RBAC for fine-grained control over a client's access to Azure Files resources in a storage account. For more information about Azure Files authentication using domain services, see the [overview](../files/storage-files-active-directory-overview.md).

- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS) authentication** for Azure Files. Azure Files supports identity-based authorization over SMB through AD DS. Your AD DS environment can be hosted in on-premises machines or in Azure VMs. SMB access to Files is supported using AD DS credentials from domain joined machines, either on-premises or in Azure. You can use a combination of Azure RBAC for share level access control and NTFS DACLs for directory/file level permission enforcement. For more information about Azure Files authentication using domain services, see the [overview](../files/storage-files-active-directory-overview.md).

- **Shared Key authorization** for blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/).

    You can disallow Shared Key authorization for a storage account. When Shared Key authorization is disallowed, clients must use Azure AD to authorize requests for data in that storage account. For more information, see [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md).

- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide limited delegated access to resources in a storage account. Adding constraints on the time interval for which the signature is valid or on permissions it grants provides flexibility in managing access. For more information, see [Using shared access signatures (SAS)](storage-sas-overview.md).

- **Anonymous public read access** for containers and blobs. When anonymous access is configured, then clients can read blob data without authorization. For more information, see [Manage anonymous read access to containers and blobs](../blobs/anonymous-read-access-configure.md).

    You can disallow anonymous public read access for a storage account. When anonymous public read access is disallowed, then users cannot configure containers to enable anonymous access, and all requests must be authorized. For more information, see [Prevent anonymous public read access to containers and blobs](../blobs/anonymous-read-access-prevent.md).

## Next steps

- [Authorize access to data in Azure Storage](authorize-data-access.md)
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
        