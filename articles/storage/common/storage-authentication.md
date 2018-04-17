---
title: Authenticating requests to Azure Storage | Microsoft Docs
description: Authenticating requests to Azure Storage.  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: overview
ms.date: 04/16/2018
ms.author: tamram
---

# Authenticating requests to Azure Storage

Each time you access data in your storage account, a request is made over HTTP/HTTPS to Azure Storage. Every request to a secure resource must be authenticated, so that the service ensures that the client has the right permissions to access the right data at the right time. Azure Storage offers several options for authentication:

- **Azure Identity and Access Management (IAM)** for blobs and queues. Azure identity management provides role-based authentication (RBAC) for fine-grained control over a client's access to resources in a storage account.
- **Shared Key authentication** for blobs, files, queues, and tables. A client using Shared Key passes a header with every request that is signed using the storage account access key.
- **Shared access signatures** for blobs, files, queues, and tables. Shared access signatures (SAS) provide delegated access to resources in a storage account. A client can use a SAS to access a resource in your storage account without the account access key.

By default, all resources in Azure Storage are secured, and are available only to the account owner. You can use any of the authentication strategies outlined above to grant clients access to resources in your storage account. You may also enable anonymous public read access for containers and blobs, so that authentication is not required. For more information, see [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md).  

> [!IMPORTANT]
>  The Microsoft Azure storage services support both HTTP and HTTPS; however, using HTTPS is highly recommended.  
  
