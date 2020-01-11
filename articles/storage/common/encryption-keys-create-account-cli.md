---
title: Use Azure CLI to create an account with customer-managed keys for queues and tables
titleSuffix: Azure Storage
description: Learn how to use Azure CLI to create a storage account that uses customer-managed keys with Azure Key Vault for encryption of queues and tables. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/10/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Configure customer-managed keys with Azure Key Vault by using Azure CLI

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of queue or table data.

You may opt to use customer-managed keys to encrypt queue or table data at the time that you create the storage account. This setting cannot be changed after the account is created. The storage account must be of type general-purpose v2 and must be configured for locally redundant storage (LRS).

This article shows how to configure an Azure Key Vault with customer-managed keys using Azure CLI. To learn how to create a key vault using Azure CLI, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](../../key-vault/quick-create-cli.md).

## Access to customer-managed keys for queues and tables

Customer-managed keys for queues and tables is currently available in the following regions:

- East US
- South Central US
- West US 2  

To create a storage account that is configured for customer-managed keys for queues and tables, you must first register to use this feature with Azure. To register with Azure CLI, call the [az feature register](/cli/azure/feature#az-feature-register) command.

### Register to use customer-managed keys for queues and tables

To register to use customer-managed keys with Queue storage:

```azurecli-interactive
az feature register --namespace Microsoft.Storage --name AllowAccountEncryptionKeyForQueues
```

To register to use customer-managed keys with Table storage:

```azurecli-interactive
az feature register --namespace Microsoft.Storage --name AllowAccountEncryptionKeyForTables
```

### Check the status of your registration

To check the status of your registration for Queue storage:

```azurecli-interactive
az feature show --namespace Microsoft.Storage --name AllowAccountEncryptionKeyForQueues
```

To check the status of your registration for Table storage:

```azurecli-interactive
az feature show --namespace Microsoft.Storage --name AllowAccountEncryptionKeyForTables
```

### Re-register the Azure Storage resource provider

After your registration is approved, you must re-register the Azure Storage resource provider to enable customer-managed keys for queues and tables. Call the [az provider register](/cli/azure/provider#az-provider-register) command:

```azurecli-interactive
az provider register --namespace 'Microsoft.Storage'
```

## Create a storage account with customer-managed keys

You must configure customer-managed keys for queues and tables at the time that you create the storage account. You can create the storage account and configure customer-managed keys using either Azure CLI or an Azure Resource Manager template.

### [Azure CLI](#tab/azure-cli)

To use Azure CLI to create a storage account with customer-managed keys for queues and tables, make sure you have installed Azure CLI version 2.0.80 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Next, create a general-purpose v2 storage account with customer-managed keys for queues and tables by calling the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command. Include the `--encryption-key-type-for-queue` option and set its value to `Account` to create the storage account with customer-managed keys for Queue storage. Include the `--encryption-key-type-for-table` option and set its value to `Account` to create the storage account with customer-managed keys for Table storage. You can enable customer-managed keys for either or both services.

The following example shows how to create a general-purpose v2 storage account configured for LRS and enable customer-managed keys for both Queue and Table storage. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_LRS \
    --kind StorageV2 \
    --encryption-key-type-for-table Account \
    --encryption-key-type-for-queue Account
```

### [Template](#tab/template)

To create a general-purpose v2 storage account with customer-managed keys for queues and tables using an Azure Resource Manager template, configure the JSON for the template as follows. Remember to replace the placeholder values in angle brackets with your own values:

```json
"resources": [
    {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "name": "[parameters('<storage-account>')]",
        "location": "[parameters('<location>')]",
        "dependsOn": [],
        "tags": {},
        "sku": {
            "name": "[parameters('Standard_LRS')]"
        },
        "kind": "[parameters('StorageV2')]",
        "properties": {
            "accessTier": "[parameters('<accessTier>')]",
            "supportsHttpsTrafficOnly": "[parameters('supportsHttpsTrafficOnly')]",
            "largeFileSharesState": "[parameters('<largeFileSharesState>')]",
            "encryption": {
                "services": {
                    "queue": {
                        "keyType": "Account"
                    },
                    "table": {
                        "keyType": "Account"
                    }
                },
                "keySource": "Microsoft.Storage"
            }
        }
    }
],
```

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

Customer-managed keys must be stored in an Azure Key Vault. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Storage encryption and key management, see [Azure Storage encryption for data at rest](../articles/storage/common/storage-service-encryption.md). For more information about Azure Key Vault, see [What is Azure Key Vault?](../articles/key-vault/key-vault-overview.md)

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

To learn how to enable **Soft Delete** and **Do Not Purge** on an existing key vault with Azure CLI, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in [How to use soft-delete with CLI](../../key-vault/key-vault-soft-delete-cli.md).

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
    --key-permissions get recover unwrapKey wrapKey
```

## Create a new key

Next, create a key in the key vault. To create a key, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault key create
    --name <key> \
    --vault-name <key-vault>
```

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

## Disable customer-managed keys

When you disable customer-managed keys, your storage account is then encrypted with Microsoft-managed keys. To disable customer-managed keys, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) and set the `--encryption-key-source parameter` to `Microsoft.Storage`, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-source Microsoft.Storage
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
