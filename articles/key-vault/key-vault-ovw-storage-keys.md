---
ms.assetid:
title: Azure Key Vault Storage Account Keys
description: Storage account keys provide a seemless integration between Azure Key Vault and key based access to Azure Storage Account.
ms.topic: conceptual
services: key-vault
ms.service: key-vault
author: bryanla
ms.author: bryanla
manager: mbaldwin
ms.date: 10/03/2018
---
<<<<<<< HEAD
# Azure Key Vault Storage Account Keys
Azure Key Vault Storage Account Keys
=====================================
Before Azure Key Vault Storage Account Keys, developers had to manage their own Azure Storage Account (ASA)keys and rotate them manually or through an external automation. Now, Key Vault Storage Account Keys are implemented as Key Vault secrets for authenticating with an Azure Storage Account. In other words in Azure Key Vault supports a new type called Storage Account Keys.
This relieves developers from rotating the storage account keys manually

What Key Vault manages
----------------------
Key Vault performs several internal management functions on your behalf when you use Managed Storage Account Keys.
=======
# Azure Key Vault storage account keys

Before Azure Key Vault storage account keys, developers had to manage their own
Azure Storage Account (ASA) keys and rotate them manually or through an external
automation. Now, Key Vault Storage Account Keys are implemented as
[Key Vault secrets](https://docs.microsoft.com/rest/api/keyvault/about-keys--secrets-and-certificates#BKMK_WorkingWithSecrets)
for authenticating with an Azure Storage Account.

The Azure Storage Account (ASA) key feature manages secret rotation for you. It
also removes the need for direct contact with an ASA key, by offering Shared
Access Signatures (SAS) as a method.

For more general information on Azure Storage Accounts, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Supporting interfaces

You'll find a complete listing and links to our programming and scripting
interfaces in the [Key Vault Developer's Guide](key-vault-developers-guide.md#coding-with-key-vault).


## What Key Vault manages

Key Vault performs several internal management functions on your behalf when you
use Managed Storage Account Keys.
>>>>>>> upstream/master

- Azure Key Vault manages keys of an Azure Storage Account (ASA).
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.    
    - Azure Key Vault regenerates (rotates) the keys periodically.
    - Key values are never returned in response to caller.
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts.
<<<<<<< HEAD
=======
- Azure Key Vault allows you, the vault/object owner, to create SAS (Shared Access Signature, account or service SAS) definitions.
    - The SAS value, created using SAS definition, is returned as a secret via the REST URI path. For more information, see the SAS definition operations in the [Azure Key Vault REST API reference](/rest/api/keyvault).

## Naming guidance

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- A SAS definition name must be 1-102 characters in length containing only 0-9, a-z, A-Z.

## Developer experience

### Before Azure Key Vault Storage Keys

Developers used to need to do the following practices with a storage account key
to get access to Azure storage.
1. Store connection string or SAS token in Azure AppService application settings or another storage.
1. At application start-up, fetch the connection string or SAS token.
1. Create [CloudStorageAccount](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount) to interact with storage.

```cs
// The Connection string is being fetched from App Service application settings
var connectionStringOrSasToken = CloudConfigurationManager.GetSetting("StorageConnectionString");
var storageAccount = CloudStorageAccount.Parse(connectionStringOrSasToken);
var blobClient = storageAccount.CreateCloudBlobClient();
 ```

### After Azure Key Vault Storage Keys

Developers create a [KeyVaultClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.keyvault.keyvaultclient)
and leverage that to get the SAS token for their storage. Afterwards, they
create [CloudStorageAccount](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount)
with that token.

```cs
// Create KeyVaultClient with vault credentials
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(securityToken));

// Get a SAS token for our storage from Key Vault
var sasToken = await kv.GetSecretAsync("SecretUri");

// Create new storage credentials using the SAS token.
var accountSasCredential = new StorageCredentials(sasToken.Value);

// Use the storage credentials and the Blob storage endpoint to create a new Blob service client.
var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri ("https://myaccount.blob.core.windows.net/"), null, null, null);

var blobClientWithSas = accountWithSas.CreateCloudBlobClient();

// Use the blobClientWithSas
...

// If your SAS token is about to expire, get the SAS Token again from Key Vault and update it.
sasToken = await kv.GetSecretAsync("SecretUri");
accountSasCredential.UpdateSASToken(sasToken);
```

 ### Developer guidance

- Only allow Key Vault to manage your ASA keys. Don't attempt to manage them yourself, you will interfere with Key Vault's processes.
- Don't allow ASA keys to be managed by more than one Key Vault object.
- If you need to manually regenerate your ASA keys, we recommend that you regenerate them via Key Vault.

## Authorize Key Vault to access to your storage account

Before Key Vault can access and manage your storage account keys, you must authorize its access your storage account.  Like many applications, Key Vault integrates with Azure AD for identity and access management services. 

Because Key Vault is a Microsoft application, it's pre-registered in all Azure AD tenants under Application ID `cfa8b339-82a2-471a-a3c9-0fc0be7a4093`. And like all applications registered with Azure AD, a [service principal](/azure/active-directory/develop/app-objects-and-service-principals) object provides the application's identity properties. The service principal can then be given authorization to access another resource, through role-based access control (RBAC).  

The Azure Key Vault application requires permissions to *list* and *regenerate* keys for your storage account. These permissions are enabled through the built-in [Storage Account Key Operator Service](/azure/role-based-access-control/built-in-roles#storage-account-key-operator-service-role) RBAC role. You assign the Key Vault service principal to this role using the following steps:

```powershell
# Get the resource ID of the Azure Storage Account you want Key Vault to manage
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
RoleDefinitionName : Storage Account Key Operator Service Role
RoleDefinitionId   : 81a9blll-bebf-436f-a333-f67b29880f1z
ObjectId           : c730c8da-blll-4032-8ad5-945e9dc8262z
ObjectType         : ServicePrincipal
CanDelegate        : False
```

## Working example

The following example demonstrates creating a Key Vault managed Azure Storage Account and the associated SAS definitions.

### Prerequisite

Before starting, make sure you [Authorize Key Vault to access to your storage account](#authorize-key-vault-to-access-to-your-storage-account).
>>>>>>> upstream/master

Prerequisites
--------------
1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
   Install Azure CLI   
2. [Create a Storage Account](https://azure.microsoft.com/en-us/services/storage/)
    - Please follow the steps in this [document](https://docs.microsoft.com/en-us/azure/storage/) to create a storage account  
    - **Naming guidance:**
      Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.        
      
Step by step instructions
-------------------------

1. Get the resource ID of the Azure Storage Account you want to manage.
    a. Once we create a storage account 
    ```
    az storage account show -n storageaccountname (Copy ID out of the result of this command)
    ```
2. Get the resource ID of the Azure Storage Account you want to manage.
    ```
    az storage account show -n storageaccountname (Take ID out of this)
    ```
3. Get Application ID of Azure Key Vault's service principal 
    ```
    az ad sp show --id cfa8b339-82a2-471a-a3c9-0fc0be7a4093
    ```
4. Assign Storage Key Operator role to Azure Key Vault Identity
    ```
    az role assignment create --role "Storage Account Key Operator Service Role"  --assignee-object-id hhjkh --scope idofthestorageaccount
    ```
5. Create a Key Vault Managed Storage Account.     <br /><br />
   Below command asks Key Vault to regenerate the key every 90 days.
   Below command asks Key Vault to regenerate your storage's access keys periodically, with a regeneration period. Below, we are setting a regeneration period of 30 days. After 30 days, Key Vault will regenerate 'key1' and swap the active key from 'key2' to 'key1'.
    ```
    az keyvault storage add --vault-name PrashanthOfficial -n <StorageAccountName> --active-key-name key2 --auto-generate-key --regeneration-period P30D --resource-id <Resource-id-of-storage-account>
    ```
    In case the user didn't create the storage account and does not have permissions to the storage account, the steps below set the permissions for your account to ensure that you can manage all the storage permissions in the Key Vault.
    [!NOTE] In the case that the user does not permissions to the storage account 
    We first get the object id of the user

    ```
    az ad user show --upn-or-object-id "developer@contoso.com"

    az keyvault set-policy --name PrashanthOfficial --object-id 4dkjhkjhkj --storage-permissions backup delete list regeneratekey recover purge restore set setsas update
    ```

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
