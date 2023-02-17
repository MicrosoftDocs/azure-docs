---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 01/24/2023
ms.author: tamram
ms.custom: "include file"
---

## Protect your access keys

Your storage account access keys are similar to a root password for your storage account. Always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.

> [!IMPORTANT]
> Microsoft recommends using Azure Active Directory (Azure AD) to authorize requests against blob, queue, and table data if possible, rather than using the account keys (Shared Key authorization). Authorization with Azure AD provides superior security and ease of use over Shared Key authorization. For more information about using Azure AD authorization from your applications, see [How to authenticate .NET applications with Azure services](/dotnet/azure/sdk/authentication).
>
> To prevent users from accessing data in your storage account with Shared Key, you can disallow Shared Key authorization for the storage account. Disallowing Shared Key access is recommended as a security best practice. For more information, see [Prevent Shared Key authorization for an Azure Storage account](../articles/storage/common/shared-key-authorization-prevent.md).
>
> To protect an Azure Storage account with Azure AD Conditional Access policies, you must disallow Shared Key authorization for the storage account.


> [!Note]
> In case "shared key" access has been turned off and you are able to see signature with Authentication Type as Account Key in $logs, it is due to system access. System Keys are different from Access Keys, they in fact have different key value. System keys are used for internal purpose only (e.g. unmanaged disk access from host, $logs to write logs to storage account etc.) and they were purposely enforced. 
