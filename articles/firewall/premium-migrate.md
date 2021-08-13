---
title: Migrate to Azure Firewall Premium
description: Learn how to migrate from Azure Firewall Standard to Azure Firewall Premium.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 07/15/2021
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Migrate to Azure Firewall Premium

You can migrate Azure Firewall Standard to Azure Firewall Premium to take advantage of the new Premium capabilities. For more information about Azure Firewall Premium features, see [Azure Firewall Premium features](premium-features.md).

The following two examples show how to:
- Migrate an existing standard policy using Azure PowerShell
- Migrate an existing standard firewall (with classic rules) to Azure Firewall Premium  with a Premium policy.

## Performance considerations

Performance is a consideration when migrating from the standard SKU. IDPS and TLS inspection are compute intensive operations. The premium SKU uses a more powerful VM SKU which scales to a maximum throughput of 30Gbps comparable with the standard SKU. The 30 Gbps throughput is supported when configured with IDPS in alert mode. Use of IDPS in deny mode and TLS inspection increases CPU consumption. Degradation in max throughput might occur. 

The firewall throughput might be lower than 30 Gbps when you have one or more signatures set to **Alert and Deny** or application rules with **TLS inspection** enabled. Microsoft recommends customers perform full scale testing in their Azure deployment to ensure the firewall service performance meets your expectations.

## Migrate an existing policy using Azure PowerShell

`Transform-Policy.ps1` is an Azure PowerShell script that creates a new Premium policy from an existing Standard policy.

Given a standard firewall policy ID, the script transforms it to a Premium Azure Firewall policy. The script first connects to your Azure account, pulls the policy, transforms/adds various parameters, and then uploads a new Premium policy. The new premium policy is named `<previous_policy_name>_premium`.

Usage example:

`Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name`

> [!IMPORTANT]
> The script doesn't migrate Threat Intelligence settings. You'll need to note those settings before proceeding and migrate them manually.

```azurepowershell
<#
    .SYNOPSIS
        Given an Azure firewall policy id the script will transform it to a Premium Azure firewall policy. 
        The script will first pull the policy, transform/add various parameters and then upload a new premium policy. 
        The created policy will be named <previous_policy_name>_premium if no new name provided else new policy will be named as the parameter passed.  
    .Example
        Transform-Policy -PolicyId /subscriptions/XXXXX-XXXXXX-XXXXX/resourceGroups/some-resource-group/providers/Microsoft.Network/firewallPolicies/policy-name -NewPolicyName <optional param for the new policy name>
#>

param (
    #Resource id of the azure firewall policy. 
    [Parameter(Mandatory=$true)]
    [string]
    $PolicyId,

     #new firewallpolicy name, if not specified will be the previous name with the '_premium' suffix
    [Parameter(Mandatory=$false)]
    [string]
    $NewPolicyName = ""
)
$ErrorActionPreference = "Stop"
$script:PolicyId = $PolicyId
$script:PolicyName = $NewPolicyName

function ValidatePolicy {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Object]
        $Policy
    )

    Write-Host "Validating resource is as expected"

    if ($null -eq $Policy) {
        Write-Error "Recived null policy"
        exit(1)
    }
    if ($Policy.GetType().Name -ne "PSAzureFirewallPolicy") {
        Write-Host "Resource must be of type Microsoft.Network/firewallPolicies" -ForegroundColor Red
        exit(1)
    }

    if ($Policy.Sku.Tier -eq "Premium") {
        Write-Host "Policy is already premium"
        exit(1)
    }
}

function GetPolicyNewName {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Microsoft.Azure.Commands.Network.Models.PSAzureFirewallPolicy]
        $Policy
    )

    if (-not [string]::IsNullOrEmpty($script:PolicyName)) {
        return $script:PolicyName
    }

    return $Policy.Name + "_premium"
}

function TransformPolicyToPremium {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Microsoft.Azure.Commands.Network.Models.PSAzureFirewallPolicy]
        $Policy
    )    
    $NewPolicyParameters = @{
                        Name = (GetPolicyNewName -Policy $Policy) 
                        ResourceGroupName = $Policy.ResourceGroupName 
                        Location = $Policy.Location 
                        ThreatIntelMode = $Policy.ThreatIntelMode 
                        BasePolicy = $Policy.BasePolicy 
                        DnsSetting = $Policy.DnsSettings 
                        Tag = $Policy.Tag 
                        SkuTier = "Premium" 
    }

    Write-Host "Creating new policy"
    $premiumPolicy = New-AzFirewallPolicy @NewPolicyParameters

    Write-Host "Populating rules in new policy"
    foreach ($ruleCollectionGroup in $Policy.RuleCollectionGroups) {
        $ruleResource = Get-AzResource -ResourceId $ruleCollectionGroup.Id
        $ruleToTransfom = Get-AzFirewallPolicyRuleCollectionGroup -AzureFirewallPolicy $Policy -Name $ruleResource.Name
        $ruleCollectionGroup = @{
            FirewallPolicyObject = $premiumPolicy
            Priority = $ruleToTransfom.Properties.Priority
            Name = $ruleToTransfom.Name
        }

        if ($ruleToTransfom.Properties.RuleCollection.Count) {
            $ruleCollectionGroup["RuleCollection"] = $ruleToTransfom.Properties.RuleCollection
        }

        Set-AzFirewallPolicyRuleCollectionGroup @ruleCollectionGroup
    }
}

function ValidateAzNetworkModuleExists {
    Write-Host "Validating needed module exists"
    $networkModule = Get-InstalledModule -Name "Az.Network" -ErrorAction SilentlyContinue
    if (($null -eq $networkModule) -or ($networkModule.Version -lt 4.5)){
        Write-Host "Please install Az.Network module version 4.5.0 or higher, see instructions: https://github.com/Azure/azure-powershell#installation"
        exit(1)
    }
    Import-Module Az.Network -MinimumVersion 4.5.0
}

ValidateAzNetworkModuleExists
$policy = Get-AzFirewallPolicy -ResourceId $script:PolicyId
ValidatePolicy -Policy $policy
TransformPolicyToPremium -Policy $policy
```

