---
ms.assetid: 
title: Azure Key Vault storage keys
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 05/23/2017
---
# Azure Key Vault storage keys

Today, developers manage thier own Azure Storage Account (ASA) keys and rotate them manually or through an external automation. Azure Key Vault storage account keys are [Key Vault secrets](https://docs.microsoft.com/rest/api/keyvault/about-keys--secrets-and-certificates#BKMK_WorkingWithSecrets) for authenticating with an Azure storage account. 

Key Vault ASA keys are not restricted to only be used with Azure Storage Account. You can perform a wide range of operations with a Key Vault ASA key. (BRP - Such as?)

Key Vault ASA keys offer great value through managing secret rotation for you and at the same time removing the need for direct contact with a Azure Storage Account key by offering SAS as a method. 

For more general information on Azure Storage accounts, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Further security through access limits
Shared access signatures (SAS), constructed using Key Vault storage account keys, provide even more controlled access to an Azure storage account. For more information, see [Using shared access signatures](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1).

(BRP - Not clear about the mention of this (above) in the spec. What is the significance? Does it really belong here?)


### Developer experience 

#### Today 
Developers use the following practices with a storage account key to get access to Azure storage. 
 
 ```
//create storage account using connection string containing account name and the storage key var storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString")); 
 
var blobClient = storageAccount.CreateCloudBlobClient();
 
 ```
 
#### Tomorrow 

```
//Get sastoken from Key Vault //.... 
 
// Create new storage credentials using the SAS token. var accountSasCredential = new StorageCredentials(sasToken); 

// Use credentials and the Blob storage endpoint to create a new Blob service client. var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri("https://myaccount.blob.core.windows.net/"), null, null, null); 

var blobClientWithSas = accountWithSas.CreateCloudBlobClient(); 
 
// If Sas token is about the expire then Get sastoken again from Key Vault //.... 
 
// and update the accountSasCredential accountSasCredential.UpdateSASToken(sasToken); 
 ```



### Scenarios

1. Azure Key Vault manages keys of an Azure Storage Account (SAS). 
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.  
    - Azure Key Vault regenerates (rotates) the keys periodically. 
    - Key values are never returned in response to caller. 
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts. 
2. Azure Key Vault allow vault/object owner to define SAS (account or service sas) definitions. 
    - The SAS value (created using SAS definition) is returned as a secret via /secrets route.  

## Supporting interfaces

The Azure Storage Account keys feature is initially available through the follwing interfaces.

- REST 
- .NET / C# 
- PowerShell

## Using Key Vault storage account keys

### Naming

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.  
 
A SAS definition name must be 1-102 characters in length containing only 0-9, a-z, A-Z. 

### Recommended Developer Practices 

1. Key Vault ASA keys must not be managed out of band.
    - Allow only Key Vault to manage your ASA keys. 
2. Key Vault ASA keys must not be managed by more than one key vault object. 
3. If it’s required to manually regenerate keys, we  recommend you regenerate them via Key Vault. 
4. Don’t manually regenerate both the keys in a short period of time. 
    - Ensure all applications are migrated to the newer key before regenerating the other key. 
5. Your application must re-retrieve SAS before it expires for continued access to storage. 
6. The validity period of a SAS token must be less than regeneration period of the key. 
- A key is valid for two times the regeneration period unless it’s regenerated forcefully (manually). Hence, SAS token having validity period of less than regeneration period must never become invalid before its expiration time unless key was regenerated forcefully (manually).

