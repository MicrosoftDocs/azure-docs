---
ms.assetid:
title: Azure Key Vault managed storage account - PowerShell version
description: The managed storage account feature provides a seemless integration, between Azure Key Vault and an Azure storage account.
ms.topic: conceptual
services: key-vault
ms.service: key-vault
author: bryanla
ms.author: bryanla
manager: mbaldwin
ms.date: 11/16/2018
---
# Azure Key Vault managed storage account - PowerShell

> [!NOTE]
> [Azure storage integration with Azure Active Directory (Azure AD) is now in preview](https://docs.microsoft.com/azure/storage/common/storage-auth-aad). We recommend using Azure AD accounts for authentication and authorization to Azure storage, instead of a storage account as it:
>
> - eliminates the need for using the Key Vault managed storage account feature.
> - allows you to use Role Based Access Control (RBAC) for managing authorization. 
> - allows you to use an [Azure AD managed identity](/azure/active-directory/managed-identities-azure-resources/) to acquire an access token for your application. This avoids the need for storing credentials in or with your application. 

Azure storage supports a ["storage account"](/azure/storage/storage-create-storage-account) concept. A storage account credential consists of an account name, and a key (which serves as a "password"). Key Vault can manage storage account keys, by storing them as [Key Vault secrets](/azure/key-vault/about-keys-secrets-and-certificates#key-vault-secrets). The Azure Key Vault storage account key feature also manages secret rotation for you. 

## What Key Vault manages

Key Vault performs several internal management functions on your behalf, when you use the managed storage account keys feature:

    - Internally, Azure Key Vault can list (sync) keys with an Azure storage account.
    - Azure Key Vault regenerates (rotates) the keys periodically.
    - Key values are never returned in response to caller.
    - Azure Key Vault manages keys of both storage accounts and Classic storage accounts.

When you use the managed storage account key feature:

- Only allow Key Vault to manage your storage account keys. Don't attempt to manage them yourself, you will interfere with Key Vault's processes.
- Don't allow storage account keys to be managed by more than one Key Vault object.
- If you need to manually regenerate your storage account keys, we recommend that you regenerate them via Key Vault.

## Authorize Key Vault to access to your storage account

Before Key Vault can access and manage your storage account keys, you must authorize its access your storage account.  Like many applications, Key Vault integrates with Azure AD for identity and access management services. 

Because Key Vault is a Microsoft application, it's pre-registered in all Azure AD tenants under Application ID `cfa8b339-82a2-471a-a3c9-0fc0be7a4093`. And like all applications registered with Azure AD, a [service principal](/azure/active-directory/develop/app-objects-and-service-principals) object provides the application's identity properties. The service principal can then be given authorization to access another resource, through role-based access control (RBAC).  

The Azure Key Vault application requires permissions to *list* and *regenerate* keys for your storage account. These permissions are enabled through the built-in [Storage Account Key Operator Service](/azure/role-based-access-control/built-in-roles#storage-account-key-operator-service-role) RBAC role. You assign the Key Vault service principal to this role using the following steps:

```powershell
# Get the resource ID of the Azure storage account you want Key Vault to manage
$storage = Get-AzureRmStorageAccount -ResourceGroupName "mystorageResourceGroup" -StorageAccountName "mystorage"

# Assign Storage Key Operator role to Azure Key Vault Identity
New-AzureRmRoleAssignment -ApplicationId “cfa8b339-82a2-471a-a3c9-0fc0be7a4093” -RoleDefinitionName 'Storage Account Key Operator Service Role' -Scope $storage.Id
```

> [!NOTE]
> For a classic account type, set the role parameter to *"Classic Storage Account Key Operator Service Role."*

Upon successful role assignment, you should see output similar to the following

```console
RoleAssignmentId   : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgSandbox/providers/Microsoft.Storage/storageAccounts/sabltest/providers/Microsoft.Authorization/roleAssignments/189cblll-12fb-406e-8699-4eef8b2b9ecz
Scope              : /subscriptions/03f0blll-ce69-483a-a092-d06ea46dfb8z/resourceGroups/rgSandbox/providers/Microsoft.Storage/storageAccounts/sabltest
DisplayName        : Azure Key Vault
SignInName         :
RoleDefinitionName : storage account Key Operator Service Role
RoleDefinitionId   : 81a9blll-bebf-436f-a333-f67b29880f1z
ObjectId           : c730c8da-blll-4032-8ad5-945e9dc8262z
ObjectType         : ServicePrincipal
CanDelegate        : False
```

## Working example

The following example demonstrates creating a Key Vault managed Azure storage account.

### Prerequisite

Before starting, make sure you [Authorize Key Vault to access to your storage account](#authorize-key-vault-to-access-to-your-storage-account).

### Setup

```powershell
# This is the name of our Key Vault
$keyVaultName = "mykeyVault"

# Fetching all the storage account object, of the storage account we want to manage with KeyVault
$storage = Get-AzureRmStorageAccount -ResourceGroupName "mystorageResourceGroup" -StorageAccountName "mystorage"

# Get ObjectId of Azure KeyVault Identity service principal
$servicePrincipalId = $(Get-AzureRmADServicePrincipal -ServicePrincipalName cfa8b339-82a2-471a-a3c9-0fc0be7a4093).Id
```

Next, set the permissions for **your account** to ensure that you can manage all the storage permissions in the Key Vault. In the example below, our Azure account is _developer@contoso.com_.

```powershell
# Searching our Azure Active Directory for our account's ObjectId
$userPrincipalId = $(Get-AzureRmADUser -SearchString "developer@contoso.com").Id

# We use the ObjectId we found to setting permissions on the vault
Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $userPrincipalId -PermissionsToStorage all
```

### Create a Key Vault managed storage account

Now, create a managed storage account in Azure Key Vault 
- `-ActiveKeyName` uses 'key2'.
- `-AccountName` is used to identify your managed storage account. Below, we are using the storage account name to keep it simple but it can be any name.
- `-DisableAutoRegenerateKey` specifies NOT to regenerate the storage account keys.

```powershell
# Adds your storage account to be managed by Key Vault and will use the access key, key2
Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $storage.StorageAccountName -AccountResourceId $storage.Id -ActiveKeyName key2 -DisableAutoRegenerateKey
```

### Key regeneration

If you want Key Vault to regenerate your storage's access keys periodically, you can set a regeneration period. Below, we are setting a regeneration period of 3 days. After 3 days, Key Vault will regenerate 'key1' and swap the active key from 'key2' to 'key1'.

```powershell
$regenPeriod = [System.Timespan]::FromDays(3)
$accountName = $storage.StorageAccountName

Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $accountName -AccountResourceId $storage.Id -ActiveKeyName key2 -RegenerationPeriod $regenPeriod
```

### Relevant Powershell cmdlets

- [Get-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/get-azurekeyvaultmanagedstorageaccount)
- [Add-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Add-AzureKeyVaultManagedStorageAccount)
- [Update-AzureKeyVaultManagedStorageAccountKey](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Update-AzureKeyVaultManagedStorageAccountKey)
- [Remove-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/remove-azurekeyvaultmanagedstorageaccount)

## Storage account onboarding

Example: As a Key Vault object owner you add a storage account object to your Azure Key Vault to onboard a storage account.

During onboarding, Key Vault needs to verify that the identity of the onboarding account has permissions to *list* and to *regenerate* storage keys. In order to verify these permissions, Key Vault gets an OBO (On Behalf Of) token from the authentication service, audience set to Azure Resource Manager, and makes a *list* key call to the Azure Storage service. If the *list* call fails, the Key Vault object creation fails with an HTTP status code of *Forbidden*. The keys listed in this fashion are cached with your key vault entity storage.

Key Vault must verify that the identity has *regenerate* permissions before it can take ownership of regenerating your keys. To verify that the identity, via OBO token, as well as the Key Vault first party identity has these permissions:

- Key Vault lists RBAC permissions on the storage account resource.
- Key Vault validates the response via regular expression matching of actions and non-actions.

Find some supporting [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=).

If the identity does not have *regenerate* permissions or if Key Vault's first party identity doesn’t have *list* or *regenerate* permission, then the onboarding request fails returning an appropriate error code and message.

The OBO token will only work when you use first-party, native client applications of either PowerShell or CLI.

## Other applications

- SAS tokens, constructed using Key Vault storage account keys, provide even more controlled access to an Azure storage account. For more information, see [Using shared access signatures](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1).

## See also

- [About keys, secrets, and certificates](https://docs.microsoft.com/rest/api/keyvault/)
- [Key Vault Team Blog](https://blogs.technet.microsoft.com/kv/)
