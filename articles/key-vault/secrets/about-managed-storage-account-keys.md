---
title: About Azure Key Vault managed storage account keys - Azure Key Vault
description: Overview of Azure Key Vault managed storage account keys.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: secrets
ms.topic: overview
ms.date: 10/01/2021
ms.author: mbaldwin
---

# About Azure Key Vault managed storage account keys

> [!IMPORTANT]
> We recommend using Azure Storage integration with Azure Active Directory (Azure AD), Microsoft's cloud-based identity and access management service. Azure AD integration is available for [Azure blobs and queues](../../storage/blobs/authorize-access-azure-active-directory.md), and provides OAuth2 token-based access to Azure Storage (just like Azure Key Vault). 
> Azure AD allows you to authenticate your client application by using an application or user identity, instead of storage account credentials. You can use an [Azure AD managed identity](../../active-directory/managed-identities-azure-resources/index.yml) when you run on Azure. Managed identities remove the need for client authentication and storing credentials in or with your application. Use below solution only when Azure AD authentication is not possible.

An Azure storage account uses credentials comprising an account name and a key. The key is auto-generated and serves as a password, rather than an as a cryptographic key. Key Vault manages storage account keys by periodically regenerating them in storage account and provides shared access signature tokens for delegated access to resources in your storage account.

You can use the Key Vault managed storage account key feature to list (sync) keys with an Azure storage account, and regenerate (rotate) the keys periodically. You can manage keys for both storage accounts and Classic storage accounts.

## Azure Storage account key management

Key Vault can manage [Azure storage account](../../storage/common/storage-account-overview.md) keys:

- Internally, Key Vault can list (sync) keys with an Azure storage account. 
- Key Vault regenerates (rotates) the keys periodically.
- Key values are never returned in response to caller.
- Key Vault manages keys of both storage accounts and classic storage accounts.

For more information, see:
- [Storage account access keys](../../storage/common/storage-account-keys-manage.md)
- [Storage account keys management in Azure Key Vault](../secrets/overview-storage-keys.md)


## Storage account access control

The following permissions can be used when authorizing a user or application principal to perform operations on a managed storage account:  

- Permissions for managed storage account and SaS-definition operations
  - *get*: Gets information about a storage account 
  - *list*: List storage accounts managed by a Key Vault
  - *update*: Update a storage account
  - *delete*: Delete a storage account  
  - *recover*: Recover a deleted storage account
  - *backup*: Back up a storage account
  - *restore*: Restore a backed-up storage account to a Key Vault
  - *set*: Create or update a storage account
  - *regeneratekey*: Regenerate a specified key value for a storage account
  - *getsas*: Get information about a SAS definition for a storage account
  - *listsas*: List storage SAS definitions for a storage account
  - *deletesas*: Delete a SAS definition from a storage account
  - *setsas*: Create or update a new SAS definition/attributes for a storage account

- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a managed storage account

For more information, see the [Storage account operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/keyvault/vaults/create-or-update) and [Vaults - Update Access Policy](/rest/api/keyvault/keyvault/vaults/update-access-policy).

## Next steps

- [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md)
- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [Best practices for secrets management in Key Vault](secrets-best-practices.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
