---
ms.assetid: 
title: Azure Key Vault storage keys
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 05/22/2017
---
# Azure Key Vault storage keys feature overview

>[!NOTE]
>For this preview version of Azure Key Vault only the **storage keys** feature is in preview. Azure Key Vault, as a whole, is a full production service.

## Why use KV storage account keys

### Developer Experience Today 

#### Today 
Developers use following coding practice by using storage account key to get access to storage. 
 
 ```
//create storage account using connection string containing account name and the storage key var storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString")); 
 
var blobClient = storageAccount.CreateCloudBlobClient(); 
 
 ```
 

 
 
#### Tomorrow 

```
//Get sastoken from Key Vault //.... 
 
// Create new storage credentials using the SAS token. var accountSasCredential = new StorageCredentials(sasToken); // Use credentials and the Blob storage endpoint to create a new Blob service client. var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri("https://myaccount.blob.core.windows.net/"), null, null, null); var blobClientWithSas = accountWithSas.CreateCloudBlobClient(); 
 
// If Sas token is about the expire then Get sastoken again from Key Vault //.... 
 
// and update the accountSasCredential accountSasCredential.UpdateSASToken(sasToken); 
 ```
 

## Supporting interfaces

The storage keys feature is initially available through which interfaces ... 

## Scenarios

### Naming

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.  
 
SAS definition name must be 1-102 characters in length containing only 0-9, a-z, A-Z. 

### Storage keys behavior


### Storage keys defaults

### Recommended Developer Practices 

1. Keys must not be managed out of band. 
2. Keys must not be managed by more than one vault object. 
3. If it’s required to manually regenerate keys, then it’s recommended to regenerate keys via Key vault. 
4. Don’t manually regenerate both the keys in a short period of time. Ensure all applications migrate to newer key before regenerating the other key. 
5. Application must re retrieve SAS before it expires for continued access to storage. 6. Validity period of SAS token must be less than regeneration period of the key. A key is valid for two times the regeneration period unless it’s regenerated forcefully (manually). Hence, SAS token having validity period of less than regeneration period must never become invalid before its expiration time unless key was regenerated forcefully (manually).


## See also


