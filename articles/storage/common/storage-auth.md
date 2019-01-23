---
title: Authorizing access to Azure Storage | Microsoft Docs
description: Learn about the different ways to authorize access to Azure Storage, including Azure Active Directory, Shared Key authentication, or shared access signatures.
services: storage
author: tamram
ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
ms.component: common
---

# Authorizing access to Azure Storage

Each time you access data in your storage account, your client makes a request over HTTP/HTTPS to Azure Storage. Every request to a secure resource must be authorized, so that the service ensures that the client has the permissions required to access the data. Azure Storage offers these options for authorizing access to secure resources:

- **Azure Active Directory (Azure AD) integration (Preview)** for blobs and queues. Azure AD provides role-based access control (RBAC) for fine-grained control over a client's access to resources in a storage account. For more information, see [Authenticating requests to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md).
- **Shared Key authorization** for blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key. For more information, see [Authorize with Shared Key](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-shared-key/).
- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide limited delegated access to resources in a storage account. Adding constraints on the time interval for which the signature is valid or on permissions it grants provides flexibility in managing access. For more information, see [Using shared access signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md).
- **Anonymous public read access** for containers and blobs. Authorization is not required. For more information, see [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md).  

By default, all resources in Azure Storage are secured, and are available only to the account owner. Although you can use any of the authorization strategies outlined above to grant clients access to resources in your storage account, Microsoft recommends using Azure AD when possible for maximum security and ease of use. 



