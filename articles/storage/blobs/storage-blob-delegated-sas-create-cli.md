---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with Azure CLI - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using Azure CLI.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/16/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with Azure CLI

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with Azure CLI.

## About shared access signatures

A SAS is a token that encapsulates all of the information needed to make a request to Azure Storage in a query string that is appended to a container or blob URI. The SAS token includes information about the type of resource, the permissions granted to the client, the interval over which the SAS is valid, and a signature that secures the token. Additional optional parameters may be included as well.

A SAS token may be secured by using either your Azure AD credentials or your account key. Microsoft recommends that you use Azure AD credentials when possible as a security best practice.

A SAS secured with your Azure AD credentials is called a *user delegation* SAS, because the token used to create the SAS is requested on behalf of the user. 

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS. For more information, see .... 

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-shared-access-signatures.md).

## Use Azure AD credentials to secure a SAS



## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Delegating Access with a Shared Access Signature](/rest/api/storageservices/delegating-access-with-a-shared-access-signature)
