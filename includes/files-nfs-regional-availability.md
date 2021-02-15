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

NFS is supported in **ALL** 35+ regions where Premium Files Storage is available.

We are continuously adding regions. For the most upto date list get the list of supported regions query the [Skus List REST API](https://docs.microsoft.com/en-us/rest/api/storagerp/skus/list). Sample below provides a way to query the list of regions via PowerShell.

You can also check [Azure Products available by region page](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=storage&regions=all) and look for your region availability for Premium Files Storage.

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

# Provide specific subscription id if you want  list for a different subscription
$subscription = $azContext.Subscription.Id

# Invoke the REST API
$restUri = "https://management.azure.com/subscriptions/$subscription/providers/Microsoft.Storage/skus?api-version=2019-06-01"
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader

# Uncomment the below commands to get list of all regions that has NFS support.
# $response.value| Where-Object -FilterScript {($_.kind -eq 'FileStorage') -and ($_.capabilities.name -contains 'supportsNfsShare')}| Select-Object name, locations

# List of regions that support NFS Zonal redundancy.
$response.value| Where-Object -FilterScript {($_.name -EQ 'Premium_ZRS') -and ($_.kind -eq 'FileStorage') -and ($_.capabilities.name -contains 'supportsNfsShare')}| Select-Object name locations
```

Sample response
```
List of regions that support NFS Zonal redundancy
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

```
