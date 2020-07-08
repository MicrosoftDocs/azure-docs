---
title: Use Azure CLI to configure customer-managed keys
titleSuffix: Azure Storage
description: Learn how to use Azure CLI to configure customer-managed keys with Azure Key Vault for Azure Storage encryption.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 04/02/2020
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Configure customer-managed keys with Azure Key Vault by using Azure CLI

[!INCLUDE [storage-encryption-configure-keys-include](../../../includes/storage-encryption-configure-keys-include.md)]

This article shows how to configure an Azure Key Vault with customer-managed keys using Azure CLI. To learn how to create a key vault using  Azure CLI, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](../../key-vault/secrets/quick-create-cli.md).

## Assign an identity to the storage account

To enable customer-managed keys for your storage account, first assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the key vault.

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

To learn how to enable **Soft Delete** and **Do Not Purge** on an existing key vault with Azure CLI, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in [How to use soft-delete with CLI](../../key-vault/general/soft-delete-cli.md).

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the storage account has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the storage account.

To set the access policy for the key vault, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy). Remember to replace the placeholder values in brackets with your own values.

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
    --key-permissions get unwrapKey wrapKey
```

## Create a new key

Next, create a key in the key vault. To create a key, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault key create \
    --name <key> \
    --vault-name <key-vault>
```

Azure storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

## Configure encryption with customer-managed keys

By default, Azure Storage encryption uses Microsoft-managed keys. Configure your Azure Storage account for customer-managed keys and specify the key to associate with the storage account.

To update the storage account's encryption settings, call [az storage account update](/cli/azure/storage/account#az-storage-account-update), as shown in the following example. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the storage account. The example also queries for the key vault URI and the latest key version, both of which values are needed to associate the key with the storage account. Remember to replace the placeholder values in brackets with your own values.

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

When you create a new version of a key, you'll need to update the storage account to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings to use the new version of the key, as shown in the previous section.

## Use a different key

To change the key used for Azure Storage encryption, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) as shown in [Configure encryption with customer-managed keys](#configure-encryption-with-customer-managed-keys) and provide the new key name and version. If the new key is in a different key vault, also update the key vault URI.

## Revoke customer-managed keys

If you believe that a key may have been compromised, you can revoke customer-managed keys by removing the key vault access policy. To revoke a customer-managed key, call the [az keyvault delete-policy](/cli/azure/keyvault#az-keyvault-delete-policy) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli-interactive
az keyvault delete-policy \
    --name <key-vault> \
    --object-id $storage_account_principal
```

## Disable customer-managed keys

When you disable customer-managed keys, your storage account is once again encrypted with Microsoft-managed keys. To disable customer-managed keys, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) and set the `--encryption-key-source parameter` to `Microsoft.Storage`, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli-interactive
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-source Microsoft.Storage
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
