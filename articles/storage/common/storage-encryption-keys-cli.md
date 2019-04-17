---
title: Configure customer-managed keys for Azure Storage encryption from Azure CLI
description: Learn how to use Azure CLI to configure customer-managed keys for Azure Storage encryption. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/16/2019
ms.author: tamram
ms.subservice: common
---

# Use customer-managed keys with Azure Storage encryption from Azure CLI

[!INCLUDE [storage-encryption-configure-keys-include](../../../includes/storage-encryption-configure-keys-include.md)]

This article shows how to configure a key vault with customer-managed keys using Azure CLI.

## Assign an identity to the storage account

To enable custom key management for your storage account, first assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the key vault.

To assign a managed identity using Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az account set --subscription <subscription-id>

az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity
```

For more information about configuring system-assigned managed identities with Azure CLI, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md).

## Create a new key vault

The key vault that you use to store customer-managed keys for Azure Storage encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**. To create a new key vault using PowerShell or Azure CLI with these settings enabled, execute the following commands. Remember to replace the placeholder values in brackets with your own values. 

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault create \
    --name <key-vault> \
    --resource-group <resource_group> \
    --location <region> \
    --enable-soft-delete \
    --enable-purge-protection
```

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the storage account has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the storage account.

To set the access policy for the key vault, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
storage_account_principal=$(az storage account show -n clicustomkey -g storagesamples-rg --query identity.principalId -o tsv)

```

## Create a new key

Next, create a new key in the key vault.

To create a new key, call [az keyvault key create](/cli/azure/keyvault/key##az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
```

## Configure encryption with customer-managed keys

By default, Azure Storage encryption uses Microsoft-managed keys. Configure your Azure Storage account for custom key management and specify the key to associate with the storage account.

```azurecli-interactive
kv_uri=$(az keyvault show -n <key-vault> -g <resource_group> --query properties.vaultUri -o tsv)
key_version=$(az keyvault key list-versions -n <key_name> --vault-name <key-vault> --query [].kid -o tsv | cut -d '/' -f 6)
az storage account update -n <storage-account> -g <resource_group> --encryption-key-name <key_name> --encryption-key-version $key_version --encryption-key-source Microsoft.Keyvault --encryption-key-vault $kv_uri 
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
