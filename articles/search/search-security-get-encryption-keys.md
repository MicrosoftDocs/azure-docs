---
title: Get encryption key information
titleSuffix: Azure Cognitive Search
description: Retrieve the encryption key name and version used in an index or synonym map so that you can manage the key in Azure Key Vault.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/01/2020
---

# Get customer-managed key information from indexes and synonym maps

In Azure Cognitive Search, customer-managed encryption keys are created, stored, and managed in Azure Key Vault. If you need to determine whether an object is encrypted, or what key name or version was used, use the REST API or an SDK to retrieve the **encryptionKey** property from an index or synonym map definition. 

We recommend that you [enable logging](../key-vault/general/logging.md) on Key Vault so that you can monitor key usage.

## Get the admin API key

To get object definitions from a search service, you will need to authenticate with admin rights. The easiest way to get the admin API key is through the portal.

1. Sign in to the [Azure portal](https://portal.azure.com/) and open the search service overview page.

1. On the left side, click **Keys** and copy an admin API. An admin key is required for index and synonym map retrieval.

For the remaining steps, switch to PowerShell and the REST API. The portal does not show synonym maps, nor the encryption key properties of indexes.

## Use PowerShell and REST

Run the following commands to set up the variables and get object definitions.

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

Now that you know which encryption key and version is used, you can manage the key in Azure Key Vault or check other configuration settings.

+ [Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell](../key-vault/secrets/quick-create-powershell.md)

+ [Configure customer-managed keys for data encryption in Azure Cognitive Search](search-security-manage-encryption-keys.md)