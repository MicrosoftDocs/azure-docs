---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 09/15/2020
ms.author: rogarana
ms.custom: "include file"
---

NFS is supported in all regions where Premium Files Storage is available.

We are continuously adding regions. For the most upto date list get the list of supported regions using the following PowerShell.

You can also check (Azure Products available by region)[https://azure.microsoft.com/en-us/global-infrastructure/services/?products=storage&regions=all] page and look for your region availability for Premium Files Storage.

```azurepowershell-interactive
# Log in first with Connect-AzAccount if not using Cloud Shell

$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}
$subscription = $azContext.Subscription.Id

# Invoke the REST API
$restUri = 'https://management.azure.com/subscriptions/$subscription/providers/Microsoft.Storage/skus?api-version=2019-06-01'
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader

Write-Host "All regions that support NFS Zonal redundancy"
$response.value| Where-Object -FilterScript {($_.name -EQ 'Premium_ZRS') -and ($_.kind -eq 'FileStorage') -and ($_.capabilities.name -contains 'supportsNfsShare')}| Select-Object locations

Write-Host "All regions that support NFS Local redundancy"
$response.value| Where-Object -FilterScript {($_.name -EQ 'Premium_LRS') -and ($_.kind -eq 'FileStorage') -and ($_.capabilities.name -contains 'supportsNfsShare')}| Select-Object locations
```

Replace `{subscriptionId}` in the `$restUri` variable to get information about your subscription.

Sample response
```
All regions that support NFS ZRS
locations
---------
{eastus}
{eastus2}
{westeurope}
{southeastasia}
{japaneast}
{northeurope}
{australiaeast}
{westus2}
{uksouth}
{eastus2euap}
{francecentral}

All regions that support NFS LRS
locations
---------
{eastus}
{eastus2}
{eastus2(stage)}
{westus}
{westeurope}
{eastasia}
{southeastasia}
{japaneast}
{japanwest}
{northcentralus}
{southcentralus}
{centralus}
{northeurope}
{brazilsouth}
{australiaeast}
{australiasoutheast}
{centralindia}
{westindia}
{canadaeast}
{canadacentral}
{westus2}
{westcentralus}
{uksouth}
{ukwest}
{koreacentral}
{koreasouth}
{eastus2euap}
{centraluseuap}
{francecentral}
{uaenorth}
{switzerlandnorth}
{switzerlandwest}
{germanywestcentral}
```
