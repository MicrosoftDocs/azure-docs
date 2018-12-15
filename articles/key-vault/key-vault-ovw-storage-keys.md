---
ms.assetid:
title: Azure Key Vault managed storage account - CLI
description: Storage account keys provide a seemless integration between Azure Key Vault and key based access to Azure Storage Account.
ms.topic: conceptual
services: key-vault
ms.service: key-vault
author: bryanla
ms.author: bryanla
manager: mbaldwin
ms.date: 10/03/2018
---
# Azure Key Vault managed storage account - CLI

> [!NOTE]
> [Azure storage now supports AAD authorization](https://docs.microsoft.com/azure/storage/common/storage-auth-aad). We recommend using Azure Active Directory for authentication and authorization to Storage as users wouldn't have to worry about rotating their Storage Account keys.

- Azure Key Vault manages keys of an Azure Storage Account (ASA).
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.    
    - Azure Key Vault regenerates (rotates) the keys periodically.
    - Key values are never returned in response to caller.
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts.

Prerequisites
--------------
1. [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
   Install Azure CLI   
2. [Create a Storage Account](https://azure.microsoft.com/services/storage/)
    - Follow the steps in this [document](https://docs.microsoft.com/azure/storage/) to create a storage account  
    - **Naming guidance:**
      Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.        
      
Step by step instructions on how to use Key Vault to manage Storage Account Keys
--------------------------------------------------------------------------------
In the below instructions, we are assigning Key Vault as a service to have operator permissions on your storage account

> [!NOTE]
> Please note that once you've set up Azure Key Vault managed storage account keys they should **NO** longer be changed except via Key Vault. Managed Storage account keys means that Key Vault would manage rotating the storage account key

1. After creating a storage account run the following command to get the resource ID of the storage account, you want to manage

    ```
    az storage account show -n storageaccountname (Copy ID field out of the result of this command)
    ```
    
2. Get Application ID of Azure Key Vault's service principal 

    ```
    az ad sp show --id cfa8b339-82a2-471a-a3c9-0fc0be7a4093
    ```
    
3. Assign Storage Key Operator role to Azure Key Vault Identity

    ```
    az role assignment create --role "Storage Account Key Operator Service Role"  --assignee-object-id <ApplicationIdOfKeyVault> --scope <IdOfStorageAccount>
    ```
    
4. Create a Key Vault Managed Storage Account.     <br /><br />
   Below, we are setting a regeneration period of 90 days. After 90 days, Key Vault will regenerate 'key1' and swap the active key from 'key2' to 'key1'.
   
    ```
    az keyvault storage add --vault-name <YourVaultName> -n <StorageAccountName> --active-key-name key2 --auto-regenerate-key --regeneration-period P90D --resource-id <Resource-id-of-storage-account>
    ```
    In case the user didn't create the storage account and does not have permissions to the storage account, the steps below set the permissions for your account to ensure that you can manage all the storage permissions in the Key Vault.
 > [!NOTE] 
    In the case that the user does not have permissions to the storage account, we first get the Object-Id of the user

    ```
    az ad user show --upn-or-object-id "developer@contoso.com"

    az keyvault set-policy --name <YourVaultName> --object-id <ObjectId> --storage-permissions backup delete list regeneratekey recover     purge restore set setsas update
    ```
### Relavant Azure CLI cmdlets
- [Azure CLI Storage Cmdlets](https://docs.microsoft.com/cli/azure/keyvault/storage?view=azure-cli-latest)

### Relevant Powershell cmdlets

- [Get-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/get-azurekeyvaultmanagedstorageaccount)
- [Add-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Add-AzureKeyVaultManagedStorageAccount)
- [Get-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Get-AzureKeyVaultManagedStorageSasDefinition)
- [Update-AzureKeyVaultManagedStorageAccountKey](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Update-AzureKeyVaultManagedStorageAccountKey)
- [Remove-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/remove-azurekeyvaultmanagedstorageaccount)
- [Remove-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Remove-AzureKeyVaultManagedStorageSasDefinition)
- [Set-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Set-AzureKeyVaultManagedStorageSasDefinition)

## See also

- [About keys, secrets, and certificates](https://docs.microsoft.com/rest/api/keyvault/)
- [Key Vault Team Blog](https://blogs.technet.microsoft.com/kv/)
