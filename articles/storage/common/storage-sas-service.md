---
title: Delegate access to Azure Storage resources with a service shared access signature (SAS)
description: Delegate access to Azure Storage resources with a service SAS.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/07/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Delegate access to Azure Storage resources with a service SAS

A service shared access signature (SAS) delegates access to a resource in only one of the Azure Storage services: Blob storage, Queue storage, Table storage, or Azure Files. A service SAS enables you to delegate access to many but not all data operations in Azure Storage.

A service SAS is signed with the storage account access key. You must have the account access key to create a service SAS.

> [!TIP]
> Azure Storage supports the user delegation shared access signature (SAS) for Blob storage. The user delegation SAS is signed with Azure AD credentials. When your application design requires shared access signatures for access to Blob storage, use Azure AD credentials to create a user delegation SAS for superior security.

## Define a stored access policy

A stored access policy provides an additional level of control over one or more service shared access signatures. Defining a stored access policy serves to group shared access signatures and to provide additional restrictions for signatures that are bound by the policy. You can use a stored access policy to change the start time, expiry time, or permissions for a SAS. You can also use a stored access policy to revoke a SAS if you fear it has been compromised.  

The following Azure Storage resources support stored access policies:  
  
- Blob containers  
- File shares  
- Queues  
- Tables  

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-shared-access-signatures.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
- [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy)
