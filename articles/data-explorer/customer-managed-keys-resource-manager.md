---
title: Configure customer-managed-keys using Azure Resource Manager template
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/18/2019
---

# Configure customer-managed-keys using C#

> [!div class="op_single_selector"]
> * [C#](create-cluster-database-csharp.md)
> * [ARM template](create-cluster-database-resource-manager.md)


Azure Data Explorer encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of data.

Customer-managed keys must be stored in an Azure Key Vault. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The Azure Data Explorer cluster and the key vault must be in the same region, but they can be in different subscriptions. 

This article shows how to configure an Azure Key Vault with customer-managed keys using Azure Resource Manager templates. 

> [!Important]
> Using customer-managed keys with Azure Data Explorer requires that two properties be set on the key vault, **Soft Delete** and **Do Not Purge**. These properties are not enabled by default. To enable these properties, use either PowerShell or Azure CLI. Only RSA keys and key size 2048 are supported.

## Assign an identity to the cluster

To enable customer-managed keys for your cluster, first assign a system-assigned managed identity to the cluster. You'll use this managed identity to grant the cluster permissions to access the key vault.

For information about configuring system-assigned managed identities see [Managed Identities](managed-identities.md).

## Create a new key vault

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault.md). The key vault that you use to store customer-managed keys for Azure Data Explorer encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**.

Remember to replace the placeholder values in brackets with your own values.

```azurepowershell-interactive
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the cluster has permissions to access it. In this step, you'll use the System Assigned managed identity that you previously assigned to the cluster.

To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy.md). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $cluster.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
```

## Create a new key

Next, create a new key in the key vault. To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey.md). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell-interactive
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

## Configure encryption with customer-managed keys

By default, Azure Data Explorer encryption uses Microsoft-managed keys. In this step, configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

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

 * [What is Azure Key Vault?](../key-vault/key-vault-overview.md)
 * [Manage cluster security](manage-cluster-security.md)

