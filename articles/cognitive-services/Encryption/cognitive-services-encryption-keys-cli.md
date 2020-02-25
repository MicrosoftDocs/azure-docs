---
title: Use Azure CLI to configure customer-managed keys
titleSuffix: Cognitive Services
description: Learn how to use Azure CLI to configure customer-managed keys with Azure Key Vault. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: cognitive-services
author: erindormier

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
---

# Configure customer-managed keys with Azure Key Vault by using Azure CLI

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The Cognitive Services resource and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview).

This article shows how to configure an Azure Key Vault with customer-managed keys using Azure CLI. To learn how to create a key vault using  Azure CLI, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](https://docs.microsoft.com/azure/key-vault/quick-create-cli).

## Assign an identity to the resource

To enable customer-managed keys for your Cognitive Services resource, first assign a system-assigned managed identity. You'll use this managed identity to grant the Cognitive Services resource permissions to access the key vault.

<TODO: update for cog services>

To assign a managed identity using Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az account set --subscription <subscription-id>

az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity
```

For more information about configuring system-assigned managed identities with Azure CLI, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm).

## Create a new key vault

The key vault that you use to store customer-managed keys for Cognitive Services encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**. To create a new key vault using PowerShell or Azure CLI with these settings enabled, execute the following commands. Remember to replace the placeholder values in brackets with your own values.

To create a new key vault using Azure CLI, call [az keyvault create](https://docs.microsoft.com/cli/azure/keyvault#az-keyvault-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault create \
    --name <key-vault> \
    --resource-group <resource_group> \
    --location <region> \
    --enable-soft-delete \
    --enable-purge-protection
```

To learn how to enable **Soft Delete** and **Do Not Purge** on an existing key vault with Azure CLI, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in [How to use soft-delete with CLI](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-cli).

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the Cognitive Services has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the resource.

To set the access policy for the key vault, call [az keyvault set-policy](https://docs.microsoft.com/cli/azure/keyvault#az-keyvault-set-policy). Remember to replace the placeholder values in brackets with your own values.

<TODO: update for cog services>

```azurecli-interactive
storage_account_principal=$(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query identity.principalId \
    --output tsv)
az keyvault set-policy \
    --name <key-vault> \
    --resource-group <resource_group>
    --object-id $storage_account_principal \
    --key-permissions get recover unwrapKey wrapKey
```

## Create a new key

Next, create a key in the key vault. To create a key, call [az keyvault key create](https://docs.microsoft.com/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault key create
    --name <key> \
    --vault-name <key-vault>
```

## Configure encryption with customer-managed keys

By default, Cognitive Services encryption uses Microsoft-managed keys. Configure your Cognitive Services resource for customer-managed keys and specify the key to associate with the resource.

<TODO: update for cog services>

To update the resource's encryption settings, call [az storage account update](/cli/azure/storage/account#az-storage-account-update), as shown in the following example. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the resource. The example also queries for the key vault URI and the latest key version, both of which values are needed to associate the key with the resource. Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
key_vault_uri=$(az keyvault show \
    --name <key-vault> \
    --resource-group <resource_group> \
    --query properties.vaultUri \
    --output tsv)
key_version=$(az keyvault key list-versions \
    --name <key> \
    --vault-name <key-vault> \
    --query [-1].kid \
    --output tsv | cut -d '/' -f 6)
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-name <key> \
    --encryption-key-version $key_version \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $key_vault_uri
```

## Update the key version

<TODO: update for cog services>

When you create a new version of a key, you'll need to update the storage account to use the new version. First, query for the key vault URI by calling [az keyvault show](https://docs.microsoft.com/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](https://docs.microsoft.com/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings to use the new version of the key, as shown in the previous section.

## Use a different key

<TODO: update for cog services>

To change the key used for Azure Storage encryption, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) as shown in [Configure encryption with customer-managed keys](#configure-encryption-with-customer-managed-keys) and provide the new key name and version. If the new key is in a different key vault, also update the key vault URI.

## Disable customer-managed keys

<TODO: update for cog services>

When you disable customer-managed keys, your storage account is then encrypted with Microsoft-managed keys. To disable customer-managed keys, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) and set the `--encryption-key-source parameter` to `Microsoft.Storage`, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-source Microsoft.Storage
```

## Next steps

- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
