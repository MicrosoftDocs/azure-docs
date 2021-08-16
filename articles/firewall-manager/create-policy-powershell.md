---
title: 'Quickstart: Create and update an Azure Firewall policy using Azure PowerShell'
description: In this quickstart, you learn how create and update an Azure Firewall policy using Azure PowerShell.
services: firewall-manager
author: vaboya
ms.author: victorh
ms.date: 08/16/2021
ms.topic: quickstart
ms.service: firewall-manager
---

# Quickstart: Create and update an Azure Firewall policy using Azure PowerShell

In this quickstart, you use Azure PowerShell to create an Azure Firewall policy with network and application rules. You also update the existing policy by adding network and application rules.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Set up the network

First, create a resource group and a Virtual Network and then configure Azure Firewall policy

## Create a Resource Group

The resource group contains all the resources used in this procedure.

```azurepowershell
New-AzResourceGroup -Name Test-FWpolicy-RG -Location "East US"
```

## Create the virtual network

```azurepowershell
$ServerSubnet = New-AzVirtualNetworkSubnetConfig -Name subnet-1 -AddressPrefix 10.0.0.0/24
$testVnet = New-AzVirtualNetwork -Name Test-FWPolicy-VNET -ResourceGroupName Test-FWPolicy-RG -Location "East US" -AddressPrefix 10.0.0.0/8 -Subnet $ServerSubnet
```
## Create the Firewall Policy

```azurepowershell
New-AzFirewallPolicy -Name EUS-Policy -ResourceGroupName Test-FWPolicy-RG -Location "EAST US"
```

## Create Azure Firewall Policy Network Rule collection and add new rules

First, you create the Rule Collection Group, then add the rule collection with the rules.

### Create the Firewall Policy Network Rule Collection group

```azurepowershell
$firewallpolicy = Get-AzFirewallPolicy -Name EUS-Policy -ResourceGroupName Test-FWPolicy-RG
$newnetworkrulecollectiongroup = New-AzFirewallPolicyRuleCollectionGroup  -Name "NetworkRuleCollectionGroup" -Priority 200 -ResourceGroupName Test-FWPolicy-RG -FirewallPolicyName EUS-Policy
$networkrulecollectiongroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "NetworkRuleCollectionGroup" -ResourceGroupName Test-FWPolicy-RG -AzureFirewallPolicyName EUS-Policy
```
### Create the Azure firewall Policy Network Rule collection with new rules

Before creating Rule collection, create network rules and store them in variables.

### Create a new Azure Firewall Policy Network Rule

```azurepowershell
$networkrule1= New-AzFirewallPolicyNetworkRule -Name NwRule1 -Description testRule1  -SourceAddress 10.0.0.0/24 -Protocol TCP -DestinationAddress 192.168.0.1/32 -DestinationPort 22 
$networkrule2= New-AzFirewallPolicyNetworkRule -Name NWRule2 -Description TestRule2  -SourceAddress 10.0.0.0/24 -Protocol UDP -DestinationAddress 192.168.0.10/32 -DestinationPort 1434
```
### Create Network Rule collection and add new rules

```azurepowershell
$newrulecollectionconfig=New-AzFirewallPolicyFilterRuleCollection -Name myfirstrulecollection -Priority 1000 -Rule $networkrule1,$networkrule2 -ActionType Allow
$newrulecollection = $networkrulecollectiongroup.Properties.RuleCollection.Add($newrulecollectionconfig)
```
### Update Network Rule collection Group

```azurepowershell
Set-AzFirewallPolicyRuleCollectionGroup -Name "NetworkRuleCollectionGroup" -Priority "200" -FirewallPolicyObject $firewallpolicy -RuleCollection $networkrulecollectiongroup.Properties.RuleCollection
```
### Output

View the new Rule Collection and its rules:

```azurepowershell
$output = $networkrulecollectiongroup.Properties.GetRuleCollectionByName("myfirstrulecollection")
Write-Output  $output
```

## Create an Azure Firewall Policy Network Rules in existing Rule collection

Now that you have an existing Rule Collection, you can add more rules to it.

### Get existing Network Rule Group collection

```azurepowershell
$firewallpolicy = Get-AzFirewallPolicy -Name EUS-Policy -ResourceGroupName Test-FWPolicy-RG
$networkrulecollectiongroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "NetworkRuleCollectionGroup" -ResourceGroupName Test-FWPolicy-RG -AzureFirewallPolicyName EUS-Policy 
```
### Create new network rules

```azurepowershell
$newnetworkrule1 = New-AzFirewallPolicyNetworkRule -Name newNwRule01 -Description testRule01  -SourceAddress 10.0.0.0/24 -Protocol TCP -DestinationAddress 192.168.0.5/32 -DestinationPort 3389
$newnetworkrule2 = New-AzFirewallPolicyNetworkRule -Name newNWRule02 -Description TestRule02  -SourceAddress 10.0.0.0/24 -Protocol UDP -DestinationAddress 192.168.0.15/32 -DestinationPort 1434
```
### Update the Network Rule collection and add new rules

