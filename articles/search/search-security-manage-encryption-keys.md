---
title: Manage encryption keys in Azure Search 
description: Introduction to index\synonym-map encryption with customer managed keys in Azure Search.
author: NatiNimni
manager: jlembicz
ms.author: natinimn
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.custom: 
---
# Manage encryption keys in Azure Search

By default, Azure Search encrypts user data (in the context of an index or synonym-map) at rest with keys managed internally by Microsoft, see [Security and data privacy in Azure Search](search-security-overview.md) to learn more. 
This document describes how to encrypt an index\synonym-map at rest using a key stored in your Azure Key Vault.
For a more general overview of index creation, please see [Create a basic index in Azure Search](search-what-is-an-index.md).

Azure Search service encryption is integrated with Azure Key Vault, so that you can use a key vault to manage your encryption keys. You can create your own encryption keys and store them in a key vault, or you can use Azure Key Vault's APIs to generate encryption keys. With Azure Key Vault, you can manage and control your keys and also audit your key usage. To learn more about Azure Key Vault, see [Azure Key Vault Overview](https://docs.microsoft.com/azure/key-vault/key-vault-overview).

>[!Note]
> **Feature availability**: Encryption with customer-managed keys is a preview feature that is not available for free services. For paid services, it is only available for search services created on or after 2019-01-01, using the latest preview api-version (api-version=2019-05-06-Preview). There is no Azure portal support at this time.

## Get started with customer-managed keys
To create an Azure search index or synonym-map that is encrypted with a customer-managed key, you can either create a new Azure Key vault and key or use an existing key vault and key. Notice that different indexes\synonym-maps in the same search service may use different keys from different Key vaults, or may not be encrypted using customer managed keys at all, if not required.  

>[!Note] 
> Encryption with customer managed keys is configured at the index or synonym-map level, and not on the search service level. This means a single search service can host multiple encrypted indexes\synonym-maps, each encrypted potentially using a different customer managed key, alongside indexes\synonym-maps that are not encrypted using customer managed keys   

