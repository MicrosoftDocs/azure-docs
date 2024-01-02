---
title:  Encrypt data using customer-managed keys
titleSuffix: Azure AI Search
description: Supplement server-side encryption in Azure AI Search using customer managed keys (CMK) or bring your own keys (BYOK) that you create and manage in Azure Key Vault.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/20/2023
ms.custom:
  - references_regions
  - ignite-2023
---

# Configure customer-managed keys for data encryption in Azure AI Search

Azure AI Search automatically encrypts data at rest with [service-managed keys](../security/fundamentals/encryption-atrest.md#azure-encryption-at-rest-components). If more protection is needed, you can supplement default encryption with another encryption layer using keys that you create and manage in Azure Key Vault. 

This article walks you through the steps of setting up customer-managed key (CMK) or "bring-your-own-key" (BYOK) encryption. Here are some points to keep in mind:

+ CMK encryption is enacted on individual objects. If you require CMK across your search service, [set an enforcement policy](#encryption-enforcement-policy).

+ CMK encryption depends on [Azure Key Vault](../key-vault/general/overview.md). You can create your own encryption keys and store them in a key vault, or you can use Azure Key Vault APIs to generate encryption keys.

+ CMK encryption becomes operational when an object is created. You can't encrypt objects that already exist. CMK encryption occurs whenever an object is saved to disk, either data at rest for long-term storage or temporary data for short-term storage. With CMK, the disk never sees unencrypted data.

> [!NOTE]
> If an index is CMK encrypted, it is only accessible if the search service has access the key. If access to the key is revoked, the index is unusable and the service cannot be scaled until the index is deleted or access to the key is restored.

## CMK encrypted objects

Objects that can be encrypted include indexes, synonym lists, indexers, data sources, and skillsets. Encryption is computationally expensive to decrypt so only sensitive content is encrypted.

Encryption is performed over the following content:

+ All content within indexes and synonym lists, including descriptions.

+ For indexers, data sources, and skillsets, only those fields that store connection strings, descriptions, keys, and user inputs are encrypted. For example, skillsets have Azure AI services keys, and some skills accept user inputs, such as custom entities. In both cases, keys and user inputs into skills are encrypted.

## Full double encryption

When you introduce CMK encryption, you're encrypting content twice. For the objects and fields noted in the previous section, content is first encrypted with your CMK, and secondly with the Microsoft-managed key. Content is doubly encrypted on data disks for long-term storage, and on temporary disks used for short-term storage.

Enabling CMK encryption will increase index size and degrade query performance. Based on observations to date, you can expect to see an increase of 30-60 percent in query times, although actual performance will vary depending on the index definition and types of queries. Because of the negative performance impact, we recommend that you only enable this feature on indexes that really require it.

Although double encryption is now available in all regions, support was rolled out in two phases:

+ The first rollout was on August 1, 2020 and included the five regions listed below. Search services created in the following regions supported CMK for data disks, but not temporary disks:

  + West US 2
  + East US
  + South Central US
  + US Gov Virginia
  + US Gov Arizona

+ The second rollout on May 13, 2021 added encryption for temporary disks and extended CMK encryption to [all supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=search#select-product).

  If you're using CMK from a service created during the first rollout and you also want CMK encryption over temporary disks, you'll need to create a new search service in your region of choice and redeploy your content.

## Prerequisites

The following tools and services are used in this scenario.

+ [Azure AI Search](search-create-service-portal.md) on a [billable tier](search-sku-tier.md#tier-descriptions) (Basic or above, in any region).

+ [Azure Key Vault](../key-vault/general/overview.md), you can [create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md), [Azure CLI](../key-vault//general/quick-create-cli.md), or [Azure PowerShell](../key-vault//general/quick-create-powershell.md). Create the resource in the same subscription as Azure AI Search. The key vault must have **soft-delete** and **purge protection** enabled.

+ [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md). If you don't have one, [set up a new tenant](../active-directory/develop/quickstart-create-new-tenant.md).

You should have a search client that can create the encrypted object. Into this code, you'll reference a key vault key and Active Directory registration information. This code could be a working app, or prototype code such as the [C# code sample DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK).

> [!TIP]
> You can use [Postman](search-get-started-rest.md) or [Azure PowerShell](search-get-started-powershell.md) to call REST APIs that create indexes and synonym maps that include an encryption key parameter. You can also use Azure SDKs. Portal support for adding a key to indexes or synonym maps isn't supported.

## Key Vault tips

If you're new to Azure Key Vault, review this quickstart to learn about basic tasks: [Set and retrieve a secret from Azure Key Vault using PowerShell](../key-vault/secrets/quick-create-powershell.md). Here are some tips for using Key Vault:

+ Use as many key vaults as you need. Managed keys can be in different key vaults. A search service can have multiple encrypted objects, each one encrypted with a different customer-managed encryption key, stored in different key vaults.

+ [Enable logging](../key-vault/general/logging.md) on Key Vault so that you can monitor key usage.

+ Remember to follow strict procedures during routine rotation of key vault keys and Active Directory application secrets and registration. Always update all [encrypted content](search-security-get-encryption-keys.md) to use new secrets and keys before deleting the old ones. If you miss this step, your content can't be decrypted.

## 1 - Enable purge protection

As a first step, make sure [soft-delete](../key-vault/general/soft-delete-overview.md) and [purge protection](../key-vault/general/soft-delete-overview.md#purge-protection) are enabled on the key vault. Due to the nature of encryption with customer-managed keys, no one can retrieve your data if your Azure Key Vault key is deleted. 

To prevent data loss caused by accidental Key Vault key deletions, soft-delete and purge protection must be enabled on the key vault. Soft-delete is enabled by default, so you'll only encounter issues if you purposely disabled it. Purge protection isn't enabled by default, but it's required for customer-managed key encryption in Azure AI Search. 

You can set both properties using the portal, PowerShell, or Azure CLI commands.

### [**Azure portal**](#tab/portal-pp)

1. Sign in to the [Azure portal](https://portal.azure.com) and open your key vault overview page.

1. On the **Overview** page under **Essentials**, enable **Soft-delete** and **Purge protection**.

### [**Using PowerShell**](#tab/ps-pp)

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

### [**Using Azure CLI**](#tab/cli-pp)

+ If you have an [installation of Azure CLI](/cli/azure/install-azure-cli), you can run the following command to enable the required properties.

   ```azurecli-interactive
   az keyvault update -n <vault_name> -g <resource_group> --enable-soft-delete --enable-purge-protection
   ```

---

## 2 - Create a key in Key Vault

Skip key generation if you already have a key in Azure Key Vault that you want to use, but collect the key identifier. You'll need this information when creating an encrypted object.

1. Sign in to the [Azure portal](https://portal.azure.com) and open your key vault overview page.

1. Select **Keys** on the left, and then select **+ Generate/Import**.

1. In the **Create a key** pane, from the list of **Options**, choose the method that you want to use to create a key. You can **Generate** a new key, **Upload** an existing key, or use **Restore Backup** to select a backup of a key.

1. Enter a **Name** for your key, and optionally select other key properties.

1. Select **Create** to start the deployment.

1. Select the key, select the current version, and then make a note of the key identifier. It's composed of the **key value Uri**, the **key name**, and the **key version**. You'll need the identifier to define an encrypted index in Azure AI Search.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-key-identifier.png" alt-text="Create a new key vault key" border="true":::

## 3 - Create a security principal

You have several options for accessing the encryption key at run time. The simplest approach is to retrieve the key using the managed identity and permissions of your search service. You can use either a system or user-managed identity. Doing so allows you to omit the steps for application registration and application secrets, and simplifies the encryption key definition.

Alternatively, you can create and register a Microsoft Entra application. The search service will provide the application ID on requests.

A managed identity enables your search service to authenticate to Azure Key Vault without storing credentials (ApplicationID or ApplicationSecret) in code. The lifecycle of this type of managed identity is tied to the lifecycle of your search service, which can only have one managed identity. For more information about how managed identities work, see [What are managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

### [**System-managed identity**](#tab/managed-id-sys)

1. Make your search service a trusted service.

   ![Turn on system assigned managed identity](./media/search-managed-identities/turn-on-system-assigned-identity.png "Turn on system assigned managed identity")

Conditions that will prevent you from adopting this approach include:

+ You can't directly grant your search service access permissions to the key vault (for example, if the search service is in a different Active Directory tenant than the Azure Key Vault).

+ A single search service is required to host multiple encrypted indexes or synonym maps, each using a different key from a different key vault, where each key vault must use **a different identity** for authentication. Because a search service can only have one managed identity, a requirement for multiple identities will disqualify the simplified approach for your scenario.  

### [**User-managed identity (preview)**](#tab/managed-id-user)

> [!IMPORTANT] 
> User-managed identity support is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> 2021-04-01-Preview of the [Management REST API](/rest/api/searchmanagement/) provides this feature.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **+ Create a new resource**.

1. In the "Search services and marketplace" search bar, search for "User Assigned Managed Identity" and then select **Create**.

1. Give the identity a descriptive name.

1. Next, assign the user-managed identity to the search service. This can be done using the [2021-04-01-preview](/rest/api/searchmanagement/management-api-versions) management API.

    The identity property takes a type and one or more fully qualified user-assigned identities:
    
    * **type** is the type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an identity created by the system and a set of user assigned identities. The type 'None' will remove all identities from the service.
    * **userAssignedIdentities** includes the details of the user-managed identity.
        * User-managed identity format: 
            * /subscriptions/**subscription ID**/resourcegroups/**resource group name**/providers/Microsoft.ManagedIdentity/userAssignedIdentities/**managed identity name**
    
    Example of how to assign a user-managed identity to a search service:
    
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

1. Use a simplified construction of the "encryptionKey" that omits the Active Directory properties and add an identity property. Make sure to use the 2021-04-01-preview REST API version.

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

### [**Register an app**](#tab/register-app)

1. In the [Azure portal](https://portal.azure.com), find the Microsoft Entra resource for your subscription.

1. On the left, under **Manage**, select **App registrations**, and then select **New registration**.

1. Give the registration a name, perhaps a name that is similar to the search application name. Select **Register**.

1. Once the app registration is created, copy the Application ID. You'll need to provide this string to your application. 

   If you're stepping through the [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK), paste this value into the **appsettings.json** file.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-application-id.png" alt-text="Application ID in the Essentials section":::

1. Next, select **Certificates & secrets** on the left.

1. Select **New client secret**. Give the secret a display name and select **Add**.

1. Copy the application secret. If you're stepping through the sample, paste this value into the **appsettings.json** file.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-application-secret.png" alt-text="Application secret":::

---

## 4 - Grant permissions

In this step, you'll create an access policy in Key Vault. This policy gives the application you registered with Active Directory permission to use your customer-managed key.

Access permissions could be revoked at any given time. Once revoked, any search service index or synonym map that uses that key vault will become unusable. Restoring key vault access permissions at a later time will restore index\synonym map access. For more information, see [Secure access to a key vault](../key-vault/general/security-features.md).

1. Still in the Azure portal, open your key vault **Overview** page. 

1. Select the **Access policies** on the left, and select **+ Create** to start the **Create an access policy** wizard.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-add-access-policy.png" alt-text="Create an access policy." border="true":::

1. On the **Permissions** page, select *Get* for **Key permissions**, **Secret permissions**, and **Certificate Permissions**. Select *Unwrap Key* and *Wrap Key* for ** cryptographic operations on the key.

   :::image type="content" source="media/search-manage-encryption-keys/cmk-access-policy-permissions.png" alt-text="Select permissions in the Permissions page." border="true":::

1. Select **Next**.

1. On the **Principle** page, find and select the security principal used by the search service to access the encryption key. This will either be the system-managed or user-managed identity of the search service, or the registered application.

1. Select **Next** and **Create**.

> [!Important]
> Encrypted content in Azure AI Search is configured to use a specific Azure Key Vault key with a specific **version**. If you change the key or version, the index or synonym map must be updated to use it **before** you delete the previous one. 
> Failing to do so will render the index or synonym map unusable. You won't be able to decrypt the content if the key is lost.

<a name="encrypt-content"></a>

## 5 - Encrypt content

Encryption keys are added when you create an object. To add a customer-managed key on an index, synonym map, indexer, data source, or skillset, use the [Search REST API](/rest/api/searchservice/) or an Azure SDK to create an object that has encryption enabled. The portal doesn't allow encryption properties on object creation. 

1. Call the Create APIs to specify the **encryptionKey** property:

   + [Create Index](/rest/api/searchservice/create-index)
   + [Create Synonym Map](/rest/api/searchservice/create-synonym-map)
   + [Create Indexer](/rest/api/searchservice/create-indexer)
   + [Create Data Source](/rest/api/searchservice/create-data-source)
   + [Create Skillset](/rest/api/searchservice/create-skillset).

1. Insert the encryptionKey construct into the object definition. This property is a first-level property, on the same level as name and description. The following [REST examples](#rest-examples) show property placement. If you're using the same vault, key, and version, you can paste in the same "encryptionKey" construct into each object definition.

   The first example shows an "encryptionKey" for a search service that connects using a managed identity:

    ```json
    {
      "encryptionKey": {
        "keyVaultUri": "https://demokeyvault.vault.azure.net",
        "keyVaultKeyName": "myEncryptionKey",
        "keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660"
      }
    }
    ```

    The second example includes "accessCredentials", necessary if you registered an application in Microsoft Entra ID:

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
> None of these key vault details are considered secret and could be easily retrieved by browsing to the relevant Azure Key Vault page in Azure portal.

<a name="encryption-enforcement-policy"></a>

## 6 - Set up policy

Azure policies help to enforce organizational standards and to assess compliance at-scale. Azure AI Search has an optional [built-in policy for service-wide CMK enforcement](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F76a56461-9dc0-40f0-82f5-2453283afa2f).

In this section, you'll set the policy that defines a CMK standard for your search service. Then, you'll set up your search service to enforce this policy.

1. Navigate to the [built-in policy](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F76a56461-9dc0-40f0-82f5-2453283afa2f) in your web browser. Select **Assign**

   :::image type="content" source="media/search-security-manage-encryption-keys/assign-policy.png" alt-text="Screenshot of assigning built-in CMK policy." border="true":::

1. Set up the [policy scope](../governance/policy/concepts/scope.md). In the **Parameters** section, uncheck **Only show parameters...** and set **Effect** to [**Deny**](../governance/policy/concepts/effects.md#deny). 

   During evaluation of the request, a request that matches a deny policy definition is marked as non-compliant. Assuming the standard for your service is CMK encryption, "deny" means that requests that *don't* specify CMK encryption are non-compliant.

   :::image type="content" source="media/search-security-manage-encryption-keys/effect-deny.png" alt-text="Screenshot of changing built-in CMK policy effect to deny." border="true":::

1. Finish creating the policy.

1. Call the [Services - Update API](/rest/api/searchmanagement/services/update) to enable CMK policy enforcement at the service level.

```http
PATCH https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2022-11-01

{
    "properties": {
        "encryptionWithCmk": {
            "enforcement": "Enabled",
            "encryptionComplianceStatus": "Compliant"
        }
    }
}
```

## REST examples

This section shows the JSON for several objects so that you can see where to locate "encryptionKey" in an object definition.

### Index encryption

The details of creating a new index via the REST API could be found at [Create Index (REST API)](/rest/api/searchservice/create-index), where the only difference is specifying the encryption key details as part of the index definition:

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

Create an encrypted synonym map using the [Create Synonym Map Azure AI Search REST API](/rest/api/searchservice/create-synonym-map). Use the "encryptionKey" property to specify which encryption key to use.

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

Create an encrypted data source using the [Create Data Source (REST API)](/rest/api/searchservice/create-data-source). Use the "encryptionKey" property to specify which encryption key to use.

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

Create an encrypted skillset using the [Create Skillset REST API](/rest/api/searchservice/create-skillset). Use the "encryptionKey" property to specify which encryption key to use.

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

Create an encrypted indexer using the [Create Indexer REST API](/rest/api/searchservice/create-indexer). Use the "encryptionKey" property to specify which encryption key to use.

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
> While "encryptionKey" can't be added to existing search indexes or synonym maps, it may be updated by providing different values for any of the three key vault details (for example, updating the key version). 
> When changing to a new Key Vault key or a new key version, any search index or synonym map that uses the key must first be updated to use the new key\version **before** deleting the previous key\version. 
> Failing to do so will render the index or synonym map unusable, as it won't be able to decrypt the content once key access is lost. Although restoring key vault access permissions at a later time will restore content access.

## Work with encrypted content

With customer-managed key encryption, you'll notice latency for both indexing and queries due to the extra encrypt/decrypt work. Azure AI Search doesn't log encryption activity, but you can monitor key access through key vault logging. We recommend that you [enable logging](../key-vault/general/logging.md) as part of key vault configuration.

Key rotation is expected to occur over time. Whenever you rotate keys, it's important to follow this sequence:

1. [Determine the key used by an index or synonym map](search-security-get-encryption-keys.md).
1. [Create a new key in key vault](../key-vault/keys/quick-create-portal.md), but leave the original key available.
1. [Update the encryptionKey properties](/rest/api/searchservice/update-index) on an index or synonym map to use the new values. Only objects that were originally created with this property can be updated to use a different value.
1. Disable or delete the previous key in the key vault. Monitor key access to verify the new key is being used.

For performance reasons, the search service caches the key for up to several hours. If you disable or delete the key without providing a new one, queries will continue to work on a temporary basis until the cache expires. However, once the search service can no longer decrypt content, you'll get this message: "Access forbidden. The query key used might have been revoked - please retry." 

## Next steps

If you're unfamiliar with Azure security architecture, review the [Azure Security documentation](../security/index.yml), and in particular, this article:

> [!div class="nextstepaction"]
> [Data encryption-at-rest](../security/fundamentals/encryption-atrest.md)
