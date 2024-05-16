---
title: Authorize operations for data access
titleSuffix: Azure Storage
description: Learn about the different ways to authorize access to data in Azure Storage. Azure Storage supports authorization with Microsoft Entra ID, Shared Key authorization, or shared access signatures (SAS), and also supports anonymous access to blobs.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-storage
ms.topic: conceptual
ms.date: 05/10/2024
ms.reviewer: nachakra
ms.subservice: storage-common-concepts
---

# Authorize access to data in Azure Storage

Each time you access data in your storage account, your client application makes a request over HTTP/HTTPS to Azure Storage. By default, every resource in Azure Storage is secured, and every request to a secure resource must be authorized. Authorization ensures that the client application has the appropriate permissions to access a particular resource in your storage account.

[!INCLUDE [storage-auth-recommendations](../../../includes/storage-auth-recommendations.md)]

## Authorization for data operations

The following section describes authorization support and recommendations for each Azure Storage service.

### [Blobs](#tab/blobs)

The following table provides information about supported authorization options for blobs:

| Authorization option | Guidance | Recommendation |
| --- | --- | --- |
| Microsoft Entra ID | [Authorize access to Azure Storage data with Microsoft Entra ID](../blobs/authorize-access-azure-active-directory.md) | Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests to blob resources. |
| Shared Key (storage account key) | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/) | Microsoft recommends that you [disallow Shared Key authorization](shared-key-authorization-prevent.md) for your storage accounts. |
| Shared access signature (SAS) | [Using shared access signatures (SAS)](storage-sas-overview.md) | When SAS authorization is necessary, Microsoft recommends using user delegation SAS for limited delegated access to blob resources. |
| Anonymous read access | [Overview: Remediating anonymous read access for blob data](../blobs/anonymous-read-access-overview.md) | Microsoft recommends that you disable anonymous access for all of your storage accounts. |
| Storage Local Users | Supported for SFTP only. To learn more see [Authorize access to Blob Storage for an SFTP client](../blobs/secure-file-transfer-protocol-support-how-to.md) | See guidance for options. |

### [Files (SMB)](#tab/files-smb)

The following table provides information about supported authorization options for Azure Files (SMB):

| Authorization option | Guidance | Recommendation |
| --- | --- | --- |
| Microsoft Entra ID | Supported with [Microsoft Entra Domain Services](../files/storage-files-identity-auth-active-directory-domain-service-enable.md) for cloud-only, or [Microsoft Entra Kerberos](../files/storage-files-identity-auth-azure-active-directory-enable.md) for hybrid identities. | See guidance for options. |
| Shared Key (storage account key) | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/) | Microsoft recommends that you [disallow Shared Key authorization](shared-key-authorization-prevent.md) for your storage accounts. |
| On-premises Active Directory Domain Services | Supported, and credentials must be synced to Microsoft Entra ID. To learn more, see [Overview of Azure Files identity-based authentication options for SMB access](../files/storage-files-active-directory-overview.md) | See guidance for options. |

### [Files (REST)](#tab/files-rest)

The following table provides information about supported authorization options for Azure Files (REST):

| Authorization option | Guidance | Recommendation |
| --- | --- | --- |
| Microsoft Entra ID | [Authorize access to Azure Storage data with Microsoft Entra ID](../blobs/authorize-access-azure-active-directory.md) | Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests to Azure Files resources. |
| Shared Key (storage account key) | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/) | Microsoft recommends that you [disallow Shared Key authorization](shared-key-authorization-prevent.md) for your storage accounts. |
| Shared access signature (SAS) | User delegation SAS isn't supported for Azure Files. To learn more, see [Using shared access signatures (SAS)](storage-sas-overview.md). | Microsoft doesn't recommend using SAS tokens secured by the account key. |

### [Queues](#tab/queues)

The following table provides information about supported authorization options for queues:

| Authorization option | Guidance | Recommendation |
| --- | --- | --- |
| Microsoft Entra ID | [Authorize access to Azure Storage data with Microsoft Entra ID](../blobs/authorize-access-azure-active-directory.md) | Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests to queue resources. |
| Shared Key (storage account key) | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/) | Microsoft recommends that you [disallow Shared Key authorization](shared-key-authorization-prevent.md) for your storage accounts. |
| Shared access signature (SAS) | User delegation SAS isn't supported for Queue Storage. To learn more, see [Using shared access signatures (SAS)](storage-sas-overview.md). | Microsoft doesn't recommend using SAS tokens secured by the account key. |

