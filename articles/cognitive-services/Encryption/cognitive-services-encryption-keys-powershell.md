---
title: Use PowerShell to configure customer-managed keys
titleSuffix: Cognitive Services
description: Learn how to use PowerShell to configure customer-managed keys. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: cognitive-services
author: erindormier

ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
---

# Configure customer-managed keys with Azure Key Vault by using PowerShell

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The Cognitive Services resource and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview).

This article shows how to configure an Azure Key Vault with customer-managed keys using PowerShell. To learn how to create a key vault using Azure CLI, see [Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell](https://docs.microsoft.com/azure/key-vault/quick-create-powershell).

## Assign an identity to the Cognitive Services resource

To enable customer-managed keys for your Cognitive Services resource, first assign a system-assigned managed identity. You'll use this managed identity to grant the Cognitive Services resource permissions to access the key vault.

<TODO: update for cog services>

To assign a managed identity using PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount). Remember to replace the placeholder values in brackets with your own values.

```powershell
$storageAccount = Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage-account> `
    -AssignIdentity
```

For more information about configuring system-assigned managed identities with PowerShell, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm).

## Create a new key vault

<TODO: update for cog services>

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault). The key vault that you use to store customer-managed keys for Azure Storage encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**.

Remember to replace the placeholder values in brackets with your own values.

```powershell
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

To learn how to enable **Soft Delete** and **Do Not Purge** on an existing key vault with PowerShell, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in [How to use soft-delete with PowerShell](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell).

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the Cognitive Services resource has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the Cognitive Services resource.

<TODO: update for cog services>

To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
```

## Create a new key

<TODO: update for cog services>

Next, create a new key in the key vault. To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

## Configure encryption with customer-managed keys

By default, Cognitive Services encryption uses Microsoft-managed keys. In this step, configure your Cognitive Services resource to use customer-managed keys and specify the key to associate with your resource.

<TODO: update for cog services>

Call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings, as shown in the following example. Include the **-KeyvaultEncryption** option to enable customer-managed keys for the Cognitive Services resource. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -KeyvaultEncryption `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUri $keyVault.VaultUri
```

## Update the key version

<TODO: update for cog services>

When you create a new version of a key, you'll need to update the Cognitive Services resource to use the new version. First, call [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) to get the latest version of the key. Then call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the resource's encryption settings to use the new version of the key, as shown in the previous section.

## Use a different key

<TODO: update for cog services>

To change the key used for Cognitive Services encryption, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) as shown in [Configure encryption with customer-managed keys](#configure-encryption-with-customer-managed-keys) and provide the new key name and version. If the new key is in a different key vault, also update the key vault URI.

## Disable customer-managed keys

<TODO: update for cog services>

When you disable customer-managed keys, your Cognitive Services resource is then encrypted with Microsoft-managed keys. To disable customer-managed keys, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) with the `-StorageEncryption` option, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -StorageEncryption  
```

## Next steps

- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
