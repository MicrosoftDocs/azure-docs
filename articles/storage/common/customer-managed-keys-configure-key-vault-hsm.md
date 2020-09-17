---
title: Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview)
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys stored in Azure Key Vault Managed HSM by using Azure CLI.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/16/2020
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell
---

# Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of blob and file data. Customer-managed keys must be stored in Azure Key Vault or Key Vault Managed Hardware Security Model (HSM) (preview). An Azure Key Vault Managed HSMs is an FIPS 140-2 Level 3 validated HSM.

Azure storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

This article shows how to configure encryption with customer-managed keys stored in a managed HSM by using Azure CLI. To learn how to configure encryption with customer-managed keys stored in a key vault, see [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md).

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration.

## Assign an identity to the storage account

First, assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the managed HSM. For more information about configuring system-assigned managed identities with Azure CLI, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md).

To assign a managed identity using Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update):

```azurecli
az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity
```

## Assign a role to the storage account for access to the managed HSM

Next, assign the **Managed HSM Crypto Service Encryption** role to the storage account's managed identity so that the storage account has permissions to the managed HSM. To create the role assignment for storage account, call [az key vault role assignment create](/cli/azure/role/assignment#az_role_assignment_create). Remember to replace the placeholder values in brackets with your own values.
  
```azurecli
storage_account_principal = $(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query identity.principalId \
    --output tsv)

az keyvault role assignment create \
    --hsm-name <hsm-name> \
    --role "Managed HSM Crypto Service Encryption" \
    --assignee $storage_account_principal
```

## Configure encryption with a key in the managed HSM

Finally, configure Azure Storage encryption with customer-managed keys to use a key stored in the managed HSM. Install Azure CLI 2.12.0 or later to configure encryption to use a key in a managed HSM. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To automatically update the key version for a customer-managed key, omit the key version when you configure encryption with customer-managed keys for the storage account. Call [az storage account update](/cli/azure/storage/account#az_storage_account_update) to update the storage account's encryption settings, as shown in the following example. Include the `--encryption-key-source parameter` and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account. Remember to replace the placeholder values in brackets with your own values.

```azurecli
hsmurl = $(az keyvault show \
    --hsm-name <hsm-name> \
    --query properties.hsmUri \
    --output tsv)

az storage account update \
    --name <storage-account> \
    --encryption-key-name <key> \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $hsmurl
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)