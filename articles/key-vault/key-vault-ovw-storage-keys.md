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
ms.date: 08/21/2017
---
# Azure Key Vault Storage Account Keys

Before Azure Key Vault Storage Account Keys, developers had to manage their own
Azure Storage Account (ASA) keys and rotate them manually or through an external
automation. Now, Key Vault Storage Account Keys are implemented as
[Key Vault secrets](https://docs.microsoft.com/rest/api/keyvault/about-keys--secrets-and-certificates#BKMK_WorkingWithSecrets)
for authenticating with an Azure Storage Account.

The Azure Storage Account (ASA) key feature manages secret rotation for you. It
also removes the need for your direct contact with an ASA key by offering Shared
Access Signatures (SAS) as a method.

For more general information on Azure Storage Accounts, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Supporting interfaces

You'll find a complete listing and links to our programming and scripting
interfaces in the [Key Vault Developer's Guide](key-vault-developers-guide.md#coding-with-key-vault).


## What Key Vault manages

Key Vault performs several internal management functions on your behalf when you
use Managed Storage Account Keys.

- Azure Key Vault manages keys of an Azure Storage Account (ASA).
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.
    - Azure Key Vault regenerates (rotates) the keys periodically.
    - Key values are never returned in response to caller.
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts.
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

- Only allow Key Vault to manage your ASA keys. Do not attempt to manage them yourself, you will interfere with Key Vault's processes.
- Do not allow ASA keys to be managed by more than one Key Vault object.
- If you need to manually regenerate your ASA keys, we recommend that you regenerate them via Key Vault.

## Getting started

### Give Key Vault access to your Storage Account 

Like many applications, Key Vault is registered with Azure AD in order to use OAuth to access other services. During registration, [a service principal](/azure/active-directory/develop/app-objects-and-service-principals) object is created, which is used to represent the application's identity at run time. The service principal is also used to authorize the application's identity to access another resource, through role-based access control (RBAC).

The Azure Key Vault application identity needs permissions to *list* and *regenerate* keys for your storage account. Set up these permissions using the following steps:

```powershell
# Get the resource ID of the Azure Storage Account you want to manage.
# Below, we are fetching a storage account using Azure Resource Manager
$storage = Get-AzureRmStorageAccount -ResourceGroupName "mystorageResourceGroup" -StorageAccountName "mystorage"

# Get Application ID of Azure Key Vault's service principal
$servicePrincipal = Get-AzureRmADServicePrincipal -ServicePrincipalName cfa8b339-82a2-471a-a3c9-0fc0be7a4093

# Assign Storage Key Operator role to Azure Key Vault Identity
New-AzureRmRoleAssignment -ObjectId $servicePrincipal.Id -RoleDefinitionName 'Storage Account Key Operator Service Role' -Scope $storage.Id
```

    >[!NOTE]
    > For a classic account type, set the role parameter to *"Classic Storage Account Key Operator Service Role."*

## Working example

The following example demonstrates creating a Key Vault managed Azure Storage
Account and the associated SAS definitions.

### Prerequisite

Ensure you have completed [Setup for role-based access control (RBAC) permissions](#setup-for-role-based-access-control-rbac-permissions).

### Setup

```powershell
# This is the name of our Key Vault
$keyVaultName = "mykeyVault"

# Fetching all the storage account object, of the ASA we want to manage with KeyVault
$storage = Get-AzureRmStorageAccount -ResourceGroupName "mystorageResourceGroup" -StorageAccountName "mystorage"

# Get ObjectId of Azure KeyVault Identity service principal
$servicePrincipalId = $(Get-AzureRmADServicePrincipal -ServicePrincipalName cfa8b339-82a2-471a-a3c9-0fc0be7a4093).Id
```

Next, set the permissions for **your account** to ensure that you can manage all
the storage permissions in the Key Vault. In the example below, our Azure
account is _developer@contoso.com_.

```powershell
# Searching our Azure Active Directory for our account's ObjectId
$userPrincipalId = $(Get-AzureRmADUser -SearchString "developer@contoso.com").Id

# We use the ObjectId we found to setting permissions on the vault
Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $userPrincipalId -PermissionsToStorage all
```

### Create a Key Vault Managed Storage Account

Now, create a Managed Storage Account in Azure Key Vault and use an access key
from your storage account to create the SAS tokens.
- `-ActiveKeyName` uses 'key2' to generate the SAS tokens.
- `-AccountName` is used to identify your managed storage account. Below, we are using the storage account name to keep it simple but it can be any name.
- `-DisableAutoRegenerateKey` specifies not regenerate the storage account keys.

```powershell
# Adds your storage account to be managed by Key Vault and will use the access key, key2
Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $storage.StorageAccountName -AccountResourceId $storage.Id -ActiveKeyName key2 -DisableAutoRegenerateKey
```

### Key regeneration

If you want Key Vault to regenerate your storage's access keys periodically, you
can set a regeneration period. Below, we are setting a regeneration period of 3
days. After 3 days, Key Vault will regenerate 'key1' and swap the active key
from 'key2' to 'key1'.

```powershell
$regenPeriod = [System.Timespan]::FromDays(3)
$accountName = $storage.StorageAccountName

Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $accountName -AccountResourceId $storage.Id -ActiveKeyName key2 -RegenerationPeriod $regenPeriod
```

### Set SAS definitions

The account SAS provides access to the blob service with different permissions.
Set the SAS definitions in Key Vault for your managed storage account.
- `-AccountName` is the name of the managed storage account in Key Vault.
- `-Name` is the identifier for the SAS token in your storage.
- `-ValidityPeriod` sets the expiration date for the generated SAS token.

```powershell
$validityPeriod = [System.Timespan]::FromDays(1)
$readSasName = "readBlobSas"
$writeSasName = "writeBlobSas"

Set-AzureKeyVaultManagedStorageSasDefinition -Service Blob -ResourceType Container,Service -VaultName $keyVaultName -AccountName $accountName -Name $readSasName -Protocol HttpsOnly -ValidityPeriod $validityPeriod -Permission Read,List

Set-AzureKeyVaultManagedStorageSasDefinition -Service Blob -ResourceType Container,Service,Object -VaultName $keyVaultName -AccountName $accountName -Name $writeSasName -Protocol HttpsOnly -ValidityPeriod $validityPeriod -Permission Read,List,Write
```

### Get SAS tokens

Get the corresponding SAS tokens and make calls to storage. `-SecretName` is
constructed using the input from the `AccountName` and `Name` parameters when
you executed [Set-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Set-AzureKeyVaultManagedStorageSasDefinition).

```powershell
$readSasToken = (Get-AzureKeyVaultSecret -VaultName $keyVaultName -SecretName "$accountName-$readSasName").SecretValueText
$writeSasToken = (Get-AzureKeyVaultSecret -VaultName $keyVaultName -SecretName "$accountName-$writeSasName").SecretValueText
```

### Create storage

Notice that trying to access with *$readSasToken* fails, but that we are able to
access with *$writeSasToken*.

```powershell
$context1 = New-AzureStorageContext -SasToken $readSasToken -StorageAccountName $storage.StorageAccountName
$context2 = New-AzureStorageContext -SasToken $writeSasToken -StorageAccountName $storage.StorageAccountName

# Ensure the txt file in command exists in local path mentioned
Set-AzureStorageBlobContent -Container containertest1 -File "./abc.txt" -Context $context1
Set-AzureStorageBlobContent -Container cont1-file "./file.txt" -Context $context2
```

You are able access the storage blob content with the SAS token that has write access.

### Relevant Powershell cmdlets

- [Get-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/get-azurekeyvaultmanagedstorageaccount)
- [Add-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Add-AzureKeyVaultManagedStorageAccount)
- [Get-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Get-AzureKeyVaultManagedStorageSasDefinition)
- [Update-AzureKeyVaultManagedStorageAccountKey](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Update-AzureKeyVaultManagedStorageAccountKey)
- [Remove-AzureKeyVaultManagedStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.keyvault/remove-azurekeyvaultmanagedstorageaccount)
- [Remove-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Remove-AzureKeyVaultManagedStorageSasDefinition)
- [Set-AzureKeyVaultManagedStorageSasDefinition](https://docs.microsoft.com/powershell/module/AzureRM.KeyVault/Set-AzureKeyVaultManagedStorageSasDefinition)

## Storage account onboarding

Example: As a Key Vault object owner you add a storage account object to your Azure Key Vault to onboard a storage account.

During onboarding, Key Vault needs to verify that the identity of the onboarding account has permissions to *list* and to *regenerate* storage keys. In order to verify these permissions, Key Vault gets an OBO (On Behalf Of) token from the authentication service, audience set to Azure Resource Manager, and makes a *list* key call to the Azure Storage service. If the *list* call fails, the Key Vault object creation fails with an HTTP status code of *Forbidden*. The keys listed in this fashion are cached with your key vault entity storage.

Key Vault must verify that the identity has *regenerate* permissions before it can take ownership of regenerating your keys. To verify that the identity, via OBO token, as well as the Key Vault first party identity has these permissions:

- Key Vault lists RBAC permissions on the storage account resource.
- Key Vault validates the response via regular expression matching of actions and non-actions.

Find some supporting examples at [Key Vault - Managed Storage Account Keys Samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=).

If the identity does not have *regenerate* permissions or if Key Vault's first party identity doesn’t have *list* or *regenerate* permission, then the onboarding request fails returning an appropriate error code and message.

The OBO token will only work when you use first-party, native client applications of either PowerShell or CLI.

## Other applications

- SAS tokens, constructed using Key Vault storage account keys, provide even more controlled access to an Azure storage account. For more information, see [Using shared access signatures](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1).

## See also

- [About keys, secrets, and certificates](https://docs.microsoft.com/rest/api/keyvault/)
- [Key Vault Team Blog](https://blogs.technet.microsoft.com/kv/)
