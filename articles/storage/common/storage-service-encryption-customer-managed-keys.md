---
title: Manage custom keys for Azure Storage encryption with Key Vault
description: Learn how to manage Azure Storage encryption for blobs and files with custom keys. Custom keys give you more flexibility to create, rotate, disable, and revoke access controls. Use Azure Key Vault to manage your custom keys.
services: storage
author: lakasa

ms.service: storage
ms.topic: article
ms.date: 03/14/2019
ms.author: lakasa
ms.subservice: common
---

# Manage custom keys for Azure Storage encryption with Key Vault

You can manage Azure Storage encryption for blobs and files with custom keys. Custom keys give you more flexibility to create, rotate, disable, and revoke access controls.

Use Azure Key Vault to manage your custom encryption keys. With Azure Key Vault, you can manage and control your keys and audit your key usage. You can either create your own encryption keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate the encryption keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This article shows how to configure a key vault with custom keys, using either PowerShell or Azure CLI.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

## Assign an identity to the storage account

To enable custom key management for your storage account, first assign an identity to the storage account. You can assign the identity by executing the following PowerShell or Azure CLI commands. Remember to replace the placeholder values in brackets with your own values.

### PowerShell

```powershell
Set-AzStorageAccount -ResourceGroupName $resourceGroup -Name $accountName -AssignIdentity
```

### Azure CLI

```azurecli-interactive
az storage account update \
    --name <account_name> \
    --resource-group <resource_group> \
    --assign-identity
```

## Create a new Azure key vault

If you do not have a keyvault, you can create it from the portal, Powershell or CLI:

### PowerShell

```powershell
New-AzKeyVault -Name <vault_name> -ResourceGroupName <resource_group> -Location <location>
```

### Azure CLI

```azurecli-interactive
az keyvault create -n <vault_name> -g <resource_group> -l <region> --enable-soft-delete --enable-purge-protection
```

## Configure an existing Azure key vault

If you are using an existing key vault, you need to enable two key protection settings, **Soft Delete** and **Do Not Purge**, by executing the following PowerShell or Azure CLI commands:

### PowerShell

```powershell
New-AzKeyVault -Name <vault_name> -ResourceGroupName <resource_group> -Location <location>
```

### Azure CLI

```azurecli-interactive
az keyvault create -n <vault_name> -g <resource_group> -l <region> --enable-soft-delete --enable-purge-protection
```

## Configure an existing Azure key vault

If you are using an existing key vault, you need to enable two key protection settings, **Soft Delete** and **Do Not Purge**, by executing the following PowerShell or Azure CLI commands:

### PowerShell

```powershell
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName $vaultName).ResourceId).Properties `
    | Add-Member -MemberType NoteProperty -Name enableSoftDelete -Value 'True'

Set-AzResource -resourceid $resource.ResourceId -Properties
$resource.Properties

($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName $vaultName).ResourceId).Properties `
    | Add-Member -MemberType NoteProperty -Name enablePurgeProtection -Value 'True'

Set-AzResource -resourceid $resource.ResourceId -Properties
$resource.Properties
```

### Azure CLI

```azurecli-interactive
az keyvault update -n <vault_name> -g <resource_group> --enable-soft-delete --enable-purge-protection
```

## Enable custom key management

By default, Azure Storage encryption uses Microsoft-managed keys. You can enable custom key management for the storage account using the [Azure portal](https://portal.azure.com/). On the **Settings** blade for the storage account, click **Encryption**. Select the **Use your own key** option, as shown in the following figure.

![Portal screenshot showing encryption option](./media/storage-service-encryption-customer-managed-keys/ssecmk1.png)

## Specify a key

You can specify your key either as a URI, or by selecting the key from a key vault.

### Specify a key as a URI

To specify a key from a URI in the portal, follow these steps:

1. Choose the **Enter key URI** option.
2. In the **Key URI** field, specify the URI.

   ![Portal Screenshot showing Encryption with enter key uri option](./media/storage-service-encryption-customer-managed-keys/ssecmk2.png)

### Specify a key from a key vault

You'll need a key vault that contains a key. To specify a key from a key vault using the Azure portal, follow these steps:

1. Choose the **Select from Key Vault** option.
2. Choose the key vault containing the key you want to use.
3. Choose the key from the key vault.

   ![Portal Screenshot showing Encryptions use your own key option](./media/storage-service-encryption-customer-managed-keys/ssecmk3.png)

4. If the storage account does not have access to the key vault, you can run the Azure PowerShell command shown in the following image to grant access.

    ![Portal Screenshot showing access denied for key vault](./media/storage-service-encryption-customer-managed-keys/ssecmk4.png)

You can also grant access via the Azure portal by navigating to the Azure Key Vault in the Azure portal and granting access to the storage account. Be sure to replace the placeholder values shown in angle brackets with your own values:

## Associate a key with a storage account

You can associate the above key with an existing storage account using either PowerShell or CLI.

### PowerShell

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount"
$keyVault = Get-AzKeyVault -VaultName "mykeyvault"
$key = Get-AzureKeyVaultKey -VaultName $keyVault.VaultName -Name "keytoencrypt"
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -KeyvaultEncryption `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUri $keyVault.VaultUri
```

### Azure CLI

```azurecli-interactive
kv_uri=$(az keyvault show -n <vault_name> -g <resource_group> --query properties.vaultUri -o tsv)
key_version=$(az keyvault key list-versions -n <key_name> --vault-name <vault_name> --query [].kid -o tsv | cut -d '/' -f 6)
az storage account update -n <account_name> -g <resource_group> --encryption-key-name <key_name> --encryption-key-version $key_version --encryption-key-source Microsoft.Keyvault --encryption-key-vault $kv_uri 
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
