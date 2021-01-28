---
title: Migrate to Azure Firewall Premium Preview
description: Learn how migrate from Azure Firewall Standard to Azure Firewall Premium Preview.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 01/28/2021
ms.author: victorh
---

# Migrate to Azure Firewall Premium Preview

You can migrate Azure Firewall Standard to Azure Firewall Premium Preview to take advantage of the new Premium capabilities. For more information about Azure Firewall Premium Preview, see [What is Azure Firewall Premium Preview?](premium-overview.md).

Currently, you can migrate using Azure PowerShell, or the Azure portal.

## Migrate using Azure PowerShell

`Transform-Policy.ps1` is an Azure PowerShell script that creates a new Premium policy from an existing Standard policy.

Given a standard firewall policy id, the script transforms it to a Premium Azure Firewall policy. The script first connects to your Azure account, pulls the policy, transforms/adds various parameters, and then uploads a new Premium policy. The new premium policy is named `<previous_policy_name>_premium`.

Usage example:

`Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name`

```azurepowershell
<#
    .SYNOPSIS
        Given an Azure firewall policy id the script will transform it to a Premium Azure firewall policy. 
        The script will first connect to your Azure account, pull the policy, transform/add various parameters and then upload a new premium policy. 
        The created policy will be named <previous_policy_name>_premium .  
    .Example
        Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name
#>
[CmdletBinding()]
param (
    #Resource id of the azure firewall policy. 
    [Parameter(Mandatory=$true)]
    [string]
    $PolicyId
)
$ErrorActionPreference = "Stop"
$script:PolicyId = $PolicyId

$API_VERSION = "2020-06-01"
$BASE_URI = "https://management.azure.com"

function Connect-Azure {
    Connect-AzAccount

    if(-not (Get-Module Az.Accounts)) {
        Import-Module Az.Accounts
    }
    $azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
    if(-not $azProfile.Accounts.Count) {
        Write-Error "Ensure you have logged in before calling this function."    
    }
    
    $currentAzureContext = Get-AzContext
    $profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
    $token = $profileClient.AcquireAccessToken($currentAzureContext.Subscription.TenantId) 
    $script:headers = @{ 
        "Authorization" = ("Bearer {0}" -f $token.AccessToken);
        "Content-Type" = "application/json";
    }   
}

function Get-AzureResource {
    [CmdletBinding()]
    param (
        [Parameter()]
        [string]
        $BaseUri=$BASE_URI,
        [Parameter(Mandatory=$true)]
        [string]
        $ResourceId,
        [Parameter()]
        [string]
        $ApiVersion=$API_VERSION
    )

    return Invoke-RestMethod -Method Get "$($BaseUri)/$($ResourceId)?api-version=$($ApiVersion)" -Headers $script:headers
}

function Put-Resource { 
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Body,
        [Parameter(Mandatory=$true)]
        [string]
        $ResourceId,
        [Parameter()]
        [string]
        $ApiVersion = $API_VERSION
    )   

    $jsonBody = $Body | ConvertTo-Json -Depth 10
    Write-Host "Sending Body: $($jsonBody)" -ForegroundColor Green

    $response = Invoke-RestMethod -Method Put -Uri "$($BASE_URI)/$($ResourceId)?api-version=$($ApiVersion)" -Body $jsonBody -Headers $script:headers 
    Write-Host $response
}

function Validate-Policy {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Policy
    )
    if ($null -eq $Policy) {
        Write-Error "Recived null policy"
        exit(1)
    }
    if ($Policy.type -ne "Microsoft.Network/firewallPolicies") {
        Write-Host "Resource must be of type Microsoft.Network/firewallPolicies" -ForegroundColor Red
        exit(1)
    }
}

function Transform-Rules {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Policy
    )

    foreach ($ruleCollection in $Policy.properties.ruleCollectionGroups) {
        
        $group = Get-AzureResource -ResourceId $ruleCollection.id
        $group.PSObject.Properties.Remove('etag')
        $splited_id = $group.id.Split('/')
        $splited_id[8] = $Policy.name
        $group.id = $splited_id -join '/'
        Put-Resource -Body $group -ResourceId $group.id
    }
}

function Transform-Policy {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Policy
    )

    $suffix = "_premium"

    $Policy.name = "$($Policy.Name)$($suffix)"
    $Policy.id = "$($PolicyId)$($suffix)"
    Add-Member -InputObject $Policy.properties -Name "sku" -Value ("{'tier': 'Premium'}" | ConvertFrom-Json) -MemberType NoteProperty
    $Policy.properties.PSObject.Properties.Remove("provisioningState")
    $Policy.PSObject.Properties.Remove("etag")

    if (Get-Member -InputObject $Policy -Name "identity" -MemberType Properties) {
        if (Get-Member -InputObject $Policy.identity -Name "userAssignedIdentities" -MemberType Properties) {
            $key = $Policy.identity.userAssignedIdentities | Get-Member -MemberType NoteProperty | Select-Object Name
            $Policy.identity.userAssignedIdentities.PsObject.Properties.Remove($key.Name)
            Add-Member -InputObject $Policy.identity.userAssignedIdentities -Name $key.Name -Value @{} -MemberType NoteProperty  
        }
    }

    Put-Resource -Body $Policy -ResourceId $Policy.id
    Transform-Rules -Policy $Policy   
}


Connect-Azure
$policy = Get-AzureResource -ResourceId $script:PolicyId
Validate-Policy -Policy $policy
Transform-Policy -Policy $policy

```

## Migrate using the Azure portal


## Next steps

- [Learn about Azure Firewall](overview.md)