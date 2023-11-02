---
title: Use a managed HSM with Azure Elastic SAN Preview
titleSuffix: Azure Elastic SAN
description: Learn how to configure Azure Elastic SAN encryption with customer-managed keys stored in an HSM by using the Azure CLI.
author: roygara

ms.author: rogarana
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 11/06/2023
ms.custom: devx-track-azurecli
---

# Configure Elastic SAN data encryption with customer-managed keys in Managed HSM

Azure Storage encrypts all data in an Elastic SAN at rest. By default, data is encrypted with platform-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in Azure Key Vault or Key Vault Managed Hardware Security Model (HSM). An Azure Key Vault Managed HSM is an FIPS 140-2 Level 3 validated HSM.

This article shows how to configure encryption with customer-managed keys stored in a managed HSM by using Azure CLI. To learn how to configure encryption with customer-managed keys stored in a key vault, see [Configure customer-managed keys for an Elastic SAN volume group](elastic-san-encryption-configure-customer-managed-keys-key-vault.md).

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Assign an identity to the Elastic SAN volume group

First, assign a system-assigned managed identity to the Elastic SAN volume group. You'll use this managed identity to grant the Elastic SAN volume group permissions to access the managed HSM. For more information about system-assigned managed identities, see [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md).

The following example assigns a managed identity with [az elastic-san volume-group update](/cli/azure/elastic-san/volume-group#az-elastic-san-volume-group-update). Replace the placeholder values in brackets and run the command:

```azurecli
az elastic-san volume-group update \
    --name <volume-group> \
    --resource-group <resource_group> \
    --assign-identity
```

## Assign a role to the Elastic SAN volume group for access to the managed HSM

Next, assign the **Managed HSM Crypto Service Encryption User** role to the Elastic SAN volume group's managed identity so that the Elastic SAN volume group has permissions to the managed HSM. Microsoft recommends that you scope the role assignment to the level of the individual key in order to grant the fewest possible privileges to the managed identity.

The following script creates a role assignment for the Elastic SAN volume group using [az key vault role assignment create](/cli/azure/role/assignment#az-role-assignment-create). Replace the placeholder values in brackets and then run the script.

```azurecli
volume-group_principal = $(az elastic-san volume-group show \
    --name <volume-group> \
    --resource-group <resource-group> \
    --query identity.principalId \
    --output tsv)

az keyvault role assignment create \
    --hsm-name <hsm-name> \
    --role "Managed HSM Crypto Service Encryption User" \
    --assignee $volume-group_principal \
    --scope /keys/<key-name>
```

## Configure encryption with a key in the managed HSM

Finally, configure Azure Storage encryption with customer-managed keys to use a key stored in the managed HSM. Supported key types include RSA-HSM keys of sizes 2048, 3072 and 4096. The Elastic SAN and the managed HSM can be in different Azure regions and subscriptions, but must be in the same Microsoft Entra ID tenant. To learn how to create a key in a managed HSM, see [Create an HSM key](../../key-vault/managed-hsm/key-management.md#create-an-hsm-key).

Install Azure CLI 2.12.0 or later to configure encryption to use a customer-managed key in a managed HSM. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To automatically update the key version for a customer-managed key, omit the key version when you configure encryption with customer-managed keys for the Elastic SAN volume group. For more information about configuring encryption for automatic key rotation, see [Update the key version](elastic-san-encryption-manage-customer-keys.md#update-the-key-version).

The following script uses [az elastic-san volume-group update](/cli/azure/storage/account#az-storage-account-update) to update the Elastic SAN volume group's encryption settings with automatic key rotation. Including the `--encryption-key-source parameter` and set it to `Microsoft.Keyvault` enables customer-managed keys for the volume group. Replace the placeholder values in brackets with your own values.

```azurecli
hsmurl = $(az keyvault show \
    --hsm-name <hsm-name> \
    --query properties.hsmUri \
    --output tsv)

az elastic-san volume-group update \
    --name <volume-group> \
    --resource-group <resource_group> \
    --encryption-key-name <key> \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $hsmurl
```

To manually update the version for a customer-managed key, include the key version when you configure encryption for the Elastic SAN volume group:

```azurecli-interactive
az elastic-san volume-group update
    --name <volume-group> \
    --resource-group <resource_group> \
    --encryption-key-name <key> \
    --encryption-key-version $key_version \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $hsmurl
```

When you manually update the key version, you'll need to update the Elastic SAN volume group's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call [az elastic-san volume-group update](/cli/azure/storage/account#az-storage-account-update) to update the Elastic SAN volume group's encryption settings to use the new version of the key, as shown in the previous example.

## Next steps

- [Manage customer keys for Azure Elastic SAN data encryption](elastic-san-encryption-manage-customer-keys.md)