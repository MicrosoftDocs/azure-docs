---
ms.assetid: 
title: Azure Key Vault storage keys
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 05/24/2017
---
# Azure Key Vault Storage Keys - kind of a long name, don't ya think?

Before Azure Key Vault Storage Account Keys, developers had to manage thier own Azure Storage Account (ASA) keys and rotate them manually or through an external automation. Azure Key Vault Storage Account Keys are implemented as [Key Vault secrets](https://docs.microsoft.com/rest/api/keyvault/about-keys--secrets-and-certificates#BKMK_WorkingWithSecrets) and are for authenticating with an Azure storage account. 

Also, Key Vault ASA keys are not restricted to be only used with Azure Storage Account. You can perform a wide range of operations with a Key Vault ASA key. *(BRP - Such as?)*

The Key Vault ASA key feature adds value through managing secret rotation for you and at the same time removing the need for direct contact with your Azure Storage Account key by offering shared access signatures (SAS) as a method. 

For more general information on Azure Storage accounts, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Further security through access limits
SAS tokens, constructed using Key Vault storage account keys, provide even more controlled access to an Azure storage account. For more information, see [Using shared access signatures](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1).


## Developer experience 

### Before Azure Key Vault Storage Keys 
Developers used the following practices with a storage account key to get access to Azure storage. 
 
 ```
//create storage account using connection string containing account name and the storage key var storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString")); 
 
var blobClient = storageAccount.CreateCloudBlobClient();
 
 ```
 
### After Azure Key Vault Storage Keys 

```
//Get sastoken from Key Vault //.... 
 
// Create new storage credentials using the SAS token. var accountSasCredential = new StorageCredentials(sasToken); 

// Use credentials and the Blob storage endpoint to create a new Blob service client. var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri("https://myaccount.blob.core.windows.net/"), null, null, null); 

var blobClientWithSas = accountWithSas.CreateCloudBlobClient(); 
 
// If Sas token is about the expire then Get sastoken again from Key Vault //.... 
 
// and update the accountSasCredential accountSasCredential.UpdateSASToken(sasToken); 
 ```



## What Key Vault mandages

Key Vault preforms a number of internal management functions on your behalf when you use Storage Account Keys.

1. Azure Key Vault manages keys of an Azure Storage Account (SAS). 
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.  
    - Azure Key Vault regenerates (rotates) the keys periodically. 
    - Key values are never returned in response to caller. 
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts. 
2. Azure Key Vault allows you, the vault/object owner, to create SAS (account or service SAS) definitions. 
    - The SAS value, created using SAS definition, is returned as a secret via /secrets route.

    *BRP - Is "/secrets route" referring to a general CS method or is this a REST term. Would pathway be a better general term?*

## Supporting interfaces

The Azure Storage Account keys feature is initially available through the follwing interfaces.

- REST 
- .NET / C# 
- PowerShell

## Using Key Vault storage account keys

### Naming

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.  
 
A SAS definition name must be 1-102 characters in length containing only 0-9, a-z, A-Z. 

### Developer best practices 

1. Allow only Key Vault to manage your ASA keys. Do not attempt to manage them yourself as this will interfer. 
2. ASA keys must not be managed by more than one key vault object. 
3. If you need to manually regenerate ASA keys, we recommend you regenerate them via Key Vault. 


