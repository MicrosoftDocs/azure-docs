---
title:  Encrypt data using customer-managed keys
titleSuffix: Azure Cognitive Search
description: Supplement server-side encryption over indexes and synonym maps in Azure Cognitive Search using keys that you create and manage in Azure Key Vault.

manager: nitinme
author: NatiNimni
ms.author: natinimn
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/02/2021
ms.custom: references_regions, devx-track-azurepowershell 
---

# Configure customer-managed keys for data encryption in Azure Cognitive Search

Azure Cognitive Search automatically encrypts content with [service-managed keys](../security/fundamentals/encryption-atrest.md#azure-encryption-at-rest-components). If more protection is needed, you can supplement default encryption with an additional encryption layer using keys that you create and manage in Azure Key Vault. Objects that can be encrypted include indexes, synonym lists, indexers, data sources, and skillsets.

This article walks you through the steps of setting up customer-managed key encryption. Here are some points to keep in mind:

+ Customer-managed key encryption depends on [Azure Key Vault](../key-vault/general/overview.md). You can create your own encryption keys and store them in a key vault, or you can use Azure Key Vault's APIs to generate encryption keys.

+ Encryption with customer-managed keys is enabled when objects are created, on a per object basis. You cannot encrypt content that already exists.

Encryption is computationally expensive to decrypt so only sensitive content is encrypted. This includes all content within indexes and synonym lists. For indexers, data sources, and skillsets, only those fields that store connection strings, descriptions, keys, and user inputs are encrypted. For example, skillsets have Cognitive Services keys, and some skills accept user inputs, such as custom entities. Keys and user inputs into skills are encrypted.

## Double encryption

Double encryption is an extension of customer-managed key (CMK) encryption. CMK encryption applies to long-term storage that is written to a data disk. The term *double encryption* refers to the additional encryption of short-term storage (of content written to temporary disks). There is no configuration required. When you apply CMK to objects, double encryption is invoked automatically.

Although double encryption is available in all regions, support was rolled out in two phases. The first roll out was in August 2020 and included the five regions listed below. The second roll out in May 2021 extended double encryption to all remaining regions. If you are using CMK on an older service and want double encryption, you will need to create a new search service in your region of choice.

| Region | Service creation date |
|--------|-----------------------|
| West US 2 | After August 1, 2020 |
| East US | After August 1, 2020 |
| South Central US  | After August 1, 2020 |
| US Gov Virginia  | After August 1, 2020 |
| US Gov Arizona  | After August 1, 2020 |
| [All other supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=search#select-product) | After May 13, 2021 |

## Prerequisites

The following tools and services are used in this scenario.

+ [Azure Cognitive Search](search-create-service-portal.md) on a [billable tier](search-sku-tier.md#tier-descriptions) (Basic or above, in any region).
+ [Azure Key Vault](../key-vault/general/overview.md), you can create key vault using [Azure portal](../key-vault//general/quick-create-portal.md), [Azure CLI](../key-vault//general/quick-create-cli.md), or [Azure PowerShell](../key-vault//general/quick-create-powershell.md). in the same subscription as Azure Cognitive Search. The key vault must have **soft-delete** and **purge protection** enabled.
+ [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md). If you don't have one, [set up a new tenant](../active-directory/develop/quickstart-create-new-tenant.md).

You should have a search application that can create the encrypted object. Into this code, you'll reference a key vault key and Active Directory registration information. This code could be a working app, or prototype code such as the [C# code sample DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK).

> [!TIP]
> You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or [Azure PowerShell](search-get-started-powershell.md), to call REST APIs that create indexes and synonym maps that include an encryption key parameter. You can also use Azure SDKs. Portal support for adding a key to indexes or synonym maps is not supported.

## Key Vault tips

If you are new to Azure Key Vault, review this quickstart to learn about basic tasks: [Set and retrieve a secret from Azure Key Vault using PowerShell](../key-vault/secrets/quick-create-powershell.md). Here are some tips for using Key Vault:

+ Use as many key vaults as you need. Managed keys can be in different key vaults. A search service can have multiple encrypted objects, each one encrypted with a different customer-managed encryption keys, stored in different key vaults.

+ [Enable logging](../key-vault/general/logging.md) on Key Vault so that you can monitor key usage.

+ Remember to follow strict procedures during routine rotation of key vault keys and Active Directory application secrets and registration. Always update all [encrypted content](search-security-get-encryption-keys.md) to use new secrets and keys before deleting the old ones. If you miss this step, your content cannot be decrypted.

## 1 - Enable purge protection

As a first step, make sure [soft-delete](../key-vault/general/soft-delete-overview.md) and [purge protection](../key-vault/general/soft-delete-overview.md#purge-protection) are enabled on the key vault. Due to the nature of encryption with customer-managed keys, no one can retrieve your data if your Azure Key vault key is deleted. 

To prevent data loss caused by accidental Key Vault key deletions, soft-delete and purge protection must be enabled on the key vault. Soft-delete is enabled by default, so you will only encounter issues if you purposely disabled it. Purge protection is not enabled by default, but it is required for customer-managed key encryption in Cognitive Search. 

You can set both properties using the portal, PowerShell, or Azure CLI commands.

### Using Azure portal

1. [Sign in to Azure portal](https://portal.azure.com) and open your key vault overview page.

1. On the **Overview** page under **Essentials**, enable **Soft-delete** and **Purge protection**.

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

+ If you have an [installation of Azure CLI](/cli/azure/install-azure-cli), you can run the following command to enable the required properties.

   ```azurecli-interactive
   az keyvault update -n <vault_name> -g <resource_group> --enable-soft-delete --enable-purge-protection
   ```

## 2 - Create a key in Key Vault

Skip key generation if you already have a key in Azure Key Vault that you want to use, but collect the Key Identifier. You will need this information when creating an encrypted object.

1. [Sign in to Azure portal](https://portal.azure.com) and open your key vault overview page.

1. Select **Keys** on the left, and then select **+ Generate/Import**.

1. In the **Create a key** pane, from the list of **Options**, choose the method that you want to use to create a key. You can **Generate** a new key, **Upload** an existing key, or use **Restore Backup** to select a backup of a key.

1. Enter a **Name** for your key, and optionally select other key properties.

1. Select **Create** to start the deployment.

1. Make a note of the Key Identifier – it's composed of the **key value Uri**, the **key name**, and the **key version**. You will need the identifier to define an encrypted index in Azure Cognitive Search.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-key-identifier.png" alt-text="Create a new key vault key":::

## 3 - Register an app

1. In [Azure portal](https://portal.azure.com), find the Azure Active Directory resource for your subscription.

1. On the left, under **Manage**, select **App registrations**, and then select **New registration**.

1. Give the registration a name, perhaps a name that is similar to the search application name. Select **Register**.

1. Once the app registration is created, copy the Application ID. You will need to provide this string to your application. 

   If you are stepping through the [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK), paste this value into the **appsettings.json** file.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-application-id.png" alt-text="Application ID in the Essentials section":::

1. Next, select **Certificates & secrets** on the left.

1. Select **New client secret**. Give the secret a display name and select **Add**.

1. Copy the application secret. If you are stepping through the sample, paste this value into the **appsettings.json** file.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-application-secret.png" alt-text="Application secret":::

## 4 - Grant permissions

In this step, you will create an access policy in Key Vault. This policy gives the application you registered with Active Directory permission to use your customer-managed key.

Access permissions could be revoked at any given time. Once revoked, any search service index or synonym map that uses that key vault will become unusable. Restoring Key vault access permissions at a later time will restore index\synonym map access. For more information, see [Secure access to a key vault](../key-vault/general/security-features.md).

1. Still in the Azure portal, open your key vault **Overview** page. 

1. Select the **Access policies** on the left, and select **+ Add Access Policy**.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-add-access-policy.png" alt-text="Add new key vault access policy":::

1. Choose **Select principal** and select the application you registered with Active Directory. You can search for it by name.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-access-policy-permissions.png" alt-text="Select key vault access policy principal":::

1. In **Key permissions**, choose *Get*, *Unwrap Key* and *Wrap Key*.

1. In **Secret Permissions**, select *Get*.

1. In **Certificate Permissions**, select *Get*.

1. Select **Add** and then **Save**.

> [!Important]
> Encrypted content in Azure Cognitive Search is configured to use a specific Azure Key Vault key with a specific **version**. If you change the key or version, the index or synonym map must be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index or synonym map unusable, at you won't be able to decrypt the content once key access is lost.

<a name="encrypt-content"></a>

## 5 - Encrypt content

To add a customer-managed key on an index, synonym map, indexer, data source, or skillset, use the [Search REST API](/rest/api/searchservice/) or an Azure SDK to create an object that has encryption enabled. The portal does not expose synonym maps or encryption properties. 

1. Call the Create APIs to specify the **encryptionKey** property:

   + [Create Index](/rest/api/searchservice/create-index)
   + [Create Synonym Map](/rest/api/searchservice/create-synonym-map)
   + [Create Indexer](/rest/api/searchservice/create-indexer)
   + [Create Data Source](/rest/api/searchservice/create-data-source)
   + [Create Skillset](/rest/api/searchservice/create-skillset).

1. Insert the encryptionKey construct into the object definition. This property is a first-level property, on the same level as name and description. The [examples below](#rest-examples) show property placement. If you are using the same key vault, key, and version, you can paste in the same encryptionKey construct into each object for which you are enabling encryption.

   The following JSON example shows an encryptionKey, with placeholder values for Azure Key Vault and application registration in Azure Active Directory:

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

Once you create the encrypted object on the search service, you can use it as you would any other object of its type. Encryption is transparent to the user and developer.

> [!Note]
> None of these key vault details are considered secret and could be easily retrieved by browsing to the relevant Azure Key Vault key page in Azure portal.

## REST examples

This section shows the JSON for several objects so that you can see where to locate `encryptionKey` in an object definition.

### Index encryption

The details of creating a new index via the REST API could be found at [Create Index (REST API)](/rest/api/searchservice/create-index), where the only difference here is specifying the encryption key details as part of the index definition:

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
  {"name": "Location", "type": "Edm.GeographyPoint", "filterable": true, "sortable": true}
 ],
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

You can now send the index creation request, and then start using the index normally.

### Synonym map encryption

Create an encrypted synonym map using the [Create Synonym Map Azure Cognitive Search REST API](/rest/api/searchservice/create-synonym-map). Use the `encryptionKey` property to specify which encryption key to use.

```json
{
  "name" : "synonymmap1",
  "format" : "solr",
  "synonyms" : "United States, United States of America, USA\n
  Washington, Wash. => WA",
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

You can now send the synonym map creation request, and then start using it normally.

### Data source encryption

Create an encrypted data source using the [Create Data Source (REST API)](/rest/api/searchservice/create-data-source). Use the `encryptionKey` property to specify which encryption key to use.

```json
{
  "name" : "datasource1",
  "type" : "azureblob",
  "credentials" :
  { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=datasource;AccountKey=accountkey;EndpointSuffix=core.windows.net"
  },
  "container" : { "name" : "containername" },
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

You can now send the data source creation request, and then start using it normally.

### Skillset encryption

Create an encrypted skillset using the [Create Skillset REST API](/rest/api/searchservice/create-skillset). Use the `encryptionKey` property to specify which encryption key to use.

```json
{
    "name": "skillset1",
    "skills":  [ omitted for brevity ],
    "cognitiveServices": { omitted for brevity },
      "knowledgeStore":  { omitted for brevity  },
    "encryptionKey": (optional) { 
        "keyVaultKeyName": "myEncryptionKey",
        "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660",
        "keyVaultUri": "https://demokeyvault.vault.azure.net",
        "accessCredentials": {
            "applicationId": "00000000-0000-0000-0000-000000000000",
            "applicationSecret": "myApplicationSecret"}
    }
}
```

You can now send the skillset creation request, and then start using it normally.

### Indexer encryption

Create an encrypted indexer using the [Create Indexer REST API](/rest/api/searchservice/create-indexer). Use the `encryptionKey` property to specify which encryption key to use.

```json
{
  "name": "indexer1",
  "dataSourceName": "datasource1",
  "skillsetName": "skillset1",
  "parameters": {
      "configuration": {
          "imageAction": "generateNormalizedImages"
      }
  },
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

You can now send the indexer creation request, and then start using it normally.

>[!Important]
> While `encryptionKey` cannot be added to existing search indexes or synonym maps, it may be updated by providing different values for any of the three key vault details (for example, updating the key version). 
> When changing to a new Key Vault key or a new key version, any search index or synonym map that uses the key must first be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index or synonym map unusable, as it won't be able to decrypt the content once key access is lost. Although restoring Key vault access permissions at a later time will restore content access.

## Simpler alternative: Trusted service

Depending on tenant configuration and authentication requirements, you might be able to implement a simpler approach for accessing a key vault key. Instead of creating and using an Active Directory application, you can either make a search service a trusted service by enabling a system-managed identity for it or assign a user-assigned managed identity to your search service. You would then either use the trusted search service or user-assigned managed identity as a security principle, rather than an AD-registered application, to access the key vault key.

Both of these approaches allow you to omit the steps for application registration and application secrets, and simplifies the encryption key definition.

### System-assigned managed identity

In general, a managed identity enables your search service to authenticate to Azure Key Vault without storing credentials (ApplicationID or ApplicationSecret) in code. The lifecycle of this type of managed identity is tied to the lifecycle of your search service, which can only have one managed identity. For more information about how managed identities work, see [What are managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

1. Make your search service a trusted service.
   ![Turn on system assigned managed identity](./media/search-managed-identities/turn-on-system-assigned-identity.png "Turn on system assigned managed identity")

1. When setting up an access policy in Azure Key Vault, choose the trusted search service as the principle (instead of the AD-registered application). Assign the same permissions (multiple GETs, WRAP, UNWRAP) as instructed in the grant access key permissions step.

1. Use a simplified construction of the `encryptionKey` that omits the Active Directory properties.

    ```json
    {
      "encryptionKey": {
        "keyVaultUri": "https://demokeyvault.vault.azure.net",
        "keyVaultKeyName": "myEncryptionKey",
        "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660"
      }
    }
    ```

Conditions that will prevent you from adopting this simplified approach include:

+ You cannot directly grant your search service access permissions to the Key vault (for example, if the search service is in a different Active Directory tenant than the Azure Key Vault).

+ A single search service is required to host multiple encrypted indexes\synonym maps, each using a different key from a different Key vault, where each key vault must use **a different identity** for authentication. Because a search service can only have one managed identity, a requirement for multiple identities will disqualify the simplified approach for your scenario.  

### User-assigned managed identity (preview)

> [!IMPORTANT] 
> User-assigned managed identity support is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> The REST API version 2021-04-30-Preview and [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) provide this feature.

Assigning a user-assigned managed identity to your search service will enable your search service to authenticate to Azure Key Vault without storing credentials (ApplicationID or ApplicationSecret) in code. The lifecycle of this type of managed identity is independent to the lifecycle of your search service. For more information about how managed identities work, see [What are managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

1. If you don't already have a user-assigned managed identity created, you'll need to create one. To create a user-assigned managed identity follow the below steps:

    1. Sign into the [Azure portal](https://portal.azure.com/).
    1. Select **+ Create a new resource**.
    1. In the "Search services and marketplace" search bar, search for "User Assigned Managed Identity" and then select **Create**.
    1. Give the identity a descriptive name.

1. Next, assign the user-assigned managed identity to the search service. This can be done using the [2021-04-01-preview](/rest/api/searchmanagement/management-api-versions) management API.

    The identity property takes a type and one or more fully-qualified user-assigned identities:
    
    * **type** is the type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an identity created by the system and a set of user assigned identities. The type 'None' will remove all identities from the service.
    * **userAssignedIdentities** includes the details of the user assigned managed identity.
        * User-assigned managed identity format: 
            * /subscriptions/**subscription ID**/resourcegroups/**resource group name**/providers/Microsoft.ManagedIdentity/userAssignedIdentities/**managed identity name**
    
    Example of how to assign a user-assigned managed identity to a search service:
    
    ```http
    PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Search/searchServices/[search service name]?api-version=2021-04-01-preview
    Content-Type: application/json

    {
      "location": "[region]",
      "sku": {
        "name": "[sku]"
      },
      "properties": {
        "replicaCount": [replica count],
        "partitionCount": [partition count],
        "hostingMode": "default"
      },
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[managed identity name]": {}
        }
      }
    } 
    ```

1. When setting up an access policy in Azure Key Vault, choose the user-assigned managed identity as the principle (instead of the AD-registered application). Assign the same permissions (multiple GETs, WRAP, UNWRAP) as instructed in the grant access key permissions step.

1. Use a simplified construction of the `encryptionKey` that omits the Active Directory properties and add an identity property. Make sure to use the 2021-04-30-preview REST API version.

    ```json
    {
      "encryptionKey": {
        "keyVaultUri": "https://[key vault name].vault.azure.net",
        "keyVaultKeyName": "[key vault key name]",
        "keyVaultKeyVersion": "[key vault key version]",
        "identity" : { 
            "@odata.type": "#Microsoft.Azure.Search.DataUserAssignedIdentity",
            "userAssignedIdentity" : "/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[managed identity name]"
        }
      }
    }
    ```

## Work with encrypted content

With customer-managed key encryption, you will notice latency for both indexing and queries due to the extra encrypt/decrypt work. Azure Cognitive Search does not log encryption activity, but you can monitor key access through key vault logging. We recommend that you [enable logging](../key-vault/general/logging.md) as part of key vault configuration.

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
