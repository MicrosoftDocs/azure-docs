---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 12/12/2019
ms.author: tamram
ms.custom: "include file"
---

## Protect your access keys

Your storage account access keys are similar to a root password for your storage account. Always be careful to protect your access keys. Avoid distributing it to other users, hard-coding it, or saving it anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.

If possible, use Azure Active Directory (Azure AD) to authorize requests to Blob and Queue storage instead of Shared Key. Azure AD provides superior security and ease of use over Shared Key. For more information about authorizing access to data with Azure AD, see [Authorize access to Azure blobs and queues using Azure Active Directory](../articles/storage/common/storage-auth-aad.md).

Microsoft recommends using Azure Key Vault to manage and rotate your access keys. For more information about using Key Vault for key management, see the following articles:

- [Manage storage account keys with Azure Key Vault and PowerShell](../articles/key-vault/key-vault-overview-storage-keys-powershell)
- [Manage storage account keys with Azure Key Vault and the Azure CLI](../articles/key-vault/key-vault-ovw-storage-keys.md)
