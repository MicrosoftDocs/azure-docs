---
title: Configure customer-managed-keys in Azure Data Explorer using the Azure Resource Manager template
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer using the Azure Resource Manager template.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/06/2020
---

# Configure customer-managed-keys using the Azure Resource Manager template

> [!div class="op_single_selector"]
> * [C#](create-cluster-database-csharp.md)
> * [ARM template](create-cluster-database-resource-manager.md)

Azure Data Explorer encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for data encryption. Customer-managed keys must be stored in an [Azure Key Vault](/azure/key-vault/key-vault-overview). You can create your own keys and store them in a key vault, or you can use an Azure Key Vault API to generate keys. The Azure Data Explorer cluster and the key vault must be in the same region, but they can be in different subscriptions. For a detailed explanation on customer-managed keys, see [customer-managed keys with Azure Key Vault](/azure/storage/common/storage-service-encryption). This article shows you how to configure customer-managed keys using Azure Resource Manager templates.

> [!Note]
> To configure customer-managed keys with Azure Data Explorer, you must set two properties on the key vault: **Soft Delete** and **Do Not Purge**. These properties aren't enabled by default. To enable these properties, use PowerShell or Azure CLI. Only RSA keys and key size 2048 are supported.

## Assign an identity to the cluster

To enable customer-managed keys for your cluster, first assign a system-assigned managed identity to the cluster. You'll use this managed identity to grant the cluster permissions to access the key vault. To configure system-assigned managed identities, see [managed identities](managed-identities.md).

## Create a new key vault

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault.md). The key vault that you use to store customer-managed keys for Azure Data Explorer encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**. Replace the placeholder values in brackets with your own values in example below.

-> https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-soft-delete

```azurepowershell-interactive
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the cluster has permissions to access it. In this step, you'll use the system-assigned managed identity that you previously assigned to the cluster. To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy.md). Replace the placeholder values in brackets with your own values and use the variables defined in the previous examples.

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $cluster.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
```

## Create a new key

Next, create a new key in the key vault. To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey.md). Replace the placeholder values in brackets with your own values and use the variables defined in the previous examples.

```azurepowershell-interactive
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

## Configure encryption with customer-managed keys

In this section you configure customer-managed keys using Azure Resource Manager templates. By default, Azure Data Explorer encryption uses Microsoft-managed keys. In this step, configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

You can deploy the Azure Resource Manager template by using the Azure Portal or using PowerShell.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the cluster to create"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "name": "[parameters('clusterName')]",
      "type": "Microsoft.Kusto/clusters",
      "sku": {
        "name": "Standard_D13_v2",
        "tier": "Standard",
        "capacity": 2
      },
      "apiVersion": "2019-09-07",
      "location": "[parameters('location')]",
      "properties": {
        "keyVaultProperties": {
          "keyVaultUri": "<keyVaultUri>",
          "keyName": "<keyName>",
          "keyVersion": "<keyVersion"
        }
      }
    }
  ]
}
```

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call Get-AzKeyVaultKey to get the latest version of the key. Then update the cluster's key vault properties  to use the new version of the key, as shown in the previous section.

## Common customer-managed keys errors

This section lists the common error messages you may encounter when enabling customer-managed keys:

| Error Code                                       |  Error Message
|--------------------------------------------------|-----------------
| InvalidKeyVaultProperties                        | The provided KeyVaultProperties are invalid.
| CannotProvideKeyVaultPropertiesDuringCreation    | Cannot provide KeyVaultProperties during cluster creation.
| KeyVaultPropertiesOnlyForSystemAssignedResources | KeyVaultProperties can be provided only for resources with SystemAssigned Identity.
| KeyVaultNotFound                                 |  KeyVault '_\<KeyVaultUrl\>_' was not found
| KeyNotFound                                      |  Key '_\<KeyName\>_' was not found in KeyVault '_\<KeyVaultUrl\>_'
| IdentityDoesNotHaveAccessToKeyVault              |  Cluster identity does not have access to KeyVault '_\<KeyVaultUrl\>_'
| KeyVaultNotPurgeProtected                        |  KeyVault '_\<KeyVaultUrl\>_' is not Purge Protected
| KeyVaultNotSoftDeleteEnabled                     |  KeyVault '_\<KeyVaultUrl\>_' is not Soft-Delete enabled

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)
* [Secure your cluster in Azure Data Explorer - Portal](manage-cluster-security.md) by enabling encryption at rest.
* [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)

