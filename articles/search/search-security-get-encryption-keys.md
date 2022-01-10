---
title: Find encryption key information
titleSuffix: Azure Cognitive Search
description: Retrieve the encryption key name and version used in an index or synonym map so that you can manage the key in Azure Key Vault.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/21/2021 
ms.custom: devx-track-azurepowershell
---

# Find encrypted objects and information

In Azure Cognitive Search, customer-managed encryption keys are created, stored, and managed in Azure Key Vault. If you need to determine whether an object is encrypted, or what key name or version was used in Azure Key Vault, use the REST API or an Azure SDK to retrieve the **encryptionKey** property from the object definition in your search service.

Objects that are not encrypted with a customer-managed key will have an empty **encryptionKey** property. Otherwise, you might see a definition similar to the following example.

```json
"encryptionKey": {
"keyVaultUri": "https://demokeyvault.vault.azure.net",
"keyVaultKeyName": "myEncryptionKey",
"keyVaultKeyVersion": "eaab6a663d59439ebb95ce2fe7d5f660",
"accessCredentials": {
    "applicationId": "00000000-0000-0000-0000-000000000000",
    "applicationSecret": "myApplicationSecret"
    }
}
```

The **encryptionKey** construct is the same for all encrypted objects. It's a first-level property, on the same level as the object name and description.

## Get the admin API key

Before you can retrieve object definitions from a search service, you will need to provide an admin API key. Admin API keys are required on requests that query for object definitions and metadata. The easiest way to get the admin API key is through the portal.

1. Sign in to the [Azure portal](https://portal.azure.com/) and open the search service overview page.

1. On the left side, click **Keys** and copy an admin API. An admin key is required for index and synonym map retrieval.

For the remaining steps, switch to PowerShell and the REST API. The portal does not show encryption key information for any object.

## Retrieve object properties

Use PowerShell and REST to run the following commands to set up the variables and get object definitions. 

Alternatively, you can also use the Azure SDKs for [.NET](/dotnet/api/azure.search.documents.indexes.searchindexclient.getindexes), [Python](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient), [JavaScript](/javascript/api/@azure/search-documents/searchindexclient), and [Java](/java/api/com.azure.search.documents.indexes.searchindexclient.getindex).

```powershell
<# Connect to Azure #>
$Connect-AzAccount

<# Provide the admin API key used for search service authentication  #>
$headers = @{
'api-key' = '<YOUR-ADMIN-API-KEY>'
'Content-Type' = 'application/json'
'Accept' = 'application/json' }

<# List all existing synonym maps #>
$uri= 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/synonyms?api-version=2020-06-30&$select=name'
Invoke-RestMethod -Uri $uri -Headers $headers | ConvertTo-Json

<# List all existing indexes #>
$uri= 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes?api-version=2020-06-30&$select=name'
Invoke-RestMethod -Uri $uri -Headers $headers | ConvertTo-Json

<# Return a specific synonym map definition. The encryptionKey property is at the end #>
$uri= 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/synonyms/<YOUR-SYNONYM-MAP-NAME>?api-version=2020-06-30'
Invoke-RestMethod -Uri $uri -Headers $headers | ConvertTo-Json

<# Return a specific index definition. The encryptionKey property is at the end #>
$uri= 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/<YOUR-INDEX-NAME>?api-version=2020-06-30'
Invoke-RestMethod -Uri $uri -Headers $headers | ConvertTo-Json
```

## Next steps

We recommend that you [enable logging](../key-vault/general/logging.md) on Azure Key Vault so that you can monitor key usage.

For more information about using Azure Key or configuring customer managed encryption:

+ [Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell](../key-vault/secrets/quick-create-powershell.md)

+ [Configure customer-managed keys for data encryption in Azure Cognitive Search](search-security-manage-encryption-keys.md)