### Prerequisites
1. Create a search service if you don't have one already. For more information, see [Create an Azure Search service](search-create-service-portal.md)
2. Create a new Azure Key vault or find an existing vault under your subscription. For more information, see [Create a new Azure Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal#create-a-vault).
3. Enable **Soft Delete** and **Purge Protection** in the selected Key vault by executing the following PowerShell or Azure CLI commands:   

```powershell
$resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "<vault_name>").ResourceId

$resource.Properties | Add-Member -MemberType NoteProperty -Name "enableSoftDelete" -Value 'true'

$resource.Properties | Add-Member -MemberType NoteProperty -Name "enablePurgeProtection" -Value 'true'

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

```azurecli-interactive
az keyvault update -n <vault_name> -g <resource_group> --enable-soft-delete --enable-purge-protection
```

>[!Note]
> Due to the very nature of the encryption with customer managed keys feature, Azure Search will not be able to retrieve your data if your Azure Key vault key is deleted. To prevent data loss caused by accidental Key vault key deletions, it is highly recommended to enabling Soft Delete and Purge Protection on the selected key vault. Learn more about [Azure Key Vault soft-delete](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).   

4. Create a new key in your Azure Key Vault to be used with your Azure Search index\synonym-map encryption or select an existing key.

#### Creating a new Azure Key vault key
1. Sign in to [Azure portal](https://portal.azure.com), navigate to the key vault dashboard
2. Select the **Keys** setting from the left navigation pane, and click on the **+ General/Import** button
3. In the **Create a key** pane, from the list of **Options**, choose the method that you want to use to create a key. You can **Generate** a new key, **Upload** an existing key, or use **Restore Backup** to select a backup of a key
4. Enter a **Name** for your key, and optionally select other key properties 
5. Click on the **Create** button to start the deployment

Make a note of the Key Identifier – this is composed from the **key value Uri**, the **key name**, and the **key version**. We will need these to define an encrypted index in Azure Search
 
![Create a new key vault key](./media/search-manage-encryption-keys/create-new-key-vault-key.png "Create a new key vault key")

## Recommended workflow

### Step 1: Assign an identity to your search service
Assigning an identity to your search service enables you to grant Key Vault access permissions to your search service. Your search service will use its identity to authenticate with Azure Key vault.
Azure Search supports two ways for assigning identity, using a managed system-assigned identity (MSI), or an externally managed Azure Active Directory application. 

#### Enable managed system assigned identity (MSI) for your service
This is the simplest way of assigning an identity to your search service, and should be used in most scenarios.
In general, a managed system assigned identity enables your search service to authenticate to Azure Key Vault without storing credentials in code. The lifecycle of this type of managed identity is tied to the lifecycle of your search service, which can only have one system assigned managed identity. [Learn more about Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

To enable identity in the portal, sign in to [Azure portal](https://portal.azure.com) and open your service dashboard. Click on the **Identity** setting in the left navigation pane, change its status to **On** and Save.
![Enable system assigned identity](./media/search-enable-msi/enable-identity-portal.png "Enable system assigned identity")

#### Advanced: Use an externally managed Azure Active Directory application
In some topologies using a managed system assigned identity is not possible, for example:
* When it's not possible to directly grant your search service access permissions to the Key vault. e.g. if the search service is in a different AD tenant than the Azure Key vault
* When a single search service is required to host multiple encrypted indexes\synonym-maps, each using a different key from a different Key vault, where each key vault must use **a different identity** for authentication. If using a different identities to manage different Key vaults is not a requirement, consider using the managed system identity option above.  

To accommodate such topologies, Azure search supports using Azure Active Directory (AAD) applications for authentication between your search service and Key Vault.    
To create an AAD application in the portal:
1. Create a new application [Create an Azure Active Directory application](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
2. Make a note of the **application ID** and **authentication key** [Get application ID and authentication key](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-application-id-and-authentication-key) as those will be required for creating an encrypted index.

>[!Note]
> When deciding to use an AAD application of authentication instead of using a system assigned identity, consider the fact that Azure search is not authorized to manage your AAD application on your behalf, and it is up to you to manage your AAD application, like periodically rotating the application authentication key.
> When changing an AAD application or its authentication key, any Azure search index or synonym-map that uses that application must first be updated to use the new application ID\key, **before** deleting the previous application or its authorization key, and before revoking your Key Vault access to it.
> Failing to do so will render the index\synonym-map unusable, at it won't be able to decrypt the index\synonym-map data once key access is lost.   

### Step 2: Grant your Azure Search service access to the Azure key vault
To enable your search service to use your Key vault key, you'll need to grant your search service certain access permissions.
> These access permissions could be revoked at any given time. Once revoked, any search service index or synonym-map that uses that key vault will become unusable. Restoring Key vault access permissions at a later time will restore index\synonym-map access.
[Learn more about Azure Key Vault secure access](https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault).

To grant access permissions in the portal:
1. Sign in to [Azure portal](https://portal.azure.com) and open your key vault overview page. Select the **Access policies** setting from the left navigation pane, and click **+Add new**
![Add new key vault access policy](./media/search-manage-encryption-keys/add-new-key-vault-access-policy.png "Add new key vault access policy")

2. Click **Select principal** and select your Azure Search service. You can search it by name or by the object ID that was displayed after enabling MSI
![Select key vault access policy principal](./media/search-manage-encryption-keys/select-key-vault-access-policy-principal.png "Select key vault access policy principal")

3. Next, click on **Key permissions** and select *Get*, *Unwrap Key* and *Wrap Key*. You can use the *Azure Data Lake Storage or Azure Storage* template to quickly select the required permissions.
Azure search must be granted with the following access permissions:
* *Get* - allows your search service to retrieve the public parts of your key in a Key Vault
* *Wrap Key* - allows your search service to use your key to protect the internal encryption key
* *Unwrap Key* - allows your search service to use your key to unwrap the internal encryption key
[Learn more about Azure Key Vault key operations](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates#key-operations)

![Select key vault access policy key permissions](./media/search-manage-encryption-keys/select-key-vault-access-policy-key-permissions.png "Select key vault access policy key permissions")

4. Click **OK** and **Save** the access policy changes.

> [!Note]
> An encrypted index\synonym-map in Azure search is configured to use a specific Azure Key vault key with a specific **version**. 
> When changing to a new key or a new version, the Azure search index\synonym-map must be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index\synonym-map unusable, at it won't be able to decrypt the index\synonym-map data once key access is lost.   

### Step 3: Create an index\synonym-map encrypted with your key
Creating an index or synonym-map encrypted with customer managed key is not yet possible using Azure portal. Use Azure Search REST API to create such an index or synonym-map.
Both index and synonym-map supports a new top-level **encryptionKey** property, that is used to specify the details of the Azure Key vault key to be used for encryption.
Using the **key vault Uri**, **key name** and the **key version** of your Key vault key, we can create an **encryptionKey** definition: 
```json
{
  "encryptionKey": {
    "keyVaultUri": "https://demokeyvault.vault.azure.net",
    "keyVaultKeyName": "myEncryptionKey",
    "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660"
  }
}
```
> [!Note] 
> None of these key vault details are considered secret and could be easily retrieved by browsing to the relevant Azure Key vault key page in Azure portal.

If you are using an AAD application for Key Vault authentication instead of using a managed system assigned identity, add the AAD application **access credentials** to your encryption key: 
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

#### Example: defining an index encrypted with your key
The details of creating a new index via the REST API could be found here - [Create Index (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/create-index), where the only difference is specifying the encryption key details as part of the index definition: 
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
You can now send the index creation request, and then start using the index normally.

#### Example: defining a synonym-map encrypted with your key
The details of creating a new synonym-map via the REST API could be found here - [Create Synonym Map (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/create-synonym-map), where the only difference is specifying the encryption key details as part of the synonym-map definition: 
```json
{   
  "name" : "synonymmap1",  
  "format" : "solr",  
  "synonyms" : "United States, United States of America, USA\n
  Washington, Wash. => WA",
  "encryptionKey": {
    "keyVaultUri": "https://demokeyvault.vault.azure.net",
    "keyVaultKeyName": "myEncryptionKey",
    "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660"
  }
}
```
You can now send the synonym-map creation request, and then start using it normally.

>[!Note] 
> While *encryptionKey* cannot be added to existing Azure Search indexes or synonym-maps, it may be updated by providing different values for any of the three key vault details (e.g. updating the key version). 
> When changing to a new Key vault key or a new key version, the Azure search index\synonym-map must first be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index\synonym-map unusable, at it won't be able to decrypt the index\synonym-map data once key access is lost.   
> Restoring Key vault access permissions at a later time will restore index\synonym-map access.
