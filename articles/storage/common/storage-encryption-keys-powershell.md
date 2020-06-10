---
title: Use PowerShell to configure customer-managed keys
titleSuffix: Azure Storage
description: Learn how to use PowerShell to configure customer-managed keys for Azure Storage encryption.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 04/02/2020
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Configure customer-managed keys with Azure Key Vault by using PowerShell

[!INCLUDE [storage-encryption-configure-keys-include](../../../includes/storage-encryption-configure-keys-include.md)]

This article shows how to configure an Azure Key Vault with customer-managed keys using PowerShell. To learn how to create a key vault using  Azure CLI, see [Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell](../../key-vault/secrets/quick-create-powershell.md).

## Assign an identity to the storage account

To enable customer-managed keys for your storage account, first assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the key vault.

To assign a managed identity using PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount). Remember to replace the placeholder values in brackets with your own values.

```powershell
$storageAccount = Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage-account> `
    -AssignIdentity
```

For more information about configuring system-assigned managed identities with PowerShell, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md).

## Create a new key vault

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault). The key vault that you use to store customer-managed keys for Azure Storage encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**.

Remember to replace the placeholder values in brackets with your own values.

```powershell
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

To learn how to enable **Soft Delete** and **Do Not Purge** on an existing key vault with PowerShell, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in [How to use soft-delete with PowerShell](../../key-vault/general/soft-delete-powershell.md).

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the storage account has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the storage account.

To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get
```

## Create a new key

Next, create a new key in the key vault. To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

Only 2048-bit RSA and RSA-HSM keys are supported with Azure Storage encryption. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

## Configure encryption with customer-managed keys

By default, Azure Storage encryption uses Microsoft-managed keys. In this step, configure your Azure Storage account to use customer-managed keys and specify the key to associate with the storage account.

Call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings, as shown in the following example. Include the **-KeyvaultEncryption** option to enable customer-managed keys for the storage account. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -KeyvaultEncryption `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUri $keyVault.VaultUri
```

## Update the key version

When you create a new version of a key, you'll need to update the storage account to use the new version. First, call [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) to get the latest version of the key. Then call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings to use the new version of the key, as shown in the previous section.

## Use a different key

To change the key used for Azure Storage encryption, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) as shown in [Configure encryption with customer-managed keys](#configure-encryption-with-customer-managed-keys) and provide the new key name and version. If the new key is in a different key vault, also update the key vault URI.

## Revoke customer-managed keys

If you believe that a key may have been compromised, you can revoke customer-managed keys by removing the key vault access policy. To revoke a customer-managed key, call the [Remove-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/remove-azkeyvaultaccesspolicy) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Remove-AzKeyVaultAccessPolicy -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
```

## Disable customer-managed keys

When you disable customer-managed keys, your storage account is once again encrypted with Microsoft-managed keys. To disable customer-managed keys, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) with the `-StorageEncryption` option, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -StorageEncryption  
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