```azurepowershell
$getexistingrullecollection = $networkrulecollectiongroup.Properties.RuleCollection | where {$_.Name -match "myfirstrulecollection"}
$getexistingrullecollection.RuleS.Add($newnetworkrule1)
$getexistingrullecollection.RuleS.Add($newnetworkrule2)
```
### Update network rule collection group

```azurepowershell
Set-AzFirewallPolicyRuleCollectionGroup -Name "NetworkRuleCollectionGroup" -FirewallPolicyObject $firewallpolicy -Priority 200 -RuleCollection $networkrulecollectiongroup.Properties.RuleCollection
```
### Output

View the rules that you just added:

```azurepowershell
$output = $networkrulecollectiongroup.Properties.GetRuleCollectionByName("myfirstrulecollection")
Write-output $output
```
## Create an Azure Firewall Policy Application Rule collection and add new rules

First, create the Rule Collection Group, then add the rule collection with the rules.

### Create Firewall Policy Application Rule Collection group

```azurepowershell
$firewallpolicy = Get-AzFirewallPolicy -Name EUS-Policy -ResourceGroupName Test-FWPolicy-RG
$newapprulecollectiongroup = New-AzFirewallPolicyRuleCollectionGroup  -Name "ApplicationRuleCollectionGroup" -Priority 300 -ResourceGroupName Test-FWPolicy-RG -FirewallPolicyName EUS-Policy
```
### Create new Application Rules

```azurepowershell
$apprule1 = New-AzFirewallPolicyApplicationRule -Name apprule1 -Description testapprule1 -SourceAddress 192.168.0.1/32 -TargetFqdn "*.contoso.com" -Protocol HTTPS
$apprule2 = New-AzFirewallPolicyApplicationRule -Name apprule2 -Description testapprule2  -SourceAddress 192.168.0.10/32 -TargetFqdn "www.contosoweb.com" -Protocol HTTPS
```
### Create new Application rule collection with new rules

```azurepowershell
$apprulecollectiongroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "ApplicationRuleCollectionGroup" -ResourceGroupName Test-FWPolicy-RG -AzureFirewallPolicyName EUS-Policy
$apprulecollection = New-AzFirewallPolicyFilterRuleCollection -Name myapprulecollection -Priority 1000 -Rule $apprule1,$apprule2 -ActionType Allow 
$newapprulecollection = $apprulecollectiongroup.Properties.RuleCollection.Add($apprulecollection) 
```

### Update the application Rule Collection Group

```azurepowershell
Set-AzFirewallPolicyRuleCollectionGroup -Name "ApplicationRuleCollectionGroup" -FirewallPolicyObject $firewallpolicy -Priority 300 -RuleCollection $apprulecollectiongroup.Properties.RuleCollection 
```

### Output

Examine the new Rule Collection group and its new rules:

```azurepowershell
$output = $apprulecollectiongroup.Properties.GetRuleCollectionByName("myapprulecollection")
Write-Output $output
```

## Create an Azure Firewall Policy Application Rule in an existing rule collection

Now that you have an existing Rule Collection, you can add more rules to it.

```azurepowershell 
#Create new Application Rules for exist Rule collection
$newapprule1 = New-AzFirewallPolicyApplicationRule -Name newapprule01 -Description testapprule01 -SourceAddress 192.168.0.5/32 -TargetFqdn "*.contosoabc.com" -Protocol HTTPS
$newapprule2 = New-AzFirewallPolicyApplicationRule -Name newapprule02 -Description testapprule02  -SourceAddress 192.168.0.15/32 -TargetFqdn "www.contosowebabcd.com" -Protocol HTTPS
```

### Update Application Rule collection

```azurepowershell
$apprulecollection = $apprulecollectiongroup.Properties.RuleCollection | where {$_.Name -match "myapprulecollection"}
$apprulecollection.Rules.Add($newapprule1)
$apprulecollection.Rules.Add($newapprule2)

# Update Application Rule collection Group  
Set-AzFirewallPolicyRuleCollectionGroup -Name "ApplicationRuleCollectionGroup" -FirewallPolicyObject $firewallpolicy -Priority 300 -RuleCollection $apprulecollectiongroup.Properties.RuleCollection
```
### Output

View the new rules:

```azurepowershell
$Output = $apprulecollectiongroup.Properties.GetRuleCollectionByName("myapprulecollection")
Write-Output $output
```

## Clean up resources

When you no longer need the resources that you created, delete the resource group. This removes the all the created resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell
Remove-AzResourceGroup -Name Test-FWpolicy-RG
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Firewall Manager deployment](deployment-overview.md)