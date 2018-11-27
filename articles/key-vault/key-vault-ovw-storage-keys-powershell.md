---
title: Azure Key Vault managed storage account - PowerShell version
description: The managed storage account feature provides a seemless integration, between Azure Key Vault and an Azure storage account.
ms.topic: conceptual
ms.service: key-vault
author: bryanla
ms.author: bryanla
manager: mbaldwin
ms.date: 11/19/2018
---
# Azure Key Vault managed storage account - PowerShell

> [!NOTE]
> [Azure storage integration with Azure Active Directory (Azure AD) is now in preview](https://docs.microsoft.com/azure/storage/common/storage-auth-aad). We recommend using an Azure AD account for authentication and authorization to Azure storage, instead of a storage account. Azure AD also allows you to use Role Based Access Control (RBAC) for managing authorization, and [Azure AD managed identities](/azure/active-directory/managed-identities-azure-resources/) to acquire an access token. This avoids the need for storing credentials in or with your application. 

 An Azure ["storage account"](/azure/storage/storage-create-storage-account) credential consists of an account name, and a key which serves as a "password". Key Vault can manage storage account keys, by storing them as [Key Vault secrets](/azure/key-vault/about-keys-secrets-and-certificates#key-vault-secrets). 

## What Key Vault manages

Key Vault performs several internal management functions on your behalf, when you use the managed storage account key feature:

- Internally, Azure Key Vault can list (sync) keys with an Azure storage account.
- Azure Key Vault regenerates (rotates) the keys periodically.
- Key values are never returned in response to caller.
- Azure Key Vault manages keys of both storage accounts and Classic storage accounts.

When you use the managed storage account key feature:

- **Only allow Key Vault to manage your storage account keys.** Don't attempt to manage them yourself, as you will interfere with Key Vault's processes.
- **Don't allow storage account keys to be managed by more than one Key Vault object**.
- **Don't manually regenerate your storage account keys**. We recommend that you regenerate them via Key Vault.

The following example shows you how to allow Key Vault to manage your storage account key.

## Authorize Key Vault to access to your storage account

> ![TIP]
> Azure AD provides each registered application with a [service principal](/azure/active-directory/develop/app-objects-and-service-principals), which serves as the application's identity. The service principal can then be given authorization to access other Azure resources, through role-based access control (RBAC). Because Key Vault is a Microsoft application, it's pre-registered in all Azure AD tenants under Application ID `cfa8b339-82a2-471a-a3c9-0fc0be7a4093`.

Before Key Vault can access and manage your storage account keys, you must first provide authorization for it to access your storage account. 

The Key Vault application requires permissions to *list* and *regenerate* keys for your storage account. These permissions are enabled through the built-in RBAC role [Storage Account Key Operator Service Role](/azure/role-based-access-control/built-in-roles#storage-account-key-operator-service-role). Assign this role to your Key Vault service principal using the following steps. Be sure to update the `$resourceGroupName`, `$storageAccountName`, `$storageAccountKey`, and `$keyVaultName` variables before you run the script:

```powershell
# TODO: Update with the resource group where your storage account resides, your storage account name, the name of your active storage account key, and your Key Vault instance name
$resourceGroupName = "rgContoso"
$storageAccountName = "sacontoso"
$storageAccountKey = "key1"
$keyVaultName = "kvContoso"

# Authenticate your PowerShell session with Azure AD, for use with Azure Resource Manager cmdlets
$azureProfile = Connect-AzureRmAccount
$userPrincipalName = $azureProfile.Context.Account.Id

# Get a reference to your Azure storage account
$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $storageAccountName

# Assign RBAC role "Storage Account Key Operator Service Role" to Key Vault, limiting the access scope to your storage account. For a classic storage account, use "Classic Storage Account Key Operator Service Role." 
New-AzureRmRoleAssignment -ApplicationId “cfa8b339-82a2-471a-a3c9-0fc0be7a4093” -RoleDefinitionName 'Storage Account Key Operator Service Role' -Scope $storageAccount.Id
```

Upon successful role assignment, you should see output similar to the following:

```console
RoleAssignmentId   : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgContoso/providers/Microsoft.Storage/storageAccounts/sacontoso/providers/Microsoft.Authorization/roleAssignments/189cblll-12fb-406e-8699-4eef8b2b9ecz
Scope              : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgContoso/providers/Microsoft.Storage/storageAccounts/sacontoso
DisplayName        : Azure Key Vault
SignInName         :
RoleDefinitionName : storage account Key Operator Service Role
RoleDefinitionId   : 81a9blll-bebf-436f-a333-f67b29880f1z
ObjectId           : c730c8da-blll-4032-8ad5-945e9dc8262z
ObjectType         : ServicePrincipal
CanDelegate        : False
```

You can also verify and manage access to your storage account, using the storage account "Access control (IAM)" page in the Azure portal. Note that you will receive a *"The role assignment already exists."* error, if Key Vault has already been added to the role, on your storage account. 

## Update your Key Vault's access policy permissions

>[!TIP] 
> Just as Azure AD provides a service principal for an application's identity, a user principal is provided for a user's identity. The user principal can then be given authorization to access Key Vault, through Key Vault access policy permissions.

Using the same PowerShell session, update the Key Vault access policy for your user account. This will endure that you can manage all storage permissions in the Key Vault: 

```azurepowershell-interactive

# Give your user principal access to all storage account permissions, on your Key Vault instance
Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -UserPrincipalName $userPrincipalName -PermissionsToStorage get,list,delete,set,update,regeneratekey,recover,backup,restore,purge
```

Note that permissions for storage accounts are not available on the storage account "Access policies" page in the Azure portal.

## Add a managed storage account to your Key Vault instance

Using the same PowerShell session, create a managed storage account in Azure Key Vault. The  `-DisableAutoRegenerateKey` switch specifies NOT to regenerate the storage account keys.

```azurepowershell-interactive

# Add your storage account to your Key Vault's managed storage accounts
Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $storageAccountName -AccountResourceId $storageAccount.Id -ActiveKeyName $storageAccountKey -DisableAutoRegenerateKey
```

Upon successful addition of the storage account with no key regeneration, you should see output similar to the following:

```console
Id                  : https://kvcontoso.vault.azure.net:443/storage/sacontoso
Vault Name          : kvcontoso
AccountName         : sacontoso
Account Resource Id : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgContoso/providers/Microsoft.Storage/storageAccounts/sacontoso
Active Key Name     : key1
Auto Regenerate Key : False
Regeneration Period : 90.00:00:00
Enabled             : True
Created             : 11/19/2018 11:54:47 PM
Updated             : 11/19/2018 11:54:47 PM
Tags                : 
```


### Key regeneration

If you want Key Vault to regenerate your storage's access keys periodically, you can set a regeneration period. In the following example, we set a regeneration period of 3 days. After 3 days, Key Vault will regenerate 'key1' and swap the active key from 'key2' to 'key1'.

```azurepowershell-interactive
$regenPeriod = [System.Timespan]::FromDays(3)
$accountName = $storage.StorageAccountName

Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $storageAccountName -AccountResourceId $storageAccount.Id -ActiveKeyName $storageAccountKey -RegenerationPeriod $regenPeriod
```

Upon successful addition of the storage account with key regeneration, you should see output similar to the following:

```console
Id                  : https://kvcontoso.vault.azure.net:443/storage/sacontoso
Vault Name          : kvcontoso
AccountName         : sacontoso
Account Resource Id : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgContoso/providers/Microsoft.Storage/storageAccounts/sacontoso
Active Key Name     : key1
Auto Regenerate Key : True
Regeneration Period : 3.00:00:00
Enabled             : True
Created             : 11/19/2018 11:54:47 PM
Updated             : 11/19/2018 11:54:47 PM
Tags                : 
```

## See also

- [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=)
- [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md)
- [Key Vault PowerShell reference](/powershell/module/azurerm.keyvault/)
