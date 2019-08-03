---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with PowerShell - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using PowerShell.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/02/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with PowerShell

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with PowerShell.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Use Azure AD credentials to secure a SAS



## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Delegating Access with a Shared Access Signature](/rest/api/storageservices/delegate-access-with-a-shared-access-signature)