## Migrate an existing standard firewall using the Azure portal

This example shows how to use the Azure portal to migrate a standard firewall (classic rules) to Azure Firewall Premium with a Premium policy.

1. From the Azure portal, select your standard firewall. On the **Overview** page, select **Migrate to firewall policy**.

   :::image type="content" source="media/premium-migrate/firewall-overview-migrate.png" alt-text="Migrate to firewall policy":::

1. On the **Migrate to firewall policy** page, select **Review + create**.
1. Select **Create**.

   The deployment takes a few minutes to complete.
1. Use the `Transform-Policy.ps1` [Azure PowerShell script](#migrate-an-existing-policy-using-azure-powershell) to transform this new standard policy into a Premium policy.
1. On the portal, select your standard firewall resource. 
1. Under **Automation**, select **Export template**. Keep this browser tab open. You'll come back to it later.
   > [!TIP]
   > To ensure you don't lose the template, download and save it in case your browser tab gets closed or refreshed.
1. Open a new browser tab, navigate to the Azure portal, and open the resource group that contains your firewall.
1. Delete the existing standard firewall instance.

   This takes a few minutes to complete.

1. Return to the browser tab with the exported template.
1. Select **Deploy**, then on the **Custom deployment** page select **Edit template**.
1. Edit the template text:
   
   1. Under the `Microsoft.Network/azureFirewalls` resource, under `Properties`, `sku`, change the `tier` from "Standard" to "Premium".
   1. Under the template `Parameters`, change `defaultValue` for the `firewallPolicies_FirewallPolicy_,<your policy name>_externalid` from:
      
       `"/subscriptions/<subscription id>/resourceGroups/<your resource group>/providers/Microsoft.Network/firewallPolicies/FirewallPolicy_<your policy name>"`

      to:

      `"/subscriptions/<subscription id>/resourceGroups/<your resource group>/providers/Microsoft.Network/firewallPolicies/FirewallPolicy_<your policy name>_premium"`
1. Select **Save**.
1. Select **Review + Create**.
1. Select **Create**.

When the deployment completes, you can now configure all the new Azure Firewall Premium features.

## Next steps

- [Learn more about Azure Firewall Premium features](premium-features.md)
