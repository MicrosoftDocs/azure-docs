---
title: Use customer-managed keys with Azure Storage encryption
description: Learn how to use customer-managed keys with Azure Storage encryption. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/16/2019
ms.author: tamram
ms.subservice: common
---

# Use customer-managed keys with Azure Storage encryption

You can use customer-managed keys with Azure Storage encryption. Customer-managed keys enable you to create, rotate, disable, and revoke access controls. Use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This article shows how to configure a key vault with customer-managed keys, using either Azure PowerShell or Azure CLI. You can also configure a key vault in the [Azure portal](https://portal.azure.com/). However, you must use either PowerShell or Azure CLI to configure two required properties on the key vault, **Soft Delete** and **Do Not Purge**.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

## Assign an identity to the storage account

To enable custom key management for your storage account, first assign a system-assigned managed identity to the storage account. You'll use this managed identity to grant the storage account permissions to access the key vault.

You can assign the managed identity by executing the following PowerShell or Azure CLI commands. Remember to replace the placeholder values in brackets with your own values.

### PowerShell

To assign a managed identity using PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount). Remember to replace the placeholder values in brackets with your own values.

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage-account> `
    -AssignIdentity
```

For more information about configuring system-assigned managed identities with PowerShell, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md).

### Azure CLI

To assign a managed identity using Azure CLI, call [az storage account update](/cli/azure/storage/update). Remember to replace the placeholder values in brackets with your own values.

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

To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../../key-vault/quick-create-portal.md). 

### PowerShell

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault). Remember to replace the placeholder values in brackets with your own values.

```powershell
New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

### Azure CLI

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

### PowerShell

To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy). Remember to replace the placeholder values in brackets with your own values.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName <resource_group> `
    -AccountName <storage-account>
$keyVault = Get-AzKeyVault -VaultName <key-vault>
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
```

### Azure CLI

To set the access policy for the key vault, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
```

## Create a new key

Next, create a new key in the key vault.

### PowerShell

To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values.

```powershell
$keyVault = Get-AzKeyVault -VaultName <key-vault>
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

### Azure CLI

To create a new key, call [az keyvault key create](/cli/azure/keyvault/key##az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli-interactive
```

## Configure encryption with customer-managed keys

By default, Azure Storage encryption uses Microsoft-managed keys. Configure your Azure Storage account for custom key management and specify the key to associate with the storage account.

### PowerShell

To configure the storage account to use customer-managed keys and specify the new key as the key to use for Azure Storage encryption, call [Set-AzStorageAccount](/powershell/module/az.keyvault/set-azstorageaccount). In the following examples, remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```powershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -KeyvaultEncryption `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUri $keyVault.VaultUri
```

### Azure CLI

```azurecli-interactive
kv_uri=$(az keyvault show -n <key-vault> -g <resource_group> --query properties.vaultUri -o tsv)
key_version=$(az keyvault key list-versions -n <key_name> --vault-name <key-vault> --query [].kid -o tsv | cut -d '/' -f 6)
az storage account update -n <storage-account> -g <resource_group> --encryption-key-name <key_name> --encryption-key-version $key_version --encryption-key-source Microsoft.Keyvault --encryption-key-vault $kv_uri 
```

### Azure portal

To enable custom key management and specify a key for Azure Storage encryption using the Azure portal, follow these steps:

1. Navigate to your storage account.
1. On the **Settings** blade for the storage account, click **Encryption**. Select the **Use your own key** option, as shown in the following figure.

    ![Portal screenshot showing encryption option](./media/storage-service-encryption-customer-managed-keys/ssecmk1.png)

After you enable custom key management, you'll have the opportunity to specify a key to associate with the storage account.

#### Specify a key as a URI

To specify a key as a URI, follow these steps:

1. To locate the key URI in the Azure portal, navigate to your key vault, and select the **Keys** setting. Select the desired key, then click the key to view its settings. Copy the value of the **Key Identifier** field, which provides the URI.

    ![Screenshot showing key vault key URI](media/storage-service-encryption-customer-managed-keys/key-uri-portal.png)

1. In the **Encryption** settings for your storage account, choose the **Enter key URI** option.
1. In the **Key URI** field, specify the URI.

   ![Portal Screenshot showing Encryption with enter key uri option](./media/storage-service-encryption-customer-managed-keys/ssecmk2.png)

#### Specify a key from a key vault

To specify a key from a key vault, first make sure that you have a key vault that contains a key. To specify a key from a key vault, follow these steps:

1. Choose the **Select from Key Vault** option.
2. Choose the key vault containing the key you want to use.
3. Choose the key from the key vault.

   ![Portal Screenshot showing Encryptions use your own key option](./media/storage-service-encryption-customer-managed-keys/ssecmk3.png)

4. If the storage account does not have access to the key vault, you can run the Azure PowerShell command shown in the following image to grant access.

    ![Portal Screenshot showing access denied for key vault](./media/storage-service-encryption-customer-managed-keys/ssecmk4.png)

You can also grant access via the Azure portal by navigating to the Azure Key Vault in the Azure portal and granting access to the storage account. Be sure to replace the placeholder values shown in angle brackets with your own values:

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