### [Tables](#tab/tables)

The following table provides information about supported authorization options for tables:

| Authorization option | Guidance | Recommendation |
| --- | --- | --- |
| Microsoft Entra ID | [Authorize access to Azure Storage data with Microsoft Entra ID](../blobs/authorize-access-azure-active-directory.md) | Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests to table resources. |
| Shared Key (storage account key) | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/) | Microsoft recommends that you [disallow Shared Key authorization](shared-key-authorization-prevent.md) for your storage accounts. |
| Shared access signature (SAS) | User delegation SAS isn't supported for Table Storage. To learn more, see [Using shared access signatures (SAS)](storage-sas-overview.md). | Microsoft doesn't recommend using SAS tokens secured by the account key. |

---

The following section briefly describes the authorization options for Azure Storage:

- **Shared Key authorization**: Applies to blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/).

    Microsoft recommends that you disallow Shared Key authorization for your storage account. When Shared Key authorization is disallowed, clients must use Microsoft Entra ID or a user delegation SAS to authorize requests for data in that storage account. For more information, see [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md).

- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide limited delegated access to resources in a storage account via a signed URL. The signed URL specifies the permissions granted to the resource and the interval over which the signature is valid. A service SAS or account SAS is signed with the account key, while the user delegation SAS is signed with Microsoft Entra credentials and applies to blobs only. For more information, see [Using shared access signatures (SAS)](storage-sas-overview.md).

- **Microsoft Entra integration**: Applies to blob, queue, and table resources. Microsoft recommends using Microsoft Entra credentials with managed identities to authorize requests to data when possible for optimal security and ease of use. For more information about Microsoft Entra integration, see the articles for [blob](../blobs/authorize-access-azure-active-directory.md), [queue](../queues/authorize-access-azure-active-directory.md), or [table](../tables/authorize-access-azure-active-directory.md) resources.

    You can use Azure role-based access control (Azure RBAC) to manage a security principal's permissions to blob, queue, and table resources in a storage account. You can also use Azure attribute-based access control (ABAC) to add conditions to Azure role assignments for blob resources. 

    For more information about RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

    For more information about ABAC, see [What is Azure attribute-based access control (Azure ABAC)?](../../role-based-access-control/conditions-overview.md). To learn about the status of ABAC features, see [Status of ABAC condition features in Azure Storage](../blobs/storage-auth-abac.md#status-of-condition-features-in-azure-storage).

- **Microsoft Entra Domain Services authentication**: Applies to Azure Files. Azure Files supports identity-based authorization over Server Message Block (SMB) through Microsoft Entra Domain Services. You can use Azure RBAC for granular control over a client's access to Azure Files resources in a storage account. For more information about Azure Files authentication using domain services, see [Overview of Azure Files identity-based authentication options for SMB access](../files/storage-files-active-directory-overview.md).

- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS) authentication**: Applies to Azure Files. Azure Files supports identity-based authorization over SMB through AD DS. Your AD DS environment can be hosted in on-premises machines or in Azure VMs. SMB access to Files is supported using AD DS credentials from domain joined machines, either on-premises or in Azure. You can use a combination of Azure RBAC for share level access control and NTFS DACLs for directory/file level permission enforcement. For more information about Azure Files authentication using domain services, see the [overview](../files/storage-files-active-directory-overview.md).

- **Anonymous read access**: Applies to blob resources. This option is not recommended. When anonymous access is configured, clients can read blob data without authorization. We recommend that you disable anonymous access for all of your storage accounts. For more information, see [Overview: Remediating anonymous read access for blob data](../blobs/anonymous-read-access-overview.md).

- **Storage Local Users**: Applies to blobs with SFTP or files with SMB. Storage Local Users support container level permissions for authorization. See [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](../blobs/secure-file-transfer-protocol-support-how-to.md) for more information on how Storage Local Users can be used with SFTP.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## Next steps

- Authorize access with Microsoft Entra ID to either [blob](../blobs/authorize-access-azure-active-directory.md), [queue](../queues/authorize-access-azure-active-directory.md), or [table](../tables/authorize-access-azure-active-directory.md) resources.
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
