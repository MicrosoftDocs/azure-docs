---
title: Manage index encryption keys in Azure Search 
description: Introduction to index encryption with customer managed keys in Azure Search.
author: NatiNimni
manager: jlembicz
ms.author: natinimn
services: search
ms.service: search
ms.topic: conceptual
ms.date: 04/09/2019
ms.custom: 
---
# Quickstart: Manage index encryption keys in Azure Search 

By default, Azure Search encrypts index data at rest with keys managed internally by Microsoft, see [Security and data privacy in Azure Search](search-security-overview.md) to learn more. 
This document describes how to encrypt an index at rest using a key stored in your Azure Key Vault.
For a more general overview of index creation, please see [Create a basic index in Azure Search](search-what-is-an-index.md).

> [!Note]
> Encryption with customer managed keys supported only for paid search service created on or after 01/01/2019

Azure Search service index encryption is integrated with Azure Key Vault, so that you can use a key vault to manage your encryption keys. You can create your own encryption keys and store them in a key vault, or you can use Azure Key Vault's APIs to generate encryption keys. With Azure Key Vault, you can manage and control your keys and also audit your key usage.

## Get started with customer-managed keys
To use customer-managed keys with Azure Search, you can either create a new key vault and key or you can use an existing key vault and key.

## Prerequisites
1. Create a search service if you don't have one already. For more information, see [Create an Azure Search service](search-create-service-portal.md)
2. Create a new Azure Key vault or find an existing vault under your subscription. For more information, see [Create a new Azure Key Vault](https://docs.microsoft.com/en-us/azure/azure-stack/user/azure-stack-key-vault-manage-portal).
3. Create a new key in your Azure Key Vault to be used with your Azure Search index encryption or select an existing key. For more information, see [Create a new key](https://docs.microsoft.com/en-us/azure/azure-stack/user/azure-stack-key-vault-manage-portal).
> Make a note of the Key Identifier – this is composed from the **key value Uri**, the **key name**, and the **key version**. We will need these to define an encrypted index in Azure Search 

## Recommended workflow

### Step 1: Assign identity to your search service
Assigning an Azure Active Directory identity to your search service enables you to grant Key Vault access permissions to your search service. 
Azure Search supports two ways for assigning identity:
1. Enable System Assigned Managed Identity (MSI) for your service (**Recommended**)
2. Use an Azure Active Directory Application for service authentication

#### Enable System Assigned Managed Identity (MSI) for your service
This is the simplest and preferred way of assigning an identity to your search service. 
In general, a system assigned managed identity enables your search service to authenticate to Azure Key Vault without storing credentials in code. The lifecycle of this type of managed identity is tied to the lifecycle of your search service, which can only have one system assigned managed identity. [Learn more about Managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview).

To enable identity in the portal, sign in to [Azure portal](https://portal.azure.com) and open your service dashboard. Click on the **Identity** setting in the left navigation pane, change its status to **On** and Save.
![Enable system assigned identity](media\search-enable-msi/enable-identity-portal.png "Enable system assigned identity")

#### Advanced: Use an Azure Active Directory Application for service authentication
When using a system assigned identity is not possible (for example when the owner of the search service is not the owner of the Azure Key vault), Azure search supports using Azure Active Directory (AAD) application for authentication between your search service and Key Vault.    
To create an AAD application in the portal:
1. Create a new application [Create an Azure Active Directory application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
2. Make a note of the **application Id** and **authentication key** [Get application ID and authentication key](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#get-application-id-and-authentication-key) as those will be required for creating an encrypted index.

>[!Note]
> When deciding to use an AAD application of authentication instead of using a system assigned identity, consider the fact that Azure search is not authorized to manage your AAD application on your behalf, and it is up to you to manage your AAD application, like periodically rotating the application authentication key.
> When changing an AAD application or its authentication key, any Azure search index that uses that application must first be updated to use the new application id\key, **before** deleting the previous application or its authorization key, and before revoking your Key Vault access to it.
> Failing to do so will render the index unusable, at it won't be able to decrypt the index data once key access is lost.   

### Step 2: Grant your Azure Search service access to your Azure key vault
To enable your search service to use your Key vault key, you'll need to grant your search service certain access permissions.
> These access permissions could be revoked at any given time. Once revoked, any search service index that used that key vault will become unusable.
[Learn more about Azure Key Vault secure access](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-secure-your-key-vault).

To grant access permissions in the portal:
1. Sign in to [Azure portal](https://portal.azure.com) and open your key vault overview page. Select the **Access policies** setting from the left navigation pane, and click **+Add new**
![Add new key vault access policy](media\search-index-encryption-cmk/add-new-key-vault-access-policy.png "Add new key vault access policy")

2. Click **Select principal** and select your Azure Search service. You can search it by name or by the object id that was displayed after enabling MSI
![Select key vault access policy principal](media\search-index-encryption-cmk/select-key-vault-access-policy-principal.png "Select key vault access policy principal")

3. Next, click on **Key permissions** and select *Get*, *Unwrap Key* and *Wrap Key*.
Azure search must be granted with the following access permissions:
* *Get* - allows your search service to retrieve the public parts of your key in a Key Vault
* *Wrap Key* - allows your search service to use your key to protect the internal encryption key
* *Unwrap Key* - allows your search service to use your key to unwrap the internal encryption key
[Learn more about Azure Key Vault key operations](https://docs.microsoft.com/en-us/azure/key-vault/about-keys-secrets-and-certificates#key-operations)

![Select key vault access policy key permissions](media\search-index-encryption-cmk/select-key-vault-access-policy-key-permissions.png "Select key vault access policy key permissions")

4. Click **OK** and **Save** the access policy changes.

> [!Note]
> An encrypted index in Azure search is configured to use a specific Azure Key vault key with a specific **version**. 
> When changing to a new key or a new version, the Azure search index must be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index unusable, at it won't be able to decrypt the index data once key access is lost.   

# Step 3: Create an index encrypted with your key
Creating an encrypted index is not yet possible using Azure portal, so we would use Azure Search REST API to create the index.
The details of creating a new index via the REST API could be found here - [Create Index (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/create-index), where the only difference is specifying the encryption key details as part of the index definition, as described below.
Using the **key vault Uri**, **key name** and the **key version** of your Key vault key, we can add the following to the index definition: 

```json
{
 "name": "hotels",  
 "fields": [
  {"name": "HotelId", "type": "Edm.String", "key": true, "filterable": true},
  {"name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": true, "facetable": false},
  {"name": "Description", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "en.lucene"},
  {"name": "Description_fr", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
  {"name": "Category", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true},
  {"name": "Tags", "type": "Collection(Edm.String)", "searchable": true, "filterable": true, "sortable": false, "facetable": true},
  {"name": "ParkingIncluded", "type": "Edm.Boolean", "filterable": true, "sortable": true, "facetable": true},
  {"name": "LastRenovationDate", "type": "Edm.DateTimeOffset", "filterable": true, "sortable": true, "facetable": true},
  {"name": "Rating", "type": "Edm.Double", "filterable": true, "sortable": true, "facetable": true},
  {"name": "Location", "type": "Edm.GeographyPoint", "filterable": true, "sortable": true},
 ],
 "encryptionKey": {
   "keyVaultUri": "https://demokeyvault.vault.azure.net",
   "keyVaultKeyName": "myEncryptionKey",
   "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660"
 }
}
```

If you are using an AAD application for Key Vault authentication instead of using a system assigned identity, add the AAD application access credentials to your encryption key: 
```json
{
  "encryptionKey": {
    "keyVaultUri": "https://demokeyvault.vault.azure.net",
    "keyVaultKeyName": "myEncryptionKey",
    "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660",
    "accessCredentials": {
      "applicationId": "00000000-0000-0000-0000-000000000000",
      "applicationSecret": "myApplicationSecret"
    }
  }
}
```

> Note that none of these key vault details is considered a secret and could be easily retrieved by browsing to the relevant Azure Key vault key page in Azure portal.

We can now send the index creation request, and then start using the index.

>[!Note] 
> While *encryptionKey* cannot be added to existing Azure Search indexes, it may be updated by providing different values for any of the three key vault details (e.g. updating the key version). 
> When changing to a new Key vault key or a new key version, the Azure search index must first be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index unusable, at it won't be able to decrypt the index data once key access is lost.   
