---
title: List of Azure regions that support zone-redundant storage (ZRS)
titleSuffix: Azure Storage
description: List of Azure regions that support zone-redundant storage (ZRS)
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: reference
ms.date: 04/27/2023
ms.author: jammart
ms.subservice: common 
ms.custom: engagement-fy23, references_regions
---

# Azure regions that support zone-redundant storage (ZRS)

This article lists the regions that support zone-redundant storage (ZRS). For a list of regions that support geo-zone-redundant storage (GZRS), see [Azure regions that support geo-zone-redundant storage (GZRS)](redundancy-regions-gzrs.md).

## Standard storage accounts

[!INCLUDE [storage-redundancy-standard-zrs](../../../includes/storage-redundancy-standard-zrs.md)]

To produce a current list of regions where ZRS is supported for standard storage accounts for your own subscription, run a PowerShell script similar to the sample below:

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
$redundancy = "*_zrs"       # Specify a mask to match one or more of the following:
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

The output should look similar to the following sample. Your results may vary depending on the regions and sovereign or government clouds you have access to:

```
Geography Group Region Display Name  Region             Paired Region     
--------------- -------------------  ------             -------------     
Africa          South Africa North   southafricanorth   southafricawest   
Asia Pacific    Australia East       australiaeast      australiasoutheast
Asia Pacific    Central India        centralindia       southindia        
Asia Pacific    East Asia            eastasia           southeastasia     
Asia Pacific    Japan East           japaneast          japanwest         
Asia Pacific    Korea Central        koreacentral       koreasouth        
Asia Pacific    Southeast Asia       southeastasia      eastasia          
Canada          Canada Central       canadacentral      canadaeast        
Europe          France Central       francecentral      francesouth       
Europe          Germany West Central germanywestcentral germanynorth      
Europe          North Europe         northeurope        westeurope        
Europe          Norway East          norwayeast         norwaywest        
Europe          Sweden Central       swedencentral      swedensouth       
Europe          Switzerland North    switzerlandnorth   switzerlandwest   
Europe          UK South             uksouth            ukwest            
Europe          West Europe          westeurope         northeurope       
Middle East     UAE North            uaenorth           uaecentral        
South America   Brazil South         brazilsouth        southcentralus    
US              Central US           centralus          eastus2           
US              East US              eastus             westus            
US              East US 2            eastus2            centralus         
US              South Central US     southcentralus     northcentralus    
US              West US 2            westus2            westcentralus     
US              West US 3            westus3            eastus  
```

## Premium block blob accounts

[!INCLUDE [storage-redundancy-standard-zrs](../../../includes/storage-redundancy-premium-block-blob-zrs.md)]

To produce a list of regions where ZRS is supported for premium block blob accounts for your own subscription, run a PowerShell script similar to the sample below :

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
$redundancy = "*_zrs"       # Specify a mask to match one or more of the following:
                            #   Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS
                            #   (Reference: https://learn.microsoft.com/en-us/rest/api/storagerp/skus/list?tabs=HTTP#skuname) 

$kind       = "*blockblob*" # Specify a mask to match one or more of the following:
                            #   Storage, StorageV2, BlobStorage, BlockBlobStorage, FileStorage
                            #   (Reference: https://learn.microsoft.com/en-us/rest/api/storagerp/skus/list?tabs=HTTP#kind)

$tier       = "premium"     # Specify a mask to match one or more of the following:
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

The output should look similar to the following sample. Your results may vary depending on the regions and sovereign or government clouds you have access to:

```
Geography Group Region Display Name Region         Paired Region     
--------------- ------------------- ------         -------------     
Asia Pacific    Australia East      australiaeast  australiasoutheast
Asia Pacific    East Asia           eastasia       southeastasia 
Asia Pacific    Japan East          japaneast      japanwest         
Asia Pacific    Korea Central       koreacentral   koreasouth        
Asia Pacific    Southeast Asia      southeastasia  eastasia          
Europe          France Central      francecentral  francesouth       
Europe          North Europe        northeurope    westeurope        
Europe          UK South            uksouth        ukwest            
Europe          West Europe         westeurope     northeurope       
South America   Brazil South        brazilsouth    southcentralus    
US              East US             eastus         westus            
US              East US 2           eastus2        centralus         
US              South Central US    southcentralus northcentralus    
US              West US 2           westus2        westcentralus    
```

## See also

- [Azure regions that support geo-zone-redundant (GZRS) storage](redundancy-regions-gzrs.md)
- [Azure Storage redundancy](storage-redundancy.md)
