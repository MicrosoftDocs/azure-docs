---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 04/14/2022
ms.author: tamram
ms.custom: "include file"
---

## Protect your access keys

Your storage account access keys are similar to a root password for your storage account. Always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.

> [!NOTE]
> Microsoft recommends using Azure Active Directory (Azure AD) to authorize requests against blob and queue data if possible, rather than using the account keys (Shared Key authorization). Authorization with Azure AD provides superior security and ease of use over Shared Key authorization.
>
> To protect an Azure Storage account with Azure AD Conditional Access policies, you must disallow Shared Key authorization for the storage account. For more information about how to disallow Shared Key authorization, see [Prevent Shared Key authorization for an Azure Storage account](../articles/storage/common/shared-key-authorization-prevent.md).
