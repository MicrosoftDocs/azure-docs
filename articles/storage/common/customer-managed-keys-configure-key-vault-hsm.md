---
title: Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview)
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview) by using Azure CLI.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/30/2021
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM (preview)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in Azure Key Vault or Key Vault Managed Hardware Security Model (HSM) (preview). An Azure Key Vault Managed HSM is an FIPS 140-2 Level 3 validated HSM.

This article shows how to configure encryption with customer-managed keys stored in a managed HSM by using Azure CLI. To learn how to configure encryption with customer-managed keys stored in a key vault, see [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md).

> [!IMPORTANT]
>
> Encryption with customer-managed keys stored in Azure Key Vault Managed HSM is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration.

## Assign an identity to the storage account

First, assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the managed HSM. For more information about system-assigned managed identities, see [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md).

To assign a managed identity using Azure CLI, call [az storage account update](/cli/azure/storage/account#az_storage_account_update). Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity
```

## Assign a role to the storage account for access to the managed HSM

Next, assign the **Managed HSM Crypto Service Encryption** role to the storage account's managed identity so that the storage account has permissions to the managed HSM. Microsoft recommends that you scope the role assignment to the level of the individual key in order to grant the fewest possible privileges to the managed identity.

To create the role assignment for storage account, call [az key vault role assignment create](/cli/azure/role/assignment#az_role_assignment_create). Remember to replace the placeholder values in brackets with your own values.
  
```azurecli
storage_account_principal = $(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query identity.principalId \
    --output tsv)

az keyvault role assignment create \
    --hsm-name <hsm-name> \
    --role "Managed HSM Crypto Service Encryption" \
    --assignee $storage_account_principal \
    --scope /keys/<key-name>
```

## Configure encryption with a key in the managed HSM

Finally, configure Azure Storage encryption with customer-managed keys to use a key stored in the managed HSM. Supported key types include RSA-HSM keys of sizes 2048, 3072 and 4096. To learn how to create a key in a managed HSM, see [Create an HSM key](../../key-vault/managed-hsm/key-management.md#create-an-hsm-key).

Install Azure CLI 2.12.0 or later to configure encryption to use a customer-managed key in a managed HSM. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To automatically update the key version for a customer-managed key, omit the key version when you configure encryption with customer-managed keys for the storage account. Call [az storage account update](/cli/azure/storage/account#az_storage_account_update) to update the storage account's encryption settings, as shown in the following example. Include the `--encryption-key-source parameter` and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account. Remember to replace the placeholder values in brackets with your own values.

```azurecli
hsmurl = $(az keyvault show \
    --hsm-name <hsm-name> \
    --query properties.hsmUri \
    --output tsv)

az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-name <key> \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $hsmurl
```

To manually update the version for a customer-managed key, include the key version when you configure encryption for the storage account:

```azurecli-interactive
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-name <key> \
    --encryption-key-version $key_version \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $hsmurl
```

When you manually update the key version, you'll need to update the storage account's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az_keyvault_show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az_keyvault_key_list_versions). Then call [az storage account update](/cli/azure/storage/account#az_storage_account_update) to update the storage account's encryption settings to use the new version of the key, as shown in the previous example.

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
