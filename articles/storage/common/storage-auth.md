---
title: Authorizing data operations
titleSuffix: Azure Storage
description: Learn about the different ways to authorize access to Azure Storage, including Azure Active Directory, Shared Key authorization, or shared access signatures (SAS).
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/12/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorizing access to data in Azure Storage

Each time you access data in your storage account, your client makes a request over HTTP/HTTPS to Azure Storage. Every request to a secure resource must be authorized, so that the service ensures that the client has the permissions required to access the data.

The following table describes the options that Azure Storage offers for authorizing access to resources:

|  |Shared Key (storage account key)  |Shared access signature (SAS)  |Azure Active Directory (Azure AD)  |Anonymous public read access  |
|---------|---------|---------|---------|---------|
|Azure Blobs     |[Supported](/rest/api/storageservices/authorize-with-shared-key/)         |[Supported](storage-sas-overview.md)         |[Supported](storage-auth-aad.md)         |[Supported](../blobs/storage-manage-access-to-resources.md)         |
|Azure Files (SMB)     |[Supported](/rest/api/storageservices/authorize-with-shared-key/)         |Not supported         |[Supported, only with AAD Domain Services](../files/storage-files-active-directory-overview.md)         |Not supported         |
|Azure Files (REST)     |[Supported](/rest/api/storageservices/authorize-with-shared-key/)         |[Supported](storage-sas-overview.md)         |Not supported         |Not supported         |
|Azure Queues     |[Supported](/rest/api/storageservices/authorize-with-shared-key/)         |[Supported](storage-sas-overview.md)         |[Supported](storage-auth-aad.md)         |Not supported         |
|Azure Tables     |[Supported](/rest/api/storageservices/authorize-with-shared-key/)         |[Supported](storage-sas-overview.md)         |Not supported         |Not supported         |

Each authorization option is briefly described below:

- **Azure Active Directory (Azure AD) integration** for blobs, and queues. Azure AD provides role-based access control (RBAC) for fine-grained control over a client's access to resources in a storage account. For more information regarding Azure AD integration for blobs and queues, see [Authorize access to Azure blobs and queues using Azure Active Directory](storage-auth-aad.md).

- **Azure AD Domain Services (DS) integration (preview)** for files. Azure Files supports identity-based authorization over Server Message Block (SMB) through Azure AD DS. You can use RBAC for fine-grained control over a client's access to Azure Files resources in a storage account. For more information regarding Azure AD integration for files using domain services, see [Overview of Azure Files Azure Active Directory Domain Service (AAD DS) Authentication Support for SMB Access (preview)](../files/storage-files-active-directory-overview.md).

- **Shared Key authorization** for blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/).
- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide limited delegated access to resources in a storage account. Adding constraints on the time interval for which the signature is valid or on permissions it grants provides flexibility in managing access. For more information, see [Using shared access signatures (SAS)](storage-sas-overview.md).
- **Anonymous public read access** for containers and blobs. Authorization is not required. For more information, see [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md).  

By default, all resources in Azure Storage are secured, and are available only to the account owner. Although you can use any of the authorization strategies outlined above to grant clients access to resources in your storage account, Microsoft recommends using Azure AD when possible for maximum security and ease of use.

## Next steps

- [Authorize access to Azure blobs and queues using Azure Active Directory](storage-auth-aad.md)
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key/)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
