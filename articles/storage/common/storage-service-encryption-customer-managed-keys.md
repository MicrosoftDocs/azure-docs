---
title: Manage custom keys for Azure Storage encryption with Key Vault
description: Learn how to manage Azure Storage encryption for blobs and files with custom keys. Custom keys give you more flexibility to create, rotate, disable, and revoke access controls. Use Azure Key Vault to manage your custom keys.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/08/2019
ms.author: tamram
ms.subservice: common
---

# Manage custom keys for Azure Storage encryption with Key Vault

You can manage Azure Storage encryption for blobs and files with custom keys. Custom keys give you the flexibility to create, rotate, and revoke access controls.

Use Azure Key Vault to manage your custom encryption keys. With Azure Key Vault, you can manage and control your keys and audit your key usage. You can either create your own encryption keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate the encryption keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This article shows how to configure a key vault with custom keys, using either Azure PowerShell or Azure CLI. You can also configure a key vault in the [Azure portal](https://portal.azure.com/). However, you must use either PowerShell or Azure CLI to configure two required properties on the key vault, **Soft Delete** and **Do Not Purge**.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

## Assign an identity to the storage account

To enable custom key management for your storage account, first assign a system-assigned managed identity to the storage account. You can assign the identity by executing the following PowerShell or Azure CLI commands. For more information about system-assigned managed identities, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md).

Remember to replace the placeholder values in brackets with your own values.

### PowerShell

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -Name <storage-account> -AssignIdentity
```

### Azure CLI

```azurecli-interactive
az account set --subscription <subscription-id>

az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity
```

## Create a new key vault

To create a new key vault using PowerShell or Azure CLI, execute the following commands. Remember to replace the placeholder values in brackets with your own values. To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../../key-vault/quick-create-portal). 

### PowerShell

```powershell
New-AzKeyVault -Name <key-vault> -ResourceGroupName <resource_group> -Location <location>
```

### Azure CLI

```azurecli-interactive
az keyvault create -n <key-vault> -g <resource_group> -l <region> --enable-soft-delete --enable-purge-protection
```

## Configure key vault settings

Enable two key protection settings for the key vault, **Soft Delete** and **Do Not Purge**, by executing the following PowerShell or Azure CLI commands. Remember to replace the placeholder values in brackets with your own values.

### PowerShell

```powershell
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName <key-vault>).ResourceId).Properties `
    | Add-Member -MemberType NoteProperty -Name enableSoftDelete -Value 'True'

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties

($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName <key-vault>).ResourceId).Properties `
    | Add-Member -MemberType NoteProperty -Name enablePurgeProtection -Value 'True'

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

### Azure CLI

```azurecli-interactive
az keyvault update -n <key-vault> -g <resource_group> --enable-soft-delete --enable-purge-protection
```

## Enable custom key management and specify key

By default, Azure Storage encryption uses Microsoft-managed keys. Configure your Azure Storage account for custom key management using either the Azure portal, PowerShell, or Azure CLI. Then specify the key from the key vault to associate with the storage account.

In the following examples, remember to replace the placeholder values in brackets with your own values.

### PowerShell

The following example adds a key to the key vault using [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey) and sets the access policy for the key vault using [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy). The example then configures the storage account to use customer-managed keys and specifies the newly created key as the key to use for Azure Storage encryption.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage-account>
$keyVault = Get-AzKeyVault -VaultName <key-vault>
$key = Add-AzKeyVaultKey -VaultName <key-vault> -Name <key> -Destination 'Software'
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
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

1. Choose the **Enter key URI** option.
2. In the **Key URI** field, specify the URI.

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


## Associate a key with a storage account

You can associate the above key with an existing storage account using either PowerShell or CLI.


### Azure CLI

```azurecli-interactive
kv_uri=$(az keyvault show -n <key-vault> -g <resource_group> --query properties.vaultUri -o tsv)
key_version=$(az keyvault key list-versions -n <key_name> --vault-name <key-vault> --query [].kid -o tsv | cut -d '/' -f 6)
az storage account update -n <storage-account> -g <resource_group> --encryption-key-name <key_name> --encryption-key-version $key_version --encryption-key-source Microsoft.Keyvault --encryption-key-vault $kv_uri 
```

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md) 
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
