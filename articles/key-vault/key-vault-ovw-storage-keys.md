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

Today, developers manage thier own Azure Storage Account keys and rotate them manually or through an external automation. Azure Storage Account keys are [Key Vault secrets](https://docs.microsoft.com/rest/api/keyvault/about-keys--secrets-and-certificates#BKMK_WorkingWithSecrets) for authenticating with an Azure Storage Account. 

Azure Storage Account keys are not restrictive in terms of access to Azure Storage Account. An identity can perform a wide range of operations with an Azure Storage Account key in hand. 

Shared Access Signatures (SAS) provide a more controlled access to an Azure Storage Account. SAS are constructed using storage account keys. 

Azure Storage Account keys offer great value through managing secret rotation for you and at the same time removing the need for direct contact with Azure Storage Account key by offering SAS as a method. 

For more general information on Azure Storage accounts, see [About Azure storage accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).


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
 

## Supporting interfaces

The Azure Storage Account keys feature is initially available through the follwing interfaces.

- REST 
- .NET / C# 
- PowerShell


### Scenarios

1. Azure Key Vault manages keys of an Azure Storage Account (SAS). 
    - Internally, Azure Key Vault can list (sync) keys with an Azure Storage Account.  
    - Azure Key Vault regenerates (rotates) the keys periodically. 
    - Key values are never returned in response to caller. 
    - Azure Key Vault manages keys of both Storage Accounts and Classic Storage Accounts. 
2. Azure Key Vault allow vault/object owner to define SAS (account or service sas) definitions. 
    - The SAS value (created using SAS definition) is returned as a secret via /secrets route.  



### Naming

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.  
 
SAS definition name must be 1-102 characters in length containing only 0-9, a-z, A-Z. 

### Storage keys behavior


### Storage keys defaults

### Recommended Developer Practices 

1. Keys must not be managed out of band. 
2. Keys must not be managed by more than one vault object. 
3. If it’s required to manually regenerate keys, then it’s recommended to regenerate keys via Key vault. 
4. Don’t manually regenerate both the keys in a short period of time. Ensure all applications are migrated to the newer key before regenerating the other key. 
5. Application must re-retrieve SAS before it expires for continued access to storage. 6. Validity period of SAS token must be less than regeneration period of the key. A key is valid for two times the regeneration period unless it’s regenerated forcefully (manually). Hence, SAS token having validity period of less than regeneration period must never become invalid before its expiration time unless key was regenerated forcefully (manually).


## See also


