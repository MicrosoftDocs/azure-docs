---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: "include"
ms.date: 05/07/2024
ms.author: pauljewell
ms.custom: "include file", engagement-fy23
---

## Protect your access keys

Storage account access keys provide full access to the configuration of a storage account, as well as the data. Always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. Access to the shared key grants a user full access to a storage account’s configuration and its data. Access to shared keys should be carefully limited and monitored. Use user delegation SAS tokens with limited scope of access in scenarios where Microsoft Entra ID based authorization can't be used. Avoid hard-coding access keys or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they might have been compromised.

> [!IMPORTANT]
> To prevent users from accessing data in your storage account with Shared Key, you can disallow Shared Key authorization for the storage account. Granular access to data with least privileges necessary is recommended as a security best practice. Microsoft Entra ID based authorization using managed identities should be used for scenarios that support OAuth. Kerberos or SMTP should be used for Azure Files over SMB. For Azure Files over REST, SAS tokens can be used. Shared key access should be disabled if not required to prevent its inadvertent use. For more information, see [Prevent Shared Key authorization for an Azure Storage account](../articles/storage/common/shared-key-authorization-prevent.md).
>
> To protect an Azure Storage account with Microsoft Entra Conditional Access policies, you must disallow Shared Key authorization for the storage account.
> 
> If you have disabled shared key access and you are seeing Shared Key authorization reported in the diagnostic logs, this indicates that trusted access is being used to access storage. For more details, see [Trusted access for resources registered in your Microsoft Entra tenant](../articles/storage/common/storage-network-security.md#trusted-access-for-resources-registered-in-your-microsoft-entra-tenant).
