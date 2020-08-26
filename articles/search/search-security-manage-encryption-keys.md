---
title:  Encryption-at-rest using customer-managed keys
titleSuffix: Azure Cognitive Search
description: Supplement server-side encryption over indexes and synonym maps in Azure Cognitive Search using keys that you create and manage in Azure Key Vault.

manager: nitinme
author: NatiNimni
ms.author: natinimn
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/01/2020
ms.custom: references_regions 
---

# Configure customer-managed keys for data encryption in Azure Cognitive Search

Azure Cognitive Search automatically encrypts indexed content at rest with [service-managed keys](../security/fundamentals/encryption-atrest.md#azure-encryption-at-rest-components). If more protection is needed, you can supplement default encryption with an additional encryption layer using keys that you create and manage in Azure Key Vault. This article walks you through the steps of setting up CMK encryption.

CMK encryption is dependent on [Azure Key Vault](../key-vault/general/overview.md). You can create your own encryption keys and store them in a key vault, or you can use Azure Key Vault's APIs to generate encryption keys. With Azure Key Vault, you can also audit key usage if you [enable logging](../key-vault/general/logging.md).  

Encryption with customer-managed keys is applied to individual indexes or synonym maps when those objects are created, and is not specified on the search service level itself. Only new objects can be encrypted. You cannot encrypt content that already exists.

Keys don't all need to be in the same key vault. A single search service can host multiple encrypted indexes or synonym maps, each encrypted with their own customer-managed encryption keys, stored in different key vaults. You can also have indexes and synonym maps in the same service that are not encrypted using customer-managed keys. 

## Double encryption

For services created after August 1, 2020 and in specific regions, the scope of CMK encryption includes temporary disks, achieving [full double encryption](search-security-overview.md#double-encryption), currently available in these regions: 

+ West US 2
+ East US
+ South Central US
+ US Gov Virginia
+ US Gov Arizona

If you are using a different region, or a service created prior to August 1, then your CMK encryption is limited to just the data disk, excluding the temporary disks used by the service.

## Prerequisites

The following services and services are used in this example. 

+ [Create an Azure Cognitive Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices). 

+ [Create an Azure Key Vault resource](../key-vault/secrets/quick-create-portal.md#create-a-vault) or find an existing vault in the same subscription as Azure Cognitive Search. This feature has a same-subscription requirement.

+ [Azure PowerShell](/powershell/azure/) or [Azure CLI](/cli/azure/install-azure-cli) is used for configuration tasks.

+ [Postman](search-get-started-postman.md), [Azure PowerShell](./search-get-started-powershell.md) and [.NET SDK preview](https://aka.ms/search-sdk-preview) can be used to call the REST API that creates indexes and synonym maps that include an encryption key parameter. There is no portal support for adding a key to indexes or synonym maps at this time.

>[!Note]
> Due to the nature of encryption with customer-managed keys, Azure Cognitive Search will not be able to retrieve your data if your Azure Key vault key is deleted. To prevent data loss caused by accidental Key Vault key deletions, soft-delete and purge protection must be enabled on the key vault. Soft-delete is enabled by default, so you will only encounter issues if you purposely disabled it. Purge protection is not enabled by default, but it is required for Azure Cognitive Search CMK encryption. For more information, see [soft-delete](../key-vault/general/soft-delete-overview.md) and [purge protection](../key-vault/general/soft-delete-overview.md#purge-protection) overviews.

## 1 - Enable key recovery

The key vault must have **soft-delete** and **purge protection** enabled. You can set those features using the portal or the following PowerShell or Azure CLI commands.

### Using PowerShell

1. Run `Connect-AzAccount` to  set up your Azure credentials.

1. Run the following command to connect to your key vault, replacing `<vault_name>` with a valid name:

   ```powershell
   $resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "<vault_name>").ResourceId
   ```

1. Azure Key Vault is created with soft-delete enabled. If it's disabled on your vault, run  the following command:

   ```powershell
   $resource.Properties | Add-Member -MemberType NoteProperty -Name "enableSoftDelete" -Value 'true'
   ```

1. Enable purge protection:

   ```powershell
   $resource.Properties | Add-Member -MemberType NoteProperty -Name "enablePurgeProtection" -Value 'true'
   ```

1. Save your updates:

   ```powershell
   Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
   ```

### Using Azure CLI

```azurecli-interactive
az keyvault update -n <vault_name> -g <resource_group> --enable-soft-delete --enable-purge-protection
```

## 2 - Create a new key

If you are using an existing key to encrypt Azure Cognitive Search content, skip this step.

1. [Sign in to Azure portal](https://portal.azure.com) and open your key vault overview page.

1. Select the **Keys** setting from the left navigation pane, and click **+ Generate/Import**.

1. In the **Create a key** pane, from the list of **Options**, choose the method that you want to use to create a key. You can **Generate** a new key, **Upload** an existing key, or use **Restore Backup** to select a backup of a key.

1. Enter a **Name** for your key, and optionally select other key properties.

1. Click on the **Create** button to start the deployment.

Make a note of the Key Identifier – this is composed from the **key value Uri**, the **key name**, and the **key version**. You will need these to define an encrypted index in Azure Cognitive Search.
 
![Create a new key vault key](./media/search-manage-encryption-keys/create-new-key-vault-key.png "Create a new key vault key")

## 3 - Create a service identity

Assigning an identity to your search service enables you to grant Key Vault access permissions to your search service. Your search service will use its identity to authenticate with Azure Key vault.

Azure Cognitive Search supports two ways for assigning identity: a managed identity or an externally-managed Azure Active Directory application. 

If possible, use a managed identity. It is the simplest way of assigning an identity to your search service and should work in most scenarios. If you are using multiple keys for indexes and synonym maps, or if your solution is in a distributed architecture that disqualifies identity-based authentication, use the advanced [externally-managed Azure Active Directory approach](#aad-app) described at the end of this article.

 In general, a managed identity enables your search service to authenticate to Azure Key Vault without storing credentials in code. The lifecycle of this type of managed identity is tied to the lifecycle of your search service, which can only have one managed identity. [Learn more about Managed identities](../active-directory/managed-identities-azure-resources/overview.md).

1. [Sign in to Azure portal](https://portal.azure.com) and open your search service overview page. 

1. Click **Identity** in the left navigation pane, change its status to **On**, and click **Save**.

![Enable a managed identity](./media/search-enable-msi/enable-identity-portal.png "Enable a manged identity")

## 4 - Grant key access permissions

To enable your search service to use your Key Vault key, you'll need to grant your search service certain access permissions.

Access permissions could be revoked at any given time. Once revoked, any search service index or synonym map that uses that key vault will become unusable. Restoring Key vault access permissions at a later time will restore index\synonym map access. For more information, see [Secure access to a key vault](../key-vault/general/secure-your-key-vault.md).

1. [Sign in to Azure portal](https://portal.azure.com) and open your key vault overview page. 

1. Select the **Access policies** setting from the left navigation pane, and click **+ Add new**.

   ![Add new key vault access policy](./media/search-manage-encryption-keys/add-new-key-vault-access-policy.png "Add new key vault access policy")

1. Click **Select principal** and select your Azure Cognitive Search service. You can search for it by name or by the object ID that was displayed after enabling managed identity.

   ![Select key vault access policy principal](./media/search-manage-encryption-keys/select-key-vault-access-policy-principal.png "Select key vault access policy principal")

1. Click on **Key permissions** and select *Get*, *Unwrap Key* and *Wrap Key*. You can use the *Azure Data Lake Storage or Azure Storage* template to quickly select the required permissions.

   Azure Cognitive Search must be granted with the following [access permissions](../key-vault/keys/about-keys.md#key-operations):

   * *Get* - allows your search service to retrieve the public parts of your key in a Key Vault
   * *Wrap Key* - allows your search service to use your key to protect the internal encryption key
   * *Unwrap Key* - allows your search service to use your key to unwrap the internal encryption key

   ![Select key vault access policy key permissions](./media/search-manage-encryption-keys/select-key-vault-access-policy-key-permissions.png "Select key vault access policy key permissions")

1. For **Secret Permissions**, select *Get*.

1. For **Certificate Permissions**, select *Get*.

1. Click **OK** and **Save** the access policy changes.

> [!Important]
> Encrypted content in Azure Cognitive Search is configured to use a specific Azure Key Vault key with a specific **version**. If you change the key or version, the index or synonym map must be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index or synonym map unusable, at you won't be able to decrypt the content once key access is lost.   

## 5 - Encrypt content

To add a customer-managed key on an index or synonym map, you must use the [Search REST API](/rest/api/searchservice/) or an SDK. The portal does not expose synonym maps or encryption properties. When you use a valid API, both indexes and synonym maps support a top-level **encryptionKey** property.. 

Using the **key vault Uri**, **key name** and the **key version** of your Key vault key, create an **encryptionKey** definition as follows:

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
> None of these key vault details are considered secret and could be easily retrieved by browsing to the relevant Azure Key Vault key page in Azure portal.

If you are using an AAD application for Key Vault authentication instead of using a managed identity, add the AAD application **access credentials** to your encryption key: 
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

## Example: Index encryption
The details of creating a new index via the REST API could be found at [Create Index (Azure Cognitive Search REST API)](/rest/api/searchservice/create-index), where the only difference here is specifying the encryption key details as part of the index definition: 

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

## Example: Synonym map encryption

The details of creating a new synonym map via the REST API can be found at [Create Synonym Map (Azure Cognitive Search REST API)](/rest/api/searchservice/create-synonym-map), where the only difference here is specifying the encryption key details as part of the synonym map definition: 

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
You can now send the synonym map creation request, and then start using it normally.

>[!Important] 
> While **encryptionKey** cannot be added to existing Azure Cognitive Search indexes or synonym maps, it may be updated by providing different values for any of the three key vault details (for example, updating the key version). 
> When changing to a new Key Vault key or a new key version, any Azure Cognitive Search index or synonym map that uses the key must first be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index or synonym map unusable, as it won't be able to decrypt the content once key access is lost.   
> Restoring Key vault access permissions at a later time will restore content access.

## <a name="aad-app"></a> Advanced: Use an externally managed Azure Active Directory application

When a managed identity is not possible, you can create an Azure Active Directory application with a security principal for your Azure Cognitive Search service. Specifically, a managed identity is not viable under these conditions:

* You cannot directly grant your search service access permissions to the Key vault (for example, if the search service is in a different Active Directory tenant than the Azure Key Vault).

* A single search service is required to host multiple encrypted indexes\synonym maps, each using a different key from a different Key vault, where each key vault must use **a different identity** for authentication. If using a different identity to manage different Key vaults is not a requirement, consider using the managed identity option above.  

To accommodate such topologies, Azure Cognitive Search supports using Azure Active Directory (AAD) applications for authentication between your search service and Key Vault.    
To create an AAD application in the portal:

1. [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md).

1. [Get the application ID and authentication key](../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in) as those will be required for creating an encrypted index. Values you will need to provide include **application ID** and **authentication key**.

>[!Important]
> When deciding to use an AAD application of authentication instead of a managed identity, consider the fact that Azure Cognitive Search is not authorized to manage your AAD application on your behalf, and it is up to you to manage your AAD application, such as periodic rotation of the application authentication key.
> When changing an AAD application or its authentication key, any Azure Cognitive Search index or synonym map that uses that application must first be updated to use the new application ID\key **before** deleting the previous application or its authorization key, and before revoking your Key Vault access to it.
> Failing to do so will render the index or synonym map unusable, as it won't be able to decrypt the content once key access is lost.

## Work with encrypted content

With CMK encryption, you will notice latency for both indexing and queries due to the extra encrypt/decrypt work. Azure Cognitive Search does not log encryption activity, but you can monitor key access through key vault logging. We recommend that you [enable logging](../key-vault/general/logging.md) as part of key vault set up.

Key rotation is expected to occur over time. Whenever you rotate keys, it's important to follow this sequence:

1. [Determine the key used by an index or synonym map](search-security-get-encryption-keys.md).
1. [Create a new key in key vault](../key-vault/keys/quick-create-portal.md), but leave the original key available.
1. [Update the encryptionKey properties](/rest/api/searchservice/update-index) on an index or synonym map to use the new values. Only objects that were originally created with this property can be updated to use a different value.
1. Disable or delete the previous key in the key vault. Monitor key access to verify the new key is being used.

For performance reasons, the search service caches the key for up to several hours. If you disable or delete the key without providing a new one, queries will continue to work on a temporary basis until the cache expires. However, once the search service cannot decrypt content, you will get this message: "Access forbidden. The query key used might have been revoked - please retry." 

## Next steps

If you are unfamiliar with Azure security architecture, review the [Azure Security documentation](../security/index.yml), and in particular, this article:

> [!div class="nextstepaction"]
> [Data encryption-at-rest](../security/fundamentals/encryption-atrest.md)