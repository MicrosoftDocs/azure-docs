---
title: List of Azure regions that support geo-zone-redundant storage (GZRS)
titleSuffix: Azure Storage
description: List of Azure regions that support geo-zone-redundant storage (GZRS)
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: reference
ms.date: 03/24/2023
ms.author: jammart
ms.subservice: common 
ms.custom: engagement-fy23, references_regions
---

# Azure regions that support geo-zone-redundant storage (GZRS)

This article lists the regions that support geo-zone-redundant storage (GZRS). For a list of regions that support zone-redundant storage (ZRS), see [Azure regions that support zone-redundant storage (ZRS)](redundancy-regions-zrs.md).

## Region list

[!INCLUDE [storage-redundancy-standard-zrs](../../../includes/storage-redundancy-standard-gzrs.md)]

## How to produce your own list

Run a PowerShell script similar to the sample below to produce a current list of regions where GZRS is supported for your own subscription:

```powershell
# Log in first with Connect-AzAccount if not using Cloud Shell
Connect-AzAccount

# Setup the authentication header
$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

# Provide a specific subscription id if you want a list for a different subscription
$subscription = $azContext.Subscription.Id

# Invoke the REST API to get all supported SKUs
$restUri = "https://management.azure.com/subscriptions/$subscription/providers/Microsoft.Storage/skus?api-version=2022-09-01"
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader

# Specify your selection criteria
$redundancy = "*gzrs*"      # Specify a mask to match one or more of the following:
                            #   Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS
                            #   (Reference: https://learn.microsoft.com/en-us/rest/api/storagerp/skus/list?tabs=HTTP#skuname) 

$kind       = "storagev2"   # Specify a mask to match one or more of the following:
                            #   Storage, StorageV2, BlobStorage, BlockBlobStorage, FileStorage
                            #   (Reference: https://learn.microsoft.com/en-us/rest/api/storagerp/skus/list?tabs=HTTP#kind)

$tier       = "standard"    # Specify a mask to match one or more of the following:
                            #   Premium, Standard
                            #   (Reference: https://learn.microsoft.com/en-us/rest/api/storagerp/skus/list?tabs=HTTP#skutier)

# Get the list of regions that support the specified redundancy, account kind, and performance tier
$regions    = $response.value `
    | Where-Object -FilterScript {($_.name -ilike "$redundancy") -and ($_.kind -ilike $kind) -and ($_.tier -ilike $tier)} `
    | Select-Object -ExpandProperty locations

# Get and display the GeographyGroup, DisplayName, Location, and PairedRegion for the list of supported regions
get-azlocation `
    | Where-Object {$_.Location -in $regions} `
    | sort GeographyGroup,DisplayName `
    | Select-Object GeographyGroup, DisplayName, Location -expandproperty PairedRegion `
    | ft -property @{N='Geography Group';E={$_.GeographyGroup}},@{N='Region Display Name';E={$_.DisplayName}},@{N='Region';E={$_.Location}},@{N='Paired Region';E={$_.Name}}
```

## See also

- [Azure regions that support zone-redundant (ZRS) storage](redundancy-regions-zrs.md)
- [Azure Storage redundancy](storage-redundancy.md)
